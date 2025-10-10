import { sourceURL, base64Convert } from "../modules/constants.js";
import { formatVersionDate } from "../modules/utilities.js";

export const AppHeader = (app, x = ".") => app ? `
<div class="app-header-container">
<a href="${x}/app/?source=${base64Convert(sourceURL)}&id=${app.bundleIdentifier}" class="app-header-link">
    <div class="app-header-inner-container">
        <div class="app-header">
            <div class="content">
                <img id="app-icon" src="${app.iconURL}" onerror="this.onerror=null; this.src='./common/assets/img/generic_app.jpeg';" alt="">
                <div class="right">
                    <div class="text">
                        <p class="title">${app.name}</p>
                        <p class="subtitle">${app.version ? app.version + ' &middot; ': ''}${app.versionDate ? formatVersionDate(app.versionDate): formatVersionDate(app.versions[0].date)}</p>
                    </div>
                        <button class="uibutton" style="background-color: ${app.tintColor ? "#" + app.tintColor.replaceAll("#", "") : "var(--tint-color);"};">View</button>
                    </div>
                </div>
            <div class="background" style="background-color: ${app.tintColor ? "#" + app.tintColor.replaceAll("#", "") : "var(--tint-color);"};"></div>
        </div>
    </div>
</a>
</div>
` : undefined;