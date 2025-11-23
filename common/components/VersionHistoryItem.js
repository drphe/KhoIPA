import { showAddToAltStoreAlert, copyLinkIPA } from "../modules/utilities.js";

window.showAddToAltStoreAlert = showAddToAltStoreAlert;
window.copyLinkIPA = copyLinkIPA;

window.isStandalone = !window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone !== true;

export const VersionHistoryItem = (sourceName, number, date, description, url, i) => `
<div class="version">
    <div class="version-header">
        <p class="version-number">Version ${number}</p>
        <p class="version-date">${date}</p>
    </div>
    <div class="version-options">
        <a style="color: var(--tint-color);" class="version-install" onclick="showAddToAltStoreAlert(
            '${sourceName?.replace(/(['"])/g, "\\$1")}',
            'Install App',
            () => window.location.href = 'esign://install?url=${url}'
        );">
            Install with Esign
        </a>
        <a style="color: var(--tint-color);" class="version-download" onclick="showAddToAltStoreAlert(
            '${sourceName?.replace(/(['"])/g, "\\$1")}',
            isStandalone? 'Download IPA':'Copy Link IPA',
            () => isStandalone? window.location.href = '${url}': copyLinkIPA(url)
        );">
            Download IPA
        </a>
    </div>
    <p class="version-description" id="description${i}">${description || ''}</p>
</div>`;