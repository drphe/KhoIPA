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

    fetch(sourceURL)
        .then(response => response.json())
        .then(source => {
	    const json = consolidateApps(source)
            // Set tint color
            const tintColor = json.tintColor?.replaceAll("#", "");
            if (tintColor) setTintColor(tintColor);
	    let typeSource ='';
	    if(source?.apps && source.apps.length ){
			 typeSource = detectSupport(source.apps[0]);
            		insertAltStoreBanner(json.name,typeSource);
		}
	    document.getElementById('add-to-altstore').addEventListener('click', function(event) {
	        const esignTextContainer = document.querySelector('.uibanner .text-container:last-of-type');
    		const isEsignVisible = window.getComputedStyle(esignTextContainer).opacity === '1';
		const link = document.querySelector(".add");
			if(typeSource == 'feather') {link.href = `feather://source/${sourceURL}`; return;}
			if(typeSource == 'esign') {link.href = `esign://addsource?url=${sourceURL}`; return;}
		      link.href = isEsignVisible ?`feather://source/${sourceURL}`: `esign://addsource?url=${sourceURL}`;
	    });

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
    function detectSupport(app) {
  	const supportsESign = !!(app.versionDate || app.fullDate);
  	const hasVersionsArray = Array.isArray(app.versions) && app.versions.length > 0;
  	const hasFeatherMinimalRoot = typeof app.bundleIdentifier === "string" && typeof app.version === "string" && typeof app.downloadURL === "string";
  	const supportsFeather = hasVersionsArray || hasFeatherMinimalRoot;

  	if (supportsESign && supportsFeather) return "both";
  	if (supportsESign) return "esign";
  	if (supportsFeather) return "feather";
  	return "both";
    }

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
