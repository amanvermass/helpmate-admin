"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Save,
  Download,
  Database,
  Activity,
  FileSpreadsheet,
  Server,
  Lock,
  Globe,
  Sliders,
  DollarSign,
  Building,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "data" | "security">("general");

  // General Settings State
  const [appName, setAppName] = useState("HelpMate Varanasi HQ");
  const [dispatchRadius, setDispatchRadius] = useState("15 km");
  const [commissionRate, setCommissionRate] = useState("25%");
  const [currency, setCurrency] = useState("INR (₹)");

  // Notification Toggles
  const [whatsappConfirmations, setWhatsappConfirmations] = useState(true);
  const [otpNotifications, setOtpNotifications] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [settlementSms, setSettlementSms] = useState(true);

  // Security & Backup
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [inputValidationStrict, setInputValidationStrict] = useState(true);

  const handleSave = () => {
    alert("System settings saved successfully.");
  };

  const handleExportSystemData = (type: string) => {
    alert(`Exporting ${type} dataset (CSV file generated for Varanasi HQ).`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 px-2.5 py-0.5 rounded border border-brand-200 dark:border-brand-800 flex items-center gap-1">
              <Settings className="w-3 h-3 text-brand-600" /> System Configuration
            </span>
            <span className="text-xs text-slate-500">Varanasi Dispatch HQ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System & Application Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage platform parameters, WhatsApp notification gateways, backup schedules, and security controls.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-lux flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "general"
              ? "bg-brand-500 text-white shadow-lux"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>General Platform</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "notifications"
              ? "bg-brand-500 text-white shadow-lux"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>WhatsApp & Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("data")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "data"
              ? "bg-brand-500 text-white shadow-lux"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data & Exports</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === "security"
              ? "bg-brand-500 text-white shadow-lux"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Security & Backup</span>
        </button>
      </div>

      {/* TAB 1: GENERAL PLATFORM SETTINGS */}
      {activeTab === "general" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-600" />
              <span>General Platform Parameters</span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure default brand details, service dispatch radius, commission defaults, and regional currency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Platform Brand Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Default Dispatch Radius</label>
              <input
                type="text"
                value={dispatchRadius}
                onChange={(e) => setDispatchRadius(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Standard Partner Commission Share</label>
              <input
                type="text"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Base Operating Currency</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                disabled
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WHATSAPP & NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>WhatsApp & SMS Gateway Triggers</span>
            </h3>
            <p className="text-xs text-slate-500">
              Configure real-time automated messaging sent to Varanasi customers and service partner technicians.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white block">Instant WhatsApp Booking Confirmation</span>
                <span className="text-slate-500">Sends job ID, assigned technician photo, and scheduled slot directly on WhatsApp.</span>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappConfirmations(!whatsappConfirmations)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  whatsappConfirmations ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    whatsappConfirmations ? "left-6.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white block">Job Completion OTP Verification SMS</span>
                <span className="text-slate-500">Sends 4-digit verification code to customer phone when technician arrives.</span>
              </div>
              <button
                type="button"
                onClick={() => setOtpNotifications(!otpNotifications)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  otpNotifications ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    otpNotifications ? "left-6.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white block">Technician Dispatch Push Alerts</span>
                <span className="text-slate-500">Notifies lead partner on WhatsApp when a new job is assigned in their locality.</span>
              </div>
              <button
                type="button"
                onClick={() => setAssignmentAlerts(!assignmentAlerts)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  assignmentAlerts ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    assignmentAlerts ? "left-6.5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA & EXPORTS */}
      {activeTab === "data" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-600" />
              <span>Bulk Reporting & CSV Exports</span>
            </h3>
            <p className="text-xs text-slate-500">
              Download system-wide CSV ledgers for accounting, GST filings, and operational audits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => handleExportSystemData("Bookings Ledger")}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-left space-y-2 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="w-5 h-5 text-brand-600" />
                <Download className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Export Bookings Log</span>
                <span className="text-[10px] text-slate-500">Full dispatch history with GST splits</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleExportSystemData("25% Commission Ledger")}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-left space-y-2 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Commission & Settlements</span>
                <span className="text-[10px] text-slate-500">25% HelpMate revenue breakdown</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleExportSystemData("Technician KYC Directory")}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-left space-y-2 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Partner KYC Records</span>
                <span className="text-[10px] text-slate-500">Aadhaar & Police clearance stats</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & BACKUP */}
      {activeTab === "security" && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-600" />
              <span>Database Backups & Security Protection</span>
            </h3>
            <p className="text-xs text-slate-500">
              Automated database snapshot backups, input sanitization rules, and active uptime monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 block">Database Auto-Backup</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Snapshot schedule active (03:00 AM IST)</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                Operational
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="font-bold text-xs text-blue-900 dark:text-blue-300 block">Strict Input Regex Validation</span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-400">Phone, OTP & GSTIN rules active</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Secured
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
