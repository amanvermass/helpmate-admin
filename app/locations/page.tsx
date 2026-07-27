"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { varanasiLocalities, VaranasiLocality } from "@/lib/mockData";
import { MapPin, Plus, CheckCircle2, AlertCircle, Building2 } from "lucide-react";

export default function LocationsPage() {
  const [localities, setLocalities] = useState<VaranasiLocality[]>(varanasiLocalities);
  const [activeTab, setActiveTab] = useState<"cities" | "areas" | "zones" | "pincodes">("pincodes");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [name, setName] = useState("");
  const [pincode, setPincode] = useState("");

  const columns: Column<VaranasiLocality>[] = [
    { key: "pincode", header: "Pincode", sortable: true },
    { key: "name", header: "Locality / Area", sortable: true },
    {
      key: "status",
      header: "Demand Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "High Demand"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
              : row.status === "Peak"
              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { key: "activeBookings", header: "Active Jobs", sortable: true },
    { key: "activeTechs", header: "Assigned Techs", sortable: true },
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
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Location & Coverage Management</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Single-city Varanasi pincode matrix & zone coverage</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(["pincodes", "areas", "zones", "cities"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Varanasi Pincode & Locality Grid"
        description="Manage active serviceable pincodes, demand surges, and technician allocation"
        columns={columns}
        data={localities}
        addButtonLabel="Add New Pincode Zone"
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleAddLocation} className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add Varanasi Pincode Zone</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Locality Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lanka / Assi Ghat"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="e.g. 221005"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-brand-500 text-white rounded-xl font-bold text-xs">Save Pincode Zone</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
