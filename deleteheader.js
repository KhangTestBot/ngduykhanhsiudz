/***********************************************
> deleteHeader by Bố Khánh
***********************************************/
const version = 'V1.0.4';
var modifiedHeaders = $request.headers || {};
delete modifiedHeaders["X-RevenueCat-ETag"];
delete modifiedHeaders["x-revenuecat-etag"];
delete modifiedHeaders["If-None-Match"];
delete modifiedHeaders["if-none-match"];
$done({headers: modifiedHeaders});
