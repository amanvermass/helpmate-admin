"use client";

import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Users,
  X,
  Save,
  LayoutGrid,
  Layers,
  Search,
  GripVertical,
  Globe,
  CheckCircle2,
  Camera,
  ArrowRight,
} from "lucide-react";
import { Portal } from "@/components/Portal";

interface ZoneCard {
  id: string;
  name: string;
  city: string;
  proCount: number;
  imageUrl: string;
  isActive: boolean;
  areas: string[];
  sortOrder: number;
}

interface HeroSection {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  badgeText: string;
  isActive: boolean;
}

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

const initialZones: ZoneCard[] = [
  { id: "zone-1", name: "Lanka", city: "Varanasi", proCount: 120, imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&auto=format&fit=crop&q=80", isActive: true, areas: ["Assi Ghat", "Lanka", "BHU Campus", "Nagwa"], sortOrder: 1 },
  { id: "zone-2", name: "Godowlia", city: "Varanasi", proCount: 90, imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&auto=format&fit=crop&q=80", isActive: true, areas: ["Godowlia", "Dashashwamedh", "Chowk", "Thatheri Bazar"], sortOrder: 2 },
  { id: "zone-3", name: "Cantonment", city: "Varanasi", proCount: 150, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=80", isActive: true, areas: ["Cantonment", "Nadesar", "Sigra", "Mahmoorganj"], sortOrder: 3 },
  { id: "zone-4", name: "Sarnath", city: "Varanasi", proCount: 80, imageUrl: "https://images.unsplash.com/photo-1624461043579-4f2e7c8778c8?w=400&auto=format&fit=crop&q=80", isActive: true, areas: ["Sarnath", "Sunderpur", "Karundi"], sortOrder: 4 },
  { id: "zone-5", name: "Pandeypur", city: "Varanasi", proCount: 70, imageUrl: "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=400&auto=format&fit=crop&q=80", isActive: true, areas: ["Pandeypur", "Chitaipur", "Naria", "Newada"], sortOrder: 5 },
];

const initialHeroes: HeroSection[] = [
  { id: "hero-1", title: "Varanasi's Most Trusted Home Services", subtitle: "Book background-verified professionals for deep cleaning, AC servicing, electrical, plumbing & more — instantly.", imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&auto=format&fit=crop&q=80", ctaText: "Book a Service Now", ctaLink: "/services", badgeText: "4.9★ Rated — 12,000+ Bookings", isActive: true },
  { id: "hero-2", title: "Professional AC Servicing at Your Doorstep", subtitle: "Power-Jet foam cleaning, filter wash, and refrigerant check — done in 45 minutes by certified technicians.", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80", ctaText: "Book AC Service", ctaLink: "/services/ac", badgeText: "Starting ₹399", isActive: false },
];

const initialServiceCards: ServiceCard[] = [
  { id: "svc-1", title: "Elite Deep Cleaning", description: "Full-home sanitisation using industrial hydro-pressure equipment.", imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80", price: "₹999", category: "Cleaning", isActive: true, sortOrder: 1 },
  { id: "svc-2", title: "AC Foam-Jet Service", description: "Power-Jet deep foam cleaning, filter wash & gas check.", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80", price: "₹399", category: "Appliance", isActive: true, sortOrder: 2 },
  { id: "svc-3", title: "Home Salon & Spa", description: "Premium salon treatments at home — facial, waxing, hair spa.", imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80", price: "₹599", category: "Beauty", isActive: true, sortOrder: 3 },
];

type TabType = "zones" | "heroes" | "services";

export default function ImageSectionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("zones");
  const [searchQuery, setSearchQuery] = useState("");
  const [zones, setZones] = useState<ZoneCard[]>(initialZones);
  const [heroes, setHeroes] = useState<HeroSection[]>(initialHeroes);
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>(initialServiceCards);
  const [previewZone, setPreviewZone] = useState<ZoneCard | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; type: TabType; name: string } | null>(null);

  const [zoneModal, setZoneModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<ZoneCard> }>({ open: false, mode: "add", data: {} });
  const [heroModal, setHeroModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<HeroSection> }>({ open: false, mode: "add", data: {} });
  const [serviceModal, setServiceModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<ServiceCard> }>({ open: false, mode: "add", data: {} });

  const saveZone = () => {
    const d = zoneModal.data;
    if (!d.name || !d.imageUrl) return;
    if (zoneModal.mode === "add") {
      setZones([...zones, { id: `zone-${Date.now()}`, name: d.name!, city: d.city || "Varanasi", proCount: d.proCount || 0, imageUrl: d.imageUrl!, isActive: d.isActive ?? true, areas: d.areas || [], sortOrder: d.sortOrder || zones.length + 1 }]);
    } else {
      setZones(zones.map((z) => z.id === d.id ? { ...z, ...d } as ZoneCard : z));
    }
    setZoneModal({ open: false, mode: "add", data: {} });
  };

  const saveHero = () => {
    const d = heroModal.data;
    if (!d.title || !d.imageUrl) return;
    if (heroModal.mode === "add") {
      setHeroes([...heroes, { id: `hero-${Date.now()}`, title: d.title!, subtitle: d.subtitle || "", imageUrl: d.imageUrl!, ctaText: d.ctaText || "Book Now", ctaLink: d.ctaLink || "/", badgeText: d.badgeText || "", isActive: d.isActive ?? true }]);
    } else {
      setHeroes(heroes.map((h) => h.id === d.id ? { ...h, ...d } as HeroSection : h));
    }
    setHeroModal({ open: false, mode: "add", data: {} });
  };

  const saveService = () => {
    const d = serviceModal.data;
    if (!d.title || !d.imageUrl) return;
    if (serviceModal.mode === "add") {
      setServiceCards([...serviceCards, { id: `svc-${Date.now()}`, title: d.title!, description: d.description || "", imageUrl: d.imageUrl!, price: d.price || "", category: d.category || "", isActive: d.isActive ?? true, sortOrder: d.sortOrder || serviceCards.length + 1 }]);
    } else {
      setServiceCards(serviceCards.map((s) => s.id === d.id ? { ...s, ...d } as ServiceCard : s));
    }
    setServiceModal({ open: false, mode: "add", data: {} });
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    if (deleteModal.type === "zones") setZones(zones.filter((z) => z.id !== deleteModal.id));
    if (deleteModal.type === "heroes") setHeroes(heroes.filter((h) => h.id !== deleteModal.id));
    if (deleteModal.type === "services") setServiceCards(serviceCards.filter((s) => s.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const filteredZones = zones.filter((z) => !searchQuery || z.name.toLowerCase().includes(searchQuery.toLowerCase()) || z.city.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredHeroes = heroes.filter((h) => !searchQuery || h.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredServices = serviceCards.filter((s) => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const inputCls = "w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500";

  const tabs: { id: TabType; label: string; icon: React.ElementType; count: number }[] = [
    { id: "zones", label: "Neighborhood Zones", icon: MapPin, count: zones.length },
    { id: "heroes", label: "Hero Banners", icon: LayoutGrid, count: heroes.length },
    { id: "services", label: "Service Cards", icon: Layers, count: serviceCards.length },
  ];

  return (
    <div className="space-y-6 relative">
      {/* PAGE HEADER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-violet-600 via-purple-700 to-fuchsia-700 text-white shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 w-fit">
            <Camera className="w-3 h-3" /> Website Image Sections
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Image Sections Manager</h1>
          <p className="text-xs text-white/85 max-w-xl font-medium">
            Manage neighborhood zone cards, hero banners, and service feature cards shown on your website.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/20 shrink-0">
          {([["Total", zones.length + heroes.length + serviceCards.length], ["Active", zones.filter(z => z.isActive).length + heroes.filter(h => h.isActive).length + serviceCards.filter(s => s.isActive).length], ["Sections", 3]] as [string, number][]).map(([label, val], i, arr) => (
            <div key={label} className="flex items-center gap-3">
              <div className="text-center">
                <div className="font-black text-lg text-white leading-none">{val}</div>
                <div className="text-[9px] text-white/70 font-bold uppercase tracking-wide mt-0.5">{label}</div>
              </div>
              {i < arr.length - 1 && <div className="w-px h-6 bg-white/20" />}
            </div>
          ))}
        </div>
      </div>

      {/* TAB NAV + SEARCH + ADD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${active ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 w-48" />
          </div>
          <button type="button"
            onClick={() => {
              if (activeTab === "zones") setZoneModal({ open: true, mode: "add", data: { name: "", city: "Varanasi", proCount: 0, imageUrl: "", isActive: true, areas: [], sortOrder: zones.length + 1 } });
              else if (activeTab === "heroes") setHeroModal({ open: true, mode: "add", data: { title: "", subtitle: "", imageUrl: "", ctaText: "", ctaLink: "", badgeText: "", isActive: true } });
              else setServiceModal({ open: true, mode: "add", data: { title: "", description: "", imageUrl: "", price: "", category: "", isActive: true, sortOrder: serviceCards.length + 1 } });
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-sm transition-colors">
            <Plus className="w-3.5 h-3.5" />
            {activeTab === "zones" ? "Add Zone" : activeTab === "heroes" ? "Add Banner" : "Add Card"}
          </button>
        </div>
      </div>

      {/* TAB 1: ZONES */}
      {activeTab === "zones" && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-xs text-violet-800 dark:text-violet-300 flex items-center gap-2">
            <Globe className="w-4 h-4 shrink-0" />
            <span>These cards appear in the <strong>"Where We Serve"</strong> section. Each card shows a neighborhood photo, name, city, and pro count.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredZones.map((zone) => (
              <div key={zone.id} className={`rounded-2xl border overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all ${zone.isActive ? "border-slate-200 dark:border-slate-700" : "border-dashed border-slate-300 dark:border-slate-700 opacity-60"}`}>
                <div className="relative h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img src={zone.imageUrl} alt={zone.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&q=80"; }} />
                  <div className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full ${zone.isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>{zone.isActive ? "LIVE" : "HIDDEN"}</div>
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1"><GripVertical className="w-2.5 h-2.5" />#{zone.sortOrder}</div>
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">{zone.name}</h3>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{zone.city}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Users className="w-3 h-3 text-purple-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">{zone.proCount} Pros</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{zone.areas.length} Areas</span>
                  </div>
                  {zone.areas.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {zone.areas.slice(0, 3).map((a) => (
                        <span key={a} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-md">{a}</span>
                      ))}
                      {zone.areas.length > 3 && <span className="text-[9px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-600 px-1.5 py-0.5 rounded-md">+{zone.areas.length - 3}</span>}
                    </div>
                  )}
                </div>
                <div className="px-3 pb-3 flex items-center gap-1.5">
                  <button type="button" onClick={() => setPreviewZone(zone)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-purple-600 transition-colors cursor-pointer" title="Preview"><Eye className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => setZoneModal({ open: true, mode: "edit", data: { ...zone } })} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => setZones(zones.map((z) => z.id === zone.id ? { ...z, isActive: !z.isActive } : z))} className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${zone.isActive ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>{zone.isActive ? "Live" : "Hidden"}</button>
                  <button type="button" onClick={() => setDeleteModal({ open: true, id: zone.id, type: "zones", name: zone.name })} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition-colors cursor-pointer ml-auto"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setZoneModal({ open: true, mode: "add", data: { name: "", city: "Varanasi", proCount: 0, imageUrl: "", isActive: true, areas: [], sortOrder: zones.length + 1 } })} className="rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 h-64 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center"><Plus className="w-5 h-5 text-purple-600" /></div>
              <span className="text-xs font-bold text-purple-600">Add New Zone</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: HEROES */}
      {activeTab === "heroes" && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-800 text-xs text-fuchsia-800 dark:text-fuchsia-300 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span>Hero banners appear at the <strong>top of your homepage</strong>. Only one active banner is shown to website visitors at a time.</span>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {filteredHeroes.map((hero) => (
              <div key={hero.id} className={`rounded-2xl border overflow-hidden bg-white dark:bg-slate-900 shadow-sm ${hero.isActive ? "border-purple-300 dark:border-purple-700 ring-1 ring-purple-200 dark:ring-purple-800" : "border-slate-200 dark:border-slate-700"}`}>
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-64 h-40 sm:h-auto bg-slate-100 dark:bg-slate-800 shrink-0 overflow-hidden">
                    <img src={hero.imageUrl} alt={hero.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"; }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                    {hero.badgeText && <div className="absolute bottom-2 left-2 bg-yellow-400 text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-full">{hero.badgeText}</div>}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-sm text-slate-900 dark:text-white leading-snug">{hero.title}</h3>
                        {hero.isActive && <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white shrink-0">ACTIVE</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{hero.subtitle}</p>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1"><ArrowRight className="w-3 h-3" />{hero.ctaText}</span>
                        <span className="text-slate-400">→ {hero.ctaLink}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button type="button" onClick={() => setHeroModal({ open: true, mode: "edit", data: { ...hero } })} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-600 text-xs font-bold cursor-pointer transition-colors"><Edit2 className="w-3 h-3" />Edit</button>
                      <button type="button" onClick={() => setHeroes(heroes.map((h) => h.id === hero.id ? { ...h, isActive: !h.isActive } : h))} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${hero.isActive ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}><CheckCircle2 className="w-3 h-3" />{hero.isActive ? "Active" : "Set Active"}</button>
                      <button type="button" onClick={() => setDeleteModal({ open: true, id: hero.id, type: "heroes", name: hero.title })} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition-colors cursor-pointer ml-auto"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setHeroModal({ open: true, mode: "add", data: { title: "", subtitle: "", imageUrl: "", ctaText: "", ctaLink: "", badgeText: "", isActive: true } })} className="rounded-2xl border-2 border-dashed border-fuchsia-200 dark:border-fuchsia-800 bg-fuchsia-50/50 h-28 flex items-center justify-center gap-2 cursor-pointer hover:border-fuchsia-400 transition-all">
              <Plus className="w-4 h-4 text-fuchsia-600" /><span className="text-xs font-bold text-fuchsia-600">Add Hero Banner</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICE CARDS */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
            <Layers className="w-4 h-4 shrink-0" />
            <span>Service cards appear in the <strong>"Our Services"</strong> grid. Each card shows a photo, title, description, and starting price.</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((svc) => (
              <div key={svc.id} className={`rounded-2xl border overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all ${svc.isActive ? "border-slate-200 dark:border-slate-700" : "border-dashed border-slate-300 opacity-60"}`}>
                <div className="relative h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img src={svc.imageUrl} alt={svc.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80"; }} />
                  <div className="absolute bottom-2 left-2 bg-purple-900/80 text-white text-[9px] font-black px-2 py-0.5 rounded-md backdrop-blur-sm">{svc.category}</div>
                  <div className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full ${svc.isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>{svc.isActive ? "LIVE" : "HIDDEN"}</div>
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">{svc.title}</h3>
                    <span className="font-black text-purple-600 dark:text-purple-400 text-sm">{svc.price}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">{svc.description}</p>
                </div>
                <div className="px-3 pb-3 flex items-center gap-1.5">
                  <button type="button" onClick={() => setServiceModal({ open: true, mode: "edit", data: { ...svc } })} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => setServiceCards(serviceCards.map((s) => s.id === svc.id ? { ...s, isActive: !s.isActive } : s))} className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${svc.isActive ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>{svc.isActive ? "Live" : "Hidden"}</button>
                  <button type="button" onClick={() => setDeleteModal({ open: true, id: svc.id, type: "services", name: svc.title })} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition-colors cursor-pointer ml-auto"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setServiceModal({ open: true, mode: "add", data: { title: "", description: "", imageUrl: "", price: "", category: "", isActive: true, sortOrder: serviceCards.length + 1 } })} className="rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 h-64 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center"><Plus className="w-5 h-5 text-indigo-600" /></div>
              <span className="text-xs font-bold text-indigo-600">Add Service Card</span>
            </button>
          </div>
        </div>
      )}

      {/* ZONE PREVIEW MODAL */}
      {previewZone && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="relative h-52 bg-slate-200">
                <img src={previewZone.imageUrl} alt={previewZone.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button type="button" onClick={() => setPreviewZone(null)} className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 cursor-pointer hover:bg-black/60 transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h2 className="font-black text-lg text-slate-900 dark:text-white">{previewZone.name}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{previewZone.city}</p>
                </div>
                <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-purple-500" /><span className="font-bold text-slate-700 dark:text-slate-300">{previewZone.proCount} Pros</span></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Areas Covered</p>
                  <div className="flex flex-wrap gap-1.5">
                    {previewZone.areas.map((a) => (
                      <span key={a} className="text-[11px] font-semibold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800 px-2 py-0.5 rounded-lg">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ZONE MODAL */}
      {zoneModal.open && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-black text-slate-900 dark:text-white text-base">{zoneModal.mode === "add" ? "Add Neighborhood Zone" : "Edit Zone"}</h2>
                <button type="button" onClick={() => setZoneModal({ open: false, mode: "add", data: {} })} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
              </div>
              <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Zone Image URL *</label>
                  <input type="url" placeholder="https://images.unsplash.com/..." value={zoneModal.data.imageUrl || ""} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, imageUrl: e.target.value } })} className={inputCls} />
                  {zoneModal.data.imageUrl && <img src={zoneModal.data.imageUrl} alt="preview" className="mt-2 w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Zone Name *</label>
                    <input type="text" placeholder="e.g. Lanka" value={zoneModal.data.name || ""} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, name: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                    <input type="text" placeholder="e.g. Varanasi" value={zoneModal.data.city || ""} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, city: e.target.value } })} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Pro Count</label>
                    <input type="number" placeholder="120" value={zoneModal.data.proCount || ""} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, proCount: Number(e.target.value) } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Sort Order</label>
                    <input type="number" placeholder="1" value={zoneModal.data.sortOrder || ""} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, sortOrder: Number(e.target.value) } })} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Areas (comma separated)</label>
                  <input type="text" placeholder="Assi Ghat, Lanka, BHU Campus" value={(zoneModal.data.areas || []).join(", ")} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, areas: e.target.value.split(",").map(a => a.trim()).filter(Boolean) } })} className={inputCls} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="zone-active" checked={zoneModal.data.isActive ?? true} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, isActive: e.target.checked } })} className="w-4 h-4 rounded accent-purple-600 cursor-pointer" />
                  <label htmlFor="zone-active" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Show on website (Live)</label>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setZoneModal({ open: false, mode: "add", data: {} })} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors">Cancel</button>
                <button type="button" onClick={saveZone} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5 cursor-pointer transition-colors"><Save className="w-3.5 h-3.5" />Save Zone</button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* HERO MODAL */}
      {heroModal.open && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-black text-slate-900 dark:text-white text-base">{heroModal.mode === "add" ? "Add Hero Banner" : "Edit Hero Banner"}</h2>
                <button type="button" onClick={() => setHeroModal({ open: false, mode: "add", data: {} })} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
              </div>
              <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Banner Image URL *</label>
                  <input type="url" placeholder="https://..." value={heroModal.data.imageUrl || ""} onChange={(e) => setHeroModal({ ...heroModal, data: { ...heroModal.data, imageUrl: e.target.value } })} className={inputCls} />
                  {heroModal.data.imageUrl && <img src={heroModal.data.imageUrl} alt="preview" className="mt-2 w-full h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Headline *</label>
                  <input type="text" placeholder="Varanasi's Most Trusted Home Services" value={heroModal.data.title || ""} onChange={(e) => setHeroModal({ ...heroModal, data: { ...heroModal.data, title: e.target.value } })} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Subheadline</label>
                  <textarea rows={2} placeholder="Book background-verified professionals..." value={heroModal.data.subtitle || ""} onChange={(e) => setHeroModal({ ...heroModal, data: { ...heroModal.data, subtitle: e.target.value } })} className={`${inputCls} resize-none`} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">CTA Button Text</label>
                    <input type="text" placeholder="Book Now" value={heroModal.data.ctaText || ""} onChange={(e) => setHeroModal({ ...heroModal, data: { ...heroModal.data, ctaText: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">CTA Link</label>
                    <input type="text" placeholder="/services" value={heroModal.data.ctaLink || ""} onChange={(e) => setHeroModal({ ...heroModal, data: { ...heroModal.data, ctaLink: e.target.value } })} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Text</label>
                  <input type="text" placeholder="4.9★ Rated — 12,000+ Bookings" value={heroModal.data.badgeText || ""} onChange={(e) => setHeroModal({ ...heroModal, data: { ...heroModal.data, badgeText: e.target.value } })} className={inputCls} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="hero-active" checked={heroModal.data.isActive ?? true} onChange={(e) => setHeroModal({ ...heroModal, data: { ...heroModal.data, isActive: e.target.checked } })} className="w-4 h-4 rounded accent-purple-600 cursor-pointer" />
                  <label htmlFor="hero-active" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Set as Active Banner</label>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setHeroModal({ open: false, mode: "add", data: {} })} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors">Cancel</button>
                <button type="button" onClick={saveHero} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5 cursor-pointer transition-colors"><Save className="w-3.5 h-3.5" />Save Banner</button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* SERVICE CARD MODAL */}
      {serviceModal.open && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-black text-slate-900 dark:text-white text-base">{serviceModal.mode === "add" ? "Add Service Card" : "Edit Service Card"}</h2>
                <button type="button" onClick={() => setServiceModal({ open: false, mode: "add", data: {} })} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
              </div>
              <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Card Image URL *</label>
                  <input type="url" placeholder="https://images.unsplash.com/..." value={serviceModal.data.imageUrl || ""} onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, imageUrl: e.target.value } })} className={inputCls} />
                  {serviceModal.data.imageUrl && <img src={serviceModal.data.imageUrl} alt="preview" className="mt-2 w-full h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Title *</label>
                  <input type="text" placeholder="Elite Deep Cleaning" value={serviceModal.data.title || ""} onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, title: e.target.value } })} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                  <textarea rows={2} placeholder="Full-home sanitisation..." value={serviceModal.data.description || ""} onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, description: e.target.value } })} className={`${inputCls} resize-none`} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Starting Price</label>
                    <input type="text" placeholder="₹999" value={serviceModal.data.price || ""} onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, price: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                    <input type="text" placeholder="Cleaning" value={serviceModal.data.category || ""} onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, category: e.target.value } })} className={inputCls} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="svc-active" checked={serviceModal.data.isActive ?? true} onChange={(e) => setServiceModal({ ...serviceModal, data: { ...serviceModal.data, isActive: e.target.checked } })} className="w-4 h-4 rounded accent-purple-600 cursor-pointer" />
                  <label htmlFor="svc-active" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Show on website (Live)</label>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setServiceModal({ open: false, mode: "add", data: {} })} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors">Cancel</button>
                <button type="button" onClick={saveService} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 flex items-center gap-1.5 cursor-pointer transition-colors"><Save className="w-3.5 h-3.5" />Save Card</button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* DELETE MODAL */}
      {deleteModal?.open && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6 text-red-600" /></div>
              <div className="text-center space-y-1">
                <h3 className="font-black text-slate-900 dark:text-white text-base">Delete this item?</h3>
                <p className="text-xs text-slate-500"><strong className="text-slate-700 dark:text-slate-300">"{deleteModal.name}"</strong> will be permanently removed.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors">Cancel</button>
                <button type="button" onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 cursor-pointer transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
