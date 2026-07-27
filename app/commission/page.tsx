"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialTechnicians, Technician } from "@/lib/mockData";
import { DollarSign, Upload, FileCheck, CheckCircle2 } from "lucide-react";

export default function CommissionPage() {
  const [techs, setTechs] = useState<Technician[]>(initialTechnicians);
  const [activeTab, setActiveTab] = useState<"ledger" | "weekly" | "monthly" | "payouts">("ledger");

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
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Fixed 25% Commission & Settlement Ledger</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Weekly bank transfer reconciliation and UTR payout proof storage</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(["ledger", "weekly", "monthly", "payouts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
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
