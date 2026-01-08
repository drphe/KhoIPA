import { showAddToAltStoreAlert, copyLinkIPA } from "../modules/utilities.js";

window.showAddToAltStoreAlert = showAddToAltStoreAlert;
window.copyLinkIPA = copyLinkIPA;

export const VersionHistoryItem = (sourceName, number, date, description, url, i) => `
<div class="version">
    <div class="version-header">
        <p class="version-number">${langText['version']} ${number}</p>
        <p class="version-date">${date}</p>
    </div>
    <div class="version-options">
        <a style="color: var(--tint-color);" class="version-install" onclick="showAddToAltStoreAlert(
            '${sourceName?.replace(/(['"])/g, "\\$1")}',
            '${langText["installapp"]}',
            () => window.location.href = 'esign://install?url=${url}'
        );">
            ${langText['installviaesign']}
        </a>
        <a style="color: var(--tint-color);" class="version-download" onclick="showAddToAltStoreAlert(
            '${sourceName?.replace(/(['"])/g, "\\$1")}',
            isPWA? langText['copylink']: langText['downloadipa'],
            () => isPWA?  copyLinkIPA('${url}'): window.location.href = '${url}'
        );">
            ${langText['downloadipa']}
        </a>
    </div>
    <p class="version-description" id="description${i}">${description || ''}</p>
</div>`;