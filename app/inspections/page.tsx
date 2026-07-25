"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialBookings, Booking } from "@/lib/mockData";
import { Wrench, CheckCircle2, AlertCircle, KeyRound, ArrowRight, ShieldCheck } from "lucide-react";

export default function InspectionsPage() {
  const [bookings, setBookings] = useState<Booking[]>(
    initialBookings.filter((b) => b.isInspectionBased || b.status === "In Progress")
  );

  const columns: Column<Booking>[] = [
    {
      key: "id",
      header: "Inspection Ref",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-extrabold text-brand-600 text-xs">{row.id}</span>
          <span className="text-[10px] text-slate-400">Locality: {row.locality}</span>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Customer",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.customerName}</span>
          <span className="text-[10px] text-slate-500">{row.customerPhone}</span>
        </div>
      ),
    },
    {
      key: "serviceTitle",
      header: "Inspection Issue",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.serviceTitle}</span>
          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded w-fit border border-amber-200">
            Diagnostic Quote Pending
          </span>
        </div>
      ),
    },
    {
      key: "basePrice",
      header: "Estimated Base Quote (₹)",
      accessor: (row) => (
        <span className="font-extrabold text-slate-900">₹{row.basePrice}</span>
      ),
    },
    {
      key: "technicianName",
      header: "Assigned Partner",
      accessor: (row) => (
        <span className="font-bold text-slate-700 text-xs">
          {row.technicianName || "Unassigned"}
        </span>
      ),
    },
    {
      key: "otpCode",
      header: "OTP Security Closure",
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
            {row.otpCode || "8821"}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">
            {row.isOtpVerified ? "Verified" : "Pending OTP"}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" /> Requirement #4
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Inspection & Price Update Flow</h1>
          <p className="text-xs text-amber-100 mt-1 max-w-xl">
            Partner site inspection quote submissions, admin price validation, customer approval tracking, and 4-digit OTP job closure.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-center min-w-[110px]">
            <span className="text-xs text-amber-200 block font-semibold">Active Inspections</span>
            <span className="text-lg font-black text-white">{bookings.length} Live</span>
          </div>
        </div>
      </div>

      <DataTable
        title="Diagnostic Inspection & Repair Approval Queue"
        description="Validate technician price estimates and manage customer OTP job completion codes."
        columns={columns}
        data={bookings}
        searchPlaceholder="Search inspection ref or customer..."
      />
    </div>
  );
}
