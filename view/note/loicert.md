# Hướng dẫn xử lý lỗi chứng chỉ nhà phát triển Apple (Developer Certificate Errors)

## 📌 Giới thiệu
Khi cài đặt hoặc mở ứng dụng iOS được ký bằng chứng chỉ nhà phát triển, bạn có thể gặp thông báo:

> "Để xác minh nhà phát triển <...> cần kết nối mạng. Ứng dụng sẽ không khả dụng cho đến khi hoàn tất kiểm tra."

Đây là cơ chế **PPQ (Piracy Prevention & Quality check)** của Apple nhằm ngăn chặn việc cài đặt ứng dụng lậu hoặc ứng dụng bị chỉnh sửa.

---

## 🔎 Nguyên nhân
- Apple phát hiện ứng dụng được ký bằng chứng chỉ cá nhân/doanh nghiệp nhưng sử dụng **BundleID trùng với ứng dụng gốc** trên App Store.  
- Ứng dụng đã bị chỉnh sửa (mod, crack) nhưng vẫn giữ nguyên BundleID.  
- Từ năm 2021, Apple áp dụng PPQ cho cả chứng chỉ cá nhân, không chỉ chứng chỉ doanh nghiệp miễn phí như trước.

---

## ⚠️ Hậu quả
- Ứng dụng sẽ **không thể mở** cho đến khi Apple hoàn tất kiểm tra.  
- Sau khi kiểm tra, Apple thường sẽ **hủy chứng chỉ**.  
- Tất cả ứng dụng được ký bằng chứng chỉ đó sẽ bị vô hiệu hóa.

---

## 🛠️ Cách khắc phục
### 1. Thay đổi BundleID
- Khi ký ứng dụng, hãy đổi sang một **BundleID riêng** thay vì giữ nguyên của ứng dụng gốc.  
- **Ưu điểm**: Giảm nguy cơ bị Apple áp dụng PPQ.  
- **Nhược điểm**:  
  - Mất **push notification**.  
  - Một số tính năng có thể hoạt động không ổn định.

### 2. Sử dụng chứng chỉ không bị PPQ
- Mua chứng chỉ từ tài khoản nhà phát triển được tạo **trước năm 2021** (không bị áp dụng PPQ).  
- **Ưu điểm**: Ứng dụng hoạt động ổn định, không bị chặn.  
- **Nhược điểm**: Chi phí cao, tỷ lệ đăng ký thiết bị thành công chỉ khoảng **50%**.

---

## ✅ Khuyến nghị
- Nếu chỉ cần cài đặt cá nhân: **đổi BundleID** để tránh bị chặn.  
- Nếu cần triển khai cho nhiều người dùng: **đầu tư chứng chỉ không bị PPQ** để đảm bảo ổn định lâu dài.

---

## 📚 Nguồn tham khảo
*[Ошибки сертификата
Разработчика Apple](https://iappsbest-repository-catalog.pages.dev/certificates-error/)
