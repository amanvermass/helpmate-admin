"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  MessageSquare,
  ShieldCheck,
  Save,
  Database,
  Sliders,
  Building,
  Smartphone,
  Mail,
  CheckCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "data" | "security">("general");

  // Settings State
  const [appName, setAppName] = useState("HelpMate Varanasi HQ");
  const [assignmentRadius, setAssignmentRadius] = useState("15 km");
  const [commissionRate, setCommissionRate] = useState("25%");
  const [supportPhone, setSupportPhone] = useState("+91 542 2200 999");
  const [supportEmail, setSupportEmail] = useState("support@helpmate.net.in");
  const [cancellationFee, setCancellationFee] = useState("₹150");

  // Notifications State
  const [whatsappConfirmations, setWhatsappConfirmations] = useState(true);
  const [otpNotifications, setOtpNotifications] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-600" />
            <span>System Settings</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage operational parameters, notifications, data export, and security preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? "Settings Saved!" : "Save Settings"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: "general", label: "General", icon: Sliders },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "data", label: "Data Export", icon: Database },
          { id: "security", label: "Security", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Card Content */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* TAB 1: GENERAL SETTINGS */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              General Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Application Name
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Service Area Radius Limit
                </label>
                <input
                  type="text"
                  value={assignmentRadius}
                  onChange={(e) => setAssignmentRadius(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Platform Commission Rate
                </label>
                <input
                  type="text"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Cancellation Fee Policy
                </label>
                <input
                  type="text"
                  value={cancellationFee}
                  onChange={(e) => setCancellationFee(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Support Phone
                </label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Support Email
                </label>
                <input
                  type="text"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              Notification Rules
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">WhatsApp Customer Booking Receipts</div>
                    <div className="text-[11px] text-slate-500">Send WhatsApp receipt upon booking creation</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappConfirmations}
                  onChange={(e) => setWhatsappConfirmations(e.target.checked)}
                  className="w-5 h-5 accent-brand-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Job Closure SMS OTP Verification</div>
                    <div className="text-[11px] text-slate-500">Require customer 4-digit OTP to complete jobs</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={otpNotifications}
                  onChange={(e) => setOtpNotifications(e.target.checked)}
                  className="w-5 h-5 accent-brand-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Partner Job Push Alerts</div>
                    <div className="text-[11px] text-slate-500">Notify technicians when a new order is assigned</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={assignmentAlerts}
                  onChange={(e) => setAssignmentAlerts(e.target.checked)}
                  className="w-5 h-5 accent-brand-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Email Tax Invoice Receipts</div>
                    <div className="text-[11px] text-slate-500">Email GST invoices to customers automatically</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailReceipts}
                  onChange={(e) => setEmailReceipts(e.target.checked)}
                  className="w-5 h-5 accent-brand-600 rounded"
                />
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: DATA EXPORT */}
        {activeTab === "data" && (
          <div className="space-y-5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              Data Export & Backups
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => alert("Downloading Bookings CSV...")}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-brand-500 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-6 h-6 text-brand-600 mb-2" />
                <div className="font-bold text-slate-900 dark:text-white text-xs">Export Bookings Log (CSV)</div>
                <div className="text-[11px] text-slate-500">Download complete order history</div>
              </button>

              <button
                type="button"
                onClick={() => alert("Downloading Partner Directory CSV...")}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-purple-500 transition-all cursor-pointer"
              >
                <Database className="w-6 h-6 text-purple-600 mb-2" />
                <div className="font-bold text-slate-900 dark:text-white text-xs">Export Partner Directory (CSV)</div>
                <div className="text-[11px] text-slate-500">Download technician partner directory</div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY */}
        {activeTab === "security" && (
          <div className="space-y-5">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              Security Status
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>RBAC & Security Policy Active</span>
              </div>
              <p className="text-emerald-700 dark:text-emerald-400">
                All administrative actions are encrypted with AES-256 and logged to audit trails.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
