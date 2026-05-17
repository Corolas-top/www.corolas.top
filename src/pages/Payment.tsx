import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Shield,
  CreditCard,
  Smartphone,
  QrCode,
  AlertCircle,
  Check,
  Loader2,
  Globe,
  ExternalLink,
  Zap,
  Crown,
  Rocket,
  GraduationCap,
  Gamepad2,
  Brain,
  Coins,
  Megaphone,
  Search,
  Users,
  Sparkles,
  Box,
} from "lucide-react";

// ─── ZPAY config ───
const ZPAY_PID = "2026051723232068";
const ZPAY_SUBMIT_URL = "https://zpayz.cn/submit.php";

// ─── Helpers ───
function generateOrderId(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const r = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `${y}${m}${d}${h}${min}${s}${r}`;
}

function getSiteMeta(site?: string | null) {
  const sites: Record<string, { name: string; color: string; icon: React.ReactNode; domain: string }> = {
    ww: { name: "Corolas", color: "#c8a45c", icon: <Globe size={18} />, domain: "corolas.top" },
    ar: { name: "Admin Console", color: "#6366f1", icon: <Shield size={18} />, domain: "corolar.corolas.top" },
    corater: { name: "Agent Studio", color: "#10b981", icon: <Brain size={18} />, domain: "corater.corolas.top" },
    ordo: { name: "Ordo Network", color: "#ef4444", icon: <Search size={18} />, domain: "ordo.corolas.top" },
    ic: { name: "Platonic", color: "#ec4899", icon: <Sparkles size={18} />, domain: "platonic.corolas.top" },
    edu: { name: "Corolas Academy", color: "#3b82f6", icon: <GraduationCap size={18} />, domain: "edu.corolas.top" },
    earth: { name: "Earth Online", color: "#22c55e", icon: <Gamepad2 size={18} />, domain: "earth-online.corolas.top" },
  };
  return site && sites[site] ? sites[site] : null;
}

// ─── No-params gateway home ───
function GatewayHome() {
  const navigate = useNavigate();

  const products = [
    {
      site: "corater",
      title: "Agent Studio Pro",
      desc: "Unlimited agents, custom models, API access",
      price: "¥99",
      period: "/month",
      icon: <Brain size={24} />,
      color: "#10b981",
    },
    {
      site: "edu",
      title: "Academy Premium",
      desc: "All courses, 1-on-1 tutoring, certification",
      price: "¥199",
      period: "/month",
      icon: <GraduationCap size={24} />,
      color: "#3b82f6",
    },
    {
      site: "earth",
      title: "Earth Online VIP",
      desc: "Premium items, exclusive zones, no ads",
      price: "¥30",
      period: "/month",
      icon: <Gamepad2 size={24} />,
      color: "#22c55e",
    },
    {
      site: "ic",
      title: "Platonic Soulmate",
      desc: "Advanced companions, voice chat, memory",
      price: "¥49",
      period: "/month",
      icon: <Sparkles size={24} />,
      color: "#ec4899",
    },
    {
      site: "ww",
      title: "Corolas Pro",
      desc: "Priority support, 50GB storage, integrations",
      price: "¥99",
      period: "/month",
      icon: <Crown size={24} />,
      color: "#c8a45c",
    },
    {
      site: "ordo",
      title: "Ordo Investigator",
      desc: "Advanced search, data export, team tools",
      price: "¥59",
      period: "/month",
      icon: <Search size={24} />,
      color: "#ef4444",
    },
  ];

  const handleSelect = (p: (typeof products)[0]) => {
    const params = new URLSearchParams({
      name: p.title,
      money: p.price.replace("¥", ""),
      site: p.site,
      type: "alipay",
      return_url: `https://${getSiteMeta(p.site)?.domain || "corolas.top"}`,
    });
    navigate(`/payment?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-[0.2em] text-[#c8a45c] mb-4 block">
          Payment Gateway
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4">
          Corolas{" "}
          <span className="text-gradient-gold">Pay</span>
        </h1>
        <p className="text-white/50 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Unified checkout for all Corolas services. Secure, fast, and simple.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <button
            key={p.site + p.title}
            onClick={() => handleSelect(p)}
            className="text-left p-6 rounded-2xl bg-[#0e0e10] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${p.color}15`, color: p.color }}
            >
              {p.icon}
            </div>
            <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
            <p className="text-sm text-white/40 mb-4">{p.desc}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-light">{p.price}</span>
              <span className="text-sm text-white/40">{p.period}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm" style={{ color: p.color }}>
              <span>Subscribe</span>
              <ExternalLink size={14} />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-4">
          Trusted Payment Processor
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0e0e10] border border-white/[0.06]">
            <QrCode size={16} className="text-[#1677ff]" />
            <span className="text-sm text-white/50">Alipay</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0e0e10] border border-white/[0.06]">
            <Smartphone size={16} className="text-[#07c160]" />
            <span className="text-sm text-white/50">WeChat Pay</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout form ───
function CheckoutForm({
  name,
  money,
  type,
  site,
  returnUrl,
  param,
}: {
  name: string;
  money: string;
  type: string;
  site: string | null;
  returnUrl: string;
  param: string | null;
}) {
  const [payType, setPayType] = useState<string>(type === "wxpay" ? "wxpay" : "alipay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const siteMeta = getSiteMeta(site);
  const outTradeNo = useRef(generateOrderId());

  // Auto-submit after confirmation
  useEffect(() => {
    if (confirmed && formRef.current) {
      formRef.current.submit();
    }
  }, [confirmed]);

  const handlePay = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payment/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          money,
          type: payType,
          out_trade_no: outTradeNo.current,
          notify_url: `https://corolas.top/api/payment/notify`,
          return_url: returnUrl,
          param: param || `${site || "corolas"}`,
          pid: ZPAY_PID,
        }),
      });

      const data = await res.json();
      if (data.code !== 1 && data.code !== "ok" && !data.params) {
        throw new Error(data.msg || "Failed to generate payment signature");
      }

      // Fill hidden form and submit
      const form = formRef.current;
      if (!form) return;

      const params = data.params || data;
      Object.entries(params).forEach(([key, value]) => {
        let input = form.querySelector(`input[name="${key}"]`) as HTMLInputElement;
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          form.appendChild(input);
        }
        input.value = String(value);
      });

      setConfirmed(true);
    } catch (err: any) {
      setError(err.message || "Payment initialization failed");
      setLoading(false);
    }
  }, [name, money, payType, returnUrl, param, site]);

  const moneyNum = parseFloat(money);
  const isValidMoney = !isNaN(moneyNum) && moneyNum > 0;

  return (
    <div className="mx-auto max-w-lg w-full">
      {/* Site badge */}
      {siteMeta && (
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${siteMeta.color}15`,
              color: siteMeta.color,
              border: `1px solid ${siteMeta.color}30`,
            }}
          >
            {siteMeta.icon}
            <span>{siteMeta.name}</span>
          </div>
        </div>
      )}

      {/* Order card */}
      <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-6 sm:p-8 mb-6">
        <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/[0.06]">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Order</p>
            <h2 className="text-lg font-medium">{name}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Amount</p>
            <p className="text-2xl font-light text-[#c8a45c]">
              ¥{isValidMoney ? moneyNum.toFixed(2) : money}
            </p>
          </div>
        </div>

        {/* Order details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Order ID</span>
            <span className="text-white/70 font-mono text-xs">{outTradeNo.current}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Merchant</span>
            <span className="text-white/70">Corolas Technology</span>
          </div>
          {siteMeta && (
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Service</span>
              <span className="text-white/70">{siteMeta.name}</span>
            </div>
          )}
        </div>

        {/* Payment method selector */}
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Payment Method</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPayType("alipay")}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
              payType === "alipay"
                ? "border-[#1677ff]/50 bg-[#1677ff]/10"
                : "border-white/[0.06] bg-transparent hover:border-white/[0.12]"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payType === "alipay" ? "border-[#1677ff]" : "border-white/20"}`}>
              {payType === "alipay" && <div className="w-2.5 h-2.5 rounded-full bg-[#1677ff]" />}
            </div>
            <QrCode size={20} className={payType === "alipay" ? "text-[#1677ff]" : "text-white/40"} />
            <span className={`text-sm ${payType === "alipay" ? "text-white" : "text-white/50"}`}>Alipay</span>
          </button>

          <button
            onClick={() => setPayType("wxpay")}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
              payType === "wxpay"
                ? "border-[#07c160]/50 bg-[#07c160]/10"
                : "border-white/[0.06] bg-transparent hover:border-white/[0.12]"
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payType === "wxpay" ? "border-[#07c160]" : "border-white/20"}`}>
              {payType === "wxpay" && <div className="w-2.5 h-2.5 rounded-full bg-[#07c160]" />}
            </div>
            <Smartphone size={20} className={payType === "wxpay" ? "text-[#07c160]" : "text-white/40"} />
            <span className={`text-sm ${payType === "wxpay" ? "text-white" : "text-white/50"}`}>WeChat Pay</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={loading || confirmed || !isValidMoney}
        className="w-full py-4 rounded-xl bg-white text-[#070708] font-medium text-sm hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {confirmed ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Redirecting to payment...
          </>
        ) : loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Preparing checkout...
          </>
        ) : (
          <>
            <Shield size={18} />
            Pay ¥{isValidMoney ? moneyNum.toFixed(2) : money}
          </>
        )}
      </button>

      <p className="text-center text-xs text-white/30 mt-4 flex items-center justify-center gap-1">
        <Shield size={12} />
        Secured by ZPAY · SSL Encrypted
      </p>

      {/* Hidden form for ZPAY submission */}
      <form
        ref={formRef}
        action={ZPAY_SUBMIT_URL}
        method="POST"
        style={{ display: "none" }}
      >
        <input type="hidden" name="name" />
        <input type="hidden" name="money" />
        <input type="hidden" name="type" />
        <input type="hidden" name="out_trade_no" />
        <input type="hidden" name="notify_url" />
        <input type="hidden" name="return_url" />
        <input type="hidden" name="pid" />
        <input type="hidden" name="param" />
        <input type="hidden" name="sign" />
        <input type="hidden" name="sign_type" />
      </form>
    </div>
  );
}

// ─── Main page ───
export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const name = searchParams.get("name") || "";
  const money = searchParams.get("money") || "";
  const type = searchParams.get("type") || "alipay";
  const site = searchParams.get("site");
  const returnUrl = searchParams.get("return_url") || (site ? `https://${getSiteMeta(site)?.domain || "corolas.top"}` : "https://corolas.top");
  const param = searchParams.get("param");

  const hasOrder = !!name && !!money;

  return (
    <div className="min-h-screen bg-[#070708] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{hasOrder ? "Cancel" : "Back"}</span>
            </button>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#c8a45c]" />
              <span className="text-sm text-white/50">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        {hasOrder ? (
          <CheckoutForm
            name={name}
            money={money}
            type={type}
            site={site}
            returnUrl={returnUrl}
            param={param}
          />
        ) : (
          <GatewayHome />
        )}
      </main>
    </div>
  );
}
