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
  Smartphone,
  Mail,
  Zap,
  Volume2,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import { CustomSelect } from "@/components/CustomSelect";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "data" | "security">("general");

  // General Settings State
  const [appName, setAppName] = useState("HelpMate Varanasi HQ");
  const [dispatchRadius, setDispatchRadius] = useState("15 km Radius");
  const [commissionRate, setCommissionRate] = useState("25% Fixed Fee");
  const [currency, setCurrency] = useState("INR (₹)");
  const [supportPhone, setSupportPhone] = useState("+91 542 2200 999");
  const [supportEmail, setSupportEmail] = useState("support@helpmate.net.in");
  const [cancellationFee, setCancellationFee] = useState("₹150");
  const [warrantyDays, setWarrantyDays] = useState("30 Days");

  // Notification Settings & Rules Configuration
  const [whatsappConfirmations, setWhatsappConfirmations] = useState(true);
  const [otpNotifications, setOtpNotifications] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [settlementSms, setSettlementSms] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [whatsappProvider, setWhatsappProvider] = useState("Meta Cloud API (Official)");
  const [smsGatewayProvider, setSmsGatewayProvider] = useState("Fast2SMS DLT Approved");

  // Security & Backup
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [inputValidationStrict, setInputValidationStrict] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportSystemData = (type: string) => {
    alert(`Exporting ${type} dataset (CSV file generated for Varanasi HQ).`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Executive Glass Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-brand-300 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Settings className="w-4 h-4" /> System Control Center & Master Preferences
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              System Settings & Operational Control
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Manage platform parameters, WhatsApp notification gateways, automated SMS OTP triggers, backup schedules, and security encryption policies.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? "Settings Saved!" : "Save System Settings"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPI Quick Control Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs relative overflow-hidden group hover:border-brand-500 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
            <span>Dispatch Zone Limit</span>
            <span className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 group-hover:scale-110 transition-transform">
              <Globe className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {dispatchRadius}
          </div>
          <span className="text-[11px] text-brand-600 dark:text-brand-400 font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Varanasi Central Radius
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
            <span>WhatsApp Business API</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            Active Meta API
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Verified Cloud Gateway
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs relative overflow-hidden group hover:border-purple-500 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
            <span>Automated Backup</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
            Daily Nightly
          </div>
          <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold block">
            100% Encrypted Cloud Vault
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs relative overflow-hidden group hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
            <span>Security Standard</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
            AES-256 Valid
          </div>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-bold block">
            Granular RBAC Protection
          </span>
        </div>
      </div>

      {/* Navigation Pill Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "general", label: "General & Operational Parameters", icon: Sliders },
          { id: "notifications", label: "Notification Gateways & Automated Triggers", icon: Bell },
          { id: "data", label: "Database Backup & CSV Data Export", icon: Database },
          { id: "security", label: "Security Controls & Immutable Audit Policy", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
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

      {/* TAB 1: GENERAL & OPERATIONAL PARAMETERS */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Platform & Organization Identity */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Platform & Organization Identity
                    </h3>
                    <p className="text-[11px] text-slate-400">Varanasi Central Service Hub Identity</p>
                  </div>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  ● Operational
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Application / Company Title
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Operational Base City
                  </label>
                  <input
                    type="text"
                    defaultValue="Varanasi Metro & Purvanchal Hub"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Support Helpline Phone
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-semibold outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Official Support Email
                  </label>
                  <input
                    type="text"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-semibold outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Dispatch & Financial Operational Limits */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Dispatch & Financial Parameters
                    </h3>
                    <p className="text-[11px] text-slate-400">Dispatch Rules & Service Guarantees</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200">
                  Global Rules
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Fleet Dispatch Radius Limit
                  </label>
                  <input
                    type="text"
                    value={dispatchRadius}
                    onChange={(e) => setDispatchRadius(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Fixed Platform Commission Rate
                  </label>
                  <input
                    type="text"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Cancellation Charge Policy
                  </label>
                  <input
                    type="text"
                    value={cancellationFee}
                    onChange={(e) => setCancellationFee(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-semibold outline-none focus:border-brand-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Free Service Warranty Period
                  </label>
                  <input
                    type="text"
                    value={warrantyDays}
                    onChange={(e) => setWarrantyDays(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* System Status Summary */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      System Node Status
                    </h3>
                    <p className="text-[11px] text-slate-400">Live Health Checks</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-semibold">Primary API Server</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 99.99% Online
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-semibold">Database Latency</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">12 ms (Optimal)</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-semibold">WhatsApp Cloud API</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Connected</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 font-semibold">SMS DLT Gateway</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">DLT Approved</span>
                </div>
              </div>
            </div>

            {/* Special Instructions Note */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Administrative Notice
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Master Configuration</span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    "All platform rule modifications take effect immediately across dispatch algorithms and partner apps in Varanasi."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NOTIFICATION GATEWAYS & AUTOMATED TRIGGERS */}
      {activeTab === "notifications" && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Notification Gateways & Automated Triggers
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure messaging providers and event triggers for HelpMate dispatches in Varanasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <CustomSelect
              label="WhatsApp Business Gateway Provider"
              value={whatsappProvider}
              onChange={(val) => setWhatsappProvider(val)}
              options={[
                { value: "Meta Cloud API (Official)", label: "Meta Cloud API (Official Business Gateway)" },
                { value: "Twilio Business API", label: "Twilio Business API" },
                { value: "Gupshup Enterprise API", label: "Gupshup Enterprise API" },
              ]}
            />

            <CustomSelect
              label="SMS OTP Gateway Provider"
              value={smsGatewayProvider}
              onChange={(val) => setSmsGatewayProvider(val)}
              options={[
                { value: "Fast2SMS DLT Approved", label: "Fast2SMS DLT Approved Gateway" },
                { value: "Msg91 Enterprise DLT", label: "Msg91 Enterprise DLT Gateway" },
                { value: "Textlocal India", label: "Textlocal India API" },
              ]}
            />
          </div>

          <div className="space-y-3.5 text-xs pt-2">
            <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px]">
              Automated Event Trigger Rules
            </span>

            <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                    WhatsApp Customer Booking Confirmation
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Dispatches booking receipt with live tracking link on WhatsApp.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={whatsappConfirmations}
                onChange={(e) => setWhatsappConfirmations(e.target.checked)}
                className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                    4-Digit Job Closure SMS OTP Verification
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Requires customer OTP confirmation before technician marks job as completed.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={otpNotifications}
                onChange={(e) => setOtpNotifications(e.target.checked)}
                className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                    Technician Fleet Push Notifications
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Pushes new job broadcasts to nearby technicians within 15 km zone.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={assignmentAlerts}
                onChange={(e) => setAssignmentAlerts(e.target.checked)}
                className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                    Email Invoice & Tax Receipt Dispatch
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Emails official GST invoice copy to customer upon payment completion.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                    Admin Desk Audio Alerts & Chimes
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Play audio alert tone when high-priority emergency booking is received.
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-5 h-5 accent-brand-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA BACKUPS & CSV EXPORT */}
      {activeTab === "data" && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Database Backups & Export Engine
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Export system records and configure automated database backups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleExportSystemData("Bookings")}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-brand-500 transition-all group cursor-pointer"
            >
              <FileSpreadsheet className="w-7 h-7 text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-extrabold text-slate-900 dark:text-white text-xs">Export Bookings Log (CSV)</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Download complete Varanasi dispatch history</div>
            </button>

            <button
              type="button"
              onClick={() => handleExportSystemData("Technician Fleet")}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-purple-500 transition-all group cursor-pointer"
            >
              <Database className="w-7 h-7 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-extrabold text-slate-900 dark:text-white text-xs">Export Fleet Directory (CSV)</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Download technician KYC and Aadhaar records</div>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY CONTROLS & AUDIT POLICY */}
      {activeTab === "security" && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Security Controls & Audit Policy
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage encryption levels, admin session timeouts, and audit logs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
            <div className="font-extrabold text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Granular RBAC Permission System Active
            </div>
            <p className="text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
              All admin panel actions are logged to immutable audit trails under Varanasi HQ control with AES-256 encryption.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
