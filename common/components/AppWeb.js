export const AppBanner = () => `
<div class="uibanner">
    <div class="icons">
        <img src="https://therealfoxster.github.io/altsource-viewer/common/assets/img/sidestore.png" alt="sidestore-icon" class="icon">
    </div>
    <div class="content">
        <div>
            <div class="text-container">
                <p class="title-text">SideStore <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add ${sourceName ? "\"" + sourceName + "\"" : "this source"} to SideStore to receive app updates
                </p>
            </div>
        </div>
        <a href="./mobile.config">
            <button id="add-to-altstore">Add</button>
        </a>
    </div>
</div>`;