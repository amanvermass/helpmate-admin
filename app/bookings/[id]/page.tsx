"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { initialBookings, Booking, initialTechnicians, Technician, initialCustomers, SelectedAddOnItem } from "@/lib/mockData";
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
  UserPlus,
  Activity,
  Check,
  IndianRupee,
  CreditCard,
  Building2,
  FileCheck,
  Star,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
  Home,
  UserCheck,
  Package,
} from "lucide-react";
import { AssignPartnerModal } from "@/components/bookings/AssignPartnerModal";
import { InspectionFlowModal } from "@/components/bookings/InspectionFlowModal";
import { OtpVerificationModal } from "@/components/bookings/OtpVerificationModal";
import { EditBookingModal } from "@/components/bookings/EditBookingModal";
import { RescheduleBookingModal } from "@/components/bookings/RescheduleBookingModal";
import { Portal } from "@/components/Portal";
import { useRbac } from "@/context/RbacContext";

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const bookingId = resolvedParams.id;
  const { role } = useRbac();
  const isOfficeAdmin = role === "Office Admin";

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const currentBooking = bookings.find((b) => b.id.toLowerCase() === bookingId.toLowerCase()) || bookings[0];

  // Customer Order Sequence Calculation
  const customerBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        (currentBooking.customerPhone && b.customerPhone === currentBooking.customerPhone) ||
        (currentBooking.customerName && b.customerName?.toLowerCase() === currentBooking.customerName?.toLowerCase())
    );
  }, [bookings, currentBooking]);

  const sortedCustomerBookings = useMemo(() => {
    return [...customerBookings].sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ""), 10) || 0;
      return numA - numB;
    });
  }, [customerBookings]);

  const currentBookingIndex = sortedCustomerBookings.findIndex((b) => b.id === currentBooking.id);
  const orderNumber = currentBookingIndex >= 0 ? currentBookingIndex + 1 : 1;
  const totalCustomerOrders = Math.max(customerBookings.length, 1);
  const isFirstOrder = orderNumber === 1;
  const isNewCustomer = totalCustomerOrders === 1 && isFirstOrder;

  const getOrdinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const orderOrdinalText = `${getOrdinalSuffix(orderNumber)} Order`;

  // Modals
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReschedule = (
    id: string,
    newDate: string,
    newTimeSlot: string,
    technicianId?: string,
    technicianName?: string
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            date: newDate,
            timeSlot: newTimeSlot,
            technicianId: technicianId || b.technicianId,
            technicianName: technicianName || b.technicianName,
            status: technicianName ? (b.status === "Pending" || b.status === "Waiting For Assignment" ? "Assigned" : b.status) : b.status,
          };
        }
        return b;
      })
    );
  };

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

  const handleJobCompleted = (
    id: string,
    addOns?: SelectedAddOnItem[],
    addOnsBaseTotal?: number,
    addOnsGstTotal?: number,
    addOnsFinalTotal?: number
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              isOtpVerified: true,
              status: "Completed",
              completedAddOns: addOns || b.completedAddOns,
              addOnsBaseTotal: addOnsBaseTotal ?? b.addOnsBaseTotal,
              addOnsGstTotal: addOnsGstTotal ?? b.addOnsGstTotal,
              addOnsFinalTotal: addOnsFinalTotal ?? b.addOnsFinalTotal,
              totalAmount: b.totalAmount + (addOnsFinalTotal || 0),
            }
          : b
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

  const getCustomerId = (name?: string, phone?: string) => {
    if (!name && !phone) return "cust-1";
    const found = initialCustomers.find(
      (c) => (phone && c.phone === phone) || (name && c.name.toLowerCase() === name.toLowerCase())
    );
    return found ? found.id : "cust-1";
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

      {isOfficeAdmin ? (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Clean Back Button */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <Link
              href={currentBooking.category ? `/bookings?category=${encodeURIComponent(currentBooking.category)}` : "/bookings"}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-brand-600" />
              <span>Back to Bookings Directory</span>
            </Link>

            <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-3 py-1 rounded-xl border border-brand-200 dark:border-brand-800">
              BOOKING ID: {currentBooking.id}
            </span>
          </div>

          {/* Office Admin Minimal Booking Status Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Office Admin Booking Overview</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{currentBooking.serviceTitle}</h2>
              </div>
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xs shrink-0 ${
                  currentBooking.status === "Completed"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                    : currentBooking.status === "In Progress" || currentBooking.status === "Assigned"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current inline-block animate-pulse" />
                <span>Status: {currentBooking.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Name</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm block">{currentBooking.customerName}</span>
                <span className="text-slate-500 font-medium font-mono">{currentBooking.customerPhone}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Working Date & Time</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm block">{currentBooking.date || "30 July 2026"}</span>
                <span className="text-slate-500 font-medium">{currentBooking.timeSlot || "09:00 AM - 11:00 AM"}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Service Partner</span>
                {currentBooking.technicianName ? (
                  <div>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-300 text-sm block flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      {currentBooking.technicianName}
                    </span>
                    <span className="text-slate-500 font-mono font-bold mt-0.5 block">
                      {currentBooking.technicianPhone || "+91 98390 11200"}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-200 inline-block mt-1">
                    Unassigned
                  </span>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Location Address</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs block leading-relaxed">{currentBooking.address || `${currentBooking.locality}, Varanasi`}</span>
                <span className="text-slate-500 font-medium block mt-0.5">{currentBooking.locality}, Varanasi</span>
              </div>
            </div>

            {/* Visual Booking Lifecycle Progress Tracker */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-500" />
                <span>Current Booking Status Tracking</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-300 text-[11px] block">1. Booking Placed</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block">Created by {currentBooking.createdBy || "Office Admin"}</span>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 ${
                  currentBooking.technicianName
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
                }`}>
                  <span className="font-extrabold text-[11px] block">2. Partner Status</span>
                  <span className="text-[10px] block">{currentBooking.technicianName ? `Assigned (${currentBooking.technicianName})` : "Awaiting Partner Assignment"}</span>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 ${
                  currentBooking.status === "In Progress" || currentBooking.status === "Completed"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-500"
                }`}>
                  <span className="font-extrabold text-[11px] block">3. Service Execution</span>
                  <span className="text-[10px] block">{currentBooking.status === "In Progress" ? "In Progress On-Site" : currentBooking.status === "Completed" ? "Service Completed" : "Pending On-Site Visit"}</span>
                </div>

                <div className={`p-3 rounded-xl border space-y-1 ${
                  currentBooking.status === "Completed"
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-500"
                }`}>
                  <span className="font-extrabold text-[11px] block">4. Final Settlement</span>
                  <span className="text-[10px] block">{currentBooking.status === "Completed" ? "Completed & Closed" : "Pending OTP Verification"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ─── CLEAN DETAIL TOP BAR (Enterprise Style) ─── */}
          {/* Top Header Bar & Action Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 print:hidden">
            <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={currentBooking.category ? `/bookings?category=${encodeURIComponent(currentBooking.category)}` : "/bookings"}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-brand-600" />
              <span>Back to {currentBooking.category || "Bookings"} Directory</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
            <span className="font-mono text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800">
              BOOKING ID: {currentBooking.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>{copied ? "Copied ID!" : "Copy Booking ID"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 pt-1 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentBooking.serviceTitle}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-xs ${currentBooking.status === "Completed"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                : currentBooking.status === "In Progress" || currentBooking.status === "Assigned"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                }`}
            >
              <span className="w-2 h-2 rounded-full bg-current inline-block animate-pulse" />
              <span>{currentBooking.status}</span>
            </span>

            {/* First Order / Order Number Badge */}
            {isNewCustomer ? (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs flex items-center gap-1.5 animate-pulse">
                <UserPlus className="w-3.5 h-3.5" />
                <span>New Customer • 1st Order</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{orderOrdinalText}</span>
              </span>
            )}
          </div>
        </div>

        {/* Top Header Action Buttons - Single Line Guaranteed */}
        <div className="flex items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar shrink-0">
          {currentBooking.technicianName ? (
            <button
              type="button"
              onClick={() => setIsAssignOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Reassign Partner</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAssignOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Assign Partner</span>
            </button>
          )}

          {currentBooking.status !== "Completed" && (
            <button
              type="button"
              onClick={() => setIsInspectionOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span>Diagnostic Quote</span>
            </button>
          )}

          {!currentBooking.isOtpVerified && (
            <button
              type="button"
              onClick={() => setIsOtpOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <KeyRound className="w-4 h-4 shrink-0" />
              <span>Verify Job OTP</span>
            </button>
          )}

          {!isOfficeAdmin && (
            <>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Printer className="w-4 h-4 shrink-0" />
                <span>Print Tax Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRescheduleOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <CalendarCheck className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>Reschedule Job</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Edit2 className="w-4 h-4 shrink-0" />
                <span>Edit Booking</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ─── VISUAL BOOKING LIFECYCLE PROGRESS TRACKER BANNER ─── */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            <span>Booking Lifecycle Status Track</span>
          </span>
          <span className="text-slate-500 font-semibold">
            Varanasi Zone • Scheduled: <strong className="text-slate-900 dark:text-white">{currentBooking.date || "30 July 2026"}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-1">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Booking Placed</span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-medium">Customer Request Confirmed</span>
          </div>

          <div className={`p-3 rounded-2xl border space-y-1 ${currentBooking.technicianName
            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
            : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300"
            }`}>
            <div className="flex items-center gap-1.5 font-extrabold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. Service Partner</span>
            </div>
            <span className="text-[10px] font-medium block">
              {currentBooking.technicianName ? `Assigned to ${currentBooking.technicianName}` : "Awaiting Partner Match"}
            </span>
          </div>

          <div className={`p-3 rounded-2xl border space-y-1 ${currentBooking.basePrice > 0
            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}>
            <div className="flex items-center gap-1.5 font-extrabold text-[11px]">
              <Wrench className="w-3.5 h-3.5" />
              <span>3. Inspection & Quote</span>
            </div>
            <span className="text-[10px] font-medium block">Rate: ₹{base} Base Verified</span>
          </div>

          <div className={`p-3 rounded-2xl border space-y-1 ${currentBooking.status === "In Progress" || currentBooking.status === "Completed"
            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}>
            <div className="flex items-center gap-1.5 font-extrabold text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>4. Service Execution</span>
            </div>
            <span className="text-[10px] font-medium block">On-Site Work in Varanasi</span>
          </div>

          <div className={`p-3 rounded-2xl border space-y-1 col-span-2 sm:col-span-1 ${currentBooking.isOtpVerified || currentBooking.status === "Completed"
            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}>
            <div className="flex items-center gap-1.5 font-extrabold text-[11px]">
              <KeyRound className="w-3.5 h-3.5" />
              <span>5. OTP & Settled</span>
            </div>
            <span className="text-[10px] font-medium block">
              {currentBooking.isOtpVerified ? "Job Closed & Paid Clean" : `Security Code: ${currentBooking.otpCode || "4920"}`}
            </span>
          </div>
        </div>
      </div>

      {/* ─── ENHANCED 2-COLUMN RECORD DETAIL LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column (7 Cols): Primary Specifications, Appliance Technical Data, Multi-Service Line Items, Partner & Diagnostic Reports */}
        <div className="lg:col-span-7 space-y-6">

          {/* Card 1: Order Specifications & Technical Appliance Metadata */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-brand-600" /> Booking Specifications & Technical Meta
              </span>
              <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800">
                {currentBooking.category}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Service Package</span>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm">{currentBooking.serviceTitle}</div>
                <div className="text-slate-500 font-semibold">{currentBooking.subCategory || currentBooking.packageTitle || "Standard Home Service Package"}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Schedule Slot & Location</span>
                <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-500" />
                  {currentBooking.date || "30 July 2026"}
                </div>
                <div className="text-slate-500 font-semibold">{currentBooking.locality}, {currentBooking.city || "Varanasi"}</div>
              </div>
            </div>

            {/* Destination Service Address & Recipient Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Delivery / Service Address</span>
                {currentBooking.addressRecipientType && (
                  <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-300">
                    Recipient: {currentBooking.addressRecipientType}
                  </span>
                )}
              </div>

              {currentBooking.addressRecipientType && currentBooking.addressRecipientType !== "Self" && (
                <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-bold text-xs flex items-center justify-between">
                  <span>👤 Recipient Contact: {currentBooking.recipientName || "Family / Friend"}</span>
                  {currentBooking.recipientPhone && <span className="font-mono">{currentBooking.recipientPhone}</span>}
                </div>
              )}

              <div className="font-bold text-slate-900 dark:text-white flex items-start gap-2 text-sm leading-relaxed">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-1" />
                <div>
                  <div>{currentBooking.address || "D-38/21, Sigra Central Main Road"}</div>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    {currentBooking.locality}, {currentBooking.city || "Varanasi"} - {currentBooking.pincode || "221002"}
                  </div>
                </div>
              </div>
            </div>

            {currentBooking.notes && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs space-y-1">
                <span className="font-extrabold text-amber-800 dark:text-amber-300 block flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Special Customer Request Notes:
                </span>
                <p className="text-amber-900 dark:text-amber-200 font-medium">{currentBooking.notes}</p>
              </div>
            )}
          </div>

          {/* Card 2: Multi-Service Included Line Items */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Itemized Service Line Items ({currentBooking.servicesList?.length || 1} Services)
              </span>
              <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                30 Days HelpMate Warranty
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {currentBooking.servicesList && currentBooking.servicesList.length > 0 ? (
                currentBooking.servicesList.map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                        <span>{idx + 1}. {item.title}</span>
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300">
                          {item.serviceCode || `HM-SVC-${currentBooking.id.replace(/[^0-9]/g, "")}-${String(idx + 1).padStart(2, "0")}`}
                        </span>
                        {item.category && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity} • ₹{item.price} each</p>
                    </div>
                    <div className="text-right font-black text-slate-900 dark:text-white text-sm font-mono">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                      <span>1. {currentBooking.serviceTitle}</span>
                      <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300">
                        HM-SVC-{currentBooking.id.replace(/[^0-9]/g, "")}-01
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">1 Unit • Includes standard jet wash & safety inspection</p>
                  </div>
                  <div className="text-right font-black text-slate-900 dark:text-white text-sm font-mono">
                    ₹{base}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card: Job Completion Add-On Products & Services (If Any) */}
          {currentBooking.completedAddOns && currentBooking.completedAddOns.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" /> Completed Job Add-On Products & Spares ({currentBooking.completedAddOns.length} Items)
                </span>
                <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  GST Verified
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {currentBooking.completedAddOns.map((item, idx) => (
                  <div key={item.id || idx} className="p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                        <span>{item.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          item.isUnlisted
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}>
                          {item.isUnlisted ? "Unlisted Custom Item" : "Listed Catalog"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Base Price: ₹{item.price} + GST (18%): ₹{item.gstAmount}</p>
                    </div>
                    <div className="text-right font-black text-emerald-700 dark:text-emerald-300 text-sm font-mono">
                      ₹{item.totalPrice}
                    </div>
                  </div>
                ))}

                <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between font-extrabold text-xs mt-2">
                  <span>Total Add-On Charges (Base + GST):</span>
                  <span className="font-mono text-emerald-400 text-sm">
                    ₹{currentBooking.addOnsFinalTotal || currentBooking.completedAddOns.reduce((acc, i) => acc + i.totalPrice, 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Assigned Service Partner & Partner KYC
              </span>
              {currentBooking.technicianName && (
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(true)}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                >
                  Change Partner
                </button>
              )}
            </div>

            {currentBooking.technicianName ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-lg shadow-xs shrink-0">
                      {currentBooking.technicianName[0]}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-1.5">
                        {currentBooking.technicianName}
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">Senior AC & Home Service Partner • Varanasi</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          ★ 4.9 Rating (148 Jobs)
                        </span>
                        <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                          Thana PCC Verified Clean
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                    <a
                      href={`tel:${currentBooking.technicianPhone || "+919935098765"}`}
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Partner</span>
                    </a>
                    <Link
                      href="/technicians"
                      className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Partner Profile</span>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold">Partner Bike / Vehicle No</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">UP 65 AB 4920</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-semibold">Base Operating Zone</span>
                    <span className="font-bold text-slate-900 dark:text-white">{currentBooking.locality || "Sigra"}, Varanasi</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block font-semibold">Police PCC Token</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">PCC-VAR-2026-8819</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">No Partner Assigned</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Match an available technician from Varanasi Sigra / Lanka active partners.
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

          {/* Card 4: Diagnostic Inspection & Safety Report */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" /> Technician Diagnostic Inspection Report
              </span>
              <span className="text-[11px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                Verified On-Site
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 space-y-2">
              <span className="font-extrabold text-blue-900 dark:text-blue-300 block">Pre-Service Inspection Remarks:</span>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {currentBooking.inspectionRemarks || "Nitrogen pressure tested at 350 PSI. Cleaned indoor coil with anti-bacterial foam wash. Capacitor replaced and gas level verified at 65 PSI."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Gas Pressure</span>
                <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">65 PSI (Normal)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Electrical Voltage</span>
                <span className="font-mono font-extrabold text-slate-900 dark:text-white">220V (Earthing PASS)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">Parts Replaced</span>
                <span className="font-extrabold text-slate-900 dark:text-white">Capacitor 45uF</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN (5 Cols): CUSTOMER CRM, UPI PAYMENT LEDGER & AUDIT ─── */}
        <div className="lg:col-span-5 space-y-6">

          {/* Card 1: Customer CRM & Contact Intelligence Profile */}
          {!isOfficeAdmin && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Customer CRM & Contact Profile
                </span>
                {isNewCustomer ? (
                  <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    New Customer (1st Order)
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
                    {orderOrdinalText}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black flex items-center justify-center text-lg shadow-xs shrink-0">
                  {currentBooking.customerName[0]}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const custId = getCustomerId(currentBooking.customerName, currentBooking.customerPhone);
                      router.push(`/customers/${custId}?from=${encodeURIComponent(`/bookings/${currentBooking.id}`)}`);
                    }}
                    className="font-extrabold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 hover:underline text-base text-left cursor-pointer flex items-center gap-1.5"
                    title={`View ${currentBooking.customerName} customer details`}
                  >
                    <span>{currentBooking.customerName}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-500 block mt-0.5">
                    Varanasi Resident • <strong className="text-slate-900 dark:text-white font-extrabold">{orderOrdinalText}</strong>
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500 font-semibold"><Phone className="w-4 h-4 text-brand-600" /> Mobile Phone</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{currentBooking.customerPhone}</span>
                    <a
                      href={`tel:${currentBooking.customerPhone}`}
                      className="p-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-100 font-bold"
                    >
                      Call
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-500 font-semibold shrink-0"><Mail className="w-4 h-4 text-brand-600" /> Email Address</span>
                  <span className="font-bold text-slate-900 dark:text-white select-all break-all text-right">
                    {currentBooking.customerEmail || `${currentBooking.customerName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`}
                  </span>
                </div>

                {currentBooking.customerGstin && (
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                    <span className="text-purple-700 dark:text-purple-300 font-semibold text-[11px]">B2B Customer GSTIN</span>
                    <span className="font-mono font-bold text-purple-900 dark:text-purple-200">{currentBooking.customerGstin}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card 2: Complete Payment & UPI Gateway Ledger */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Payment & UPI Gateway Ledger
              </span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                ● Paid & Verified Clean
              </span>
            </div>

            {/* UPI & Transaction IDs */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Payment Gateway Method</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentBooking.paymentMethod || "UPI Digital Prepaid"}</span>
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
                <span>Base Service Amount</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{base.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Convenience Fee</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{convenienceFee}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>CGST (9%)</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{cgst}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>SGST (9%)</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{sgst}</span>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-2.5 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Grand Total Amount</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-base font-mono">₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Revenue & Commission Split Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1.5">
              <span className="font-extrabold text-emerald-900 dark:text-emerald-300 block text-[10px] uppercase">
                Platform Commission & Partner Split
              </span>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600 dark:text-slate-400">Partner Payout (75%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">₹{Math.round(base * 0.75)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-600 dark:text-slate-400">HelpMate Platform Earnings (25%)</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">₹{Math.round(base * 0.25)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/billing/${currentBooking.id}`)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4 text-brand-400" />
              <span>Open Tax Invoice Details</span>
            </button>
          </div>

          {/* Card 3: Operations & Calling Audit Log */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs text-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Operations & Calling Audit Log
            </span>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Calling Agent</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentBooking.callingPerson || "Pooja Sharma (Operations Agent)"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Operations Manager</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentBooking.handledBy || "Aman Verma (HQ)"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Confirmation Date</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentBooking.callingDate || "30 July 2026"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Job Security OTP</span>
                <span className="font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 text-[11px]">
                  {currentBooking.otpCode || "4920"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
      </>
      )}

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

      <RescheduleBookingModal
        booking={isRescheduleOpen ? currentBooking : null}
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onReschedule={handleReschedule}
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
                {currentBooking.completedAddOns?.map((addon, aIdx) => {
                  const cgstAddon = Math.round(addon.gstAmount / 2);
                  const sgstAddon = addon.gstAmount - cgstAddon;
                  return (
                    <tr key={addon.id || aIdx}>
                      <td className="py-2">
                        <div className="font-bold text-xs">{addon.name}</div>
                        <div className="text-[10px] text-slate-600 font-normal">
                          {addon.isUnlisted ? "On-Site Unlisted Spare / Service" : "Catalog Add-On Product"} (GST @ 18%)
                        </div>
                      </td>
                      <td className="py-2 text-right font-mono font-bold text-xs">₹{addon.price}</td>
                      <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{cgstAddon}</td>
                      <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{sgstAddon}</td>
                      <td className="py-2 text-right font-mono font-extrabold text-black text-xs">₹{addon.totalPrice}</td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="py-2">
                    <div className="font-bold text-xs">Platform Convenience & Safety Insurance Fee</div>
                    <div className="text-[10px] text-slate-600 font-normal">
                      HelpMate Safety Insurance & Tech Assignment
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
                <span className="font-mono font-bold">₹{base + convenienceFee + (currentBooking.addOnsBaseTotal || 0)}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                <span>CGST (9%)</span>
                <span className="font-mono font-bold">₹{cgst + Math.round((currentBooking.addOnsGstTotal || 0) / 2)}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                <span>SGST (9%)</span>
                <span className="font-mono font-bold">₹{sgst + Math.round((currentBooking.addOnsGstTotal || 0) / 2)}</span>
              </div>
              <div className="flex justify-between py-0.5 text-xs font-black text-black">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-700 font-bold text-xs">₹{currentBooking.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </div>
  );
}
