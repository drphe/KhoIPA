import { base64Convert } from "../modules/constants.js";
import {isValidHTTPURL, open, setTintColor, showUIAlert, 
insertSpaceInSnakeString, insertSpaceInCamelString, formatString, json, formatVersionDate, 
copyLinkIPA ,activateNavLink, waitForAllImagesToLoad, findAppByName, translateTo} from "../modules/utilities.js";
import { AppPermissionItem } from "./AppPermissionItem.js";
import UIAlert from "../vendor/uialert.js/uialert.js";
import { MoreButton } from "../components/MoreButton.js";
import { AppHeader, AppSize, AppLoading, checkBeta } from "../components/AppHeader.js";
import { VersionHistoryItem } from "../components/VersionHistoryItem.js";

export const openPanel = async(jsons, bundleId, dir = '.', direction = "", ID = "modal-popup", dataset = "list") => {
    const knownPrivacyPermissions = await json(dir + "/common/assets/json/privacy.json");
    const knownEntitlements = await json(dir + "/common/assets/json/entitlements.json");
    const legacyPermissions = await json(dir + "/common/assets/json/legacy-permissions.json");
    const updateBundleID = (newBundleID) =>{
    	const url = new URL(window.location.href);
	url.searchParams.set('bundleID', newBundleID);
    	history.replaceState({}, '', url);
    }
    let altSourceIcon = dir + "/common/assets/img/generic_app.jpeg";
    let hasScreenshot= true, needPreview = false, tintColor ="000";
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
        //bundleId = bundleId.split("@")[0];
        let app = jsons.apps?.find(app => app.bundleIdentifier == bundleId) ?? undefined;
		updateBundleID(bundleId);
        if(!app) {
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
        tintColor = app.tintColor ? app.tintColor.replaceAll("#", "") : "var(--tint-color);";
        if (tintColor) setTintColor(tintColor);
        const installAppAlert = new UIAlert({
            title: `${langText['get']} "${app.name}"`
        });
        
        installAppAlert.addAction({
            title: langText['installviaesign'],
            style: 'default',
            handler: () => open(`esign://install?url=${app.downloadURL}`)
        });

	 if (!window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone !== true) {
            installAppAlert.addAction({
                title: langText['downloadipa'],
                style: 'default',
                handler: () => window.open(app.downloadURL, "_blank")
            });
        }
        
        installAppAlert.addAction({
            title: langText['copylink'],
            style: 'default',
            handler: () => copyLinkIPA(app.downloadURL)
        });
        installAppAlert.addAction({
            title: langText['cancel'],
            style: 'cancel',
        });
        bottomPanel.innerHTML = `
<div id="panel-header">
    <!-- Navigation bar -->
    <div id="nav-bar">
      <div id="back-container">
        <button id="back" type="button">
          <i class="bi bi-chevron-down"></i>
          ${langText["done"]}
        </button>
      </div>
      <div id="title" class="hidden">
        <img src="${altSourceIcon}" onerror="this.onerror=null; this.src='${altSourceIcon}';" alt="generic-app-icon">
        <p></p>
      </div>
      <a href="#" class="install hidden">
        <button class="uibutton">${langText["get"]}</button>
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
              <p class="subtitle kind">drphe</p>
            </div>
            <div class="ipa">
              <a class="install">
                <button class="uibutton">${langText["get"]}</button>
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
	<a id="more-detail" style="color: var(--tint-color);" target=_blank>
	    <h2>${langText["preview"]}</h2>
	    <i class="bi bi-chevron-right more-detail hidden" ></i>
	</a>
	<button onclick="translateText(event)" id="translateBtn"> 
	    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg><span> ${langCode.toUpperCase()}</span>
	</button>
      </div>
      <div id="screenshots"></div>
      <p id="description" class="skeleton-text skeleton-effect-wave">
	--- --- ------ ---- ---- ----- ----
     ----- ---- ---- ---- ------ ------ ----- ----
    --- ----- --- ----- --- --- -- ----- ---- ----
    --- ---- ---- ---- --------- ---- -- -- ----
    --- ---- ---- --- ------- ------ -----</p>
    </div>
    <div id="whats-new" class="section">
      <div class="header">
        <a id="version-history" style="color: var(--tint-color);" >
		<h2>${langText["whatnew"]}</h2> 
		<i class="bi bi-chevron-right version-history hidden"></i>
	</a>
      </div>
      <div class="header">
        <p id="version">${langText['version']} 2.0</p>
        <p id="version-size"></p>
        <p id="version-date">Apr 10, 2023</p>
      </div>
      <p id="version-description"></p>
      <div id="versions"></div>
    </div>
    <div id="permissions" class="section">
      <div class="header">
        <h2>${langText["apppermit"]}</h2>
      </div>
      <div id="permission-containers">
        <div id="privacy" class="permission-container secondary-bg">
          <div class="permission-container-header">
            <i class="permission-icon bi-person-fill-dash"></i>
            <p><b>${langText["unknown"]}</b></p>
            <p class="description">${langText['notpermit']}</p>
          </div>
          <div class="permission-items">
          </div>
        </div>
        <div id="entitlements" class="permission-container secondary-bg">
          <div class="permission-container-header">
            <i class="permission-icon bi-key-fill"></i>
            <p><b>${langText["entilement"]}</b></p>
            <p class="description">${langText["entilementText"]}</p>
          </div>
          <div class="permission-items">
          </div>
        </div>
      </div>
    </div>
    <div id="source" class="section">
      <div class="header">
	<a id="discovermore" style="color: var(--tint-color);" >
            <h2>${langText["discovermore"]}</h2>
	     <i class="bi bi-chevron-right discovermore hidden"></i>
	</a>
      </div>
      <div class="source-container">
        <a href="${dir}/view/" class="source-link">
          <div class="source">
          <img src="${altSourceIcon}" onerror="this.onerror=null; this.src='${dir}/common/assets/img/no-img.png';" alt="source-icon">
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
        navigationBar.querySelector("#title>p").innerHTML = app.name + (app.beta ? ` <span class="small ${checkBeta(app.beta)} badge"></span>` : ``);
        // App icon
        navigationBar.querySelector("#title>img").src = app.iconURL;
        // 
        // App header
        const appHeader = bottomPanel.querySelector("#panel-body .app-header");
        // Icon
        appHeader.querySelector("img").src = app.iconURL;
        // App name
        appHeader.querySelector(".title").innerHTML = app.name + (app.beta ? ` <span class="small ${checkBeta(app.beta)} badge"></span>` : ``);
        // Developer name
        appHeader.querySelector(".subtitle").textContent = app.developerName;
        // 
        // Subtitle
        const previewSubtitle = preview.querySelector("#subtitle");
        previewSubtitle.textContent = app.subtitle;
        if (previewSubtitle.scrollHeight > previewSubtitle.clientHeight) previewSubtitle.insertAdjacentHTML("beforeend", MoreButton(tintColor));
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
	     <a href="${screenshot}" data-fslightbox="gallery">
                <img src="${screenshot}" alt="${app.name} screenshot ${i + 1}" class="screenshot">
	     </a>
                `);
            });
        } else if (checkIphoneScreenShots(app.screenshots)) {
            app.screenshots.iphone.forEach((url, i) => {
                if (isValidHTTPURL(url)) preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `
	     <a href="${url}" data-fslightbox="gallery">
                <img src="${url}" alt="${app.name} screenshot ${i + 1}" class="screenshot">
	     </a>
                `);
            });
        } else if (app.screenshotURLs && app.screenshotURLs.length > 0) {
            app.screenshotURLs.forEach((url, i) => {
                preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `<a href="${url}" data-fslightbox="gallery">
                <img src="${url}" alt="${app.name} screenshot ${i + 1}" class="screenshot"></a>`);
            });
        }else {
		hasScreenshot=false;
	}
		needPreview = app.versionDescription === app.localizedDescription;
		
        // Description
        const previewDescription = preview.querySelector("#description");
        //previewDescription.innerHTML = formatString(app.localizedDescription);
    	window.textDescription = app.localizedDescription;
        //if (previewDescription.scrollHeight > previewDescription.clientHeight) previewDescription.insertAdjacentHTML("beforeend", MoreButton(tintColor));
        //if (!app.screenshots && !app.screenshotURLs && !app.localizedDescription) preview.remove();
        // 
        // Version info
        const versionDateElement = bottomPanel.querySelector("#version-date");
        const versionNumberElement = bottomPanel.querySelector("#version");
        const versionSizeElement = bottomPanel.querySelector("#version-size");
        const versionDescriptionElement = bottomPanel.querySelector("#version-description");
        // Version date
        versionDateElement.textContent = formatVersionDate(app.versionDate);
        // Version number
        versionNumberElement.textContent = `${langText["version"]} ${app.version}`;
        // Version size
        app.versions.length >1 && bottomPanel.querySelector(".version-history").classList.remove("hidden");
        versionSizeElement.textContent = AppSize(app);
        // Version description
        versionDescriptionElement.innerHTML = app.versionDescription ? formatString(app.versionDescription) : "";
        if (versionDescriptionElement.scrollHeight > versionDescriptionElement.clientHeight) versionDescriptionElement.insertAdjacentHTML("beforeend", MoreButton(tintColor));
        // Version history
        bottomPanel.querySelector("#version-history").addEventListener("click", async (event) => {
            if (app.versions?.length>1) {
		await openPanel('<div id="versions-history-list"></div>', `<p>${langText['allversion']}</p>`, '.', "side", "versions-popup-all");
            	const versionsContainer = document.querySelector("#versions-history-list");
                app.versions.forEach((version, i) => {
                    versionsContainer.insertAdjacentHTML("beforeend", VersionHistoryItem(jsons.name, version.version, formatVersionDate(version.date), formatString(version.localizedDescription), version.downloadURL, i + 1));
                });
            	versionsContainer.querySelectorAll(".version-description").forEach(element => {
                	if (element.scrollHeight > element.clientHeight) element.insertAdjacentHTML("beforeend", MoreButton(tintColor));
            	});
            }
        });
        // Discorver more
	const moreApps =findAppByName(window.allApps, app.name.split(" ")[0]);
	moreApps.length >1 && bottomPanel.querySelector(".discovermore").classList.remove("hidden");

        bottomPanel.querySelector("#discovermore").addEventListener("click", async (event) => {
		if(moreApps.length <2 ) return;
        	await openPanel('<div id="more-apps-list"></div>', `<p>${langText['discovermore']} (${moreApps.length-1})</p>`, '.', "side", "more-apps-popup");
		moreApps.forEach(ap => {
			if(ap.bundleIdentifier !== app.bundleIdentifier) document.getElementById("more-apps-list").insertAdjacentHTML("beforeend", AppHeader(ap));
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
                privacyContainer.querySelector("b").innerText = langText['privacy'];
                privacyContainer.querySelector(".description").innerText = `"${app.name}" ${langText['privacyText']}:`;
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
        const sourceA = source.querySelector("a.source-link");
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
        sourceSubtitle.innerText = `${langText['lastupdate']}: ${formatVersionDate(lastUpdated)}`;
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
          ${langText["back"]}
        </button>
      </div>
      <div id="title" class="">
        ${bundleId}
      </div>
      <a href="#" class="install">${langCode !=="vi"&&dataset === "news" ? `<button onclick="translateText(event)" id="translateBtn"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg><span>${langCode.toUpperCase()}</span></button>`:''}</a>
    </div>
  </div>
  <div id="panel-body" class="panel-content news-content" style="padding-bottom: 7rem;">
     ${jsons}
  </div>
`;
        let startX;
        let currentX;
        let isDragging = false;
        const dragThreshold = 50; 
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
    let isOriginalDescription = true;
    let isOriginalNewsContent = true;
    async function getPreview() {
        if (direction !== "bottom")
            return;
        let appInfo = await getAppInfoByBundleId(bundleId.split("@")[0]);
        const preview = bottomPanel.querySelector("#preview");
        const moreDetail = bottomPanel.querySelector("#more-detail");
    	const previewDescription = preview.querySelector("#description");
        const btn = bottomPanel.querySelector('#translateBtn');
        if (appInfo?.trackViewUrl) {
            moreDetail.href = appInfo.trackViewUrl;
	    bottomPanel.querySelector(".more-detail").classList.remove("hidden");
        }
    	if (needPreview &&appInfo?.description){
    		window.textDescription = appInfo.description;
    		if(!appInfo.languageCodesISO2A.includes(langCode.toUpperCase())){
		     const newDecription = await translateTo(appInfo.description);
    		     if(newDecription) {
                    previewDescription.innerHTML = formatString(newDecription);
        		     isOriginalDescription = false;
                }else {
                    previewDescription.innerHTML = formatString(appInfo.description);
                }
      		}else {
    		    previewDescription.innerHTML = formatString(appInfo.description);
    		}
    	}else{
            previewDescription.innerHTML = formatString(textDescription);
        }
    if (previewDescription.scrollHeight > previewDescription.clientHeight) previewDescription.insertAdjacentHTML("beforeend", MoreButton(tintColor));
	previewDescription.classList.remove("skeleton-text", "skeleton-effect-wave");
	btn.innerHTML = `<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg><span> ${isOriginalDescription?langCode.toUpperCase():"EN"}</span>`;
	const kindTitle = bottomPanel.querySelector("#panel-body .app-header .kind")
	if(!kindTitle.textContent && appInfo?.primaryGenreName){
	     kindTitle.textContent = appInfo.primaryGenreName;
	}
	if(hasScreenshot) return;
        if (appInfo?.screenshotUrls?.length > 0) {
            appInfo.screenshotUrls.forEach((url, i) => {
                preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `<a href="${url}" data-fslightbox="gallery">
                <img src="${url}" screenshot ${i + 1}" class="screenshot"></a>`);
            });
        }else if (appInfo?.ipadScreenshotUrls?.length > 0) {
            appInfo.ipadScreenshotUrls.forEach((url, i) => {
                preview.querySelector("#screenshots").insertAdjacentHTML("beforeend", `<a href="${url}" data-fslightbox="gallery">
                <img src="${url}" screenshot ${i + 1}" class="screenshot"></a>`);
            });
        }
    }
    
    window.translateText = async (event)=> {
	event.stopPropagation();
        const btn = bottomPanel.querySelector('#translateBtn');
	btn.innerHTML = `<svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;
	if(dataset !== "news"){
        	const preview = bottomPanel.querySelector("#preview");
		const previewDescription = preview.querySelector("#description");
		const newDecription = isOriginalDescription ? await translateTo(textDescription): textDescription;
		isOriginalDescription = !isOriginalDescription;
        	previewDescription.innerHTML = formatString(newDecription);
		if (previewDescription.scrollHeight > previewDescription.clientHeight) previewDescription.insertAdjacentHTML("beforeend", MoreButton(tintColor)); 
		btn.innerHTML = `<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg><span> ${isOriginalDescription?langCode.toUpperCase():"EN"}</span>`;
	}else {
	        const newsContent = bottomPanel.querySelector("#panel-body");
		newsContent.innerHTML = await isOriginalNewsContent ? await translateTo(jsons): jsons;
		isOriginalNewsContent = !isOriginalNewsContent;
		btn.innerHTML = `<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg><span> ${isOriginalNewsContent?langCode.toUpperCase(): "VI"}</span>`;
	}

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
        } else document.body.classList.add('no-scroll');
    }
    // show popup
   setTimeout(() => bottomPanel.classList.add("show"), 10);//show when everything ready
    waitForAllImagesToLoad(bottomPanel);
    document.body.classList.add('no-scroll');
    await getPreview();
    refreshFsLightbox();
    // control popup
    const closeBottom = bottomPanel.querySelector("#back-container");
    closeBottom.addEventListener("click", closePanel);
    document.addEventListener("click", ({
        target
    }) => { // logic đóng panel
        const uialert = document.querySelector("#uialert-container");
        const trans = document.querySelector("#translateBtn");
        const fslight = document.querySelector(".fslightbox-container");
        const navglass = document.querySelector(".bottom-nav-glass");
        const panels = document.querySelectorAll(".panel");
        const isInsidePanel = [...panels].some(panel => panel.contains(target));
        const isOutsideBottomPanel = !bottomPanel.contains(target);
        const isOutsideUIAlert = !uialert?.contains(target);
        const isOutsideFsLight = !fslight?.contains(target);
        const isOutsideNav = !navglass?.contains(target);
        const isOutsideTrans = !trans?.contains(target);
        if (isOutsideBottomPanel && !isInsidePanel && isOutsideUIAlert && isOutsideFsLight && isOutsideNav && isOutsideTrans) {
            closePanel();
        }
    });
}
export async function addAppList(source, appsPerLoad = 20, filterType=0, scrollTarget) {
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
    searchIcon.style.cssText = "position: absolute;left: 1.7rem;top: 1.7rem;transform: translateY(-50%);cursor: pointer;color: rgb(136, 136, 136);z-index:2;";
    // Tạo ô tìm kiếm
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.placeholder = langText['enterapp'];
    searchBox.className = "form-control mb-3";
    searchBox.style.cssText = "width: 100%; padding-left: 35px; box-sizing: border-box; border-radius: 20px;backdrop-filter: blur(4px); margin-top: 0.5rem;"
    // Tạo icon x
    const xIcon = document.createElement("span");
    xIcon.innerHTML = ` <span class="totalSearch"></span><i class="bi bi-x-circle-fill"></i>`;
    xIcon.style.cssText = "display:block;position: absolute;right: 0.7rem;top: 1.7rem;transform: translateY(-50%);cursor: pointer;color: rgb(136, 136, 136);scale: 0.7;";
    // Tạo total app
    const totalAppsCount = xIcon.querySelector(".totalSearch");
    totalAppsCount.innerText = `${langText['total']} ${allApps.length} apps `;
    // tạo filter
    const filter = document.createElement("span");
    filter.innerHTML = ` <a class="category active">All</a><a class="category ">Apps</a><a class="category ">Games</a><a class="category ">Audio</a><a class="category ">Tool</a><a class="category">Dylib</a>`;
    filter.style.cssText = "display: flex;justify-content: center;";
    filter.querySelectorAll('.category').forEach((el, index) => {
	if(index == filterType) el.classList.add('active');
	else el.classList.remove('active');
    });
    xIcon.addEventListener('click', () => {
        searchBox.value = '';
        xIcon.style.display = 'none';
        searchBox.focus();
        filteredApps = [...allApps];
        appsContainer.innerHTML = "";
        totalAppsCount.innerText = `${langText['total']} ${allApps.length} apps `;
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
            totalAppsCount.innerText = `${langText['found']} ${dataApps.length} apps `;
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
            totalAppsCount.innerText = `${langText['found']} ${dataApps.length} apps `;
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
              <div class="content" style="height: 30px;margin: auto;display: flex;justify-content: space-around;"><p>ⓧ ${langText['nothingfound']}</p></div>
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
        let isScreenshot =false;
        nextApps.forEach(app => {
            let html = `
            <div class="app-container">
                ${AppHeader(app, ".")}
                <p class="list-subtitle">${app.subtitle ?? ""}</p>`;
            if (checkArray(app.screenshots) && isScreenshot) {
                html += `<div class="screenshots">`;
                for (let i = 0; i < app.screenshots.length && i < 2; i++) {
                    const screenshot = app.screenshots[i];
                    if (!screenshot) continue;
                    if (screenshot.imageURL) html += `<img src="${screenshot.imageURL}" class="screenshot ${app.beta === 'xxx' ? 'blur' : ''}">`;
                    else if (isValidHTTPURL(screenshot)) html += `<img src="${screenshot}" class="screenshot ${app.beta === 'xxx' ? 'blur' : ''}">`;
                }
                html += `</div>`;
            } else if (checkIphoneScreenShots(app.screenshots) && isScreenshot) {
                html += `<div class="screenshots">`;
                for (let i = 0; i < app.screenshots.iphone.length && i < 2; i++) {
                    const screenshot = app.screenshots.iphone[i];
                    if (!screenshot) continue;
                    if (screenshot) html += `<img src="${screenshot}" class="screenshot">`;
                    else if (isValidHTTPURL(screenshot)) html += `<img src="${screenshot}" class="screenshot ${app.beta === 'xxx' ? 'blur' : ''}">`;
                }
                html += `</div>`;
            } else if (app.screenshotURLs && isScreenshot) {
                html += `<div class="screenshots">`;
                for (let i = 0; i < app.screenshotURLs.length && i < 2; i++) {
                    if (app.screenshotURLs[i]) html += `<img src="${app.screenshotURLs[i]}" class="screenshot ${app.beta === 'xxx' ? 'blur' : ''}">`;
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
            totalAppsCount.innerText = `${langText['total']} ${filteredApps.length} apps `;
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


async function getAppInfoByBundleId(bundleId, retries = 2) {
    const baseUrl = "https://itunes.apple.com/lookup";
    const url = `${baseUrl}?lang=${langCode}&bundleId=${encodeURIComponent(bundleId)}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
    },
  };
    try {
        const response = await fetch(url,options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
	return (data.resultCount > 0 && data.results.length > 0)? data.results[0] : null ;
    } catch (error) {
        if (retries > 0) {
            return getAppInfoByBundleId(bundleId, langCode, retries - 1);
        }
        console.error(error);
        return null;
    }
}


