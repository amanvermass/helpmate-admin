"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialTechnicians, Technician } from "@/lib/mockData";
import { DollarSign, Upload, FileCheck, CheckCircle2, Wallet, TrendingUp, ShieldCheck, CreditCard } from "lucide-react";

export default function CommissionPage() {
  const [techs, setTechs] = useState<Technician[]>(initialTechnicians);
  const [activeTab, setActiveTab] = useState<"ledger" | "weekly" | "monthly" | "payouts">("ledger");

  const totalEarnings = techs.reduce((sum, t) => sum + (t.totalEarnings || 0), 0);
  const totalCommission = techs.reduce((sum, t) => sum + (t.commissionPaid || 0), 0);
  const totalPending = techs.reduce((sum, t) => sum + (t.pendingPayout || 0), 0);

  const columns: Column<Technician>[] = [
    { key: "name", header: "Partner Name", sortable: true },
    { key: "category", header: "Trade Category", sortable: true },
    {
      key: "totalEarnings",
      header: "Gross Earnings",
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">₹{row.totalEarnings.toLocaleString("en-IN")}</span>,
      sortable: true,
    },
    {
      key: "commissionPaid",
      header: "Helpmate 25% Fee",
      accessor: (row) => <span className="font-bold text-emerald-600">₹{row.commissionPaid.toLocaleString("en-IN")}</span>,
      sortable: true,
    },
    {
      key: "pendingPayout",
      header: "Net Pending Payout",
      accessor: (row) => <span className="font-bold text-purple-600">₹{row.pendingPayout.toLocaleString("en-IN")}</span>,
      sortable: true,
    },
    { key: "lastPayoutDate", header: "Last Settlement", sortable: true },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" /> Commission & Revenue Engine
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Fixed 25% Commission & Settlement Ledger</h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            Weekly bank transfer reconciliation, 75% technician earnings disbursement, and UTR payout receipt storage.
          </p>
        </div>
      </div>

      {/* 4 Quick Executive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Gross Partner Revenue</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">₹{totalEarnings.toLocaleString("en-IN")}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Helpmate 25% Fee</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-brand-600">₹{totalCommission.toLocaleString("en-IN")}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Weekly Payouts</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600">₹{totalPending.toLocaleString("en-IN")}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Settlement Rate</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">100% Verified</span>
        </div>
      </div>

      {/* Navigation Tabs (Positioned at bottom of Quick Cards) */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit text-xs font-bold shadow-xs">
        {(["ledger", "weekly", "monthly", "payouts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl capitalize transition-all ${
              activeTab === tab
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Partner Earnings & Commission Summary"
        description="Fixed 25% platform deduction and net weekly technician disbursements"
        columns={columns}
        data={techs}
      />
    </div>
  );
}
