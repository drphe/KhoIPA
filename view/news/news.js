import { insertNavigationBar } from "../../common/modules/utilities.js";
import { NewsItem } from "../../common/components/NewsItem.js";
import { main } from "../../common/modules/main.js";
import { sourceURL, base64Convert } from "../../common/modules/constants.js";

const fallbackURL = `../?source=${base64Convert(sourceURL)}`;
document.getElementById("back").onclick = () => open(fallbackURL);

insertNavigationBar("All News");

main(json => {
    // Set tab title
    document.title = `News - ${json.name}`;

    // Sort news by latest
    json.news.sort((a, b) => (new Date(b.date)).valueOf() - (new Date(a.date)).valueOf());

    // Create & insert news items
    json.news.forEach(news => document.getElementById("news").insertAdjacentHTML("beforeend", NewsItem(news)));
});