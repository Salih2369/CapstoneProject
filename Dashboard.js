import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getToken, getUser, hasPermission } from "../js/auth";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const formatK = (n) => {
  const num = Number(n || 0);
  if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "k";
  return String(num);
};

const defaultSeries = [
  { t: "10am", visitors: 200 },
  { t: "12pm", visitors: 650 },
  { t: "2pm", visitors: 520 },
  { t: "4pm", visitors: 820 },
  { t: "6pm", visitors: 1100 },
  { t: "7pm", visitors: 980 },
  { t: "8pm", visitors: 880 },
];

function GlassCard({ children, style }) {
  return (
    <div
      className="glass-card"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 180,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 18,
        padding: 14,
      }}
    >
      <div style={{ opacity: 0.75, fontSize: 13 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 26, fontWeight: 900, color: accent || "inherit" }}>
        {value}
      </div>
    </div>
  );
}

function SmartAnalyticsPanel({ series, alertsCount, waitAvgMin, visitorsToday }) {
  return (
    <GlassCard style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 900, opacity: 0.9 }}>تحليلات مكمن الذكية</div>
        <div style={{ opacity: 0.75, fontSize: 13 }}>Makman Analytics</div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
        <Stat label="متوسط الانتظار" value={`${waitAvgMin}m`} accent="#7CFF8A" />
        <Stat label="تنبيهات أمنية" value={alertsCount} accent="#FF6B6B" />
        <Stat label="زوار اليوم" value={formatK(visitorsToday)} accent="#8FB7FF" />
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ opacity: 0.75 }}>Live</div>
          <div style={{ fontWeight: 800 }}>تدفق الزوار لحظياً</div>
        </div>

        <div
          style={{
            height: 260,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18,
            padding: 10,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="6 6" opacity={0.25} />
              <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.70)" }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.70)" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10,14,22,0.92)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#fff",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.80)" }}
              />
              <Line type="monotone" dataKey="visitors" strokeWidth={4} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Dashboard() {
  const token = getToken();
  const user = getUser();

  const [series, setSeries] = useState(defaultSeries);
  const [alertsCount, setAlertsCount] = useState(2);
  const [waitAvgMin, setWaitAvgMin] = useState(4);
  const [visitorsToday, setVisitorsToday] = useState(1284);

  const headers = useMemo(() => {
    const h = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reports/live`, { headers });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.series) && data.series.length) setSeries(data.series);
        if (Number.isFinite(data?.alertsCount)) setAlertsCount(data.alertsCount);
        if (Number.isFinite(data?.waitAvgMin)) setWaitAvgMin(data.waitAvgMin);
        if (Number.isFinite(data?.visitorsToday)) setVisitorsToday(data.visitorsToday);
      } catch (_) {}
    };
    load();
  }, [headers]);

  return (
    <div style={{ padding: "22px 28px", maxWidth: 1320, margin: "0 auto" }}>
      {/* ✅ الإضافة المطلوبة فوق */}
      <SmartAnalyticsPanel series={series} alertsCount={alertsCount} waitAvgMin={waitAvgMin} visitorsToday={visitorsToday} />

      {/* باقي الصفحة تحتها (نفس فكرتك) */}
      <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1.25fr 0.85fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>أحدث التنبيهات</div>
          <div style={{ opacity: 0.75, marginBottom: 14 }}>(عرض بسيط) — اربطه ببيانات /api/alerts إذا تحب.</div>

          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontWeight: 800 }}>نشاط غير اعتيادي</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>العليا • قبل قليل</div>
              <div style={{ marginTop: 6, fontWeight: 800 }}>الأولوية: high</div>
            </div>

            <div style={{ padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontWeight: 800 }}>ازدحام متوسط</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>النخيل • قبل قليل</div>
              <div style={{ marginTop: 6, fontWeight: 800 }}>الأولوية: medium</div>
            </div>

            <div style={{ padding: 14, borderRadius: 16, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontWeight: 800 }}>حركة طبيعية</div>
              <div style={{ opacity: 0.8, marginTop: 6 }}>الملز • قبل قليل</div>
              <div style={{ marginTop: 6, fontWeight: 800 }}>الأولوية: low</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>حالة الميزات</div>

          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
              <span>الفروع</span>
              <span>{hasPermission("branches") ? "متاح" : "غير متاح في باقتك"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
              <span>التقارير</span>
              <span>{hasPermission("reports") ? "متاح" : "غير متاح في باقتك"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
              <span>التصدير</span>
              <span>{hasPermission("export") ? "متاح" : "غير متاح في باقتك"}</span>
            </div>

            <div style={{ marginTop: 12, opacity: 0.75, fontSize: 13 }}>
              المستخدم: {user?.companyName || user?.name || "—"}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
