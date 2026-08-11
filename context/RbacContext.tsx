"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserPermissions, initialUsers, UserManagementItem } from "@/lib/mockData";

export type RoleType =
  | "Super Admin"
  | "Varanasi Operations Coordinator"
  | "Fleet Inspector"
  | "Billing & Finance Manager"
  | "Support Agent"
  | "Service Partner";

const o   = { view: false, create: false, edit: false, delete: false };
const r   = { view: true,  create: false, edit: false, delete: false };
const rw  = { view: true,  create: false, edit: true,  delete: false };
const rc  = { view: true,  create: true,  edit: false, delete: false };
const rcw = { view: true,  create: true,  edit: true,  delete: false };
const rwd = { view: true,  create: true,  edit: true,  delete: true  };

const rolePermissionsMap: Record<RoleType, UserPermissions> = {
  "Super Admin": {
    bookings: rwd, inspections: rwd, customers: rwd, technicians: rwd,
    categories: rwd, cms: rwd, pricing: rwd, locations: rwd,
    payments: rwd, billing: rwd, commission: rwd, coupons: rwd,
    reviews: rwd, media: rwd, analytics: rwd, reports: rwd, rbac: rwd,
    canAssignJobs: true, canEditServices: true, canProcessRefunds: true,
    canManageFleet: true, canExportReports: true, canManageRbac: true, canViewAuditLogs: true,
  },
  "Varanasi Operations Coordinator": {
    bookings: rw, inspections: rw, customers: rw, technicians: rw,
    categories: r, cms: o, pricing: o, locations: r,
    payments: o, billing: o, commission: o, coupons: o,
    reviews: r, media: o, analytics: o, reports: o, rbac: o,
    canAssignJobs: true, canEditServices: false, canProcessRefunds: false,
    canManageFleet: true, canExportReports: false, canManageRbac: false, canViewAuditLogs: true,
  },
  "Fleet Inspector": {
    bookings: rw, inspections: rw, customers: r, technicians: rw,
    categories: o, cms: o, pricing: o, locations: r,
    payments: o, billing: o, commission: o, coupons: o,
    reviews: r, media: o, analytics: o, reports: o, rbac: o,
    canAssignJobs: true, canEditServices: false, canProcessRefunds: false,
    canManageFleet: true, canExportReports: false, canManageRbac: false, canViewAuditLogs: false,
  },
  "Billing & Finance Manager": {
    bookings: r, inspections: o, customers: r, technicians: o,
    categories: r, cms: rw, pricing: rw, locations: r,
    payments: rw, billing: rwd, commission: rw, coupons: rw,
    reviews: o, media: o, analytics: r, reports: rw, rbac: o,
    canAssignJobs: false, canEditServices: true, canProcessRefunds: true,
    canManageFleet: false, canExportReports: true, canManageRbac: false, canViewAuditLogs: true,
  },
  "Support Agent": {
    bookings: rw, inspections: r, customers: rw, technicians: r,
    categories: o, cms: o, pricing: o, locations: o,
    payments: r, billing: r, commission: o, coupons: o,
    reviews: r, media: o, analytics: o, reports: o, rbac: o,
    canAssignJobs: true, canEditServices: false, canProcessRefunds: true,
    canManageFleet: false, canExportReports: false, canManageRbac: false, canViewAuditLogs: false,
  },
  "Service Partner": {
    bookings: rw, inspections: r, customers: o, technicians: o,
    categories: o, cms: o, pricing: o, locations: o,
    payments: r, billing: o, commission: o, coupons: o,
    reviews: o, media: o, analytics: o, reports: o, rbac: o,
    canAssignJobs: false, canEditServices: false, canProcessRefunds: false,
    canManageFleet: false, canExportReports: false, canManageRbac: false, canViewAuditLogs: false,
  },
};

interface RbacContextType {
  currentUser: UserManagementItem;
  setCurrentUser: (user: UserManagementItem) => void;
  role: RoleType;
  setRole: (role: RoleType) => void;
  userPermissions: UserPermissions;
  hasPermission: (permKey: keyof UserPermissions) => boolean;
  updateUserPermissions: (permissions: UserPermissions) => void;
}

const RbacContext = createContext<RbacContextType | undefined>(undefined);

export function RbacProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserManagementItem>(initialUsers[0]);

  useEffect(() => {
    const savedUserId = localStorage.getItem("helpmate_active_user_id");
    if (savedUserId) {
      const found = initialUsers.find((u) => u.id === savedUserId);
      if (found) setCurrentUser(found);
    }
  }, []);

  const handleSetCurrentUser = (user: UserManagementItem) => {
    setCurrentUser(user);
    localStorage.setItem("helpmate_active_user_id", user.id);
  };

  const handleSetRole = (newRole: RoleType) => {
    const defaultPerms = rolePermissionsMap[newRole] || rolePermissionsMap["Super Admin"];
    const updatedUser: UserManagementItem = {
      ...currentUser,
      role: newRole,
      permissions: defaultPerms,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("helpmate_active_user_id", updatedUser.id);
  };

  const handleUpdatePermissions = (newPerms: UserPermissions) => {
    const updatedUser: UserManagementItem = {
      ...currentUser,
      permissions: newPerms,
    };
    setCurrentUser(updatedUser);
  };

  const userPermissions: UserPermissions = currentUser.permissions || rolePermissionsMap[currentUser.role as RoleType] || rolePermissionsMap["Super Admin"];

  const hasPermission = (permKey: keyof UserPermissions) => {
    return !!userPermissions[permKey];
  };

  return (
    <RbacContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        role: currentUser.role as RoleType,
        setRole: handleSetRole,
        userPermissions,
        hasPermission,
        updateUserPermissions: handleUpdatePermissions,
      }}
    >
      {children}
    </RbacContext.Provider>
  );
}

export function useRbac() {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error("useRbac must be used within an RbacProvider");
  }
  return context;
}
