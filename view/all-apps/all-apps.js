import { insertNavigationBar, isValidHTTPURL } from "../../common/modules/utilities.js";
import { AppHeader } from "../../common/components/AppHeader.js";
import { main } from "../../common/modules/main.js";

insertNavigationBar("All Apps");

main((json) => {
    document.title = `Apps - ${json.name}`;

    const apps = json.apps.filter(app => !app.beta);
    const appsPerPage = 10;
    const totalPages = Math.ceil(apps.length / appsPerPage);
    const appsContainer = document.getElementById("apps");

    // Tạo thanh phân trang đơn giản bằng <a>
    function createPagination() {
        const pagination = document.createElement("div");
        pagination.className = "pagination-bar";
        pagination.style.textAlign = "center";
        pagination.style.margin = "20px 0";

        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement("a");
            link.href = "#";
            link.textContent = i;
            link.className = "mx-1 px-2 py-1 border rounded text-decoration-none";
            link.style.color = "#007bff";
            link.onclick = (e) => {
                e.preventDefault();
                renderPage(i);
                highlightActivePage(i);
            };
            pagination.appendChild(link);
        }

        return pagination;
    }

    const paginationTop = createPagination();
    const paginationBottom = createPagination();

    appsContainer.before(paginationTop);
    appsContainer.after(paginationBottom);

    function highlightActivePage(activePage) {
        const allLinks = document.querySelectorAll(".pagination-bar a");
        allLinks.forEach((link, index) => {
            if (parseInt(link.textContent) === activePage) {
                link.style.backgroundColor = "#007bff";
                link.style.color = "#fff";
                link.style.fontWeight = "bold";
                link.style.margin = "4px";
            } else {
                link.style.backgroundColor = "";
                link.style.color = "#007bff";
                link.style.fontWeight = "normal";
                link.style.margin = "4px";
            }
        });
    }

    function renderPage(pageNumber) {
        appsContainer.innerHTML = "";
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

    renderPage(1);
    highlightActivePage(1);
});
