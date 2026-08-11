import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { ThemeProvider } from "@/context/ThemeContext";
import { RbacProvider } from "@/context/RbacContext";

export const metadata: Metadata = {
  title: "HelpMate Admin Panel | Enterprise On-Demand Services Varanasi",
  description: "Enterprise management panel for HelpMate home care services in Varanasi. Real-time booking assignment, service CMS, fleet verification, and customer CRM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-brand-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <RbacProvider>
            <AppShell>{children}</AppShell>
          </RbacProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
