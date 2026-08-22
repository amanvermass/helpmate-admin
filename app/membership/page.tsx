"use client";

import React, { useState, useMemo } from "react";
import {
  Crown,
  Sparkles,
  Zap,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  Calendar,
  Percent,
  DollarSign,
  TrendingUp,
  Tag,
  Star,
  Award,
  AlertCircle,
  Megaphone,
  Clock,
  ArrowRight,
  ChevronRight,
  Building,
  UserPlus,
  Sliders,
} from "lucide-react";
import {
  initialMembershipPlans,
  initialFreeServiceOffers,
  initialMemberSubscribers,
  MembershipPlan,
  FreeServiceOffer,
  MemberSubscriber,
} from "@/lib/mockData";
import { DataTable, Column } from "@/components/DataTable";
import { CustomSelect } from "@/components/CustomSelect";
import { Portal } from "@/components/Portal";

export default function MembershipManagementPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>(initialMembershipPlans);
  const [freeOffers, setFreeOffers] = useState<FreeServiceOffer[]>(initialFreeServiceOffers);
  const [subscribers, setSubscribers] = useState<MemberSubscriber[]>(initialMemberSubscribers);

  const [activeTab, setActiveTab] = useState<"plans" | "free_services" | "subscribers" | "marketing">("plans");

  // Filter States for Subscribers
  const [searchSubscriber, setSearchSubscriber] = useState("");
  const [filterPlanId, setFilterPlanId] = useState("all");
  const [filterSubscriberStatus, setFilterSubscriberStatus] = useState("all");

  // Drawer / Slider States
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const [isFreeServiceDrawerOpen, setIsFreeServiceDrawerOpen] = useState(false);
  const [editingFreeOffer, setEditingFreeOffer] = useState<FreeServiceOffer | null>(null);

  const [isGrantVIPDrawerOpen, setIsGrantVIPDrawerOpen] = useState(false);

  // Edit/Create Plan Form State
  const [planFormName, setPlanFormName] = useState("");
  const [planFormPrice, setPlanFormPrice] = useState(999);
  const [planFormOrigPrice, setPlanFormOrigPrice] = useState(1999);
  const [planFormDiscount, setPlanFormDiscount] = useState(15);
  const [planFormFreeQuota, setPlanFormFreeQuota] = useState(3);
  const [planFormBadge, setPlanFormBadge] = useState("Popular");
  const [planFormTagline, setPlanFormTagline] = useState("");

  // Free Service Form State
  const [freeTitle, setFreeTitle] = useState("");
  const [freeCategory, setFreeCategory] = useState("AC Servicing & Repair");
  const [freeValue, setFreeValue] = useState(699);
  const [freeQuota, setFreeQuota] = useState(2);

  // Grant VIP Form State
  const [grantCustomerName, setGrantCustomerName] = useState("");
  const [grantCustomerPhone, setGrantCustomerPhone] = useState("");
  const [grantPlanId, setGrantPlanId] = useState("plan-gold");

  // Summary Metrics
  const totalSubscribers = useMemo(() => {
    return plans.reduce((acc, p) => acc + p.activeSubscribersCount, 0);
  }, [plans]);

  const totalARR = useMemo(() => {
    return plans.reduce((acc, p) => acc + p.price * p.activeSubscribersCount, 0);
  }, [plans]);

  const totalFreeClaimed = useMemo(() => {
    return freeOffers.reduce((acc, o) => acc + o.totalClaimedCount, 0);
  }, [freeOffers]);

  // Handle Plan Toggle Active
  const togglePlanStatus = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const newStatus = p.status === "Active" ? "Draft" : "Active";
        return { ...p, status: newStatus };
      })
    );
  };

  // Handle Free Offer Toggle Status
  const toggleOfferStatus = (offerId: string) => {
    setFreeOffers((prev) =>
      prev.map((o) => {
        if (o.id !== offerId) return o;
        return { ...o, status: o.status === "Active" ? "Paused" : "Active" };
      })
    );
  };

  // Open Plan Drawer for Edit or Create
  const handleOpenPlanDrawer = (plan?: MembershipPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanFormName(plan.name);
      setPlanFormPrice(plan.price);
      setPlanFormOrigPrice(plan.originalPrice);
      setPlanFormDiscount(plan.discountPercent);
      setPlanFormFreeQuota(plan.freeServicesCount);
      setPlanFormBadge(plan.badge);
      setPlanFormTagline(plan.tagline);
    } else {
      setEditingPlan(null);
      setPlanFormName("HelpMate Platinum VIP");
      setPlanFormPrice(1499);
      setPlanFormOrigPrice(2999);
      setPlanFormDiscount(18);
      setPlanFormFreeQuota(4);
      setPlanFormBadge("VIP Elite");
      setPlanFormTagline("Premium all-inclusive annual home care pass");
    }
    setIsPlanDrawerOpen(true);
  };

  // Save Plan from Drawer
  const handleSavePlanDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editingPlan.id
            ? {
                ...p,
                name: planFormName,
                price: Number(planFormPrice),
                originalPrice: Number(planFormOrigPrice),
                discountPercent: Number(planFormDiscount),
                freeServicesCount: Number(planFormFreeQuota),
                badge: planFormBadge,
                tagline: planFormTagline,
              }
            : p
        )
      );
    } else {
      const newPlan: MembershipPlan = {
        id: `plan-${Date.now()}`,
        name: planFormName,
        slug: planFormName.toLowerCase().replace(/\s+/g, "-"),
        tagline: planFormTagline,
        price: Number(planFormPrice),
        originalPrice: Number(planFormOrigPrice),
        billingCycle: "Annual",
        badge: planFormBadge,
        discountPercent: Number(planFormDiscount),
        freeServicesCount: Number(planFormFreeQuota),
        convenienceFeeWaiver: true,
        priorityDispatchMinutes: 15,
        freeCancellation: true,
        dedicatedManager: true,
        activeSubscribersCount: 0,
        status: "Active",
        colorTheme: "from-purple-900 via-indigo-900 to-slate-900",
        perks: [
          `${planFormDiscount}% Flat Discount on all Services`,
          `${planFormFreeQuota}x FREE Services per year`,
          "₹0 Convenience Fee & Free Rescheduling",
          "15-Minute Express Priority Dispatch",
        ],
      };
      setPlans([...plans, newPlan]);
    }
    setIsPlanDrawerOpen(false);
  };

  // Save Free Service from Drawer
  const handleSaveFreeServiceDrawer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeTitle) return;
    const newOffer: FreeServiceOffer = {
      id: `free-srv-${Date.now()}`,
      serviceTitle: freeTitle,
      category: freeCategory,
      eligiblePlans: ["plan-gold", "plan-crown-elite"],
      annualQuota: Number(freeQuota),
      unitValue: Number(freeValue),
      totalClaimedCount: 0,
      status: "Active",
    };
    setFreeOffers([...freeOffers, newOffer]);
    setFreeTitle("");
    setIsFreeServiceDrawerOpen(false);
  };

  // Filtered Subscribers List
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) => {
      const q = searchSubscriber.toLowerCase();
      const matchSearch =
        !q ||
        s.customerName.toLowerCase().includes(q) ||
        s.customerPhone.toLowerCase().includes(q) ||
        s.locality.toLowerCase().includes(q);

      const matchPlan = filterPlanId === "all" || s.planId === filterPlanId;
      const matchStatus = filterSubscriberStatus === "all" || s.status.toLowerCase() === filterSubscriberStatus.toLowerCase();

      return matchSearch && matchPlan && matchStatus;
    });
  }, [subscribers, searchSubscriber, filterPlanId, filterSubscriberStatus]);

  // Handle Grant VIP Form Submit
  const handleGrantVIPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantCustomerName || !grantCustomerPhone) return;

    const selectedPlan = plans.find((p) => p.id === grantPlanId);
    const newSub: MemberSubscriber = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      customerName: grantCustomerName,
      customerPhone: grantCustomerPhone,
      locality: "Varanasi Central",
      planId: grantPlanId,
      planName: selectedPlan?.name || "VIP Gold",
      subscribedDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
      daysRemaining: 365,
      freeServicesUsed: 0,
      freeServicesTotal: selectedPlan?.freeServicesCount || 3,
      totalSavingsAmount: 0,
      status: "Active",
    };

    setSubscribers([newSub, ...subscribers]);
    setGrantCustomerName("");
    setGrantCustomerPhone("");
    setIsGrantVIPDrawerOpen(false);
  };

  // Subscribers Table Columns
  const subscriberColumns: Column<MemberSubscriber>[] = [
    {
      key: "customerName",
      header: "Member Customer",
      accessor: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold flex items-center justify-center text-xs shrink-0 border border-purple-200 dark:border-purple-800">
            <Crown className="w-4 h-4 text-purple-600" />
          </div>
          <div className="space-y-0.5">
            <div className="font-extrabold text-slate-900 dark:text-white text-xs">{s.customerName}</div>
            <div className="text-[10px] text-slate-500">{s.customerPhone} • {s.locality}</div>
          </div>
        </div>
      ),
    },
    {
      key: "planName",
      header: "VIP Plan Tier",
      accessor: (s) => (
        <span
          className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border flex items-center gap-1 w-fit ${
            s.planId === "plan-crown-elite"
              ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
              : s.planId === "plan-gold"
              ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
          }`}
        >
          <Crown className="w-3 h-3" />
          {s.planName}
        </span>
      ),
    },
    {
      key: "freeServicesUsed",
      header: "Free Services Claimed",
      accessor: (s) => (
        <div className="space-y-1 text-xs">
          <div className="font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
            <span>{s.freeServicesUsed} of {s.freeServicesTotal} Claimed</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              {Math.round((s.freeServicesUsed / s.freeServicesTotal) * 100)}%
            </span>
          </div>
          <div className="w-32 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(s.freeServicesUsed / s.freeServicesTotal) * 100}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "totalSavingsAmount",
      header: "Member Savings",
      accessor: (s) => (
        <span className="font-black text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
          ₹{s.totalSavingsAmount.toLocaleString("en-IN")} Saved
        </span>
      ),
    },
    {
      key: "status",
      header: "Validity Status",
      accessor: (s) => (
        <div className="space-y-0.5">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
              s.status === "Active"
                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
            }`}
          >
            {s.status} ({s.daysRemaining} Days Left)
          </span>
          <div className="text-[10px] text-slate-400">Expires: {s.expiryDate}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full px-6 space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 flex items-center gap-1">
              <Crown className="w-3 h-3 text-purple-600" />
              <span>VIP Loyalty & Subscription Engine</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            HelpMate Membership & Free Services Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure VIP membership plans, free complimentary services, member discounts, and subscriber CRM.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGrantVIPDrawerOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-extrabold text-xs cursor-pointer transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4 text-purple-500" />
            <span>Grant VIP Plan to Client</span>
          </button>

          {/* RULE: Strictly ONLY ONE Primary Button per page/view */}
          <button
            type="button"
            onClick={() => handleOpenPlanDrawer()}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lux cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Membership Plan</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Active VIP Members</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalSubscribers.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this month
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Annual Membership ARR</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ₹{(totalARR / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-[10px] text-slate-400 font-medium">Recurring Subscription Revenue</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Free Services Claimed</span>
            <Gift className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalFreeClaimed.toLocaleString("en-IN")} Jobs
          </div>
          <div className="text-[10px] text-amber-600 font-extrabold">100% Free Complimentary Jobs</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold">Average Member Savings</span>
            <Sparkles className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ₹2,450 / yr
          </div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Discounts + Free Services</div>
        </div>
      </div>

      {/* Main Tabbed Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "plans"
              ? "bg-purple-600 text-white shadow-lux"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Membership Tiers ({plans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("free_services")}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "free_services"
              ? "bg-purple-600 text-white shadow-lux"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Free Services Rules ({freeOffers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("subscribers")}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "subscribers"
              ? "bg-purple-600 text-white shadow-lux"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Subscriber Directory ({subscribers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("marketing")}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "marketing"
              ? "bg-purple-600 text-white shadow-lux"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Marketing & Banners</span>
        </button>
      </div>

      {/* TAB 1: MEMBERSHIP TIER PLANS (FULL WIDTH & ALL 3 CARDS 100% VISIBLE) */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const isActive = plan.status === "Active";

              // Distinct high-contrast card header background gradients for Card 1, 2, and 3
              const headerGradient =
                index === 0
                  ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950"
                  : index === 1
                  ? "bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600"
                  : "bg-gradient-to-br from-purple-950 via-purple-800 to-indigo-950";

              return (
                <div
                  key={plan.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between transition-all bg-white dark:bg-slate-900 shadow-xl hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-800"
                >
                  {/* Card Header Banner */}
                  <div className={`p-6 ${headerGradient} text-white space-y-3 relative`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-300" />
                        {plan.badge}
                      </span>

                      <button
                        type="button"
                        onClick={() => togglePlanStatus(plan.id)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                          isActive
                            ? "bg-emerald-500/30 text-emerald-200 border border-emerald-400/50"
                            : "bg-slate-700/60 text-slate-300 border border-slate-500"
                        }`}
                      >
                        {isActive ? "🟢 LIVE ON APP" : "⏸️ PAUSED"}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{plan.tagline}</p>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-3xl font-black text-white">₹{plan.price}</span>
                      <span className="text-sm line-through text-slate-300">₹{plan.originalPrice}</span>
                      <span className="text-xs text-white font-bold">/ {plan.billingCycle}</span>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-6 space-y-5 flex-1 flex flex-col justify-between text-xs">
                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
                        <span className="font-extrabold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                          <Percent className="w-4 h-4 text-purple-600" /> Flat Service Discount
                        </span>
                        <span className="text-sm font-black text-purple-600 dark:text-purple-400">
                          {plan.discountPercent}% OFF
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/40 flex items-center justify-between">
                        <span className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                          <Gift className="w-4 h-4 text-amber-600" /> Free Services Included
                        </span>
                        <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                          {plan.freeServicesCount} Free Jobs / yr
                        </span>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          VIP Included Perks
                        </span>
                        <ul className="space-y-2">
                          {plan.perks.map((perk, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-slate-500 font-bold">
                        {plan.activeSubscribersCount} Active Subscribers
                      </span>

                      {/* EDIT OPENS SLIDE-OVER DRAWER */}
                      <button
                        type="button"
                        onClick={() => handleOpenPlanDrawer(plan)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 text-purple-700 dark:text-purple-300 font-extrabold text-xs cursor-pointer transition-colors flex items-center gap-1 border border-purple-200 dark:border-purple-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Tier (Slider)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FREE COMPLIMENTARY SERVICES RULES */}
      {activeTab === "free_services" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-amber-600" />
              <div>
                <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                  Free Service Allocation Rules Engine
                </h4>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  Define which high-value services are offered 100% FREE to Gold and Crown VIP members.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFreeServiceDrawerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Free Service Offer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freeOffers.map((offer) => {
              const isOfferActive = offer.status === "Active";

              return (
                <div
                  key={offer.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {offer.category}
                      </span>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">
                        {offer.serviceTitle}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleOfferStatus(offer.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                        isOfferActive
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {isOfferActive ? "ACTIVE" : "PAUSED"}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Retail Value</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{offer.unitValue} FREE
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Annual Quota</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {offer.annualQuota} Jobs / Member
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Total Claimed</span>
                      <span className="font-extrabold text-purple-600 dark:text-purple-400">
                        {offer.totalClaimedCount} Times
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-purple-500" />
                      Eligible Tiers: {offer.eligiblePlans.join(", ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: VIP SUBSCRIBERS DIRECTORY (CRM) */}
      {activeTab === "subscribers" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchSubscriber}
                  onChange={(e) => setSearchSubscriber(e.target.value)}
                  placeholder="Search subscriber name, phone, locality..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <CustomSelect
                  value={filterPlanId}
                  onChange={setFilterPlanId}
                  options={[
                    { value: "all", label: "All VIP Tiers" },
                    { value: "plan-silver", label: "HelpMate Silver Pass" },
                    { value: "plan-gold", label: "HelpMate Gold Club" },
                    { value: "plan-crown-elite", label: "Crown Elite VIP" },
                  ]}
                  placeholder="Filter Plan"
                  className="w-44 text-xs"
                />

                <CustomSelect
                  value={filterSubscriberStatus}
                  onChange={setFilterSubscriberStatus}
                  options={[
                    { value: "all", label: "All Statuses" },
                    { value: "active", label: "Active Members" },
                    { value: "expired", label: "Expired Members" },
                  ]}
                  placeholder="Filter Status"
                  className="w-40 text-xs"
                />
              </div>
            </div>

            {/* Subscribers Table */}
            <DataTable columns={subscriberColumns} data={filteredSubscribers} />
          </div>
        </div>
      )}

      {/* TAB 4: MARKETING BANNERS & CHECKOUT PROMOTION */}
      {activeTab === "marketing" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-slate-900 to-purple-950 text-white space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-purple-500/30 border border-purple-400/30 text-purple-300 text-xs font-black uppercase">
                Customer App Promotion Controls
              </span>
              <span className="text-xs text-emerald-400 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Live on App Checkout
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black">Checkout Membership Upsell Card</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Automatically displays a VIP membership savings calculator on the booking checkout page showing customers how much they save instantly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-amber-400" />
                <div className="text-xs">
                  <div className="font-extrabold text-white">Promotional Banner Message</div>
                  <div className="text-slate-300">"Join HelpMate Gold Today for ₹999 & Save ₹150 Instantly + 2 Free AC Cleaning Services!"</div>
                </div>
              </div>

              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs cursor-pointer shadow-lux"
              >
                Configure Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OVER DRAWER 1: CREATE / EDIT MEMBERSHIP TIER (SLIDER) */}
      {isPlanDrawerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-sm flex justify-end">
            <div className="absolute inset-0" onClick={() => setIsPlanDrawerOpen(false)} />
            <div className="relative max-w-lg w-full h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 z-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 flex items-center gap-1 w-fit">
                      <Crown className="w-3 h-3 text-purple-600" />
                      <span>Slide-Over VIP Plan Editor</span>
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {editingPlan ? `Edit ${editingPlan.name}` : "Create New Membership Plan"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPlanDrawerOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form id="plan-drawer-form" onSubmit={handleSavePlanDrawer} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      required
                      value={planFormName}
                      onChange={(e) => setPlanFormName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Marketing Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={planFormTagline}
                      onChange={(e) => setPlanFormTagline(e.target.value)}
                      placeholder="e.g. Our most popular VIP plan with free AC servicing"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Offer Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={planFormPrice}
                        onChange={(e) => setPlanFormPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={planFormOrigPrice}
                        onChange={(e) => setPlanFormOrigPrice(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Flat Service Discount (%)
                      </label>
                      <input
                        type="number"
                        required
                        value={planFormDiscount}
                        onChange={(e) => setPlanFormDiscount(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Free Services Quota / yr
                      </label>
                      <input
                        type="number"
                        required
                        value={planFormFreeQuota}
                        onChange={(e) => setPlanFormFreeQuota(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Promotional Badge Text
                    </label>
                    <input
                      type="text"
                      value={planFormBadge}
                      onChange={(e) => setPlanFormBadge(e.target.value)}
                      placeholder="e.g. 🔥 Most Popular"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </form>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPlanDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>

                {/* SINGLE PRIMARY BUTTON IN DRAWER ACCORDING TO RULE */}
                <button
                  type="submit"
                  form="plan-drawer-form"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lux cursor-pointer"
                >
                  Save Membership Plan
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* SLIDE-OVER DRAWER 2: ADD FREE SERVICE OFFER */}
      {isFreeServiceDrawerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-sm flex justify-end">
            <div className="absolute inset-0" onClick={() => setIsFreeServiceDrawerOpen(false)} />
            <div className="relative max-w-lg w-full h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 z-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      Complimentary Free Service
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      Add Free Service Offer Rule
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFreeServiceDrawerOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form id="free-drawer-form" onSubmit={handleSaveFreeServiceDrawer} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AC Jet Cleaning Service"
                      value={freeTitle}
                      onChange={(e) => setFreeTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={freeCategory}
                      onChange={(e) => setFreeCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Retail Unit Value (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={freeValue}
                        onChange={(e) => setFreeValue(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Annual Quota per Member
                      </label>
                      <input
                        type="number"
                        required
                        value={freeQuota}
                        onChange={(e) => setFreeQuota(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFreeServiceDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>

                {/* SINGLE PRIMARY BUTTON IN DRAWER ACCORDING TO RULE */}
                <button
                  type="submit"
                  form="free-drawer-form"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lux cursor-pointer"
                >
                  Save Free Service Rule
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* SLIDE-OVER DRAWER 3: GRANT VIP MEMBERSHIP TO CLIENT */}
      {isGrantVIPDrawerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-sm flex justify-end">
            <div className="absolute inset-0" onClick={() => setIsGrantVIPDrawerOpen(false)} />
            <div className="relative max-w-lg w-full h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 z-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                      Client Loyalty Gift
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      Grant VIP Membership to Customer
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGrantVIPDrawerOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form id="grant-drawer-form" onSubmit={handleGrantVIPSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Customer Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={grantCustomerName}
                      onChange={(e) => setGrantCustomerName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Customer Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98765 12345"
                      value={grantCustomerPhone}
                      onChange={(e) => setGrantCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Select Membership Plan Tier
                    </label>
                    <select
                      value={grantPlanId}
                      onChange={(e) => setGrantPlanId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="plan-silver">HelpMate Silver Pass (10% OFF, 1 Free Service)</option>
                      <option value="plan-gold">HelpMate Gold Club (15% OFF, 3 Free Services)</option>
                      <option value="plan-crown-elite">Crown Elite VIP (20% OFF, 5 Free Services)</option>
                    </select>
                  </div>
                </form>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGrantVIPDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>

                {/* SINGLE PRIMARY BUTTON IN DRAWER ACCORDING TO RULE */}
                <button
                  type="submit"
                  form="grant-drawer-form"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lux cursor-pointer"
                >
                  Grant VIP Membership
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
