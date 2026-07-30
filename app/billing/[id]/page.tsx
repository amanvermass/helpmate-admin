"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { initialBookings, Booking } from "@/lib/mockData";
import {
  FileText,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Download,
  Building,
  User,
  ShieldCheck,
  CreditCard,
  Receipt,
  Share2,
} from "lucide-react";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invId = params?.id as string;

  // Find invoice by ID or fallback
  const booking: Booking =
    initialBookings.find((b) => b.id === invId || `INV-${b.id}` === invId) || initialBookings[0];

  const handlePrint = () => {
    window.print();
  };

  const formatInvoiceNumber = (id: string) => {
    if (!id) return "INV-2026-001";
    const cleanId = id.replace(/^(INV-)?(bk-)?/gi, "");
    if (cleanId.length > 5 && !isNaN(Number(cleanId))) {
      return `INV-${cleanId.slice(-5)}`;
    }
    return `INV-${cleanId.toUpperCase()}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 print:p-0 print:m-0">
      {/* Embedded Strict Print CSS */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-invoice,
          #printable-invoice * {
            visibility: visible !important;
          }
          #printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          header, aside, footer, nav, .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Back Navigation Bar - Hidden on Print */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
        <Link
          href="/billing"
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Billing & Invoices Ledger</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lux flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Official GST Tax Invoice Printable Canvas Card - Full Width */}
      <div
        id="printable-invoice"
        className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm w-full print:border-none print:shadow-none print:p-0 print:bg-white print:text-black"
      >
        {/* Invoice Header: HelpMate Branding & Invoice Meta */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6 print:border-slate-300">
          {/* Left: Website Logo & Company Address */}
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-2xl bg-white border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs flex items-center justify-center">
              <img
                src="https://helpmate-theta.vercel.app/logo.png"
                alt="HelpMate Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-2xl text-slate-900 dark:text-white print:text-black tracking-tight leading-none">
                  HelpMate
                </h1>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 print:bg-slate-100 print:text-black print:border-slate-300">
                  Varanasi HQ
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 font-medium">
                Sigra Main Road, Near Cantt Railway Station, Varanasi - 221002
              </p>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 print:text-slate-700 font-bold">
                GSTIN: 09AAACH8819Q1ZM • Support: +91 99350 98765
              </p>
            </div>
          </div>

          {/* Right: Official Tax Invoice & Invoice Number Meta Box */}
          <div className="flex flex-col sm:items-end text-left sm:text-right space-y-1.5 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-300 dark:border-emerald-800 print:bg-slate-100 print:text-black print:border-slate-400 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 print:bg-black inline-block" />
              <span>OFFICIAL GST TAX INVOICE</span>
            </div>

            <div className="font-mono text-sm font-black text-slate-900 dark:text-white print:text-black bg-slate-100 dark:bg-slate-800 print:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 print:border-slate-300 w-fit">
              Invoice No: <span className="text-brand-600 dark:text-brand-400 print:text-black font-extrabold">{formatInvoiceNumber(booking.id)}</span>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 font-semibold">
              Invoice Date: <span className="font-bold text-slate-700 dark:text-slate-300 print:text-black">{booking.scheduledDate || "30 July 2026"}</span>
            </div>
          </div>
        </div>

        {/* Customer & Billing Address Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 print:bg-slate-50 print:border-slate-300 space-y-2">
            <span className="font-extrabold text-slate-400 uppercase tracking-wider block text-[10px]">
              Billed To (Customer Details)
            </span>
            <div className="font-extrabold text-slate-900 dark:text-white print:text-black text-sm">
              {booking.customerName}
            </div>
            <div className="text-slate-600 dark:text-slate-300 print:text-slate-800 font-medium">
              {booking.address || "Sigra Colony, Varanasi"}
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-300 print:text-slate-900">
              Phone: {booking.customerPhone || "+91 99350 12345"}
            </div>
            {booking.customerGstin && (
              <div className="font-mono font-bold text-brand-600 bg-brand-50 dark:bg-brand-950 print:bg-slate-100 print:text-black p-1.5 rounded border border-brand-200 dark:border-brand-800 w-fit">
                B2B GSTIN: {booking.customerGstin}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 print:bg-slate-50 print:border-slate-300 space-y-2">
            <span className="font-extrabold text-slate-400 uppercase tracking-wider block text-[10px]">
              Service & Payment Details
            </span>
            <div className="font-extrabold text-slate-900 dark:text-white print:text-black text-sm">
              Service: {booking.serviceName || booking.serviceTitle}
            </div>
            <div className="text-slate-600 dark:text-slate-300 print:text-slate-800 font-medium">
              Category: {booking.category}
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-300 print:text-slate-900">
              Payment Method: UPI / Digital Prepaid
            </div>
            <div className="font-bold text-emerald-600 print:text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Payment Status: Paid Clean
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 print:border-slate-300 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Item / Description</th>
                <th className="pb-3 text-right">Base Amount</th>
                <th className="pb-3 text-right">CGST (9%)</th>
                <th className="pb-3 text-right">SGST (9%)</th>
                <th className="pb-3 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200 font-semibold text-slate-900 dark:text-white print:text-black">
              <tr>
                <td className="py-4">
                  <div className="font-extrabold">{booking.serviceName || booking.serviceTitle}</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Standard Varanasi Home Service Rate Card (SAC Code: 998719)
                  </div>
                </td>
                <td className="py-4 text-right font-mono font-bold">₹{booking.basePrice}</td>
                <td className="py-4 text-right font-mono text-slate-600">₹{booking.cgst}</td>
                <td className="py-4 text-right font-mono text-slate-600">₹{booking.sgst}</td>
                <td className="py-4 text-right font-mono font-extrabold text-slate-900 dark:text-white print:text-black">
                  ₹{booking.basePrice + booking.cgst + booking.sgst}
                </td>
              </tr>
              <tr>
                <td className="py-4">
                  <div className="font-bold">Platform Convenience & Safety Insurance Fee</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    HelpMate Safety Insurance & Tech Dispatch
                  </div>
                </td>
                <td className="py-4 text-right font-mono font-bold">₹{booking.convenienceFee}</td>
                <td className="py-4 text-right font-mono text-slate-600">₹0</td>
                <td className="py-4 text-right font-mono text-slate-600">₹0</td>
                <td className="py-4 text-right font-mono font-bold">₹{booking.convenienceFee}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Summary & Total Box */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 pt-6">
          <div className="text-xs text-slate-500 space-y-1 max-w-sm">
            <span className="font-extrabold text-slate-700 dark:text-slate-300 print:text-black block">Terms & Conditions</span>
            <p>1. Invoice generated under GST Act 2017 for Varanasi Jurisdiction.</p>
            <p>2. SAC Code 998719 applies to Home Maintenance & Repair Services.</p>
          </div>

          <div className="w-full sm:w-72 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 print:bg-slate-50 print:border-slate-300 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 print:border-slate-300 text-slate-600 dark:text-slate-300 print:text-slate-800">
              <span>Base Subtotal</span>
              <span className="font-mono font-bold">₹{booking.basePrice + booking.convenienceFee}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 print:border-slate-300 text-slate-600 dark:text-slate-300 print:text-slate-800">
              <span>CGST (9%)</span>
              <span className="font-mono font-bold">₹{booking.cgst}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700 print:border-slate-300 text-slate-600 dark:text-slate-300 print:text-slate-800">
              <span>SGST (9%)</span>
              <span className="font-mono font-bold">₹{booking.sgst}</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-black text-slate-900 dark:text-white print:text-black">
              <span>Grand Total</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 print:text-emerald-700">₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
