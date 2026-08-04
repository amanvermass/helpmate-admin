"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronDown, CheckCircle2, Plus } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  onAddAction?: () => void;
  addActionLabel?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option...",
  onAddAction,
  addActionLabel,
  className = "",
  disabled = false,
  size = "md",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="font-extrabold text-slate-900 dark:text-white block text-xs">
            {label}
          </label>
          {onAddAction && addActionLabel && (
            <button
              type="button"
              onClick={onAddAction}
              className="text-brand-600 dark:text-brand-400 hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{addActionLabel.replace(/^\+\s*/, "")}</span>
            </button>
          )}
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full ${
          size === "sm" ? "h-9 px-2.5 rounded-xl text-xs" : "h-[42px] px-3 rounded-xl text-xs"
        } border bg-white dark:bg-slate-800 text-left font-bold flex items-center justify-between transition-all outline-none ${
          disabled
            ? "bg-slate-100 dark:bg-slate-800/80 text-slate-400 cursor-not-allowed border-slate-200 dark:border-slate-700"
            : isOpen
              ? "border-brand-500 ring-2 ring-brand-500/20 shadow-xs cursor-pointer"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer shadow-xs"
        }`}
      >
        <span className="truncate text-slate-900 dark:text-white flex items-center gap-1.5">
          {selectedOption?.icon}
          {selectedOption ? selectedOption.label : value || placeholder}
        </span>
        <ChevronDown
          className={`${
            size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
          } text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-brand-500" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && !disabled && (
        <div
          className={`absolute left-0 right-0 top-full mt-1 z-[9999] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${
            size === "sm" ? "rounded-xl p-1 shadow-lg max-h-52" : "rounded-2xl p-1.5 shadow-xl max-h-60"
          } space-y-0.5 animate-in fade-in-50 zoom-in-95 duration-150 overflow-y-auto`}
        >
          {options.length > 0 ? (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full ${
                    size === "sm"
                      ? "px-2.5 py-1.5 rounded-lg text-[11px] font-bold"
                      : "px-3 py-2 rounded-xl text-xs font-bold"
                  } text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-500 text-white shadow-xs"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate flex items-center gap-1.5">
                    {opt.icon}
                    {opt.label}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className={`${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} shrink-0 ml-1.5`} />
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-2 text-center text-xs text-slate-400 italic">No options available</div>
          )}
        </div>
      )}
    </div>
  );
}
