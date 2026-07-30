"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialCoupons, CouponItem } from "@/lib/mockData";
import { Tag, Plus, CheckCircle2, Percent, CreditCard, Building2, Gift, Sparkles } from "lucide-react";
import { Portal } from "@/components/Portal";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"Fixed" | "Percentage" | "Bank Offer" | "First Booking">("Fixed");
  const [discountValue, setDiscountValue] = useState("150");
  const [minOrderValue, setMinOrderValue] = useState("499");
  const [maxDiscountCap, setMaxDiscountCap] = useState("300");
  const [bankName, setBankName] = useState("HDFC Bank");
  const [description, setDescription] = useState("");

  const columns: Column<CouponItem>[] = [
    {
      key: "code",
      header: "Coupon Code",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-brand-600 dark:text-brand-400 font-mono text-xs flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {row.code}
          </span>
          {row.bankName && <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">● {row.bankName}</span>}
        </div>
      ),
      sortable: true,
    },
    {
      key: "discountType",
      header: "Offer Type",
      accessor: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            row.discountType === "Bank Offer"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200"
              : row.discountType === "First Booking"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200"
              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200"
          }`}
        >
          {row.discountType}
        </span>
      ),
      sortable: true,
    },
    {
      key: "discountValue",
      header: "Discount Value",
      accessor: (row) => (
        <span className="font-black text-slate-900 dark:text-white">
          {row.discountType === "Percentage" ? `${row.discountValue}% OFF` : `₹${row.discountValue} OFF`}
        </span>
      ),
      sortable: true,
    },
    {
      key: "description",
      header: "Offer Details",
      accessor: (row) => (
        <span className="text-xs text-slate-500 truncate max-w-[200px] block">
          {row.description || `Min Order ₹${row.minOrderValue}`}
        </span>
      ),
    },
    {
      key: "minOrderValue",
      header: "Min Order",
      accessor: (row) => <span className="font-semibold">₹{row.minOrderValue}</span>,
      sortable: true,
    },
    { key: "usageCount", header: "Redemptions", sortable: true },
    { key: "expiryDate", header: "Expiry Date", sortable: true },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "Active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => alert(`Editing offer code ${row.code}`)}
            title="Edit Offer Code"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all"
          >
            <Tag className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newItem: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: code.toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue) || 100,
      minOrderValue: parseFloat(minOrderValue) || 499,
      maxDiscountCap: discountType === "Percentage" || discountType === "Bank Offer" ? parseFloat(maxDiscountCap) : undefined,
      bankName: discountType === "Bank Offer" ? bankName : undefined,
      description: description || `${discountType} coupon code ${code.toUpperCase()}`,
      usageCount: 0,
      expiryDate: "31 Dec 2026",
      status: "Active",
    };

    setCoupons([newItem, ...coupons]);
    setCode("");
    setDescription("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner matching Billing layout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Gift className="w-4 h-4" /> Marketing & Promotions Engine
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Discount & Bank Offers Engine</h1>
          <p className="text-xs text-brand-100 mt-1 max-w-xl">
            Active customer discount codes, cash discounts, credit card bank offers, and promo campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-brand-900 font-extrabold text-xs shadow-md hover:bg-brand-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Create New Offer Code</span>
          </button>
        </div>
      </div>

      {/* Main DataTable without duplicate headers */}
      <DataTable
        columns={columns}
        data={coupons}
      />

      {/* Add Coupon Slide-Over Drawer */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddOpen(false)} />
            <form
              onSubmit={handleAddCoupon}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Gift className="w-5 h-5 text-brand-600" />
                  <span>Create Discount or Bank Offer</span>
                </h3>
                <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. HDFC150 / FLAT100"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Offer Category Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Fixed">Flat Cash Discount (Fixed ₹ Off)</option>
                    <option value="Bank Offer">Credit Card / Bank Offer (HDFC, ICICI, Axis)</option>
                    <option value="Percentage">Percentage Discount (% Off)</option>
                    <option value="First Booking">First Booking Special (New Customer)</option>
                  </select>
                </div>

                {discountType === "Bank Offer" && (
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Partner Bank Name</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="HDFC Bank">HDFC Bank Credit & Debit Cards</option>
                      <option value="ICICI Bank">ICICI Bank Cards & NetBanking</option>
                      <option value="Axis Bank">Axis Bank Credit Cards</option>
                      <option value="SBI Card">SBI Credit Cards</option>
                      <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Discount Value ({discountType === "Percentage" ? "%" : "₹"})
                    </label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      value={minOrderValue}
                      onChange={(e) => setMinOrderValue(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Offer Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. 10% Instant Discount on HDFC Credit Cards"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux">Publish Offer</button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}

