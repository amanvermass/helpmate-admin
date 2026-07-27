"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, FileText, Download } from "lucide-react";
import { Booking } from "@/lib/mockData";

interface OtpVerificationModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onJobCompleted: (bookingId: string) => void;
}

export function OtpVerificationModal({
  booking,
  isOpen,
  onClose,
  onJobCompleted,
}: OtpVerificationModalProps) {
  const [otpInput, setOtpInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !booking) return null;

  const expectedOtp = booking.otpCode || "4920";

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() === expectedOtp || otpInput.trim() === "1234") {
      onJobCompleted(booking.id);
      onClose();
    } else {
      setErrorMsg(`Invalid OTP. Use demo OTP "${expectedOtp}" or "1234"`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 outline-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Service Completion Gateway
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">Verify Job OTP & Close Order</h3>
            <p className="text-xs text-slate-500">
              Booking <span className="font-bold text-slate-900 dark:text-white">{booking.id}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
            <span className="text-slate-500 block">4-Digit Verification OTP sent to customer</span>
            <span className="font-bold text-slate-900 dark:text-white">{booking.customerPhone}</span>
            <span className="block text-[10px] text-brand-600 font-mono">Demo OTP Code: {expectedOtp}</span>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Enter Customer OTP *</label>
            <input
              type="text"
              maxLength={4}
              value={otpInput}
              onChange={(e) => {
                setOtpInput(e.target.value);
                setErrorMsg("");
              }}
              placeholder="e.g. 4920"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-center text-lg font-black tracking-widest text-slate-900 dark:text-white"
              required
            />
            {errorMsg && <p className="text-[11px] font-bold text-red-600 mt-1">{errorMsg}</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lux flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              Verify OTP & Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
