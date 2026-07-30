"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { Portal } from "@/components/Portal";
import {
  initialCategories,
  CategoryItem,
} from "@/lib/mockData";
import {
  Sliders,
  Plus,
  CheckCircle2,
  X,
  Wrench,
  Edit,
  Layers,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    return initialCategories.map((c, idx) => ({
      ...c,
      subcategories: c.subcategories || (
        idx === 0
          ? ["Split AC", "Window AC", "Cassette AC / Commercial", "Inverter AC"]
          : idx === 1
          ? ["Full House Deep Clean", "Kitchen Degreasing", "Bathroom Scrub"]
          : idx === 2
          ? ["MCB & Switchboard", "Wiring & Fuse", "Fan & Chandelier"]
          : ["Tap & Mixer", "Toilet & Tank", "Drain Unclogging"]
      ),
    }));
  });

  // Add / Edit Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form States
  const [catName, setCatName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Wrench");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  // Subcategories Multi-Add Form State
  const [subcategoriesList, setSubcategoriesList] = useState<string[]>([]);
  const [subCategoryInput, setSubCategoryInput] = useState("");

  const handleAddSubcategoryTag = () => {
    if (!subCategoryInput.trim()) return;
    const tag = subCategoryInput.trim();
    if (!subcategoriesList.includes(tag)) {
      setSubcategoriesList([...subcategoriesList, tag]);
    }
    setSubCategoryInput("");
  };

  const handleRemoveSubcategoryTag = (tag: string) => {
    setSubcategoriesList(subcategoriesList.filter((t) => t !== tag));
  };

  const openAddDrawer = () => {
    setEditingCategory(null);
    setCatName("");
    setSlug("");
    setIcon("Wrench");
    setStatus("Active");
    setSubcategoriesList([]);
    setSubCategoryInput("");
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon || "Wrench");
    setStatus(cat.status);
    setSubcategoriesList(cat.subcategories || []);
    setSubCategoryInput("");
    setIsDrawerOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCategory) {
      const updatedList = categories.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              name: catName,
              slug: slug || catName.toLowerCase().replace(/\s+/g, "-"),
              icon,
              status,
              subcategories: subcategoriesList,
              subcategoriesCount: subcategoriesList.length,
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
        subcategories: subcategoriesList,
        subcategoriesCount: subcategoriesList.length,
        servicesCount: 0,
        status,
      };
      setCategories([newCat, ...categories]);
    }

    setIsDrawerOpen(false);
  };

  const catColumns: Column<CategoryItem>[] = [
    {
      key: "name",
      header: "Master Service Category",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 dark:text-white text-xs">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">slug: /{row.slug}</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "subcategories",
      header: "Subcategories",
      accessor: (row) => {
        const subs = row.subcategories || ["Split AC", "Window AC", "Commercial AC"];
        return (
          <div className="flex flex-wrap gap-1 items-center max-w-xs">
            {subs.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-extrabold text-[10px] border border-purple-200 dark:border-purple-800 flex items-center gap-1"
              >
                <Layers className="w-2.5 h-2.5" />
                {s}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "servicesCount",
      header: "Live Services Count",
      accessor: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-white">
          {row.servicesCount || (row.subServices ? row.subServices.length : 0)} Services
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
            title="Edit Master Category"
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-all text-[11px] font-bold flex items-center gap-1"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Category</span>
          </button>
        </div>
      ),
    },
  ];

  const activeCategoriesCount = categories.filter((c) => c.status === "Active").length;

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" /> Category Directory
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Master Service Categories</h1>
          <p className="text-xs text-brand-100 mt-1 max-w-xl">
            Configure master service categories across HVAC, Electrical, Plumbing, Cleaning & Appliance Repair for Varanasi operations.
          </p>
        </div>

        <button
          onClick={openAddDrawer}
          className="px-4 py-2.5 rounded-2xl bg-white text-brand-900 font-extrabold text-xs shadow-md hover:bg-brand-50 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-brand-600" />
          <span>Add Master Category</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Categories</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200">
              <Sliders className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{categories.length} Categories</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Categories</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600">{activeCategoriesCount} Active</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Service City Hub</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">Varanasi</span>
        </div>
      </div>

      {/* Master Categories Directory Table */}
      <DataTable
        columns={catColumns}
        data={categories}
        searchPlaceholder="Search category title or slug..."
      />

      {/* SLIDE-OVER ADD/EDIT CATEGORY DRAWER */}
      {isDrawerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex justify-end outline-none">
            <form
              onSubmit={handleSaveCategory}
              className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200 dark:border-brand-800 shadow-sm">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add New Master Category"}
                    </h3>
                    <p className="text-xs text-slate-500">Configure master category title and slug URL</p>
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
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm block border-b border-slate-200 dark:border-slate-700 pb-2">
                    Master Category Details
                  </span>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Category Title *
                      </label>
                      <input
                        type="text"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="e.g. AC Servicing & Repair"
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500 text-sm"
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
                        placeholder="e.g. ac-service"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Status *
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500"
                      >
                        <option value="Active">Active (Live in Varanasi)</option>
                        <option value="Inactive">Inactive (Disabled)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Subcategories Multi-Add Section */}
                <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800 pb-2">
                    <span className="font-extrabold text-purple-900 dark:text-purple-300 text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      Category Subcategories
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
                      Multi-Add Options
                    </span>
                  </div>

                  {/* 1. Multi-Add Input Field ABOVE */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-purple-900 dark:text-purple-300 block">
                      + Add Subcategory (e.g. Split AC, Window AC, Commercial AC)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={subCategoryInput}
                        onChange={(e) => setSubCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSubcategoryTag();
                          }
                        }}
                        placeholder="Type subcategory (e.g. Split AC)..."
                        className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddSubcategoryTag}
                        className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-lux flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        Add Tag
                      </button>
                    </div>
                  </div>

                  {/* 2. Display Subcategory Tag Pills BELOW */}
                  <div className="pt-3 border-t border-purple-200/60 dark:border-purple-900/50 space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                      Added Subcategories ({subcategoriesList.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5 min-h-[36px]">
                      {subcategoriesList.length > 0 ? (
                        subcategoriesList.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 font-extrabold text-xs flex items-center gap-1.5 shadow-xs"
                          >
                            <Layers className="w-3 h-3 text-purple-500" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveSubcategoryTag(tag)}
                              className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                              title="Remove subcategory tag"
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
