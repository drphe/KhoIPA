Có nhiều cách cài file IPA lên iPhone mà không cần jailbreak, được chia thành hai nhóm: dùng PC và không dùng PC. Mỗi nhóm lại có sự khác biệt về việc dùng chứng chỉ (cert) miễn phí hay trả phí. Dưới đây là tổng hợp chi tiết các phương pháp áp dụng mới nhất năm 2025:

1. Dùng PC
•	Thông qua iTunes và phần mềm AltStore (cert miễn phí):
•	Cài đặt AltServer trên máy tính Windows/macOS, kết nối iPhone qua cáp, đăng nhập tài khoản Apple miễn phí.
•	Dùng AltStore cài trực tiếp IPA, mỗi app sẽ có hiệu lực tối đa 7 ngày, sau đó cần cài lại qua AltServer (hoặc nhấn “Refresh”).
•	Ưu điểm: miễn phí, không cần jailbreak, altstore tương đối ổn định.
•	Hạn chế: giới hạn 3 app cùng lúc, yêu cầu PC mỗi 7 ngày để “refresh”.
•	Sử dụng Sideloadly (cert miễn phí/ có phí):
•	Tải Sideloadly cho Windows/macOS, đăng nhập Apple ID (miễn phí) hoặc dùng cert trả phí (developer).
•	Sideloadly cho phép nhập IPA, quét và cài đặt app lên iPhone qua kết nối USB hoặc WiFi.
•	Cert miễn phí: app tồn tại trên máy 7 ngày, phải cài lại sau đó.
•	Cert có phí: sử dụng Apple Developer Program (99 USD/năm), app duy trì lâu dài, không giới hạn số lượng app.
•	Công cụ 3uTools (chỉ có phí, đôi khi lỗi ở bản mới):
•	Cài 3uTools, kết nối iPhone, nhập IPA rồi cài thẳng lên máy.
•	Có thể dùng chứng chỉ của tài khoản dev trả phí hoặc dịch vụ ủy quyền gắn cert (ít phổ biến sau 2024 do Apple siết chính sách).

2. Không dùng PC
•	Cert miễn phí (qua các ứng dụng cấp phép trực tiếp):
•	AltStore trên iOS (yêu cầu PC chỉ lần đầu): Cài AltStore lần đầu bằng PC, sau đó gửi file IPA qua WiFi và cài trực tiếp bằng AltStore.
•	TestFlight: Một số app chia sẻ link TestFlight beta, cài đặt trực tiếp từ Safari (không dùng IPA).
2. TrollStore và TrollStore Lite
•	Quy trình:
•	TrollStore (và bản Lite) khai thác hệ thống để cài IPA vĩnh viễn mà không cần chứng chỉ của Apple, không bị thu hồi cert, an toàn gần như jailbreak nhưng không cần “root” máy.[thanhtrungmobile]
•	Chỉ hỗ trợ iOS trong khoảng 14.0–15.4.1 (trollstore “gốc”) hoặc 15.5–16.6.1 (các bản exploit mới, ví dụ MDC, KFD), từng dòng thiết bị cần kiểm tra hỗ trợ cụ thể.[youtube +1]
•	Bước cài: Tải TrollHelperOTA hoặc tool phù hợp trên Safari, làm theo hướng dẫn trên app, cấp quyền hệ thống, sau đó cài IPA trong chính TrollStore (có thể truy cập từ web, file manager) với tùy chọn “Install IPA”.
•	Ưu điểm: Cài app ngoài vĩnh viễn, không thu hồi, không cần máy tính, đa số IPA không bị giới hạn chức năng, không cần Apple ID hay cert.[thanhtrungmobile]
•	Nhược điểm: Giới hạn về phiên bản iOS và thiết bị “tương thích”; thao tác cài ban đầu hơi phức tạp với người dùng mới.
3. TestFlight
•	Quy trình:
•	Được Apple cung cấp, cho phép các nhà phát triển phát hành bản beta cho người dùng sử dụng.
•	Thường phải xin link mời từ nhà phát triển hoặc cộng đồng, tệp IPA được đóng gói thành bản beta và dùng TestFlight cài trực tiếp qua App Store.[24hstore +1]
•	Ưu điểm: An toàn, ít gặp lỗi, ít bị thu hồi, vừa dùng thử được app mới vừa ký tự động bằng Apple cert.
•	Nhược điểm: Chỉ áp dụng với các app có bản beta hoặc được chia sẻ link TestFlight; không tùy ý cài file IPA lạ một cách tự do.
•	Cert có phí (dịch vụ cấp phép online):
•	Dịch vụ ký IPA trực tuyến (Sign Service): Upload IPA lên trang web, trả phí, nhận lại link cài đặt trực tiếp qua Safari (nhận chứng chỉ doanh nghiệp/giả developer).
•	Các dịch vụ này cung cấp cert riêng biệt (tính phí tuỳ theo thời gian/gói app), hạn sử dụng từ vài tháng tới 1 năm.
1. Cài qua ứng dụng “signer” trung gian
Các app signer nổi bật gồm Feather, Scarlet, TrollStore Lite, ESign, GBox, AltStore PAL.
•	Quy trình:
•	Cài ứng dụng signer thông qua Safari, TestFlight, hoặc link nhà phát triển.
•	Nhập cấu hình chứng chỉ (miễn phí/thuê hoặc mua), lấy UDID máy để cấp phép, sử dụng app signer để chọn file IPA và cài trực tiếp lên iPhone.
•	Một số app cần tải profile cấu hình, thêm nguồn hoặc liên kết với dịch vụ online cấp cert.[viettelstore +1]
•	Ưu điểm: Cài trực tiếp, không cần PC hay jailbreak; dùng được cho nhiều dòng iPhone/iPad; hỗ trợ đa số IPA phổ biến.
•	Nhược điểm: Tồn tại rủi ro bị Apple thu hồi chứng chỉ (cert), app bị treo hoặc xóa bất ngờ; một số dịch vụ/phần mềm thu phí khi cấp cert chất lượng.[youtube]
•	Rủi ro: Một số dịch vụ có thể bị thu hồi cert, app ngừng hoạt động bất ngờ. Nên chọn dịch vụ uy tín.