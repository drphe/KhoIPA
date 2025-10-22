import { urlSearchParams, sourceURL, base64Convert } from "./common/modules/constants.js";
import { isValidHTTPURL, open, formatVersionDate, json,  consolidateApps } from "./common/modules/utilities.js";
import { AppBanner } from "./common/components/AppWeb.js";
import UIAlert from "./common/vendor/uialert.js/uialert.js";

const sources = await json("./common/assets/json/sources.json");
const editorsources = await json("./common/assets/json/editorsources.json");


(async function main() {

     if(/iPhone|iPad|Macintosh/i.test(navigator.userAgent)){
    	document.getElementById("top")?.insertAdjacentHTML("afterbegin", AppBanner("Kho IPA Mod"));
	document.getElementById("nav-bar")?.classList.add("hidden");
    }
    // alert install
    const installAppAlert = new UIAlert({
        title: `How to Install?`,
        message: "Select Share Button ->Add To Home Screen  -> Done. "
    });
    installAppAlert.addAction({
        title: "Done",
        style: 'cancel',
    });
    document.querySelectorAll("a.install").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            installAppAlert.present();
        });
    });


    const fetchedSources = await Promise.all(sources.map(async url => {
      const source = await fetchSource(url);
      return source || null;
    }));
    const fetchedEditorSources = await Promise.all(editorsources.map(async url => {
      const source = await fetchSource(url);
      return source || null;
    }));


    // Sort sources by last updated
    fetchedSources.sort((a, b) => b.lastUpdated - a.lastUpdated);

    // chèn editor's choice
    for (const source of fetchedEditorSources) {
        await insertSource(source, "suggestions");
    }
    // chèn featured
    for (const source of fetchedSources) {
        await insertSource(source);
    }

    const allSources = [...fetchedEditorSources, ...fetchedSources]; // Gộp mảng
    const allApps = [];
    for (const source of allSources) {
      if (!source || !Array.isArray(source.apps)) continue;
      for (const app of source.apps) {
        app.sourceURL = source.sourceURL;
      }
      const nonBetaApps = source.apps.filter(app => !app.beta);
      allApps.push(...nonBetaApps);
    }
    // sort app 
    allApps.sort((a, b) => {
      const dateA = new Date(a.versionDate ?? a.versions?.[0]?.date ?? 0).valueOf();
      const dateB = new Date(b.versionDate ?? b.versions?.[0]?.date ?? 0).valueOf();
      return dateB - dateA;
    });

    document.body.classList.remove("loading");
    document.getElementById("loading")?.remove();

    let filteredApps = [...allApps];
    let currentIndex = 0;
    const appsPerLoad = 10;
    const appsContainer = document.getElementById("apps-list");

    // total of repositories
    document.getElementById('title2').innerText = `${allSources.length} Repositories`;
    document.getElementById('title3').innerText = `${filteredApps.length} Applications`;

    // click button
    document.getElementById('search').addEventListener("click", (e) => {
      const suggestions = document.getElementById('suggestions');
      const repositories = document.getElementById('repositories');
      const apps = document.getElementById('apps');
      if (e.target.innerText == "View All Apps") {
        suggestions.style.display = 'none';
        repositories.style.display = 'none';
        apps.style.display = 'block';
        e.target.innerText = "Close";
      } else {
        suggestions.style.display = 'block';
        repositories.style.display = 'block';
        apps.style.display = 'none';
        e.target.innerText = "View All Apps";
      }
    });
    async function run() {
      appsContainer.innerHTML = "";
      appsContainer.classList.add("skeleton-text", "skeleton-effect-wave");
      const tasks = [];
      for (let i = 0; i < 5; i++) {
        tasks.push(insertAppLoading());
      }
      await Promise.all(tasks); // Chờ tất cả hoàn tất
    }
    // search box
    const searchBox = document.getElementById("filterText");
    searchBox.addEventListener("input", async () => {
      await run();
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
        loadMoreApps();
      }, 500);


    });

searchBox.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    await run();
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
        loadMoreApps();
      }, 500);
  }
});

    function loadMoreApps() {
      const nextApps = filteredApps.slice(currentIndex, currentIndex + appsPerLoad);
      nextApps.forEach(app => {
        appsContainer.insertAdjacentHTML("beforeend", `<div class="app-container">${insertAppHeader(app)}</div>`);
      });
      currentIndex += appsPerLoad;
    }
    // Tải thêm khi cuộn gần cuối
    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMoreApps();
      }
    });

    loadMoreApps();
  // hàm chèn loadingApp
  async function insertAppLoading(id = "apps-list", position = "beforeend") {
    document.getElementById(id).insertAdjacentHTML(position, `<div class="app-container">
<div class="app-header-container">
    <a href="#" class="app-header-link">
    <div class="app-header-inner-container">
        <div class="app-header">
            <div class="content">
                <div class="skeleton-block"></div>
                <div class="right">
                    <div class="text">
                        <p class="title">--- --- ---</p>
                        <p class="subtitle">------</p>
                    </div>
                        <button class="uibutton">---</button>
                    </div>
                </div>
            <div class="background" ></div>
        </div>
    </div>
    </a>
    </div></div>
	`);
  }
    function insertAppHeader(app) {
      const baseHost = window.location.origin;
      const fallbackSrc = baseHost + "/KhoIPA/common/assets/img/generic_app.jpeg";
      return app ? `<div class="app-header-container">
    <a href="./view/app/?source=${base64Convert(app.sourceURL)}&id=${app.bundleIdentifier}" class="app-header-link">
    <div class="app-header-inner-container">
        <div class="app-header">
            <div class="content">
                <img id="app-icon" src="${app.iconURL}" onerror="this.onerror=null; this.src='${fallbackSrc}';" alt="">
                <div class="right">
                    <div class="text">
                        <p class="title">${app.name}</p>
                        <p class="subtitle">${app.version ? app.version + ' &middot; ': ''}${app.versionDate ? formatVersionDate(app.versionDate): formatVersionDate(app.versions[0].date)}</p>
                    </div>
                        <button class="uibutton" style="background-color: ${app.tintColor ? "#" + app.tintColor.replaceAll("#", "") : "var(--tint-color);"};">View</button>
                    </div>
                </div>
            <div class="background" style="background-color: ${app.tintColor ? "#" + app.tintColor.replaceAll("#", "") : "var(--tint-color);"};"></div>
        </div>
    </div>
    </a>
    </div>` : undefined;
    }
    async function fetchSource(url) {
        const data = await json(url);
	const source = consolidateApps(data);
	source.sourceURL = url
        if (!source) return;
        source.lastUpdated = new Date("1970-01-01");
        source.appCount = 0;
        for (const app of source.apps) {
            if (app.beta || app.patreon?.hidden) continue;
            let appVersionDate = new Date(app.versions ? app.versions[0].date : app.versionDate);
            if (appVersionDate > source.lastUpdated) {
                source.lastUpdated = appVersionDate;
                if (!source.iconURL)
                    source.iconURL = app.iconURL;
                if (!source.tintColor)
                    source.tintColor = app.tintColor;
            }
            source.appCount++;
        }
        if (!source.iconURL)
            source.iconURL = "./common/assets/img/generic_app.jpeg";
        if (!source.tintColor)
            source.tintColor = "var(--tint-color);";
            source.url = url;
        return source;
        
    }

    async function insertSource(source, id = "repositories", position = "beforeend", flag = false) {
        document.getElementById(id).insertAdjacentHTML(position, `
            <div class="source-container">
                <a href="./view/?source=${base64Convert(source.url)}" class="source-link">
                    <div class="source" style="
                        background-color: #${source.tintColor.replaceAll("#", "")};
                        margin-bottom: ${flag ? "0.75rem" : "0"};
                    ">
                        <img src="${source.iconURL}" alt="source-icon" onerror="this.onerror=null; this.src='./common/assets/img/generic_app.jpeg';">
                        <div class="right">
                            <div class="text">
                                <p class="title">${source.name}</p>
                                <p class="subtitle">Last updated: ${formatVersionDate(source.lastUpdated)}</p>
                            </div>
                            <div class="app-count">
                                ${source.appCount} app${source.appCount === 1 ? "" : "s"}
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `);
    }

    window.onscroll = e => {
        const title = document.querySelector("h1");
        const navBar = document.getElementById("nav-bar");
        const navBarTitle = navBar.querySelector("#title");

        if (title.getBoundingClientRect().y < 36) {
            navBar.classList.remove("hide-border","hidden");
            navBarTitle.classList.remove("hidden");
        } else {
            navBar.classList.add("hide-border");
   	    if(/iPhone|iPad|Macintosh/i.test(navigator.userAgent)) navBar.classList.add("hidden");
            navBarTitle.classList.add("hidden");
        }
    }
})();