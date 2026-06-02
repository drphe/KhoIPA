const fs = require('fs');
const path = require('path');

// 1. Hàm trả về ngày hôm qua (Định dạng YYYY-MM-DD)
function getCurrentDate() {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toLocaleDateString('sv-SE');
}

const url = 'https://khoindvn.io.vn/_astro/hoisted.CrTJNMJJ.js';

async function processAndRunScript() {
    try {
        console.log("[Hệ thống] Đang tải file JS từ khoindvn.io.vn...");
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Không thể fetch file. HTTP Status: ${response.status}`);
        }
        const fullText = await response.text();
        console.log("[Hệ thống] Đã tải xong toàn bộ file JS.");

        // 2. Dùng RegEx cắt đoạn từ 'const V' đến trước 'const K'
        const regex = /(const V[\s\S]*?)(?=const K)/;
        const match = fullText.match(regex);

        if (!match || !match[1]) {
            throw new Error("Không tìm thấy đoạn cấu trúc 'const V' hoặc 'const K' trong file.");
        }

        let extractedCode = match[1].trim();

        // Export hai thành phần J và V ra ngoài môi trường Node.js
        extractedCode = `
            ${extractedCode}
            return { J, V };
        `;

        console.log("[Hệ thống] Đang khởi tạo môi trường giả lập trình duyệt và giải mã...");

        // GIẢI PHÁP TRIỆT ĐỂ: Tạo môi trường window và atob giả lập cho hàm Function() của Node.js
        // Khai báo chuẩn xác hostname để hàm b() của họ sinh ra đúng Khóa (Key)
        const sandbox = {
            window: {
                location: {
                    hostname: 'khoindvn.io.vn'
                }
            },
            atob: function(str) {
                return Buffer.from(str, 'base64').toString('binary');
            },
            console: console
        };

        // Thực thi đoạn mã trong môi trường giả lập bằng cách truyền sandbox làm tham số đầu vào
        const executeDynamicCode = new Function('window', 'atob', 'console', extractedCode);
        const { J, V } = executeDynamicCode(sandbox.window, sandbox.atob, sandbox.console);

        // Tiến hành giải mã dữ liệu
        if (typeof J === 'function' && typeof V !== 'undefined') {
            const data = J(V);
            
            if (data && (data.esign || data.ksign)) {
                console.log(`[Hệ thống] 解码成功 (Giải mã thành công)! Tìm thấy ${data.esign?.length || 0} esign và ${data.ksign?.length || 0} ksign.`);
                changed(data);
            } else {
                throw new Error("Dữ liệu giải mã bị rỗng hoặc sai cấu trúc.");
            }
        } else {
            console.warn("⚠️ Không tìm thấy hàm J hoặc biến V sau khi chạy code.");
        }

    } catch (error) {
        console.error("❌ [Lỗi hệ thống]:", error);
    }
}

function changed(data) {
    const repo = {
        name: "Khoindvn Repo",
        identifier: "ios.khoindvn.repo",
        sourceURL: "https://raw.githubusercontent.com/drphe/KhoIPA/main/upload/khoindvn.json",
        iconURL: "https://i.ibb.co/nMt26Lf5/033502f1e155.png",
        website: "https://khoindvn.io.vn",
        ipawebsite: "https://kho-ipa.vercel.app",
        subtitle: "Sideloadly free with DNS and Revoked Cert",
        apps: [{
            "name": "Khoindvn DNS Anti-Revoke ",
            "type": 0,
            "bundleIdentifier": "khoidns.dns.1",
            "version": "5.0.2",
            "versionDate": "2026-06-02",
            "size": 652400,
            "downloadURL": "https://github.com/dns-khoindvn/oci-auto-vm/releases/download/DNS/khoindvn.mobileconfig",
            "developerName": "Khoindvn",
            "localizedDescription": "DNS Required - Direct install only.",
            "iconURL": "https://i.ibb.co/xKm401bg/385e479e7b62.png"
        }]
    };

    let count = 0;
    const yesterdayStr = getCurrentDate();

    if (data.esign && Array.isArray(data.esign)) {
        data.esign.forEach(e => {
            count++;
            repo.apps.push({
                "name": `${e.name} with Cert`,
                "type": 4,
                "bundleIdentifier": `khoidns.esign.${count}`,
                "version": '5.0.2',
                "versionDate": yesterdayStr,
                "size": 12652400,
                "downloadURL": e.url,
                "developerName": "Khoindvn",
                "localizedDescription": `${e.descriptions || ''} - Direct install only.`,
                "iconURL": "https://i.ibb.co/nMt26Lf5/033502f1e155.png"
            });
        });
    }

    if (data.ksign && Array.isArray(data.ksign)) {
        data.ksign.forEach(e => {
            count++;
            repo.apps.push({
                "name": `${e.name} with Cert`,
                "type": 4,
                "bundleIdentifier": `khoidns.ksign.${count}`,
                "version": '1.5.1',
                "versionDate": yesterdayStr,
                "size": 8652400,
                "downloadURL": e.url,
                "developerName": "Khoindvn",
                "localizedDescription": `${e.descriptions || ''} - Direct install only.`,
                "iconURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYlk6oHRX_isIEsA0183yypCcVuMNaseuGzSymQIUY1g&s"
            });
        });
    }

    saveFile(repo, "khoindvn.json");
}

function saveFile(data, filename) {
    try {
        const jsonStr = JSON.stringify(data, null, 2);
        const targetDir = path.join(__dirname, '..', 'upload');
        const targetPath = path.join(targetDir, filename);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        fs.writeFileSync(targetPath, jsonStr, 'utf8');
        console.log(`\n🎉 [Thành công] Đã tạo file thành công tại: ${targetPath}`);
    } catch (err) {
        console.error("❌ Lỗi khi lưu file JSON:", err);
    }
}

processAndRunScript();