/***********************************************
> Locket Profile Gold & Web Bridge
> Tác giả: NgDuyKhanh
> Endpoint: ^https?:\/\/api\.locketcamera\.com\/(changeProfileInfo|bokhanh-photobooth-bridge|moments?|getFilteredImage)
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
// 3. Unblur ảnh chụp hiệu ứng AI & Holiday Effects trong Lịch sử (Bảo toàn 100% danh sách bạn bè)
else if (typeof $response !== "undefined" && $response.body && (reqUrl.indexOf("/moment") !== -1 || reqUrl.indexOf("/getFilteredImage") !== -1)) {
    try {
        let mObj = JSON.parse($response.body);
        function safeUnblur(n) {
            if (!n || typeof n !== "object") return;
            if ("is_blurred" in n) n.is_blurred = false;
            if ("blurred" in n) n.blurred = false;
            if ("requires_gold" in n) n.requires_gold = false;
            if ("needs_gold" in n) n.needs_gold = false;
            if ("locked" in n) n.locked = false;
            if ("is_locked" in n) n.is_locked = false;
            if ("show_paywall" in n) n.show_paywall = false;
            if ("show_upsell" in n) n.show_upsell = false;
            if ("holiday_effect_locked" in n) n.holiday_effect_locked = false;
            if ("holiday_filter_locked" in n) n.holiday_filter_locked = false;
            if ("holiday_effect_requires_gold" in n) n.holiday_effect_requires_gold = false;
            if ("can_view" in n) n.can_view = true;
            if ("unlocked" in n) n.unlocked = true;
            if ("is_unlocked" in n) n.is_unlocked = true;
            if ("is_free" in n) n.is_free = true;
            if (n.blurred_url && (n.download_url || n.image_url)) n.blurred_url = n.download_url || n.image_url;
            if (n.blurred_image_url && (n.download_url || n.image_url)) n.blurred_image_url = n.download_url || n.image_url;
            if (n.preview_url && (n.download_url || n.image_url)) n.preview_url = n.download_url || n.image_url;

            for (let k of Object.keys(n)) {
                if (n[k] && typeof n[k] === "object") {
                    safeUnblur(n[k]);
                }
            }
        }
        safeUnblur(mObj);
        $done({
            body: JSON.stringify(mObj)
        });
    } catch (e) {
        $done({});
    }
}
// 4. TUYỆT ĐỐI KHÔNG CAN THIỆP BẤT KỲ REQUEST NÀO KHÁC (BẢO TOÀN 100% BẠN BÈ & STREAK)
else {
    $done({});
}
