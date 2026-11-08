const { getSession, saveSession, clearSession, saveImage } = require('../lib/sessionStore');
const { getFrameConfig } = require('../lib/frames');
const { generateStepNoticeImage } = require('../lib/stepNotices');
const { fetchImageBuffer, stitchSingleFrame, stitchPhotobooth4Shots } = require('../lib/photoboothStitcher');

// Hàm trích xuất UID người dùng từ Authorization Header hoặc query / body
function extractUserId(req) {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
        if (authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const parts = token.split('.');
            if (parts.length >= 2) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
                if (payload.user_id || payload.sub || payload.uid) {
                    return payload.user_id || payload.sub || payload.uid;
                }
            }
        }
    } catch (e) {}

    // Fallback: dùng IP hoặc ID tạm
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : (req.socket && req.socket.remoteAddress) || 'default_user';
    return ip.replace(/[^a-zA-Z0-9_-]/g, '_');
}

// Lấy Base Host URL của server Vercel hiện tại
function getBaseUrl(req) {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'localhost:3000';
    return `${proto}://${host}`;
}

module.exports = async (req, res) => {
    // Xử lý CORS Preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) || {};
        const data = body.data || body;

        const filterId = data.filter_id || data.filterId || body.filter_id || '';
        const inputImageUrl = data.download_url || data.image_url || data.imageUrl || data.url || body.download_url || '';

        const userId = extractUserId(req);
        const baseUrl = getBaseUrl(req);
        const frameConfig = getFrameConfig(filterId);

        // Trường hợp không có URL ảnh gửi lên
        if (!inputImageUrl) {
            return res.status(200).json({
                result: {
                    status: 200,
                    data: { message: "NgDuyKhanh Server Ready. No input image." }
                }
            });
        }

        // Tải ảnh người dùng vừa chụp về
        const photoBuffer = await fetchImageBuffer(inputImageUrl);
        if (!photoBuffer) {
            // Nếu không tải được ảnh gốc, trả lại chính URL gốc để không bao giờ bị lỗi app
            return res.status(200).json({
                result: {
                    status: 200,
                    outputUrl: inputImageUrl,
                    output_url: inputImageUrl,
                    data: { outputUrl: inputImageUrl }
                }
            });
        }

        // =========================================================================
        // 1. CHẾ ĐỘ PHOTOBOOTH 4 Ô LIÊN HOÀN (Multi-Shot)
        // =========================================================================
        const isPhotobooth = frameConfig && frameConfig.type === 'photobooth_4';
        if (isPhotobooth) {
            const session = getSession(userId);
            session.shots.push(photoBuffer);

            const shotCount = session.shots.length;

            // NẾU LÀ TẤM 1, 2, HOẶC 3:
            // Sinh ảnh thông báo hướng dẫn "ĐÃ NHẬN ẢNH! Hãy bấm (X) để chụp tiếp"
            if (shotCount < 4) {
                saveSession(userId, session);

                const noticeBuffer = await generateStepNoticeImage(shotCount, frameConfig.name || "Photobooth 4 Ô");
                const noticeImgId = `step_${userId}_${shotCount}_${Date.now()}`;
                saveImage(noticeImgId, noticeBuffer);

                const noticeUrl = `${baseUrl}/api/images?id=${noticeImgId}`;

                return res.status(200).json({
                    result: {
                        status: 200,
                        outputUrl: noticeUrl,
                        output_url: noticeUrl,
                        url: noticeUrl,
                        imageUrl: noticeUrl,
                        image_url: noticeUrl,
                        data: {
                            status: 200,
                            outputUrl: noticeUrl,
                            output_url: noticeUrl,
                            url: noticeUrl,
                            imageUrl: noticeUrl,
                            image_url: noticeUrl
                        }
                    }
                });
            }

            // NẾU ĐÃ ĐỦ 4 TẤM (TẤM THỨ 4):
            // Ghép 4 tấm lại thành dải Photobooth hoàn chỉnh
            const finalStitchedBuffer = await stitchPhotobooth4Shots(session.shots, frameConfig);
            clearSession(userId); // Xóa session để lượt chụp sau bắt đầu từ tấm 1

            const finalImgId = `pb_final_${userId}_${Date.now()}`;
            saveImage(finalImgId, finalStitchedBuffer);

            const finalUrl = `${baseUrl}/api/images?id=${finalImgId}`;

            return res.status(200).json({
                result: {
                    status: 200,
                    outputUrl: finalUrl,
                    output_url: finalUrl,
                    url: finalUrl,
                    imageUrl: finalUrl,
                    image_url: finalUrl,
                    data: {
                        status: 200,
                        outputUrl: finalUrl,
                        output_url: finalUrl,
                        url: finalUrl,
                        imageUrl: finalUrl,
                        image_url: finalUrl
                    }
                }
            });
        }

        // =========================================================================
        // 2. CHẾ ĐỘ KHUNG ĐƠN (Single Frame, ví dụ Khung Loopy 3D, Shin-chan...)
        // =========================================================================
        if (frameConfig && frameConfig.type === 'single') {
            const finalSingleBuffer = await stitchSingleFrame(photoBuffer, frameConfig.overlayUrl);
            const singleImgId = `single_${userId}_${Date.now()}`;
            saveImage(singleImgId, finalSingleBuffer);

            const singleUrl = `${baseUrl}/api/images?id=${singleImgId}`;

            return res.status(200).json({
                result: {
                    status: 200,
                    outputUrl: singleUrl,
                    output_url: singleUrl,
                    url: singleUrl,
                    imageUrl: singleUrl,
                    image_url: singleUrl,
                    data: {
                        status: 200,
                        outputUrl: singleUrl,
                        output_url: singleUrl
                    }
                }
            });
        }

        // =========================================================================
        // 3. CÁC HIỆU ỨNG FILTER KHÁC (Passthrough an toàn)
        // =========================================================================
        return res.status(200).json({
            result: {
                status: 200,
                outputUrl: inputImageUrl,
                output_url: inputImageUrl,
                url: inputImageUrl,
                imageUrl: inputImageUrl,
                image_url: inputImageUrl,
                data: {
                    status: 200,
                    outputUrl: inputImageUrl,
                    output_url: inputImageUrl
                }
            }
        });

    } catch (error) {
        console.error('Lỗi xử lý Filter:', error);
        // Luôn trả về 200 OK với fallback để app Locket không bao giờ bị báo lỗi
        return res.status(200).json({
            result: {
                status: 200,
                data: {
                    status: 200,
                    fallback: true
                }
            }
        });
    }
};
