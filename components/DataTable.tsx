"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  Eye,
  Edit2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Plus,
  Filter,
  FileSpreadsheet,
  History,
  AlertTriangle,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T extends Record<string, any>> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onAddClick?: () => void;
  addButtonLabel?: string;
  onRowEdit?: (row: T) => void;
  onRowDelete?: (row: T) => void;
  onStatusToggle?: (row: T) => void;
  statusField?: string;
  idField?: string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  columns,
  data: initialData,
  searchPlaceholder = "Search records...",
  onAddClick,
  addButtonLabel = "Add New Record",
  onRowEdit,
  onRowDelete,
  statusField = "status",
  idField = "id",
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [viewingRow, setViewingRow] = useState<T | null>(null);
  const [deletingRow, setDeletingRow] = useState<T | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (selectedStatusFilter !== "All" && row[statusField]) {
        if (row[statusField] !== selectedStatusFilter) return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [data, searchQuery, selectedStatusFilter, statusField]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      const comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === "asc") setSortOrder("desc");
      else {
        setSortKey(null);
        setSortOrder("asc");
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedData.map((row) => String(row[idField]))));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleExportCSV = () => {
    if (sortedData.length === 0) return;
    const headers = columns.map((c) => c.header).join(",");
    const rows = sortedData.map((row) =>
      columns.map((c) => `"${String(row[c.key] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDelete = () => {
    setData(data.filter((row) => !selectedIds.has(String(row[idField]))));
    setSelectedIds(new Set());
    setIsBulkDeleteModalOpen(false);
  };

  const handleDuplicateRow = (row: T) => {
    const cloned = {
      ...row,
      [idField]: `${String(row[idField])}-copy-${Math.floor(Math.random() * 1000)}`,
      title: row.title ? `${row.title} (Copy)` : row.name ? `${row.name} (Copy)` : undefined,
    };
    setData([cloned, ...data]);
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.has(String(row[idField])));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsImportOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Import CSV</span>
          </button>

          {onAddClick && (
            <button
              onClick={onAddClick}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{addButtonLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-xs text-slate-500 font-semibold">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => {
                setSelectedStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                {selectedIds.size} Selected
              </span>
              <button
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-brand-500 cursor-pointer"
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    className="py-3.5 px-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable !== false && <ArrowUpDown className="w-3 h-3 text-slate-400" />}
                    </div>
                  </th>
                ))}
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No records found</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const idStr = String(row[idField]);
                  const isSelected = selectedIds.has(idStr);

                  return (
                    <tr key={idStr} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(idStr)}
                          className="w-4 h-4 rounded border-slate-300 text-brand-500 cursor-pointer"
                        />
                      </td>

                      {columns.map((col) => (
                        <td key={col.key} className="py-4 px-4">
                          {col.accessor ? col.accessor(row) : row[col.key]}
                        </td>
                      ))}

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingRow(row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {onRowEdit && (
                            <button
                              onClick={() => onRowEdit(row)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDuplicateRow(row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingRow(row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Showing page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW DRAWER */}
      {viewingRow && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900">Record Inspector</h3>
              <button onClick={() => setViewingRow(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-2 text-xs">
              {Object.entries(viewingRow).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded bg-slate-50 border border-slate-100 flex justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[9px]">{k}</span>
                  <span className="font-semibold text-slate-900 truncate max-w-xs">{String(v ?? "—")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingRow && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4 text-center shadow-2xl border border-slate-200">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="font-extrabold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500">Delete record {String(deletingRow[idField])}?</p>
            <div className="flex gap-2">
              <button onClick={() => setDeletingRow(null)} className="flex-1 py-2 bg-slate-100 rounded-xl font-bold text-xs text-slate-700">Cancel</button>
              <button
                onClick={() => {
                  setData(data.filter((r) => String(r[idField]) !== String(deletingRow[idField])));
                  if (onRowDelete) onRowDelete(deletingRow);
                  setDeletingRow(null);
                }}
                className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT DRAWER */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-md bg-white h-full p-6 space-y-4 border-l border-slate-200 shadow-2xl">
            <div className="flex justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900">Import CSV Records</h3>
              <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="border-2 border-dashed border-slate-200 p-8 text-center rounded-2xl bg-slate-50">
              <Upload className="w-8 h-8 text-brand-600 mx-auto mb-2" />
              <span className="font-bold text-xs text-slate-900 block">Drag & Drop CSV File</span>
              <span className="text-[10px] text-slate-400">Or click to browse from device</span>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE MODAL */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4 text-center border border-slate-200 shadow-2xl">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="font-extrabold text-slate-900">Delete Selected Records</h3>
            <p className="text-xs text-slate-500">Delete {selectedIds.size} records?</p>
            <div className="flex gap-2">
              <button onClick={() => setIsBulkDeleteModalOpen(false)} className="flex-1 py-2 bg-slate-100 rounded-xl font-bold text-xs text-slate-700">Cancel</button>
              <button onClick={handleBulkDelete} className="flex-1 py-2 bg-red-600 text-white rounded-xl font-bold text-xs">Delete Selected</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
