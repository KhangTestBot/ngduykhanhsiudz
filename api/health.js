module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({
        status: "ok",
        service: "NgDuyKhanh Locket Photobooth Engine",
        version: "2.0.0",
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString()
    });
};
