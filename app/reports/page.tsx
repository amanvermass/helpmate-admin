"use client";

import { useState } from "react";
import { BarChart3, Download, Calendar, Filter, FileText } from "lucide-react";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"booking" | "revenue" | "gst" | "commission" | "refund">("booking");
  const [dateRange, setDateRange] = useState("this_month");

  const reportsSummary = [
    { title: "Total Bookings Generated", value: "1,420 Jobs", change: "+14.2% MoM", color: "border-brand-500" },
    { title: "Gross Platform Revenue", value: "₹18,45,000", change: "+18.5% MoM", color: "border-emerald-500" },
    { title: "Net GST Collected (18%)", value: "₹2,81,440", change: "+12.0% MoM", color: "border-blue-500" },
    { title: "25% Helpmate Commission", value: "₹4,61,250", change: "+15.8% MoM", color: "border-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Enterprise Financial & Operational Reports</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Export audit logs for Bookings, Revenue, GST filing, and Partner Commissions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value="this_month">This Month (July 2026)</option>
            <option value="last_month">Last Month</option>
            <option value="quarter">This Quarter (Q3)</option>
            <option value="year">FY 2026-27</option>
          </select>

          <button
            type="button"
            onClick={() => alert("Report downloaded successfully!")}
            className="px-4 py-2 bg-brand-500 text-white rounded-xl font-bold text-xs shadow-lux flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportsSummary.map((item, idx) => (
          <div key={idx} className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border-l-4 ${item.color} border border-slate-200 dark:border-slate-800 space-y-1`}>
            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{item.title}</span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{item.value}</h3>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{item.change}</span>
          </div>
        ))}
      </div>

      {/* Report Selection Sub-tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {(["booking", "revenue", "gst", "commission", "refund"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setReportType(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
              reportType === tab
                ? "bg-brand-500 text-white shadow-lux"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {tab} Report
          </button>
        ))}
      </div>

      {/* Report Summary Data Table Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white capitalize">{reportType} Breakdown (Varanasi Operations)</h3>
          <span className="text-xs text-slate-400 font-mono">Report ID: RPT-2026-0725</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Period / Date</th>
                <th className="p-3">Total Volume</th>
                <th className="p-3">Gross Amount</th>
                <th className="p-3">Tax Component</th>
                <th className="p-3">Net Revenue</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {["Week 1 (July 1-7)", "Week 2 (July 8-14)", "Week 3 (July 15-21)", "Week 4 (July 22-25)"].map((wk, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{wk}</td>
                  <td className="p-3">{350 + i * 30} Jobs</td>
                  <td className="p-3 font-semibold">₹{(420000 + i * 45000).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-blue-600 font-semibold">₹{(64000 + i * 7000).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-emerald-600 font-bold">₹{(105000 + i * 11000).toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">
                    <button type="button" onClick={() => alert("Exporting week CSV")} className="text-brand-600 font-bold hover:underline">
                      Export
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
