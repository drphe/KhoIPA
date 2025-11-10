import { sourceURL, noteURL, dirNoteURL, bundleID} from "../common/modules/constants.js";
import { formatString, open, setUpBackButton , json , isValidHTTPURL,prefetchAndCacheUrls, openCachedUrl, generateTOC } from "../common/modules/utilities.js";
import { NewsItem } from "../common/components/NewsItem.js";
import { AppHeader } from "../common/components/AppHeader.js";
import { main } from "../common/modules/main.js";
import { openPanel, addAppList} from "../common/components/Panel.js";

main(json => {
    document.getElementById("edit").addEventListener("click", e => {
        e.preventDefault();
        if (sourceURL) open(`../studio/?source=${sourceURL}`);
    });

    // Set tab title
    document.title = json.name;
    // Set page title
    document.querySelector("h1").innerText = json.name;
    document.querySelector("#nav-bar #title>p").innerText = json.name;

    // 
    // Set News
    let jsonNewsUrl = [];
    if (json.news && json.news.length >= 1) {
        // Sort news in decending order of date (latest first)
        json.news.sort((a, b) => // If b < a
            (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());

        if (json.news.length == 1) {
            document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[0], true));
            document.getElementById("news-items").classList.add("one");
	    document.getElementById('all-news').classList.add("hidden");
        } else {
            for (let i = 0; i < json.news.length; i++){
		if (!json.news[i].notify) continue;
                document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[i], true));
		const url = json.news[i].url?.replace(dirNoteURL,""); 
		if(url && !isValidHTTPURL(url)) jsonNewsUrl.push('./note/'+ url);
	    }
	}
	prefetchAndCacheUrls(jsonNewsUrl);
	// cuộn ngang
	const containerNews = document.getElementById('news-items');
	const item = containerNews.querySelector('.news-item-wrapper');
	if(item){
		const itemWidth = item.offsetWidth + 15; 
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

    json.apps.sort((a, b) => {
        const dateA = new Date(a.versionDate ?? a.versions?.[0]?.date ?? 0).valueOf();
        const dateB = new Date(b.versionDate ?? b.versions?.[0]?.date ?? 0).valueOf();
        return dateB - dateA;
    });

    // 
    // Set Featured apps
    if (json.featuredApps) {
        json.apps
            .filter(app => json.featuredApps.includes(app.bundleIdentifier))
            .forEach(app => document.getElementById("featured").insertAdjacentHTML("beforeend", AppHeader(app)));
    } else {
        let count = 1;
        json.apps.forEach(app => {
            // Max: 5 featured apps if not specified
            if (count > 5) return;
            document.getElementById("featured").insertAdjacentHTML("beforeend", AppHeader(app));
            count++;
        });
    }
	if(noteURL) executeNews('./note/'+noteURL, "CONTENTS", "news-popup-link");//read news
	else if(bundleID) openPanel(json, bundleID, '..', "bottom");// open app
        else openPanel({},"","..");// preload panel


const activateNavLink = (e) => {
  document.querySelectorAll(".nav-link").forEach(l => {
    if (l.dataset.target == e) l.classList.add("active");
    else l.classList.remove("active");
  });
};
    //  "View All apps"
    document.getElementById('search')?.addEventListener("click", async(e) => {
        e.preventDefault();
        activateNavLink("page-library");
        await openPanel('<div id="apps-list"></div>', `<p>${json.name}</p>`, '..', "side", "apps-popup-all");
        addAppList(json); //5apps, with screenshot, target.parentElement scroll
     });

    //  "View All News"
    document.getElementById('all-news')?.addEventListener("click", (e) => {
        e.preventDefault();
       activateNavLink("page-news");
        executeNews("/", "ALL NEWS","news-popup-all", true);
     });

    function executeNews(url, title , id = 'news-popup-content', isAll = false) {
      id+= Math.random().toString(36).substring(2, 6);
      if (isAll) {
        const html = `<div id="news" class="section grid_news">${json.news.map(news =>NewsItem(news, false)).join('')}</div>`;
        openPanel(html, `<p>${title}</p>`, '..', "side", id);
      } else {
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
        openPanel(finalHtml, `<p>${title}</p>`, '..', "side", id);
        }).catch(error => {
          console.error("Lỗi khi tải nội dung:", error);
        });
      }
    }

    //
    // listener event over the page
    document.addEventListener("click", executePanel);

    function executePanel(e){
        const targetLinks = e.target.closest("a.app-header-link");
        const targetNews = e.target.closest("a.news-item-header");
        const targetNewsLink = e.target.closest("a.news-item-link");
        if (targetLinks){
        	e.preventDefault();
        	const bundleId = targetLinks.getAttribute("data-bundleid");
        	openPanel(json, bundleId, '..', "bottom");
	}
        if (targetNewsLink){
        	e.preventDefault();
           	const url = targetNewsLink.getAttribute("data-url");
		executeNews('./note/'+url, "CONTENTS", "news-popup-link");
	}
        if (targetNews){
            e.preventDefault();
            const url = targetNews.getAttribute("data-url");
            const title = targetNews.getAttribute("title");
	    if(isValidHTTPURL(url)){
		window.open(url, "_blank");	
		return;
	    }
	    executeNews('./note/'+url, title);
	}
    }
let oldTargetPage= "page-home";
document.querySelectorAll(".nav-link").forEach(link=>{
  link.addEventListener("click",async ()=>{
    document.querySelectorAll(".nav-link").forEach(l=>l.classList.remove("active"));
    link.classList.add("active");
    const target = link.dataset.target;
    if(target == oldTargetPage) return;
    oldTargetPage = target
    if(target == 'page-library') {
        await openPanel('<div id="apps-list"></div>', `<p>${json.name}</p>`, '..', "side", "apps-popup-all");
        addAppList(json); //5apps, with screenshot, target.parentElement scroll
    }else if(target == 'page-news'){
        const html = `<div id="news" class="section grid_news">${json.map(item =>NewsItem(item, false)).join('')}</div>`;
        openPanel(html, `<p>ALL NEWS</p>`, '..', "side", "popup-all-news");

    }else {
	document.querySelectorAll(".panel.show").forEach(l=>l.classList.remove("show"));
	document.body.classList.remove('no-scroll');
    }
  });
});

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
    }
}, "../");