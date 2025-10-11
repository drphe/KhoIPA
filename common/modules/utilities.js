
import { AltStoreBanner } from "../components/AltStoreBanner.js";
import { NavigationBar } from "../components/NavigationBar.js";
import { urlRegex, sourceURL } from "./constants.js";
import UIAlert from "../vendor/uialert.js/uialert.js";

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

    const month = versionDate.toLocaleString("default", { month: "short" });
    const date = versionDate.getDate();
    const year = versionDate.getFullYear();

    let dateString = `${month} ${date}, ${year}`;

    if (msDifference <= msPerDay && today.getDate() === versionDate.getDate())
        dateString = "Hôm nay";
    else if (msDifference <= msPerDay * 2)
        dateString = "Hôm qua";

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

// https://stackoverflow.com/a/43467144/19227228
export function isValidHTTPURL(string) {
    var url;
    try {
        url = new URL(string);
    } catch (error) {
        console.error("An error occurred.", error);
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
        string = string.replace(url, `<a href="${url}">${url}</a>`)
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
export function setHeaderColor() {
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }

    // Lấy hoặc tạo thẻ meta background-color
    let bgMeta = document.querySelector('meta[name="background-color"]');
    if (!bgMeta) {
      bgMeta = document.createElement('meta');
      bgMeta.setAttribute('name', 'background-color');
      document.head.appendChild(bgMeta);
    }

    // Hàm cập nhật màu theo theme
    function applyThemeColor(isDark) {
      if (isDark) {
        themeMeta.setAttribute('content', '#000000');
        bgMeta.setAttribute('content', '#000000');
        document.documentElement.style.backgroundColor = '#000000';
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffffff';
      } else {
        themeMeta.setAttribute('content', '#ffffff');
        bgMeta.setAttribute('content', '#ffffff');
        document.documentElement.style.backgroundColor = '#ffffff';
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#000000';
      }
    }

    // Theo dõi thay đổi chế độ hệ thống
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyThemeColor(darkModeQuery.matches);
    darkModeQuery.addEventListener('change', e => applyThemeColor(e.matches));
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
        title: `Add "${sourceName}" to AltStore / SideStore?`,
        message: "If you have AltStore beta or SideStore, add this source so you'll receive notifications when app updates are available."
    });
    uiAlert.addAction({
        title: "Add to AltStore / SideStore",
        style: "default",
        handler: () => window.location.href = `altstore://source?url=${sourceURL}`
    });
    uiAlert.addAction({
        title: `${actionTitle} Only`,
        style: "default",
        handler: actionHandler
    });
    uiAlert.addAction({
        title: "Cancel",
        style: "cancel",
    });
    uiAlert.present();
}

export async function json(url) {
    return await fetch(url).then(response => response.json()).catch(error => console.error("An error occurred.", error));
}

export function consolidateApps(source) {
  const uniqueAppsMap = new Map();

  // 1. Duyệt qua từng ứng dụng để xây dựng Map duy nhất và gộp phiên bản
  source.apps.forEach(app => {
    const bundleID = app.bundleIdentifier;

    // Tạo đối tượng phiên bản để gộp
    const firstVersion = app.versions?.[0] ?? {};

    const versionInfo = {
      version: app.version ?? firstVersion.version ?? "1.0.0",
      date: app.versionDate ?? firstVersion.date ?? new Date(),
      size: app.size ?? firstVersion.size ?? 0,
      downloadURL: app.downloadURL ?? firstVersion.downloadURL ?? "",
      localizedDescription: app.localizedDescription ?? firstVersion.localizedDescription ?? ""
    };


    if (uniqueAppsMap.has(bundleID)) {
      // Trường hợp trùng lặp: Lấy đối tượng đã có và thêm phiên bản mới
      const existingApp = uniqueAppsMap.get(bundleID);
      if (app.date > existingApp.versionDate) {
        // Cập nhật thông tin ứng dụng chính (ví dụ: tên, icon) nếu cần, kiểm tra phiên bản
        existingApp.versionDate = app.date;
        existingApp.version = app.version;
        existingApp.downloadURL = app.downloadURL;
        existingApp.size = app.size;
        existingApp.localizedDescription = app.localizedDescription ?? "";
      }
      // Thêm thông tin phiên bản mới vào mảng versions
      existingApp.versions.push(versionInfo);

    } else {
      // Trường hợp duy nhất: Tạo đối tượng mới và thêm vào Map
      const newApp = {
        // Sao chép tất cả các trường không phải phiên bản
        beta: app.beta ?? false,
        name: app.name,
        type: app.type ?? 1,
        bundleIdentifier: app.bundleIdentifier,
        developerName: app.developerName ?? "",
        subtitle: app.subtitle ?? "",
        localizedDescription: app.localizedDescription ?? "",
        versionDescription: app.versionDescription ?? "",
        tintColor: app.tintColor ?? "00adef",
        iconURL: app.iconURL ?? "./common/assets/img/generic_app.jpeg",
        screenshotURLs: app.screenshotURLs ?? [],
        size: app.size ?? firstVersion.size ?? 0,
        version: app.version ?? firstVersion.version ?? "1.0.0",
        versions: app.versions ?? [versionInfo] ?? [],
        versionDate: app.versionDate ?? firstVersion.date ?? new Date(),
        downloadURL: app.downloadURL ?? firstVersion.downloadURL ?? ""
      };

      uniqueAppsMap.set(bundleID, newApp);
    }
  });

  // 2. Tạo đối tượng repo mới với danh sách ứng dụng đã được lọc
  const newSource = {
    ...source,
    apps: Array.from(uniqueAppsMap.values())
  };

  return newSource;
}

const $ = selector => selector.startsWith("#") && !selector.includes(".") && !selector.includes(" ")
    ? document.getElementById(selector.substring(1))
    : document.querySelectorAll(selector);