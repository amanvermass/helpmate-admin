"useClient";
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { initialTechnicians, Technician } from "@/lib/mockData";
import {
  Star,
  CheckCircle2,
  MapPin,
  FileCheck,
  ArrowLeft,
  Edit,
  User,
  ShieldCheck,
  ShieldAlert,
  CalendarCheck,
  Wallet,
  Clock,
  TrendingUp,
  Award,
  Phone,
  Mail,
  Building,
  Upload,
} from "lucide-react";

export default function TechnicianDetailPage() {
  const params = useParams();
  const router = useRouter();
  const techId = params?.id as string;

  // Find technician by ID or fallback to first
  const tech: Technician =
    initialTechnicians.find((t) => t.id === techId) || initialTechnicians[0];

  const [activeTab, setActiveTab] = useState<"overview" | "kyc" | "jobs" | "earnings">("overview");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Back Bar Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          href="/technicians"
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Partner Fleet Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-mono font-bold border border-brand-200 dark:border-brand-800">
            ID: {tech.id}
          </span>
        </div>
      </div>

      {/* Partner Executive Header Banner Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <img
            src={tech.avatar}
            alt={tech.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-500 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {tech.name}
              </h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${
                  tech.status === "Available" || tech.status === "Approved"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                }`}
              >
                ● {tech.status}
              </span>
            </div>

            <p className="text-xs text-brand-600 dark:text-brand-400 font-extrabold mt-1">
              {tech.role} • {tech.category}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {tech.locality} ({tech.pincode})
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {tech.phone}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Member since {tech.joiningDate || "Jan 2025"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 text-center shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Rating</span>
            <span className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 inline" /> {tech.rating}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Jobs</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {tech.totalJobs}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Revenue</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{tech.totalEarnings.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Tabbed Navigation bar */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === "overview"
              ? "bg-brand-500 text-white shadow-lux"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Overview & Biometric KYC
        </button>
        <button
          onClick={() => setActiveTab("kyc")}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === "kyc"
              ? "bg-brand-500 text-white shadow-lux"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Identity & Guarantor Documents
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === "jobs"
              ? "bg-brand-500 text-white shadow-lux"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Completed Job Dispatches ({tech.totalJobs})
        </button>
        <button
          onClick={() => setActiveTab("earnings")}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === "earnings"
              ? "bg-brand-500 text-white shadow-lux"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          Earnings & Weekly Settlement Ledger
        </button>
      </div>

      {/* TAB 1: OVERVIEW & BIOMETRIC KYC */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Partner Personal Details Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-slate-900 dark:text-white font-extrabold text-sm">
              <User className="w-4 h-4 text-brand-600" />
              <span>1. Partner Information & Category</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-bold">Full Name</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{tech.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-bold">Mobile Phone</span>
                <span className="font-bold text-slate-900 dark:text-white">{tech.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-bold">Varanasi Base Locality</span>
                <span className="font-semibold text-slate-900 dark:text-white">{tech.locality} ({tech.pincode})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-bold">Service Category</span>
                <span className="font-extrabold text-brand-600">{tech.category}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400 font-bold">Partner Aadhaar No.</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">7821-4920-1102</span>
              </div>
            </div>
          </div>

          {/* Security & Police Thana Verification Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-amber-900 dark:text-amber-300 font-extrabold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>2. Police Verification & Safety Compliance</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-bold">Police Clearance (PCC)</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[11px] font-extrabold border border-emerald-200 dark:border-emerald-800">
                  {tech.policeVerified ? "Verified Clean (PCC Issued)" : "Pending Verification"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-bold">Local Police Station</span>
                <span className="font-bold text-slate-900 dark:text-white">Sigra Police Station, Varanasi</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-bold">PCC Token Number</span>
                <span className="font-mono font-bold text-brand-600">PCC-VAR-2026-8819</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400 font-bold">Bonded Insurance</span>
                <span className="font-bold text-emerald-600">₹5,00,000 Safety Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IDENTITY & GUARANTOR DOCUMENTS */}
      {activeTab === "kyc" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Partner Aadhaar Card Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Partner Biometric Aadhaar Document
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[10px] font-bold">
                Identity Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileCheck className="w-6 h-6 text-blue-600" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Partner_Aadhaar_Card_Front_Back.pdf</span>
                  <span className="text-[10px] text-slate-400 font-mono">12-Digit: 7821-4920-1102</span>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs"
              >
                View Aadhaar Card
              </button>
            </div>
          </div>

          {/* Guarantor Aadhaar Card Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Guarantor Person Aadhaar Document
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 text-[10px] font-bold">
                Guarantor Verified
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileCheck className="w-6 h-6 text-purple-600" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Guarantor_Aadhaar_Card_Record.pdf</span>
                  <span className="text-[10px] text-slate-400">Guarantor: Suresh Chandra Yadav</span>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-xs"
              >
                View Guarantor Aadhaar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETED JOBS */}
      {activeTab === "jobs" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Jobs Assigned & Completed by {tech.name}
              </h3>
              <p className="text-xs text-slate-400">Live dispatch history across Varanasi service zones</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold">
              {tech.totalJobs} Completed Jobs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2">Booking ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Service</th>
                  <th className="pb-2">Locality</th>
                  <th className="pb-2">Job Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                <tr>
                  <td className="py-3 font-mono font-bold text-brand-600">#BK-9981</td>
                  <td className="py-3 text-slate-900 dark:text-white">Alok Verma</td>
                  <td className="py-3">{tech.category}</td>
                  <td className="py-3">Sigra, Varanasi</td>
                  <td className="py-3 font-bold text-emerald-600">₹1,499</td>
                  <td className="py-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Completed</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-mono font-bold text-brand-600">#BK-9942</td>
                  <td className="py-3 text-slate-900 dark:text-white">Vikram Malhotra</td>
                  <td className="py-3">{tech.category}</td>
                  <td className="py-3">Lanka, Varanasi</td>
                  <td className="py-3 font-bold text-emerald-600">₹2,890</td>
                  <td className="py-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: EARNINGS & SETTLEMENT */}
      {activeTab === "earnings" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Partner Earnings & Weekly Settlement Breakdown
              </h3>
              <p className="text-xs text-slate-400">HelpMate 25% Commission payout ledger & receipts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border space-y-1">
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Gross Service Earnings</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{tech.totalEarnings.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border space-y-1">
              <span className="text-slate-400 font-bold block uppercase text-[10px]">HelpMate Comm. (25%)</span>
              <span className="text-2xl font-black text-emerald-600">
                ₹{tech.commissionPaid.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border space-y-1">
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Pending Weekly Payout</span>
              <span className="text-2xl font-black text-amber-600">
                ₹{tech.pendingPayout.toLocaleString()}
              </span>
            </div>
          </div>

          {tech.payoutProofUrl && (
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-slate-900 dark:text-white">Last Settlement Proof Receipt Available</span>
              </div>
              <a
                href={tech.payoutProofUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
              >
                View UTR Receipt
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
