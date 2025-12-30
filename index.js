import { urlSearchParams, sourceURL,noteURL, dirNoteURL, bundleID, base64Convert } from "./common/modules/constants.js";
import { formatVersionDate,  showUIAlert,  json,  consolidateApps, isValidHTTPURL, prefetchAndCacheUrls, openCachedUrl, generateTOC} from "./common/modules/utilities.js";
import { AppBanner } from "./common/components/AppWeb.js";
import { AppHeader } from "./common/components/AppHeader.js";
import { NewsItem } from "./common/components/NewsItem.js";
import { openPanel , addAppList, activateNavLink, wrapLightbox } from "./common/components/Panel.js";
import UIAlert from "./common/vendor/uialert.js/uialert.js";

const sources = await json("./common/assets/json/sources.json");

(async () => {
    document.getElementById("top")?.insertAdjacentHTML("afterbegin", AppBanner("Kho IPA Mod"));
    // fetch Data
    const featuredSources = (await Promise.all(sources.featured.map(async url => {
        try {
            return await fetchSource(url);
        } catch {
            return null;
        }
    }))).filter(Boolean);
	const randCode = (e) => {
		const b64 = base64Convert(e);
		const mid = Math.floor(b64.length / 2);
		return b64.slice(0,2) + b64.slice(mid-1,mid+1) + b64.slice(-2);
	}
    // Set News
    const jsonNews = featuredSources[0].news;
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
		const url = jsonNews[i].url?.replace(dirNoteURL,"");
		if(url && !isValidHTTPURL(url)) jsonNewsUrl.push('./view/note/'+ url);
            }
 	}
        jsonNewsUrl.push('./view/index.html');
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

    const otherSources = (await Promise.all(sources.other.map(async url => {
        try {
            return await fetchSource(url);
        } catch {
            return null;
        }
    }))).filter(Boolean);

    // Sort sources by last updated
    otherSources.sort((a, b) => b.lastUpdated - a.lastUpdated);

    const fixYear =(d)=>{let x=new Date(d),y=new Date().getFullYear();return x.getFullYear()>y+10?(x.setFullYear(y),x.toISOString().split("T")[0]):d}

    const allSources = [...featuredSources, ...otherSources]; // chuẩn bị danh sách app
    const allApps = [];
    for (const source of allSources) {
        if (!source || !Array.isArray(source.apps)) continue;

        for (const app of source.apps) {
            app.sourceURL = source.sourceURL;
            app.sourceName = source.name;
            app.sourceIconURL = source.iconURL;
            app.sourceTintColor = source.tintColor;
            app.bundleIdentifier += `@${source.identifier}`;
	    app.versionDate = app.versionDate? fixYear(app.versionDate):'';
        }
        //const nonBetaApps = source.apps.filter(app => !app.beta);
        allApps.push(...source.apps);
    }
	    // insert editor's source choice
    for (const source of featuredSources) {
        await insertSource(source, "repositories");
    }
    // sort app 
    allApps.sort((a, b) => {
        const dateA = new Date(a.versionDate ?? a.versions?.[0]?.date ?? 0).valueOf();
        const dateB = new Date(b.versionDate ?? b.versions?.[0]?.date ?? 0).valueOf();
        return dateB - dateA;
    });

	// insert newest app
        let count = 1;
	let allAppsView = allApps.filter(s=> s.type==1);
        allAppsView.forEach(app => {
            if (count > 6) return;
            document.getElementById("suggestions").insertAdjacentHTML("beforeend", AppHeader(app));
            count++;
        });
	count=1, allAppsView = allApps.filter(s=> s.type==2);
        allAppsView.forEach(app => {
            if (count > 6) return;
            document.getElementById("suggestions2").insertAdjacentHTML("beforeend", AppHeader(app));
            count++;
        });

    document.body.classList.remove("loading");// kết thúc load dữ liệu
    document.getElementById("loading")?.remove();

    const bundleIdToSourceMap = new Map();
    allSources.forEach(sourceTarget => {
        sourceTarget.apps.forEach(app => {
            bundleIdToSourceMap.set(app.bundleIdentifier, sourceTarget);
        });
    });

    async function fetchSource(url) {
        const data = await json(url);
        const source = consolidateApps(data);
        source.sourceURL = url
            if (!source)
                return;
            source.lastUpdated = new Date("1970-01-01");
        source.appCount = 0;
        for (const app of source.apps) {
            if (app.patreon?.hidden)
                continue;
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
    async function insertSource(source, id = "sources-list", position = "beforeend", flag = true) {
        let imgApps = "";
        let count = 1;
        const checkBeta = (inputValue) => {
            if (typeof inputValue === 'boolean') {
                return inputValue === true ? "beta" : undefined;
            } else if (typeof inputValue === 'string') {
                return inputValue;
            }
            return undefined;
        }
		
        source.apps.forEach(app => {
            if (count > 4)
                return;
            if (isValidHTTPURL(app.iconURL)) {
                imgApps += `<a href="#" data-bundleid = "${app.bundleIdentifier}"  class="app-header-link" style="display: inline-grid;justify-items: center;">
				<img class="app-panel-icon" src="${app.iconURL}" alt="source-icon" onerror="this.onerror=null; this.src='./common/assets/img/generic_app.jpeg';">
				<span class="small ${checkBeta(app.beta)} badge" style="position: sticky;transform: translate(0px, -75px);"></span>
				</a>`;
                count++;
            }
        });

        document.getElementById(id).insertAdjacentHTML(position, `
            <div class="source-container">
				<div class="item" style="height:150px;padding:0px;opacity:0.9;background-color: #${source.tintColor.replaceAll("#", "")};
				margin: 0px;border-radius: 1.5rem 1.5rem 0 0;">
					<div class="text" style="margin: 0em;background: linear-gradient(to top, var(--color-transparent-dark) 50%, rgba(0, 0, 0, 0));
				padding: 1em;height: 80%;text-align: center;">
					${imgApps}
					<div class="text" style="position: relative;color:white;"><p>${source.subtitle ?? ""}</p></div>
					</div> 
				</div>
				<a href="./view/?source=${base64Convert(source.url)}" class="source-link">
                    <div class="source" style="background-color: #${source.tintColor.replaceAll("#", "")};
				margin-bottom: 0.75rem;border-radius:${flag ? "0 0 " : ""} 1.5rem 1.5rem;">
                        <img src="${source.iconURL}" alt="source-icon" onerror="this.onerror=null; this.src='./common/assets/img/no-img.png';">
                        <div class="right">
                            <div class="text">
                                <p class="title">${source.name}</p>
                                <p class="subtitle">${langText["lastupdate"]}: ${formatVersionDate(source.lastUpdated)}</p>
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
    //  "View All apps"
    if(noteURL){
        await executeNews('./view/note/'+noteURL, langText["contents"], "news-popup-link");//read news
    }
    if(bundleID){// load app
	const sTarget = bundleIdToSourceMap.get(bundleID);
        if (!sTarget) {
            console.warn(`Source not found for bundleId: ${bundleID}`);
        }else openPanel(sTarget, bundleID, ".", "bottom");
    }else openPanel({},"");// preload panel

    document.getElementById('search')?.addEventListener("click", async(e) => {
        e.preventDefault();
        await openPanel('<div id="apps-list"></div>', `<p>All Apps</p>`, '.', "side", "apps-popup-all");
        addAppList({ apps: allApps }, 10, 1); // 10 apps, lấy app type=1
        activateNavLink("page-library");
     });
    document.getElementById('search2')?.addEventListener("click", async(e) => {
        e.preventDefault();
        await openPanel('<div id="apps-list"></div>', `<p>All Apps</p>`, '.', "side", "apps-popup-all");
        addAppList({ apps: allApps }, 10, 2); // 10 apps, lấy app type=1
        activateNavLink("page-library");
     });
    //
    // view all source
    document.getElementById('all-source')?.addEventListener("click", async(e) => {
        e.preventDefault();
        await openPanel('<div id="sources-list"></div>', `<p>All Repositories</p>`, '.', "side", "sources-popup-all");
    	for (const source of featuredSources) {
        	await insertSource(source);
   	 }
	for (const source of otherSources) {
	     await insertSource(source);
 	}
       activateNavLink("page-source");
     });
    // open app
    document.addEventListener("click", event => {
        const targetLink = event.target.closest("a.app-header-link");
        const targetInstall = event.target.closest("a.install-app");
        const targetNews = event.target.closest("a.news-item-header");
        const targetNewsLink = event.target.closest("a.news-item-link");
        if (targetInstall) {
            event.preventDefault();
            showUIAlert(langText['howtoinstall'], langText['howtoinstallText']);
        }
        if (targetNewsLink) {
            event.preventDefault();
            const url = targetNewsLink.getAttribute("data-url");
            executeNews('./view/note/' + url, langText['contents'], "news-popup-link");
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

document.querySelectorAll(".nav-link").forEach(link=>{
  link.addEventListener("click",async ()=>{
    document.querySelectorAll(".nav-link").forEach(l=>l.classList.remove("active"));
    link.classList.add("active");
    const target = link.dataset.target;
    if(target == window.oldTargetPage) return;
    window.oldTargetPage = target
    if(target == 'page-source') {
        await openPanel('<div id="sources-list"></div>', `<p>${langText['allrepo']}</p>`, '.', "side", "sources-popup-all");
    	for (const source of featuredSources) {
        	await insertSource(source);
   	 }
	for (const source of otherSources) {
	     await insertSource(source);
 	}
    }else if(target == 'page-library') {
        await openPanel('<div id="apps-list"></div>', `<p>${langText['allapp']}</p>`, '.', "side", "apps-popup-all");
        addAppList({ apps: allApps }, 10); 
    }else if(target == 'page-news'){
        const html = `<div id="news" class="section grid_news">${jsonNews.map(item =>NewsItem(item, true)).join('')}</div>`;
        openPanel(html, `<p>${langText["allnews"]}</p>`, '.', "side", "popup-all-news");
    }else {
	document.querySelectorAll(".panel.show").forEach(l=>l.classList.remove("show"));
	document.body.classList.remove('no-scroll');
    }

  });
});

    function executeNews(url, title, id = 'news-popup-content') {
	    id+= Math.random().toString(36).substring(2, 6);
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
                    <h3>${langText['tablecontent']}</h3>
                    ${tocHtml}
                </div>
                <div id="news" class="section news-item-content content-column">
                    ${wrapLightbox(htmlContent)}
                </div>
            </div>
        `;
        openPanel(finalHtml, `<p>${title}</p>`, '.', "side", id, "news");
    	const urlView = new URL(window.location.href);
    	urlView.searchParams.set('note', url.replace("./view/note/",""));
    	history.replaceState({}, '', urlView);
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

