import { insertNavigationBar, isValidHTTPURL } from "../../common/modules/utilities.js";
import { AppHeader } from "../../common/components/AppHeader.js";
import { main } from "../../common/modules/main.js";

import { sourceURL, base64Convert } from "../../common/modules/constants.js";

const fallbackURL = `../?source=${base64Convert(sourceURL)}`;
document.getElementById("back")?.addEventListener("click", () => open(fallbackURL));

insertNavigationBar("All Apps");

main((json) => {
    document.title = `Apps - ${json.name}`;
    // sắp xếp app
json.apps.sort((a, b) => {
  const dateA = new Date(a.versionDate || a.versions?.[0]?.date || 0).valueOf();
  const dateB = new Date(b.versionDate || b.versions?.[0]?.date || 0).valueOf();
  return dateB - dateA;
});

    const allApps = json.apps.filter(app => !app.beta);
    let filteredApps = [...allApps];
    let currentIndex = 0;
    const appsPerLoad = 4;
    const appsContainer = document.getElementById("apps");

// Tạo wrapper chứa input và icon
const searchWrapper = document.createElement("div");
searchWrapper.style.position = "relative";
searchWrapper.style.maxWidth = "400px";
searchWrapper.style.margin = "10px 20px";

// Tạo ô tìm kiếm
const searchBox = document.createElement("input");
searchBox.type = "text";
searchBox.placeholder = "Tìm theo tên app...";
searchBox.className = "form-control mb-3";
searchBox.style.width = "100%";
searchBox.style.paddingRight = "35px"; // chừa chỗ cho icon
searchBox.style.boxSizing = "border-box";
searchBox.style.borderRadius = "20px"; // 👈 thêm bo góc


// Tạo icon kính lúp
const searchIcon = document.createElement("span");
searchIcon.textContent = "🔍"; // hoặc dùng Font Awesome: <i class="fas fa-search"></i>
searchIcon.style.position = "absolute";
searchIcon.style.right = "10px";
searchIcon.style.top = "50%";
searchIcon.style.transform = "translateY(-50%)";
searchIcon.style.pointerEvents = "none";
searchIcon.style.color = "#888";

// Gắn các phần tử
searchWrapper.appendChild(searchBox);
searchWrapper.appendChild(searchIcon);
appsContainer.before(searchWrapper);

    searchBox.addEventListener("input", () => {
        const keyword = searchBox.value.toLowerCase();
        filteredApps = allApps.filter(app =>
            app.name?.toLowerCase().includes(keyword)
        );
        currentIndex = 0;
        appsContainer.innerHTML = "";
        loadMoreApps();
    });

    function loadMoreApps() {
        const nextApps = filteredApps.slice(currentIndex, currentIndex + appsPerLoad);
        nextApps.forEach(app => {
            let html = `
            <div class="app-container">
                ${AppHeader(app, "..")}
                <p class="subtitle">${app.version ? `Version ${app.version} • ` : ""}${app.developerName ?? ""}</p>
                <p style="text-align: center; font-size: 0.9em;">${app.subtitle ?? ""}</p>`;

            if (app.screenshots) {
                html += `<div class="screenshots">`;
                for (let i = 0; i < app.screenshots.length && i < 2; i++) {
                    const screenshot = app.screenshots[i];
                    if (!screenshot) continue;
                    if (screenshot.imageURL) html += `<img src="${screenshot.imageURL}" class="screenshot">`;
                    else if (isValidHTTPURL(screenshot)) html += `<img src="${screenshot}" class="screenshot">`;
                }
                html += `</div>`;
            } else if (app.screenshotURLs) {
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
    }

    // Tải thêm khi cuộn gần cuối
    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadMoreApps();
        }
    });

    loadMoreApps(); // Tải lần đầu
});
