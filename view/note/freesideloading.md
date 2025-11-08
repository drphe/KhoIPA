# **Sideloading miễn phí**
Bất kỳ iOS nào! Không cần máy tính! Không giới hạn ứng dụng! Không bị thu hồi chứng chỉ! Không cần ký lại sau 7 ngày!

**Hướng dẫn được thực hiện bởi PuReEnVyUs**  
[https://www.reddit.com/u/PuReEnVyUs/s/UEAN9kowDo](https://www.reddit.com/u/PuReEnVyUs/s/UEAN9kowDo)  
Ngày: 18/05/2024  

## 1. Giới thiệu
Tôi đã jailbreak/sideload trên iPhone của mình trong nhiều năm và muốn đóng góp lại cho cộng đồng bằng phương pháp sideloading miễn phí mới này.  

Trước đây tôi dùng AltStore cho đến khi tìm ra phương pháp mới này, và đây là hướng dẫn nhanh (đã hoạt động hơn 10 tháng). Hướng dẫn này dành cho những người có kinh nghiệm, không phải bài viết chuyên sâu. Tôi tìm thấy tất cả các liên kết trên mạng, không biết ai tạo ra hay có liên kết với ai, chỉ đơn giản là muốn giúp cộng đồng.  

Phương pháp này sử dụng chứng chỉ đã bị thu hồi để cài đặt ứng dụng, vì vậy chúng không bị thu hồi nữa.

Cách này hoạt động trên cả iPad và iPhone, đã được kiểm nghiệm và xác nhận bởi cộng đồng r/sideloaded, r/jailbreak và r/piracy.  


---
## 2. Tuyên bố miễn trừ trách nhiệm

Phương pháp này sử dụng DNS để chặn việc Apple kiểm tra phát hiện chứng chỉ đã bị thu hồi, nếu tính năng này bị vô hiệu hóa.  
![Lỗi](https://i.ibb.co/HfmTKwTN/z7195710253717-ac7ce5f82fd1608a073fdcca2adf1fc4.jpg)

Nếu bạn đã từng sử dụng Scarlet trước đây thì có khả năng cao bạn đã bị đưa vào danh sách đen của các chứng chỉ, vì chúng dùng cùng loại chứng chỉ. Điều này có nghĩa là bạn sẽ gặp lỗi ngay cả khi đã cài đặt DNS chống thu hồi. Hiện chưa có cách khắc phục cho đến khi có chứng chỉ mới được phát hành. (Cách duy nhất để sử dụng phương pháp này nếu đã bị đưa vào danh sách đen là sao lưu, sau đó khôi phục/đặt lại thiết bị — việc này sẽ giúp bạn thoát khỏi danh sách đen.)  


### Lỗi với ESign khi nhập file thủ công
Điều này sẽ khiến tất cả ứng dụng **ngừng hoạt động** (không tải được khi mở), bao gồm cả ứng dụng không sideload. Nhưng có một cách khắc phục đơn giản:  
- Thực hiện **hard reset** điện thoại (nhấn nút tăng âm lượng, sau đó giảm âm lượng, rồi giữ nút nguồn) cho đến khi máy khởi động lại.  
### Ảnh hưởng của DNS
Việc sử dụng DNS sẽ chặn một số dịch vụ đặc thù của Apple, đáng chú ý là khả năng dùng ứng dụng dịch và cập nhật thiết bị.  
(Lưu ý: điều này chỉ xảy ra khi dùng **khomod DNS**).  

### Ứng dụng bị crash

Nếu ESign và các ứng dụng sideload bắt đầu bị crash khi mở, đây là lỗi đã biết. Cách khắc phục duy nhất là **xóa toàn bộ ứng dụng bị crash và cài lại bằng chứng chỉ khác**. (Cách tốt nhất để tránh là bật **chế độ máy bay** trước khi khởi động lại thiết bị).


---

## 3. Hướng dẫn nhanh cho người mới  
- Cài đặt hai **phím tắt (shortcuts)** sau:  
  - [DNS Shortcut](https://www.icloud.com/shortcuts/05dc7c8991fe4664870398d317cf52e5)
  - [Esign & Certs Shortcut](https://www.icloud.com/shortcuts/57f03a5d4bbf4529a03e2598828b05de)  
  - [DNS+Esign+Cert Shortcut](https://routinehub.co/shortcut/19640/)

- Đảm bảo DNS đã được bật trong phần **Cài đặt**  
- Cài đặt **Esign** bằng chứng chỉ (cert)  
- Tải cùng chứng chỉ dùng để cài đặt Esign  
- Nhập chứng chỉ vào Esign  
- Hoàn tất ✅  

### Lưu ý quan trọng (Disclaimer)

* Applejr.net cũng chia sẻ cách thức tương tự <a href="#" data-url="applejr.md" class="news-item-link">Xem chi tiết</a>.

* Và cả [Page khoindvn.io.vn](https://khoindvn.io.vn/)

* Hoặc sử dụng DNS của wsfteam.xyz <a href="#" data-url="verifyapp.md" class="news-item-link">Xem chi tiết</a>.

DNS này đã được tạo sẵn và **mọi DNS đều có thể theo dõi hoạt động internet của bạn**! Bạn có thể sử dụng nếu muốn, nhưng hãy biết rằng người tạo DNS có khả năng theo dõi nhật ký internet của bạn.  

---
## 4. Hướng dẫn tạo DNS của riêng bạn (Đã bỏ DNS dựng sẵn)

### Bước 1
Khi bạn tự tạo DNS, có nhiều dịch vụ để lựa chọn (hoặc tự host server). Tôi khuyên dùng **NextDNS**.  
- Tạo một tài khoản  
- Vào mục **“denylist”**  
- Thêm các liên kết sau vào denylist:  

```
ocsp.apple.com  
ocsp2.apple.com  
valid.apple.com  
crl.apple.com  
certs.apple.com  
appattest.apple.com  
vpp.itunes.apple.com  
```

Nếu bạn muốn dùng Feather (ứng dụng sideload mới thay thế cho ESign). Bạn cần làm thêm một bước nữa:  
- Thêm URL dưới đây vào **Allow List**:  

```
app.localhost.direct
```  

![allow list](https://i.ibb.co/TDyWTrct/nh1.jpg)
![setup](https://i.ibb.co/0Vp8zhPk/nh2.png)

Chỉ thêm các mục dưới đây nếu bạn muốn chặn cập nhật iOS :

```
mesu.apple.com
guzzoni-apple-com.v.aaplimg.com
gdmf.apple.com
axm-app.apple.com
comm-cohort.ess.apple.com
comm-main.ess.apple.com
```

Sau khi bạn đã thiết lập danh sách chặn, bạn cần cài đặt hồ sơ DNS bằng cách vào tab cài đặt và nhấn tải xuống hồ sơ cấu hình
![anh 3](https://i.ibb.co/whcHnCHw/nh3.jpg)

Sau đó bật DNS và kiểm tra rằng nó đã được bật trong phần VPN & Quản lý thiết bị nằm trong mục Cài đặt chung.
![anh 4](https://i.ibb.co/67rYLXZq/nh4.jpg)

Nếu bạn có một DNS khác, hãy chắc chắn tắt nó cùng với việc tắt VPN  

### Bước 2

Tải xuống **ESign** từ liên kết bên dưới, nó có khá nhiều chứng chỉ để lựa chọn. Chỉ cần chọn một chứng chỉ hoạt động (một số có thể không cài đặt được), hãy tiếp tục thử cho đến khi cài đặt thành công.  
Có người đã tạo một **phím tắt** giúp việc cài đặt cả ESign và Feather nhanh hơn, đồng thời lấy các tệp chứng chỉ!  
[Shortcut Esign](https://www.icloud.com/shortcuts/57f03a5d4bbf4529a03e2598828b05de)  

![anh 5](https://i.ibb.co/LBLnDsK/nh5.jpg)

- **Liên kết chính:**  
  [esigncert.github.io/khoindvn](https://esigncert.github.io/khoindvn/) – Trang này cung cấp hồ sơ DNS, chứng chỉ tải về, và hướng dẫn cài đặt cho ESign/KSign. Nó cũng có các bản cập nhật mod và bypass revoke.  

- **Liên kết thay thế (Alt links):**  
  - [ealmartini.bio.link](https://ealmartini.bio.link/) – Trang tổng hợp chứng chỉ ESign và KSign, có hướng dẫn cài đặt Scarlet và DNS profile.  
  - [linktr.ee/DmSideloadz](https://linktr.ee/DmSideloadz) – Cung cấp DNS “no-revoke” và chứng chỉ ESign đã ký sẵn.  
  - [beacons.ai/xoikila/home](https://beacons.ai/xoikila/home) – Nơi chia sẻ DNS chống blacklist, cách sideload IPA/Dylibs, và thông báo từ chủ trang.  
  - cloudyserver.bio.link – Chưa kiểm tra nội dung, nhưng thường là mirror cho chứng chỉ.  
  - Jorkthepork.com – Một nguồn khác để tải chứng chỉ hoặc công cụ ký.  

- **Cảnh báo quan trọng:**  
  - **Không dùng chứng chỉ “live/active”**. Đây là chứng chỉ đang được ký và hoạt động, nhưng nếu Apple thu hồi, tất cả ứng dụng đã cài bằng chứng chỉ đó sẽ bị **revoked** ngay lập tức.  
  - Một số dịch vụ ký ứng dụng khác thường dùng loại chứng chỉ này, nên rủi ro bị thu hồi rất cao.  
![anh 6](https://i.ibb.co/n8P41spx/nh6.jpg)

- **Nếu bị blacklist:**  
  - Bạn sẽ không thể cài đặt chứng chỉ từ các nguồn trên.  
  - Cách duy nhất để gỡ blacklist là **sao lưu dữ liệu > xóa toàn bộ nội dung và cài đặt > khôi phục lại thiết bị**.  

### Bước 3
- Tải xuống tệp nén chứng chỉ (FILE ESign Cert) từ cùng một trang web. Tệp này chứa các chứng chỉ đã bị thu hồi, sẽ được dùng để cài đặt ứng dụng.

### Bước 4
- Vào Cài đặt > Cài đặt chung > VPN & Quản lý thiết bị, sau đó chọn Trust ESign để cho phép mở ứng dụng.

![anh 7](https://i.ibb.co/NgMZkj67/nh7.jpg)
### Bước 5
- Mở ứng dụng ESign. (Cảnh báo) Tôi nhận thấy trên một số điện thoại có lỗi khiến tất cả ứng dụng ngừng hoạt động khi đang cố nhập tệp hoặc ứng dụng!
- Trong trường hợp này, hãy khởi động lại  điện thoại (nhấn nhanh nút Tăng âm lượng, sau đó Giảm âm lượng, rồi giữ nút nguồn).

### Bước 6
- Trong ESign, vào tab ngoài cùng bên trái (Files). Ở góc trên bên phải, nhấn vào biểu tượng và chọn Import. 
- Sau đó chọn tệp chứng chỉ dạng .zip để nhập. Khi đã nhập xong, nhấn vào tệp để giải nén. Sau khi giải nén, bạn có thể xóa tệp zip đi.

![anh 8](https://i.ibb.co/HTKyVrxg/nh8.jpg)
![anh 9](https://i.ibb.co/XkshMryY/nh9.jpg)

### Bước 7
- Mở thư mục chứng chỉ (cert folder) và chọn một chứng chỉ để cài đặt. Tôi thường dùng HDFC, nhưng bất kỳ chứng chỉ nào cũng có thể hoạt động. Nếu một chứng chỉ không hoạt động, hãy thử chứng chỉ khác. 
- Để nhập chứng chỉ, chỉ cần nhấn vào chứng chỉ đó và chọn Import.

![anh 10](https://i.ibb.co/fVXvVpGw/nh10.jpg)
### Bước 8
Vậy là bạn đã thiết lập xong, giờ là lúc cài ứng dụng! Có 2 cách để cài ứng dụng: 
- Cách thứ nhất, bạn có thể nhập các tệp tải xuống dạng .ipa vào cùng vị trí tệp như thư mục zip. Khi nhập, hệ thống sẽ hỏi bạn có muốn nhập vào App Library không, hãy chọn Yes. Sau đó ứng dụng sẽ được chuyển sang tab Unsigned.

![anh 11](https://i.ibb.co/Q3PfWKGd/nh11.jpg)

-  Cách thứ hai, bạn có thể dùng repos – đây là phương pháp tôi ưa thích để cài ứng dụng vì bạn có thể tải xuống và cài đặt trực tiếp bên trong ESign. Để thêm một repo, hãy vào tab App Store > App Source (góc trên bên trái) > dấu + (góc trên bên phải), sau đó dán repo của bạn vào.

![anh 12](https://i.ibb.co/jkRkS6xC/nh12.jpg)

![anh 13](https://i.ibb.co/CKF7d2gr/nh13.jpg)

● Khi bạn tải xuống một ứng dụng, nó sẽ xuất hiện trong tab Downloads. Chỉ cần nhấn vào ứng dụng đó và chọn Import App Library. Thao tác này sẽ chuyển ứng dụng sang mục Unsigned trong tab Apps.

![anh 14](https://i.ibb.co/spzKZQTv/nh14.png)

### Bước 9
Vào tab Apps, bạn sẽ thấy ứng dụng chưa được ký (unsigned app) mà bạn đã nhập. Nhấn vào ứng dụng đó và chọn SIGNATURE (⚠️ KHÔNG chỉ nhấn Install, vì sẽ không hoạt động!). 
- Sau đó nhấn Signature lần nữa để nó tải.
- Tiếp theo, nhấn Install và một cửa sổ bật lên sẽ xuất hiện để cài đặt ứng dụng. Vậy là xong — không bị thu hồi chứng chỉ và bạn có thể cài bao nhiêu ứng dụng tùy thích!

![anh 15](https://i.ibb.co/dF8yYg6/nh15.png)
![anh 16](https://i.ibb.co/ZR8qGBwZ/nh16.jpg)
![anh 17](https://i.ibb.co/qF9jrrW6/nh17.jpg)
![anh 19](https://i.ibb.co/1GpzvzV5/nh18.jpg)


### Lưu ý nếu cài đặt bằng feather
- Bạn cần lấy file **P12** và **mobile provision** để import vào Feather, vì Feather không tương thích với định dạng `.esigncert`.  
- Các file này có thể tìm thấy trên kênh **AppleP12 Telegram**.  
- (Chỉ cần làm bước này nếu bạn muốn dùng Feather, và sẽ mất nhiều thời gian hơn để thiết lập).  


