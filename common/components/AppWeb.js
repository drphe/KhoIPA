const btnText = () =>
  Notification.permission === "granted"
    ? "OK"
    : Notification.permission === "denied"
    ? "OFF"
    : "ON";

export const AppBanner = (name) => `
<div class="uibanner">
    <div class="icons">
        <img src="https://raw.githubusercontent.com/drphe/KhoIPA/refs/heads/main/icon/logo.png" alt="sidestore-icon" class="icon">
        <img src="https://raw.githubusercontent.com/drphe/KhoIPA/refs/heads/main/icon/logo.png" alt="sidestore-icon" class="icon">
    </div>
    <div class="content">
        <div>
            <div class="text-container">
                <p class="title-text">KhoIPA <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Add "${name?? 'this source'}" to your Home screen.
                </p>
            </div>
            <div class="text-container">
                <p class="title-text">KhoIPA <span class="small beta badge"></span></p>
                <p class="detail-text">
                    Receive notifications about app updates. 
                </p>
            </div>
        </div>
        <a href="" class="install-app">
            <button id="add-to-altstore">${isPWA ? btnText(): "Add"}</button>
        </a>
    </div>
</div>`;