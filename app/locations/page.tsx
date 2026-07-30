"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { varanasiLocalities, VaranasiLocality } from "@/lib/mockData";
import { Building2, Plus, CheckCircle2, MapPin, Users, Activity, X } from "lucide-react";
import { Portal } from "@/components/Portal";

export default function LocationsPage() {
  const [localities, setLocalities] = useState<VaranasiLocality[]>(varanasiLocalities);
  const [activeTab, setActiveTab] = useState<"pincodes" | "areas" | "zones" | "cities">("pincodes");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [name, setName] = useState("");
  const [pincode, setPincode] = useState("");

  const columns: Column<VaranasiLocality>[] = [
    { key: "name", header: "Locality / Zone Name", sortable: true },
    { key: "pincode", header: "Pincode", sortable: true },
    {
      key: "status",
      header: "Demand Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "High Demand"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "activeTechs",
      header: "Assigned Technicians",
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.activeTechs} Active</span>,
      sortable: true,
    },
    {
      key: "isServiceable",
      header: "Serviceability",
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            row.isServiceable
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          {row.isServiceable ? "Serviceable" : "Unserviceable"}
        </span>
      ),
    },
  ];

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pincode) return;

    const newItem: VaranasiLocality = {
      id: `loc-${Date.now()}`,
      name,
      pincode,
      status: "Normal",
      activeBookings: 0,
      activeTechs: 0,
      isServiceable: true,
    };

    setLocalities([newItem, ...localities]);
    setName("");
    setPincode("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" /> Single-City Serviceability Engine
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Varanasi Location & Pincode Coverage</h1>
          <p className="text-xs text-brand-100 mt-1 max-w-xl">
            Manage active serviceable pincodes, demand surges, and technician allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-brand-900 font-extrabold text-xs shadow-md hover:bg-brand-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Add New Pincode Zone</span>
          </button>
        </div>
      </div>

      {/* 4 Executive Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Serviceable Zones</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{localities.length} Pincodes</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">High Demand Hubs</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600">
            {localities.filter((l) => l.status === "High Demand").length} Active Hubs
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Deployed Techs</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600">
            {localities.reduce((sum, l) => sum + (l.activeTechs || 0), 0)} Engineers
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">City Jurisdiction</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">Varanasi Metro</span>
        </div>
      </div>

      

      {/* Main DataTable without duplicate headers */}
      <DataTable
        columns={columns}
        data={localities}
      />

      {/* Add Pincode Zone Slide-Over Drawer */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddOpen(false)} />
            <form
              onSubmit={handleAddLocation}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Pincode Zone</h3>
                  <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Locality / Zone Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lanka Bhabha Road"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="221005"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lux"
                >
                  Save Locality
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
