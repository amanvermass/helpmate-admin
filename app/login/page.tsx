"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  KeyRound,
  Wrench,
  UserCheck,
} from "lucide-react";
import { useRbac } from "@/context/RbacContext";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRbac();

  // Login Mode State: "super_admin" | "office_admin" | "partner"
  const [loginMode, setLoginMode] = useState<"super_admin" | "office_admin" | "partner">("super_admin");

  // Form State
  const [email, setEmail] = useState("admin@helpmate.net.in");
  const [password, setPassword] = useState("helpmate2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Loading & Error State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("helpmate_admin_session", "true");

      if (loginMode === "partner" || email.toLowerCase().includes("partner") || email.toLowerCase().includes("ramesh")) {
        setRole("Service Partner");
        router.push("/partner");
      } else if (loginMode === "office_admin" || email.toLowerCase().includes("office")) {
        setRole("Office Admin");
        router.push("/");
      } else {
        setRole("Super Admin");
        router.push("/");
      }
    }, 600);
  };

  const switchMode = (mode: "super_admin" | "office_admin" | "partner") => {
    setLoginMode(mode);
    setErrorMessage("");
    if (mode === "partner") {
      setEmail("ramesh.hvac@helpmate.in");
      setPassword("partner2026");
    } else if (mode === "office_admin") {
      setEmail("office.admin@helpmate.in");
      setPassword("office123");
    } else {
      setEmail("admin@helpmate.net.in");
      setPassword("helpmate2026");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-brand-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Project Logo & Header */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm inline-block">
            <img
              src="https://helpmate-theta.vercel.app/logo.png"
              alt="HelpMate Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">HelpMate Portal</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 px-2 py-0.5 rounded border border-brand-200">
              Varanasi HQ
            </span>
          </div>

          <p className="text-xs text-slate-500 max-w-xs">
            Select your account type or sign in with your ID & password.
          </p>
        </div>

        {/* Portal Type Switcher Tabs (Super Admin / Office Admin / Partner) */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-200/80 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => switchMode("super_admin")}
            className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${loginMode === "super_admin"
              ? "bg-white text-brand-600 shadow-sm font-black"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Super Admin</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode("office_admin")}
            className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${loginMode === "office_admin"
              ? "bg-white text-purple-700 shadow-sm font-black"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Office Admin</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode("partner")}
            className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${loginMode === "partner"
              ? "bg-white text-emerald-700 shadow-sm font-black"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-600" />
            <span>Partner</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Active Mode Info Badge */}
          <div
            className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between border ${loginMode === "partner"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : loginMode === "office_admin"
                ? "bg-purple-50 text-purple-800 border-purple-200"
                : "bg-brand-50 text-brand-800 border-brand-200"
              }`}
          >
            <span>
              {loginMode === "partner"
                ? "🔑 Service Partner Login (Ramesh Yadav)"
                : loginMode === "office_admin"
                  ? "🔑 Office Admin Desk (Dashboard, Bookings, Finance & Billing)"
                  : "🔑 Super Admin HQ (Full System Access)"}
            </span>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Single Password Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {loginMode === "partner" ? "Partner Email / Phone" : "Email or Admin ID"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={loginMode === "partner" ? "ramesh.hvac@helpmate.in" : "admin@helpmate.net.in"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl ${loginMode === "partner"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : loginMode === "office_admin"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-brand-600 hover:bg-brand-700"
                } text-white font-extrabold text-xs shadow-lux flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating Credentials...</span>
                </>
              ) : (
                <>
                  <span>
                    Sign In To {loginMode === "partner" ? "Partner Portal" : loginMode === "office_admin" ? "Office Admin Desk" : "Super Admin HQ"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
