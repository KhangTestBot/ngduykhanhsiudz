const fs = require('fs');
const path = require('path');
const os = require('os');

// Bộ nhớ đệm RAM (cho các container serverless đang ấm)
const memorySessions = new Map();
const memoryImages = new Map();

// Thư mục lưu tạm trên đĩa (/tmp của Vercel Lambda)
const TMP_DIR = path.join(os.tmpdir(), 'locket_pb_store');
if (!fs.existsSync(TMP_DIR)) {
    try {
        fs.mkdirSync(TMP_DIR, { recursive: true });
    } catch (e) {}
}

const SESSION_TTL = 30 * 60 * 1000; // 30 phút

function getSessionFile(sessionId) {
    const safeId = String(sessionId).replace(/[^a-zA-Z0-9_-]/g, '_');
    return path.join(TMP_DIR, `sess_${safeId}.json`);
}

function getImageFile(imageId) {
    const safeId = String(imageId).replace(/[^a-zA-Z0-9_-]/g, '_');
    return path.join(TMP_DIR, `img_${safeId}.jpg`);
}

function getSession(sessionId) {
    if (!sessionId) return { shots: [], lastUpdated: Date.now() };

    // Kiểm tra bộ nhớ RAM trước
    if (memorySessions.has(sessionId)) {
        const sess = memorySessions.get(sessionId);
        if (Date.now() - sess.lastUpdated < SESSION_TTL) {
            return sess;
        }
        memorySessions.delete(sessionId);
    }

    // Kiểm tra file trên /tmp
    const file = getSessionFile(sessionId);
    if (fs.existsSync(file)) {
        try {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            if (Date.now() - (data.lastUpdated || 0) < SESSION_TTL) {
                memorySessions.set(sessionId, data);
                return data;
            }
            fs.unlinkSync(file);
        } catch (e) {}
    }

    return { shots: [], lastUpdated: Date.now() };
}

function saveSession(sessionId, sessionData) {
    if (!sessionId) return;
    sessionData.lastUpdated = Date.now();
    memorySessions.set(sessionId, sessionData);

    try {
        fs.writeFileSync(getSessionFile(sessionId), JSON.stringify(sessionData), 'utf8');
    } catch (e) {}
}

function clearSession(sessionId) {
    if (!sessionId) return;
    memorySessions.delete(sessionId);
    try {
        const file = getSessionFile(sessionId);
        if (fs.existsSync(file)) fs.unlinkSync(file);
    } catch (e) {}
}

function saveImage(imageId, buffer) {
    if (!imageId || !buffer) return;
    memoryImages.set(imageId, buffer);
    try {
        fs.writeFileSync(getImageFile(imageId), buffer);
    } catch (e) {}
}

function getImage(imageId) {
    if (!imageId) return null;
    if (memoryImages.has(imageId)) {
        return memoryImages.get(imageId);
    }
    const file = getImageFile(imageId);
    if (fs.existsSync(file)) {
        try {
            const buf = fs.readFileSync(file);
            memoryImages.set(imageId, buf);
            return buf;
        } catch (e) {}
    }
    return null;
}

module.exports = {
    getSession,
    saveSession,
    clearSession,
    saveImage,
    getImage
};
