# Cách sideload trên iOS mà không cần jailbreak, không bị hết hạn và hoàn toàn miễn phí
Updated: 2/6/2026
## Hướng dẫn Sideloading

### Trước khi bắt đầu:

Điều quan trọng là bạn phải đọc kỹ toàn bộ hướng dẫn trước để hiểu rõ khái niệm và các khía cạnh kỹ thuật, từ đó có thể tự xử lý sự cố hoặc tránh gặp vấn đề. 

## DNS anti-revoke là gì?

- Đây là một hồ sơ DNS được tạo sẵn từ Khơindvn, với sự giúp đỡ của một YouTuber có tên là Pork the Jork. Nó được dùng để ngăn máy chủ Apple xác minh bundle ID của một ứng dụng tải xuống không thông qua App Store với UDID của thiết bị khi ký bằng chứng chỉ trước khi cài đặt, vì từ iOS 13 trở đi ứng dụng không còn được ký trực tiếp trên thiết bị như PC hoặc Mac.

- Cơ chế này được gọi là Bypass Revoke, vì chúng ta tái sử dụng các chứng chỉ đã bị thu hồi cho đến khi hết hạn, chứ không phải ngăn chặn chứng chỉ doanh nghiệp bị thu hồi như các giải pháp DNS chống thu hồi. Tuy nhiên, nếu bạn bị blacklist (không thể xác minh tính toàn vẹn hoặc lỗi cài đặt) do rò rỉ DNS thì hãy xem phần cuối để biết cách được xử lý.

### Bước 1: Cài đặt DNS
- Truy cập → [Khoindvn Repo](https://kho-ipa.vercel.app/view/?source=aHR0cHMlM0ElMkYlMkZyYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJTJGZHJwaGUlMkZLaG9JUEElMkZtYWluJTJGdXBsb2FkJTJGa2hvaW5kdm4uanNvbg==)
![image](https://i.ibb.co/rKTztjny/IMG-0533.png)
- Hãy đảm bảo Safari là trình duyệt mặc định của bạn hoặc được sử dụng trước khi mở liên kết cài đặt DNS Anti-revoke 
- Vào Cài đặt → Cài đặt chung → Quản lý VPN, DNS Quản lý
- Cài đặt hồ sơ và để nó hoạt động.

Việc chạy DNS hoàn toàn ổn vì bạn cần chứng chỉ TLS để giải mã kết nối HTTPS, do đó nó chỉ chặn một số bộ lọc phục vụ cho mục đích sideloading mà không cần jailbreak.

### iOS 18+ 
- Do một lỗi, hồ sơ (profile) sẽ được tải xuống dưới dạng tệp trước tiên trong `thư mục tải xuống` của ứng dụng Files. Hãy kiểm tra để chắc chắn rằng tên tệp kết thúc bằng .mobileconfig, sau đó đổi tên thành “filename.mobileconfig”, rồi mở tệp đã đổi tên đó thủ công và quay lại ứng dụng Cài đặt để tiếp tục.

- Từ iOS 18 trở đi cũng có một thay đổi mới: thiết bị sẽ khởi động lại (restart) mỗi khi bất kỳ loại hồ sơ nào (kể cả một DNS đơn giản) được cài đặt. Vì vậy, hãy bật Chế độ máy bay (AirPlane mode) trước khi khởi động lại để tránh rò rỉ DNS và dẫn đến bị blacklist, phần này sẽ được giải thích thêm sau.

---
### Bước 2. Cài đặt Esign/Ksign
 Esign là một ứng dụng dùng để ký, có thể tải xuống, giải nén, đóng gói, nhập, ký và cài đặt các tệp iPA để trở thành ứng dụng, ngoài ra còn có thể truy cập trực tiếp các kho (repo) công cộng.  
- Truy cập liên kết để cài đặt Esign/Ksign nào đó.
![image](https://i.ibb.co/Z6nz3N82/IMG-0534.png)
- Các chứng chỉ đã đính kèm trong Esign. Nếu một chứng chỉ không hoạt động với bạn, hãy thử một chứng chỉ khác.  
- Vào **Cài đặt → Cài đặt chung → VPN, DNS, Quản lý thiết bị → Ứng dụng doanh nghiệp (Enterprise App)**.  
- Nhấn vào tên chứng chỉ, sẽ có nút **Tin cậy (Trust)**.  

### Tùy chỉnh Esign
- Mở ứng dụng Esign, dưới tab **Download** ở thanh điều hướng dưới cùng, tìm biểu tượng dấu ba chấm **•••** ở phía trên, rồi vào **Cài đặt (Settings)** để bật cả hai tùy chọn **Auto Import** và **Auto Delete**.
![image](https://i.imgur.com/GrFNPW9.png)
- Như vậy, mỗi lần tải tệp IPA từ repo, Esign sẽ tự động nhập và giải phóng bộ nhớ

### Lấy Certs
- Cert chỉ đơn giản là viết tắt của *certificate* (chứng chỉ), ở đây chúng ta sẽ dùng các chứng chỉ đã hết hạn thay vì chứng chỉ mới nhất… ví dụ như HDFC Life Insurance (Ấn Độ) hoặc cũ hơn như Sunshine Insurance Group (Trung Quốc).
- Các phiên bản Esign/Ksign mới đã nhúng sẵn cert, không cần tải ngoài nữa, dùng Esign, Ksign vừa cài có thể ký và cài đặt IPA được rồi. 
---
### Bước 3: Tải Repo
Repo là viết tắt của *repository* (kho lưu trữ), nó hoạt động giống như một thư viện ứng dụng. Các repo có thể trông giống như liên kết nhưng thực chất các URL này không mở ra trang web, mà được dùng để sao chép và dán trực tiếp vào ứng dụng.  
- Truy cập trang chủ của tôi: https://kho-ipa.vercel.app để tìm các repo phù hợp yêu cầu của bạn.
- Nhấn vào liên kết hoặc sao chép thủ công từ trên để dán vào:  
  **Esign → App Source (Góc trên bên trái) → +**  
- Sau đó bạn sẽ thấy mình có thể tìm kiếm và tải xuống ứng dụng trực tiếp ngay trong Esign.  

![image](https://i.imgur.com/yntP97H.jpeg)

---

## Cài đặt ứng dụng
Nếu bạn đã theo dõi kỹ từ đầu đến giờ thì sẽ nhận ra rằng bạn vẫn chưa thực sự cài đặt ứng dụng nào. Điều này là bởi vì, khác với App Store, chức năng tìm kiếm trong Esign/Ksign chỉ tải xuống ứng dụng, sau đó bạn cần phải ký nó trước khi cài đặt.  

### Cách ký và cài đặt bằng Esign:
- Khi bắt đầu quá trình cuối cùng này, bạn sẽ thấy nút **Signature** nằm phía trên nút **Install**.  
- Đây mới là phần quan trọng và sẽ được sử dụng nhiều hơn, trừ khi bạn muốn nhân bản (sẽ nói thêm sau) một ứng dụng đã được ký sẵn như WhatsApp.  

![image](https://i.imgur.com/dB9JmWt.png)

### Cách nhân bản ứng dụng với Esign
Có những trường hợp bạn muốn có ứng dụng nhân bản vì muốn giữ nguyên bản gốc, linh hoạt sử dụng nhiều tài khoản nhắn tin hoặc duy trì hai mục đích sử dụng riêng biệt. Thông thường, tôi dùng phím tắt có tên [Signed Installer](https://www.reddit.com/r/shortcuts/comments/17d6ef8/), nhưng Esign cũng cho phép nhân bản ứng dụng.  

- Chỉnh sửa tên ứng dụng thành tên tùy chỉnh của bạn (ví dụ: *YouTube Red*) hoặc thêm ký hiệu **+** sau tên gốc, miễn là bạn thay đổi tên ban đầu.  
- Thêm **“.1”** vào *bundle identifier*. Ví dụ, nếu *bundle identifier* gốc là **“com.google.ios.youtube”** thì hãy đổi thành **“com.google.ios.youtube.1”**.  

![image](https://i.imgur.com/VkEWcZI.jpeg)

---
## Ghi chú cuối cùng
Có một vài điều bạn cần ghi nhớ, chỉ là những nguyên tắc cơ bản:  
- **Đừng cố cài đặt bất kỳ phiên bản Esign/Ksign... nào mà không có DNS (Bypass Revoke)**, nếu không chúng sẽ bị đưa vào danh sách đen ngay lập tức vì các chứng chỉ vốn đã bị thu hồi, và việc dùng DNS sau đó cũng sẽ không giúp bạn được whitelist.  
- Có thể sẽ có trường hợp bạn vẫn thất bại khi khởi chạy; khi đó hãy gỡ bỏ ứng dụng, chứng chỉ hoặc thậm chí cả DNS liên quan trong quá trình này rồi bắt đầu lại từ đầu với một chứng chỉ khác.  
- Nếu bạn vẫn không thể cài đặt Esign hoặc liên tục gặp thông báo bật lên “không thể xác minh tính toàn vẹn” cho tất cả chứng chỉ, thì rất có thể thiết bị của bạn đã bị đưa vào danh sách đen. Trong trường hợp này, bạn cần sao lưu dữ liệu trước rồi **khôi phục cài đặt gốc (factory reset)** hoặc **khôi phục cục bộ (local restore)** thiết bị. Việc khôi phục từ bản sao lưu cục bộ chỉ yêu cầu bạn đăng nhập lại vào các ứng dụng bảo mật như trình quản lý mật khẩu, ứng dụng nhắn tin mã hóa hoặc ứng dụng ngân hàng, còn lại dữ liệu vẫn được giữ nguyên.  

- Không nên cập nhật IOS nếu bạn muốn sử dụng DNS và cert theo cách này, có quá nhiều rủi ro với Cert và dữ liệu trong app của bạn.  

- Hệ điều hành của Apple có một điểm kỳ lạ [(thực chất là một lỗ hổng bảo mật)](https://www.macrumors.com/2022/08/18/vpns-for-ios-are-broken-says-researcher/) đó là không hoàn toàn ngắt kết nối internet với các tuyến hiện có khi thiết lập quy tắc mới, dù là qua DoH hay VPN. Vì vậy, nó tạm thời chuyển sang kết nối không mã hóa ngay cả khi bạn có hai hồ sơ DNS với bộ lọc đối xứng – điều này gây ra [rò rỉ DNS](https://www.macrumors.com/2022/10/13/ios-16-vpns-leak-data-even-with-lockdown-mode/) dẫn đến bị đưa vào danh sách đen, vì lúc đó việc liên lạc giữa máy chủ Apple và thiết bị được khôi phục lại. Do đó, hãy dùng **Chế độ máy bay (AirPlane Mode)** như một công tắc thủ công để chuyển đổi giữa DNS hoặc VPN (chỉ với cùng bộ lọc đã nêu ở trên) mỗi lần.  

Nếu bạn bị kẹt ở giữa chừng, hãy tự nhắc mình bằng những câu hỏi cơ bản sau:  
- Bạn đã đọc hết chưa?  
- Bạn đã thử lại lần khác chưa?  
- Bạn đã khám phá hết mọi thứ được trình bày chưa?  

**Hãy nhớ: Càng đọc kỹ, bạn càng ít phải xử lý sự cố.**  

– Phê tít”**
