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

    // Tạo ô tìm kiếm
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.placeholder = "Tìm theo tiêu đề...";
    searchBox.className = "form-control mb-3";
    searchBox.style.maxWidth = "400px";
    searchBox.style.margin = "20px auto";
    searchBox.style.display = "block";

    appsContainer.before(searchBox);

    searchBox.addEventListener("input", () => {
        const keyword = searchBox.value.toLowerCase();
        filteredApps = allApps.filter(app =>
            app.title?.toLowerCase().includes(keyword)
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
