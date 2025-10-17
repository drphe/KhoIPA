(async () => {
  const panel = document.createElement("div");
  panel.style = "position:fixed;top:10px;left:10px;z-index:999999;background:#fff;border:1px solid #ccc;padding:10px;border-radius:8px;font-family:sans-serif;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.25)";
  panel.innerHTML = `<b>🧪 CSV Data Picker</b><br><button id="importBtn">Import CSV (;)</button><br><select id="personSelect" style="margin-top:6px;display:none;width:100%;"></select>`;
  document.body.appendChild(panel);

  function parseCSV(text) {
    const [headerLine, ...lines] = text.trim().split(/\r?\n/);
    const headers = headerLine.split(";").map(h => h.trim());
    const data = lines.map(line => {
      const values = line.split(";").map(v => v.trim());
      return Object.fromEntries(headers.map((h, i) => [h, values[i] || ""]));
    });
    return { headers, data };
  }

  let csvData = null, selectedPerson = null;

  importBtn.onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = e => {
      const reader = new FileReader();
      reader.onload = ev => {
        csvData = parseCSV(ev.target.result);
        personSelect.style.display = "inline-block";
        personSelect.innerHTML = `<option value="">-- Chọn tên người --</option>` +
          csvData.data.map(row => `<option value="${row[csvData.headers[0]]}">${row[csvData.headers[0]]}</option>`).join("");
        alert("✅ Đã tải CSV thành công!");
      };
      reader.readAsText(e.target.files[0], "UTF-8");
    };
    input.click();
  };

  personSelect.onchange = e => {
    selectedPerson = csvData.data.find(row => row[csvData.headers[0]] === e.target.value);
    if (selectedPerson) alert("Đã chọn tên người: " + e.target.value);
  };

  document.addEventListener("focusin", e => {
    const el = e.target;
    if (!selectedPerson || !["INPUT", "TEXTAREA"].includes(el.tagName)) return;
    document.querySelectorAll(".dataPopup").forEach(p => p.remove());

    const popup = document.createElement("div");
    popup.className = "dataPopup";
    popup.style = `position:absolute;background:white;border:1px solid #ccc;border-radius:6px;padding:6px;z-index:9999999;box-shadow:0 2px 10px rgba(0,0,0,0.2);top:${el.getBoundingClientRect().bottom + window.scrollY + 5}px;left:${el.getBoundingClientRect().left + window.scrollX}px;max-height:250px;overflow-y:auto`;

    const table = document.createElement("table");
    table.style = "border-collapse:collapse;width:100%";
    table.innerHTML = `<tr><th style="text-align:left;border-bottom:1px solid #ddd;padding:4px;">Loại xét nghiệm</th><th style="text-align:left;border-bottom:1px solid #ddd;padding:4px;">Giá trị</th></tr>` +
      csvData.headers.slice(1).map(key => `<tr style="cursor:pointer" onclick="this.closest('.dataPopup').remove();document.activeElement.value='${selectedPerson[key]}'" onmouseenter="this.style.background='#f0f0f0'" onmouseleave="this.style.background='white'"><td style="padding:4px 6px;">${key}</td><td style="padding:4px 6px;">${selectedPerson[key]}</td></tr>`).join("");

    popup.appendChild(table);
    document.body.appendChild(popup);
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".dataPopup") && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
      document.querySelectorAll(".dataPopup").forEach(p => p.remove());
    }
  });
})();
