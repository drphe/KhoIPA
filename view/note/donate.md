# 👉🏻 Hướng dẫn sử dụng 

Để cài đặt được IPA không cần jailbreak bạn <a href="#" data-url="caidatipa.md" class="news-item-link">đọc bài này</a>.
**Chế độ Nhà phát triển (Developer Mode):** Là yêu cầu bắt buộc khi muốn cài đặt các ứng dụng ngoài AppleStore.
=> <a href="#" data-url="developermod.md" class="news-item-link"> Xem bài hướng dẫn ở đây </a>

## 1. Sử dụng Live Certificates
Nếu bạn bạn đã mua chứng chỉ thì bắt đầu ngay bằng các bài dưới đây:
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
Có nhiều trang chia sẻ về cách này, khác nhau ở bộ lọc DNS còn cơ bản là chứng chỉ Revoked giống nhau. Việc dùng DNS giúp tránh sự kiểm tra Cert bị revoked nhưng nếu Cert hết thời hạn bạn vẫn phải cài lại, hay rò rỉ DNS khi khởi động máy hay khi update IOS làm chứng chỉ bị vào blacklist cũng vậy. Tham khảo bài  <a href="#" data-url="khoivn.md" class="news-item-link">Free sideloading bằng DNS - Khoindvn</a> về cách thực hiện, có hướng dẫn từng bước và giải thích về sự cố rò rỉ DNS hoặc bài <a href="#" data-url="freesideloading.md" class="news-item-link">Free sideloading bằng DNS - PuReEnVyUs</a> hoặc <a href="#" data-url="verifyapp.md" class="news-item-link">Sử dụng cert revoked bằng DNS WFS</a>.
- Việc tạo DNS thủ công đã lỗi thời, thay vào đó sử dụng các DNS sẵn có, tránh rò rỉ DNS giúp xài Cert revoked đc lâu hơn, nhưng ko có gì đảm bảo mọi thứ suôn sẻ. Nên lưu ý: tốt nhất làm theo hướng dẫn trong các bài  (đọc kỹ trước làm sau), kiên nhẫn (có thể chứng chỉ nào đó ko sử dụng đc với thiết bị của bạn), và ko nên update IOS, các bản cập nhật mới vá lỗi bảo mật dễ  rò rỉ DNS và khiến các chứng chỉ bị blacklist.

---

## 3. Mẹo sử dụng Repo tải IPA
KhoIPA tổng hợp nhiều nguồn Repo IPA, trong đó Repo Favorite apps là các IPA do admin chọn lựa theo sở thích cá nhân chủ yếu theo chủ đề: công cụ tiện ích, ứng dụng hay sử dụng đã mod, game đã xóa khỏi store, các ứng dụng đã Paid trên store để chia sẻ lại free.

* Các app như esign, feather... yêu cầu định dạng file nguồn khác nhau, vì thế có thể không thêm được nguồn repository vào. Các reposite có định dạng khác nhau nên có thể chỉ add vào Esign hoặc chỉ Feather, dùng trên web sẽ hiển thị tốt nhất. Tuy nhiên các repo trên KhoIPA đã được mình dành nhiều công sức để nó hỗ trợ cả hầu hết các phần mềm hỗ trợ ký IPA: Esign, Feather ...
* Có thể copy link tải ipa và sử dụng esign, feather hoặc safari tải về. Tuỳ vào sở thích của bạn.

Trên khoIPA có khá nhiều IPA rồi, nhưng trong trường hợp không tìm được IPA bạn cần, hãy tham khảo một số nguồn tải IPA khác dưới đây.
* [CodeVN](https://ios.codevn.net/): Trang chia sẻ IPA miễn phí của ae Việt Nam
* [IPAOMTK](https://ipaomtk.com/): không chỉ có IPA mà cả APK mod cho ae, hoàn toàn miễn phí.
* [DVC Repo](https://dvcipa.github.io/index.html) [DCV Library](https://t.me/dvcipaios): DVC có nhiều IPA game Hack, mod cho ae, nhưng họ bắt nạp tiền mua key kích hoạt chức năng hack.
* [Flekstore](https://flekstore.com/): Kho chia sẻ game, ứng dụng, nhưng phải mua chứng chỉ của họ mới tải và cài đặt được ứng dụng

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
