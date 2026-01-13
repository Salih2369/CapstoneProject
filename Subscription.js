const mongoose = require("mongoose");

const PLAN_MAP = {
  "الباقة التجريبية": "trial",
  "باقة الأعمال": "business",
  "باقة الشركات": "enterprise",
  "باقة المؤسسات": "enterprise",

  trial: "trial",
  business: "business",
  enterprise: "enterprise",
};

function normalizePlan(input) {
  const p = (input || "").trim();
  return PLAN_MAP[p] || p; // يرجع نفس القيمة لو كانت trial/business/enterprise
}

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    plan: {
      type: String,
      required: true,
      enum: ["trial", "business", "enterprise"],
      set: normalizePlan, // ✅ هنا الحل
    },

    status: { type: String, enum: ["active", "canceled"], default: "active" },

    startedAt: { type: Date, default: Date.now },
    endsAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
