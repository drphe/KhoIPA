# Làm thế nào để sideload trên iOS mà không cần jailbreak không bị hết hạn và hoàn toàn miễn phí theo cách dễ nhất?

Nguồn: [avieshek](https://avieshek.wordpress.com/2024/06/11/how-to-sideload-on-ios/)

"Hãy thoải mái, đây là một hướng dẫn. Nếu bạn là một người đã quen thuộc với torrent thì việc này sẽ khá nhanh để học ngay cả khi không có phần giải thích. Nhưng đối với bất kỳ ai khác thì đây vẫn sẽ là hướng dẫn đơn giản nhất dành cho bạn, vì mọi thứ đã được nén gọn lại ở đây thay vì phải dẫn bạn đến nhiều nguồn khác nhau". 

## Hướng dẫn Sideloading

1. DNS – [New](https://github.com/Nyasami/getUDID-JS/releases/download/1.0.0/signed_khoindvn_fullchain.mobileconfig)

2. Esign – [Website](https://khoindvn.io.vn/)

3. Certs – [Zip File](https://khoindvn.io.vn/document/DNS/ESignCert.zip)

### Trước khi bắt đầu:

Điều quan trọng là bạn phải đọc kỹ toàn bộ hướng dẫn trước để hiểu rõ khái niệm và các khía cạnh kỹ thuật, từ đó có thể tự xử lý sự cố hoặc tránh gặp vấn đề. Đừng chỉ làm theo một cách mù quáng như Linus Sebastian rồi sau đó lại gặp rắc rối.

## Bắt đầu DNS 

Đây là một hồ sơ DNS được tạo sẵn từ Khơindvn, với sự giúp đỡ của một YouTuber có tên là Pork the Jork. Nó được dùng để ngăn máy chủ Apple xác minh bundle ID của một ứng dụng tải xuống không thông qua App Store với UDID của thiết bị khi ký bằng chứng chỉ trước khi cài đặt, vì từ iOS 13 trở đi ứng dụng không còn được ký trực tiếp trên thiết bị như PC hoặc Mac.

Cơ chế này được gọi là Bypass Revoke, vì chúng ta tái sử dụng các chứng chỉ đã bị thu hồi cho đến khi hết hạn, chứ không phải ngăn chặn chứng chỉ doanh nghiệp bị thu hồi như các giải pháp DNS chống thu hồi cũ từng tuyên bố. Tuy nhiên, nếu bạn bị blacklist (không thể xác minh tính toàn vẹn hoặc lỗi cài đặt) do rò rỉ DNS thì hãy xem phần Final Notes để biết cách được whitelist lại trước.

### Bước 1:
- Hãy đảm bảo Safari là trình duyệt mặc định của bạn hoặc được sử dụng trước khi mở liên kết cài đặt Old/ New DNS → Permalink 
- Vào Cài đặt → Cài đặt chung → Quản lý VPN, DNS Quản lý
- Cài đặt hồ sơ và để nó hoạt động.

Đối với những người chuyển từ Android hoặc Windows sang, việc phải tự tay cài đặt ‘bất kỳ’ hồ sơ nào là hành vi mặc định của iOS hoặc iPadOS, khác với macOS (ít nhất là các phiên bản cũ trước khi bị thay đổi) để DNS tùy chỉnh có thể hoạt động trên cả mạng di động và WiFi, ngay cả khi bạn chỉ cài một hồ sơ DNS như AdGuard hay AhaDNS Blitz; và nếu là loại khác thì Apple sẽ chỉ hiển thị ở cuối cùng nhưng vẫn yêu cầu bạn cấp quyền.

Việc chạy DNS hoàn toàn ổn vì bạn cần chứng chỉ TLS để giải mã kết nối HTTPS, do đó nó chỉ chặn một số bộ lọc phục vụ cho mục đích sideloading mà không cần jailbreak.

### iOS 18+ 
Do một lỗi, hồ sơ (profile) sẽ được tải xuống dưới dạng tệp trước tiên trong thư mục tải xuống của ứng dụng Files. Hãy kiểm tra để chắc chắn rằng tên tệp kết thúc bằng .mobileconfig, sau đó đổi tên thành “filename.mobileconfig”, rồi mở tệp đã đổi tên đó thủ công và quay lại ứng dụng Cài đặt để tiếp tục.

Từ iOS 18 trở đi cũng có một thay đổi mới: thiết bị sẽ khởi động lại (restart) mỗi khi bất kỳ loại hồ sơ nào (kể cả một DNS đơn giản) được cài đặt. Vì vậy, hãy bật Chế độ máy bay (AirPlane mode) trước khi khởi động lại để tránh rò rỉ DNS và dẫn đến bị blacklist, phần này sẽ được giải thích thêm sau.

---

## Cài đặt Esign
 Esign là một ứng dụng dùng để ký, có thể tải xuống, giải nén, đóng gói, nhập, ký và cài đặt các tệp iPA để trở thành ứng dụng, ngoài ra còn có thể truy cập trực tiếp các kho (repo) công cộng.  

### Bước 2:
- Truy cập liên kết để cài đặt Esign (chỉ phiên bản miễn phí) từ cuối trang.  
- Nếu một chứng chỉ không hoạt động với bạn, hãy thử một chứng chỉ khác.  
- Vào **Cài đặt → Cài đặt chung → VPN, DNS, Quản lý thiết bị → Ứng dụng doanh nghiệp (Enterprise App)**.  
- Nhấn vào tên chứng chỉ, sẽ có nút **Tin cậy (Trust)**.  
- Sau đó mở ứng dụng Esign, dưới tab **Download** ở thanh điều hướng dưới cùng, tìm biểu tượng dấu ba chấm **•••** ở phía trên, rồi vào **Cài đặt (Settings)** để bật cả hai tùy chọn **Auto Import** và **Auto Delete**.
  
![image](https://i.imgur.com/GrFNPW9.png)

---

## Lấy Certs
Cert chỉ đơn giản là viết tắt của *certificate* (chứng chỉ), ở đây chúng ta sẽ dùng các chứng chỉ đã hết hạn thay vì chứng chỉ mới nhất… ví dụ như HDFC Life Insurance (Ấn Độ) hoặc cũ hơn như Sunshine Insurance Group (Trung Quốc), nhưng bạn sẽ tải về tất cả chúng.  

### Bước 3:
- Mở liên kết Cert (ở trên) trực tiếp hoặc sao chép URL ở trên để truy cập:  
  **Esign → Download → ••• → URL › Paste**  
- Một tệp zip sẽ nằm trong phần **File** của bạn, ứng dụng có sẵn trình giải nén nên bạn chỉ cần nhấn vào, sau đó sẽ có một thư mục được giải nén cùng tên.  
- Trong đó sẽ có danh sách chứng chỉ, hãy dùng chứng chỉ đã cài đặt Esign cho bạn, mặc dù cũng không sao nếu chọn chứng chỉ khác (miễn là không phải lần đầu bạn thực hiện).  
- Sau khi nhập thành công, bạn có thể xóa cả thư mục và tệp zip.  
- Tiếp theo, vào phần **Settings** chính trong ứng dụng (thanh điều hướng dưới cùng) → **Sign Default Config**, bật các tùy chọn:  
  - **Install after signed** (Cài đặt sau khi ký)  
  - **Remove mobileprovision after signing** (Xóa mobileprovision sau khi ký)  
  - Đổi **Install Address** thành **Local**  
  - Nên đổi thêm **Compress Level** thành **Balance** trước khi thoát.  

![image](https://i.ibb.co/ZpKk1Jmr/Picsew-20250530160654.jpg)

---
## Tải Repo
Repo là viết tắt của *repository* (kho lưu trữ), nó hoạt động giống như một thư viện ứng dụng. Các repo có thể trông giống như liên kết nhưng thực chất các URL này không mở ra trang web, mà được dùng để sao chép và dán trực tiếp vào ứng dụng.  
### Bước 4:
- Nhấn vào liên kết hoặc sao chép thủ công từ trên để dán vào:  
  **Esign → App Source (Góc trên bên trái) → +**  
- Sau đó bạn sẽ thấy mình có thể tìm kiếm và tải xuống ứng dụng trực tiếp ngay trong Esign.  

![image](https://i.imgur.com/yntP97H.jpeg)

---

## Phần Cài đặt
Nếu bạn đã theo dõi kỹ từ đầu đến giờ thì sẽ nhận ra rằng bạn vẫn chưa thực sự cài đặt ứng dụng nào. Điều này là bởi vì, khác với App Store, chức năng tìm kiếm trong Esign chỉ tải xuống ứng dụng, sau đó bạn cần phải ký nó trước khi cài đặt.  

### Bước 5:
- Khi bắt đầu quá trình cuối cùng này, bạn sẽ thấy nút **Signature** nằm phía trên nút **Install**.  
- Đây mới là phần quan trọng và sẽ được sử dụng nhiều hơn, trừ khi bạn muốn nhân bản (sẽ nói thêm sau) một ứng dụng đã được ký sẵn như WhatsApp.  

![image](https://i.imgur.com/dB9JmWt.png)

---

## Cách nhân bản ứng dụng với Esign
Có những trường hợp bạn muốn có ứng dụng nhân bản vì muốn giữ nguyên bản gốc, linh hoạt sử dụng nhiều tài khoản nhắn tin hoặc duy trì hai mục đích sử dụng riêng biệt. Thông thường, tôi dùng phím tắt có tên [Signed Installer](https://www.reddit.com/r/shortcuts/comments/17d6ef8/), nhưng Esign cũng cho phép nhân bản ứng dụng.  

### Các bước:
- Chỉnh sửa tên ứng dụng thành tên tùy chỉnh của bạn (ví dụ: *YouTube Red*) hoặc thêm ký hiệu **+** sau tên gốc, miễn là bạn thay đổi tên ban đầu.  
- Thêm **“.1”** vào *bundle identifier*. Ví dụ, nếu *bundle identifier* gốc là **“com.google.ios.youtube”** thì hãy đổi thành **“com.google.ios.youtube.1”**.  

![image](https://i.imgur.com/VkEWcZI.jpeg)

---

## Ghi chú cuối cùng
Có một vài điều bạn cần ghi nhớ, chỉ là những nguyên tắc cơ bản:  

- **Đừng cố cài đặt bất kỳ phiên bản Esign nào mà không có DNS (Bypass Revoke)**, nếu không chúng sẽ bị đưa vào danh sách đen ngay lập tức vì các chứng chỉ vốn đã bị thu hồi, và việc dùng DNS sau đó cũng sẽ không giúp bạn được whitelist lại.  
- Có thể sẽ có trường hợp bạn vẫn thất bại khi khởi chạy; khi đó hãy gỡ bỏ ứng dụng, chứng chỉ hoặc thậm chí cả DNS liên quan trong quá trình này rồi bắt đầu lại từ đầu với một chứng chỉ khác.  
- Nếu bạn vẫn không thể cài đặt Esign hoặc liên tục gặp thông báo bật lên “không thể xác minh tính toàn vẹn” cho tất cả chứng chỉ, thì rất có thể thiết bị của bạn đã bị đưa vào danh sách đen. Trong trường hợp này, bạn cần sao lưu dữ liệu trước rồi **khôi phục cài đặt gốc (factory reset)** hoặc **khôi phục cục bộ (local restore)** thiết bị. Việc khôi phục từ bản sao lưu cục bộ chỉ yêu cầu bạn đăng nhập lại vào các ứng dụng bảo mật như trình quản lý mật khẩu, ứng dụng nhắn tin mã hóa hoặc ứng dụng ngân hàng, còn lại dữ liệu vẫn được giữ nguyên.  
- Những người dùng iOS phiên bản cũ cũng có thể thử công cụ [BlacklistBeGone](https://github.com/jailbreakdotparty/BlacklistBeGone), giúp bỏ qua bước khôi phục.  

- Trước khi cập nhật phiên bản iOS của bạn, hãy hoàn tác các bước ở trên theo thứ tự ngược lại (gỡ cài đặt ứng dụng… xóa chứng chỉ) để tránh việc chứng chỉ đang hoạt động bị đưa vào danh sách đen. Đồng thời, nên tắt tính năng cập nhật phần mềm hệ thống tự động.  

- Hệ điều hành của Apple có một điểm kỳ lạ [(thực chất là một lỗ hổng bảo mật)](https://www.macrumors.com/2022/08/18/vpns-for-ios-are-broken-says-researcher/) đó là không hoàn toàn ngắt kết nối internet với các tuyến hiện có khi thiết lập quy tắc mới, dù là qua DoH hay VPN. Vì vậy, nó tạm thời chuyển sang kết nối không mã hóa ngay cả khi bạn có hai hồ sơ DNS với bộ lọc đối xứng – điều này gây ra [rò rỉ DNS](https://www.macrumors.com/2022/10/13/ios-16-vpns-leak-data-even-with-lockdown-mode/) dẫn đến bị đưa vào danh sách đen, vì lúc đó việc liên lạc giữa máy chủ Apple và thiết bị được khôi phục lại. Do đó, hãy dùng **Chế độ máy bay (AirPlane Mode)** như một công tắc thủ công để chuyển đổi giữa DNS hoặc VPN (chỉ với cùng bộ lọc đã nêu ở trên) mỗi lần.  

- Trong trường hợp trình chặn quảng cáo gây ra sự cố, hãy đơn giản tắt bộ lọc **‘Adware ✓’** khi tất cả kết nối internet đã bị ngắt bằng Chế độ máy bay. Nhưng tránh bật tùy chọn **‘Automatic’**, vì nó sẽ ngẫu nhiên chuyển về DNS mặc định, dẫn đến bị đưa vào danh sách đen.  

Nếu bạn bị kẹt ở giữa chừng, hãy tự nhắc mình bằng những câu hỏi cơ bản sau:  
- Bạn đã đọc hết chưa?  
- Bạn đã thử lại lần khác chưa?  
- Bạn đã khám phá hết mọi thứ được trình bày chưa?  

**Hãy nhớ: Càng đọc kỹ, bạn càng ít phải xử lý sự cố.**  

– Avieshek”**


