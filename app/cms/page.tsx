"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { Portal } from "@/components/Portal";
import { initialServices, initialAddons, varanasiLocalities, ServiceItem, ServiceAddon, VaranasiLocality } from "@/lib/mockData";
import { Wrench, Plus, CheckCircle2, MapPin, Tag, X } from "lucide-react";

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
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => alert(`Viewing details for ${row.title}`)}
            title="View Service Details"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all"
          >
            <Wrench className="w-4 h-4" />
          </button>
        </div>
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

  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddAddonOpen, setIsAddAddonOpen] = useState(false);
  const [isAddPincodeOpen, setIsAddPincodeOpen] = useState(false);

  // Add Service Form State
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceCategory, setServiceCategory] = useState("AC Service & Repair");
  const [serviceSubtitle, setServiceSubtitle] = useState("");
  const [price, setPrice] = useState("699");
  const [originalPrice, setOriginalPrice] = useState("999");
  const [duration, setDuration] = useState("45 mins");
  const [isInspectionBased, setIsInspectionBased] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [selectedSystemTypes, setSelectedSystemTypes] = useState<string[]>(["Split AC", "Window AC"]);

  // Add Addon Form State
  const [addonTitle, setAddonTitle] = useState("");
  const [addonPrice, setAddonPrice] = useState("199");
  const [addonUnit, setAddonUnit] = useState("Can");
  const [addonCategory, setAddonCategory] = useState("AC Service");

  // Add Pincode Form State
  const [pincodeLocality, setPincodeLocality] = useState("");
  const [pincodeCode, setPincodeCode] = useState("221005");

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle) return;

    const newSvc: ServiceItem = {
      id: `srv-${Date.now()}`,
      category: serviceCategory as any,
      title: serviceTitle,
      subtitle: serviceSubtitle || "High quality expert service with 30-day HelpMate guarantee",
      price: parseFloat(price) || 699,
      originalPrice: parseFloat(originalPrice) || 999,
      duration,
      rating: 5.0,
      reviewsCount: 1,
      isInspectionBased,
      isPopular,
      systemType: selectedSystemTypes,
      status: "Active",
      createdBy: "Admin Dispatcher",
      createdDate: "Just Now",
    };

    setServices([newSvc, ...services]);
    setServiceTitle("");
    setServiceSubtitle("");
    setIsAddServiceOpen(false);
  };

  const handleCreateAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addonTitle) return;

    const newAddon: ServiceAddon = {
      id: `adn-${Date.now()}`,
      title: addonTitle,
      price: parseFloat(addonPrice) || 199,
      unit: addonUnit,
      category: addonCategory,
      status: "Active",
    };

    setAddons([newAddon, ...addons]);
    setAddonTitle("");
    setIsAddAddonOpen(false);
  };

  const handleCreatePincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeLocality) return;

    const newLoc: VaranasiLocality = {
      id: `loc-${Date.now()}`,
      name: pincodeLocality,
      pincode: pincodeCode,
      activeBookings: 0,
      activeTechs: 5,
      status: "Normal",
      isServiceable: true,
    };

    setLocalities([newLoc, ...localities]);
    setPincodeLocality("");
    setIsAddPincodeOpen(false);
  };

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
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit text-xs font-bold">
          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "services"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Services & Inspection Pricing CMS
          </button>
          <button
            onClick={() => setActiveTab("addons")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "addons"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Add-on Parts Management
          </button>
          <button
            onClick={() => setActiveTab("pincodes")}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === "pincodes"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
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
          onAddClick={() => setIsAddServiceOpen(true)}
        />
      ) : activeTab === "addons" ? (
        <DataTable
          title="Add-on Spare Parts & Extra Services"
          description="Configure extra copper piping, coil sprays, and replacement brackets."
          columns={addonColumns}
          data={addons}
          searchPlaceholder="Search add-on title..."
          addButtonLabel="Add New Add-on"
          onAddClick={() => setIsAddAddonOpen(true)}
        />
      ) : (
        <DataTable
          title="Varanasi Pincode Serviceability Engine"
          description="Single-city service coverage management by Varanasi pincodes and active dispatch loads."
          columns={pincodeColumns}
          data={localities}
          searchPlaceholder="Search locality or pincode..."
          addButtonLabel="Add Serviceable Pincode"
          onAddClick={() => setIsAddPincodeOpen(true)}
        />
      )}

      {/* ADD SERVICE DRAWER */}
      {isAddServiceOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddServiceOpen(false)} />
            <form
              onSubmit={handleCreateService}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-brand-600" />
                    <span>Create New Service Package</span>
                  </h3>
                  <p className="text-xs text-slate-500">Add service details, category, pricing, duration, and warranty</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Service Title */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Package Title *</label>
                  <input
                    type="text"
                    required
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    placeholder="e.g. Split AC Power Foam Jet Servicing"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                {/* Category & System Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Category</label>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="AC Service & Repair">AC Service & Repair</option>
                      <option value="Car & Bike Wash">Car & Bike Wash</option>
                      <option value="Home Cleaning">Home Cleaning</option>
                      <option value="Appliance Repair">Appliance Repair</option>
                      <option value="Pest Control">Pest Control</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Home Salon">Home Salon</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Est. Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="30 mins">30 mins</option>
                      <option value="45 mins">45 mins</option>
                      <option value="60 mins">60 mins</option>
                      <option value="90 mins">90 mins</option>
                      <option value="2 - 3 hrs">2 - 3 hrs</option>
                    </select>
                  </div>
                </div>

                {/* Subtitle / Description */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Description / Highlights</label>
                  <textarea
                    rows={2}
                    value={serviceSubtitle}
                    onChange={(e) => setServiceSubtitle(e.target.value)}
                    placeholder="High-pressure jet pump cleaning for indoor & outdoor units with anti-bacterial coating..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  ></textarea>
                </div>

                {/* Pricing Mode Toggle */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                  <span className="font-bold text-slate-900 dark:text-white block">Pricing Architecture</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="pricingMode"
                        checked={!isInspectionBased}
                        onChange={() => setIsInspectionBased(false)}
                      />
                      <span>Fixed Standard Rate</span>
                    </label>
                    <label className="flex items-center gap-2 font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="pricingMode"
                        checked={isInspectionBased}
                        onChange={() => setIsInspectionBased(true)}
                      />
                      <span>Diagnostic Inspection Quote</span>
                    </label>
                  </div>

                  {!isInspectionBased && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Selling Price (₹)</label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-extrabold text-brand-600"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">MRP Original (₹)</label>
                        <input
                          type="number"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-400 line-through"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Popular Badge Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Mark as Trending / Most Popular Service</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-brand-500"></div>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Publish Service to App
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* ADD ADDON DRAWER */}
      {isAddAddonOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddAddonOpen(false)} />
            <form
              onSubmit={handleCreateAddon}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add Spare Part / Add-on</h3>
                  <button type="button" onClick={() => setIsAddAddonOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Add-on Title *</label>
                    <input
                      type="text"
                      required
                      value={addonTitle}
                      onChange={(e) => setAddonTitle(e.target.value)}
                      placeholder="e.g. Anti-Bacterial Spray Coating"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit Price (₹)</label>
                      <input
                        type="number"
                        value={addonPrice}
                        onChange={(e) => setAddonPrice(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit</label>
                      <input
                        type="text"
                        value={addonUnit}
                        onChange={(e) => setAddonUnit(e.target.value)}
                        placeholder="Can / Meter"
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddAddonOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux">Save Add-on</button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* ADD PINCODE DRAWER */}
      {isAddPincodeOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddPincodeOpen(false)} />
            <form
              onSubmit={handleCreatePincode}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add Varanasi Serviceable Pincode</h3>
                  <button type="button" onClick={() => setIsAddPincodeOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Varanasi Locality / Zone Name *</label>
                    <input
                      type="text"
                      required
                      value={pincodeLocality}
                      onChange={(e) => setPincodeLocality(e.target.value)}
                      placeholder="e.g. Mahmoorganj"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">6-Digit Pincode *</label>
                    <input
                      type="text"
                      required
                      value={pincodeCode}
                      onChange={(e) => setPincodeCode(e.target.value)}
                      placeholder="221010"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddPincodeOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux">Save Pincode</button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
