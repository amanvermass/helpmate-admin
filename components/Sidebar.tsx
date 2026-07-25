"use client";

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
  Code,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Settings,
  Bell,
  DollarSign,
  FileText,
  MessageSquare,
  KeyRound,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navSections = [
    {
      groupTitle: "Executive HQ",
      items: [
        {
          label: "Dashboard & KPIs",
          href: "/",
          icon: LayoutDashboard,
          badge: "Live",
          badgeColor: "bg-emerald-100 text-emerald-700 border border-emerald-300",
        },
      ],
    },
    {
      groupTitle: "Operations & Services",
      items: [
        {
          label: "Bookings & Dispatch",
          href: "/bookings",
          icon: CalendarCheck,
          badge: "48 Live",
          badgeColor: "bg-brand-500 text-white",
        },
        {
          label: "Inspection Flow",
          href: "/inspections",
          icon: KeyRound,
          badge: "Quotes",
          badgeColor: "bg-amber-100 text-amber-800 border border-amber-300",
        },
        {
          label: "Location & Service CMS",
          href: "/cms",
          icon: Wrench,
          badge: "Varanasi",
          badgeColor: "bg-blue-50 text-blue-700 border border-blue-200",
        },
      ],
    },
    {
      groupTitle: "Partner Fleet & Finance",
      items: [
        {
          label: "Technician Fleet & KYC",
          href: "/technicians",
          icon: UserCheck,
          badge: "142 Techs",
          badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        },
        {
          label: "25% Commission Ledger",
          href: "/settlements",
          icon: DollarSign,
          badge: "Weekly",
          badgeColor: "bg-slate-100 text-slate-700 border border-slate-200",
        },
        {
          label: "Billing & GST Engine",
          href: "/billing",
          icon: FileText,
          badge: "18% GST",
          badgeColor: "bg-blue-100 text-blue-800 border border-blue-200",
        },
      ],
    },
    {
      groupTitle: "Users & Communication",
      items: [
        {
          label: "User & Access Management",
          href: "/customers",
          icon: Users,
          badge: null,
        },
        {
          label: "Notifications & WhatsApp",
          href: "/notifications",
          icon: MessageSquare,
          badge: "API Active",
          badgeColor: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        },
      ],
    },
    {
      groupTitle: "Admin & System Capabilities",
      items: [
        {
          label: "RBAC & Security Logs",
          href: "/rbac",
          icon: ShieldCheck,
          badge: null,
        },
        {
          label: "Media & Banner Assets",
          href: "/media",
          icon: FileImage,
          badge: null,
        },
        {
          label: "Admin Settings & Backup",
          href: "/settings",
          icon: Settings,
          badge: null,
        },
        {
          label: "API Docs & Webhooks",
          href: "/api-docs",
          icon: Code,
          badge: "v2.4",
          badgeColor: "bg-slate-100 text-slate-600 border border-slate-200",
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30 shadow-sm">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="https://helpmate-theta.vercel.app/logo.png"
              alt="HelpMate Logo"
              className="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">HelpMate</span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 px-1.5 py-0.5 rounded border border-brand-200">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500">Varanasi Enterprise HQ</span>
            </div>
          </Link>
        </div>

        {/* Varanasi Hub Badge */}
        <div className="px-4 pt-4 pb-2">
          <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-900 leading-tight">Varanasi Central</span>
                <span className="text-[9px] text-slate-500">8 Active Zones (Sigra, Lanka...)</span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow shrink-0"></span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-4 space-y-5 flex-1">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                {section.groupTitle}
              </span>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                      isActive
                        ? "bg-brand-500 text-white shadow-lux"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-brand-600"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isActive ? "text-white translate-x-0.5" : "text-slate-400 opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Guarantee Card */}
        <div className="p-4 mt-auto border-t border-slate-200">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-slate-900">Varanasi Guarantee</span>
              <p className="text-[10px] text-slate-500 leading-normal">
                142 Fleet Technicians Verified via Aadhaar & Police Records. Insured up to ₹10,000.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
