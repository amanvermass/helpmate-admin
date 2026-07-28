"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialTechnicians, Technician } from "@/lib/mockData";
import {
  Star,
  CheckCircle2,
  MapPin,
  Upload,
  FileCheck,
  X,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Portal } from "@/components/Portal";

export default function TechniciansPage() {
  const [techs, setTechs] = useState<Technician[]>(initialTechnicians);
  const [activeTab, setActiveTab] = useState<"fleet" | "commission">("fleet");
  const [proofTech, setProofTech] = useState<Technician | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [viewTech, setViewTech] = useState<Technician | null>(null);
  const [editTech, setEditTech] = useState<Technician | null>(null);
  const [deleteTech, setDeleteTech] = useState<Technician | null>(null);

  const handleUploadProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTech) return;

    const updated = techs.map((t) => {
      if (t.id === proofTech.id) {
        return {
          ...t,
          payoutProofUrl: proofUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80",
          pendingPayout: 0,
          lastPayoutDate: "Just Now",
        };
      }
      return t;
    });
    setTechs(updated);
    alert(`Uploaded weekly payout receipt for ${proofTech.name}. Payout status updated to Settled.`);
    setProofTech(null);
  };

  const fleetColumns: Column<Technician>[] = [
    {
      key: "name",
      header: "Partner & Role",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
          />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900">{row.name}</span>
            <span className="text-[10px] text-slate-400">{row.role}</span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category & Zone",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-brand-600 text-xs">
            {row.category}
          </span>
          <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
            <MapPin className="w-3 h-3 text-slate-400" /> {row.locality} ({row.pincode})
          </span>
        </div>
      ),
    },
    {
      key: "kyc",
      header: "Biometric KYC Check",
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
              row.aadhaarVerified ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            Aadhaar: {row.aadhaarVerified ? "Pass" : "Fail"}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
              row.policeVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            Police Clearance: {row.policeVerified ? "Pass" : "Pending"}
          </span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating & Jobs",
      accessor: (row) => (
        <span className="font-bold text-emerald-700 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-emerald-600" /> {row.rating} ({row.totalJobs} jobs)
        </span>
      ),
    },
    {
      key: "status",
      header: "Approval Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
            row.status === "Approved"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          <CheckCircle2 className="w-3 h-3" /> {row.status}
        </span>
      ),
    },
    {
      key: "id",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setViewTech(row)}
            title="View Partner Profile"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 hover:text-brand-600 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEditTech(row)}
            title="Edit Partner Details"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 hover:text-brand-600 transition-all"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTech(row)}
            title="Delete Partner"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const commissionColumns: Column<Technician>[] = [
    {
      key: "name",
      header: "Partner Name",
      accessor: (row) => <span className="font-bold text-slate-900">{row.name}</span>,
    },
    {
      key: "totalEarnings",
      header: "Gross Service Revenue (₹)",
      accessor: (row) => (
        <span className="font-extrabold text-slate-900">
          ₹{row.totalEarnings.toLocaleString()}
        </span>
      ),
    },
    {
      key: "commissionPaid",
      header: "HelpMate Comm. (25%)",
      accessor: (row) => (
        <span className="font-bold text-emerald-600">
          ₹{row.commissionPaid.toLocaleString()}
        </span>
      ),
    },
    {
      key: "pendingPayout",
      header: "Pending Weekly Payout",
      accessor: (row) => (
        <span className="font-bold text-amber-600">
          ₹{row.pendingPayout.toLocaleString()}
        </span>
      ),
    },
    {
      key: "payoutProofUrl",
      header: "Payment Receipt",
      accessor: (row) => (
        <div>
          {row.payoutProofUrl ? (
            <a
              href={row.payoutProofUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> View Receipt
            </a>
          ) : (
            <button
              onClick={() => setProofTech(row)}
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
      {/* Top Header Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-fit text-xs font-bold">
          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "fleet"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Varanasi Technician Fleet & KYC
          </button>
          <button
            onClick={() => setActiveTab("commission")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "commission"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            25% Commission & Weekly Settlement Ledger
          </button>
        </div>

        <button
          onClick={() => setIsAddPartnerOpen(true)}
          className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Onboard Partner</span>
        </button>
      </div>

      {activeTab === "fleet" ? (
        <DataTable
          title="Technician Fleet & Biometric KYC Directory"
          description="Aadhaar verified and Varanasi Police cleared service partner directory."
          columns={fleetColumns}
          data={techs}
          searchPlaceholder="Search partner name, locality, or phone..."
        />
      ) : (
        <DataTable
          title="25% Fixed Platform Commission & Payout Reconciliation"
          description="Weekly settlement breakdown (75% partner earnings, 25% HelpMate commission)."
          columns={commissionColumns}
          data={techs}
          searchPlaceholder="Search partner name..."
        />
      )}

      {/* WEEKLY PAYOUT PROOF UPLOADER DRAWER */}
      {proofTech && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex justify-end outline-none">
            <form
              onSubmit={handleUploadProof}
              className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full p-6 space-y-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Upload Weekly Payout Proof
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Partner: {proofTech.name}</p>
                </div>
                <button type="button" onClick={() => setProofTech(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs space-y-1 border border-emerald-200 dark:border-emerald-800">
                <div>Pending Payout: <strong>₹{proofTech.pendingPayout.toLocaleString()}</strong></div>
                <div>Net Payable (75% of Gross Revenue after 25% HelpMate Commission)</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Bank UTR / Transaction Reference Receipt URL
                </label>
                <input
                  type="text"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://.../utr_receipt_881.jpg"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Confirm Weekly Settlement & Save Proof</span>
              </button>
            </form>
          </div>
        </Portal>
      )}

      {/* MANUAL PARTNER ONBOARDING DRAWER */}
      {isAddPartnerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex justify-end outline-none">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Manual Partner Onboarding & KYC
                </h3>
                <p className="text-xs text-slate-500">Register new technician to Varanasi fleet</p>
              </div>
              <button type="button" onClick={() => setIsAddPartnerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Partner successfully onboarded with Aadhaar & Police verification status.");
                setIsAddPartnerOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Partner Full Name</label>
                <input type="text" required placeholder="e.g. Ramesh Chandra Yadav" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mobile Phone</label>
                <input type="text" required placeholder="+91 98390 12345" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900" />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Varanasi Locality Base</label>
                <input type="text" required placeholder="Sigra, Varanasi (221002)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900" />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-1 bg-slate-50">
                <Upload className="w-6 h-6 text-brand-600 mx-auto" />
                <span className="font-bold text-slate-900 block">Upload Aadhaar & Police Document</span>
                <span className="text-[10px] text-slate-400">Supports PDF or Image files</span>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-brand-500 text-white font-bold shadow-lux">
                Save & Submit for Approval
              </button>
            </form>
          </div>
        </div>
        </Portal>
      )}

      {/* View Tech Profile Modal */}
      {viewTech && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <img src={viewTech.avatar} alt={viewTech.name} className="w-12 h-12 rounded-2xl object-cover border" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{viewTech.name}</h3>
                    <p className="text-xs text-brand-600 font-semibold">{viewTech.role} • {viewTech.category}</p>
                  </div>
                </div>
                <button type="button" onClick={() => setViewTech(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Locality & Phone</span>
                  <div className="font-bold text-slate-900 dark:text-white">{viewTech.phone}</div>
                  <div className="text-slate-500">{viewTech.locality} ({viewTech.pincode})</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                    <span className="text-[10px] uppercase font-bold text-slate-400">KYC Status</span>
                    <div className="font-extrabold text-emerald-600 text-xs mt-0.5">Aadhaar Verified</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Rating & Jobs</span>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs mt-0.5">★ {viewTech.rating} ({viewTech.totalJobs} jobs)</div>
                  </div>
                </div>
              </div>

              <button type="button" onClick={() => setViewTech(null)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">Close</button>
            </div>
          </div>
        </Portal>
      )}

      {/* Edit Tech Drawer */}
      {editTech && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setEditTech(null)} />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTechs(techs.map((t) => (t.id === editTech.id ? editTech : t)));
                setEditTech(null);
              }}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Edit Partner Profile</h3>
                <button type="button" onClick={() => setEditTech(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Partner Full Name</label>
                  <input
                    type="text"
                    value={editTech.name}
                    onChange={(e) => setEditTech({ ...editTech, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editTech.phone}
                    onChange={(e) => setEditTech({ ...editTech, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={editTech.category}
                    onChange={(e) => setEditTech({ ...editTech, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditTech(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl font-bold text-xs shadow-lux">Save Partner</button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* Delete Tech Modal */}
      {deleteTech && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Delete Fleet Partner</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to delete partner <strong>{deleteTech.name}</strong> ({deleteTech.phone})?
              </p>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setDeleteTech(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    setTechs(techs.filter((t) => t.id !== deleteTech.id));
                    setDeleteTech(null);
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-lux"
                >
                  Delete Partner
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
