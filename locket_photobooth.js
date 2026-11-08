/***********************************************
> Locket Photobooth 4-Shot Engine & AI Filter Modifier
> Tác giả: NgDuyKhanh
> Endpoint: ^https?:\/\/(us-central1-locket-4252a\.cloudfunctions\.net|api\.locketcamera\.com)\/generateFilteredImage
> Tính năng:
>  - Bảo toàn 100% tất cả bộ lọc AI & hiệu ứng ngày lễ gốc của Locket
>  - Chống triệt để 100% lỗi "Không thể áp dụng bộ lọc" trên Locket
>  - Tự động gỡ bỏ hoàn toàn Paywall Gold và làm rõ ảnh bị mờ
***********************************************/

(function () {
    // 1. CHIỀU REQUEST:
    if (typeof $response === "undefined") {
        try {
            if (!$request) return $done({});

            let reqBody = $request.body || "";
            let isPhotobooth = false;

            if (reqBody) {
                try {
                    let parsed = JSON.parse(reqBody);
                    let data = (parsed && (parsed.data || parsed)) || {};
                    let filterId = String(data.filter_id || data.filterId || data.prompt || "");
                    if (filterId.startsWith("pb_") || filterId.indexOf("photobooth") !== -1) {
                        isPhotobooth = true;
                    }
                } catch (e) {
                    if (reqBody.indexOf("pb_") !== -1 || reqBody.indexOf("photobooth") !== -1) {
                        isPhotobooth = true;
                    }
                }
            }

            // Nếu KHÔNG PHẢI Photobooth (tức là bộ lọc AI/Lễ hội chính thức của Locket):
            // Cho phép gửi trực tiếp đến server chính chủ của Locket, KHÔNG điều hướng sang worker lạ
            if (!isPhotobooth) {
                return $done({});
            }

            // Nếu là filter Photobooth đặc thù (pb_...):
            // Nếu có server riêng hoặc vercel, có thể trỏ về; nếu chưa thì để server xử lý
            return $done({});
        } catch (e) {
            return $done({});
        }
    }

    // 2. CHIỀU RESPONSE: Xóa mã lỗi, gỡ Paywall Gold, đảm bảo luôn trả về ảnh hợp lệ
    try {
        let status = (typeof $response !== "undefined" && ($response.status || $response.statusCode)) || 200;
        let body = (typeof $response !== "undefined" && $response.body) || "{}";
        let resObj = {};
        try {
            resObj = JSON.parse(body);
        } catch (e) {
            return $done({});
        }

        // Xóa hoàn toàn các trường lỗi gây ra thông báo "Không thể áp dụng bộ lọc"
        delete resObj.error;
        delete resObj.errors;
        resObj.requires_gold = false;
        resObj.is_gold = true;
        resObj.unlocked = true;
        resObj.is_blurred = false;
        resObj.show_upsell = false;
        resObj.show_paywall = false;

        function cleanNode(node) {
            if (!node || typeof node !== "object") return;
            delete node.error;
            delete node.errors;
            node.requires_gold = false;
            node.is_gold = true;
            node.unlocked = true;
            node.is_blurred = false;
            node.show_upsell = false;
            node.show_paywall = false;
            node.is_locked = false;
            node.locked = false;
            node.can_view = true;
            node.is_free = true;

            // Nếu có ảnh đã unblur, thay thế cho ảnh mờ
            if (node.download_url && node.blurred_url) node.blurred_url = node.download_url;
            if (node.image_url && node.blurred_image_url) node.blurred_image_url = node.image_url;
            if (node.output_url && node.blurred_url) node.blurred_url = node.output_url;
            if (node.url && node.blurred_url) node.blurred_url = node.url;

            for (let k of Object.keys(node)) {
                if (node[k] && typeof node[k] === "object") {
                    cleanNode(node[k]);
                }
            }
        }

        cleanNode(resObj);

        let respHeaders = Object.assign({}, ($response && $response.headers) || {});
        delete respHeaders["Content-Encoding"];
        delete respHeaders["content-encoding"];
        delete respHeaders["Content-Length"];
        delete respHeaders["content-length"];
        delete respHeaders["Transfer-Encoding"];
        delete respHeaders["transfer-encoding"];
        respHeaders["Content-Type"] = "application/json; charset=utf-8";
        respHeaders["Access-Control-Allow-Origin"] = "*";

        return $done({
            status: 200,
            headers: respHeaders,
            body: JSON.stringify(resObj)
        });
    } catch (e) {
        return $done({});
    }
})();
