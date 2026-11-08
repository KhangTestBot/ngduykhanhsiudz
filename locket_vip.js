// ========= ID ========= //
// Locket: Gold Vĩnh Viễn (9999)
// Thương hiệu: Bố Khánh
// ========= Phần cố định ========= //
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold', 'locket_1600_1y']
};

var ua = ($request.headers && ($request.headers["User-Agent"] || $request.headers["user-agent"])) || "";
var obj = {};
try {
  obj = JSON.parse($response.body || "{}");
} catch (e) {
  obj = {};
}

obj.Attention = "Chúc mừng bạn! Cấu hình Locket Gold bởi Bố Khánh!";

var bokhanhSub = {
  auto_resume_date: null,
  display_name: "locket_1600_1y",
  is_sandbox: false,
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
  original_purchase_date: "2023-01-01T00:00:00Z",
  purchase_date: "2023-01-01T00:00:00Z",
  store: "app_store",
  store_transaction_id: "2000001108724193"
};

var locketGold = {
  grace_period_expires_date: null,
  original_purchase_date: "2023-01-01T00:00:00Z",
  purchase_date: "2023-01-01T00:00:00Z",
  product_identifier: "locket_1600_1y",
  ownership_type: "PURCHASED",
  store: "app_store",
  expires_date: "9999-01-09T10:10:14Z"
};

obj.subscriber = obj.subscriber || {};
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};
obj.subscriber.original_app_user_id = obj.subscriber.original_app_user_id || "$RCAnonymousID:bokhanh";
obj.subscriber.first_seen = obj.subscriber.first_seen || "2023-01-01T00:00:00Z";
obj.subscriber.original_application_version = obj.subscriber.original_application_version || "1.0";

// Gán đầy đủ cả Gold, gold, pro và locket_gold để tương thích mọi phiên bản Locket
obj.subscriber.subscriptions["locket_1600_1y"] = bokhanhSub;
obj.subscriber.subscriptions["locket_gold_yearly"] = bokhanhSub;
obj.subscriber.entitlements["Gold"] = locketGold;
obj.subscriber.entitlements["gold"] = locketGold;
obj.subscriber.entitlements["pro"] = locketGold;
obj.subscriber.entitlements["locket_gold"] = locketGold;

$done({
  status: 200,
  headers: $response.headers,
  body: JSON.stringify(obj)
});
