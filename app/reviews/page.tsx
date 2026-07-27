"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialReviews, ReviewItem } from "@/lib/mockData";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [activeTab, setActiveTab] = useState<"customer" | "partner">("customer");

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
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Review & Rating Moderation</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Moderate customer service ratings and technician performance reviews</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(["customer", "partner"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab} Reviews
            </button>
          ))}
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Ratings & Feedback Directory"
        description="Public service feedback and moderation panel"
        columns={columns}
        data={reviews}
      />
    </div>
  );
}
