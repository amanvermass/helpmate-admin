"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialTransactions, TransactionItem } from "@/lib/mockData";
import { CreditCard, ArrowUpRight, RefreshCw, CheckCircle2, Wallet, TrendingUp, ShieldCheck } from "lucide-react";

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<"transactions" | "online" | "cash" | "refunds">("transactions");

  const totalVolume = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const successCount = transactions.filter((t) => t.status === "Success").length;

  const columns: Column<TransactionItem>[] = [
    { key: "id", header: "Transaction ID", sortable: true },
    { key: "bookingId", header: "Booking Reference", sortable: true },
    { key: "customerName", header: "Customer", sortable: true },
    {
      key: "amount",
      header: "Amount Paid",
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">₹{row.amount.toLocaleString("en-IN")}</span>,
      sortable: true,
    },
    {
      key: "paymentMethod",
      header: "Method",
      accessor: (row) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
          {row.paymentMethod}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Payment Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "Success"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : row.status === "Refunded"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    { key: "date", header: "Timestamp", sortable: true },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" /> Payment Gateway & Receipts
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Payments & Refunds Gateway</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Track online UPI/Card transactions, cash-on-service collection, and instant customer refunds.
          </p>
        </div>
      </div>

      {/* 4 Quick Executive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Payments Volume</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">₹{(totalVolume + 142800).toLocaleString("en-IN")}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Online UPI & Cards</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-blue-600">82% Prepaid</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Successful Payments</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600">{successCount} / {transactions.length} Passed</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Refunds Processed</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">₹4,250 Refunded</span>
        </div>
      </div>

      {/* Navigation Tabs (Positioned at bottom of Quick Cards) */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit text-xs font-bold shadow-xs">
        {(["transactions", "online", "cash", "refunds"] as const).map((tab) => (
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
        title="Payment & Settlement Transactions"
        description="Real-time transaction log across UPI, NetBanking, and cash collections"
        columns={columns}
        data={transactions}
      />
    </div>
  );
}
