"use client";

import { useState } from "react";
import { CustomSelect } from "@/components/CustomSelect";
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
  UserCheck as TechIcon,
  CreditCard,
  BarChart3,
  KeyRound,
  Tag,
  Star,
  FileImage,
  FileText,
  DollarSign,
  Building2,
  Sliders,
  TrendingUp,
  Search,
} from "lucide-react";
import { Portal } from "@/components/Portal";
import { PermissionGuard } from "@/components/PermissionGuard";

type ModuleKey =
  | "bookings" | "inspections" | "customers" | "technicians"
  | "categories" | "cms" | "pricing" | "locations"
  | "payments" | "billing" | "commission" | "coupons"
  | "reviews" | "media" | "analytics" | "reports" | "rbac";

const modulesList: { key: ModuleKey; label: string; icon: any; desc: string }[] = [
  // Operations
  { key: "bookings",    label: "Bookings & Jobs",          icon: CalendarCheck, desc: "Manage customer requests, live job assignments & schedules" },
  { key: "inspections", label: "Inspections",               icon: Search,        desc: "On-site service inspections and quality verification" },
  // Fleet & Customers
  { key: "customers",   label: "Customers CRM",            icon: Users,         desc: "Access client profiles & Crown Elite memberships" },
  { key: "technicians", label: "Partner Fleet & KYC",      icon: TechIcon,      desc: "Onboard technicians, verify Aadhaar & police clearance" },
  // Services & Pricing
  { key: "categories",  label: "Category Catalog",         icon: Sliders,       desc: "Manage service categories and sub-categories" },
  { key: "cms",         label: "Services CMS",              icon: Wrench,        desc: "Configure service listings, descriptions & media" },
  { key: "pricing",     label: "Pricing Engine",            icon: Tag,           desc: "Set base prices, add-ons and rate cards" },
  { key: "locations",   label: "Locations & Pincodes",     icon: Building2,     desc: "Manage serviceable areas and pincode zones" },
  // Finance & Billing
  { key: "payments",    label: "Payments",                 icon: CreditCard,    desc: "Track UPI, card and cash payment transactions" },
  { key: "billing",     label: "Billing & GST",            icon: FileText,      desc: "Generate GST invoices, process refunds & receipts" },
  { key: "commission",  label: "Commission & Settlements", icon: DollarSign,    desc: "25% platform commission engine & weekly payouts" },
  { key: "coupons",     label: "Coupons & Offers",         icon: Tag,           desc: "Discount codes, bank offers and promo campaigns" },
  // System
  { key: "reviews",     label: "Customer Reviews",         icon: Star,          desc: "Moderate ratings and quality feedback" },
  { key: "media",       label: "Media Library",            icon: FileImage,     desc: "Upload and manage service images and assets" },
  { key: "analytics",   label: "Executive Analytics",      icon: TrendingUp,    desc: "Real-time dashboards and KPI tracking" },
  { key: "reports",     label: "Reports & Exports",        icon: BarChart3,     desc: "Export financial statements & audit logs" },
  { key: "rbac",        label: "User Management & RBAC",   icon: KeyRound,      desc: "Manage admin accounts and permission matrix" },
];

const off: ModulePermission = { view: false, create: false, edit: false, delete: false };

const defaultModulePerms: Record<ModuleKey, ModulePermission> = {
  bookings:    { view: true,  create: true,  edit: true,  delete: false },
  inspections: { view: true,  create: false, edit: false, delete: false },
  customers:   { view: true,  create: false, edit: true,  delete: false },
  technicians: { view: true,  create: false, edit: false, delete: false },
  categories:  off,
  cms:         off,
  pricing:     off,
  locations:   { view: true,  create: false, edit: false, delete: false },
  payments:    off,
  billing:     off,
  commission:  off,
  coupons:     off,
  reviews:     { view: true,  create: false, edit: false, delete: false },
  media:       off,
  analytics:   off,
  reports:     off,
  rbac:        off,
};

const defaultFullPermissions: UserPermissions = {
  ...defaultModulePerms,
  canAssignJobs: true,
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
  const [editUser, setEditUser] = useState<UserManagementItem | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserManagementItem | null>(null);

  // Add User Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [locality, setLocality] = useState("Varanasi HQ");
  const [role, setRole] = useState<UserManagementItem["role"]>("Varanasi Operations Coordinator");
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
    permType: "view" | "create" | "edit" | "delete"
  ): UserPermissions => {
    const currentMod = targetPerms[modKey] || { view: false, create: false, edit: false, delete: false };
    const updatedMod = { ...currentMod, [permType]: !currentMod[permType] };

    // Auto-update global feature flags based on toggled module
    return {
      ...targetPerms,
      [modKey]: updatedMod,
      canAssignJobs:   modKey === "bookings"    ? updatedMod.view || updatedMod.edit : targetPerms.canAssignJobs,
      canEditServices:   (modKey === "cms" || modKey === "pricing") ? updatedMod.edit || updatedMod.create : targetPerms.canEditServices,
      canProcessRefunds: modKey === "payments"    ? updatedMod.edit : targetPerms.canProcessRefunds,
      canManageFleet:    modKey === "technicians" ? updatedMod.edit || updatedMod.view : targetPerms.canManageFleet,
      canExportReports:  modKey === "reports"     ? updatedMod.view || updatedMod.edit : targetPerms.canExportReports,
      canManageRbac:     modKey === "rbac"        ? updatedMod.edit : targetPerms.canManageRbac,
    };
  };


  return (
    <PermissionGuard permissionKey="canManageRbac">
      <div className="space-y-6">
        {/* Top Header Banner matching Billing layout */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 text-white shadow-lux flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Role & Permission Management Engine
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Admin User Management & RBAC Directory</h1>
            <p className="text-xs text-brand-100 mt-1 max-w-xl">
              Configure staff accounts with View, Edit, and Delete permission controls for every module.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white text-brand-900 font-extrabold text-xs shadow-md hover:bg-brand-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-brand-600" />
              <span>Add New Staff Member</span>
            </button>
          </div>
        </div>

        {/* Main DataTable without duplicate headers */}
        <DataTable
          columns={columns}
          data={users}
        />

        {/* EDIT USER & GRANULAR VIEW/EDIT/DELETE PERMISSIONS DRAWER */}
        {editUser && (
          <Portal>
            <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
              <div className="absolute inset-0" onClick={() => setEditUser(null)} />
              <form
                onSubmit={handleUpdateUser}
                className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none overflow-y-auto"
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
                    <CustomSelect
                      label="Assigned Role"
                      value={editUser.role}
                      onChange={(val) => setEditUser({ ...editUser, role: val as any })}
                      options={[
                        { value: "Super Admin", label: "Super Admin" },
                        { value: "Varanasi Operations Coordinator", label: "Varanasi Operations Coordinator" },
                        { value: "Fleet Inspector", label: "Fleet Inspector" },
                        { value: "Support Agent", label: "Support Agent" },
                        { value: "Billing & Finance Manager", label: "Billing & Finance Manager" },
                      ]}
                    />
                    <CustomSelect
                      label="Account Status"
                      value={editUser.status}
                      onChange={(val) => setEditUser({ ...editUser, status: val as any })}
                      options={[
                        { value: "Active", label: "Active" },
                        { value: "Suspended", label: "Suspended" },
                      ]}
                    />
                  </div>

                  {/* Module Permissions — Enhanced Toggle Pills */}
                  <div className="space-y-2 pt-2">
                    <label className="font-black text-slate-900 dark:text-white block text-xs uppercase tracking-wider">Module Permissions</label>
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
                      {/* Column Header Row */}
                      <div className="px-4 py-2 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
                        <span className="text-[11px] font-bold text-slate-500">Module</span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-3">
                          <span className="w-[52px] text-center text-[10px] font-bold text-brand-500">View</span>
                          <span className="w-[52px] text-center text-[10px] font-bold text-emerald-500">Create</span>
                          <span className="w-[52px] text-center text-[10px] font-bold text-amber-500">Edit</span>
                          <span className="w-[52px] text-center text-[10px] font-bold text-red-500">Delete</span>
                        </div>
                      </div>
                      {modulesList.map((mod) => {
                        const modPerms = editUser.permissions?.[mod.key] || { view: false, create: false, edit: false, delete: false };
                        const Icon = mod.icon;
                        const activeCount = [modPerms.view, modPerms.create, modPerms.edit, modPerms.delete].filter(Boolean).length;
                        return (
                          <div key={mod.key} className="px-4 py-3 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                                activeCount === 4 ? "bg-brand-50 dark:bg-brand-950 text-brand-600" :
                                activeCount > 0 ? "bg-amber-50 dark:bg-amber-950 text-amber-600" :
                                "bg-slate-100 dark:bg-slate-800 text-slate-400"
                              }`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 dark:text-white block text-[11px] truncate">{mod.label}</span>
                                <span className="text-[10px] text-slate-400 block truncate">{mod.desc}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-3">
                              <button
                                type="button"
                                onClick={() => setEditUser({ ...editUser, permissions: togglePermissionOption(editUser.permissions, mod.key, "view") })}
                                className={`w-[52px] py-1 rounded-lg text-[10px] font-bold transition-all border text-center ${
                                  modPerms.view
                                    ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:text-brand-500"
                                }`}
                              >View</button>
                              <button
                                type="button"
                                onClick={() => setEditUser({ ...editUser, permissions: togglePermissionOption(editUser.permissions, mod.key, "create") })}
                                className={`w-[52px] py-1 rounded-lg text-[10px] font-bold transition-all border text-center ${
                                  modPerms.create
                                    ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:text-emerald-500"
                                }`}
                              >Create</button>
                              <button
                                type="button"
                                onClick={() => setEditUser({ ...editUser, permissions: togglePermissionOption(editUser.permissions, mod.key, "edit") })}
                                className={`w-[52px] py-1 rounded-lg text-[10px] font-bold transition-all border text-center ${
                                  modPerms.edit
                                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:text-amber-500"
                                }`}
                              >Edit</button>
                              <button
                                type="button"
                                onClick={() => setEditUser({ ...editUser, permissions: togglePermissionOption(editUser.permissions, mod.key, "delete") })}
                                className={`w-[52px] py-1 rounded-lg text-[10px] font-bold transition-all border text-center ${
                                  modPerms.delete
                                    ? "bg-red-500 text-white border-red-500 shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-red-300 hover:text-red-500"
                                }`}
                              >Delete</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto pt-2">
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

        {/* ADD NEW STAFF USER DRAWER */}
        {isAddOpen && (
          <Portal>
            <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
              <div className="absolute inset-0" onClick={() => setIsAddOpen(false)} />
              <form
                onSubmit={handleAddUser}
                className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none overflow-y-auto"
              >
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-brand-600" />
                      <span>Add New Staff Member</span>
                    </h3>
                    <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
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
                        <option value="Varanasi Operations Coordinator">Varanasi Operations Coordinator</option>
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
                        placeholder="e.g. Sigra, Lanka"
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                      />
                    </div>
                    </div>

                    {/* Module Permissions — Enhanced Toggle Pills */}
                    <div className="space-y-2 pt-1">
                      <label className="font-black text-slate-900 dark:text-white block text-xs uppercase tracking-wider">Module Permissions</label>
                      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
                        {/* Column Header Row */}
                        <div className="px-4 py-2 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
                          <span className="text-[11px] font-bold text-slate-500">Module</span>
                          <div className="flex items-center gap-1.5 shrink-0 ml-3">
                            <span className="w-[52px] text-center text-[10px] font-bold text-brand-500">View</span>
                            <span className="w-[52px] text-center text-[10px] font-bold text-emerald-500">Create</span>
                            <span className="w-[52px] text-center text-[10px] font-bold text-amber-500">Edit</span>
                            <span className="w-[52px] text-center text-[10px] font-bold text-red-500">Delete</span>
                          </div>
                        </div>
                        {modulesList.map((mod) => {
                          const modPerms = addPermissions[mod.key] || { view: false, create: false, edit: false, delete: false };
                          const Icon = mod.icon;
                          const activeCount = [modPerms.view, modPerms.create, modPerms.edit, modPerms.delete].filter(Boolean).length;
                          return (
                            <div key={mod.key} className="px-4 py-3 flex items-center justify-between bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                                  activeCount === 4 ? "bg-brand-50 dark:bg-brand-950 text-brand-600" :
                                  activeCount > 0 ? "bg-amber-50 dark:bg-amber-950 text-amber-600" :
                                  "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <span className="font-bold text-slate-900 dark:text-white block text-[11px] truncate">{mod.label}</span>
                                  <span className="text-[10px] text-slate-400 block truncate">{mod.desc}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                                <button
                                  type="button"
                                  onClick={() => setAddPermissions(togglePermissionOption(addPermissions, mod.key, "view"))}
                                  className={`w-[52px] py-1 rounded-lg text-[10px] font-bold transition-all border text-center ${
                                    modPerms.view
                                      ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-300 hover:text-brand-500"
                                  }`}
                                >View</button>
                                <button
                                  type="button"
                                  onClick={() => setAddPermissions(togglePermissionOption(addPermissions, mod.key, "create"))}
                                  className={`w-[52px] py-1 rounded-lg text-[10px] font-bold transition-all border text-center ${
                                    modPerms.create
                                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:text-emerald-500"
                                  }`}
                                >Create</button>
                                <button
                                  type="button"
                                  onClick={() => setAddPermissions(togglePermissionOption(addPermissions, mod.key, "edit"))}
                                  className={`w-[52px] py-1 rounded-lg text-[10px] font-bold transition-all border text-center ${
                                    modPerms.edit
                                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-300 hover:text-amber-500"
                                  }`}
                                >Edit</button>
                                <button
                                  type="button"
                                  onClick={() => setAddPermissions(togglePermissionOption(addPermissions, mod.key, "delete"))}
                                  className={`w-[52px] py-1 rounded-lg text-[10px] font-bold transition-all border text-center ${
                                    modPerms.delete
                                      ? "bg-red-500 text-white border-red-500 shadow-sm"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-red-300 hover:text-red-500"
                                  }`}
                                >Delete</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-xs shadow-lux">Create Staff Account</button>
                </div>
              </form>
            </div>
          </Portal>
        )}
      </div>
    </PermissionGuard>
  );
}
