import { AppHeader } from "./AppHeader.js";
import { formatVersionDate } from "../modules/utilities.js";
import { sourceURL, base64Convert } from "../modules/constants.js";

export function getTextColor(bgColor) {
  bgColor = bgColor.replace('#', '');
  if (bgColor.length === 3)
    bgColor = bgColor.split('').map(c => c + c).join('');
  const r = parseInt(bgColor.substr(0, 2), 16);
  const g = parseInt(bgColor.substr(2, 2), 16);
  const b = parseInt(bgColor.substr(4, 2), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? '#000000' : '#ffffff';
}
export const NewsItem = (news, minimal = false) => `
<div class="news-item-wrapper"> ${news.url ?
    "<a href='#' data-url='" + news.url + "' title='" + news.title + "' class='news-item-header'>" : ""}
    <div class="item" style="padding:0;opacity:0.9;color:${getTextColor('#'+news.tintColor.replaceAll("#", ""))};background-color: #${news.tintColor.replaceAll("#", "")};${news.imageURL && minimal ?'background: url('+news.imageURL+') repeat center center;background-size: cover;':''};">
	${minimal ?'<div class="text" style="position: relative;"></div>':''}
        <div class="text" style="${minimal ?'margin: 0em;background: linear-gradient(to top, #'+news.tintColor.replaceAll("#", "") +' 40%, rgba(0, 0, 0, 0));padding: 1em;border-radius: 10px;margin-bottom: -1rem;':''}">
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

