"use client";

import { useState } from "react";
import {
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserPlus,
  ShieldCheck,
  FileText,
  Upload,
  Building,
  CreditCard,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldAlert,
  ArrowLeft,
  Download,
  Clock,
  CheckCircle,
  Receipt,
  Briefcase,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { initialCustomers, Customer, varanasiLocalities, initialBookings } from "@/lib/mockData";
import { DataTable, Column } from "@/components/DataTable";
import { Portal } from "@/components/Portal";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "kyc" | "bookings" | "billing">("overview");
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);

  // Add Customer Drawer State
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 1. Customer Details States
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAadhaarNumber, setNewAadhaarNumber] = useState("");
  const [newAadhaarDocUrl, setNewAadhaarDocUrl] = useState("");

  // 2. Guarantor / Reference Person States
  const [newGuarantorName, setNewGuarantorName] = useState("");
  const [newGuarantorPhone, setNewGuarantorPhone] = useState("");
  const [newGuarantorAddress, setNewGuarantorAddress] = useState("");
  const [newGuarantorAadhaarNumber, setNewGuarantorAadhaarNumber] = useState("");
  const [newGuarantorAadhaarDocUrl, setNewGuarantorAadhaarDocUrl] = useState("");

  // 3. Police Verification States
  const [newPoliceStatus, setNewPoliceStatus] = useState<
    "Pending Verification" | "Verified Clean" | "Submitted to Local Thana" | "Exempted"
  >("Verified Clean");
  const [newPoliceStationName, setNewPoliceStationName] = useState("Sigra Police Station");
  const [newPoliceTokenNumber, setNewPoliceTokenNumber] = useState("");
  const [newPoliceCertificateUrl, setNewPoliceCertificateUrl] = useState("");

  // 4. Location States
  const [newLocality, setNewLocality] = useState("Sigra");
  const [newAddress, setNewAddress] = useState("");

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: newName,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      locality: newLocality,
      address: newAddress || `${newLocality}, Varanasi`,
      tier: "Standard",
      totalSpend: 0,
      totalBookings: 0,
      lastBookingDate: "Just Now",
      joinedDate: "Today",

      aadhaarNumber: newAadhaarNumber || "7821-XXXX-9900",
      aadhaarDocUrl: newAadhaarDocUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",

      guarantorName: newGuarantorName,
      guarantorPhone: newGuarantorPhone,
      guarantorAddress: newGuarantorAddress,
      guarantorAadhaarNumber: newGuarantorAadhaarNumber,
      guarantorAadhaarDocUrl: newGuarantorAadhaarDocUrl,

      policeStatus: newPoliceStatus,
      policeStationName: newPoliceStationName,
      policeTokenNumber: newPoliceTokenNumber || `PCC-VAR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      policeCertificateUrl: newPoliceCertificateUrl,
    };

    setCustomers([newCustomer, ...customers]);
    resetForm();
    setIsAddOpen(false);
  };

  const resetForm = () => {
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewAadhaarNumber("");
    setNewAadhaarDocUrl("");
    setNewGuarantorName("");
    setNewGuarantorPhone("");
    setNewGuarantorAddress("");
    setNewGuarantorAadhaarNumber("");
    setNewGuarantorAadhaarDocUrl("");
    setNewPoliceStatus("Verified Clean");
    setNewPoliceStationName("Sigra Police Station");
    setNewPoliceTokenNumber("");
    setNewPoliceCertificateUrl("");
    setNewAddress("");
  };

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer Name",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            {row.name[0]}
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => setSelectedCustomer(row)}
              className="font-bold text-slate-900 dark:text-white hover:text-brand-600 text-left transition-colors"
            >
              {row.name}
            </button>
            <span className="text-[10px] text-slate-400">{row.id}</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "phone",
      header: "Contact Info",
      accessor: (row) => (
        <div className="flex flex-col text-[11px]">
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
            <Phone className="w-3 h-3 text-brand-600" /> {row.phone}
          </span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Mail className="w-2.5 h-2.5 text-slate-400" /> {row.email}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "guarantorName",
      header: "Guarantor / Reference",
      accessor: (row) => (
        <div className="flex flex-col text-[11px] max-w-xs">
          {row.guarantorName ? (
            <>
              <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-purple-600" /> {row.guarantorName}
              </span>
              <span className="text-[10px] text-slate-500">{row.guarantorPhone}</span>
            </>
          ) : (
            <span className="text-slate-400 italic">Self-Verified Customer</span>
          )}
        </div>
      ),
    },
    {
      key: "policeStatus",
      header: "Police Verification",
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-[10px]">
          <span
            className={`px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit ${
              row.policeStatus === "Verified Clean"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : row.policeStatus === "Submitted to Local Thana"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{row.policeStatus || "Verified Clean"}</span>
          </span>
          {row.aadhaarNumber && (
            <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-brand-500" /> Aadhaar: {row.aadhaarNumber}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "locality",
      header: "Locality Address",
      accessor: (row) => (
        <div className="flex flex-col max-w-xs text-[11px]">
          <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-600 shrink-0" /> {row.locality}
          </span>
          <span className="text-[10px] text-slate-500 truncate">{row.address}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "totalSpend",
      header: "Total Spend (₹)",
      accessor: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-white">
          ₹{row.totalSpend.toLocaleString("en-IN")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCustomer(row)}
            title="Open In-Page Full Customer Details"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors flex items-center gap-1 text-[11px] font-bold px-2"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEditCustomer(row)}
            title="Edit Customer Profile"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteCustomer(row)}
            title="Delete Customer"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-red-50 text-slate-700 dark:text-slate-300 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // IN-PAGE CUSTOMER FULL DETAIL VIEW
  if (selectedCustomer) {
    const customerBookings = initialBookings.filter(
      (b) =>
        b.customerName.toLowerCase().includes(selectedCustomer.name.toLowerCase()) ||
        b.customerPhone === selectedCustomer.phone
    );

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Header Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors"
              title="Return to Customer Directory List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-lux">
                {selectedCustomer.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedCustomer.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 text-xs font-bold">
                    {selectedCustomer.tier || "Crown Elite"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                  <span>Customer ID: {selectedCustomer.id}</span>
                  <span>•</span>
                  <span>Joined {selectedCustomer.joinedDate}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditCustomer(selectedCustomer)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setDeleteCustomer(selectedCustomer)}
              className="px-4 py-2.5 rounded-xl bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 hover:bg-red-100 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Customer</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Lifetime Spend</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Paid & Verified Accounts
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Service Bookings</span>
            <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
              {selectedCustomer.totalBookings || customerBookings.length} Jobs
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">Last active: {selectedCustomer.lastBookingDate}</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Aadhaar Identity</span>
            <div className="text-sm font-mono font-bold text-slate-900 dark:text-white truncate">
              {selectedCustomer.aadhaarNumber || "7821-4920-1102"}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Aadhaar Verified
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Police Thana Status</span>
            <div className="text-sm font-bold text-amber-800 dark:text-amber-300 truncate">
              {selectedCustomer.policeStatus || "Verified Clean"}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              {selectedCustomer.policeStationName || "Sigra Police Station"}
            </span>
          </div>
        </div>

        {/* In-Page Section Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-brand-500 text-white shadow-lux"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Overview & Verification Details</span>
          </button>

          <button
            onClick={() => setActiveTab("kyc")}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "kyc"
                ? "bg-brand-500 text-white shadow-lux"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>KYC & Document Attachments</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "bookings"
                ? "bg-brand-500 text-white shadow-lux"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Booking & Job History ({customerBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "billing"
                ? "bg-brand-500 text-white shadow-lux"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Billing & Invoices</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & VERIFICATION DETAILS */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Customer Info */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-slate-900 dark:text-white font-extrabold text-sm">
                <UserCheck className="w-4 h-4 text-brand-600" />
                <span>1. Customer Personal Information</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 font-bold">Full Name</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedCustomer.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 font-bold">Mobile Number</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Phone className="w-3 h-3 text-brand-600" /> {selectedCustomer.phone}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 font-bold">Email Address</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {selectedCustomer.email}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 font-bold">Customer Aadhaar Number</span>
                  <span className="font-mono font-extrabold text-brand-600 dark:text-brand-400">
                    {selectedCustomer.aadhaarNumber || "7821-4920-1102"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-bold">Account Status</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 font-bold text-[11px]">
                    Active Household Client
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Guarantor / Reference Person */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-purple-900 dark:text-purple-300 font-extrabold text-sm">
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>2. Guarantor / Reference Person (Taking Customer Guarantee)</span>
              </div>

              {selectedCustomer.guarantorName ? (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-bold">Guarantor Name</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{selectedCustomer.guarantorName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-bold">Guarantor Mobile No.</span>
                    <span className="font-bold text-purple-700 dark:text-purple-300">{selectedCustomer.guarantorPhone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-slate-400 font-bold">Guarantor Aadhaar No.</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {selectedCustomer.guarantorAadhaarNumber || "7821-4920-5592"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400 font-bold">Guarantor Address</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 max-w-xs text-right truncate">
                      {selectedCustomer.guarantorAddress || selectedCustomer.address}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs italic text-center">
                  No separate guarantor registered. Verified through direct customer Aadhaar identity.
                </div>
              )}
            </div>

            {/* Card 3: Police Clearance & Thana Records */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-amber-900 dark:text-amber-300 font-extrabold text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>3. Police Verification & Thana Clearance</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 font-bold">Verification Status</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 font-extrabold">
                    {selectedCustomer.policeStatus || "Verified Clean"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 font-bold">Local Police Station (Thana)</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedCustomer.policeStationName || "Sigra Police Station"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-bold">PCC Reference Token</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                    {selectedCustomer.policeTokenNumber || "PCC-VAR-2026-8819"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 4: Service Delivery Address */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 text-slate-900 dark:text-white font-extrabold text-sm">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>4. Service Location & Address</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-400 font-bold">Varanasi Zone Locality</span>
                  <span className="font-extrabold text-brand-600 dark:text-brand-400">{selectedCustomer.locality}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Full Street Delivery Address</span>
                  <p className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                    {selectedCustomer.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KYC & DOCUMENT ATTACHMENTS */}
        {activeTab === "kyc" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Document Card 1: Customer Aadhaar */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-600" /> Customer Aadhaar Card
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  Verified
                </span>
              </div>
              <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 relative group">
                <img
                  src={selectedCustomer.aadhaarDocUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"}
                  alt="Customer Aadhaar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-slate-500">{selectedCustomer.aadhaarNumber || "7821-4920-1102"}</span>
                <button
                  type="button"
                  onClick={() => alert("Downloading Customer Aadhaar Certificate...")}
                  className="text-brand-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            {/* Document Card 2: Guarantor Aadhaar */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-sm text-purple-900 dark:text-purple-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-600" /> Guarantor Aadhaar Card
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                  Guarantor
                </span>
              </div>
              <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 relative group">
                <img
                  src={selectedCustomer.guarantorAadhaarDocUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"}
                  alt="Guarantor Aadhaar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-slate-500">
                  {selectedCustomer.guarantorAadhaarNumber || "7821-4920-5592"}
                </span>
                <button
                  type="button"
                  onClick={() => alert("Downloading Guarantor Document...")}
                  className="text-purple-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>

            {/* Document Card 3: Police Clearance PCC */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="font-extrabold text-sm text-amber-900 dark:text-amber-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Police Clearance (PCC)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                  PCC Clean
                </span>
              </div>
              <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 relative group">
                <img
                  src={selectedCustomer.policeCertificateUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"}
                  alt="Police Verification PCC"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-mono text-slate-500">{selectedCustomer.policeTokenNumber || "PCC-VAR-2026-8819"}</span>
                <button
                  type="button"
                  onClick={() => alert("Downloading Police Clearance Certificate...")}
                  className="text-amber-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKING & SERVICE HISTORY */}
        {activeTab === "bookings" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Service Job History ({customerBookings.length} Total)
            </h3>
            {customerBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-3">Booking ID</th>
                      <th className="p-3">Service Name</th>
                      <th className="p-3">Date & Slot</th>
                      <th className="p-3">Assigned Partner</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {customerBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-brand-600">{b.id}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{b.serviceTitle}</td>
                        <td className="p-3 text-slate-500">{b.date}</td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          {b.technicianName || "Pending Assignment"}
                        </td>
                        <td className="p-3 font-extrabold text-slate-900 dark:text-white">₹{b.totalAmount}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 font-extrabold text-[10px]">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                No past bookings found for this customer.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BILLING & TRANSACTIONS */}
        {activeTab === "billing" && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Billing Ledger & Invoice Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">GSTIN Registration</span>
                <div className="font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                  09AABCH1234H1Z5 (B2B Taxable Entity)
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Preferred Payment Method</span>
                <div className="font-extrabold text-brand-600 dark:text-brand-400 text-sm">
                  UPI AutoPay / Direct NetBanking
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT IN-PAGE DATATABLE CUSTOMER LIST VIEW
  return (
    <div className="space-y-6">
      {/* Main DataTable matching User Management layout */}
      <DataTable
        title="Customer CRM & Household Directory"
        description="Track Varanasi client profiles, Aadhaar identity, Guarantor reference records & Police Thana clearance"
        columns={columns}
        data={customers}
        addButtonLabel="Add New Customer"
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* ADD CUSTOMER SLIDE-OVER DRAWER */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddOpen(false)} />
            <form
              onSubmit={handleAddCustomer}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200 dark:border-brand-800 shadow-lux">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                      Add New Customer Profile
                    </h3>
                    <p className="text-xs text-slate-500">
                      Customer Aadhaar, Guarantor / Reference Person details & Police Thana record
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* SECTION 1: CUSTOMER DETAILS */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <UserCheck className="w-4 h-4 text-brand-600" />
                    <span>1. Customer Personal Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Customer Full Name *
                      </label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar Agrawal"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="+91 98390 12345"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="rajesh@gmail.com"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: LOCATION & ADDRESS */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    <span>2. Service Location & Delivery Address</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Varanasi Locality Zone *
                      </label>
                      <select
                        value={newLocality}
                        onChange={(e) => setNewLocality(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                      >
                        {varanasiLocalities.map((loc) => (
                          <option key={loc.id} value={loc.name}>
                            {loc.name} ({loc.pincode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Full Delivery / Service Street Address & Landmark *
                      </label>
                      <textarea
                        rows={2}
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="House / Flat No., Colony, Near Landmark..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3 bg-slate-50 dark:bg-slate-800/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-extrabold text-xs shadow-lux transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Full Customer Record</span>
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* EDIT CUSTOMER MODAL */}
      {editCustomer && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCustomers(customers.map((c) => (c.id === editCustomer.id ? editCustomer : c)));
                if (selectedCustomer && (selectedCustomer as Customer).id === editCustomer.id) {
                  setSelectedCustomer(editCustomer);
                }
                setEditCustomer(null);
              }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Edit Customer Profile</h3>
                <button type="button" onClick={() => setEditCustomer(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    value={editCustomer.name}
                    onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={editCustomer.phone}
                      onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer Aadhaar No.</label>
                    <input
                      type="text"
                      value={editCustomer.aadhaarNumber || ""}
                      onChange={(e) => setEditCustomer({ ...editCustomer, aadhaarNumber: e.target.value })}
                      placeholder="7821-4920-1102"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Guarantor Name</label>
                    <input
                      type="text"
                      value={editCustomer.guarantorName || ""}
                      onChange={(e) => setEditCustomer({ ...editCustomer, guarantorName: e.target.value })}
                      placeholder="Person Taking Guarantee"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Guarantor Aadhaar No.</label>
                    <input
                      type="text"
                      value={editCustomer.guarantorAadhaarNumber || ""}
                      onChange={(e) => setEditCustomer({ ...editCustomer, guarantorAadhaarNumber: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Police Verification Status</label>
                  <select
                    value={editCustomer.policeStatus || "Verified Clean"}
                    onChange={(e) => setEditCustomer({ ...editCustomer, policeStatus: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Verified Clean">Verified Clean (PCC Issued)</option>
                    <option value="Submitted to Local Thana">Submitted to Local Thana</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Exempted">Exempted</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditCustomer(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl font-bold text-xs shadow-lux">Save Changes</button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* DELETE CUSTOMER MODAL */}
      {deleteCustomer && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Delete Customer Profile</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to delete customer <strong>{deleteCustomer.name}</strong> ({deleteCustomer.phone})?
              </p>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setDeleteCustomer(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomers(customers.filter((c) => c.id !== deleteCustomer.id));
                    if (selectedCustomer && (selectedCustomer as Customer).id === deleteCustomer.id) {
                      setSelectedCustomer(null);
                    }
                    setDeleteCustomer(null);
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-lux"
                >
                  Delete Customer
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
