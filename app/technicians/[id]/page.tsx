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
  ExternalLink,
  CreditCard,
  Briefcase,
  Sparkles,
  CheckCircle,
  Receipt,
  Users,
} from "lucide-react";

export default function TechnicianDetailPage() {
  const params = useParams();
  const router = useRouter();
  const techId = params?.id as string;

  // Find technician by ID or fallback to first
  const tech: Technician =
    initialTechnicians.find((t) => t.id === techId) || initialTechnicians[0];

  const [activeTab, setActiveTab] = useState<"overview" | "kyc" | "jobs" | "earnings">("overview");

  // Sample job dispatches
  const partnerJobs = [
    {
      id: "BK-9981",
      customerName: "Alok Verma",
      serviceTitle: tech.category + " - Power Jet Wash & Gas Check",
      locality: tech.locality + ", Varanasi",
      date: "Today, 11:30 AM",
      totalAmount: 1499,
      commissionFee: 374,
      netShare: 1125,
      status: "Completed",
    },
    {
      id: "BK-9942",
      customerName: "Vikram Malhotra",
      serviceTitle: tech.category + " - Full Inspection & Repair",
      locality: "Lanka, Varanasi",
      date: "Yesterday, 03:15 PM",
      totalAmount: 2890,
      commissionFee: 722,
      netShare: 2168,
      status: "Completed",
    },
    {
      id: "BK-9890",
      customerName: "Siddharth Gupta",
      serviceTitle: tech.category + " - Emergency Breakdown Service",
      locality: "Mahmoorganj, Varanasi",
      date: "01 Aug 2026",
      totalAmount: 1850,
      commissionFee: 462,
      netShare: 1388,
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation Bar */}
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
            Partner Fleet ID: {tech.id}
          </span>
        </div>
      </div>

      {/* Partner Executive Hero Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={tech.avatar}
                alt={tech.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-brand-500 shadow-lg shrink-0"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full text-[10px] ring-4 ring-slate-950">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{tech.name}</h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${
                    tech.status === "Available" || tech.status === "Approved"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  ● {tech.status}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-extrabold">
                  {tech.role}
                </span>
              </div>

              <p className="text-xs text-brand-300 font-extrabold flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-brand-400" />
                <span>{tech.category} Specialist</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>{tech.locality} ({tech.pincode}), Varanasi</span>
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {tech.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Onboarded: {tech.joiningDate || "Jan 2025"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <a
              href={`tel:${tech.phone}`}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Partner</span>
            </a>

            <a
              href={`https://wa.me/${tech.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>WhatsApp Dispatch</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4 Section Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "bg-brand-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Partner Overview & Biometric KYC</span>
        </button>

        <button
          onClick={() => setActiveTab("kyc")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "kyc"
              ? "bg-brand-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Identity & Guarantor Verification</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "jobs"
              ? "bg-brand-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Completed Job Dispatches ({tech.totalJobs})</span>
        </button>

        <button
          onClick={() => setActiveTab("earnings")}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "earnings"
              ? "bg-brand-600 text-white shadow-xs"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Earnings & Weekly Settlement Ledger</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & BIOMETRIC KYC SPECIFICATIONS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Inside Tab Metrics Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Partner Rating</span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"><Star className="w-4 h-4 fill-amber-500" /></span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {tech.rating} / 5.0
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                ★ 98% Positive Customer Feedback
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Total Jobs Completed</span>
                <span className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400"><Briefcase className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400 font-mono">
                {tech.totalJobs} Dispatches
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">Varanasi Active Fleet</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Gross Revenue</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"><CreditCard className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{tech.totalEarnings.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 100% Cleared Billings
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Pending Weekly Payout</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"><Wallet className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
                ₹{tech.pendingPayout.toLocaleString()}
              </div>
              <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold block">
                Next Payout: Monday 10:00 AM
              </span>
            </div>
          </div>

          {/* Specifications Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Partner Personal & Technical Profile */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Partner Personal & Technical Profile</h3>
                      <p className="text-[11px] text-slate-400">Biometric Verified Technician Details</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    ● Biometric Verified
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Full Partner Name</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{tech.name}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Mobile Phone</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{tech.phone}</span>
                      <a href={`tel:${tech.phone}`} className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-extrabold">Call</a>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Service Category</span>
                    <span className="font-extrabold text-brand-600 dark:text-brand-400">{tech.category}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Skill Level & Certification</span>
                    <span className="font-bold text-slate-900 dark:text-white">HVAC Master Level L3 Certified</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Varanasi Fleet Zone</span>
                    <span className="font-bold text-slate-900 dark:text-white">{tech.locality} ({tech.pincode})</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Years of Field Experience</span>
                    <span className="font-bold text-slate-900 dark:text-white">8+ Years Experience</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Registered Vehicle</span>
                    <span className="font-bold text-slate-900 dark:text-white">Hero Electric Scooter (UP 65 AB 4910)</span>
                  </div>
                </div>
              </div>

              {/* Police Clearance & Safety Compliance */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Police Clearance & Safety Audit</h3>
                      <p className="text-[11px] text-slate-400">Verified Police Thana Clearance Certificate</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    PCC Passed
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">Local Police Station</span>
                    <span className="font-bold text-slate-900 dark:text-white">Sigra Police Station, Varanasi</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">PCC Token Number</span>
                    <span className="font-mono font-extrabold text-brand-600 dark:text-brand-400">PCC-VAR-2026-8819</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 font-semibold">Bonded Customer Insurance</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹5,00,000 Safety Cover Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Guarantor Audit Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Guarantor Person Details</h3>
                      <p className="text-[11px] text-slate-400">Verified Emergency & Financial Guarantor</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200">
                    Verified
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">Guarantor Name</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">Suresh Chandra Yadav</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">Relation to Partner</span>
                    <span className="font-bold text-slate-900 dark:text-white">Father</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">Guarantor Mobile Phone</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">+91 94152 88219</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 font-semibold">Guarantor Address</span>
                    <span className="font-bold text-slate-900 dark:text-white">Sigra, Varanasi (221002)</span>
                  </div>
                </div>
              </div>

              {/* Special Partner Notes */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Dispatch Performance Note
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">Top Rated Fleet Specialist</span>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      "Consistently maintains 4.9 star rating with 99.2% on-time arrival rate. Assigned to premium AC service bookings."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IDENTITY & GUARANTOR DOCUMENTS */}
      {activeTab === "kyc" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Partner Aadhaar Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span className="font-extrabold text-slate-900 dark:text-white text-base">
                  Partner Biometric Aadhaar Card
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[10px] font-bold">
                Identity Verified
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileCheck className="w-7 h-7 text-brand-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Partner_Aadhaar_Card_Front_Back.pdf</span>
                  <span className="text-[11px] text-slate-400 font-mono">12-Digit: 7821-4920-1102</span>
                </div>
              </div>
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs"
              >
                View Document
              </button>
            </div>
          </div>

          {/* Guarantor Aadhaar Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                <span className="font-extrabold text-slate-900 dark:text-white text-base">
                  Guarantor Person Aadhaar Card
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 text-[10px] font-bold">
                Guarantor Verified
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileCheck className="w-7 h-7 text-purple-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Guarantor_Aadhaar_Card_Record.pdf</span>
                  <span className="text-[11px] text-slate-400 font-mono">Guarantor: Suresh Chandra Yadav</span>
                </div>
              </div>
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
              >
                View Guarantor Aadhaar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLETED JOB DISPATCHES */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          {/* Top Job Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Dispatches</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {tech.totalJobs} Dispatches
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">Active Fleet Dispatcher</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Avg Turnaround Time</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                42 Minutes
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Fast On-Site Resolution
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Gross Revenue Generated</span>
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                ₹{tech.totalEarnings.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">Total Billings Handled</span>
            </div>
          </div>

          {/* Job Dispatch Cards List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600" />
                <span>Job Dispatches & Completion History</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                Showing {partnerJobs.length} Completed Jobs
              </span>
            </div>

            <div className="space-y-3">
              {partnerJobs.map((j) => (
                <div
                  key={j.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Link
                        href={`/bookings/${j.id}`}
                        className="font-mono font-extrabold text-brand-600 dark:text-brand-400 text-sm group-hover:underline flex items-center gap-1"
                      >
                        <span>#{j.id}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-200 dark:border-emerald-800">
                        {j.status}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">•</span>
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{j.date}</span>
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                      {j.serviceTitle}
                    </h4>

                    <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-brand-500" />
                      <span>Customer: <strong>{j.customerName}</strong> ({j.locality})</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-6 justify-between md:justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-700">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">HelpMate 25% Fee</span>
                      <span className="font-mono font-extrabold text-slate-500 text-xs block">
                        ₹{j.commissionFee}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Partner Net Share</span>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-lg">
                        ₹{j.netShare}
                      </span>
                    </div>

                    <Link
                      href={`/bookings/${j.id}`}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-brand-600 hover:text-white text-slate-800 dark:text-slate-200 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <span>View Job Details</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EARNINGS & WEEKLY SETTLEMENT LEDGER */}
      {activeTab === "earnings" && (
        <div className="space-y-6">
          {/* Top Settlement KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">Gross Service Revenue</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                ₹{tech.totalEarnings.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">100% Customer Paid</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">HelpMate Platform Fee (25%)</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{tech.commissionPaid.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Auto Deducted</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">Net Settled Payouts</span>
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                ₹{(tech.totalEarnings - tech.commissionPaid).toLocaleString()}
              </div>
              <span className="text-[11px] text-brand-600 font-bold">Credited to Bank</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">Pending Weekly Payout</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                ₹{tech.pendingPayout.toLocaleString()}
              </div>
              <span className="text-[11px] text-purple-600 font-bold">Due Next Monday</span>
            </div>
          </div>

          {/* Bank Account Details Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Registered Bank Payout Profile
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[10px] font-bold">
                Bank Account Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Bank Name</span>
                <span className="font-extrabold text-slate-900 dark:text-white">HDFC Bank (Sigra Branch)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Account Number</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">•••• •••• 4910</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">IFSC Code</span>
                <span className="font-mono font-extrabold text-brand-600 dark:text-brand-400">HDFC0000214</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Payout Frequency</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Weekly (Every Monday)</span>
              </div>
            </div>
          </div>

          {/* Last Payout Proof Receipt */}
          {tech.payoutProofUrl && (
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white block">Last Weekly Settlement Bank UTR Receipt</span>
                  <span className="text-[11px] text-slate-500">Ref UTR: UTR-VAR-202608-9921 • Transferred ₹12,300</span>
                </div>
              </div>
              <a
                href={tech.payoutProofUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs"
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
