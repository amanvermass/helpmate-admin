"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/DataTable";
import { RowActionMenu } from "@/components/RowActionMenu";
import { varanasiLocalities, VaranasiLocality } from "@/lib/mockData";
import {
  getCitiesApi,
  addCityApi,
  updateCityApi,
  deleteCityApi,
  ApiCity,
} from "@/lib/api";
import {
  Building2,
  Plus,
  CheckCircle2,
  MapPin,
  Users,
  Activity,
  X,
  Edit,
  Trash2,
  Loader2,
  Search,
  Globe,
} from "lucide-react";
import { Portal } from "@/components/Portal";

export default function LocationsPage() {
  const [localities, setLocalities] = useState<VaranasiLocality[]>(varanasiLocalities);
  const [activeTab, setActiveTab] = useState<"pincodes" | "cities">("pincodes");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Localities Pincodes State
  const [name, setName] = useState("");
  const [pincode, setPincode] = useState("");

  // Cities Backend State
  const [cities, setCities] = useState<ApiCity[]>([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [cityModal, setCityModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    data: Partial<ApiCity>;
  }>({
    open: false,
    mode: "add",
    data: {},
  });
  const [deleteCityModal, setDeleteCityModal] = useState<{
    open: boolean;
    city: ApiCity | null;
  }>({
    open: false,
    city: null,
  });

  const fetchCities = async () => {
    setIsCitiesLoading(true);
    try {
      const res = await getCitiesApi({ forceRefresh: true });
      if (res && res.success && Array.isArray(res.data)) {
        setCities(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    } finally {
      setIsCitiesLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = cityModal.data;
    if (!d.cityName?.trim() || !d.stateName?.trim()) {
      alert("City Name and State Name are required.");
      return;
    }

    try {
      if (cityModal.mode === "add") {
        const res = await addCityApi({
          cityName: d.cityName.trim(),
          stateName: d.stateName.trim(),
          status: d.status ?? true,
        });

        if (res && res.success) {
          await fetchCities();
          setCityModal({ open: false, mode: "add", data: {} });
        } else {
          alert(res?.message || "Failed to add city.");
        }
      } else {
        if (!d._id) return;
        const res = await updateCityApi(d._id, {
          cityName: d.cityName.trim(),
          stateName: d.stateName.trim(),
          status: d.status ?? true,
        });

        if (res && res.success) {
          await fetchCities();
          setCityModal({ open: false, mode: "add", data: {} });
        } else {
          alert(res?.message || "Failed to update city.");
        }
      }
    } catch (err) {
      console.error("City save error:", err);
    }
  };

  const handleToggleCityStatus = async (city: ApiCity) => {
    try {
      const res = await updateCityApi(city._id, { status: !city.status });
      if (res && res.success) {
        await fetchCities();
      } else {
        alert(res?.message || "Failed to update city status.");
      }
    } catch (err) {
      console.error("City status toggle error:", err);
    }
  };

  const handleConfirmDeleteCity = async () => {
    if (!deleteCityModal.city) return;
    try {
      const res = await deleteCityApi(deleteCityModal.city._id);
      if (res && res.success) {
        await fetchCities();
        setDeleteCityModal({ open: false, city: null });
      } else {
        alert(res?.message || "Failed to delete city.");
      }
    } catch (err) {
      console.error("City delete error:", err);
    }
  };

  const pincodeColumns: Column<VaranasiLocality>[] = [
    { key: "name", header: "Locality / Zone Name", sortable: true },
    { key: "pincode", header: "Pincode", sortable: true },
    {
      key: "status",
      header: "Demand Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "High Demand"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
              : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "activeTechs",
      header: "Assigned Technicians",
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">{row.activeTechs} Active</span>
      ),
      sortable: true,
    },
    {
      key: "isServiceable",
      header: "Serviceability",
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            row.isServiceable
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          {row.isServiceable ? "Serviceable" : "Unserviceable"}
        </span>
      ),
    },
  ];

  const cityColumns: Column<ApiCity>[] = [
    {
      key: "cityName",
      header: "City Name",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-600 shrink-0" />
          <span className="font-black text-slate-900 dark:text-white">{row.cityName}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "stateName",
      header: "State",
      accessor: (row) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {row.stateName}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Operational Status",
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
            row.status
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          {row.status ? "Active Operations" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sticky: "right",
      accessor: (row) => (
        <RowActionMenu
          actions={[
            {
              label: row.status ? "Set Inactive" : "Set Active",
              icon: CheckCircle2,
              onClick: () => handleToggleCityStatus(row),
            },
            {
              label: "Edit City",
              icon: Edit,
              onClick: () =>
                setCityModal({ open: true, mode: "edit", data: row }),
            },
            {
              label: "Delete City",
              icon: Trash2,
              onClick: () =>
                setDeleteCityModal({ open: true, city: row }),
              danger: true,
            },
          ]}
        />
      ),
    },
  ];

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pincode) return;

    const newItem: VaranasiLocality = {
      id: `loc-${Date.now()}`,
      name,
      pincode,
      status: "Normal",
      activeBookings: 0,
      activeTechs: 0,
      isServiceable: true,
    };

    setLocalities([newItem, ...localities]);
    setName("");
    setPincode("");
    setIsAddOpen(false);
  };

  const filteredCities = cities.filter(
    (c) =>
      !citySearch ||
      c.cityName.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.stateName.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Simple Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-600" />
            <span>Locations & City Operations</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage operational cities, serviceable pincodes, demand surges, and technician allocation.
          </p>
        </div>

        {activeTab === "pincodes" ? (
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Pincode Zone</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              setCityModal({
                open: true,
                mode: "add",
                data: { cityName: "", stateName: "Uttar Pradesh", status: true },
              })
            }
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New City</span>
          </button>
        )}
      </div>

      {/* TAB NAVIGATION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("pincodes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "pincodes"
                ? "bg-brand-600 text-white shadow-md font-black"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Pincodes & Localities</span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === "pincodes"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {localities.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cities")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "cities"
                ? "bg-brand-600 text-white shadow-md font-black"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Cities & States (API)</span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeTab === "cities"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {cities.length}
            </span>
          </button>
        </div>

        {activeTab === "cities" && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search cities or states..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 w-56"
            />
          </div>
        )}
      </div>

      {/* 4 Executive Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Serviceable Pincodes</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{localities.length} Pincodes</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Operational Cities</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600">
            {cities.filter((c) => c.status).length} Cities Live
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Deployed Techs</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600">
            {localities.reduce((sum, l) => sum + (l.activeTechs || 0), 0)} Engineers
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">State Coverage</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {new Set(cities.map((c) => c.stateName)).size || 1} States
          </span>
        </div>
      </div>

      {/* MAIN TAB CONTENT */}
      {activeTab === "pincodes" ? (
        <DataTable columns={pincodeColumns} data={localities} />
      ) : (
        <div className="space-y-4">
          {isCitiesLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-brand-600" />
              <span className="text-xs font-bold">Loading cities from backend...</span>
            </div>
          ) : (
            <DataTable columns={cityColumns} data={filteredCities} />
          )}
        </div>
      )}

      {/* Add Pincode Zone Slide-Over Drawer */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
            <div className="absolute inset-0" onClick={() => setIsAddOpen(false)} />
            <form
              onSubmit={handleAddLocation}
              className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 max-w-md w-full h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 outline-none"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add New Pincode Zone</h3>
                  <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Locality / Zone Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lanka Bhabha Road"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="221005"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lux cursor-pointer transition-colors"
                >
                  Save Locality
                </button>
              </div>
            </form>
          </div>
        </Portal>
      )}

      {/* ADD / EDIT CITY MODAL */}
      {cityModal.open && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-600" />
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {cityModal.mode === "add" ? "Add New City" : "Edit City"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCityModal({ open: false, mode: "add", data: {} })}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCity} className="p-6 space-y-4">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                    City Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityModal.data.cityName || ""}
                    onChange={(e) =>
                      setCityModal({
                        ...cityModal,
                        data: { ...cityModal.data, cityName: e.target.value },
                      })
                    }
                    placeholder="e.g. Lucknow, Varanasi"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 text-xs">
                    State Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={cityModal.data.stateName || ""}
                    onChange={(e) =>
                      setCityModal({
                        ...cityModal,
                        data: { ...cityModal.data, stateName: e.target.value },
                      })
                    }
                    placeholder="e.g. Uttar Pradesh"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:border-brand-500 font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="city-status"
                    checked={cityModal.data.status ?? true}
                    onChange={(e) =>
                      setCityModal({
                        ...cityModal,
                        data: { ...cityModal.data, status: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                  />
                  <label
                    htmlFor="city-status"
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Active Operations (Enabled)
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCityModal({ open: false, mode: "add", data: {} })}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lux cursor-pointer transition-colors"
                  >
                    {cityModal.mode === "add" ? "Add City" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* DELETE CITY CONFIRMATION MODAL */}
      {deleteCityModal.open && deleteCityModal.city && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Delete City?
                </h3>
                <p className="text-xs text-slate-500">
                  Are you sure you want to delete{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    "{deleteCityModal.city.cityName}"
                  </strong>
                  ? This will set its operational status to inactive.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteCityModal({ open: false, city: null })}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteCity}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lux cursor-pointer transition-colors"
                >
                  Delete City
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
