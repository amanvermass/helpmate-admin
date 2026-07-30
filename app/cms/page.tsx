"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { Portal } from "@/components/Portal";
import { initialServices, initialAddons, varanasiLocalities, ServiceItem, ServiceAddon, VaranasiLocality } from "@/lib/mockData";
import { Wrench, Plus, CheckCircle2, MapPin, Tag, X, Filter, Sliders, Briefcase, Trash2 } from "lucide-react";

interface ServiceOfferingRow {
  id: string;
  title: string;
  type: string;
  price: number;
  duration: string;
}

export default function CmsPage() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [addons, setAddons] = useState<ServiceAddon[]>(initialAddons);
  const [localities, setLocalities] = useState<VaranasiLocality[]>(varanasiLocalities);
  const [activeTab, setActiveTab] = useState<"services" | "addons" | "pincodes">("services");

  // Category Filter Flow State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All Categories");

  const categoriesList = [
    "All Categories",
    "AC Service & Repair",
    "Appliance Repair",
    "Electrical",
    "Plumbing",
    "Home Cleaning",
    "Car & Bike Wash",
    "Pest Control",
    "Home Salon",
  ];

  const serviceColumns: Column<ServiceItem>[] = [
    {
      key: "title",
      header: "Service Package Title",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 dark:text-white">{row.title}</span>
          <span className="text-[10px] text-slate-400 max-w-xs truncate">{row.subtitle}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      accessor: (row) => (
        <span className="font-bold text-brand-600 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded text-[10px] border border-brand-200 dark:border-brand-800">
          {row.category}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price (₹)",
      accessor: (row) => (
        <div className="flex items-baseline gap-1.5 font-bold">
          <span className="text-sm text-slate-900 dark:text-white">₹{row.price}</span>
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
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
              : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
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
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 w-fit">
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
      accessor: (row) => <span className="font-extrabold text-slate-900 dark:text-white">{row.title}</span>,
    },
    {
      key: "price",
      header: "Unit Price (₹)",
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">
          ₹{row.price} / {row.unit}
        </span>
      ),
    },
    {
      key: "category",
      header: "Associated Category",
      accessor: (row) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[10px] text-slate-700 dark:text-slate-300">
          {row.category}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {row.status}
        </span>
      ),
    },
  ];

  const pincodeColumns: Column<VaranasiLocality>[] = [
    {
      key: "name",
      header: "Locality / Zone",
      accessor: (row) => <span className="font-extrabold text-slate-900 dark:text-white">{row.name}</span>,
    },
    {
      key: "pincode",
      header: "Pincode",
      accessor: (row) => <span className="font-mono font-bold text-brand-600">{row.pincode}</span>,
    },
    {
      key: "activeBookings",
      header: "Active Dispatch Load",
      accessor: (row) => <span className="font-bold text-slate-700 dark:text-slate-300">{row.activeBookings} Bookings</span>,
    },
    {
      key: "status",
      header: "Serviceability Status",
      accessor: () => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 w-fit">
          <CheckCircle2 className="w-3 h-3" /> Serviceable
        </span>
      ),
    },
  ];

  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddAddonOpen, setIsAddAddonOpen] = useState(false);
  const [isAddPincodeOpen, setIsAddPincodeOpen] = useState(false);

  // Step 1 State: Master Category & Option to Add New Category
  const [serviceCategory, setServiceCategory] = useState("AC Service & Repair");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Step 2 State: Multiple Add Sub-Service Offerings with Price & Duration
  const [serviceOfferings, setServiceOfferings] = useState<ServiceOfferingRow[]>([
    {
      id: `offering-${Date.now()}`,
      title: "",
      type: "Servicing",
      price: 699,
      duration: "45 mins",
    },
  ]);

  // Add Addon Form State
  const [addonTitle, setAddonTitle] = useState("");
  const [addonPrice, setAddonPrice] = useState("199");
  const [addonUnit, setAddonUnit] = useState("Can");
  const [addonCategory, setAddonCategory] = useState("AC Service");

  // Add Pincode Form State
  const [pincodeLocality, setPincodeLocality] = useState("");
  const [pincodeCode, setPincodeCode] = useState("221005");

  const handleAddOfferingRow = () => {
    setServiceOfferings([
      ...serviceOfferings,
      {
        id: `offering-${Date.now()}`,
        title: "",
        type: "Servicing",
        price: 699,
        duration: "45 mins",
      },
    ]);
  };

  const handleUpdateOfferingRow = (index: number, field: keyof ServiceOfferingRow, value: any) => {
    const updated = [...serviceOfferings];
    updated[index] = { ...updated[index], [field]: value };
    setServiceOfferings(updated);
  };

  const handleRemoveOfferingRow = (index: number) => {
    setServiceOfferings(serviceOfferings.filter((_, i) => i !== index));
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = isAddingNewCategory && newCategoryName.trim()
      ? newCategoryName.trim()
      : serviceCategory;

    const validOfferings = serviceOfferings.filter((off) => off.title.trim().length > 0);
    if (validOfferings.length === 0) return;

    const newServicesList: ServiceItem[] = validOfferings.map((off, idx) => ({
      id: `srv-${Date.now()}-${idx}`,
      category: finalCategory as any,
      title: off.title,
      subtitle: `Expert ${off.type} service with 30-day HelpMate guarantee`,
      price: off.price || 699,
      originalPrice: Math.round((off.price || 699) * 1.3),
      duration: off.duration || "45 mins",
      rating: 5.0,
      reviewsCount: 1,
      isInspectionBased: false,
      isPopular: idx === 0,
      systemType: [off.type],
      status: "Active",
      createdBy: "Admin Dispatcher",
      createdDate: "Just Now",
    }));

    if (isAddingNewCategory && newCategoryName.trim()) {
      setCustomCategories([...customCategories, newCategoryName.trim()]);
    }

    setServices([...newServicesList, ...services]);
    setServiceOfferings([
      {
        id: `offering-${Date.now()}`,
        title: "",
        type: "Servicing",
        price: 699,
        duration: "45 mins",
      },
    ]);
    setIsAddingNewCategory(false);
    setNewCategoryName("");
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

  // Dynamic Filtering by Category
  const filteredServices = selectedCategoryFilter === "All Categories"
    ? services
    : services.filter((s) => s.category === selectedCategoryFilter);

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

      {/* CATEGORY FLOW SELECTION CHIPS (For Services Tab) */}
      {activeTab === "services" && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category Flow:
          </span>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedCategoryFilter === cat
                  ? "bg-brand-500 text-white shadow-lux"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {activeTab === "services" ? (
        <DataTable
          title={`Service Catalog & Pricing Mode CMS (${filteredServices.length})`}
          description="Manage fixed pricing and inspection-based service options across HVAC, Electrical & Plumbing."
          columns={serviceColumns}
          data={filteredServices}
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
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none text-xs"
            >
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Service</h3>
                  <button type="button" onClick={() => setIsAddServiceOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step 1: Master Category Selection & Add Category Option */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                      1. Select Master Category *
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                      className="text-brand-600 dark:text-brand-400 hover:underline font-bold text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingNewCategory ? "Select Existing Category" : "Add New Category"}</span>
                    </button>
                  </div>

                  {!isAddingNewCategory ? (
                    <div>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500"
                      >
                        {[...categoriesList.filter((c) => c !== "All Categories"), ...customCategories].map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">New Category Title *</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g. Solar Panel Cleaning & Repair"
                          className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newCategoryName.trim()) {
                              setCustomCategories([...customCategories, newCategoryName.trim()]);
                              setServiceCategory(newCategoryName.trim());
                              setIsAddingNewCategory(false);
                            }
                          }}
                          className="px-3 py-2.5 bg-brand-500 text-white rounded-xl font-bold text-xs shadow-lux"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Dynamic Multiple Add Sub-Service Offerings */}
                <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-200 dark:border-brand-800 pb-1.5">
                    <span className="font-extrabold text-brand-900 dark:text-brand-300 block text-xs">
                      2. Sub-Services Offerings ({serviceOfferings.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddOfferingRow}
                      className="px-2.5 py-1 bg-brand-500 text-white rounded-lg text-[11px] font-bold shadow-lux flex items-center gap-1 hover:bg-brand-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Offering</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {serviceOfferings.length > 0 ? (
                      serviceOfferings.map((off, idx) => (
                        <div
                          key={off.id || idx}
                          className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 relative shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-[10px] text-slate-500">
                              Offering #{idx + 1}
                            </span>
                            {serviceOfferings.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOfferingRow(idx)}
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                title="Remove Offering"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                                Sub-Service Offering Title *
                              </label>
                              <input
                                type="text"
                                value={off.title}
                                onChange={(e) => handleUpdateOfferingRow(idx, "title", e.target.value)}
                                placeholder="e.g. Split AC Installation / Servicing"
                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                                Offering Type *
                              </label>
                              <select
                                value={off.type}
                                onChange={(e) => handleUpdateOfferingRow(idx, "type", e.target.value)}
                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500"
                              >
                                <option value="Installation">Installation Service</option>
                                <option value="Servicing">Servicing / Maintenance</option>
                                <option value="Repair">Repairing Service</option>
                                <option value="Uninstallation">Uninstallation Service</option>
                                <option value="Maintenance">Maintenance & Add-on</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                                Price (₹) *
                              </label>
                              <input
                                type="number"
                                value={off.price}
                                onChange={(e) => handleUpdateOfferingRow(idx, "price", Number(e.target.value))}
                                placeholder="699"
                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                                Duration *
                              </label>
                              <select
                                value={off.duration}
                                onChange={(e) => handleUpdateOfferingRow(idx, "duration", e.target.value)}
                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                              >
                                <option value="30 mins">30 mins</option>
                                <option value="45 mins">45 mins</option>
                                <option value="60 mins">60 mins</option>
                                <option value="90 mins">90 mins</option>
                                <option value="2 - 3 hrs">2 - 3 hrs</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                        <p className="text-xs text-slate-500 font-medium">No service offerings added yet.</p>
                        <button
                          type="button"
                          onClick={handleAddOfferingRow}
                          className="px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold border border-brand-200 inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add First Offering Item
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lux flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Service Package</span>
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
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none text-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add Spare Part Add-on</h3>
                  <button type="button" onClick={() => setIsAddAddonOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Add-on Item Title *</label>
                  <input
                    type="text"
                    required
                    value={addonTitle}
                    onChange={(e) => setAddonTitle(e.target.value)}
                    placeholder="e.g. Copper Piping (per ft)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={addonPrice}
                    onChange={(e) => setAddonPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddAddonOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lux"
                >
                  Save Add-on Item
                </button>
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
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none text-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add Serviceable Pincode Zone</h3>
                  <button type="button" onClick={() => setIsAddPincodeOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Locality Name *</label>
                  <input
                    type="text"
                    required
                    value={pincodeLocality}
                    onChange={(e) => setPincodeLocality(e.target.value)}
                    placeholder="e.g. Lanka Bhabha Road"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincodeCode}
                    onChange={(e) => setPincodeCode(e.target.value)}
                    placeholder="221005"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPincodeOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lux"
                >
                  Save Service Zone
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
