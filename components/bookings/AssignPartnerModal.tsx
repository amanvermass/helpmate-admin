"use client";

import React, { useState } from "react";
import { X, Search, Star, MapPin, CheckCircle2, ShieldCheck, UserCheck, Wrench } from "lucide-react";
import { Booking, initialTechnicians, Technician } from "@/lib/mockData";
import { Portal } from "@/components/Portal";

interface AssignPartnerModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onPartnerAssigned: (bookingId: string, technician: Technician) => void;
}

export function AssignPartnerModal({
  booking,
  isOpen,
  onClose,
  onPartnerAssigned,
}: AssignPartnerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechId, setSelectedTechId] = useState<string>("");

  if (!isOpen || !booking) return null;

  const filteredTechs = initialTechnicians.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.locality.toLowerCase().includes(q)
    );
  });

  const handleConfirmAssign = () => {
    const tech = initialTechnicians.find((t) => t.id === selectedTechId);
    if (!tech) return;
    onPartnerAssigned(booking.id, tech);
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
      <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 outline-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Fleet Dispatch Engine
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">Assign Partner to Booking</h3>
            <p className="text-xs text-slate-500">
              Booking <span className="font-bold text-slate-900 dark:text-white">{booking.id}</span> • {booking.locality}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Booking Summary Card */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Target Booking</span>
          <div className="font-extrabold text-slate-900 dark:text-white">{booking.serviceTitle}</div>
          <div className="text-slate-500">{booking.customerName} ({booking.customerPhone})</div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search technician name, skills, locality..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Fleet List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {filteredTechs.map((t) => {
            const isSelected = selectedTechId === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setSelectedTechId(t.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${isSelected
                  ? "bg-brand-50 border-brand-500 dark:bg-brand-950 dark:border-brand-500 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-brand-300"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-slate-800 dark:text-white text-xs shrink-0">
                    {t.name[0]}
                  </div>
                  <div className="flex flex-col text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                      {t.name}
                      {t.aadhaarVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                    </span>
                    <span className="text-[10px] text-slate-500">{t.role} • {t.locality}</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    {t.rating}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{t.totalJobs} jobs</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedTechId}
            onClick={handleConfirmAssign}
            className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold shadow-lux"
          >
            Confirm Partner Assignment
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}
