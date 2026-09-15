"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  Star,
  ShieldCheck,
  Clock,
  UserCheck,
  UserPlus,
  Zap,
  Check,
} from "lucide-react";
import { Booking, initialTechnicians, Technician, BroadcastPartnerOffer } from "@/lib/mockData";
import { Portal } from "@/components/Portal";
import { getPartnerDropdownApi, assignPartnerToBookingApi, ApiPartner } from "@/lib/api";

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
  const [partnerListFromApi, setPartnerListFromApi] = useState<ApiPartner[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch partners from Backend API if available
  React.useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await getPartnerDropdownApi();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPartnerListFromApi(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch partner dropdown API:", err);
      }
    }
    if (isOpen) {
      fetchPartners();
    }
  }, [isOpen]);

  // Initialize selectedTechIds when modal opens
  React.useEffect(() => {
    if (booking) {
      const match = initialTechnicians.find(
        (t) => t.id === booking.technicianId || t.name === booking.technicianName
      );
      setSelectedTechIds(match ? [match.id] : booking.technicianId ? [booking.technicianId] : []);
      setSearchQuery("");
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const isReassign = Boolean(booking.technicianName);

  // Combine initialTechnicians and partnerListFromApi
  const apiTechsMapped: Technician[] = partnerListFromApi.map((p, idx) => ({
    id: p._id || `api-partner-${idx}`,
    name: p.name || "Partner",
    avatar: "",
    role: p.category || "Service Expert",
    category: p.category || "General",
    locality: p.locality || "Varanasi",
    pincode: "221001",
    phone: p.mobile || "",
    rating: p.rating || 4.9,
    totalJobs: p.totalJobs || 120,
    aadhaarVerified: true,
    policeVerified: true,
    bondedInsurance: true,
    status: "Available",
    joiningDate: "01 Jan 2024",
    lastCompletedJob: p.lastCompletedJob || {
      title: "Split AC Servicing",
      bookingId: `BK-VNS-${1040 + idx}`,
      completedAt: idx % 2 === 0 ? "Today, 11:00 AM" : "Yesterday, 03:20 PM",
    },
    totalEarnings: 150000,
    commissionPaid: 37500,
    pendingPayout: 5000,
    lastPayoutDate: "01 Sep 2026",
  }));

  // Combine lists, eliminating duplicate IDs
  const allPartnersMap = new Map<string, Technician>();
  initialTechnicians.forEach((t) => allPartnersMap.set(t.id, t));
  apiTechsMapped.forEach((t) => {
    if (!allPartnersMap.has(t.id)) {
      allPartnersMap.set(t.id, t);
    }
  });

  const allPartnersList = Array.from(allPartnersMap.values());

  const filteredTechs = allPartnersList.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.locality.toLowerCase().includes(q) ||
      (t.lastCompletedJob?.title && t.lastCompletedJob.title.toLowerCase().includes(q))
    );
  });

  const handleToggleSelect = (techId: string) => {
    if (selectedTechIds.includes(techId)) {
      setSelectedTechIds(selectedTechIds.filter((id) => id !== techId));
    } else {
      if (selectedTechIds.length >= 5) {
        alert("You can select up to 5 partners.");
        return;
      }
      setSelectedTechIds([...selectedTechIds, techId]);
    }
  };

  const handleSelectTop5 = () => {
    const top5 = [...allPartnersList]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
    setSelectedTechIds(top5.map((t) => t.id));
  };

  const handleAssignTech = async (tech: Technician) => {
    setIsAssigning(true);
    try {
      if (booking.id && booking.id.length === 24) {
        await assignPartnerToBookingApi(booking.id, tech.id);
      }
    } catch (err) {
      console.error("assignPartnerToBookingApi error:", err);
    } finally {
      setIsAssigning(false);
    }

    onPartnerAssigned(booking.id, tech);
    onClose();
  };

  const handleConfirmSelected = async () => {
    if (selectedTechIds.length === 0) return;

    if (selectedTechIds.length === 1) {
      const chosenTech = allPartnersList.find((t) => t.id === selectedTechIds[0]);
      if (chosenTech) {
        await handleAssignTech(chosenTech);
      }
    } else {
      // Multiple partners selected (Top 5)
      const selectedTechs = allPartnersList.filter((t) => selectedTechIds.includes(t.id));
      const broadcastOffers: BroadcastPartnerOffer[] = selectedTechs.map((t) => ({
        technicianId: t.id,
        technicianName: t.name,
        technicianPhone: t.phone,
        rating: t.rating,
        locality: t.locality,
        status: "Pending",
        sentAt: "Just now",
      }));

      // Assign the top 1 primary tech to booking DB
      const primaryTech = selectedTechs[0];
      if (primaryTech) {
        try {
          if (booking.id && booking.id.length === 24) {
            await assignPartnerToBookingApi(booking.id, primaryTech.id);
          }
        } catch (err) {
          console.error("assignPartnerToBookingApi error:", err);
        }
      }

      onPartnerAssigned(booking.id, primaryTech || null, broadcastOffers);
      onClose();
    }
  };

  const handleUnassign = () => {
    onPartnerAssigned(booking.id, null);
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
        <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 outline-none my-8 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200 dark:border-brand-800">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {isReassign ? "Reassign Partner" : "Assign Partner"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Booking <span className="font-bold text-slate-900 dark:text-white">{booking.id}</span> • {booking.locality}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Booking Summary Card */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 dark:text-white truncate">
                {booking.serviceTitle}
              </span>
              {booking.technicianName && (
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                  <UserCheck className="w-3 h-3" />
                  Assigned: {booking.technicianName}
                </span>
              )}
            </div>
            <p className="text-slate-500 truncate">
              {booking.customerName} ({booking.customerPhone}) • {booking.address}
            </p>
          </div>

          {/* Search Bar & Top 5 Select Option Button */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search partner by name, service, or locality..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleSelectTop5}
                className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-100 font-extrabold text-xs flex items-center gap-1.5 border border-amber-300 shrink-0 cursor-pointer transition-colors shadow-xs"
                title="Auto-select top 5 highest rated partners"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Top 5 Partners</span>
              </button>
            </div>

            {/* Selection Counter Tag */}
            {selectedTechIds.length > 0 && (
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 px-1">
                <span className="text-brand-600 dark:text-brand-400">
                  {selectedTechIds.length} Partner{selectedTechIds.length > 1 ? "s" : ""} Selected
                  {selectedTechIds.length === 5 && " (Top 5 Active)"}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTechIds([])}
                  className="text-slate-400 hover:text-slate-600 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Partner List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {filteredTechs.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No matching partners found.
              </div>
            ) : (
              filteredTechs.map((t) => {
                const isSelected = selectedTechIds.includes(t.id);
                const isCurrentlyAssigned = booking.technicianId === t.id || booking.technicianName === t.name;

                const lastJobTitle = t.lastCompletedJob?.title || "Split AC Servicing";
                const lastJobBookingId = t.lastCompletedJob?.bookingId || `BK-VNS-${8800 + (t.id ? t.id.length * 10 : 20)}`;
                let lastJobTime = t.lastCompletedJob?.completedAt;
                if (!lastJobTime || lastJobTime.toLowerCase().includes("recently")) {
                  lastJobTime = "Yesterday, 04:30 PM";
                }

                return (
                  <div
                    key={t.id}
                    onClick={() => handleToggleSelect(t.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-brand-50/70 border-brand-500 dark:bg-brand-950/50 dark:border-brand-500 shadow-xs ring-1 ring-brand-500/50"
                        : "bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-brand-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center text-xs shrink-0 transition-colors ${
                            isSelected
                              ? "bg-brand-600 border-brand-600 text-white"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center font-extrabold text-slate-800 dark:text-white text-xs shrink-0">
                          {t.name[0]}
                        </div>
                        <div className="min-w-0 flex flex-col">
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 truncate">
                            <span>{t.name}</span>
                            {t.aadhaarVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            {isCurrentlyAssigned && (
                              <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold px-1.5 py-0.2 rounded shrink-0">
                                Current
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">{t.role} • {t.locality}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right text-xs">
                          <span className="font-extrabold text-slate-900 dark:text-white flex items-center justify-end gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            {t.rating}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-medium">{t.totalJobs} jobs</span>
                        </div>

                        {/* Direct Row Assign Button */}
                        <button
                          type="button"
                          disabled={isAssigning}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignTech(t);
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            isCurrentlyAssigned
                              ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                              : "bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-600 hover:text-white hover:border-brand-600"
                          }`}
                        >
                          Assign
                        </button>
                      </div>
                    </div>

                    {/* Last Completed Job Display */}
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        Last Completed Job: <strong className="text-slate-800 dark:text-slate-200 font-bold">{lastJobTitle}</strong>
                        {lastJobBookingId ? ` (${lastJobBookingId} • ${lastJobTime})` : ` • ${lastJobTime}`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              {isReassign && (
                <button
                  type="button"
                  onClick={handleUnassign}
                  className="px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-300 hover:bg-red-100 text-xs font-bold border border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                >
                  Unassign Partner
                </button>
              )}
            </div>

            {/* SINGLE PRIMARY BUTTON IN MODAL */}
            <button
              type="button"
              disabled={selectedTechIds.length === 0 || isAssigning}
              onClick={handleConfirmSelected}
              className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-extrabold shadow-lux cursor-pointer transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {selectedTechIds.length > 1
                  ? `Assign Top ${selectedTechIds.length} Partners`
                  : "Assign"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
