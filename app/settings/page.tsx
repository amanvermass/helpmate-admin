"use client";

import { useState } from "react";
import { varanasiLocalities, VaranasiLocality } from "@/lib/mockData";
import {
  MapPin,
  Bell,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Save,
  Plus,
  Download,
  Upload,
  Database,
  Activity,
  FileSpreadsheet,
  AlertTriangle,
  Server,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const [localities, setLocalities] = useState<VaranasiLocality[]>(varanasiLocalities);

  // Notification Toggles
  const [whatsappConfirmations, setWhatsappConfirmations] = useState(true);
  const [otpNotifications, setOtpNotifications] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  // New Pincode Input
  const [newPincode, setNewPincode] = useState("");
  const [newLocalityName, setNewLocalityName] = useState("");

  const handleToggleServiceable = (id: string) => {
    setLocalities(
      localities.map((loc) => (loc.id === id ? { ...loc, isServiceable: !loc.isServiceable } : loc))
    );
  };

  const handleAddPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPincode || !newLocalityName) return;

    const newLoc: VaranasiLocality = {
      id: `loc-${Date.now()}`,
      name: newLocalityName,
      pincode: newPincode,
      activeBookings: 0,
      activeTechs: 0,
      status: "Normal",
      isServiceable: true,
    };
    setLocalities([...localities, newLoc]);
    setNewPincode("");
    setNewLocalityName("");
    alert(`Added Pincode ${newPincode} (${newLocalityName}) to Varanasi serviceability map.`);
  };

  const handleExportSystemData = (type: string) => {
    alert(`Exporting ${type} dataset (CSV file generated for Varanasi HQ).`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Admin Control Panel & System Capabilities
        </h2>
        <p className="text-xs text-slate-500">
          Configure Varanasi pincode serviceability, WhatsApp alerts, bulk import/export, data backup, and system monitoring.
        </p>
      </div>

      {/* SECTION 1: VARANASI PINCODE SERVICEABILITY MAP */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              <span>Varanasi Pincode Serviceability Matrix</span>
            </h3>
            <p className="text-xs text-slate-500">
              Enable or restrict booking dispatch across Varanasi postal codes (221001 - 221010).
            </p>
          </div>

          <form onSubmit={handleAddPincode} className="flex gap-2">
            <input
              type="text"
              placeholder="Locality (e.g. Mahmoorganj)"
              value={newLocalityName}
              onChange={(e) => setNewLocalityName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
            />
            <input
              type="text"
              placeholder="Pincode (221010)"
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value)}
              className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-900"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
        </div>

        {/* Pincode Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {localities.map((loc) => (
            <div
              key={loc.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                loc.isServiceable
                  ? "bg-white border-slate-200 shadow-xs"
                  : "bg-slate-100 border-slate-300 opacity-60"
              }`}
            >
              <div className="flex flex-col">
                <span className="font-extrabold text-xs text-slate-900">
                  {loc.name}
                </span>
                <span className="font-mono text-[10px] text-slate-500 font-bold">
                  Pincode: {loc.pincode}
                </span>
                <span className="text-[9px] font-bold text-emerald-600 mt-1">
                  {loc.activeTechs} Verified Techs Base
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleServiceable(loc.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                  loc.isServiceable
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {loc.isServiceable ? "Active" : "Disabled"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: FOUNDATIONAL DATA MANAGEMENT & BULK EXPORT */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-600" />
            <span>Data Management & Bulk Reporting Engine</span>
          </h3>
          <p className="text-xs text-slate-500">
            Export CSV ledgers for Bookings, GST, Commission, Customers, and Technician Partners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => handleExportSystemData("Bookings Ledger")}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 text-left space-y-2 transition-all group"
          >
            <div className="flex items-center justify-between">
              <FileSpreadsheet className="w-5 h-5 text-brand-600" />
              <Download className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">Export Bookings Log</span>
              <span className="text-[10px] text-slate-500">Full dispatch history with GST splits</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleExportSystemData("25% Commission Ledger")}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 text-left space-y-2 transition-all group"
          >
            <div className="flex items-center justify-between">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">Commission & Settlements</span>
              <span className="text-[10px] text-slate-500">25% HelpMate revenue breakdown</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleExportSystemData("Technician KYC Directory")}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 text-left space-y-2 transition-all group"
          >
            <div className="flex items-center justify-between">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">Partner KYC Records</span>
              <span className="text-[10px] text-slate-500">Aadhaar & Police clearance stats</span>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 3: BACKUP, SECURITY & MONITORING */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-600" />
            <span>Automated Backup & Server Monitoring</span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time server uptime metrics, input validation safeguards, and database auto-backups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold text-xs text-emerald-900 block">Database Backup Engine</span>
                <span className="text-[10px] text-emerald-700">Daily snapshot schedule active (03:00 AM IST)</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">Operational</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-bold text-xs text-blue-900 block">Input Validation & Duplicate Prevention</span>
                <span className="text-[10px] text-blue-700">Strict OTP, Phone & GSTIN regex rules enabled</span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-800">Secured</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => alert("System parameters saved successfully.")}
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save System Controls</span>
          </button>
        </div>
      </div>
    </div>
  );
}
