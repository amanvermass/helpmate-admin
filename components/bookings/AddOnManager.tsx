"use client";

import React, { useState } from "react";
import { Plus, Trash2, ShieldCheck, Sparkles, Check, Package, FilePlus, IndianRupee } from "lucide-react";
import { SelectedAddOnItem } from "@/lib/mockData";

export interface ListedAddOn {
  id: string;
  name: string;
  price: number;
  gstRate: number; // e.g. 0.18
  category?: string;
}

export const PREDEFINED_ADDONS: ListedAddOn[] = [
  { id: "add-1", name: "Copper Pipe Extension (1 Meter)", price: 499, gstRate: 0.18, category: "AC Service & Repair" },
  { id: "add-2", name: "Gas Top-Up / Refill (500g R32/R410)", price: 699, gstRate: 0.18, category: "AC Service & Repair" },
  { id: "add-3", name: "Anti-Rust Protective Spray Coating", price: 299, gstRate: 0.18, category: "AC Service & Repair" },
  { id: "add-4", name: "Heavy Duty Outdoor Wall Mounting Bracket", price: 450, gstRate: 0.18, category: "AC Service & Repair" },
  { id: "add-5", name: "Flexible Water Drain Hose Pipe (3m)", price: 150, gstRate: 0.18, category: "Plumbing Services" },
  { id: "add-6", name: "AC Motor Spare Capacitor 45uF", price: 350, gstRate: 0.18, category: "Electrical & Wiring" },
  { id: "add-7", name: "RO Water Filter Sediment Candle Replacement", price: 399, gstRate: 0.18, category: "RO Water Purifier" },
  { id: "add-8", name: "Heavy Duty Brass Switch / MCB 16A", price: 220, gstRate: 0.18, category: "Electrical & Wiring" },
];

interface AddOnManagerProps {
  selectedAddOns: SelectedAddOnItem[];
  onChangeAddOns: (addons: SelectedAddOnItem[]) => void;
  originalBookingPrice: number;
}

export function AddOnManager({
  selectedAddOns,
  onChangeAddOns,
  originalBookingPrice,
}: AddOnManagerProps) {
  const [activeTab, setActiveTab] = useState<"listed" | "unlisted">("listed");

  // Form state for unlisted add-ons
  const [unlistedName, setUnlistedName] = useState("");
  const [unlistedPrice, setUnlistedPrice] = useState("");
  const [applyGst, setApplyGst] = useState(true);

  // Financial calculations
  const addOnsBaseTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const addOnsGstTotal = selectedAddOns.reduce((sum, item) => sum + item.gstAmount, 0);
  const addOnsFinalTotal = addOnsBaseTotal + addOnsGstTotal;
  const newFinalPayable = originalBookingPrice + addOnsFinalTotal;

  // Toggle listed add-on
  const handleToggleListed = (item: ListedAddOn) => {
    const exists = selectedAddOns.find((a) => a.id === item.id);
    if (exists) {
      onChangeAddOns(selectedAddOns.filter((a) => a.id !== item.id));
    } else {
      const gstAmount = Math.round(item.price * item.gstRate);
      const newItem: SelectedAddOnItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        gstRate: item.gstRate,
        gstAmount,
        totalPrice: item.price + gstAmount,
        isUnlisted: false,
      };
      onChangeAddOns([...selectedAddOns, newItem]);
    }
  };

  // Add unlisted add-on
  const handleAddUnlisted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlistedName.trim()) return;
    const priceNum = parseFloat(unlistedPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    const gstRate = applyGst ? 0.18 : 0;
    const gstAmount = Math.round(priceNum * gstRate);
    const newItem: SelectedAddOnItem = {
      id: `unlisted-${Date.now()}`,
      name: unlistedName.trim(),
      price: priceNum,
      gstRate,
      gstAmount,
      totalPrice: priceNum + gstAmount,
      isUnlisted: true,
    };

    onChangeAddOns([...selectedAddOns, newItem]);
    setUnlistedName("");
    setUnlistedPrice("");
  };

  // Remove add-on
  const handleRemoveAddOn = (id: string) => {
    onChangeAddOns(selectedAddOns.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
            <Package className="w-4 h-4 text-brand-600" />
            <span>Job Completion Add-On Products & Services</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium">
            Include additional parts, materials, or services provided during on-site work.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab("listed")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeTab === "listed"
                ? "bg-white dark:bg-slate-900 text-brand-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Listed Catalog
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("unlisted")}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              activeTab === "unlisted"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            + Unlisted Custom Item
          </button>
        </div>
      </div>

      {/* ─── TAB 1: PREDEFINED LISTED ADD-ONS CATALOG ─── */}
      {activeTab === "listed" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
          {PREDEFINED_ADDONS.map((item) => {
            const isSelected = selectedAddOns.some((a) => a.id === item.id);
            const gstVal = Math.round(item.price * item.gstRate);
            const itemTotal = item.price + gstVal;

            return (
              <div
                key={item.id}
                onClick={() => handleToggleListed(item)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-brand-50/80 dark:bg-brand-950/40 border-brand-500 dark:border-brand-500 ring-1 ring-brand-500/30"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-brand-300"
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-extrabold text-slate-900 dark:text-white text-xs truncate">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span>Base: ₹{item.price}</span>
                    <span>+ GST (18%): ₹{gstVal}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-black text-slate-900 dark:text-white block text-xs">
                      ₹{itemTotal}
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold block">Incl. GST</span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-brand-600 border-brand-600 text-white"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB 2: UNLISTED CUSTOM ADD-ON FORM ─── */}
      {activeTab === "unlisted" && (
        <form onSubmit={handleAddUnlisted} className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-1.5 text-xs">
              <FilePlus className="w-4 h-4 text-purple-600" />
              <span>Add Custom Unlisted Product / Spare Part</span>
            </span>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-md">
              Unlisted Item Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 space-y-1">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
                Product / Service Title *
              </label>
              <input
                type="text"
                value={unlistedName}
                onChange={(e) => setUnlistedName(e.target.value)}
                placeholder="e.g. Out-of-catalog AC Rubber Vibration Pad"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block">
                Base Price (₹) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={unlistedPrice}
                onChange={(e) => setUnlistedPrice(e.target.value)}
                placeholder="250"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="sm:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={applyGst}
                onChange={(e) => setApplyGst(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                Apply 18% GST tax to this unlisted item
              </span>
            </label>
            <span className="text-[10px] text-slate-500 font-medium">
              ({applyGst ? "18% GST will be calculated & added" : "GST Exempted"})
            </span>
          </div>
        </form>
      )}

      {/* ─── SELECTED ADD-ONS TABLE SUMMARY ─── */}
      {selectedAddOns.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="font-extrabold text-slate-700 dark:text-slate-300 text-xs block">
            Selected Add-Ons ({selectedAddOns.length} Items)
          </span>

          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-extrabold text-[10px] border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 pl-3">Item / Service</th>
                  <th className="p-2.5 text-center">Type</th>
                  <th className="p-2.5 text-right">Base Price</th>
                  <th className="p-2.5 text-right">GST (18%)</th>
                  <th className="p-2.5 text-right">Total</th>
                  <th className="p-2.5 pr-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold">
                {selectedAddOns.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-2.5 pl-3 font-extrabold text-slate-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                        item.isUnlisted
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}>
                        {item.isUnlisted ? "Unlisted" : "Listed"}
                      </span>
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-700 dark:text-slate-300">
                      ₹{item.price}
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-600 dark:text-slate-400">
                      ₹{item.gstAmount}
                    </td>
                    <td className="p-2.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                      ₹{item.totalPrice}
                    </td>
                    <td className="p-2.5 pr-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveAddOn(item.id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                        title="Remove Add-On"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── FINANCIAL BILLING BREAKDOWN BOX ─── */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-2.5 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
          <span className="font-extrabold text-slate-300 uppercase tracking-wider text-[10px]">Financial Settlement Breakdown</span>
          <span className="text-emerald-400 font-mono font-extrabold text-xs">
            {selectedAddOns.length} Add-On(s) Included
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Original Booking Bill Amount:</span>
            <span className="font-mono font-bold">₹{originalBookingPrice}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Add-On Subtotal (Base):</span>
            <span className="font-mono font-bold text-slate-200">₹{addOnsBaseTotal}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span>Add-On GST Tax (18%):</span>
            <span className="font-mono font-bold text-slate-200">₹{addOnsGstTotal}</span>
          </div>

          <div className="flex items-center justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1.5 text-xs">
            <span>Total Add-On Charges:</span>
            <span className="font-mono font-extrabold text-emerald-300">₹{addOnsFinalTotal}</span>
          </div>

          <div className="flex items-center justify-between text-sm font-black text-white bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 mt-2">
            <span className="flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              <span>Final Revised Amount Payable:</span>
            </span>
            <span className="font-mono text-emerald-400 text-base">₹{newFinalPayable}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
