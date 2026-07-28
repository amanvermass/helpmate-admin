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
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <Bell className="w-3 h-3 text-emerald-600" /> Gateway Logs
            </span>
            <span className="text-xs text-slate-500">Varanasi Dispatch HQ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notifications & WhatsApp Dispatch Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor real-time WhatsApp booking confirmations, customer 4-digit OTP dispatch, and partner push alerts.
          </p>
        </div>
      </div>

      {/* Control Panel Toggles */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Send className="w-4 h-4 text-brand-600" />
          <span>Notification Channel Controls</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
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
              <span className="font-bold text-xs text-slate-900 dark:text-white block">WhatsApp API Trigger</span>
              <span className="text-[10px] text-slate-500">Live booking confirmations with maps link</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
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
              <span className="font-bold text-xs text-slate-900 dark:text-white block">SMS OTP Gateway</span>
              <span className="text-[10px] text-slate-500">4-digit job closure OTPs</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
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
              <span className="font-bold text-xs text-slate-900 dark:text-white block">Partner Push Broadcast</span>
              <span className="text-[10px] text-slate-500">Fleet dispatch alerts for Varanasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Live Logs */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Recent Notification Delivery Audit</h3>
        <div className="space-y-3">
          {notificationLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400 text-[11px]">{log.channel}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{log.recipient}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{log.message}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-slate-400 font-semibold">{log.time}</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
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
