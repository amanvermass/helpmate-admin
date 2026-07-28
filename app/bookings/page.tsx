"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/DataTable";
import { initialBookings, Booking, BookingStatus, Technician } from "@/lib/mockData";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
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
} from "lucide-react";
import { BookingWizardModal } from "@/components/bookings/BookingWizardModal";
import { AssignPartnerModal } from "@/components/bookings/AssignPartnerModal";
import { InspectionFlowModal } from "@/components/bookings/InspectionFlowModal";
import { OtpVerificationModal } from "@/components/bookings/OtpVerificationModal";
import { EditBookingModal } from "@/components/bookings/EditBookingModal";

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("All");

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [assignBooking, setAssignBooking] = useState<Booking | null>(null);
  const [inspectionBooking, setInspectionBooking] = useState<Booking | null>(null);
  const [otpBooking, setOtpBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (activeStatusFilter === "All") return true;
    return b.status.toLowerCase() === activeStatusFilter.toLowerCase();
  });

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings([newBooking, ...bookings]);
  };

  const handlePartnerAssigned = (bookingId: string, technician: Technician) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "Assigned",
              technicianName: technician.name,
              technicianId: technician.id,
            }
          : b
      )
    );
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

  const handleJobCompleted = (bookingId: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              isOtpVerified: true,
              status: "Completed",
            }
          : b
      )
    );
  };

  const handleBookingUpdated = (updated: Booking) => {
    setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)));
  };

  const columns: Column<Booking>[] = [
    {
      key: "id",
      header: "Booking ID",
      accessor: (row) => (
        <button
          type="button"
          onClick={() => router.push(`/bookings/${row.id}`)}
          className="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
        >
          {row.id}
        </button>
      ),
      sortable: true,
    },
    {
      key: "customerName",
      header: "Customer",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{row.customerName}</span>
          <span className="text-[10px] text-slate-500">{row.customerPhone}</span>
        </div>
      ),
      sortable: true,
    },
    { key: "category", header: "Category", sortable: true },
    { key: "serviceTitle", header: "Service Title", sortable: true },
    {
      key: "city",
      header: "City / Locality",
      accessor: (row) => (
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-brand-600 shrink-0" />
          <span className="truncate max-w-[120px] font-semibold">{row.locality}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "totalAmount",
      header: "Amount (₹)",
      accessor: (row) => <span className="font-extrabold text-slate-900 dark:text-white">₹{row.totalAmount}</span>,
      sortable: true,
    },
    {
      key: "technicianName",
      header: "Assigned Partner",
      accessor: (row) =>
        row.technicianName ? (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {row.technicianName}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setAssignBooking(row)}
            className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 cursor-pointer hover:bg-amber-100"
          >
            Assign Partner
          </button>
        ),
      sortable: true,
    },
    {
      key: "status",
      header: "Booking Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
            row.status === "Completed"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : row.status === "In Progress" || row.status === "Assigned"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : row.status === "Cancelled"
              ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    { key: "date", header: "Schedule Slot", sortable: true },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => router.push(`/bookings/${row.id}`)}
            title="View Booking Details"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditingBooking(row)}
            title="Edit Booking"
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

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
      {/* KPI Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Bookings</span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">{bookings.length} Orders</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-amber-600">Waiting Partner</span>
          <h3 className="text-xl font-black text-amber-600">{bookings.filter((b) => !b.technicianName).length} Unassigned</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-blue-600">In Progress</span>
          <h3 className="text-xl font-black text-blue-600">{bookings.filter((b) => b.status === "In Progress" || b.status === "Assigned").length} Jobs</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-emerald-600">Completed Jobs</span>
          <h3 className="text-xl font-black text-emerald-600">{bookings.filter((b) => b.status === "Completed").length} Closed</h3>
        </div>
      </div>

      {/* Main DataTable matching User Management layout */}
      <DataTable
        title="Booking Dispatch & Lifecycle Management"
        description="Enterprise multi-service booking dispatch grid with real-time status actions"
        columns={columns}
        data={filteredBookings}
        addButtonLabel="Create Booking"
        onAddClick={() => setIsWizardOpen(true)}
      />

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

      <EditBookingModal
        booking={editingBooking}
        isOpen={!!editingBooking}
        onClose={() => setEditingBooking(null)}
        onBookingUpdated={handleBookingUpdated}
      />
    </div>
  );
}

