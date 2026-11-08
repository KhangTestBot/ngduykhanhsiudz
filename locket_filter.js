/***********************************************
> Locket Profile Gold & Web Bridge
> Tác giả: NgDuyKhanh
> Endpoint: ^https?:\/\/api\.locketcamera\.com\/(changeProfileInfo|bokhanh-photobooth-bridge)
***********************************************/

const SELF_UID_KEY = "LOCKET_SELF_UID";
const SELF_USERNAME_KEY = "LOCKET_SELF_USERNAME";
const AUTH_TOKEN_KEY = "LOCKET_AUTH_TOKEN";

var reqUrl = (typeof $request !== "undefined" && $request && $request.url) ? String($request.url) : "";

// Lưu token Authorization nếu có request đi qua
if (typeof $request !== "undefined" && $request && $request.headers) {
    let authHeader = $request.headers["Authorization"] || $request.headers["authorization"];
    if (authHeader && typeof $persistentStore !== "undefined") {
        let rawAuth = String(authHeader).replace(/^Bearer\s+/i, "").trim();
        if (rawAuth.length > 20) {
            $persistentStore.write(rawAuth, AUTH_TOKEN_KEY);
        }
    }
}

// 1. Phản hồi đổi badge profile thành Locket Gold
if (reqUrl.indexOf("/changeProfileInfo") !== -1) {
    $done({
        response: {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                data: { badge: "locket_gold", badge_tier: "gold", is_gold: true, success: true },
                result: { badge: "locket_gold", badge_tier: "gold", is_gold: true, success: true }
            })
        }
    });
}
// 2. Cầu nối Web Photobooth (cho trang index.html)
else if (reqUrl.indexOf("/bokhanh-photobooth-bridge") !== -1) {
    var savedToken = (typeof $persistentStore !== "undefined") ? ($persistentStore.read(AUTH_TOKEN_KEY) || "") : "";
    var savedUid = (typeof $persistentStore !== "undefined") ? ($persistentStore.read(SELF_UID_KEY) || "") : "";
    var savedUsername = (typeof $persistentStore !== "undefined") ? ($persistentStore.read(SELF_USERNAME_KEY) || "") : "";

    var bridgeBody = JSON.stringify({
        ok: Boolean(savedToken && savedUid),
        idToken: savedToken,
        uid: savedUid,
        username: savedUsername
    });

    $done({
        response: {
            status: 200,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            },
            body: bridgeBody
        }
    });
}
// 3. TUYỆT ĐỐI KHÔNG CAN THIỆP BẤT KỲ REQUEST NÀO KHÁC (BẢO TOÀN 100% BẠN BÈ & MOMENTS)
else {
    $done({});
}
