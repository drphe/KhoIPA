import { urlSearchParams, sourceURL, base64Convert } from "../../common/modules/constants.js";
import { insertNavigationBar, open, setTintColor } from "../../common/modules/utilities.js";
import { main } from "../../common/modules/main.js";

const fallbackURL = `../?source=${base64Convert(sourceURL)}`;
document.getElementById("back")?.addEventListener("click", () => open(fallbackURL));

if (!urlSearchParams.has('link')) open(fallbackURL);
const bundleLink = urlSearchParams.get('link');

insertNavigationBar("Nội dung chi tiết");

main(json => {
   // const app = getAppWithBundleId(bundleId);
  //  if (!app) {
   //     open(fallbackURL);
  //      return;
  //  }
   const news = {
		title: 'Nội dung',
		url: bundleLink,
		tintColor: '#000'
		}

    fetch(news.url)
      .then(response => response.text())
      .then(markdown => {
        document.getElementById("content").innerHTML = marked.parse(markdown);
      })
      .catch(error => {
        document.getElementById("content").innerHTML = "Không thể tải nội dung .";
        console.error(error);
      });

    // Set tab title
    document.title = `${news.title}`;

    // Set tint color
    const tintColor = news.tintColor ? news.tintColor.replaceAll("#", "") : "var(--tint-color);";
    if (tintColor) setTintColor(tintColor);
    document.getElementById("back").style.color = tintColor;

}, "../../../");