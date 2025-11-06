# **Sideloading miễn phí**
Bất kỳ iOS nào! Không cần máy tính! Không giới hạn ứng dụng! Không bị thu hồi chứng chỉ! Không cần ký lại sau 7 ngày! Thêm repo để cài đặt nhanh!  

**Hướng dẫn được thực hiện bởi PuReEnVyUs**  
[https://www.reddit.com/u/PuReEnVyUs/s/UEAN9kowDo](https://www.reddit.com/u/PuReEnVyUs/s/UEAN9kowDo)  
Ngày: 18/05/2024  


## Giới thiệu
Tôi đã jailbreak/sideload trên iPhone của mình trong nhiều năm và muốn đóng góp lại cho cộng đồng bằng phương pháp sideloading miễn phí mới này.  

Trước đây tôi dùng AltStore cho đến khi tìm ra phương pháp mới này, và đây là hướng dẫn nhanh (đã hoạt động hơn 10 tháng). Hướng dẫn này dành cho những người có kinh nghiệm, không phải bài viết chuyên sâu. Tôi tìm thấy tất cả các liên kết trên mạng, không biết ai tạo ra hay có liên kết với ai, chỉ đơn giản là muốn giúp cộng đồng.  

Phương pháp này sử dụng chứng chỉ đã bị thu hồi để cài đặt ứng dụng, vì vậy chúng không bị thu hồi nữa.

Cách này hoạt động trên cả iPad và iPhone, đã được kiểm nghiệm và xác nhận bởi cộng đồng r/sideloaded, r/jailbreak và r/piracy.  

---
## Tuyên bố miễn trừ trách nhiệm

Phương pháp này sử dụng DNS để chặn việc Apple kiểm tra phát hiện chứng chỉ đã bị thu hồi, nếu tính năng này bị vô hiệu hóa.  
![Lỗi](https://i.ibb.co/HfmTKwTN/z7195710253717-ac7ce5f82fd1608a073fdcca2adf1fc4.jpg)

Nếu bạn đã từng sử dụng Scarlet trước đây thì có khả năng cao bạn đã bị đưa vào danh sách đen của các chứng chỉ, vì chúng dùng cùng loại chứng chỉ. Điều này có nghĩa là bạn sẽ gặp lỗi ngay cả khi đã cài đặt DNS chống thu hồi. Hiện chưa có cách khắc phục cho đến khi có chứng chỉ mới được phát hành. (Cách duy nhất để sử dụng phương pháp này nếu đã bị đưa vào danh sách đen là sao lưu, sau đó khôi phục/đặt lại thiết bị — việc này sẽ giúp bạn thoát khỏi danh sách đen.)  


### Lỗi với ESign khi nhập file thủ công
Điều này sẽ khiến tất cả ứng dụng **ngừng hoạt động** (không tải được khi mở), bao gồm cả ứng dụng không sideload. Nhưng có một cách khắc phục đơn giản:  
- Thực hiện **hard reset** điện thoại (nhấn nút tăng âm lượng, sau đó giảm âm lượng, rồi giữ nút nguồn) cho đến khi máy khởi động lại.  
### **Ảnh hưởng của DNS**  
Việc sử dụng DNS sẽ chặn một số dịch vụ đặc thù của Apple, đáng chú ý là khả năng dùng ứng dụng dịch và cập nhật thiết bị.  
(Lưu ý: điều này chỉ xảy ra khi dùng **khomod DNS**).  

### Ứng dụng bị crash
Nếu ESign và các ứng dụng sideload bắt đầu bị crash khi mở, đây là lỗi đã biết. Cách khắc phục duy nhất là **xóa toàn bộ ứng dụng bị crash và cài lại bằng chứng chỉ khác**. (Cách tốt nhất để tránh là bật **chế độ máy bay** trước khi khởi động lại thiết bị).  
---

## Hướng dẫn nhanh cho người mới  
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
DNS này đã được tạo sẵn và **mọi DNS đều có thể theo dõi hoạt động internet của bạn**! Bạn có thể sử dụng nếu muốn, nhưng hãy biết rằng người tạo DNS có khả năng theo dõi nhật ký internet của bạn.  

## Hướng dẫn tạo DNS của riêng bạn**  *(Đã bỏ DNS dựng sẵn)*  

### Dùng NextDNS
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

### Nếu bạn muốn dùng **Feather** (ứng dụng sideload mới thay thế cho ESign)  
Bạn cần làm thêm một bước nữa:  
- Thêm URL dưới đây vào **Allow List**:  

```
app.localhost.direct
```  

- Bạn cần lấy file **P12** và **mobile provision** để import vào Feather, vì Feather không tương thích với định dạng `.esigncert`.  
- Các file này có thể tìm thấy trên kênh **AppleP12 Telegram**.  
- (Chỉ cần làm bước này nếu bạn muốn dùng Feather, và sẽ mất nhiều thời gian hơn để thiết lập).  

