"use client";

import { useState, useRef, useEffect } from "react";
import { Customer } from "@/lib/mockData";
import {
  Search,
  UserPlus,
  ChevronDown,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";

interface CustomerSearchPickerProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer, isNewCustomer?: boolean) => void;
  label?: string;
}

export function CustomerSearchPicker({
  customers,
  selectedCustomer,
  onSelectCustomer,
  label = "Select Customer (Search Name or Mobile Phone)",
}: CustomerSearchPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New Customer Inline Form States
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLocality, setNewLocality] = useState("Sigra");
  const [newAddress, setNewAddress] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter customers by Name OR Phone
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAndSelectCustomer = () => {
    if (!newName.trim() || !newPhone.trim()) return;

    const created: Customer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      locality: newLocality,
      address: newAddress || `${newLocality}, Varanasi`,
      tier: "Standard",
      totalSpend: 0,
      totalBookings: 0,
      lastBookingDate: "Never",
      joinedDate: "Today",
    };

    onSelectCustomer(created, true);
    setIsAddingNew(false);
    setIsOpen(false);

    // Reset inline state
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewAddress("");
  };

  return (
    <div className="space-y-2 text-xs relative" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-700 dark:text-slate-300 block">
          {label}
        </label>
        <button
          type="button"
          onClick={() => {
            setIsAddingNew(!isAddingNew);
            setIsOpen(false);
          }}
          className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-[11px] shadow-lux flex items-center gap-1.5 transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{isAddingNew ? "Cancel New Customer" : "+ Add New Customer"}</span>
        </button>
      </div>

      {/* INLINE NEW CUSTOMER CREATION CARD */}
      {isAddingNew ? (
        <div className="p-4 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-brand-200 dark:border-brand-800 pb-2">
            <span className="font-extrabold text-xs text-brand-900 dark:text-brand-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" /> Create & Auto-Select New Customer
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Alok Verma"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Mobile Phone Number *
              </label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 99350 98765"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="alok@gmail.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Varanasi Base Locality
              </label>
              <input
                type="text"
                value={newLocality}
                onChange={(e) => setNewLocality(e.target.value)}
                placeholder="Sigra, Varanasi"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateAndSelectCustomer}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-extrabold text-xs shadow-lux flex items-center justify-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Auto-Select New Customer</span>
          </button>
        </div>
      ) : (
        /* SEARCHABLE CUSTOMER DROPDOWN PICKER */
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              placeholder="Search customer by Full Name or Mobile Phone Number..."
              className="w-full pl-10 pr-10 h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500 shadow-xs text-xs"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dropdown Options List */}
          {isOpen && (
            <div className="absolute z-[999] mt-1 w-full max-h-64 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCustomer(c, false);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors ${selectedCustomer?.id === c.id
                        ? "bg-brand-50/50 dark:bg-brand-950/30 font-bold"
                        : ""
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        <User className="w-4 h-4 text-brand-600" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                          {c.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 font-bold">
                          {c.phone} {c.email ? `• ${c.email}` : ""}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {c.tier}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 font-semibold">
                  No existing customers match "{searchTerm}".
                </div>
              )}
            </div>
          )}

          {/* Selected Customer Active Badge Card */}
          {selectedCustomer && (
            <div className="p-3.5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-center justify-between text-xs animate-in fade-in duration-150">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-black text-slate-900 dark:text-white block text-sm">
                    {selectedCustomer.name}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-brand-600">
                    {selectedCustomer.phone} {selectedCustomer.email ? `• ${selectedCustomer.email}` : ""}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-[11px]"
              >
                Change Customer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
