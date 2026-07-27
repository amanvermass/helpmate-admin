"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type RoleType =
  | "Super Admin"
  | "Admin"
  | "Operations Manager"
  | "Finance"
  | "Support"
  | "City Manager";

export interface PermissionMatrix {
  viewAll: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canBulkAction: boolean;
  canExport: boolean;
  canRefund: boolean;
  canManageUsers: boolean;
}

const rolePermissions: Record<RoleType, PermissionMatrix> = {
  "Super Admin": {
    viewAll: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canBulkAction: true,
    canExport: true,
    canRefund: true,
    canManageUsers: true,
  },
  Admin: {
    viewAll: true,
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canBulkAction: true,
    canExport: true,
    canRefund: true,
    canManageUsers: false,
  },
  "Operations Manager": {
    viewAll: true,
    canAdd: true,
    canEdit: true,
    canDelete: false,
    canBulkAction: true,
    canExport: true,
    canRefund: false,
    canManageUsers: false,
  },
  Finance: {
    viewAll: true,
    canAdd: false,
    canEdit: true,
    canDelete: false,
    canBulkAction: false,
    canExport: true,
    canRefund: true,
    canManageUsers: false,
  },
  Support: {
    viewAll: true,
    canAdd: false,
    canEdit: true,
    canDelete: false,
    canBulkAction: false,
    canExport: false,
    canRefund: false,
    canManageUsers: false,
  },
  "City Manager": {
    viewAll: true,
    canAdd: true,
    canEdit: true,
    canDelete: false,
    canBulkAction: false,
    canExport: true,
    canRefund: false,
    canManageUsers: false,
  },
};

interface RbacContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  permissions: PermissionMatrix;
  hasPermission: (action: keyof PermissionMatrix) => boolean;
}

const RbacContext = createContext<RbacContextType | undefined>(undefined);

export function RbacProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType>("Super Admin");

  useEffect(() => {
    const saved = localStorage.getItem("helpmate_user_role");
    if (saved && saved in rolePermissions) {
      setRoleState(saved as RoleType);
    }
  }, []);

  const setRole = (newRole: RoleType) => {
    setRoleState(newRole);
    localStorage.setItem("helpmate_user_role", newRole);
  };

  const permissions = rolePermissions[role];

  const hasPermission = (action: keyof PermissionMatrix) => {
    return permissions[action] ?? false;
  };

  return (
    <RbacContext.Provider value={{ role, setRole, permissions, hasPermission }}>
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
