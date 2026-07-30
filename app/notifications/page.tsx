"use client";

import { useState, useMemo } from "react";
import {
  Bell,
  MessageSquare,
  ShieldCheck,
  Send,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Plus,
  X,
  Phone,
  Sparkles,
  AlertTriangle,
  Radio,
  Clock,
  User,
  Zap,
  Check,
  ExternalLink,
} from "lucide-react";
import { Portal } from "@/components/Portal";

export interface NotificationLogItem {
  id: string;
  channel: "WhatsApp API" | "SMS OTP" | "Push Alert" | "System Alert";
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

  // Channel Toggles
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [otpSmsEnabled, setOtpSmsEnabled] = useState(true);
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);

  // Filters & Search
  const [selectedFilter, setSelectedFilter] = useState<string>("All Logs");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  // Form State for Broadcasting New Alert
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    channel: "WhatsApp API" as NotificationLogItem["channel"],
    recipientGroup: "Customer" as NotificationLogItem["recipientRole"],
    recipientPhone: "+91 98390 12345",
    priority: "Normal" as NotificationLogItem["priority"],
  });

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

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;

    const newLog: NotificationLogItem = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      channel: broadcastForm.channel,
      recipientName: broadcastForm.recipientGroup === "Customer" ? "Selected Customer" : "Varanasi Partner Fleet",
      recipientPhone: broadcastForm.recipientPhone,
      recipientRole: broadcastForm.recipientGroup,
      title: broadcastForm.title,
      message: broadcastForm.message,
      priority: broadcastForm.priority,
      status: "Delivered",
      timestamp: "Just now",
    };

    setLogs([newLog, ...logs]);
    setIsBroadcastOpen(false);
    setBroadcastForm({
      title: "",
      message: "",
      channel: "WhatsApp API",
      recipientGroup: "Customer",
      recipientPhone: "+91 98390 12345",
      priority: "Normal",
    });
  };

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

      {/* ─── 1. VIBRANT EXECUTIVE HERO HEADER ─── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 dark:from-slate-900 dark:via-brand-950 dark:to-purple-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Broadcast Dispatch Hub
            </span>
            <span className="text-xs text-white/80 font-bold">• 99.4% Delivery Success Rate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            System Notifications & Broadcast Control
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium">
            Monitor real-time WhatsApp booking confirmations, 4-digit SMS OTP job closure codes, and push alerts dispatched to Varanasi fleet partners.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsBroadcastOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-brand-700 font-extrabold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Send className="w-4 h-4 text-brand-600" />
            <span>+ Broadcast New Alert</span>
          </button>
        </div>
      </div>

      {/* ─── 2. EXECUTIVE METRICS RIBBON ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Dispatched</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center border border-brand-200 dark:border-brand-800">
              <Bell className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">1,420 Alerts</p>
          <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold">100% Automated Triggers</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">WhatsApp API</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">940 Sent</p>
          <p className="text-[11px] text-emerald-600 font-bold">Instant Order Confirmations</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">SMS OTP Gateway</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">310 Codes</p>
          <p className="text-[11px] text-purple-600 font-bold">4-Digit Security Job Closures</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Fleet Push Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Radio className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">170 Dispatched</p>
          <p className="text-[11px] text-amber-600 font-bold">Varanasi Partner Fleet Alerts</p>
        </div>
      </div>

      {/* ─── 3. CHANNEL GATEWAY TOGGLES CARD ─── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-600" />
          <span>Active Gateway Channel Status & Triggers</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white block">WhatsApp Business API</span>
                <span className="text-[10px] text-slate-500 font-semibold">Live order tracking & maps</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={whatsappEnabled}
              onChange={(e) => setWhatsappEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-brand-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white block">SMS OTP Security Gateway</span>
                <span className="text-[10px] text-slate-500 font-semibold">4-digit job completion codes</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={otpSmsEnabled}
              onChange={(e) => setOtpSmsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-brand-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white block">Partner App Push Alerts</span>
                <span className="text-[10px] text-slate-500 font-semibold">Instant Varanasi job broadcasts</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={pushAlertsEnabled}
              onChange={(e) => setPushAlertsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-brand-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ─── 4. FILTER BAR & SEARCH ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {["All Logs", "WhatsApp", "SMS OTP", "Push Alerts", "High Priority"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === f
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

      {/* ─── 5. AUDIT LOGS TRAIL TABLE / CARDS ─── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
            Live System Delivery Audit Log ({filteredLogs.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400 font-bold">Auto-synced with WhatsApp Cloud API</span>
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
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors cursor-pointer"
                >
                  {copiedId === log.id ? "Resent!" : "Resend Alert"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SLIDE-OVER DRAWER: BROADCAST NEW ALERT ─── */}
      {isBroadcastOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsBroadcastOpen(false)} />
            <form
              onSubmit={handleBroadcastSubmit}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none overflow-y-auto"
            >
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">Broadcast New System Alert</h3>
                    <p className="text-[11px] text-slate-400">Send custom WhatsApp or SMS notifications to partners or customers</p>
                  </div>
                  <button type="button" onClick={() => setIsBroadcastOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Dispatch Channel *</label>
                    <select
                      value={broadcastForm.channel}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, channel: e.target.value as NotificationLogItem["channel"] })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                    >
                      <option value="WhatsApp API">WhatsApp API</option>
                      <option value="SMS OTP">SMS OTP</option>
                      <option value="Push Alert">Partner Push Alert</option>
                      <option value="System Alert">System Alert</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Recipient Target *</label>
                    <select
                      value={broadcastForm.recipientGroup}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, recipientGroup: e.target.value as NotificationLogItem["recipientRole"] })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                    >
                      <option value="Customer">Customer</option>
                      <option value="Technician Partner">Technician Fleet</option>
                      <option value="Admin">Admin Staff</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={broadcastForm.recipientPhone}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, recipientPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Alert Title / Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Split AC Maintenance Reminder"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Notification Message Content *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter message text with details..."
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs shadow-lux cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Broadcast Now</span>
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

    </div>
  );
}
