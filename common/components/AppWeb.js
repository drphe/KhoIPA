export const AppBanner = (name) => `
<div class="uibanner">
    <div class="icons">
        <img src="https://raw.githubusercontent.com/drphe/KhoIPA/refs/heads/main/icon/logo.png" alt="sidestore-icon" class="icon">
        <img src="https://raw.githubusercontent.com/drphe/KhoIPA/refs/heads/main/icon/favor.png" alt="sidestore-icon" class="icon">
    </div>
    <div class="content">
        <div>
            <div class="text-container">
                <p class="title-text">KhoIPA Mod <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add "${name?? 'this source'}" to your Iphone.
                </p>
            </div>
            <div class="text-container">
                <p class="title-text">KhoIPA Mod <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Use "${name?? 'this source'}" as an application on your Iphone.
                </p>
            </div>
        </div>
        <a href="mobile.config">
            <button id="add-to-altstore">Add</button>
        </a>
    </div>
</div>`;