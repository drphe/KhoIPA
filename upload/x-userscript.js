// ==UserScript==
// @name         Open X (Twitter) App
// @version      1.1.0
// @author       beebeo
// @match        *://mobile.x.com/*
// @match        *://x.com/*
// @downloadURL  https://gist.github.com/beebeo/7b454b776577d7c0ac9c91a054cf50cb/raw/open-x-app.user.js
// @updateURL    https://gist.github.com/beebeo/7b454b776577d7c0ac9c91a054cf50cb/raw/open-x-app.user.js
// @homepage     https://gist.github.com/beebeo/7b454b776577d7c0ac9c91a054cf50cb/
// ==/UserScript==

(function redirect() {
    const type = document.querySelector('[property="og:type"]')?.content;

    if (type === 'article') {
        // Tweet page
        const id = location.pathname.split('/').filter(Boolean).at(-1);
        window.location.href = 'twitter://tweet?id=' + id;
        return;
    }

    if (type === 'profile') {
        // Profile page
        const user = location.pathname.split('/').filter(Boolean).at(-1);
        window.location.href = 'twitter://user?screen_name=' + user;
        return;
    }

    // Retry until og:type is loaded
    requestAnimationFrame(redirect);
})();