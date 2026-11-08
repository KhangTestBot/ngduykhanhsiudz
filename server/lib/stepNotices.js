const sharp = require('sharp');

/**
 * Sinh ảnh thông báo hướng dẫn các bước 1, 2, 3 bằng SVG siêu nét
 * @param {number} currentStep Bước hiện tại (1, 2, hoặc 3)
 * @param {string} filterName Tên bộ lọc đang chụp
 * @returns {Promise<Buffer>} JPEG buffer của ảnh thông báo
 */
async function generateStepNoticeImage(currentStep, filterName = "Photobooth 4 Ô") {
    const nextStep = currentStep + 1;
    const progressPercent = Math.round((currentStep / 4) * 100);

    const svg = `
    <svg width="1080" height="1440" viewBox="0 0 1080 1440" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#121214"/>
                <stop offset="50%" stop-color="#18181B"/>
                <stop offset="100%" stop-color="#09090B"/>
            </linearGradient>
            
            <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#27272A"/>
                <stop offset="100%" stop-color="#18181B"/>
            </linearGradient>

            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FCD34D"/>
                <stop offset="50%" stop-color="#F59E0B"/>
                <stop offset="100%" stop-color="#D97706"/>
            </linearGradient>

            <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F472B6"/>
                <stop offset="100%" stop-color="#EC4899"/>
            </linearGradient>

            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6"/>
            </filter>
        </defs>

        <!-- Nền chính -->
        <rect width="1080" height="1440" fill="url(#bg)"/>

        <!-- Vòng hào quang mờ trung tâm -->
        <circle cx="540" cy="500" r="320" fill="#F59E0B" opacity="0.08" filter="blur(60px)"/>

        <!-- Hộp thẻ trung tâm -->
        <rect x="90" y="220" width="900" height="960" rx="44" fill="url(#cardGrad)" stroke="#3F3F46" stroke-width="2" filter="url(#shadow)"/>

        <!-- Huy hiệu VIP trên đầu -->
        <g transform="translate(365, 290)">
            <rect width="350" height="60" rx="30" fill="url(#goldGrad)"/>
            <text x="175" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="24" font-weight="800" fill="#000000" text-anchor="middle" letter-spacing="1">
                ⭐ NGDUYKHANH VIP ⭐
            </text>
        </g>

        <!-- Icon Máy Ảnh 3D cách điệu -->
        <g transform="translate(460, 420)">
            <circle cx="80" cy="80" r="75" fill="#27272A" stroke="#F59E0B" stroke-width="4"/>
            <!-- Camera icon SVG path -->
            <path d="M50 65 L60 50 L100 50 L110 65 L125 65 C130 65 135 70 135 75 L135 110 C135 115 130 120 125 120 L35 120 C30 120 25 115 25 110 L25 75 C25 70 30 65 35 65 Z" fill="none" stroke="#FCD34D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="80" cy="90" r="20" fill="none" stroke="#FCD34D" stroke-width="4"/>
        </g>

        <!-- Tiêu đề trạng thái -->
        <text x="540" y="650" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="52" font-weight="900" fill="#FFFFFF" text-anchor="middle">
            ĐÃ NHẬN ẢNH ${currentStep}/4!
        </text>

        <!-- Tên bộ lọc -->
        <text x="540" y="710" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="26" font-weight="500" fill="#A1A1AA" text-anchor="middle">
            ${filterName}
        </text>

        <!-- Thanh tiến trình (Progress Bar) -->
        <g transform="translate(180, 770)">
            <rect width="720" height="20" rx="10" fill="#27272A"/>
            <rect width="${(720 * progressPercent) / 100}" height="20" rx="10" fill="url(#pinkGrad)"/>
            <text x="720" y="-12" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="22" font-weight="700" fill="#F472B6" text-anchor="end">
                ${progressPercent}%
            </text>
        </g>

        <!-- Hướng dẫn chụp ảnh tiếp theo -->
        <g transform="translate(140, 850)">
            <rect width="800" height="150" rx="28" fill="#18181B" stroke="#3F3F46" stroke-width="1.5"/>
            <text x="400" y="65" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="30" font-weight="700" fill="#FCD34D" text-anchor="middle">
                👉 Nhấn dấu ( X ) ở góc dưới màn hình
            </text>
            <text x="400" y="110" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="500" fill="#E4E4E7" text-anchor="middle">
                để chụp tiếp tấm thứ ${nextStep} nha!
            </text>
        </g>

        <!-- Chân trang bản quyền -->
        <text x="540" y="1120" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="22" font-weight="600" fill="#71717A" text-anchor="middle">
            Hệ thống Photobooth tự động • Server riêng Vercel NgDuyKhanh
        </text>

        <!-- Footer bên ngoài -->
        <text x="540" y="1320" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="24" font-weight="600" fill="#52525B" text-anchor="middle">
            Locket Photobooth Engine v2.0
        </text>
    </svg>
    `;

    return await sharp(Buffer.from(svg))
        .jpeg({ quality: 90 })
        .toBuffer();
}

module.exports = {
    generateStepNoticeImage
};
