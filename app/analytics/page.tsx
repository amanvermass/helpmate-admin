"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Users, UserCheck, Wrench, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
  const [activeMetric, setActiveMetric] = useState<"revenue" | "customer" | "partner" | "service">("revenue");

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Executive Analytics Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Deep-dive visual charts and operational performance metrics for Varanasi</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(["revenue", "customer", "partner", "service"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setActiveMetric(m)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeMetric === m
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual Chart Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white capitalize">{activeMetric} Velocity & Growth Trend</h3>
              <p className="text-xs text-slate-400">Real-time daily telemetry across Varanasi service zones</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +24.8% YoY
            </span>
          </div>

          {/* Synthetic Visual Chart Bars */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 px-4 border-b border-slate-100 dark:border-slate-800">
            {[45, 60, 52, 78, 85, 92, 70, 88, 95, 110, 105, 125].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div
                  style={{ height: `${h}%` }}
                  className="w-full bg-gradient-to-t from-brand-600 to-purple-500 rounded-t-lg group-hover:brightness-110 transition-all relative"
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-0.5 px-1.5 rounded whitespace-nowrap">
                    ₹{h * 1000}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400">M{i + 1}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Peak Single Day</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block mt-0.5">₹1,25,000</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Order Basket</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white block mt-0.5">₹1,380</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Repeat Customer Rate</span>
              <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400 block mt-0.5">64.2%</span>
            </div>
          </div>
        </div>

        {/* Top Demands Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Top Services by Revenue</h3>
          <div className="space-y-3">
            {[
              { name: "AC Master Servicing (Power Jet)", share: "38%", amount: "₹6,90,000" },
              { name: "Full Home Deep Cleaning", share: "24%", amount: "₹4,32,000" },
              { name: "Short Circuit & MCB Wiring", share: "18%", amount: "₹3,24,000" },
              { name: "RO Water Filter Installation", share: "12%", amount: "₹2,16,000" },
              { name: "Bathroom Plumber Repair", share: "8%", amount: "₹1,44,000" },
            ].map((svc, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>{svc.name}</span>
                  <span>{svc.amount}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: svc.share }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
