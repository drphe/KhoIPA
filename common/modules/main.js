import { urlSearchParams, sourceURL } from "./constants.js";
import { isValidHTTPURL, setTintColor, insertAltStoreBanner, setUpBackButton, open, consolidateApps } from "./utilities.js";

export function main(callback, fallbackURL = "../../") {

    // If no source
    if (!urlSearchParams.has('source')) {
        open(fallbackURL);
        return;
    }
    // If source is not a valid HTTP URL
    else if (!isValidHTTPURL(sourceURL)) {
        alert("Invalid HTTP URL.");
        open(fallbackURL);
        return;
    }

    var apps;
    window.setApps = array =>
        apps = array;
    window.getAppWithBundleId = bundleId =>
        apps?.find(app => app.bundleIdentifier == bundleId) ?? undefined;

    setUpBackButton();

document.getElementById("add-to-altstore").addEventListener("click", e => {
  e.preventDefault();
  // Tìm container đang hiển thị (opacity = 1)
  const visibleContainer = Array.from(document.querySelectorAll('.text-container'))
    .find(container => window.getComputedStyle(container).opacity === '1');
console.log(visibleContainer)
  if (!visibleContainer) return;

  const titleText = visibleContainer.querySelector('.title-text');
  if (!titleText) return;

  const appName = titleText.textContent.trim().toLowerCase();

  if (appName.includes('esign')) {
    open(`esign://addsource?url=${sourceURL}`);
  } else if (appName.includes('altstore')) {
    open(`altstore://source?url=${sourceURL}`);
  }
});

    fetch(sourceURL)
        .then(response => response.json())
        .then(source => {
	    const json = consolidateApps(source)
            // Set tint color
            const tintColor = json.tintColor?.replaceAll("#", "");
            if (tintColor) setTintColor(tintColor);

            insertAltStoreBanner(json.name);
	    AltStoreBannerUpdate(sourceURL);

            setApps(json.apps);
            callback(json);
            // loaded();
            waitForAllImagesToLoad();
        })
        .catch(error => {
            alert(error);
            open(`${fallbackURL}?source=${sourceURL}`);
        });

    function waitForAllImagesToLoad() {
    const allImages = document.querySelectorAll("img");
    let count = 0;
    const total = allImages.length;

    if (total === 0) {
        loaded();
        return;
    }

    allImages.forEach((image) => {
        const newImage = new Image(); // same as document.createElement("img")

        // Khi ảnh load xong hoặc lỗi, đều gọi imageLoaded()
        newImage.onload = imageLoaded;
        newImage.onerror = () => {
            // Xử lý fallback cho ảnh lỗi
            if (image.id === "app-icon") {
                image.src = `${fallbackURL}common/assets/img/generic_app.jpeg`;
            } else {
                image.remove();
            }
            imageLoaded();
        };

        // Bắt đầu tải
        newImage.src = image.src;
    });

    function imageLoaded() {
        count++;
        if (count === total) loaded();
    }
    setTimeout(() => {
    if (count < total) loaded();
}, 3000); // sau 3 giây thì ép hoàn tất
}

function loaded() {
    document.body.classList.remove("loading");
    document.getElementById("loading")?.remove();
}
}
