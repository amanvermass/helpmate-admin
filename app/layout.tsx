import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/context/ThemeContext";
import { RbacProvider } from "@/context/RbacContext";

import { ToastContainer } from "@/components/Toast";
import { TopProgressBar } from "@/components/TopProgressBar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "HelpMate Admin Panel | Enterprise On-Demand Services Varanasi",
  description: "Enterprise management panel for HelpMate home care services in Varanasi. Real-time booking assignment, service CMS, partner verification, and customer CRM.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-brand-500 selection:text-white transition-colors duration-200">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <ThemeProvider>
          <RbacProvider>
            <AppShell>{children}</AppShell>
            <ToastContainer />
          </RbacProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
