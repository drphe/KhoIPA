
import { base64Convert } from "../modules/constants.js";
import {isValidHTTPURL, open, setTintColor, showAddToAltStoreAlert, showUIAlert, insertSpaceInSnakeString, insertSpaceInCamelString, formatString, json, formatVersionDate} from "../modules/utilities.js";
import { AppPermissionItem } from "./AppPermissionItem.js";
import UIAlert from "../vendor/uialert.js/uialert.js";


export const openPanel = async (jsons, bundleId, ID = "modal-popup", dir = '.') => {
  const knownPrivacyPermissions = await json(dir + "/common/assets/json/privacy.json");
  const knownEntitlements = await json(dir + "/common/assets/json/entitlements.json");
  const legacyPermissions = await json(dir + "/common/assets/json/legacy-permissions.json");

  const app = jsons.apps?.find(app => app.bundleIdentifier == bundleId) ?? undefined;
  console.log(app, jsons, bundleId)
  if (!app) {
    showUIAlert("❌ Error", "Không tìm thấy thông tin app!");
    return;
  }
  // If has multiple versions, show the latest one
  if (app.versions) {
    const latestVersion = app.versions[0];
    app.version = latestVersion.version;
    app.versionDate = latestVersion.date;
    app.versionDescription = latestVersion.localizedDescription;
    app.downloadURL = latestVersion.downloadURL;
    app.size = latestVersion.size;
  }
  const tintColor = app.tintColor ? app.tintColor.replaceAll("#", "") : "var(--tint-color);";
  // Set tint color
  if (tintColor) setTintColor(tintColor);
  // Set up install buttons
  const installAppAlert = new UIAlert({
    title: `Get "${app.name}"`
  });
  installAppAlert.addAction({
    title: "Install via Esign",
    style: 'default',
    handler: () => showAddToAltStoreAlert(jsons.name, "Install App", () => open(`esign://install?url=${app.downloadURL}`))
  });
  installAppAlert.addAction({
    title: "Copy Link",
    style: 'default',
    handler: () => showAddToAltStoreAlert(jsons.name, "Copy Link", () => copyText(app.downloadURL))
  });
  installAppAlert.addAction({
    title: "Download IPA",
    style: 'default',
    handler: () => showAddToAltStoreAlert(jsons.name, "Download IPA", () => window.open(app.downloadURL, "_blank"))
  });
  installAppAlert.addAction({
    title: "Cancel",
    style: 'cancel',
  });
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showUIAlert("✅ Success", "Đã sao chép vào clipboard!");
    } catch (err) {
      showUIAlert("❌ Error", "Không thể sao chép link tải IPA!");
    }
  }
  // check popup is exsit
  const oldPopup = document.querySelector(`#${ID}`);
  if (oldPopup) oldPopup.remove();

  let altSourceIcon = "https://drphe.github.io/KhoIPA/common/assets/img/generic_app.jpeg";
  const bottomPanel = document.createElement("div");
  bottomPanel.id = ID;
  bottomPanel.classList.add("panel", "bottom");
  bottomPanel.innerHTML = `
<div id="top">
    <!-- Navigation bar -->
    <div id="nav-bar">
      <div id="back-container">
        <button id="back" type="button">
          <i class="bi bi-chevron-left"></i>
          Back
        </button>
      </div>
      <div id="title" class="hidden">
        <img id="app-icon" src="${altSourceIcon}" alt="generic-app-icon">
        <p>DolphiniOS (Public Beta)</p>
      </div>
      <a href="#" class="install hidden">
        <button class="uibutton">Get</button>
      </a>
    </div>
  </div>
  <div id = "main" class="panel-content">
    <!-- Content -->
    <div class="item">
      <div class="app-header">
        <div class="content">
          <img id="app-icon" src="${altSourceIcon}" alt="generic-app-icon">
          <div class="right">
            <div class="text">
              <p class="title">Esign</p>
              <p class="subtitle">drphe</p>
            </div>
            <div class="ipa">
              <a class="install">
                <button class="uibutton">Get</button>
              </a>
            </div>
          </div>
        </div>
        <div class="background"></div>
      </div>
    </div>
    <div id="preview" class="section">
      <p id="subtitle"></p>
      <div class="header">
        <h2>Preview</h2>
      </div>
      <div id="screenshots"></div>
      <p id="description"></p>
    </div>
    <div id="whats-new" class="section">
      <div class="header">
        <h2>What's New</h2>
        <p id="version-size"></p>
        <a id="version-history" style="color: var(--tint-color);" href="http://">Version History</a>
      </div>
      <div class="header">
        <p id="version">Version 2.0</p>
        <p id="version-date">Apr 10, 2023</p>
      </div>
      <p id="version-description"></p>
    </div>
    <div id="permissions" class="section">
      <div class="header">
        <h2>App Permissions</h2>
      </div>
      <div id="permission-containers">
        <div id="privacy" class="permission-container secondary-bg">
          <div class="permission-container-header">
            <i class="permission-icon bi-person-fill-dash"></i>
            <p><b>Unknown</b></p>
            <p class="description">The developer has not specified any permissions for this app.</p>
          </div>
          <div class="permission-items">
          </div>
        </div>
        <div id="entitlements" class="permission-container secondary-bg">
          <div class="permission-container-header">
            <i class="permission-icon bi-key-fill"></i>
            <p><b>Entitlements</b></p>
            <p class="description">Entitlements are additional permissions that grant access to certain system services, including potentially sensitive information.</p>
          </div>
          <div class="permission-items">
          </div>
        </div>
      </div>
    </div>
    <div id="source" class="section">
      <div class="header">
        <h2>Discover More On</h2>
      </div>
      <div class="source-container">
        <a href="${dir}/view/" class="source-link">
          <div class="source">
          <img src="${altSourceIcon}" onerror="this.onerror=null; this.src='${altSourceIcon}';" alt="source-icon">
          <div class="right">
              <div class="text">
              <p class="title">Source</p>
              <p class="subtitle">Last updated: unknown</p>
              </div>
              <div class="app-count">
                  0
              </div>
          </div>
          </div>
        </a>
      </div>
    </div>
  </div>
  </div>
`;
  // add popup
  document.body.append(bottomPanel);
  // 
  // Navigation bar
  const navigationBar = bottomPanel.querySelector("#nav-bar");
  // Title
  navigationBar.querySelector("#title>p").textContent = app.name;
  // App icon
  navigationBar.querySelector("#title>img").src = app.iconURL;
  // 
  // App header
  const appHeader = bottomPanel.querySelector("#main .app-header");
  // Icon
  appHeader.querySelector("img").src = app.iconURL;
  // App name
  appHeader.querySelector(".title").textContent = app.name;
  // Developer name
  appHeader.querySelector(".subtitle").textContent = app.developerName;
  const more = `
    <a id="more" onclick="revealTruncatedText(this);">
        <button>more</button>
    </a>`;
  window.revealTruncatedText = moreButton => {
    const textId = moreButton.parentNode.id;
    const text = bottomPanel.querySelector(`#${textId}`);
    text.style.display = "block";
    text.style.overflow = "auto";
    text.style.webkitLineClamp = "none";
    text.style.lineClamp = "none";
    text.removeChild(moreButton)
  }
  // 
  // Preview
  const preview = bottomPanel.querySelector("#preview");
  // Subtitle
  preview.querySelector("#subtitle").textContent = app.subtitle;
  // Screenshots
  // New
  if (app.screenshots) {
    app.screenshots.forEach((screenshot, i) => {
      if (screenshot.imageURL) preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
                    <img src="${screenshot.imageURL}" alt="${app.name} screenshot ${i + 1}" class="screenshot">
                `);
      else if (isValidHTTPURL(screenshot)) preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
                    <img src="${screenshot}" alt="${app.name} screenshot ${i + 1}" class="screenshot">
                `);
    });
  } else if (app.screenshotURLs) {
    // Legacy
    app.screenshotURLs.forEach((url, i) => {
      preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
                <img src="${url}" alt="${app.name} screenshot ${i + 1}" class="screenshot">
            `);
    });
  }
  // Description
  const previewDescription = preview.querySelector("#description");
  previewDescription.innerHTML = formatString(app.localizedDescription);
  if (previewDescription.scrollHeight > previewDescription.clientHeight) previewDescription.insertAdjacentHTML("beforeend", more);
  if (!app.screenshots && !app.screenshotURLs && !app.localizedDescription) preview.remove();
  // 
  // Version info
  const versionDateElement = bottomPanel.querySelector("#version-date");
  const versionNumberElement = bottomPanel.querySelector("#version");
  const versionSizeElement = bottomPanel.querySelector("#version-size");
  const versionDescriptionElement = bottomPanel.querySelector("#version-description");
  // Version date
  versionDateElement.textContent = formatVersionDate(app.versionDate);
  // Version number
  versionNumberElement.textContent = `Version ${app.version}`;
  // Version size
  const units = ["B", "KB", "MB", "GB"];
  var appSize = app.size,
    i = 0;
  while (appSize > 1024) {
    i++;
    appSize = parseFloat(appSize / 1024).toFixed(1);
  }
  versionSizeElement.textContent = appSize ? `${appSize} ${units[i]}` : "";
  // Version description
  versionDescriptionElement.innerHTML = app.versionDescription ? formatString(app.versionDescription) : "";
  if (versionDescriptionElement.scrollHeight > versionDescriptionElement.clientHeight) versionDescriptionElement.insertAdjacentHTML("beforeend", more);
  // Version history
  document.querySelector("#version-history").href = `./version-history/?source=${base64Convert(jsons.sourceURL)}&id=${app.bundleIdentifier}`;
  // 
  // Permissions
  const appPermissions = app.appPermissions;
  const privacyContainer = bottomPanel.querySelector("#privacy");
  const entitlementsContainer = bottomPanel.querySelector("#entitlements");
  // 
  // Privacy
  if (appPermissions?.privacy || app.permissions) {
    function updatePrivacyContainerHeader() {
      privacyContainer.querySelector(".permission-icon").classList = "permission-icon bi-person-fill-lock";
      privacyContainer.querySelector("b").innerText = "Privacy";
      privacyContainer.querySelector(".description").innerText = `"${app.name}" may request to access the following:`;
    }
    //
    // New (appPermissions.privacy)
    if (appPermissions?.privacy) {
      if (Array.isArray(appPermissions.privacy)) {
        if (appPermissions.privacy.length) {
          for (const obj of appPermissions.privacy) {
            const id = `${obj.name}${Math.random()}`;
            const permission = knownPrivacyPermissions[`NS${obj.name}UsageDescription`];
            const permissionName = permission?.name ?? insertSpaceInCamelString(obj.name);
            let icon;
            if (permission?.icon) icon = permission.icon;
            else icon = "gear-wide-connected";
            privacyContainer.querySelector(".permission-items").insertAdjacentHTML("beforeend", AppPermissionItem(id, permissionName, icon));
            document.getElementById(id).addEventListener("click", () => showUIAlert(permissionName, obj.usageDescription));
          }
          updatePrivacyContainerHeader();
        }
      } else {
        for (const prop in appPermissions.privacy) {
          const id = `${prop}${Math.random()}`;
          const permission = knownPrivacyPermissions[prop];
          const permissionName = permission?.name ?? insertSpaceInCamelString(prop.split("NS")[1].split("UsageDescription")[0]);
          const permissionIcon = permission?.icon ?? "gear-wide-connected";
          privacyContainer.querySelector(".permission-items").insertAdjacentHTML("beforeend", AppPermissionItem(id, permissionName, permissionIcon));
          document.getElementById(id).addEventListener("click", () => showUIAlert(permissionName, appPermissions.privacy[prop]));
        }
        updatePrivacyContainerHeader();
      }
    }
    //
    // Legacy (app.permissions)
    else {
      for (const obj of app.permissions) {
        const id = `${obj.type}${Math.random()}`;
        const permission = legacyPermissions[obj.type];
        const permissionName = insertSpaceInSnakeString(obj.type);
        const permissionIcon = permission?.icon ?? "gear-wide-connected";
        privacyContainer.querySelector(".permission-items").insertAdjacentHTML("beforeend", AppPermissionItem(id, permissionName, permissionIcon));
        document.getElementById(id).addEventListener("click", () => showUIAlert(permissionName, obj.usageDescription));
      }
      updatePrivacyContainerHeader();
    }
  }
  //
  // Entitlements
  if (appPermissions?.entitlements?.length) {
    for (const obj of appPermissions.entitlements) {
      const id = `${obj.name ?? obj}${Math.random()}`;
      const permission = knownEntitlements[obj.name ?? obj]; // Old: obj.name; new: obj
      const permissionName = permission?.name ?? insertSpaceInSnakeString(obj.name ?? obj);
      const permissionIcon = permission?.icon ?? "gear-wide-connected";
      entitlementsContainer.querySelector(".permission-items").insertAdjacentHTML("beforeend", AppPermissionItem(id, permissionName, permissionIcon));
      document.getElementById(id).addEventListener("click", () => showUIAlert(permissionName, permission?.description ?? "altsource-viewer does not have detailed information about this entitlement."));
    }
  } else {
    entitlementsContainer.remove();
  }
  // Source info
  const source = bottomPanel.querySelector("#source");
  const sourceA = source.querySelector("a");
  const sourceContainer = source.querySelector(".source");
  const sourceIcon = source.querySelector("img");
  const sourceTitle = source.querySelector(".title");
  const sourceSubtitle = source.querySelector(".subtitle");
  const sourceAppCount = source.querySelector(".app-count");
  let lastUpdated = new Date("1970-01-01");
  let appCount = 0;
  let altSourceTintColor = "var(--tint-color);";
  for (const app of jsons.apps) {
    if (app.beta || app.patreon?.hidden) continue;
    let appVersionDate = new Date(app.versions ? app.versions[0].date : app.versionDate);
    if (appVersionDate > lastUpdated) {
      lastUpdated = appVersionDate;
      altSourceIcon = app.iconURL;
      if (app.tintColor) altSourceTintColor = app.tintColor;
    }
    appCount++;
  }
  sourceA.href = `${dir}/view/?source=${base64Convert(jsons.sourceURL)}`;
  sourceContainer.style.backgroundColor = `#${(jsons.tintColor ?? altSourceTintColor).replaceAll("#", "")}`;
  sourceIcon.src = jsons.iconURL ?? altSourceIcon;
  sourceTitle.innerText = jsons.name;
  sourceContainer.href = `${dir}/?source=${base64Convert(jsons.sourceURL)}`;
  sourceSubtitle.innerText = `Last updated: ${formatVersionDate(lastUpdated)}`;
  sourceAppCount.innerText = appCount + (appCount === 1 ? " app" : " apps");



  bottomPanel.classList.add("show"); // show when everything ready

  // control
  const closeBottom = bottomPanel.getElementById("back-container");
  closeBottom.addEventListener("click", () => {
    bottomPanel.classList.remove("show");
  });
  let startY;
  bottomPanel.addEventListener("touchstart", e => {
    startY = e.touches[0].clientY;
  });
  bottomPanel.addEventListener("touchend", e => {
    let endY = e.changedTouches[0].clientY;
    if (endY - startY > 50) { // vuốt xuống
      bottomPanel.classList.remove("show");
    }
  });
  bottomPanel.querySelectorAll("a.install").forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      installAppAlert.present();
    });
  });
  // tự động hiện nút tải khi cuộn
  // Hide/show navigation bar title & install button
  let isNavigationBarItemsVisible = false;
  window.onscroll = function(e) {
    const appName = bottomPanel.querySelector(".app-header .text>.title");
    const title = bottomPanel.getElementById("title");
    const button = bottomPanel.querySelector("#nav-bar .install");
    if (!isNavigationBarItemsVisible && appName.getBoundingClientRect().y < 100) {
      title.classList.remove("hidden");
      button.classList.remove("hidden");
      button.disaled = false;
      isNavigationBarItemsVisible = true;
    } else if (isNavigationBarItemsVisible && appName.getBoundingClientRect().y >= 100) { // Main app name is visible
      // Hide navigation bar title & install button
      title.classList.add("hidden");
      button.classList.add("hidden");
      button.disaled = true;
      isNavigationBarItemsVisible = false;
    }
  }
}
