# **Hướng Dẫn Chống Thu Hồi Chứng Chỉ iOS**

Update 1/11/2025, dù xài DNS nhưng chứng chỉ vẫn bị thu hồi, do các cert mua thường theo lô (nhiều UDID cùng chung), khi apple quét thì vẫn bị thu hồi như thường. Apple rất căng và muốn ngăn chặn hoàn toàn việc Sideload app lậu. Revoke với số lượng lớn hoàn toàn. Những acc dev bị revoke đều là những acc dev trước đó gia hạn sử dụng trong nhiều năm liền. Việc bảo hành sẽ không thể gấp rút trước 35 ngày. 

Hiện nay đã có thể xài DNS để sử dụng cert revoked cho ios 26, nếu bạn muốn free sideloading  <a href="#" data-url="freesideloading.md" class="news-item-link">Xem bài này</a>.

Nếu muốn xài DNS để chặn quảng cáo <a href="#" data-url="dnsadblock.md" class="news-item-link"> Xem bài này </a>

Đọc tiếp để thiết lập (thủ công) DNS chặn thu hồi cert.

### Thiết Lập Danh Sách Chặn URL với NextDNS

[Tác giả: Rohit Chouhan – Cập nhật ngày 26/07/2025](https://blogs.rohitchouhan.com/hacks/ios-anti-revoke-esign-feather-nextdns-block-urls-guide/)



Việc thu hồi chứng chỉ từ Apple là một vấn đề phổ biến đối với người dùng iOS khi cài đặt ứng dụng qua phương pháp sideload hoặc sử dụng chứng chỉ doanh nghiệp. Khi Apple phát hiện chứng chỉ không hợp lệ, họ sẽ thu hồi ngay, khiến ứng dụng không thể hoạt động. Tuy nhiên, bạn có thể ngăn chặn điều này bằng cách sử dụng NextDNS để chặn các máy chủ xác thực chứng chỉ của Apple.



#### 📌 Tại sao Apple thu hồi chứng chỉ?

Apple sử dụng hệ thống xác thực chứng chỉ để đảm bảo an toàn cho người dùng. Khi bạn cài ứng dụng bằng chứng chỉ doanh nghiệp, thiết bị sẽ liên tục kiểm tra tính hợp lệ của chứng chỉ với máy chủ Apple. Nếu chứng chỉ bị phát hiện lạm dụng, Apple sẽ đưa nó vào danh sách thu hồi, khiến ứng dụng bị vô hiệu hóa.



#### 🛡️ Giải pháp: Chặn máy chủ xác thực bằng NextDNS

NextDNS cho phép bạn tạo danh sách chặn các tên miền liên quan đến xác thựcchứứng chỉ. Bằng cách ngăn thiết bị truy cập các máy chủ như ocsp.apple.com, bạn có thể duy trì hoạt động của ứng dụng đã cài.



#### 🔧 Các bước thiết lập NextDNS

Tạo tài khoản NextDNS miễn phí và tạo một hồ sơ cấu hình mới.



Đặt tên hồ sơ dễ nhớ, ví dụ: “Bảo vệ chứng chỉ iOS”.



Thêm các tên miền sau vào danh sách chặn:



Danh sách chặn bắt buộc:

\*.ocsp.apple.com

\*.ocsp2.apple.com

\*.ocsp3.apple.com

\*.ocsp4.apple.com

\*.certs.apple.com

\*.crl.apple.com

\*.valid.apple.com

\*.appattest.apple.com



Danh sách chặn bổ sung (tùy chọn):

\*.vpp.itunes.apple.com

\*.axm-app.apple.com

\*.gdmf.apple.com

\*.guzzoni-apple-com.v.aaplimg.com

\*.comm-main.ess.apple.com

\*.comm-cohort.ess.apple.com



*Lưu ý: Có thể ảnh hưởng đến một số dịch vụ Apple.*



Danh sách cho phép (whitelist):

\*.ppq.apple.com

\*.i.yyyue.xyz

\*.app.localhost.direct

Các tên miền này cần thiết để cài đặt và xác thực chứng chỉ ban đầu.



#### 📲 Cài đặt hồ sơ NextDNS trên iOS

Tải file .mobileconfig từ NextDNS.



Vào **Cài đặt > Cài đặt chung > VPN \& Quản lý thiết bị,** chọn hồ sơ đã tải và nhấn “Cài đặt”.



Kiểm tra DNS đã chuyển sang máy chủ của NextDNS.



### ⚠️ Lưu ý khi cài chứng chỉ

Tạm tắt NextDNS khi cài chứng chỉ để tránh lỗi xác thực.



Sau khi cài xong, bật lại NextDNS để tiếp tục bảo vệ.



#### 🧩 Khắc phục sự cố

Kiểm tra whitelist nếu gặp lỗi kết nối.



Theo dõi log của NextDNS để điều chỉnh danh sách chặn phù hợp.



#### 🔄 Phương pháp thay thế

Chặn ở cấp độ router: áp dụng cho toàn bộ mạng.



Dùng công cụ chuyên biệt như BlacklistBeGone để hỗ trợ thêm.



#### 🔐 Cân nhắc bảo mật

Việc chặn máy chủ xác thực đồng nghĩa với việc bạn tự chịu trách nhiệm về chứng chỉ đã cài.



Chỉ sử dụng chứng chỉ từ nguồn đáng tin cậy.



Thường xuyên kiểm tra và gỡ bỏ chứng chỉ không còn sử dụng.



###  Link tải xuống tham khảo



1. [Chống Revoke](https://drphe.github.io/KhoIPA/upload/anti_revoke.mobileconfig)

2. Tham khảo [Nguồn John220099](https://github.com/John220099/Anti-revoke-blacklist/tree/main)

[Tải xuống Anti-Revoke-Blacklist](https://drphe.github.io/KhoIPA/upload/Anti-revoke-blacklist.mobileconfig)



3. Tham khảo [https://t.me/TechjunkieAmanIAm](https://t.me/TechjunkieAmanIAm)



Sử dụng ShortCut: [Anti-revoke](http://icloud.com/shortcuts/2253fa774c3442098be4baf1b03b8bb8) (3 cấu tùy chọn)



Hoặc nhấn vào link trực tiếp:



[https://api.cococloud-signing.online/website/dns/config/cococloud-block-revokes.mobileconfig](https://api.cococloud-signing.online/website/dns/config/cococloud-block-revokes.mobileconfig)



[https://api.cococloud-signing.online/website/dns/config/cococloud-block-revokes-v2.mobileconfig](https://api.cococloud-signing.online/website/dns/config/cococloud-block-revokes-v2.mobileconfig)



[https://api.cococloud-signing.online/website/dns/config/cococloud-block-revokes(v3).mobileconfig](https://api.cococloud-signing.online/website/dns/config/cococloud-block-revokes(v3).mobileconfig)



4\. Chặn cập nhật IOS

Mô tả:

\- Cấu hình chặn cập nhật iOS là tệp .mobileconfig cài trên thiết bị iOS để ngăn tải hoặc cài bản cập nhật mới từ Apple

Hướng dẫn:

\- Tải xuống và cho phép cài về cấu hình

\- Mở cài đặt - Vào cài đặt chung

\- Quản lý VPN DNS \& thiết bị

\- Tiến hành cài đặt cầu hình



[Tải OTA](https://cydia.ichitaso.com/no-ota18.mobileconfig)

[OTA newest](https://ios.cfw.guide/blocking-updates/)
