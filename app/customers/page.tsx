"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "billing">("overview");
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);

  // Add Customer Drawer State
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 1. Customer Details States
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAlternatePhone, setNewAlternatePhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCustomerType, setNewCustomerType] = useState<"Individual Household" | "Commercial Business / B2B">("Individual Household");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newHouseholdType, setNewHouseholdType] = useState<"Family Home" | "Apartment / Flat" | "Villa / Bungalow" | "Commercial Office / Shop">("Apartment / Flat");
  const [newAadhaarNumber, setNewAadhaarNumber] = useState("");
  const [newAadhaarDocUrl, setNewAadhaarDocUrl] = useState("");

  // 2. Location States
  const [newLocality, setNewLocality] = useState("Sigra");
  const [newPincode, setNewPincode] = useState("221002");
  const [newAddress, setNewAddress] = useState("");

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: newName,
      phone: newPhone,
      alternatePhone: newAlternatePhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      locality: newLocality,
      pincode: newPincode,
      address: newAddress || `${newLocality}, Varanasi`,
      tier: "Standard",
      totalSpend: 0,
      totalBookings: 0,
      lastBookingDate: "Just Now",
      joinedDate: "Today",
      customerType: newCustomerType,
      companyName: newCustomerType === "Commercial Business / B2B" ? newCompanyName : undefined,
      householdType: newHouseholdType,

      aadhaarNumber: newAadhaarNumber || "7821-XXXX-9900",
      aadhaarDocUrl: newAadhaarDocUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    };

    setCustomers([newCustomer, ...customers]);
    resetForm();
    setIsAddOpen(false);
  };

  const resetForm = () => {
    setNewName("");
    setNewPhone("");
    setNewAlternatePhone("");
    setNewEmail("");
    setNewCustomerType("Individual Household");
    setNewCompanyName("");
    setNewHouseholdType("Apartment / Flat");
    setNewAadhaarNumber("");
    setNewAadhaarDocUrl("");
    setNewLocality("Sigra");
    setNewPincode("221002");
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
            title="Open Customer Details"
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

  // Image Document Preview State
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // IN-PAGE CUSTOMER FULL DETAIL VIEW
  if (selectedCustomer) {
    const customerBookings = initialBookings.filter(
      (b) =>
        b.customerName.toLowerCase().includes(selectedCustomer.name.toLowerCase()) ||
        b.customerPhone === selectedCustomer.phone
    );

    const handleCopyEmail = () => {
      navigator.clipboard.writeText(selectedCustomer.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-300 pb-8">
        
        {/* ─── LUXURY HERO PROFILE GLASS BANNER ─── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-purple-950 p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
          {/* Subtle Glow Elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Profile Media & Identity */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md cursor-pointer shrink-0 border border-white/10"
                title="Return to Customer Directory"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                {selectedCustomer.avatar ? (
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-brand-400/60 shadow-xl"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-brand-500 to-purple-600 text-white font-black text-3xl flex items-center justify-center border-2 border-white/20 shadow-xl">
                    {selectedCustomer.name[0]}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold" title="Active Verified Customer">
                  ✓
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {selectedCustomer.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedCustomer.tier || "Crown Elite"}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-slate-200 text-xs font-bold border border-white/10">
                    {selectedCustomer.customerType || "Individual Household"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold flex-wrap">
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded border border-white/10 text-brand-300">
                    ID: {selectedCustomer.id}
                  </span>
                  <span>•</span>
                  <span>Member Since {selectedCustomer.joinedDate}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Varanasi Client</span>
                </div>
              </div>
            </div>

            {/* Right Action Contact Toolbar */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <a
                href={`tel:${selectedCustomer.phone}`}
                className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>Call Customer</span>
              </a>

              <a
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <ExternalLink className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setEditCustomer(selectedCustomer)}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setDeleteCustomer(selectedCustomer)}
                className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-bold text-xs backdrop-blur-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>

          </div>
        </div>

        {/* ─── IN-PAGE SECTION TABS ─── */}
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "overview"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer Specifications & Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "bookings"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Service Booking History ({customerBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "billing"
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Tax GSTIN & Ledger Invoices</span>
          </button>
        </div>

        {/* TAB 1: ALL CUSTOMER SPECIFICATIONS & PROFILE */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            
            {/* ─── INSIDE TAB 1 METRIC HIGHLIGHTS ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs relative overflow-hidden group hover:border-emerald-500 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                  <span>Lifetime Value (LTV)</span>
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 group-hover:scale-110 transition-transform"><CreditCard className="w-4 h-4" /></span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                  ₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 100% Verified Paid Ledger
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs relative overflow-hidden group hover:border-brand-500 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                  <span>Total Service Bookings</span>
                  <span className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 group-hover:scale-110 transition-transform"><Briefcase className="w-4 h-4" /></span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400 font-mono">
                  {customerBookings.length} {customerBookings.length === 1 ? "Booking" : "Bookings"}
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">Last Active: {selectedCustomer.lastBookingDate}</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs relative overflow-hidden group hover:border-purple-500 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                  <span>Helpmate Wallet Cash</span>
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 group-hover:scale-110 transition-transform"><Receipt className="w-4 h-4" /></span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono">
                  ₹{selectedCustomer.walletBalance || 1250}
                </div>
                <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold block">
                  Instant Redeemable Credit
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs relative overflow-hidden group hover:border-amber-500 transition-all">
                <div className="flex items-center justify-between text-xs text-slate-400 font-extrabold uppercase tracking-wider">
                  <span>Reward Loyalty Points</span>
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 group-hover:scale-110 transition-transform"><Sparkles className="w-4 h-4" /></span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
                  {selectedCustomer.loyaltyPoints || 1250} pts
                </div>
                <span className="text-[11px] text-amber-700 dark:text-amber-300 font-bold block">
                  Tier 1 Crown Shield Member
                </span>
              </div>

            </div>

            {/* ─── 2-COLUMN MAIN SPECIFICATIONS DASHBOARD ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN (7 COLS): PERSONAL PROFILE, SAVED ADDRESSES & APPLIANCES */}
              <div className="lg:col-span-7 space-y-6">

                {/* CARD 1: PERSONAL & CONTACT INFORMATION */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Customer Personal & Contact Specifications</h3>
                        <p className="text-[11px] text-slate-400">Verified Client Identity & Communication Channels</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      ● Active Account
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" /> Full Customer Name
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedCustomer.name}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500" /> Primary Mobile Phone
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedCustomer.phone}</span>
                        <a
                          href={`tel:${selectedCustomer.phone}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold shadow-xs transition-colors"
                        >
                          Call
                        </a>
                      </div>
                    </div>

                    {selectedCustomer.alternatePhone && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400" /> Alternate Contact Phone
                        </span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedCustomer.alternatePhone}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 gap-2">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-500" /> Email Address
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white select-all text-[11px]">
                          {selectedCustomer.email}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-[10px] font-bold hover:underline border border-brand-200 dark:border-brand-800 cursor-pointer"
                        >
                          {copiedEmail ? "Copied!" : "Copy Email"}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                        <Building className="w-4 h-4 text-purple-500" /> Account Category
                      </span>
                      <span className="font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded-lg border border-brand-200 dark:border-brand-800">
                        {selectedCustomer.customerType || "Individual Household"}
                      </span>
                    </div>

                    {selectedCustomer.companyName && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-purple-500" /> B2B Registered Entity
                        </span>
                        <span className="font-extrabold text-purple-700 dark:text-purple-300">{selectedCustomer.companyName}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" /> Communication Language
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedCustomer.preferredLanguage || "Hindi / English"}</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" /> Preferred Service Slot
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{selectedCustomer.preferredTimeSlot || "Morning (9am-12pm)"}</span>
                    </div>
                  </div>
                </div>

                {/* CARD 2: SAVED SERVICE DELIVERY ADDRESSES */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Saved Service Delivery Addresses</h3>
                        <p className="text-[11px] text-slate-400">Verified Service Locations in Varanasi</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded-xl border border-brand-200">
                      Varanasi Directory
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {/* Primary Address */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-black text-brand-600 dark:text-brand-400 tracking-wider">
                          Primary Delivery Residence
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2.5 py-0.5 rounded-md">
                          PIN: {selectedCustomer.pincode || "221002"}
                        </span>
                      </div>
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm leading-relaxed">
                        {selectedCustomer.address}
                      </div>
                      <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-500" />
                        <span>Locality: <strong className="text-slate-800 dark:text-slate-200">{selectedCustomer.locality}</strong>, Varanasi</span>
                      </div>
                    </div>

                    {/* Secondary Address (if available) */}
                    {selectedCustomer.secondaryAddress && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-black text-purple-600 dark:text-purple-400 tracking-wider">
                            Secondary / Commercial Address
                          </span>
                        </div>
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm leading-relaxed">
                          {selectedCustomer.secondaryAddress}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-500" />
                          <span>Locality: <strong className="text-slate-800 dark:text-slate-200">{selectedCustomer.secondaryLocality || "Varanasi"}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CARD 3: HOUSEHOLD PROFILE & APPLIANCE INVENTORY */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Household & Appliance Inventory</h3>
                        <p className="text-[11px] text-slate-400">Registered Household Equipment at Location</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">
                      Registered Location
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-semibold">Property / Household Type</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedCustomer.householdType || "Apartment / Flat"}</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-slate-400 font-semibold block">Registered Location Appliances</span>
                      <div className="flex flex-wrap gap-2">
                        {(selectedCustomer.registeredAppliances || ["2x Inverter AC 1.5 Ton", "1x RO Water Purifier", "1x Washing Machine"]).map((app, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5"
                          >
                            <span className="text-brand-500">⚡</span>
                            <span>{app}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN (5 COLS): FINANCIAL WALLET, CRM AUDIT & SERVICE PREFERENCES */}
              <div className="lg:col-span-5 space-y-6">

                {/* CARD 4: FINANCIAL WALLET & PAYMENT LEDGER */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Financial Wallet & Ledger</h3>
                        <p className="text-[11px] text-slate-400">Lifetime Spend & Payment Preferences</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200">
                      Helpmate Pay
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-semibold">Total Lifetime Spend</span>
                      <span className="font-mono font-extrabold text-slate-900 dark:text-white text-base">
                        ₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-semibold">Helpmate Active Cash Wallet</span>
                      <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                        ₹{selectedCustomer.walletBalance || 1250} Credit
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-semibold">Reward Loyalty Points</span>
                      <span className="font-extrabold text-purple-600 dark:text-purple-400">
                        {selectedCustomer.loyaltyPoints || 1250} Points Active
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-500 font-semibold">Preferred Gateway Method</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedCustomer.preferredPaymentMethod || "UPI Digital Prepaid (Google Pay)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD 5: OPERATIONS & CRM AUDIT */}
                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Operations & CRM Audit</h3>
                        <p className="text-[11px] text-slate-400">Account Dispatch & Management Team</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Varanasi Central
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-semibold">CRM Dispatch Manager</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedCustomer.crmManager || "Pooja Sharma (Dispatch HQ)"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-semibold">Loyalty Member Tier</span>
                      <span className="font-extrabold text-brand-600 dark:text-brand-400 text-sm">
                        {selectedCustomer.tier || "Crown Elite"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 font-semibold">Registration Date</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedCustomer.joinedDate}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-500 font-semibold">Last Booking Date</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {selectedCustomer.lastBookingDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD 6: SERVICE NOTES & DISPATCH PREFERENCES */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Special Instructions & Preferences
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">Customer Priority Note</span>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        "Requires senior certified technician for inverter AC units. Always call 30 minutes before arrival."
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: LUXURY SERVICE BOOKING HISTORY */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            
            {/* Top Job Metrics Summary Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Bookings Recorded</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {customerBookings.length} Bookings
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">Active Varanasi Client Account</span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Service Expenditure</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> 100% Cleared Payments
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average Booking Value</span>
                <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                  ₹{customerBookings.length > 0 ? Math.round(selectedCustomer.totalSpend / customerBookings.length).toLocaleString("en-IN") : "0"}
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">Per Order Average</span>
              </div>
            </div>

            {/* Bookings List Cards */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-600" />
                  <span>Customer Service Booking History</span>
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  Showing {customerBookings.length} Service Bookings
                </span>
              </div>

              {customerBookings.length > 0 ? (
                <div className="space-y-3">
                  {customerBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Link
                            href={`/bookings/${b.id}`}
                            className="font-mono font-extrabold text-brand-600 dark:text-brand-400 text-sm group-hover:underline flex items-center gap-1"
                          >
                            <span>#{b.id}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-200 dark:border-emerald-800">
                            {b.status}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">•</span>
                          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.date}</span>
                          </span>
                        </div>

                        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                          {b.serviceTitle}
                        </h4>

                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-brand-500" />
                          <span>{selectedCustomer.address}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-6 justify-between md:justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-700">
                        {/* Assigned Partner Details */}
                        <div className="text-left md:text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Fleet Technician</span>
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs block">
                            {b.technicianName || "Pending Assignment"}
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Price</span>
                          <span className="font-mono font-black text-slate-900 dark:text-white text-lg">
                            ₹{b.totalAmount}
                          </span>
                        </div>

                        {/* Link Action */}
                        <Link
                          href={`/bookings/${b.id}`}
                          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-brand-600 hover:text-white text-slate-800 dark:text-slate-200 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <span>View Booking Details</span>
                          <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Briefcase className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No past bookings found for this customer.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: LUXURY TAX GSTIN & BILLING INVOICE LEDGER */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            
            {/* Top B2B GSTIN & Tax Identity Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-wider mb-1">
                    <Receipt className="w-4 h-4" /> GSTIN Tax Compliance & Invoicing Engine
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {selectedCustomer.companyName || selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official Tax Invoices & GST Returns Directory under CGST/SGST Act 2017.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCustomer.customerGstin) {
                        navigator.clipboard.writeText(selectedCustomer.customerGstin);
                        alert(`Copied GSTIN: ${selectedCustomer.customerGstin}`);
                      }
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Copy GSTIN Registration</span>
                  </button>
                </div>
              </div>

              {/* Tax Key Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">GSTIN Registration</span>
                  <div className="font-mono font-black text-amber-300 text-sm">
                    {selectedCustomer.customerGstin || "09AABCH1234H1Z5"}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block">✓ Verified Active Taxable Entity</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Tax Invoice Type</span>
                  <div className="font-bold text-white text-sm">
                    {selectedCustomer.customerGstin ? "B2B Commercial Tax Invoice" : "B2C Retail Tax Invoice"}
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium block">Standard 18% GST Breakdown</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Preferred Payment Method</span>
                  <div className="font-bold text-emerald-400 text-sm">
                    {selectedCustomer.preferredPaymentMethod || "UPI Digital Prepaid"}
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium block">Auto-reconciled Digital Ledger</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Helpmate Cash Credit</span>
                  <div className="font-mono font-black text-white text-sm">
                    ₹{selectedCustomer.walletBalance || 1250} Active Balance
                  </div>
                  <span className="text-[10px] text-purple-300 font-bold block">Instant Redeemable</span>
                </div>
              </div>
            </div>

            {/* Tax Invoices Table / Ledger */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  <span>Tax Invoice Records & Printable Invoices</span>
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {customerBookings.length} Available Invoices
                </span>
              </div>

              {customerBookings.length > 0 ? (
                <div className="space-y-3">
                  {customerBookings.map((b, idx) => {
                    const invoiceId = `INV-VAR-${202600 + idx + 1}`;
                    const gstAmount = Math.round(b.totalAmount * 0.18);
                    const baseAmount = b.totalAmount - gstAmount;

                    return (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                              #{invoiceId}
                            </span>
                            <span className="text-xs font-bold text-slate-400">•</span>
                            <span className="text-xs font-bold text-slate-500">Booking #{b.id}</span>
                            <span className="text-xs font-bold text-slate-400">•</span>
                            <span className="text-xs text-slate-500 font-semibold">{b.date}</span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                            {b.serviceTitle}
                          </h4>

                          <p className="text-xs text-slate-500 font-semibold">
                            Base: <strong className="font-mono text-slate-800 dark:text-slate-200">₹{baseAmount}</strong> + GST (18%): <strong className="font-mono text-emerald-600">₹{gstAmount}</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-4 justify-between md:justify-end shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-700">
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Grand Total</span>
                            <span className="font-mono font-black text-slate-900 dark:text-white text-lg">
                              ₹{b.totalAmount}
                            </span>
                          </div>

                          {/* DIRECT PRINT TAX INVOICE BUTTON */}
                          <Link
                            href={`/billing/inv-${b.id}`}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Receipt className="w-4 h-4" />
                            <span>Print Tax Invoice</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Receipt className="w-10 h-10 mx-auto text-slate-400" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No invoices available for this customer.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* FULL IMAGE DOCUMENT PREVIEW MODAL */}
        {previewDocUrl && (
          <Portal>
            <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-3xl p-4 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Document Verification Preview</h4>
                  <button
                    onClick={() => setPreviewDocUrl(null)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <img
                  src={previewDocUrl}
                  alt="Customer Document Preview"
                  className="max-h-[75vh] w-full object-contain rounded-2xl mx-auto"
                />
              </div>
            </div>
          </Portal>
        )}
      </div>
    );
  }

  // DEFAULT IN-PAGE DATATABLE CUSTOMER LIST VIEW
  return (
    <div className="space-y-6">
      {/* Top Header Banner matching Billing layout */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" /> Customer Relationship Engine
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Customer CRM & Household Directory</h1>
          <p className="text-xs text-brand-100 mt-1 max-w-xl">
            Track Varanasi client profiles, contact information, service location & spend history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-brand-900 font-extrabold text-xs shadow-md hover:bg-brand-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      {/* Main DataTable without duplicate headers */}
      <DataTable
        columns={columns}
        data={customers}
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
                      Customer contact information & service delivery address
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
                  <span>Save Customer Record</span>
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
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editCustomer.email}
                    onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
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
