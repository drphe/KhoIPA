const translations = {
    vi: {
        addto: "Thêm vào",
        installviaesign: "Cài đặt qua Esign",
        downloadipa: "Tải xuống IPA",
        installapp: "Cài đặt ngay",
        copylink: "Sao chép link",
        cancel: "Hủy",
        version: "Phiên bản",
        copysuccess: "Đã sao chép link vào bộ nhớ đệm!\nDán link vào safari hoặc Esign \nTải xuống ⇒ URL ⇒ OK",
        copyfailed: "Không thể sao chép đường dẫn tệp IPA!",
        addtoesign: "Thêm vào Esign",
        addtoesignText: "Nếu bạn có Esign, thêm kho lưu trữ này vào bạn có thể tải các bản cập nhật mới nhất ngay khi có.",
        allversion: "Tất cả phiên bản",
        whatnew: "Tính năng mới",
        preview: "Xem trước",
        get: "Nhận",
        back: "Quay lại",
        done: "Đóng",
        apppermit: "Quyền ứng dụng",
        notpermit: "Thông tin về quyền không được cung cấp trong kho lưu trữ.",
        discovermore: "Khám phá thêm tại",
        unknown: "Không biết",
        more: "thêm",
        allrepo: "Tất cả kho lưu trữ",
        allapps: "Tất cả ứng dụng",
        featuredapps: "Ứng dụng nổi bật",
        allnews: "Tất cả tin tức",
        news: "Tin tức",
        contents: "NỘI DUNG",
        lastupdate: "Cập nhật",
        tablecontent: "Mục Lục",
        howtoinstall: "Cách cài đặt KhoIPA?",
        howtoinstallText: "Chọn nút Chia sẻ → Thêm vào Màn hình chính → Xong",
        today: "Hôm nay",
        yesterday: "Hôm qua",
        monthago: "tháng trước",
        monthsago: "tháng trước",
        dayago: "ngày trước",
        daysago: "ngày trước",
        weekago: "tuần trước",
        weeksago: "tuần trước",
        success: "Thành công",
        errorapp: "Không có app tương ứng.",
        error: "Lỗi",
        about: "Giới thiệu",
        featuredrepo: "Kho lưu trữ nổi bật",
        disclaimer: "Tuyên bố miễn trừ trách nhiệm",
        disclaimerText: "Mọi nội dung gốc đều thuộc quyền sở hữu của các tác giả hợp pháp.\nCác tệp IPA đã chỉnh sửa chỉ được cung cấp nhằm mục đích sử dụng cá nhân và học tập.\nTrang này không có bất kỳ mục đích thương mại nào.",
        updategame: "Trò chơi mới cập nhật",
        updateapp: "Ứng dụng mới cập nhật",
        home: "Trang chủ",
        search: "Tìm kiếm",
        source: "Nguồn",
        view: "Xem",
        entilement: "Quyền bổ sung",
        privacy: "Quyền riêng tư",
        privacyText: "có thể yêu cầu các chứng năng sau",
        entilementText: "Quyền bổ sung là những quyền bổ sung cho phép ứng dụng truy cập vào một số dịch vụ hệ thống, bao gồm cả những thông tin có thể nhạy cảm."
    },
    en: {
        addto: "Add to",
        installviaesign: "Install via Esign",
        installapp: "Install App",
        downloadipa: "Download IPA",
        copylink: "Copy Link IPA",
        cancel: "Cancel",
        version: "Version",
        copysuccess: "Copied to clipboard! \nPaste the link into Safari or Esign \nDownload ⇒ URL ⇒ OK",
        copyfailed: "Unable to copy the IPA download link!",
        addtoesign: "Add to Esign",
        addtoesignText: "If you have Esign, add this source so you'll receive notifications when app updates are available.",
        allversion: "All Versions",
        whatnew: "What's New",
        preview: "Preview",
        get: "GET",
        done: "Done",
        back: "Back",
        apppermit: "App Permissions",
        notpermit: "The developer has not specified any permissions for this app.",
        discovermore: "Discover More On",
        unknown: "Unknown",
        more: "more",
        allrepo: "All Repositories",
        allapp: "All Apps",
        featuredapps: "Featured Apps",
        allnews: "All News",
        news: "News",
        contents: "CONTENTS",
        lastupdate: "Last updated",
        tablecontent: "Table Content",
        howtoinstall: "How to Install KhoIPA?",
        howtoinstallText: "Select Share Button -> Add To Home Screen  -> Done",
        today: "Today",
        yesterday: "Yesterday",
        monthago: "month ago",
        monthsago: "months ago",
        dayago: "day ago",
        daysago: "days ago",
        weekago: "week ago",
        weeksago: "weeks ago",
        success: "Success",
        error: "Error",
        errorapp: "No corresponding app found.",
        view: "View",
        entilement: "Entitlements",
        privacy: "Privacy",
        privacyText: "may request to access the following",
        entilementText: "Entitlements are additional permissions that grant access to certain system services, including potentially sensitive information."
    }
};

window.langCode = getAppLanguage();
window.langText = translations[langCode] || translations['en'];

window.oldTargetPage = "page-home";

document.querySelector('meta[property="og:url"]')?.setAttribute("content", window.location.origin);
document.querySelectorAll('span[data-text]').forEach(
    span => span.textContent = langText[span.dataset.text] ?? span.textContent);

export const urlSearchParams = new URLSearchParams(window.location.search);
export const sourceURL = base64Convert(
        decodeURIComponent(urlSearchParams.get('source')?.replaceAll("+", "%2B") ?? 'aHR0cHMlM0ElMkYlMkZyYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJTJGZHJwaGUlMkZLaG9JUEElMkZtYWluJTJGdXBsb2FkJTJGcmVwby5mYXZvcml0ZS5qc29u'),
        'decode');

export const bundleID = urlSearchParams.get('bundleID') ?? '';
export const noteURL = urlSearchParams.get('note') ?? '';
export const dirNoteURL = "https://drphe.github.io/KhoIPA/view/?note=";

export const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;()]*[-A-Z0-9+&@#\/%=~_|)])/ig;

export function base64Convert(text, mode = 'encode') {
    if (mode === 'encode') {
        return btoa(encodeURIComponent(text));
    } else if (mode === 'decode') {
        try {
            const urlDecoded = decodeURIComponent(text);
            return decodeURIComponent(atob(urlDecoded));
        } catch (e) {
            console.error("Base64 decode failed:", e);
            return null;
        }
    } else {
        throw new Error("Accept only 'encode' or 'decode'.");
    }
}

export function getAppLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.toLowerCase().split('-')[0];
    return langCode;
}