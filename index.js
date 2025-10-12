import { urlSearchParams, sourceURL, base64Convert } from "./common/modules/constants.js";
import { isValidHTTPURL, open, formatVersionDate, json,  consolidateApps } from "./common/modules/utilities.js";
import { AppBanner } from "./common/components/AppWeb.js";
import UIAlert from "./common/vendor/uialert.js/uialert.js";

const sources = await json("./common/assets/json/sources.json");
const editorsources = await json("./common/assets/json/editorsources.json");


(async function main() {

     if(/iPhone|iPad|Macintosh/i.test(navigator.userAgent)){
    	document.getElementById("top")?.insertAdjacentHTML("afterbegin", AppBanner("Kho IPA Mod"));
	document.getElementById("nav-bar")?.classList.add("hidden");
    }
    // alert install
    const installAppAlert = new UIAlert({
        title: `How to Install?`,
        message: "Bạn sẽ tải về 'hồ sơ cấu hình' bằng cách nhấn Cho phép. Truy cập Cài đặt -> Cài đặt chung -> Quản lý VPN & Thiết bị -> Cài đặt hồ sơ  -> Done."
    });
    installAppAlert.addAction({
        title: "Install",
        style: 'default',
        handler: () =>  open(`setup.mobileconfig`)
    });
    installAppAlert.addAction({
        title: "Cancel",
        style: 'cancel',
    });
    document.querySelectorAll("a.install").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            installAppAlert.present();
        });
    });


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

    function parseDateSmart(input) {
  if (!input) return null;
  // Nếu đã là Date
  if (input instanceof Date) {
    return isNaN(input) ? null : input;
  }
  // Chuỗi
  const s = String(input).trim();

  // yyyy-mm-dd hoặc yyyy/mm/dd
  const ymd = s.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
  if (ymd) {
    const [ , y, m, d ] = ymd.map(Number);
    // Dùng new Date(year, monthIndex, day) để tránh parse implementation-dependent
    return new Date(y, m - 1, d);
  }

  // dd-mm-yyyy hoặc dd/mm/yyyy (thường ở VN)
  const dmy = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (dmy) {
    const [ , d, m, y ] = dmy.map(Number);
    return new Date(y, m - 1, d);
  }

  // Thử parse fallback — nhưng kiểm tra kết quả
  const parsed = new Date(s);
  return isNaN(parsed) ? null : parsed;
}

async function fetchSource(url) {
  const data = await json(url);
  const source = consolidateApps(data);
  if (!source) return;
  source.lastUpdated = new Date(1970, 0, 1); // an toàn hơn new Date("1970-01-01")
  source.appCount = 0;

  if (!Array.isArray(source.apps)) source.apps = [];

  for (const app of source.apps) {
    // bỏ qua app beta / hidden — KHÔNG return (tránh thoát hàm)
    if (app.beta || app.patreon?.hidden) continue;

    // Lấy chuỗi ngày ưu tiên app.versions[0].date rồi app.versionDate
    const dateCandidate = app.versions && app.versions[0] && app.versions[0].date
                          ? app.versions[0].date
                          : app.versionDate;

    const appVersionDate = parseDateSmart(dateCandidate);
    if (!appVersionDate) {
      // không có/không parse được -> bỏ qua
      source.appCount++;
      continue;
    }

    // So sánh (Date objects)
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

    window.onscroll = e => {
        const title = document.querySelector("h1");
        const navBar = document.getElementById("nav-bar");
        const navBarTitle = navBar.querySelector("#title");

        if (title.getBoundingClientRect().y < 36) {
            navBar.classList.remove("hide-border","hidden");
            navBarTitle.classList.remove("hidden");
        } else {
            navBar.classList.add("hide-border");
   	    if(/iPhone|iPad|Macintosh/i.test(navigator.userAgent)) navBar.classList.add("hidden");
            navBarTitle.classList.add("hidden");
        }
    }
})();