# 👑 Dự Án Locket Gold 30s/60s + Khung Tiện Ích Loopy 3D — NgDuyKhanh

* **Thương hiệu:** **NgDuyKhanh**
* **GitHub:** [KhangTestBot/ngduykhanhsiudz](https://github.com/KhangTestBot/ngduykhanhsiudz)
* **📸 Web App Chụp & Ghép Photobooth 4 Ảnh Chuẩn Locket:** [https://khangtestbot.github.io/ngduykhanhsiudz/](https://khangtestbot.github.io/ngduykhanhsiudz/)

## ✨ Tính năng tích hợp trong bản cập nhật này

1. **Mở khóa Locket Gold Vĩnh Viễn (Hạn đến năm 9999):** Lên huy hiệu Gold, mở toàn bộ tính năng VIP thông qua RevenueCat.
2. **Bảng thông báo Popup Chào Mừng Chính Chủ:** Khi xoá Locket tải lại và mở app, Locket tự động bật bảng thông báo chào mừng của **NgDuyKhanh**.
3. **Quay Video 60s & Đăng Video Thư Viện 30s Có Tiếng:** Bật sẵn thu âm micro (`microphone_enabled`, `video_sound_enabled`), cam góc rộng, flash và bộ lọc Filter.
4. **Khung Viền Tiện Ích (Widget Frame) Loopy 3D Tự Đổi Theo Từng Ngày Trong Tuần (`frames/`):**
   - Tự động nhận diện thứ trong tuần (theo giờ Việt Nam `UTC+7`) để đổi khung Widget Loopy 3D hồng mỗi ngày:
     - `frames/thu_2.png` — *"Thứ 2 rồi bạn iu ơi"*
     - `frames/thu_3.png` — *"Thứ 3 rồi bạn iu ơi"*
     - `frames/thu_4.png` — *"Thứ 4 rồi bạn iu ơi"*
     - `frames/thu_5.png` — *"Thứ 5 rồi bạn iu ơi"*
     - `frames/thu_6.png` — *"Thứ 6 rồi bạn iu ơi"*
     - `frames/thu_7.png` — *"Thứ 7 rồi bạn iu ơi"*
     - `frames/chu_nhat.png` — *"Chủ Nhật rồi bạn iu ơi"*
   - Kèm kho khung phụ chọn nhanh trong `frames/`: `bokhanh_vip.png`, `hello_kitty.png`, `shin_chan.png`, `doraemon.png`, `khung_ins.png`.
5. **Caption Động Thông Minh Theo Thời Gian Thực (`⚡ Caption Động Thời Gian Thực • NgDuyKhanh`):**
   - **Đồng hồ Live (`UTC+7`):** Tự động cập nhật Thứ, Ngày/Tháng và Giờ:Phút thực tế kèm nền kính mờ (`ultra_thin` blur) và icon `sf_symbol`.
   - **Mood Tự Động Theo Khung Giờ:** Tự động đổi lời chúc, màu Gradient và biểu tượng theo 5 khung giờ trong ngày (Sáng sớm, Nghỉ trưa, Buổi chiều, Buổi tối, Hội cú đêm).
   - **Bộ Đếm Ngược Tự Động (Countdown):** Tự động tính số ngày còn lại tới **Cuối tuần**, **Tết Nguyên Đán**, **Giáng Sinh**, và **Năm Mới**.
   - **Thanh Tiến Độ Năm (`Year Progress`):** Hiển thị trực quan phần trăm năm đã trôi qua (`▓▓▓▓▓▓▓▓░░ 85%`).
   - **Bộ Huy Hiệu Độc Quyền (`🎨 Decorative by NgDuyKhanh`):** `NgDuyKhanh 👑`, `NgDuyKhanh VIP ✨`, `Verified by NgDuyKhanh`, `Khánh Siu Dz 😎` cùng hàng trăm caption Tiếng Việt.
6. **Hồ sơ DNS Giữ Gold (`BoKhanh_LocketGold.mobileconfig`):** Chặn thu hồi Locket Gold sau khi tắt VPN Shadowrocket, hiển thị tên **NgDuyKhanh** trong Cài đặt iPhone.

## 🔗 Danh sách Link Raw & Deep Link Cài Đặt Nhanh (1 Chạm)

### 1. Link tự động mở Shadowrocket (Dùng để gắn vào nút bấm trên Web)
* **Nút Bước 1 — Cài Cấu Hình (`.conf`):**
  ```text
  shadowrocket://config/add/https://raw.githubusercontent.com/KhangTestBot/ngduykhanhsiudz/refs/heads/main/BoKhanh_Locket_30s.conf
  ```
* **Nút Bước 2 — Thêm Module (`.sgmodule`):**
  ```text
  shadowrocket://install?module=https://raw.githubusercontent.com/KhangTestBot/ngduykhanhsiudz/refs/heads/main/BoKhanh_Locket_30s.sgmodule
  ```

### 2. Link Raw trực tiếp trên GitHub
* **File Cấu hình (`.conf`):** `https://raw.githubusercontent.com/KhangTestBot/ngduykhanhsiudz/refs/heads/main/BoKhanh_Locket_30s.conf`
* **File Module (`.sgmodule`):** `https://raw.githubusercontent.com/KhangTestBot/ngduykhanhsiudz/refs/heads/main/BoKhanh_Locket_30s.sgmodule`
* **Script mở khóa Gold (`locket_vip.js`):** `https://raw.githubusercontent.com/KhangTestBot/ngduykhanhsiudz/refs/heads/main/locket_vip.js`
* **Script Remote Config (`locket_unlocked.js`):** `https://raw.githubusercontent.com/KhangTestBot/ngduykhanhsiudz/refs/heads/main/locket_unlocked.js`
* **Script gộp Full (`locket_gold_30s_bokhanh.js`):** `https://raw.githubusercontent.com/KhangTestBot/ngduykhanhsiudz/refs/heads/main/locket_gold_30s_bokhanh.js`
* **Script xóa ETag (`deleteheader.js`):** `https://raw.githubusercontent.com/KhangTestBot/ngduykhanhsiudz/refs/heads/main/deleteheader.js`
* **Script Filter & Photobooth (`locket_filter.js`):** `https://raw.githubusercontent.com/KhangTestBot/ngduykhanhsiudz/refs/heads/main/locket_filter.js`
* **Ảnh Icon/Khung (`Code_Generated_Image.png`):** `https://cdn.jsdelivr.net/gh/KhangTestBot/ngduykhanhsiudz@main/Code_Generated_Image.png`
* **📲 Link Cài Hồ Sơ DNS Giữ Gold Trực Tiếp Trên Safari iPhone (`BoKhanh_LocketGold.mobileconfig`):**
  👉 **[BẤM VÀO ĐÂY TRÊN SAFARI ĐỂ CÀI HỒ SƠ DNS](https://khangtestbot.github.io/ngduykhanhsiudz/BoKhanh_LocketGold.mobileconfig)**
  *(Hoặc link tải trực tiếp từ Release: `https://github.com/KhangTestBot/ngduykhanhsiudz/releases/latest/download/BoKhanh_LocketGold.mobileconfig` — Lưu ý: Không dùng link `raw.githubusercontent.com` cho file `.mobileconfig` vì GitHub Raw ép hiển thị dạng chữ XML thay vì tải hồ sơ).*

## 📱 Quy trình hướng dẫn người dùng cài đặt

1. **Bước 1:** Bấm vào link **Cài Cấu Hình (`BoKhanh_Locket_30s.conf`)** và **Thêm Module (`BoKhanh_Locket_30s.sgmodule`)** vào Shadowrocket.
2. **Bước 2:** Trong Shadowrocket, bấm vào chữ `(i)` cạnh file cấu hình ➔ **Giải mã HTTPS (HTTPS Decryption)** ➔ **Chứng chỉ** ➔ **Cài đặt chứng chỉ** ➔ Vào **Cài đặt iPhone ➔ Đã tải về hồ sơ** để cài đặt, sau đó vào **Cài đặt chung ➔ Giới thiệu ➔ Cài đặt tin cậy chứng chỉ** và bật xanh chứng chỉ Shadowrocket.
3. **Bước 3:** Quay lại Shadowrocket **Bật VPN (Connect)** ➔ Ra màn hình chính **Xóa app Locket cũ và tải lại từ App Store**.
4. **Bước 4:** Mở Locket và đăng nhập ➔ Bảng thông báo **NgDuyKhanh** sẽ hiện lên cùng huy hiệu Gold, quay 30s/60s có tiếng và khung tiện ích ngoài Widget.
5. **Bước 5:** Tắt VPN Shadowrocket và cài đặt hồ sơ **`BoKhanh_LocketGold.mobileconfig`** để giữ Locket Gold vĩnh viễn.
