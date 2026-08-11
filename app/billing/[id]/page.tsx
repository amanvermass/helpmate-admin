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
import { Portal } from "@/components/Portal";

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
      {/* Embedded Strict Single-Page Print CSS for Official Tax Invoice */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body > * {
            display: none !important;
          }
          body > #printable-tax-invoice-portal {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          #printable-tax-invoice-portal * {
            visibility: visible !important;
          }
        }
      `}</style>

      {/* Top Back Navigation Bar - Hidden on Print */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push(booking.id ? `/bookings/${booking.id}` : "/bookings");
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Booking ({booking.id})</span>
          </button>
          <Link
            href="/billing"
            className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all"
          >
            Billing Ledger
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lux flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice (1 Page)</span>
          </button>
        </div>
      </div>

      {/* Official GST Tax Invoice Printable Canvas Card - Single Page A4 Format */}
      <div
        id="printable-invoice"
        className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm w-full"
      >
        {/* Invoice Header: HelpMate Branding & Invoice Meta */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-5">
          {/* Left: Website Logo & Company Address */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-2xl bg-white border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs flex items-center justify-center">
              <img
                src="https://helpmate-theta.vercel.app/logo.png"
                alt="HelpMate Logo"
                className="h-9 w-9 object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight leading-none">
                  HelpMate
                </h1>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200">
                  Varanasi HQ
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Sigra Main Road, Near Cantt Railway Station, Varanasi - 221002
              </p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                GSTIN: 09AAACH8819Q1ZM • Support: +91 99350 98765
              </p>
            </div>
          </div>

          {/* Right: Official Tax Invoice & Invoice Number Meta Box */}
          <div className="flex flex-col items-start sm:items-end space-y-1.5 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>OFFICIAL GST TAX INVOICE</span>
            </div>

            <div className="font-mono text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              Invoice No: <span className="text-brand-600 dark:text-brand-400 font-extrabold">{formatInvoiceNumber(booking.id)}</span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Invoice Date: <span className="font-bold text-slate-700 dark:text-slate-200">{booking.scheduledDate || "30 July 2026"}</span>
            </div>
          </div>
        </div>

        {/* Billed To & Service Meta Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-extrabold text-slate-400 uppercase tracking-wider block text-[10px]">
              Billed To (Customer Details)
            </span>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">
              {booking.customerName}
            </div>
            <div className="text-slate-600 dark:text-slate-300 font-medium">
              {booking.address || "Sigra Colony, Varanasi"}
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200">
              Phone: {booking.customerPhone || "+91 99350 12345"}
            </div>
            {booking.customerGstin && (
              <div className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-700 w-fit">
                B2B GSTIN: {booking.customerGstin}
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-extrabold text-slate-400 uppercase tracking-wider block text-[10px]">
              Service & Payment Details
            </span>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">
              Service: {booking.serviceName || booking.serviceTitle}
            </div>
            <div className="text-slate-600 dark:text-slate-300 font-medium">
              Category: {booking.category}
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200">
              Payment Method: UPI / Digital Prepaid
            </div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              ✓ Payment Status: Paid Clean
            </div>
          </div>
        </div>

        {/* Itemized Service Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Item / Description</th>
                <th className="pb-3 text-right">Base Amount</th>
                <th className="pb-3 text-right">CGST (9%)</th>
                <th className="pb-3 text-right">SGST (9%)</th>
                <th className="pb-3 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-800 dark:text-slate-200">
              {booking.servicesList && booking.servicesList.length > 0 ? (
                booking.servicesList.map((item, idx) => {
                  const itemCode = item.serviceCode || `HM-SVC-${booking.id.replace(/[^0-9]/g, "")}-${String(idx + 1).padStart(2, "0")}`;
                  const itemBase = item.price * item.quantity;
                  const itemCgst = Math.round(itemBase * 0.09 * 100) / 100;
                  const itemSgst = Math.round(itemBase * 0.09 * 100) / 100;
                  return (
                    <tr key={item.id || idx}>
                      <td className="py-4">
                        <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                          <span>{item.title}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                            {itemCode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                          Qty: {item.quantity} • SAC Code: 998719 • ₹{item.price} unit price
                        </div>
                      </td>
                      <td className="py-4 text-right font-mono font-bold">₹{itemBase}</td>
                      <td className="py-4 text-right font-mono text-slate-600 dark:text-slate-400">₹{itemCgst}</td>
                      <td className="py-4 text-right font-mono text-slate-600 dark:text-slate-400">₹{itemSgst}</td>
                      <td className="py-4 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                        ₹{itemBase + itemCgst + itemSgst}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="py-4">
                    <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
                      <span>{booking.serviceName || booking.serviceTitle}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                        HM-SVC-{booking.id.replace(/[^0-9]/g, "")}-01
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                      Standard Varanasi Home Service Rate Card (SAC Code: 998719)
                    </div>
                  </td>
                  <td className="py-4 text-right font-mono font-bold">₹{booking.basePrice}</td>
                  <td className="py-4 text-right font-mono text-slate-600 dark:text-slate-400">₹{booking.cgst}</td>
                  <td className="py-4 text-right font-mono text-slate-600 dark:text-slate-400">₹{booking.sgst}</td>
                  <td className="py-4 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                    ₹{booking.basePrice + booking.cgst + booking.sgst}
                  </td>
                </tr>
              )}
              <tr>
                <td className="py-4">
                  <div className="font-bold text-slate-900 dark:text-white">Platform Convenience & Safety Insurance Fee</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                    HelpMate Safety Insurance & Tech Assignment
                  </div>
                </td>
                <td className="py-4 text-right font-mono font-bold">₹{booking.convenienceFee}</td>
                <td className="py-4 text-right font-mono text-slate-600 dark:text-slate-400">₹0</td>
                <td className="py-4 text-right font-mono text-slate-600 dark:text-slate-400">₹0</td>
                <td className="py-4 text-right font-mono font-bold">₹{booking.convenienceFee}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tax Summary & Total Box */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 max-w-sm">
            <span className="font-extrabold text-slate-700 dark:text-slate-200 block">Terms & Conditions</span>
            <p>1. Invoice generated under GST Act 2017 for Varanasi Jurisdiction.</p>
            <p>2. SAC Code 998719 applies to Home Maintenance & Repair Services.</p>
          </div>

          <div className="w-full sm:w-64 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <span>Base Subtotal</span>
              <span className="font-mono font-bold">₹{booking.basePrice + booking.convenienceFee}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <span>CGST (9%)</span>
              <span className="font-mono font-bold">₹{booking.cgst}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <span>SGST (9%)</span>
              <span className="font-mono font-bold">₹{booking.sgst}</span>
            </div>
            <div className="flex justify-between py-1 text-xs font-black text-slate-900 dark:text-white">
              <span>Grand Total</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PORTAL PRINT CANVAS FOR GUARANTEED 1-PAGE A4 PRINT */}
      <Portal>
        <div
          id="printable-tax-invoice-portal"
          className="hidden print:block p-0 rounded-3xl bg-white text-black space-y-4 w-full"
        >
          {/* Header */}
          <div className="flex flex-row items-start justify-between gap-2 border-b border-slate-300 pb-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-xl bg-white border border-slate-300 shrink-0 flex items-center justify-center">
                <img
                  src="https://helpmate-theta.vercel.app/logo.png"
                  alt="HelpMate Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-xl text-black tracking-tight leading-none">
                    HelpMate
                  </h1>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-black border border-slate-300">
                    Varanasi HQ
                  </span>
                </div>
                <p className="text-[10px] text-slate-700 font-medium">
                  Sigra Main Road, Near Cantt Railway Station, Varanasi - 221002
                </p>
                <p className="text-[10px] font-mono text-slate-700 font-bold">
                  GSTIN: 09AAACH8819Q1ZM • Support: +91 99350 98765
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end text-right space-y-1 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-black font-extrabold text-[10px] border border-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                <span>OFFICIAL GST TAX INVOICE</span>
              </div>

              <div className="font-mono text-xs font-black text-black bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-300">
                Invoice No: <span className="text-black font-extrabold">{formatInvoiceNumber(booking.id)}</span>
              </div>

              <div className="text-[10px] text-slate-600 font-semibold">
                Invoice Date: <span className="font-bold text-black">{booking.scheduledDate || "30 July 2026"}</span>
              </div>
            </div>
          </div>

          {/* Customer & Billing Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
              <span className="font-extrabold text-slate-500 uppercase tracking-wider block text-[9px]">
                Billed To (Customer Details)
              </span>
              <div className="font-extrabold text-black text-xs">
                {booking.customerName}
              </div>
              <div className="text-slate-800 font-medium text-[10px]">
                {booking.address || "Sigra Colony, Varanasi"}
              </div>
              <div className="font-bold text-slate-900 text-[10px]">
                Phone: {booking.customerPhone || "+91 99350 12345"}
              </div>
              {booking.customerGstin && (
                <div className="font-mono font-bold text-black bg-slate-100 p-0.5 rounded border border-slate-300 text-[9px] w-fit">
                  B2B GSTIN: {booking.customerGstin}
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
              <span className="font-extrabold text-slate-500 uppercase tracking-wider block text-[9px]">
                Service & Payment Details
              </span>
              <div className="font-extrabold text-black text-xs">
                Service: {booking.serviceName || booking.serviceTitle}
              </div>
              <div className="text-slate-800 font-medium text-[10px]">
                Category: {booking.category}
              </div>
              <div className="font-bold text-slate-900 text-[10px]">
                Payment Method: UPI / Digital Prepaid
              </div>
              <div className="font-bold text-emerald-700 flex items-center gap-1 text-[10px]">
                ✓ Payment Status: Paid Clean
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="pb-1.5">Item / Description</th>
                  <th className="pb-1.5 text-right">Base Amount</th>
                  <th className="pb-1.5 text-right">CGST (9%)</th>
                  <th className="pb-1.5 text-right">SGST (9%)</th>
                  <th className="pb-1.5 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-semibold text-black">
                <tr>
                  <td className="py-2">
                    <div className="font-extrabold text-xs">{booking.serviceName || booking.serviceTitle}</div>
                    <div className="text-[10px] text-slate-600 font-normal">
                      Standard Varanasi Home Service Rate Card (SAC Code: 998719)
                    </div>
                  </td>
                  <td className="py-2 text-right font-mono font-bold text-xs">₹{booking.basePrice}</td>
                  <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{booking.cgst}</td>
                  <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{booking.sgst}</td>
                  <td className="py-2 text-right font-mono font-extrabold text-black text-xs">
                    ₹{booking.basePrice + booking.cgst + booking.sgst}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">
                    <div className="font-bold text-xs">Platform Convenience & Safety Insurance Fee</div>
                    <div className="text-[10px] text-slate-600 font-normal">
                      HelpMate Safety Insurance & Tech Assignment
                    </div>
                  </td>
                  <td className="py-2 text-right font-mono font-bold text-xs">₹{booking.convenienceFee}</td>
                  <td className="py-2 text-right font-mono text-slate-700 text-xs">₹0</td>
                  <td className="py-2 text-right font-mono text-slate-700 text-xs">₹0</td>
                  <td className="py-2 text-right font-mono font-bold text-xs">₹{booking.convenienceFee}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Summary & Total Box */}
          <div className="flex flex-row justify-between items-start gap-4 border-t border-slate-300 pt-3">
            <div className="text-[10px] text-slate-600 space-y-0.5 max-w-sm">
              <span className="font-extrabold text-black block text-xs">Terms & Conditions</span>
              <p>1. Invoice generated under GST Act 2017 for Varanasi Jurisdiction.</p>
              <p>2. SAC Code 998719 applies to Home Maintenance & Repair Services.</p>
            </div>

            <div className="w-60 p-2.5 rounded-xl bg-slate-50 border border-slate-300 space-y-1 text-xs">
              <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                <span>Base Subtotal</span>
                <span className="font-mono font-bold">₹{booking.basePrice + booking.convenienceFee}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                <span>CGST (9%)</span>
                <span className="font-mono font-bold">₹{booking.cgst}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                <span>SGST (9%)</span>
                <span className="font-mono font-bold">₹{booking.sgst}</span>
              </div>
              <div className="flex justify-between py-0.5 text-xs font-black text-black">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-700 font-bold text-xs">₹{booking.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </div>
  );
}
