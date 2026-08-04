"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initialBookings, Booking, initialTechnicians, Technician } from "@/lib/mockData";
import {
  ArrowLeft,
  CalendarCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  ShieldCheck,
  Wrench,
  KeyRound,
  Edit2,
  Printer,
  Download,
  AlertCircle,
  Copy,
  Mail,
  Award,
  Sparkles,
  Check,
  IndianRupee,
  CreditCard,
  Building2,
  FileCheck,
  Star,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { AssignPartnerModal } from "@/components/bookings/AssignPartnerModal";
import { InspectionFlowModal } from "@/components/bookings/InspectionFlowModal";
import { OtpVerificationModal } from "@/components/bookings/OtpVerificationModal";
import { EditBookingModal } from "@/components/bookings/EditBookingModal";
import { Portal } from "@/components/Portal";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const bookingId = resolvedParams.id;

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const currentBooking = bookings.find((b) => b.id.toLowerCase() === bookingId.toLowerCase()) || bookings[0];

  // Modals
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePartnerAssigned = (id: string, tech: Technician | null) => {
    setBookings(
      bookings.map((b) =>
        b.id === id
          ? {
              ...b,
              status: tech ? (b.status === "Pending" || b.status === "Waiting For Assignment" ? "Assigned" : b.status) : "Pending",
              technicianName: tech ? tech.name : undefined,
              technicianId: tech ? tech.id : undefined,
            }
          : b
      )
    );
  };

  const handleInspectionApproved = (id: string, quote: number, remarks: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === id
          ? {
              ...b,
              basePrice: quote,
              totalAmount: Math.round(quote * 1.18 + 49),
              inspectionRemarks: remarks,
              status: "Customer Approval Pending",
            }
          : b
      )
    );
  };

  const handleJobCompleted = (id: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, isOtpVerified: true, status: "Completed" } : b
      )
    );
  };

  const handleBookingUpdated = (updated: Booking) => {
    setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentBooking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatInvoiceNumber = (id: string) => {
    if (!id) return "INV-2026-001";
    const cleanId = id.replace(/^(INV-)?(bk-)?/gi, "");
    if (cleanId.length > 5 && !isNaN(Number(cleanId))) {
      return `INV-${cleanId.slice(-5)}`;
    }
    return `INV-${cleanId.toUpperCase()}`;
  };

  // Financial Calculations
  const base = currentBooking.basePrice || 699;
  const convenienceFee = currentBooking.convenienceFee || 49;
  const taxableAmount = base + convenienceFee;
  const cgst = currentBooking.cgst || Math.round(taxableAmount * 0.09);
  const sgst = currentBooking.sgst || Math.round(taxableAmount * 0.09);
  const finalTotal = currentBooking.totalAmount || taxableAmount + cgst + sgst;

  return (
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-300 print:p-0 print:m-0">
      {/* Embedded Strict Single-Page Print CSS for Official Tax Invoice */}
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

      {/* ─── CLEAN DETAIL TOP BAR (Enterprise Style) ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/bookings"
              className="text-xs font-bold text-slate-500 hover:text-brand-600 dark:text-slate-400 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Bookings Directory
            </Link>
            <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
              {currentBooking.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentBooking.serviceTitle}
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-extrabold ${
                currentBooking.status === "Completed"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : currentBooking.status === "In Progress" || currentBooking.status === "Assigned"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              ● {currentBooking.status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {currentBooking.technicianName ? (
            <button
              type="button"
              onClick={() => setIsAssignOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Change Fleet Partner</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAssignOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Assign Fleet Partner</span>
            </button>
          )}

          {currentBooking.status !== "Completed" && (
            <button
              type="button"
              onClick={() => setIsInspectionOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>Diagnostic Quote</span>
            </button>
          )}

          {!currentBooking.isOtpVerified && (
            <button
              type="button"
              onClick={() => setIsOtpOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verify Job OTP</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Booking</span>
          </button>
        </div>
      </div>

      {/* ─── ENHANCED 2-COLUMN RECORD DETAIL LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Primary Specifications, Multi-Service Line Items, Fleet & Audit */}
        <div className="lg:col-span-7 space-y-6">

          {/* Order Specifications Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Booking Information & Specifications
              </span>
              <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                {currentBooking.category}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Package</span>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm">{currentBooking.serviceTitle}</div>
                <div className="text-slate-500 font-semibold">{currentBooking.subCategory || currentBooking.packageTitle || "Standard Service Package"}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Schedule Slot</span>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-500" />
                  {currentBooking.date || "2026-07-28"} • {currentBooking.timeSlot || "10:00 AM - 11:30 AM"}
                </div>
                <div className="text-slate-500 font-semibold">{currentBooking.locality}, {currentBooking.city || "Varanasi"}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination Service Address</span>
              <div className="font-bold text-slate-900 dark:text-white flex items-start gap-2 text-sm leading-relaxed">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-1" />
                <div>
                  <div>{currentBooking.address || "D-38/21, Sigra Central"}</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    {currentBooking.locality}, {currentBooking.city || "Varanasi"} - {currentBooking.pincode || "221002"}
                  </div>
                </div>
              </div>
            </div>

            {currentBooking.notes && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs space-y-1">
                <span className="font-extrabold text-amber-800 dark:text-amber-300 block">Special Customer Notes:</span>
                <p className="text-amber-900 dark:text-amber-200 font-medium">{currentBooking.notes}</p>
              </div>
            )}
          </div>

          {/* ─── NEW: MULTIPLE SERVICES IN SINGLE BOOKING CARD ─── */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Services Line Items (3 Included Services)
              </span>
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                30 Days HelpMate Warranty
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Primary Service Item */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <span>1. {currentBooking.serviceTitle}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      Primary Service
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">1 Unit • Includes standard safety check & inspection</p>
                </div>
                <div className="text-right font-black text-slate-900 dark:text-white text-sm">
                  ₹{base}
                </div>
              </div>

              {/* Additional Service Item 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <span>2. Foam Jet Anti-Bacterial Deep Wash</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Add-on Included
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">1 Unit • Chemical & coil pressure cleaning</p>
                </div>
                <div className="text-right font-black text-slate-900 dark:text-white text-sm">
                  ₹299
                </div>
              </div>

              {/* Additional Service Item 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                    <span>3. Multi-Point Electrical & Gas Safety Check</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Complimentary
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">1 Unit • Full diagnostic report & circuit testing</p>
                </div>
                <div className="text-right font-black text-emerald-600 dark:text-emerald-400 text-xs">
                  FREE
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Fleet Specialist Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Assigned Fleet Partner
              </span>
              {currentBooking.technicianName && (
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(true)}
                  className="text-xs font-bold text-brand-600 hover:underline cursor-pointer"
                >
                  Change Partner
                </button>
              )}
            </div>

            {currentBooking.technicianName ? (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                    {currentBooking.technicianName[0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                      {currentBooking.technicianName}
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">Verified HelpMate Partner • Varanasi</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">★ 4.9 Rating</span>
                  <span className="block text-[10px] text-slate-400 font-semibold">140+ Jobs Done</span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">No Fleet Specialist Assigned</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Match an available technician from Varanasi Sigra / Lanka fleet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Assign Partner Now
                </button>
              </div>
            )}
          </div>

          {/* Job Lifecycle Timeline Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Job Audit & Lifecycle Timeline
            </span>

            <div className="space-y-4 relative pl-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">✓</div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Booking Registered</h5>
                  <p className="text-[11px] text-slate-400">Created via HelpMate Varanasi Engine</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${currentBooking.technicianName ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}>
                  {currentBooking.technicianName ? "✓" : "2"}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Technician Dispatched</h5>
                  <p className="text-[11px] text-slate-400">
                    {currentBooking.technicianName ? `Assigned to ${currentBooking.technicianName}` : "Pending assignment"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${currentBooking.isOtpVerified ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}>
                  {currentBooking.isOtpVerified ? "✓" : "3"}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Job Closure & OTP Verification</h5>
                  <p className="text-[11px] text-slate-400">
                    {currentBooking.isOtpVerified ? `OTP ${currentBooking.otpCode || "4920"} verified successfully` : `Job Closure OTP: ${currentBooking.otpCode || "4920"}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN (5 Cols): NORMAL UN-SCROLLED SIDEBAR ─── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Customer CRM Profile Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Customer CRM Profile
            </span>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white font-black flex items-center justify-center text-base shadow-xs">
                {currentBooking.customerName[0]}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{currentBooking.customerName}</h4>
                <span className="text-[10px] font-bold text-slate-500 block">
                  Varanasi Household Client
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400 font-semibold"><Phone className="w-3.5 h-3.5" /> Phone</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentBooking.customerPhone}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 gap-2">
                <span className="flex items-center gap-1.5 text-slate-400 font-semibold shrink-0"><Mail className="w-3.5 h-3.5" /> Email</span>
                <span className="font-bold text-slate-900 dark:text-white select-all break-all text-right">
                  {currentBooking.customerEmail || `${currentBooking.customerName.toLowerCase().replace(/\s+/g, "")}@helpmate.com`}
                </span>
              </div>
            </div>
          </div>

          {/* ─── ENHANCED UPI PAYMENT & TRANSACTION DETAILS CARD ─── */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Payment & UPI Gateway Ledger
              </span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                ● Paid & Verified
              </span>
            </div>

            {/* UPI & Transaction IDs */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Payment Gateway Method</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentBooking.paymentMethod || "UPI Online"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Customer UPI VPA ID</span>
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800 text-[11px]">
                  {currentBooking.customerName.toLowerCase().replace(/\s+/g, "")}@okicici
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">UPI Transaction Ref ID</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                  TXN-{currentBooking.id.replace(/[^0-9]/g, "") || "89201"}98231
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Bank UTR Number</span>
                <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold text-[11px]">
                  UTR-202607289912
                </span>
              </div>
            </div>

            {/* Price & Tax Invoice Breakdown */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Base Services Price</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{base.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Convenience Fee</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{convenienceFee}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>CGST (9%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{cgst}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>SGST (9%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{sgst}</span>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-2.5 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Total Amount (GST Incl.)</span>
                <span className="text-brand-600 dark:text-brand-400 text-base">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/billing/${currentBooking.id}`)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Tax Invoice</span>
            </button>
          </div>

          {/* Operations & Calling Audit Log */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs text-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Operations & Calling Audit
            </span>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Calling Dispatcher</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentBooking.callingPerson || "Pooja Sharma (Dispatch)"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Operations Managed By</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentBooking.handledBy || "Aman Verma (HQ)"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Calling Date</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentBooking.callingDate || "2026-07-25"}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <AssignPartnerModal
        booking={isAssignOpen ? currentBooking : null}
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onPartnerAssigned={handlePartnerAssigned}
      />

      <InspectionFlowModal
        booking={isInspectionOpen ? currentBooking : null}
        isOpen={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
        onInspectionApproved={handleInspectionApproved}
      />

      <OtpVerificationModal
        booking={isOtpOpen ? currentBooking : null}
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onJobCompleted={handleJobCompleted}
      />

      <EditBookingModal
        booking={isEditOpen ? currentBooking : null}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onBookingUpdated={handleBookingUpdated}
      />

      {/* ─── HIDDEN PRINT CANVAS: EXACT OFFICIAL GST TAX INVOICE MATCHING BILLING INVOICE ─── */}
      <Portal>
        <div
          id="printable-tax-invoice-portal"
          className="hidden print:block p-0 rounded-3xl bg-white text-black space-y-4 w-full"
        >
          {/* Invoice Header: HelpMate Branding & Invoice Meta */}
          <div className="flex flex-row items-start justify-between gap-2 border-b border-slate-300 pb-3">
            {/* Left: Logo & Company Address */}
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

            {/* Right: Official Tax Invoice Meta */}
            <div className="flex flex-col items-end text-right space-y-1 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-black font-extrabold text-[10px] border border-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                <span>OFFICIAL GST TAX INVOICE</span>
              </div>

              <div className="font-mono text-xs font-black text-black bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-300">
                Invoice No: <span className="text-black font-extrabold">{formatInvoiceNumber(currentBooking.id)}</span>
              </div>

              <div className="text-[10px] text-slate-600 font-semibold">
                Invoice Date: <span className="font-bold text-black">{currentBooking.date || "30 July 2026"}</span>
              </div>
            </div>
          </div>

          {/* Customer & Billing Address Information */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
              <span className="font-extrabold text-slate-500 uppercase tracking-wider block text-[9px]">
                Billed To (Customer Details)
              </span>
              <div className="font-extrabold text-black text-xs">
                {currentBooking.customerName}
              </div>
              <div className="text-slate-800 font-medium text-[10px]">
                {currentBooking.address || `${currentBooking.locality}, Varanasi`}
              </div>
              <div className="font-bold text-slate-900 text-[10px]">
                Phone: {currentBooking.customerPhone}
              </div>
              {currentBooking.customerGstin && (
                <div className="font-mono font-bold text-black bg-slate-100 p-0.5 rounded border border-slate-300 text-[9px] w-fit">
                  B2B GSTIN: {currentBooking.customerGstin}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
              <span className="font-extrabold text-slate-500 uppercase tracking-wider block text-[9px]">
                Service & Payment Details
              </span>
              <div className="font-extrabold text-black text-xs">
                Service: {currentBooking.serviceTitle}
              </div>
              <div className="text-slate-800 font-medium text-[10px]">
                Category: {currentBooking.category}
              </div>
              <div className="font-bold text-slate-900 text-[10px]">
                Payment Method: {currentBooking.paymentMethod || "UPI / Digital Prepaid"}
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
                    <div className="font-extrabold text-xs">{currentBooking.serviceTitle}</div>
                    <div className="text-[10px] text-slate-600 font-normal">
                      Standard Varanasi Home Service Rate Card (SAC Code: 998719)
                    </div>
                  </td>
                  <td className="py-2 text-right font-mono font-bold text-xs">₹{base}</td>
                  <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{cgst}</td>
                  <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{sgst}</td>
                  <td className="py-2 text-right font-mono font-extrabold text-black text-xs">
                    ₹{base + cgst + sgst}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <div className="font-bold text-xs">Platform Convenience & Safety Insurance Fee</div>
                    <div className="text-[10px] text-slate-600 font-normal">
                      HelpMate Safety Insurance & Tech Dispatch
                    </div>
                  </td>
                  <td className="py-2 text-right font-mono font-bold text-xs">₹{convenienceFee}</td>
                  <td className="py-2 text-right font-mono text-slate-700 text-xs">₹0</td>
                  <td className="py-2 text-right font-mono text-slate-700 text-xs">₹0</td>
                  <td className="py-2 text-right font-mono font-bold text-xs">₹{convenienceFee}</td>
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
                <span className="font-mono font-bold">₹{base + convenienceFee}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                <span>CGST (9%)</span>
                <span className="font-mono font-bold">₹{cgst}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                <span>SGST (9%)</span>
                <span className="font-mono font-bold">₹{sgst}</span>
              </div>
              <div className="flex justify-between py-0.5 text-xs font-black text-black">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-700 font-bold text-xs">₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </div>
  );
}
