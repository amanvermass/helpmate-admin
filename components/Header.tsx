"use client";

import { useState, useRef, useEffect } from "react";
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
  Wrench,
  DollarSign,
  CalendarCheck,
  Menu,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { varanasiLocalities } from "@/lib/mockData";
import { useTheme } from "@/context/ThemeContext";
import { useRbac, RoleType } from "@/context/RbacContext";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useRbac();

  const [selectedZone, setSelectedZone] = useState("All Varanasi");
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  // Close all open dropdowns when user clicks outside the header
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsRoleOpen(false);
        setIsZoneOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isPartner = role === "Service Partner";

  const adminRoles: RoleType[] = [
    "Super Admin",
    "Varanasi Operations Coordinator",
    "Fleet Inspector",
    "Billing & Finance Manager",
    "Support Agent",
  ];

  const notifications = [
    {
      id: "n-1",
      jobStatus: "Assigned",
      title: isPartner ? "New Assigned Booking #BK-VAR-8821" : "Job #BK-VAR-8821 Assigned",
      desc: isPartner
        ? "Split AC Power Jet requested at Sigra, Varanasi (Customer: Rajesh Agrawal)"
        : "Assigned Ramesh Yadav to Split AC Jet Wash at Sigra, Varanasi",
      time: "2 mins ago",
    },
    {
      id: "n-2",
      jobStatus: "En Route",
      title: "Partner En Route to Location",
      desc: "Partner Ramesh Yadav is traveling to customer site at Sigra, Varanasi (Est. arrival: 12 mins)",
      time: "8 mins ago",
    },
    {
      id: "n-3",
      jobStatus: "In Progress",
      title: "Work Started on Site",
      desc: "Partner reached site and started Split AC Foam Jet Wash for Alok Verma (#BK-VAR-8819)",
      time: "20 mins ago",
    },
    {
      id: "n-4",
      jobStatus: "Completed",
      title: "Job Completed & OTP Verified",
      desc: "4-Digit closure OTP 8821 verified for Sunita Devi. Receipt generated.",
      time: "35 mins ago",
    },
  ];

  return (
    <header ref={headerRef} style={{ minHeight: "4rem", height: "4rem" }} className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200 shadow-xs">
      {/* Mobile Hamburger & Header Breadcrumbs Navigation */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open Mobile Menu"
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0 overflow-hidden">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Role Selector Badge - HIDDEN on Mobile (< md breakpoint) */}
        {!isPartner ? (
          <div className="hidden md:block relative">
            <button
              type="button"
              onClick={() => {
                setIsRoleOpen(!isRoleOpen);
                setIsZoneOpen(false);
                setIsNotificationsOpen(false);
                setIsProfileOpen(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Role: {role}</span>
              <ChevronDown className="w-3 h-3 shrink-0" />
            </button>

            {isRoleOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-3 py-1">
                  Switch Admin Role
                </span>
                {adminRoles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRole(r);
                      setIsRoleOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${role === r
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
        ) : (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Partner Portal</span>
          </div>
        )}

        {/* Varanasi Zone Filter - HIDDEN on Mobile (< md breakpoint) */}
        <div className="hidden md:block relative">
          <button
            type="button"
            onClick={() => {
              setIsZoneOpen(!isZoneOpen);
              setIsRoleOpen(false);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>{selectedZone}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
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

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors cursor-pointer shrink-0"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700 dark:text-slate-200" />}
        </button>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsRoleOpen(false);
              setIsZoneOpen(false);
              setIsProfileOpen(false);
            }}
            className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 relative cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-in zoom-in-95 duration-150 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Live Operations Alerts</h4>
                  <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white font-extrabold text-[10px]">
                    3 New
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-[10px] font-bold text-slate-400 hover:text-brand-600 underline"
                  >
                    Mark read
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-left space-y-1 hover:border-brand-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                          n.jobStatus === "Assigned"
                            ? "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800"
                            : n.jobStatus === "En Route"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                            : n.jobStatus === "In Progress"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                            : n.jobStatus === "Completed"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                        }`}
                      >
                        {n.jobStatus || "ORDER UPDATE"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white block leading-tight">
                      {n.title}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/notifications"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-extrabold text-xs text-center block transition-colors"
                >
                  View All System Alerts & Broadcast Logs →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsRoleOpen(false);
              setIsZoneOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div
              className={`w-7 sm:w-8 h-7 sm:h-8 rounded-xl ${isPartner
                  ? "bg-gradient-to-tr from-emerald-600 to-teal-600"
                  : "bg-gradient-to-tr from-brand-600 to-purple-600"
                } flex items-center justify-center font-bold text-white text-xs shadow-xs`}
            >
              {isPartner ? "RY" : "AV"}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {isPartner ? "Ramesh Yadav" : "Aman Verma"}
              </span>
              <span className="text-[9px] font-semibold text-brand-600 dark:text-brand-400">{role}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-60 sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl ${isPartner ? "bg-emerald-600" : "bg-brand-500"
                    } text-white font-black text-sm flex items-center justify-center shrink-0 shadow-lux`}
                >
                  {isPartner ? "RY" : "AV"}
                </div>
                <div className="truncate text-left">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs truncate block">
                    {isPartner ? "Ramesh Yadav" : "Aman Verma"}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block font-mono">
                    {isPartner ? "ramesh.hvac@helpmate.in" : "admin@helpmate.net.in"}
                  </span>
                  <span className="text-[9px] font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-1.5 py-0.2 rounded border border-brand-200 dark:border-brand-800 inline-block mt-0.5">
                    {role}
                  </span>
                </div>
              </div>

              <div className="p-1 space-y-0.5 text-xs font-bold">
                {isPartner ? (
                  <>
                    <Link
                      href="/partner"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-600 transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-500" />
                      <span>Partner Dashboard</span>
                    </Link>

                    <Link
                      href="/partner/bookings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4 text-brand-500" />
                      <span>My Assigned Jobs</span>
                    </Link>

                    <Link
                      href="/partner/services"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Wrench className="w-4 h-4 text-purple-500" />
                      <span>My Services & Rates</span>
                    </Link>

                    <Link
                      href="/partner/payouts"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span>My Earnings & Wallet</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setRole("Super Admin");
                        router.push("/");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors font-bold text-left cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-purple-500" />
                      <span>Switch to Admin Portal</span>
                    </button>
                  </>
                ) : (
                  <>
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
                        setRole("Service Partner");
                        router.push("/partner");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors font-bold text-left cursor-pointer"
                    >
                      <Wrench className="w-4 h-4 text-emerald-500" />
                      <span>Switch to Partner Portal</span>
                    </button>
                  </>
                )}

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
                  <span>Log Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
