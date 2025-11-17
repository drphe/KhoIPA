# Hướng Dẫn Tạo IPA Mod

**Bắt đầu**

Nếu bạn là người mới thì hãy tìm hiểu qua về một số <a href="#" data-url="thuatngu.md" class="news-item-link"> thuật ngữ </a> liên quan đến IPA mod trước nhé.

Bạn cần hiểu rằng: *ứng dụng tải xuống từ App Store đều đã được mã hoá*. Việc tạo file IPA để sử dụng cho nhiều mục đích khác nhau có thể yêu cầu giải mã hoặc không, tuỳ thuộc nhu cầu của bạn.

**Mục đích tạo file IPA rất đa dạng**, ví dụ như:

* Tạo bản *clone app*
* Lưu trữ ứng dụng để phòng khi bị xoá khỏi Store
* Mod app, hack app/game
* Phân tích app
* Chia sẻ lại để cài qua chứng chỉ

Bài hướng dẫn này được chia thành **3 phần lớn**:

---

# 📌 Phần 1: Tạo File IPA Đơn Giản (Basic)

## 1. Tạo file IPA *không giải mã* (Export từ ứng dụng đã cài)

Cách này sử dụng các ứng dụng như <a href="#" data-bundleid="wiki.qaq.Asspp.RmGUBz" class="app-header-link"> **Asspp** </a>, cho phép xuất file IPA từ những app bạn đã cài trên thiết bị.
Phần mềm này yêu cầu đăng nhập *Apple ID*—đây cũng là Apple ID đã dùng để tải app.

**Ưu điểm:**

* Đơn giản
* Không cần jailbreak
* Làm nhanh, thao tác dễ dàng

**Nhược điểm:**

* Ràng buộc Apple ID, chỉ cài đặt được bằng Asspp
* Giới hạn thiết bị, phải đăng nhập Apple ID mới cài được
* File IPA chưa được giải mã ⇒ khó mod hoặc dùng trên thiết bị khác


## 2. Tạo file IPA *đã giải mã* trực tiếp trên thiết bị

Từ **iOS 18 trở lên**, bạn **không thể giải mã app** nếu không jailbreak hoặc sử dụng **TrollStore** (với máy chưa jailbreak).

Với thiết bị chưa jailbreak, chỉ cần cài:

* **TrollStore**, và
* App **AppDump** hoặc **iGameGod**

Hai công cụ này cho phép xuất file IPA **đã giải mã**.


### Video hướng dẫn:

* [https://youtu.be/M5iASlmSR7o?si=7dIWavwtR923PzMr](https://youtu.be/M5iASlmSR7o?si=7dIWavwtR923PzMr)
* [https://youtu.be/joXUG1EKUQ4?si=rvnZbSoXlNf8x3ik](https://youtu.be/joXUG1EKUQ4?si=rvnZbSoXlNf8x3ik)

**Ưu điểm:**

* File IPA **đã giải mã**, có thể mod, hack, inject
* Cài được qua chứng chỉ (sign lại)
* Dùng được trên nhiều thiết bị khác nhau
* Dễ tái sử dụng, lưu trữ

**Nhược điểm:**

* Yêu cầu TrollStore
* iOS thấp sẽ dễ làm hơn
* iOS mới hạn chế nhiều


## 3. Tải IPA từ web hoặc các công cụ online

Bạn có thể tìm file IPA đã được giải mã được chia sẻ trên các trang web hoặc từ những công cụ online.

**👇🏻👇🏻👇🏻 WEB LẤY IPA TRẮNG?**

* https://decrypt.day/
* https://armconverter.com/decryptedappstore/us

**Ưu điểm:**

* Đơn giản, tiện lợi
* Không cần dùng phần mềm trên máy, không yêu cầu về thiết bị

**Nhược điểm:**

* Không phải lúc nào cũng tìm được đúng app, đúng phiên bản
* Chất lượng file phụ thuộc nguồn chia sẻ

---

# 📌 Phần 2: Tạo File IPA Nâng Cao
## Inject IPA qua Trollstore/Trollfool
Tương tự như phần 1, việc Tiêm các tweak (tinh chỉnh), hay các bản mod sẽ dễ dàng, và có nhiều ưu điểm hơn khi máy có Trollstore hay đã jailbreak. 
Nếu có Trollstore, sử dụng công cụ Trollfool giúp vừa tiêm deb/dylib vào app, kể cả khi app được cập nhật từ store vẫn sử được mà không cần cài lại app hay tiêm lại. 

* [Tiêm Trollfools/Trollstore](https://bvn-roothide.github.io/trollfools/)
* Xem video hướng dẫn [Ở đây](https://youtu.be/7Ge_thyM2vY?si=XyE8qDVy_rZg12-7)

## Inject IPA bằng Web/ESign

Đối với các thiết bị đời cao, hoặc chưa jailbreak thì cách muốn tự tạo file IPA mod, tiêm tinh chỉnh là tiêm bằng Esign hoặc các website công cụ online hỗ trợ việc đó. 
Một số nhà phát triển xây dựng website sẵn, việc của bạn là tìm dylib/deb thích hợp, tải IPA trắng (đã giải mã) và tự mình tiêm và cài đặt.

* <a href="#" data-url="Khodylib.md" class="news-item-link"> HD tiêm dylib/deb </a>

* [Tiêm dylib online](https://ipatool.codevn.net/inject-dylib/)
### Một số dylib phổ biến

- Satella (By Paisseon): đây là tweak dùng để mua hàng trong ứng dụng miễn phí, lưu ý là không phải ứng dụng/trò chơi nào cũng có thể hoạt động. Cách sử dụng là bấm vào biểu tượng Satella trong app, sau đó bật các tính năng bạn cần lên và bấm lưu, quay lại mở app lên bấm mua sau đó bấm hủy.
- iGameGod (By iOSGods): đây là một tweak khá hay mà anh em chơi game hay sử dụng.
- Bật Files Access: đây là một thành phần giao diện người dùng cho phép người dùng duyệt và quản lý các tài liệu trong ứng dụng, bao gồm cả các tệp tin, thư mục và các nguồn tài nguyên khác. Khi Files Access được bật, nghĩa là ứng dụng hỗ trợ trình duyệt tài liệu và sẽ được hệ điều hành iOS tích hợp với các tính năng liên quan. Lưu ý là không phải tất cả các ứng dụng/trò chơi đều có thẻ sử dụng tính năng này.
Xóa Extensions: đây là tính năng xóa các tiện ích mở rộng của ứng dụng (nếu bạn đã biết thì tính năng này sẽ xóa tất cả các nội dung trong thư mục Plugins của ứng dụng/trò chơi).
- Adblock: chặn quảng cáo trong app, trò chơi
- Ifaker: giả mạo thông tin tiết bị...

---

# 📌 Phần 3: Mod / Hack IPA

Các bước nâng cao bao gồm:

## 1. Xem và phân tích source code từ file IPA

* Giải nén IPA
* Phân tích *Mach-O*
* Xem tài nguyên và cấu trúc bundle

Ví dụ xem [Tìm mã để mod game](https://youtu.be/GE0G1Ak-zDs?si=0rJjXgbdPqt6uMne) hoặc [Hướng dẫn mod game IPA](https://youtu.be/TznPmwd5JPY?si=BaEREjAV6wuXeZ3m)


## 2. Tạo và sử dụng file **dylib**, **deb**

* Viết lại hành vi của app
* Patch logic
* Hook function
* Inject tweak vào IPA thông qua ESign hoặc các công cụ equivalent

Các bước này đòi hỏi kiến thức về:

* Reverse Engineering
* Logos / Theos
* Hook API
* Mach-O structure

---

# ⭐ Kết luận

Bài hướng dẫn chia thành 3 phần từ cơ bản đến nâng cao, phù hợp cả người mới lẫn người đã có kinh nghiệm:

1. **Basic:** Xuất IPA đơn giản
2. **Advanced:** Inject, sign lại
3. **Mod/Hack:** Hook, viết dylib, tạo deb và mod sâu vào app


*Bạn có thể bắt đầu từ phần 1 nếu mới tìm hiểu, sau đó nâng cấp dần lên phần 2 khi đã quen với công cụ và khái niệm. Phần 3 không khuyến khích nếu bạn ko phải dân công nghệ. Phần này tôi ko hướng dẫn chi tiết, dành cho các chuyên gia.*


