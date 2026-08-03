"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, FileText, Lock } from "lucide-react";
import { Booking } from "@/lib/mockData";
import { Portal } from "@/components/Portal";

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
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
        <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 outline-none">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 inline-block">
                Service Completion Gateway
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Verify Job OTP & Close Order
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Booking ID: <span className="font-mono font-bold text-slate-900 dark:text-white">{booking.id}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-1.5">
              <span className="text-slate-600 dark:text-slate-400 block font-medium">
                4-Digit Verification OTP sent to customer
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm block">
                {booking.customerPhone}
              </span>
              <div className="pt-1">
                <span className="inline-block px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 font-mono font-extrabold text-xs">
                  Demo OTP Code: {expectedOtp}
                </span>
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5">
                Enter Customer OTP *
              </label>
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="4920"
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-mono text-center text-xl font-black tracking-[0.4em] text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600 placeholder:tracking-widest"
                required
              />
              {errorMsg && (
                <p className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-1.5 text-center">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lux flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verify OTP & Generate Invoice</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
