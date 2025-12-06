import { urlSearchParams, sourceURL, base64Convert } from "./constants.js";
import { isValidHTTPURL, setTintColor, insertAltStoreBanner, setUpBackButton, open, consolidateApps, openCachedUrl,showUIAlert } from "./utilities.js";
import UIAlert from "../vendor/uialert.js/uialert.js";

export function main(callback, fallbackURL = "../../") {
    // If no source => default
    //if (!urlSearchParams.has('source')) {
     //   open(fallbackURL);
     //   return;
   // }
    // If source is not a valid HTTP URL
     if (!isValidHTTPURL(sourceURL)) {
        showUIAlert("Error","Invalid HTTP URL.");
        open(fallbackURL);
        return;
    }
    var apps;
    window.setApps = array => apps = array;
    window.getAppWithBundleId = bundleId => apps?.find(app => app.bundleIdentifier == bundleId) ?? undefined;
    setUpBackButton();
    openCachedUrl(sourceURL).then(response => response.json()).then(source => {
        const json = consolidateApps(source)
        // Set tint color
        const tintColor = json.tintColor?.replaceAll("#", "");
        if (tintColor) setTintColor(tintColor);
        insertAltStoreBanner(json.name);
        const supportType = detectSupport(source.apps[0]);
        const installAppAlert = new UIAlert({
            title: ` Add to ${supportType}`,
            message: `${json.name} format is ONLY supported for ${supportType} app.`
        });
        installAppAlert.addAction({
            title: "Agree",
            style: 'default',
	    handler: () => {
		supportType === "Esign"
	        ? open(`esign://install?url=${sourceURL}`)
        	: open(`feather://source/${sourceURL}`);
	    }
        });
        installAppAlert.addAction({
            title: "Cancel",
            style: 'cancel',
        });
        document.getElementById('add-to-altstore').addEventListener('click', function(event) {
            const esignTextContainer = document.querySelector('.uibanner .text-container:last-of-type');
            const isEsignVisible = window.getComputedStyle(esignTextContainer).opacity === '1';
            const link = document.querySelector(".add");
            if (supportType === 'both') {
               checkScheme(
    isEsignVisible ? `feather://source/${sourceURL}` : `esign://addsource?url=${sourceURL}`,
    () => console.log("Mở app thành công"),
    () => {navigator.clipboard.writeText(sourceURL),showUIAlert("Success", "Link source copied")}
);
               
            } else installAppAlert.present();
               
        });
		
		if (!json.sourceURL) {
			json.sourceURL = sourceURL;
		}
        setApps(json.apps);
        callback(json);
        // loaded();
        waitForAllImagesToLoad();
    }).catch(error => {
        alert(error);
        open(`${fallbackURL}?source=${base64Convert(sourceURL)}`);
    });
   
function checkScheme(urlScheme, onSuccess, onFail) {
    const start = Date.now();
    window.location.href = urlScheme;

    setTimeout(() => {
        if (Date.now() - start < 1600) {
            onFail();
        } else {
            onSuccess();
        }
    }, 1500);
}
    function detectSupport(app) {
        const supportsESign = !!(app.versionDate || app.fullDate);
        const hasVersionsArray = Array.isArray(app.versions) && app.versions.length > 0;
        const hasFeatherMinimalRoot = typeof app.bundleIdentifier === "string" && typeof app.version === "string" && typeof app.downloadURL === "string";
        const supportsFeather = hasVersionsArray || hasFeatherMinimalRoot;
        if (supportsESign && supportsFeather) return "both";
        if (supportsESign) return "Esign";
        if (supportsFeather) return "Feather";
        return "both";
    }

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
