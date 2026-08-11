"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { initialTechnicians, Technician } from "@/lib/mockData";
import {
  Star,
  CheckCircle2,
  MapPin,
  FileCheck,
  ArrowLeft,
  Edit,
  Edit2,
  User,
  ShieldCheck,
  ShieldAlert,
  CalendarCheck,
  Wallet,
  Clock,
  TrendingUp,
  Award,
  Phone,
  Mail,
  Building,
  Upload,
  ExternalLink,
  CreditCard,
  Briefcase,
  Sparkles,
  CheckCircle,
  Receipt,
  Users,
} from "lucide-react";
import { DataTable, Column } from "@/components/DataTable";

export default function TechnicianDetailPage() {
  const params = useParams();
  const router = useRouter();
  const techId = params?.id as string;

  // Find technician by ID or fallback to first
  const tech: Technician =
    initialTechnicians.find((t) => t.id === techId) || initialTechnicians[0];

  const [activeTab, setActiveTab] = useState<"overview" | "kyc" | "jobs" | "earnings">("overview");

  // Sample Completed Jobs (Expanded Dataset for Pagination)
  const partnerJobs = [
    {
      id: "BK-VAR-9981",
      customerName: "Alok Verma",
      serviceTitle: tech.category + " - Power Jet Wash & Gas Check",
      locality: tech.locality + ", Varanasi",
      date: "Today, 11:30 AM",
      totalAmount: 1999,
      commissionFee: 500,
      netShare: 1499,
      status: "Completed",
    },
    {
      id: "BK-VAR-9975",
      customerName: "Rajesh Agrawal",
      serviceTitle: tech.category + " - Filter Cartridge & RO Sanitization",
      locality: "Sigra, Varanasi",
      date: "08 Aug 2026",
      totalAmount: 1499,
      commissionFee: 375,
      netShare: 1124,
      status: "Completed",
    },
    {
      id: "BK-VAR-9968",
      customerName: "Vikram Malhotra",
      serviceTitle: tech.category + " - Full Deep Hydro Wash",
      locality: "Lanka, Varanasi",
      date: "05 Aug 2026",
      totalAmount: 2890,
      commissionFee: 722,
      netShare: 2168,
      status: "Completed",
    },
    {
      id: "BK-VAR-9954",
      customerName: "Siddharth Gupta",
      serviceTitle: tech.category + " - Commercial Unit Hydro Repair",
      locality: "Cantonment, Varanasi",
      date: "02 Aug 2026",
      totalAmount: 4000,
      commissionFee: 1000,
      netShare: 3000,
      status: "Completed",
    },
    {
      id: "BK-VAR-9941",
      customerName: "Sunita Agrawal",
      serviceTitle: tech.category + " - Inverter AC Gas Refilling (R32)",
      locality: "Assi Ghat, Varanasi",
      date: "29 Jul 2026",
      totalAmount: 2500,
      commissionFee: 625,
      netShare: 1875,
      status: "Completed",
    },
    {
      id: "BK-VAR-9932",
      customerName: "B.P. Srivastava",
      serviceTitle: tech.category + " - Villa Deep Hydro Cleaning",
      locality: "Lahurabir, Varanasi",
      date: "26 Jul 2026",
      totalAmount: 5500,
      commissionFee: 1375,
      netShare: 4125,
      status: "Completed",
    },
    {
      id: "BK-VAR-9920",
      customerName: "Amitabh Verma",
      serviceTitle: tech.category + " - Motor & Capacitor Replacement",
      locality: "Rathyatra, Varanasi",
      date: "22 Jul 2026",
      totalAmount: 1850,
      commissionFee: 462,
      netShare: 1388,
      status: "Completed",
    },
    {
      id: "BK-VAR-9912",
      customerName: "Priya Sharma",
      serviceTitle: tech.category + " - Degreasing & Filter Wash",
      locality: "Bhelupur, Varanasi",
      date: "18 Jul 2026",
      totalAmount: 1299,
      commissionFee: 325,
      netShare: 974,
      status: "Completed",
    },
    {
      id: "BK-VAR-9899",
      customerName: "Ramesh Pandey",
      serviceTitle: tech.category + " - Copper Pipe Welding & Leak Repair",
      locality: "Godowlia, Varanasi",
      date: "14 Jul 2026",
      totalAmount: 3200,
      commissionFee: 800,
      netShare: 2400,
      status: "Completed",
    },
    {
      id: "BK-VAR-9884",
      customerName: "Manoj Tripathi",
      serviceTitle: tech.category + " - Heating Element & Thermostat Replacement",
      locality: "Shivpur, Varanasi",
      date: "10 Jul 2026",
      totalAmount: 1650,
      commissionFee: 412,
      netShare: 1238,
      status: "Completed",
    },
    {
      id: "BK-VAR-9870",
      customerName: "Kavita Gupta",
      serviceTitle: tech.category + " - Power Jet Wash & Chemical Foam Cleansing",
      locality: "Sigra, Varanasi",
      date: "06 Jul 2026",
      totalAmount: 2199,
      commissionFee: 550,
      netShare: 1649,
      status: "Completed",
    },
    {
      id: "BK-VAR-9855",
      customerName: "Sanjay Rastogi",
      serviceTitle: tech.category + " - Drain Pipe Unclogging & Water Pressure Test",
      locality: "Mahmoorganj, Varanasi",
      date: "01 Jul 2026",
      totalAmount: 1350,
      commissionFee: 338,
      netShare: 1012,
      status: "Completed",
    },
    {
      id: "BK-VAR-9842",
      customerName: "Anjali Chaurasia",
      serviceTitle: tech.category + " - Anti-Bacterial Sanitization Wash",
      locality: "Lanka, Varanasi",
      date: "27 Jun 2026",
      totalAmount: 1899,
      commissionFee: 475,
      netShare: 1424,
      status: "Completed",
    },
    {
      id: "BK-VAR-9830",
      customerName: "Rahul Dev",
      serviceTitle: tech.category + " - PCB Repair & Transformer Testing",
      locality: "Sarnath, Varanasi",
      date: "23 Jun 2026",
      totalAmount: 2750,
      commissionFee: 688,
      netShare: 2062,
      status: "Completed",
    },
    {
      id: "BK-VAR-9818",
      customerName: "Meenakshi Joshi",
      serviceTitle: tech.category + " - Comprehensive Annual Preventive Maintenance",
      locality: "Bhelupur, Varanasi",
      date: "19 Jun 2026",
      totalAmount: 3499,
      commissionFee: 875,
      netShare: 2624,
      status: "Completed",
    },
    {
      id: "BK-VAR-9805",
      customerName: "Alok Chaurasia",
      serviceTitle: tech.category + " - Outdoor Coil High-Pressure Scouring",
      locality: "Cantonment, Varanasi",
      date: "15 Jun 2026",
      totalAmount: 1599,
      commissionFee: 400,
      netShare: 1199,
      status: "Completed",
    },
    {
      id: "BK-VAR-9791",
      customerName: "Shalini Rai",
      serviceTitle: tech.category + " - Gas Leak Testing & Valve Soldering",
      locality: "Assi Ghat, Varanasi",
      date: "11 Jun 2026",
      totalAmount: 2899,
      commissionFee: 725,
      netShare: 2174,
      status: "Completed",
    },
    {
      id: "BK-VAR-9778",
      customerName: "Rakesh Verma",
      serviceTitle: tech.category + " - Water Filter Scrubbing & UV Lamp Swap",
      locality: "Sigra, Varanasi",
      date: "07 Jun 2026",
      totalAmount: 1199,
      commissionFee: 300,
      netShare: 899,
      status: "Completed",
    },
    {
      id: "BK-VAR-9764",
      customerName: "Abhishek Singh",
      serviceTitle: tech.category + " - Short Circuit & Main Line Fault Isolation",
      locality: "Mahmoorganj, Varanasi",
      date: "03 Jun 2026",
      totalAmount: 1450,
      commissionFee: 363,
      netShare: 1087,
      status: "Completed",
    },
    {
      id: "BK-VAR-9750",
      customerName: "Archana Tripathi",
      serviceTitle: tech.category + " - Dual Split Jet Servicing (2 Units)",
      locality: "Lanka, Varanasi",
      date: "29 May 2026",
      totalAmount: 3299,
      commissionFee: 825,
      netShare: 2474,
      status: "Completed",
    },
    {
      id: "BK-VAR-9736",
      customerName: "Deepak Pandey",
      serviceTitle: tech.category + " - Hydro Descaling & Flush Clean",
      locality: "Bhelupur, Varanasi",
      date: "25 May 2026",
      totalAmount: 1799,
      commissionFee: 450,
      netShare: 1349,
      status: "Completed",
    },
    {
      id: "BK-VAR-9722",
      customerName: "Neha Agarwal",
      serviceTitle: tech.category + " - Washing Machine Drum Overhaul",
      locality: "Godowlia, Varanasi",
      date: "21 May 2026",
      totalAmount: 2100,
      commissionFee: 525,
      netShare: 1575,
      status: "Completed",
    },
    {
      id: "BK-VAR-9708",
      customerName: "Rohit Srivastava",
      serviceTitle: tech.category + " - Refrigerator Thermostat Calibration",
      locality: "Shivpur, Varanasi",
      date: "17 May 2026",
      totalAmount: 1699,
      commissionFee: 425,
      netShare: 1274,
      status: "Completed",
    },
    {
      id: "BK-VAR-9694",
      customerName: "Pooja Yadav",
      serviceTitle: tech.category + " - Hydro Pressure Drain Clearance",
      locality: "Sarnath, Varanasi",
      date: "13 May 2026",
      totalAmount: 1250,
      commissionFee: 313,
      netShare: 937,
      status: "Completed",
    },
    {
      id: "BK-VAR-9680",
      customerName: "Sunil Rastogi",
      serviceTitle: tech.category + " - Electrical MCB Panel Replacement",
      locality: "Sigra, Varanasi",
      date: "09 May 2026",
      totalAmount: 1950,
      commissionFee: 488,
      netShare: 1462,
      status: "Completed",
    },
  ];

  // Weekly Settlement Ledger (Expanded Dataset for Pagination)
  const weeklySettlements = [
    {
      id: "SET-VAR-2026-32",
      cycle: "01 Aug - 07 Aug 2026",
      grossAmount: 18400,
      commissionFee: 4600,
      netPayout: 13800,
      bankName: "HDFC Bank",
      utr: "UTR99281044",
      status: "Settled",
      date: "08 Aug 2026",
    },
    {
      id: "SET-VAR-2026-31",
      cycle: "25 Jul - 31 Jul 2026",
      grossAmount: 22000,
      commissionFee: 5500,
      netPayout: 16500,
      bankName: "HDFC Bank",
      utr: "UTR99254110",
      status: "Settled",
      date: "01 Aug 2026",
    },
    {
      id: "SET-VAR-2026-30",
      cycle: "18 Jul - 24 Jul 2026",
      grossAmount: 16800,
      commissionFee: 4200,
      netPayout: 12600,
      bankName: "HDFC Bank",
      utr: "UTR99218902",
      status: "Settled",
      date: "25 Jul 2026",
    },
    {
      id: "SET-VAR-2026-29",
      cycle: "11 Jul - 17 Jul 2026",
      grossAmount: 19500,
      commissionFee: 4875,
      netPayout: 14625,
      bankName: "HDFC Bank",
      utr: "UTR99187622",
      status: "Settled",
      date: "18 Jul 2026",
    },
    {
      id: "SET-VAR-2026-28",
      cycle: "04 Jul - 10 Jul 2026",
      grossAmount: 24200,
      commissionFee: 6050,
      netPayout: 18150,
      bankName: "HDFC Bank",
      utr: "UTR99154301",
      status: "Settled",
      date: "11 Jul 2026",
    },
    {
      id: "SET-VAR-2026-27",
      cycle: "27 Jun - 03 Jul 2026",
      grossAmount: 15600,
      commissionFee: 3900,
      netPayout: 11700,
      bankName: "HDFC Bank",
      utr: "UTR99120994",
      status: "Settled",
      date: "04 Jul 2026",
    },
    {
      id: "SET-VAR-2026-26",
      cycle: "20 Jun - 26 Jun 2026",
      grossAmount: 21000,
      commissionFee: 5250,
      netPayout: 15750,
      bankName: "HDFC Bank",
      utr: "UTR99088123",
      status: "Settled",
      date: "27 Jun 2026",
    },
    {
      id: "SET-VAR-2026-25",
      cycle: "13 Jun - 19 Jun 2026",
      grossAmount: 17900,
      commissionFee: 4475,
      netPayout: 13425,
      bankName: "HDFC Bank",
      utr: "UTR99052199",
      status: "Settled",
      date: "20 Jun 2026",
    },
    {
      id: "SET-VAR-2026-24",
      cycle: "06 Jun - 12 Jun 2026",
      grossAmount: 20400,
      commissionFee: 5100,
      netPayout: 15300,
      bankName: "HDFC Bank",
      utr: "UTR99014022",
      status: "Settled",
      date: "13 Jun 2026",
    },
    {
      id: "SET-VAR-2026-23",
      cycle: "30 May - 05 Jun 2026",
      grossAmount: 18900,
      commissionFee: 4725,
      netPayout: 14175,
      bankName: "HDFC Bank",
      utr: "UTR98978114",
      status: "Settled",
      date: "06 Jun 2026",
    },
    {
      id: "SET-VAR-2026-22",
      cycle: "23 May - 29 May 2026",
      grossAmount: 23500,
      commissionFee: 5875,
      netPayout: 17625,
      bankName: "HDFC Bank",
      utr: "UTR98941098",
      status: "Settled",
      date: "30 May 2026",
    },
    {
      id: "SET-VAR-2026-21",
      cycle: "16 May - 22 May 2026",
      grossAmount: 16200,
      commissionFee: 4050,
      netPayout: 12150,
      bankName: "HDFC Bank",
      utr: "UTR98904552",
      status: "Settled",
      date: "23 May 2026",
    },
    {
      id: "SET-VAR-2026-20",
      cycle: "09 May - 15 May 2026",
      grossAmount: 19800,
      commissionFee: 4950,
      netPayout: 14850,
      bankName: "HDFC Bank",
      utr: "UTR98867120",
      status: "Settled",
      date: "16 May 2026",
    },
    {
      id: "SET-VAR-2026-19",
      cycle: "02 May - 08 May 2026",
      grossAmount: 21500,
      commissionFee: 5375,
      netPayout: 16125,
      bankName: "HDFC Bank",
      utr: "UTR98830491",
      status: "Settled",
      date: "09 May 2026",
    },
    {
      id: "SET-VAR-2026-18",
      cycle: "25 Apr - 01 May 2026",
      grossAmount: 17400,
      commissionFee: 4350,
      netPayout: 13050,
      bankName: "HDFC Bank",
      utr: "UTR98792011",
      status: "Settled",
      date: "02 May 2026",
    },
    {
      id: "SET-VAR-2026-17",
      cycle: "18 Apr - 24 Apr 2026",
      grossAmount: 22800,
      commissionFee: 5700,
      netPayout: 17100,
      bankName: "HDFC Bank",
      utr: "UTR98754118",
      status: "Settled",
      date: "25 Apr 2026",
    },
  ];

  // DataTable Job Columns Definition
  const jobColumns: Column<any>[] = [
    {
      key: "id",
      header: "Booking ID",
      accessor: (row) => (
        <Link
          href={`/bookings/${row.id}`}
          className="font-mono text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800 hover:underline inline-flex items-center gap-1"
        >
          <span>#{row.id}</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      ),
      sortable: true,
    },
    {
      key: "serviceTitle",
      header: "Service & Locality",
      accessor: (row) => (
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{row.serviceTitle}</h4>
          <span className="text-[10px] text-slate-400 font-bold">{row.locality}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "customerName",
      header: "Customer",
      accessor: (row) => (
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {row.customerName}
        </span>
      ),
      sortable: true,
    },
    {
      key: "date",
      header: "Date",
      accessor: (row) => (
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
          {row.date}
        </span>
      ),
      sortable: true,
    },
    {
      key: "totalAmount",
      header: "Gross Bill",
      accessor: (row) => (
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">
          ₹{row.totalAmount.toLocaleString("en-IN")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "commissionFee",
      header: "25% Fee",
      accessor: (row) => (
        <span className="font-mono text-slate-400 text-xs">
          ₹{row.commissionFee.toLocaleString("en-IN")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "netShare",
      header: "Partner Net Share",
      accessor: (row) => (
        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs">
          ₹{row.netShare.toLocaleString("en-IN")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-200 dark:border-emerald-800">
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <Link
          href={`/bookings/${row.id}`}
          className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-[11px] shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View Job</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
        </Link>
      ),
    },
  ];

  // DataTable Settlement Columns Definition
  const settlementColumns: Column<any>[] = [
    {
      key: "id",
      header: "Settlement ID",
      accessor: (row) => (
        <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
          {row.id}
        </span>
      ),
      sortable: true,
    },
    {
      key: "cycle",
      header: "Weekly Cycle",
      accessor: (row) => (
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{row.cycle}</h4>
          <span className="text-[10px] text-slate-400 font-mono">Date: {row.date}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "grossAmount",
      header: "Gross Billings",
      accessor: (row) => (
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">
          ₹{row.grossAmount.toLocaleString("en-IN")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "commissionFee",
      header: "Platform Fee (25%)",
      accessor: (row) => (
        <span className="font-mono text-slate-400 text-xs">
          ₹{row.commissionFee.toLocaleString("en-IN")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "netPayout",
      header: "Net Credited Payout",
      accessor: (row) => (
        <span className="font-mono font-black text-brand-600 dark:text-brand-400 text-xs">
          ₹{row.netPayout.toLocaleString("en-IN")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "utr",
      header: "Bank Ref / UTR",
      accessor: (row) => (
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{row.bankName}</span>
          <span className="font-mono text-[10px] text-slate-400">{row.utr}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-200 dark:border-emerald-800">
          {row.status}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          href="/technicians"
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-brand-500" />
          <span>Back to Partner Fleet Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-mono font-bold border border-brand-200 dark:border-brand-800">
            Partner Fleet ID: {tech.id}
          </span>
        </div>
      </div>

      {/* Partner Executive Hero Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={tech.avatar}
                alt={tech.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-brand-500 shadow-lg shrink-0"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-white rounded-full text-[10px] ring-4 ring-slate-950">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{tech.name}</h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${
                    tech.status === "Available" || tech.status === "Approved"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}
                >
                  ● {tech.status}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-extrabold">
                  {tech.role}
                </span>
              </div>

              <p className="text-xs text-brand-300 font-extrabold flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-brand-400" />
                <span>{tech.category} Specialist</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>{tech.locality} ({tech.pincode}), Varanasi</span>
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold pt-1 flex-wrap">
                <span className="flex items-center gap-1 font-mono text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" /> {tech.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Onboarded: {tech.joiningDate || "Jan 2025"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <a
              href={`tel:${tech.phone}`}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Partner</span>
            </a>

            <a
              href={`https://wa.me/${tech.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>WhatsApp Dispatch</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── HIGH-CONTRAST SEGMENTED TAB BAR ─── */}
      <div className="bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-inner w-full sm:w-fit text-xs font-extrabold">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "overview"
              ? "bg-brand-600 text-white shadow-lux scale-[1.02] font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Overview & Biometric KYC</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("kyc")}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "kyc"
              ? "bg-brand-600 text-white shadow-lux scale-[1.02] font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Identity & Verification</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "jobs"
              ? "bg-brand-600 text-white shadow-lux scale-[1.02] font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Completed Jobs</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === "jobs"
                ? "bg-white/20 text-white"
                : "bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
            }`}
          >
            {partnerJobs.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("earnings")}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "earnings"
              ? "bg-brand-600 text-white shadow-lux scale-[1.02] font-black"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Earnings & Weekly Settlement</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === "earnings"
                ? "bg-white/20 text-white"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            {weeklySettlements.length}
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & BIOMETRIC KYC SPECIFICATIONS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Inside Tab Metrics Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Partner Rating</span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"><Star className="w-4 h-4 fill-amber-500" /></span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                {tech.rating} / 5.0
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                ★ 98% Positive Customer Feedback
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Total Jobs Completed</span>
                <span className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400"><Briefcase className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400 font-mono">
                {partnerJobs.length} Jobs
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">Varanasi Active Fleet</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Gross Revenue</span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"><CreditCard className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{tech.totalEarnings.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 100% Cleared Billings
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                <span>Pending Weekly Payout</span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"><Wallet className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
                ₹{tech.pendingPayout.toLocaleString()}
              </div>
              <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold block">
                Next Payout: Monday 10:00 AM
              </span>
            </div>
          </div>

          {/* Specifications Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Partner Personal & Technical Profile */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Partner Personal & Technical Profile</h3>
                      <p className="text-[11px] text-slate-400">Biometric Verified Technician Details</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    ● Biometric Verified
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Full Partner Name</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{tech.name}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Mobile Phone</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{tech.phone}</span>
                      <a href={`tel:${tech.phone}`} className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-extrabold">Call</a>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Service Category</span>
                    <span className="font-extrabold text-brand-600 dark:text-brand-400">{tech.category}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Skill Level & Certification</span>
                    <span className="font-bold text-slate-900 dark:text-white">HVAC Master Level L3 Certified</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Varanasi Fleet Zone</span>
                    <span className="font-bold text-slate-900 dark:text-white">{tech.locality} ({tech.pincode})</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Years of Field Experience</span>
                    <span className="font-bold text-slate-900 dark:text-white">8+ Years Experience</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">Registered Vehicle</span>
                    <span className="font-bold text-slate-900 dark:text-white">Hero Electric Scooter (UP 65 AB 4910)</span>
                  </div>
                </div>
              </div>

              {/* Police Clearance & Safety Compliance */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Police Clearance & Safety Audit</h3>
                      <p className="text-[11px] text-slate-400">Verified Police Thana Clearance Certificate</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    PCC Passed
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">Local Police Station</span>
                    <span className="font-bold text-slate-900 dark:text-white">Sigra Police Station, Varanasi</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">PCC Token Number</span>
                    <span className="font-mono font-extrabold text-brand-600 dark:text-brand-400">PCC-VAR-2026-8819</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 font-semibold">Bonded Customer Insurance</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹5,00,000 Safety Cover Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Guarantor Audit Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Guarantor Person Details</h3>
                      <p className="text-[11px] text-slate-400">Verified Emergency & Financial Guarantor</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200">
                    Verified
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">Guarantor Name</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">Suresh Chandra Yadav</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">Relation to Partner</span>
                    <span className="font-bold text-slate-900 dark:text-white">Father</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-semibold">Guarantor Mobile Phone</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">+91 94152 88219</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 font-semibold">Guarantor Address</span>
                    <span className="font-bold text-slate-900 dark:text-white">Sigra, Varanasi (221002)</span>
                  </div>
                </div>
              </div>

              {/* Special Partner Notes */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Dispatch Performance Note
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase block">Top Rated Fleet Specialist</span>
                    <p className="text-slate-200 font-medium leading-relaxed">
                      "Consistently maintains 4.9 star rating with 99.2% on-time arrival rate. Assigned to premium AC service bookings."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IDENTITY & GUARANTOR DOCUMENTS */}
      {activeTab === "kyc" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Partner Aadhaar Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span className="font-extrabold text-slate-900 dark:text-white text-base">
                  Partner Biometric Aadhaar Card
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 text-[10px] font-bold">
                Identity Verified
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileCheck className="w-7 h-7 text-brand-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Partner_Aadhaar_Card_Front_Back.pdf</span>
                  <span className="text-[11px] text-slate-400 font-mono">12-Digit: 7821-4920-1102</span>
                </div>
              </div>
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs"
              >
                View Document
              </button>
            </div>
          </div>

          {/* Guarantor Aadhaar Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                <span className="font-extrabold text-slate-900 dark:text-white text-base">
                  Guarantor Person Aadhaar Card
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 text-[10px] font-bold">
                Guarantor Verified
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <FileCheck className="w-7 h-7 text-purple-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Guarantor_Aadhaar_Card_Record.pdf</span>
                  <span className="text-[11px] text-slate-400 font-mono">Guarantor: Suresh Chandra Yadav</span>
                </div>
              </div>
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
              >
                View Guarantor Aadhaar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: COMPLETED JOBS (WITH PAGINATED DATATABLE) ─── */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">Lifetime Jobs Completed</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {tech.totalJobs} Jobs
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">100% Verified OTP Closed</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">Average Job Rating</span>
              <div className="text-2xl font-black text-amber-500 font-mono flex items-center gap-1.5">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span>{tech.rating} / 5.0</span>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">Based on customer feedback</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">Gross Revenue Serviced</span>
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                ₹{tech.totalEarnings.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">Total Billings Handled</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600" />
                <span>Completed Jobs History</span>
              </h3>
            </div>

            <DataTable
              columns={jobColumns}
              data={partnerJobs}
              searchPlaceholder="Search completed jobs by ID, customer, service, locality..."
              statusField="status"
            />
          </div>
        </div>
      )}

      {/* ─── TAB 4: EARNINGS & WEEKLY SETTLEMENT (WITH PAGINATED DATATABLE) ─── */}
      {activeTab === "earnings" && (
        <div className="space-y-6">
          {/* Top Settlement KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">Gross Service Revenue</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                ₹{tech.totalEarnings.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">100% Customer Paid</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">HelpMate Platform Fee (25%)</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{tech.commissionPaid.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Auto Deducted</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">Net Settled Payouts</span>
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                ₹{(tech.totalEarnings - tech.commissionPaid).toLocaleString()}
              </div>
              <span className="text-[11px] text-brand-600 font-bold">Credited to Bank</span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-slate-400 font-extrabold uppercase text-[10px]">Pending Weekly Payout</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                ₹{tech.pendingPayout.toLocaleString()}
              </div>
              <span className="text-[11px] text-purple-600 font-bold">Due Next Monday</span>
            </div>
          </div>

          {/* SIMPLIFIED BANK CARD */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800 shadow-xs">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                  Registered Bank Account
                </span>
                <h4 className="font-black text-slate-900 dark:text-white text-base">
                  HDFC Bank (Sigra Branch)
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Manage Payout Bank Account Specs for ${tech.name}`)}
              className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lux transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Edit2 className="w-4 h-4" />
              <span>Manage Bank Account</span>
            </button>
          </div>

          {/* WEEKLY SETTLEMENT PAYOUT LEDGER TABLE (WITH PAGINATED DATATABLE) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Weekly Settlement Payout Ledger
                </h3>
              </div>
            </div>

            <DataTable
              columns={settlementColumns}
              data={weeklySettlements}
              searchPlaceholder="Search weekly settlements by ID, cycle, bank UTR..."
              statusField="status"
            />
          </div>
        </div>
      )}
    </div>
  );
}
