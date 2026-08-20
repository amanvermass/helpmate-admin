"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Wrench,
  CreditCard,
  FileText,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  History,
  Mail,
  Copy,
  Check,
  Award,
  Sparkles,
} from "lucide-react";
import { Booking } from "@/lib/mockData";
import { Portal } from "@/components/Portal";

interface BookingDetailsDrawerProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignPartner?: (booking: Booking) => void;
}

export function BookingDetailsDrawer({
  booking,
  isOpen,
  onClose,
  onAssignPartner,
}: BookingDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"general" | "timeline" | "payment" | "invoice">("general");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !booking) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const base = booking.basePrice || 699;
  const convenienceFee = booking.convenienceFee || 49;
  const taxableAmount = base + convenienceFee;
  const cgst = booking.cgst || Math.round(taxableAmount * 0.09);
  const sgst = booking.sgst || Math.round(taxableAmount * 0.09);
  const finalTotal = booking.totalAmount || taxableAmount + cgst + sgst;

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-xs flex justify-end outline-none">
        <div
          className="absolute inset-0"
          onClick={onClose}
        />
        <div className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">

          {/* Executive Drawer Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-600 via-brand-700 to-purple-700 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-white bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded border border-white/20">
                  {booking.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-[10px] text-white/80 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3">
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${booking.status === "Completed"
                  ? "bg-emerald-300 text-slate-950"
                  : booking.status === "In Progress" || booking.status === "Assigned"
                    ? "bg-blue-200 text-slate-950"
                    : "bg-amber-200 text-slate-950"
                  }`}
              >
                ● {booking.status}
              </span>
              <h2 className="text-lg font-black text-white mt-1 leading-snug">{booking.serviceTitle}</h2>
              <p className="text-xs text-white/80 font-medium">{booking.locality}, {booking.city || "Varanasi"}</p>
            </div>
          </div>

          {/* Navigation Tab Pills */}
          <div className="px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 text-xs bg-slate-50 dark:bg-slate-800/50">
            {(["general", "timeline", "payment", "invoice"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer ${activeTab === tab
                  ? "bg-brand-500 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Drawer Content */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs">
            {/* GENERAL TAB */}
            {activeTab === "general" && (
              <div className="space-y-4">
                {/* Customer Details */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Customer Information</span>
                  <div className="font-black text-sm text-slate-900 dark:text-white">{booking.customerName}</div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-brand-500" />
                    <span className="font-bold">{booking.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                    <span>{booking.address}, {booking.locality}, {booking.city || "Varanasi"} - {booking.pincode || "221002"}</span>
                  </div>
                </div>

                {/* Fleet Specialist Info */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Assigned Service Partner</span>
                    {onAssignPartner && (
                      <button
                        type="button"
                        onClick={() => onAssignPartner(booking)}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 hover:underline cursor-pointer"
                      >
                        {booking.technicianName ? "Change Partner" : "+ Assign Partner"}
                      </button>
                    )}
                  </div>
                  {booking.technicianName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                          {booking.technicianName[0]}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 dark:text-white">{booking.technicianName}</div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified HelpMate Partner
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                        Active
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-amber-600 font-bold italic block">No Service Partner Assigned</span>
                      {onAssignPartner && (
                        <button
                          type="button"
                          onClick={() => onAssignPartner(booking)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[10px] transition-all cursor-pointer"
                        >
                          Assign Now
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                {booking.notes && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 block">Customer Notes</span>
                    <p className="text-amber-900 dark:text-amber-200 font-medium">{booking.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === "timeline" && (
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-900 dark:text-white">Booking Lifecycle Timeline</h4>
                <div className="space-y-4 relative pl-5 border-l-2 border-slate-200 dark:border-slate-800">
                  <div className="relative space-y-0.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -left-[27px] top-1 ring-4 ring-white dark:ring-slate-900"></span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Step 1</span>
                    <div className="font-black text-slate-900 dark:text-white">Order Registered</div>
                    <p className="text-slate-500 text-[11px]">Customer placed order on HelpMate Varanasi Web App</p>
                  </div>

                  <div className="relative space-y-0.5">
                    <span className={`w-3 h-3 rounded-full absolute -left-[27px] top-1 ring-4 ring-white dark:ring-slate-900 ${booking.technicianName ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}></span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Step 2</span>
                    <div className="font-black text-slate-900 dark:text-white">Partner Matched</div>
                    <p className="text-slate-500 text-[11px]">{booking.technicianName ? `Assigned to ${booking.technicianName}` : "Pending assignment"}</p>
                  </div>

                  <div className="relative space-y-0.5">
                    <span className={`w-3 h-3 rounded-full absolute -left-[27px] top-1 ring-4 ring-white dark:ring-slate-900 ${booking.isOtpVerified ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}></span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">Step 3</span>
                    <div className="font-black text-slate-900 dark:text-white">Job Completion OTP</div>
                    <p className="text-slate-500 text-[11px]">{booking.isOtpVerified ? "OTP Verified successfully" : `Completion OTP: ${booking.otpCode || "4920"}`}</p>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT TAB */}
            {activeTab === "payment" && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-black text-slate-900 dark:text-white">Financial Breakdown</h4>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Base Fare</span><span className="font-bold text-slate-900 dark:text-white">₹{base}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Convenience Fee</span><span className="font-bold text-slate-900 dark:text-white">₹{convenienceFee}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>CGST (9%) + SGST (9%)</span><span className="font-bold text-slate-900 dark:text-white">₹{cgst + sgst}</span></div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-sm font-black text-brand-600 dark:text-brand-400">
                  <span>Total Amount Billed</span>
                  <span>₹{finalTotal}</span>
                </div>
                <div className="pt-2 text-slate-500 font-medium border-t border-slate-200 dark:border-slate-700">
                  Payment Method: <span className="font-bold text-slate-900 dark:text-white">{booking.paymentMethod || "UPI"}</span>
                </div>
              </div>
            )}

            {/* INVOICE TAB */}
            {activeTab === "invoice" && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 text-center">
                <FileText className="w-10 h-10 text-brand-600 mx-auto" />
                <h4 className="font-black text-slate-900 dark:text-white">GST Tax Invoice #{booking.id}</h4>
                <p className="text-slate-500 text-[11px]">B2C Registered Tax Invoice · HelpMate Varanasi</p>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  Print Tax Invoice
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
