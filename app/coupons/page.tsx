"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialCoupons, CouponItem } from "@/lib/mockData";
import { Tag, Plus, CheckCircle2, Percent } from "lucide-react";
import { Portal } from "@/components/Portal";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("100");

  const columns: Column<CouponItem>[] = [
    {
      key: "code",
      header: "Coupon Code",
      accessor: (row) => <span className="font-extrabold text-brand-600 dark:text-brand-400 font-mono text-xs">{row.code}</span>,
      sortable: true,
    },
    { key: "discountType", header: "Type", sortable: true },
    {
      key: "discountValue",
      header: "Discount Value",
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">
          {row.discountType === "Percentage" ? `${row.discountValue}% OFF` : `₹${row.discountValue} OFF`}
        </span>
      ),
      sortable: true,
    },
    {
      key: "minOrderValue",
      header: "Min Order",
      accessor: (row) => <span>₹{row.minOrderValue}</span>,
      sortable: true,
    },
    { key: "usageCount", header: "Total Redemptions", sortable: true },
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
  ];

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newItem: CouponItem = {
      id: `cpn-${Date.now()}`,
      code: code.toUpperCase(),
      discountType: "Fixed",
      discountValue: parseFloat(discountValue) || 100,
      minOrderValue: 499,
      usageCount: 0,
      expiryDate: "2026-12-31",
      status: "Active",
    };

    setCoupons([newItem, ...coupons]);
    setCode("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Discount & Promotional Coupons</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage promo codes, usage caps, and Varanasi seasonal offers</p>
          </div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Coupon Campaign Directory"
        description="Active customer discount codes and redemption limits"
        columns={columns}
        data={coupons}
        addButtonLabel="Create New Coupon Code"
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* Add Modal */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form onSubmit={handleAddCoupon} className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Create Promo Coupon</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. VARANASI150"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-brand-500 text-white rounded-xl font-bold text-xs">Publish Coupon</button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
