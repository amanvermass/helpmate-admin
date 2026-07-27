"use client";

import React, { useState } from "react";
import { X, Wrench, CheckCircle2, AlertTriangle, FileText, Upload } from "lucide-react";
import { Booking } from "@/lib/mockData";

interface InspectionFlowModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onInspectionApproved: (bookingId: string, updatedQuote: number, remarks: string) => void;
}

export function InspectionFlowModal({
  booking,
  isOpen,
  onClose,
  onInspectionApproved,
}: InspectionFlowModalProps) {
  const [materialCost, setMaterialCost] = useState(1200);
  const [labourCost, setLabourCost] = useState(800);
  const [remarks, setRemarks] = useState("Replaced compressor capacitor & cleaned coil fins");

  if (!isOpen || !booking) return null;

  const totalQuote = materialCost + labourCost;

  const handleApproveQuote = () => {
    onInspectionApproved(booking.id, totalQuote, remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 outline-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              Diagnostic Inspection Flow
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">Inspection Price Validation</h3>
            <p className="text-xs text-slate-500">
              Booking <span className="font-bold text-slate-900 dark:text-white">{booking.id}</span> • {booking.serviceTitle}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Partner Inspection Submission Details */}
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block">Technician Inspection Remarks</span>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Material Cost (₹)</label>
              <input
                type="number"
                value={materialCost}
                onChange={(e) => setMaterialCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Labour Cost (₹)</label>
              <input
                type="number"
                value={labourCost}
                onChange={(e) => setLabourCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex justify-between items-center text-sm">
            <span className="font-bold text-slate-900 dark:text-white">Validated Inspection Quote</span>
            <span className="font-black text-brand-600 dark:text-brand-400">₹{totalQuote}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Reject Quote
          </button>
          <button
            type="button"
            onClick={handleApproveQuote}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lux flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            Validate & Request Customer Approval
          </button>
        </div>
      </div>
    </div>
  );
}
