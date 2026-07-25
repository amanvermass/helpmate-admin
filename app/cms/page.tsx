"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialServices, initialAddons, varanasiLocalities, ServiceItem, ServiceAddon, VaranasiLocality } from "@/lib/mockData";
import { Wrench, Plus, CheckCircle2, MapPin, Tag } from "lucide-react";

export default function CmsPage() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [addons, setAddons] = useState<ServiceAddon[]>(initialAddons);
  const [localities, setLocalities] = useState<VaranasiLocality[]>(varanasiLocalities);
  const [activeTab, setActiveTab] = useState<"services" | "addons" | "pincodes">("services");

  const serviceColumns: Column<ServiceItem>[] = [
    {
      key: "title",
      header: "Service Package Title",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900">{row.title}</span>
          <span className="text-[10px] text-slate-400 max-w-xs truncate">{row.subtitle}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      accessor: (row) => (
        <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded text-[10px] border border-brand-200">
          {row.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price (₹)",
      accessor: (row) => (
        <div className="flex items-baseline gap-1.5 font-bold">
          <span className="text-sm text-slate-900">₹{row.price}</span>
          <span className="text-xs text-slate-400 line-through">₹{row.originalPrice}</span>
        </div>
      ),
    },
    {
      key: "isInspectionBased",
      header: "Pricing Mode",
      accessor: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            row.isInspectionBased
              ? "bg-amber-100 text-amber-800 border border-amber-300"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {row.isInspectionBased ? "Inspection Quote" : "Fixed Pricing"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
          <CheckCircle2 className="w-3 h-3" /> {row.status}
        </span>
      ),
    },
  ];

  const addonColumns: Column<ServiceAddon>[] = [
    {
      key: "title",
      header: "Add-on Title",
      accessor: (row) => <span className="font-extrabold text-slate-900">{row.title}</span>,
    },
    {
      key: "price",
      header: "Unit Price (₹)",
      accessor: (row) => (
        <span className="font-bold text-slate-900">
          ₹{row.price} / {row.unit}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      accessor: (row) => (
        <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded text-[10px] border border-brand-200">
          {row.category}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
          <CheckCircle2 className="w-3 h-3" /> {row.status}
        </span>
      ),
    },
  ];

  const pincodeColumns: Column<VaranasiLocality>[] = [
    {
      key: "name",
      header: "Varanasi Zone / Locality",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-600" />
          <span className="font-bold text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      key: "pincode",
      header: "Pincode",
      accessor: (row) => (
        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
          {row.pincode}
        </span>
      ),
    },
    {
      key: "activeBookings",
      header: "Active Dispatch Load",
      accessor: (row) => (
        <span className="font-bold text-slate-800 text-xs">
          {row.activeBookings} Live Bookings
        </span>
      ),
    },
    {
      key: "status",
      header: "Serviceability Status",
      accessor: () => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
          <CheckCircle2 className="w-3 h-3" /> Serviceable
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 to-brand-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" /> Single-City Operations Engine
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Varanasi Location & Service Management</h1>
          <p className="text-xs text-brand-100 mt-1 max-w-xl">
            Configure Varanasi pincodes, service categories, fixed rate cards, diagnostic inspection quotes, and spare part add-ons.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-center min-w-[100px]">
            <span className="text-xs text-brand-200 block font-semibold">City Hub</span>
            <span className="text-lg font-black text-white">Varanasi</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 text-center min-w-[100px]">
            <span className="text-xs text-brand-200 block font-semibold">Active Zones</span>
            <span className="text-lg font-black text-white">{localities.length} Zones</span>
          </div>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-fit text-xs font-bold">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "services"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Services & Inspection Pricing CMS
          </button>
          <button
            onClick={() => setActiveTab("addons")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "addons"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Add-on Parts Management
          </button>
          <button
            onClick={() => setActiveTab("pincodes")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "pincodes"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Varanasi Pincode Serviceability
          </button>
        </div>
      </div>

      {activeTab === "services" ? (
        <DataTable
          title="Service Catalog & Pricing Mode CMS"
          description="Manage fixed pricing and inspection-based service options across HVAC, Electrical & Plumbing."
          columns={serviceColumns}
          data={services}
          searchPlaceholder="Search service title or category..."
          addButtonLabel="Add New Service"
          onAddClick={() => alert("Add Service dialog triggered")}
        />
      ) : activeTab === "addons" ? (
        <DataTable
          title="Add-on Spare Parts & Extra Services"
          description="Configure extra copper piping, coil sprays, and replacement brackets."
          columns={addonColumns}
          data={addons}
          searchPlaceholder="Search add-on title..."
          addButtonLabel="Add New Add-on"
          onAddClick={() => alert("Add Addon dialog triggered")}
        />
      ) : (
        <DataTable
          title="Varanasi Pincode Serviceability Engine"
          description="Single-city service coverage management by Varanasi pincodes and active dispatch loads."
          columns={pincodeColumns}
          data={localities}
          searchPlaceholder="Search locality or pincode..."
          addButtonLabel="Add Serviceable Pincode"
          onAddClick={() => alert("Add Pincode dialog triggered")}
        />
      )}
    </div>
  );
}
