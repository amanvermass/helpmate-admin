"use client";

import { useState } from "react";
import {
  Users,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserPlus,
} from "lucide-react";
import { initialCustomers, Customer } from "@/lib/mockData";
import { DataTable, Column } from "@/components/DataTable";
import { Portal } from "@/components/Portal";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);

  // Add Customer State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newLocality, setNewLocality] = useState("Sigra");
  const [newAddress, setNewAddress] = useState("");

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: newName,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      locality: newLocality,
      address: newAddress || `${newLocality}, Varanasi`,
      tier: "Standard",
      totalSpend: 0,
      totalBookings: 0,
      lastBookingDate: "Just Now",
      joinedDate: "Today",
    };

    setCustomers([newCustomer, ...customers]);
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setNewAddress("");
    setIsAddOpen(false);
  };

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer Name",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            {row.name[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 dark:text-white">{row.name}</span>
            <span className="text-[10px] text-slate-400">{row.id}</span>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "phone",
      header: "Contact Info",
      accessor: (row) => (
        <div className="flex flex-col text-[11px]">
          <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
            <Phone className="w-3 h-3 text-brand-600" /> {row.phone}
          </span>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <Mail className="w-2.5 h-2.5 text-slate-400" /> {row.email}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "locality",
      header: "Locality Address",
      accessor: (row) => (
        <div className="flex flex-col max-w-xs text-[11px]">
          <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-600 shrink-0" /> {row.locality}
          </span>
          <span className="text-[10px] text-slate-500 truncate">{row.address}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "totalSpend",
      header: "Total Spend (₹)",
      accessor: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-white">
          ₹{row.totalSpend.toLocaleString("en-IN")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "totalBookings",
      header: "Total Bookings",
      accessor: (row) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {row.totalBookings} Jobs
        </span>
      ),
      sortable: true,
    },
    { key: "joinedDate", header: "Joined Date", sortable: true },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCustomer(row)}
            title="View Profile"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEditCustomer(row)}
            title="Edit Customer"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-50 text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteCustomer(row)}
            title="Delete Customer"
            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-red-50 text-slate-700 dark:text-slate-300 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main DataTable matching User Management layout */}
      <DataTable
        title="Customer CRM & Household Directory"
        description="Track Varanasi client profiles, lifetime value, contact numbers, and service history"
        columns={columns}
        data={customers}
        addButtonLabel="Add New Customer"
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* Add Customer Modal */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form
              onSubmit={handleAddCustomer}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 outline-none"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200 dark:border-brand-800">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Customer</h3>
                </div>
                <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="rahul.sharma@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Varanasi Locality</label>
                  <select
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                  >
                    <option value="Sigra">Sigra</option>
                    <option value="Lanka / Assi Ghat">Lanka / Assi Ghat</option>
                    <option value="Bhelupur">Bhelupur</option>
                    <option value="Mahmoorganj">Mahmoorganj</option>
                    <option value="Chetganj">Chetganj</option>
                    <option value="Nadesar">Nadesar</option>
                    <option value="Cantt">Cantt</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Delivery / Service Address</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="House No., Colony, Landmark..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux transition-colors"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 outline-none">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-sm shadow-lux">
                    {selectedCustomer.name[0]}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{selectedCustomer.id}</p>
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
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Contact & Locality</span>
                  <div className="text-slate-800 dark:text-slate-200 font-medium">{selectedCustomer.phone}</div>
                  <div className="text-slate-500">{selectedCustomer.email}</div>
                  <div className="text-brand-600 dark:text-brand-400 font-bold mt-1">{selectedCustomer.address}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Spend</span>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      ₹{selectedCustomer.totalSpend.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Bookings Done</span>
                    <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {selectedCustomer.totalBookings} Jobs
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
                >
                  Close Profile
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
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setEditCustomer(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
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
                <button type="button" onClick={() => setDeleteCustomer(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
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
