export const NavigationBar = (title) => `
<div id="nav-bar">
    <button id="back" type="button">
        <i class="bi bi-chevron-left"></i>
        Back
    </button>
    <div id="title">
        <p>${title ?? ""}</p>
    </div>
    <button id="back" class="hidden">
        <i class="bi bi-chevron-left"></i>
        Back
    </button>
</div>`;