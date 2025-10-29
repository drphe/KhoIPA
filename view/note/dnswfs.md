# Thông tin hướng dẫn sử dụng DNS WSF
Nguồn: WSF team [Discord](https://discord.com/channels/1302670238583623761/1391331641737347124)

## 1. Các biến thể DNS và chức năng của chúng

![3profiles](https://picul.de/view/YhJ)

**madNS Config Profile**  
Cấu hình này ngăn chặn việc thu hồi chứng chỉ bằng cách chặn các máy chủ chứng chỉ của Apple. Nó cũng bao gồm các tính năng bổ sung tùy chọn như Trình chặn quảng cáo (Ad-Blocker) và Trình chặn cập nhật OTA (OTA Update Blocker).

**Ưu điểm:**
- Hỗ trợ VPNs, Feather, Apple Relay, Push Notifications và ChatGPT  
- Hướng đến quyền riêng tư tối đa

**Nhược điểm:**
- Không có


**CFDNS Config Profile**  
Cấu hình này ngăn chặn việc thu hồi chứng chỉ bằng cách chặn các máy chủ chứng chỉ của Apple. Nó cũng bao gồm các tính năng bổ sung tùy chọn như Trình chặn cập nhật OTA.

**Ưu điểm:**
- Hỗ trợ VPNs và Feather  
- Hướng đến quyền riêng tư tối đa

**Nhược điểm:**
- Không có

---

**WSF Config Profile**  
Cấu hình này ngăn chặn việc thu hồi chứng chỉ bằng cách chặn các máy chủ chứng chỉ của Apple. Nó cũng bao gồm các tính năng bổ sung tùy chọn như Trình chặn cập nhật OTA.

**Ưu điểm:**
- Rất chú trọng đến quyền riêng tư

**Nhược điểm:**
- Không hỗ trợ VPN, Feather, Apple Relay, Push Notifications hoặc ChatGPT

---

**Ý nghĩa của các mã trong Config Profiles:**
- **UB**: Chặn cập nhật OTA của Apple  
- **AB**: Chặn quảng cáo và trình theo dõi  
- **INSTALL ONLY**: Chỉ cho phép bạn cài đặt ứng dụng, sau đó có thể chuyển lại sang biến thể khác khi hoàn tất

---
## 2. Cài đặt Config Profile

Mở Cài đặt trên thiết bị iOS của bạn Vào Settings > General > VPN & Device Management

Chọn mục DNS hoặc Profile đã tải về Nếu bạn đã tải về cấu hình từ một nguồn như madNS, CFDNS hoặc WSF, nó sẽ hiển thị tại đây.

Nhấn “Install” để cài đặt Làm theo hướng dẫn trên màn hình để hoàn tất quá trình cài đặt.

Xác nhận và cấp quyền nếu được yêu cầu Một số cấu hình yêu cầu bạn nhập mật khẩu hoặc xác nhận bằng Face ID/Touch ID.

[Xem video HD](https://youtube.com/shorts/KgA9n51QfnQ?feature=share)

## 3. 📝 Ghi chú sau khi sử dụng DNS và cài đặt IPA

Một số hướng dẫn cần tuân theo để đảm bảo ứng dụng của bạn không bị thu hồi:

- Hiện tại, bạn **phải sử dụng biến thể DNS INSTALL ONLY** khi cài đặt ứng dụng:

![Install Only](https://picul.de/view/Yhu)

  **Cài đặt > Cài đặt chung > VPN & Quản lý thiết bị > DNS > Cấu hình bạn đã chọn**

- Sau khi sử dụng profile INSTALL ONLY, bạn **phải mở ứng dụng đã cài ít nhất một lần**, sau đó **chuyển lại sang biến thể DNS khác** khi hoàn tất.

![Change DNS](https://picul.de/view/Yhj)
---

### ⚠️ Các lưu ý quan trọng:

- Sử dụng biến thể DNS INSTALL ONLY khi cài ứng dụng  
- Chuyển sang biến thể DNS khác sau khi cài xong  (
- **Không bao giờ tắt Config Profile!**  
- **Không bật cùng lúc 2 Config Profile!**  
- **Bật chế độ Máy bay khi chuyển đổi giữa các Config Profile!**  
- **Tắt Wi-Fi và bật chế độ Máy bay khi tắt máy, khởi động lại hoặc cập nhật!**  
- **Không được sử dụng VPN nếu chưa làm theo hướng dẫn cấu hình VPN!**  
- **Thường xuyên kiểm tra cập nhật, thông báo và thông tin chứng chỉ trong Portal!**

Dưới đây là bản dịch tiếng Việt của hướng dẫn thiết lập VPN:

---

### 4. 🛡️ Hướng dẫn thiết lập VPN  
---------------------------------------

**Lưu ý:** Hầu hết các VPN miễn phí sẽ **không hoạt động** với cấu hình này. Bạn cần xác định loại DNS mà VPN của bạn hỗ trợ và **thay thế bằng các thông tin dưới đây**.

### 📍 Phần 1/1: Sử dụng VPN

**Tìm phần cài đặt DNS trong ứng dụng VPN của bạn** và thay thế bằng các địa chỉ sau:

---

#### ✅ CFDNS Config Profile + INSTALL ONLY  
**DNS over HTTPS:**  
```
https://vyvzdkmx6w.cloudflare-gateway.com/dns-query
```

---

#### ✅ CFDNS Config Profile  
**DNS over HTTPS:**  
```
https://4ma0yugkgu.cloudflare-gateway.com/dns-query
```

---

#### ✅ CFDNS Config Profile + UB  
**DNS over HTTPS:**  
```
https://32ev95ur21.cloudflare-gateway.com/dns-query
```

---

#### ✅ madNS Config Profile + INSTALL ONLY  
**DNS over HTTPS:**  
```
https://dns.nextdns.io/bcbc76
```

**DNS Servers:**  
```
45.90.28.84  
45.90.30.84
```

---

#### ✅ madNS Config Profile  
**DNS over HTTPS:**  
```
https://dns.nextdns.io/254c4e
```

**DNS Servers:**  
```
45.90.28.143  
45.90.30.143
```

---

#### ✅ madNS Config Profile + UB  
**DNS over HTTPS:**  
```
https://dns.nextdns.io/922df8
```

**DNS Servers:**  
```
45.90.28.62  
45.90.30.62
```

---

#### ✅ madNS Config Profile + AB  
**DNS over HTTPS:**  
```
https://dns.nextdns.io/f36ef2
```

**DNS Servers:**  
```
45.90.28.106  
45.90.30.106
```

---

#### ✅ madNS Config Profile + UB + AB  
**DNS over HTTPS:**  
```
https://dns.nextdns.io/41d496
```

**DNS Servers:**  
```
45.90.28.135  
45.90.30.135
```


