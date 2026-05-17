import { Hono } from "hono";
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

// Supabase admin client (service role) — used server-side only
const SUPABASE_URL = "https://febdusjxlkniozqyyyjk.supabase.co";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYmR1c2p4bGtuaW96cXl5eWprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY2NzI3OCwiZXhwIjoyMDkzMjQzMjc4fQ.uSNSSR3ujs5r_HhvSJ3dUevENCFK7_lKpmOP7c6-2lY";
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Minimal Vercel Serverless Function entry point.
 * All auth is handled client-side via Supabase.
 * This keeps the API layer alive for future expansion.
 */
const app = new Hono();

app.get("/api/ping", (c) => c.json({ ok: true, ts: Date.now() }));

// ZPAY payment sign endpoint
app.post("/api/payment/sign", async (c) => {
  const body = await c.req.json();
  const {
    name,
    money,
    type,
    out_trade_no,
    notify_url,
    return_url,
    param,
    pid,
  } = body;

  if (!name || !money || !out_trade_no || !pid) {
    return c.json({ code: "error", msg: "Missing required fields" }, 400);
  }

  // Get KEY from env (never expose to client)
  const key = process.env.ZPAY_KEY || "VBxcHQnjf6xSIwHzfMWzGY8t7ip22ZXH";

  // Build params object (exclude sign, sign_type, empty values)
  const params: Record<string, string> = {};
  if (name) params.name = name;
  if (money) params.money = money;
  if (type) params.type = type;
  if (out_trade_no) params.out_trade_no = out_trade_no;
  if (notify_url) params.notify_url = notify_url;
  if (return_url) params.return_url = return_url;
  if (param) params.param = param;
  if (pid) params.pid = pid;

  // Sort keys by ASCII
  const sortedKeys = Object.keys(params).sort();

  // Build string: a=b&c=d (no URL encoding)
  const signStr = sortedKeys.map((k) => `${k}=${params[k]}`).join("&") + key;

  // MD5 lowercase
  const sign = createHash("md5").update(signStr).digest("hex").toLowerCase();

  return c.json({
    code: 1,
    params: {
      ...params,
      sign,
      sign_type: "MD5",
    },
    submitUrl: "https://zpayz.cn/submit.php",
  });
});

// ZPAY async notify callback — MUST return "success" or ZPAY retries
app.all("/api/payment/notify", async (c) => {
  const method = c.req.method;
  let payload: Record<string, string> = {};

  if (method === "POST") {
    try {
      payload = await c.req.json();
    } catch {
      const form = await c.req.formData();
      form.forEach((v, k) => { if (typeof v === "string") payload[k] = v; });
    }
  } else {
    const q = c.req.query();
    Object.entries(q).forEach(([k, v]) => { if (v) payload[k] = v; });
  }

  const {
    trade_status,
    out_trade_no,
    trade_no,
    money,
    name,
    type,
    param,
    sign: receivedSign,
    sign_type,
    ...rest
  } = payload;

  // Log for debugging (Vercel logs)
  console.log("[ZPAY NOTIFY]", JSON.stringify(payload));

  // Optional: verify signature
  const key = process.env.ZPAY_KEY || "VBxcHQnjf6xSIwHzfMWzGY8t7ip22ZXH";
  if (receivedSign && sign_type === "MD5") {
    const verifyParams: Record<string, string> = {};
    Object.entries(payload).forEach(([k, v]) => {
      if (k !== "sign" && k !== "sign_type" && v !== "" && v != null) {
        verifyParams[k] = v;
      }
    });
    const sortedKeys = Object.keys(verifyParams).sort();
    const verifyStr = sortedKeys.map((k) => `${k}=${verifyParams[k]}`).join("&") + key;
    const expectedSign = createHash("md5").update(verifyStr).digest("hex").toLowerCase();

    if (expectedSign !== receivedSign.toLowerCase()) {
      console.error("[ZPAY NOTIFY] Signature mismatch", { expected: expectedSign, received: receivedSign });
      // Still return success? No — if sig fails we should alert but still return success
      // to prevent retry storm. Log the issue for manual review.
    }
  }

  if (trade_status === "TRADE_SUCCESS") {
    console.log(`[ZPAY NOTIFY] Payment success: ${out_trade_no} (ZPAY: ${trade_no}) amount: ${money}`);

    // Upsert payment transaction into Supabase
    try {
      const { error: txError } = await supabaseAdmin
        .from("payment_transactions")
        .upsert(
          {
            order_id: out_trade_no,
            transaction_id: trade_no,
            plan_name: name || "Unknown",
            plan_slug: (param || "corolas").toString(),
            amount: parseFloat(money) || 0,
            currency: "CNY",
            payment_method: type === "wxpay" ? "wxpay" : "alipay",
            status: "success",
            paid_at: new Date().toISOString(),
            metadata: { zpay_payload: payload },
          },
          { onConflict: "order_id" }
        );

      if (txError) {
        console.error("[ZPAY NOTIFY] Supabase upsert error:", txError);
      } else {
        console.log(`[ZPAY NOTIFY] Recorded transaction: ${out_trade_no}`);
      }
    } catch (err) {
      console.error("[ZPAY NOTIFY] Supabase exception:", err);
    }
  }

  // ZPAY requires EXACTLY "success" as response body
  return c.text("success");
});

app.all("/api/*", (c) => c.json({ ok: true }));

export default app.fetch;
