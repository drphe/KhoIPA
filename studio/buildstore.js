#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Khai báo fetch cho Node.js cũ
if (!globalThis.fetch) {
    globalThis.fetch = require('node-fetch');
}

const jsonFile = {
    "name": "Build Store",
    "identifier": "io.build.store",
    "subtitle": "BuildStore – safe and trustworthy app store for iOS",
    "description": "BuildStore – safe and trustworthy app store for iOS",
    "iconURL": "https://raw.githubusercontent.com/drphe/KhoIPA/main/icon/buildstore.png",
    "website": "https://builds.io/explore",
    "sourceURL": "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/repo.buildstore.json",
    "tintColor": "3c2474",
    "featuredApps": [],
    "apps": [],
    "news": [
        {
            "title": "New Year Sale!",
            "identifier": "news-i1krpao8oc",
            "caption": "50% off 6-month & annual plans.",
            "date": "2026-01-06",
            "tintColor": "#2b1141",
            "imageURL": "https://i.ibb.co/kgq5wkP6/5f6e569b24fe.png",
            "notify": true,
            "url": "https://builds.io/payment/checkout",
            "appID": null
        },
        {
            "title": "Welcome to Build Store Repo!",
            "identifier": "buildstore.public.init",
            "caption": "Tap to open our App Store",
            "date": "2025-11-18",
            "tintColor": "#3a2a55",
            "imageURL": "https://i.ibb.co/3yhqBxqH/a53862b58d86.png",
            "notify": true,
            "url": "https://builds.io/explore",
            "appID": null
        }
    ]
};


const ENCODED_CREDENTIALS = {
    e: "eWV1bmd1b2lraG9uZ2N1b2k1QGdtYWlsLmNvbQ==",
    p: "enlzUHVqLXdpeHB5aC1oeWJuZTU=" 
};

// Hàm giải mã thông tin đăng nhập
function decodeCredentials() {
    try {
        const email = Buffer.from(ENCODED_CREDENTIALS.e, 'base64').toString('utf-8');
        const password = Buffer.from(ENCODED_CREDENTIALS.p, 'base64').toString('utf-8');
        return { email, password };
    } catch (error) {
        console.error("Lỗi giải mã credentials:", error);
        return null;
    }
}

// Lấy credentials đã giải mã
const LOGIN_CREDENTIALS = decodeCredentials();

let authToken = null;
let appsWithoutDownloadURL = []; // Lưu danh sách app không có link tải

// Biến toàn cục lưu thông tin từ response đăng nhập
let authData = {
    accessToken: null,
    refreshToken: null,
    userInfo: null
};

// Hàm đăng nhập lấy token
async function loginBuildStore() {
    console.log("🔐 Đang đăng nhập vào BuildStore API...");
    
    // Thông tin đăng nhập đã được mã hóa
    const ENCODED_CREDENTIALS = {
        email: "eWV1bmd1b2lraG9uZ2N1b2k1QGdtYWlsLmNvbQ==",
        password: "enlzUHVqLXdpeHB5aC1oeWJuZTU="
    };
    
    const LOGIN_CREDENTIALS = {
        email: Buffer.from(ENCODED_CREDENTIALS.email, 'base64').toString('utf-8'),
        password: Buffer.from(ENCODED_CREDENTIALS.password, 'base64').toString('utf-8')
    };
    
    try {
        const response = await fetch("https://ng-api.builds.io/api/v1/auth/token/", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "accept-language": "vi",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"148\", \"Microsoft Edge\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "Referer": "https://builds.io/"
            },
            body: JSON.stringify(LOGIN_CREDENTIALS)
        });
        
        if (!response.ok) {
            throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Lưu thông tin từ response
        authData = {
            accessToken: data.credentials.access,
            refreshToken: data.credentials.refresh,
            userInfo: data.user
        };
        
        console.log("✅ Đăng nhập thành công!");
        console.log(`👤 Tài khoản: ${authData.userInfo.email}`);
        console.log(`📝 Access Token: ${authData.accessToken.substring(0, 30)}...`);
        
        return authData.accessToken;
        
    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error.message);
        throw error;
    }
}

// Hàm tạo session cookie từ user info
function createSessionCookie() {
    if (!authData.userInfo) return "";
    
    const sessionData = {
        avatar: authData.userInfo.avatar,
        binom_click_id: authData.userInfo.binom_click_id,
        binom_postback_id: authData.userInfo.binom_postback_id,
        date_joined: authData.userInfo.date_joined,
        email: authData.userInfo.email,
        full_name: authData.userInfo.full_name,
        google_id: authData.userInfo.google_id,
        is_active: authData.userInfo.is_active,
        is_migrated_from_buildstore: authData.userInfo.is_migrated_from_buildstore,
        is_never_paid: authData.userInfo.is_never_paid,
        is_social: authData.userInfo.is_social,
        my_affiliate: authData.userInfo.my_affiliate,
        promo_code: authData.userInfo.promo_code,
        segment: authData.userInfo.segment,
        uuid: authData.userInfo.uuid,
        currentDeviceAndSubscriptionMinInfo: {
            status: "Not recognized"
        }
    };
    
    // Encode session data to Base64
    const sessionJson = JSON.stringify(sessionData);
    const sessionBase64 = Buffer.from(sessionJson).toString('base64');
    return sessionBase64;
}

// Hàm tạo headers đầy đủ như request mẫu
function getAuthHeaders(additionalHeaders = {}) {
    // Tạo cookie string
    const sessionCookie = createSessionCookie();
    const cookieString = `access=${authData.accessToken}; refresh=${authData.refreshToken}; session=${sessionCookie}; _ga=GA1.1.182589412.1778713855; _ga_TFTZSC58VT=GS2.1.s1779367369$o3$g1$t1779367478$j33$l0$h0`;
    
    // Headers cơ bản
    const headers = {
        "accept": "*/*",
        "accept-language": "vi,en;q=0.9,ja;q=0.8,fr;q=0.7,ru;q=0.6,en-US;q=0.5,fr-FR;q=0.4",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Chromium\";v=\"148\", \"Microsoft Edge\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0",
        "cookie": cookieString,
        "Authorization": `Bearer ${authData.accessToken}`,
        ...additionalHeaders
    };
    
    return headers;
}

function consolidateApps(source) {
    const uniqueAppsMap = new Map();
    source.apps.forEach(app => {
        const bundleID = app.bundleIdentifier;
        const firstVersion = app.versions?.[0] ?? {};
        const appDate = normalizeDateFormat(app.versionDate ?? firstVersion.date ?? "2025-01-01");
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
                type: app.type ?? 1,
                bundleIdentifier: app.bundleIdentifier,
                developerName: app.developerName ?? "",
                subtitle: app.subtitle ?? "",
                localizedDescription: app.localizedDescription ?? "Lưu trữ IPA",
                versionDescription: app.versionDescription ?? "",
                tintColor: app.tintColor ?? "00adef",
                iconURL: app.iconURL ?? "./common/assets/img/generic_app.jpeg",
                screenshotURLs: app.screenshotURLs ?? [],
                screenshots: app.screenshots ?? [],
                appPermissions: app.appPermissions ?? {
                    "entitlements": [],
                    "privacy": {}
                },
                size: app.size ?? firstVersion.size ?? 0,
                version: app.version ?? firstVersion.version ?? "1.0.0",
                versions: app.versions ?? [versionInfo] ?? [],
                versionDate: appDate,
                downloadURL: app.downloadURL ?? firstVersion.downloadURL ?? "",
                patreon: app.patreon ?? {},
                download_page_url: app.download_page_url ?? ""
            };
            uniqueAppsMap.set(bundleID, newApp);
        }
    });
    
    const consolidatedApps = Array.from(uniqueAppsMap.values());
    const MAX_VERSIONS = 5;
    consolidatedApps.forEach(app => {
        if (app.versions.length > MAX_VERSIONS) {
            app.versions = app.versions.slice(0, MAX_VERSIONS);
        }
    });
    
    const newSource = {
        ...source,
        apps: consolidatedApps
    };
    newSource.META ||= {
        repoName: newSource.name,
        repoIcon: newSource.iconURL
    };
    newSource.sourceImage ||= newSource.iconURL;
    newSource.sourceURL ||= "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/";
    return newSource;
}

function normalizeDateFormat(dateStr) {
    const dmyRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
    const ymdRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
    if (dmyRegex.test(dateStr)) {
        const [, day, month, year] = dateStr.match(dmyRegex);
        const dd = day.padStart(2, '0');
        const mm = month.padStart(2, '0');
        return `${year}-${mm}-${dd}`;
    } else if (ymdRegex.test(dateStr)) {
        const [, year, month, day] = dateStr.match(ymdRegex);
        const dd = day.padStart(2, '0');
        const mm = month.padStart(2, '0');
        return `${year}-${mm}-${dd}`;
    } else {
        return dateStr;
    }
}

async function mainBuildStore(progressCallback) {
    // Reset danh sách app không có link tải
    appsWithoutDownloadURL = [];
    
    // Đăng nhập trước khi lấy dữ liệu
    try {
        await loginBuildStore();
    } catch (error) {
        console.error("Không thể đăng nhập, thoát chương trình!");
        return;
    }
    
    const apps = await getApplications();
    if (!apps) return;

    let allApp = apps.map(app => ({
        beta: false,
        name: (app.name || "unknown").replace("- iOSGods.com", ""),
        type: getValue(app?.categories?.[0]?.slug),
        bundleIdentifier: `${app?.categories?.[0]?.slug || "app"}.${app.slug}`.replace(/_/g, '-'),
        developerName: "",
        subtitle: app.categories[0].description || "",
        localizedDescription: htmlToMarkdown(app.description || ""),
        versionDescription: "",
        tintColor: "3c2474",
        iconURL: app.icon || "",
        screenshotURLs: [],
        versions: [],
        URL: `https://builds.io/apps/${app?.categories?.[0]?.slug || "app"}/${app.slug || ""}`
    }));

    console.log("Lấy thông tin từng app...");
    let successCount = 0;
    let failureCount = 0;
    let processedCount = 0;
    await processAppsInBatches(allApp);
    console.log(`✅ App lấy thành công: ${successCount} \n ❌ App không lấy được: ${failureCount}`);
    
    // Kiểm tra và lọc app có link tải
    const appsWithDownload = allApp.filter(app => {
        const hasDownload = app.downloadURL !== "";
        if (!hasDownload && app.name) {
            appsWithoutDownloadURL.push({
                name: app.name,
                bundleIdentifier: app.bundleIdentifier
            });
        }
        return hasDownload;
    });
    
    jsonFile.apps = appsWithDownload;
    
    console.log(`\n📊 TỔNG KẾT:`);
    console.log(`═`.repeat(50));
    console.log(`📱 Tổng số app đã xử lý: ${allApp.length}`);
    console.log(`✅ Số app có link tải IPA: ${jsonFile.apps.length}`);
    console.log(`❌ Số app KHÔNG có link tải IPA: ${appsWithoutDownloadURL.length}`);
    
    if (appsWithoutDownloadURL.length > 0) {
        console.log(`\n⚠️ Có ${appsWithoutDownloadURL.length} app không có link tải IPA`);
        console.log(`💾 Đã lưu danh sách chi tiết để kiểm tra sau`);
        
        // Lưu danh sách này ra file để tiện theo dõi
        const uploadDir = path.join(__dirname, '..', 'upload');
        await fs.mkdir(uploadDir, { recursive: true });
        const reportPath = path.join(uploadDir, 'apps_without_download.json');
        await fs.writeFile(reportPath, JSON.stringify(appsWithoutDownloadURL, null, 2));
        console.log(`📄 Xem chi tiết tại: ${reportPath}`);
    } else {
        console.log(`\n🎉 Tuyệt vời! Tất cả app đều có link tải IPA!`);
    }
    
    console.log(`\n💾 Đang lưu file repo.buildstore.json...`);
    
    // Save to ../upload directory
    const uploadDir = path.join(__dirname, '..', 'upload');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const consolidated = consolidateApps(jsonFile);
    const filePath = path.join(uploadDir, 'repo.buildstore.json');
    const filePath2 = path.join(uploadDir, 'repo.buildstore.altstore.json');

    await fs.writeFile(filePath, JSON.stringify(consolidated));
    console.log(`✅ Đã lưu thành công tại: ${filePath}`);
    await fs.writeFile(filePath2, JSON.stringify(transformData(consolidated)));
    console.log(`✅ Đã lưu thành công tại: ${filePath2}`);
    console.log(`═`.repeat(50));
    
    async function processAppsInBatches(allApp) {
        const BATCH_SIZE = 300;
        const totalApps = allApp.length;
        for (let i = 0; i < totalApps; i += BATCH_SIZE) {
            const currentBatch = allApp.slice(i, i + BATCH_SIZE);
            await Promise.all(currentBatch.map(async (app) => {
                const results = await extractNextFData(app.URL);
                processedCount++;
                if (!results || results.length < 1) return;
                const target = results.find(r => typeof r.data === "string" && r.data.includes("appData"));
                if (!target) return;
                let obj;
                try {
                    obj = toJson(target.data);
                    successCount++;
                } catch (e) {
                    failureCount++;
                    return;
                }
                const appData = obj.appData;
                if (!appData) return;
                app.developerName = appData?.developer?.name || "Unknown";
                app.screenshotURLs = appData.images || [];
                app.versions = transformArray(appData.versions || []);
                if (appData.blur_preview) app.beta = "xxx";
                if (appData.is_featured) jsonFile.featuredApps.push(app.bundleIdentifier);
                if (app.versions.length > 5) {
                    app.versions = app.versions.slice(0, 5);
                }
		if(app.versions[0].downloadURL == "") console.log("Không có link!");
                const progressPercentage = Math.min(100, Math.round((processedCount / totalApps) * 100));
                if (progressCallback) progressCallback(progressPercentage);
                if (processedCount % 50 === 0 || processedCount === totalApps) {
                    console.log(`📦 Đã xử lý ${processedCount}/${totalApps} ứng dụng...`);
                }
            }));
        }
    }
}

function getValue(key) {
    const map = {
        "games": 2,
        "ipa_builds": 4,
        "music-audio": 3,
        "emulators": 4
    };
    return map[key] || 1;
}

async function getApplications() {
    console.log("Lấy danh sách App từ Builds.io...");
    const baseUrl = "https://ng-api.builds.io/api/v1/applications/?sort=updated_at&page=";
    const pageSize = 1000;
    try {
        // Sử dụng headers có token
        const headers = getAuthHeaders();
        
        const res = await fetch(`${baseUrl}1&page_size=${pageSize}`, { headers });
        if (!res.ok) throw new Error(`${res.status} - ${res.statusText}`);
        const json = await res.json();
        let apps = [...json.data];
        const total = json.count;
        
        console.log(`Tổng số app trên server: ${total}`);
        
        if (total > 1000) {
            const res2 = await fetch(`${baseUrl}2&page_size=${pageSize}`, { headers });
            if (!res2.ok) throw new Error(res2.status);
            const json2 = await res2.json();
            apps = apps.concat(json2.data);
        }
        if (total > 2000) {
            const res3 = await fetch(`${baseUrl}3&page_size=${pageSize}`, { headers });
            if (!res3.ok) throw new Error(res3.status);
            const json3 = await res3.json();
            apps = apps.concat(json3.data);
        }
        if (total > 3000) {
            const res4 = await fetch(`${baseUrl}4&page_size=${pageSize}`, { headers });
            if (!res4.ok) throw new Error(res4.status);
            const json4 = await res4.json();
            apps = apps.concat(json4.data);
        }
        console.log(`Đã lấy được ${apps.length} apps từ API`);
        return apps;
    } catch (e) {
        console.error("API error", e);
        return null;
    }
}

async function extractNextFData(url) {
    const nextFData = [];
    const headers = getAuthHeaders();
    try {
        const response = await fetch(url, { headers});
        const html = await response.text();
        
        const pushRegex = /self\.__next_f\.push\(\[(\d+),\s*"([\s\S]*?)"\]\)/g;
        let match;
        while ((match = pushRegex.exec(html)) !== null) {
            const id = parseInt(match[1]);
            let raw = match[2];
            raw = raw.replace(/\\"/g, '"').replace(/\\n/g, '');
            nextFData.push({
                id,
                data: raw
            });
        }
        return nextFData;
    } catch (err) {
        console.error("HTML parse error", err);
        return null;
    }
}

function toJson(raw) {
    let cleaned = raw.replace(/\\\\\"/g, '\\"');
    const a = cleaned.indexOf('{"appData"');
    const b = cleaned.lastIndexOf('"success":true}') + '"success":true}'.length;
    if (a === -1 || b === -1) {
        throw new Error("Không tìm thấy đoạn JSON hợp lệ!");
    }
    cleaned = sanitizeJsonString(cleaned.substring(a, b) + "}");
    let start = cleaned.indexOf("{");
    if (start === -1) throw new Error("Không thấy dấu {");
    let stack = 0;
    for (let i = start; i < cleaned.length; i++) {
        if (cleaned[i] === "{") stack++;
        else if (cleaned[i] === "}") stack--;
        if (stack === 0) {
            const jsonText = cleaned.slice(start, i + 1);
            return JSON.parse(jsonText);
        }
    }
    throw new Error("Không tìm được JSON hoàn chỉnh!");
}

function sanitizeJsonString(raw) {
    let cleaned = raw.replace(/\\(?!["\\/bfnrtu])/g, '');
    cleaned = cleaned.replace(/\\r/g, '\\r').replace(/\\n/g, '\\n').replace(/\\t/g, '\\t');
    return cleaned;
}

function transformArray(arr, overrides = {}) {
    return arr.map(item => ({
        version: overrides.version || item.version || "unknown",
        date: overrides.date || item?.created_at?.split("T")[0] || "unknown",
        size: overrides.size || item.ipa_size || 0,
        downloadURL: overrides.downloadURL || item.ipa_url || "",
        localizedDescription: overrides.localizedDescription || htmlToMarkdown(item.changelog || "No description")
    }));
}

function htmlToMarkdown(html) {
    return html
        .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n')
        .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n')
        .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n')
        .replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n')
        .replace(/<h5>(.*?)<\/h5>/gi, '##### $1\n')
        .replace(/<h6>(.*?)<\/h6>/gi, '###### $1\n')
        .replace(/<b>(.*?)<\/b>/gi, '**$1**')
        .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<i>(.*?)<\/i>/gi, '*$1*')
        .replace(/<em>(.*?)<\/em>/gi, '*$1*')
        .replace(/<hr\s*\/?>/gi, '\n---\n')
        .replace(/<p\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
}

        function transformData(oldData) {
            const newData = {
                name: oldData.name ,
                identifier: oldData.identifier,
                sourceURL: oldData.sourceURL.replace(/\.json$/, '.altstore.json'),
                iconURL: oldData.iconURL,
                website: oldData.website,
                ipawebsite: "https://kho-ipa.vercel.app", 
                subtitle: oldData.subtitle,
                apps: []
            };

            if (oldData.apps && Array.isArray(oldData.apps)) {
                oldData.apps.forEach(app => {
                    let vDate = "2026-05-31"; 
                    let fDate = "20260531140000"; 
                    
                    if (app.versionDate) {
                        try {
                            const dateObj = new Date(app.versionDate);
                            if (!isNaN(dateObj.getTime())) {
                                const year = dateObj.getFullYear();
                                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                                const day = String(dateObj.getDate()).padStart(2, '0');
                                vDate = `${year}-${month}-${day}`;
                                
                                const hours = String(dateObj.getHours()).padStart(2, '0');
                                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                                const seconds = String(dateObj.getSeconds()).padStart(2, '0');
                                fDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
                            }
                        } catch (e) {
                            console.error("Lỗi ngày tháng tại ứng dụng: " + app.name);
                        }
                    }

                    newData.apps.push({
                        name: app.name || "",
                        type: app.type || 1,
                        bundleID: app.bundleIdentifier || "",
                        bundleIdentifier: app.bundleIdentifier || "",
                        version: app.version || "",
                        versionDate: vDate,
                        fullDate: fDate,
                        size: app.size || 0,
                        down: app.downloadURL || "",          
                        downloadURL: app.downloadURL || "",
                        developerName: app.developerName || "",
                        localizedDescription: app.localizedDescription || "",
                        icon: app.iconURL || "",              
                        iconURL: app.iconURL || ""
                    });
                });
            }
            return newData;
        }
// Run the main function
mainBuildStore((progress) => {
    // Chỉ hiển thị progress ở những mốc quan trọng
    if (progress % 20 === 0 || progress === 100) {
        //console.log(`🚀 Tiến độ: ${progress}%`);
    }
}).catch(console.error);