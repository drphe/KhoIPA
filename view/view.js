import { sourceURL} from "../common/modules/constants.js";
import { formatString, open, setUpBackButton , json , isValidHTTPURL } from "../common/modules/utilities.js";
import { NewsItem } from "../common/components/NewsItem.js";
import { AppHeader } from "../common/components/AppHeader.js";
import { main } from "../common/modules/main.js";
import { openPanel, addAppList} from "../common/components/Panel.js";

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

    // Set tab title
    document.title = json.name;
    // Set page title
    document.querySelector("h1").innerText = json.name;
    document.querySelector("#nav-bar #title>p").innerText = json.name;

    // 
    // Set News
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
            // Ignore beta apps
            if (app.beta) return;
            document.getElementById("featured").insertAdjacentHTML("beforeend", AppHeader(app));
            count++;
        });
    }


    //  "View All apps"
    document.getElementById('search').addEventListener("click", async(e) => {
        e.preventDefault();
        await openPanel('<div id="apps-list"></div>', '<p>ALL APPS</p>', '..', "side", "apps-popup-all");
        addAppList(json, true);
     });

    //  "View All News"
    document.getElementById('all-news').addEventListener("click", (e) => {
        e.preventDefault();
        executeNews("", true);
     });

    function executeNews(url, isAll = false, id = 'news-popup-content') {
      if (isAll) {
        const html = `<div id="news" class="section">${json.news.map(news =>NewsItem(news, false)).join('')}</div>`;
        openPanel(html, '<p>ALL NEWS</p>', '..', "side", "news-popup-all");
      } else {
        if (!url) return;
        fetch(url).then(response => {
          if (!response.ok) throw new Error("Fetch failed");
          return response.text();
        }).then(markdown => {
          const html = `<div id="news" class="section news-item-content">${marked.parse(markdown)}</div>`;
          openPanel(html, '<p>CONTENTS</p>', '..', "side", id);
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
        	openPanel(json, bundleId, '..');
	}
        if (targetNewsLink){
        	e.preventDefault();
           	const url = targetNewsLink.getAttribute("data-url");
		executeNews('./note/'+url, false, "news-popup-link");
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