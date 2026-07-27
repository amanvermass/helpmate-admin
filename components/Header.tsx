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
  Sun,
  Moon,
  UserCheck,
} from "lucide-react";
import { varanasiLocalities } from "@/lib/mockData";
import { useTheme } from "@/context/ThemeContext";
import { useRbac, RoleType } from "@/context/RbacContext";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useRbac();

  const [selectedZone, setSelectedZone] = useState("All Varanasi");
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const roles: RoleType[] = [
    "Super Admin",
    "Admin",
    "Operations Manager",
    "Finance",
    "Support",
    "City Manager",
  ];

  const notifications = [
    {
      id: "n-1",
      title: "New High Priority Booking",
      desc: "AC Power Jet requested at Sigra, Varanasi by Rajesh Kumar Agrawal",
      time: "2 mins ago",
    },
    {
      id: "n-2",
      title: "Technician Verified",
      desc: "Police clearance approved for Ramesh Yadav (HVAC Fleet)",
      time: "15 mins ago",
    },
    {
      id: "n-3",
      title: "Emergency Dispatch Alert",
      desc: "Short Circuit MCB trip at Bhelupur. Assigned Amit Pandey.",
      time: "42 mins ago",
    },
  ];

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-6 md:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs transition-colors duration-200">
      {/* Search Bar */}
      <div className="flex items-center gap-6 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Varanasi bookings, phone, technician..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex items-center gap-3">
        {/* RBAC Role Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-brand-500/50 transition-all"
            title="Switch Active RBAC Role"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="hidden sm:inline">Role:</span>
            <span className="text-brand-600 dark:text-brand-400 font-extrabold">{role}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 animate-in fade-in duration-150">
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                Select Active RBAC Role
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setIsRoleOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    role === r
                      ? "bg-brand-500 text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Light / Dark Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Varanasi Zone Dropdown */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setIsZoneOpen(!isZoneOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span>{selectedZone}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isZoneOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50">
              <button
                type="button"
                onClick={() => {
                  setSelectedZone("All Varanasi");
                  setIsZoneOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                All Varanasi (Entire Fleet)
              </button>
              {varanasiLocalities.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    setSelectedZone(loc.name);
                    setIsZoneOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {loc.name} ({loc.pincode})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Live System Alerts</h4>
                <button type="button" onClick={() => setIsNotificationsOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left space-y-0.5">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block">{n.title}</span>
                    <p className="text-[10px] text-slate-500 leading-tight">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
            AV
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Aman Verma</span>
            <span className="text-[9px] font-semibold text-brand-600 dark:text-brand-400">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
