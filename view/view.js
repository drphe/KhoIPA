import { sourceURL} from "../common/modules/constants.js";
import { formatString, open, setUpBackButton , json , isValidHTTPURL } from "../common/modules/utilities.js";
import { NewsItem } from "../common/components/NewsItem.js";
import { AppHeader, AppLoading } from "../common/components/AppHeader.js";
import { main } from "../common/modules/main.js";
import { openPanel } from "../common/components/Panel.js";

const editorsources = await json("../common/assets/json/editorsources.json");

main(json => {
    document.getElementById("edit").addEventListener("click", e => {
        e.preventDefault();
        if (editorsources.includes(sourceURL)) open(`../repo.html?source=${sourceURL}`);
    });

    document.getElementById("add")?.addEventListener("click", e => {
        if (confirm(`Add "${json.name}" to Altstore?`))
            open(`altstore://source?url=${sourceURL}`);
    });

    // Set "View All News" link
    document.getElementById('all-news').addEventListener("click", (e) => {
        e.preventDefault();
        executeNews("", true);
     });

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
        } else
            for (let i = 0; i < json.news.length; i++){
		if (!json.news[i].notify) continue;
                document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[i], true));
	    }
    } else document.getElementById("news").remove();

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
    searchWrapper.style.cssText = "display: none;z-index: 200;align-items: center;justify-content: center;gap: 0.85rem;position: sticky;top: 6.5rem;margin-bottom: 1rem;padding:0 1rem;"

    // Tạo icon kính lúp
    const searchIcon = document.createElement("span");
    searchIcon.innerHTML = ` <i class="bi bi-search"></i>`
    searchIcon.style.cssText = "position: absolute;left: 1.7rem;top: 63%;transform: translateY(-50%);cursor: pointer;color: rgb(136, 136, 136);";

    // Tạo ô tìm kiếm
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.placeholder = "Enter app name...";
    searchBox.className = "form-control mb-3";
    searchBox.style.cssText = "width: 100%; padding-left: 35px; box-sizing: border-box; border-radius: 20px; "

    // Tạo icon x
    const xIcon = document.createElement("span");
    xIcon.innerHTML = ` <i class="bi bi-x-circle-fill"></i>`
    xIcon.style.cssText = "display:none;position: absolute;right: 1.7rem;top: 58%;transform: translateY(-50%);cursor: pointer;color: rgb(136, 136, 136);scale: 0.7;";

    // Gắn các phần tử
    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(searchBox);
    searchWrapper.appendChild(xIcon);
    appsContainer.before(searchWrapper);

xIcon.addEventListener('click', () => {
    searchBox.value = '';
    xIcon.style.display = 'none';
    searchBox.focus();
    filteredApps = [...allApps];
    appsContainer.innerHTML = "";
    loadMoreApps();
    appsContainer.classList.remove("skeleton-text", "skeleton-effect-wave");
  });

searchBox.addEventListener('input', () => {
    xIcon.style.display = searchBox.value ? 'block' : 'none';
    run();
  });

    searchBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const keyword = searchBox.value.toLowerCase();
            filteredApps = allApps.filter(app => app.name?.toLowerCase().includes(keyword));
            if (filteredApps.length === 0) {
                filteredApps = [...allApps];
            }

            // Nếu có kết quả
            currentIndex = 0;
            setTimeout(() => {
                appsContainer.innerHTML = "";
                loadMoreApps();
                appsContainer.classList.remove("skeleton-text", "skeleton-effect-wave");
		const topMain = document.getElementById("news");
		window.scrollTo({
  			top: topMain.offsetTop,
  			behavior: "smooth"
		});
            }, 500);
        }

    });

    // click button views all apps
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


    async function run() {
        appsContainer.innerHTML = "";
        appsContainer.classList.add("skeleton-text", "skeleton-effect-wave");
        const tasks = [];
        for (let i = 0; i < 5; i++) {
            tasks.push(AppLoading());
        }
        await Promise.all(tasks); // Chờ tất cả hoàn tất
    }

    //with screenshot
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

    document.getElementById("featured").querySelectorAll("a.app-header-link").forEach(button => {
        button.addEventListener("click", executePanel);
    });

// read news
function executeNews(url, isAll = false, id='news-popup'){
    if(isAll){
	const html = `<div id="news" class="section">${json.news.map(news =>NewsItem(news, false)).join('')}</div>`;	
	openPanel(html, '<p>ALL NEWS</p>', '..', "side", id);
    }else {
    if(!url) return;
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("Fetch failed");
        return response.text();
      })
      .then(markdown => {
        const html =`<div id="news" class="section news-item-content">${marked.parse(markdown)}</div>`;	
        openPanel(html, '<p>CONTENTS</p>', '..', "side", id);
      })
      .catch(error => {
        console.error("Lỗi khi tải nội dung:", error);
      });
}
}

    document.addEventListener("click", executePanel);

    function executePanel(e){
        const targetLinks = e.target.closest("a.app-header-link");
        const targetNews = e.target.closest("a.news-item-header");
        const targetNewsLink = e.target.closest("a.news-item-link");
        if (targetLinks){
        	e.preventDefault();
        	const bundleId = targetLinks.getAttribute("data-bundleid");
        	openPanel(json, bundleId, '..');
	}
        if (targetNewsLink){
        	e.preventDefault();
           	const url = targetNews.getAttribute("data-url");
		executeNews('./note/'+url, false, "news-popup-content");
	}
        if (targetNews){
            e.preventDefault();
            const url = targetNews.getAttribute("data-url");
	    if(isValidHTTPURL(url)){
		window.open(url, "_blank");	
		return;
	    }
	    executeNews('./note/'+url);
	}
    }

    loadMoreApps();

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
        const showItem = title.getBoundingClientRect().y < 85;

        navBar.classList.toggle("hide-border", !showItem);
        navBarTitle.classList.toggle("hidden", !showItem);

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) loadMoreApps();
    }
}, "../");