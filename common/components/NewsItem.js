import { AppHeader } from "./AppHeader.js";
import { formatVersionDate } from "../modules/utilities.js";
import { sourceURL, base64Convert } from "../modules/constants.js";

export const NewsItem = (news, minimal = false) => `
<div class="news-item-wrapper"> ${news.url ?
    "<a href='" + urlnews(news.url) + "'>" : ""}
    <div class="item" style="background-color: #${news.tintColor.replaceAll("#", "")};">
        <div class="text">
            <p>${formatVersionDate(news.date)}</p>
            <h3>${news.title}</h3>
            <p>${news.caption}</p>
        </div>${news.imageURL && !minimal ?
    "<div class='image-wrapper'>" +
    "<img src='" + news.imageURL + "'>" +
    "</div>" : ""} 
    </div> ${news.url ?
    "</a>" : ""} ${news.appID && !minimal ?
        AppHeader(getAppWithBundleId(news.appID), "..") ?? "" : ""}
</div>`;

export const urlnews = (url) => {
  if (!url.includes('http')) {
    return `../view/note/?source=${base64Convert(sourceURL)}&link=${url}`;
  }
  return url;
};
