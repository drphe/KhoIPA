import { base64Convert } from "../modules/constants.js";
import {isValidHTTPURL, open, setTintColor, showUIAlert, 
insertSpaceInSnakeString, insertSpaceInCamelString, formatString, json, formatVersionDate} from "../modules/utilities.js";
import { AppPermissionItem } from "./AppPermissionItem.js";
import UIAlert from "../vendor/uialert.js/uialert.js";
import { MoreButton } from "../components/MoreButton.js";
import { AppHeader, AppLoading } from "../components/AppHeader.js";
import { VersionHistoryItem } from "../components/VersionHistoryItem.js";

const loaded = () => {
    //console.log('✅ All images settled or 3000ms timeout reached.');
};

function waitForAllImagesToLoad(container) {
    const allImages = container.querySelectorAll("img.screenshot");
    if (allImages.length === 0) return loaded();
    const imagePromises = Array.from(allImages).map(image => new Promise(resolve => {
        const handleSettled = () => {
            image.onload = null;
            image.onerror = null;
            resolve();
        };
        if (image.complete && image.naturalHeight !== 0) return resolve();
        image.onload = handleSettled;
        image.onerror = () => {
            if (image.id === "app-icon") {
                image.src = altSourceIcon;
            } else {
                image.remove();
            }
            handleSettled();
        };
        if (!image.src) image.src = image.src;
    }));
    Promise.race([
        Promise.allSettled(imagePromises),
        new Promise(resolve => setTimeout(resolve, 3000))
    ]).finally(loaded);
}

function updateBundleID(newBundleID) {
    const url = new URL(window.location.href);
    url.searchParams.set('bundleID', newBundleID);
    history.replaceState({}, '', url);
}

export function activateNavLink(e){
        document.querySelectorAll(".nav-link").forEach(l => {
            if (l.dataset.target == e) l.classList.add("active");
            else l.classList.remove("active");
        });
        window.oldTargetPage = e;
    };

export const openPanel = async (jsons, bundleId, dir = '.', direction = "", ID = "modal-popup", dataset="list") => {
    const knownPrivacyPermissions = await json(dir + "/common/assets/json/privacy.json");
    const knownEntitlements = await json(dir + "/common/assets/json/entitlements.json");
    const legacyPermissions = await json(dir + "/common/assets/json/legacy-permissions.json");
    let altSourceIcon = "https://drphe.github.io/KhoIPA/common/assets/img/generic_app.jpeg";

let bottomPanel = document.querySelector(`#${ID}`);
if (bottomPanel) {
  bottomPanel.innerHTML = "";
  bottomPanel.classList.remove("show");
} else {
  // nếu chưa có thì tạo mới
  bottomPanel = document.createElement("div");
  bottomPanel.id = ID;
}
bottomPanel.setAttribute("data-type", dataset);
document.body.append(bottomPanel);

    if (direction == "bottom") {
        bottomPanel.classList.add("panel", "bottom");
        const app = jsons.apps?.find(app => app.bundleIdentifier == bundleId) ?? undefined;
        if (!app) {
            showUIAlert("❌ Error", "Không tìm thấy thông tin app!");
            return;
        }
        updateBundleID(bundleId);
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
            handler: () => open(`esign://install?url=${app.downloadURL}`)
        });
        if (!window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone !== true) {
            installAppAlert.addAction({
                title: "Download IPA",
                style: 'default',
                handler: () => window.open(app.downloadURL, "_blank")
            });
        }
        installAppAlert.addAction({
            title: "Copy Link",
            style: 'default',
            handler: () => copyText(app.downloadURL)
        });
        installAppAlert.addAction({
            title: "Cancel",
            style: 'cancel',
        });
        async function copyText(text) {
            try {
                await navigator.clipboard.writeText(text);
                showUIAlert("✅ Success", "Đã sao chép vào clipboard! Dán link vào safari hoặc Esign => Tải xuống => URL => OK");
            } catch (err) {
                showUIAlert("❌ Error", "Không thể sao chép link tải IPA!");
            }
        }
        bottomPanel.innerHTML = `
<div id="panel-header">
    <!-- Navigation bar -->
    <div id="nav-bar">
      <div id="back-container">
        <button id="back" type="button">
          <i class="bi bi-chevron-down"></i>
          Close
        </button>
      </div>
      <div id="title" class="hidden">
        <img id="app-icon" src="${altSourceIcon}" onerror="this.onerror=null; this.src='${altSourceIcon}';" alt="generic-app-icon">
        <p></p>
      </div>
      <a href="#" class="install hidden">
        <button class="uibutton">Get</button>
      </a>
    </div>
  </div>
  <div id ="panel-body" class="panel-content">
    <!-- Content -->
    <div class="item">
      <div class="app-header">
        <div class="content">
          <img id="app-icon" src="${altSourceIcon}" onerror="this.onerror=null; this.src='${altSourceIcon}';" alt="generic-app-icon">
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
        <a id="version-history" style="color: var(--tint-color);" href="#versions">All Versions</a>
      </div>
      <div class="header">
        <p id="version">Version 2.0</p>
        <p id="version-date">Apr 10, 2023</p>
      </div>
      <p id="version-description"></p>
      <div id="versions"></div>
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
        // 
        // Navigation bar
        const navigationBar = bottomPanel.querySelector("#nav-bar");
        // Title
        navigationBar.querySelector("#title>p").innerHTML = app.name + (app.beta ? ` <span class="small beta badge"></span>` : ``);
        // App icon
        navigationBar.querySelector("#title>img").src = app.iconURL;
        // 
        // App header
        const appHeader = bottomPanel.querySelector("#panel-body .app-header");
        // Icon
        appHeader.querySelector("img").src = app.iconURL;
        // App name
        appHeader.querySelector(".title").innerHTML = app.name + (app.beta ? ` <span class="small beta badge"></span>` : ``);
        // Developer name
        appHeader.querySelector(".subtitle").textContent = app.developerName;
        // 
        // Preview
        const preview = bottomPanel.querySelector("#preview");
        // Subtitle
        preview.querySelector("#subtitle").textContent = app.subtitle;
        // Screenshots
        // New
        const checkArray = (obj) => {
            return Array.isArray(obj) && obj.length > 0
        }; // screenshots:[]
        const checkIphoneScreenShots = (obj) => {
            return typeof obj === 'object' && obj !== null && Array.isArray(obj.iphone) && obj.iphone.length > 0
        }; //
        if (checkArray(app.screenshots)) {
            app.screenshots.forEach((screenshot, i) => {
                if (screenshot.imageURL) preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
                    <img src="${screenshot.imageURL}" data-fslightbox="gallery" alt="${app.name} screenshot ${i + 1}" class="screenshot">
                `);
                else if (isValidHTTPURL(screenshot)) preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
	     <a href="${url}" data-fslightbox="gallery">
                <img src="${url}" alt="${app.name} screenshot ${i + 1}" class="screenshot">
	     </a>
                `);
            });
        } else if (checkIphoneScreenShots(app.screenshots)) {
            app.screenshots.iphone.forEach((screenshot, i) => {
                if (isValidHTTPURL(screenshot)) preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
	     <a href="${url}" data-fslightbox="gallery">
                <img src="${url}" alt="${app.name} screenshot ${i + 1}" class="screenshot">
	     </a>
                `);
            });
        } else if (app.screenshotURLs) {
            // Legacy
            app.screenshotURLs.forEach((url, i) => {
                preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
	     <a href="${url}" data-fslightbox="gallery">
                <img src="${url}" alt="${app.name} screenshot ${i + 1}" class="screenshot">
	     </a>
            `);
            });
        }
        // Description
        const previewDescription = preview.querySelector("#description");
        previewDescription.innerHTML = formatString(app.localizedDescription);
        if (previewDescription.scrollHeight > previewDescription.clientHeight) previewDescription.insertAdjacentHTML("beforeend", MoreButton(tintColor));
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
        if (versionDescriptionElement.scrollHeight > versionDescriptionElement.clientHeight) versionDescriptionElement.insertAdjacentHTML("beforeend", MoreButton(tintColor));
        // Version history
        let isAllVersion = false;
        bottomPanel.querySelector("#version-history").addEventListener("click", (event) => {
            //event.preventDefault();
            const versionsContainer = bottomPanel.querySelector("#versions");
            if (app.versions && !isAllVersion) {
                app.versions.slice(1).forEach((version, i) => {
                    versionsContainer.insertAdjacentHTML("beforeend", VersionHistoryItem(jsons.name, version.version, formatVersionDate(version.date), formatString(version.localizedDescription), version.downloadURL, i + 1));
                });
                isAllVersion = true;
            }
            versionsContainer.querySelectorAll(".version-description").forEach(element => {
                if (element.scrollHeight > element.clientHeight) element.insertAdjacentHTML("beforeend", MoreButton(tintColor));
            });
        });
        // 
        // Permissions
        const appPermissions = app.appPermissions;
        const privacyContainer = bottomPanel.querySelector("#privacy");
        const entitlementsContainer = bottomPanel.querySelector("#entitlements");
        // 
        // Privacy
        if (appPermissions?.privacy && Object.keys(appPermissions.privacy).length !== 0 || app.permissions) {
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
            if (app.patreon?.hidden) continue;
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
        sourceContainer.href = `${dir}/view/?source=${base64Convert(jsons.sourceURL)}`;
        sourceSubtitle.innerText = `Last updated: ${formatVersionDate(lastUpdated)}`;
        sourceAppCount.innerText = appCount + (appCount === 1 ? " app" : " apps");
        // Hide/show navigation bar title & install button
        let isNavigationBarItemsVisible = false;
        bottomPanel.querySelector("#panel-body").onscroll = function(e) {
            const appName = bottomPanel.querySelector(".app-header .text>.title");
            const title = bottomPanel.querySelector("#title");
            const button = bottomPanel.querySelector("#nav-bar .install");
            if (!isNavigationBarItemsVisible && appName.getBoundingClientRect().y < 100) {
                title.classList.remove("hidden");
                button.classList.remove("hidden");
                button.disabled = false;
                isNavigationBarItemsVisible = true;
            } else if (isNavigationBarItemsVisible && appName.getBoundingClientRect().y >= 100) { // Main app name is visible
                // Hide navigation bar title & install button
                title.classList.add("hidden");
                button.classList.add("hidden");
                button.disabled = true;
                isNavigationBarItemsVisible = false;
            }
        }
        // listen install button
        bottomPanel.querySelectorAll("a.install").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                installAppAlert.present();
            });
        });
        // scroll down to close
        let startY;
        let currentY;
        let isDragging = false;
        bottomPanel.addEventListener("touchstart", e => {
            startY = e.touches[0].clientY;
            isDragging = true;
            bottomPanel.style.transition = "none";
        });
        bottomPanel.addEventListener("touchmove", e => {
            if (!isDragging) return;
            currentY = e.touches[0].clientY;
            let deltaY = currentY - startY;
            const scrollable = bottomPanel.querySelector('.panel-content');
            if (scrollable && scrollable.scrollTop > 0) {
                isDragging = false;
                return;
            }
            if (deltaY > 0) {
                bottomPanel.style.transform = `translateY(${deltaY}px)`;
            }
        });
        bottomPanel.addEventListener("touchend", e => {
            if (!isDragging) return;
            isDragging = false;
            let endY = e.changedTouches[0].clientY;
            let deltaY = endY - startY;
            bottomPanel.style.transition = "transform 0.4s ease";
            if (deltaY > 150) {
                bottomPanel.style.transform = `translateY(100%)`;
                setTimeout(() => {
                    bottomPanel.style.transform = "";
		    closePanel();
                }, 100);
            } else {
                bottomPanel.style.transform = "";
            }
        });
    } else if (direction == "side") {
        bottomPanel.classList.add("panel", direction);
        bottomPanel.innerHTML = `
<div id="panel-header">
    <!-- Navigation bar -->
    <div id="nav-bar">
      <div id="back-container">
        <button id="back" type="button">
          <i class="bi bi bi-chevron-left"></i>
          Back
        </button>
      </div>
      <div id="title" class="">
        ${bundleId}
      </div>
      <a href="#" class="install"></a>
    </div>
  </div>
  <div id="panel-body" class="panel-content news-content" style="padding-bottom: 7rem;">
     ${jsons}
  </div>
`;
        let startX;
        let currentX;
        let isDragging = false;
        const dragThreshold = 50; // Ngưỡng kéo 50px
        bottomPanel.addEventListener("touchstart", e => {
            startX = e.touches[0].clientX;
            isDragging = true;
            bottomPanel.style.transition = "none"; // Tắt hiệu ứng khi kéo
        });
        bottomPanel.addEventListener("touchmove", e => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            let deltaX = currentX - startX;
            // 1. Chỉ cho phép kéo sang phải (deltaX > 0)
            if (deltaX > 0) {
                // 2. Kiểm tra ngưỡng kéo
                if (deltaX > dragThreshold) {
                    let translateX = deltaX - dragThreshold;
                    bottomPanel.style.transform = `translateX(${translateX}px)`;
                } else {
                    bottomPanel.style.transform = `translateX(0px)`;
                }
            }
        });
        bottomPanel.addEventListener("touchend", e => {
            isDragging = false;
            let endX = e.changedTouches[0].clientX;
            // Tính deltaX cuối cùng, bao gồm cả phần kéo dưới ngưỡng
            let deltaX = endX - startX;
            bottomPanel.style.transition = "transform 0.3s ease";
            // So sánh deltaX với ngưỡng trượt cuối (100px)
            if (deltaX > 100) {
                // Trượt đi
                bottomPanel.style.transform = `translateX(100%)`;
                setTimeout(() => {
                    bottomPanel.style.transform = "";
		    closePanel();
                }, 100);
            } else {
                bottomPanel.style.transform = "";
            }
        });
    } else {
        console.log("Preload Panel.")
        return;
    }

    function closePanel() {
        bottomPanel.classList.remove("show");
        const remainingOpenPanels = document.querySelectorAll(".panel.show");
        if (bottomPanel.id === 'apps-popup-all' || bottomPanel.id === 'popup-all-news') {
            remainingOpenPanels.forEach(panel => panel.classList.remove("show"));
            document.body.classList.remove('no-scroll');
	    activateNavLink("page-home");
  	    document.querySelectorAll('div[data-type="news"]').forEach(div =>div.remove());
        } else if (remainingOpenPanels.length === 0) {
            activateNavLink("page-home");
            document.body.classList.remove('no-scroll');
        }
    }
    // show popup
    setTimeout(() => bottomPanel.classList.add("show"), 50); // show when everything ready
    document.body.classList.add('no-scroll');
    waitForAllImagesToLoad(bottomPanel);
    refreshFsLightbox();
    // control popup
    const closeBottom = bottomPanel.querySelector("#back-container");
    closeBottom.addEventListener("click", closePanel);
    document.addEventListener("click", ({
        target
    }) => { // logic đóng panel
        const uialert = document.querySelector("#uialert-container");
        const fslight = document.querySelector(".fslightbox-container");
        const navglass = document.querySelector(".bottom-nav-glass");
        const panels = document.querySelectorAll(".panel");
        const isInsidePanel = [...panels].some(panel => panel.contains(target));
        const isOutsideBottomPanel = !bottomPanel.contains(target);
        const isOutsideUIAlert = !uialert?.contains(target);
        const isOutsideFsLight = !fslight?.contains(target);
        const isOutsideNav = !navglass?.contains(target);
        if (isOutsideBottomPanel && !isInsidePanel && isOutsideUIAlert && isOutsideFsLight && isOutsideNav) {
            closePanel();
        }
    });
}
export async function addAppList(source, appsPerLoad = 6, isScreenshot = true, scrollTarget) {
    const appsContainer = document.getElementById('apps-list');
    if (!appsContainer) return;
    const allApps = source.apps;
    let filteredApps = [...allApps];
    let currentIndex = 0;
    // Tạo wrapper chứa input và icon
    const searchWrapper = document.createElement("div");
    searchWrapper.style.cssText = "z-index: 200;align-items: center;justify-content: center;gap: 0.85rem;position: sticky;top:0;padding:0 1rem;"
    searchWrapper.classList.add("search-wrapper")
    // Tạo icon kính lúp
    const searchIcon = document.createElement("span");
    searchIcon.innerHTML = ` <i class="bi bi-search"></i>`
    searchIcon.style.cssText = "position: absolute;left: 1.7rem;top: 47%;transform: translateY(-50%);cursor: pointer;color: rgb(136, 136, 136);z-index:2;";
    // Tạo ô tìm kiếm
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.placeholder = "Enter app name...";
    searchBox.className = "form-control mb-3";
    searchBox.style.cssText = "width: 100%; padding-left: 35px; box-sizing: border-box; border-radius: 20px;backdrop-filter: blur(4px); "
    // Tạo icon x
    const xIcon = document.createElement("span");
    xIcon.innerHTML = ` <span class="totalSearch"></span><i class="bi bi-x-circle-fill"></i>`;
    xIcon.style.cssText = "display:block;position: absolute;right: 0.7rem;top: 45%;transform: translateY(-50%);cursor: pointer;color: rgb(136, 136, 136);scale: 0.7;";
    // Tạo total app
    const totalAppsCount = xIcon.querySelector(".totalSearch");
    totalAppsCount.innerText = `Total ${allApps.length} apps `;
    // tạo filter
    const filter = document.createElement("span");
    filter.innerHTML = ` <a class="category active">All</a><a class="category ">Apps</a><a class="category ">Games</a><a class="category ">Audio</a><a class="category ">Tool</a><a class="category">Dylib</a>`;
    filter.style.cssText = "display: flex;justify-content: space-evenly;";
    let filterType = 0;
    xIcon.addEventListener('click', () => {
        searchBox.value = '';
        xIcon.style.display = 'none';
        searchBox.focus();
        filteredApps = [...allApps];
        appsContainer.innerHTML = "";
        totalAppsCount.innerText = `Total ${allApps.length} apps `;
        loadMoreApps();
        appsContainer.classList.remove("skeleton-text", "skeleton-effect-wave");
        window.scrollTo({
            top: Math.max(0, appsContainer.parentElement.offsetTop - 100),
            behavior: "smooth"
        });
    });
    searchBox.addEventListener('input', () => {
        xIcon.style.display = searchBox.value ? 'block' : 'none';
        appsContainer.innerHTML = "";
        filteredApps = [];
        run();
    });
    searchBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const keyword = searchBox.value.toLowerCase();
            filteredApps = allApps.filter(app => app.name?.toLowerCase().includes(keyword));
            let dataApps = filterType ? filteredApps.filter(app => app.type === filterType) : filteredApps;
            totalAppsCount.innerText = `Found ${dataApps.length} apps `;
            currentIndex = 0;
            setTimeout(() => {
                appsContainer.innerHTML = "";
                loadMoreApps();
                appsContainer.classList.remove("skeleton-text", "skeleton-effect-wave");
                window.scrollTo({
                    top: Math.max(0, appsContainer.parentElement.offsetTop - 100),
                    behavior: "smooth"
                });
            }, 300);
        }
    });
    filter.querySelectorAll('.category').forEach((el, index) => {
        el.addEventListener('click', () => {
            filter.querySelectorAll('.category').forEach(item => item.classList.remove('active'));
            el.classList.add('active');
            filterType = index;
            let dataApps = filterType ? filteredApps.filter(app => app.type === filterType) : filteredApps;
            totalAppsCount.innerText = `Found ${dataApps.length} apps `;
            currentIndex = 0;
            appsContainer.innerHTML = "";
            loadMoreApps();
        });
    });
    // Gắn các phần tử
    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(searchBox);
    searchWrapper.appendChild(xIcon);
    searchWrapper.appendChild(filter);
    appsContainer.before(searchWrapper);
    async function run() {
        appsContainer.innerHTML = "";
        appsContainer.classList.add("skeleton-text", "skeleton-effect-wave");
        const tasks = [];
        for (let i = 0; i < 10; i++) {
            tasks.push(AppLoading());
        }
        await Promise.all(tasks); // Chờ tất cả hoàn tất
    }
    //with screenshot
    function loadMoreApps() {
        let dataApps = filterType ? filteredApps.filter(app => app.type === filterType) : filteredApps;
        if (!dataApps.length) {
            appsContainer.classList.remove("skeleton-text", "skeleton-effect-wave");
            appsContainer.innerHTML = `
    <div class="app-container" style="grid-column: 1 / -1;grid-row: 1 / -1;height: 100%;max-width: none !important; ">
      <div class="app-header-container" style="max-width:730px;">
        <a href="#" class="nothing">
          <div class="app-header-inner-container">
            <div class="app-header">
              <div class="content" style="height: 30px;margin: auto;display: flex;justify-content: space-around;"><p>ⓧ Nothing found!</p></div>
              <div class="background" style="background-color: var(--color-bg-dark-secondary);"></div>
            </div>
          </div>
        </a>
      </div>
    </div>`;
            return;
        }
        const nextApps = dataApps.slice(currentIndex, currentIndex + appsPerLoad);
        const checkArray = (obj) => {
            return Array.isArray(obj) && obj.length > 0
        }; // screenshots:[]
        const checkIphoneScreenShots = (obj) => {
            return typeof obj === 'object' && obj !== null && Array.isArray(obj.iphone) && obj.iphone.length > 0
        }; //
        nextApps.forEach(app => {
            let html = `
            <div class="app-container">
                ${AppHeader(app, ".")}
                <p class="subtitle sub-version">${app.version ? `Version ${app.version} • ` : ""}${app.developerName ?? "Unknown"}</p>
                <p style="text-align: center; font-size: 0.9em;">${app.subtitle ?? ""}</p>`;
            if (checkArray(app.screenshots) && isScreenshot) {
                html += `<div class="screenshots">`;
                for (let i = 0; i < app.screenshots.length && i < 2; i++) {
                    const screenshot = app.screenshots[i];
                    if (!screenshot) continue;
                    if (screenshot.imageURL) html += `<img src="${screenshot.imageURL}" class="screenshot">`;
                    else if (isValidHTTPURL(screenshot)) html += `<img src="${screenshot}" class="screenshot">`;
                }
                html += `</div>`;
            } else if (checkIphoneScreenShots(app.screenshots) && isScreenshot) {
                html += `<div class="screenshots">`;
                for (let i = 0; i < app.screenshots.iphone.length && i < 2; i++) {
                    const screenshot = app.screenshots.iphone[i];
                    if (!screenshot) continue;
                    if (screenshot) html += `<img src="${screenshot}" class="screenshot">`;
                    else if (isValidHTTPURL(screenshot)) html += `<img src="${screenshot}" class="screenshot">`;
                }
                html += `</div>`;
            } else if (app.screenshotURLs && isScreenshot) {
                html += `<div class="screenshots">`;
                for (let i = 0; i < app.screenshotURLs.length && i < 2; i++) {
                    if (app.screenshotURLs[i]) html += `<img src="${app.screenshotURLs[i]}" class="screenshot">`;
                }
                html += `</div>`;
            }
            html += `</div>`;
            appsContainer.insertAdjacentHTML("beforeend", html);
        });
        currentIndex += appsPerLoad;
        waitForAllImagesToLoad(appsContainer);
    }
    loadMoreApps();
    appsContainer.addEventListener("click", event => {
        const nothing = event.target.closest("a.nothing");
        if (nothing) {
            event.stopPropagation();
            filteredApps = allApps
            totalAppsCount.innerText = `Total ${filteredApps.length} apps `;
            searchBox.value = '';
            currentIndex = 0;
            filterType = 0;
            appsContainer.innerHTML = "";
            filter.querySelectorAll('.category').forEach(item => item.classList.remove('active'));
            loadMoreApps();
            window.scrollTo({
                top: Math.max(0, appsContainer.parentElement.offsetTop - 100),
                behavior: "smooth"
            });
        }
    });
    // scroll
    const scrollToTop = (target) => {
        if (target === window) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            target.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    const scrollThreshold = 150;
    scrollTarget ??= appsContainer.parentElement;
    const buttonScroll = document.createElement('button');
    buttonScroll.id = 'scrollToTopBtn';
    buttonScroll.title = 'Scroll To Top';
    const iconBtn = document.createElement('i');
    iconBtn.className = 'bi bi-chevron-up';
    buttonScroll.appendChild(iconBtn);
    buttonScroll.onclick = () => scrollToTop(scrollTarget);
    appsContainer.before(buttonScroll);
    buttonScroll.style.cssText = `
        position: fixed;
        bottom: 6rem;
        left: 50%;
        z-index: 99;
        border: none;
        outline: none;
        background-color: transparent;
        color: var(--uialert-text-color);
        cursor: pointer;
        border-radius: 25%;
        font-size: 18px;
        display: none;
        scale:1.25;
        transition: background-color 0.3s;
    `;
    buttonScroll.onmouseover = () => {
        buttonScroll.style.backgroundColor = 'var(--uialert-background-color)';
    };
    buttonScroll.onmouseout = () => {
        buttonScroll.style.backgroundColor = 'transparent';
    };
    scrollTarget.addEventListener('scroll', () => {
        const scrollTop = scrollTarget === window ? document.documentElement.scrollTop || document.body.scrollTop : scrollTarget.scrollTop;
        const scrollHeight = scrollTarget === window ? document.documentElement.scrollHeight || document.body.scrollHeight : scrollTarget.scrollHeight;
        const clientHeight = scrollTarget === window ? document.documentElement.clientHeight || window.innerHeight : scrollTarget.clientHeight;
        buttonScroll.style.display = scrollTop > scrollThreshold ? 'block' : 'none';
        if (scrollTop + clientHeight >= scrollHeight - 50) loadMoreApps();
    });
}

export function wrapLightbox(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || '';
    const anchor = document.createElement('a');
    anchor.setAttribute('href', src);
    anchor.setAttribute('data-fslightbox', 'gallery');
    //img.classList.add('screenshot');
    img.replaceWith(anchor);
    anchor.appendChild(img);
  });
  return doc.body.innerHTML;
}

