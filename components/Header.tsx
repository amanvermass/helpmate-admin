"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Bell,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  X,
  PhoneCall,
  Sparkles,
} from "lucide-react";
import { varanasiLocalities } from "@/lib/mockData";

export function Header() {
  const [selectedZone, setSelectedZone] = useState("All Varanasi");
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: "n-1",
      title: "New High Priority Booking",
      desc: "AC Power Jet requested at Sigra, Varanasi by Rajesh Kumar Agrawal",
      time: "2 mins ago",
      type: "booking",
    },
    {
      id: "n-2",
      title: "Technician Verified",
      desc: "Police clearance approved for Ramesh Yadav (HVAC Fleet)",
      time: "15 mins ago",
      type: "verified",
    },
    {
      id: "n-3",
      title: "Emergency Dispatch Alert",
      desc: "Short Circuit MCB trip at Bhelupur. Assigned Amit Pandey.",
      time: "42 mins ago",
      type: "urgent",
    },
  ];

  return (
    <header className="h-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Search Input */}
      <div className="flex items-center gap-6 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Varanasi bookings, customer phone, technician..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-4">
        {/* Varanasi Zone Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsZoneOpen(!isZoneOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-500/40 text-xs text-slate-700 font-semibold transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>{selectedZone}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isZoneOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                Select Varanasi Zone
              </div>
              <button
                onClick={() => {
                  setSelectedZone("All Varanasi");
                  setIsZoneOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${selectedZone === "All Varanasi"
                    ? "bg-brand-500 text-white"
                    : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                <span>All Varanasi (Entire Fleet)</span>
                {selectedZone === "All Varanasi" && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              {varanasiLocalities.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedZone(loc.name);
                    setIsZoneOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${selectedZone === loc.name
                      ? "bg-brand-500 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex flex-col">
                    <span>{loc.name}</span>
                    <span className="text-[9px] opacity-70">PIN: {loc.pincode} • {loc.activeBookings} active</span>
                  </div>
                  {selectedZone === loc.name && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live System Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow"></span>
          <span>Dispatch Engine: Active</span>
        </div>

        {/* Helpline Button */}
        <a
          href="tel:+917705004040"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 hover:text-slate-900 font-medium transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
          <span>+91 7705 004 040</span>
        </a>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-brand-500/40 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-2.5 right-2.5 ring-2 ring-white"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-brand-600" />
                  <h4 className="text-xs font-bold text-slate-900">Varanasi Live Alerts</h4>
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-all flex flex-col gap-1 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900">{n.title}</span>
                      <span className="text-[9px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-lux">
            AV
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-slate-900 leading-tight">Aman Verma</span>
            <span className="text-[9px] font-semibold text-brand-600">Super Admin</span>
          </div>

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("helpmate_admin_session");
                window.location.href = "/login";
              }
            }}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer ml-1"
            title="Log Out"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
