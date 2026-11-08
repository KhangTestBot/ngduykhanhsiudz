const { clearSession } = require('../lib/sessionStore');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const userId = req.query.uid || req.query.userId || 'default_user';
    clearSession(userId);
    return res.status(200).json({
        ok: true,
        message: `Đã đặt lại phiên chụp cho ${userId}`,
        timestamp: Date.now()
    });
};
