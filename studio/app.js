// ===== Image uploader using imgbb API =====
const imageUploader = {
  apiKey: "382cf5a0a2e43717f1205d5fce4ccede",
  apiUrl: "",
  init() {
    this.apiUrl = "https://api.imgbb.com/1/upload?key=" + this.apiKey;
  },
  async uploadImage(base64DataUrl) {
    const e = base64DataUrl.split(",")[1];
    try {
      const formData = new FormData();
      formData.append("image", e);
      const res = await fetch(this.apiUrl, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      return json;
    } catch (err) {
      console.error("Error loading image:", err);
      throw err;
    }
  },
};
imageUploader.init();

// ===== Helpers =====
function showToast(message) {
  const toast = document.getElementById("toast");
  const msg = document.getElementById("toastMessage");
  msg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const before = value.slice(0, start);
  const after = value.slice(end);
  textarea.value = before + text + after;

  const pos = start + text.length;
  textarea.selectionStart = textarea.selectionEnd = pos;
  textarea.focus();
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
let exportName = "README.md";
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("markdownInput");
  const preview = document.getElementById("preview");

  let isDirty = false;

  // Initial render
  function updatePreview() {
    const raw = textarea.value || "";
    if (window.marked) {
      preview.innerHTML = marked.parse(raw);
    } else {
      preview.textContent = raw;
    }
  }
  textarea.addEventListener("input", () => {
    isDirty = true;
    updatePreview();
  });
  updatePreview();

  // ===== Cảnh báo khi thoát / reload nếu đang chỉnh sửa =====
  window.addEventListener("beforeunload", (e) => {
    if (!isDirty) return;
    e.preventDefault();
    // Một số trình duyệt cần gán returnValue để hiển thị confirm
    e.returnValue = "Bạn có thay đổi chưa sao lưu. Rời khỏi trang sẽ mất nội dung.";
  });

  // ===== Mobile tabs logic =====
  const mobileTabs = document.querySelectorAll(".mobile-tabs button");
  const panes = document.querySelectorAll(".pane");
  const toolsPanel = document.getElementById("toolsPanel");

  function applyMobileViewFromActiveTab() {
    const activeBtn = document.querySelector(".mobile-tabs button.active");
    const target = activeBtn ? activeBtn.dataset.target : "tools";

    if (target === "tools") {
      toolsPanel.classList.add("active");
      panes.forEach((pane) => pane.classList.remove("active"));
    } else {
      toolsPanel.classList.remove("active");
      panes.forEach((pane) => {
        pane.classList.toggle("active", pane.dataset.view === target);
      });
    }
  }

  mobileTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      mobileTabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyMobileViewFromActiveTab();
    });
  });

  // On desktop: luôn hiển thị cả 2 pane, ẩn toolsPanel
  function handleResize() {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      panes.forEach((p) => p.classList.add("active"));
      toolsPanel.classList.remove("active");
    } else {
      applyMobileViewFromActiveTab();
    }
  }
  window.addEventListener("resize", handleResize);
  handleResize(); // chạy lần đầu

  // ===== Tools: copy, export, import =====
  const importInput = document.getElementById("importInput");

  document.querySelectorAll(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(textarea.value);
        showToast("Đã sao chép mã markdown vào clipboard!");
      } catch (err) {
        alert("Không thể sao chép: " + err.message);
      }
    });
  });

  function exportMarkdown() {
    const blob = new Blob([textarea.value], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = exportName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  document.querySelectorAll(".btn-export").forEach((btn) => {
    btn.addEventListener("click", exportMarkdown);
  });

// ===== IMPORT POPUP =====
const importPopup = document.getElementById("importPopup");
const importPopupClose = document.getElementById("importPopupClose");
const importContinueBtn = document.getElementById("importContinueBtn");
const importExportBtn = document.getElementById("importExportBtn");
const importCopyBtn = document.getElementById("importCopyBtn");


/* ------------------------------------
   Khi nhấn nút Import
------------------------------------- */
document.querySelectorAll(".btn-import").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Nếu ô code TRỐNG → import luôn
    if (!textarea.value.trim()) {
      importInput.click();
      return;
    }

    // Nếu có nội dung → hiện popup
    openImportPopup();
  });
});

function openImportPopup() {
  importPopup.classList.remove("hidden");
}

function closeImportPopup() {
  importPopup.classList.add("hidden");
}

/* ------------------------------------
   1. Tiếp tục import → mở chọn file
------------------------------------- */
importContinueBtn.addEventListener("click", () => {
  closeImportPopup();
  importInput.click();
});

/* ------------------------------------
   2. Export .md
------------------------------------- */
importExportBtn.addEventListener("click", () => {
  exportMarkdown();
});

/* ------------------------------------
   3. Copy code
------------------------------------- */
importCopyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(textarea.value);
  showToast("Đã sao chép code!");
});

/* ------------------------------------
   Đóng popup
------------------------------------- */
importPopupClose.addEventListener("click", closeImportPopup);

/* ------------------------------------
   Khi người dùng chọn file
------------------------------------- */
importInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    textarea.value = ev.target.result;
    updatePreview();
    showToast("Đã nhập: " + file.name);
    exportName = file.name;
    document.getElementById("currentFileName").textContent = file.name;
  };

  reader.readAsText(file);
  importInput.value = "";
});


  // ===== Insert Modal =====
  const insertBtn = document.getElementById("insertBtn");
  const modalBackdrop = document.getElementById("insertModalBackdrop");
  const closeInsertModal = document.getElementById("closeInsertModal");
  const modalTabBtns = document.querySelectorAll(".modal-tab-btn");
  const modalSections = document.querySelectorAll(".modal-section");

  function openModal() {
    modalBackdrop.classList.remove("hidden");
  }

  function closeModal() {
    modalBackdrop.classList.add("hidden");
  }

  insertBtn.addEventListener("click", openModal);
  closeInsertModal.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  modalTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.section;
      modalTabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      modalSections.forEach((sec) => {
        sec.classList.toggle("active", sec.id === target);
      });
    });
  });

  // ===== Insert: Text =====
  const textType = document.getElementById("textType");
  const textContent = document.getElementById("textContent");
  const insertTextBtn = document.getElementById("insertTextBtn");

  insertTextBtn.addEventListener("click", () => {
    const type = textType.value;
    const content = (textContent.value || "").trim();
    if (!content) {
      alert("Vui lòng nhập nội dung text.");
      return;
    }
    let md = "";
    if (type === "h1") {
      md = "# " + content + "\n\n";
    } else if (type === "h2") {
      md = "## " + content + "\n\n";
    } else if (type === "h3") {
      md = "### " + content + "\n\n";
    } else {
      md = content + "\n\n";
    }
    insertAtCursor(textarea, md);
    isDirty = true;
    updatePreview();
    textContent.value = "";
    closeModal();
  });

  // ===== Insert: Image (2 nút Dán link & Upload) =====
  const imageUrlInput = document.getElementById("imageUrl");
  const imageAltInput = document.getElementById("imageAlt");
  const imagePasteBtn = document.getElementById("imagePasteBtn");
  const imageUploadBtn = document.getElementById("imageUploadBtn");
  const imageFileInput = document.getElementById("imageFile");
  const insertImageBtn = document.getElementById("insertImageBtn");

  imagePasteBtn.addEventListener("click", () => {
    const url = prompt("Dán link ảnh (URL):");
    if (url && url.trim()) {
      imageUrlInput.value = url.trim();
    }
  });

  imageUploadBtn.addEventListener("click", () => {
    imageFileInput.click();
  });

  imageFileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    imageUploadBtn.disabled = true;
    imageUploadBtn.textContent = "Đang upload...";

    try {
      const dataUrl = await readFileAsDataURL(file);
      const result = await imageUploader.uploadImage(dataUrl);
      if (!result || !result.data || !result.data.url) {
        throw new Error("Không nhận được URL ảnh từ imgbb.");
      }
      imageUrlInput.value = result.data.url;
      showToast("Upload ảnh thành công, URL đã được điền.");
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi upload ảnh. Vui lòng thử lại.");
    } finally {
      imageUploadBtn.disabled = false;
      imageUploadBtn.textContent = "⬆ Upload ảnh";
      imageFileInput.value = "";
    }
  });

  insertImageBtn.addEventListener("click", () => {
    const url = (imageUrlInput.value || "").trim();
    const alt = (imageAltInput.value || "").trim() || "image";
    if (!url) {
      alert("Vui lòng dán link hoặc upload ảnh để lấy URL trước.");
      return;
    }
    const md = `![${alt}](${url})\n\n`;
    insertAtCursor(textarea, md);
    isDirty = true;
    updatePreview();
    imageUrlInput.value = "";
    imageAltInput.value = "";
    closeModal();
  });

// ===== Insert: Video (thumbnail giống phần image) =====
const videoUrlInput = document.getElementById("videoUrl");
const videoThumbUrlInput = document.getElementById("videoThumbUrl");
const videoThumbPasteBtn = document.getElementById("videoThumbPasteBtn");
const videoThumbUploadBtn = document.getElementById("videoThumbUploadBtn");
const videoThumbFileInput = document.getElementById("videoThumbFile");
const videoAltInput = document.getElementById("videoAlt");
const insertVideoBtn = document.getElementById("insertVideoBtn");

videoThumbPasteBtn.addEventListener("click", () => {
  const url = prompt("Dán link ảnh thumbnail (URL):");
  if (url && url.trim()) {
    videoThumbUrlInput.value = url.trim();
  }
});

videoThumbUploadBtn.addEventListener("click", () => {
  videoThumbFileInput.click();
});

videoThumbFileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  videoThumbUploadBtn.disabled = true;
  videoThumbUploadBtn.textContent = "Đang upload...";

  try {
    const dataUrl = await readFileAsDataURL(file);
    const result = await imageUploader.uploadImage(dataUrl);
    if (!result || !result.data || !result.data.url) {
      throw new Error("Không nhận được URL ảnh từ imgbb.");
    }
    videoThumbUrlInput.value = result.data.url;
    showToast("Upload thumbnail thành công!");
  } catch (err) {
    console.error(err);
    alert("Có lỗi khi upload thumbnail. Vui lòng thử lại.");
  } finally {
    videoThumbUploadBtn.disabled = false;
    videoThumbUploadBtn.textContent = "⬆ Upload ảnh";
    videoThumbFileInput.value = "";
  }
});

insertVideoBtn.addEventListener("click", () => {
  const videoUrl = (videoUrlInput.value || "").trim();
  const thumbUrl = (videoThumbUrlInput.value || "").trim();
  const alt = (videoAltInput.value || "").trim() || "Xem video";

  if (!videoUrl) {
    alert("Vui lòng nhập URL video.");
    return;
  }
  if (!thumbUrl) {
    alert("Vui lòng dán hoặc upload ảnh thumbnail trước.");
    return;
  }

  const md = `[![${alt}](${thumbUrl})](${videoUrl})\n\n`;
  insertAtCursor(textarea, md);
  isDirty = true;
  updatePreview();

  videoUrlInput.value = "";
  videoThumbUrlInput.value = "";
  videoAltInput.value = "";
  videoThumbFileInput.value = "";

  closeModal();
  showToast("Đã chèn markdown video.");
});


  // ===== Insert: Link =====
  const linkTextInput = document.getElementById("linkText");
  const linkUrlInput = document.getElementById("linkUrl");
  const insertLinkBtn = document.getElementById("insertLinkBtn");

  insertLinkBtn.addEventListener("click", () => {
    const text = (linkTextInput.value || "").trim();
    const url = (linkUrlInput.value || "").trim();
    if (!text || !url) {
      alert("Vui lòng nhập đầy đủ tên hiển thị và URL.");
      return;
    }
    const md = `[${text}](${url})\n\n`;
    insertAtCursor(textarea, md);
    isDirty = true;
    updatePreview();
    linkTextInput.value = "";
    linkUrlInput.value = "";
    closeModal();
  });

  // ===== Insert: List =====
  const listTypeSelect = document.getElementById("listType");
  const listItemsTextarea = document.getElementById("listItems");
  const insertListBtn = document.getElementById("insertListBtn");

  insertListBtn.addEventListener("click", () => {
    const type = listTypeSelect.value;
    const raw = listItemsTextarea.value || "";
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) {
      alert("Vui lòng nhập ít nhất 1 mục cho danh sách.");
      return;
    }
    let md = "";
    if (type === "unordered") {
      md = lines.map((l) => "- " + l).join("\n") + "\n\n";
    } else {
      md = lines.map((l, idx) => idx + 1 + ". " + l).join("\n") + "\n\n";
    }
    insertAtCursor(textarea, md);
    isDirty = true;
    updatePreview();
    listItemsTextarea.value = "";
    closeModal();
  });
});
