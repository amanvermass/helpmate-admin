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
  Layers,
  Search,
  GripVertical,
  Globe,
  CheckCircle2,
  Camera,
  Flame,
  ChevronRight,
  FileText,
  TrendingUp,
  Star,
  Clock,
  Heart,
  Tag,
  Upload,
} from "lucide-react";
import { Portal } from "@/components/Portal";
import { initialServices, ServiceItem } from "@/lib/mockData";

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

interface TrendingServiceCard {
  id: string;
  title: string;
  category: string;
  durationMins: number;
  rating: number;
  reviewsCount: number;
  description: string;
  discountPercentage: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  bookCtaText: string;
  bookCtaLink: string;
  isActive: boolean;
  sortOrder: number;
}

interface WhereWeServeHeader {
  badge: string;
  title: string;
  subtitle: string;
}

interface TrendingHeader {
  badge: string;
  title: string;
  subtitle: string;
  viewAllText: string;
  viewAllLink: string;
}

const initialWhereWeServeHeader: WhereWeServeHeader = {
  badge: "WHERE WE SERVE",
  title: "Varanasi's Neighborhoods We Cover",
  subtitle: "Book background-verified, uniformed professionals across active Varanasi municipal zones. Select a zone below to explore the direct areas we support.",
};

const initialTrendingHeader: TrendingHeader = {
  badge: "STEP 3: BEST SELLERS",
  title: "Trending Services This Week",
  subtitle: "Our most popular deep cleaning and home repair bundles booked by Varanasi residents this week.",
  viewAllText: "View all trending packages →",
  viewAllLink: "/services",
};

const initialZones: ZoneCard[] = [
  {
    id: "zone-1",
    name: "Lanka",
    city: "Varanasi",
    proCount: 120,
    imageUrl: "/bhu-gate.png",
    isActive: true,
    areas: [
      "Assi Ghat",
      "Lanka",
      "Durgakund",
      "Ravindrapuri",
      "BHU Campus",
      "Saket Nagar",
      "Samne Ghat",
      "Nagwa",
      "Jawahar Nagar",
      "Tulsipur",
      "Naria",
      "Sunderpur",
      "Karundi",
      "Chitaipur",
      "Newada",
    ],
    sortOrder: 1,
  },
  {
    id: "zone-2",
    name: "Godowlia",
    city: "Varanasi",
    proCount: 90,
    imageUrl: "/godowlia-crossing.png",
    isActive: true,
    areas: ["Godowlia", "Dashashwamedh", "Chowk", "Thatheri Bazar", "Kashi Vishwanath", "Bangali Tola", "Madanpura"],
    sortOrder: 2,
  },
  {
    id: "zone-3",
    name: "Cantonment",
    city: "Varanasi",
    proCount: 150,
    imageUrl: "/cantt-station.png",
    isActive: true,
    areas: ["Cantonment", "Nadesar", "Sigra", "Mahmoorganj", "Mint House", "Varuna Bridge", "Vidyapeeth"],
    sortOrder: 3,
  },
  {
    id: "zone-4",
    name: "Sigra",
    city: "Varanasi",
    proCount: 110,
    imageUrl: "/sigra-crossing.png",
    isActive: true,
    areas: ["Sigra", "Rath Yatra", "IP Mall Road", "Lallapura", "Siddhgiribagh"],
    sortOrder: 4,
  },
  {
    id: "zone-5",
    name: "Sarnath",
    city: "Varanasi",
    proCount: 80,
    imageUrl: "/sarnath-temple.jpg",
    isActive: true,
    areas: ["Sarnath", "Dhamek Stupa", "Ashoka Pillar Area", "Mavaiya", "Hiramanpur"],
    sortOrder: 5,
  },
  {
    id: "zone-6",
    name: "Pandeypur",
    city: "Varanasi",
    proCount: 70,
    imageUrl: "/pandeypur-flyover.png",
    isActive: true,
    areas: ["Pandeypur", "Azamgarh Road", "Paharia", "Premchand Nagar", "Khajuri"],
    sortOrder: 6,
  },
];



const initialServiceCards: ServiceCard[] = [
  { id: "svc-1", title: "Elite Deep Cleaning", description: "Full-home sanitisation using industrial hydro-pressure equipment.", imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80", price: "₹999", category: "Cleaning", isActive: true, sortOrder: 1 },
  { id: "svc-2", title: "AC Foam-Jet Service", description: "Power-Jet deep foam cleaning, filter wash & gas check.", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80", price: "₹399", category: "Appliance", isActive: true, sortOrder: 2 },
  { id: "svc-3", title: "Home Salon & Spa", description: "Premium salon treatments at home — facial, waxing, hair spa.", imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80", price: "₹599", category: "Beauty", isActive: true, sortOrder: 3 },
];

const initialTrendingServices: TrendingServiceCard[] = [
  {
    id: "trend-1",
    title: "Luxury Interior Concept & Moodboard Design",
    category: "Interior",
    durationMins: 180,
    rating: 4.96,
    reviewsCount: 110,
    description: "Consult with gold-medalist interior architects. Receive a 3D moodboard, color palette mapping, and material selection breakdown.",
    discountPercentage: "28% OFF",
    price: "1999",
    originalPrice: "2799",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
    bookCtaText: "Book Now →",
    bookCtaLink: "/services/interior",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "trend-2",
    title: "White-Glove Bubble-Wrapped Villa Packers & Movers",
    category: "Moving",
    durationMins: 300,
    rating: 4.88,
    reviewsCount: 290,
    description: "Includes 3-layered bubble wrap, cardboard boxes, customized wooden crating for delicate items & dedicated supervisor.",
    discountPercentage: "28% OFF",
    price: "2499",
    originalPrice: "3499",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    bookCtaText: "Book Now →",
    bookCtaLink: "/services/moving",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "trend-3",
    title: "Classic Deep Home Cleaning",
    category: "Cleaning",
    durationMins: 240,
    rating: 4.92,
    reviewsCount: 1240,
    description: "Our signature, multi-room deep cleaning service. Covers every square inch of your home including kitchen, bathrooms & balcony.",
    discountPercentage: "24% OFF",
    price: "1899",
    originalPrice: "2499",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
    bookCtaText: "Book Now →",
    bookCtaLink: "/services/cleaning",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "trend-4",
    title: "Foam & Power Jet AC Service",
    category: "Ac",
    durationMins: 60,
    rating: 4.88,
    reviewsCount: 890,
    description: "Revolutionary high-pressure foam cleaning that penetrates deep split AC coils. Removes 2x more dirt & improves cooling.",
    discountPercentage: "25% OFF",
    price: "599",
    originalPrice: "799",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
    bookCtaText: "Book Now →",
    bookCtaLink: "/services/ac",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "trend-5",
    title: "Luxury Facial & Hair Spa Combo",
    category: "Beauty",
    durationMins: 120,
    rating: 4.96,
    reviewsCount: 2310,
    description: "Pamper yourself with our flagship beauty combo. Includes an organic deep-glow facial and nourishing hot-oil hair spa treatment.",
    discountPercentage: "28% OFF",
    price: "2499",
    originalPrice: "3499",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
    bookCtaText: "Book Now →",
    bookCtaLink: "/services/beauty",
    isActive: true,
    sortOrder: 5,
  },
];

type TabType = "zones" | "trending";

export default function ImageSectionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("zones");
  const [searchQuery, setSearchQuery] = useState("");
  const [zones, setZones] = useState<ZoneCard[]>(initialZones);
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>(initialServiceCards);
  const [trendingServices, setTrendingServices] = useState<TrendingServiceCard[]>(initialTrendingServices);

  const [isCatalogPickerOpen, setIsCatalogPickerOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogServices, setCatalogServices] = useState<ServiceItem[]>(initialServices);

  const toggleCatalogServiceInTrending = (srv: ServiceItem) => {
    const exists = trendingServices.some((t) => t.title.toLowerCase() === srv.title.toLowerCase());
    if (exists) {
      setTrendingServices(trendingServices.filter((t) => t.title.toLowerCase() !== srv.title.toLowerCase()));
    } else {
      const newTrendingItem: TrendingServiceCard = {
        id: `trend-${srv.id}`,
        title: srv.title,
        category: srv.category,
        durationMins: parseInt(srv.duration) || 60,
        rating: srv.rating || 4.9,
        reviewsCount: srv.reviewsCount || 100,
        description: srv.subtitle || "Popular service with top customer ratings in Varanasi.",
        discountPercentage: srv.originalPrice > srv.price ? `${Math.round(((srv.originalPrice - srv.price) / srv.originalPrice) * 100)}% OFF` : "BESTSELLER",
        price: String(srv.price),
        originalPrice: String(srv.originalPrice),
        imageUrl: srv.thumbnailUrl || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
        bookCtaText: "Book Now →",
        bookCtaLink: "/services",
        isActive: true,
        sortOrder: trendingServices.length + 1,
      };
      setTrendingServices([...trendingServices, newTrendingItem]);
    }
  };

  const [serveHeader, setServeHeader] = useState<WhereWeServeHeader>(initialWhereWeServeHeader);
  const [editingHeader, setEditingHeader] = useState(false);
  const [headerDraft, setHeaderDraft] = useState<WhereWeServeHeader>(initialWhereWeServeHeader);

  const [trendingHeader, setTrendingHeader] = useState<TrendingHeader>(initialTrendingHeader);
  const [editingTrendingHeader, setEditingTrendingHeader] = useState(false);
  const [trendingHeaderDraft, setTrendingHeaderDraft] = useState<TrendingHeader>(initialTrendingHeader);

  const [previewZone, setPreviewZone] = useState<ZoneCard | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; type: TabType; name: string } | null>(null);

  const [zoneModal, setZoneModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<ZoneCard> }>({ open: false, mode: "add", data: {} });
  const [serviceModal, setServiceModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<ServiceCard> }>({ open: false, mode: "add", data: {} });
  const [trendingModal, setTrendingModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<TrendingServiceCard> }>({ open: false, mode: "add", data: {} });

  const saveZone = () => {
    const d = zoneModal.data;
    if (!d.name || !d.imageUrl) return;
    if (zoneModal.mode === "add") {
      const newZone: ZoneCard = { id: `zone-${Date.now()}`, name: d.name!, city: d.city || "Varanasi", proCount: d.proCount || 0, imageUrl: d.imageUrl!, isActive: d.isActive ?? true, areas: d.areas || [], sortOrder: d.sortOrder || zones.length + 1 };
      setZones([...zones, newZone]);
    } else {
      setZones(zones.map((z) => z.id === d.id ? { ...z, ...d } as ZoneCard : z));
    }
    setZoneModal({ open: false, mode: "add", data: {} });
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

  const saveTrending = () => {
    const d = trendingModal.data;
    if (!d.title || !d.imageUrl) return;
    if (trendingModal.mode === "add") {
      const newTrending: TrendingServiceCard = {
        id: `trend-${Date.now()}`,
        title: d.title!,
        category: d.category || "General",
        durationMins: d.durationMins || 60,
        rating: d.rating || 4.9,
        reviewsCount: d.reviewsCount || 100,
        description: d.description || "",
        discountPercentage: d.discountPercentage || "20% OFF",
        price: d.price || "999",
        originalPrice: d.originalPrice || "1499",
        imageUrl: d.imageUrl!,
        bookCtaText: d.bookCtaText || "Book Now →",
        bookCtaLink: d.bookCtaLink || "/services",
        isActive: d.isActive ?? true,
        sortOrder: d.sortOrder || trendingServices.length + 1,
      };
      setTrendingServices([...trendingServices, newTrending]);
    } else {
      setTrendingServices(trendingServices.map((t) => t.id === d.id ? { ...t, ...d } as TrendingServiceCard : t));
    }
    setTrendingModal({ open: false, mode: "add", data: {} });
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    if (deleteModal.type === "zones") setZones(zones.filter((z) => z.id !== deleteModal.id));
    if (deleteModal.type === "trending") setTrendingServices(trendingServices.filter((t) => t.id !== deleteModal.id));
    setDeleteModal(null);
  };

  const saveServeHeader = () => {
    setServeHeader(headerDraft);
    setEditingHeader(false);
  };

  const saveTrendingHeader = () => {
    setTrendingHeader(trendingHeaderDraft);
    setEditingTrendingHeader(false);
  };

  const filteredZones = zones.filter((z) => !searchQuery || z.name.toLowerCase().includes(searchQuery.toLowerCase()) || z.city.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredServices = serviceCards.filter((s) => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTrending = trendingServices.filter((t) => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const inputCls = "w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500";

  const tabs: { id: TabType; label: string; icon: React.ElementType; count: number }[] = [
    { id: "zones", label: "Where We Serve (Zones)", icon: MapPin, count: zones.length },
    { id: "trending", label: "Trending Best Sellers", icon: Flame, count: trendingServices.length },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Simple Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Camera className="w-6 h-6 text-brand-600" />
            <span>Website Sections CMS</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage neighborhood zones and trending best-seller packages shown on your website.
          </p>
        </div>
      </div>

      {/* TAB NAV + SEARCH + ADD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${active ? "bg-brand-600 text-white shadow-md font-black" : "text-slate-500 hover:text-slate-700"}`}>
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 w-44" />
          </div>
          <button type="button"
            onClick={() => {
              if (activeTab === "zones") setZoneModal({ open: true, mode: "add", data: { name: "", city: "Varanasi", proCount: 0, imageUrl: "", isActive: true, areas: [], sortOrder: zones.length + 1 } });
              else setIsCatalogPickerOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs cursor-pointer shadow-sm transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" />
            {activeTab === "zones" ? "Add Zone" : "Select Service from Catalog"}
          </button>
        </div>
      </div>

      {/* TAB 1: WHERE WE SERVE (NEIGHBORHOOD ZONES) */}
      {activeTab === "zones" && (
        <div className="space-y-6">

          {/* SECTION HEADER TEXT EDITOR */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-black text-sm text-slate-900 dark:text-white">Section Header Text</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">— controls badge, title, and subtitle of Where We Serve on the website</span>
              </div>
              {!editingHeader ? (
                <button type="button" onClick={() => { setHeaderDraft(serveHeader); setEditingHeader(true); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-600 cursor-pointer transition-colors">
                  <Edit2 className="w-3 h-3" /> Edit Section Text
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingHeader(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 cursor-pointer transition-colors">Cancel</button>
                  <button type="button" onClick={saveServeHeader}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer transition-colors">
                    <Save className="w-3 h-3" />Save
                  </button>
                </div>
              )}
            </div>

            {!editingHeader ? (
              <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Badge Text</p>
                  <span className="text-xs font-extrabold bg-purple-900 text-white px-2 py-0.5 rounded uppercase tracking-wider">{serveHeader.badge}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Section Title</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white">{serveHeader.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Subtitle</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{serveHeader.subtitle}</p>
                </div>
              </div>
            ) : (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Text</label>
                  <input type="text" value={headerDraft.badge} onChange={(e) => setHeaderDraft({ ...headerDraft, badge: e.target.value })} className={inputCls} placeholder="WHERE WE SERVE" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Section Title</label>
                  <input type="text" value={headerDraft.title} onChange={(e) => setHeaderDraft({ ...headerDraft, title: e.target.value })} className={inputCls} placeholder="Varanasi's Neighborhoods We Cover" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Subtitle</label>
                  <input type="text" value={headerDraft.subtitle} onChange={(e) => setHeaderDraft({ ...headerDraft, subtitle: e.target.value })} className={inputCls} placeholder="Book background-verified..." />
                </div>
              </div>
            )}
          </div>

          {/* ADMIN CARDS EDIT GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Neighborhood Zone Cards ({zones.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredZones.map((zone) => (
                <div key={zone.id} className={`rounded-2xl border overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all ${zone.isActive ? "border-slate-200 dark:border-slate-700" : "border-dashed border-slate-300 dark:border-slate-700 opacity-60"}`}>
                  <div className="relative h-40 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img src={zone.imageUrl} alt={zone.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/bhu-gate.png"; }} />
                    <div className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full ${zone.isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>{zone.isActive ? "LIVE" : "HIDDEN"}</div>
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1"><GripVertical className="w-2.5 h-2.5" />#{zone.sortOrder}</div>
                  </div>
                  <div className="p-3 space-y-2">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">{zone.name}</h3>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-brand-600" />{zone.city}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Users className="w-3 h-3 text-purple-500" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{zone.proCount} Pros</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{zone.areas.length} Areas</span>
                    </div>
                    {zone.areas.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {zone.areas.slice(0, 4).map((a) => (
                          <span key={a} className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-md">{a}</span>
                        ))}
                        {zone.areas.length > 4 && <span className="text-[9px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-600 px-1.5 py-0.5 rounded-md">+{zone.areas.length - 4}</span>}
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-3 flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onClick={() => setPreviewZone(zone)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-purple-600 transition-colors cursor-pointer" title="View Details"><Eye className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => setZoneModal({ open: true, mode: "edit", data: { ...zone } })} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-600 transition-colors cursor-pointer" title="Edit Zone"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => setZones(zones.map((z) => z.id === zone.id ? { ...z, isActive: !z.isActive } : z))} className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${zone.isActive ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>{zone.isActive ? "Live" : "Hidden"}</button>
                    <button type="button" onClick={() => setDeleteModal({ open: true, id: zone.id, type: "zones", name: zone.name })} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-600 transition-colors cursor-pointer ml-auto" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setZoneModal({ open: true, mode: "add", data: { name: "", city: "Varanasi", proCount: 0, imageUrl: "", isActive: true, areas: [], sortOrder: zones.length + 1 } })} className="rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 h-64 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center"><Plus className="w-5 h-5 text-purple-600" /></div>
                <span className="text-xs font-bold text-purple-600">Add New Zone</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRENDING SERVICES (BEST SELLERS) */}
      {activeTab === "trending" && (
        <div className="space-y-6">

          {/* SECTION HEADER TEXT EDITOR */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-black text-sm text-slate-900 dark:text-white">Section Header Text</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">— controls badge, title, subtitle, and view all link of Trending Services on website</span>
              </div>
              {!editingTrendingHeader ? (
                <button type="button" onClick={() => { setTrendingHeaderDraft(trendingHeader); setEditingTrendingHeader(true); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-600 cursor-pointer transition-colors">
                  <Edit2 className="w-3 h-3" /> Edit Section Text
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditingTrendingHeader(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 cursor-pointer transition-colors">Cancel</button>
                  <button type="button" onClick={saveTrendingHeader}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white cursor-pointer transition-colors">
                    <Save className="w-3 h-3" />Save
                  </button>
                </div>
              )}
            </div>

            {!editingTrendingHeader ? (
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Badge Text</p>
                  <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 uppercase tracking-wider">{trendingHeader.badge}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Section Title</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white">{trendingHeader.title}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Subtitle</p>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 line-clamp-1">{trendingHeader.subtitle}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">View All Link</p>
                  <span className="text-xs font-bold text-brand-600">{trendingHeader.viewAllText}</span>
                </div>
              </div>
            ) : (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Badge Text</label>
                  <input type="text" value={trendingHeaderDraft.badge} onChange={(e) => setTrendingHeaderDraft({ ...trendingHeaderDraft, badge: e.target.value })} className={inputCls} placeholder="STEP 3: BEST SELLERS" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Section Title</label>
                  <input type="text" value={trendingHeaderDraft.title} onChange={(e) => setTrendingHeaderDraft({ ...trendingHeaderDraft, title: e.target.value })} className={inputCls} placeholder="Trending Services This Week" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Subtitle</label>
                  <input type="text" value={trendingHeaderDraft.subtitle} onChange={(e) => setTrendingHeaderDraft({ ...trendingHeaderDraft, subtitle: e.target.value })} className={inputCls} placeholder="Our most popular deep cleaning..." />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">View All Button Text</label>
                  <input type="text" value={trendingHeaderDraft.viewAllText} onChange={(e) => setTrendingHeaderDraft({ ...trendingHeaderDraft, viewAllText: e.target.value })} className={inputCls} placeholder="View all trending packages →" />
                </div>
                </div>
            )}
          </div>

          {/* ADMIN CARDS EDIT GRID & SELECTION */}
          <div className="space-y-4">
           

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrending.map((item) => (
                <div key={item.id} className={`rounded-2xl border overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all ${item.isActive ? "border-slate-200 dark:border-slate-700" : "border-dashed border-slate-300 dark:border-slate-700 opacity-60"}`}>
                  <div className="relative h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80"; }} />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{item.discountPercentage}</div>
                    <div className={`absolute top-2 right-2 text-[9px] font-black px-2 py-0.5 rounded-full ${item.isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>{item.isActive ? "LIVE" : "HIDDEN"}</div>
                  </div>

                  <div className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>{item.category} • {item.durationMins} mins</span>
                      <span className="text-amber-500 font-bold">★ {item.rating}</span>
                    </div>

                    <h4 className="font-black text-xs text-slate-900 dark:text-white leading-snug line-clamp-1">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-black text-xs text-purple-600 dark:text-purple-400">₹{item.price} <span className="text-slate-400 line-through text-[10px]">₹{item.originalPrice}</span></span>
                      <span className="text-[10px] text-slate-400 font-mono">Rank #{item.sortOrder}</span>
                    </div>
                  </div>

                  <div className="px-3 pb-3 flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onClick={() => setTrendingServices(trendingServices.map((t) => t.id === item.id ? { ...t, isActive: !t.isActive } : t))} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${item.isActive ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>{item.isActive ? "Live" : "Hidden"}</button>
                    <button type="button" onClick={() => setTrendingServices(trendingServices.filter((t) => t.id !== item.id))} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer text-[10px] font-extrabold ml-auto flex items-center gap-1" title="Remove from Trending"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => setIsCatalogPickerOpen(true)} className="rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-amber-950/20 h-56 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-amber-500 hover:bg-amber-100/50 transition-all text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lux">
                  <Flame className="w-6 h-6 fill-white" />
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">Select Service from Catalog</span>
                <span className="text-[10px] font-semibold text-slate-500 max-w-[180px]">Pick any service from Catalog to add to Trending</span>
              </button>
            </div>
          </div>

        </div>
      )}





      {/* ZONE PREVIEW MODAL */}
      {previewZone && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800">
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

      {/* TRENDING SERVICE MODAL */}
      {trendingModal.open && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-black text-slate-900 dark:text-white text-base">{trendingModal.mode === "add" ? "Add Trending Package" : "Edit Trending Package"}</h2>
                <button type="button" onClick={() => setTrendingModal({ open: false, mode: "add", data: {} })} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
              </div>

              <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Package Image URL *</label>
                  <input type="url" placeholder="https://..." value={trendingModal.data.imageUrl || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, imageUrl: e.target.value } })} className={inputCls} />
                  {trendingModal.data.imageUrl && <img src={trendingModal.data.imageUrl} alt="preview" className="mt-2 w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Title *</label>
                    <input type="text" placeholder="e.g. Classic Deep Home Cleaning" value={trendingModal.data.title || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, title: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                    <input type="text" placeholder="e.g. Cleaning" value={trendingModal.data.category || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, category: e.target.value } })} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Duration (mins)</label>
                    <input type="number" placeholder="240" value={trendingModal.data.durationMins || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, durationMins: Number(e.target.value) } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Rating (★)</label>
                    <input type="number" step="0.01" placeholder="4.92" value={trendingModal.data.rating || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, rating: Number(e.target.value) } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Reviews Count</label>
                    <input type="number" placeholder="1240" value={trendingModal.data.reviewsCount || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, reviewsCount: Number(e.target.value) } })} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Offer Badge</label>
                    <input type="text" placeholder="24% OFF" value={trendingModal.data.discountPercentage || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, discountPercentage: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Discount Price (₹)</label>
                    <input type="text" placeholder="1899" value={trendingModal.data.price || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, price: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Original Price (₹)</label>
                    <input type="text" placeholder="2499" value={trendingModal.data.originalPrice || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, originalPrice: e.target.value } })} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                  <textarea rows={3} placeholder="Our signature, multi-room deep cleaning..." value={trendingModal.data.description || ""} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, description: e.target.value } })} className={`${inputCls} resize-none`} />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="trend-active" checked={trendingModal.data.isActive ?? true} onChange={(e) => setTrendingModal({ ...trendingModal, data: { ...trendingModal.data, isActive: e.target.checked } })} className="w-4 h-4 rounded accent-purple-600 cursor-pointer" />
                  <label htmlFor="trend-active" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Show on website (Live)</label>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setTrendingModal({ open: false, mode: "add", data: {} })} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors">Cancel</button>
                <button type="button" onClick={saveTrending} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"><Save className="w-3.5 h-3.5" />Save Package</button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ZONE MODAL */}
      {zoneModal.open && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-black text-slate-900 dark:text-white text-base">{zoneModal.mode === "add" ? "Add Neighborhood Zone" : "Edit Zone"}</h2>
                <button type="button" onClick={() => setZoneModal({ open: false, mode: "add", data: {} })} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
              </div>
              <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Upload Zone Image *</label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold cursor-pointer hover:bg-purple-100 transition-colors w-full">
                      <Upload className="w-4 h-4 text-purple-600" />
                      <span>Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setZoneModal({ ...zoneModal, data: { ...zoneModal.data, imageUrl: reader.result as string } });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <input type="text" placeholder="Or paste image URL (https://...)" value={zoneModal.data.imageUrl || ""} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, imageUrl: e.target.value } })} className={inputCls} />
                  </div>
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Areas Covered (comma separated)</label>
                  <textarea rows={3} placeholder="Assi Ghat, Lanka, Durgakund, BHU Campus..." value={(zoneModal.data.areas || []).join(", ")} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, areas: e.target.value.split(",").map(a => a.trim()).filter(Boolean) } })} className={`${inputCls} resize-none`} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="zone-active" checked={zoneModal.data.isActive ?? true} onChange={(e) => setZoneModal({ ...zoneModal, data: { ...zoneModal.data, isActive: e.target.checked } })} className="w-4 h-4 rounded accent-purple-600 cursor-pointer" />
                  <label htmlFor="zone-active" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Show on website (Live)</label>
                </div>
              </div>
              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setZoneModal({ open: false, mode: "add", data: {} })} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-pointer transition-colors">Cancel</button>
                <button type="button" onClick={saveZone} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"><Save className="w-3.5 h-3.5" />Save Zone</button>
              </div>
            </div>
          </div>
        </Portal>
      )}



      {/* DELETE MODAL */}
      {deleteModal?.open && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4 border border-slate-200 dark:border-slate-800">
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
      {/* ─── CATALOG SERVICE SELECTION MODAL (PICK FROM EXISTING SERVICES) ─── */}
      {isCatalogPickerOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500 to-rose-600 text-white">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-5 h-5 fill-white text-white" />
                  <div>
                    <h3 className="font-extrabold text-white text-base">Select Service from Catalog</h3>
                    <p className="text-xs text-amber-100">Choose existing services to feature in website Trending Best Sellers</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCatalogPickerOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/20 text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Search catalog service name or category..."
                    className="w-full h-10 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Catalog Services List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {catalogServices
                  .filter((s) => !catalogSearch || s.title.toLowerCase().includes(catalogSearch.toLowerCase()) || s.category.toLowerCase().includes(catalogSearch.toLowerCase()))
                  .map((srv) => {
                    const isAlreadyTrending = trendingServices.some((t) => t.title.toLowerCase() === srv.title.toLowerCase());
                    return (
                      <div
                        key={srv.id}
                        className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300 transition-all flex items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={srv.thumbnailUrl || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80"}
                            alt={srv.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{srv.title}</h4>
                              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-brand-50 text-brand-600 border border-brand-200">
                                {srv.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-2 mt-0.5">
                              <span className="font-mono font-bold text-slate-900 dark:text-white">₹{srv.price}</span>
                              <span className="text-slate-400 line-through text-[10px]">₹{srv.originalPrice}</span>
                              <span>•</span>
                              <span className="text-amber-500 font-bold">★ {srv.rating}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleCatalogServiceInTrending(srv)}
                          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                            isAlreadyTrending
                              ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white"
                              : "bg-amber-500 hover:bg-amber-600 text-white shadow-lux"
                          }`}
                        >
                          <Flame className={`w-3.5 h-3.5 ${isAlreadyTrending ? "text-rose-600" : "fill-white text-white"}`} />
                          <span>{isAlreadyTrending ? "Remove from Trending" : "+ Add to Trending"}</span>
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCatalogPickerOpen(false)}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold text-xs shadow-lux cursor-pointer"
                >
                  Done Managing Trending
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
