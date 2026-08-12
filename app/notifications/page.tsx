"use client";

import { useState, useMemo } from "react";
import {
  Bell,
  CheckCircle2,
  Search,
  AlertTriangle,
} from "lucide-react";

export interface NotificationLogItem {
  id: string;
  channel: "WhatsApp API" | "SMS OTP" | "Push Alert" | "System Alert" | "Email Receipt";
  recipientName: string;
  recipientPhone: string;
  recipientRole: "Customer" | "Technician Partner" | "Admin";
  title: string;
  message: string;
  priority: "High Priority" | "Normal" | "Critical";
  status: "Delivered" | "Sent" | "Read" | "Failed";
  timestamp: string;
}

export default function NotificationsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filters & Search
  const [selectedFilter, setSelectedFilter] = useState<string>("All Logs");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample Notifications List
  const [logs, setLogs] = useState<NotificationLogItem[]>([
    {
      id: "LOG-901",
      channel: "WhatsApp API",
      recipientName: "Rajesh Kumar Agrawal",
      recipientPhone: "+91 98390 12345",
      recipientRole: "Customer",
      title: "Split AC Foam Jet Booking Confirmed",
      message: "HelpMate Booking #HM-VAR-8821 confirmed! Service Partner Ramesh Yadav assigned for 10:00 AM slot.",
      priority: "Normal",
      status: "Delivered",
      timestamp: "2 mins ago",
    },
    {
      id: "LOG-902",
      channel: "SMS OTP",
      recipientName: "Sunita Devi",
      recipientPhone: "+91 94152 67890",
      recipientRole: "Customer",
      title: "4-Digit Job Closure OTP Code",
      message: "Your 4-digit security code for Deep Cleaning job completion is 8821. Share with technician upon satisfaction.",
      priority: "High Priority",
      status: "Sent",
      timestamp: "14 mins ago",
    },
    {
      id: "LOG-903",
      channel: "Push Alert",
      recipientName: "Varanasi HVAC Partner Fleet",
      recipientPhone: "Broadcast Group",
      recipientRole: "Technician Partner",
      title: "New High Priority AC Jet Order Available",
      message: "High priority AC servicing order created at Sigra locality (₹599). Open partner app to accept job.",
      priority: "Critical",
      status: "Read",
      timestamp: "28 mins ago",
    },
    {
      id: "LOG-904",
      channel: "System Alert",
      recipientName: "Ramesh Yadav (HVAC Partner)",
      recipientPhone: "+91 99350 11223",
      recipientRole: "Technician Partner",
      title: "Weekly Commission Payout Credited",
      message: "Weekly payout of ₹12,300 transferred to HDFC Bank A/c •••• 4910. Transaction ID: TXN-VAR-99102.",
      priority: "Normal",
      status: "Delivered",
      timestamp: "45 mins ago",
    },
    {
      id: "LOG-905",
      channel: "WhatsApp API",
      recipientName: "Alok Verma",
      recipientPhone: "+91 98391 44556",
      recipientRole: "Customer",
      title: "Diagnostic Quote Approval Required",
      message: "Technician diagnostic quote of ₹1,450 for copper pipe replacement uploaded. Tap link to approve quote.",
      priority: "High Priority",
      status: "Delivered",
      timestamp: "1 hour ago",
    },
  ]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const matchFilter =
        selectedFilter === "All Logs" ||
        (selectedFilter === "WhatsApp" && item.channel === "WhatsApp API") ||
        (selectedFilter === "SMS OTP" && item.channel === "SMS OTP") ||
        (selectedFilter === "Push Alerts" && item.channel === "Push Alert") ||
        (selectedFilter === "High Priority" && (item.priority === "High Priority" || item.priority === "Critical"));

      const matchSearch =
        searchQuery === "" ||
        item.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [logs, selectedFilter, searchQuery]);

  const handleResendNotification = (id: string) => {
    setLogs(
      logs.map((l) =>
        l.id === id ? { ...l, status: "Delivered", timestamp: "Just now (Resent)" } : l
      )
    );
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300 pb-10">
      {/* ─── 1. SIMPLE CLEAN PAGE HEADER ─── */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-brand-600" />
          <span>Notifications</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          View all real-time delivery audit logs for WhatsApp, SMS OTPs, and system alerts.
        </p>
      </div>

      {/* ─── 2. FILTER BAR & SEARCH ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {["All Logs", "WhatsApp", "SMS OTP", "Push Alerts", "High Priority"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${selectedFilter === f
                  ? "bg-brand-500 text-white shadow-xs font-black"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recipient, message or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-medium"
          />
        </div>
      </div>

      {/* ─── 3. AUDIT LOGS TRAIL LIST ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
            Live System Delivery Audit Log ({filteredLogs.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400 font-bold">Auto-synced with Meta WhatsApp Cloud API</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-extrabold text-brand-600 dark:text-brand-400 text-[11px] bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                    {log.channel}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {log.recipientName} ({log.recipientPhone})
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {log.recipientRole}
                  </span>
                  {log.priority === "Critical" || log.priority === "High Priority" ? (
                    <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> {log.priority}
                    </span>
                  ) : null}
                </div>

                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{log.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
                  {log.message}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                <span className="text-[10px] font-mono text-slate-400 font-bold">{log.timestamp}</span>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {log.status}
                </span>

                <button
                  type="button"
                  onClick={() => handleResendNotification(log.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  {copiedId === log.id ? "Resent!" : "Resend Alert"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
