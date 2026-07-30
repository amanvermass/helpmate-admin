"use client";

import { DataTable, Column } from "@/components/DataTable";
import { Wrench, CheckCircle2, ShieldCheck, Tag } from "lucide-react";

interface PartnerService {
  id: string;
  category: string;
  title: string;
  fixedRate: number;
  partnerShare: number;
  status: "Authorized" | "Inactive";
}

export default function PartnerServicesPage() {
  const partnerServices: PartnerService[] = [
    {
      id: "ps-1",
      category: "AC Servicing & Repair",
      title: "Power Jet AC Servicing (Split/Window)",
      fixedRate: 699,
      partnerShare: 524,
      status: "Authorized",
    },
    {
      id: "ps-2",
      category: "AC Servicing & Repair",
      title: "AC Gas Leakage Repair & Refilling (R32/R410a)",
      fixedRate: 2499,
      partnerShare: 1874,
      status: "Authorized",
    },
    {
      id: "ps-3",
      category: "AC Servicing & Repair",
      title: "AC PCB Circuit Board Diagnostic & Repair",
      fixedRate: 1499,
      partnerShare: 1124,
      status: "Authorized",
    },
    {
      id: "ps-4",
      category: "Smart Home Electrician",
      title: "3-Phase MCB & Fuse Distribution Repair",
      fixedRate: 499,
      partnerShare: 374,
      status: "Authorized",
    },
  ];

  const columns: Column<PartnerService>[] = [
    { key: "category", header: "Service Category", sortable: true },
    {
      key: "title",
      header: "Service Title & Rate Card",
      accessor: (row) => <span className="font-extrabold text-slate-900 dark:text-white">{row.title}</span>,
      sortable: true,
    },
    {
      key: "fixedRate",
      header: "Customer Rate (₹)",
      accessor: (row) => <span className="font-bold text-slate-700 dark:text-slate-300">₹{row.fixedRate}</span>,
      sortable: true,
    },
    {
      key: "partnerShare",
      header: "Your Share (75%)",
      accessor: (row) => (
        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
          ₹{row.partnerShare}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Skill Authorization",
      accessor: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 w-fit">
          <ShieldCheck className="w-3.5 h-3.5" /> Authorized Partner
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={partnerServices}
      />
    </div>
  );
}
