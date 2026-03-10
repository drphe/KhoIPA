console.clear();
let text = "## 1. Esign \n\n";
extract('cat-esign');

text += "## 2. K-sign\n\n"
extract('cat-zsign');

text += "## 3. Scalert\n\n"
extract('cat-scarlet');

text += "## 4. Cert\n\n"
extract('cat-certificate');

console.log(text);


function extract(id){
  const cards = document.querySelectorAll(`#${id} .card`);
  cards.forEach(card=>{
    const name = card.querySelector("h3")?.innerText.trim() || "";
    const version = card.querySelector("small")?.innerText.trim() || "";
    const link = card.querySelector("a.badge")?.href || "";
    text += `[${name} - ${version}](${link})\n\n`;
  });
}
