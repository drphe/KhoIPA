import { AltStoreBanner } from "../components/AltStoreBanner.js";
import { NavigationBar } from "../components/NavigationBar.js";
import { urlRegex, sourceURL } from "./constants.js";
import UIAlert from "../vendor/uialert.js/uialert.js";
const CACHE_NAME = 'kh0ipa-data-cache-v1';

export function formatVersionDate(arg) {
    let versionDate = new Date(arg);
    if (isNaN(versionDate)) {
        const match = arg.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/); // dd/MM/yyyy hoặc dd-MM-yyyy
        if (match) {
            const [_, day, month, year] = match;
            versionDate = new Date(`${year}-${month}-${day}`);
        }
    }

    if (isNaN(versionDate)) return arg;

    const today = new Date();
    const msPerDay = 60 * 60 * 24 * 1000;
    const msDifference = today - versionDate;

    const daysDiff = Math.floor(msDifference / msPerDay);
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff = Math.floor(daysDiff / 30);

    const month = versionDate.toLocaleString("default", { month: "short" });
    const date = versionDate.getDate();
    const year = versionDate.getFullYear();

    let dateString = `${month} ${date}, ${year}`;

    // Giữ nguyên logic cũ
    if (msDifference <= msPerDay && today.getDate() === versionDate.getDate()) {
        dateString = langText['today'];
    }
    else if (msDifference <= msPerDay * 2) {
        dateString = langText['yesterday'];
    }
    else if (daysDiff < 7) {
        dateString = daysDiff === 1 ? "1 "+langText['dayago'] : `${daysDiff} ${langText['daysago']}`;
    }
    else if (daysDiff >= 7 && daysDiff < 30) {
        dateString = weeksDiff === 1 ? "1 "+langText['weekago'] : `${weeksDiff} ${langText['weeksago']}`;
    }
    else if (daysDiff >= 30 && daysDiff < 365) {
        dateString = monthsDiff === 1 ? "1 "+langText['monthago'] : `${monthsDiff} ${langText['monthago']}`;
    }

    return dateString;
}

export function insertSpaceInSnakeString(string) {
    return string.split(".").slice(-1)[0].split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function insertSpaceInCamelString(string) {
    // https://stackoverflow.com/a/38388188/19227228
    return string.match(/[A-Z][a-z]+|[0-9]+/g).join(" ");
}

export function insertAltStoreBanner(sourceName) {
    document.getElementById("top")?.insertAdjacentHTML("afterbegin", AltStoreBanner(sourceName));
}

export function insertNavigationBar(title) {
    document.getElementById("top")?.insertAdjacentHTML("beforeend", NavigationBar(title));

}

export function isValidHTTPURL(string) {
    var url;
    try {
        url = new URL(string);
    } catch (error) {
        return false;
    }
    return url.protocol == "http:" || url.protocol == "https:";
}

export function formatString(string) {
    if (!string) return undefined;

    // URLs
    const urlArray = string.match(urlRegex);
    // const urlSet = [...new Set(urlArray)]; // Converting to set to remove duplicates
    var result = "";
    urlArray?.forEach(url => {
        string = string.replace(url, `<a href="${url}" target=_blank>${url}</a>`)
        // Remove formatted substring so it won't get formatted again (prevents <a> tag within the href attribute another <a> tag)
        let endIndexOfClosingTag = string.indexOf("</a>") + 4;
        let formattedSubstring = string.substring(0, endIndexOfClosingTag);
        result += formattedSubstring;
        string = string.replace(formattedSubstring, "");
    });

    result += string;

    // New lines
    return result.replaceAll("\n", "<br>");
}

export function setTintColor(color) {
    document.querySelector(":root")?.style.setProperty("--tint-color", `#${color}`);
}

export function setUpBackButton() {
    document.getElementById("back")?.addEventListener("click", () => history.back());
}

export function open(url) {
    window.open(url, "_self");
}

export function showUIAlert(title, message) {
    const uiAlert = new UIAlert({ title, message });
    uiAlert.present();
}

export function showAddToAltStoreAlert(sourceName, actionTitle, actionHandler) {
    const uiAlert = new UIAlert({
        title: langText["addtowhat"].replace(/TEXT/g, sourceName),
        message: langText['addtoesignText']
    });
    uiAlert.addAction({
        title: langText['addtoesign'],
        style: "default",
        handler: () => window.location.href = `esign://addsource?url=${sourceURL}`
    });

    uiAlert.addAction({
        title: `${actionTitle}`,
        style: "default",
        handler: actionHandler
    });
    uiAlert.addAction({
        title: langText['cancel'],
        style: "cancel",
    });
    uiAlert.present();
}

export async function json(url) {
    return await openCachedUrl(url).then(response => response.json()).catch(error => console.error("An error occurred.", url));
}


export function consolidateApps(source) {
  const uniqueAppsMap = new Map();

  source.apps.forEach(app => {
    const bundleID = app.bundleIdentifier;

    // Tạo đối tượng phiên bản để gộp
    const firstVersion = app.versions?.[0] ?? {};
    const appDate = app.versionDate ?? firstVersion.date ?? "2025-01-01";
    const versionInfo = {
      version: app.version ?? firstVersion.version ?? "1.0.0",
      date: appDate,
      size: app.size ?? firstVersion.size ?? 0,
      downloadURL: app.downloadURL ?? firstVersion.downloadURL ?? "",
      localizedDescription: app.localizedDescription ?? firstVersion.localizedDescription ?? ""
    };


    if (uniqueAppsMap.has(bundleID)) {
      const existingApp = uniqueAppsMap.get(bundleID);
      if (appDate > existingApp.versionDate) {
        existingApp.versionDate = appDate;
        existingApp.version = app.version ?? firstVersion.version ?? "1.0.0";
        existingApp.downloadURL = app.downloadURL ?? firstVersion.downloadURL ?? "";
        existingApp.size = app.size ?? firstVersion.size ?? 0;
        existingApp.localizedDescription = app.localizedDescription ?? "";
      }
      existingApp.versions.push(versionInfo);

    } else {
      const newApp = {
        beta: app.beta ?? false,
        name: app.name,
        type: app.type ?? 1,// mặc định là app
        bundleIdentifier: app.bundleIdentifier,
        developerName: app.developerName ?? "",
        subtitle: app.subtitle ?? "",
        localizedDescription: app.localizedDescription ?? "",
        versionDescription: app.versionDescription ?? "",
        tintColor: app.tintColor ?? "00adef",
        iconURL: app.iconURL ?? "./common/assets/img/generic_app.jpeg",
        screenshotURLs: app.screenshotURLs ?? [],
	screenshots : app.screenshots ?? [],
        appPermissions: app.appPermissions ?? {"entitlements": [],"privacy": {}},
        size: app.size ?? firstVersion.size ?? 0,
        version: app.version ?? firstVersion.version ?? "1.0.0",
        versions: app.versions ?? [versionInfo] ?? [],
        versionDate: appDate,
        downloadURL: app.downloadURL ?? firstVersion.downloadURL ?? ""
      };

      uniqueAppsMap.set(bundleID, newApp);
    }
  });
    const consolidatedApps = Array.from(uniqueAppsMap.values());
    consolidatedApps.forEach(app => {
        if (!app.beta && calDiff(app.versionDate) <7) {
	    app.beta = app.versions.length > 1? "updated": "new";
        }
    });
  const newSource = {
    ...source,
    apps: consolidatedApps
  };

  return newSource;
}

function calDiff(dateString) {
    const inputDate = new Date(dateString);
    const currentDate = new Date();

    inputDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    const timeDifferenceMs =  currentDate.getTime() - inputDate.getTime();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    return Math.floor(timeDifferenceMs / MS_PER_DAY);
}
const $ = selector => selector.startsWith("#") && !selector.includes(".") && !selector.includes(" ")
    ? document.getElementById(selector.substring(1))
    : document.querySelectorAll(selector);


export async function prefetchAndCacheUrls(urlList) {
    if (!('caches' in window)) {
        console.warn(`Doesn't support Cache API.`);
        return;
    }
    try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(urlList);
        console.log(`✅ ${urlList.length} URL was successfully cached!`);
    } catch (error) {
        console.error('❌ Prefetch failed.', error);
    }
}

export async function openCachedUrl(url) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
    }
  };
    if (!('caches' in window)) return fetch(url, options);

    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
        fetch(url, {cache: "reload"})
            .then(async (networkResponse) => {
                if (networkResponse.ok) {
                    await cache.put(url, networkResponse.clone());
                }
            })
            .catch(() => {});
        return cachedResponse;
    } else {
        const networkResponse = await fetch(url, {cache: "reload"});
        if (networkResponse.ok) {
            await cache.put(url, networkResponse.clone());
        }
        return networkResponse;
    }
}

export function generateTOC(markdown) {
    const headings = [];
    const headingRegex = /^(#{1,6})\s+(.*)$/gm;
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length; // Số lượng '#'
        const text = match[2].trim(); // Văn bản tiêu đề
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s]+/g, '-').trim();
        headings.push({
            level,
            text,
            id
        });
    }

    let tocHtml = '<ul>';
    let currentLevel = 0;

    headings.forEach(h => {
        if (h.level >= 2 && h.level <= 3) {
            const paddingLeft = (h.level - 2) * 15; // 0px cho ##, 15px cho ###
            tocHtml += `<li style="padding-left: ${paddingLeft}px;"><a href="#${h.id}">${h.text}</a></li>`;
        }
    });
    tocHtml += '</ul>';
    return { tocHtml, headings };
}
export async function copyLinkIPA(text) {
    try {
        await navigator.clipboard.writeText(text);
        showUIAlert("✅ " + langText['success'], langText['copysuccess']);
    } catch (err) {
        showUIAlert("❌ " + langText['error'], langText['copyfailed']);
    }
}
export function wrapLightbox(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    doc.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (!src)
            return; // bỏ qua nếu không có src
        const alt = img.getAttribute('alt') || '';
        const anchor = document.createElement('a');
        anchor.setAttribute('href', src);
        anchor.setAttribute('data-fslightbox', 'gallery');
        img.replaceWith(anchor);
        anchor.appendChild(img);
    });

    doc.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href')?.trim();
        if (!href || href === '#')
            return; // bỏ qua link rỗng hoặc #
        if (link.getAttribute('target') !== '_blank') {
            link.setAttribute('target', '_blank');
        }
    });
    return doc.body.innerHTML;
}

export function activateNavLink(e) {
    document.querySelectorAll(".nav-link").forEach(l => {
        if (l.dataset.target == e)
            l.classList.add("active");
        else
            l.classList.remove("active");
    });
    window.oldTargetPage = e;
    if (e == "page-home") {
        const urlView = new URL(window.location.href);
        urlView.searchParams.delete('note');
        urlView.searchParams.delete('bundleID');
        history.replaceState({}, '', urlView);

    }
}

export function waitForAllImagesToLoad(container) {
    const loaded = () => {
        //console.log('✅ All images settled or 3000ms timeout reached.');
    };
    const allImages = container.querySelectorAll("img.screenshot");
    if (allImages.length === 0)
        return loaded();
    const imagePromises = Array.from(allImages).map(image => new Promise(resolve => {
                const handleSettled = () => {
                    image.onload = null;
                    image.onerror = null;
                    resolve();
                };
                if (image.complete && image.naturalHeight !== 0)
                    return resolve();
                image.onload = handleSettled;
                image.onerror = () => {
                    if (image.id === "app-icon") {
                        image.src = altSourceIcon;
                    } else {
                        image.remove();
                    }
                    handleSettled();
                };
                if (!image.src)
                    image.src = image.src;
            }));
    Promise.race([
            Promise.allSettled(imagePromises),
            new Promise(resolve => setTimeout(resolve, 3000))
        ]).finally(loaded);
}

export const findAppByName = (data, searchName) => {
    if (!data)
        return [];
    const result = [];
    for (const app of data) {
        if (app.name.includes(searchName)) {
            result.push(app);
        }
    }
    return result;
}
export async function translateTo(text) {
  const url = `https://edge.microsoft.com/translate/translatetext?from=&to=${langCode}&isEnterpriseClient=true`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "*/*",
    },
    body: JSON.stringify([text])
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Lỗi hệ thống: ${response.status}`);
    }
    const result = await response.json();
    return result[0].translations[0].text;
  } catch (error) {
    console.error("Lỗi khi gọi API dịch:", error);
    return null;
  }
}

export async function enableNotifications() {
            // Xin quyền thông báo (bắt buộc trên iOS phải qua click)
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                showUIAlert("Trạng thái", "Đã bật thông báo!");
                sendGreeting();
            } else {
                alert("Bạn cần cho phép thông báo để tính năng này hoạt động.");
            }
        }
        
export function sendGreeting() {
            const hour = new Date().getHours();
            let greetingTitle = "";
            let greetingBody = "";

            if (hour < 12) {
                greetingTitle = "Chào buổi sáng! ☀️";
                greetingBody = "Chúc bạn một ngày mới tốt lành và tràn đầy năng lượng.";
            } else if (hour < 18) {
                greetingTitle = "Chào buổi chiều! 🌤️";
                greetingBody = "Bạn đã nghỉ trưa chưa? Tiếp tục làm việc tốt nhé.";
            } else {
                greetingTitle = "Chào buổi tối! 🌙";
                greetingBody = "Kết thúc ngày dài rồi, hãy nghỉ ngơi thật thoải mái.";
            }

            // Gửi dữ liệu vào Service Worker để hiển thị
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SHOW_GREETING',
                    title: greetingTitle,
                    body: greetingBody
                });
            }
        }
    
