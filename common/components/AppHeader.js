import { formatVersionDate } from "../modules/utilities.js";

const baseHost = window.location.origin; 
const fallbackSrc = baseHost + "/KhoIPA/common/assets/img/generic_app.jpeg";

export const AppHeader = (app) => app ? `
<div class="app-header-container">
 <a href="#" data-bundleid = "${app.bundleIdentifier}"  class="app-header-link">
    <div class="app-header-inner-container">
        <div class="app-header">
            <div class="content">
                <img id="app-icon" src="${app.iconURL}" onerror="this.onerror=null; this.src='${fallbackSrc}';" alt="">
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

export const AppLoading = (id = "apps-list", position = "beforeend") => {
  const container = document.getElementById(id);
  if (!container) return console.warn(`Element with id "${id}" not found.`);
  container.insertAdjacentHTML(position, `
    <div class="app-container">
      <div class="app-header-container">
        <a href="#" class="app-header-link">
          <div class="app-header-inner-container">
            <div class="app-header">
              <div class="content">
                <div class="skeleton-block"></div>
                <div class="right">
                  <div class="text">
                    <p class="title">--- --- ---</p>
                    <p class="subtitle">------</p>
                  </div>
                  <button class="uibutton" style="background-color: var(--color-separator-dark);">---</button>
                </div>
              </div>
              <div class="background" style="background-color: var(--color-bg-dark-secondary);"></div>
            </div>
          </div>
        </a>
      </div>
    </div>`);
};
