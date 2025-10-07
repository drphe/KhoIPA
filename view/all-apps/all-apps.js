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

    // Tạo thanh phân trang bằng <a>
    const pagination = document.createElement("nav");
    pagination.className = "pagination justify-content-center mb-4";

    const ul = document.createElement("ul");
    ul.className = "pagination";

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = "page-item";

        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = i;
        a.onclick = (e) => {
            e.preventDefault();
            renderPage(i);
            highlightActivePage(i);
        };

        li.appendChild(a);
        ul.appendChild(li);
    }

    pagination.appendChild(ul);
    appsContainer.before(pagination);

    function highlightActivePage(activePage) {
        const links = ul.querySelectorAll(".page-link");
        links.forEach((link, index) => {
            if (index + 1 === activePage) {
                link.classList.add("active", "bg-primary", "text-white");
            } else {
                link.classList.remove("active", "bg-primary", "text-white");
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
