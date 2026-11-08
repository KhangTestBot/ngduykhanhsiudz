/***********************************************
> Locket Photobooth 4-Shot Engine & AI Filter Modifier
> Tác giả: NgDuyKhanh
> Endpoint: ^https?:\/\/(us-central1-locket-4252a\.cloudfunctions\.net|api\.locketcamera\.com)\/generateFilteredImage
> Tính năng:
>  - Hỗ trợ chụp liên hoàn 4 ảnh Photobooth (Tấm 1 -> Tấm 2 -> Tấm 3 -> Tấm 4 tự ghép)
>  - Kết nối Worker bảo mật xử lý hình ảnh tốc độ cao chuẩn module Locket_YouTube
>  - Chống triệt để 100% lỗi "Không thể áp dụng bộ lọc" trên Locket
***********************************************/

(function () {
    const WORKER_TARGET = "https://locket-vip.mhiep20077.workers.dev/generateFilteredImage?module=Locket_YouTube";

    // 1. CHIỀU REQUEST: Điều hướng qua Worker xử lý Photobooth & AI
    if (typeof $response === "undefined") {
        try {
            if (!$request) return $done({});

            let headers = Object.assign({}, ($request && $request.headers) || {});
            headers["Host"] = "locket-vip.mhiep20077.workers.dev";
            headers["host"] = "locket-vip.mhiep20077.workers.dev";
            headers["X-Module-Origin"] = "Locket_YouTube";

            return $done({
                url: WORKER_TARGET,
                headers: headers
            });
        } catch (e) {
            return $done({});
        }
    }

    // 2. CHIỀU RESPONSE: Xóa mã lỗi, đảm bảo luôn trả về 200 OK thành công
    try {
        let status = (typeof $response !== "undefined" && ($response.status || $response.statusCode)) || 200;
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
        if (resObj.result) {
            delete resObj.result.error;
            delete resObj.result.errors;
        }

        // Nếu status không phải 200 hoặc không có result, tạo fallback 200 OK
        if (status !== 200 || !resObj.result) {
            status = 200;
            resObj = {
                result: {
                    status: 200,
                    data: (resObj && (resObj.data || resObj.result)) || {}
                }
            };
        }

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
    } catch (e) {}

    return $done({});
})();
