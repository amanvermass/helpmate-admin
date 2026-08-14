"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  X,
  Check,
} from "lucide-react";

interface DateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  onDateChange: (start: string, end: string, presetName?: string) => void;
  align?: "left" | "right";
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const YEARS_LIST = Array.from({ length: 15 }, (_, i) => 2020 + i);

function formatYMD(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function parseYMD(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return new Date(y, m, d);
}

export function DateRangePicker({
  startDate,
  endDate,
  onDateChange,
  align = "left",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string>("all");
  const [tempStart, setTempStart] = useState<string>(startDate);
  const [tempEnd, setTempEnd] = useState<string>(endDate);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Custom Dropdowns Toggle state
  const [isMonthMenuOpen, setIsMonthMenuOpen] = useState<boolean>(false);
  const [isYearMenuOpen, setIsYearMenuOpen] = useState<boolean>(false);

  // Calendar View Month state
  const initialDate = parseYMD(startDate) || new Date(2026, 7, 1);
  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempStart(startDate);
    setTempEnd(endDate);
  }, [startDate, endDate]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMonthMenuOpen(false);
        setIsYearMenuOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayClick = (dateStr: string) => {
    setActivePreset("custom");
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(dateStr);
      setTempEnd("");
    } else if (tempStart && !tempEnd) {
      if (dateStr < tempStart) {
        setTempStart(dateStr);
        setTempEnd("");
      } else {
        setTempEnd(dateStr);
        onDateChange(tempStart, dateStr, "custom");
        setIsOpen(false);
      }
    }
  };

  const handleApplyPreset = (preset: "all" | "today" | "week" | "month") => {
    setActivePreset(preset);
    const today = new Date();
    const toYMDStr = (d: Date) =>
      formatYMD(d.getFullYear(), d.getMonth(), d.getDate());

    let s = "";
    let e = "";

    if (preset === "today") {
      s = toYMDStr(today);
      e = toYMDStr(today);
    } else if (preset === "week") {
      const d = new Date(today);
      const day = d.getDay();
      const diffToMon = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diffToMon));
      s = toYMDStr(monday);
      e = toYMDStr(new Date());
    } else if (preset === "month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      s = toYMDStr(firstDay);
      e = toYMDStr(new Date());
    }

    setTempStart(s);
    setTempEnd(e);
    if (s) {
      const parsedS = parseYMD(s);
      if (parsedS) {
        setViewYear(parsedS.getFullYear());
        setViewMonth(parsedS.getMonth());
      }
    }
    onDateChange(s, e, preset);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempStart("");
    setTempEnd("");
    setActivePreset("all");
    onDateChange("", "", "all");
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    onDateChange(tempStart, tempEnd || tempStart, "custom");
    setIsOpen(false);
  };

  const isFilterActive = Boolean(startDate || endDate);

  const getButtonLabel = () => {
    if (!isFilterActive) return "Filter Date Range";
    if (startDate && endDate && startDate === endDate) {
      return `Date: ${startDate}`;
    }
    if (startDate && endDate) {
      return `${startDate} → ${endDate}`;
    }
    if (startDate) return `From ${startDate}`;
    if (endDate) return `Until ${endDate}`;
    return "Filter Date Range";
  };

  // Calendar Grid Math
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* SINGLE CALENDAR ICON FILTER BUTTON */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMonthMenuOpen(false);
          setIsYearMenuOpen(false);
        }}
        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer border shadow-2xs ${
          isFilterActive
            ? "bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-800 ring-2 ring-brand-500/20"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        <CalendarIcon className={`w-4 h-4 ${isFilterActive ? "text-brand-600 dark:text-brand-400" : "text-slate-500"}`} />
        <span>{getButtonLabel()}</span>
        {isFilterActive && (
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* SINGLE VISUAL CALENDAR POPOVER */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3.5`}
        >
          {/* Calendar Header with Navigation and CUSTOM Month & Year Dropdowns */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* CUSTOM MONTH DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsMonthMenuOpen(!isMonthMenuOpen);
                    setIsYearMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-xs flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <span>{MONTH_NAMES[viewMonth]}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isMonthMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isMonthMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-1.5 z-[60] max-h-48 overflow-y-auto">
                    {MONTH_NAMES.map((mName, idx) => (
                      <button
                        key={mName}
                        type="button"
                        onClick={() => {
                          setViewMonth(idx);
                          setIsMonthMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          viewMonth === idx
                            ? "bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-black"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {mName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CUSTOM YEAR DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsYearMenuOpen(!isYearMenuOpen);
                    setIsMonthMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-extrabold text-xs flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <span>{viewYear}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isYearMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isYearMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-1.5 z-[60] max-h-48 overflow-y-auto">
                    {YEARS_LIST.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => {
                          setViewYear(yr);
                          setIsYearMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer ${
                          viewYear === yr
                            ? "bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-black"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets Grid (NO SCROLL - 4 EQUAL COLUMNS) */}
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: "All", value: "all" },
              { label: "Today", value: "today" },
              { label: "Week", value: "week" },
              { label: "Month", value: "month" },
            ].map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => handleApplyPreset(p.value as any)}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer border text-center truncate ${
                  activePreset === p.value
                    ? "bg-brand-600 text-white border-brand-600 shadow-2xs"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* SINGLE VISUAL CALENDAR GRID */}
          <div className="space-y-1">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 text-center">
              {DAYS_OF_WEEK.map((d) => (
                <span key={d} className="text-[10px] font-black text-slate-400 py-1">
                  {d}
                </span>
              ))}
            </div>

            {/* Grid of Days */}
            <div className="grid grid-cols-7 gap-y-1 text-xs">
              {/* Empty leading offset days */}
              {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dayStr = formatYMD(viewYear, viewMonth, dayNum);

                const isStart = tempStart === dayStr;
                const isEnd = tempEnd === dayStr;

                let isInRange = false;
                if (tempStart && tempEnd) {
                  isInRange = dayStr >= tempStart && dayStr <= tempEnd;
                } else if (tempStart && !tempEnd && hoverDate) {
                  isInRange = dayStr >= tempStart && dayStr <= hoverDate && hoverDate >= tempStart;
                }

                return (
                  <button
                    key={dayStr}
                    type="button"
                    onClick={() => handleDayClick(dayStr)}
                    onMouseEnter={() => setHoverDate(dayStr)}
                    onMouseLeave={() => setHoverDate(null)}
                    className={`h-8 w-full font-bold text-xs flex items-center justify-center transition-all cursor-pointer relative ${
                      isStart || isEnd
                        ? "bg-brand-600 text-white rounded-lg font-black shadow-xs z-10"
                        : isInRange
                        ? "bg-brand-100 dark:bg-brand-950/80 text-brand-800 dark:text-brand-200"
                        : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    }`}
                  >
                    <span>{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selection Hint & Action Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-slate-500 text-center">
              {tempStart && tempEnd ? (
                <span className="text-brand-600 dark:text-brand-400 font-extrabold">
                  Range: {tempStart} to {tempEnd}
                </span>
              ) : tempStart ? (
                <span className="text-amber-600 dark:text-amber-400 italic">
                  Start: {tempStart} (Click 2nd date for range)
                </span>
              ) : (
                <span className="text-slate-400">Click 1st date (Start) and 2nd date (End)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 text-slate-600 dark:text-slate-300 font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {tempStart && (
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
