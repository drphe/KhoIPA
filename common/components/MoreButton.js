export const MoreButton = tintColor => `
<a id="more"  onclick="revealTruncatedText(event, this);">
    <button class="more-trigger" style="color: ${tintColor};">${langText["more"]}</button>
</a>`;

window.revealTruncatedText = (event, moreButton) => {
    event.stopPropagation();
    const textId = moreButton.parentNode.id;
    const text = document.getElementById(textId);
    text.style.display = "block";
    text.style.overflow = "auto";
    text.style.webkitLineClamp = "none";
    text.style.lineClamp = "none";
    text.removeChild(moreButton)
};