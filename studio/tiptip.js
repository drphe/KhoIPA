// save-tiptip-repo.js
// Chạy với Node.js: node save-tiptip-repo.js

const fs = require('fs');
const path = require('path');
const https = require('https');

// Hàm tải nội dung từ URL
function fetchContent(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Hàm parse JS array từ nội dung file JS
function parseJSArray(content, varName) {
    // Tìm pattern: const varName = [...]
    const regex = new RegExp(`const\\s+${varName}\\s*=\\s*(\\[[\\s\\S]*?\\]);`, 'i');
    const match = content.match(regex);
    
    if (!match) {
        console.log(`Không tìm thấy biến ${varName} trong nội dung`);
        return [];
    }
    
    try {
        // Dùng eval để parse array (cẩn thận nhưng an toàn vì dữ liệu từ nguồn tin cậy)
        const arrayString = match[1];
        // Thay thế undefined bằng null để tránh lỗi
        const safeString = arrayString.replace(/undefined/g, 'null');
        const result = eval(`(${safeString})`);
        return Array.isArray(result) ? result : [];
    } catch (e) {
        console.error(`Lỗi parse ${varName}:`, e.message);
        return [];
    }
}

// Hàm chuyển đổi MB/KB/GB sang bytes
function mbToBytes(sizeStr) {
    if (!sizeStr) return 0;
    const match = sizeStr.match(/([\d.]+)\s*(mb|kb|gb)/i);
    if (!match) return 0;
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    switch (unit) {
        case "kb": return Math.round(value * 1024);
        case "mb": return Math.round(value * 1024 * 1024);
        case "gb": return Math.round(value * 1024 * 1024 * 1024);
        default: return 0;
    }
}

// Hàm chuyển đổi dữ liệu
function convertData(items, type) {
    if (!Array.isArray(items)) return [];
    return items.map(item => ({
        name: item.title || "",
        type: type,
        bundleIdentifier: (item.title || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
        version: item.version || "",
        versionDate: item.updated_at || "",
        size: mbToBytes(item.size),
        downloadURL: item.download_url || "",
        developerName: "TiptipIOS",
        localizedDescription: item.description || "",
        iconURL: item.image || ""
    }));
}

// Danh sách các URL và tên biến tương ứng
const dataSources = {
    appdata: {
        url: "https://tiptipios.github.io/tiptip/js/app.js",
        varName: "appdata",
        type: 1
    },
    dylibdata: {
        url: "https://tiptipios.github.io/tiptip/js/dylib.js",
        varName: "dylibdata",
        type: 5
    },
    gtadata: {
        url: "https://tiptipios.github.io/tiptip/js/gta.js",
        varName: "gtadata",
        type: 2
    },
    gamedata: {
        url: "https://tiptipios.github.io/tiptip/js/tiptip.js",
        varName: "gamedata",
        type: 2
    },
    spikedata: {
        url: "https://tiptipios.github.io/tiptip/js/spike.js",
        varName: "spikedata",
        type: 2
    },
    yeuthichdata: {
        url: "https://tiptipios.github.io/tiptip/js/yeuthich.js",
        varName: "yeuthichdata",
        type: 1
    }
};

async function main() {
    console.log("=".repeat(50));
    console.log("Bắt đầu tạo repo TiptipIOS");
    console.log("=".repeat(50));
    
    const allItems = {};
    
    // Tải và xử lý từng nguồn
    for (const [key, source] of Object.entries(dataSources)) {
        try {
            console.log(`\n📥 Đang tải: ${key}`);
            console.log(`   URL: ${source.url}`);
            
            const content = await fetchContent(source.url);
            const items = parseJSArray(content, source.varName);
            
            console.log(`   ✓ Tìm thấy ${items.length} items từ ${source.varName}`);
            allItems[key] = items;
            
        } catch (err) {
            console.error(`   ✗ Lỗi: ${err.message}`);
            allItems[key] = [];
        }
    }
    
    // Xây dựng repo
    const repo = {
        name: "TiptipIOS Repo",
        identifier: "ios.tiptip.repo",
        sourceURL: "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/tiptip.json",
        iconURL: "https://i.ibb.co/1tqp6D92/IMG-3612.jpg",
        website: "https://tiptipios.github.io/tiptip/gamehack",
        ipawebsite: "https://kho-ipa.vercel.app",
        subtitle: "Page Share Game,App Hack Free Cho ios (Drive link)\nTất cả đều miễn phí cho ae hết",
        apps: []
    };
    
    // Gộp dữ liệu
    repo.apps.push(...convertData(allItems.appdata, 1));
    repo.apps.push(...convertData(allItems.dylibdata, 5));
    repo.apps.push(...convertData(allItems.gtadata, 2));
    repo.apps.push(...convertData(allItems.gamedata, 2));
    repo.apps.push(...convertData(allItems.spikedata, 2));
    repo.apps.push(...convertData(allItems.yeuthichdata, 1));
    
    console.log("\n" + "=".repeat(50));
    console.log(`📊 Tổng số apps: ${repo.apps.length}`);
    console.log(`   - Type 1: ${repo.apps.filter(a => a.type === 1).length}`);
    console.log(`   - Type 2: ${repo.apps.filter(a => a.type === 2).length}`);
    console.log(`   - Type 5: ${repo.apps.filter(a => a.type === 5).length}`);
    
    // Đảm bảo thư mục upload tồn tại
    const targetDir = path.join(__dirname, '../upload');
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`\n📁 Đã tạo thư mục: ${targetDir}`);
    }
    
    // Lưu file JSON
    const filename = 'tiptip.json';
    const filePath = path.join(targetDir, filename);
    const jsonText = JSON.stringify(repo, null, 2);
    
    fs.writeFileSync(filePath, jsonText, 'utf8');
    
    console.log(`\n✅ Đã lưu file: ${filePath}`);
    console.log(`📦 Kích thước: ${(jsonText.length / 1024).toFixed(2)} KB`);
    console.log(`📝 Số dòng: ${jsonText.split('\n').length}`);
    console.log("\n✨ Hoàn thành!");
}

// Chạy chương trình
main().catch(error => {
    console.error("❌ Lỗi nghiêm trọng:", error);
    process.exit(1);
});