"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DataTable, Column } from "@/components/DataTable";
import { initialReviews, ReviewItem } from "@/lib/mockData";
import {
  Star,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Award,
  Search,
  Filter,
  Eye,
  Flag,
  Check,
  User,
  Calendar,
  ExternalLink,
  MessageCircle,
  X,
  Globe,
  EyeOff,
  Play,
  Pause,
  Video,
  Smartphone,
  Film,
} from "lucide-react";
import { Portal } from "@/components/Portal";
import { CustomSelect } from "@/components/CustomSelect";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [unifiedFilter, setUnifiedFilter] = useState<string>("All");
  const [ratingFilter, setRatingFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [replySuccess, setReplySuccess] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const avgRating = (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / (reviews.length || 1)).toFixed(1);
  const approvedCount = reviews.filter((r) => r.status === "Approved").length;
  const webPublishedCount = reviews.filter((r) => r.showOnWebsite !== false).length;
  const videoReviewsCount = reviews.filter((r) => r.hasVideo).length;

  const handleToggleShowOnWebsite = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, showOnWebsite: !(r.showOnWebsite ?? true) } : r))
    );
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => (prev ? { ...prev, showOnWebsite: !(prev.showOnWebsite ?? true) } : null));
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Unified Filter: Reviewers, Media & Website Status
      if (unifiedFilter === "Customer" && r.reviewerType !== "Customer") return false;
      if (unifiedFilter === "Partner" && r.reviewerType !== "Partner") return false;
      if (unifiedFilter === "Video" && !r.hasVideo) return false;
      if (unifiedFilter === "Text" && r.hasVideo) return false;
      if (unifiedFilter === "Published" && r.showOnWebsite === false) return false;
      if (unifiedFilter === "Hidden" && r.showOnWebsite !== false) return false;

      // Status Filter
      if (statusFilter !== "All" && r.status !== statusFilter) return false;

      // Rating Filter
      if (ratingFilter !== "All" && r.rating !== parseInt(ratingFilter, 10)) return false;

      return true;
    });
  }, [reviews, unifiedFilter, statusFilter, ratingFilter]);

  const handleUpdateStatus = (id: string, newStatus: "Approved" | "Pending" | "Flagged") => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    if (selectedReview && selectedReview.id === id) {
      setSelectedReview((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReview || !adminReplyText.trim()) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === selectedReview.id
          ? {
              ...r,
              adminResponse: adminReplyText.trim(),
              status: "Approved",
            }
          : r
      )
    );

    setSelectedReview((prev) => (prev ? { ...prev, adminResponse: adminReplyText.trim(), status: "Approved" } : null));
    setReplySuccess(true);
    setTimeout(() => setReplySuccess(false), 3000);
    setAdminReplyText("");
  };

  // Single Consolidated Custom Select Filter Dropdowns passed into DataTable
  const tableFilters = (
    <div className="flex items-center gap-2 flex-wrap">
      {/* 1. CustomSelect for Unified Reviews Filter (Reviewers, Media Types & Website Status) */}
      <div className="w-52">
        <CustomSelect
          size="sm"
          value={unifiedFilter}
          onChange={(val) => setUnifiedFilter(val)}
          options={[
            { value: "All", label: "All Reviews" },
            { value: "Customer", label: "👤 Customer Reviews" },
            { value: "Partner", label: "🛠️ Partner Feedback" },
            { value: "Video", label: "🎬 Vertical Video (9:16)" },
            { value: "Text", label: "📝 Text Feedback" },
            { value: "Published", label: "🌐 Live on Website" },
            { value: "Hidden", label: "🚫 Hidden from Web" },
          ]}
        />
      </div>

      {/* 2. CustomSelect for Ratings Filter */}
      <div className="w-44">
        <CustomSelect
          size="sm"
          value={ratingFilter}
          onChange={(val) => setRatingFilter(val)}
          options={[
            { value: "All", label: "All Ratings" },
            { value: "5", label: "5 Stars ⭐⭐⭐⭐⭐" },
            { value: "4", label: "4 Stars ⭐⭐⭐⭐" },
            { value: "3", label: "3 Stars ⭐⭐⭐" },
            { value: "2", label: "2 Stars ⭐⭐" },
            { value: "1", label: "1 Star ⭐" },
          ]}
        />
      </div>
    </div>
  );

  const columns: Column<ReviewItem>[] = [
    {
      key: "bookingId",
      header: "Booking ID",
      accessor: (row) => (
        <div className="space-y-0.5">
          <Link
            href={`/bookings/${row.bookingId || "HM-VAR-8821"}`}
            className="font-mono font-black text-brand-600 dark:text-brand-400 hover:underline text-xs"
          >
            {row.bookingId || "HM-VAR-8821"}
          </Link>
          <span className="text-[10px] text-slate-400 block font-medium">Varanasi Dispatch</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "reviewerName",
      header: "Reviewer & Customer",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-extrabold flex items-center justify-center text-xs shrink-0">
            {row.reviewerName ? row.reviewerName[0] : "C"}
          </div>
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white text-xs">{row.reviewerName}</div>
            <div className="text-[10px] text-slate-400 font-medium">{row.reviewerType} Feedback</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "targetName",
      header: "Target Service / Partner",
      accessor: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{row.targetName}</div>
          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold block">HelpMate Verified Partner</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "rating",
      header: "Rating",
      accessor: (row) => (
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800/60 w-fit">
          <div className="flex text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${star <= (row.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"}`}
              />
            ))}
          </div>
          <span className="font-black text-amber-800 dark:text-amber-300 text-xs font-mono">{row.rating}.0</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "comment",
      header: "Customer Feedback & Video Media",
      accessor: (row) => (
        <div className="max-w-md space-y-1.5 py-1">
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed">
            "{row.comment}"
          </p>

          {row.hasVideo && (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/80 w-fit">
              <div className="relative w-7 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-purple-300">
                <img src={row.videoThumbnail} alt="Vertical Video 9:16" className="w-full h-full object-cover opacity-80" />
                <Play className="w-3 h-3 text-white absolute inset-0 m-auto fill-white" />
              </div>
              <div className="text-[10px]">
                <span className="font-black text-purple-900 dark:text-purple-200 block flex items-center gap-1">
                  <Film className="w-3 h-3 text-purple-600 shrink-0" />
                  <span>Vertical Video (9:16) • {row.videoDuration || "0:24"}</span>
                </span>
                <span className="text-[9px] text-purple-700 dark:text-purple-300 font-medium">Customer Video Testimonial</span>
              </div>
            </div>
          )}

          {row.adminResponse && (
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-[11px] text-purple-900 dark:text-purple-200 font-medium">
              <span className="font-extrabold text-purple-700 dark:text-purple-300 block">💬 Official HelpMate Response:</span>
              <span>{row.adminResponse}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "showOnWebsite",
      header: "Show on Website",
      accessor: (row) => {
        const isPublished = row.showOnWebsite !== false;
        return (
          <button
            type="button"
            onClick={() => handleToggleShowOnWebsite(row.id)}
            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wide inline-flex items-center gap-1.5 cursor-pointer transition-all ${
              isPublished
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-200"
            }`}
            title={isPublished ? "Click to hide from website" : "Click to publish to website"}
          >
            {isPublished ? (
              <>
                <Globe className="w-3 h-3 text-emerald-600" />
                <span>🌐 Live on Web</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 text-slate-400" />
                <span>🚫 Hidden</span>
              </>
            )}
          </button>
        );
      },
    },
    {
      key: "date",
      header: "Review Date",
      accessor: (row) => <span className="text-slate-500 font-medium text-xs whitespace-nowrap">{row.date}</span>,
      sortable: true,
    },
    {
      key: "status",
      header: "Moderation Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
            row.status === "Approved"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
              : row.status === "Pending"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span>{row.status}</span>
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedReview(row);
              setAdminReplyText(row.adminResponse || "");
            }}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Inspect & Moderation"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>

          {row.status !== "Approved" && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(row.id, "Approved")}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Quick Approve"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}

          {row.status !== "Flagged" && (
            <button
              type="button"
              onClick={() => handleUpdateStatus(row.id, "Flagged")}
              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-100 font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Flag / Hide"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Star className="w-6 h-6 text-brand-600 fill-brand-600" />
            <span>Customer Review & Rating Moderation</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Monitor, moderate, website publication, and respond to customer feedback for HelpMate Varanasi service orders.
          </p>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Average Customer Rating</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950 dark:border-amber-900">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">★ {avgRating} / 5.0</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Published on Live Website</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950 dark:border-emerald-900">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600">{webPublishedCount} / {reviews.length} Live</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Vertical Video Reviews (9:16)</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-950 dark:border-purple-900">
              <Smartphone className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600">{videoReviewsCount} Videos</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Moderated Reviews</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-950 dark:border-brand-900">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{approvedCount} Approved</span>
        </div>
      </div>

      {/* Main DataTable with Table Header Filters */}
      <DataTable
        columns={columns}
        data={filteredReviews}
        searchPlaceholder="Search reviewer, partner, booking ID, comment..."
        extraFilters={tableFilters}
      />

      {/* Review Management Drawer / Modal */}
      {selectedReview && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                    <Star className="w-6 h-6 fill-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Review & Rating Details</h3>
                    <p className="text-xs text-slate-500 font-medium">Booking ID: {selectedReview.bookingId || "HM-VAR-8821"}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Review Overview Card & Vertical Video 9:16 Player Container */}
              <div className="space-y-4">
                {/* Website Visibility Controls */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Customer Website Live Status</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleShowOnWebsite(selectedReview.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                      selectedReview.showOnWebsite !== false
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {selectedReview.showOnWebsite !== false ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Published to Live Website</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden from Website</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Vertical Video Player (9:16 Aspect Ratio) */}
                {selectedReview.hasVideo && (
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-900/10 to-slate-900/10 dark:from-purple-950/40 dark:to-slate-900/80 border border-purple-200 dark:border-purple-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-purple-600" />
                        <span>Customer Video Review (9:16 Format)</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-300">
                        {selectedReview.videoDuration || "0:24"} • Vertical 9:16
                      </span>
                    </div>

                    <div className="flex justify-center">
                      <div className="relative w-56 h-[340px] rounded-2xl overflow-hidden bg-black border-2 border-purple-500 shadow-xl group">
                        <video
                          src={selectedReview.videoUrl}
                          poster={selectedReview.videoThumbnail}
                          controls
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/20 pointer-events-none">
                          <Film className="w-3 h-3 text-pink-400" />
                          <span>Vertical Video 9:16</span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md p-2 rounded-xl text-[10px] text-white space-y-0.5 border border-white/20 pointer-events-none">
                          <div className="font-extrabold truncate">@{selectedReview.reviewerName.toLowerCase().replace(/\s+/g, "_")}</div>
                          <div className="text-[9px] text-slate-300 line-clamp-1">{selectedReview.comment}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Details Text Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedReview.reviewerName}</span>
                    <span className="text-[10px] font-bold text-slate-400">{selectedReview.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= (selectedReview.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"}`}
                        />
                      ))}
                    </div>
                    <span className="font-black text-slate-900 dark:text-white font-mono text-sm">
                      {selectedReview.rating}.0 Rating
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 italic leading-relaxed">
                    "{selectedReview.comment}"
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-slate-500">
                    <span>Target Partner / Service: <strong className="text-slate-900 dark:text-white">{selectedReview.targetName}</strong></span>
                    <Link
                      href={`/bookings/${selectedReview.bookingId || "HM-VAR-8821"}`}
                      className="text-brand-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>View Booking</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Status Actions (Rule Check: Secondary Buttons!) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Moderation Action</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReview.id, "Approved")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      selectedReview.status === "Approved"
                        ? "bg-emerald-600 text-white font-extrabold"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Publish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedReview.id, "Flagged")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      selectedReview.status === "Flagged"
                        ? "bg-rose-600 text-white font-extrabold"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    <span>Flag / Hide Review</span>
                  </button>
                </div>
              </div>

              {/* Official Admin Response Form */}
              <form onSubmit={handleSaveReply} className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Add Official HelpMate Customer Response
                  </label>
                  <textarea
                    rows={3}
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="Type official reply (e.g. Thank you for your feedback! We are glad our technician provided prompt service...)"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {replySuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-extrabold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Official response published successfully!</span>
                  </div>
                )}

                {/* SINGLE PRIMARY BUTTON IN MODAL ACCORDING TO RULE */}
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedReview(null)}
                    className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-extrabold shadow-lux flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Post Official Response</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
