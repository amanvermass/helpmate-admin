"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialCategories, CategoryItem, initialSubCategories, SubCategoryItem, initialPackages, PackageItem } from "@/lib/mockData";
import { Sliders, Plus, CheckCircle2, Layers, Package } from "lucide-react";

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
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Category & Catalog Management</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure master categories, subcategories, add-on items, and combo packages</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(["categories", "subcategories", "addons", "packages"] as const).map((tab) => (
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
        title="Category Directory"
        description="Master service categories offered across Varanasi"
        columns={catColumns}
        data={categories}
        addButtonLabel="Add Master Category"
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCategory} className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Category</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category Title</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Appliance Repair"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-brand-500 text-white rounded-xl font-bold text-xs">Save Category</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
