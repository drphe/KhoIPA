//code javascript lấy nội dung trang https://applejr.net/
//sau đó áp dụng các hàm sau với html vừa lấy được

// Xây dựng repo
const repo = {
    name: "AppleJr Repo",
    identifier: "ios.applejr.repo",
    sourceURL: "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/applejr.json",
    iconURL: "https://i.imgur.com/QQ563esm.png",
    website: "https://applejr.net",
    ipawebsite: "https://kho-ipa.vercel.app",
    subtitle: "Sideloadly free with DNS and Revoked Cert",
    apps: []
};

// trả về ngày hiện tại
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
// số ngẫu nhiên
function getRandom3Digits() {
    return Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

function extract(id, doc) {
    let count = 0;
    let bundle = id == 'cat-esign' ? 'esign' : id == 'cat-zsign' ? 'ksign' : id == 'cat-scarlet' ? 'scarlet' : 'certificate';
    let version = bundle == "esign" ? '5.0.2' : bundle == 'ksign' ? '1.5.1' : '1.0';
    const cards = doc.querySelectorAll(`#${id} .card`);
    cards.forEach(card => {
        const name = card.querySelector("h3")?.innerText.trim() || "";
        const description = card.querySelector('.left small').textContent.trim();
        const link = card.querySelector("a.badge")?.href || "";
        const iconUrl = card.querySelector("img")?.src || "";
        count++;
        repo.apps.push({
            "name": `${name} ${description.replace("DNS Required","")} `,
            "type": 4,
            "bundleIdentifier": `dns.${bundle}.${count}`,
            "version": version,
            "versionDate": getCurrentDate(),
            "size": 56524000,
            "downloadURL": link,
            "developerName": "Unknow",
            "localizedDescription": `DNS Required ${bundle === 'certificate'? "Download Only": "Direct install only."}`,
            "iconURL": iconUrl
        });
    });
}


function downloadFile(data, filename) {
    let jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], {
        type: 'application/json'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

(async () => {
    try {
        const response = await fetch("https://applejr.net/", {
            headers: {
                "User-Agent": "Mozilla/5.0", // giả lập trình duyệt
            },
        });
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        await extract('cat-esign', doc);
        await extract('cat-zsign', doc);
        await extract('cat-scarlet', doc);
        await extract('cat-certificate', doc);
        downloadFile(repo, "applejr.json");
    } catch (e) {
        console.log(e);
    }
})();