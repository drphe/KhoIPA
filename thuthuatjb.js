// Chạy chương trình
main();
async function fetchScreenshotsForApps(apps) {
  const tasks = apps.map(async (app) => {
    const bundleId = app.bundleIdentifier;
    const url = `https://ipa.thuthuatjb.com/view/lookimg.php?id=${bundleId}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Lỗi khi tải ${url}: ${response.status}`);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Phản hồi không phải JSON từ ${url}`);
      }

      const json = await response.json();
      app.screenshotURLs = json.screenshotUrls || [];
    } catch (error) {
      console.error(`Không thể lấy ảnh cho ${bundleId}:`, error);
      app.screenshotURLs = [];
    }
  });

  await Promise.all(tasks); // Chờ tất cả các request hoàn tất
}

function downloadJsonFile(data, filename = 'updated_repo.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename; // Đặt tên file
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log(`✅ Đã kích hoạt tải xuống file: ${filename}`);
}

async function main() {
  let url = 'https://ipa.thuthuatjb.com/view/read.php';
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Lỗi khi tải dữ liệu ban đầu: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.apps || !Array.isArray(data.apps)) {
      throw new Error("Dữ liệu không hợp lệ hoặc thiếu 'apps'");
    }
    console.log(`Sắp xếp lại dữ liệu...`);

    const source = consolidateApps(data);
    console.log(`Bắt đầu lấy ảnh chụp màn hình cho ${data.apps.length} ứng dụng...`);

    await fetchScreenshotsForApps(source.apps);

    const fileName = "repo.thuthuatjb_updated.json";
    downloadJsonFile(source, fileName);

  } catch (error) {
    console.error("❌ Lỗi khi tải dữ liệu ban đầu hoặc xử lý:", error);
  }
}

function consolidateApps(source) {
  const uniqueAppsMap = new Map();

  source.apps.forEach(app => {
    const bundleID = app.bundleIdentifier;

    // Tạo đối tượng phiên bản để gộp
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
        versionDate: appDate,
        downloadURL: app.downloadURL ?? firstVersion.downloadURL ?? ""
      };

      uniqueAppsMap.set(bundleID, newApp);
    }
  });
  // max 20 versions
  const consolidatedApps = Array.from(uniqueAppsMap.values());
  const MAX_VERSIONS = 20;

  consolidatedApps.forEach(app => {
    // Sắp xếp mảng versions theo ngày (date) giảm dần (mới nhất lên đầu)
    //app.versions.sort((a, b) => {
    //    const dateA = new Date(a.date);
    //    const dateB = new Date(b.date);
    //     return dateB - dateA; // Sắp xếp giảm dần
    //  });

    // Chỉ giữ lại tối đa 5 phiên bản mới nhất
    if (app.versions.length > MAX_VERSIONS) {
      app.versions = app.versions.slice(0, MAX_VERSIONS);
    }
  });

  const newSource = {
    ...source,
    apps: consolidatedApps
  };

  return newSource;
}

function normalizeDateFormat(dateStr) {
  const dmyRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/; // dd-mm-yyyy
  const ymdRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/; // yyyy-mm-dd

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
    return dateStr; // không hợp lệ
  }
}