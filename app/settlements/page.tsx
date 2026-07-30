"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialTechnicians, Technician } from "@/lib/mockData";
import { DollarSign, CheckCircle2, Upload, FileCheck, ShieldCheck } from "lucide-react";

export default function SettlementsPage() {
  const [techs, setTechs] = useState<Technician[]>(initialTechnicians);

  const columns: Column<Technician>[] = [
    {
      key: "name",
      header: "Partner Name & Role",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.name}</span>
          <span className="text-[10px] text-slate-400">{row.role} ({row.locality})</span>
        </div>
      ),
    },
    {
      key: "totalEarnings",
      header: "Gross Revenue (₹)",
      accessor: (row) => (
        <span className="font-extrabold text-slate-900">₹{row.totalEarnings.toLocaleString()}</span>
      ),
    },
    {
      key: "commissionPaid",
      header: "HelpMate 25% Share",
      accessor: (row) => (
        <span className="font-bold text-emerald-600">₹{row.commissionPaid.toLocaleString()}</span>
      ),
    },
    {
      key: "pendingPayout",
      header: "Net Payable (75%)",
      accessor: (row) => (
        <span className="font-bold text-amber-600">₹{row.pendingPayout.toLocaleString()}</span>
      ),
    },
    {
      key: "payoutProofUrl",
      header: "Settlement Proof",
      accessor: (row) => (
        <div>
          {row.payoutProofUrl ? (
            <a
              href={row.payoutProofUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> View UTR Receipt
            </a>
          ) : (
            <button
              type="button"
              onClick={() => alert(`Upload Bank UTR Receipt for ${row.name}`)}
              className="text-[10px] font-bold px-2 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
            >
              + Upload Proof
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" /> Settlement Reconciliation Engine
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Commission & Weekly Settlement Ledger</h1>
          <p className="text-xs text-brand-100 mt-1 max-w-xl">
            Fixed 25% HelpMate platform commission engine, per-order revenue breakdown, and weekly partner payout reconciliation.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-center min-w-[110px]">
            <span className="text-xs text-brand-200 block font-semibold">Comm Rate</span>
            <span className="text-lg font-black text-white">25% Fixed</span>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={techs}
        searchPlaceholder="Search technician partner..."
      />
    </div>
  );
}
