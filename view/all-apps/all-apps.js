import { insertNavigationBar, isValidHTTPURL } from "../../common/modules/utilities.js";
import { AppHeader } from "../../common/components/AppHeader.js";
import { main } from "../../common/modules/main.js";

insertNavigationBar("All Apps");

main((json) => {
    document.title = `Apps - ${json.name}`;

    const apps = json.apps.filter(app => !app.beta); // Bỏ qua beta apps
    const appsPerPage = 10;// số app trên 1 trang
    const totalPages = Math.ceil(apps.length / appsPerPage);
    const appsContainer = document.getElementById("apps");

    // Tạo thanh phân trang
    const pagination = document.createElement("div");
    pagination.id = "pagination";
    pagination.style.textAlign = "center";
    pagination.style.marginBottom = "20px";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.style.margin = "0 5px";
        btn.onclick = () => renderPage(i);
        pagination.appendChild(btn);
    }

    appsContainer.before(pagination);

    function renderPage(pageNumber) {
        appsContainer.innerHTML = ""; // Xóa nội dung cũ
        const startIndex = (pageNumber - 1) * appsPerPage;
        const endIndex = startIndex + appsPerPage;
        const pageApps = apps.slice(startIndex, endIndex);

        pageApps.forEach(app => {
            let html = `
            <div class="app-container">
                ${AppHeader(app, "..")}
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
    }

    renderPage(1); // Hiển thị trang đầu tiên khi load
});
