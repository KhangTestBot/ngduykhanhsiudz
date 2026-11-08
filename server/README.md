# 👑 NgDuyKhanh • Locket Photobooth & Filter Engine (Vercel Serverless)

Máy chủ backend riêng biệt, độc lập 100%, được xây dựng dành riêng cho hệ thống **Locket Gold • NgDuyKhanh**.

---

## ✨ Tính Năng Nổi Bật

1. **Photobooth 4 Ô Liên Hoàn (Korean 4-Cut Strip)**:
   - Tự động nhận diện quy trình 4 bước chụp.
   - Khi chụp tấm 1, 2, 3: Server tự động sinh ảnh chỉ dẫn nét căng kèm thanh tiến trình (25%, 50%, 75%) và dòng chữ: *"👉 Hãy ấn dấu (X) để chụp tiếp tấm tiếp theo"*.
   - Khi chụp tấm 4: Tự động ghép nối cả 4 tấm ảnh vào dải Photobooth hoàn chỉnh, bo góc mềm mại, chèn thương hiệu **LOCKET PHOTOBOOTH • NGDUYKHANH VIP** và ngày giờ chụp thực tế.
2. **Khung Viền Độc Quyền (Single Frames)**:
   - Tự động lồng ghép khung Loopy 3D, Shin-chan, Hello Kitty chuẩn kích thước 1080x1440.
3. **Độc Lập Tuyệt Đối & Tốc Độ Siêu Nhanh**:
   - Sử dụng thư viện C++ **Sharp** trên môi trường Vercel Serverless (xử lý ảnh chỉ mất ~50ms).
   - Không lo bị phụ thuộc hay bị người khác chặn mã 403.
4. **Miễn Phí 100% Trọn Đời**:
   - Gói Vercel Hobby miễn phí 100GB băng thông và hàng trăm nghìn lượt gọi mỗi tháng.

---

## 🚀 Hướng Dẫn Deploy Lên Vercel (2 Cách Cực Dễ)

### Cách 1: Deploy Trực Tiếp Bằng Vercel CLI (Nhanh nhất - 1 phút)
Mở Terminal trên máy tính và chạy 2 dòng lệnh sau:

```bash
cd /Users/mac/.gemini/antigravity/scratch/ngduykhanh-server
npx vercel --prod
```
- Khi Vercel hỏi: `Set up and deploy?` ➔ Nhập `y` (Enter).
- Làm theo các hướng dẫn đăng nhập (GitHub hoặc Email).
- Sau khi xong, Vercel sẽ cấp cho bạn một đường link chính thức dạng:  
  👉 `https://ngduykhanh-server.vercel.app`

---

### Cách 2: Deploy Qua GitHub
1. Tạo một repository mới trên GitHub (Ví dụ: `ngduykhanh-locket-server`).
2. Tải toàn bộ các file trong thư mục này lên repository đó.
3. Vào trang [vercel.com](https://vercel.com) ➔ Đăng nhập ➔ Bấm **Add New...** ➔ **Project**.
4. Chọn repository bạn vừa tạo và bấm **Deploy**.
5. Đợi 30 giây là bạn đã có một server riêng hoạt động 24/7!

---

## 📱 Kết Nối Vào Shadowrocket

Sau khi đã có link Vercel của bạn (ví dụ: `https://ngduykhanh-locket.vercel.app`):

1. Mở file [`locket_photobooth.js`](file:///Users/mac/.gemini/antigravity/scratch/ngduykhanhsiudz/locket_photobooth.js).
2. Sửa dòng:
```javascript
const WORKER_TARGET = "https://ngduykhanh-locket.vercel.app/generateFilteredImage";
```
3. Lưu lại và đẩy lên GitHub. Vậy là toàn bộ tính năng Photobooth của bạn đã chạy 100% trên server riêng!
