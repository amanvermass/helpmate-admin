"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Portal } from "@/components/Portal";

export interface ActionItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}

export interface RowActionMenuProps {
  actions: ActionItem[];
  forceDropdown?: boolean;
}

export function RowActionMenu({ actions, forceDropdown }: RowActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; right: number }>({ right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const right = window.innerWidth - rect.right;
      
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 190 && spaceAbove > 190) {
        setCoords({ bottom: window.innerHeight - rect.top + 6, right });
      } else {
        setCoords({ top: rect.bottom + 6, right });
      }
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const right = window.innerWidth - rect.right;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        if (spaceBelow < 190 && spaceAbove > 190) {
          setCoords({ bottom: window.innerHeight - rect.top + 6, right });
        } else {
          setCoords({ top: rect.bottom + 6, right });
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  if (!actions || actions.length === 0) return null;

  const getActionClasses = (action: ActionItem, isDropdown = false) => {
    const l = action.label.trim().toLowerCase();
    const isView = l === "view" || l.startsWith("view");
    const isEdit = l === "edit" || l.startsWith("edit");
    const isDelete = action.danger || l === "delete" || l.startsWith("delete");

    if (isDropdown) {
      if (isDelete) return "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-semibold";
      if (isEdit) return "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold";
      if (isView) return "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 font-semibold";
      return "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 font-semibold";
    }

    const baseInline = "bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-all";

    if (isDelete) {
      return `${baseInline} hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 dark:hover:border-rose-800`;
    }
    if (isEdit) {
      return `${baseInline} hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 dark:hover:border-indigo-800`;
    }
    if (isView) {
      return `${baseInline} hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 dark:hover:bg-brand-950/50 dark:hover:text-brand-400 dark:hover:border-brand-800`;
    }
    return `${baseInline} hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 dark:hover:bg-brand-950/50 dark:hover:text-brand-400 dark:hover:border-brand-800`;
  };

  // If less than 3 actions and not forced dropdown, show inline icon buttons with standardized decent styling aligned to right
  if (actions.length < 3 && !forceDropdown) {
    return (
      <div className="flex items-center justify-end gap-1.5 w-full">
        {actions.map((action, idx) => {
          const IconComponent = action.icon;
          const content = (
            <span
              className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${getActionClasses(action, false)}`}
              title={action.label}
            >
              {IconComponent && <IconComponent className="w-4 h-4 shrink-0" />}
            </span>
          );

          if (action.href) {
            return (
              <Link key={idx} href={action.href}>
                {content}
              </Link>
            );
          }

          return (
            <button key={idx} type="button" onClick={action.onClick}>
              {content}
            </button>
          );
        })}
      </div>
    );
  }

  // If 3 or more actions, collapse into three-dot dropdown aligned to right!
  return (
    <div className="flex items-center justify-end w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="w-8 h-8 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:bg-brand-50 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
        title="More Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <Portal>
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              right: `${coords.right}px`,
              ...(coords.top !== undefined ? { top: `${coords.top}px` } : {}),
              ...(coords.bottom !== undefined ? { bottom: `${coords.bottom}px` } : {}),
              zIndex: 40,
            }}
            className="w-40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 animate-in fade-in zoom-in-95"
          >
            {actions.map((action, idx) => {
              const IconComponent = action.icon;
              const itemClasses = `w-full px-3.5 py-2 text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer text-left ${getActionClasses(action, true)}`;

              if (action.href) {
                return (
                  <Link
                    key={idx}
                    href={action.href}
                    onClick={() => setIsOpen(false)}
                    className={itemClasses}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 shrink-0" />}
                    <span>{action.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    if (action.onClick) action.onClick();
                  }}
                  className={itemClasses}
                >
                  {IconComponent && <IconComponent className="w-4 h-4 shrink-0" />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </Portal>
      )}
    </div>
  );
}
