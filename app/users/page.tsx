"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialUsers, UserManagementItem } from "@/lib/mockData";
import { ShieldCheck, Plus, CheckCircle2, Lock } from "lucide-react";
import { useRbac } from "@/context/RbacContext";
import { Portal } from "@/components/Portal";

export default function UsersPage() {
  const [users, setUsers] = useState<UserManagementItem[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "logs">("users");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const columns: Column<UserManagementItem>[] = [
    { key: "name", header: "Staff Name", sortable: true },
    { key: "email", header: "Email Address", sortable: true },
    {
      key: "role",
      header: "Assigned Role",
      accessor: (row) => <span className="font-extrabold text-brand-600 dark:text-brand-400 text-xs">{row.role}</span>,
      sortable: true,
    },
    {
      key: "status",
      header: "Account Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "Active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { key: "lastLogin", header: "Last Active", sortable: true },
  ];

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newItem: UserManagementItem = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: "Support Agent",
      status: "Active",
      lastLogin: "Just Now",
    };

    setUsers([newItem, ...users]);
    setName("");
    setEmail("");
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Admin User Management & RBAC Directory</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage internal admin accounts, dispatch staff credentials, and system security logs</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(["users", "roles", "logs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        title="Admin Staff Accounts"
        description="Authorized admin panel users and role privilege allocations"
        columns={columns}
        data={users}
        addButtonLabel="Add Staff Member"
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* Add Modal */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
            <form onSubmit={handleAddUser} className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-md w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add Staff User</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@helpmate.com"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-brand-500 text-white rounded-xl font-bold text-xs">Create Staff Account</button>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  );
}
