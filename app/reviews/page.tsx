"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialReviews, ReviewItem } from "@/lib/mockData";
import { Star, MessageSquare, CheckCircle2, ShieldCheck, Award } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [activeTab, setActiveTab] = useState<"customer" | "partner">("customer");

  const avgRating = (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / (reviews.length || 1)).toFixed(1);
  const approvedCount = reviews.filter((r) => r.status === "Approved").length;

  const columns: Column<ReviewItem>[] = [
    { key: "reviewerName", header: "Reviewer", sortable: true },
    { key: "reviewerType", header: "Type", sortable: true },
    { key: "targetName", header: "Target Service / Partner", sortable: true },
    {
      key: "rating",
      header: "Rating",
      accessor: (row) => (
        <div className="flex items-center gap-1 text-amber-500 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{row.rating}.0</span>
        </div>
      ),
      sortable: true,
    },
    { key: "comment", header: "Feedback Comment" },
    { key: "date", header: "Date", sortable: true },
    {
      key: "status",
      header: "Moderation Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "Approved"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : row.status === "Pending"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-100 text-xs font-bold uppercase tracking-wider mb-1">
            <Star className="w-4 h-4 fill-white" /> Quality Assurance & Ratings
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Review & Rating Moderation</h1>
          <p className="text-xs text-amber-100 mt-1 max-w-xl">
            Moderate customer service ratings and technician performance reviews.
          </p>
        </div>
      </div>

      {/* 4 Quick Executive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Average Fleet Rating</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">★ {avgRating} / 5.0</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Approved Ratings</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600">{approvedCount} / {reviews.length}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Customer Feedbacks</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {reviews.filter((r) => r.reviewerType === "Customer").length} Feedback Logs
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Service Guarantee</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600">30-Day Covered</span>
        </div>
      </div>

      {/* Navigation Tabs (Positioned at bottom of Quick Cards) */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit text-xs font-bold shadow-xs">
        {(["customer", "partner"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl capitalize transition-all ${
              activeTab === tab
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab} Reviews & Feedback
          </button>
        ))}
      </div>

      {/* Main DataTable without duplicate headers */}
      <DataTable
        columns={columns}
        data={reviews}
      />
    </div>
  );
}
