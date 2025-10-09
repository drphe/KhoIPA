import { insertNavigationBar, isValidHTTPURL } from "../../common/modules/utilities.js";
import { AppHeader } from "../../common/components/AppHeader.js";
import { main } from "../../common/modules/main.js";

insertNavigationBar("All Apps");

main((json) => {
    document.title = `Apps - ${json.name}`;

    const allApps = json.apps.filter(app => !app.beta);
    let filteredApps = [...allApps];
    let currentIndex = 0;
    const appsPerLoad = 20;
    const appsContainer = document.getElementById("apps");

// Tạo wrapper chứa icon và input
const searchWrapper = document.createElement("div");
searchWrapper.style.display = "flex";
searchWrapper.style.flexDirection = "column";
searchWrapper.style.alignItems = "flex-start";
searchWrapper.style.maxWidth = "400px";
searchWrapper.style.margin = "10px 20px";

// Tạo icon kính lúp phía trên
const searchIcon = document.createElement("span");
searchIcon.textContent = "🔍"; // hoặc dùng Font Awesome
searchIcon.style.fontSize = "20px";
searchIcon.style.marginBottom = "5px";
searchIcon.style.color = "#555";

// Tạo ô tìm kiếm
const searchBox = document.createElement("input");
searchBox.type = "text";
searchBox.placeholder = "Tìm theo tên app...";
searchBox.className = "form-control mb-3";
searchBox.style.width = "100%";
searchBox.style.borderRadius = "20px";

// Gắn các phần tử
searchWrapper.appendChild(searchIcon);   // icon nằm trên
searchWrapper.appendChild(searchBox);    // input nằm dưới
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
