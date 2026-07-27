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
} from "lucide-react";
import { Booking } from "@/lib/mockData";

interface BookingDetailsDrawerProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailsDrawer({
  booking,
  isOpen,
  onClose,
}: BookingDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"general" | "timeline" | "payment" | "invoice">("general");

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex justify-end outline-none">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400">{booking.id}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  booking.status === "Completed"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : booking.status === "In Progress"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {booking.status}
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white mt-1">{booking.serviceTitle}</h2>
          </div>

          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs bg-slate-100/50 dark:bg-slate-800/20">
          {(["general", "timeline", "payment", "invoice"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs">
          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <div className="space-y-4">
              {/* Customer Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Customer Details</span>
                <div className="font-extrabold text-sm text-slate-900 dark:text-white">{booking.customerName}</div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-brand-600" />
                  <span>{booking.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                  <span>{booking.address}, {booking.locality}, {booking.city} - {booking.pincode}</span>
                </div>
              </div>

              {/* Technician Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Fleet Partner</span>
                {booking.technicianName ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">{booking.technicianName}</div>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Certified Specialist
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold">Assigned</span>
                  </div>
                ) : (
                  <span className="text-amber-600 font-bold italic block">No Partner Assigned Yet</span>
                )}
              </div>

              {/* Inspection Report if available */}
              {booking.isInspectionBased && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-600">Inspection Report</span>
                  <div className="text-slate-800 dark:text-slate-200">
                    <span className="font-bold">Remarks:</span> {booking.inspectionRemarks || "AC coil fins cleaned & gas leak repaired"}
                  </div>
                  <div className="flex justify-between font-bold pt-1">
                    <span>Material: ₹{booking.materialCost || 1200}</span>
                    <span>Labour: ₹{booking.labourCost || 800}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TIMELINE TAB */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Booking Audit History</h4>
              <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                {[
                  { time: "Just Now", title: "Booking Created", desc: "Customer placed request via Web App" },
                  { time: "5 mins ago", title: "Partner Matched", desc: "Assigned to Ramesh Yadav (AC Fleet)" },
                  { time: "12 mins ago", title: "Service Scheduled", desc: "Slot: 10:00 AM - 11:30 AM" },
                ].map((item, i) => (
                  <div key={i} className="relative space-y-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500 absolute -left-[21px] top-1 ring-4 ring-white dark:ring-slate-900"></span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                    <div className="font-extrabold text-slate-900 dark:text-white">{item.title}</div>
                    <p className="text-slate-500 text-[11px]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENT TAB */}
          {activeTab === "payment" && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">Payment Breakdown</h4>
              <div className="flex justify-between"><span>Base Rate</span><span className="font-bold">₹{booking.basePrice}</span></div>
              <div className="flex justify-between"><span>Convenience Fee</span><span className="font-bold">₹{booking.convenienceFee}</span></div>
              <div className="flex justify-between"><span>CGST (9%) + SGST (9%)</span><span className="font-bold">₹{booking.cgst + booking.sgst}</span></div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-sm font-black text-brand-600">
                <span>Total Amount Paid</span>
                <span>₹{booking.totalAmount}</span>
              </div>
              <div className="pt-2 text-slate-500">
                <span className="font-bold">Payment Method:</span> {booking.paymentMethod}
              </div>
            </div>
          )}

          {/* INVOICE TAB */}
          {activeTab === "invoice" && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 text-center">
              <FileText className="w-10 h-10 text-brand-600 mx-auto" />
              <h4 className="font-extrabold text-slate-900 dark:text-white">Tax Invoice #{booking.id}</h4>
              <p className="text-slate-500 text-[11px]">GSTIN Registered Tax Invoice (CGST 9% + SGST 9%)</p>
              <button
                type="button"
                onClick={() => alert("Downloading PDF Invoice...")}
                className="w-full py-2.5 bg-brand-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Tax Invoice PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
