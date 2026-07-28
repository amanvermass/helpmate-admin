"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("helpmate_admin_session");
      if (session === "true") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(true); // Default active for seamless enterprise navigation preview
      }
    }
  }, [pathname, router]);

  // Standalone Login Page
  if (pathname === "/login") {
    return <main className="min-h-screen bg-slate-50 dark:bg-slate-950">{children}</main>;
  }

  return (
    <div className="min-h-screen flex antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
