"use client";

import { useState } from "react";
import {
  Code,
  Key,
  Copy,
  Check,
  Zap,
  Globe,
  Terminal,
  Server,
  Layers,
  Sparkles,
} from "lucide-react";

export default function ApiDocsPage() {
  const [copiedKey, setCopiedKey] = useState(false);

  const apiKey = "hm_live_varanasi_998124500918234a";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const endpoints = [
    {
      method: "POST",
      path: "/api/v2/varanasi/assignment",
      desc: "Trigger instant 30-sec technician assignment for Varanasi households.",
    },
    {
      method: "GET",
      path: "/api/v2/services/catalog",
      desc: "Fetch active HelpMate service catalog & Split/Window AC pricing.",
    },
    {
      method: "POST",
      path: "/api/v2/fleet/verify-aadhaar",
      desc: "Submit technician Aadhaar and Police clearance audit record.",
    },
    {
      method: "GET",
      path: "/api/v2/zones/demand-heatmap",
      desc: "Retrieve active booking density across Sigra, Lanka, Assi Ghat.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-50 text-brand-600 px-2.5 py-0.5 rounded border border-brand-200">
              Developer Hub
            </span>
            <span className="text-xs text-slate-500">HelpMate Webhooks & API v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            API Keys & Integration Documentation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Programmatic assignment APIs, real-time webhook events, and franchise developer credentials.
          </p>
        </div>
      </div>

      {/* API Key Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Active Varanasi Production API Key</h3>
              <p className="text-xs text-slate-500">Environment: Production (Sigra HQ Server)</p>
            </div>
          </div>

          <button
            onClick={handleCopyKey}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux transition-all cursor-pointer"
          >
            {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey ? "Copied Key" : "Copy Production Key"}</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-brand-600 font-bold flex items-center justify-between">
          <span>{apiKey}</span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ACTIVE & RATE-LIMITED
          </span>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="glass-panel p-6 rounded-2xl space-y-5 border border-slate-200">
        <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-3">
          Available REST Webhook Endpoints
        </h3>

        <div className="space-y-4">
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    ep.method === "POST"
                      ? "bg-brand-500 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">{ep.path}</span>
              </div>
              <p className="text-xs text-slate-600">{ep.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* JSON Payload Example */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-200">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-600" /> Assignment Webhook Response Payload
        </h3>

        <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto">
{`{
  "event": "booking.assigned",
  "booking_id": "HM-VAR-8821",
  "city": "Varanasi",
  "locality": "Sigra",
  "pincode": "221002",
  "service": {
    "title": "Power Jet AC Servicing",
    "system_type": "Split AC (1.5 Ton)",
    "price_inr": 699
  },
  "technician": {
    "name": "Ramesh Yadav",
    "rating": 4.95,
    "aadhaar_verified": true,
    "police_cleared": true
  },
  "status": "In Progress"
}`}
        </pre>
      </div>
    </div>
  );
}
