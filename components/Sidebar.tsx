"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Wrench,
  Users,
  ShieldCheck,
  UserCheck,
  FileImage,
  Settings,
  DollarSign,
  FileText,
  MessageSquare,
  Tag,
  Star,
  BarChart3,
  CreditCard,
  Building2,
  Sliders,
  Search,
  ChevronDown,
  TrendingUp,
  CheckCircle2,
  X,
} from "lucide-react";
import { useRbac } from "@/context/RbacContext";
import { Portal } from "@/components/Portal";

interface SubItem {
  label: string;
  href: string;
  icon: any;
}

interface NavItem {
  title: string;
  icon: any;
  href?: string;
  badge?: string;
  subItems?: SubItem[];
}

interface NavSection {
  sectionTitle: string;
  items: NavItem[];
}

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useRbac();
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(
    ["/settings", "/reports", "/analytics", "/notifications", "/reviews"].some(
      (path) => pathname === path || pathname.startsWith(path)
    )
  );

  const isPartner = role === "Service Partner";

  const partnerNavSections: NavSection[] = [
    {
      sectionTitle: "Partner Portal",
      items: [
        {
          title: "My Dashboard",
          icon: LayoutDashboard,
          href: "/partner",
        },
      ],
    },
    {
      sectionTitle: "My Jobs & Orders",
      items: [
        {
          title: "New Booked Jobs",
          icon: CalendarCheck,
          href: "/partner/bookings",
          badge: "2 New",
        },
      ],
    },
    {
      sectionTitle: "My Catalog & Rates",
      items: [
        {
          title: "Assigned Services",
          icon: Wrench,
          href: "/partner/services",
        },
      ],
    },
    {
      sectionTitle: "Earnings & Wallet",
      items: [
        {
          title: "Payouts & Commission",
          icon: DollarSign,
          href: "/partner/payouts",
        },
      ],
    },
    {
      sectionTitle: "My Account",
      items: [
        {
          title: "Partner Profile & KYC",
          icon: ShieldCheck,
          href: "/partner/profile",
        },
      ],
    },
  ];

  const adminNavSections: NavSection[] = [
    {
      sectionTitle: "Overview",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          href: "/",
        },
      ],
    },
    {
      sectionTitle: "Operations",
      items: [
        {
          title: "Bookings",
          icon: CalendarCheck,
          href: "/bookings",
        },
        {
          title: "Inspections",
          icon: Wrench,
          href: "/inspections",
        },
      ],
    },
    {
      sectionTitle: "Fleet & Customers",
      items: [
        {
          title: "Customers",
          icon: Users,
          href: "/customers",
        },
        {
          title: "Partner Fleet",
          icon: UserCheck,
          href: "/technicians",
        },
      ],
    },
    {
      sectionTitle: "Services & Pricing",
      items: [
        {
          title: "Category Catalog",
          icon: Sliders,
          href: "/categories",
        },
        {
          title: "Services CMS",
          icon: Wrench,
          href: "/cms",
        },
        {
          title: "Pricing Engine",
          icon: Tag,
          href: "/pricing",
        },
        {
          title: "Locations & Pincodes",
          icon: Building2,
          href: "/locations",
        },
      ],
    },
    {
      sectionTitle: "Finance & Billing",
      items: [
        {
          title: "Payments",
          icon: CreditCard,
          href: "/payments",
        },
        {
          title: "Billing & GST",
          icon: FileText,
          href: "/billing",
        },
        {
          title: "Commission & Settlements",
          icon: DollarSign,
          href: "/settlements",
        },
        {
          title: "Coupons",
          icon: Tag,
          href: "/coupons",
        },
      ],
    },
    {
      sectionTitle: "System & Admin",
      items: [
        {
          title: "User Management & RBAC",
          icon: ShieldCheck,
          href: "/users",
        },
        {
          title: "Media Library",
          icon: FileImage,
          href: "/media",
        },
        {
          title: "Settings & Analytics",
          icon: Settings,
          subItems: [
            { label: "General Settings", href: "/settings", icon: Settings },
            { label: "Reports & Exports", href: "/reports", icon: BarChart3 },
            { label: "Executive Analytics", href: "/analytics", icon: TrendingUp },
            { label: "System Notifications", href: "/notifications", icon: MessageSquare },
            { label: "Customer Reviews", href: "/reviews", icon: Star },
          ],
        },
      ],
    },
  ];

  const currentNavSections = isPartner ? partnerNavSections : adminNavSections;

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full select-none">
      {/* Fixed Header Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900 z-10">
        <Link
          href={isPartner ? "/partner" : "/"}
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <img
            src="https://helpmate-theta.vercel.app/logo.png"
            alt="HelpMate Logo"
            className="h-7 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">HelpMate</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                  isPartner
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : "bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border-brand-200 dark:border-brand-800"
                }`}
              >
                {isPartner ? "PARTNER" : "ADMIN"}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              {isPartner ? "Varanasi Fleet" : "Varanasi HQ"}
            </span>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="Search menu..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Scrollable Navigation Menu */}
      <nav className="p-3 space-y-4 flex-1 overflow-y-auto">
        {currentNavSections.map((section, secIdx) => {
          const filteredItems = section.items.filter((item) => {
            if (!sidebarSearch.trim()) return true;
            if (item.title.toLowerCase().includes(sidebarSearch.toLowerCase())) return true;
            if (item.subItems?.some((sub) => sub.label.toLowerCase().includes(sidebarSearch.toLowerCase()))) return true;
            return false;
          });

          if (filteredItems.length === 0) return null;

          return (
            <div key={secIdx} className="space-y-1">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                {section.sectionTitle}
              </span>

              {filteredItems.map((item) => {
                const Icon = item.icon;

                if (item.subItems) {
                  const isSubActive = item.subItems.some((sub) => pathname === sub.href);

                  return (
                    <div key={item.title} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                          isSubActive
                            ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800"
                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isSubActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400 group-hover:text-brand-600"
                            }`}
                          />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                            isSettingsOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {(isSettingsOpen || sidebarSearch.trim().length > 0) && (
                        <div className="pl-6 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-3">
                          {item.subItems.map((sub) => {
                            const SubIcon = sub.icon;
                            const isActive = pathname === sub.href;

                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={onCloseMobile}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  isActive
                                    ? "bg-brand-500 text-white font-bold shadow-lux"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                }`}
                              >
                                <SubIcon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                <span>{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive =
                  item.href === "/" || item.href === "/partner"
                    ? pathname === item.href
                    : pathname.startsWith(item.href || "");

                return (
                  <Link
                    key={item.href || item.title}
                    href={item.href || "#"}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-brand-500 text-white shadow-lux"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400"
                        }`}
                      />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Role Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                {isPartner ? "Partner Account" : "Role"}
              </span>
              <span className="text-[9px] text-brand-600 dark:text-brand-400 font-extrabold">{role}</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on screens < 1024px) */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col h-screen sticky top-0 shrink-0 select-none z-30 shadow-xs transition-colors duration-200">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer (visible when isMobileOpen is true) */}
      {isMobileOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] lg:hidden bg-slate-950/70 backdrop-blur-xs flex justify-start outline-none animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onCloseMobile} />
            <div className="relative z-10 w-72 bg-white dark:bg-slate-900 h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 animate-in slide-in-from-left duration-300 outline-none">
              {renderSidebarContent()}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
