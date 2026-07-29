"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { Portal } from "@/components/Portal";
import {
  initialCategories,
  CategoryItem,
  CategorySubService,
  initialSubCategories,
  SubCategoryItem,
  initialPackages,
  PackageItem,
} from "@/lib/mockData";
import {
  Sliders,
  Plus,
  CheckCircle2,
  Layers,
  Package,
  X,
  Wrench,
  Sparkles,
  Zap,
  Droplets,
  Scissors,
  Wind,
  Trash2,
  Edit,
  Search,
  Tag,
  Clock,
  ArrowRight,
  Shield,
  Briefcase,
  FolderPlus,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<"categories" | "all_services" | "subcategories" | "packages">("categories");

  // Add / Edit Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form States
  const [catName, setCatName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Wrench");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Dynamic Sub-Services List in Form
  const [formSubServices, setFormSubServices] = useState<CategorySubService[]>([
    { id: "sub-1", title: "Split AC Complete Installation", type: "Installation", price: 1499, duration: "90 mins", status: "Active" },
    { id: "sub-2", title: "Power Jet Deep Servicing", type: "Servicing", price: 699, duration: "45 mins", status: "Active" },
    { id: "sub-3", title: "Gas Leak Repair & Charging", type: "Repair", price: 2499, duration: "60 mins", status: "Active" },
    { id: "sub-4", title: "Split AC Safe Uninstallation", type: "Uninstallation", price: 699, duration: "45 mins", status: "Active" },
  ]);

  const openAddDrawer = () => {
    setEditingCategory(null);
    setCatName("");
    setSlug("");
    setIcon("Wrench");
    setStatus("Active");
    setFormSubServices([
      { id: `sub-${Date.now()}-1`, title: "AC Complete Installation", type: "Installation", price: 1499, duration: "90 mins", status: "Active" },
      { id: `sub-${Date.now()}-2`, title: "Power Jet Servicing", type: "Servicing", price: 699, duration: "45 mins", status: "Active" },
      { id: `sub-${Date.now()}-3`, title: "Gas Leakage Repair", type: "Repair", price: 2499, duration: "60 mins", status: "Active" },
      { id: `sub-${Date.now()}-4`, title: "AC Safe Uninstallation", type: "Uninstallation", price: 699, duration: "45 mins", status: "Active" },
    ]);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon || "Wrench");
    setStatus(cat.status);
    setFormSubServices(
      cat.subServices && cat.subServices.length > 0
        ? [...cat.subServices]
        : [
            { id: `sub-${Date.now()}-1`, title: `${cat.name} Installation`, type: "Installation", price: 999, duration: "60 mins", status: "Active" },
            { id: `sub-${Date.now()}-2`, title: `${cat.name} Servicing & Repair`, type: "Repair", price: 499, duration: "45 mins", status: "Active" },
            { id: `sub-${Date.now()}-3`, title: `${cat.name} Uninstallation`, type: "Uninstallation", price: 499, duration: "30 mins", status: "Active" },
          ]
    );
    setIsDrawerOpen(true);
  };

  const handleAddSubServiceRow = () => {
    const newRow: CategorySubService = {
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: "",
      type: "Servicing",
      price: 499,
      duration: "45 mins",
      status: "Active",
    };
    setFormSubServices([...formSubServices, newRow]);
  };

  const handleRemoveSubServiceRow = (index: number) => {
    setFormSubServices(formSubServices.filter((_, i) => i !== index));
  };

  const handleUpdateSubServiceRow = (index: number, key: keyof CategorySubService, value: any) => {
    const updated = [...formSubServices];
    updated[index] = { ...updated[index], [key]: value };
    setFormSubServices(updated);
  };

  // Quick Preset Helper
  const loadACPresets = () => {
    setCatName("AC Servicing & Repair");
    setSlug("ac");
    setIcon("Wrench");
    setFormSubServices([
      { id: `sub-ac-1`, title: "Split AC Complete Installation", type: "Installation", price: 1499, duration: "90 mins", status: "Active" },
      { id: `sub-ac-2`, title: "Window AC Installation", type: "Installation", price: 999, duration: "60 mins", status: "Active" },
      { id: `sub-ac-3`, title: "Power Jet Deep Servicing", type: "Servicing", price: 699, duration: "45 mins", status: "Active" },
      { id: `sub-ac-4`, title: "Gas Leakage Testing & Charging", type: "Repair", price: 2499, duration: "60 mins", status: "Active" },
      { id: `sub-ac-5`, title: "Split AC Safe Uninstallation", type: "Uninstallation", price: 699, duration: "45 mins", status: "Active" },
      { id: `sub-ac-6`, title: "Window AC Uninstallation", type: "Uninstallation", price: 499, duration: "30 mins", status: "Active" },
      { id: `sub-ac-7`, title: "Anti-Bacterial Hydro Coil Cleaning", type: "Maintenance", price: 399, duration: "30 mins", status: "Active" },
    ]);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const validSubServices = formSubServices.filter((s) => s.title.trim().length > 0);

    if (editingCategory) {
      const updatedList = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: catName,
              slug: slug || catName.toLowerCase().replace(/\s+/g, "-"),
              icon,
              status,
              subServices: validSubServices,
              servicesCount: validSubServices.length,
            }
          : c
      );
      setCategories(updatedList);
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: catName,
        slug: slug || catName.toLowerCase().replace(/\s+/g, "-"),
        icon,
        subcategoriesCount: validSubServices.length > 0 ? 3 : 0,
        servicesCount: validSubServices.length,
        status,
        subServices: validSubServices,
      };
      setCategories([newCat, ...categories]);
    }

    setIsDrawerOpen(false);
  };

  const catColumns: Column<CategoryItem>[] = [
    {
      key: "name",
      header: "Category Name",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200 dark:border-brand-800 flex items-center justify-center font-bold text-sm shadow-sm">
            {row.name[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">/{row.slug}</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "subServices",
      header: "Included Sub-Services Breakdown",
      accessor: (row) => {
        const subs = row.subServices || [];
        const installCount = subs.filter((s) => s.type === "Installation").length;
        const repairCount = subs.filter((s) => s.type === "Repair").length;
        const uninstallCount = subs.filter((s) => s.type === "Uninstallation").length;
        const serviceCount = subs.filter((s) => s.type === "Servicing" || s.type === "Maintenance").length;

        return (
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            {installCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                Installation ({installCount})
              </span>
            )}
            {repairCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                Repair ({repairCount})
              </span>
            )}
            {uninstallCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold">
                Uninstallation ({uninstallCount})
              </span>
            )}
            {serviceCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Servicing ({serviceCount})
              </span>
            )}
            {subs.length === 0 && (
              <span className="text-slate-400 italic">No sub-services added</span>
            )}
          </div>
        );
      },
    },
    {
      key: "servicesCount",
      header: "Total Live Services",
      accessor: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-white">
          {(row.subServices ? row.subServices.length : row.servicesCount)} Services
        </span>
      ),
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
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => openEditDrawer(row)}
            title="Edit Category & Manage Sub-Services"
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-all text-[11px] font-bold flex items-center gap-1"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Services</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "categories"
                ? "bg-brand-500 text-white shadow-lux"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            Master Service Categories
          </button>
          <button
            onClick={() => setActiveTab("all_services")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "all_services"
                ? "bg-brand-500 text-white shadow-lux"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            Sub-Services Catalogue
          </button>
        </div>
      </div>

      {activeTab === "categories" && (
        <DataTable
          title="Category & Catalog Directory"
          description="Master service categories with integrated sub-services for Installation, Servicing, Repair & Uninstallation"
          columns={catColumns}
          data={categories}
          addButtonLabel="Add Master Category & Services"
          onAddClick={openAddDrawer}
        />
      )}

      {activeTab === "all_services" && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Sub-Services Directory (Installation, Servicing, Repair & Uninstallation)
              </h3>
              <p className="text-xs text-slate-500">
                All sub-services offered under Varanasi master categories
              </p>
            </div>
            <button
              onClick={openAddDrawer}
              className="px-4 py-2 bg-brand-500 text-white rounded-xl font-bold text-xs shadow-lux flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Sub-Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.flatMap((cat) =>
              (cat.subServices || []).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
                        {cat.name}
                      </span>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                        {sub.title}
                      </h4>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.type === "Installation"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950"
                          : sub.type === "Repair"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950"
                          : sub.type === "Uninstallation"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950"
                      }`}
                    >
                      {sub.type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {sub.duration || "45 mins"}
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      ₹{sub.price}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT MASTER CATEGORY SLIDE-OVER DRAWER */}
      {isDrawerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />
            <form
              onSubmit={handleSaveCategory}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200 dark:border-brand-800 shadow-lux">
                    <FolderPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                      {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add Master Category"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Define category basics & add sub-services (Installation, Repair, Uninstallation, Servicing)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Quick Presets Bar */}
                <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 space-y-2">
                  <span className="font-extrabold text-xs text-brand-900 dark:text-brand-300 block">
                    ⚡ Quick Category Presets (1-Click Auto-Fill)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={loadACPresets}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-brand-200 dark:border-brand-800 text-xs font-bold text-brand-700 dark:text-brand-300 hover:bg-brand-500 hover:text-white transition-colors"
                    >
                      ❄️ AC Package (Installation, Servicing, Repair, Uninstallation)
                    </button>
                  </div>
                </div>

                {/* Section 1: Master Category Basics */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm block border-b border-slate-200 dark:border-slate-700 pb-2">
                    1. Master Category Information
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Category Title *
                      </label>
                      <input
                        type="text"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="e.g. AC Servicing & Repair"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Slug URL
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="ac"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Sub-Services & Offerings Builder */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-brand-600" />
                      <span>2. Sub-Services & Service Offerings ({formSubServices.length})</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddSubServiceRow}
                      className="px-3 py-1.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lux flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Sub-Service</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formSubServices.map((sub, idx) => (
                      <div
                        key={sub.id || idx}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-[11px] text-slate-500">
                            Service #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubServiceRow(idx)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                            title="Remove Sub-Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                              Sub-Service Title *
                            </label>
                            <input
                              type="text"
                              value={sub.title}
                              onChange={(e) => handleUpdateSubServiceRow(idx, "title", e.target.value)}
                              placeholder="e.g. Split AC Installation / Uninstallation"
                              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                              Service Offering Type *
                            </label>
                            <select
                              value={sub.type}
                              onChange={(e) => handleUpdateSubServiceRow(idx, "type", e.target.value)}
                              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
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
                              Base Price (₹) *
                            </label>
                            <input
                              type="number"
                              value={sub.price}
                              onChange={(e) => handleUpdateSubServiceRow(idx, "price", Number(e.target.value))}
                              placeholder="699"
                              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={sub.duration || "45 mins"}
                              onChange={(e) => handleUpdateSubServiceRow(idx, "duration", e.target.value)}
                              placeholder="e.g. 60 mins"
                              className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3 bg-slate-50 dark:bg-slate-800/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-extrabold text-xs shadow-lux transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Category & Sub-Services</span>
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
