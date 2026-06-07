const configADS = [{
    id: "khoipa",
    icon: "https://raw.githubusercontent.com/drphe/KhoIPA/refs/heads/main/icon/logo128x128.png",
    beta: true,
    title: "KhoIPA",
    "detail-text": "Add NAME to your Home screen",
    "button-text": "Add",
   "onclick": "showUIAlert(langText['howtoinstall'], langText['howtoinstallText'])"
}, {
    id: "khoipa",
    icon: "https://raw.githubusercontent.com/drphe/KhoIPA/refs/heads/main/icon/logo128x128.png",
    beta: true,
    title: "KhoIPA",
    "detail-text": "Receive notifications about app updates (>IOS 16). ",
    "button-text": "Add",
   "onclick": "showUIAlert(langText['howtoinstall'], langText['howtoinstallText'])"
},{
    id: "sign",
    icon: "https://osign.ipasign.cc/img/app-icon-512.png",
    beta: false,
    title: "SignIPA",
    "detail-text": "Sign & Install IPA online. ",
    "button-text": "View",
   "onclick": "window.open('https://drphe.github.io/KhoIPA/signipa/index.html', '_blank')"
}
,{
    id: "khoindvn",
    icon: "https://i.ibb.co/nMt26Lf5/033502f1e155.png",
    beta: false,
    title: "FreeSideloading",
    "detail-text": "Sideloadly free with DNS and Revoked Cert. ",
    "button-text": "View",
   "onclick": "window.open('https://kho-ipa.vercel.app/view/?source=aHR0cHMlM0ElMkYlMkZyYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJTJGZHJwaGUlMkZLaG9JUEElMkZtYWluJTJGdXBsb2FkJTJGa2hvaW5kdm4uanNvbg==', '_blank')"
},{
    id: "ipaomtk",
    icon: "https://ipaomtk.com/wp-content/themes/IPAOMTK/assets/img/ipaomtk-brand-icon.png",
    beta: false,
    title: "Newest's Repo",
    "detail-text": "Download IOS IPA files & Tweaks Apps ",
    "button-text": "View",
   "onclick": "https://kho-ipa.vercel.app/view/?source=aHR0cHMlM0ElMkYlMkZyYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJTJGZHJwaGUlMkZLaG9JUEElMkZtYWluJTJGdXBsb2FkJTJGaXBhb210ay5qc29u', '_blank')"
},{
    id: "telegram",
    icon: "https://cdn-icons-png.flaticon.com/512/2111/2111646.png",
    beta: false,
    title: "ContactMe",
    "detail-text": "Found a problem? Send me a message on Telegram. ",
    "button-text": "Send",
   "onclick": "window.open('https://t.me/phetit', '_blank')"
}];

function cleanExpiredAds() {
let data =[];
try {
    data = JSON.parse(localStorage.getItem('hideAds') || '[]');
	   if(!Array.isArray(data)) {data = []};
} catch(e) {
    console.error('Error parsing hideAds:', e);
    data = [];
}
    const currentTime = new Date().getTime();
    const validAds = data.filter(item => item.expired > currentTime);
    
    // Nếu có item bị expired, cập nhật lại localStorage
    if(validAds.length !== data.length) {
        localStorage.setItem('hideAds', JSON.stringify(validAds));
    }
    return validAds;
}
const processAds = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    if (arr.length === 1) return [arr[0], arr[0]];
    if (arr.length === 2) return [...arr];
    
    // Lấy ngẫu nhiên 2 phần tử
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 2);
};
export const AppBanner = (name) => {
    const renderAdTitle = (ad, index) => `
        <div class="text-container"  target-id="${ad.id}">
            <p class="title-text">
                ${ad.title} 
                ${ad.beta ? '<span class="small beta badge"></span>' : ''}
            </p>
            <p class="detail-text">
                ${ad["detail-text"].replace('NAME', name ?? 'this source')}
            </p>
        </div>
    `;
    const renderAdBtn = (ad, index) => `
        <div class="text-container" style="display: flex;align-items: center;justify-content: center;">
	    <a href="#" class="install-app" data-id="${ad.id}" onclick="${ad.onclick}">
                <button id="add-to-altstore">${ad["button-text"]}</button>
            </a>
            <a href="#" class="close-btn" aria-label="Close" data-id="${ad.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="8" x2="16" y2="16"></line><line x1="16" y1="8" x2="8" y2="16"></line>
                </svg>
            </a>
        </div>
    `;
    let data = cleanExpiredAds(),tADS=[], ADS = [];
    configADS.forEach(s => {
	if(!data.map(item => item.id).includes(s.id)) tADS.push(s);
    });
    ADS = processAds(tADS);
    if(!ADS.length) {
	document.querySelector("#main").style.top="2.5rem";
	return '';
    }
    return `
        <div class="uibanner">
            <div class="icons">
                ${ADS.map(ad => `<img src="${ad.icon}" alt="${ad.title}-icon" class="icon">`).join('')}
            </div>
            <div class="content">
                <div>
                    ${ADS.map((ad, index) => renderAdTitle(ad, index)).join('')}
                </div>
                <div style="display: ;">
                    ${ADS.map((ad, index) => renderAdBtn(ad, index)).join('')}
                </div>
            </div>
        </div>
    `;
};