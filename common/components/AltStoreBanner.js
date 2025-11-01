import { sourceURL } from "../modules/constants.js";

export const AltStoreBanner = (sourceName) => `
<div class="uibanner">
    <div class="icons">
        <img src="https://dvntm0.github.io/img/feather.png" alt="altstore-icon" class="icon">
        <img src="https://esign.yyyue.xyz/ESignLogo200.png" alt="altstore-icon" class="icon">
    </div>
    <div class="content">
        <div>
            <div class="text-container">
                <p class="title-text">Feather <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add ${sourceName ? "\"" + sourceName + "\"" : "this source"} to Feather to receive app updates
                </p>
            </div>
            <div class="text-container">
                <p class="title-text">ESign <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add ${sourceName ? "\"" + sourceName + "\"" : "this source"} to Esign to receive app updates
                </p>
            </div>
        </div>
        <a class="add">
            <button id="add-to-altstore">Add</button>
        </a>
    </div>
</div>`;
