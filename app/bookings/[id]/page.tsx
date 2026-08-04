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

  // Financial Calculations
  const base = currentBooking.basePrice || 699;
  const convenienceFee = currentBooking.convenienceFee || 49;
  const taxableAmount = base + convenienceFee;
  const cgst = currentBooking.cgst || Math.round(taxableAmount * 0.09);
  const sgst = currentBooking.sgst || Math.round(taxableAmount * 0.09);
  const finalTotal = currentBooking.totalAmount || taxableAmount + cgst + sgst;

  return (
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-300">

      {/* ─── CLEAN DETAIL TOP BAR (Enterprise Style) ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
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
            onClick={() => router.push(`/billing/${currentBooking.id}`)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Tax Invoice</span>
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

      {/* ─── CLEAN 2-COLUMN RECORD DETAIL LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">

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

        {/* Right Column (4 Cols): Customer CRM & Payment Breakdown */}
        <div className="lg:col-span-4 space-y-6">

          {/* Customer CRM Card */}
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
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400 font-semibold"><Mail className="w-3.5 h-3.5" /> Email</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                  {currentBooking.customerEmail || "customer@helpmate.com"}
                </span>
              </div>
            </div>
          </div>

          {/* Cost & Tax Invoice Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Payment & GST Invoice
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {currentBooking.paymentMethod || "UPI Online"}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Base Service Price</span>
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
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
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
    </div>
  );
}
