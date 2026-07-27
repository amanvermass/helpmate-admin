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
  User,
  Search,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { useRbac } from "@/context/RbacContext";

interface NavItem {
  title: string;
  icon: any;
  href: string;
  badge?: string;
  subItems?: { label: string; href: string }[];
}

interface NavSection {
  sectionTitle: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRbac();
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const navSections: NavSection[] = [
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
      sectionTitle: "Analytics & Communication",
      items: [
        {
          title: "Reports",
          icon: BarChart3,
          href: "/reports",
        },
        {
          title: "Analytics",
          icon: TrendingUp,
          href: "/analytics",
        },
        {
          title: "Notifications",
          icon: MessageSquare,
          href: "/notifications",
        },
        {
          title: "Reviews",
          icon: Star,
          href: "/reviews",
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
          title: "Settings",
          icon: Settings,
          href: "/settings",
        },
        {
          title: "Profile",
          icon: User,
          href: "/profile",
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30 shadow-xs transition-colors duration-200">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Header Logo */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="https://helpmate-theta.vercel.app/logo.png"
              alt="HelpMate Logo"
              className="h-7 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">HelpMate</span>
                <span className="text-[9px] font-bold bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 px-1 py-0.2 rounded border border-brand-200 dark:border-brand-800">
                  ADMIN
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Varanasi HQ</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Quick Filter */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search menu..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Clean Menu List */}
        <nav className="p-3 space-y-4 flex-1">
          {navSections.map((section, secIdx) => {
            const filteredItems = section.items.filter((item) => {
              if (!sidebarSearch.trim()) return true;
              return item.title.toLowerCase().includes(sidebarSearch.toLowerCase());
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={secIdx} className="space-y-1">
                <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                  {section.sectionTitle}
                </span>

                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
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

        {/* Footer Role Badge */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">Role</span>
                <span className="text-[9px] text-brand-600 dark:text-brand-400 font-extrabold">{role}</span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          </div>
        </div>
      </div>
    </aside>
  );
}
