const btnText = () => {
  const permission =
    "Notification" in window ? Notification.permission : "default";

  return permission === "granted"
    ? "OK"
    : permission === "denied"
    ? "OFF"
    : "ON";
};

export const AppBanner = (name) => `
<div class="uibanner">
    <div class="icons">
        <img src="https://raw.githubusercontent.com/drphe/KhoIPA/refs/heads/main/icon/logo128x128.png" alt="sidestore-icon" class="icon">
        <img src="https://raw.githubusercontent.com/drphe/KhoIPA/refs/heads/main/icon/logo128x128.png" alt="sidestore-icon" class="icon">
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
                    Receive notifications about app updates (>IOS 16). 
                </p>
            </div>
        </div>
	<div style="display: flex;">
        <a href="" class="install-app">
            <button id="add-to-altstore">${isPWA ? btnText(): "Add"}</button>
        </a>
        <button id="close-btn" aria-label="Close" style="">
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="8" x2="16" y2="16"></line><line x1="16" y1="8" x2="8" y2="16"></line>
</svg></button>
    	</div>
    </div>
</div>`;