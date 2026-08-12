"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { Portal } from "@/components/Portal";
import {
  initialTechnicians,
  Technician,
  initialSettlementRecords,
  SettlementRecord,
} from "@/lib/mockData";
import {
  DollarSign,
  CheckCircle2,
  Upload,
  FileCheck,
  ShieldCheck,
  CreditCard,
  Building,
  ArrowUpRight,
  Clock,
  Send,
  X,
  FileText,
  Check,
  ExternalLink,
  Plus,
} from "lucide-react";

export default function SettlementsPage() {
  const [techs, setTechs] = useState<Technician[]>(initialTechnicians);
  const [settlementLogs, setSettlementLogs] = useState<SettlementRecord[]>(
    initialSettlementRecords
  );
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  // Process Settlement Payout Modal State
  const [selectedTechForPayout, setSelectedTechForPayout] = useState<Technician | null>(null);
  const [payoutMethod, setPayoutMethod] = useState<
    "IMPS Bank Transfer" | "NEFT Direct" | "UPI Payout" | "RazorpayX Automated"
  >("IMPS Bank Transfer");
  const [utrNumberInput, setUtrNumberInput] = useState<string>("");
  const [settlementDateInput, setSettlementDateInput] = useState<string>("Today, 08:30 PM");
  const [proofUrlInput, setProofUrlInput] = useState<string>(
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80"
  );
  const [notesInput, setNotesInput] = useState<string>("Weekly settlement payout processed cleanly via HDFC Direct API");

  // Summary Metrics
  const totalPendingPayout = techs.reduce((sum, t) => sum + (t.pendingPayout || 0), 0);
  const totalDisbursed = settlementLogs.reduce((sum, s) => sum + (s.netPayoutAmount || 0), 0);
  const pendingTechsCount = techs.filter((t) => (t.pendingPayout || 0) > 0).length;

  const handleOpenPayoutModal = (tech: Technician) => {
    setSelectedTechForPayout(tech);
    setUtrNumberInput(`IMPS-VAR-2026-${Math.floor(10000000 + Math.random() * 90000000)}`);
  };

  const handleConfirmPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTechForPayout || !utrNumberInput.trim()) return;

    const payoutAmount = selectedTechForPayout.pendingPayout;
    const grossVal = Math.round(payoutAmount / 0.75);
    const commVal = Math.round(grossVal * 0.25);

    // 1. Create new settlement record
    const newRecord: SettlementRecord = {
      id: `SETTL-VAR-${Math.floor(950 + Math.random() * 50)}`,
      technicianId: selectedTechForPayout.id,
      technicianName: selectedTechForPayout.name,
      category: selectedTechForPayout.category,
      bankAccountName: selectedTechForPayout.bankAccountName || selectedTechForPayout.name,
      bankAccountNumber: selectedTechForPayout.bankAccountNumber || "9820-1049-8120",
      ifscCode: selectedTechForPayout.ifscCode || "SBIN0001240",
      upiId: selectedTechForPayout.upiId || `${selectedTechForPayout.name.toLowerCase().replace(/\s+/g, ".")}@okaxis`,
      grossAmount: grossVal,
      commissionDeducted: commVal,
      netPayoutAmount: payoutAmount,
      paymentMethod: payoutMethod,
      utrNumber: utrNumberInput.trim(),
      settlementDate: settlementDateInput || "Today",
      period: "Current Settlement Cycle",
      status: "Completed",
      proofUrl: proofUrlInput,
      notes: notesInput,
    };

    // 2. Update technician balance
    setTechs(
      techs.map((t) =>
        t.id === selectedTechForPayout.id
          ? {
              ...t,
              commissionPaid: t.commissionPaid + commVal,
              pendingPayout: 0,
              lastPayoutDate: "Just Now",
              payoutProofUrl: proofUrlInput,
            }
          : t
      )
    );

    setSettlementLogs([newRecord, ...settlementLogs]);
    setSelectedTechForPayout(null);
  };

  // PENDING PAYOUTS COLUMNS
  const pendingColumns: Column<Technician>[] = [
    {
      key: "name",
      header: "Fleet Specialist",
      accessor: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 shrink-0 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 dark:text-white">{row.name}</span>
            <span className="text-[10px] text-slate-400">{row.role} ({row.locality})</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    { key: "category", header: "Trade Category", sortable: true },
    {
      key: "totalEarnings",
      header: "Gross Revenue (100%)",
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">
          ₹{(row?.totalEarnings ?? 0).toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: "commissionPaid",
      header: "Helpmate Fee (25%)",
      accessor: (row) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          ₹{(row?.commissionPaid ?? 0).toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: "pendingPayout",
      header: "Net Payable (75%)",
      accessor: (row) => (
        <span className="font-black text-amber-600 dark:text-amber-400 text-sm">
          ₹{(row?.pendingPayout ?? 0).toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "Settlement Action",
      accessor: (row) => (
        <div>
          {(row?.pendingPayout ?? 0) > 0 ? (
            <button
              type="button"
              onClick={() => handleOpenPayoutModal(row)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-extrabold text-xs border border-amber-300 dark:border-amber-800 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-amber-600" /> Process Payout
            </button>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Settled
            </span>
          )}
        </div>
      ),
    },
  ];

  // COMPLETED SETTLEMENT HISTORY COLUMNS
  const historyColumns: Column<SettlementRecord>[] = [
    {
      key: "id",
      header: "Settlement ID",
      accessor: (row) => (
        <span className="font-mono font-extrabold text-brand-600 dark:text-brand-400">
          {row?.id}
        </span>
      ),
      sortable: true,
    },
    {
      key: "technicianName",
      header: "Partner & Category",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 dark:text-white">{row?.technicianName}</span>
          <span className="text-[10px] text-slate-400">{row?.category}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "paymentMethod",
      header: "Transfer Method & UTR",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 dark:text-slate-200">{row?.paymentMethod}</span>
          <span className="font-mono text-[10px] text-brand-600 dark:text-brand-400 font-extrabold">
            {row?.utrNumber}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "netPayoutAmount",
      header: "Net Amount Paid",
      accessor: (row) => (
        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
          ₹{(row?.netPayoutAmount ?? 0).toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    { key: "settlementDate", header: "Date Settled", sortable: true },
    {
      key: "proofUrl",
      header: "UTR Receipt",
      accessor: (row) => (
        <div>
          {row.proofUrl ? (
            <a
              href={row.proofUrl}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold text-[11px] hover:underline flex items-center gap-1 w-fit border border-slate-200 dark:border-slate-700"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> View UTR Proof
            </a>
          ) : (
            <span className="text-slate-400 text-[10px] italic">No receipt</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Simple Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-brand-600" />
            <span>Settlement Reconciliation & Payouts</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Weekly bank transfer reconciliation, 75% technician earnings disbursement, and UTR payout receipt storage.
          </p>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Payout Balance</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
            ₹{totalPendingPayout.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Settled Disbursed</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{totalDisbursed.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Partners Awaiting Payout</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200 dark:border-purple-800 shadow-xs">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {pendingTechsCount} Partners
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Settlement Reliability</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 border border-blue-200 dark:border-blue-800 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">100% Verified</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit text-xs font-bold shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "pending"
              ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Pending Payouts ({pendingTechsCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "history"
              ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Completed Settlement Ledger ({settlementLogs.length})
        </button>
      </div>

      {/* Data Table */}
      {activeTab === "pending" ? (
        <DataTable
          columns={pendingColumns}
          data={techs}
          searchPlaceholder="Search technician partner..."
        />
      ) : (
        <DataTable
          columns={historyColumns}
          data={settlementLogs}
          searchPlaceholder="Search settlement ID or UTR number..."
        />
      )}

      {/* PROCESS PAYOUT POPUP MODAL */}
      {selectedTechForPayout && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form
              onSubmit={handleConfirmPayout}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-5 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none text-xs animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedTechForPayout.avatar}
                    alt={selectedTechForPayout.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Process Payout: {selectedTechForPayout.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedTechForPayout.role} • {selectedTechForPayout.locality}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTechForPayout(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Earnings Breakdown Box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                  <span>Gross Job Volume (100%)</span>
                  <span>₹{(Math.round(selectedTechForPayout.pendingPayout / 0.75)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Helpmate Platform Share (25%)</span>
                  <span>-₹{(Math.round((selectedTechForPayout.pendingPayout / 0.75) * 0.25)).toLocaleString()}</span>
                </div>
                <div className="border-t border-amber-200 dark:border-amber-800 pt-2 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                  <span>Net Payable Amount (75%)</span>
                  <span className="text-amber-600 dark:text-amber-400 text-base">
                    ₹{selectedTechForPayout.pendingPayout.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Partner Bank Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                  Verified Bank Account Details
                </span>
                <div className="grid grid-cols-2 gap-2 font-semibold text-slate-800 dark:text-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Account Holder</span>
                    <span>{selectedTechForPayout.bankAccountName || selectedTechForPayout.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Account Number</span>
                    <span className="font-mono">{selectedTechForPayout.bankAccountNumber || "9820-1049-8120"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">IFSC Code</span>
                    <span className="font-mono">{selectedTechForPayout.ifscCode || "SBIN0001240"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">UPI ID</span>
                    <span className="font-mono text-brand-600 dark:text-brand-400">
                      {selectedTechForPayout.upiId || `${selectedTechForPayout.name.toLowerCase().replace(/\s+/g, ".")}@okaxis`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    Transfer Method *
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold outline-none focus:border-brand-500"
                  >
                    <option value="IMPS Bank Transfer">IMPS Bank Transfer (Instant)</option>
                    <option value="NEFT Direct">NEFT Direct Payout</option>
                    <option value="UPI Payout">UPI Payout</option>
                    <option value="RazorpayX Automated">RazorpayX Automated Payout API</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    Bank UTR / Transaction Reference Number *
                  </label>
                  <input
                    type="text"
                    value={utrNumberInput}
                    onChange={(e) => setUtrNumberInput(e.target.value)}
                    placeholder="e.g. IMPS-VAR-2026-98124018"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-extrabold outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    Settlement Receipt Image URL / Document Link
                  </label>
                  <input
                    type="text"
                    value={proofUrlInput}
                    onChange={(e) => setProofUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    Finance Audit Notes / Remarks
                  </label>
                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Remarks..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTechForPayout(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-extrabold shadow-lux cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Confirm & Submit Payout
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
