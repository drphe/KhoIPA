import { urlSearchParams, sourceURL, base64Convert } from "./common/modules/constants.js";
import { formatVersionDate,  showUIAlert,  json,  consolidateApps} from "./common/modules/utilities.js";
import { AppBanner } from "./common/components/AppWeb.js";
import { openPanel , addAppList } from "./common/components/Panel.js";
import UIAlert from "./common/vendor/uialert.js/uialert.js";

const sources = await json("./common/assets/json/sources.json");
const editorsources = await json("./common/assets/json/editorsources.json");

(async () => {
    document.getElementById("top")?.insertAdjacentHTML("afterbegin", AppBanner("Kho IPA Mod"));
    // fetch Data
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
    // insert editor's source choice
    for (const source of fetchedEditorSources) {
        await insertSource(source, "suggestions");
    }
    // insert other source
    for (const source of fetchedSources) {
        await insertSource(source);
    }
    const allSources = [...fetchedEditorSources, ...fetchedSources];
    const allApps = [];
    for (const source of allSources) {
        if (!source || !Array.isArray(source.apps)) continue;
        const randomCode = Math.random().toString(36).substring(2, 6);
        for (const app of source.apps) {
            app.sourceURL = source.sourceURL;
            app.bundleIdentifier += randomCode;
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

    const bundleIdToSourceMap = new Map();
    allSources.forEach(sourceTarget => {
        sourceTarget.apps.forEach(app => {
            bundleIdToSourceMap.set(app.bundleIdentifier, sourceTarget);
        });
    });

    addAppList({ apps: allApps }, false, 10, true); // no shot, 10 app, true for window scroll 

    // total of repositories
    const totalRepoCount = document.getElementById('title-total-repo');
    totalRepoCount.innerText = `${allSources.length} Repositories`;

    document.body.classList.remove("loading");
    document.getElementById("loading")?.remove();

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
                if (!source.iconURL) source.iconURL = app.iconURL;
                if (!source.tintColor) source.tintColor = app.tintColor;
            }
            source.appCount++;
        }
        if (!source.iconURL) source.iconURL = "./common/assets/img/generic_app.jpeg";
        if (!source.tintColor) source.tintColor = "var(--tint-color);";
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
    // 
    // listener event
    // add to home screen
    document.querySelectorAll("a.install").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            showUIAlert("How To Install?", "Select Share Button -> Add To Home Screen  -> Done");
        });
    });
    // view app list
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
    // open app
    document.addEventListener("click", event => {
        const target = event.target.closest("a.app-header-link");
        if (!target) return;
        event.preventDefault();
        const bundleId = target.getAttribute("data-bundleid");
        const sourceTarget = bundleIdToSourceMap.get(bundleId);
        if (!sourceTarget) {
            console.warn(`Source not found for bundleId: ${bundleId}`);
            return;
        }
        openPanel(sourceTarget, bundleId);
    });
    
    let isScrolling = false;
const title = document.querySelector("h1");
    const navBar = document.getElementById("nav-bar");
    const navBarTitle = navBar.querySelector("#title");
    
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            if (title && navBar && navBarTitle) {
                const showItem = title.getBoundingClientRect().y < 36;
                navBar.classList.toggle("hide-border", !showItem);
                navBarTitle.classList.toggle("hidden", !showItem);
            }
            isScrolling = false;
        });
        isScrolling = true;
    }
});

})();
