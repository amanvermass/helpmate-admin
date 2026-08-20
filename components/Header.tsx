"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  Calendar,
  FileText,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { varanasiLocalities, initialBookings, initialCustomers, initialTechnicians } from "@/lib/mockData";
import { useTheme } from "@/context/ThemeContext";
import { useRbac, RoleType } from "@/context/RbacContext";
import { Portal } from "@/components/Portal";

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useRbac();

  const [selectedZone, setSelectedZone] = useState("All Varanasi");
  const [isZoneOpen, setIsZoneOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const headerRef = useRef<HTMLElement>(null);

  // Close all open dropdowns when user clicks outside the header
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsZoneOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute global search matches across Bookings, Customers, Partners, and Invoices
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return { bookings: [], customers: [], technicians: [], invoices: [] };

    // 1. Match Bookings
    const matchedBookings = initialBookings
      .filter((b) => {
        const bId = (b.id || "").toLowerCase();
        const cust = (b.customerName || "").toLowerCase();
        const phone = (b.customerPhone || "").toLowerCase();
        const service = (b.serviceTitle || b.serviceName || "").toLowerCase();
        const tech = (b.technicianName || "").toLowerCase();
        const category = (b.category || "").toLowerCase();
        return bId.includes(q) || cust.includes(q) || phone.includes(q) || service.includes(q) || tech.includes(q) || category.includes(q);
      })
      .slice(0, 4);

    // 2. Match Customers
    const matchedCustomers = initialCustomers
      .filter((c) => {
        const name = (c.name || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const locality = (c.locality || "").toLowerCase();
        const cId = (c.id || "").toLowerCase();
        return name.includes(q) || phone.includes(q) || email.includes(q) || locality.includes(q) || cId.includes(q);
      })
      .slice(0, 4);

    // 3. Match Technicians / Partners
    const matchedTechnicians = initialTechnicians
      .filter((t) => {
        const name = (t.name || "").toLowerCase();
        const category = (t.category || "").toLowerCase();
        const phone = (t.phone || "").toLowerCase();
        const locality = (t.locality || "").toLowerCase();
        const role = (t.role || "").toLowerCase();
        const tId = (t.id || "").toLowerCase();
        return name.includes(q) || category.includes(q) || phone.includes(q) || locality.includes(q) || role.includes(q) || tId.includes(q);
      })
      .slice(0, 4);

    // 4. Match Invoices & Billing
    const matchedInvoices = initialBookings
      .filter((b) => {
        const invId = `inv-${(b.id || "").replace(/^(bk-)?/gi, "")}`.toLowerCase();
        const origId = (b.id || "").toLowerCase();
        const service = (b.serviceTitle || "").toLowerCase();
        const cust = (b.customerName || "").toLowerCase();
        const total = `${b.totalAmount || ""}`;
        return invId.includes(q) || (q.startsWith("inv") && origId.includes(q.replace(/^inv-?/i, ""))) || service.includes(q) || cust.includes(q) || total.includes(q);
      })
      .slice(0, 4);

    return {
      bookings: matchedBookings,
      customers: matchedCustomers,
      technicians: matchedTechnicians,
      invoices: matchedInvoices,
    };
  }, [searchQuery]);

  const totalResultsCount =
    searchResults.bookings.length +
    searchResults.customers.length +
    searchResults.technicians.length +
    searchResults.invoices.length;

  const isPartner = role === "Service Partner";

  const adminRoles: RoleType[] = [
    "Super Admin",
    "Office Admin",
    "Varanasi Operations Coordinator",
    "Quality Inspector",
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
    <header ref={headerRef} style={{ minHeight: "4rem", height: "4rem" }} className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-50 transition-colors duration-200 shadow-xs">
      {/* Mobile Hamburger & Header Breadcrumbs Navigation */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 max-w-[35%] sm:max-w-[25%] lg:max-w-[30%] min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open Mobile Menu"
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0 overflow-hidden hidden md:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md lg:max-w-xl mx-2 sm:mx-6 relative hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search customer, partner, booking ID, invoice..."
            className="w-full pl-10 pr-16 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-xs"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 pointer-events-none shadow-2xs">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Global Search Results Popup */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50 max-h-[75vh] overflow-y-auto animate-in fade-in duration-150 p-3 space-y-4">
            
            {/* Header info */}
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider">
                Global Matches ({totalResultsCount})
              </span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px] font-bold cursor-pointer"
              >
                Close (Esc)
              </button>
            </div>

            {totalResultsCount === 0 ? (
              <div className="p-6 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  No matches found for &quot;{searchQuery}&quot;
                </p>
                <p className="text-[11px] text-slate-400">
                  Try searching by Booking ID (e.g. HM-VAR-8821), Customer Name, Mobile Number, or Partner Name.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Bookings Results */}
                {searchResults.bookings.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="px-2 text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> Bookings & Jobs ({searchResults.bookings.length})
                    </div>
                    {searchResults.bookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          router.push(`/bookings/${b.id}`);
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between gap-3 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                              {b.id}
                            </span>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                              {b.customerName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{b.serviceTitle || b.serviceName}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Customers Results */}
                {searchResults.customers.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="px-2 text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3 h-3" /> Customers ({searchResults.customers.length})
                    </div>
                    {searchResults.customers.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          router.push(`/customers/${c.id}`);
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between gap-3 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                              {c.name}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-slate-400">
                              ({c.id})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">{c.phone} • {c.locality}, Varanasi</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                          Profile
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Service Partners / Technicians Results */}
                {searchResults.technicians.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="px-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-3 h-3" /> Service Partners ({searchResults.technicians.length})
                    </div>
                    {searchResults.technicians.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          router.push(`/technicians/${t.id}`);
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between gap-3 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                              {t.name}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              ★ {t.rating}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{t.category} • {t.locality}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Invoices & Billing Results */}
                {searchResults.invoices.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="px-2 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3 h-3" /> Invoices & Billing ({searchResults.invoices.length})
                    </div>
                    {searchResults.invoices.map((inv) => (
                      <div
                        key={`inv-${inv.id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          router.push(`/billing/${inv.id}`);
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between gap-3 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              INV-{inv.id.replace(/^(bk-)?/gi, "").toUpperCase()}
                            </span>
                            <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                              {inv.customerName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{inv.serviceTitle}</p>
                        </div>
                        <span className="font-mono font-extrabold text-xs text-slate-900 dark:text-white shrink-0">
                          ₹{(inv.totalAmount || 873).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Mobile Search Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileSearchOpen(true)}
          className="sm:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
        >
          <Search className="w-4 h-4" />
        </button>
        {/* Varanasi Zone Filter - HIDDEN on Mobile (< md breakpoint) */}
        <div className="hidden md:block relative">
          <button
            type="button"
            onClick={() => {
              setIsZoneOpen(!isZoneOpen);
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
                All Varanasi (All Partners)
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
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
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
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Modal Overlay */}
      {isMobileSearchOpen && (
        <Portal>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex flex-col p-4 sm:hidden animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Global Search
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customer, partner, booking ID..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {totalResultsCount === 0 && searchQuery.trim() !== "" ? (
                  <div className="p-6 text-center space-y-2">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      No matches found for &quot;{searchQuery}&quot;
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Bookings */}
                    {searchResults.bookings.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-brand-600 uppercase flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Bookings ({searchResults.bookings.length})
                        </div>
                        {searchResults.bookings.map((b) => (
                          <div
                            key={`m-${b.id}`}
                            onClick={() => {
                              setIsMobileSearchOpen(false);
                              setSearchQuery("");
                              router.push(`/bookings/${b.id}`);
                            }}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs cursor-pointer"
                          >
                            <div>
                              <span className="font-mono font-bold text-brand-600 block">{b.id}</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{b.customerName}</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700">{b.status}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Customers */}
                    {searchResults.customers.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-purple-600 uppercase flex items-center gap-1">
                          <User className="w-3 h-3" /> Customers ({searchResults.customers.length})
                        </div>
                        {searchResults.customers.map((c) => (
                          <div
                            key={`m-${c.id}`}
                            onClick={() => {
                              setIsMobileSearchOpen(false);
                              setSearchQuery("");
                              router.push(`/customers/${c.id}`);
                            }}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs cursor-pointer"
                          >
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-white block">{c.name}</span>
                              <span className="text-[11px] text-slate-500 font-mono">{c.phone}</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">Profile</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Partners */}
                    {searchResults.technicians.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1">
                          <Wrench className="w-3 h-3" /> Partners ({searchResults.technicians.length})
                        </div>
                        {searchResults.technicians.map((t) => (
                          <div
                            key={`m-${t.id}`}
                            onClick={() => {
                              setIsMobileSearchOpen(false);
                              setSearchQuery("");
                              router.push(`/technicians/${t.id}`);
                            }}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs cursor-pointer"
                          >
                            <div>
                              <span className="font-extrabold text-slate-900 dark:text-white block">{t.name}</span>
                              <span className="text-[11px] text-slate-500">{t.category}</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{t.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </header>
  );
}
