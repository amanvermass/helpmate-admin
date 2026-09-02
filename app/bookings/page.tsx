"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable, Column } from "@/components/DataTable";
import { RowActionMenu } from "@/components/RowActionMenu";
import { initialBookings, Booking, BookingStatus, Technician, initialTechnicians, initialCustomers, SelectedAddOnItem, BroadcastPartnerOffer } from "@/lib/mockData";
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Printer,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Wrench,
  KeyRound,
  Eye,
  Edit2,
  UserPlus,
  Filter,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  Layers,
  Zap,
  SprayCan,
  Droplets,
  Grid,
  ChevronRight,
  Globe,
  Building2,
} from "lucide-react";
import { Portal } from "@/components/Portal";
import { BookingWizardModal } from "@/components/bookings/BookingWizardModal";
import { AssignPartnerModal } from "@/components/bookings/AssignPartnerModal";
import { InspectionFlowModal } from "@/components/bookings/InspectionFlowModal";
import { OtpVerificationModal } from "@/components/bookings/OtpVerificationModal";
import { EditBookingModal } from "@/components/bookings/EditBookingModal";
import { BookingDetailsDrawer } from "@/components/bookings/BookingDetailsDrawer";
import { RescheduleBookingModal } from "@/components/bookings/RescheduleBookingModal";
import { useRbac } from "@/context/RbacContext";

function BookingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category");
  const selectedCategory = categoryParam || null;
  const { role } = useRbac();
  const isOfficeAdmin = role === "Office Admin";

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("All");
  const [cardFilter, setCardFilter] = useState<"ALL" | "UNASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED">("ALL");
  const [channelFilter, setChannelFilter] = useState<"ALL" | "ONLINE" | "MANUAL">("ALL");

  // Helper to identify Online Customer Bookings vs Desk Manual Bookings
  const isOnlineBooking = (b: Booking) => {
    const isOnlinePayment =
      b.paymentMethod === "Online" ||
      b.paymentMethod === "UPI" ||
      b.paymentMethod === "Card" ||
      b.paymentMethod === "Helpmate Wallet";
    const isOnlineSource =
      !b.createdBy ||
      b.createdBy.toLowerCase().includes("online") ||
      b.createdBy.toLowerCase().includes("app") ||
      b.createdBy.toLowerCase().includes("website") ||
      !b.createdBy.toLowerCase().includes("office");
    return isOnlinePayment || isOnlineSource;
  };

  const handleSelectCategory = (catName: string | null) => {
    setCardFilter("ALL");
    setChannelFilter("ALL");
    setActiveStatusFilter("All");
    if (catName) {
      router.push(`/bookings?category=${encodeURIComponent(catName)}`);
    } else {
      router.push("/bookings");
    }
  };

  // Modals & Toasts
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [createdBookingToast, setCreatedBookingToast] = useState<Booking | null>(null);
  const [assignBooking, setAssignBooking] = useState<Booking | null>(null);
  const [inspectionBooking, setInspectionBooking] = useState<Booking | null>(null);
  const [otpBooking, setOtpBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [drawerBooking, setDrawerBooking] = useState<Booking | null>(null);
  const [printTargetBooking, setPrintTargetBooking] = useState<Booking | null>(null);

  const handleRescheduleBooking = (
    bookingId: string,
    newDate: string,
    newTimeSlot: string,
    technicianId?: string,
    technicianName?: string
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated: Booking = {
            ...b,
            date: newDate,
            timeSlot: newTimeSlot,
            technicianId: technicianId || b.technicianId,
            technicianName: technicianName || b.technicianName,
            status: technicianName ? (b.status === "Pending" || b.status === "Waiting For Assignment" ? "Assigned" : b.status) : b.status,
          };
          setCreatedBookingToast(updated);
          return updated;
        }
        return b;
      })
    );
  };

  const handleDirectPrint = (row: Booking) => {
    setPrintTargetBooking(row);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const formatInvoiceNumber = (id: string) => {
    if (!id) return "INV-2026-001";
    const cleanId = id.replace(/^(INV-)?(bk-)?/gi, "");
    if (cleanId.length > 5 && !isNaN(Number(cleanId))) {
      return `INV-${cleanId.slice(-5)}`;
    }
    return `INV-${cleanId.toUpperCase()}`;
  };

  const formatWorkingDate = (dateStr?: string) => {
    if (!dateStr) return "Today";
    const cleanDate = dateStr.split(",")[0].split("T")[0].trim();
    return cleanDate || "Today";
  };

  const getCustomerId = (name?: string, phone?: string) => {
    if (!name && !phone) return "cust-1";
    const found = initialCustomers.find(
      (c) => (phone && c.phone === phone) || (name && c.name.toLowerCase() === name.toLowerCase())
    );
    return found ? found.id : "cust-1";
  };

  // Base role-filtered bookings list
  const roleFilteredBookings = useMemo(() => {
    if (isOfficeAdmin) {
      return bookings.filter((b) => b.createdBy && b.createdBy.toLowerCase().includes("office"));
    }
    return bookings;
  }, [bookings, isOfficeAdmin]);

  // Compute Category Level Statistics
  const categoryStatsList = useMemo(() => {
    const catMap: Record<
      string,
      { count: number; unassigned: number; inProgress: number; completed: number; cancelled: number }
    > = {};

    roleFilteredBookings.forEach((b) => {
      const cat = b.category || "General";
      if (!catMap[cat]) {
        catMap[cat] = { count: 0, unassigned: 0, inProgress: 0, completed: 0, cancelled: 0 };
      }
      catMap[cat].count++;
      if (!b.technicianName) catMap[cat].unassigned++;
      if (b.status === "In Progress" || b.status === "Assigned") catMap[cat].inProgress++;
      if (b.status === "Completed") catMap[cat].completed++;
      if (b.status === "Cancelled" || b.status === "Rejected") catMap[cat].cancelled++;
    });

    return Object.entries(catMap).map(([name, stats]) => ({
      name,
      ...stats,
    }));
  }, [roleFilteredBookings]);

  // 1. Filter by selected category
  const categoryBookings = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") return roleFilteredBookings;
    return roleFilteredBookings.filter(
      (b) => (b.category || "General").toLowerCase().trim() === selectedCategory.toLowerCase().trim()
    );
  }, [roleFilteredBookings, selectedCategory]);

  // 2. Filter by card status & dropdown status
  const filteredBookings = useMemo(() => {
    const list = categoryBookings.filter((b) => {
      if (activeStatusFilter !== "All" && b.status.toLowerCase() !== activeStatusFilter.toLowerCase()) {
        return false;
      }
      if (cardFilter === "UNASSIGNED") {
        return !b.technicianName;
      }
      if (cardFilter === "IN_PROGRESS") {
        return b.status === "In Progress" || b.status === "Assigned";
      }
      if (cardFilter === "COMPLETED") {
        return b.status === "Completed";
      }
      if (cardFilter === "CANCELLED") {
        if (b.status !== "Cancelled" && b.status !== "Rejected") return false;
      }

      // Origin Channel Filter (Table Level)
      if (channelFilter === "ONLINE") {
        return isOnlineBooking(b);
      }
      if (channelFilter === "MANUAL") {
        return !isOnlineBooking(b);
      }

      return true;
    });

    // Sort list so newest / current booking is on TOP!
    return [...list].sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, ""), 10) || 0;
      const numB = parseInt(b.id.replace(/\D/g, ""), 10) || 0;
      return numB - numA;
    });
  }, [categoryBookings, cardFilter, activeStatusFilter, channelFilter]);

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
    setIsWizardOpen(false);
    setCreatedBookingToast(newBooking);
  };

  const handlePartnerAssigned = (
    bookingId: string,
    technician: Technician | null,
    broadcastOffers?: BroadcastPartnerOffer[]
  ) => {
    const update = (b: Booking): Booking => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status: technician
          ? b.status === "Pending" || b.status === "Waiting For Assignment"
            ? "Assigned"
            : b.status
          : broadcastOffers && broadcastOffers.length > 0
          ? "Assigned"
          : "Pending",
        technicianName: technician ? technician.name : broadcastOffers?.[0]?.technicianName,
        technicianId: technician ? technician.id : broadcastOffers?.[0]?.technicianId,
        broadcastOffers: broadcastOffers || b.broadcastOffers,
      };
    };

    setBookings((prev) => prev.map(update));
    setDrawerBooking((prev) => (prev && prev.id === bookingId ? update(prev) : prev));
  };

  const handleSimulatePartnerAcceptance = (bookingId: string, techId: string) => {
    const acceptingTech = initialTechnicians.find((t) => t.id === techId);
    const techName = acceptingTech?.name || "Partner";

    const update = (b: Booking): Booking => {
      if (b.id !== bookingId) return b;

      const updatedOffers = (b.broadcastOffers || []).map((offer) => {
        if (offer.technicianId === techId) {
          return { ...offer, status: "Accepted" as const, acceptedAt: "Just now" };
        }
        return {
          ...offer,
          status: "Offer Closed" as const,
        };
      });

      return {
        ...b,
        status: "Assigned",
        technicianId: techId,
        technicianName: techName,
        broadcastOffers: updatedOffers,
      };
    };

    setBookings((prev) => prev.map(update));
    setDrawerBooking((prev) => (prev && prev.id === bookingId ? update(prev) : prev));
  };

  const handleInspectionApproved = (bookingId: string, updatedQuote: number, remarks: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              basePrice: updatedQuote,
              totalAmount: Math.round(updatedQuote * 1.18 + 49),
              inspectionRemarks: remarks,
              status: "Customer Approval Pending",
            }
          : b
      )
    );
  };

  const handleJobCompleted = (
    bookingId: string,
    addOns?: SelectedAddOnItem[],
    addOnsBaseTotal?: number,
    addOnsGstTotal?: number,
    addOnsFinalTotal?: number
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              isOtpVerified: true,
              status: "Completed",
              completedAddOns: addOns || b.completedAddOns,
              addOnsBaseTotal: addOnsBaseTotal ?? b.addOnsBaseTotal,
              addOnsGstTotal: addOnsGstTotal ?? b.addOnsGstTotal,
              addOnsFinalTotal: addOnsFinalTotal ?? b.addOnsFinalTotal,
              totalAmount: b.totalAmount + (addOnsFinalTotal || 0),
            }
          : b
      )
    );
    router.push(`/billing/${bookingId}`);
  };

  const handleBookingUpdated = (updated: Booking) => {
    setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
    setDrawerBooking((prev) => (prev && prev.id === updated.id ? updated : prev));
  };

  const formatSingleTimeSlot = (timeStr?: string) => {
    if (!timeStr) return "10:00 AM";
    const startPart = timeStr.split(/[-–—]| to /i)[0].trim();
    return startPart;
  };

  const columns = useMemo<Column<Booking>[]>(() => {
    const baseCols: Column<Booking>[] = [
      {
        key: "id",
        header: "Booking ID",
        sticky: "left",
        stickyLeftOffset: 44,
        className: "w-[140px] min-w-[140px] max-w-[140px]",
        accessor: (row) => {
          const catQuery = selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : "";
          return (
            <button
              type="button"
              onClick={() => router.push(`/bookings/${row.id}${catQuery}`)}
              className="font-mono font-extrabold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer text-xs"
            >
              {row.id}
            </button>
          );
        },
        sortable: true,
      },
      {
        key: "originChannel",
        header: "Origin",
        accessor: (row: Booking) => {
          const isOnline = isOnlineBooking(row);
          return (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                isOnline
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300"
              }`}
            >
              {isOnline ? <Globe className="w-3 h-3 text-purple-600" /> : <Building2 className="w-3 h-3 text-slate-500" />}
              <span>{isOnline ? "Online" : "Manual"}</span>
            </span>
          );
        },
        sortable: true,
      },
      {
        key: "date",
        header: "Working date",
        className: "w-[140px] min-w-[140px] whitespace-nowrap px-4",
        accessor: (row) => (
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {formatWorkingDate(row.date)}
          </span>
        ),
        sortable: true,
      },
      {
        key: "timeSlot",
        header: "Time",
        accessor: (row) => (
          <span className="text-slate-700 dark:text-slate-300 font-extrabold text-xs">
            {formatSingleTimeSlot(row.timeSlot)}
          </span>
        ),
        sortable: true,
      },
      {
        key: "callingDate",
        header: "Calling date",
        accessor: (row) => <span className="text-slate-500 dark:text-slate-400 font-medium">{row.callingDate || "2026-07-25"}</span>,
        sortable: true,
      },
      {
        key: "customerName",
        header: "Customer Name",
        className: "w-[170px] min-w-[170px] max-w-[170px]",
        accessor: (row: Booking) => {
          if (isOfficeAdmin) {
            return (
              <span className="font-extrabold text-slate-900 dark:text-white text-xs truncate max-w-[150px] block">
                {row.customerName}
              </span>
            );
          }
          const custId = getCustomerId(row.customerName, row.customerPhone);
          return (
            <button
              type="button"
              onClick={() => router.push(`/customers/${custId}?from=${encodeURIComponent("/bookings")}`)}
              className="font-extrabold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 hover:underline text-left truncate max-w-[150px] block cursor-pointer"
              title={`View ${row.customerName} details`}
            >
              {row.customerName}
            </button>
          );
        },
        sortable: true,
      },
      {
        key: "customerPhone",
        header: "Contact no",
        accessor: (row: Booking) => <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">{row.customerPhone}</span>,
        sortable: true,
      },
      {
        key: "address",
        header: "Service Address Location",
        accessor: (row) => (
          <div className="max-w-[200px] truncate text-slate-700 dark:text-slate-300 font-medium" title={row.address || `${row.locality}, Varanasi`}>
            {row.address || `${row.locality}, Varanasi`}
          </div>
        ),
        sortable: true,
      },
      {
        key: "serviceTitle",
        header: "Multiple Services & Item Codes",
        accessor: (row) => (
          <div className="max-w-[240px] space-y-1 py-1" title={row.serviceTitle}>
            <div className="truncate font-extrabold text-slate-900 dark:text-white text-xs">
              {row.serviceTitle}
            </div>
            {row.servicesList && row.servicesList.length > 0 ? (
              <div className="space-y-1">
                {row.servicesList.map((s, idx) => (
                  <div key={s.id || idx} className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-mono font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded border border-purple-200 shrink-0">
                      {s.serviceCode || `HM-SVC-${row.id.replace(/[^0-9]/g, "")}-${String(idx + 1).padStart(2, "0")}`}
                    </span>
                    <span className="truncate text-slate-600 dark:text-slate-300 font-medium">
                      {s.title} (x{s.quantity})
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[10px] font-mono font-bold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 px-1.5 py-0.2 rounded border border-brand-200">
                HM-SVC-{row.id.replace(/[^0-9]/g, "")}-01
              </span>
            )}
          </div>
        ),
        sortable: true,
      },
      {
        key: "totalAmount",
        header: "Amount",
        accessor: (row) => <span className="font-extrabold text-slate-900 dark:text-white">₹{row.totalAmount}</span>,
        sortable: true,
      },
      {
        key: "callingPerson",
        header: "Calling Person",
        accessor: (row) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.callingPerson || "Pooja Sharma (Operations)"}</span>,
        sortable: true,
      },
      {
        key: "notes",
        header: "Remark",
        accessor: (row) => (
          <div className="max-w-[170px] truncate text-slate-500 italic" title={row.notes || row.inspectionRemarks || "Standard order"}>
            {row.notes || row.inspectionRemarks || "Standard order"}
          </div>
        ),
        sortable: true,
      },
      {
        key: "status",
        header: "Booking Status",
        accessor: (row) => (
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 ${
              row.status === "Completed"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                : row.status === "In Progress" || row.status === "Assigned"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300"
                : row.status === "Cancelled"
                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{row.status}</span>
          </span>
        ),
        sortable: true,
      },
      {
        key: "technicianName",
        header: "Assigned Partner Details",
        accessor: (row) => {
          const partnerPhone = row.technicianPhone || (row.technicianId === "tech-101" ? "+91 98390 11200" : row.technicianId === "tech-102" ? "+91 94152 44920" : "+91 91234 88100");
          return row.technicianName ? (
            <div className="space-y-0.5 max-w-[170px]">
              <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5 truncate" title={row.technicianName}>
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>{row.technicianName}</span>
              </div>
              <div className="font-mono text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{partnerPhone}</span>
              </div>
            </div>
          ) : isOfficeAdmin ? (
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-lg border border-amber-200">
              Unassigned
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setAssignBooking(row)}
              className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 cursor-pointer hover:bg-amber-100"
            >
              Assign Partner
            </button>
          );
        },
        sortable: true,
      },
      {
        key: "handledBy",
        header: "Handel By",
        accessor: (row) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.handledBy || "Aman Verma (HQ)"}</span>,
        sortable: true,
      },
      {
        key: "actions",
        header: "Actions",
        sticky: "right",
        accessor: (row) => (
          <RowActionMenu
            actions={
              isOfficeAdmin
                ? [
                    {
                      label: "View Details",
                      icon: Eye,
                      href: `/bookings/${row.id}${selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ""}`,
                    },
                  ]
                : [
                    {
                      label: row.technicianName ? "Reassign Partner" : "Assign Partner",
                      icon: UserPlus,
                      onClick: () => setAssignBooking(row),
                    },
                    {
                      label: "Reschedule",
                      icon: CalendarCheck,
                      onClick: () => setReschedulingBooking(row),
                    },
                    {
                      label: "Invoice",
                      icon: FileText,
                      href: `/billing/${row.id}`,
                    },
                    {
                      label: "View",
                      icon: Eye,
                      href: `/bookings/${row.id}${selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : ""}`,
                    },
                    {
                      label: "Edit",
                      icon: Edit2,
                      onClick: () => setEditingBooking(row),
                    },
                  ]
            }
          />
        ),
        sortable: false,
      },
    ];
    return baseCols;
  }, [isOfficeAdmin, selectedCategory, router]);

  const statusOptions: BookingStatus[] = [
    "Draft",
    "Pending",
    "Waiting For Assignment",
    "Assigned",
    "Partner Accepted",
    "Inspection Pending",
    "Price Approval Pending",
    "Customer Approval Pending",
    "Confirmed",
    "In Progress",
    "Completed",
    "Cancelled",
    "Refunded",
    "Rejected",
  ];

  return (
    <div className="space-y-6">
      {!selectedCategory ? (
        /* ─── VIEW 1: CATEGORY SELECTION HUB (ONLY CATEGORIES SHOWN) ─── */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Simple Clean Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Layers className="w-6 h-6 text-brand-600" />
                <span>Service Category Bookings Hub</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Select a service category card below to open its operations dashboard, live dispatch table, and partner tracking.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Booking</span>
            </button>
          </div>

          {/* Category Cards Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Master Card: All Categories */}
            <div
              onClick={() => handleSelectCategory("All")}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black shadow-xs group-hover:scale-105 transition-transform">
                    <Grid className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    Master View
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                    All Service Categories
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Complete operational directory across all active service categories in Varanasi.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-bold text-[10px] block uppercase">Total Orders</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">{roleFilteredBookings.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60">
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-[10px] block uppercase">Unassigned</span>
                    <span className="text-base font-black text-amber-600 dark:text-amber-400">
                      {roleFilteredBookings.filter((b) => !b.technicianName).length} Open
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                <span>Open All Bookings Directory</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Dynamic Category Cards */}
            {categoryStatsList.map((cat) => (
              <div
                key={cat.name}
                onClick={() => handleSelectCategory(cat.name)}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-black shadow-xs group-hover:scale-105 transition-transform">
                      {cat.name.toLowerCase().includes("ac") ? (
                        <Wrench className="w-6 h-6" />
                      ) : cat.name.toLowerCase().includes("electr") ? (
                        <Zap className="w-6 h-6" />
                      ) : cat.name.toLowerCase().includes("plumb") ? (
                        <Droplets className="w-6 h-6" />
                      ) : cat.name.toLowerCase().includes("clean") ? (
                        <SprayCan className="w-6 h-6" />
                      ) : (
                        <Calendar className="w-6 h-6" />
                      )}
                    </div>
                    <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {cat.count} Orders
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      {cat.name.toLowerCase().includes("ac")
                        ? "Split & window AC power jet wash, gas recharge, and PCB repair."
                        : cat.name.toLowerCase().includes("electr")
                        ? "Short circuit testing, MCB box upgrade, wiring, and fan install."
                        : cat.name.toLowerCase().includes("plumb")
                        ? "Tap leak repair, motor fitting, overhead tank descaling & drain unclog."
                        : cat.name.toLowerCase().includes("clean")
                        ? "Full home deep scrubbing, sofa shampoo, kitchen chimney degrease."
                        : "On-demand home services & professional maintenance orders."}
                    </p>
                  </div>

                  {/* Operational Metrics inside Card */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                      <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 block">Open</span>
                      <span className="text-sm font-black text-amber-700 dark:text-amber-300">{cat.unassigned}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                      <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 block">Active</span>
                      <span className="text-sm font-black text-blue-700 dark:text-blue-300">{cat.inProgress}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 block">Closed</span>
                      <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">{cat.completed}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                      <span className="text-[9px] font-bold text-rose-700 dark:text-rose-300 block">Cancelled</span>
                      <span className="text-sm font-black text-rose-700 dark:text-rose-300">{cat.cancelled}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-extrabold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                  <span>Open {cat.name} Table</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ─── VIEW 2: SELECTED CATEGORY OPERATIONS TABLE (NEXT PAGE VIEW) ─── */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header with Back to Category Hub button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-2">
              {/* In-page Breadcrumbs Navigation */}
             

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleSelectCategory(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 text-brand-600" />
                  <span>Back to Hub</span>
                </button>

                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-brand-600" />
                  <span>
                    {selectedCategory === "All" ? "All Bookings Directory" : `${selectedCategory} Operations Directory`}
                  </span>
                </h1>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Managing live dispatch, partner assignments, and order tracking for {selectedCategory === "All" ? "all categories" : selectedCategory}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsWizardOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Booking</span>
              </button>
            </div>
          </div>

          {/* 5 KPI Status Summary Cards for the active category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              type="button"
              onClick={() => {
                setCardFilter("ALL");
                setActiveStatusFilter("All");
              }}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                cardFilter === "ALL"
                  ? "bg-indigo-500/10 dark:bg-indigo-950/40 border-2 border-indigo-500 shadow-md scale-[1.01]"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Total Bookings
                </span>
                {cardFilter === "ALL" && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                {categoryBookings.length} Orders
              </h3>
            </button>

            <button
              type="button"
              onClick={() => setCardFilter(cardFilter === "UNASSIGNED" ? "ALL" : "UNASSIGNED")}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                cardFilter === "UNASSIGNED"
                  ? "bg-amber-500/10 dark:bg-amber-950/40 border-2 border-amber-500 shadow-md scale-[1.01]"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Waiting Partner</span>
                {cardFilter === "UNASSIGNED" && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                    Filtered
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {categoryBookings.filter((b) => !b.technicianName).length} Unassigned
              </h3>
            </button>

            <button
              type="button"
              onClick={() => setCardFilter(cardFilter === "IN_PROGRESS" ? "ALL" : "IN_PROGRESS")}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                cardFilter === "IN_PROGRESS"
                  ? "bg-blue-500/10 dark:bg-blue-950/40 border-2 border-blue-500 shadow-md scale-[1.01]"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">In Progress</span>
                {cardFilter === "IN_PROGRESS" && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500 text-white">
                    Filtered
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {categoryBookings.filter((b) => b.status === "In Progress" || b.status === "Assigned").length} Jobs
              </h3>
            </button>

            <button
              type="button"
              onClick={() => setCardFilter(cardFilter === "COMPLETED" ? "ALL" : "COMPLETED")}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                cardFilter === "COMPLETED"
                  ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-2 border-emerald-500 shadow-md scale-[1.01]"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Completed Jobs</span>
                {cardFilter === "COMPLETED" && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                    Filtered
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {categoryBookings.filter((b) => b.status === "Completed").length} Closed
              </h3>
            </button>

            <button
              type="button"
              onClick={() => setCardFilter(cardFilter === "CANCELLED" ? "ALL" : "CANCELLED")}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
                cardFilter === "CANCELLED"
                  ? "bg-rose-500/10 dark:bg-rose-950/40 border-2 border-rose-500 shadow-md scale-[1.01]"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Cancelled Jobs</span>
                {cardFilter === "CANCELLED" && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    Filtered
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {categoryBookings.filter((b) => b.status === "Cancelled" || b.status === "Rejected").length} Cancelled
              </h3>
            </button>
          </div>

          {/* Main DataTable with Table-Level Origin Filter */}
          <DataTable
            columns={columns}
            data={filteredBookings}
            extraFilters={
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setChannelFilter("ALL")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    channelFilter === "ALL"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All Origins
                </button>

                <button
                  type="button"
                  onClick={() => setChannelFilter("ONLINE")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    channelFilter === "ONLINE"
                      ? "bg-purple-600 text-white shadow-xs font-extrabold"
                      : "text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/60"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Online Booking ({categoryBookings.filter(isOnlineBooking).length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannelFilter("MANUAL")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    channelFilter === "MANUAL"
                      ? "bg-slate-800 text-white shadow-xs font-extrabold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Manual Booking ({categoryBookings.filter((b) => !isOnlineBooking(b)).length})</span>
                </button>
              </div>
            }
          />
        </div>
      )}

      {/* MODALS */}
      <BookingWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onBookingCreated={handleBookingCreated}
      />

      <AssignPartnerModal
        booking={assignBooking}
        isOpen={!!assignBooking}
        onClose={() => setAssignBooking(null)}
        onPartnerAssigned={handlePartnerAssigned}
        onSimulateAcceptance={handleSimulatePartnerAcceptance}
      />

      <InspectionFlowModal
        booking={inspectionBooking}
        isOpen={!!inspectionBooking}
        onClose={() => setInspectionBooking(null)}
        onInspectionApproved={handleInspectionApproved}
      />

      <OtpVerificationModal
        booking={otpBooking}
        isOpen={!!otpBooking}
        onClose={() => setOtpBooking(null)}
        onJobCompleted={handleJobCompleted}
      />

      {/* Edit Booking Modal */}
      <EditBookingModal
        isOpen={Boolean(editingBooking)}
        booking={editingBooking}
        onClose={() => setEditingBooking(null)}
        onBookingUpdated={handleBookingUpdated}
      />

      {/* Reschedule Booking Modal */}
      <RescheduleBookingModal
        isOpen={Boolean(reschedulingBooking)}
        booking={reschedulingBooking}
        onClose={() => setReschedulingBooking(null)}
        onReschedule={handleRescheduleBooking}
      />

      <BookingDetailsDrawer
        booking={drawerBooking}
        isOpen={!!drawerBooking}
        onClose={() => setDrawerBooking(null)}
        onAssignPartner={(b) => setAssignBooking(b)}
      />

      {/* RIGHT BOTTOM POPUP: CREATED BOOKING INVOICE TOAST */}
      {createdBookingToast && (
        <Portal>
          <div className="fixed bottom-6 right-6 z-[9999999] max-w-sm w-full bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 ring-1 ring-slate-700/50 animate-in slide-in-from-bottom-5 duration-300 outline-none">
            {/* Top Right Close Icon */}
            <button
              type="button"
              onClick={() => setCreatedBookingToast(null)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="space-y-1.5 pr-6 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Booking Confirmed
                  </span>
                  <span className="font-mono text-[11px] font-extrabold text-slate-300">
                    {createdBookingToast.id}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-white truncate">
                  {createdBookingToast.customerName}
                </h4>

                <p className="text-[11px] text-slate-400">
                  {createdBookingToast.serviceTitle} •{" "}
                  <strong className="text-emerald-400 font-extrabold">
                    ₹{(createdBookingToast.totalAmount || 0).toLocaleString()}
                  </strong>
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const bId = createdBookingToast.id;
                      setCreatedBookingToast(null);
                      router.push(`/billing/${bId}`);
                    }}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-lux flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>See Invoice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ─── HIDDEN PRINT CANVAS: STRICT SINGLE-PAGE A4 GST TAX INVOICE PRINT ─── */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body > * {
            display: none !important;
          }
          body > #printable-tax-invoice-portal {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          #printable-tax-invoice-portal * {
            visibility: visible !important;
          }
        }
      `}</style>

      {printTargetBooking && (
        <Portal>
          <div
            id="printable-tax-invoice-portal"
            className="hidden print:block p-0 rounded-3xl bg-white text-black space-y-4 w-full"
          >
            {/* Header */}
            <div className="flex flex-row items-start justify-between gap-2 border-b border-slate-300 pb-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-white border border-slate-300 shrink-0 flex items-center justify-center">
                  <img
                    src="https://helpmate-theta.vercel.app/logo.png"
                    alt="HelpMate Logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h1 className="font-extrabold text-xl text-black tracking-tight leading-none">
                      HelpMate
                    </h1>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-black border border-slate-300">
                      Varanasi HQ
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-700 font-medium">
                    Sigra Main Road, Near Cantt Railway Station, Varanasi - 221002
                  </p>
                  <p className="text-[10px] font-mono text-slate-700 font-bold">
                    GSTIN: 09AAACH8819Q1ZM • Support: +91 99350 98765
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end text-right space-y-1 shrink-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-black font-extrabold text-[10px] border border-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                  <span>OFFICIAL GST TAX INVOICE</span>
                </div>

                <div className="font-mono text-xs font-black text-black bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-300">
                  Invoice No: <span className="text-black font-extrabold">{formatInvoiceNumber(printTargetBooking.id)}</span>
                </div>

                <div className="text-[10px] text-slate-600 font-semibold">
                  Invoice Date: <span className="font-bold text-black">{printTargetBooking.date || "30 July 2026"}</span>
                </div>
              </div>
            </div>

            {/* Customer & Billing Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
                <span className="font-extrabold text-slate-500 uppercase tracking-wider block text-[9px]">
                  Billed To (Customer Details)
                </span>
                <div className="font-extrabold text-black text-xs">
                  {printTargetBooking.customerName}
                </div>
                <div className="text-slate-800 font-medium text-[10px]">
                  {printTargetBooking.address || `${printTargetBooking.locality}, Varanasi`}
                </div>
                <div className="font-bold text-slate-900 text-[10px]">
                  Phone: {printTargetBooking.customerPhone}
                </div>
                {printTargetBooking.customerGstin && (
                  <div className="font-mono font-bold text-black bg-slate-100 p-0.5 rounded border border-slate-300 text-[9px] w-fit">
                    B2B GSTIN: {printTargetBooking.customerGstin}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 space-y-1">
                <span className="font-extrabold text-slate-500 uppercase tracking-wider block text-[9px]">
                  Service & Payment Details
                </span>
                <div className="font-extrabold text-black text-xs">
                  Service: {printTargetBooking.serviceTitle}
                </div>
                <div className="text-slate-800 font-medium text-[10px]">
                  Category: {printTargetBooking.category}
                </div>
                <div className="font-bold text-slate-900 text-[10px]">
                  Payment Method: {printTargetBooking.paymentMethod || "UPI / Digital Prepaid"}
                </div>
                <div className="font-bold text-emerald-700 flex items-center gap-1 text-[10px]">
                  ✓ Payment Status: Paid Clean
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase text-[9px]">
                    <th className="pb-1.5">Item / Description</th>
                    <th className="pb-1.5 text-right">Base Amount</th>
                    <th className="pb-1.5 text-right">CGST (9%)</th>
                    <th className="pb-1.5 text-right">SGST (9%)</th>
                    <th className="pb-1.5 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-semibold text-black">
                  <tr>
                    <td className="py-2">
                      <div className="font-extrabold text-xs">{printTargetBooking.serviceTitle}</div>
                      <div className="text-[10px] text-slate-600 font-normal">
                        Standard Varanasi Home Service Rate Card
                      </div>
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-xs">₹{printTargetBooking.basePrice || 699}</td>
                    <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{printTargetBooking.cgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)}</td>
                    <td className="py-2 text-right font-mono text-slate-700 text-xs">₹{printTargetBooking.sgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)}</td>
                    <td className="py-2 text-right font-mono font-extrabold text-black text-xs">
                      ₹{(printTargetBooking.basePrice || 699) + (printTargetBooking.cgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)) + (printTargetBooking.sgst || Math.round((printTargetBooking.basePrice || 699) * 0.09))}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <div className="font-bold text-xs">Platform Convenience & Safety Insurance Fee</div>
                      <div className="text-[10px] text-slate-600 font-normal">
                        HelpMate Safety Insurance & Tech Assignment
                      </div>
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-xs">₹{printTargetBooking.convenienceFee || 49}</td>
                    <td className="py-2 text-right font-mono text-slate-700 text-xs">₹0</td>
                    <td className="py-2 text-right font-mono text-slate-700 text-xs">₹0</td>
                    <td className="py-2 text-right font-mono font-bold text-xs">₹{printTargetBooking.convenienceFee || 49}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tax Summary & Total Box */}
            <div className="flex flex-row justify-between items-start gap-4 border-t border-slate-300 pt-3">
              <div className="text-[10px] text-slate-600 space-y-0.5 max-w-sm">
                <span className="font-extrabold text-black block text-xs">Terms & Conditions</span>
                <p>1. Invoice generated under GST Act 2017 for Varanasi Jurisdiction.</p>
                <p>2. Standard terms apply to Home Maintenance & Repair Services.</p>
              </div>

              <div className="w-60 p-2.5 rounded-xl bg-slate-50 border border-slate-300 space-y-1 text-xs">
                <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                  <span>Base Subtotal</span>
                  <span className="font-mono font-bold">₹{(printTargetBooking.basePrice || 699) + (printTargetBooking.convenienceFee || 49)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                  <span>CGST (9%)</span>
                  <span className="font-mono font-bold">₹{printTargetBooking.cgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-300 text-slate-800 text-[11px]">
                  <span>SGST (9%)</span>
                  <span className="font-mono font-bold">₹{printTargetBooking.sgst || Math.round((printTargetBooking.basePrice || 699) * 0.09)}</span>
                </div>
                <div className="flex justify-between py-0.5 text-xs font-black text-black">
                  <span>Grand Total</span>
                  <span className="font-mono text-emerald-700 font-bold text-xs">₹{printTargetBooking.totalAmount || 873}</span>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold text-slate-400">Loading bookings directory...</div>}>
      <BookingsPageContent />
    </Suspense>
  );
}

