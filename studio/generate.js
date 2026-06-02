// generate.js
const fs = require('fs');

async function fetchData() {
    try {
        const response = await fetch('https://idapple.csadata4g.me/backend.php');
        const data = await response.json();
        
        if (data.status === 'blocked') {
            console.log('Bị chặn truy cập');
            return;
        }
        
        // Xử lý decode Unicode
        function decodeUnicode(str) {
            if (!str) return '';
            return str.replace(/\\u0026/g, '&')
                      .replace(/\\u003c/g, '<')
                      .replace(/\\u003e/g, '>')
                      .replace(/\\u0022/g, '"')
                      .replace(/\\u0027/g, "'");
        }
        
        // Lấy flag emoji
        function getFlagEmoji(countryCode) {
            if (!countryCode) return '🏳️';
            const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt());
            return String.fromCodePoint(...codePoints);
        }
        
        // Tạo nội dung HTML
        const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apple ID Accounts</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        .container { max-width: 1300px; margin: 0 auto; }
        .header {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .header h1 { color: #333; margin-bottom: 15px; font-size: 24px; }
        .stats {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
        }
        .stat-card span { font-size: 22px; font-weight: bold; margin-right: 5px; }
        .filter-bar {
            background: white;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .filter-bar input, .filter-bar select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            outline: none;
        }
        .filter-bar input { flex: 1; min-width: 200px; }
        .filter-bar button {
            background: #764ba2;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
        }
        .account-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 15px;
        }
        .account-card {
            background: white;
            border-radius: 12px;
            padding: 15px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            border-left: 4px solid #667eea;
            transition: transform 0.2s;
        }
        .account-card:hover { transform: translateY(-3px); }
        .account-card.status-2 {
            border-left-color: #f44336;
            background: #fff5f5;
            opacity: 0.8;
        }
        .info-row {
            margin-bottom: 10px;
            display: flex;
            align-items: baseline;
            gap: 8px;
            font-size: 13px;
        }
        .info-label {
            font-weight: 600;
            color: #666;
            min-width: 70px;
        }
        .info-value { color: #333; word-break: break-all; flex: 1; }
        .clickable {
            background: #f0f0f0;
            padding: 4px 8px;
            border-radius: 5px;
            cursor: pointer;
            font-family: monospace;
            font-size: 12px;
            display: inline-block;
        }
        .clickable:hover { background: #667eea; color: white; }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
        }
        .badge-1 { background: #4caf50; color: white; }
        .badge-2 { background: #f44336; color: white; }
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            animation: slideIn 0.3s;
            z-index: 999;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .loading, .error { text-align: center; padding: 40px; color: white; font-size: 18px; }
        @media (max-width: 768px) {
            .account-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>🍎 Apple ID Accounts</h1>
        <div class="stats">
            <div class="stat-card">📊 Tổng: <span id="totalCount">0</span></div>
            <div class="stat-card">✅ Hoạt động: <span id="activeCount">0</span></div>
            <div class="stat-card">⚠️ Không hoạt động: <span id="inactiveCount">0</span></div>
            <div class="stat-card">🌍 Quốc gia: <span id="countryCount">0</span></div>
            <div class="stat-card">📅 ${data.date || 'N/A'}</div>
        </div>
    </div>
    
    <div class="filter-bar">
        <input type="text" id="searchInput" placeholder="🔍 Tìm kiếm...">
        <select id="countryFilter"><option value="">Tất cả quốc gia</option></select>
        <select id="statusFilter"><option value="">Tất cả</option><option value="1">✅ Hoạt động</option><option value="2">⚠️ Không hoạt động</option></select>
        <button onclick="resetFilters()">🔄 Reset</button>
    </div>
    
    <div id="accountsContainer" class="account-grid"></div>
</div>

<script>
    const accountsData = ${JSON.stringify(data.accounts.map(acc => ({
        ...acc,
        username_decoded: decodeUnicode(acc.username),
        password_decoded: decodeUnicode(acc.password)
    })))};
    
    function decodeUnicode(str) {
        if (!str) return '';
        return str.replace(/\\\\u0026/g, '&').replace(/\\\\u003c/g, '<').replace(/\\\\u003e/g, '>');
    }
    
    function getFlagEmoji(code) {
        if (!code) return '🏳️';
        const points = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt());
        return String.fromCodePoint(...points);
    }
    
    function showToast(msg) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerText = '📋 ' + msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 1500);
    }
    
    async function copyText(text, type) {
        try {
            await navigator.clipboard.writeText(text);
            showToast(\`Đã copy \${type}\`);
        } catch(e) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast(\`Đã copy \${type}\`);
        }
    }
    
    function renderAccounts(accounts) {
        const container = document.getElementById('accountsContainer');
        if (!accounts.length) {
            container.innerHTML = '<div class="error">😕 Không tìm thấy</div>';
            return;
        }
        
        container.innerHTML = accounts.map(acc => {
            const flag = getFlagEmoji(acc.DVS_country_code);
            return \`
                <div class="account-card \${acc.status === 2 ? 'status-2' : ''}">
                    <div class="info-row">
                        <div class="info-label">🔐 #\${acc.STT_DVS}</div>
                        <div class="info-value"><span class="badge badge-\${acc.status}">\${acc.status === 1 ? '✅ Hoạt động' : '⚠️ Không hoạt động'}</span></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">👤 Username:</div>
                        <div class="info-value"><span class="clickable" onclick="copyText('\${acc.username_decoded.replace(/'/g, "\\\\'")}', 'Username')">\${acc.username_decoded}</span></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">🔑 Password:</div>
                        <div class="info-value"><span class="clickable" onclick="copyText('\${acc.password_decoded.replace(/'/g, "\\\\'")}', 'Password')">\${acc.password_decoded}</span></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">🌍 Quốc gia:</div>
                        <div class="info-value">\${flag} \${acc.DVS_country_name || 'N/A'} (\${(acc.DVS_country_code || '').toUpperCase()})</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">⏰ Cập nhật:</div>
                        <div class="info-value">\${acc.DVS_time || acc.time || 'N/A'}</div>
                    </div>
                </div>
            \`;
        }).join('');
    }
    
    function updateStats(accounts) {
        document.getElementById('totalCount').innerText = accounts.length;
        document.getElementById('activeCount').innerText = accounts.filter(a => a.status === 1).length;
        document.getElementById('inactiveCount').innerText = accounts.filter(a => a.status === 2).length;
        document.getElementById('countryCount').innerText = new Set(accounts.map(a => a.DVS_country_code)).size;
    }
    
    function filterAccounts() {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const country = document.getElementById('countryFilter').value;
        const status = document.getElementById('statusFilter').value;
        
        let filtered = accountsData.filter(acc => {
            if (search && !acc.username_decoded.toLowerCase().includes(search) && 
                !acc.password_decoded.toLowerCase().includes(search) &&
                !(acc.DVS_country_name || '').toLowerCase().includes(search)) return false;
            if (country && (acc.DVS_country_code || '').toLowerCase() !== country) return false;
            if (status && acc.status !== parseInt(status)) return false;
            return true;
        });
        
        renderAccounts(filtered);
        updateStats(filtered);
    }
    
    function resetFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('countryFilter').value = '';
        document.getElementById('statusFilter').value = '';
        filterAccounts();
    }
    
    // Khởi tạo dropdown quốc gia
    const countries = [...new Set(accountsData.map(a => a.DVS_country_code).filter(Boolean))];
    const countrySelect = document.getElementById('countryFilter');
    countries.forEach(code => {
        const name = accountsData.find(a => a.DVS_country_code === code)?.DVS_country_name || code;
        const flag = getFlagEmoji(code);
        countrySelect.innerHTML += \`<option value="\${code.toLowerCase()}">\${flag} \${name}</option>\`;
    });
    
    // Render ban đầu
    renderAccounts(accountsData);
    updateStats(accountsData);
    
    // Gắn sự kiện
    document.getElementById('searchInput').addEventListener('input', filterAccounts);
    document.getElementById('countryFilter').addEventListener('change', filterAccounts);
    document.getElementById('statusFilter').addEventListener('change', filterAccounts);
</script>
</body>
</html>`;
        
        // Ghi ra file HTML
        fs.writeFileSync('accounts.html', htmlContent, 'utf8');
        console.log('✅ Đã tạo file accounts.html thành công!');
        console.log(`📊 Tổng số tài khoản: ${data.accounts.length}`);
        console.log(`🌍 Số quốc gia: ${new Set(data.accounts.map(a => a.DVS_country_code)).size}`);
        console.log(`📅 Ngày: ${data.date}`);
        console.log(`🖥️ IP: ${data.ip}`);
        
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
    }
}

// Chạy hàm chính
fetchData();