(async () => {
  let isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const appId = document.getElementById("app");
  const useInBrowserBtn = document.getElementById("use-in-browser-button");
  const installScreen = document.querySelector(".install-screen-page");
  // check hiển thị share in 
  checkStandalone()
  useInBrowserBtn.addEventListener("click", () => {
    isStandalone = true;
    checkStandalone();
  });

  function checkStandalone() {
    if (!isStandalone) { // tắt đi
      installScreen.parentNode.remove();
      appId.style.display = "block";
    } else {
      installScreen.style.display = "block";
      appId.style.display = "none";
    }
  }

  // chuyển tab
  document.querySelectorAll('.tab-link').forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('tab-link-active'));
      this.classList.add('tab-link-active');
      document.querySelectorAll('.tab').forEach(content => content.classList.remove('tab-active'));
      const targetId = this.getAttribute('data-tab');
      const targetContent = document.querySelector(targetId);
      if (targetContent) {
        targetContent.classList.add('tab-active');
      }
    });
  });

  /**
   * Hàm cuộn tin tức (swiper) tùy chỉnh nâng cấp.
   * (Đã sửa lỗi hiển thị link/dính đối tượng khi kéo chuột)
   *
   * @param {string} id - ID của phần tử wrapper chứa các slides. Mặc định: "swiper-wrapper".
   * @param {number} itemWidth - Chiều rộng cố định của mỗi slide (không tính margin). Mặc định: 300.
   * @param {number} containerWidth - Chiều rộng của khu vực chứa swiper. Mặc định: window.innerWidth.
   */
  function swiperNews(id = "swiper-wrapper", itemWidth) {
    const swiperWrapper = document.getElementById(id);
    if (!swiperWrapper) {
      console.error(`Element with id "${id}" not found.`);
      return;
    }
    const containerWidth = swiperWrapper.clientWidth;
    const slides = swiperWrapper.querySelectorAll(".swiper-slide");

    if (slides.length === 0) return;
    const slideStyle = getComputedStyle(slides[0]);
    const slideMarginRight = parseInt(slideStyle.marginRight || '0');
	if(!itemWidth) itemWidth =  slides[0].getBoundingClientRect().width
    const slideWidth = itemWidth + slideMarginRight;
    const visibleSlides = Math.floor(containerWidth / slideWidth);
    const maxIndex = slides.length - visibleSlides;
    let currentIndex = 0;
    let isScrolling = false;
    const transitionDuration = 400; // ms
    // --- THAY ĐỔI 1: Ngăn kéo và chọn văn bản bằng CSS/HTML ---
    swiperWrapper.style.transition = `transform ${transitionDuration}ms ease-in-out`;
    swiperWrapper.style.overflow = "unset";
    swiperWrapper.style.cursor = "grab";
    // Ngăn chọn văn bản bằng CSS
    swiperWrapper.style.userSelect = 'none';
    // Ngăn hành vi kéo/thả mặc định (draggable)
    swiperWrapper.setAttribute('draggable', 'false');
    slides.forEach(slide => slide.setAttribute('draggable', 'false')); // Áp dụng cho từng slide
    swiperWrapper.classList.add('swiper-block');


    const updateScroll = (newIndex, transitionTime = transitionDuration) => {
      if (maxIndex > 0) {
        currentIndex = Math.min(Math.max(0, newIndex), maxIndex);
      } else {
        currentIndex = 0;
      }
      swiperWrapper.style.transition = `transform ${transitionTime}ms ease-in-out`;
      swiperWrapper.style.transform = `translate3d(${-slideWidth * currentIndex}px, 0, 0)`;
    };
    const pageSelector = '.page-content';
    const setPageScroll = (overflow) => {
      document.querySelectorAll(pageSelector).forEach(el => {
        el.style.overflowY = overflow;
      });
    };
    const initScrollManager = () => {
      swiperWrapper.addEventListener('mouseenter', () => {
        if (!isDragging) setPageScroll('hidden');
      });
      swiperWrapper.addEventListener('mouseleave', () => {
        if (!isDragging) setPageScroll('scroll');
      });
      swiperWrapper.addEventListener('touchstart', () => setPageScroll('hidden'));
      swiperWrapper.addEventListener('touchend', () => setPageScroll('scroll'));
    };
    initScrollManager();
    setPageScroll('scroll');
    swiperWrapper.addEventListener("wheel", function(e) {
      if (maxIndex <= 0) return;
      e.preventDefault();
      if (isScrolling) return;
      updateScroll(currentIndex, transitionDuration);
      isScrolling = true;
      if (e.deltaY > 0) {
        updateScroll(currentIndex + 1);
      } else if (e.deltaY < 0) {
        updateScroll(currentIndex - 1);
      }
      setTimeout(() => {
        isScrolling = false;
      }, transitionDuration);
    });
    let isDragging = false;
    let dragStartX = 0;
    let dragCurrentTranslate = 0;
    const swipeThreshold = 50;
    swiperWrapper.addEventListener("mousedown", function(e) {
      if (maxIndex <= 0) return;
      if (e.button !== 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      // --- THAY ĐỔI 2: Thêm e.preventDefault() ở mousedown ---
      e.preventDefault(); // Ngăn hành vi kéo/thả (drag/drop) mặc định
      swiperWrapper.style.transition = 'none';
      swiperWrapper.style.cursor = "grabbing";
      dragCurrentTranslate = -slideWidth * currentIndex;
    });
    document.addEventListener("mousemove", function(e) {
      if (!isDragging) return;
      // --- THAY ĐỔI 3: e.preventDefault() trong mousemove ---
      e.preventDefault(); // Ngăn chọn văn bản khi kéo (quan trọng)
      const dragDeltaX = e.clientX - dragStartX;
      const newTranslateX = dragCurrentTranslate + dragDeltaX;
      swiperWrapper.style.transform = `translate3d(${newTranslateX}px, 0, 0)`;
    });
    document.addEventListener("mouseup", function(e) {
      if (!isDragging) return;
      isDragging = false;
      swiperWrapper.style.cursor = "grab";
      const dragDeltaX = e.clientX - dragStartX;
      // Xác định index mới
      const newIndex = currentIndex + (dragDeltaX < -swipeThreshold ? 1 : dragDeltaX > swipeThreshold ? -1 : 0);
      // Chuyển đến slide mới (sử dụng transition mượt)
      updateScroll(newIndex, transitionDuration);
      if (!swiperWrapper.contains(e.target)) {
        setPageScroll('scroll');
      }
    });
    let touchStartX = 0;
    let isSwiping = false;
    swiperWrapper.addEventListener("touchstart", function(e) {
      if (maxIndex <= 0) return;
      touchStartX = e.touches[0].clientX;
      isSwiping = true;
      swiperWrapper.style.transition = 'none';
      dragCurrentTranslate = -slideWidth * currentIndex;
    });
    swiperWrapper.addEventListener("touchmove", function(e) {
      if (!isSwiping) return;
      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchStartX - touchCurrentX;
      // So sánh độ lớn của deltaX với độ lớn của deltaY để xác định vuốt ngang
      if (Math.abs(deltaX) > Math.abs(e.touches[0].clientY - e.touches[0].clientY)) {
        e.preventDefault();
      }
      const newTranslateX = dragCurrentTranslate - deltaX;
      swiperWrapper.style.transform = `translate3d(${newTranslateX}px, 0, 0)`;
    });
    swiperWrapper.addEventListener("touchend", function(e) {
      if (!isSwiping) return;
      isSwiping = false;
      setPageScroll('scroll');
      const touchEndX = e.changedTouches[0].clientX;
      const finalDeltaX = touchStartX - touchEndX;
      const newIndex = currentIndex + (finalDeltaX > swipeThreshold ? 1 : finalDeltaX < -swipeThreshold ? -1 : 0);
      updateScroll(newIndex, transitionDuration);
    });
  }


  const createDropdownHTML = (data) => {
    const dataItemsHTML = data.map(s => `
    <li class="no-chevron">
      <a class="item-link" href="#">
        <div class="item-content">
          <div class="item-media">
            <img alt="${s.name} icon" class="search-apps-ui__sources-list__source-icon" src="${s.iconURL}" title="${s.name} icon">
          </div>
          <div class="item-inner">
            <div class="item-title">${s.name}</div>
          </div>
        </div>
      </a>
    </li>
  `).join("");
    return `
    <div id="dynamic-dropdown-content" class="dropdown-content" style="position: absolute;">
      <div class="list no-hairlines no-hairlines-between search-apps-ui__sources-list no-margin">
        <ul>
          ${dataItemsHTML}
          <li class="no-chevron">
            <a class="item-link" href="#">
              <div class="item-content">
                <div class="item-media">
                  <i class="icon f7-icons" style="font-size: 24px; width: 24px; height: 24px;">gear </i>
                </div>
                <div class="item-inner">
                  <div class="item-title">Manage</div>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>`;
  };
  // chọn nguồn
  let setTime;
  const setupDropdownBehavior = (triggerElement, Html, x = 270, y = 5) => {
    triggerElement.addEventListener('click', (event) => {
      let dropdown = document.getElementById('dynamic-dropdown');
      if (!dropdown) {
        dropdown = document.createElement("div");
        dropdown.id = 'dynamic-dropdown';
        dropdown.classList.add('dropdown-backdrop');
        // Đặt nội dung popup và ẩn nó đi
        dropdown.innerHTML = Html;
        document.body.append(dropdown);
      }
      triggerElement.classList.add('active-state');
      event.preventDefault();
      const rect = triggerElement.getBoundingClientRect();
      const content = dropdown.querySelector('.dropdown-content');
      if (content) {
        content.style.top = `${rect.bottom + window.scrollY - y}px`; // Vị trí Y: dưới link
        content.style.left = `${rect.left + window.scrollX - x}px`; // Vị trí X: cùng link
        content.style.transformOrigin = `right top`;
      }
      if (setTime !== null) {
        clearTimeout(setTime);
      }
      event.stopPropagation();
      setTimeout(() => triggerElement.classList.remove('active-state'), 200);
      document.addEventListener('click', (event) => {
        // Kiểm tra nếu popup đang hiển thị
        if (dropdown.style.display !== 'none') {
          content.classList.add('modal-out');
          setTime = setTimeout(() => dropdown.remove(), 500);
          const target = event.target;
          /////////////////////////////	console.log(event.target)
        }
      });
    });
  };
  const sourceBtn = document.querySelector('a.link.icon-only.margin-horizontal.bounce-tap');
  if (sourceBtn) {
    const html = createDropdownHTML(DATA)
    setupDropdownBehavior(sourceBtn, html);
  }


  insertApps(); // khởi chạy chèn app
  insertNews(); // khởi chạy chèn tin
  insertSources(); // khởi chạy chèn source


  function insertSources() {
    const listSource = document.getElementById("list-source");
    for (let i = 0; i < 5; i++) insertSourceLoading();
    // test bằng đặt thời gian
    setTimeout(function() {
      listSource.innerHTML = "";
      DATA.forEach(source => insertSourceHtml(source));
      listSource.parentNode.classList.remove("skeleton-text", "skeleton-effect-wave");
    }, 10000);
  }

  function insertNews() {
    const swiperWrapper = document.getElementById("swiper-wrapper");
    swiperWrapper.classList.add("margin-top-half", "skeleton-text", "skeleton-effect-wave"); // Thêm các lớp CSS vào phần tử đó
    for (let i = 0; i < 10; i++) insertNewsLoading();
    // test bằng đặt thời gian
    setTimeout(function() {
      swiperWrapper.innerHTML = "";
      DATA[0].news.forEach(app => {
        insertNewsHtml(app);
      });
      swiperWrapper.classList.remove("margin-top-half", "skeleton-text", "skeleton-effect-wave");
      swiperNews();
    }, 3000);
  }

  function insertApps() {
    let allApp = [];
    let currentIndex = 0;
    const appsPerLoad = 10;
    const rowId = document.getElementById("rows");
    async function run() {
      rowId.innerHTML = "";
      rowId.classList.add("margin-top-half", "skeleton-text", "skeleton-effect-wave");
      const tasks = [];
      for (let i = 0; i < 5; i++) {
        tasks.push(insertAppLoading());
      }
      await Promise.all(tasks); // Chờ tất cả hoàn tất
    }
    run();
    // tải dữ liệu
    // đặt dữ liệu mẫu 
    DATA.forEach(source => {
      source.apps.forEach(app => allApp.push(app));
    });
    //  document.querySelector(".card").style.display = "block";
    let filteredApps = [...allApp];
    // search box
    const searchBox = document.getElementById("filterText");
    const inputClearButton = document.querySelector(".input-clear-button");
    let noapp = null;
    searchBox.addEventListener("input", async () => {
      // 1. Loại bỏ thông báo cũ (nếu có) trước khi tìm kiếm mới
      if (noapp) {
        noapp.remove();
        noapp = null;
      }
      const keyword = searchBox.value.toLowerCase();
      // Thêm/xóa class cho searchBox
      if (keyword) {
        searchBox.classList.add("input-with-value");
        await run();
      } else {
        searchBox.classList.remove("input-with-value");
      }
      // Lọc ứng dụng
      filteredApps = allApp.filter(app => app.name?.toLowerCase().includes(keyword));
      if (filteredApps.length === 0) {
        noapp = document.createElement("div");
        noapp.style.textAlign = "center";
        noapp.classList.add("app-nothing-found");
        noapp.innerHTML = `<div class="app-nothing-found__icon-wrapper"><i class="icon f7-icons" style="font-size: 74px; width: 74px; height: 74px; opacity: 0.4;">app </i><i class="icon f7-icons" style="font-size: 34px; width: 34px; height: 34px;">xmark </i></div><h2>Nothing found for "${keyword}"</h2><p class="padding-bottom"> Check the spelling or try a new search. </p>`;
        rowId.after(noapp);
        return;
      }
      // Nếu có kết quả
      currentIndex = 0;
      setTimeout(() => {
        rowId.innerHTML = "";
        rowId.classList.remove("margin-top-half", "skeleton-text", "skeleton-effect-wave");
        loadMoreApps();
      }, 500);
    });
    // Xử lý sự kiện click cho nút xóa
    inputClearButton.addEventListener("click", () => {
      // 3. SỬA LỖI: Gọi .remove() trên chính phần tử noapp 
      if (noapp) {
        noapp.remove();
        noapp = null; // Đặt lại biến sau khi xóa
      }
      // Đảm bảo xóa class và reset giá trị ô tìm kiếm
      searchBox.classList.remove("input-with-value");
      searchBox.value = "";
      searchBox.dispatchEvent(new Event('input'));
      currentIndex = 0;
      rowId.innerHTML = "";
      filteredApps = [...allApp];
      loadMoreApps();
    });

    function loadMoreApps() {
      const nextApps = filteredApps.slice(currentIndex, currentIndex + appsPerLoad);
      nextApps.forEach(app => insertAppHtml(app));
      currentIndex += appsPerLoad;
    }
    // test bằng đặt thời gian. thực tế sẽ lấy dữ liệu
    setTimeout(function() {
      rowId.innerHTML = "";
      loadMoreApps();
      rowId.classList.remove("margin-top-half", "skeleton-text", "skeleton-effect-wave");
      document.addEventListener('click', function(event) {
        const target = event.target.closest('.item-link');
        if (target) {
          const bundleId = target.getAttribute('data-bundleId');
          console.log(bundleId, target)
          let app = allApp.find(s => s.bundleIdentifier === bundleId) || {};
          if (bundleId && app !== {}) createPopupApp(app);
        }
      });
    }, 200000);
    const container = document.querySelector(".infinite-scroll-content");
    container.addEventListener("scroll", () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;
      if (scrollTop + containerHeight >= scrollHeight - 50) {
        loadMoreApps();
      }
    });
  }

  // chèn loading source 
  async function insertSourceLoading(id = "list-source", position = "beforeend") {
    document.getElementById(id).insertAdjacentHTML(position, `
<li class="media-item">
	<a class="item-link" href="">
		<div class="item-content">
			<div class="sortable-handler"></div>
			<div class="item-media"><img data-v-b79527ff="" alt="source icon" src="icons/apple-touch-icon.png" width="40"></div>
			<div class="item-inner">
				<div class="item-title-row">
					<div class="item-title">-----------</div>
					<div class="item-after">---------------------</div>
				</div>
				<div class="item-footer">--------------------------------</div>
			</div>
		</div>
	</a>
</li>`);
  }

  // chèn source
  async function insertSourceHtml(source, id = "list-source", position = "beforeend") {
    document.getElementById(id).insertAdjacentHTML(position, `
<li class="media-item">
	<a class="item-link" href="">
		<div class="item-content">
			<div class="sortable-handler"></div>
			<div class="item-media"><img data-v-b79527ff="" alt="source icon" src="${source.iconURL}" width="40"></div>
			<div class="item-inner">
				<div class="item-title-row">
					<div class="item-title">${source.name}</div>
					<div class="item-after">${source.apps.length}</div>
				</div>
				<div class="item-footer">${source.sourceURL}</div>
			</div>
		</div>
	</a>
</li>`);
  }

  // hàm chèn app
  async function insertAppHtml(app, id = "rows", position = "beforeend") {
    document.getElementById(id).insertAdjacentHTML(position, `
    <li class="media-item col-100 medium-50">
        <a class="item-link" href="#" data-bundleId = "${app.bundleIdentifier}">
            <div class="item-content">
                <div class="item-media">
                    <div class="fs-app-icon-wrapper" style="border-radius: 23%; width: 75px; height: 75px;">
                        <img alt="App Icon" style="border-radius: 23%; width: 75px; height: 75px;" data-src="${app.iconURL}" src="${app.iconURL}" lazy="loaded">
                        <div class="shadow" style="border-radius: 23%;"></div>
                    </div>
                </div>
                <div class="item-inner">
                    <div class="item-title-row">
                        <div class="item-title">${app.name}</div>
                    </div>
                    <div class="item-subtitle">${app.version}</div>
                    <div class="item-footer">${app.subtitle || app.developerName}</div>
                </div>
            </div>
        </a>
    </li>`);
  }

  // hàm chèn loadingApp
  async function insertAppLoading(id = "rows", position = "beforeend") {
    document.getElementById(id).insertAdjacentHTML(position, `
	<li class="media-item col-100 medium-50 no-margin"><!---->
		<a class="item-link" href=""><div class="item-content"><div class="item-media"><div class="skeleton-block" style="width: 75px; height: 75px; border-radius: 23%;"></div></div><div class="item-inner"><div class="item-title-row"><!----><div class="item-title">----- ----- --</div></div><div class="item-subtitle">--------</div><div class="item-footer">------------- ----------- ----------- --------- ------- -------</div></div></div>
		</a>
	</li>
	`);
  }

  //hàm chèn news
  async function insertNewsLoading(id = "swiper-wrapper", position = "beforeend") {
    document.getElementById(id).insertAdjacentHTML(position, `
	<div class="swiper-slide swiper-slide-active" role="group" style="margin-right: 15px;">
		<a class="link" href="#"><!----><!---->
			<div class="skeleton-block"></div>
			<div class="backout"></div>
			<div class="title"> ------- ------ ------ </div>
		</a>
	</div>
	`);
  }
  async function insertNewsHtml(news, id = "swiper-wrapper", position = "beforeend") {
    document.getElementById(id).insertAdjacentHTML(position, `
	<div class="swiper-slide" role="group" style="margin-right: 15px;">
		<a class="link" href="#">
			<img data-src="${news.imageURL}" src="${news.imageURL}" lazy="loaded">
			<div class="backout"></div>
			<div class="title text-color-white">${news.title}</div>
		</a>
	</div>
	`);
  }


  // hàm popup App
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;()]*[-A-Z0-9+&@#\/%=~_|)])/ig;

  function formatString(string) {
    if (!string) return undefined;
    // URLs
    const urlArray = string.match(urlRegex);
    // const urlSet = [...new Set(urlArray)]; // Converting to set to remove duplicates
    var result = "";
    urlArray?.forEach(url => {
      string = string.replace(url, `<a href="${url}">${url}</a>`)
      // Remove formatted substring so it won't get formatted again (prevents <a> tag within the href attribute another <a> tag)
      let endIndexOfClosingTag = string.indexOf("</a>") + 4;
      let formattedSubstring = string.substring(0, endIndexOfClosingTag);
      result += formattedSubstring;
      string = string.replace(formattedSubstring, "");
    });
    result += string;
    // New lines
    return result.replaceAll("\n", "<br>");
  }

  function formatVersionDate(arg) {
    let versionDate = new Date(arg);
    if (isNaN(versionDate)) {
      const match = arg.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/); // dd/MM/yyyy hoặc dd-MM-yyyy
      if (match) {
        const [_, day, month, year] = match;
        versionDate = new Date(`${year}-${month}-${day}`);
      }
    }
    if (isNaN(versionDate)) return arg;
    const today = new Date();
    const msPerDay = 60 * 60 * 24 * 1000;
    const msDifference = today - versionDate;
    const month = versionDate.toLocaleString("default", {
      month: "short"
    });
    const date = versionDate.getDate();
    const year = versionDate.getFullYear();
    let dateString = `${month} ${date}, ${year}`;
    if (msDifference <= msPerDay && today.getDate() === versionDate.getDate()) dateString = "Today";
    else if (msDifference <= msPerDay * 2) dateString = "Yesterday";
    return dateString;
  }

  function calSize(size) {
    // Version size
    const units = ["B", "KB", "MB", "GB"];
    var appSize = size,
      i = 0;
    while (appSize > 1024) {
      i++;
      appSize = parseFloat(appSize / 1024).toFixed(1);
    }
    return appSize ? `${appSize} ${units[i]}` : "";
  }
  async function createPopupApp(app) {
    const oldPopup = document.querySelector('.popup')
    if (oldPopup) oldPopup.remove();
    // Tạo thẻ div
    const div = document.createElement('div');
    div.classList.add("popup", "popup-push");
    let screenshotHtml = "";
    if (app.screenshotURLs) {
      screenshotHtml = app.screenshotURLs.map(url => `<div class="swiper-slide" role="group" style="width:160px;margin-right: 10px;"><a class="link" href="#"><img alt="app screenshot" src="${url}"></a></div>`).join("");
    }
    div.innerHTML = `
  <div class="popup-push-navbar"><a class="link popup-close" href="#"><i class="icon f7-icons color-gray" style="font-size: 44px; width: 44px; height: 44px;">chevron_compact_down </i></a></div>
  <div class="page">
    <div class="page-content" style="overflow-y: scroll;">
      <div data-v-cc034c0f="" data-v-a0f9a32d="" class="block no-padding no-margin-bottom">
        <div data-v-cc034c0f="" class="accordion-item">
          <div data-v-cc034c0f="" class="list media-list no-hairlines"><!---->
            <ul>
              <li data-v-cc034c0f="" class="media-item">
                <div class="item-content">
                  <div class="item-media"><!---->
                    <div data-v-cc034c0f="" class="fs-app-icon-wrapper" style="border-radius: 23%; width: 120px; height: 120px;"><img alt="App Icon" style="border-radius: 23%; width: 120px; height: 120px;" data-src="${app.iconURL}" src="${app.iconURL}" lazy="loaded">
                      <div class="shadow" style="border-radius: 23%;"></div>
                    </div>
                  </div>
                  <div class="item-inner"><!----><!---->
                    <div class="item-title-row"><!---->
                      <div class="item-title"><!---->${app.name}<!----><!----></div><!----><!---->
                    </div><!---->
                    <div class="item-text">${app.subtitle || app.developerName}</div>
                    <div data-v-cc034c0f="" class="row justify-content-flex-start align-content-flex-end">
                      <div data-v-cc034c0f="" class="col">
                        <div data-v-a0f9a32d="" style="text-align: center; display: flex; gap: 8px;"><a data-v-a0f9a32d="" class="button button-round button-fill sign-app-button-ui bounce-tap" href="${app.downloadURL}"> GET </a></div>
                      </div>
                      <div data-v-cc034c0f="" class="col margin-left"></div>
                      <div data-v-cc034c0f="" class="col" style="margin-left: auto; height: 28px;"><a class="link icon-only app-sign-additional-actions-button-ui button-glass bounce-tap" href="#"><i class="icon f7-icons" style="font-size: 26px; width: 26px; height: 26px;">ellipsis </i></a></div></div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div data-v-f4015073="" class="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-free-mode swiper-backface-hidden">
        <div class="swiper-wrapper" id="swiper-info" aria-live="polite" style="transition-duration: 0ms; transform: translate3d(15px, 0px, 0px);">
          <div data-v-f4015073="" class="swiper-slide swiper-slide-active" role="group" aria-label="1 / 4" style="margin-right: 10px;">
            <div data-v-f4015073="" class="block inset app-view-info-swiper__card">
              <div data-v-f4015073="" class="block-title block-title-medium" medium="true">${app.version}</div> Version
            </div>
          </div>
          <div data-v-f4015073="" class="swiper-slide swiper-slide-next" role="group" aria-label="2 / 4" style="margin-right: 10px;">
            <div data-v-f4015073="" class="block inset app-view-info-swiper__card">
              <div data-v-f4015073="" class="block-title block-title-medium" medium="true">${calSize(app.size)}</div> Size
            </div>
          </div>
          <div data-v-f4015073="" class="swiper-slide" role="group" aria-label="3 / 4" style="margin-right: 10px;">
            <div data-v-f4015073="" class="block inset app-view-info-swiper__card">
              <div data-v-f4015073="" class="block-title block-title-medium" medium="true">${formatVersionDate(app.versionDate)}</div> Updated
            </div>
          </div>
        </div>
      </div><!---->
      <div data-v-9b4949c4=""  class="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden">
        <div class="swiper-wrapper"  id="swiper-screenshot"  style="cursor: grab; transition-duration: 0ms; transform: translate3d(15px, 0px, 0px);" aria-live="polite">${screenshotHtml}
      </div>
      </div>
      <div class="block-title block-title-medium" medium="true">
        <div class="display-flex align-items-center justify-content-space-between"> Description </div>
      </div>
      <div class="block">${formatString(app.localizedDescription)}
      </div><!----><!---->
    </div>
  </div>
  `;
    if (setTime !== null) {
      clearTimeout(setTime);
    }
    document.body.appendChild(div);
    div.style.display = 'block';
    setTime = setTimeout(() => div.classList.add("modal-in"), 200);
    swiperNews("swiper-screenshot");
    swiperNews("swiper-info", 150);


    const closeBtn = div.querySelector('.popup-close');
    const moreBtn = div.querySelector('.app-sign-additional-actions-button-ui');
    if (moreBtn) {
      let versionHtml = '';
      if (app.versions) {
        versionHtml = app.versions.map(s => `
      <li class="no-chevron sign-duplicate-button">
	<a class="item-link tab-link popup-close" href="${s.downloadURL}">
          <div class="item-content">
            <div class="item-media"><i class="icon f7-icons" style="font-size: 24px; width: 24px; height: 24px;">plus_square_on_square </i></div>
            <div class="item-inner"><div class="item-title">${s.version}</div></div>
          </div>
        </a></li>`).join("");
      }
      const html = `<div class="dropdown-content">
  <div class="list no-hairlines no-hairlines-between search-apps-ui__sources-list no-margin"><!---->
    <ul>
      <li class="no-chevron"><!----><a class="item-link" href="#">
          <div class="item-content">
            <div class="item-media"><i class="icon f7-icons" style="font-size: 24px; width: 24px; height: 24px;">arrow_down_doc </i></div>
            <div class="item-inner"><div class="item-title">${versionHtml ? "All Versions": "No Other Version!"}</div></div>
          </div>
        </a></li>${versionHtml}
    </ul><!----><!---->
  </div>
</div>
`;
      setupDropdownBehavior(moreBtn, html, 240);
    }
    closeBtn.addEventListener('click', () => {
      div.classList.remove("modal-in");
      div.classList.add("modal-out");
      setTime = setTimeout(() => div.remove(), 200);
    });
    document.addEventListener('click', () => {});//

  }

})();

