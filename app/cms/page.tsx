"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { Portal } from "@/components/Portal";
import { initialServices, initialAddons, varanasiLocalities, ServiceItem, ServiceAddon, VaranasiLocality } from "@/lib/mockData";
import { Wrench, Plus, CheckCircle2, MapPin, Tag, X, Filter, Sliders, Briefcase, Trash2, Link, Layers, AlertCircle, Edit } from "lucide-react";

interface ServiceOfferingRow {
  id: string;
  title: string;
  type: string;
  price: number;
  duration: string;
  description?: string;
}

export default function CmsPage() {
  const [categorySubcategoriesMap, setCategorySubcategoriesMap] = useState<Record<string, string[]>>({
    "AC Service & Repair": ["Split AC", "Window AC", "Cassette AC / Commercial", "Inverter AC", "Tower AC"],
    "Appliance Repair": ["Washing Machine", "Refrigerator", "Microwave", "Water Purifier (RO)", "Geyser"],
    "Electrical": ["MCB & Switchboard", "Wiring & Fuse", "Fan & Chandelier", "Inverter & Battery"],
    "Plumbing": ["Tap & Mixer", "Toilet & Tank", "Drain Unclogging", "Water Tank Deep Clean"],
    "Home Cleaning": ["Full House Deep Clean", "Bathroom Deep Clean", "Kitchen Degreasing", "Sofa & Carpet Scrub"],
    "Car & Bike Wash": ["Foam Car Wash", "Interior Detailing", "Bike Spa"],
    "Pest Control": ["Cockroach Control", "Termite Treatment", "Bed Bug Extermination"],
    "Home Salon": ["Ayurvedic Spa & Massage", "Facial & Cleanup", "Hair Styling", "Waxing & Threading"],
  });

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Split AC");
  const [newSubcategoryTag, setNewSubcategoryTag] = useState<string>("");
  const [isManageSubcategoriesOpen, setIsManageSubcategoriesOpen] = useState<boolean>(false);
  const [selectedCategoryForManage, setSelectedCategoryForManage] = useState<string>("AC Service & Repair");

  // Add Category Modal State (both Category & Subcategories can be added together)
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState<boolean>(false);
  const [newCatNameInput, setNewCatNameInput] = useState<string>("");
  const [newCatSubcategories, setNewCatSubcategories] = useState<string[]>([]);
  const [newCatSubInput, setNewCatSubInput] = useState<string>("");

  // Add Subcategory Modal State (Category is unchangeable / read-only)
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState<boolean>(false);
  const [targetCategoryForSubcategory, setTargetCategoryForSubcategory] = useState<string>("AC Service & Repair");
  const [subCatInputForModal, setSubCatInputForModal] = useState<string>("");

  // Enhanced Services state with initial linked addons and subcategories
  const [services, setServices] = useState<ServiceItem[]>(() => {
    return initialServices.map((s, idx) => {
      let subcat = s.subcategory;
      if (!subcat) {
        if (s.category === "ac" || s.category === "AC Service & Repair") {
          subcat = idx % 2 === 0 ? "Split AC" : "Window AC";
        } else if (s.category === "cleaning") {
          subcat = "Full House Deep Clean";
        } else if (s.category === "electrician") {
          subcat = "MCB & Switchboard";
        } else if (s.category === "plumbing") {
          subcat = "Drain Unclogging";
        } else {
          subcat = "Ayurvedic Spa & Massage";
        }
      }
      return {
        ...s,
        subcategory: subcat,
        addons: s.addons || (s.category === "ac" ? initialAddons.filter((a) => a.category === "AC") : []),
      };
    });
  });

  const [addons, setAddons] = useState<ServiceAddon[]>(initialAddons);
  const [localities, setLocalities] = useState<VaranasiLocality[]>(varanasiLocalities);
  const [activeTab, setActiveTab] = useState<"services" | "addons" | "pincodes">("services");

  // Selected Service Details & Add-ons Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

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

  // Helper to toggle linking an addon to a service
  const handleToggleLinkAddonToService = (serviceId: string, addon: ServiceAddon) => {
    setServices((prevServices) =>
      prevServices.map((srv) => {
        if (srv.id === serviceId) {
          const currentAddons = srv.addons || [];
          const exists = currentAddons.some((a) => a.id === addon.id);
          const updatedAddons = exists
            ? currentAddons.filter((a) => a.id !== addon.id)
            : [...currentAddons, addon];

          const updatedService = { ...srv, addons: updatedAddons };
          if (selectedService && selectedService.id === serviceId) {
            setSelectedService(updatedService);
          }
          return updatedService;
        }
        return srv;
      })
    );
  };

  const handleAddSubcategoryToCategory = (catName: string, subName: string) => {
    if (!subName.trim()) return;
    const cleanSub = subName.trim();
    setCategorySubcategoriesMap((prev) => {
      const existing = prev[catName] || [];
      if (existing.includes(cleanSub)) return prev;
      return { ...prev, [catName]: [...existing, cleanSub] };
    });
    setSelectedSubcategory(cleanSub);
    setNewSubcategoryTag("");
  };

  const handleRemoveSubcategoryFromCategory = (catName: string, subName: string) => {
    setCategorySubcategoriesMap((prev) => {
      const existing = prev[catName] || [];
      const updated = existing.filter((s) => s !== subName);
      return { ...prev, [catName]: updated };
    });
  };

  const serviceColumns: Column<ServiceItem>[] = [
    {
      key: "title",
      header: "Service Package Title",
      accessor: (row) => (
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setSelectedService(row)}
            className="font-extrabold text-slate-900 dark:text-white hover:text-brand-600 text-left transition-colors"
          >
            {row.title}
          </button>
          <span className="text-[10px] text-slate-400 max-w-xs truncate">{row.subtitle}</span>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category & Subcategory",
      accessor: (row) => (
        <div className="flex flex-col gap-1 items-start">
          <span className="font-extrabold text-brand-600 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded text-[10px] border border-brand-200 dark:border-brand-800">
            {row.category}
          </span>
          {row.subcategory && (
            <span className="font-bold text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-300 px-2 py-0.5 rounded text-[10px] border border-purple-200 dark:border-purple-800 flex items-center gap-1">
              <Layers className="w-2.5 h-2.5 text-purple-500" />
              {row.subcategory}
            </span>
          )}
        </div>
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
      key: "addons",
      header: "Linked Spare Part Add-ons",
      accessor: (row) => (
        <div className="flex flex-wrap gap-1 items-center">
          {row.addons && row.addons.length > 0 ? (
            row.addons.map((a) => (
              <span
                key={a.id}
                className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-extrabold text-[10px] border border-purple-200 dark:border-purple-800 flex items-center gap-1"
              >
                <Tag className="w-2.5 h-2.5" />
                {a.title} (₹{a.price})
              </span>
            ))
          ) : (
            <button
              type="button"
              onClick={() => setSelectedService(row)}
              className="text-[10px] font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <Link className="w-3 h-3" /> + Link Spare Parts
            </button>
          )}
        </div>
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
            onClick={() => setIsAddServiceOpen(true)}
            title="Edit Service Package"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-all border border-slate-200 dark:border-slate-700"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedService(row)}
            title="Manage Connected Add-ons"
            className="p-1.5 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all"
          >
            <Wrench className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setServices(services.filter((s) => s.id !== row.id))}
            title="Delete Service Package"
            className="p-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
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
      key: "connectedServices",
      header: "Connected Services",
      accessor: (row) => {
        const connected = services.filter((s) => s.addons?.some((a) => a.id === row.id));
        return (
          <div className="flex flex-wrap gap-1 items-center">
            {connected.length > 0 ? (
              connected.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold text-[10px] border border-brand-200 dark:border-brand-800"
                >
                  {s.title}
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic text-[10px]">Not Linked to Services</span>
            )}
          </div>
        );
      },
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
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setIsAddAddonOpen(true)}
            title="Edit Add-on Spare Part"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-all border border-slate-200 dark:border-slate-700"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setAddons(addons.filter((a) => a.id !== row.id))}
            title="Delete Add-on Spare Part"
            className="p-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
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
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setIsAddPincodeOpen(true)}
            title="Edit Serviceable Locality"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-all border border-slate-200 dark:border-slate-700"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setLocalities(localities.filter((l) => l.id !== row.id))}
            title="Delete Serviceable Locality"
            className="p-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
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
      type: "Service",
      price: 699,
      duration: "45 mins",
    },
  ]);

  // Step 3 State: Selected Spare Part Add-ons for New Service Package
  const [selectedAddonIdsInDrawer, setSelectedAddonIdsInDrawer] = useState<string[]>(["add-1", "add-2"]);

  // Inline Add Addon inside Drawer State
  const [showInlineAddAddon, setShowInlineAddAddon] = useState(false);
  const [inlineAddonTitle, setInlineAddonTitle] = useState("");
  const [inlineAddonPrice, setInlineAddonPrice] = useState("250");
  const [inlineAddonUnit, setInlineAddonUnit] = useState("unit");

  // Standalone Add Addon Form State
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
        type: "Service",
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

  const handleCreateInlineAddon = () => {
    if (!inlineAddonTitle.trim()) return;
    const newAddonItem: ServiceAddon = {
      id: `adn-${Date.now()}`,
      title: inlineAddonTitle.trim(),
      price: parseFloat(inlineAddonPrice) || 250,
      unit: inlineAddonUnit || "unit",
      category: serviceCategory,
      status: "Active",
    };
    setAddons([...addons, newAddonItem]);
    setSelectedAddonIdsInDrawer([...selectedAddonIdsInDrawer, newAddonItem.id]);
    setInlineAddonTitle("");
    setShowInlineAddAddon(false);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = isAddingNewCategory && newCategoryName.trim()
      ? newCategoryName.trim()
      : serviceCategory;

    const validOfferings = serviceOfferings.filter((off) => off.title.trim().length > 0);
    if (validOfferings.length === 0) return;

    const linkedAddonObjects = addons.filter((a) => selectedAddonIdsInDrawer.includes(a.id));

    const newServicesList: ServiceItem[] = validOfferings.map((off, idx) => ({
      id: `srv-${Date.now()}-${idx}`,
      category: finalCategory as any,
      subcategory: selectedSubcategory || undefined,
      title: off.title,
      subtitle: off.description || `Expert ${off.type} service with 30-day HelpMate guarantee`,
      price: off.price || 699,
      originalPrice: Math.round((off.price || 699) * 1.3),
      duration: off.duration || "45 mins",
      rating: 5.0,
      reviewsCount: 1,
      isInspectionBased: false,
      isPopular: idx === 0,
      systemType: [off.type],
      addons: linkedAddonObjects,
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
        type: "Service",
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
      {/* Top Banner Header */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-purple-700 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" /> HelpMate Varanasi Catalog CMS
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Services & Master Pricing Catalog</h1>
          <p className="text-xs text-brand-100 mt-1 max-w-xl">
            Manage fixed service rates, diagnostic inspection charges, spare part add-ons, and Varanasi pincode serviceability rules.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (activeTab === "services") setIsAddServiceOpen(true);
              else if (activeTab === "addons") setIsAddAddonOpen(true);
              else setIsAddPincodeOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white text-brand-900 font-extrabold text-xs shadow-md hover:bg-brand-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-brand-600" />
            <span>
              {activeTab === "services"
                ? "Add New Service"
                : activeTab === "addons"
                  ? "Add New Add-on"
                  : "Add Service Zone"}
            </span>
          </button>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex items-center justify-between overflow-x-auto pb-1 no-scrollbar">
        <div className="flex gap-1.5 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === "services"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            Services & Pricing CMS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("addons")}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === "addons"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            Add-on Parts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pincodes")}
            className={`px-3 sm:px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === "pincodes"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            Pincode Serviceability
          </button>
        </div>
      </div>

      {/* CATEGORY FLOW SELECTION CHIPS (For Services Tab) */}
      {activeTab === "services" && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Category Flow:
          </span>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${selectedCategoryFilter === cat
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
          columns={serviceColumns}
          data={filteredServices}
          searchPlaceholder="Search service title or category..."
        />
      ) : activeTab === "addons" ? (
        <DataTable
          columns={addonColumns}
          data={addons}
          searchPlaceholder="Search add-on title..."
        />
      ) : (
        <DataTable
          columns={pincodeColumns}
          data={localities}
          searchPlaceholder="Search locality or pincode..."
        />
      )}

      {/* SERVICE DETAILS & CONNECTED ADD-ONS MODAL */}
      {selectedService && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {selectedService.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Category: <span className="font-bold text-brand-600">{selectedService.category}</span> • Base Rate: ₹{selectedService.price}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Connected Add-ons Section */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-purple-600" />
                    Connected Spare Part Add-ons ({selectedService.addons?.length || 0})
                  </span>
                </div>

                <div className="space-y-2">
                  {addons.map((addon) => {
                    const isLinked = selectedService.addons?.some((a) => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${isLinked
                            ? "bg-purple-50/60 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
                          }`}
                      >
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-white block">
                            {addon.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            ₹{addon.price} / {addon.unit} • Category: {addon.category}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleLinkAddonToService(selectedService.id, addon)}
                          className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-all flex items-center gap-1 ${isLinked
                              ? "bg-purple-600 text-white shadow-lux"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                            }`}
                        >
                          {isLinked ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Linked
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              Link Add-on
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ADD SERVICE DRAWER WITH LINKED ADD-ONS SECTION */}
      {isAddServiceOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddServiceOpen(false)} />
            <form
              onSubmit={handleCreateService}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-3xl w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none text-xs"
            >
              <div className="space-y-4 overflow-y-auto pr-1">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Service Package</h3>
                  <button type="button" onClick={() => setIsAddServiceOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step 1: Category & Subcategory Selection inside Form */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Category Dropdown & Add Category Option */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-extrabold text-slate-900 dark:text-white block text-xs">
                          Select Category *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setNewCatNameInput("");
                            setNewCatSubcategories([]);
                            setNewCatSubInput("");
                            setIsAddCategoryModalOpen(true);
                          }}
                          className="text-brand-600 dark:text-brand-400 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Category</span>
                        </button>
                      </div>

                      <select
                        value={serviceCategory}
                        onChange={(e) => {
                          const cat = e.target.value;
                          setServiceCategory(cat);
                          const subs = categorySubcategoriesMap[cat] || [];
                          setSelectedSubcategory(subs[0] || "");
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500 text-xs"
                      >
                        {Object.keys(categorySubcategoriesMap).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory Dropdown & Add Subcategory Option */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-extrabold text-purple-900 dark:text-purple-300 block text-xs">
                          Select Subcategory *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setTargetCategoryForSubcategory(serviceCategory);
                            setSubCatInputForModal("");
                            setIsAddSubcategoryOpen(true);
                          }}
                          className="text-purple-600 dark:text-purple-400 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Subcategory</span>
                        </button>
                      </div>

                      <select
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold outline-none focus:border-purple-500 text-xs"
                      >
                        {(categorySubcategoriesMap[serviceCategory] || []).length > 0 ? (
                          (categorySubcategoriesMap[serviceCategory] || []).map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))
                        ) : (
                          <option value="">No Subcategory</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 2: Dynamic Multiple Add Service Packages */}
                <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-200 dark:border-brand-800 pb-1.5">
                    <span className="font-extrabold text-brand-900 dark:text-brand-300 block text-xs">
                      2. Service Packages ({serviceOfferings.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddOfferingRow}
                      className="px-2.5 py-1 bg-brand-500 text-white rounded-lg text-[11px] font-bold shadow-lux flex items-center gap-1 hover:bg-brand-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Package</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {serviceOfferings.length > 0 ? (
                      serviceOfferings.map((off, idx) => (
                        <div
                          key={off.id || idx}
                          className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 relative shadow-xs"
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-1">
                            <span className="font-extrabold text-[11px] text-brand-600 dark:text-brand-400">
                              Package #{idx + 1}
                            </span>
                            {serviceOfferings.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOfferingRow(idx)}
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                title="Remove Package"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* FIRST FIELD: Service Action */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                                Service Action *
                              </label>
                              <select
                                value={off.type}
                                onChange={(e) => handleUpdateOfferingRow(idx, "type", e.target.value)}
                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500 text-xs"
                              >
                                <option value="Repair">Repair Service</option>
                                <option value="Service">Service & Maintenance</option>
                                <option value="Installation">Installation Service</option>
                                <option value="Uninstallation">Uninstallation Service</option>
                              </select>
                            </div>

                            {/* SECOND FIELD: Package Name */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                                Package Name *
                              </label>
                              <input
                                type="text"
                                value={off.title}
                                onChange={(e) => handleUpdateOfferingRow(idx, "title", e.target.value)}
                                placeholder="e.g. Master Power Jet Foam Cleaning Package"
                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 text-xs"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* THIRD FIELD: Price */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                                Price (₹) *
                              </label>
                              <input
                                type="number"
                                value={off.price}
                                onChange={(e) => handleUpdateOfferingRow(idx, "price", Number(e.target.value))}
                                placeholder="699"
                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500 text-xs"
                                required
                              />
                            </div>

                            {/* FOURTH FIELD: Duration */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                                Duration *
                              </label>
                              <select
                                value={off.duration}
                                onChange={(e) => handleUpdateOfferingRow(idx, "duration", e.target.value)}
                                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 text-xs"
                              >
                                <option value="30 mins">30 mins</option>
                                <option value="45 mins">45 mins</option>
                                <option value="60 mins">60 mins</option>
                                <option value="90 mins">90 mins</option>
                                <option value="2 - 3 hrs">2 - 3 hrs</option>
                              </select>
                            </div>
                          </div>

                          {/* FIFTH FIELD: Description */}
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                              Package Description
                            </label>
                            <input
                              type="text"
                              value={off.description || ""}
                              onChange={(e) => handleUpdateOfferingRow(idx, "description", e.target.value)}
                              placeholder="e.g. Includes deep foam jet cleaning, drain line clearing & 30-day warranty"
                              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500 text-xs"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                        <p className="text-xs text-slate-500 font-medium">No service packages added yet.</p>
                        <button
                          type="button"
                          onClick={handleAddOfferingRow}
                          className="px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold border border-brand-200 inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add First Package
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3: Link Spare Part Add-ons directly to Service */}
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800 pb-1.5">
                    <span className="font-extrabold text-purple-900 dark:text-purple-300 block text-xs">
                      3. Link Spare Part Add-ons ({selectedAddonIdsInDrawer.length} Selected)
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowInlineAddAddon(!showInlineAddAddon)}
                      className="text-purple-700 dark:text-purple-300 font-bold text-[11px] flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Add-on</span>
                    </button>
                  </div>

                  {showInlineAddAddon && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-700 space-y-2">
                      <span className="font-extrabold text-slate-900 dark:text-white block text-[11px]">New Spare Part Details</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={inlineAddonTitle}
                          onChange={(e) => setInlineAddonTitle(e.target.value)}
                          placeholder="Part Name (e.g. Copper Pipe)"
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                        />
                        <input
                          type="number"
                          value={inlineAddonPrice}
                          onChange={(e) => setInlineAddonPrice(e.target.value)}
                          placeholder="Price ₹"
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold"
                        />
                        <button
                          type="button"
                          onClick={handleCreateInlineAddon}
                          className="py-2 bg-purple-600 text-white rounded-xl font-bold"
                        >
                          Add & Select
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    {addons.map((addon) => {
                      const isSelected = selectedAddonIdsInDrawer.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isSelected
                              ? "bg-white dark:bg-slate-800 border-purple-500 shadow-xs"
                              : "bg-white/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-70"
                            }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  setSelectedAddonIdsInDrawer(selectedAddonIdsInDrawer.filter((id) => id !== addon.id));
                                } else {
                                  setSelectedAddonIdsInDrawer([...selectedAddonIdsInDrawer, addon.id]);
                                }
                              }}
                              className="w-4 h-4 text-purple-600 rounded"
                            />
                            <span className="font-bold text-slate-900 dark:text-white text-xs">{addon.title}</span>
                          </div>
                          <span className="font-mono font-bold text-purple-700 dark:text-purple-300 text-xs">
                            ₹{addon.price} / {addon.unit}
                          </span>
                        </label>
                      );
                    })}
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
                    placeholder="e.g. Copper Piping (per meter)"
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

      {/* MANAGE SUBCATEGORIES MODAL */}
      {isManageSubcategoriesOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-5 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Category Subcategories Manager
                    </h3>
                    <p className="text-xs text-slate-500">
                      Multi-add subcategories (e.g. Split AC, Window AC, Commercial AC)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManageSubcategoriesOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Select Master Category to Manage */}
              <div className="space-y-2">
                <label className="font-extrabold text-slate-700 dark:text-slate-300 text-xs block">
                  Select Category to Manage Subcategories
                </label>
                <select
                  value={selectedCategoryForManage}
                  onChange={(e) => setSelectedCategoryForManage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none text-xs"
                >
                  {Object.keys(categorySubcategoriesMap).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({(categorySubcategoriesMap[cat] || []).length} Subcategories)
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Subcategories list */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-purple-900 dark:text-purple-300 text-xs">
                    Subcategories for "{selectedCategoryForManage}"
                  </span>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full">
                    {(categorySubcategoriesMap[selectedCategoryForManage] || []).length} Options
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(categorySubcategoriesMap[selectedCategoryForManage] || []).length > 0 ? (
                    (categorySubcategoriesMap[selectedCategoryForManage] || []).map((sub) => (
                      <span
                        key={sub}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-extrabold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <Layers className="w-3 h-3 text-purple-500" />
                        {sub}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategoryFromCategory(selectedCategoryForManage, sub)}
                          className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                          title="Remove subcategory"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No subcategories defined for this category yet.</p>
                  )}
                </div>

                {/* Inline Multi Add Form */}
                <div className="pt-3 border-t border-purple-200 dark:border-purple-800 space-y-1.5">
                  <label className="text-[11px] font-extrabold text-purple-900 dark:text-purple-300 block">
                    + Multi-Add Subcategory (e.g. Split AC, Window AC, Inverter AC, Commercial AC)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubcategoryTag}
                      onChange={(e) => setNewSubcategoryTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSubcategoryToCategory(selectedCategoryForManage, newSubcategoryTag);
                        }
                      }}
                      placeholder="Type new subcategory name..."
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubcategoryToCategory(selectedCategoryForManage, newSubcategoryTag)}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-lux flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Tag
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsManageSubcategoriesOpen(false)}
                  className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux cursor-pointer"
                >
                  Done & Save
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* 1. ADD CATEGORY MODAL (Category Name & Subcategories can both be added together) */}
      {isAddCategoryModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCatNameInput.trim()) return;
                const catName = newCatNameInput.trim();
                setCategorySubcategoriesMap((prev) => ({
                  ...prev,
                  [catName]: newCatSubcategories,
                }));
                setServiceCategory(catName);
                if (newCatSubcategories.length > 0) {
                  setSelectedSubcategory(newCatSubcategories[0]);
                }
                setIsAddCategoryModalOpen(false);
              }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-5 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none max-h-[90vh] overflow-y-auto text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Add New Master Category
                    </h3>
                    <p className="text-xs text-slate-500">
                      Add Category Name & Multi-Add Subcategories together
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Field 1: Category Name */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-900 dark:text-white block text-xs">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCatNameInput}
                  onChange={(e) => setNewCatNameInput(e.target.value)}
                  placeholder="e.g. Solar Panel Cleaning & Servicing"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500 text-xs"
                />
              </div>

              {/* Field 2: Subcategories Multi-Add */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800 pb-1.5">
                  <span className="font-extrabold text-purple-900 dark:text-purple-300 text-xs flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" />
                    Subcategories for this Category
                  </span>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full">
                    Multi-Add Options
                  </span>
                </div>

                {/* Input ABOVE */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-purple-900 dark:text-purple-300 block">
                    + Add Subcategory (e.g. Split AC, Window AC, Commercial AC)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCatSubInput}
                      onChange={(e) => setNewCatSubInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newCatSubInput.trim() && !newCatSubcategories.includes(newCatSubInput.trim())) {
                            setNewCatSubcategories([...newCatSubcategories, newCatSubInput.trim()]);
                            setNewCatSubInput("");
                          }
                        }
                      }}
                      placeholder="Type subcategory name..."
                      className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCatSubInput.trim() && !newCatSubcategories.includes(newCatSubInput.trim())) {
                          setNewCatSubcategories([...newCatSubcategories, newCatSubInput.trim()]);
                          setNewCatSubInput("");
                        }
                      }}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-lux flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Tag
                    </button>
                  </div>
                </div>

                {/* Tag Pills BELOW */}
                <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/50 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    Added Subcategories ({newCatSubcategories.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {newCatSubcategories.length > 0 ? (
                      newCatSubcategories.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-extrabold text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Layers className="w-3 h-3 text-purple-500" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => setNewCatSubcategories(newCatSubcategories.filter((t) => t !== tag))}
                            className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No subcategories added yet. Type above to add options.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-extrabold text-xs shadow-lux cursor-pointer"
                >
                  Save Category & Subcategories
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* 2. ADD SUBCATEGORY MODAL (Category is UNCHANGEABLE / READ-ONLY) */}
      {isAddSubcategoryOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddSubcategoryOpen(false);
              }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full space-y-5 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none max-h-[90vh] overflow-y-auto text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Add Subcategory
                    </h3>
                    <p className="text-xs text-slate-500">
                      Target category is fixed & unchangeable
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddSubcategoryOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* UNCHANGEABLE / READ-ONLY CATEGORY FIELD */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 dark:text-slate-300 block text-xs flex items-center gap-1.5">
                  Category (Locked / Unchangeable)
                </label>
                <div className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-extrabold text-xs flex items-center justify-between cursor-not-allowed">
                  <span className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-brand-600" />
                    {targetCategoryForSubcategory}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">
                    Locked
                  </span>
                </div>
              </div>

              {/* Subcategories Multi-Add Card */}
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800 pb-1.5">
                  <span className="font-extrabold text-purple-900 dark:text-purple-300 text-xs">
                    Subcategories for "{targetCategoryForSubcategory}"
                  </span>
                  <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded-full">
                    {(categorySubcategoriesMap[targetCategoryForSubcategory] || []).length} Existing
                  </span>
                </div>

                {/* Input ABOVE */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-purple-900 dark:text-purple-300 block">
                    + Add Subcategory Option (e.g. Split AC, Window AC, Inverter AC)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={subCatInputForModal}
                      onChange={(e) => setSubCatInputForModal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (subCatInputForModal.trim()) {
                            handleAddSubcategoryToCategory(targetCategoryForSubcategory, subCatInputForModal);
                            setSubCatInputForModal("");
                          }
                        }
                      }}
                      placeholder="Type subcategory name..."
                      className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (subCatInputForModal.trim()) {
                          handleAddSubcategoryToCategory(targetCategoryForSubcategory, subCatInputForModal);
                          setSubCatInputForModal("");
                        }
                      }}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-lux flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Tag
                    </button>
                  </div>
                </div>

                {/* Tag Pills BELOW */}
                <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/50 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    Active Subcategories for {targetCategoryForSubcategory}:
                  </span>
                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {(categorySubcategoriesMap[targetCategoryForSubcategory] || []).length > 0 ? (
                      (categorySubcategoriesMap[targetCategoryForSubcategory] || []).map((sub) => (
                        <span
                          key={sub}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-extrabold text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Layers className="w-3 h-3 text-purple-500" />
                          {sub}
                          <button
                            type="button"
                            onClick={() => handleRemoveSubcategoryFromCategory(targetCategoryForSubcategory, sub)}
                            className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No subcategories defined for this category yet.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubcategoryOpen(false)}
                  className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux cursor-pointer"
                >
                  Done & Save
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
