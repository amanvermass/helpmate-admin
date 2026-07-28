"use client";

import { useState } from "react";
import {
  Users,
  Crown,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  X,
  CreditCard,
  History,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { initialCustomers, Customer } from "@/lib/mockData";
import { Portal } from "@/components/Portal";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [tierFilter, setTierFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesTier = tierFilter === "All" || c.tier === tierFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-600" /> HelpMate Elite CRM
            </span>
            <span className="text-xs text-slate-500">Varanasi Household Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Customer CRM & Elite Memberships
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track Varanasi client profiles, Crown Elite subscription tiers, lifetime value, and booking history.
          </p>
        </div>
      </div>

      {/* Membership Tier Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border-amber-200 bg-amber-50/40 space-y-2 border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-600" /> Crown Elite Members
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">420 Active</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Priority 30-min technician dispatch, 15% discount on AC & Deep Cleaning packages across Varanasi.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-purple-200 bg-purple-50/40 space-y-2 border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" /> VIP Household Tiers
            </span>
            <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">860 Clients</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Free weekend slot reservations and zero cancellation fees for Sigra, Lanka & Bhelupur residents.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-blue-200 bg-blue-50/40 space-y-2 border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" /> Standard Accounts
            </span>
            <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">1,560 Clients</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pay-per-service clients with instant WhatsApp job updates and verified technician dispatch.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["All", "Crown Elite", "VIP", "Standard"].map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                tierFilter === tier
                  ? "bg-brand-500 text-white shadow-lux"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-4 px-5">Customer Profile</th>
                <th className="py-4 px-5">Contact Info</th>
                <th className="py-4 px-5">Varanasi Address</th>
                <th className="py-4 px-5">Tier</th>
                <th className="py-4 px-5">Lifetime Spend (₹)</th>
                <th className="py-4 px-5">Total Bookings</th>
                <th className="py-4 px-5">Joined Date</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                        {c.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{c.name}</span>
                        <span className="text-[10px] text-slate-400">{c.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col text-[11px]">
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-brand-600" /> {c.phone}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5 text-slate-400" /> {c.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col max-w-xs text-[11px]">
                      <span className="font-bold text-brand-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-600 shrink-0" /> {c.locality}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate">{c.address}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        c.tier === "Crown Elite"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : c.tier === "VIP"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {c.tier === "Crown Elite" && <Crown className="w-3 h-3" />}
                      {c.tier}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-extrabold text-slate-900">
                    ₹{c.totalSpend.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-800">{c.totalBookings} Jobs</td>
                  <td className="py-4 px-5 text-slate-500 text-[11px]">{c.joinedDate}</td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        title="View Profile"
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-brand-50 text-slate-700 hover:text-brand-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditCustomer(c)}
                        title="Edit Customer"
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-brand-50 text-slate-700 hover:text-brand-600 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteCustomer(c)}
                        title="Delete Customer"
                        className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 outline-none">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-sm shadow-lux">
                  {selectedCustomer.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-xs text-amber-700 font-semibold">{selectedCustomer.tier} Member</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Contact & Locality</span>
                <div className="text-slate-800 font-medium">{selectedCustomer.phone}</div>
                <div className="text-slate-500">{selectedCustomer.email}</div>
                <div className="text-brand-600 font-bold mt-1">{selectedCustomer.address}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Spend</span>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    ₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Bookings Done</span>
                  <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
                    {selectedCustomer.totalBookings} Jobs
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setCustomers(
                    customers.map((item) =>
                      item.id === selectedCustomer.id
                        ? { ...item, tier: item.tier === "Crown Elite" ? "VIP" : "Crown Elite" }
                        : item
                    )
                  );
                  setSelectedCustomer(null);
                }}
                className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux transition-all"
              >
                Toggle Membership Tier
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}

      {/* Edit Customer Modal */}
      {editCustomer && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setCustomers(customers.map((c) => (c.id === editCustomer.id ? editCustomer : c)));
                setEditCustomer(null);
              }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Edit Customer Profile</h3>
                <button type="button" onClick={() => setEditCustomer(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    value={editCustomer.name}
                    onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editCustomer.phone}
                    onChange={(e) => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Varanasi Locality</label>
                  <input
                    type="text"
                    value={editCustomer.locality}
                    onChange={(e) => setEditCustomer({ ...editCustomer, locality: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Membership Tier</label>
                  <select
                    value={editCustomer.tier}
                    onChange={(e) => setEditCustomer({ ...editCustomer, tier: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Crown Elite">Crown Elite</option>
                    <option value="VIP">VIP</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditCustomer(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-500 text-white rounded-xl font-bold text-xs shadow-lux">Save Changes</button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* Delete Customer Modal */}
      {deleteCustomer && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Delete Customer Profile</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to delete customer <strong>{deleteCustomer.name}</strong> ({deleteCustomer.phone})?
              </p>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setDeleteCustomer(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomers(customers.filter((c) => c.id !== deleteCustomer.id));
                    setDeleteCustomer(null);
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-lux"
                >
                  Delete Customer
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
