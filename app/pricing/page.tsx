"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialCityPricing, CityPricingItem } from "@/lib/mockData";
import { Tag, Plus, CheckCircle2, DollarSign, TrendingUp, X } from "lucide-react";
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
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Pricing Engine & Surge Control</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure fixed service pricing, diagnostic inspection quotes, and city surge multipliers</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(["fixed", "inspection", "city"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab} Pricing
            </button>
          ))}
        </div>
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
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add City Pricing Rule</h3>
                  <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City Name *</label>
                    <input
                      type="text"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      placeholder="e.g. Varanasi Metro"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Base Multiplier</label>
                    <input
                      type="number"
                      step="0.05"
                      value={baseFareMultiplier}
                      onChange={(e) => setBaseFareMultiplier(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl font-bold text-xs shadow-lux">Save Pricing Rule</button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
