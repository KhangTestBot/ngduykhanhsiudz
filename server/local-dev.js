const http = require('http');
const url = require('url');

const generateFilteredImage = require('./api/generateFilteredImage');
const images = require('./api/images');
const health = require('./api/health');
const reset = require('./api/reset');
const vipUsers = require('./api/vip-users');
const index = require('./api/index');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    req.query = parsedUrl.query;

    let bodyData = '';
    req.on('data', chunk => {
        bodyData += chunk;
    });

    req.on('end', async () => {
        if (bodyData) {
            try {
                req.body = JSON.parse(bodyData);
            } catch (e) {
                req.body = bodyData;
            }
        }

        // Helper res methods
        res.status = function (code) {
            this.statusCode = code;
            return this;
        };
        res.json = function (obj) {
            this.setHeader('Content-Type', 'application/json; charset=utf-8');
            this.end(JSON.stringify(obj));
        };
        res.send = function (content) {
            this.end(content);
        };

        if (pathname === '/generateFilteredImage' || pathname === '/api/generateFilteredImage') {
            return generateFilteredImage(req, res);
        } else if (pathname.startsWith('/images/') || pathname === '/api/images') {
            if (pathname.startsWith('/images/')) {
                req.query.id = pathname.replace('/images/', '').replace('.jpg', '');
            }
            return images(req, res);
        } else if (pathname === '/health' || pathname === '/api/health') {
            return health(req, res);
        } else if (pathname === '/reset' || pathname === '/api/reset') {
            return reset(req, res);
        } else if (pathname === '/api/vip-users') {
            return vipUsers(req, res);
        } else {
            return index(req, res);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server NgDuyKhanh đang chạy tại http://localhost:${PORT}`);
});
