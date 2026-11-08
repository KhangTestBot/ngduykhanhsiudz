module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NgDuyKhanh • Locket Photobooth Server</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #09090b;
            --card: #18181b;
            --card-border: #27272a;
            --gold: #f59e0b;
            --gold-light: #fcd34d;
            --text-main: #f4f4f5;
            --text-sub: #a1a1aa;
            --green: #10b981;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: var(--bg);
            color: var(--text-main);
            font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px;
        }
        .container {
            width: 100%;
            max-width: 680px;
            background: var(--card);
            border: 1px solid var(--card-border);
            border-radius: 28px;
            padding: 40px 32px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
            text-align: center;
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.1);
            color: var(--green);
            border: 1px solid rgba(16, 185, 129, 0.2);
            padding: 6px 16px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 24px;
        }
        .dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; box-shadow: 0 0 12px var(--green); }
        h1 {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #ffffff 40%, var(--gold-light) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p.subtitle {
            color: var(--text-sub);
            font-size: 15px;
            margin-bottom: 32px;
            line-height: 1.6;
        }
        .features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 32px;
            text-align: left;
        }
        .feature-item {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 16px;
        }
        .feature-title { font-weight: 700; font-size: 14px; color: var(--gold-light); margin-bottom: 4px; }
        .feature-desc { font-size: 13px; color: var(--text-sub); line-height: 1.4; }
        .card-box {
            background: #121214;
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 24px;
            text-align: left;
        }
        .code-box {
            background: #000;
            border: 1px solid #333;
            border-radius: 10px;
            padding: 12px;
            font-family: ui-monospace, monospace;
            font-size: 13px;
            color: #38bdf8;
            word-break: break-all;
            margin-top: 8px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, var(--gold), #d97706);
            color: #000;
            font-weight: 700;
            padding: 14px 28px;
            border-radius: 14px;
            text-decoration: none;
            cursor: pointer;
            border: none;
            font-size: 15px;
            transition: all 0.2s;
        }
        .btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .footer {
            margin-top: 24px;
            font-size: 13px;
            color: #52525b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="badge">
            <span class="dot"></span>
            Server Hoạt Động 100% Bình Thường
        </div>
        <h1>NgDuyKhanh Locket Server</h1>
        <p class="subtitle">Máy chủ riêng độc lập xử lý ghép ảnh Photobooth 4 ô, lồng khung viền Loopy 3D và bẻ khóa bộ lọc Locket Gold.</p>

        <div class="features">
            <div class="feature-item">
                <div class="feature-title">📸 Photobooth 4 Ô</div>
                <div class="feature-desc">Ghép tự động 4 tấm liên tiếp thành dải ảnh chuẩn Hàn Quốc.</div>
            </div>
            <div class="feature-item">
                <div class="feature-title">🛡️ Độc Lập 100%</div>
                <div class="feature-desc">Không phụ thuộc vào server trung gian bên thứ 3 của bất kỳ ai.</div>
            </div>
            <div class="feature-item">
                <div class="feature-title">🎨 Khung Độc Quyền</div>
                <div class="feature-desc">Khung viền Loopy 3D, Shin-chan, Hello Kitty chuẩn sắc nét.</div>
            </div>
            <div class="feature-item">
                <div class="feature-title">⚡ Tốc Độ Vercel</div>
                <div class="feature-desc">Xử lý ảnh bằng C++ Sharp siêu nhanh chỉ trong mili-giây.</div>
            </div>
        </div>

        <div class="card-box">
            <div style="font-size: 14px; font-weight: 700; color: #fff;">🔗 Endpoint dùng cho Shadowrocket:</div>
            <div class="code-box" id="endpointUrl">Đang tải...</div>
        </div>

        <button class="btn" onclick="testHealth()">Kiểm Tra Trạng Thái Server (Health Check)</button>
        <div id="testResult" style="margin-top: 16px; font-size: 13px; color: var(--gold-light);"></div>

        <div class="footer">
            Bản quyền © 2026 NgDuyKhanh • Locket Gold Engine
        </div>
    </div>

    <script>
        const host = window.location.origin;
        document.getElementById('endpointUrl').innerText = host + '/generateFilteredImage';

        async function testHealth() {
            const out = document.getElementById('testResult');
            out.innerText = "Đang kiểm tra kết nối...";
            try {
                const res = await fetch(host + '/health');
                const data = await res.json();
                out.innerText = "🟢 Kết nối thành công! Service: " + data.service + " | Uptime: " + data.uptime + "s";
            } catch(e) {
                out.innerText = "❌ Lỗi: " + e.message;
            }
        }
    </script>
</body>
</html>`;

    return res.status(200).send(html);
};
