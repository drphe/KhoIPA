import { sourceURL } from "../modules/constants.js";

export const AppHeader = (app, x = ".") => app ? `
<div class="app-header-container">
<a href="${x}/app/?source=${sourceURL}&id=${app.bundleIdentifier}" class="app-header-link">
    <div class="app-header-inner-container">
        <div class="app-header">
            <div class="content">
                <img id="app-icon" src="${app.iconURL}" alt="">
                <div class="right">
                    <div class="text">
                        <p class="title">${app.name}</p>
                        <p class="subtitle">${version} - ${app.developerName}</p>
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