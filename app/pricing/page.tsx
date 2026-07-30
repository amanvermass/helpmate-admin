"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialCityPricing, CityPricingItem } from "@/lib/mockData";
import { Tag, Plus, CheckCircle2, DollarSign, TrendingUp, X, MapPin, Zap } from "lucide-react";
import { Portal } from "@/components/Portal";

export default function PricingPage() {
  const [cityPricings, setCityPricings] = useState<CityPricingItem[]>(initialCityPricing);
  const [activeTab, setActiveTab] = useState<"fixed" | "inspection" | "city">("fixed");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [cityName, setCityName] = useState("");
  const [baseFareMultiplier, setBaseFareMultiplier] = useState("1.0");

  const columns: Column<CityPricingItem>[] = [
    { key: "cityName", header: "City Name", sortable: true },
    { key: "state", header: "State", sortable: true },
    {
      key: "baseFareMultiplier",
      header: "Base Fare Multiplier",
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.baseFareMultiplier}x</span>,
      sortable: true,
    },
    {
      key: "nightSurgeMultiplier",
      header: "Night Surge Multiplier",
      accessor: (row) => <span className="font-bold text-amber-600">{row.nightSurgeMultiplier}x</span>,
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "Active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const handleAddPricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName) return;

    const newItem: CityPricingItem = {
      id: `cp-${Date.now()}`,
      cityName,
      state: "Uttar Pradesh",
      baseFareMultiplier: parseFloat(baseFareMultiplier) || 1.0,
      nightSurgeMultiplier: 1.25,
      status: "Active",
    };

    setCityPricings([newItem, ...cityPricings]);
    setCityName("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" /> Pricing Engine & Surge Rules
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Pricing Engine & Surge Control</h1>
          <p className="text-xs text-purple-100 mt-1 max-w-xl">
            Configure fixed service pricing, diagnostic inspection quotes, and city surge multipliers.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-white text-purple-900 font-extrabold text-xs shadow-md hover:bg-purple-50 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-purple-600" />
          <span>Add City Surge Rule</span>
        </button>
      </div>

      {/* 4 Quick Executive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Fixed Rate Services</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">48 Services</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Diagnostic Inspection</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-600">₹99 Base Inspection</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Night Surge Cap</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600">1.25x Peak</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Coverage</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">Varanasi Hub</span>
        </div>
      </div>

      {/* Navigation Tabs (Positioned at bottom of Quick Cards) */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit text-xs font-bold shadow-xs">
        {(["fixed", "inspection", "city"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl capitalize transition-all ${
              activeTab === tab
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab} Pricing Mode
          </button>
        ))}
      </div>

      {/* Main DataTable */}
      <DataTable
        title="City & Zone Pricing Rules"
        description="Active pricing multipliers and surge fare rules"
        columns={columns}
        data={cityPricings}
        addButtonLabel="Add City Pricing Rule"
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* Add Pricing Rule Slide-Over Drawer */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddOpen(false)} />
            <form
              onSubmit={handleAddPricing}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add City Surge Rule</h3>
                  <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">City Name *</label>
                  <input
                    type="text"
                    required
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="e.g. Varanasi Metro"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Base Multiplier *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={baseFareMultiplier}
                    onChange={(e) => setBaseFareMultiplier(e.target.value)}
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
                  Save Pricing Rule
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
