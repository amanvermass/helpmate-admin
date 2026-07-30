"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialBookings, Booking } from "@/lib/mockData";
import { CalendarCheck, MapPin, CheckCircle2, KeyRound, ShieldCheck, Phone } from "lucide-react";
import { Portal } from "@/components/Portal";

export default function PartnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [inputOtp, setInputOtp] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    if (inputOtp === (selectedBooking.otpCode || "1234")) {
      setOtpSuccess(true);
      setBookings(
        bookings.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, status: "Completed", isOtpVerified: true }
            : b
        )
      );
      setTimeout(() => {
        setSelectedBooking(null);
        setOtpSuccess(false);
        setInputOtp("");
      }, 1200);
    } else {
      alert("Invalid OTP! Default OTP for test is 1234");
    }
  };

  const columns: Column<Booking>[] = [
    {
      key: "id",
      header: "Booking ID",
      accessor: (row) => (
        <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{row.id}</span>
      ),
      sortable: true,
    },
    {
      key: "customerName",
      header: "Customer Details",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{row.customerName}</span>
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <Phone className="w-3 h-3 text-brand-500" />
            {row.customerPhone}
          </span>
        </div>
      ),
      sortable: true,
    },
    { key: "serviceTitle", header: "Service Title", sortable: true },
    {
      key: "locality",
      header: "Locality Address",
      accessor: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            {row.locality}
          </span>
          <span className="text-[10px] text-slate-400 truncate max-w-xs">{row.address}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "partnerEarnings",
      header: "Your Share (₹)",
      accessor: (row) => (
        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
          ₹{row.partnerEarnings || Math.round(row.totalAmount * 0.75)}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Booking Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "Completed"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status !== "Completed" ? (
            <button
              type="button"
              onClick={() => setSelectedBooking(row)}
              className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Complete Job OTP</span>
            </button>
          ) : (
            <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Job Completed
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={bookings}
      />

      {/* OTP Verification Modal */}
      {selectedBooking && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form
              onSubmit={handleVerifyOtp}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Customer Job Completion OTP</h3>
                  <p className="text-xs text-slate-500">{selectedBooking.customerName} • {selectedBooking.serviceTitle}</p>
                </div>
              </div>

              {otpSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-center font-extrabold text-sm space-y-1">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                  <p>Job Verified & Completed Successfully!</p>
                  <p className="text-xs font-normal text-emerald-600">Earnings credited to your wallet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Enter 4-Digit Customer OTP (Default: 1234)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={inputOtp}
                      onChange={(e) => setInputOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono font-black text-xl tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(null)}
                      className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lux"
                    >
                      Verify & Close Job
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
