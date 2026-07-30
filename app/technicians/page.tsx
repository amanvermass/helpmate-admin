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
  Users,
  ShieldCheck,
  Wallet,
  TrendingUp,
  Activity,
  Award,
  Clock,
  ShieldAlert,
  User,
} from "lucide-react";
import { Portal } from "@/components/Portal";

export default function TechniciansPage() {
  const [techs, setTechs] = useState<Technician[]>(initialTechnicians);
  const [activeTab, setActiveTab] = useState<"fleet" | "commission">("fleet");
  const [proofTech, setProofTech] = useState<Technician | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);

  // Full Partner Onboarding Form States (Aadhaar, Guarantor, Police Thana)
  const [partnerName, setPartnerName] = useState("");
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerCategory, setPartnerCategory] = useState("AC Servicing & Repair");
  const [partnerLocality, setPartnerLocality] = useState("Sigra");
  const [partnerAadhaar, setPartnerAadhaar] = useState("");
  const [partnerAadhaarDoc, setPartnerAadhaarDoc] = useState("");
  const [partnerGuarantorName, setPartnerGuarantorName] = useState("");
  const [partnerGuarantorPhone, setPartnerGuarantorPhone] = useState("");
  const [partnerGuarantorAddress, setPartnerGuarantorAddress] = useState("");
  const [partnerGuarantorAadhaar, setPartnerGuarantorAadhaar] = useState("");
  const [partnerGuarantorAadhaarDoc, setPartnerGuarantorAadhaarDoc] = useState("");
  const [partnerPoliceStatus, setPartnerPoliceStatus] = useState<
    "Pending Verification" | "Verified Clean" | "Submitted to Local Thana" | "Exempted"
  >("Verified Clean");
  const [partnerPoliceStation, setPartnerPoliceStation] = useState("Sigra Police Station");
  const [partnerPoliceToken, setPartnerPoliceToken] = useState("");
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

  // Quick Fleet Metrics Calculations
  const totalFleet = techs.length;
  const activeFleet = techs.filter((t) => t.status === "Available" || t.status === "Approved").length;
  const onJobFleet = techs.filter((t) => t.status === "On Job").length;
  const verifiedKycCount = techs.filter((t) => t.aadhaarVerified && t.policeVerified).length;
  const totalPendingSettlements = techs.reduce((sum, t) => sum + (t.pendingPayout || 0), 0);
  const avgFleetRating = (techs.reduce((sum, t) => sum + (t.rating || 4.9), 0) / (totalFleet || 1)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Top Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit text-xs font-bold">
          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "fleet"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Varanasi Technician Fleet & KYC
          </button>
          <button
            onClick={() => setActiveTab("commission")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "commission"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
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

      {/* 4 Partner Fleet Executive Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Onboarded Fleet */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Fleet Partners
            </span>
            <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200 dark:border-brand-800 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalFleet} Technicians
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600 inline" /> Active service partners across Varanasi
          </p>
        </div>

        {/* Card 2: Active Duty & Availability */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Duty Status
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {activeFleet} Available
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500 inline" /> {onJobFleet} currently on active job dispatch
          </p>
        </div>

        {/* Card 3: Biometric Security Clearance */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Security KYC Cleared
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200 dark:border-purple-800 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {verifiedKycCount} / {totalFleet}
            </span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {Math.round((verifiedKycCount / (totalFleet || 1)) * 100)}% Cleared
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            Biometric Aadhaar & Local Police Thana verified
          </p>
        </div>

        {/* Card 4: Weekly Payout Pool & Rating */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Weekly Payout Pool
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800 shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{totalPendingSettlements.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 inline" /> {avgFleetRating}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            75% technician earnings awaiting payout
          </p>
        </div>
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

      {/* FULL PARTNER FLEET ONBOARDING & VERIFICATION DRAWER */}
      {isAddPartnerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex justify-end outline-none">
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200 dark:border-brand-800 shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Full Onboard Service Partner & Verification
                    </h3>
                    <p className="text-xs text-slate-500">
                      Personal Identity, Biometric Aadhaar, Guarantor & Police Thana Clearance
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!partnerName.trim() || !partnerPhone.trim()) return;

                  const newPartner: Technician = {
                    id: `TECH-${Math.floor(1000 + Math.random() * 9000)}`,
                    name: partnerName,
                    phone: partnerPhone,
                    role: "Senior AC & Home Service Specialist",
                    category: partnerCategory,
                    locality: partnerLocality,
                    pincode: "221002",
                    rating: 5.0,
                    totalJobs: 0,
                    totalEarnings: 0,
                    commissionPaid: 0,
                    pendingPayout: 0,
                    status: "Available",
                    aadhaarVerified: true,
                    policeVerified: partnerPoliceStatus === "Verified Clean",
                    bondedInsurance: true,
                    joiningDate: "Today",
                    lastPayoutDate: "N/A",
                    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
                  };

                  setTechs([newPartner, ...techs]);
                  setPartnerName("");
                  setPartnerPhone("");
                  setPartnerEmail("");
                  setPartnerAadhaar("");
                  setPartnerAadhaarDoc("");
                  setPartnerGuarantorName("");
                  setPartnerGuarantorPhone("");
                  setPartnerGuarantorAddress("");
                  setPartnerGuarantorAadhaar("");
                  setPartnerPoliceToken("");
                  setIsAddPartnerOpen(false);
                }}
                className="flex-1 p-6 overflow-y-auto space-y-6"
              >
                {/* SECTION 1: PARTNER PERSONAL DETAILS */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <User className="w-4 h-4 text-brand-600" />
                    <span>1. Partner Personal Information & Category</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        placeholder="e.g. Ramesh Chandra Yadav"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={partnerPhone}
                        onChange={(e) => setPartnerPhone(e.target.value)}
                        placeholder="+91 98390 12345"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        placeholder="e.g. ramesh.yadav@gmail.com"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Varanasi Locality Base Zone *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerLocality}
                        onChange={(e) => setPartnerLocality(e.target.value)}
                        placeholder="Sigra, Varanasi"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: BIOMETRIC AADHAAR IDENTITY */}
                <div className="p-5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-4">
                  <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-extrabold text-sm border-b border-blue-200 dark:border-blue-800 pb-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>2. Partner Aadhaar Biometric Verification & Document Upload</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Partner Aadhaar Number (12-Digit) *
                      </label>
                      <input
                        type="text"
                        maxLength={14}
                        value={partnerAadhaar}
                        onChange={(e) => setPartnerAadhaar(e.target.value)}
                        placeholder="7821-4920-1102"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Partner Aadhaar Card Upload Box */}
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Partner Aadhaar Card (Front & Back) Document Upload *
                    </label>
                    <div className="p-3.5 rounded-xl border border-dashed border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                          {partnerAadhaarDoc ? "Partner_Aadhaar_Doc.jpg Uploaded" : "Upload Partner Aadhaar (PDF/JPG)..."}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={partnerAadhaarDoc}
                        onChange={(e) => setPartnerAadhaarDoc(e.target.value)}
                        placeholder="Paste Partner Aadhaar Card Image URL..."
                        className="w-1/2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] bg-slate-50 dark:bg-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: GUARANTOR / REFERENCE PERSON */}
                <div className="p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-4">
                  <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-extrabold text-sm border-b border-purple-200 dark:border-purple-800 pb-2">
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <span>3. Guarantor / Reference Person (Taking Partner Guarantee)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Guarantor Full Name *
                      </label>
                      <input
                        type="text"
                        value={partnerGuarantorName}
                        onChange={(e) => setPartnerGuarantorName(e.target.value)}
                        placeholder="e.g. Suresh Chandra Yadav (Guarantor)"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Guarantor Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        value={partnerGuarantorPhone}
                        onChange={(e) => setPartnerGuarantorPhone(e.target.value)}
                        placeholder="+91 98390 88210"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Guarantor Aadhaar No. (12-Digit)
                      </label>
                      <input
                        type="text"
                        maxLength={14}
                        value={partnerGuarantorAadhaar}
                        onChange={(e) => setPartnerGuarantorAadhaar(e.target.value)}
                        placeholder="7821-4920-5592"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Guarantor Residence Address
                      </label>
                      <input
                        type="text"
                        value={partnerGuarantorAddress}
                        onChange={(e) => setPartnerGuarantorAddress(e.target.value)}
                        placeholder="Sigra Colony, Varanasi"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Guarantor Aadhaar Card Upload Box */}
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">
                      Guarantor Person Aadhaar Card Document Upload *
                    </label>
                    <div className="p-3.5 rounded-xl border border-dashed border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-purple-600" />
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                          {partnerGuarantorAadhaarDoc ? "Guarantor_Aadhaar_Doc.jpg Uploaded" : "Upload Guarantor Aadhaar (PDF/JPG)..."}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={partnerGuarantorAadhaarDoc}
                        onChange={(e) => setPartnerGuarantorAadhaarDoc(e.target.value)}
                        placeholder="Paste Guarantor Aadhaar Card Image URL..."
                        className="w-1/2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] bg-slate-50 dark:bg-slate-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: POLICE VERIFICATION & THANA CLEARANCE */}
                <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-4">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-sm border-b border-amber-200 dark:border-amber-800 pb-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>4. Police Verification & Local Thana PCC Clearance</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Police Verification Status
                      </label>
                      <select
                        value={partnerPoliceStatus}
                        onChange={(e) => setPartnerPoliceStatus(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500"
                      >
                        <option value="Verified Clean">Verified Clean (PCC Issued)</option>
                        <option value="Submitted to Local Thana">Submitted to Local Thana</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Exempted">Exempted</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Local Police Station (Thana)
                      </label>
                      <select
                        value={partnerPoliceStation}
                        onChange={(e) => setPartnerPoliceStation(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                      >
                        <option value="Sigra Police Station">Sigra Police Station</option>
                        <option value="Lanka Thana">Lanka Thana</option>
                        <option value="Bhelupur Thana">Bhelupur Thana</option>
                        <option value="Chetganj Thana">Chetganj Thana</option>
                        <option value="Cantt Police Station">Cantt Police Station</option>
                        <option value="Chowk Thana">Chowk Thana</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Police Token / PCC Ref No.
                      </label>
                      <input
                        type="text"
                        value={partnerPoliceToken}
                        onChange={(e) => setPartnerPoliceToken(e.target.value)}
                        placeholder="PCC-VAR-2026-8819"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddPartnerOpen(false)}
                    className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-extrabold text-xs shadow-lux flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Onboard Verified Partner</span>
                  </button>
                </div>
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
