import {
    sourceURL,
    noteURL,
    dirNoteURL,
    bundleID
} from "../common/modules/constants.js";
import {
    formatString,
    open,
    setUpBackButton,
    json,
    isValidHTTPURL,
    prefetchAndCacheUrls,
    openCachedUrl,
    generateTOC,
    activateNavLink,
    wrapLightbox
} from "../common/modules/utilities.js";
import {NewsItem}from "../common/components/NewsItem.js";
import {AppHeader}from "../common/components/AppHeader.js";
import {openPanel,addAppList}from "../common/components/Panel.js";
import {main}from "../common/modules/main.js";

main(json => {
    document.getElementById("edit").addEventListener("click", e => {
        e.preventDefault();
        if (sourceURL) open(`../studio/?source=${sourceURL}`);
    });
    const welcomNews = {
        "title": `Welcome to ${json.name}!`,
        "identifier": "welcome.to.repo",
        "caption": json.subtitle ?? "Tap to open our Website",
        "date": "2026-04-15",
        "tintColor": json.tintColor ?? "#00adef",
        "imageURL": "https://i.ibb.co/3yhqBxqH/a53862b58d86.png",
        "notify": true,
        "url": json.website ?? null
    }
    // Set tab title
    document.title = json.name;
    // Set page title
    document.querySelector("h1").innerText = json.name;
    document.querySelector("#nav-bar #title>p").innerText = json.name;
    // 
    // Set News
    let jsonNewsUrl = [];
    if (!(json.news && json.news.length)) json.news = [welcomNews];
    if (json.news && json.news.length >= 1) {
        // Sort news in decending order of date (latest first)
        json.news.sort((a, b) => // If b < a
            (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());
        if (json.news.length == 1) {
            document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[0], true));
            document.getElementById("news-items").classList.add("one");
            //document.querySelector('.all-news').classList.add("hidden");
        }
        else {
            let hasNotify = false;
            for (let i = 0; i < json.news.length; i++) {
                if (!json.news[i].notify) continue;
                hasNotify = true;
                document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[i], true));
                const url = json.news[i].url?.replace(dirNoteURL, "");
                if (url && !isValidHTTPURL(url)) jsonNewsUrl.push('./note/' + url);
            }
            if (!hasNotify && json.news.length > 0) {
                document.getElementById("news-items").insertAdjacentHTML("beforeend", NewsItem(json.news[0], true));
            }
        }
        prefetchAndCacheUrls(jsonNewsUrl);
        // cuộn ngang
        var swiper = new Swiper(".mySwiperNews", {
            slidesPerView: "auto",
            centeredSlides: true,
            spaceBetween: 10,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    centeredSlides: false,
                }
            }
        });
    }
    else document.getElementById("news").remove();
    json.apps.sort((a, b) => {
        const dateA = new Date(a.versionDate ?? a.versions?.[0]?.date ?? 0).valueOf();
        const dateB = new Date(b.versionDate ?? b.versions?.[0]?.date ?? 0).valueOf();
        return dateB - dateA;
    });
    // 
    // Set Featured apps
    if (json.featuredApps && json.featuredApps.length) {
        json.apps.filter(app => json.featuredApps.includes(app.bundleIdentifier)).forEach(app => document.getElementById("featured").insertAdjacentHTML("beforeend", AppHeader(app)));
    }
    else {
        let count = 1;
        json.apps.forEach(app => {
            if (count > 5) return;
            document.getElementById("featured").insertAdjacentHTML("beforeend", AppHeader(app));
            count++;
        });
	document.querySelector('span[data-text="featuredapps"]').textContent = langText['updateapp'];
    }
    async function run() {
        if (noteURL) {
            await executeNews('./note/' + noteURL, langText['contents'], "news-popup-link");
        }
        if (bundleID) {
            await openPanel(json, bundleID, '..', "bottom");
        }
        else {
            await openPanel({}, "", "..");
        }
    }
    run();
    //  "View All apps"
    document.getElementById('search')?.addEventListener("click", async (e) => {
        e.preventDefault();
        await openPanel('<div id="apps-list"></div>', `<p>${json.name}</p>`, '..', "side", "apps-popup-all");
        addAppList(json);
        activateNavLink("page-library");
    });
    //  "View All News"
    document.getElementById('all-news')?.addEventListener("click", async (e) => {
        e.preventDefault();
        await executeNews("/", langText['allnews'], "news-popup-all", true);
        activateNavLink("page-news");
    });

    function executeNews(url, title, id = 'news-popup-content', isAll = false) {
        id += Math.random().toString(36).substring(2, 6);
        if (isAll) {
            const html = `<div id="news" class="section grid_news">${json.news.map(news =>NewsItem(news, false)).join('')}</div>`;
            openPanel(html, `<p>${title}</p>`, '..', "side", id);
        }
        else {
            if (!url) return;
            openCachedUrl(url).then(response => {
                return response.text();
            }).then(markdown => {
                const {
                    tocHtml,
                    headings
                } = generateTOC(markdown);
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
                    ${wrapLightbox(htmlContent)}
                </div>
            </div>
        `;
                openPanel(finalHtml, `<p>${title}</p>`, '..', "side", id, "news");
                const urlView = new URL(window.location.href);
                urlView.searchParams.set('note', url.replace("./note/", ""));
                history.replaceState({}, '', urlView);
            }).catch(error => {
                console.error("Lỗi khi tải nội dung:", error);
            });
        }
    }
    //
    // listener event over the page
    document.addEventListener("click", executePanel);

    function executePanel(e) {
        const targetLinks = e.target.closest("a.app-header-link");
        const targetNews = e.target.closest("a.news-item-header");
        const targetNewsLink = e.target.closest("a.news-item-link");
        if (targetLinks) {
            e.preventDefault();
            const bundleId = targetLinks.getAttribute("data-bundleid");
            openPanel(json, bundleId, '..', "bottom");
        }
        if (targetNewsLink) {
            e.preventDefault();
            const url = targetNewsLink.getAttribute("data-url");
            executeNews('./note/' + url, langText['contents'], "news-popup-link");
        }
        if (targetNews) {
            e.preventDefault();
            const url = targetNews.getAttribute("data-url");
            const title = targetNews.getAttribute("title");
            if (isValidHTTPURL(url)) {
                window.open(url, "_blank");
                return;
            }
            executeNews('./note/' + url, title);
        }
    }
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", async () => {
            document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            const target = link.dataset.target;
            if (target == window.oldTargetPage) return;
            window.oldTargetPage = target
            if (target == 'page-source') {
                installSourceAlert.present();
            }
            else if (target == 'page-library') {
                await openPanel('<div id="apps-list"></div>', `<p>${json.name}</p>`, '..', "side", "apps-popup-all");
                addAppList(json);
            }
            else if (target == 'page-news' && json.news.length) {
                const html = `<div id="news" class="section grid_news">${json.news.map(item =>NewsItem(item, false)).join('')}</div>`;
                openPanel(html, `<p>${langText['allnews']}</p>`, '..', "side", "popup-all-news");
            }
            else {
                document.querySelectorAll(".panel.show").forEach(l => l.classList.remove("show"));
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