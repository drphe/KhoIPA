# 🚀 Sử dụng Chứng Chỉ Bị Thu Hồi (Revoked) Bằng DNS WSF

**Nguồn bài viết:**[ Techjunkie Aman](https://t.me/TheTechjunkieAman)

👉 Xem video HD : [Ở đây](https://www.youtube.com/watch?v=HXnNqb05ios)


Apple gần đây đã giới thiệu các quy định mới về việc xác minh ứng dụng được cài đặt thông qua **chứng chỉ nhà phát triển**. Kết quả là nhiều người dùng gặp lỗi **“Không thể xác minh ứng dụng”** hoặc ứng dụng bị **crash** sau khi khởi chạy. Vấn đề này ảnh hưởng toàn cầu đến tất cả các dịch vụ sử dụng chứng chỉ nhà phát triển.
<a href="#" data-url="loicert.md" class="news-item-link">Xem chi tiết</a>.
![Verify App](https://drphe.github.io/KhoIPA/common/assets/img/verifyapp.jpg)

## ✅ Giải pháp: Sử dụng DNS WFS

Bạn là người mới, có thể <a href="#" data-url="freesideloading.md" class="news-item-link">Xem bài hướng dẫn này</a> để hiểu biết cơ bản về cách sử freesideloading bằng cert bị thu hồi.

<a href="#" data-url="dnswfs.md" class="news-item-link">QUAN TRỌNG : Xem hướng dẫn sử dụng DNS WFS</a> trước khi bắt đầu.

DNS này cho phép bạn **vượt qua lỗi xác minh ứng dụng** và **cài đặt IPA** bằng các công cụ như **eSign**, **kSign**, và **Feather** — ngay cả khi dùng **chứng chỉ đã bị thu hồi**. 

[Michelle DNS V2 - Update](https://cloud.kamikami.eu/s/michelledns)

[WSF CFDNS](https://wsfteam.xyz/files/configurationprofiles/CFDNS-CP144.mobileconfig) hoặc [link dự phòng](https://drphe.github.io/KhoIPA/upload/CFDNS-CP144.mobileconfig)

[WSF madNS](https://wsfteam.xyz/files/configurationprofiles/madNS-CP144.mobileconfig) hoặc [link dự phòng](https://drphe.github.io/KhoIPA/upload/madNS-CP144.mobileconfig)

[WSF CFDNS](https://wsfteam.xyz/files/configurationprofiles/WFS-CP144.mobileconfig) hoặc [link dự phòng](https://drphe.github.io/KhoIPA/upload/WFS-CP144.mobileconfig)

### 🔥 Ưu điểm:

* Bypass lỗi **“Không thể xác minh ứng dụng – cần kết nối Internet”**
* Cài đặt IPA bằng **eSign**, **kSign**, **Feather** với chứng chỉ bị thu hồi
* **Không bị chặn**, **không giới hạn 7 ngày** — chỉ cần cài IPA!
* Tối ưu cho các ứng dụng **offline**
* Hoạt động trên **iOS 18**
* 3 chế độ DNS hoạt động riêng: Install Only giúp chặn 7 host kiểm tra Cert, DNS Keep after Install giúp chặn cơ chế PPQ

---

## 🛠️ Các bước thực hiện

Truy cập một trong các trang sau để cài trực tiếp và tải cert:

* ✅ [Portal](https://wsfteam.xyz/#downloads)
* ✅ [eSign](https://techybuff.com/esign/)
* ✅ [Feather](https://techybuff.com/feather/)
* ✅ [kSign](https://techybuff.com/ksign/)

=> <a href="#" data-url="allsetupipa.md" class="news-item-link"> Tổng hợp link của techybuff.com </a>


### 1\. Tải và cài đặt cấu hình DNS

* Cài đặt cấu hình **WSF CFDNS** vào thiết bị iOS của bạn (link ở trên)

### 2\. Nhấn vào tên chứng chỉ để cài đặt ứng dụng

* Truy cập trang nguồn, chọn ứng dụng với chứng chỉ mong muốn để cài IPA
* Nếu lỗi, thử ứng dụng khác cho đến khi thành công

### 3\. Tin cậy chứng chỉ nhà phát triển (nếu được yêu cầu)

* Vào **Cài đặt → Cài đặt chung → Quản lý VPN \& Thiết bị**
* Chọn **Tin cậy chứng chỉ**
* Có thể cần **khởi động lại thiết bị**

### 4\. Tải file ZIP chứa chứng chỉ

* File thường có sẵn trên trang web hoặc link kèm theo

### 5\. Giải nén và nhập chứng chỉ vào ứng dụng

* Dùng **eSign**, **kSign**, hoặc **Feather** để nhập chứng chỉ và ký IPA

### 6\. Ký và Cài đặt IPA

* Sau khi tải file IPA về, nhập vào Esign, Feather...
* Chọn cấu hình INSTALL ONLY
* Bắt đầu sign và cài đặt , chạy app lần đầu.
* Chuyển cấu hình DNS sang cấu hình khác.

---

## 📌 Hướng dẫn sau khi cài đặt

1. Không tắt cấu hình DNS (Config Profile)
2. Chỉ kích hoạt một cấu hình DNS tại một thời điểm
3. Không cài quá nhiều IPA trong thời gian ngắn**
4. Khi chuyển DNS, bật chế độ máy bay trước**
5. Trước khi tắt máy / khởi động lại / cập nhật iOS:
   * Bật **chế độ máy bay** và **tắt Wi-Fi**
6. Chỉ dùng VPN sau khi làm đúng hướng dẫn thiết lập VPN

---

## 🌐 Công cụ ký IPA online

* [https://sign.codevn.net](https://sign.codevn.net)
* [https://sign.ipasign.cc](https://sign.ipasign.cc/)
* [https://sign.kravasign.com](https://sign.kravasign.com/)

> Nếu chứng chỉ của bạn bị thu hồi, bạn vẫn có thể sử dụng chúng đến khi hết hạn bằng DNS này kết hợp với eSign hoặc Feather đã ký bằng chứng chỉ đó để tiếp tục cài IPA.





