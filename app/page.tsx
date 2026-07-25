"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Filter,
  UserCheck,
  ChevronRight,
  X,
  Send,
  Zap,
} from "lucide-react";
import {
  analyticsData,
  initialBookings,
  initialTechnicians,
  varanasiLocalities,
  Booking,
} from "@/lib/mockData";

export default function ExecutiveDashboard() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedLocality, setSelectedLocality] = useState<string>("All");
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedBookingForDispatch, setSelectedBookingForDispatch] = useState<Booking | null>(null);
  const [assignedTechId, setAssignedTechId] = useState("");

  // New Dispatch Form State
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    customerPhone: "",
    locality: "Sigra",
    address: "",
    serviceTitle: "Power Jet AC Servicing",
    price: 699,
  });

  const filteredBookings = selectedLocality === "All"
    ? bookings
    : bookings.filter((b) => b.locality.toLowerCase().includes(selectedLocality.toLowerCase()));

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.customerName || !newBooking.customerPhone || !newBooking.address) return;

    const created: Booking = {
      id: `HM-VAR-${Math.floor(8822 + Math.random() * 900)}`,
      customerName: newBooking.customerName,
      customerPhone: newBooking.customerPhone,
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
      serviceTitle: "Power Jet AC Servicing",
      price: 699,
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded border border-brand-200">
              Varanasi Command Center
            </span>
            <span className="text-xs text-slate-500">Sigra HQ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Executive Analytics & Live Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management for Varanasi&apos;s 8 primary service zones. Certified technicians & instant dispatch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Varanasi Booking</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Monthly Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{(analyticsData.totalRevenue).toLocaleString("en-IN")}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{analyticsData.monthlyGrowth}% from last month</span>
            </div>
          </div>
        </div>

        {/* Active Dispatch Bookings */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Varanasi Jobs</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {analyticsData.activeBookings} Jobs
            </div>
            <div className="text-xs text-slate-500 font-medium">
              14 Sigra • 18 Assi Ghat/Lanka • 9 Godowlia
            </div>
          </div>
        </div>

        {/* Verified Fleet Technicians */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Fleet Techs</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {analyticsData.technicianFleet} Techs
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Aadhaar & Police Verified</span>
            </div>
          </div>
        </div>

        {/* Customer CSAT Rating */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer CSAT</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {analyticsData.csatRating} / 5.0
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Based on 2,840 Varanasi household reviews
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Trend Line & Bar Chart */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl space-y-6 border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Monthly Revenue Growth (Varanasi Operations)</h3>
              <p className="text-xs text-slate-500">Monthly booking volume and revenue stream in INR (₹)</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-brand-600 font-bold">
                <span className="w-3 h-3 rounded bg-brand-500 inline-block"></span> Revenue (₹)
              </span>
              <span className="flex items-center gap-1 text-blue-600 font-bold ml-3">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span> Bookings
              </span>
            </div>
          </div>

          {/* Dynamic Visual Bars */}
          <div className="space-y-4 pt-2">
            {analyticsData.monthlyChart.map((m) => (
              <div key={m.month} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 w-12">{m.month} 2026</span>
                  <div className="flex gap-4">
                    <span className="text-brand-600 font-bold">₹{m.revenue.toLocaleString("en-IN")}</span>
                    <span className="text-slate-500 text-[11px]">{m.bookings} jobs</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
                    style={{ width: `${(m.revenue / 1500000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown & Locality Heatmap */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Breakdown */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-200 pb-3">
              Varanasi Demand by Category
            </h3>
            <div className="space-y-3">
              {analyticsData.categoryBreakdown.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">{cat.category}</span>
                    <span className="text-slate-900 font-bold">{cat.percentage}% ({cat.count} jobs)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Localities Demand Grid */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <h3 className="text-xs font-bold text-slate-900">Varanasi Zone Density</h3>
              </div>
              <span className="text-[10px] text-slate-500">8 Localities</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {varanasiLocalities.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocality(loc.name)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedLocality === loc.name
                      ? "bg-brand-50 border-brand-500 text-slate-900"
                      : "bg-slate-50 border-slate-200 hover:border-brand-300 text-slate-700"
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{loc.name}</div>
                  <div className="flex items-center justify-between mt-1 text-[9px] text-slate-500">
                    <span>{loc.activeBookings} active</span>
                    <span
                      className={`font-bold ${
                        loc.status === "Peak"
                          ? "text-red-600"
                          : loc.status === "High Demand"
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {loc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Dispatch Stream & Booking Action Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-6 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse-glow"></div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Live Varanasi Dispatch Feed</h3>
              <p className="text-xs text-slate-500">Real-time customer requests & assigned fleet technicians</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "Sigra", "Lanka / Assi Ghat", "Godowlia", "Bhelupur", "Mahmoorganj"].map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocality(loc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedLocality === loc
                    ? "bg-brand-500 text-white shadow-lux"
                    : "bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Locality & Address</th>
                <th className="py-3.5 px-4">Service & System</th>
                <th className="py-3.5 px-4">Price (₹)</th>
                <th className="py-3.5 px-4">Technician Assigned</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    <div className="flex flex-col">
                      <span>{b.customerName}</span>
                      <span className="text-[10px] text-slate-500">{b.customerPhone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col max-w-xs">
                        <span className="font-bold text-slate-900">{b.locality}</span>
                        <span className="text-[10px] text-slate-500 truncate">{b.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{b.serviceTitle}</span>
                      {b.systemType && (
                        <span className="text-[10px] text-brand-600 font-mono font-bold">{b.systemType}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-slate-900">₹{b.totalAmount}</td>
                  <td className="py-4 px-4">
                    {b.technicianName ? (
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold text-emerald-700">{b.technicianName}</span>
                      </div>
                    ) : (
                      <span className="text-amber-600 italic text-[11px] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Unassigned
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        b.status === "In Progress"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : b.status === "Assigned"
                          ? "bg-brand-50 text-brand-700 border border-brand-200"
                          : b.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {b.status === "Pending" ? (
                      <button
                        onClick={() => setSelectedBookingForDispatch(b)}
                        className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-[11px] shadow-sm transition-all"
                      >
                        Assign Tech
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setBookings(
                            bookings.map((item) =>
                              item.id === b.id ? { ...item, status: "Completed" } : item
                            )
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-500/40 text-slate-700 hover:text-emerald-700 font-medium text-[11px] transition-colors"
                      >
                        Mark Done
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Technician Drawer / Modal */}
      {selectedBookingForDispatch && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Assign Varanasi Fleet Specialist</h3>
                <p className="text-xs text-slate-500">Booking {selectedBookingForDispatch.id} • {selectedBookingForDispatch.locality}</p>
              </div>
              <button
                onClick={() => setSelectedBookingForDispatch(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Selected Service</span>
              <div className="text-xs font-extrabold text-slate-900">{selectedBookingForDispatch.serviceTitle}</div>
              <div className="text-[11px] text-slate-600">{selectedBookingForDispatch.customerName} ({selectedBookingForDispatch.address})</div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Select Verified Technician</label>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {initialTechnicians.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setAssignedTechId(t.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      assignedTechId === t.id
                        ? "bg-brand-50 border-brand-500"
                        : "bg-slate-50 border-slate-200 hover:border-brand-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {t.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{t.name}</span>
                        <span className="text-[10px] text-slate-500">{t.role} • {t.locality}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-700">★ {t.rating}</span>
                      <span className="block text-[9px] text-slate-500">{t.totalJobs} jobs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedBookingForDispatch(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTechnician}
                disabled={!assignedTechId}
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-xs shadow-lux transition-all"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Booking Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateBooking}
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Create New Varanasi Dispatch Request</h3>
                <p className="text-xs text-slate-500">Instant job registration across Sigra, Lanka, Godowlia</p>
              </div>
              <button
                type="button"
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newBooking.customerName}
                  onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98390..."
                  value={newBooking.customerPhone}
                  onChange={(e) => setNewBooking({ ...newBooking, customerPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Varanasi Locality</label>
                <select
                  value={newBooking.locality}
                  onChange={(e) => setNewBooking({ ...newBooking, locality: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                >
                  {varanasiLocalities.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.pincode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Service Category</label>
                <select
                  value={newBooking.serviceTitle}
                  onChange={(e) => setNewBooking({ ...newBooking, serviceTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                >
                  <option value="Power Jet AC Servicing">Power Jet AC Servicing (₹699)</option>
                  <option value="AC Gas Leakage Repair & Refilling">AC Gas Refilling (₹2,499)</option>
                  <option value="Elite Full Home Deep Cleaning">Elite Home Cleaning (₹4,999)</option>
                  <option value="Ayurvedic Home Spa & Wellness">Ayurvedic Spa (₹1,999)</option>
                  <option value="Smart Home & MCB Box Repair">Electrician MCB (₹499)</option>
                  <option value="Hydro Jet Drainage Unclogging">Hydro Plumbing (₹799)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Address Details</label>
              <textarea
                required
                rows={2}
                placeholder="House No, Colony / Landmark in Varanasi..."
                value={newBooking.address}
                onChange={(e) => setNewBooking({ ...newBooking, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDispatchModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux transition-all"
              >
                Register & Dispatch Job
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
