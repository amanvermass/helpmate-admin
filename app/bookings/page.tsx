"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialBookings, initialTechnicians, Booking, Technician } from "@/lib/mockData";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Send,
  X,
  Printer,
  Download,
  KeyRound,
  RotateCcw,
} from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Modals & Drawers
  const [inspectionBooking, setInspectionBooking] = useState<Booking | null>(null);
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [refundBooking, setRefundBooking] = useState<Booking | null>(null);
  const [assignBooking, setAssignBooking] = useState<Booking | null>(null);

  // State for Inspection Form
  const [updatedQuote, setUpdatedQuote] = useState<number>(699);
  const [otpInput, setOtpInput] = useState("");
  const [otpMessage, setOtpMessage] = useState("");

  // State for Refund Form
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState("Service Satisfaction Issue");

  const handleUpdateInspectionPrice = (b: Booking) => {
    const updated = bookings.map((item) => {
      if (item.id === b.id) {
        return {
          ...item,
          updatedInspectionQuote: updatedQuote,
          basePrice: updatedQuote,
          totalAmount: Math.round(updatedQuote * 1.18 + 49),
          inspectionApprovedByCustomer: true,
        };
      }
      return item;
    });
    setBookings(updated);
    alert(`Updated final quote to ₹${updatedQuote} and sent customer approval link to ${b.customerPhone}`);
    setInspectionBooking(null);
  };

  const handleVerifyOtp = (b: Booking) => {
    if (otpInput !== (b.otpCode || "8821")) {
      setOtpMessage("Invalid 4-digit OTP. Please ask customer for correct code.");
      return;
    }

    const updated = bookings.map((item) => {
      if (item.id === b.id) {
        return {
          ...item,
          isOtpVerified: true,
          status: "Completed" as const,
        };
      }
      return item;
    });
    setBookings(updated);
    setOtpMessage("OTP Verified! Job successfully closed & completed.");
    setTimeout(() => {
      setInspectionBooking(null);
      setOtpMessage("");
    }, 1500);
  };

  const handleRecordRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundBooking) return;

    const updated = bookings.map((item) => {
      if (item.id === refundBooking.id) {
        return {
          ...item,
          isRefunded: true,
          refundAmount,
          refundReason,
          status: "Cancelled" as const,
        };
      }
      return item;
    });
    setBookings(updated);
    alert(`Recorded refund of ₹${refundAmount} for ${refundBooking.id}`);
    setRefundBooking(null);
  };

  const handleAssignPartner = (tech: Technician) => {
    if (!assignBooking) return;
    const updated = bookings.map((item) => {
      if (item.id === assignBooking.id) {
        return {
          ...item,
          technicianId: tech.id,
          technicianName: tech.name,
          status: "Assigned" as const,
        };
      }
      return item;
    });
    setBookings(updated);
    alert(`Manually assigned partner ${tech.name} to ${assignBooking.id}`);
    setAssignBooking(null);
  };

  const columns: Column<Booking>[] = [
    {
      key: "id",
      header: "Booking ID & GST",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-extrabold text-brand-600 text-xs">
            {row.id}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            {row.invoiceType} Invoice {row.customerGstin ? `(${row.customerGstin})` : ""}
          </span>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Customer & Varanasi Locality",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900">{row.customerName}</span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-600" /> {row.locality} ({row.pincode})
          </span>
        </div>
      ),
    },
    {
      key: "serviceTitle",
      header: "Service & Add-ons",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.serviceTitle}</span>
          {row.isInspectionBased && (
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded w-fit border border-amber-200">
              Inspection Diagnostic Flow
            </span>
          )}
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Total & 25% Comm.",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900">
            ₹{row.totalAmount}
          </span>
          <span className="text-[9px] font-semibold text-emerald-600">
            Comm: ₹{row.commissionAmount} (25%)
          </span>
        </div>
      ),
    },
    {
      key: "technicianName",
      header: "Assigned Tech",
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          {row.technicianName ? (
            <span className="font-bold text-slate-900 text-xs">
              {row.technicianName}
            </span>
          ) : (
            <button
              onClick={() => setAssignBooking(row)}
              className="text-[10px] font-bold px-2 py-1 rounded bg-brand-50 text-brand-600 hover:bg-brand-100 border border-brand-200 cursor-pointer"
            >
              + Assign Tech
            </button>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status & OTP",
      accessor: (row) => (
        <div className="flex flex-col gap-1">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold w-fit ${
              row.status === "Completed"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : row.status === "In Progress"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : row.status === "Assigned"
                ? "bg-purple-50 text-purple-700 border border-purple-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {row.status}
          </span>
          {row.isOtpVerified ? (
            <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" /> OTP Verified
            </span>
          ) : (
            <button
              onClick={() => {
                setInspectionBooking(row);
                setUpdatedQuote(row.basePrice);
              }}
              className="text-[9px] font-bold text-brand-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <KeyRound className="w-2.5 h-2.5" /> Enter OTP Code
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        title="Bookings & Dispatch Command Center"
        description="Manual dispatch, inspection diagnostic quotes, OTP job completion & GST invoicing."
        columns={columns}
        data={bookings}
        searchPlaceholder="Search booking ID, customer name, or Varanasi locality..."
        onRowEdit={(row) => {
          setInvoiceBooking(row);
        }}
      />

      {/* INSPECTION DIAGNOSTIC & OTP JOB CLOSURE DRAWER */}
      {inspectionBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Inspection Quote & OTP Job Closure
                </h3>
                <p className="text-xs text-slate-500 font-mono">Ref: {inspectionBooking.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectionBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Inspection Quote Adjustment */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Partner Inspection Diagnostic Update
              </h4>
              <p className="text-[11px] text-amber-800">
                Partner inspected site at {inspectionBooking.locality}. Update total repair quote for customer approval.
              </p>

              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Final Validated Base Quote (₹)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={updatedQuote}
                    onChange={(e) => setUpdatedQuote(Number(e.target.value))}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleUpdateInspectionPrice(inspectionBooking)}
                    className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
                  >
                    Send Approval Link
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: OTP Job Closure Verification */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-brand-600" /> Verify Customer 4-Digit OTP Code
              </h4>
              <p className="text-[11px] text-slate-500">
                Ask customer <strong className="text-slate-900">{inspectionBooking.customerName}</strong> ({inspectionBooking.customerPhone}) for security completion OTP.
              </p>

              {otpMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  {otpMessage}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="e.g. 8821"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-extrabold text-center text-slate-900 tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyOtp(inspectionBooking)}
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux"
                  >
                    Verify & Close Job
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 block text-center">
                  Demo Customer OTP Code: <strong className="text-slate-700">{inspectionBooking.otpCode || "8821"}</strong>
                </span>
              </div>
            </div>

            {/* Refund Trigger Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setRefundBooking(inspectionBooking);
                  setRefundAmount(inspectionBooking.totalAmount);
                  setInspectionBooking(null);
                }}
                className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Record Booking Refund</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B2C / B2B GST TAX INVOICE MODAL */}
      {invoiceBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <img src="https://helpmate-theta.vercel.app/logo.png" alt="HelpMate" className="h-6 w-auto" />
                <span className="font-extrabold text-sm text-slate-900">Official GST Tax Invoice</span>
              </div>
              <button type="button" onClick={() => setInvoiceBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Printable Body */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Billed To</span>
                  <span className="font-bold text-slate-900 block">{invoiceBooking.customerName}</span>
                  <span className="text-slate-500 block">{invoiceBooking.address}</span>
                  {invoiceBooking.customerGstin && (
                    <span className="text-[10px] font-mono text-brand-600 font-bold block">
                      GSTIN: {invoiceBooking.customerGstin}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Invoice Details</span>
                  <span className="font-mono font-extrabold text-brand-600 block">INV-{invoiceBooking.id}</span>
                  <span className="text-slate-500 block">{invoiceBooking.date}</span>
                  <span className="text-[10px] font-bold text-emerald-600 block">{invoiceBooking.invoiceType} Tax Invoice</span>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-slate-500 text-[10px] uppercase border-b pb-1">
                  <span>Description</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>{invoiceBooking.serviceTitle} ({invoiceBooking.locality})</span>
                  <span>₹{invoiceBooking.basePrice}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Platform Convenience Fee</span>
                  <span>₹{invoiceBooking.convenienceFee}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>CGST (9%)</span>
                  <span>₹{invoiceBooking.cgst}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>SGST (9%)</span>
                  <span>₹{invoiceBooking.sgst}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold">
                <span className="text-slate-900">Total Amount Paid</span>
                <span className="text-brand-600">₹{invoiceBooking.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Downloaded INV-${invoiceBooking.id}.pdf`);
                  setInvoiceBooking(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL REFUND MODAL */}
      {refundBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordRefund}
            className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Record Manual Refund</h3>
              <button type="button" onClick={() => setRefundBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Refund Amount (₹)</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Reason</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
              >
                <option value="Customer Cancellation">Customer Cancellation</option>
                <option value="Service Satisfaction Issue">Service Satisfaction Issue</option>
                <option value="Technician Unavailability">Technician Unavailability</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
            >
              Submit Refund Record
            </button>
          </form>
        </div>
      )}

      {/* MANUAL PARTNER ASSIGNMENT DRAWER */}
      {assignBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Manual Partner Assignment
                </h3>
                <p className="text-xs text-slate-500 font-mono">Target Locality: {assignBooking.locality}</p>
              </div>
              <button type="button" onClick={() => setAssignBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Available Verified Varanasi Technicians
              </span>

              {initialTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={tech.avatar} alt={tech.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{tech.name}</span>
                      <span className="text-[10px] text-slate-400 block">{tech.role} ({tech.locality})</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAssignPartner(tech)}
                    className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-xs"
                  >
                    Assign Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
