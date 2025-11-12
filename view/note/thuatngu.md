# README: Thuật Ngữ Liên Quan Đến Mod IPA

Chào mừng bạn đến với hướng dẫn chi tiết giải thích các thuật ngữ phổ biến mà bạn sẽ gặp trong cộng đồng **mod IPA** (cài đặt ứng dụng iOS đã chỉnh sửa).

---

## 1. Các Loại File Chính

| Thuật Ngữ | Giải Thích Chi Tiết |
| :--- | :--- |
| **IPA (iOS App Store Package)** | Định dạng file cài đặt ứng dụng dành cho các thiết bị iOS. **IPA mod** là file IPA đã bị thay đổi mã nguồn để thêm các tính năng không có trong bản gốc. |
| **Dylib (.dylib)** | Viết tắt của **Dynamic Library** (Thư viện Động). File mã nguồn được "tiêm" (inject) vào ứng dụng để thay đổi hoặc mở rộng chức năng của nó. |
| **ADP (App Data Protection)** | Thuật ngữ ít phổ biến trong mod IPA, thường có thể bị nhầm lẫn với Apple Developer Program. |

---

## 2. Thuật Ngữ Thay Đổi Ứng Dụng

| Thuật Ngữ | Giải Thích Chi Tiết |
| :--- | :--- |
| **Mod (Modification)** | Hành động chỉnh sửa hoặc thay đổi ứng dụng gốc để thêm, bóc tách, hoặc thay đổi các chức năng. |
| **Tweak** | Một loại **mod** cụ thể, thường là các đoạn mã (dạng `.dylib`) được thiết kế để thay đổi các khía cạnh nhỏ trong giao diện người dùng hoặc chức năng. |
| **Hack** | Thuật ngữ rộng hơn, dùng để chỉ bất kỳ hành động nào nhằm đạt được lợi thế không công bằng hoặc vượt qua rào cản bảo mật. |
| **Inject (Tiêm)** | Quá trình chèn các file mã nguồn (thường là file `.dylib`) vào file IPA gốc để tạo ra một **IPA mod/tweak**. |
| **Decrypt (Giải mã)** | Quá trình loại bỏ lớp mã hóa bảo vệ (DRM) mà Apple đặt lên các file IPA. Đây là bước đầu tiên để có thể **mod** ứng dụng. |
---

### 3. Thuật Ngữ Gói Cước Ứng Dụng

| Thuật Ngữ | Giải Thích Chi Tiết |
| :--- | :--- |
| **Paid (Trả phí)** | Ứng dụng yêu cầu người dùng trả một khoản phí một lần để tải về hoặc sử dụng. |
| **Subscription (Đăng ký)** | Ứng dụng yêu cầu người dùng trả phí định kỳ (tháng/năm) để tiếp tục sử dụng các tính năng. |
| **Premium (Cao cấp)** | Các tính năng đặc biệt, nâng cao trong ứng dụng mà người dùng phải trả phí để mở khóa. **Mod IPA** thường nhằm mục đích mở khóa các tính năng này miễn phí. |

---

### 4. Thuật Ngữ Cài Đặt & Ký IPA

| Thuật Ngữ | Giải Thích Chi Tiết |
| :--- | :--- |
| **Certification (Chứng chỉ)** | Một tập tin kỹ thuật số do Apple cấp cho các nhà phát triển, xác nhận ứng dụng đến từ nguồn đáng tin cậy. |
| **Revoked (Bị Thu Hồi)** | Khi Apple hủy bỏ chứng chỉ do bị lạm dụng. Tất cả các ứng dụng đã được ký bằng chứng chỉ đó sẽ bị **vô hiệu hóa**. |

---

### 5. Công Cụ Ký & Cài Đặt IPA

| Thuật Ngữ | Loại | Giải Thích Chi Tiết |
| :--- | :--- | :--- |
| **Esign / Feather / KSign / Scarlet / GBox** | Công cụ Ký | Các ứng dụng cho phép người dùng **ký lại (re-sign)** và cài đặt các file IPA mod. Sử dụng chứng chỉ công khai hoặc cá nhân, có nguy cơ bị **revoked**. |
| **AltStore** | Công cụ Cài đặt | Ứng dụng máy tính (macOS/Windows) sử dụng **Chứng chỉ Nhà phát triển Cá nhân và Miễn phí** của chính người dùng để ký và cài đặt IPA, cần làm mới 7 ngày một lần. |
| **TrollStore** | Công cụ Cài đặt Vĩnh viễn | Công cụ khai thác lỗi bảo mật cho phép người dùng cài đặt các file IPA một cách **vĩnh viễn** mà **không cần** lo lắng về việc hết hạn hay bị **revoked**. Là phương pháp cài đặt IPA mod ổn định nhất cho các thiết bị tương thích. |
