// dán vào console
async function getArcade() {
    const parseUrl = "https://ios.codevn.net/category/apple-arcade/page/ANHPHE/";
    const totalPage = 2;
    let targetUrls = [];
    for(let i=1; i<totalPage+1; i++) targetUrls.push(parseUrl.replace("ANHPHE", i))
    const allAppsData = await fetchAndParseMultiplePages(targetUrls);
    const tasks = allAppsData.map(async (app) => {
        const appInfo = await extractGameContent(app.link);
        app.localizedDescription = appInfo.description;
        app.down = appInfo.downloadLink;
        app.downloadURL = app.down;
        app.developerName = appInfo["Nhà phát hành"];
        app.versionDate = convertDate(appInfo["Cập nhật"])
    });
    await Promise.all(tasks);
    var repo = {
        "name": "Game Arcade",
        "identifier": "ios.arcade.repo",
        "sourceURL": "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/repo.game2.json",
        "iconURL": "https://cdn-icons-png.flaticon.com/128/1138/1138847.png",
        "website": "https://ios.codevn.net/category/games/",
        "ipawebsite": "https://kho-ipa.vercel.app",
        "subtitle": "Game Arcade",
        "apps": allAppsData
    }
            const filename = 'repo.game2.json';
            const jsonText = JSON.stringify(repo, null, 2);
            const blob = new Blob([jsonText], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
}
getArcade();

function convertDate(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function parseAppsFromHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const apps = doc.querySelectorAll(".app-container");
    const appData = Array.from(apps).map(app => {
        const link = app.getAttribute("href");
        return {
            name: app.querySelector(".app-title")?.innerText.trim(),
            type: 2,
            bundleID: link.split("/")[3],
            bundleIdentifier: link.split("/")[3],
            description: app.querySelector(".app-desc span")?.innerText.trim(),
            link: link,
            iconURL: app.querySelector(".app-logo")?.getAttribute("src"),
            version: app.querySelector(".app-version")?.innerText.trim()
        };
    });
    return appData;
}
async function fetchAndParseMultiplePages(urls) {
    const allApps = [];
    for (const url of urls) {
        console.log(`Đang lấy dữ liệu từ: ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Lỗi HTTP ${response.status} khi lấy ${url}`);
                continue; // Bỏ qua trang này và tiếp tục với trang tiếp theo
            }
            const html = await response.text();
            const appsOnPage = parseAppsFromHTML(html);
            allApps.push(...appsOnPage);
            console.log(`Đã lấy thành công ${appsOnPage.length} ứng dụng từ ${url}`);
        } catch (error) {
            console.error(`Lỗi khi xử lý URL ${url}:`, error);
        }
    }
    return allApps;
}
// lấy nội dung app
function getInfo(tableHTMLString) {
    const dataObject = {};
    const parser = new DOMParser();
    const doc = parser.parseFromString(tableHTMLString, "text/html");
    const rows = doc.querySelectorAll("tbody tr");
    rows.forEach(row => {
        const headerCell = row.querySelector("th");
        const dataCell = row.querySelector("td");
        if (headerCell && dataCell) {
            let key = headerCell.textContent.trim();
            key = key.replace(/[\s\t\n]+/g, ' ').trim();
            let value = dataCell.textContent.trim();
            value = value.replace(/[\s\t\n]+/g, ' ').trim();
            if (key) {
                dataObject[key] = value;
            }
        }
    });
    return dataObject;
}
async function extractGameContent(url) {
    console.log(`Bắt đầu lấy nội dung từ: ${url}`);
    try {
        // 1. Thực hiện lệnh Fetch
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Lỗi HTTP ${response.status} khi truy cập URL.`);
        }
        const htmlString = await response.text();
        console.log("Đã tải thành công HTML.");
        // 2. Phân tích HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        let finalResult = {};
        const tableElement = doc.querySelector("table.table-striped.table-borderless");
        if (tableElement) {
            // Lấy HTML bên trong thẻ table
            const tableHTML = tableElement.outerHTML;
            finalResult = getInfo(tableHTML);
        } else {
            console.log("Không tìm thấy bảng thông tin ứng dụng (table.table-striped.table-borderless).");
            finalResult.details = null;
        }
        // mô tả
        const entryContentDiv = doc.getElementById("entry-content");
        if (!entryContentDiv) {
            finalResult.description = "Không tìm thấy mô tả ứng dụng.";
        } else {
            let text = entryContentDiv.innerHTML.replace(/<\/p>|<\/h3>|<\/h4>|<\/div>/g, '\n\n');
            text = text.replace(/<[^>]*>/g, '');
            text = text.replace(/(\n\s*){2,}/g, '\n\n');
            text = text.trim();
            finalResult.description = text;
        }
        // link
        const targetLinkElement = doc.getElementById("target-link");
        if (targetLinkElement) {
            const downloadLink = targetLinkElement.getAttribute("href");
            finalResult.downloadLink = downloadLink;
        } else {
            finalResult.downloadLink = null;
            console.log("Không tìm thấy link tải (ID: target-link).");
        }
        // Trả về đối tượng chứa cả hai phần
        return finalResult;
    } catch (error) {
        console.error("Lỗi trong quá trình lấy hoặc xử lý nội dung:", error.message);
        return {
            error: `Đã xảy ra lỗi: ${error.message}`
        };
    }
}
