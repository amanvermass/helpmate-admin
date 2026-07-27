"use client";

import { useState } from "react";
import { User, Key, ShieldCheck, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { useRbac } from "@/context/RbacContext";

export default function ProfilePage() {
  const { role } = useRbac();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const [name, setName] = useState("Aman Verma");
  const [email, setEmail] = useState("aman.verma@helpmate.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lux">
            AV
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{name}</h1>
            <p className="text-xs text-brand-600 dark:text-brand-400 font-bold">{role} • Varanasi Operations HQ</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "profile" ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs" : "text-slate-500"
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "password" ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs" : "text-slate-500"
            }`}
          >
            Change Password
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {activeTab === "profile" ? (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-xs">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Account Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Helpline</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Office Zone</label>
              <input
                type="text"
                value="Varanasi Head Office, Sigra"
                disabled
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lux hover:bg-brand-600">
              Save Account Profile
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSaveProfile} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-xs">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Security Credentials</h3>
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-brand-500 text-white font-bold text-xs rounded-xl shadow-lux hover:bg-brand-600">
              Update Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
