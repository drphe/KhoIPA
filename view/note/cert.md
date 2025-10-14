## 🛠️ Mẹo Ký và Cài App Bằng Chứng Chỉ

### 1. Ưu Tiên Feather
- Nên cài app bằng **Feather** trước. (Phần mềm mã nguồn mở, dễ dàng theo dõi hạn dùng Cert)
- Nếu không thành công, chuyển sang **ESign**.
- Feather có cơ chế **chèn mã ngẫu nhiên vào `bundleIdentifier`**, giúp tránh bị Apple thu hồi chứng chỉ (revoked).

### 2. Kiểm Tra Phiên Bản IPA
- Một số app yêu cầu phiên bản mới hoặc tương thích với hệ điều hành.
- Nếu không cài được, hãy thử tải **file IPA khác** và lặp lại bước 1.

### 3. Xử Lý Lỗi Chứng Chỉ
- Nếu vẫn không cài được, có thể chứng chỉ đang gặp lỗi.
- Thực hiện:
  - **Xóa cache trình duyệt** (trên website cấp cert).
  - **Tải lại chứng chỉ**.
  - Nhập lại vào Feather hoặc ESign.
  - Lặp lại bước 1.

---

## ✅ Ghi Nhớ
- Luôn kiểm tra tính tương thích của IPA với thiết bị và hệ điều hành.
- Feather thường ổn định hơn và ít bị revoke hơn ESign.
- Đừng quên theo dõi thời hạn chứng chỉ để tránh gián đoạn khi cài app.
