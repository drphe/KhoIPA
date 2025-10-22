import { sourceURL, base64Convert } from "../common/modules/constants.js";
import { formatString, open, setUpBackButton , json , isValidHTTPURL } from "../common/modules/utilities.js";
import { NewsItem } from "../common/components/NewsItem.js";
import { AppHeader } from "../common/components/AppHeader.js";
import { main } from "../common/modules/main.js";

const editorsources = await json("../common/assets/json/editorsources.json");

main(json => {
    document.getElementById("edit").addEventListener("click", e => {
        e.preventDefault();
	if(editorsources.includes(sourceURL)) open(`../repo.html?source=${sourceURL}`);
    });

    document.getElementById("add")?.addEventListener("click", e => {
        if (confirm(`Add "${json.name}" to Altstore?`))
            open(`altstore://source?url=${sourceURL}`);
    });

    // Set "View All News" link
    document.querySelector("#news a").href = `./news/?source=${base64Convert(sourceURL)}`;
    // Set "View All Apps" link
    //document.querySelector("#apps a").href = `./all-apps/?source=${base64Convert(sourceURL)}`;

    // Set tab title
    document.title = json.name;
    // Set page title
    document.querySelector("h1").innerText = json.name;
    document.querySelector("#nav-bar #title>p").innerText = json.name;

    // 
    // News
    if (json.news && json.news.length >= 1) {
        // Sort news in decending order of date (latest first)
        json.news.sort((a, b) => // If b < a
            (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());

        if (json.news.length == 1) {
            document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[0], true));
            document.getElementById("news-items").classList.add("one");
        } else for (let i = 0; i < 5 && i < json.news.length; i++)
            document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[i], true));
    } else document.getElementById("news").remove();

    // Sort apps in descending order of version date
    // json.apps.sort((a, b) => (new Date(b.versionDate)).valueOf() - (new Date(a.versionDate)).valueOf());

    json.apps.sort((a, b) => {
      const dateA = new Date(a.versionDate ?? a.versions?.[0]?.date ?? 0).valueOf();
      const dateB = new Date(b.versionDate ?? b.versions?.[0]?.date ?? 0).valueOf();
      return dateB - dateA;
    });

    // 
    // Featured apps
    if (json.featuredApps) {
        json.apps
            .filter(app => json.featuredApps.includes(app.bundleIdentifier))
            .forEach(app => document.getElementById("featured").insertAdjacentHTML("beforeend", AppHeader(app)));
    } else {
        let count = 1;
        json.apps.forEach(app => {
            // Max: 5 featured apps if not specified
            if (count > 5) return;
    
            // Ignore beta apps
            if (app.beta) return;
    
            document.getElementById("featured").insertAdjacentHTML("beforeend", AppHeader(app));
    
            count++;
        });
    }


  const allApps = json.apps.filter(app => !app.beta);
  let filteredApps = [...allApps];
  let currentIndex = 0;
  const appsPerLoad = 4;
      const appsTitle = document.getElementById('apps-title');
      const appsContainer = document.getElementById('apps-list');
      const featured = document.getElementById('featured');

  // Tạo wrapper chứa input và icon
  const searchWrapper = document.createElement("div");
  searchWrapper.style.position = "sticky";
  searchWrapper.style.top = "125px";
  searchWrapper.style.maxWidth = "400px";
  searchWrapper.style.margin = "10px 20px";
  searchWrapper.style.display = "none";
  searchWrapper.style.zIndex = "10000";

  // Tạo ô tìm kiếm
  const searchBox = document.createElement("input");
  searchBox.type = "text";
  searchBox.placeholder = "Enter app name...";
  searchBox.className = "form-control mb-3";
  searchBox.style.width = "100%";
  searchBox.style.paddingRight = "35px"; // chừa chỗ cho icon
  searchBox.style.boxSizing = "border-box";
  searchBox.style.borderRadius = "20px"; // 
  searchBox.autocomplete = "off";
searchBox.style.backgroundColor = "var(--color-transparent)";

  // Tạo icon kính lúp
  const searchIcon = document.createElement("span");
  searchIcon.innerHTML = ` <i class="bi bi-search"></i>`
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

    // click button
    document.getElementById('search').addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.innerText == "View All Apps") {
        appsContainer.style.display = 'block';
        featured.style.display = 'none';
        appsTitle.innerHTML = `${allApps.length} Apps`;
        e.target.innerText = "Close";
	searchWrapper.style.display = "block";
      } else {
	searchWrapper.style.display = "none";
        featured.style.display = 'block';
        appsContainer.style.display = 'none';
        appsTitle.innerHTML = "Featured Apps";
        e.target.innerText = "View All Apps";
      }
    });

    function loadMoreApps() {
        const nextApps = filteredApps.slice(currentIndex, currentIndex + appsPerLoad);
        nextApps.forEach(app => {
            let html = `
            <div class="app-container">
                ${AppHeader(app, ".")}
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


    // 
    // About
    var description = formatString(json.description);
    if (description) document.getElementById("about").insertAdjacentHTML("beforeend", `
        <div class="item">
            <p>${description}</p>
        </div>
    `);
    if (json.website) document.getElementById("about").insertAdjacentHTML("beforeend", `
        <div class="item">
            <a href="${json.website}" target="_blank" rel="noopener noreferrer"><i class="bi bi-link-45deg"></i> ${json.website}</a>
        </div>
    `);
    if (!description && !json.website) document.getElementById("about").remove();

    window.onscroll = e => {
        const title = document.querySelector("h1");
        const navBar = document.getElementById("nav-bar");
        const navBarTitle = navBar.querySelector("#title");

        if (title.getBoundingClientRect().y < 85) {
            navBar.classList.remove("hide-border");
            navBarTitle.classList.remove("hidden");
        } else {
            navBar.classList.add("hide-border");
            navBarTitle.classList.add("hidden");
        }
    }
}, "../");