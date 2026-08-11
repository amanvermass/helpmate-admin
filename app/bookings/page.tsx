"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/DataTable";
import { initialBookings, Booking, BookingStatus, Technician } from "@/lib/mockData";
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Printer,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Wrench,
  KeyRound,
  Eye,
  Edit2,
  UserPlus,
  Filter,
  Plus,
  X,
  ArrowRight,
} from "lucide-react";
import { Portal } from "@/components/Portal";
import { BookingWizardModal } from "@/components/bookings/BookingWizardModal";
import { AssignPartnerModal } from "@/components/bookings/AssignPartnerModal";
import { InspectionFlowModal } from "@/components/bookings/InspectionFlowModal";
import { OtpVerificationModal } from "@/components/bookings/OtpVerificationModal";
import { EditBookingModal } from "@/components/bookings/EditBookingModal";
import { BookingDetailsDrawer } from "@/components/bookings/BookingDetailsDrawer";

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("All");

  // Modals & Toasts
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [createdBookingToast, setCreatedBookingToast] = useState<Booking | null>(null);
  const [assignBooking, setAssignBooking] = useState<Booking | null>(null);
  const [inspectionBooking, setInspectionBooking] = useState<Booking | null>(null);
  const [otpBooking, setOtpBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [drawerBooking, setDrawerBooking] = useState<Booking | null>(null);
  const [printTargetBooking, setPrintTargetBooking] = useState<Booking | null>(null);

  const handleDirectPrint = (row: Booking) => {
    setPrintTargetBooking(row);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const formatInvoiceNumber = (id: string) => {
    if (!id) return "INV-2026-001";
    const cleanId = id.replace(/^(INV-)?(bk-)?/gi, "");
    if (cleanId.length > 5 && !isNaN(Number(cleanId))) {
      return `INV-${cleanId.slice(-5)}`;
    }
    return `INV-${cleanId.toUpperCase()}`;
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeStatusFilter === "All") return true;
    return b.status.toLowerCase() === activeStatusFilter.toLowerCase();
  });

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
    setIsWizardOpen(false);
    setCreatedBookingToast(newBooking);
  };

  const handlePartnerAssigned = (bookingId: string, technician: Technician | null) => {
    const update = (b: Booking): Booking => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status: technician
          ? b.status === "Pending" || b.status === "Waiting For Assignment"
            ? "Assigned"
            : b.status
          : "Pending",
        technicianName: technician ? technician.name : undefined,
        technicianId: technician ? technician.id : undefined,
      };
    };

    setBookings((prev) => prev.map(update));
    setDrawerBooking((prev) => (prev && prev.id === bookingId ? update(prev) : prev));
  };

  const handleInspectionApproved = (bookingId: string, updatedQuote: number, remarks: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              basePrice: updatedQuote,
              totalAmount: Math.round(updatedQuote * 1.18 + 49),
              inspectionRemarks: remarks,
              status: "Customer Approval Pending",
            }
          : b
      )
    );
  };

  const handleJobCompleted = (bookingId: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              isOtpVerified: true,
              status: "Completed",
            }
          : b
      )
    );
    router.push(`/billing/${bookingId}`);
  };

  const handleBookingUpdated = (updated: Booking) => {
    setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
    setDrawerBooking((prev) => (prev && prev.id === updated.id ? updated : prev));
  };

  const columns: Column<Booking>[] = [
    {
      key: "id",
      header: "Invoice / Booking ID",
      sticky: "left",
      stickyLeftOffset: 44,
      className: "w-[140px] min-w-[140px] max-w-[140px]",
      accessor: (row) => (
        <button
          type="button"
          onClick={() => router.push(`/bookings/${row.id}`)}
          className="font-mono font-extrabold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer text-xs"
        >
          {row.id}
        </button>
      ),
      sortable: true,
    },
    {
      key: "customerName",
      header: "Customer Name",
      sticky: "left",
      stickyLeftOffset: 184,
      className: "w-[170px] min-w-[170px] max-w-[170px]",
      accessor: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-white truncate max-w-[150px] block" title={row.customerName}>
          {row.customerName}
        </span>
      ),
      sortable: true,
    },
    {
      key: "date",
      header: "Working date",
      className: "w-[140px] min-w-[140px] whitespace-nowrap px-4",
      accessor: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{row.date || "Today"}</span>,
      sortable: true,
    },
    {
      key: "callingDate",
      header: "Calling date",
      accessor: (row) => <span className="text-slate-500 dark:text-slate-400 font-medium">{row.callingDate || "2026-07-25"}</span>,
      sortable: true,
    },
    {
      key: "address",
      header: "Address",
      accessor: (row) => (
        <div className="max-w-[200px] truncate text-slate-700 dark:text-slate-300 font-medium" title={row.address || `${row.locality}, Varanasi`}>
          {row.address || `${row.locality}, Varanasi`}
        </div>
      ),
      sortable: true,
    },
    {
      key: "customerPhone",
      header: "Contact no",
      accessor: (row) => <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">{row.customerPhone}</span>,
      sortable: true,
    },
    {
      key: "serviceTitle",
      header: "Multiple Services & Item Codes",
      accessor: (row) => (
        <div className="max-w-[240px] space-y-1 py-1" title={row.serviceTitle}>
          <div className="truncate font-extrabold text-slate-900 dark:text-white text-xs">
            {row.serviceTitle}
          </div>
          {row.servicesList && row.servicesList.length > 0 ? (
            <div className="space-y-1">
              {row.servicesList.map((s, idx) => (
                <div key={s.id || idx} className="flex items-center gap-1.5 text-[10px]">
                  <span className="font-mono font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded border border-purple-200 shrink-0">
                    {s.serviceCode || `HM-SVC-${row.id.replace(/[^0-9]/g, "")}-${String(idx + 1).padStart(2, "0")}`}
                  </span>
                  <span className="truncate text-slate-600 dark:text-slate-300 font-medium">
                    {s.title} (x{s.quantity})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-[10px] font-mono font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 px-1.5 py-0.2 rounded border border-brand-200">
              HM-SVC-{row.id.replace(/[^0-9]/g, "")}-01
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      key: "timeSlot",
      header: "Time",
      accessor: (row) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.timeSlot}</span>,
      sortable: true,
    },
    {
      key: "totalAmount",
      header: "Amount",
      accessor: (row) => <span className="font-extrabold text-slate-900 dark:text-white">₹{row.totalAmount}</span>,
      sortable: true,
    },
    {
      key: "callingPerson",
      header: "Calling Person",
      accessor: (row) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.callingPerson || "Pooja Sharma (Operations)"}</span>,
      sortable: true,
    },
    {
      key: "notes",
      header: "Remark",
      accessor: (row) => (
        <div className="max-w-[170px] truncate text-slate-500 italic" title={row.notes || row.inspectionRemarks || "Standard order"}>
          {row.notes || row.inspectionRemarks || "Standard order"}
        </div>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "completion",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
            row.status === "Completed"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : row.status === "In Progress" || row.status === "Assigned"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : row.status === "Cancelled"
              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      key: "technicianName",
      header: "Worker name",
      accessor: (row) =>
        row.technicianName ? (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate max-w-[130px]" title={row.technicianName}>
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              {row.technicianName}
            </span>
            <button
              type="button"
              onClick={() => setAssignBooking(row)}
              title="Change Assigned Partner"
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:hover:bg-brand-950 text-slate-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shrink-0"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAssignBooking(row)}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 cursor-pointer hover:bg-amber-100"
          >
            Assign Partner
          </button>
        ),
      sortable: true,
    },
    {
      key: "handledBy",
      header: "Handel By",
      accessor: (row) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.handledBy || "Aman Verma (HQ)"}</span>,
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      sticky: "right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => router.push(`/billing/${row.id}`)}
            title="View Billing Invoice"
            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 transition-all flex items-center justify-center cursor-pointer border border-emerald-200 dark:border-emerald-800"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push(`/bookings/${row.id}`)}
            title="View Full Booking Details Page"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditingBooking(row)}
            title="Edit Booking"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  const statusOptions: BookingStatus[] = [
    "Draft",
    "Pending",
    "Waiting For Assignment",
    "Assigned",
    "Partner Accepted",
    "Inspection Pending",
    "Price Approval Pending",
    "Customer Approval Pending",
    "Confirmed",
    "In Progress",
    "Completed",
    "Cancelled",
    "Refunded",
    "Rejected",
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner matching Billing layout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" /> Single-City Assignment Engine
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Bookings & Operations Directory</h1>
          <p className="text-xs text-brand-100 mt-1 max-w-xl">
            Manage Varanasi customer service bookings, technician partner assignments, live job status, and service quotes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-brand-900 font-extrabold text-xs shadow-md hover:bg-brand-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Create Booking</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">{bookings.length} Orders</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-amber-600">Waiting Partner</span>
          <h3 className="text-xl font-black text-amber-600">{bookings.filter((b) => !b.technicianName).length} Unassigned</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-blue-600">In Progress</span>
          <h3 className="text-xl font-black text-blue-600">{bookings.filter((b) => b.status === "In Progress" || b.status === "Assigned").length} Jobs</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-emerald-600">Completed Jobs</span>
          <h3 className="text-xl font-black text-emerald-600">{bookings.filter((b) => b.status === "Completed").length} Closed</h3>
        </div>
      </div>

      {/* Main DataTable without duplicate headers */}
      <DataTable
        columns={columns}
        data={filteredBookings}
      />

      {/* MODALS */}
      <BookingWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onBookingCreated={handleBookingCreated}
      />

      <AssignPartnerModal
        booking={assignBooking}
        isOpen={!!assignBooking}
        onClose={() => setAssignBooking(null)}
        onPartnerAssigned={handlePartnerAssigned}
      />

      <InspectionFlowModal
        booking={inspectionBooking}
        isOpen={!!inspectionBooking}
        onClose={() => setInspectionBooking(null)}
        onInspectionApproved={handleInspectionApproved}
      />

      <OtpVerificationModal
        booking={otpBooking}
        isOpen={!!otpBooking}
        onClose={() => setOtpBooking(null)}
        onJobCompleted={handleJobCompleted}
      />

      <EditBookingModal
        booking={editingBooking}
        isOpen={!!editingBooking}
        onClose={() => setEditingBooking(null)}
        onBookingUpdated={handleBookingUpdated}
      />

      <BookingDetailsDrawer
        booking={drawerBooking}
        isOpen={!!drawerBooking}
        onClose={() => setDrawerBooking(null)}
        onAssignPartner={(b) => setAssignBooking(b)}
      />

      {/* RIGHT BOTTOM POPUP: CREATED BOOKING INVOICE TOAST */}
      {createdBookingToast && (
        <Portal>
          <div className="fixed bottom-6 right-6 z-[9999999] max-w-sm w-full bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 ring-1 ring-slate-700/50 animate-in slide-in-from-bottom-5 duration-300 outline-none">
            {/* Top Right Close Icon */}
            <button
              type="button"
              onClick={() => setCreatedBookingToast(null)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="space-y-1.5 pr-6 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Booking Confirmed
                  </span>
                  <span className="font-mono text-[11px] font-extrabold text-slate-300">
                    {createdBookingToast.id}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-white truncate">
                  {createdBookingToast.customerName}
                </h4>

                <p className="text-[11px] text-slate-400">
                  {createdBookingToast.serviceTitle} •{" "}
                  <strong className="text-emerald-400 font-extrabold">
                    ₹{(createdBookingToast.totalAmount || 0).toLocaleString()}
                  </strong>
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const bId = createdBookingToast.id;
                      setCreatedBookingToast(null);
                      router.push(`/billing/${bId}`);
                    }}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-lux flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>See Invoice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ─── HIDDEN PRINT CANVAS: STRICT SINGLE-PAGE A4 GST TAX INVOICE PRINT ─── */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body > * {
            display: none !important;
          }
          body > #printable-tax-invoice-portal {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          #printable-tax-invoice-portal * {
            visibility: visible !important;
          }
        }
      `}</style>

      {printTargetBooking && (
        <Portal>
          <div
            id="printable-tax-invoice-portal"
            className="hidden print:block p-0 rounded-3xl bg-white text-black space-y-4 w-full"
          >
            {/* Header */}
            <div className="flex flex-row items-start justify-between gap-2 border-b border-slate-300 pb-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-white border border-slate-300 shrink-0 flex items-center justify-center">
                  <img
                    src="https://helpmate-theta.vercel.app/logo.png"
                    alt="HelpMate Logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h1 className="font-extrabold text-xl text-black tracking-tight leading-none">
                      HelpMate
                    </h1>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-black border border-slate-300">
                      Varanasi HQ
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-700 font-medium">
                    Sigra Main Road, Near Cantt Railway Station, Varanasi - 221002
                  </p>
                  <p className="text-[10px] font-mono text-slate-700 font-bold">
                    GSTIN: 09AAACH8819Q1ZM • Support: +91 99350 98765
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end text-right space-y-1 shrink-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-black font-extrabold text-[10px] border border-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                  <span>OFFICIAL GST TAX INVOICE</span>
                </div>

                <div className="font-mono text-xs font-black text-black bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-300">
                  Invoice No: <span className="text-black font-extrabold">{formatInvoiceNumber(printTargetBooking.id)}</span>
                </div>

                <div className="text-[10px] text-slate-600 font-semibold">
                  Invoice Date: <span className="font-bold text-black">{printTargetBooking.date || "30 July 2026"}</span>
                </div>
              </div>
            </div>

            {/* Customer & Billing Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
                <span className="font-extrabold text-slate-500 uppercase tracking-wider block text-[9px]">
                  Billed To (Customer Details)
                </span>
                <div className="font-extrabold text-black text-xs">
                  {printTargetBooking.customerName}
                </div>
                <div className="text-slate-800 font-medium text-[10px]">
                  {printTargetBooking.address || `${printTargetBooking.locality}, Varanasi`}
                </div>
                <div className="font-bold text-slate-900 text-[10px]">
                  Phone: {printTargetBooking.customerPhone}
                </div>
                {printTargetBooking.customerGstin && (
                  <div className="font-mono font-bold text-black bg-slate-100 p-0.5 rounded border border-slate-300 text-[9px] w-fit">
                    B2B GSTIN: {printTargetBooking.customerGstin}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
                <span className="font-extrabold text-slate-500 uppercase tracking-wider block text-[9px]">
                  Service & Payment Details
                </span>
                <div className="font-extrabold text-black text-xs">
                  Service: {printTargetBooking.serviceTitle}
                </div>
                <div className="text-slate-800 font-medium text-[10px]">
                  Category: {printTargetBooking.category}
                </div>
                <div className="font-bold text-slate-900 text-[10px]">
                  Payment Method: {printTargetBooking.paymentMethod || "UPI / Digital Prepaid"}
                </div>
                <div className="font-bold text-emerald-700 flex items-center gap-1 text-[10px]">
                  ✓ Payment Status: Paid Clean
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase text-[9px]">
                    <th className="pb-1.5">Item / Description</th>
                    <th className="pb-1.5 text-right">Base Amount</th>
                    <th className="pb-1.5 text-right">CGST (9%)</th>
                    <th className="pb-1.5 text-right">SGST (9%)</th>
                    <th className="pb-1.5 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-black">
                  <tr>
                    <td className="py-2">
                      <div className="font-extrabold text-xs">{printTargetBooking.serviceTitle}</div>
                      <div className="text-[10px] text-slate-600 font-normal">
                        Standard Varanasi Home Service Rate Card (SAC Code: 998719)
                      </div>
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-xs">₹{printTargetBooking.basePrice || 699}</td>
                    <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{printTargetBooking.cgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)}</td>
                    <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{printTargetBooking.sgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)}</td>
                    <td className="py-2 text-right font-mono font-extrabold text-black text-xs">
                      ₹{(printTargetBooking.basePrice || 699) + (printTargetBooking.cgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)) + (printTargetBooking.sgst || Math.round((printTargetBooking.basePrice || 699) * 0.09))}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="font-bold text-xs">Platform Convenience & Safety Insurance Fee</div>
                      <div className="text-[10px] text-slate-600 font-normal">
                        HelpMate Safety Insurance & Tech Assignment
                      </div>
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-xs">₹{printTargetBooking.convenienceFee || 49}</td>
                    <td className="py-2 text-right font-mono text-slate-700 text-xs">₹0</td>
                    <td className="py-2 text-right font-mono text-slate-700 text-xs">₹0</td>
                    <td className="py-2 text-right font-mono font-bold text-xs">₹{printTargetBooking.convenienceFee || 49}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tax Summary & Total Box */}
            <div className="flex flex-row justify-between items-start gap-4 border-t border-slate-300 pt-3">
              <div className="text-[10px] text-slate-600 space-y-0.5 max-w-sm">
                <span className="font-extrabold text-black block text-xs">Terms & Conditions</span>
                <p>1. Invoice generated under GST Act 2017 for Varanasi Jurisdiction.</p>
                <p>2. SAC Code 998719 applies to Home Maintenance & Repair Services.</p>
              </div>

              <div className="w-60 p-2.5 rounded-xl bg-slate-50 border border-slate-300 space-y-1 text-xs">
                <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                  <span>Base Subtotal</span>
                  <span className="font-mono font-bold">₹{(printTargetBooking.basePrice || 699) + (printTargetBooking.convenienceFee || 49)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                  <span>CGST (9%)</span>
                  <span className="font-mono font-bold">₹{printTargetBooking.cgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                  <span>SGST (9%)</span>
                  <span className="font-mono font-bold">₹{printTargetBooking.sgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-xs font-black text-black">
                  <span>Grand Total</span>
                  <span className="font-mono text-emerald-700 font-bold text-xs">₹{printTargetBooking.totalAmount || 873}</span>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

