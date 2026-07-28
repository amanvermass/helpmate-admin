"use client";

import { useState } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { initialUsers, UserManagementItem, UserPermissions, ModulePermission } from "@/lib/mockData";
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  Lock,
  Eye,
  Edit,
  Trash2,
  X,
  UserCheck,
  ShieldAlert,
  CalendarCheck,
  Wrench,
  Users,
  UserCheck as FleetIcon,
  CreditCard,
  BarChart3,
  KeyRound,
} from "lucide-react";
import { Portal } from "@/components/Portal";
import { PermissionGuard } from "@/components/PermissionGuard";

type ModuleKey = "bookings" | "services" | "customers" | "fleet" | "finance" | "reports" | "rbac";

const modulesList: { key: ModuleKey; label: string; icon: any; desc: string }[] = [
  { key: "bookings", label: "Bookings & Jobs", icon: CalendarCheck, desc: "Manage customer requests, live job dispatches & schedules" },
  { key: "services", label: "Service Catalog & CMS", icon: Wrench, desc: "Configure base pricing, category rate cards & add-ons" },
  { key: "customers", label: "Customers CRM", icon: Users, desc: "Access Varanasi client profiles & Crown Elite memberships" },
  { key: "fleet", label: "Technician Fleet & KYC", icon: FleetIcon, desc: "Onboard technicians, verify Aadhaar & police clearance" },
  { key: "finance", label: "Billing, Payments & GST", icon: CreditCard, desc: "Generate GST invoices, process refunds & partner payouts" },
  { key: "reports", label: "Reports & Analytics", icon: BarChart3, desc: "Export financial statements & executive analytics" },
  { key: "rbac", label: "User Management & RBAC", icon: KeyRound, desc: "Manage admin accounts, assigned roles & permission matrix" },
];

const defaultModulePerms: Record<ModuleKey, ModulePermission> = {
  bookings: { view: true, edit: true, delete: false },
  services: { view: true, edit: false, delete: false },
  customers: { view: true, edit: true, delete: false },
  fleet: { view: true, edit: false, delete: false },
  finance: { view: false, edit: false, delete: false },
  reports: { view: false, edit: false, delete: false },
  rbac: { view: false, edit: false, delete: false },
};

const defaultFullPermissions: UserPermissions = {
  ...defaultModulePerms,
  canDispatchJobs: true,
  canEditServices: false,
  canProcessRefunds: false,
  canManageFleet: false,
  canExportReports: false,
  canManageRbac: false,
  canViewAuditLogs: true,
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserManagementItem[]>(initialUsers);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewUser, setViewUser] = useState<UserManagementItem | null>(null);
  const [editUser, setEditUser] = useState<UserManagementItem | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserManagementItem | null>(null);

  // Add User Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [locality, setLocality] = useState("Varanasi HQ");
  const [role, setRole] = useState<UserManagementItem["role"]>("Varanasi Dispatcher");
  const [status, setStatus] = useState<"Active" | "Suspended">("Active");
  const [addPermissions, setAddPermissions] = useState<UserPermissions>(defaultFullPermissions);

  const columns: Column<UserManagementItem>[] = [
    {
      key: "name",
      header: "Staff Member",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 dark:text-white text-xs">{row.name}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "role",
      header: "Assigned Role",
      accessor: (row) => (
        <span className="font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800 text-xs">
          {row.role}
        </span>
      ),
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
      sortable: true,
    },
    { key: "lastLogin", header: "Last Active", sortable: true },
    {
      key: "id",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setViewUser(row)}
            title="View User Details & Permissions"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditUser(JSON.parse(JSON.stringify(row)))}
            title="Edit User & Permissions"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteUser(row)}
            title="Delete User Account"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950 text-slate-600 dark:text-slate-300 hover:text-red-600 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newItem: UserManagementItem = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || "+91 98390 00000",
      locality: locality || "Varanasi HQ",
      role,
      status,
      lastLogin: "Just Now",
      permissions: addPermissions,
    };

    setUsers([newItem, ...users]);
    setName("");
    setEmail("");
    setPhone("");
    setIsAddOpen(false);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
    setEditUser(null);
  };

  const handleDeleteUserConfirm = () => {
    if (!deleteUser) return;
    setUsers(users.filter((u) => u.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const togglePermissionOption = (
    targetPerms: UserPermissions,
    modKey: ModuleKey,
    permType: "view" | "edit" | "delete"
  ): UserPermissions => {
    const currentMod = targetPerms[modKey] || { view: false, edit: false, delete: false };
    const updatedMod = { ...currentMod, [permType]: !currentMod[permType] };

    // Auto-update global flags based on modules
    return {
      ...targetPerms,
      [modKey]: updatedMod,
      canDispatchJobs: modKey === "bookings" ? updatedMod.view || updatedMod.edit : targetPerms.canDispatchJobs,
      canEditServices: modKey === "services" ? updatedMod.edit : targetPerms.canEditServices,
      canProcessRefunds: modKey === "finance" ? updatedMod.edit : targetPerms.canProcessRefunds,
      canManageFleet: modKey === "fleet" ? updatedMod.edit || updatedMod.view : targetPerms.canManageFleet,
      canExportReports: modKey === "reports" ? updatedMod.view || updatedMod.edit : targetPerms.canExportReports,
      canManageRbac: modKey === "rbac" ? updatedMod.edit : targetPerms.canManageRbac,
    };
  };

  return (
    <PermissionGuard permissionKey="canManageRbac">
      <div className="space-y-6">
        {/* Main DataTable with Title, Description and Top-Right Action Buttons */}
        <DataTable
          title="Admin User Management & RBAC Directory"
          description="Configure staff accounts with View, Edit, and Delete permission controls for every module"
          columns={columns}
          data={users}
          addButtonLabel="Add New Staff Member"
          onAddClick={() => setIsAddOpen(true)}
        />

        {/* VIEW USER DETAILS & PERMISSIONS MATRIX MODAL */}
        {viewUser && (
          <Portal>
            <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
              <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 outline-none max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-brand-50 dark:bg-brand-950 text-brand-600 rounded-2xl">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{viewUser.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{viewUser.email} • {viewUser.role}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setViewUser(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info Cards */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Phone Number</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{viewUser.phone || "+91 98390 12345"}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Account Status</span>
                    <span className={`font-extrabold ${viewUser.status === "Active" ? "text-emerald-600" : "text-red-500"}`}>
                      {viewUser.status}
                    </span>
                  </div>
                </div>

                {/* Module View / Edit / Delete Permission Matrix */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-brand-600" />
                    View, Edit & Delete Permission Matrix
                  </h4>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
                    <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 flex items-center justify-between font-bold text-[11px] text-slate-500">
                      <span>Module Name</span>
                      <div className="flex gap-6 pr-2">
                        <span>View</span>
                        <span>Edit</span>
                        <span>Delete</span>
                      </div>
                    </div>

                    {modulesList.map((mod) => {
                      const modPerms = viewUser.permissions?.[mod.key] || { view: false, edit: false, delete: false };
                      const Icon = mod.icon;

                      return (
                        <div key={mod.key} className="p-3 bg-white dark:bg-slate-900 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-brand-600 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{mod.label}</span>
                              <span className="text-[10px] text-slate-400 block">{mod.desc}</span>
                            </div>
                          </div>

                          <div className="flex gap-6 pr-2 font-bold text-xs">
                            <span className={modPerms.view ? "text-emerald-600" : "text-slate-300 dark:text-slate-700"}>
                              {modPerms.view ? "✓ Yes" : "✕ No"}
                            </span>
                            <span className={modPerms.edit ? "text-brand-600" : "text-slate-300 dark:text-slate-700"}>
                              {modPerms.edit ? "✓ Yes" : "✕ No"}
                            </span>
                            <span className={modPerms.delete ? "text-red-600" : "text-slate-300 dark:text-slate-700"}>
                              {modPerms.delete ? "✓ Yes" : "✕ No"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditUser(JSON.parse(JSON.stringify(viewUser)));
                      setViewUser(null);
                    }}
                    className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shadow-lux"
                  >
                    Edit Permissions
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewUser(null)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Portal>
        )}

        {/* EDIT USER & GRANULAR VIEW/EDIT/DELETE PERMISSIONS MODAL */}
        {editUser && (
          <Portal>
            <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
              <form
                onSubmit={handleUpdateUser}
                className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 outline-none max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Edit User & Permission Controls</h3>
                    <p className="text-xs text-slate-400">Toggle View, Edit, and Delete privileges per module</p>
                  </div>
                  <button type="button" onClick={() => setEditUser(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Staff Full Name *</label>
                      <input
                        type="text"
                        required
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Role</label>
                      <select
                        value={editUser.role}
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Varanasi Dispatcher">Varanasi Dispatcher</option>
                        <option value="Fleet Inspector">Fleet Inspector</option>
                        <option value="Support Agent">Support Agent</option>
                        <option value="Billing & Finance Manager">Billing & Finance Manager</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Account Status</label>
                      <select
                        value={editUser.status}
                        onChange={(e) => setEditUser({ ...editUser, status: e.target.value as any })}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      >
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  {/* Module View / Edit / Delete Toggles Table */}
                  <div className="space-y-2 pt-2">
                    <label className="font-black text-slate-900 dark:text-white block text-xs uppercase tracking-wider">
                      Module-Level View, Edit & Delete Permissions
                    </label>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 bg-slate-50 dark:bg-slate-800/40">
                      <div className="bg-slate-100 dark:bg-slate-800/90 px-4 py-2 flex items-center justify-between font-bold text-[11px] text-slate-500">
                        <span>Module</span>
                        <div className="flex gap-8 pr-4">
                          <span>View</span>
                          <span>Edit</span>
                          <span>Delete</span>
                        </div>
                      </div>

                      {modulesList.map((mod) => {
                        const modPerms = editUser.permissions?.[mod.key] || { view: false, edit: false, delete: false };
                        const Icon = mod.icon;

                        return (
                          <div key={mod.key} className="p-3 flex items-center justify-between bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-brand-600 shrink-0" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{mod.label}</span>
                                <span className="text-[10px] text-slate-400 block">{mod.desc}</span>
                              </div>
                            </div>

                            <div className="flex gap-8 pr-3 items-center">
                              {/* View Checkbox */}
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.view}
                                  onChange={() => setEditUser({ ...editUser, permissions: togglePermissionOption(editUser.permissions, mod.key, "view") })}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">View</span>
                              </label>

                              {/* Edit Checkbox */}
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.edit}
                                  onChange={() => setEditUser({ ...editUser, permissions: togglePermissionOption(editUser.permissions, mod.key, "edit") })}
                                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Edit</span>
                              </label>

                              {/* Delete Checkbox */}
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.delete}
                                  onChange={() => setEditUser({ ...editUser, permissions: togglePermissionOption(editUser.permissions, mod.key, "delete") })}
                                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Delete</span>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux"
                  >
                    Save User & Permissions
                  </button>
                </div>
              </form>
            </div>
          </Portal>
        )}

        {/* DELETE USER CONFIRMATION MODAL */}
        {deleteUser && (
          <Portal>
            <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
              <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl outline-none">
                <div className="flex items-center gap-3 text-red-600">
                  <div className="p-3 bg-red-100 dark:bg-red-950 rounded-2xl">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Delete Staff Account</h3>
                    <p className="text-xs text-slate-400">Revoke all admin permissions and delete account</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Are you sure you want to delete staff account <strong>{deleteUser.name}</strong> ({deleteUser.email})? This action cannot be undone.
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteUser(null)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteUserConfirm}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-lux"
                  >
                    Delete Staff User
                  </button>
                </div>
              </div>
            </div>
          </Portal>
        )}

        {/* ADD NEW STAFF USER MODAL */}
        {isAddOpen && (
          <Portal>
            <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
              <form
                onSubmit={handleAddUser}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-2xl w-full space-y-4 ring-1 ring-slate-900/10 dark:ring-slate-800 shadow-2xl outline-none max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Staff User</h3>
                  <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@helpmate.com"
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Role Allocation</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as any)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                      >
                        <option value="Super Admin">Super Admin</option>
                        <option value="Varanasi Dispatcher">Varanasi Dispatcher</option>
                        <option value="Fleet Inspector">Fleet Inspector</option>
                        <option value="Support Agent">Support Agent</option>
                        <option value="Billing & Finance Manager">Billing & Finance Manager</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Locality Zone</label>
                      <input
                        type="text"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                  </div>

                  {/* Add Permission View / Edit / Delete Toggles */}
                  <div className="space-y-2 pt-2">
                    <label className="font-black text-slate-900 dark:text-white block text-xs uppercase tracking-wider">
                      Module-Level View, Edit & Delete Permissions
                    </label>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 bg-slate-50 dark:bg-slate-800/40">
                      <div className="bg-slate-100 dark:bg-slate-800/90 px-4 py-2 flex items-center justify-between font-bold text-[11px] text-slate-500">
                        <span>Module</span>
                        <div className="flex gap-8 pr-4">
                          <span>View</span>
                          <span>Edit</span>
                          <span>Delete</span>
                        </div>
                      </div>

                      {modulesList.map((mod) => {
                        const modPerms = addPermissions[mod.key] || { view: false, edit: false, delete: false };
                        const Icon = mod.icon;

                        return (
                          <div key={mod.key} className="p-3 flex items-center justify-between bg-white dark:bg-slate-900">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-brand-600 shrink-0" />
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white block">{mod.label}</span>
                                <span className="text-[10px] text-slate-400 block">{mod.desc}</span>
                              </div>
                            </div>

                            <div className="flex gap-8 pr-3 items-center">
                              {/* View Checkbox */}
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.view}
                                  onChange={() => setAddPermissions(togglePermissionOption(addPermissions, mod.key, "view"))}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">View</span>
                              </label>

                              {/* Edit Checkbox */}
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.edit}
                                  onChange={() => setAddPermissions(togglePermissionOption(addPermissions, mod.key, "edit"))}
                                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Edit</span>
                              </label>

                              {/* Delete Checkbox */}
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!modPerms.delete}
                                  onChange={() => setAddPermissions(togglePermissionOption(addPermissions, mod.key, "delete"))}
                                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
                                />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Delete</span>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux"
                  >
                    Create Staff Account
                  </button>
                </div>
              </form>
            </div>
          </Portal>
        )}
      </div>
    </PermissionGuard>
  );
}
