"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { varanasiLocalities } from "@/lib/mockData";
import { useTheme } from "@/context/ThemeContext";
import { useRbac, RoleType } from "@/context/RbacContext";

export function Header() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useRbac();

  const [selectedZone, setSelectedZone] = useState("All Varanasi");
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const roles: RoleType[] = [
    "Super Admin",
    "Varanasi Dispatcher",
    "Fleet Inspector",
    "Billing & Finance Manager",
    "Support Agent",
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
      title: "Weekly Payout Generated",
      desc: "₹18,400 ready for Varanasi Fleet settlement",
      time: "1 hour ago",
    },
  ];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200 shadow-xs">
      {/* Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Varanasi bookings, phone, technician..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-all font-medium"
          />
        </div>
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-3">
        {/* Role Selector Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100 transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Role: {role}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isRoleOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-3 py-1">
                Switch Admin Role
              </span>
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

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors cursor-pointer"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Varanasi Zone Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsZoneOpen(!isZoneOpen)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
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
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 relative cursor-pointer"
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

        {/* Interactive User Profile Dropdown */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-xs">
              AV
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Aman Verma</span>
              <span className="text-[9px] font-semibold text-brand-600 dark:text-brand-400">{role}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-lux">
                  AV
                </div>
                <div className="truncate text-left">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs truncate block">Aman Verma</span>
                  <span className="text-[10px] text-slate-400 truncate block font-mono">admin@helpmate.net.in</span>
                  <span className="text-[9px] font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-1.5 py-0.2 rounded border border-brand-200 dark:border-brand-800 inline-block mt-0.5">
                    {role}
                  </span>
                </div>
              </div>

              <div className="p-1 space-y-0.5 text-xs font-bold">
                <Link
                  href="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <User className="w-4 h-4 text-brand-500" />
                  <span>My Profile Account</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    localStorage.removeItem("helpmate_active_user_id");
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors font-bold text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
