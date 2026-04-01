# 👉🏻 Hướng dẫn sử dụng 

- **Chế độ Nhà phát triển (Developer Mode):** Là yêu cầu bắt buộc khi muốn cài đặt các ứng dụng ngoài AppleStore.
=> <a href="#" data-url="developermod.md" class="news-item-link"> Xem bài hướng dẫn ở đây </a>
- Nếu bạn có PC hãy đọc bài: <a href="#" data-url="caidatipa.md" class="news-item-link"> Cài đặt được IPA không cần jailbreak </a> qua PC, autorefresh không lo revoke (dành cho người dùng nâng cao).

Ở đây tôi tập trung hướng về cách cài IPA trên Iphone/Ipad thông qua Cert mà không sử dụng máy tính, phù hợp với mục đích cá nhân (dành cho người dùng phổ thông).
## 1. Sử dụng Live Certificates
Nếu bạn bạn đã mua chứng chỉ, sau khi nhận được tệp cert.zip thì upload chứng chỉ và file IPA cần cài lên một các trang sau để nhận link cài trực tiếp:

- https://sign.codevn.net (công cụ của CodeVN)
- https://sign.ipasign.cc/
- https://sign.kravasign.com/
- https://wsfteam.xyz/

Bạn hãy cài Esign/Feather... là những ứng dụng hỗ trợ ký Cert và cài IPA ngoài Store mà ko cần jailbreak máy.

Tiếp theo đọc các bài hướng dẫn sau để tìm hiểu về ứng dụng Esign/Feather...

* [Hướng dẫn sử dụng ESign cơ bản](https://codevn.net/huong-dan-su-dung-esign-co-ban/)
* [Hướng dẫn sử dụng Feather cơ bản](https://codevn.net/huong-dan-su-dung-feather-co-ban/)
*  <a href="#" data-url="chongthuhoicc.md" class="news-item-link">Chống thu hồi chứng chỉ bằng DNS</a>.
* Lỗi xác minh ứng dụng <a href="#" data-url="loicert.md" class="news-item-link">Cách hạn chế</a>.


### Ghi Nhớ khi sử dụng Live Cert
- Luôn kiểm tra tính tương thích của IPA với thiết bị và hệ điều hành.
- Feather thường ổn định hơn và ít bị revoke hơn ESign.
- Đừng quên theo dõi thời hạn chứng chỉ để tránh gián đoạn khi cài app.

## 2. Free Sideloading
Nếu bạn không mua chứng chỉ, muốn freesideloading thì đọc kỹ các bài hướng dẫn sau: 
* Sử dụng Trollstore cho các thiết bị ios cũ:  <a href="#" data-url="trollstore.md" class="news-item-link">Cài IPA bằng trollstore</a>.

* Sử dụng Cert bị revoke bằng DNS: 
Có nhiều trang chia sẻ về cách này, khác nhau ở bộ lọc DNS còn cơ bản là chứng chỉ Revoked giống nhau. Việc dùng DNS giúp tránh sự kiểm tra Cert bị revoked nhưng nếu Cert hết thời hạn bạn vẫn phải cài lại, hay rò rỉ DNS khi máy mới khởi động hay khi update IOS làm thiết bị của bạn bị đưa vào blacklist và không sử dụng được chứng chỉ. 

Một số điểm cần lưu ý: (1) Khi bạn cài đặt một chứng chỉ đã revoked trên thiết bị mà không có DNS, server sẽ kiểm tra và đưa thiết bị vào blacklist với cert đó, lúc này sẽ không thể xác minh tính toàn vẹn của ứng dụng; (2) khi bạn khởi động lại máy, DNS chưa áp dụng ngay gọi là rò rỉ DNS và mở 1 ứng dụng nào đó, cũng tương tự như trên khiến bạn bị đưa vào blacklist và các ứng dụng đã cài sẽ không hoạt động nữa. Để khắc phục lỗi này, có thể bật chế độ máy bay trước khi tắt, khởi động lại thiết bị để phòng ngừa rò rỉ DNS. (3) Cơ chế kiểm tra "Để xác minh nhà phát triển <...> cần kết nối mạng. Ứng dụng sẽ không khả dụng cho đến khi hoàn tất kiểm tra." Đây là cơ chế **PPQ (Piracy Prevention & Quality check)** của Apple nhằm ngăn chặn việc cài đặt ứng dụng lậu hoặc ứng dụng bị chỉnh sửa. Nếu DNS bị rò rỉ hoặc không được áp dụng, khiến kiểm tra phát hiện ứng dụng bị trùng BundleId với app nào đó trên Store hay ứng dụng được chỉnh sửa, thiết bị sẽ bị đưa vào blacklist. Trong các trình ký ứng dụng có cơ chế bảo vệ bởi PPQ (chèn thêm chuỗi sau bundleId) hoặc tự thay thế bundleId thủ công để tránh bị lỗi blacklist.


- Tham khảo bài  <a href="#" data-url="khoivn.md" class="news-item-link">Free sideloading bằng DNS - Khoindvn</a> về cách thực hiện, có hướng dẫn từng bước và giải thích về sự cố rò rỉ DNS 
- hoặc bài <a href="#" data-url="freesideloading.md" class="news-item-link">Free sideloading bằng DNS - PuReEnVyUs</a> 
- hoặc <a href="#" data-url="verifyapp.md" class="news-item-link">Sử dụng cert revoked bằng DNS WFS</a>.
- hoặc vào trực tiếp đây cho nhanh, chia sẻ các chứng chỉ doanh nghiệp và Esign/Trollstore đã được ký sẵn, nhớ cài DNS để tránh bị revoke. => https://certvn.com/dns
- hay sử dụng <a href="#" data-url="applejr.md" class="news-item-link">DNS của AppleJr.net</a> (update 1/2026).
- hay sử dụng https://wezlemin.github.io/ksignz/ (trang này lấy nguồn từ khoindvn.io, nhưng không có quảng cáo thôi).

- Hiện tại một số ứng dụng Ksign, Esign đã cải tiến, dùng ngon hơn, cài đặt trực tiếp đã có sẵn cert, không phải import cert thủ công, nhưng do lý do nào đó mà bạn sẽ chỉ sử dụng được một vài cert phù hợp, vì vậy muốn xài free hãy thật kiên nhẫn thử nhé. Click cài đặt và chờ, nếu Esign/Ksign hoạt động là ok rồi. Có thể cài đặt IPA khác bằng Esign/Ksign vừa cài đặt xong. (Nếu cài đặt được Esign mà muốn dùng Ksign thì tìm IPA Ksign và cài bằng Esign, nhớ bỏ tick "remove mobileprovision after sign" để Ksign có cert nhé)

- Việc tạo DNS thủ công đã lỗi thời, thay vào đó sử dụng các DNS sẵn có, tránh rò rỉ DNS giúp xài Cert revoked đc lâu hơn, nhưng ko có gì đảm bảo mọi thứ suôn sẻ. Nên lưu ý: tốt nhất làm theo hướng dẫn trong các bài  (đọc kỹ trước làm sau), kiên nhẫn (có thể chứng chỉ nào đó ko sử dụng đc với thiết bị của bạn), và ko nên update IOS, các bản cập nhật mới vá lỗi bảo mật dễ  rò rỉ DNS và khiến các chứng chỉ bị blacklist.

---

## 3. Mẹo sử dụng Repo tải IPA
KhoIPA tổng hợp nhiều nguồn Repo IPA, trong đó Repo Favorite apps là các IPA do admin chọn lựa theo sở thích cá nhân chủ yếu theo chủ đề: công cụ tiện ích, ứng dụng hay sử dụng đã mod, game đã xóa khỏi store, các ứng dụng đã Paid trên store để chia sẻ lại free.

* Các app như esign, feather... yêu cầu định dạng file nguồn khác nhau, vì thế có thể không thêm được nguồn repository vào. Các reposite có định dạng khác nhau nên có thể chỉ add vào Esign hoặc chỉ Feather, dùng trên web sẽ hiển thị tốt nhất. Tuy nhiên các repo trên KhoIPA đã được mình dành nhiều công sức để nó hỗ trợ cả hầu hết các phần mềm hỗ trợ ký IPA: Esign, Feather ...
* Có thể copy link tải ipa và sử dụng esign, feather hoặc safari tải về. Tuỳ vào sở thích của bạn.
* Nếu tệp IPA được ký sẵn, truy cập https://i.codevn.net hoặc https://installonair.com/ để tạo link cài trực tiếp.

Trên khoIPA có khá nhiều IPA rồi, nhưng trong trường hợp không tìm được IPA bạn cần, hãy tham khảo một số nguồn tải IPA khác <a href="#" data-url="collection.md" class="news-item-link">ở đây</a>. 

---

## 4. Mẹo khi cài đặt IPA bằng Esign/Feather

* Có thể 1 số bạn lên iOS 26 bị crash 1 số app mod khi cài bằng chứng chỉ, hãy sử dụng feather và bật tính năng này lên rồi import chứng chỉ + ipa vào feather ký và cài đặt lại
![image](https://i.ibb.co/cKVBdcg7/16daaa72039b.jpg)

* Đối với Cài đặt bằng Esign mà bị lỗi thì vào cài đặt, tích chọn Remove mobileprovision after signing và thử lại nhé. 
![image](https://i.ibb.co/r271cBFX/34b51153a95f.jpg)


---

## 5. Cách thức liên lạc và trao đổi

### 📬Liên lạc
Các bro có thể liên lạc với mình qua các kênh sau nhé.

![Contact](https://i.ibb.co/39KrnHjM/IMG-3213.jpg)

- 💬 **Telegram**: [@Phetit](https://t.me/Phetit)  
- 🎥 **Patreon**: [patreon.com/drphe](https://patreon.com/drphe)  
- 📧 **Email**: [gmail](mailto://drphe95@gmail.com)

### 💖 Donate 

![Donate](https://i.ibb.co/yCDhBSr/IMG-3215.jpg)

- 🏦 **MB Bank**: `2885999999`  Nguyễn Văn Phê
- 🏦 **TechcomBank**: `282885999999`  Nguyễn Văn Phê

![MB](https://i.ibb.co/JWG0Hvgd/IMG-3214.jpg)


✨ Cảm ơn bạn đã ủng hộ và đồng hành cùng tác giả!
