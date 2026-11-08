// ========= ID ========= //
// Locket: Gold Vĩnh Viễn (9999)
// Thương hiệu: NgDuyKhanh
// ========= Phần cố định ========= //
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold', 'locket_1600_1y']
};

var ua = (typeof $request !== "undefined" && $request && $request.headers && ($request.headers["User-Agent"] || $request.headers["user-agent"])) || "";
var obj = {};
try {
  obj = JSON.parse($response.body || "{}");
} catch (e) {
  obj = {};
}

obj.Attention = "Chúc mừng bạn! Cấu hình Locket Gold bởi NgDuyKhanh!";

var ngduykhanhSub = {
  auto_resume_date: null,
  display_name: "locket_1600_1y",
  is_sandbox: true,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  management_url: "https://apps.apple.com/account/subscriptions",
  period_type: "normal",
  price: {
    amount: 399000.0,
    currency: "VND"
  },
  expires_date: "9999-01-09T10:10:14Z",
  grace_period_expires_date: null,
  refunded_at: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2010-07-30T10:10:15Z",
  purchase_date: "2010-07-30T10:10:14Z",
  store: "app_store",
  store_transaction_id: "2000001108724193"
};

var locketGold = {
  grace_period_expires_date: null,
  purchase_date: "2010-07-30T10:10:14Z",
  product_identifier: "locket_1600_1y",
  expires_date: "9999-01-09T10:10:14Z"
};

obj.subscriber = obj.subscriber || {};
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};

const match = Object.keys(mapping).find(e => ua.includes(e));
if (match) {
  let [e, s] = mapping[match];
  s ? (locketGold.product_identifier = s, obj.subscriber.subscriptions[s] = ngduykhanhSub) : obj.subscriber.subscriptions["locket_1600_1y"] = ngduykhanhSub, obj.subscriber.entitlements[e] = locketGold;
} else {
  obj.subscriber.subscriptions["locket_1600_1y"] = ngduykhanhSub;
  obj.subscriber.entitlements["Gold"] = locketGold;
  obj.subscriber.entitlements.pro = locketGold;
}
$done({
  body: JSON.stringify(obj)
});
