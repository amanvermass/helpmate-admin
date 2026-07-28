"use client";

import { ShieldCheck, CheckCircle2, UserCheck, MapPin, Phone, Mail, FileText, Award, Building2, Wrench } from "lucide-react";

export default function PartnerProfilePage() {
  return (
    <div className="w-full space-y-6">
      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white font-black text-3xl flex items-center justify-center shadow-lux shrink-0">
          RY
        </div>
        <div className="space-y-1.5 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Ramesh Yadav</h1>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Police Verified Partner
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Partner Badge ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">HM-TECH-901</span> • Senior HVAC & Power Jet Specialist
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-brand-500" /> +91 98390 11220</span>
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-brand-500" /> ramesh.hvac@helpmate.in</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-500" /> Sigra, Varanasi (221002)</span>
          </div>
        </div>
      </div>

      {/* Verification & KYC Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-600" /> Compliance & Verification Badges
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">Varanasi Police Background Check</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Clearance Cert: UP-VAR-2026-99210</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">Aadhaar & PAN Verification</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Verified e-KYC Linked</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">HVAC & Electrical Trade License</span>
                <span className="text-[10px] text-slate-500">Master Level Certification</span>
              </div>
              <Award className="w-5 h-5 text-brand-500 shrink-0" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-600" /> Bank Payout Account & Fleet Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Registered Bank Account</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">HDFC Bank Ltd • Sigra Branch</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">Account No: ••••••••••4910 (IFSC: HDFC0001820)</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">Service Vehicle Details</span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">Hero Passion Pro • Reg: UP 65 BX 9021</p>
              <p className="text-[10px] text-slate-500">Equipped with High-Pressure Jet Pump Kit & R32 Cylinder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
