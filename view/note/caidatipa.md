# 💡 Phương Pháp Cài File IPA lên iPhone (Không Cần Jailbreak) - Mới Nhất 2025

## 1\. Phương Pháp Cài IPA Có Dùng PC 💻

Các phương pháp này tận dụng máy tính (Windows/macOS) để ký và cài đặt file IPA lên thiết bị.

### 1.1. AltStore \& AltServer (Cert Miễn Phí)

* **Cách thức:** Cài **AltServer** trên máy tính, đăng nhập **Apple ID miễn phí**. AltServer giúp cài đặt ứng dụng **AltStore** lên iPhone. Sau đó, dùng AltStore trên iPhone để cài các file IPA.
* **Hiệu lực:** Mỗi app hiệu lực **7 ngày**, cần kết nối với AltServer (trên PC) hoặc nhấn **“Refresh”** trong AltStore (khi PC và iPhone cùng mạng) để gia hạn.
* **Hạn chế:** Giới hạn **3 ứng dụng** ngoài cùng lúc.

### 1.2. Sideloadly (Cert Miễn Phí/Có Phí)

* **Cách thức:** Tải và cài đặt **Sideloadly** trên PC. Đăng nhập Apple ID. Nhập file IPA và cài đặt qua kết nối USB/WiFi.
* **Phân loại:**

  * **Cert Miễn Phí:** App tồn tại **7 ngày**, sau đó phải cài lại.
  * **Cert Có Phí:** Dùng tài khoản **Apple Developer Program** ($99/năm), app duy trì lâu dài, **không giới hạn** số lượng app.

### 1.3. 3uTools (Chỉ Có Phí - Ít Phổ Biến Sau 2024)

* **Cách thức:** Cài 3uTools, kết nối iPhone, nhập IPA và cài đặt thẳng lên máy.
* **Lưu ý:** Thường yêu cầu chứng chỉ của tài khoản dev trả phí hoặc dịch vụ ủy quyền cert (dịch vụ này đang bị Apple siết chặt hơn).

---

## 2\. Phương Pháp Cài IPA Không Dùng PC 📲

Các phương pháp này cho phép cài đặt trực tiếp trên iPhone, đa số yêu cầu kết nối mạng.

### 2.1. TrollStore và TrollStore Lite (Cài Vĩnh Viễn)

* **Cách thức:** Khai thác các lỗ hổng hệ thống (exploit như MDC, KFD) để cài IPA **vĩnh viễn** mà **không cần chứng chỉ** của Apple (không bị thu hồi cert).
* **Phạm vi Hỗ trợ:**

  * **TrollStore Gốc:** Chủ yếu iOS **14.0–15.4.1**.
  * **Các bản Exploit Mới:** Mở rộng tới **15.5–16.6.1** (cần kiểm tra thiết bị cụ thể).

* **Quy trình:** Cài **TrollHelperOTA** hoặc tool phù hợp, sau đó cài IPA trong chính ứng dụng TrollStore.
* **Ưu điểm:** App tồn tại **vĩnh viễn**, không cần PC, không cần Apple ID hay cert.
* **Nhược điểm:** **Giới hạn nghiêm ngặt** về phiên bản iOS và thiết bị tương thích.
  [Hướng dẫn cài IPA bằng Trollstore](https://drphe.github.io/KhoIPA/view/note/?source=aHR0cHMlM0ElMkYlMkZkcnBoZS5naXRodWIuaW8lMkZLaG9JUEElMkZyZXBvLmRldmVsb3BtZW50Lmpzb24=&link=trollstore.md)
* 

### 2.2. TestFlight (Beta Testing)

* **Cách thức:** Nền tảng chính thức của Apple cho phép nhà phát triển phân phối bản **beta**. Người dùng cài đặt trực tiếp từ App Store sau khi nhận **link mời** từ nhà phát triển.
* **Ưu điểm:** Rất **an toàn**, ít gặp lỗi và thu hồi vì sử dụng chứng chỉ hợp lệ của Apple.
* **Hạn chế:** Chỉ áp dụng với các app đang chia sẻ bản beta (không thể cài file IPA lạ tùy ý).



### 2.3. Dịch vụ Ký IPA Trực Tuyến (Cert Có Phí)

* **Cách thức:** Upload file IPA lên trang web của dịch vụ, trả phí, và nhận **link cài đặt trực tiếp** qua Safari. Dịch vụ này dùng chứng chỉ **doanh nghiệp** hoặc **giả developer**.
* **Thời hạn:** Cert có hạn sử dụng từ vài tháng tới 1 năm.
* **Rủi ro:** Chứng chỉ **dễ bị Apple thu hồi** (Revoke), khiến app ngừng hoạt động bất ngờ.
* **Hướng dẫn:** 
* Bạn sử dụng dịch vụ bán chứng chỉ (Cert) như certapple.com, iosviet.vn, thuthuatjb.com... hoặc truy cập [https://t.me/AppleP12](t.me/AppleP12) để tải chứng chỉ miễn phí (rủi ro revok và blacklist). Sau khi nhận được tệp cert.zip thì upload chứng chỉ và file IPA cần cài lên một các trang sau để nhận link cài trực tiếp:

[https://sign.codevn.net](https://sign.codevn.net)

[https://sign.ipasign.cc/](https://sign.ipasign.cc/)



### 2.4. Ứng dụng "Signer" Trung Gian

* **Các ứng dụng nổi bật:** Feather, Scarlet, ESign, GBox, AltStore PAL (một số ứng dụng có thể là bản lite của TrollStore).
* **Cách thức:** Cài đặt app signer qua Safari/TestFlight. Sau đó dùng app signer để nhập file IPA và cài đặt trực tiếp lên iPhone.
* **Lưu ý:** Cần **nhập cấu hình chứng chỉ** (miễn phí hoặc thuê cert chất lượng cao hơn) và đôi khi cần lấy **UDID** máy để cấp phép.
* **Nhược điểm:** Vẫn tồn tại rủi ro **bị thu hồi chứng chỉ**, đặc biệt với các cert miễn phí hoặc cert công khai.
* Đối với Gbox, Scalert là dịch vụ có từ trước, hỗ trợ tốt và có thể cài trực tiếp từ website chính thức (sử dụng cert có phí hoặc miễn phí)

[Cài đặt Gbox](https://gbox.run/)

[Cài đặt Scalert](https://usescarletapp.com)



Đối với Feather, Esign là những ứng dụng mới, cài đặt bằng các công cụ online như tại mục 2.3 hoặc cài đặt qua Trollstore

Ngoài ra một số dịch vụ bán chứng chỉ (cert) có kèm link cài đặt trực tiếp các ipa mod phổ biến như Facebook NoADS, Youtube Lite,...

Một số dịch vụ chính: Certapple.com, Unkeyapp.com, Thuthuatjb.com...





\*\*Chế độ Nhà phát triển (Developer Mode): \*\* Là yêu cầu bắt buộc khi muốn cài đặt các ứng dụng ngoài AppleStore.
[Xem bài hướng dẫn ở đây](https://drphe.github.io/KhoIPA/view/note/?source=aHR0cHMlM0ElMkYlMkZkcnBoZS5naXRodWIuaW8lMkZLaG9JUEElMkZyZXBvLmRldmVsb3BtZW50Lmpzb24=&link=developermod.md)

