"use client";

import { useState } from "react";
import {
  FileImage,
  Upload,
  Search,
  Image as ImageIcon,
  CheckCircle2,
  Download,
  Trash2,
  Copy,
  Check,
  Plus,
} from "lucide-react";

export default function MediaPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const mediaAssets = [
    {
      id: "media-1",
      name: "HelpMate Main Logo (Magenta #8D397E)",
      type: "PNG Logo",
      dimensions: "1254 x 1254",
      size: "142 KB",
      category: "Branding",
      url: "https://helpmate-theta.vercel.app/logo.png",
    },
    {
      id: "media-2",
      name: "Power Jet AC Service Campaign Banner",
      type: "WebP Banner",
      dimensions: "1920 x 1080",
      size: "480 KB",
      category: "Campaigns",
      url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "media-3",
      name: "Elite Deep Cleaning Equipment Showcase",
      type: "JPEG Photo",
      dimensions: "1200 x 800",
      size: "320 KB",
      category: "Services",
      url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "media-4",
      name: "Ayurvedic Home Spa & Wellness Banner",
      type: "JPEG Photo",
      dimensions: "1200 x 800",
      size: "290 KB",
      category: "Services",
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "media-5",
      name: "Biometric Aadhaar & Police Verified Seal",
      type: "SVG Vector",
      dimensions: "512 x 512",
      size: "45 KB",
      category: "Badges",
      url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded border border-brand-200">
              Brand Asset Management
            </span>
            <span className="text-xs text-slate-500">HelpMate Varanasi Assets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Media & Brand Asset Library
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Store and manage promotional banners, verified badge assets, and logo files for Varanasi marketing campaigns.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux transition-all cursor-pointer self-start md:self-auto">
          <Upload className="w-4 h-4" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaAssets.map((asset) => (
          <div
            key={asset.id}
            className="glass-panel p-5 rounded-2xl space-y-4 border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            {/* Image Preview */}
            <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
              <img
                src={asset.url}
                alt={asset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 text-[9px] font-bold uppercase bg-white/90 backdrop-blur-md text-brand-600 px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                {asset.category}
              </span>
            </div>

            {/* Asset Details */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-900 truncate">{asset.name}</h3>
              <p className="text-[10px] text-slate-500">
                {asset.type} • {asset.dimensions} • {asset.size}
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleCopy(asset.url, asset.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedId === asset.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied URL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Asset URL</span>
                  </>
                )}
              </button>

              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                title="Download Full Image"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
