"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, FileText, Lock, Sparkles, KeyRound } from "lucide-react";
import { Booking, SelectedAddOnItem } from "@/lib/mockData";
import { Portal } from "@/components/Portal";
import { AddOnManager } from "@/components/bookings/AddOnManager";

interface OtpVerificationModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onJobCompleted: (
    bookingId: string,
    addOns?: SelectedAddOnItem[],
    addOnsBaseTotal?: number,
    addOnsGstTotal?: number,
    addOnsFinalTotal?: number
  ) => void;
}

export function OtpVerificationModal({
  booking,
  isOpen,
  onClose,
  onJobCompleted,
}: OtpVerificationModalProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOnItem[]>([]);
  const [otpInput, setOtpInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !booking) return null;

  const expectedOtp = booking.otpCode || "4920";

  // Calculate totals
  const addOnsBaseTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const addOnsGstTotal = selectedAddOns.reduce((sum, item) => sum + item.gstAmount, 0);
  const addOnsFinalTotal = addOnsBaseTotal + addOnsGstTotal;

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.trim() === expectedOtp || otpInput.trim() === "1234") {
      onJobCompleted(
        booking.id,
        selectedAddOns,
        addOnsBaseTotal,
        addOnsGstTotal,
        addOnsFinalTotal
      );
      onClose();
    } else {
      setErrorMsg(`Invalid OTP. Use demo OTP "${expectedOtp}" or "1234"`);
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 outline-none my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 inline-block">
                Partner Job Completion Gateway
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                <span>Job Completion & Add-On Settlement</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Booking ID: <span className="font-mono font-bold text-slate-900 dark:text-white">{booking.id}</span> • Customer: <strong className="text-slate-800 dark:text-slate-200">{booking.customerName}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Add-On Products & Services Section */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
            <AddOnManager
              selectedAddOns={selectedAddOns}
              onChangeAddOns={setSelectedAddOns}
              originalBookingPrice={booking.totalAmount}
            />
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1.5">
              <span className="text-slate-700 dark:text-slate-300 block font-bold">
                Customer 4-Digit Job Verification Code
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm block">
                Phone: {booking.customerPhone}
              </span>
              <div className="pt-1">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-mono font-black text-xs">
                  Demo OTP Code: {expectedOtp}
                </span>
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1.5">
                Enter Customer OTP to Finalize & Close Job *
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
                className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lux flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verify OTP & Complete Job (Total: ₹{booking.totalAmount + addOnsFinalTotal})</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
