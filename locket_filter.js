/***********************************************
> Locket AI Filter Unlocker, Photobooth Frame Filter & Token Bridge
> Tác giả: NgDuyKhanh
> Endpoint: ^https:\/\/api\.locketcamera\.com\/.+
***********************************************/

const SELF_UID_KEY = "LOCKET_SELF_UID";
const SELF_USERNAME_KEY = "LOCKET_SELF_USERNAME";
const AUTH_TOKEN_KEY = "LOCKET_AUTH_TOKEN";
const LAST_FILTER_KEY = "LOCKET_LAST_FILTER_ID";

const BASE_FRAMES_URL = "https://cdn.jsdelivr.net/gh/KhangTestBot/ngduykhanhsiudz@main/frames/";

function getTodayLoopyFrame() {
    var nowUtc = new Date();
    var vnTime = new Date(nowUtc.getTime() + 7 * 3600 * 1000 + nowUtc.getTimezoneOffset() * 60000);
    var day = vnTime.getDay();
    var daily = ["chu_nhat.png", "thu_2.png", "thu_3.png", "thu_4.png", "thu_5.png", "thu_6.png", "thu_7.png"];
    return BASE_FRAMES_URL + (daily[day] || "thu_2.png");
}

// Bảng ánh xạ 5 Filter đầu tiên trong mục "📸 Photobooth & Khung VIP" (nút ✨ trong Camera Locket)
const PHOTOBOOTH_FILTER_FRAMES = {
    "okay_wig": BASE_FRAMES_URL + "photobooth.png",       // Khung Photobooth 4 Ô
    "cutesy": getTodayLoopyFrame(),                       // Khung Loopy 3D Theo Thứ
    "sticker_face": BASE_FRAMES_URL + "bokhanh_vip.png",  // Khung Loopy 3D Nơ Hồng
    "flower_crown": BASE_FRAMES_URL + "hello_kitty.png",  // Khung Hello Kitty
    "love_bug": BASE_FRAMES_URL + "shin_chan.png"         // Khung Shin Cậu Bé Bút Chì
};

function buildFramedImageUrl(photoUrl, frameUrl) {
    if (!photoUrl || !frameUrl || photoUrl.indexOf("quickchart.io/watermark") !== -1) {
        return photoUrl;
    }
    return "https://quickchart.io/watermark?mainImageUrl=" + encodeURIComponent(photoUrl) +
        "&markImageUrl=" + encodeURIComponent(frameUrl) +
        "&markRatio=1&position=center&margin=0";
}

function applyGoldBadge(target) {
    if (!target || typeof target !== "object") return;
    target.badge = "locket_gold";
    target.is_gold = true;
    target.has_gold = true;
    target.gold = true;
    target.gold_subscription = true;
    target.has_gold_subscription = true;
    target.tier = "gold";
    target.subscription_status = "active";
}

var reqUrl = (typeof $request !== "undefined" && $request && $request.url) ? String($request.url) : "";

// =========================================================================
// 0. CẦU NỐI TỰ ĐỘNG CHO WEB PHOTOBOOTH & PROFILE GOLD
// =========================================================================
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

// =========================================================================
// 1. CHIỀU REQUEST: Xóa cache 304, Giả lập US & Lưu Token/Filter ID
// =========================================================================
else if (typeof $response === "undefined") {
    let headers = Object.assign({}, ($request && $request.headers) || {});

    for (let k of Object.keys(headers)) {
        var lower = k.toLowerCase();
        if (['if-none-match', 'if-modified-since', 'x-revenuecat-etag', 'x-goog-if-none-match'].includes(lower)) {
            delete headers[k];
        }
        if (lower === 'authorization' && headers[k] && typeof $persistentStore !== "undefined") {
            var rawAuth = String(headers[k]).replace(/^Bearer\s+/i, "").trim();
            if (rawAuth.length > 20) {
                $persistentStore.write(rawAuth, AUTH_TOKEN_KEY);
            }
        }
    }

    headers["X-App-Region"] = "US";
    headers["X-Country-Code"] = "US";
    headers["X-Device-Country"] = "US";
    headers["X-Timezone"] = "America/Los_Angeles";

    if ($request && typeof $request.body === "string" && $request.body.length > 2) {
        try {
            var reqObj = JSON.parse($request.body);
            var payload = reqObj.data || reqObj;
            var fid = payload.filter_id || payload.filterId || payload.filter || payload.look_id || payload.style_id;
            if (fid && typeof fid === "string" && typeof $persistentStore !== "undefined") {
                $persistentStore.write(fid, LAST_FILTER_KEY);
            }
        } catch (e) {}
    }

    $done({ headers: headers });
}

// =========================================================================
// 2. CHIỀU RESPONSE: Mở khóa Filter ✨, Gỡ mờ & Nhúng Khung Photobooth
// =========================================================================
else {
    let body = $response.body;
    let status = $response.status || $response.statusCode || 200;
    let lastFilterId = (typeof $persistentStore !== "undefined") ? ($persistentStore.read(LAST_FILTER_KEY) || "") : "";

    if (body && typeof body === "string") {
        try {
            let obj = JSON.parse(body);

            if (status === 402 || status === 403 || status === 400 || (obj && obj.error)) {
                status = 200;
                let dataToKeep = {};
                if (obj && obj.error && obj.error.details) dataToKeep = obj.error.details;
                else if (obj && obj.data) dataToKeep = obj.data;

                obj = {
                    result: {
                        status: 200,
                        success: true,
                        is_gold: true,
                        is_locked: false,
                        requires_gold: false,
                        unlocked: true,
                        can_use_filters: true,
                        can_use_stickers: true,
                        data: dataToKeep
                    },
                    data: dataToKeep,
                    status: 200,
                    success: true,
                    is_gold: true,
                    is_locked: false,
                    requires_gold: false,
                    unlocked: true,
                    can_use_filters: true,
                    can_use_stickers: true
                };
            }

            function transformNode(node) {
                if (!node || typeof node !== "object") return;
                if (Array.isArray(node)) {
                    for (let i = 0; i < node.length; i++) transformNode(node[i]);
                    return;
                }

                const isSelf = (
                    "email" in node || "phone_number" in node || "push_token" in node ||
                    "fcm_token" in node || "can_use_filters" in node ||
                    "can_use_gold_features" in node || node.is_current_user === true
                );

                if (isSelf) {
                    applyGoldBadge(node);
                    node.can_use_filters = true;
                    node.can_use_gold_features = true;
                    node.can_generate_filtered_image = true;
                    node.can_create_filtered_image = true;
                    node.can_use_stickers = true;
                    node.has_ai_access = true;
                    node.filter_access = true;
                    node.sticker_access = true;
                    node.unlimited_stickers = true;
                    node.is_premium = true;

                    const uid = String(node.uid || node.user_id || node.id || "").trim();
                    const username = String(node.username || "").trim();

                    if (typeof $persistentStore !== "undefined") {
                        if (uid) $persistentStore.write(uid, SELF_UID_KEY);
                        if (username) $persistentStore.write(username, SELF_USERNAME_KEY);
                    }
                }

                if (node.filters && Array.isArray(node.filters)) {
                    node.filters.forEach(f => {
                        f.is_locked = false;
                        f.requires_gold = false;
                        f.unlocked = true;
                        f.is_free = true;
                        f.can_use = true;
                    });
                }
                if (node.stickers && Array.isArray(node.stickers)) {
                    node.stickers.forEach(s => {
                        s.is_locked = false;
                        s.requires_gold = false;
                        s.unlocked = true;
                        s.is_free = true;
                        s.can_use = true;
                    });
                }

                const falseFlags = [
                    "is_locked", "locked", "requires_gold", "require_gold",
                    "gold_only", "is_gold_only", "paywall", "show_paywall",
                    "show_upsell", "upsell", "blurred", "is_blurred", "needs_gold",
                    "is_premium_only", "premium_only"
                ];
                for (let f of falseFlags) {
                    if (f in node) node[f] = false;
                }

                const trueFlags = [
                    "can_view", "unlocked", "is_unlocked", "is_free", "free",
                    "can_use_filter", "allowed", "can_use_filters", "can_use_stickers",
                    "sticker_access", "is_available", "enabled"
                ];
                for (let t of trueFlags) {
                    if (t in node) node[t] = true;
                }

                if ("item_type" in node || "sticker_id" in node || "filter_id" in node) {
                    node.is_locked = false;
                    node.requires_gold = false;
                    node.unlocked = true;
                    node.is_free = true;
                    node.can_use = true;
                }

                let clearUrl = node.unblurred_url || node.unlocked_url || node.result_url ||
                    node.transformed_image_url || node.output_url ||
                    ((node.filter_id || "blurred_url" in node || "transformed_image_url" in node || "result_url" in node) ? (node.image_url || node.url || node.original_url) : null);

                if (clearUrl && typeof clearUrl === "string" && clearUrl.startsWith("http")) {
                    var activeFid = String(node.filter_id || lastFilterId || "").trim();
                    var mappedFrame = PHOTOBOOTH_FILTER_FRAMES[activeFid];
                    if (mappedFrame) {
                        clearUrl = buildFramedImageUrl(clearUrl, mappedFrame);
                    }
                    if ("unblurred_url" in node) node.unblurred_url = clearUrl;
                    if ("unlocked_url" in node) node.unlocked_url = clearUrl;
                    if ("result_url" in node) node.result_url = clearUrl;
                    if ("transformed_image_url" in node) node.transformed_image_url = clearUrl;
                    if ("output_url" in node) node.output_url = clearUrl;
                    if ("blurred_url" in node) node.blurred_url = clearUrl;
                    if ("blurred_image_url" in node) node.blurred_image_url = clearUrl;
                    if ("preview_url" in node) node.preview_url = clearUrl;
                    if (mappedFrame && "image_url" in node) node.image_url = clearUrl;
                    if (mappedFrame && "url" in node) node.url = clearUrl;
                }

                for (let k of Object.keys(node)) {
                    if (node[k] && typeof node[k] === "object") {
                        transformNode(node[k]);
                    }
                }
            }

            transformNode(obj);
            body = JSON.stringify(obj);
        } catch (e) {}
    }

    $done({
        status: status,
        headers: Object.assign({}, ($response && $response.headers) || {}, {
            "content-type": "application/json"
        }),
        body: body
    });
}
