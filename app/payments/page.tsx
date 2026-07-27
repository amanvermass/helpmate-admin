"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialTransactions, TransactionItem } from "@/lib/mockData";
import { CreditCard, ArrowUpRight, RefreshCw, CheckCircle2 } from "lucide-react";

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<"transactions" | "online" | "cash" | "refunds">("transactions");

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
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Payments & Refunds Gateway</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track online UPI/Card transactions, cash-on-service collection, and instant customer refunds</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(["transactions", "online", "cash", "refunds"] as const).map((tab) => (
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
        title="Transaction Ledger"
        description="Comprehensive audit trail of customer payments and gateway responses"
        columns={columns}
        data={transactions}
      />
    </div>
  );
}
