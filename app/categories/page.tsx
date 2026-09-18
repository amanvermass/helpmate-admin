"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { RowActionMenu } from "@/components/RowActionMenu";
import { Portal } from "@/components/Portal";
import { TableImage } from "@/components/TableImage";
import {
  initialCategories,
  CategoryItem,
} from "@/lib/mockData";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  toggleCategoryStatusApi,
  ApiCategory,
  formatImageUrl,
} from "@/lib/api";
import { CustomSelect } from "@/components/CustomSelect";
import { ShimmerRow, ShimmerCardGrid } from "@/components/ShimmerLoader";
import {
  Sliders,
  Plus,
  CheckCircle2,
  X,
  Wrench,
  Edit,
  Layers,
  Upload,
  ArrowRight,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

function CategoryIconDisplay({ iconUrl, name, sizeClassName = "w-full h-full" }: { iconUrl?: string; name: string; sizeClassName?: string }) {
  return (
    <TableImage
      src={iconUrl}
      alt={name || "Category Icon"}
      containerClassName={`${sizeClassName} flex items-center justify-center relative overflow-hidden`}
      className="w-full h-full object-contain"
      fallbackIcon="image"
    />
  );
}

export default function CategoriesPage() {
  // Tab State: "masterTable" is 1st tab & default active
  const [activeCategoryTab, setActiveCategoryTab] = useState<"masterTable" | "serviceIcons">("masterTable");

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    // Base catalog list initialized with fallback media API paths
    const baseList: CategoryItem[] = [
      { id: "cat-1", name: "Air Conditioner", slug: "ac", icon: "Wrench", subcategoriesCount: 4, subcategories: ["Split AC", "Window AC", "Cassette AC", "Inverter AC"], servicesCount: 12, status: "Active" },
      { id: "cat-2", name: "Appliances", slug: "appliances", icon: "Tv", subcategoriesCount: 3, subcategories: ["Refrigerator Repair", "Washing Machine", "Microwave & Oven"], servicesCount: 10, status: "Active" },
      { id: "cat-3", name: "Cleaning", slug: "cleaning", icon: "Sparkles", subcategoriesCount: 5, subcategories: ["Full House Deep Clean", "Kitchen Degreasing", "Bathroom Hydro Scrub"], servicesCount: 18, status: "Active" },
      { id: "cat-4", name: "Plumbing", slug: "plumbing", icon: "Droplets", subcategoriesCount: 3, subcategories: ["Tap & Mixer", "Toilet & Tank", "Drain Unclogging"], servicesCount: 8, status: "Active" },
      { id: "cat-5", name: "Electrician", slug: "electrician", icon: "Zap", subcategoriesCount: 3, subcategories: ["MCB & Switchboard", "Wiring & Fuse", "Fan & Chandelier"], servicesCount: 10, status: "Active" },
      { id: "cat-6", name: "Carpenter", slug: "carpenter", icon: "Hammer", subcategoriesCount: 4, subcategories: ["Door Lock Repair", "Furniture Assembly", "Wooden Almirah Fitting"], servicesCount: 7, status: "Active" },
      { id: "cat-7", name: "Painting", slug: "painting", icon: "Paintbrush", subcategoriesCount: 3, subcategories: ["Full House Painting", "Waterproofing", "Wall Texture & Stencil"], servicesCount: 6, status: "Active" },
      { id: "cat-8", name: "Pest Control", slug: "pest-control", icon: "Bug", subcategoriesCount: 3, subcategories: ["Cockroach Control", "Termite Treatment", "Bedbug Removal"], servicesCount: 5, status: "Active" },
    ];

    return baseList.map((c) => ({
      ...c,
      iconUrl: c.iconUrl || (c.id && c.id.length === 24 ? `/api/media/category/${c.id}/icon` : ""),
    }));
  });

  // Loading state for Shimmer Loader
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch Categories from Backend API
  const fetchCategoriesFromBackend = async () => {
    setIsLoading(true);
    try {
      const res = await getCategoriesApi();
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: CategoryItem[] = res.data.map((c: ApiCategory) => {
          const apiIcon = c.iconUrl || (c as any).icon || (c._id ? `/api/media/category/${c._id}/icon` : "");
          return {
            id: c._id,
            name: c.categoryName,
            slug: c.slug,
            icon: "Wrench",
            iconUrl: apiIcon,
            subcategories: c.subCategories ? c.subCategories.map((sub) => sub.name) : [],
            subcategoriesCount: c.subCategories ? c.subCategories.length : 0,
            servicesCount: 0,
            status: c.status ? "Active" : "Inactive",
          };
        });
        setCategories(mapped);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesFromBackend();
  }, []);

  // Add / Edit Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; cat: CategoryItem } | null>(null);

  const handleDeleteCategory = (cat: CategoryItem) => {
    setDeleteModal({ open: true, cat });
  };

  const confirmDeleteCategory = async () => {
    if (!deleteModal) return;
    const catToDelete = deleteModal.cat;

    if (catToDelete.id.length === 24) {
      await deleteCategoryApi(catToDelete.id);
    }
    setCategories((prev) => prev.filter((c) => c.id !== catToDelete.id));
    if (editingCategory?.id === catToDelete.id) {
      setIsDrawerOpen(false);
    }
    setDeleteModal(null);
  };

  const handleToggleCategoryStatus = async (cat: CategoryItem) => {
    const newStatusBool = cat.status !== "Active";
    const newStatusStr: "Active" | "Inactive" = newStatusBool ? "Active" : "Inactive";

    if (cat.id.length === 24) {
      await toggleCategoryStatusApi(cat.id, newStatusBool);
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, status: newStatusStr } : c))
    );
  };

  // Form States
  const [catName, setCatName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("Wrench");
  const [primaryIconUrl, setPrimaryIconUrl] = useState("");
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
    setPrimaryIconUrl("");
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
    setPrimaryIconUrl(cat.iconUrl || "");
    setStatus(cat.status);
    setSubcategoriesList(cat.subcategories || []);
    setSubCategoryInput("");
    setIsDrawerOpen(true);
  };

  const handleIconUpload = (catId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCategories((prev) =>
        prev.map((c) =>
          c.id === catId
            ? {
              ...c,
              iconUrl: result,
            }
            : c
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const finalSlug = slug.trim() || catName.trim().toLowerCase().replace(/\s+/g, "-");
    const subCatsPayload = subcategoriesList.map((name) => ({ name }));

    if (editingCategory) {
      if (editingCategory.id.length === 24) {
        await updateCategoryApi(editingCategory.id, {
          categoryName: catName.trim(),
          slug: finalSlug,
          iconUrl: primaryIconUrl,
          subCategories: subCatsPayload,
          status: status === "Active",
        });
        await fetchCategoriesFromBackend();
      } else {
        const updatedList = categories.map((c) =>
          c.id === editingCategory.id
            ? {
              ...c,
              name: catName,
              slug: finalSlug,
              icon,
              iconUrl: primaryIconUrl,
              status,
              subcategories: subcategoriesList,
              subcategoriesCount: subcategoriesList.length,
            }
            : c
        );
        setCategories(updatedList);
      }
    } else {
      const apiRes = await createCategoryApi({
        categoryName: catName.trim(),
        slug: finalSlug,
        iconUrl: primaryIconUrl,
        subCategories: subCatsPayload,
        status: status === "Active",
      });

      if (apiRes.success && apiRes.data) {
        await fetchCategoriesFromBackend();
      } else {
        const newCat: CategoryItem = {
          id: `cat-${Date.now()}`,
          name: catName,
          slug: finalSlug,
          icon,
          iconUrl: primaryIconUrl,
          subcategories: subcategoriesList,
          subcategoriesCount: subcategoriesList.length,
          servicesCount: 0,
          status,
        };
        setCategories([newCat, ...categories]);
      }
    }

    setIsDrawerOpen(false);
  };

  const catColumns: Column<CategoryItem>[] = [
    {
      key: "name",
      header: "Category Title & Primary Icon",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <TableImage
            src={row.iconUrl || (row.id && row.id.length === 24 ? `/api/media/category/${row.id}/icon` : "")}
            alt={row.name}
            containerClassName="w-10 h-10 rounded-2xl overflow-hidden border-2 border-purple-500 bg-slate-50 dark:bg-slate-800 shadow-sm shrink-0 flex items-center justify-center p-0.5 relative group"
            fallbackIcon="image"
          />
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
        const subs = row.subcategories || ["Repair", "Servicing", "Installation"];
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
          {row.servicesCount || 8} Services
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${row.status === "Active"
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
      sticky: "right",
      accessor: (row) => (
        <RowActionMenu
          actions={[
            {
              label: row.status === "Active" ? "Set Inactive" : "Set Active",
              icon: CheckCircle2,
              onClick: () => handleToggleCategoryStatus(row),
            },
            {
              label: "Edit",
              icon: Edit,
              onClick: () => openEditDrawer(row),
            },
            {
              label: "Delete",
              icon: Trash2,
              onClick: () => handleDeleteCategory(row),
              danger: true,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Simple Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-brand-600" />
            <span>Master Category Table & Main Service Icons</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            View the Master Category Table or manage custom dual-tone SVG/image icons for Air Conditioner, Appliances, Cleaning, Plumbing, Electrician, Carpenter, Painting & Pest Control.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddDrawer}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* TABS BAR: 1st Tab = "Master Category Table", 2nd Tab = "Main Service Icons" */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold w-fit">
        <button
          type="button"
          onClick={() => setActiveCategoryTab("masterTable")}
          className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeCategoryTab === "masterTable"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <Sliders className="w-4 h-4 text-brand-600" />
          <span>Master Category Table</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategoryTab("serviceIcons")}
          className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeCategoryTab === "serviceIcons"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <ImageIcon className="w-4 h-4 text-purple-600" />
          <span>Main Service Icons</span>
        </button>
      </div>

      {/* FIRST TAB: MASTER CATEGORY TABLE */}
      {activeCategoryTab === "masterTable" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Master Category Directory & Service Records
            </h3>
            <span className="text-xs font-bold text-slate-400">
              Showing {categories.length} Master Categories
            </span>
          </div>
          {isLoading ? (
            <ShimmerRow count={6} />
          ) : (
            <DataTable
              columns={catColumns}
              data={categories}
              searchPlaceholder="Search category title or slug..."
            />
          )}
        </div>
      )}

      {/* SECOND TAB: MAIN SERVICE ICONS (Visual 8-Card Grid matching Screenshot) */}
      {activeCategoryTab === "serviceIcons" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Main Service Icons Visual Manager
                </h2>
                <p className="text-xs text-slate-400">
                  Matches your app home screen cards layout. Upload custom SVG or PNG icons directly per category card!
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {categories.length} Primary Icons
            </span>
          </div>

          {/* 4x2 Responsive Category Card Grid matching user's screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 relative group min-h-[260px]"
              >
                {/* TOP DUAL-TONE VECTOR / UPLOADED ICON PREVIEW BOX */}
                <div className="relative w-full h-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-4 shadow-xs group-hover:scale-103 transition-transform">
                  <CategoryIconDisplay iconUrl={cat.iconUrl} name={cat.name} sizeClassName="w-20 h-20" />
                </div>

                {/* PROMINENT ICON UPLOAD BAR */}
                <div className="pt-3 pb-2 flex items-center">
                  <label className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Icon</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleIconUpload(cat.id, file);
                      }}
                    />
                  </label>
                </div>

                {/* BOTTOM TITLE AND ARROW */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {cat.name}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditDrawer(cat)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      title="Edit Category Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                      {editingCategory ? "Edit Category" : "Add Category"}
                    </h3>
                    <p className="text-xs text-slate-500">Configure category titles, custom primary icon, and 2nd image icon</p>
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
                    1. Master Category Details
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
                        placeholder="e.g. Air Conditioner"
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
                        placeholder="e.g. ac"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-brand-500"
                      />
                    </div>

                    <CustomSelect
                      label="Status *"
                      value={status}
                      onChange={(val) => setStatus(val as any)}
                      options={[
                        { value: "Active", label: "Active (Live on Website)" },
                        { value: "Inactive", label: "Inactive (Disabled)" },
                      ]}
                    />
                  </div>
                </div>

                {/* PRIMARY CATEGORY ICON & SECOND IMAGE ICON UPLOADS */}
                <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 space-y-4">
                  <span className="font-extrabold text-brand-900 dark:text-brand-300 text-sm block border-b border-brand-200 dark:border-brand-800 pb-2">
                    2. Primary Category Icon & Second Image Icon
                  </span>

                  {/* Primary Icon Upload */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Primary Category Icon Image</span>
                      <span className="text-brand-600 font-extrabold text-[10px] uppercase">Upload or URL</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-purple-500 shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-1">
                        <CategoryIconDisplay iconUrl={primaryIconUrl} name={catName || editingCategory?.name || ""} />
                      </div>
                      <label className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shrink-0 shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Icon</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (re) => {
                                setPrimaryIconUrl(re.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        value={primaryIconUrl}
                        onChange={(e) => setPrimaryIconUrl(e.target.value)}
                        placeholder="Icon image URL..."
                        className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-[10px] outline-none"
                      />
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
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-purple-900 dark:text-purple-300 block">
                      + Add Subcategory Tag
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
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-2.5 bg-slate-50 dark:bg-slate-800/40 shrink-0">
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(editingCategory)}
                    className="p-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-xs transition-colors flex items-center justify-center cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-extrabold text-xs shadow-lux transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingCategory ? "Edit Category" : "Add Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal?.open && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center border border-rose-200 dark:border-rose-800">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Delete Category?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to delete <strong>{deleteModal.cat.name}</strong>? This action will remove it from your master category catalog.
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteCategory}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-colors"
                >
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
