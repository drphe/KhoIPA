import { urlSearchParams, sourceURL, base64Convert } from "./common/modules/constants.js";
import { isValidHTTPURL, open, formatVersionDate, json } from "./common/modules/utilities.js";
const sources = await json("./common/assets/json/sources.json");
const editorsources = await json("./common/assets/json/editorsources.json");

(async function main() {

    const fetchedEditorSources = [];
    const fetchedSources = [];


    for (const url of sources) {
        const source = await fetchSource(url);
        if (!source) continue;
        fetchedSources.push(source);
    }

    for (const url of editorsources) {
        const source = await fetchSource(url);
        if (!source) continue;
        fetchedEditorSources.push(source);
    }

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

    document.body.classList.remove("loading");
    document.getElementById("loading")?.remove();


    async function fetchSource(url) {
        const source = await json(url);
        if (!source) return;
        source.lastUpdated = new Date("1970-01-01");
        source.appCount = 0;
        for (const app of source.apps) {
            if (app.beta || app.patreon?.hidden) return;
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

    async function insertSource(source, id = "repository", position = "beforeend", flag = false) {
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

        if (title.getBoundingClientRect().y < 32) {
            navBar.classList.remove("hide-border");
            navBarTitle.classList.remove("hidden");
        } else {
            navBar.classList.add("hide-border");
            navBarTitle.classList.add("hidden");
        }
    }
})();