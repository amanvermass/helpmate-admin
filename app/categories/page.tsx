"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { RowActionMenu } from "@/components/RowActionMenu";
import { Portal } from "@/components/Portal";
import {
  initialCategories,
  CategoryItem,
} from "@/lib/mockData";
import { CustomSelect } from "@/components/CustomSelect";
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

// EXACT DUAL-TONE VECTOR ICONS MATCHING USER'S SCREENSHOT
function AirConditionerSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="36" height="16" rx="3" stroke="#4C1D4F" strokeWidth="2.5" fill="#FDF4FF" />
      <circle cx="34" cy="20" r="1.5" fill="#10B981" />
      <line x1="10" y1="24" x2="38" y2="24" stroke="#4C1D4F" strokeWidth="1.5" strokeDasharray="2 2" />
      <path d="M12 34L14 39" stroke="#E056FD" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M19 34L21 39" stroke="#E056FD" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 34L28 39" stroke="#E056FD" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M33 34L35 39" stroke="#E056FD" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function AppliancesSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="14" height="28" rx="2" stroke="#4C1D4F" strokeWidth="2.5" fill="#FDF4FF" />
      <line x1="8" y1="22" x2="22" y2="22" stroke="#4C1D4F" strokeWidth="2" />
      <line x1="18" y1="14" x2="18" y2="18" stroke="#4C1D4F" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="26" x2="18" y2="32" stroke="#4C1D4F" strokeWidth="2" strokeLinecap="round" />

      <rect x="24" y="18" width="16" height="20" rx="2" stroke="#4C1D4F" strokeWidth="2.5" fill="#FDF4FF" />
      <circle cx="32" cy="29" r="4.5" stroke="#E056FD" strokeWidth="2.5" fill="#FAF5FA" />
      <circle cx="28" cy="22" r="1" fill="#4C1D4F" />
      <circle cx="32" cy="22" r="1" fill="#4C1D4F" />
    </svg>
  );
}

function CleaningSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="24" y="24" width="14" height="12" rx="4" stroke="#4C1D4F" strokeWidth="2.5" fill="#FDF4FF" />
      <circle cx="28" cy="34" r="2.5" stroke="#4C1D4F" strokeWidth="2" fill="#E056FD" />
      <circle cx="34" cy="34" r="2.5" stroke="#4C1D4F" strokeWidth="2" fill="#E056FD" />
      <path d="M26 24C26 18 20 12 14 16" stroke="#4C1D4F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 16L10 32" stroke="#4C1D4F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 32H16" stroke="#4C1D4F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="26" x2="43" y2="24" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="39" y1="31" x2="44" y2="30" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlumbingSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 36V16C14 12 18 8 24 8C30 8 34 12 34 16V22" stroke="#4C1D4F" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="30" y="22" width="8" height="5" rx="1" fill="#4C1D4F" />
      <path d="M34 29C34 29 30 34 34 37C36.2 37 38 35.2 38 33C38 31 34 29 34 29Z" fill="#3B82F6" stroke="#2563EB" strokeWidth="1.5" />
      <line x1="10" y1="36" x2="18" y2="36" stroke="#4C1D4F" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ElectricianSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="22" r="12" stroke="#4C1D4F" strokeWidth="2.5" fill="#FDF4FF" />
      <path d="M25 15L20 23H25L23 29L29 21H24L25 15Z" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
      <path d="M24 34C18 34 12 32 14 42" stroke="#E056FD" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="22" y="8" width="4" height="2" fill="#4C1D4F" />
    </svg>
  );
}

function CarpenterSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="30" width="28" height="6" rx="1" stroke="#4C1D4F" strokeWidth="2" fill="#FED7AA" />
      <line x1="14" y1="36" x2="12" y2="42" stroke="#4C1D4F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="34" y1="36" x2="36" y2="42" stroke="#4C1D4F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 30L26 12L32 14L28 30" stroke="#4C1D4F" strokeWidth="2" fill="#E2E8F0" />
      <circle cx="27" cy="13" r="3" fill="#EF4444" stroke="#4C1D4F" strokeWidth="2" />
      <line x1="23" y1="30" x2="25" y2="30" stroke="#EF4444" strokeWidth="3" />
    </svg>
  );
}

function PaintingSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="10" width="18" height="8" rx="2" stroke="#4C1D4F" strokeWidth="2.5" fill="#FDF4FF" />
      <path d="M34 14H38V24H26V30" stroke="#4C1D4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="23" y="30" width="6" height="12" rx="1" fill="#4C1D4F" />
      <path d="M10 10H14" stroke="#E056FD" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 18V24" stroke="#E056FD" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PestControlSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="18" width="16" height="22" rx="4" stroke="#4C1D4F" strokeWidth="2.5" fill="#FDF4FF" />
      <circle cx="24" cy="29" r="4" stroke="#4C1D4F" strokeWidth="2" fill="#FAF5FA" />
      <path d="M22 29L26 29M24 27L24 31" stroke="#E056FD" strokeWidth="2" />
      <path d="M24 18V12H28" stroke="#4C1D4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12H28" stroke="#4C1D4F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 24V34" stroke="#4C1D4F" strokeWidth="2" strokeDasharray="2 2" />
    </svg>
  );
}

const renderVectorIconByName = (name: string) => {
  switch (name) {
    case "Air Conditioner":
      return <AirConditionerSVG />;
    case "Appliances":
      return <AppliancesSVG />;
    case "Cleaning":
      return <CleaningSVG />;
    case "Plumbing":
      return <PlumbingSVG />;
    case "Electrician":
      return <ElectricianSVG />;
    case "Carpenter":
      return <CarpenterSVG />;
    case "Painting":
      return <PaintingSVG />;
    case "Pest Control":
      return <PestControlSVG />;
    default:
      return <AirConditionerSVG />;
  }
};

export default function CategoriesPage() {
  // Tab State: "masterTable" is 1st tab & default active
  const [activeCategoryTab, setActiveCategoryTab] = useState<"masterTable" | "serviceIcons">("masterTable");

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    // Ensure all 8 categories exist
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
      iconUrl: c.iconUrl || "",
    }));
  });

  // Add / Edit Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; cat: CategoryItem } | null>(null);

  const handleDeleteCategory = (cat: CategoryItem) => {
    setDeleteModal({ open: true, cat });
  };

  const confirmDeleteCategory = () => {
    if (!deleteModal) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteModal.cat.id));
    if (editingCategory?.id === deleteModal.cat.id) {
      setIsDrawerOpen(false);
    }
    setDeleteModal(null);
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
              iconUrl: primaryIconUrl,
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
        iconUrl: primaryIconUrl,
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
      header: "Category Title & Primary Icon",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-purple-500 bg-slate-50 dark:bg-slate-800 shadow-sm shrink-0 flex items-center justify-center p-1">
            {row.iconUrl ? (
              <img src={row.iconUrl} alt={row.name} className="w-full h-full object-contain" />
            ) : (
              renderVectorIconByName(row.name)
            )}
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
      sticky: "right",
      accessor: (row) => (
        <RowActionMenu
          actions={[
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
          <span>Add New Category</span>
        </button>
      </div>

      {/* TABS BAR: 1st Tab = "Master Category Table", 2nd Tab = "Main Service Icons" */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold w-fit">
        <button
          type="button"
          onClick={() => setActiveCategoryTab("masterTable")}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeCategoryTab === "masterTable"
              ? "bg-purple-600 text-white shadow-lux"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Master Category Table</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCategoryTab("serviceIcons")}
          className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeCategoryTab === "serviceIcons"
              ? "bg-purple-600 text-white shadow-lux"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
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
          <DataTable
            columns={catColumns}
            data={categories}
            searchPlaceholder="Search category title or slug..."
          />
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
                  {cat.iconUrl ? (
                    <img
                      src={cat.iconUrl}
                      alt={cat.name}
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    renderVectorIconByName(cat.name)
                  )}
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
                      {editingCategory ? `Manage Category Icons: ${editingCategory.name}` : "Add New Master Category"}
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
                        {primaryIconUrl ? (
                          <img
                            src={primaryIconUrl}
                            alt="Primary Icon"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          editingCategory ? renderVectorIconByName(editingCategory.name) : <AirConditionerSVG />
                        )}
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
                  <span>Save Category & Icons</span>
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
