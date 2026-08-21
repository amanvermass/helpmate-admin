"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  Star,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Wrench,
  Radio,
  Zap,
  Lock,
  Clock,
  Check,
  AlertCircle,
  Users,
} from "lucide-react";
import { Booking, initialTechnicians, Technician, BroadcastPartnerOffer } from "@/lib/mockData";
import { Portal } from "@/components/Portal";

interface AssignPartnerModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onPartnerAssigned: (
    bookingId: string,
    technician: Technician | null,
    broadcastOffers?: BroadcastPartnerOffer[]
  ) => void;
  onSimulateAcceptance?: (bookingId: string, technicianId: string) => void;
}

export function AssignPartnerModal({
  booking,
  isOpen,
  onClose,
  onPartnerAssigned,
  onSimulateAcceptance,
}: AssignPartnerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);

  // Initialize selectedTechIds when modal opens
  React.useEffect(() => {
    if (booking) {
      if (booking.broadcastOffers && booking.broadcastOffers.length > 0) {
        setSelectedTechIds(booking.broadcastOffers.map((o) => o.technicianId));
      } else {
        const match = initialTechnicians.find(
          (t) => t.id === booking.technicianId || t.name === booking.technicianName
        );
        setSelectedTechIds(match ? [match.id] : []);
      }
      setSearchQuery("");
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const isReassign = Boolean(booking.technicianName || (booking.broadcastOffers && booking.broadcastOffers.length > 0));

  const filteredTechs = initialTechnicians.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.locality.toLowerCase().includes(q)
    );
  });

  const handleToggleTech = (techId: string) => {
    if (selectedTechIds.includes(techId)) {
      setSelectedTechIds(selectedTechIds.filter((id) => id !== techId));
    } else {
      if (selectedTechIds.length >= 5) {
        alert("You can select a maximum of 5 top partners for broadcast assignment.");
        return;
      }
      setSelectedTechIds([...selectedTechIds, techId]);
    }
  };

  const handleAutoSelectTop5 = () => {
    // Select top 5 matching technicians sorted by rating
    const sorted = [...initialTechnicians].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const top5Ids = sorted.slice(0, 5).map((t) => t.id);
    setSelectedTechIds(top5Ids);
  };

  const handleConfirmAssign = () => {
    if (selectedTechIds.length === 0) return;

    if (selectedTechIds.length === 1) {
      const tech = initialTechnicians.find((t) => t.id === selectedTechIds[0]);
      onPartnerAssigned(booking.id, tech || null);
    } else {
      // Multi-partner broadcast (Up to 5 Top Partners)
      const selectedTechs = initialTechnicians.filter((t) => selectedTechIds.includes(t.id));
      const broadcastOffers: BroadcastPartnerOffer[] = selectedTechs.map((t) => ({
        technicianId: t.id,
        technicianName: t.name,
        technicianPhone: t.phone,
        rating: t.rating,
        locality: t.locality,
        status: "Pending",
        sentAt: "Just now",
      }));

      // Assign first selected as primary candidate or broadcast status
      onPartnerAssigned(booking.id, null, broadcastOffers);
    }

    onClose();
  };

  const handleUnassign = () => {
    onPartnerAssigned(booking.id, null, []);
    onClose();
  };

  const activeAcceptedOffer = booking.broadcastOffers?.find((o) => o.status === "Accepted");

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
        <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 outline-none my-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800 flex items-center gap-1.5 w-fit">
                <Radio className="w-3 h-3 text-brand-600 animate-pulse" />
                <span>Multi-Partner Dispatch Engine</span>
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {isReassign ? "Manage Partner Broadcast / Assignment" : "Broadcast Job to Top 5 Partners"}
              </h3>
              <p className="text-xs text-slate-500">
                Booking <span className="font-bold text-slate-900 dark:text-white">{booking.id}</span> • {booking.locality}
              </p>
            </div>
            <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selected Booking Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Booking Details</span>
              {booking.technicianName ? (
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Assigned Partner: {booking.technicianName}
                </span>
              ) : (
                <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                  ⚡ Open for Broadcast Assignment
                </span>
              )}
            </div>
            <div className="font-extrabold text-slate-900 dark:text-white">{booking.serviceTitle}</div>
            <div className="text-slate-500">{booking.customerName} ({booking.customerPhone}) • {booking.address}</div>
          </div>

          {/* Broadcast Offers Status Monitor (If Broadcast Active) */}
          {booking.broadcastOffers && booking.broadcastOffers.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-extrabold flex items-center gap-1.5 text-brand-400">
                  <Radio className="w-4 h-4 animate-pulse text-brand-400" />
                  <span>Active Multi-Partner Broadcast Tracker ({booking.broadcastOffers.length} Sent)</span>
                </span>
                <span className="text-[10px] text-slate-400">First-Come First-Served</span>
              </div>

              <div className="space-y-2 text-xs">
                {booking.broadcastOffers.map((offer) => {
                  const isAccepted = offer.status === "Accepted";
                  const isClosed = offer.status === "Offer Closed";

                  return (
                    <div
                      key={offer.technicianId}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isAccepted
                          ? "bg-emerald-950/80 border-emerald-500 text-emerald-200"
                          : isClosed
                          ? "bg-slate-800/60 border-slate-700 text-slate-400 opacity-75"
                          : "bg-slate-800 border-slate-700 text-slate-200"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{offer.technicianName}</span>
                          <span className="text-[10px] text-amber-400">★ {offer.rating || "4.9"}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isAccepted ? (
                            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Accepted & Assigned!
                            </span>
                          ) : isClosed ? (
                            <span className="text-slate-400 font-medium flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-400" /> Offer Closed (Accepted by {activeAcceptedOffer?.technicianName || "another partner"})
                            </span>
                          ) : (
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3 animate-spin" /> Pending Acceptance...
                            </span>
                          )}
                        </div>
                      </div>

                      {!isAccepted && !isClosed && onSimulateAcceptance && (
                        <button
                          type="button"
                          onClick={() => {
                            onSimulateAcceptance(booking.id, offer.technicianId);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] cursor-pointer shadow-xs transition-colors"
                        >
                          Simulate Accept
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions & Partner Selector Toolbar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-600" />
                <span>Select Up to 5 Top Partners for Broadcast</span>
              </label>
              <button
                type="button"
                onClick={handleAutoSelectTop5}
                className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-bold text-xs flex items-center gap-1 border border-purple-200 dark:border-purple-800 cursor-pointer transition-colors"
              >
                <Zap className="w-3.5 h-3.5 fill-purple-500" />
                <span>⚡ Auto-Select Top 5</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technician name, category, locality..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Selection Counter Tag */}
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Selected {selectedTechIds.length} of 5 Maximum Broadcast Partners</span>
              {selectedTechIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTechIds([])}
                  className="text-brand-600 hover:underline cursor-pointer"
                >
                  Clear selection
                </button>
              )}
            </div>

            {/* Fleet List Multi-Select Checkboxes */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredTechs.map((t) => {
                const isSelected = selectedTechIds.includes(t.id);
                const isCurrentlyAssigned = booking.technicianId === t.id || booking.technicianName === t.name;

                return (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTech(t.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-brand-50 border-brand-500 dark:bg-brand-950 dark:border-brand-500 shadow-xs ring-1 ring-brand-500"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-brand-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs shrink-0 transition-colors ${
                          isSelected
                            ? "bg-brand-600 border-brand-600 text-white"
                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-extrabold text-slate-800 dark:text-white text-xs shrink-0">
                        {t.name[0]}
                      </div>

                      <div className="flex flex-col text-xs">
                        <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {t.name}
                          {t.aadhaarVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                          {isCurrentlyAssigned && (
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold px-1.5 py-0.5 rounded">
                              Assigned
                            </span>
                          )}
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
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            {isReassign && (
              <button
                type="button"
                onClick={handleUnassign}
                className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 text-xs font-extrabold border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
              >
                Unassign All
              </button>
            )}

            {/* SINGLE PRIMARY BUTTON IN MODAL ACCORDING TO RULE */}
            <button
              type="button"
              disabled={selectedTechIds.length === 0}
              onClick={handleConfirmAssign}
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-lux cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Radio className="w-4 h-4" />
              <span>
                {selectedTechIds.length <= 1
                  ? "Confirm Partner Assignment"
                  : `Broadcast Job Offer to ${selectedTechIds.length} Selected Top Partners`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
