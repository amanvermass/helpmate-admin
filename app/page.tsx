"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  X,
  Zap,
  IndianRupee,
  Star,
  Clock,
  Activity,
  Wrench,
  BarChart3,
  ChevronRight,
  Tag,
  CreditCard,
  Flame,
  Radio,
  SlidersHorizontal,
  ArrowRight,
  PhoneCall,
  Check,
  Search,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Timer,
  Award,
  ZapOff,
} from "lucide-react";
import {
  analyticsData,
  initialBookings,
  initialTechnicians,
  varanasiLocalities,
  Booking,
} from "@/lib/mockData";
import { Portal } from "@/components/Portal";

export default function ExecutiveDashboard() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedLocality, setSelectedLocality] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [chartMode, setChartMode] = useState<"revenue" | "bookings">("revenue");
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedBookingForDispatch, setSelectedBookingForDispatch] = useState<Booking | null>(null);
  const [assignedTechId, setAssignedTechId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [newBooking, setNewBooking] = useState({
    customerName: "",
    customerPhone: "",
    locality: "Sigra",
    address: "",
    serviceTitle: "Split AC Foam Jet Servicing",
    category: "AC Service & Repair",
    price: 599,
  });

  // Computed Metrics
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchLocality =
        selectedLocality === "All" ||
        b.locality.toLowerCase().includes(selectedLocality.toLowerCase());
      const matchStatus =
        selectedStatus === "All" || b.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchSearch =
        searchQuery === "" ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLocality && matchStatus && matchSearch;
    });
  }, [bookings, selectedLocality, selectedStatus, searchQuery]);

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const inProgressCount = bookings.filter((b) => b.status === "In Progress").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const totalRevenue = analyticsData.totalRevenue;

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.customerName || !newBooking.customerPhone || !newBooking.address) return;
    const created: Booking = {
      id: `HM-VAR-${Math.floor(8822 + Math.random() * 900)}`,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
      city: "Varanasi",
      locality: newBooking.locality,
      pincode: "221002",
      address: newBooking.address,
      serviceTitle: newBooking.serviceTitle,
      category: "AC",
      basePrice: Number(newBooking.price),
      convenienceFee: 49,
      cgst: Math.round(Number(newBooking.price) * 0.09 * 100) / 100,
      sgst: Math.round(Number(newBooking.price) * 0.09 * 100) / 100,
      totalAmount: Math.round(Number(newBooking.price) * 1.18 + 49),
      invoiceType: "B2C",
      commissionAmount: Math.round(Number(newBooking.price) * 0.25 * 100) / 100,
      partnerEarnings: Math.round(Number(newBooking.price) * 0.75 * 100) / 100,
      status: "Pending",
      date: "Just now",
      timeSlot: "Immediate Dispatch",
      paymentMethod: "UPI",
    };
    setBookings([created, ...bookings]);
    setIsDispatchModalOpen(false);
    setNewBooking({
      customerName: "",
      customerPhone: "",
      locality: "Sigra",
      address: "",
      serviceTitle: "Split AC Foam Jet Servicing",
      category: "AC Service & Repair",
      price: 599,
    });
  };

  const handleAssignTechnician = () => {
    if (!selectedBookingForDispatch || !assignedTechId) return;
    const tech = initialTechnicians.find((t) => t.id === assignedTechId);
    if (!tech) return;
    setBookings(
      bookings.map((b) =>
        b.id === selectedBookingForDispatch.id
          ? { ...b, status: "Assigned", technicianName: tech.name, technicianId: tech.id }
          : b
      )
    );
    setSelectedBookingForDispatch(null);
    setAssignedTechId("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">

      {/* ─── 1. VIBRANT EXECUTIVE HERO COMMAND CENTER (LIGHT MODE BEAUTIFUL BRAND GRADIENT) ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-purple-700 dark:from-slate-900 dark:via-brand-950 dark:to-purple-950 p-6 sm:p-8 text-white shadow-xl">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-md shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                Live Operations Active
              </span>
              <span className="text-xs font-bold text-white/90 flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-white" /> Varanasi HQ · Sigra Zone
              </span>
              <span className="text-xs text-white/80 font-mono hidden sm:inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 24/7 Monitoring
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              Varanasi Operational Command Center
            </h1>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium leading-relaxed">
              Real-time executive oversight across 8 active service zones. Track revenue streams, technician dispatch, and customer metrics instantly.
            </p>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDispatchModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-brand-700 font-extrabold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-brand-600" />
              <span>Dispatch New Order</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold text-white">
              <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{pendingCount} Pending Orders</span>
            </div>
          </div>
        </div>

        {/* Live Operational Metrics Ribbon */}
        <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/20">
          {[
            { label: "Today's Gross Sales", value: "₹48,200", sub: "+12.4% vs yesterday", isPos: true },
            { label: "Active Jobs In Field", value: `${inProgressCount} Active`, sub: "Across 8 Varanasi zones", isPos: true },
            { label: "Jobs Completed Today", value: `${completedCount} Jobs`, sub: "Avg ticket ₹799", isPos: true },
            { label: "On-Call Fleet Techs", value: "34 Techs", sub: "Out of 142 total fleet", isPos: false },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/15 hover:bg-white/20 transition-all border border-white/25 rounded-2xl p-3.5 backdrop-blur-md text-white"
            >
              <p className="text-[10px] text-white/80 font-extrabold uppercase tracking-wider">{s.label}</p>
              <p className="text-lg font-black text-white mt-1 tracking-tight">{s.value}</p>
              <p
                className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${
                  s.isPos ? "text-emerald-300" : "text-amber-300"
                }`}
              >
                {s.isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 2. EXECUTIVE KPI METRICS MATRIX ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Monthly Gross</span>
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200 dark:border-brand-800">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{(totalRevenue / 100000).toFixed(2)}L
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{analyticsData.monthlyGrowth}% MoM</span>
            </div>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Varanasi Jobs</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analyticsData.activeBookings} Jobs
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate">
              14 Sigra · 18 Lanka
            </div>
          </div>
        </div>

        {/* Technician Fleet */}
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Verified Fleet</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analyticsData.technicianFleet} Techs
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Verified KYC</span>
            </div>
          </div>
        </div>

        {/* CSAT Rating */}
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Customer CSAT</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {analyticsData.csatRating} / 5.0
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 truncate">
              2,840 Varanasi ratings
            </div>
          </div>
        </div>

        {/* Platform Earnings */}
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Commission 25%</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ₹{(totalRevenue * 0.25 / 100000).toFixed(2)}L
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-purple-600 dark:text-purple-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Weekly Payouts</span>
            </div>
          </div>
        </div>

        {/* Monthly Bookings */}
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Monthly Volume</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              1,290 Jobs
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+9.3% vs last mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. MAIN ANALYTICS ENGINE & DISTRIBUTION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column (8 Cols): Monthly Performance Graph & Live Dispatch Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Monthly Performance Graph Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                  <h2 className="text-base font-black text-slate-900 dark:text-white">Monthly Performance & Growth Trends</h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Varanasi operations timeline (Jan 2026 – Jul 2026)
                </p>
              </div>

              {/* Toggle Modes */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setChartMode("revenue")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartMode === "revenue"
                      ? "bg-brand-500 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Revenue (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode("bookings")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    chartMode === "bookings"
                      ? "bg-blue-500 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Bookings Count
                </button>
              </div>
            </div>

            {/* Interactive Chart Canvas */}
            <div className="flex gap-4 pt-1">
              {/* Y-Axis Scale */}
              <div className="flex flex-col justify-between text-right shrink-0 py-1" style={{ height: "220px" }}>
                {chartMode === "revenue"
                  ? ["₹15L", "₹12L", "₹9L", "₹6L", "₹3L", "₹0"].map((l) => (
                      <span key={l} className="text-[10px] font-mono font-bold text-slate-400">{l}</span>
                    ))
                  : ["1,500", "1,200", "900", "600", "300", "0"].map((l) => (
                      <span key={l} className="text-[10px] font-mono font-bold text-slate-400">{l}</span>
                    ))}
              </div>

              {/* Chart Grid */}
              <div className="flex-1 min-w-0">
                <div className="relative" style={{ height: "220px" }}>
                  {/* Horizontal Grid lines */}
                  {[0, 20, 40, 60, 80, 100].map((pct) => (
                    <div
                      key={pct}
                      className="absolute left-0 right-0 border-t border-slate-100 dark:border-slate-800"
                      style={{ bottom: `${pct}%` }}
                    />
                  ))}

                  {/* Bars Container */}
                  <div className="absolute inset-0 flex items-end gap-3 px-2">
                    {analyticsData.monthlyChart.map((m) => {
                      const val = chartMode === "revenue" ? m.revenue : m.bookings;
                      const maxVal = chartMode === "revenue" ? 1500000 : 1500;
                      const heightPct = Math.min((val / maxVal) * 100, 100);

                      return (
                        <div key={m.month} className="flex-1 relative group h-full flex flex-col justify-end">
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30 shadow-xl border border-brand-700">
                            {m.month}: ₹{(m.revenue / 100000).toFixed(1)}L ({m.bookings} jobs)
                          </div>

                          {/* Dynamic Bar */}
                          <div
                            className={`w-full rounded-t-xl transition-all duration-500 cursor-pointer relative overflow-hidden ${
                              chartMode === "revenue"
                                ? "bg-gradient-to-t from-brand-600 via-brand-500 to-purple-500 hover:from-brand-700 hover:to-purple-600"
                                : "bg-gradient-to-t from-blue-600 via-blue-500 to-indigo-400 hover:from-blue-700 hover:to-indigo-500"
                            }`}
                            style={{ height: `${heightPct}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between gap-3 px-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {analyticsData.monthlyChart.map((m) => (
                    <div key={m.month} className="flex-1 text-center">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200 block">{m.month}</span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold block">{m.bookings} jobs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Live Varanasi Dispatch Feed (Starts EXACTLY below graph) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            {/* Table Header & Controls */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center border border-brand-200 dark:border-brand-800 shrink-0">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-900 dark:text-white">Live Varanasi Dispatch Feed</h2>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      {filteredBookings.length} Orders
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time job queue and technician assignment console
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Input */}
                <div className="relative min-w-[180px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search booking..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
                  {["All", "Pending", "Assigned", "In Progress", "Completed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStatus(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        selectedStatus === st
                          ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Table with Fixed Height & Vertical Scroll */}
            <div className="overflow-x-auto max-h-[562px] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 relative">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-xs">
                  <tr>
                    <th className="py-3.5 px-4">Booking ID</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Locality & Address</th>
                    <th className="py-3.5 px-4">Service Required</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Assigned Technician</th>
                    <th className="py-3.5 px-4">Dispatch Status</th>
                    <th className="py-3.5 px-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                        No Varanasi dispatch records matching your current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-brand-600 dark:text-brand-400">{b.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{b.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{b.customerPhone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{b.locality}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{b.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white max-w-[180px] truncate">{b.serviceTitle}</div>
                          <div className="text-[10px] text-slate-400 font-semibold">{b.category}</div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                          ₹{b.totalAmount}
                        </td>
                        <td className="py-3.5 px-4">
                          {b.technicianName ? (
                            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>{b.technicianName}</span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                              <AlertCircle className="w-3 h-3" /> Unassigned
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border inline-block ${
                              b.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : b.status === "In Progress"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800 animate-pulse"
                                : b.status === "Assigned"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedBookingForDispatch(b)}
                              className="px-2.5 py-1 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-[11px] border border-brand-500 transition-colors cursor-pointer"
                            >
                              {b.technicianName ? "Reassign" : "Dispatch"}
                            </button>
                            <Link
                              href={`/bookings/${b.id}`}
                              className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 border border-slate-200 dark:border-slate-700 transition-colors inline-flex items-center justify-center"
                              title="View Full Booking Console"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Demand Breakdown & Locality Density (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Category Demand Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Service Category Share</h3>
              </div>
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-full">
                Varanasi Market
              </span>
            </div>

            <div className="space-y-3.5">
              {analyticsData.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{cat.category}</span>
                    <span className="font-black text-slate-900 dark:text-white ml-2">{cat.percentage}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span>{cat.count} total jobs</span>
                    <span>Est. ₹{(cat.count * 899 / 1000).toFixed(1)}k revenue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Density & Locality Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Varanasi Zone Density</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLocality("All")}
                className="text-[10px] font-bold text-slate-500 hover:text-brand-600 transition-colors"
              >
                Reset Filter
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {varanasiLocalities.map((loc) => {
                const isSelected = selectedLocality === loc.name;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setSelectedLocality(isSelected ? "All" : loc.name)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "bg-brand-500 text-white border-brand-500 shadow-md scale-[1.02]"
                        : "bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 hover:border-brand-400 text-slate-900 dark:text-white"
                    }`}
                  >
                    <p className={`text-xs font-black truncate ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      {loc.name}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className={isSelected ? "text-brand-100" : "text-slate-500 dark:text-slate-400"}>
                        {loc.activeBookings} active
                      </span>
                      <span
                        className={`font-extrabold px-1.5 py-0.2 rounded ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : loc.status === "Peak"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : loc.status === "High Demand"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {loc.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin Quick Launch (Placed EXACTLY below Varanasi Zone Density) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Admin Quick Launch</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Bookings", href: "/bookings", icon: CalendarCheck, color: "text-brand-500" },
                { label: "Fleet KYC", href: "/technicians", icon: UserCheck, color: "text-emerald-500" },
                { label: "CRM Clients", href: "/customers", icon: Users, color: "text-blue-500" },
                {label: "Billing & GST", href: "/billing", icon: CreditCard, color: "text-purple-500" },
                { label: "CMS Services", href: "/cms", icon: Wrench, color: "text-amber-500" },
                { label: "RBAC Users", href: "/users", icon: ShieldCheck, color: "text-red-500" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:border-brand-400 hover:shadow-sm transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
                  >
                    <Icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 5. FLEET SPECIALIST SPOTLIGHT & LEADERBOARD ─── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Certified Fleet Specialists</h3>
              <p className="text-xs text-slate-400">Top rated verified partners on ground in Varanasi</p>
            </div>
          </div>
          <a
            href="/technicians"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All {analyticsData.technicianFleet} Fleet <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {initialTechnicians.slice(0, 4).map((tech, idx) => (
            <div
              key={tech.id}
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 hover:border-brand-300 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                    {tech.name[0]}
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black flex items-center justify-center shadow-xs">
                    #{idx + 1}
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{tech.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{tech.role} · {tech.locality}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center text-[10px] font-black text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" /> {tech.rating}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{tech.totalJobs} jobs done</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 6. ASSIGN TECHNICIAN MODAL ─── */}
      {selectedBookingForDispatch && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Assign Fleet Specialist</h3>
                  <p className="text-xs text-slate-500">
                    Order {selectedBookingForDispatch.id} · {selectedBookingForDispatch.locality}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBookingForDispatch(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Order Service Details</span>
                <p className="text-xs font-black text-slate-900 dark:text-white">{selectedBookingForDispatch.serviceTitle}</p>
                <p className="text-[11px] text-slate-500">{selectedBookingForDispatch.customerName} ({selectedBookingForDispatch.address})</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">Select Verified Partner</label>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {initialTechnicians.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setAssignedTechId(t.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        assignedTechId === t.id
                          ? "bg-brand-50 border-brand-500 dark:bg-brand-950"
                          : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:border-brand-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center">
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</p>
                          <p className="text-[10px] text-slate-500">{t.role} · {t.locality}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-amber-500">★ {t.rating}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{t.totalJobs} jobs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForDispatch(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignTechnician}
                  disabled={!assignedTechId}
                  className="flex-1 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-extrabold text-xs shadow-lux"
                >
                  Confirm Dispatch
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ─── 7. DISPATCH MODAL ─── */}
      {isDispatchModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateBooking}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Register Varanasi Dispatch Order</h3>
                  <p className="text-xs text-slate-500">Direct booking creation across all 8 zones</p>
                </div>
                <button type="button" onClick={() => setIsDispatchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={newBooking.customerName}
                    onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98390..."
                    value={newBooking.customerPhone}
                    onChange={(e) => setNewBooking({ ...newBooking, customerPhone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Locality Zone</label>
                  <select
                    value={newBooking.locality}
                    onChange={(e) => setNewBooking({ ...newBooking, locality: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  >
                    {varanasiLocalities.map((loc) => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name} ({loc.pincode})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Service Package</label>
                  <select
                    value={`${newBooking.serviceTitle} (₹${newBooking.price})`}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes("Foam Jet")) setNewBooking({ ...newBooking, serviceTitle: "Split AC Foam Jet Servicing", price: 599 });
                      else if (val.includes("Gas Leak")) setNewBooking({ ...newBooking, serviceTitle: "Split AC Gas Leak Repair & Refill", price: 1499 });
                      else if (val.includes("Window AC")) setNewBooking({ ...newBooking, serviceTitle: "Window AC Deep Jet Servicing", price: 499 });
                      else if (val.includes("Deep Cleaning")) setNewBooking({ ...newBooking, serviceTitle: "Full House Deep Cleaning (2BHK)", price: 2999 });
                      else setNewBooking({ ...newBooking, serviceTitle: "Car Foam Wash & Interior Vacuuming", price: 499 });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Split AC Foam Jet Servicing (₹599)">Split AC Foam Jet — ₹599</option>
                    <option value="Split AC Gas Leak Repair & Refill (₹1499)">AC Gas Leak Repair — ₹1,499</option>
                    <option value="Window AC Deep Jet Servicing (₹499)">Window AC Deep Jet — ₹499</option>
                    <option value="Full House Deep Cleaning (₹2999)">Full House Cleaning — ₹2,999</option>
                    <option value="Car Foam Wash & Interior Vacuuming (₹499)">Car Foam Wash — ₹499</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Address Details *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="House No, Colony / Landmark in Varanasi..."
                  value={newBooking.address}
                  onChange={(e) => setNewBooking({ ...newBooking, address: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lux"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

    </div>
  );
}
