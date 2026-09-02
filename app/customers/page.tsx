"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  X,
  Eye,
  Edit,
  Edit2,
  Trash2,
  Plus,
  UserPlus,
  Building,
  CreditCard,
  UserCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  Sparkles,
  ShieldCheck,
  Home,
  Briefcase,
  TrendingUp,
  Activity,
  User,
} from "lucide-react";
import { initialCustomers, Customer, varanasiLocalities } from "@/lib/mockData";
import { CustomSelect } from "@/components/CustomSelect";
import { DataTable, Column } from "@/components/DataTable";
import { RowActionMenu } from "@/components/RowActionMenu";
import { Portal } from "@/components/Portal";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [localityFilter, setLocalityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Slide-Over Drawer State (Used for BOTH Add & Edit)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Delete Confirmation Modal State
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);

  // Unified Form States for Add & Edit
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAlternatePhone, setFormAlternatePhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCustomerType, setFormCustomerType] = useState<"Individual Household" | "Commercial Business / B2B">("Individual Household");
  const [formCompanyName, setFormCompanyName] = useState("");
  const [formHouseholdType, setFormHouseholdType] = useState<"Family Home" | "Apartment / Flat" | "Villa / Bungalow" | "Commercial Office / Shop">("Apartment / Flat");
  const [formLocality, setFormLocality] = useState("Sigra");
  const [formPincode, setFormPincode] = useState("221002");
  const [formAddress, setFormAddress] = useState("");

  // Open Drawer for Creating a New Customer
  const handleOpenAddDrawer = () => {
    setEditingCustomer(null);
    setFormName("");
    setFormPhone("");
    setFormAlternatePhone("");
    setFormEmail("");
    setFormCustomerType("Individual Household");
    setFormCompanyName("");
    setFormHouseholdType("Apartment / Flat");
    setFormLocality("Sigra");
    setFormPincode("221002");
    setFormAddress("");
    setIsDrawerOpen(true);
  };

  // Open Drawer for Editing an Existing Customer (Slide-Over Drawer)
  const handleOpenEditDrawer = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormName(cust.name);
    setFormPhone(cust.phone);
    setFormAlternatePhone(cust.alternatePhone || "");
    setFormEmail(cust.email);
    setFormCustomerType(cust.customerType || "Individual Household");
    setFormCompanyName(cust.companyName || "");
    setFormHouseholdType(cust.householdType || "Apartment / Flat");
    setFormLocality(cust.locality);
    setFormPincode(cust.pincode || "221002");
    setFormAddress(cust.address);
    setIsDrawerOpen(true);
  };

  // Submit Handler for Add & Edit Drawer Form
  const handleSaveCustomerForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    if (editingCustomer) {
      // Update existing customer record
      const updatedCustomers = customers.map((c) =>
        c.id === editingCustomer.id
          ? {
              ...c,
              name: formName,
              phone: formPhone,
              alternatePhone: formAlternatePhone,
              email: formEmail,
              customerType: formCustomerType,
              companyName: formCustomerType === "Commercial Business / B2B" ? formCompanyName : undefined,
              householdType: formHouseholdType,
              locality: formLocality,
              pincode: formPincode,
              address: formAddress,
            }
          : c
      );
      setCustomers(updatedCustomers);
    } else {
      // Create new customer record
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: formName,
        phone: formPhone,
        alternatePhone: formAlternatePhone,
        email: formEmail || `${formName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        locality: formLocality,
        pincode: formPincode,
        address: formAddress || `${formLocality}, Varanasi`,
        tier: "Standard",
        totalSpend: 0,
        totalBookings: 0,
        lastBookingDate: "Just Now",
        joinedDate: "Today",
        customerType: formCustomerType,
        companyName: formCustomerType === "Commercial Business / B2B" ? formCompanyName : undefined,
        householdType: formHouseholdType,
      };
      setCustomers([newCustomer, ...customers]);
    }

    setIsDrawerOpen(false);
  };

  // Delete Customer Handler
  const handleDeleteCustomer = () => {
    if (!deleteCustomer) return;
    setCustomers(customers.filter((c) => c.id !== deleteCustomer.id));
    setDeleteCustomer(null);
  };

  // Filter Customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocality = localityFilter === "all" || c.locality.toLowerCase() === localityFilter.toLowerCase();
    const matchesType = typeFilter === "all" || c.customerType === typeFilter;

    return matchesSearch && matchesLocality && matchesType;
  });

  // Table Columns (No Tier & Membership column)
  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer & ID",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 font-extrabold text-xs flex items-center justify-center border border-brand-200 dark:border-brand-800 shrink-0 shadow-xs">
            {row.name.charAt(0)}
          </div>
          <Link href={`/customers/${row.id}`} className="flex flex-col hover:underline">
            <span className="font-extrabold text-slate-900 dark:text-white text-xs">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">ID: {row.id}</span>
          </Link>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact & Locality",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-brand-600 dark:text-brand-400 text-xs flex items-center gap-1">
            <Phone className="w-3 h-3 text-emerald-500" />
            <span>{row.phone}</span>
          </span>
          <span className="text-[10px] text-slate-500 flex items-center gap-0.5 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400" /> {row.locality} ({row.pincode || "221002"})
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Account Classification",
      accessor: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-extrabold text-slate-900 dark:text-white">
            {row.customerType || "Individual Household"}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {row.householdType || "Apartment / Flat"}
          </span>
        </div>
      ),
    },
    {
      key: "membershipPlanName",
      header: "Member Type",
      accessor: (row) => {
        const plan =
          row.membershipPlanName ||
          (row.tier === "Crown Elite"
            ? "Crown Elite VIP"
            : row.tier === "VIP"
            ? "HelpMate Gold Club"
            : "Non-Member / Free");
        const isCrown = plan.includes("Crown");
        const isGold = plan.includes("Gold");
        const isSilver = plan.includes("Silver");

        const badgeStyle = isCrown
          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300"
          : isGold
          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300"
          : isSilver
          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300"
          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-300";

        return (
          <div className="flex flex-col gap-1">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-black border flex items-center gap-1 w-fit shadow-2xs ${badgeStyle}`}
            >
              {isCrown ? "👑" : isGold ? "🔥" : isSilver ? "⚡" : "👤"}
              <span>{plan}</span>
            </span>
            {row.membershipExpiryDate && (
              <span className="text-[9px] font-extrabold text-slate-400 font-mono">
                Exp: {row.membershipExpiryDate}
              </span>
            )}
          </div>
        );
      },
      sortable: true,
    },
    {
      key: "totalSpend",
      header: "Lifetime Value & Jobs",
      accessor: (row) => (
        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 text-xs font-mono">
          ₹{row.totalSpend ? row.totalSpend.toLocaleString("en-IN") : "0"} ({row.totalBookings || 0} jobs)
        </span>
      ),
    },
    {
      key: "id",
      header: "Actions",
      sticky: "right",
      accessor: (row) => (
        <RowActionMenu
          actions={[
            {
              label: "View",
              icon: Eye,
              href: `/customers/${row.id}`,
            },
            {
              label: "Edit",
              icon: Edit,
              onClick: () => handleOpenEditDrawer(row),
            },
            {
              label: "Delete",
              icon: Trash2,
              onClick: () => setDeleteCustomer(row),
              danger: true,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Simple Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            <span>Customer Directory & Accounts</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage registered clients, service delivery addresses, tax invoice ledgers & lifetime value.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddDrawer}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* 4 EXECUTIVE QUICK CARDS MATCHING PARTNER DIRECTORY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Registered Clients */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Registered Clients
            </span>
            <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200 dark:border-brand-800 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {customers.length} Customers
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600 inline" /> Active Varanasi Directory
          </p>
        </div>

        {/* Card 2: Commercial B2B Accounts */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Commercial B2B Accounts
            </span>
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 border border-purple-200 dark:border-purple-800 shadow-sm">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {customers.filter((c) => c.customerType === "Commercial Business / B2B").length} Businesses
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-500 inline" /> Enterprise Clients
          </p>
        </div>

        {/* Card 3: Total Customer LTV */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Customer LTV
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{customers.reduce((acc, c) => acc + (c.totalSpend || 0), 0).toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" /> Cumulative Client Spend
          </p>
        </div>

        {/* Card 4: Localities Covered */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Localities Covered
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800 shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {new Set(customers.map((c) => c.locality)).size} Localities
            </span>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            Varanasi Wide Network
          </p>
        </div>
      </div>

      {/* DATA TABLE (PASSING STRICTLY 1 ADD BUTTON VIA BANNER) */}
      <DataTable
        columns={columns as Column<any>[]}
        data={filteredCustomers}
        searchPlaceholder="Search customer name, locality, or phone..."
      />

      {/* ─── SLIDE-OVER CUSTOMER FORM DRAWER (UNIFIED FOR ADD & EDIT) ─── */}
      {isDrawerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
              {/* Clean Standardized Drawer Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                    {editingCustomer ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                      {editingCustomer ? "Edit Customer" : "Add Customer"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {editingCustomer ? `Update account specs for ID #${editingCustomer.id}` : "Add new client account & delivery address to Varanasi directory"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <form onSubmit={handleSaveCustomerForm} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* SECTION 1: PERSONAL & CONTACT IDENTITY */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <User className="w-4 h-4 text-brand-600" />
                    <span>1. Customer Personal & Contact Identity</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar Agrawal"
                      className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Primary Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+91 98390 12345"
                        className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Alternate Phone
                      </label>
                      <input
                        type="tel"
                        value={formAlternatePhone}
                        onChange={(e) => setFormAlternatePhone(e.target.value)}
                        placeholder="+91 94501 99000"
                        className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-brand-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="rajesh.agrawal@gmail.com"
                      className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* SECTION 2: ACCOUNT & PROPERTY TYPE */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span>2. Account Classification & Property Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CustomSelect
                      label="Customer Category *"
                      value={formCustomerType}
                      onChange={(val) => setFormCustomerType(val as any)}
                      options={[
                        { value: "Individual Household", label: "Individual Household" },
                        { value: "Commercial Business / B2B", label: "Commercial Business / B2B" },
                      ]}
                      placeholder="Select Category..."
                    />

                    <CustomSelect
                      label="Property Household Type *"
                      value={formHouseholdType}
                      onChange={(val) => setFormHouseholdType(val as any)}
                      options={[
                        { value: "Apartment / Flat", label: "Apartment / Flat" },
                        { value: "Family Home", label: "Family Home" },
                        { value: "Villa / Bungalow", label: "Villa / Bungalow" },
                        { value: "Commercial Office / Shop", label: "Commercial Office / Shop" },
                      ]}
                      placeholder="Select Property..."
                    />
                  </div>

                  {formCustomerType === "Commercial Business / B2B" && (
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Registered Company / Store Title *
                      </label>
                      <input
                        type="text"
                        value={formCompanyName}
                        onChange={(e) => setFormCompanyName(e.target.value)}
                        placeholder="e.g. Agrawal Electricals Retail HQ"
                        className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500 transition-all"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* SECTION 3: DELIVERY ADDRESS & LOCALITY */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>3. Varanasi Locality & Street Address</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CustomSelect
                      label="Varanasi Service Zone *"
                      value={formLocality}
                      onChange={(val) => {
                        const foundLoc = varanasiLocalities.find((l) => l.name === val);
                        setFormLocality(val);
                        if (foundLoc) setFormPincode(foundLoc.pincode);
                      }}
                      options={varanasiLocalities.map((loc) => ({
                        value: loc.name,
                        label: `${loc.name} (${loc.pincode})`,
                      }))}
                      placeholder="Select Locality..."
                    />

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={formPincode}
                        onChange={(e) => setFormPincode(e.target.value)}
                        className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold outline-none text-xs focus:border-brand-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Complete House / Street Delivery Address *
                    </label>
                    <textarea
                      rows={3}
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="House No., Building Name, Street Road, Landmark, Varanasi"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-xs"
                      required
                    />
                  </div>
                </div>

                {/* STICKY BOTTOM ACTION BAR */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 sticky bottom-0 bg-white dark:bg-slate-900 py-3">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingCustomer ? "Edit Customer" : "Add Customer"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* ─── MODAL DELETE CONFIRMATION ─── */}
      {deleteCustomer && (
        <Portal>
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-lg">Delete Customer Account?</h3>
              <p className="text-xs text-slate-500 font-semibold">
                Are you sure you want to delete <strong>{deleteCustomer.name}</strong> ({deleteCustomer.phone})? This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteCustomer(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCustomer}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-xs shadow-lux cursor-pointer transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
