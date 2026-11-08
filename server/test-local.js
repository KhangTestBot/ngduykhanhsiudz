const { generateStepNoticeImage } = require('./lib/stepNotices');
const { stitchSingleFrame, stitchPhotobooth4Shots } = require('./lib/photoboothStitcher');
const sharp = require('sharp');

async function runTest() {
    console.log("1. Kiểm tra sinh ảnh thông báo Bước 1...");
    const step1Buf = await generateStepNoticeImage(1, "Photobooth 4 Ô");
    console.log("   -> Sinh ảnh thành công, dung lượng:", step1Buf.length, "bytes");

    console.log("2. Tạo 4 ảnh test giả lập...");
    const dummyPhotos = [];
    for (let i = 0; i < 4; i++) {
        const svg = `
        <svg width="400" height="400">
            <rect width="400" height="400" fill="${['#FF5733', '#33FF57', '#3357FF', '#F3FF33'][i]}"/>
            <text x="200" y="200" font-size="48" fill="#FFF" text-anchor="middle">Shot ${i+1}</text>
        </svg>
        `;
        const buf = await sharp(Buffer.from(svg)).jpeg().toBuffer();
        dummyPhotos.push(buf);
    }

    console.log("3. Kiểm tra ghép 4 tấm Photobooth...");
    const pbResult = await stitchPhotobooth4Shots(dummyPhotos, { layout: 'vertical' });
    console.log("   -> Ghép Photobooth 4 Ô thành công, dung lượng:", pbResult.length, "bytes");

    console.log("4. Kiểm tra ghép Single Frame...");
    const singleResult = await stitchSingleFrame(dummyPhotos[0], null);
    console.log("   -> Ghép Single Frame thành công, dung lượng:", singleResult.length, "bytes");

    console.log("✅ TẤT CẢ TEST ĐỀU THÀNH CÔNG RỰC RỠ!");
}

runTest().catch(err => {
    console.error("Test thất bại:", err);
    process.exit(1);
});
