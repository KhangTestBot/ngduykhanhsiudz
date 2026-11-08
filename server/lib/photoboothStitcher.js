const sharp = require('sharp');
const axios = require('axios');

/**
 * Tải ảnh từ URL về Buffer
 */
async function fetchImageBuffer(url) {
    if (!url) return null;
    try {
        const resp = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
            }
        });
        return Buffer.from(resp.data);
    } catch (e) {
        console.error('Lỗi tải ảnh:', url, e.message);
        return null;
    }
}

/**
 * Ghép 1 ảnh đơn với khung viền PNG (Single Frame)
 */
async function stitchSingleFrame(photoBuffer, overlayUrl) {
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1440;

    // Chuẩn hóa ảnh người dùng về kích thước 1080x1440
    let basePhoto = await sharp(photoBuffer)
        .resize(CANVAS_WIDTH, CANVAS_HEIGHT, { fit: 'cover', position: 'center' })
        .toBuffer();

    // Nếu có khung viền PNG thì phủ đè lên
    if (overlayUrl) {
        const overlayBuf = await fetchImageBuffer(overlayUrl);
        if (overlayBuf) {
            const resizedOverlay = await sharp(overlayBuf)
                .resize(CANVAS_WIDTH, CANVAS_HEIGHT, { fit: 'fill' })
                .toBuffer();

            basePhoto = await sharp(basePhoto)
                .composite([{ input: resizedOverlay, top: 0, left: 0 }])
                .jpeg({ quality: 92 })
                .toBuffer();
        }
    }

    return basePhoto;
}

/**
 * Ghép 4 ảnh liên tiếp thành dải Photobooth 4 Ô chuẩn Hàn Quốc
 * @param {Array<Buffer>} shots Mảng gồm 4 ảnh
 * @param {Object} frameConfig Cấu hình khung viền
 * @returns {Promise<Buffer>}
 */
async function stitchPhotobooth4Shots(shots, frameConfig = {}) {
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1440;

    // Định dạng ngày giờ hiện tại kiểu Việt Nam
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // 1. KIỂU LƯỚI 2x2 (Grid 2x2) nếu được cấu hình
    if (frameConfig.layout === 'grid_2x2') {
        const cellW = 480;
        const cellH = 580;
        const marginX = 40;
        const marginY = 50;
        const gap = 20;

        const positions = [
            { left: marginX, top: marginY },
            { left: marginX + cellW + gap, top: marginY },
            { left: marginX, top: marginY + cellH + gap },
            { left: marginX + cellW + gap, top: marginY + cellH + gap }
        ];

        const compositeInputs = [];
        for (let i = 0; i < 4; i++) {
            if (shots[i]) {
                const resized = await sharp(shots[i])
                    .resize(cellW, cellH, { fit: 'cover', position: 'center' })
                    .toBuffer();
                compositeInputs.push({
                    input: resized,
                    left: positions[i].left,
                    top: positions[i].top
                });
            }
        }

        // Tạo nền trắng/pastel
        let result = await sharp({
            create: {
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        })
        .composite(compositeInputs)
        .png()
        .toBuffer();

        // Thêm khung viền nếu có
        if (frameConfig.overlayUrl) {
            const overlayBuf = await fetchImageBuffer(frameConfig.overlayUrl);
            if (overlayBuf) {
                const resizedOverlay = await sharp(overlayBuf)
                    .resize(CANVAS_WIDTH, CANVAS_HEIGHT, { fit: 'fill' })
                    .toBuffer();
                result = await sharp(result)
                    .composite([{ input: resizedOverlay, top: 0, left: 0 }])
                    .jpeg({ quality: 92 })
                    .toBuffer();
            }
        }

        return result;
    }

    // 2. KIỂU DẢI 4 Ô DỌC CHUẨN PHOTOBOOTH HÀN QUỐC (Vertical Strip)
    // Chia 4 ô đều nhau
    const cellW = 960;
    const cellH = 290;
    const startX = 60;
    const startY = 40;
    const gapY = 20;

    const compositeInputs = [];

    // Tạo mặt nạ bo góc cho từng ô ảnh
    const roundedCornersSvg = `
    <svg width="${cellW}" height="${cellH}">
        <rect x="0" y="0" width="${cellW}" height="${cellH}" rx="24" ry="24" fill="#FFFFFF"/>
    </svg>
    `;
    const roundedMask = Buffer.from(roundedCornersSvg);

    for (let i = 0; i < 4; i++) {
        if (shots[i]) {
            const resizedPhoto = await sharp(shots[i])
                .resize(cellW, cellH, { fit: 'cover', position: 'center' })
                .composite([{ input: roundedMask, blend: 'dest-in' }])
                .png()
                .toBuffer();

            compositeInputs.push({
                input: resizedPhoto,
                left: startX,
                top: startY + i * (cellH + gapY)
            });
        }
    }

    // Thêm chân trang footer mang thương hiệu NgDuyKhanh
    const footerSvg = `
    <svg width="${CANVAS_WIDTH}" height="1440" xmlns="http://www.w3.org/2000/svg">
        <text x="540" y="1320" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#18181B" text-anchor="middle" letter-spacing="3">
            LOCKET PHOTOBOOTH • NGDUYKHANH VIP
        </text>
        <text x="540" y="1365" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" fill="#71717A" text-anchor="middle" letter-spacing="1">
            ${dateStr}  ${timeStr}  •  MEMORIES
        </text>
    </svg>
    `;
    compositeInputs.push({
        input: Buffer.from(footerSvg),
        left: 0,
        top: 0
    });

    // Tạo nền pastel vintage nhẹ nhàng
    let result = await sharp({
        create: {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            channels: 4,
            background: { r: 250, g: 250, b: 252, alpha: 1 } // Màu trắng sữa cao cấp
        }
    })
    .composite(compositeInputs)
    .png()
    .toBuffer();

    // Nếu người dùng chọn khung viền PNG ngoài (như pb_strawberry, pb_galaxy...)
    if (frameConfig.overlayUrl) {
        const overlayBuf = await fetchImageBuffer(frameConfig.overlayUrl);
        if (overlayBuf) {
            const resizedOverlay = await sharp(overlayBuf)
                .resize(CANVAS_WIDTH, CANVAS_HEIGHT, { fit: 'fill' })
                .toBuffer();

            result = await sharp(result)
                .composite([{ input: resizedOverlay, top: 0, left: 0 }])
                .png()
                .toBuffer();
        }
    }

    return await sharp(result)
        .jpeg({ quality: 92 })
        .toBuffer();
}

module.exports = {
    fetchImageBuffer,
    stitchSingleFrame,
    stitchPhotobooth4Shots
};
