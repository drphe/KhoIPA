import {
    urlSearchParams,
    sourceURL,
    noteURL,
    dirNoteURL,
    bundleID,
    base64Convert
} from "./common/modules/constants.js";
import {
    $,
    formatVersionDate,
    showUIAlert,
    json,
    consolidateApps,
    isValidHTTPURL,
    prefetchAndCacheUrls,
    openCachedUrl,
    onUpdateRepo,
    generateTOC,
    activateNavLink,
    wrapLightbox,
    enableNotifications
} from "./common/modules/utilities.js";
import {AppBanner}from "./common/components/AppWeb.js";
import {AppHeader}from "./common/components/AppHeader.js";
import {NewsItem}from "./common/components/NewsItem.js";
import {openPanel,addAppList}from "./common/components/Panel.js";
import UIAlert from "./common/vendor/uialert.js/uialert.js";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('noti.js');
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.action === 'refresh') {
            window.isReload = false;
            location.reload();
        }
    });
}
(async () => {
    $("#top")?.insertAdjacentHTML("afterbegin", AppBanner("Kho IPA Mod"));
    // fetch Data
    const sources = await json("./common/assets/json/sources.json");
    const featuredSources = (await Promise.all(sources.featured.map(async url => {
        try {
            return await fetchSource(url);
        }
        catch (e){
            return null;
        }
    }))).filter(Boolean);
    const randCode = (e) => {
        const b64 = base64Convert(e);
        const mid = Math.floor(b64.length / 2);
        return b64.slice(0, 2) + b64.slice(mid - 1, mid + 1) + b64.slice(-2);
    }
    // Set News
    const jsonNews = featuredSources[0].news;
    let jsonNewsUrl = [];
    if (jsonNews && jsonNews.length >= 1) {
        // Sort news in decending order of date (latest first)
        jsonNews.sort((a, b) => // If b < a
            (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());
        if (jsonNews.length == 1) {
            $("#news-items").insertAdjacentHTML("beforeend", NewsItem(jsonNews[0], true));
            $("#news-items").classList.add("one");
        }
        else {
            for (let i = 0; i < jsonNews.length; i++) {
                if (!jsonNews[i].notify) continue;
                $("#news-items").insertAdjacentHTML("beforeend", NewsItem(jsonNews[i], true));
                const url = jsonNews[i].url?.replace(dirNoteURL, "");
                if (url && !isValidHTTPURL(url)) jsonNewsUrl.push('./view/note/' + url);
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
    else $("#news").remove();
    const otherSources = (await Promise.all(sources.other.map(async url => {
        try {
            return await fetchSource(url);
        }
        catch {
            return null;
        }
    }))).filter(Boolean);
    // Sort sources by last updated
    otherSources.sort((a, b) => b.lastUpdated - a.lastUpdated);
    const fixYear = (d) => {
        let x = new Date(d),
            y = new Date().getFullYear();
        return x.getFullYear() > y + 10 ? (x.setFullYear(y - 1), x.toISOString().split("T")[0]) : d
    }
    const allSources = [...featuredSources, ...otherSources]; // chuẩn bị danh sách app
    window.allApps = [];
    let countAllRepo = 0;
    for (const source of allSources) {
        if (!source || !Array.isArray(source.apps)) continue;

        for (const app of source.apps) {
	    if(source.featuredApps?.length) 
	    app.isFeatured = source.featuredApps?.includes(app.bundleIdentifier)??false;
            app.sourceURL = source.sourceURL;
            app.sourceName = source.name;
            app.sourceIconURL = source.iconURL;
            app.sourceTintColor = source.tintColor;
            app.bundleIdentifier += `@${source.identifier}`;
            app.versionDate = app.versionDate ? fixYear(app.versionDate) : '';
        }
        //const nonBetaApps = source.apps.filter(app => !app.beta);
        allApps.push(...source.apps);
	countAllRepo++;
    }
    // insert editor's source choice
    for (const source of featuredSources) {
        await insertSource(source, "source-items");
    }
    // cuộn ngang
    var swiper = new Swiper(".mySwiperSources", {
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
    // sort app 
    allApps.sort((a, b) => {
        const dateA = new Date(a.versionDate ?? a.versions?.[0]?.date ?? 0).valueOf();
        const dateB = new Date(b.versionDate ?? b.versions?.[0]?.date ?? 0).valueOf();
        return dateB - dateA;
    });
    // insert newest app
    let count = 1,
        maxapps = 30;
    let allAppsView = allApps.filter(s => s.type == 1 && s.beta == "updated");
    allAppsView.forEach(app => {
        if (count > maxapps) return;
        $("#suggestions").insertAdjacentHTML("beforeend", AppHeader(app));
        count++;
    });
    count = 1, allAppsView = allApps.filter(s => s.type == 2 && s.beta == "updated");
    allAppsView.forEach(app => {
        if (count > maxapps) return;
        $("#suggestions2").insertAdjacentHTML("beforeend", AppHeader(app));
        count++;
    });
    count = 1, allAppsView = allApps.filter(s => s.isFeatured);
    allAppsView.forEach(app => {
        if (count > maxapps) return;
        $("#suggestions3").insertAdjacentHTML("beforeend", AppHeader(app));
        count++;
    });
    // cuộn ngang
    const sliders = document.querySelectorAll('#suggestions, #suggestions2,#suggestions3');
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;
        let isDragging = false;
        slider.addEventListener('mousedown', e => {
            isDown = true;
            isDragging = false; // Reset lại trạng thái khi mới nhấn chuột
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            e.preventDefault();
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', (e) => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', e => {
            if (!isDown) return;
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            if (Math.abs(x - startX) > 5) {
                isDragging = true;
            }
            slider.scrollLeft = scrollLeft - walk;
        });
        slider.addEventListener('click', e => {
            if (isDragging) {
                e.preventDefault();
            }
        }, true);
    });

    document.body.classList.remove("loading"); // kết thúc load dữ liệu
    $("#loading")?.remove();

    const bundleIdToSourceMap = new Map();
    allSources.forEach(sourceTarget => {
        sourceTarget.apps.forEach(app => {
            bundleIdToSourceMap.set(app.bundleIdentifier, sourceTarget);
        });
    });
    async function fetchSource(url) {
        const data = await json(url, onUpdateRepo);
        const source = consolidateApps(data);
        source.sourceURL = url
        if (!source) return;
        source.lastUpdated = new Date("1970-01-01");
        source.appCount = 0;
        for (const app of source.apps) {
            if (app.patreon?.hidden) continue;
            let appVersionDate = new Date(app.versions?.[0]?.date ?? app.versionDate);
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
    async function insertSource(source, id = "sources-list", position = "beforeend", flag = true) {
        let imgApps = "";
        let count = 1;
        const checkBeta = (inputValue) => {
            if (typeof inputValue === 'boolean') {
                return inputValue === true ? "beta" : undefined;
            }
            else if (typeof inputValue === 'string') {
                return inputValue;
            }
            return undefined;
        }
        source.apps.forEach(app => {
            if (count > 4) return;
            if (isValidHTTPURL(app.iconURL)) {
                imgApps += `<a href="#" data-bundleid = "${app.bundleIdentifier}"  class="app-header-link" style="display: inline-grid;justify-items: center;">
				<img class="app-panel-icon  skeleton-effect-blink skeleton-block" src="${app.iconURL}" alt="source-icon" onerror="this.onerror=null; this.src='./common/assets/img/generic_app.jpeg';" onload="this.nextElementSibling.style.opacity='1';this.classList.remove('skeleton-effect-blink', 'skeleton-block');">
				<span class="small ${checkBeta(app.beta)} badge" style="position: sticky;opacity:0;transform: translate(0px, -75px);"></span>
				</a>`;
                count++;
            }
        });
        $(`#${id}`).insertAdjacentHTML(position, `
            <div class="source-container swiper-slide">
				<div class="item" style="height:150px;padding:0px;opacity:0.9;background-color: #${source.tintColor.replaceAll("#", "")};
				margin: 0px;border-radius: 1.5rem 1.5rem 0 0;">
					<div class="text" style="margin: 0em;background: linear-gradient(to top, var(--color-transparent-dark) 50%, rgba(0, 0, 0, 0));
				padding: 1em;height: 80%;text-align: center;">
					${imgApps}
					<div class="text" style="position: relative;color:white;"><p>${source.subtitle ?? ""}</p></div>
					</div> 
				</div>
				<a href="./view/?source=${base64Convert(source.url)}" data-identifier="${source.identifier}" class="source-link">
                    <div class="source" style="background-color: #${source.tintColor.replaceAll("#", "")};
				margin-bottom: 0.75rem;border-radius:${flag ? "0 0 " : ""} 1.5rem 1.5rem;">
                        <img src="${source.iconURL}" class="skeleton-effect-blink skeleton-block" onload="this.classList.remove('skeleton-effect-blink', 'skeleton-block');" alt="source-icon" onerror="this.onerror=null; this.src='./common/assets/img/no-img.png';">
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
    if (noteURL) {
        await executeNews('./view/note/' + noteURL, langText["contents"], "news-popup-link"); //read news
    }
    if (bundleID) { // load app
        const sTarget = bundleIdToSourceMap.get(bundleID);
        if (!sTarget) {
            console.warn(`Source not found for bundleId: ${bundleID}`);
        }
        else openPanel(sTarget, bundleID, ".", "bottom");
    }
    else openPanel({}, ""); // preload panel
    $('#search')?.addEventListener("click", async (e) => {
        e.preventDefault();
        await openPanel('<div id="apps-list"></div>', `<p>${langText['allapps']}</p>`, '.', "side", "apps-popup-all");
        addAppList({
            apps: allApps
        }, 20, 1);
        activateNavLink("page-library");
    });
    $('#search2')?.addEventListener("click", async (e) => {
        e.preventDefault();
        await openPanel('<div id="apps-list"></div>', `<p>${langText['allapps']}</p>`, '.', "side", "apps-popup-all");
        addAppList({
            apps: allApps
        }, 20, 2);
        activateNavLink("page-library");
    });
    $('#search3')?.addEventListener("click", async (e) => {
        e.preventDefault();
        await openPanel('<div id="apps-list"></div>', `<p>${langText['featuredapps']}</p>`, '.', "side", "apps-popup-all");
	let allAppsView = allApps.filter(s => s.isFeatured);
        addAppList({
            apps: allAppsView// thay danh sách featured
        }, 20, 0);
        activateNavLink("page-library");
    });
    //

    function filterSourcesByTitle(keyword) {
        // Lấy tất cả các source-container
        const containers = document.querySelectorAll('#sources-list .source-container');

        // Chuyển keyword về chữ thường để so sánh không phân biệt hoa/thường
        const searchTerm = keyword.toLowerCase();

        let visibleCount = 0;

        containers.forEach(container => {
            // Tìm thẻ p.title bên trong container
            const titleElement = container.querySelector('.source .title');

            if (titleElement) {
                const titleText = titleElement.textContent.toLowerCase();

                // Kiểm tra nếu title chứa keyword
                if (titleText.includes(searchTerm)) {
                    container.style.display = ''; // Hiện
                    visibleCount++;
                } else {
                    container.style.display = 'none'; // Ẩn
                }
            } else {
                // Nếu không tìm thấy title, có thể ẩn hoặc giữ nguyên tùy logic
                container.style.display = 'none';
            }
        });
        return visibleCount;
    }

    function insertSearchBox() {
        const sContainer = $('#sources-list');
        let fillSources = [...allSources];

        // Tạo wrapper chứa input và icon
        const searchWrapper = document.createElement("div");
        searchWrapper.style.cssText = "z-index: 200;align-items: center;justify-content: center;gap: 0.85rem;position: sticky;top:0;padding:0 1rem;"
        searchWrapper.classList.add("search-wrapper")
        // Tạo icon kính lúp
        const searchIcon = document.createElement("span");
        searchIcon.innerHTML = ` <i class="bi bi-search"></i>`
        searchIcon.style.cssText = "position: absolute;left: 1.7rem;top: 1.7rem;transform: translateY(-50%);cursor: pointer;color: rgb(136, 136, 136);z-index:2;";
        // Tạo ô tìm kiếm
        const searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.placeholder = langText['entersource'];
        searchBox.className = "form-control mb-3";
        searchBox.style.cssText = "width: 100%; padding-left: 35px; box-sizing: border-box; border-radius: 20px;backdrop-filter: blur(4px); margin-top: 0.5rem;"
        // Tạo icon x
        const xIcon = document.createElement("span");
        xIcon.innerHTML = ` <span class="totalSearch"></span><i class="bi bi-x-circle-fill"></i>`;
        xIcon.style.cssText = "display:block;position: absolute;right: 0.7rem;top: 1.7rem;transform: translateY(-50%);cursor: pointer;color: rgb(136, 136, 136);scale: 0.7;";
        // Tạo total app
        const totalSCount = xIcon.querySelector(".totalSearch");
        totalSCount.innerText = `${langText['total']} ${allSources.length} repos `;
        xIcon.addEventListener('click', () => {
            searchBox.value = '';
            xIcon.style.display = 'none';
            searchBox.focus();
            let tota = filterSourcesByTitle(searchBox.value);
            totalSCount.innerText = `${langText['total']} ${tota} repos `;
            sContainer.classList.remove("skeleton-text", "skeleton-effect-wave");
            window.scrollTo({
                top: Math.max(0, appsContainer.parentElement.offsetTop - 100),
                behavior: "smooth"
            });
        });
        searchBox.addEventListener('input', () => {
            xIcon.style.display = searchBox.value ? 'block' : 'none';
            let tota = filterSourcesByTitle(searchBox.value);
            totalSCount.innerText = `${langText['total']} ${tota} repos `;

        });
        // Gắn các phần tử
        searchWrapper.appendChild(searchIcon);
        searchWrapper.appendChild(searchBox);
        searchWrapper.appendChild(xIcon);
        sContainer.before(searchWrapper);
    }
    // view all source
   $('#all-source')?.addEventListener("click", async (e) => {
        e.preventDefault();
        await openPanel('<div id="sources-list"></div>', `<p>${langText['allrepo']} </p>`, '.', "side", "sources-popup-all");
	insertSearchBox();
        for (const source of allSources) {
            await insertSource(source);
        }
        activateNavLink("page-source");
    });
    // open app
    document.addEventListener("click", (event) => {
        const targetLink = event.target.closest("a.app-header-link");
        const targetInstall = event.target.closest("a.install-app");
        const targetNews = event.target.closest("a.news-item-header");
        const targetNewsLink = event.target.closest("a.news-item-link");
	const sourceLink = event.target.closest("a.source-link");
	const showAppPanel = async (so) => {
            await openPanel('<div id="apps-list"></div>', `<p>${so.name} (${so.apps.length})</p>`, '.', "side", "apps-popup-all");
            addAppList({ apps: so.apps }, 20, 0);
            activateNavLink("page-library");
        };
        if (sourceLink) {
            event.preventDefault(); 
            const identifier = sourceLink.getAttribute("data-identifier");
            let act = sourceLink.getAttribute("data-action");
            let so = allSources.find(s => s.identifier == identifier) ?? undefined;
            if (so) {
                const repoAlert = new UIAlert({
                    title: so.name,
                    message: ""
                });
                repoAlert.addAction({
                    title: langText['viewdetail'],
                    style: "default",
                    handler: () => window.location.href = sourceLink.href
                });
                repoAlert.addAction({
                    title: langText["quicksearch"],
                    style: "default",
                    handler: ()=>showAppPanel(so)
                });
		let othertext = "";
		if(so.sourceURL.includes("KhoIPA/main/upload/repo")){
                   repoAlert.addAction({
                    title: langText['copylink']+ ` (Altstore)`,
                    style: "default",
                    handler: () => {
			navigator.clipboard.writeText(so.sourceURL.replace(/\.json$/, '.altstore.json')); 
			showUIAlert(langText['success'], "Link source copied!");
		    }
                   });
		   othertext = " (Esign/Feather)"
		}
                repoAlert.addAction({
                    title: langText['copylink']+ othertext,//Esign, Feather, Ksign
                    style: "default",
                    handler: () => {navigator.clipboard.writeText(so.sourceURL); showUIAlert(langText['success'], "Link source copied!");}
                });

                repoAlert.addAction({
                    title: langText['cancel'],
                    style: "cancel",
                });
                act ? repoAlert.present():showAppPanel(so);
            }
        } 
        if (targetInstall) {
            event.preventDefault();
     	    if(window.isReload){
		window.isReload = false;
		location.reload();
	    }else if (!isPWA) showUIAlert(langText['howtoinstall'], langText['howtoinstallText']);
            else enableNotifications();
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
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", async () => {
        // Thêm hiệu ứng haptic nhẹ (nếu được hỗ trợ)
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
        document.querySelectorAll('.nav-link').forEach(nav => {
            nav.classList.remove('active');
            nav.style.transform = 'scale(1)';
        });
            link.classList.add("active");
        // Animation bounce nhẹ
        link.style.animation = 'springBounce 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        setTimeout(() => {
            link.style.animation = '';
        }, 400);

            const target = link.dataset.target;
            if (target == window.oldTargetPage) return;
            window.oldTargetPage = target
            if (target == 'page-source') {
                await openPanel('<div id="sources-list"></div>', `<p>${langText['allrepo']}</p>`, '.', "side", "sources-popup-all");
		insertSearchBox();
                for (const source of allSources) {
                    await insertSource(source);
                }
            }
            else if (target == 'page-library') {
                await openPanel('<div id="apps-list"></div>', `<p>${langText['allapps']}</p>`, '.', "side", "apps-popup-all");
                addAppList({
                    apps: allApps
                }, 20);
            }
            else if (target == 'page-news') {
                const html = `<div id="news" class="section grid_news">${jsonNews.map(item =>NewsItem(item, true)).join('')}</div>`;
                openPanel(html, `<p>${langText["allnews"]} (${jsonNews.length})</p>`, '.', "side", "popup-all-news");
            }
            else {
                document.querySelectorAll(".panel.show").forEach(l => l.classList.remove("show"));
                document.body.classList.remove('no-scroll');
            }
        });
    });

    function executeNews(url, title, id = 'news-popup-content') {
        id += Math.random().toString(36).substring(2, 6);
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
            urlView.searchParams.set('note', url.replace("./view/note/", ""));
            history.replaceState({}, '', urlView);
        }).catch(error => {
            console.error("Lỗi khi tải nội dung:", error);
        });
    }

    const checkNoti = new UIAlert({
        title: langText['checknoti'],
        message:langText['checknotiText']
    });
    checkNoti.addAction({
        title: langText['continu'],
        style: "default",
        handler: enableNotifications
    });
    checkNoti.addAction({
        title: langText['cancel'],
        style: "cancel",
    });
    isPWA &&"Notification" in window && Notification.permission === "default" && checkNoti.present();
    let isScrolling = false;
    const title = $("h1");
    const navBar = $("#nav-bar");
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
