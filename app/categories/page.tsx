"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { Portal } from "@/components/Portal";
import { initialCategories, CategoryItem, initialSubCategories, SubCategoryItem, initialPackages, PackageItem } from "@/lib/mockData";
import { Sliders, Plus, CheckCircle2, Layers, Package, X } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories" | "addons" | "packages">("categories");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [catName, setCatName] = useState("");
  const [slug, setSlug] = useState("");

  const catColumns: Column<CategoryItem>[] = [
    { key: "name", header: "Category Name", sortable: true },
    { key: "slug", header: "Slug URL", sortable: true },
    { key: "subcategoriesCount", header: "Subcategories", sortable: true },
    { key: "servicesCount", header: "Live Services", sortable: true },
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
            onClick={() => alert(`Editing ${row.name}`)}
            title="Edit Category"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    const newItem: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: catName,
      slug: slug || catName.toLowerCase().replace(/\s+/g, "-"),
      icon: "Wrench",
      subcategoriesCount: 0,
      servicesCount: 0,
      status: "Active",
    };

    setCategories([newItem, ...categories]);
    setCatName("");
    setSlug("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Main DataTable matching User Management layout */}
      <DataTable
        title="Category & Catalog Directory"
        description="Master service categories, subcategories & live packages offered across Varanasi"
        columns={catColumns}
        data={categories}
        addButtonLabel="Add Master Category"
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* Add Category Slide-Over Drawer */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddOpen(false)} />
            <form
              onSubmit={handleAddCategory}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Category</h3>
                  <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category Title *</label>
                    <input
                      type="text"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      placeholder="e.g. Appliance Repair"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Slug URL</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="appliance-repair"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl font-bold text-xs shadow-lux">Save Category</button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
