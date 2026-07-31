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
} from "lucide-react";
import { CustomSelect } from "@/components/CustomSelect";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "data" | "security">("general");

  // General Settings State
  const [appName, setAppName] = useState("HelpMate Varanasi HQ");
  const [dispatchRadius, setDispatchRadius] = useState("15 km");
  const [commissionRate, setCommissionRate] = useState("25%");
  const [currency, setCurrency] = useState("INR (₹)");

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

  const handleSave = () => {
    alert("System settings saved successfully.");
  };

  const handleExportSystemData = (type: string) => {
    alert(`Exporting ${type} dataset (CSV file generated for Varanasi HQ).`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-800 to-slate-950 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" /> System Control Center
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">System & Application Settings</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Manage platform parameters, WhatsApp notification gateways, backup schedules, and security controls.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-lux flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </div>

      {/* 4 Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Dispatch Radius</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">15 km Radius</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">WhatsApp Gateway</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600">Active API</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Automated Backup</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600">Daily Nightly</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Encryption Standard</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">AES-256 Valid</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit text-xs font-bold shadow-xs">
        {[
          { id: "general", label: "General & Operational Settings", icon: Sliders },
          { id: "notifications", label: "Notification Channels & Preferences", icon: Bell },
          { id: "data", label: "Data Backups & Export", icon: Database },
          { id: "security", label: "Security & Encryption", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT CARDS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        {activeTab === "general" && (
          <div className="space-y-6 max-w-3xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              General System Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Application Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Dispatch Radius Limit</label>
                <input
                  type="text"
                  value={dispatchRadius}
                  onChange={(e) => setDispatchRadius(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Fixed Commission Fee</label>
                <input
                  type="text"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Operational Currency</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6 max-w-3xl">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Notification Settings & Channel Preferences
                </h3>
                <p className="text-xs text-slate-500">
                  Configure active gateways, trigger rules, and sound alert preferences for Helpmate dispatches.
                </p>
              </div>
            </div>

            {/* Gateway Providers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <CustomSelect
                label="WhatsApp Business Gateway Provider"
                value={whatsappProvider}
                onChange={(val) => setWhatsappProvider(val)}
                options={[
                  { value: "Meta Cloud API (Official)", label: "Meta Cloud API (Official HDFC / Business)" },
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

            {/* Event Trigger Preferences */}
            <div className="space-y-3 text-xs pt-2">
              <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider block text-[11px]">
                Automated Trigger Rules
              </span>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                      WhatsApp Customer Booking Confirmation
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Instantly dispatches booking receipt with live tracking link on WhatsApp.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappConfirmations}
                  onChange={(e) => setWhatsappConfirmations(e.target.checked)}
                  className="w-4 h-4 accent-brand-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                      4-Digit Job Closure SMS OTP Verification
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Requires customer OTP confirmation before technician marks job as completed.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={otpNotifications}
                  onChange={(e) => setOtpNotifications(e.target.checked)}
                  className="w-4 h-4 accent-brand-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                      Technician Fleet Push Notifications
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Pushes new job broadcasts to nearby technicians within 15 km zone.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={assignmentAlerts}
                  onChange={(e) => setAssignmentAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                      Email Invoice & Tax Receipt Dispatch
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Emails official GST invoice copy to customer upon payment completion.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailReceipts}
                  onChange={(e) => setEmailReceipts(e.target.checked)}
                  className="w-4 h-4 accent-brand-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-brand-100 text-brand-600">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                      Admin Desk Audio Alerts & Chimes
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Play audio alert tone when high-priority emergency booking is received.
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-4 h-4 accent-brand-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="space-y-6 max-w-3xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Database Backups & Export
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleExportSystemData("Bookings")}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-brand-500 transition-all group"
              >
                <FileSpreadsheet className="w-6 h-6 text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-slate-900 dark:text-white text-xs">Export Bookings Log (CSV)</div>
                <div className="text-[11px] text-slate-500">Download complete Varanasi dispatch history</div>
              </button>

              <button
                type="button"
                onClick={() => handleExportSystemData("Technician Fleet")}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-brand-500 transition-all group"
              >
                <Database className="w-6 h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <div className="font-bold text-slate-900 dark:text-white text-xs">Export Fleet Directory (CSV)</div>
                <div className="text-[11px] text-slate-500">Download technician KYC and Aadhaar records</div>
              </button>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 max-w-3xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Security Controls & Audit Policy
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <div className="font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Granular RBAC Permission System Active
              </div>
              <div className="text-emerald-700 dark:text-emerald-400">
                All admin panel actions are logged to immutable audit trails under Varanasi HQ control.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
