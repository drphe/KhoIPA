# Hướng dẫn sử dụng Dylib/Deb

Dành cho người dùng nâng cao, đôi khi bạn sẽ gặp một ứng dụng hoặc trò chơi không có phiên bản đã được chỉnh sửa. Đây là hướng dẫn nhanh để nhập hoặc gỡ bỏ các tệp **dylib/deb** từ một file **ipa** nhằm cho phép mua hàng trong ứng dụng miễn phí (IAP), chặn quảng cáo hoặc thêm **iGameGod** (một công cụ chỉnh sửa hex để thay đổi các giá trị như vàng/kim cương).

## Nguồn tải ứng dụng đã giải mã
- [https://decrypt.day/](https://decrypt.day/)  
  (Có thể không phải lúc nào cũng cập nhật mới nhất)  
- [https://armconverter.com/decryptedappstore/us](https://armconverter.com/decryptedappstore/us)  
  (Cập nhật thường xuyên hơn nhưng giới hạn 2 ứng dụng mỗi ngày)  

Nếu bạn không tìm thấy ở đây, có một vài trang web khác để tìm file ipa đã giải mã.

## Tệp Dylib/Deb
Việc tìm các tệp này có thể khó khăn, vì vậy mình đã cung cấp một số tệp tìm thấy trong subreddit. Ngoài ra, bạn có thể sideload một file **PostBox IPA** vì nó chứa khá nhiều.  
- Khuyến nghị vào tab **repos** và thêm một số nguồn như **TheBigBoss** & **Julioverne**.  
- Nếu không muốn tải ứng dụng, bạn có thể dùng trang web này để tìm:  
  [https://www.ios-repo-updates.com](https://www.ios-repo-updates.com)

Dưới đây là một số file có thể ở định dạng `.dylib`, `.deb`, hoặc `.plist`. Có thể sử dụng Esign, Feather... để tiêm dylib khi ký IPA hoặc [Công cụ inject (tiêm) dylib/deb vào iPA online](https://ipatool.codevn.net/inject-dylib/).

* Adblock
- [com.julioverne.adblock_0.2~beta1_iphoneos-arm.deb](https://julioverne.github.io/debfiles/com.julioverne.adblock_0.2~beta1_iphoneos-arm.deb)  
- [splashadblock_1.5.deb](http://apt.thebigboss.org/repofiles/cydia/debs2.0/splashadblock_1.5.deb)  

Nếu Adblock không hoạt động, hãy thử tìm file deb phù hợp với ứng dụng của bạn.

* IAP (Mua hàng trong ứng dụng miễn phí)
- [SatellaJailed.dylib](https://github.com/Paisseon/SatellaJailed/blob/emt/SatellaJailed.dylib)  

Chỉ hoạt động với IAP **không chạy trên máy chủ**, chủ yếu là các trò chơi có hệ thống chống gian lận thấp. (Không hoạt động với tất cả ứng dụng và có thể bị khóa tài khoản nếu trò chơi có phát hiện gian lận.)

* IGG (IGameGod Hex Editor)
- [iGameGod](https://iosgods.com/igg)  

Hoạt động trên hầu hết trò chơi để chỉnh sửa giá trị mà trò chơi lưu trữ, như tiền mặt/vàng/kim cương, miễn là đó là dữ liệu **không lưu trên máy chủ**.

* 🌟 Glow – Tiện Ích Cho Facebook

📦 **Tải về:** [Glow_facebook.zip](https://github.com/drphe/KhoIPA/releases/download/glow.facebook/Glow_facebook.zip)  
🔗 **Repo gốc:** [Dayanch96/Glow](https://github.com/dayanch96/Glow)

🔧 **Tính năng nổi bật:**
- ✅ Chặn quảng cáo
- 📥 Tải video/story (bấm giữ video)
- 📂 Menu tùy chỉnh: bấm giữ nút Tab Menu, Trang chủ,...

❗️ Nếu cần bản `.deb`, hãy tải từ repo gốc của tác giả.

* 💬 Flow – Tiện Ích Cho Messenger

📦 **Tải về:** [Flow_messenger.zip](https://github.com/drphe/KhoIPA/releases/download/flow.messenger/Flow_messenger.zip)  
🔗 **Repo gốc:** [Dayanch96/Flow](https://github.com/dayanch96/Flow)

🔧 **Tính năng nổi bật:**
- ✅ Chặn quảng cáo
- 📥 Tải story (nút 3 chấm)
- 🚫 Chặn “đã xem” và “đang gõ”
- ⚙️ Menu Flow: Cài Đặt → góc phải

❗️ Nếu cần bản `.deb`, hãy tải từ repo gốc của tác giả.

* 💳 iFaker – Giả Thông Tin Thiết Bị

📦 **Tải về:** [iFaker.dylib](https://github.com/drphe/KhoIPA/releases/download/ifaker/iFaker.dylib)

🔧 **Tính năng nổi bật:**
- 🌀 Fake phiên bản iOS
- 🔢 Fake mã bản dựng
- 📱 Fake phiên bản ứng dụng
- 🧬 Fake mẫu máy

⚠️ Gọi menu bằng cách giữ 4 ngón tay trên màn hình.

* 🚫 DisableNetwork – Chặn Kết Nối Mạng

📦 **Tải về:** [DisableNetwork.dylib](https://github.com/drphe/KhoIPA/releases/download/disablenetwork/DisableNetwork.dylib)

🔧 **Chức năng:**
- 🔒 Chặn kết nối mạng của ứng dụng

⚠️ Khuyến nghị sử dụng với các game offline.

* 🔔Immortalizer - Chạy Nền Ứng Dụng

📦 **Tải về:** [ImmortalizerJailed_arm.dylib](https://github.com/drphe/KhoIPA/releases/download/immortalizer/ImmortalizerJailed_arm.dylib)

😀Hỗ trợ iOS 14 trở lên
😀Có thể cài đặt trên bất kỳ IPA nào mà không cần jailbreak hay TrollStore!
😀Phiên bản Troll: Tại đây (https://t.me/trollersteamvn/2688)

😀Cài đặt
1️⃣ Không cần jailbreak hay TrollStore, vì vậy tất cả những gì bạn phải làm là inject dylib vào IPA mà bạn muốn nó hoạt động. 
2️⃣ Bạn có thể sử dụng bất kỳ công cụ nào như Sideloadly, E-Sign hoặc thậm chí TrollFools để inject dylib vào ứng dụng. 
😀Giải Thích Chức Năng :
- Giống như tinh chỉnh, nó có thể khiến ứng dụng luôn ở chế độ nền trước, tuy nhiên, bạn cần inject điều này vào ứng dụng mà bạn muốn luôn chạy nền. 
- Sẽ có một nút di chuyển nổi mà bạn có thể nhấn để bật Immortalizer 
- Giống như phiên bản TrollStore, không có cách nào để buộc hiển thị thông báo. Việc buộc hiển thị thông báo hơi khó khăn, đặc biệt là đối với các ứng dụng hiển thị giao diện người dùng thông báo riêng khi ứng dụng của chúng được mở (ví dụ: WhatsApp).

🐱 ImmortalizerTS (https://github.com/sergealagon/ImmortalizerTS)

* 🔔Nguồn khác 
📦 **Tải về:** [Thư mục mediafile](https://app.mediafire.com/folder/qlnbgj6n07d14)

---
## ⚙️ Thêm Thư viện (Dylib/Debs) bằng Esign
**Nhập file IPA và Deb/Dylib vào eSign**  

1. **Nhập file IPA** mà bạn muốn chỉnh sửa vào tab *Files* của eSign.  
2. Nhấn vào file đó và chọn **“Add Library”** để chuyển nó sang tab *Unsigned Apps*.  
3. Tiếp theo, **nhập các file Deb/Dylib** vào cùng tab *Files*.  

![ảnh 1](https://i.ibb.co/Mk4HCTpR/nh1.jpg)

Hãy nhấp vào ứng dụng như bình thường nhưng thay vì nhấn **"Signature"** (Ký), hãy nhấn vào **"More settings"** (Cài đặt thêm).

![ảnh 2](https://i.ibb.co/SDyL4GpV/nh2.jpg)

Tiếp theo, tìm **"Add Library"** (Thêm Thư viện).

![ảnh 3](https://i.ibb.co/9kH8yqcz/nh3.jpg)

Sau đó, thêm những thư viện bạn muốn.

![ảnh 4](https://i.ibb.co/QvpbGzzm/nh4.jpg)

Nhấn **"OK"** và bạn sẽ thấy chúng đã được thêm vào.

![ảnh 5](https://i.ibb.co/8gGn96JX/nh5.jpg)

Sau đó, chỉ cần **"Sign"** (Ký) ứng dụng là bạn đã hoàn tất!
---
## 🗑️ Xóa Dylib/Debs

Đôi khi các ứng dụng đã được tinh chỉnh (tweaked apps) đi kèm với những thứ rác rưởi không cần thiết (như các ứng dụng từ iosgods). Bạn có thể xóa những thứ không cần thiết như cửa sổ pop-up quảng cáo của iosgods theo cách tương tự.

Trong tab **"More settings"** (Cài đặt thêm), bạn có thể nhấp vào **"Remove Existing Library"** (Xóa Thư viện Hiện có) để loại bỏ những thứ không mong muốn.

![ảnh 6](https://i.ibb.co/gZFLs9V4/nh6.jpg)

Việc này có thể hữu ích đối với các ứng dụng đã được tinh chỉnh có chứa một loạt các tinh chỉnh không cần thiết được chèn vào, đặc biệt là trong các ứng dụng YouTube, Spotify hoặc mạng xã hội đã được tinh chỉnh có thể gây ra sự cố.
