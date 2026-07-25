"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialBookings, Booking } from "@/lib/mockData";
import { FileText, Download, Printer, CheckCircle2, RotateCcw } from "lucide-react";

export default function BillingPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const columns: Column<Booking>[] = [
    {
      key: "id",
      header: "Invoice Ref & Type",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-mono font-extrabold text-brand-600 text-xs">INV-{row.id}</span>
          <span className="text-[9px] font-bold text-emerald-600 uppercase">
            {row.invoiceType} Tax Invoice
          </span>
        </div>
      ),
    },
    {
      key: "customerName",
      header: "Billed Customer / GSTIN",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.customerName}</span>
          {row.customerGstin ? (
            <span className="font-mono text-[9px] text-brand-600 font-bold">
              GSTIN: {row.customerGstin}
            </span>
          ) : (
            <span className="text-[9px] text-slate-400">B2C Retail Customer</span>
          )}
        </div>
      ),
    },
    {
      key: "basePrice",
      header: "Base Service Price",
      accessor: (row) => <span className="font-bold text-slate-800">₹{row.basePrice}</span>,
    },
    {
      key: "convenienceFee",
      header: "Convenience Fee",
      accessor: (row) => <span className="font-bold text-slate-600">₹{row.convenienceFee}</span>,
    },
    {
      key: "cgst",
      header: "CGST (9%) + SGST (9%)",
      accessor: (row) => (
        <span className="font-mono text-xs text-slate-700 font-bold">
          ₹{row.cgst} + ₹{row.sgst}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Gross Total (₹)",
      accessor: (row) => (
        <span className="font-extrabold text-slate-900">₹{row.totalAmount}</span>
      ),
    },
    {
      key: "actions",
      header: "Tax Invoice Actions",
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
          >
            Print GST
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" /> Requirement #7
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Billing & GST Tax Engine</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            GST-inclusive pricing engine, automated B2C & B2B Tax Invoices, CGST (9%) + SGST (9%) split calculator, and refund ledger.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-center min-w-[110px]">
            <span className="text-xs text-blue-200 block font-semibold">GST Rate</span>
            <span className="text-lg font-black text-white">18% Standard</span>
          </div>
        </div>
      </div>

      <DataTable
        title="B2C & B2B GST Tax Invoicing Ledger"
        description="Automated tax breakdown with CGST, SGST, IGST calculation and printable invoices."
        columns={columns}
        data={bookings}
        searchPlaceholder="Search invoice ref, customer, or GSTIN..."
      />
    </div>
  );
}
