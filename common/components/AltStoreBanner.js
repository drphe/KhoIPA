import { sourceURL } from "../modules/constants.js";

const icons = {
  feather: `<img src="https://dvntm0.github.io/img/feather.png" alt="altstore-icon" class="icon">`,
  esign: `<img src="https://esign.yyyue.xyz/ESignLogo200.png" alt="altstore-icon" class="icon">`,
  both: `
    <img src="https://esign.yyyue.xyz/ESignLogo200.png" alt="altstore-icon" class="icon">
    <img src="https://dvntm0.github.io/img/feather.png" alt="altstore-icon" class="icon">
  `
};

const texts = {
  feather: `
            <div class="text-container">
                <p class="title-text">Feather <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add ${sourceName ? "\"" + sourceName + "\"" : "this source"} to Feather to receive app updates
                </p>
            </div>`,
  esign: `
            <div class="text-container">
                <p class="title-text">ESign <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add ${sourceName ? "\"" + sourceName + "\"" : "this source"} to Esign to receive app updates
                </p>
            </div>`,
  both: `
            <div class="text-container">
                <p class="title-text">ESign <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add ${sourceName ? "\"" + sourceName + "\"" : "this source"} to Esign to receive app updates
                </p>
            </div>
            <div class="text-container">
                <p class="title-text">Feather <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add ${sourceName ? "\"" + sourceName + "\"" : "this source"} to Feather to receive app updates
                </p>
            </div>
  `
};

export const AltStoreBanner = (sourceName, typeSource) => `
<div class="uibanner">
    <div class="icons">${icons[typeSource] || ""}</div>
    <div class="content">
        <div>${texts[typeSource] || ""}
        </div>
        <a class="add">
            <button id="add-to-altstore">Add</button>
        </a>
    </div>
</div>`;
