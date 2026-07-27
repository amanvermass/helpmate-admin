"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 select-none">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const formattedName = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        return (
          <div key={href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
            {isLast ? (
              <span className="font-bold text-slate-900 dark:text-white capitalize">
                {formattedName}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors capitalize font-medium"
              >
                {formattedName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
