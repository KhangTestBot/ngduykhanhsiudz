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
 * Cấu hình giao diện và chi tiết trang trí cho từng Theme Photobooth
 */
function getThemeLayout(theme, dateStr, timeStr) {
    const CANVAS_WIDTH = 1080;
    const CANVAS_HEIGHT = 1440;

    switch (theme) {
        // 1. Life4Cuts Black Minimalist
        case 'life4cuts_black':
            return {
                bgColor: { r: 18, g: 18, b: 20, alpha: 1 },
                cellW: 960, cellH: 295, startX: 60, startY: 35, gapY: 18, rx: 18,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <text x="540" y="1340" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">LIFE 4 CUTS • NGDUYKHANH</text>
                    <text x="540" y="1380" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" fill="#71717A" text-anchor="middle" letter-spacing="1">인생네컷 • ${dateStr} ${timeStr}</text>
                </svg>
                `
            };

        // 2. Life4Cuts Pure White
        case 'life4cuts_white':
            return {
                bgColor: { r: 255, g: 255, b: 255, alpha: 1 },
                cellW: 960, cellH: 295, startX: 60, startY: 35, gapY: 18, rx: 18,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <text x="540" y="1340" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="900" fill="#18181B" text-anchor="middle" letter-spacing="4">인생네컷 • LIFE 4 CUTS</text>
                    <text x="540" y="1380" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" fill="#A1A1AA" text-anchor="middle" letter-spacing="1">MEMORIES • NGDUYKHANH VIP</text>
                </svg>
                `
            };

        // 3. Coquette Pink Ribbon
        case 'coquette_ribbon':
            return {
                bgColor: { r: 253, g: 242, b: 248, alpha: 1 }, // Baby Pink
                cellW: 950, cellH: 290, startX: 65, startY: 40, gapY: 20, rx: 24,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <!-- Ribbon Bow SVG decor -->
                    <text x="80" y="1360" font-size="36">🎀</text>
                    <text x="960" y="1360" font-size="36">🎀</text>
                    <text x="540" y="1335" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="800" fill="#DB2777" text-anchor="middle" letter-spacing="2">🎀 COQUETTE PHOTOBOOTH 🎀</text>
                    <text x="540" y="1375" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" fill="#F472B6" text-anchor="middle">💖 ${dateStr} • Sweet Memories 💖</text>
                </svg>
                `
            };

        // 4. Kodak 35mm Film Strip
        case 'kodak_35mm_film':
            const sprocketHoles = Array.from({ length: 16 }).map((_, i) => `
                <rect x="20" y="${40 + i * 86}" width="28" height="44" rx="6" fill="#27272A"/>
                <rect x="1032" y="${40 + i * 86}" width="28" height="44" rx="6" fill="#27272A"/>
                <text x="64" y="${75 + i * 86}" font-family="monospace" font-size="12" fill="#F59E0B">0${(i%4)+1}A</text>
            `).join('');

            return {
                bgColor: { r: 10, g: 10, b: 12, alpha: 1 },
                cellW: 920, cellH: 290, startX: 80, startY: 40, gapY: 20, rx: 8,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    ${sprocketHoles}
                    <text x="540" y="1340" font-family="ui-monospace, monospace" font-size="24" font-weight="900" fill="#F59E0B" text-anchor="middle" letter-spacing="4">KODAK PORTRA 400 • 35MM FILM</text>
                    <text x="540" y="1380" font-family="ui-monospace, monospace" font-size="17" font-weight="700" fill="#EF4444" text-anchor="middle" letter-spacing="2">ISO 400 • ${dateStr} • NGDUYKHANH</text>
                </svg>
                `
            };

        // 5. Y2K Cyber Silver Chrome
        case 'y2k_silver_chrome':
            return {
                bgColor: { r: 226, g: 232, b: 240, alpha: 1 },
                cellW: 950, cellH: 290, startX: 65, startY: 40, gapY: 20, rx: 20,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <text x="540" y="1335" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="900" fill="#1E293B" text-anchor="middle" letter-spacing="3">✦ Y2K CYBER PHOTOBOOTH ✦</text>
                    <text x="540" y="1375" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="700" fill="#64748B" text-anchor="middle">LIMITED EDITION • NGDUYKHANH VIP</text>
                </svg>
                `
            };

        // 6. Capybara Chill
        case 'capybara_chill':
            return {
                bgColor: { r: 254, g: 243, b: 199, alpha: 1 }, // Warm cream
                cellW: 950, cellH: 290, startX: 65, startY: 40, gapY: 20, rx: 22,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <text x="540" y="1335" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="800" fill="#92400E" text-anchor="middle" letter-spacing="1">🍊 CAPYBARA CHILL PHOTOBOOTH 🍊</text>
                    <text x="540" y="1375" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" fill="#B45309" text-anchor="middle">Don't Worry, Be Capy • ${dateStr}</text>
                </svg>
                `
            };

        // 7. Matcha Daisy
        case 'matcha_daisy':
            return {
                bgColor: { r: 236, g: 253, b: 245, alpha: 1 },
                cellW: 950, cellH: 290, startX: 65, startY: 40, gapY: 20, rx: 22,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <text x="540" y="1335" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="800" fill="#065F46" text-anchor="middle" letter-spacing="2">🌼 MATCHA &amp; DAISY BLOSSOM 🌼</text>
                    <text x="540" y="1375" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" fill="#059669" text-anchor="middle">Fresh Nature • ${dateStr}</text>
                </svg>
                `
            };

        // 8. Sunset Peach
        case 'sunset_peach':
            return {
                bgColor: { r: 255, g: 237, b: 213, alpha: 1 },
                cellW: 950, cellH: 290, startX: 65, startY: 40, gapY: 20, rx: 22,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <text x="540" y="1335" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="800" fill="#9A3412" text-anchor="middle" letter-spacing="2">🌅 SUNSET PEACH DREAM 🌅</text>
                    <text x="540" y="1375" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" fill="#EA580C" text-anchor="middle">Golden Hour • ${dateStr}</text>
                </svg>
                `
            };

        // 9. Cyber Neon
        case 'cyber_neon':
            return {
                bgColor: { r: 15, g: 23, b: 42, alpha: 1 },
                cellW: 950, cellH: 290, startX: 65, startY: 40, gapY: 20, rx: 16,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <text x="540" y="1335" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="900" fill="#38BDF8" text-anchor="middle" letter-spacing="3">⚡ CYBER NEON CITY ⚡</text>
                    <text x="540" y="1375" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="700" fill="#C084FC" text-anchor="middle">NIGHTMARKET • NGDUYKHANH</text>
                </svg>
                `
            };

        // 10. Sweet Love Valentine
        case 'heart_pink_love':
            return {
                bgColor: { r: 255, g: 241, b: 242, alpha: 1 },
                cellW: 950, cellH: 290, startX: 65, startY: 40, gapY: 20, rx: 22,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <text x="540" y="1335" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="26" font-weight="800" fill="#E11D48" text-anchor="middle" letter-spacing="2">💖 SWEET LOVE PHOTOBOOTH 💖</text>
                    <text x="540" y="1375" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="600" fill="#FB7185" text-anchor="middle">Forever With You • ${dateStr}</text>
                </svg>
                `
            };

        // Mặc định: Vintage Milk Pastel
        default:
            return {
                bgColor: { r: 250, g: 250, b: 252, alpha: 1 },
                cellW: 960, cellH: 290, startX: 60, startY: 40, gapY: 20, rx: 24,
                extraSvg: `
                <svg width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}">
                    <text x="540" y="1325" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="900" fill="#18181B" text-anchor="middle" letter-spacing="3">LOCKET PHOTOBOOTH • NGDUYKHANH VIP</text>
                    <text x="540" y="1370" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="600" fill="#71717A" text-anchor="middle" letter-spacing="1">${dateStr}  ${timeStr}  •  MEMORIES</text>
                </svg>
                `
            };
    }
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

    // 2. KIỂU DẢI 4 Ô DỌC CHUẨN PHOTOBOOTH (Vertical Strip)
    const themeOpts = getThemeLayout(frameConfig.theme, dateStr, timeStr);

    const compositeInputs = [];

    // Tạo mặt nạ bo góc cho từng ô ảnh
    const roundedCornersSvg = `
    <svg width="${themeOpts.cellW}" height="${themeOpts.cellH}">
        <rect x="0" y="0" width="${themeOpts.cellW}" height="${themeOpts.cellH}" rx="${themeOpts.rx}" ry="${themeOpts.rx}" fill="#FFFFFF"/>
    </svg>
    `;
    const roundedMask = Buffer.from(roundedCornersSvg);

    for (let i = 0; i < 4; i++) {
        if (shots[i]) {
            const resizedPhoto = await sharp(shots[i])
                .resize(themeOpts.cellW, themeOpts.cellH, { fit: 'cover', position: 'center' })
                .composite([{ input: roundedMask, blend: 'dest-in' }])
                .png()
                .toBuffer();

            compositeInputs.push({
                input: resizedPhoto,
                left: themeOpts.startX,
                top: themeOpts.startY + i * (themeOpts.cellH + themeOpts.gapY)
            });
        }
    }

    // Thêm chân trang footer & chi tiết trang trí
    compositeInputs.push({
        input: Buffer.from(themeOpts.extraSvg),
        left: 0,
        top: 0
    });

    let result = await sharp({
        create: {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            channels: 4,
            background: themeOpts.bgColor
        }
    })
    .composite(compositeInputs)
    .png()
    .toBuffer();

    // Nếu có khung overlay ảnh PNG ngoài đè lên
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
