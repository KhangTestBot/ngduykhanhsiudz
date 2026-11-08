module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const vipUsers = [
        "ngduykhanh",
        "bokhanh",
        "ngduykhanh_vip",
        "khangtestbot",
        "duykhanh"
    ];

    return res.status(200).json({
        ok: true,
        version: "2.0.0",
        author: "NgDuyKhanh",
        identifiers: vipUsers
    });
};
