import { urlSearchParams, sourceURL, base64Convert } from "./common/modules/constants.js";
import { formatVersionDate,  showUIAlert,  json,  consolidateApps, isValidHTTPURL, prefetchAndCacheUrls, openCachedUrl, generateTOC} from "./common/modules/utilities.js";
import { AppBanner } from "./common/components/AppWeb.js";
import { NewsItem } from "./common/components/NewsItem.js";
import { openPanel , addAppList } from "./common/components/Panel.js";
import UIAlert from "./common/vendor/uialert.js/uialert.js";

const sources = await json("./common/assets/json/sources.json");
const editorsources = await json("./common/assets/json/editorsources.json");

(async () => {
    document.getElementById("top")?.insertAdjacentHTML("afterbegin", AppBanner("Kho IPA Mod"));
    // fetch Data
    const fetchedEditorSources = (await Promise.all(editorsources.map(async url => {
        try {
            return await fetchSource(url);
        } catch {
            return null;
        }
    }))).filter(Boolean);

    // Set News
    const jsonNews = fetchedEditorSources[0].news;
    let jsonNewsUrl = [];
    if (jsonNews && jsonNews.length >= 1) {
        // Sort news in decending order of date (latest first)
        jsonNews.sort((a, b) => // If b < a
            (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());
        if (jsonNews.length == 1) {
            document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(jsonNews[0], true));
            document.getElementById("news-items").classList.add("one");
        } else {
            for (let i = 0; i < jsonNews.length; i++) {
                if (!jsonNews[i].notify) continue;
                document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(jsonNews[i], true));
		const url = jsonNews[i].url.replace("https://drphe.github.io/KhoIPA/view/?note=","");; 
		if(url && !isValidHTTPURL(jsonNews[i].url)) jsonNewsUrl.push('./view/note/'+ url);
            }
 	}
	prefetchAndCacheUrls(jsonNewsUrl);
	// cuộn ngang
	const containerNews = document.getElementById('news-items');
	const item = containerNews.querySelector('.news-item-wrapper');
	if(item){
		const itemWidth = item.offsetWidth + 15; // 10 là khoảng cách giữa các item
		containerNews.addEventListener('wheel', function (e) {
  			e.preventDefault();
  			const direction = e.deltaY > 0 ? 1 : -1;
  			containerNews.scrollBy({
    				left: direction * itemWidth,
    				behavior: 'smooth'
  			});
		}, { passive: false });
	}
    } else document.getElementById("news").remove();



    const fetchedSources = (await Promise.all(sources.map(async url => {
        try {
            return await fetchSource(url);
        } catch {
            return null;
        }
    }))).filter(Boolean);

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
    document.body.classList.remove("loading");// kết thúc load dữ liệu
    document.getElementById("loading")?.remove();

    const fixYear =(d)=>{let x=new Date(d),y=new Date().getFullYear();return x.getFullYear()>y+10?(x.setFullYear(y),x.toISOString().split("T")[0]):d}

    const allSources = [...fetchedEditorSources, ...fetchedSources]; // chuẩn bị danh sách app
    const allApps = [];
    for (const source of allSources) {
        if (!source || !Array.isArray(source.apps)) continue;
        const randomCode = Math.random().toString(36).substring(2, 6);
        for (const app of source.apps) {
            app.sourceURL = source.sourceURL;
            app.sourceName = source.name;
            app.sourceIconURL = source.iconURL;
            app.sourceTintColor = source.tintColor;
            app.bundleIdentifier += randomCode;
	    app.versionDate = app.versionDate? fixYear(app.versionDate):'';
        }
        //const nonBetaApps = source.apps.filter(app => !app.beta);
        allApps.push(...source.apps);
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

    // total of repositories
    const totalRepoCount = document.getElementById('title-total-repo');

    async function fetchSource(url) {
        const data = await json(url);
        const source = consolidateApps(data);
        source.sourceURL = url
        if (!source) return;
        source.lastUpdated = new Date("1970-01-01");
        source.appCount = 0;
        for (const app of source.apps) {
            if (app.patreon?.hidden) continue;
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
                                <p class="subtitle">Updated: ${formatVersionDate(source.lastUpdated)}</p>
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
    // view app list
    //  "View All apps"
    openPanel({},"");// preload panel
    document.getElementById('search')?.addEventListener("click", async(e) => {
        e.preventDefault();
        await openPanel('<div id="apps-list"></div>', `<p>Kho IPA Mod</p>`, '.', "side", "apps-popup-all");
        addAppList({ apps: allApps }, 10, false); // 10 apps, no shot
     });

    // open app
    document.addEventListener("click", event => {
        const targetLink = event.target.closest("a.app-header-link");
        const targetInstall = event.target.closest("a.install-app");
        const targetNews = event.target.closest("a.news-item-header");
        const targetNewsLink = event.target.closest("a.news-item-link");
        if (targetInstall) {
            event.preventDefault();
            showUIAlert("How To Install?", "Select Share Button -> Add To Home Screen  -> Done");
        }
        if (targetNewsLink) {
            event.preventDefault();
            const url = targetNewsLink.getAttribute("data-url");
            executeNews('./view/note/' + url, "CONTENTS", "news-popup-link");
        }
        if (targetNews) {
            event.preventDefault();
            const title = targetNews.getAttribute("title");
            const url = targetNews.getAttribute("data-url");
            if (isValidHTTPURL(url)) {
                window.open(url, "_blank");
                return;
            }
            executeNews('./view/note/' + url, title);
        }
        if (!targetLink) return;
        event.preventDefault();
        const bundleId = targetLink.getAttribute("data-bundleid");
        const sourceTarget = bundleIdToSourceMap.get(bundleId);
        if (!sourceTarget) {
            console.warn(`Source not found for bundleId: ${bundleId}`);
            return;
        }
        openPanel(sourceTarget, bundleId, ".", "bottom");
    });

    function executeNews(url, title, id = 'news-popup-content') {
            if (!url) return;
            openCachedUrl(url).then(response => {
                return response.text();
            }).then(markdown => {
        const { tocHtml, headings } = generateTOC(markdown);
        let htmlContent = marked.parse(markdown);
        headings.forEach(h => {
            const headingTag = `<h${h.level}>${h.text}</h${h.level}>`;
            const headingWithId = `<h${h.level} id="${h.id}">${h.text}</h${h.level}>`;
            htmlContent = htmlContent.replace(headingTag, headingWithId);
        });
        const finalHtml = `
            <div class="two-column-layout">
                <div class="toc-column">
                    <h3>Mục lục</h3>
                    ${tocHtml}
                </div>
                <div id="news" class="section news-item-content content-column">
                    ${htmlContent}
                </div>
            </div>
        `;
        openPanel(finalHtml, `<p>${title}</p>`, '.', "side", id);
            }).catch(error => {
                console.error("Lỗi khi tải nội dung:", error);
            });
    }
    let isScrolling = false;
    const title = document.querySelector("h1");
    const navBar = document.getElementById("nav-bar");
    const navBarTitle = navBar.querySelector("#title");
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (title && navBar && navBarTitle) {
                    const showItem = title.getBoundingClientRect().y < 30;
                    navBar.classList.toggle("hide-border", !showItem);
                    navBarTitle.classList.toggle("hidden", !showItem);
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
})();

