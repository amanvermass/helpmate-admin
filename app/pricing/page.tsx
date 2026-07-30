"use client";

import { useState, useMemo } from "react";
import { DataTable, Column } from "@/components/DataTable";
import {
  initialCityPricing,
  CityPricingItem,
  initialRateCards,
  RateCardItem,
} from "@/lib/mockData";
import {
  Tag,
  Plus,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  X,
  MapPin,
  Zap,
  Search,
  Edit2,
  Trash2,
  Percent,
  Sliders,
  ShieldCheck,
  Calculator,
  Clock,
  Sparkles,
  IndianRupee,
  Check,
  HelpCircle,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Portal } from "@/components/Portal";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<"fixed" | "inspection" | "city">("fixed");
  
  // Data States
  const [rateCards, setRateCards] = useState<RateCardItem[]>(initialRateCards);
  const [cityPricings, setCityPricings] = useState<CityPricingItem[]>(initialCityPricing);
  
  // Inspection Engine State
  const [inspectionRules, setInspectionRules] = useState({
    baseInspectionFee: 99,
    creditOnApproval: true,
    hourlyLaborRate: 249,
    sparePartsMarkupCap: 15,
    autoApproveThreshold: 1500,
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals / Drawers
  const [isAddRateOpen, setIsAddRateOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<RateCardItem | null>(null);
  
  const [isAddCityOpen, setIsAddCityOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CityPricingItem | null>(null);

  // Rate Form State
  const [rateForm, setRateForm] = useState({
    serviceTitle: "",
    category: "AC Servicing",
    basePrice: 599,
    memberPrice: 499,
    convenienceFee: 49,
    gstPercentage: 18,
    commissionPercentage: 25,
    surgeMultiplier: 1.0,
  });

  // City Form State
  const [cityForm, setCityForm] = useState({
    cityName: "Varanasi Metro",
    locality: "",
    state: "Uttar Pradesh",
    baseFareMultiplier: 1.0,
    peakHourSurge: 1.25,
    nightSurgeMultiplier: 1.2,
    weatherSurge: 1.3,
  });

  // Inspection Simulator State
  const [simHours, setSimHours] = useState(1.5);
  const [simParts, setSimParts] = useState(800);

  // Filtered Rate Cards
  const filteredRateCards = useMemo(() => {
    return rateCards.filter((rc) => {
      const matchCategory = selectedCategory === "All" || rc.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        rc.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rc.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [rateCards, selectedCategory, searchQuery]);

  // Filtered City Surge Rules
  const filteredCityPricings = useMemo(() => {
    return cityPricings.filter((cp) => {
      return (
        searchQuery === "" ||
        cp.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cp.locality && cp.locality.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [cityPricings, searchQuery]);

  // Handlers for Rate Cards
  const handleSaveRateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rateForm.serviceTitle) return;

    if (editingRate) {
      setRateCards(
        rateCards.map((rc) =>
          rc.id === editingRate.id ? { ...rc, ...rateForm } : rc
        )
      );
      setEditingRate(null);
    } else {
      const newRc: RateCardItem = {
        id: `rc-${Date.now()}`,
        ...rateForm,
        status: "Active",
      };
      setRateCards([newRc, ...rateCards]);
      setIsAddRateOpen(false);
    }

    setRateForm({
      serviceTitle: "",
      category: "AC Servicing",
      basePrice: 599,
      memberPrice: 499,
      convenienceFee: 49,
      gstPercentage: 18,
      commissionPercentage: 25,
      surgeMultiplier: 1.0,
    });
  };

  const handleToggleRateStatus = (id: string) => {
    setRateCards(
      rateCards.map((rc) =>
        rc.id === id ? { ...rc, status: rc.status === "Active" ? "Inactive" : "Active" } : rc
      )
    );
  };

  const handleDeleteRateCard = (id: string) => {
    if (confirm("Are you sure you want to remove this rate card?")) {
      setRateCards(rateCards.filter((rc) => rc.id !== id));
    }
  };

  // Handlers for City Pricing
  const handleSaveCityPricing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityForm.cityName || !cityForm.locality) return;

    if (editingCity) {
      setCityPricings(
        cityPricings.map((cp) =>
          cp.id === editingCity.id ? { ...cp, ...cityForm } : cp
        )
      );
      setEditingCity(null);
    } else {
      const newCp: CityPricingItem = {
        id: `cp-${Date.now()}`,
        ...cityForm,
        status: "Active",
      };
      setCityPricings([newCp, ...cityPricings]);
      setIsAddCityOpen(false);
    }

    setCityForm({
      cityName: "Varanasi Metro",
      locality: "",
      state: "Uttar Pradesh",
      baseFareMultiplier: 1.0,
      peakHourSurge: 1.25,
      nightSurgeMultiplier: 1.2,
      weatherSurge: 1.3,
    });
  };

  const handleToggleCityStatus = (id: string) => {
    setCityPricings(
      cityPricings.map((cp) =>
        cp.id === id ? { ...cp, status: cp.status === "Active" ? "Inactive" : "Active" } : cp
      )
    );
  };

  // Columns for Rate Cards Table
  const rateCardColumns: Column<RateCardItem>[] = [
    {
      key: "serviceTitle",
      header: "Service Package Title",
      accessor: (row) => (
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white block text-xs">{row.serviceTitle}</span>
          <span className="text-[10px] text-slate-400 font-semibold">{row.category}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "basePrice",
      header: "Base Price (₹)",
      accessor: (row) => <span className="font-black text-slate-900 dark:text-white">₹{row.basePrice}</span>,
      sortable: true,
    },
    {
      key: "memberPrice",
      header: "Member Rate",
      accessor: (row) => <span className="font-bold text-purple-600 dark:text-purple-400">₹{row.memberPrice}</span>,
      sortable: true,
    },
    {
      key: "convenienceFee",
      header: "Tech Fee",
      accessor: (row) => <span className="font-semibold text-slate-600 dark:text-slate-400">₹{row.convenienceFee}</span>,
    },
    {
      key: "gstPercentage",
      header: "GST Tax",
      accessor: (row) => <span className="font-semibold text-slate-600 dark:text-slate-400">{row.gstPercentage}%</span>,
    },
    {
      key: "commissionPercentage",
      header: "Commission",
      accessor: (row) => <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{row.commissionPercentage}%</span>,
    },
    {
      key: "surgeMultiplier",
      header: "Surge Multiplier",
      accessor: (row) => (
        <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${row.surgeMultiplier > 1 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
          {row.surgeMultiplier}x
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <button
          type="button"
          onClick={() => handleToggleRateStatus(row.id)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all ${
            row.status === "Active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {row.status}
        </button>
      ),
    },
    {
      key: "id",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => {
              setEditingRate(row);
              setRateForm({
                serviceTitle: row.serviceTitle,
                category: row.category,
                basePrice: row.basePrice,
                memberPrice: row.memberPrice,
                convenienceFee: row.convenienceFee,
                gstPercentage: row.gstPercentage,
                commissionPercentage: row.commissionPercentage,
                surgeMultiplier: row.surgeMultiplier,
              });
            }}
            title="Edit Rate Card"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 dark:bg-slate-800 text-slate-600 hover:text-brand-600 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteRateCard(row.id)}
            title="Delete Rate Card"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 dark:bg-slate-800 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Columns for City Surge Table
  const cityColumns: Column<CityPricingItem>[] = [
    {
      key: "cityName",
      header: "City & Locality Zone",
      accessor: (row) => (
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white block text-xs">{row.cityName}</span>
          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {row.locality || "All Zones"}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "baseFareMultiplier",
      header: "Base Fare Multiplier",
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.baseFareMultiplier}x</span>,
      sortable: true,
    },
    {
      key: "peakHourSurge",
      header: "Peak Hours Surge (6-10 PM)",
      accessor: (row) => <span className="font-bold text-amber-600 dark:text-amber-400">{row.peakHourSurge}x</span>,
    },
    {
      key: "nightSurgeMultiplier",
      header: "Night Surge (10 PM-6 AM)",
      accessor: (row) => <span className="font-bold text-purple-600 dark:text-purple-400">{row.nightSurgeMultiplier}x</span>,
    },
    {
      key: "weatherSurge",
      header: "Weather / Rain Surge",
      accessor: (row) => <span className="font-bold text-blue-600 dark:text-blue-400">{row.weatherSurge}x</span>,
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <button
          type="button"
          onClick={() => handleToggleCityStatus(row.id)}
          className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all ${
            row.status === "Active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {row.status}
        </button>
      ),
    },
    {
      key: "id",
      header: "Actions",
      accessor: (row) => (
        <button
          type="button"
          onClick={() => {
            setEditingCity(row);
            setCityForm({
              cityName: row.cityName,
              locality: row.locality || "",
              state: row.state,
              baseFareMultiplier: row.baseFareMultiplier,
              peakHourSurge: row.peakHourSurge,
              nightSurgeMultiplier: row.nightSurgeMultiplier,
              weatherSurge: row.weatherSurge,
            });
          }}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 dark:bg-slate-800 text-slate-600 hover:text-brand-600 transition-colors cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  // Calculated Diagnostic Quote in Simulator
  const simLabor = Math.round(simHours * inspectionRules.hourlyLaborRate);
  const simMarkupParts = Math.round(simParts * (1 + inspectionRules.sparePartsMarkupCap / 100));
  const simSubtotal = simLabor + simMarkupParts;
  const simGst = Math.round(simSubtotal * 0.18);
  const simFinalTotal = simSubtotal + simGst;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">

      {/* ─── 1. TOP EXECUTIVE HEADER BANNER ─── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 dark:from-slate-900 dark:via-brand-950 dark:to-purple-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Dynamic Rate Engine
            </span>
            <span className="text-xs text-white/80 font-bold">• 18% GST Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pricing Engine & Dynamic Surge Matrix
          </h1>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium">
            Configure service rate cards, diagnostic inspection quoting rules, and locality peak hour surge multipliers.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingRate(null);
              setIsAddRateOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-brand-700 font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Add Rate Card</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingCity(null);
              setIsAddCityOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Add City Surge Rule</span>
          </button>
        </div>
      </div>

      {/* ─── 2. EXECUTIVE SUMMARY METRICS RIBBON ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Fixed Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center border border-brand-200 dark:border-brand-800">
              <Tag className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{rateCards.length} Active Services</p>
          <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold">Base rates from ₹349 – ₹2,999</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Diagnostic Inspection</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Zap className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">₹{inspectionRules.baseInspectionFee} Base</p>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 font-bold">Credited back on job approval</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Peak Hour Surge</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center border border-purple-200 dark:border-purple-800">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">1.35x Peak Cap</p>
          <p className="text-[11px] text-purple-700 dark:text-purple-300 font-bold">Active in Sigra & Godowlia</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Revenue Commission</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Percent className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">25% Platform Share</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">75% Partner Payout Share</p>
        </div>
      </div>

      {/* ─── 3. INTERACTIVE NAVIGATION TABS ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit text-xs font-bold shadow-xs">
          {(["fixed", "inspection", "city"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs font-black"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab === "fixed" && "Fixed Rate Cards"}
              {tab === "inspection" && "Inspection Engine Rules"}
              {tab === "city" && "City Surge Matrix"}
            </button>
          ))}
        </div>

        {/* Search bar for Rate Cards & Surge */}
        {activeTab !== "inspection" && (
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === "fixed" ? "Search service package..." : "Search city or zone..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        )}
      </div>

      {/* ─── TAB 1: FIXED RATE CARDS ─── */}
      {activeTab === "fixed" && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "AC Servicing", "Deep Cleaning", "Electrician", "Plumbing", "Home Salon", "Car Wash"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand-500 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <DataTable columns={rateCardColumns} data={filteredRateCards} />
        </div>
      )}

      {/* ─── TAB 2: INSPECTION & DIAGNOSTIC QUOTING ENGINE ─── */}
      {activeTab === "inspection" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Rule Configuration Cards (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Diagnostic Inspection Engine Rules</h3>
                <p className="text-xs text-slate-500">Configure base fees, labor rates, and auto-approval thresholds</p>
              </div>
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                Inspection Mode
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-4">
                <div>
                  <label className="font-extrabold text-slate-900 dark:text-white block">Base Diagnostic Fee (₹)</label>
                  <span className="text-[11px] text-slate-500 block">Charged upfront when technician visits customer</span>
                </div>
                <input
                  type="number"
                  value={inspectionRules.baseInspectionFee}
                  onChange={(e) => setInspectionRules({ ...inspectionRules, baseInspectionFee: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white text-right outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-4">
                <div>
                  <label className="font-extrabold text-slate-900 dark:text-white block">Credit Fee On Approval</label>
                  <span className="text-[11px] text-slate-500 block">Waive inspection fee if customer approves full service quote</span>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectionRules({ ...inspectionRules, creditOnApproval: !inspectionRules.creditOnApproval })}
                  className={`px-3 py-1 rounded-full font-black text-xs transition-all cursor-pointer ${
                    inspectionRules.creditOnApproval
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {inspectionRules.creditOnApproval ? "Enabled" : "Disabled"}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-4">
                <div>
                  <label className="font-extrabold text-slate-900 dark:text-white block">Hourly Labor Rate (₹ / hr)</label>
                  <span className="text-[11px] text-slate-500 block">Base labor charge per hour of technician work</span>
                </div>
                <input
                  type="number"
                  value={inspectionRules.hourlyLaborRate}
                  onChange={(e) => setInspectionRules({ ...inspectionRules, hourlyLaborRate: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white text-right outline-none"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-4">
                <div>
                  <label className="font-extrabold text-slate-900 dark:text-white block">Spare Parts Markup Cap (%)</label>
                  <span className="text-[11px] text-slate-500 block">Maximum margin on replaced components</span>
                </div>
                <input
                  type="number"
                  value={inspectionRules.sparePartsMarkupCap}
                  onChange={(e) => setInspectionRules({ ...inspectionRules, sparePartsMarkupCap: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-white text-right outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Quote Simulator (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-brand-600" />
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Live Quote Simulator</h3>
              </div>
              <span className="text-[10px] font-bold bg-brand-50 dark:bg-brand-950 text-brand-600 px-2 py-0.5 rounded-full">
                Interactive Test
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Estimated Diagnostic Work (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={simHours}
                  onChange={(e) => setSimHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Spare Parts Cost (₹)</label>
                <input
                  type="number"
                  value={simParts}
                  onChange={(e) => setSimParts(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Labor ({simHours} hrs @ ₹{inspectionRules.hourlyLaborRate})</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{simLabor}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Spare Parts + {inspectionRules.sparePartsMarkupCap}% Margin</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{simMarkupParts}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>CGST (9%) + SGST (9%)</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{simGst}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
                <span>Simulated Customer Quote</span>
                <span className="text-brand-600 dark:text-brand-400 text-base">₹{simFinalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: CITY & LOCALITY SURGE MATRIX ─── */}
      {activeTab === "city" && (
        <div className="space-y-4">
          <DataTable columns={cityColumns} data={filteredCityPricings} />
        </div>
      )}

      {/* ─── SLIDE-OVER DRAWER: ADD / EDIT RATE CARD ─── */}
      {(isAddRateOpen || editingRate) && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => { setIsAddRateOpen(false); setEditingRate(null); }} />
            <form
              onSubmit={handleSaveRateCard}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none overflow-y-auto"
            >
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      {editingRate ? "Edit Service Rate Card" : "Add New Rate Card"}
                    </h3>
                    <p className="text-[11px] text-slate-400">Configure base price, tax, and partner commission split</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsAddRateOpen(false); setEditingRate(null); }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Package Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Split AC Foam Jet Servicing"
                    value={rateForm.serviceTitle}
                    onChange={(e) => setRateForm({ ...rateForm, serviceTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                    <select
                      value={rateForm.category}
                      onChange={(e) => setRateForm({ ...rateForm, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                    >
                      <option value="AC Servicing">AC Servicing</option>
                      <option value="Deep Cleaning">Deep Cleaning</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Home Salon">Home Salon</option>
                      <option value="Car Wash">Car Wash</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Base Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={rateForm.basePrice}
                      onChange={(e) => setRateForm({ ...rateForm, basePrice: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Member Price (₹)</label>
                    <input
                      type="number"
                      value={rateForm.memberPrice}
                      onChange={(e) => setRateForm({ ...rateForm, memberPrice: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tech Convenience Fee (₹)</label>
                    <input
                      type="number"
                      value={rateForm.convenienceFee}
                      onChange={(e) => setRateForm({ ...rateForm, convenienceFee: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Commission Share (%)</label>
                    <input
                      type="number"
                      value={rateForm.commissionPercentage}
                      onChange={(e) => setRateForm({ ...rateForm, commissionPercentage: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Surge Multiplier</label>
                    <input
                      type="number"
                      step="0.05"
                      value={rateForm.surgeMultiplier}
                      onChange={(e) => setRateForm({ ...rateForm, surgeMultiplier: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none"
                    />
                  </div>
                </div>

                {/* Real-Time Billing Preview Box */}
                <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 space-y-1">
                  <span className="text-[10px] font-black uppercase text-brand-600 block">Live Price Calculator</span>
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>Taxable Base: ₹{rateForm.basePrice + rateForm.convenienceFee}</span>
                    <span>GST (18%): ₹{Math.round((rateForm.basePrice + rateForm.convenienceFee) * 0.18)}</span>
                  </div>
                  <div className="flex justify-between font-black text-brand-600 dark:text-brand-400 text-sm pt-1 border-t border-brand-200 dark:border-brand-800">
                    <span>Final Billing: ₹{Math.round((rateForm.basePrice + rateForm.convenienceFee) * 1.18)}</span>
                    <span>Partner Share: ₹{Math.round(rateForm.basePrice * (1 - rateForm.commissionPercentage / 100))}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddRateOpen(false); setEditingRate(null); }}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs shadow-lux"
                >
                  {editingRate ? "Update Rate Card" : "Save Rate Card"}
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* ─── SLIDE-OVER DRAWER: ADD / EDIT CITY SURGE ─── */}
      {(isAddCityOpen || editingCity) && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/70 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => { setIsAddCityOpen(false); setEditingCity(null); }} />
            <form
              onSubmit={handleSaveCityPricing}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      {editingCity ? "Edit Locality Surge Rule" : "Add Locality Surge Rule"}
                    </h3>
                    <p className="text-[11px] text-slate-400">Configure multipliers for peak hours, night & rain</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsAddCityOpen(false); setEditingCity(null); }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City Hub Name *</label>
                  <input
                    type="text"
                    required
                    value={cityForm.cityName}
                    onChange={(e) => setCityForm({ ...cityForm, cityName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Locality Zone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sigra Commercial Zone"
                    value={cityForm.locality}
                    onChange={(e) => setCityForm({ ...cityForm, locality: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Base Multiplier</label>
                    <input
                      type="number"
                      step="0.05"
                      value={cityForm.baseFareMultiplier}
                      onChange={(e) => setCityForm({ ...cityForm, baseFareMultiplier: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Peak Hour (6-10 PM)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={cityForm.peakHourSurge}
                      onChange={(e) => setCityForm({ ...cityForm, peakHourSurge: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Night Surge (10PM-6AM)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={cityForm.nightSurgeMultiplier}
                      onChange={(e) => setCityForm({ ...cityForm, nightSurgeMultiplier: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Weather / Rain Surge</label>
                    <input
                      type="number"
                      step="0.05"
                      value={cityForm.weatherSurge}
                      onChange={(e) => setCityForm({ ...cityForm, weatherSurge: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddCityOpen(false); setEditingCity(null); }}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs shadow-lux"
                >
                  {editingCity ? "Update Surge Rule" : "Save Surge Rule"}
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

    </div>
  );
}
