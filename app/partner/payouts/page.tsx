"use client";

import { DataTable, Column } from "@/components/DataTable";
import { DollarSign, CheckCircle2, CreditCard, ArrowUpRight } from "lucide-react";

interface PayoutRecord {
  id: string;
  payoutDate: string;
  completedJobsCount: number;
  grossAmount: number;
  commissionCut: number;
  netPayoutAmount: number;
  bankAccount: string;
  status: "Settled" | "Processing";
}

export default function PartnerPayoutsPage() {
  const payouts: PayoutRecord[] = [
    {
      id: "PO-VAR-901",
      payoutDate: "27 Jul 2026 (Weekly Settlement)",
      completedJobsCount: 18,
      grossAmount: 16400,
      commissionCut: 4100,
      netPayoutAmount: 12300,
      bankAccount: "HDFC Bank (•••• 4910)",
      status: "Settled",
    },
    {
      id: "PO-VAR-844",
      payoutDate: "20 Jul 2026 (Weekly Settlement)",
      completedJobsCount: 16,
      grossAmount: 14200,
      commissionCut: 3550,
      netPayoutAmount: 10650,
      bankAccount: "HDFC Bank (•••• 4910)",
      status: "Settled",
    },
    {
      id: "PO-VAR-788",
      payoutDate: "13 Jul 2026 (Weekly Settlement)",
      completedJobsCount: 20,
      grossAmount: 18800,
      commissionCut: 4700,
      netPayoutAmount: 14100,
      bankAccount: "HDFC Bank (•••• 4910)",
      status: "Settled",
    },
  ];

  const columns: Column<PayoutRecord>[] = [
    {
      key: "id",
      header: "Payout ID",
      accessor: (row) => <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{row.id}</span>,
      sortable: true,
    },
    { key: "payoutDate", header: "Settlement Cycle", sortable: true },
    { key: "completedJobsCount", header: "Jobs Completed", sortable: true },
    {
      key: "grossAmount",
      header: "Gross Collection (₹)",
      accessor: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">₹{row.grossAmount}</span>,
      sortable: true,
    },
    {
      key: "commissionCut",
      header: "Platform Cut (25%)",
      accessor: (row) => <span className="text-xs text-red-500 font-bold">-₹{row.commissionCut}</span>,
      sortable: true,
    },
    {
      key: "netPayoutAmount",
      header: "Net Credited (₹)",
      accessor: (row) => (
        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
          ₹{row.netPayoutAmount} <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      ),
      sortable: true,
    },
    { key: "bankAccount", header: "Bank Account" },
    {
      key: "status",
      header: "Payout Status",
      accessor: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 w-fit">
          <CheckCircle2 className="w-3.5 h-3.5" /> {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-emerald-600 text-white shadow-lux space-y-1">
          <span className="text-xs font-semibold text-emerald-100">Wallet Ready For Payout</span>
          <h3 className="text-3xl font-black">₹6,450</h3>
          <span className="text-[10px] text-emerald-100 block">Next Payout: Monday, 03 Aug 2026</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Lifetime Payouts</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">₹1,84,200</h3>
          <span className="text-[10px] text-slate-400 block font-semibold">148 Jobs Total</span>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-brand-600">Registered Bank</span>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">HDFC Bank Ltd</h3>
          <span className="text-[10px] text-slate-400 font-mono block">A/C: ••••••••••4910 (IFSC: HDFC0001820)</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payouts}
      />
    </div>
  );
}
