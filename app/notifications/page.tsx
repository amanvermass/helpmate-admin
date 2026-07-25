"use client";

import { useState } from "react";
import { Bell, MessageSquare, ShieldCheck, Send, CheckCircle2, RefreshCw } from "lucide-react";

export default function NotificationsPage() {
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [otpSmsEnabled, setOtpSmsEnabled] = useState(true);
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);

  const notificationLogs = [
    {
      id: "LOG-901",
      channel: "WhatsApp",
      recipient: "+91 98390 12345 (Rajesh Agrawal)",
      message: "HelpMate Booking Confirmed! Partner Ramesh Yadav assigned for AC Power Jet.",
      status: "Delivered",
      time: "10 mins ago",
    },
    {
      id: "LOG-902",
      channel: "SMS OTP",
      recipient: "+91 94152 67890 (Sunita Devi)",
      message: "Your HelpMate 4-digit completion code is 8821. Share with partner upon completion.",
      status: "Sent",
      time: "25 mins ago",
    },
    {
      id: "LOG-903",
      channel: "Push Alert",
      recipient: "Technician Fleet (Varanasi Central)",
      message: "New High Priority Plumbing Request at Bhelupur. Accept via Partner App.",
      status: "Delivered",
      time: "45 mins ago",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" /> Requirement #8
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Basic Notification & WhatsApp Dispatch Control</h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            WhatsApp booking confirmations, customer 4-digit OTP SMS dispatch, partner push alerts, and notification control panel.
          </p>
        </div>
      </div>

      {/* Control Panel Toggles */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-6">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-brand-600" />
          <span>Notification Channel Controls</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <input
                type="checkbox"
                checked={whatsappEnabled}
                onChange={(e) => setWhatsappEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-brand-500 cursor-pointer"
              />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">WhatsApp API Trigger</span>
              <span className="text-[10px] text-slate-500">Live booking confirmations with maps link</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <input
                type="checkbox"
                checked={otpSmsEnabled}
                onChange={(e) => setOtpSmsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-brand-500 cursor-pointer"
              />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">SMS OTP Gateway</span>
              <span className="text-[10px] text-slate-500">4-digit job closure OTPs</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <Bell className="w-5 h-5 text-purple-600" />
              <input
                type="checkbox"
                checked={pushAlertsEnabled}
                onChange={(e) => setPushAlertsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-brand-500 cursor-pointer"
              />
            </div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">Partner Push Broadcast</span>
              <span className="text-[10px] text-slate-500">Fleet dispatch alerts for Varanasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Live Logs */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">Recent Notification Delivery Audit</h3>
        <div className="space-y-3">
          {notificationLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-600 text-[11px]">{log.channel}</span>
                  <span className="font-bold text-slate-900">{log.recipient}</span>
                </div>
                <p className="text-[11px] text-slate-600">{log.message}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-slate-400 font-semibold">{log.time}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
