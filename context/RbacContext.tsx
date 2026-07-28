"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserPermissions, initialUsers, UserManagementItem } from "@/lib/mockData";

export type RoleType =
  | "Super Admin"
  | "Varanasi Dispatcher"
  | "Fleet Inspector"
  | "Billing & Finance Manager"
  | "Support Agent";

const rolePermissionsMap: Record<RoleType, UserPermissions> = {
  "Super Admin": {
    bookings: { view: true, edit: true, delete: true },
    services: { view: true, edit: true, delete: true },
    customers: { view: true, edit: true, delete: true },
    fleet: { view: true, edit: true, delete: true },
    finance: { view: true, edit: true, delete: true },
    reports: { view: true, edit: true, delete: true },
    rbac: { view: true, edit: true, delete: true },
    canDispatchJobs: true,
    canEditServices: true,
    canProcessRefunds: true,
    canManageFleet: true,
    canExportReports: true,
    canManageRbac: true,
    canViewAuditLogs: true,
  },
  "Varanasi Dispatcher": {
    bookings: { view: true, edit: true, delete: false },
    services: { view: true, edit: false, delete: false },
    customers: { view: true, edit: true, delete: false },
    fleet: { view: true, edit: true, delete: false },
    finance: { view: false, edit: false, delete: false },
    reports: { view: false, edit: false, delete: false },
    rbac: { view: false, edit: false, delete: false },
    canDispatchJobs: true,
    canEditServices: false,
    canProcessRefunds: false,
    canManageFleet: true,
    canExportReports: false,
    canManageRbac: false,
    canViewAuditLogs: true,
  },
  "Fleet Inspector": {
    bookings: { view: true, edit: true, delete: false },
    services: { view: true, edit: false, delete: false },
    customers: { view: true, edit: false, delete: false },
    fleet: { view: true, edit: true, delete: false },
    finance: { view: false, edit: false, delete: false },
    reports: { view: false, edit: false, delete: false },
    rbac: { view: false, edit: false, delete: false },
    canDispatchJobs: true,
    canEditServices: false,
    canProcessRefunds: false,
    canManageFleet: true,
    canExportReports: false,
    canManageRbac: false,
    canViewAuditLogs: false,
  },
  "Billing & Finance Manager": {
    bookings: { view: true, edit: false, delete: false },
    services: { view: true, edit: true, delete: false },
    customers: { view: true, edit: false, delete: false },
    fleet: { view: false, edit: false, delete: false },
    finance: { view: true, edit: true, delete: true },
    reports: { view: true, edit: true, delete: false },
    rbac: { view: false, edit: false, delete: false },
    canDispatchJobs: false,
    canEditServices: true,
    canProcessRefunds: true,
    canManageFleet: false,
    canExportReports: true,
    canManageRbac: false,
    canViewAuditLogs: true,
  },
  "Support Agent": {
    bookings: { view: true, edit: true, delete: false },
    services: { view: true, edit: false, delete: false },
    customers: { view: true, edit: true, delete: false },
    fleet: { view: true, edit: false, delete: false },
    finance: { view: true, edit: false, delete: false },
    reports: { view: false, edit: false, delete: false },
    rbac: { view: false, edit: false, delete: false },
    canDispatchJobs: true,
    canEditServices: false,
    canProcessRefunds: true,
    canManageFleet: false,
    canExportReports: false,
    canManageRbac: false,
    canViewAuditLogs: false,
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
