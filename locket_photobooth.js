/***********************************************
> Locket Photobooth 4-Shot Engine & AI Filter Modifier
> Tác giả: NgDuyKhanh
> Endpoint: ^https?:\/\/(us-central1-locket-4252a\.cloudfunctions\.net|api\.locketcamera\.com)\/generateFilteredImage
> Tính năng:
>  - Chụp 4 ảnh Photobooth liên tiếp trực tiếp trong app Locket
>  - Ghép tự động vào dải Photobooth chuẩn Hàn Quốc & khung viền độc quyền NgDuyKhanh
>  - Tự động chuyển hướng xử lý qua máy chủ Vercel cá nhân: https://ngduykhanhsiudz-klph.vercel.app
>  - Chống triệt để 100% lỗi "Không thể áp dụng bộ lọc" trên Locket
***********************************************/

(function () {
    const VERCEL_HOST = "ngduykhanhsiudz-klph.vercel.app";
    const TARGET_URL = "https://" + VERCEL_HOST + "/generateFilteredImage?module=NgDuyKhanh_Locket";

    // 1. CHIỀU REQUEST:
    if (typeof $response === "undefined") {
        try {
            if (!$request) return $done({});

            let headers = Object.assign({}, ($request && $request.headers) || {});
            headers["Host"] = VERCEL_HOST;
            headers["host"] = VERCEL_HOST;
            headers["X-Module-Origin"] = "NgDuyKhanh_Locket";

            return $done({
                url: TARGET_URL,
                headers: headers
            });
        } catch (e) {
            return $done({});
        }
    }

    // 2. CHIỀU RESPONSE: Xóa mã lỗi, gỡ Paywall Gold, đảm bảo luôn trả về ảnh hợp lệ
    try {
        let body = (typeof $response !== "undefined" && $response.body) || "{}";
        let resObj = {};
        try {
            resObj = JSON.parse(body);
        } catch (e) {
            resObj = {};
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
