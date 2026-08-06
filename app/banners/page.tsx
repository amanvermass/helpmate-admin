"use client";

import { useState } from "react";
import { Portal } from "@/components/Portal";
import { DataTable, Column } from "@/components/DataTable";
import { initialCategories, CategoryItem } from "@/lib/mockData";
import {
  Megaphone,
  Upload,
  Eye,
  Image as ImageIcon,
  Sparkles,
  X,
  Plus,
  Link as LinkIcon,
  CheckCircle2,
  Sliders,
  Edit,
  Layers,
  Power,
  Trash2,
} from "lucide-react";

interface PromoBannerItem {
  id: string;
  title: string;
  location: "Homepage Top Carousel" | "Category Offer Banner" | "Checkout Promo";
  imageUrl: string;
  secondImageIconUrl?: string;
  targetUrl: string;
  status: "Active" | "Inactive";
}

export default function BannersPage() {
  const [activeTab, setActiveTab] = useState<"popupModal" | "secondIcons" | "homepageBanners">("popupModal");

  // WEBSITE VISITOR PURE IMAGE POPUP BANNER STATE
  const [isBannerEnabled, setIsBannerEnabled] = useState(true);
  const [bannerImageUrl, setBannerImageUrl] = useState(
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80"
  );
  const [secondBannerIconUrl, setSecondBannerIconUrl] = useState(
    "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&auto=format&fit=crop&q=80"
  );
  const [targetLinkUrl, setTargetLinkUrl] = useState("https://helpmate-theta.vercel.app/services/ac");
  const [isBannerPreviewOpen, setIsBannerPreviewOpen] = useState(false);

  // CATEGORY SECOND IMAGE ICONS STATE
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    return initialCategories.map((c, idx) => ({
      ...c,
      iconUrl:
        c.iconUrl ||
        (idx === 0
          ? "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=120&auto=format&fit=crop&q=80"
          : idx === 1
          ? "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120&auto=format&fit=crop&q=80"
          : idx === 2
          ? "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=120&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=120&auto=format&fit=crop&q=80"),
      secondImageIconUrl:
        c.secondImageIconUrl ||
        "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=120&auto=format&fit=crop&q=80",
    }));
  });

  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [editPrimaryIcon, setEditPrimaryIcon] = useState("");
  const [editSecondIcon, setEditSecondIcon] = useState("");

  // HOMEPAGE PROMO BANNERS STATE
  const [promoBanners, setPromoBanners] = useState<PromoBannerItem[]>([
    {
      id: "b-1",
      title: "Summer AC Servicing Special Offer - 15% OFF",
      location: "Homepage Top Carousel",
      imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80",
      secondImageIconUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&auto=format&fit=crop&q=80",
      targetUrl: "https://helpmate-theta.vercel.app/services/ac",
      status: "Active",
    },
    {
      id: "b-2",
      title: "Deep Home Cleaning & Sanitization Deal",
      location: "Category Offer Banner",
      imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80",
      secondImageIconUrl: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=300&auto=format&fit=crop&q=80",
      targetUrl: "https://helpmate-theta.vercel.app/services/cleaning",
      status: "Active",
    },
  ]);

  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState("");
  const [newBannerLocation, setNewBannerLocation] = useState<"Homepage Top Carousel" | "Category Offer Banner" | "Checkout Promo">("Homepage Top Carousel");
  const [newBannerImageUrl, setNewBannerImageUrl] = useState("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80");
  const [newBannerSecondIconUrl, setNewBannerSecondIconUrl] = useState("https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&auto=format&fit=crop&q=80");
  const [newBannerTargetUrl, setNewBannerTargetUrl] = useState("https://helpmate-theta.vercel.app/services/ac");

  const openEditCategoryIcons = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setEditPrimaryIcon(cat.iconUrl || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=120&auto=format&fit=crop&q=80");
    setEditSecondIcon(cat.secondImageIconUrl || "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=120&auto=format&fit=crop&q=80");
  };

  const handleSaveCategoryIcons = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === editingCategory.id
          ? {
              ...c,
              iconUrl: editPrimaryIcon,
              secondImageIconUrl: editSecondIcon,
            }
          : c
      )
    );
    setEditingCategory(null);
  };

  const handleCreatePromoBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim()) return;

    const newBanner: PromoBannerItem = {
      id: `b-${Date.now()}`,
      title: newBannerTitle.trim(),
      location: newBannerLocation,
      imageUrl: newBannerImageUrl,
      secondImageIconUrl: newBannerSecondIconUrl,
      targetUrl: newBannerTargetUrl,
      status: "Active",
    };

    setPromoBanners([newBanner, ...promoBanners]);
    setNewBannerTitle("");
    setIsAddBannerOpen(false);
  };

  const categoryIconColumns: Column<CategoryItem>[] = [
    {
      key: "name",
      header: "Category Title & Icons",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2 shrink-0">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-brand-500 bg-slate-100 dark:bg-slate-800 shadow-sm z-10">
              <img
                src={row.iconUrl || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=120&auto=format&fit=crop&q=80"}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            </div>
            {row.secondImageIconUrl && (
              <div className="w-8 h-8 rounded-2xl overflow-hidden border-2 border-purple-500 bg-slate-100 dark:bg-slate-800 shadow-sm">
                <img
                  src={row.secondImageIconUrl}
                  alt="2nd Icon Badge"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 dark:text-white text-xs">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">slug: /{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      key: "iconUrl",
      header: "Primary Icon Preview",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-brand-400 bg-slate-100">
            <img src={row.iconUrl} alt="Primary Icon" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] text-slate-400 max-w-[150px] truncate font-mono">{row.iconUrl}</span>
        </div>
      ),
    },
    {
      key: "secondImageIconUrl",
      header: "Second Image Icon Option",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden border border-purple-400 bg-white p-0.5">
            <img src={row.secondImageIconUrl} alt="Second Icon" className="w-full h-full object-contain" />
          </div>
          <span className="text-[10px] text-purple-600 font-mono font-bold max-w-[150px] truncate">
            {row.secondImageIconUrl || "Not Set"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <button
          type="button"
          onClick={() => openEditCategoryIcons(row)}
          className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Manage Image Icons</span>
        </button>
      ),
    },
  ];

  const promoBannerColumns: Column<PromoBannerItem>[] = [
    {
      key: "title",
      header: "Banner Title & Image",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0">
            <img src={row.imageUrl} alt={row.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 dark:text-white text-xs">{row.title}</span>
            <span className="text-[10px] text-slate-400 font-mono max-w-xs truncate">{row.targetUrl}</span>
          </div>
        </div>
      ),
    },
    {
      key: "secondImageIconUrl",
      header: "2nd Icon Badge",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {row.secondImageIconUrl ? (
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-purple-400 bg-white p-0.5">
              <img src={row.secondImageIconUrl} alt="2nd Badge" className="w-full h-full object-contain" />
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 italic">None</span>
          )}
        </div>
      ),
    },
    {
      key: "location",
      header: "Display Location",
      accessor: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          {row.location}
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
        <button
          type="button"
          onClick={() => setPromoBanners(promoBanners.filter((b) => b.id !== row.id))}
          className="p-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-all cursor-pointer"
          title="Delete Banner"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-purple-700 to-indigo-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Megaphone className="w-4 h-4" /> Promotional Banners & Popups CMS
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Website Visitor Popups & Image Banners</h1>
          <p className="text-xs text-brand-100 mt-1 max-w-xl">
            Dedicated CMS page to manage full-image visitor modal popups, 2nd image icon options, and homepage offer banners.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsBannerPreviewOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Test Live Visitor Popup</span>
          </button>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("popupModal")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "popupModal"
              ? "bg-purple-600 text-white shadow-lux"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Website Visitor Pure Image Popup</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("secondIcons")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "secondIcons"
              ? "bg-purple-600 text-white shadow-lux"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Category 2nd Image Icons</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("homepageBanners")}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "homepageBanners"
              ? "bg-purple-600 text-white shadow-lux"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Homepage Offer Banners</span>
        </button>
      </div>

      {/* TAB 1: WEBSITE VISITOR PURE IMAGE POPUP BANNER CMS */}
      {activeTab === "popupModal" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-900/60 space-y-5 shadow-lux relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Website Visitor Popup Banner CMS (Pure Image Mode)
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isBannerEnabled
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {isBannerEnabled ? "LIVE ON WEBSITE" : "DISABLED"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Controls the full-bleed image popup modal displayed when visitors open helpmate-theta.vercel.app
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Popup Status:</span>
                <button
                  type="button"
                  onClick={() => setIsBannerEnabled(!isBannerEnabled)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex items-center ${
                    isBannerEnabled ? "bg-emerald-500 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md block" />
                </button>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* MAIN POPUP BANNER IMAGE UPLOAD */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <label className="font-extrabold text-slate-900 dark:text-white text-xs block flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-brand-600" />
                  <span>1. Main Popup Banner Image (Full Pure Image Modal)</span>
                </span>
                <span className="text-[10px] text-brand-600 font-bold uppercase">Image Preview</span>
              </label>

              <div className="flex gap-3 items-center">
                <div className="w-28 h-24 rounded-2xl overflow-hidden border-2 border-brand-500 shrink-0 bg-slate-200 dark:bg-slate-700 shadow-md relative group">
                  <img
                    src={bannerImageUrl}
                    alt="Visitor Banner Image"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer w-fit shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>Upload Main Banner Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setBannerImageUrl(re.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <input
                    type="url"
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* SECOND IMAGE ICON MANAGE OPTION */}
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
              <label className="font-extrabold text-purple-900 dark:text-purple-300 text-xs block flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>2. Second Image Icon / Secondary Badge Option</span>
                </span>
                <span className="text-[10px] text-purple-600 font-bold uppercase">Badge Icon Preview</span>
              </label>

              <div className="flex gap-3 items-center">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500 shrink-0 bg-white dark:bg-slate-800 shadow-md relative group p-1">
                  <img
                    src={secondBannerIconUrl}
                    alt="Second Icon Badge"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer w-fit shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>Upload 2nd Image Icon</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => {
                            setSecondBannerIconUrl(re.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <input
                    type="url"
                    value={secondBannerIconUrl}
                    onChange={(e) => setSecondBannerIconUrl(e.target.value)}
                    placeholder="Or paste 2nd image icon URL (https://...)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TARGET REDIRECTION LINK */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="w-full sm:flex-1">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Banner Click Target URL (Website Redirection)
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="url"
                  value={targetLinkUrl}
                  onChange={(e) => setTargetLinkUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs outline-none focus:border-brand-500"
                  placeholder="https://helpmate-theta.vercel.app/services/ac"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsBannerPreviewOpen(true)}
              className="w-full sm:w-auto mt-5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Eye className="w-4 h-4 text-brand-400" />
              <span>Test Live Pure Image Popup</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORY 2ND IMAGE ICONS CMS */}
      {activeTab === "secondIcons" && (
        <div className="space-y-4">
          <DataTable
            columns={categoryIconColumns}
            data={categories}
            searchPlaceholder="Search category..."
          />
        </div>
      )}

      {/* TAB 3: HOMEPAGE OFFER BANNERS */}
      {activeTab === "homepageBanners" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Homepage Carousel & Hero Banners ({promoBanners.length})
            </h3>
            <button
              type="button"
              onClick={() => setIsAddBannerOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Offer Banner
            </button>
          </div>

          <DataTable
            columns={promoBannerColumns}
            data={promoBanners}
            searchPlaceholder="Search banner title..."
          />
        </div>
      )}

      {/* EDIT CATEGORY IMAGE ICONS MODAL */}
      {editingCategory && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Manage Image Icons: {editingCategory.name}
                    </h3>
                    <p className="text-xs text-slate-400">Configure primary icon and 2nd image icon option</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategoryIcons} className="space-y-4 text-xs">
                {/* PRIMARY ICON */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="font-bold text-slate-900 dark:text-white block flex items-center justify-between">
                    <span>Primary Category Icon Image</span>
                    <span className="text-brand-600 font-extrabold text-[10px] uppercase">Upload or URL</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-brand-500 shrink-0 bg-slate-200">
                      <img src={editPrimaryIcon} alt="Primary Icon" className="w-full h-full object-cover" />
                    </div>
                    <label className="px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shrink-0 shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Primary Icon</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (re) => setEditPrimaryIcon(re.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      value={editPrimaryIcon}
                      onChange={(e) => setEditPrimaryIcon(e.target.value)}
                      placeholder="Icon URL..."
                      className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white font-mono text-[10px]"
                    />
                  </div>
                </div>

                {/* SECOND IMAGE ICON */}
                <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-2">
                  <label className="font-bold text-purple-900 dark:text-purple-300 block flex items-center justify-between">
                    <span>Second Image Icon / Secondary Badge Option</span>
                    <span className="text-purple-600 font-extrabold text-[10px] uppercase">2nd Icon Preview</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-purple-500 shrink-0 bg-white p-0.5">
                      <img src={editSecondIcon} alt="2nd Icon" className="w-full h-full object-contain" />
                    </div>
                    <label className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shrink-0 shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload 2nd Image Icon</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (re) => setEditSecondIcon(re.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      value={editSecondIcon}
                      onChange={(e) => setEditSecondIcon(e.target.value)}
                      placeholder="Second Icon URL..."
                      className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-md cursor-pointer"
                  >
                    Save Image Icons
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* ADD HOMEPAGE OFFER BANNER MODAL */}
      {isAddBannerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Offer Banner</h3>
                <button type="button" onClick={() => setIsAddBannerOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePromoBanner} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Banner Title *</label>
                  <input
                    type="text"
                    required
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    placeholder="e.g. Special Festive 20% Discount"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Location</label>
                    <select
                      value={newBannerLocation}
                      onChange={(e) => setNewBannerLocation(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold outline-none cursor-pointer"
                    >
                      <option value="Homepage Top Carousel">Homepage Top Carousel</option>
                      <option value="Category Offer Banner">Category Offer Banner</option>
                      <option value="Checkout Promo">Checkout Promo</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Redirection URL</label>
                    <input
                      type="url"
                      value={newBannerTargetUrl}
                      onChange={(e) => setNewBannerTargetUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-[10px] outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 space-y-2">
                  <label className="font-bold text-slate-900 block flex items-center justify-between">
                    <span>Main Banner Image</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <label className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shrink-0">
                      <Upload className="w-3 h-3" /> Upload File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (re) => setNewBannerImageUrl(re.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      value={newBannerImageUrl}
                      onChange={(e) => setNewBannerImageUrl(e.target.value)}
                      placeholder="Image URL..."
                      className="flex-1 p-1.5 rounded-lg border border-slate-200 font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddBannerOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 text-white font-extrabold shadow-md"
                  >
                    Save Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* LIVE PURE IMAGE WEBSITE VISITOR POPUP PREVIEW MODAL */}
      {isBannerPreviewOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200 group">
              {/* Close Button at top right */}
              <button
                type="button"
                onClick={() => setIsBannerPreviewOpen(false)}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition-colors shadow-lg cursor-pointer"
                title="Close Visitor Modal Preview"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Pure Image Banner Container (No Text, Only Banner Image) */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] bg-slate-900">
                <img
                  src={bannerImageUrl}
                  alt="Pure Image Visitor Promo Popup Banner"
                  className="w-full h-full object-cover"
                />

                {/* Optional Second Image Icon Overlay Badge at bottom left */}
                {secondBannerIconUrl && (
                  <div className="absolute bottom-4 left-4 z-20 p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl border border-white/40 flex items-center gap-2 max-w-[200px]">
                    <img
                      src={secondBannerIconUrl}
                      alt="Second Icon Badge"
                      className="w-8 h-8 object-contain rounded-lg shrink-0"
                    />
                    <span className="text-[10px] font-extrabold text-slate-900 dark:text-white leading-tight">
                      Verified Partner Offer
                    </span>
                  </div>
                )}
              </div>

              {/* Action Bar Footer */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] font-mono truncate max-w-sm">
                  Click Target: {targetLinkUrl}
                </span>
                <button
                  type="button"
                  onClick={() => setIsBannerPreviewOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
