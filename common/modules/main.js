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
        window.installSourceAlert = new UIAlert({
            title: langText['whichapp']
        });
	if(supportType == 'both' || supportType == 'Esign') {
        	installSourceAlert.addAction({
            		title: langText['addto']+" Esign",
            		style: 'default',
	    		handler: () => checkScheme(`esign://addsource?url=${sourceURL}`)
        	});
	}
	if(supportType == 'both' || supportType == 'Feather') {
        	installSourceAlert.addAction({
            		title: langText['addto']+" Feather",
            		style: 'default',
	    		handler: () => checkScheme(`feather://source/${sourceURL}`)
        	});
	}
        installSourceAlert.addAction({
            	title: langText['copylink'],
            	style: 'default',
	    	handler: () => {navigator.clipboard.writeText(sourceURL); showUIAlert(langText['success'], "Link source copied!");}
        });
        installSourceAlert.addAction({
            title: langText['cancel'],
            style: 'cancel',
        });
        document.getElementById('add-to-altstore').addEventListener('click', function(event) {
           installSourceAlert.present();
        });
	json.sourceURL ??= sourceURL;
        setApps(json.apps);
        callback(json);
        // loaded();
        waitForAllImagesToLoad();
    }).catch(error => {
        alert(error);
        open(`${fallbackURL}?source=${base64Convert(sourceURL)}`);
    });
   
function checkScheme(urlScheme) {
    let hasHidden = false;
    const onHide = () => {
        hasHidden = true;
        clearTimeout(timer);
        document.removeEventListener('visibilitychange', onHide);
    };
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            onHide();
        }
    });
    window.location.href = urlScheme;
    const timer = setTimeout(() => {
        if (!hasHidden) {
            showUIAlert(langText['error'], langText['errorapp']);
        }
    }, 2000);
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
            newImage.onload = imageLoaded;
            newImage.onerror = () => {
                if (image.id === "app-icon") {
                    image.src = `${fallbackURL}common/assets/img/generic_app.jpeg`;
                } else {
                    image.remove();
                }
                imageLoaded();
            };
            newImage.src = image.src;
        });

        function imageLoaded() {
            count++;
            if (count === total) loaded();
        }
        setTimeout(() => {
            if (count < total) loaded();
        }, 3000); 
    }

    function loaded() {
        document.body.classList.remove("loading");
        document.getElementById("loading")?.remove();
    }
}
