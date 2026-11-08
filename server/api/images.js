const { getImage } = require('../lib/sessionStore');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const imageId = req.query.id || (req.url && req.url.split('/').pop().split('?')[0]);
    if (!imageId) {
        return res.status(404).send('Image ID required');
    }

    const imageBuffer = getImage(imageId);
    if (!imageBuffer) {
        return res.status(404).send('Image expired or not found');
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600');
    return res.status(200).send(imageBuffer);
};
