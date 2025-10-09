import { urlSearchParams, sourceURL, base64Convert } from "../../common/modules/constants.js";
import { insertNavigationBar, formatVersionDate, formatString, open, setTintColor } from "../../common/modules/utilities.js";
import { main } from "../../common/modules/main.js";
import { MoreButton } from "../../common/components/MoreButton.js";

const fallbackURL = `../?source=${base64Convert(sourceURL)}`;

if (!urlSearchParams.has('id')) open(fallbackURL);
const bundleId = urlSearchParams.get('id');

insertNavigationBar("Version History");

main(json => {
   // const app = getAppWithBundleId(bundleId);
  //  if (!app) {
   //     open(fallbackURL);
  //      return;
  //  }
   const news = {
		title: 'Bản tin',
		url: `./README.md`,
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
    document.title = `${app.name}`;

    // Set tint color
    const tintColor = news.tintColor ? news.tintColor.replaceAll("#", "") : "var(--tint-color);";
    if (tintColor) setTintColor(tintColor);
    document.getElementById("back").style.color = tintColor;

}, "../../../");