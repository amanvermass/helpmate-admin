"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X,
  Edit,
  Edit2,
  Trash2,
  Plus,
  UserCheck,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Receipt,
  Briefcase,
  ExternalLink,
  Sparkles,
  Home,
  HeartHandshake,
  Building,
  CreditCard,
  Sliders,
  User,
  ShieldCheck,
  Copy,
  Wind,
  Tv,
} from "lucide-react";
import { initialCustomers, Customer, varanasiLocalities, initialBookings, Booking, AddressRecipientType } from "@/lib/mockData";
import { CustomSelect } from "@/components/CustomSelect";
import { Portal } from "@/components/Portal";
import { DataTable, Column } from "@/components/DataTable";

export interface ACUnit {
  id: string;
  type: "Split AC" | "Window AC" | "Inverter Split AC" | "Cassette AC" | "Tower AC";
  brand: string;
  capacityTon: string;
  starRating: string;
  roomLocation: string;
  installationYear: string;
  serialNumber: string;
  lastServiceDate: string;
  nextDueDate: string;
  status: "Working Great" | "Needs Servicing" | "Gas Leak Repair Required" | "Under Warranty";
  gasType?: string;
  foamJetServiced?: boolean;
}

export interface PropertyCleaningSpec {
  propertyType: string;
  carpetAreaSqFt: number;
  bedroomsCount: number;
  livingDiningRoomsCount: number;
  bathroomsCount: number;
  kitchenType: string;
  balconiesCount: number;
  sofaSeatsCount: number;
  mattressCount: number;
  curtainsCount: number;
  floorType?: string;
}

export interface OtherAppliance {
  id: string;
  category: "Washing Machine" | "Refrigerator" | "Water Purifier (RO)" | "Geyser / Water Heater" | "Microwave / Oven";
  brand: string;
  modelSpec: string;
  location: string;
  status: "Working Great" | "Needs Maintenance" | "Under Warranty";
  lastServiced: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const custId = (params?.id as string) || "cust-1";

  // Find target customer or fallback to first customer
  const foundCustomer = initialCustomers.find((c) => c.id === custId) || initialCustomers[0];
  const [customer, setCustomer] = useState<Customer>(foundCustomer);

  // Tab Navigation Order: Profile -> Bookings -> Invoices -> Manage Address -> Appliances & Property Assets
  const [activeTab, setActiveTab] = useState<"profile" | "bookings" | "invoices" | "addresses" | "appliances">("profile");

  // Appliance Sub-Tab ("ac" | "property" | "other") & Modal States
  const [applianceSubTab, setApplianceSubTab] = useState<"ac" | "property" | "other">("ac");
  const [selectedACDetail, setSelectedACDetail] = useState<ACUnit | null>(null);
  const [isAddACModalOpen, setIsAddACModalOpen] = useState(false);
  const [isEditPropertySpecModalOpen, setIsEditPropertySpecModalOpen] = useState(false);

  // Customer AC Units State Map
  const [customerACUnitsMap, setCustomerACUnitsMap] = useState<Record<string, ACUnit[]>>({
    "cust-1": [
      {
        id: "ac-101",
        type: "Inverter Split AC",
        brand: "Daikin",
        capacityTon: "1.5 Ton",
        starRating: "5 Star Inverter",
        roomLocation: "Master Bedroom",
        installationYear: "2023",
        serialNumber: "DKN-2023-VNS-8812",
        lastServiceDate: "12 May 2026 (Power Foam-Jet Clean)",
        nextDueDate: "12 Nov 2026",
        status: "Working Great",
        gasType: "R32 Eco Refrigerant",
        foamJetServiced: true,
      },
      {
        id: "ac-102",
        type: "Window AC",
        brand: "Voltas",
        capacityTon: "1.0 Ton",
        starRating: "3 Star",
        roomLocation: "Guest Bedroom 1",
        installationYear: "2022",
        serialNumber: "VLT-2022-VAR-4401",
        lastServiceDate: "05 Mar 2026",
        nextDueDate: "05 Sep 2026",
        status: "Needs Servicing",
        gasType: "R410A Refrigerant",
        foamJetServiced: false,
      },
      {
        id: "ac-103",
        type: "Cassette AC",
        brand: "Mitsubishi Heavy",
        capacityTon: "2.0 Ton",
        starRating: "5 Star",
        roomLocation: "Living & Dining Hall",
        installationYear: "2024",
        serialNumber: "MITS-2024-CASS-990",
        lastServiceDate: "28 Jun 2026",
        nextDueDate: "28 Dec 2026",
        status: "Under Warranty",
        gasType: "R32 Inverter Gas",
        foamJetServiced: true,
      },
    ],
    "cust-2": [
      {
        id: "ac-201",
        type: "Inverter Split AC",
        brand: "LG Smart Inverter",
        capacityTon: "1.5 Ton",
        starRating: "5 Star Dual Inverter",
        roomLocation: "Main Living Room",
        installationYear: "2023",
        serialNumber: "LG-2023-INV-7721",
        lastServiceDate: "15 Apr 2026",
        nextDueDate: "15 Oct 2026",
        status: "Working Great",
        gasType: "R32 Gas",
        foamJetServiced: true,
      },
    ],
  });

  // Customer Property Cleaning Specs Map
  const [customerPropertySpecsMap, setCustomerPropertySpecsMap] = useState<Record<string, PropertyCleaningSpec>>({
    "cust-1": {
      propertyType: "3 BHK Independent Luxury Flat",
      carpetAreaSqFt: 1850,
      bedroomsCount: 3,
      livingDiningRoomsCount: 2,
      bathroomsCount: 3,
      kitchenType: "Modular Kitchen with Exhaust Chimney & Gas Hob",
      balconiesCount: 2,
      sofaSeatsCount: 7,
      mattressCount: 3,
      curtainsCount: 10,
      floorType: "Italian Marble & Vitrified Tiles",
    },
    "cust-2": {
      propertyType: "2 BHK Apartment",
      carpetAreaSqFt: 1200,
      bedroomsCount: 2,
      livingDiningRoomsCount: 1,
      bathroomsCount: 2,
      kitchenType: "Semi-Modular Kitchen",
      balconiesCount: 1,
      sofaSeatsCount: 5,
      mattressCount: 2,
      curtainsCount: 6,
      floorType: "Vitrified Tiles",
    },
  });

  // Customer Other Home Appliances Map
  const [customerOtherAppliancesMap, setCustomerOtherAppliancesMap] = useState<Record<string, OtherAppliance[]>>({
    "cust-1": [
      {
        id: "app-101",
        category: "Washing Machine",
        brand: "IFB Executive ZXS",
        modelSpec: "8.5kg Fully Automatic Front Load",
        location: "Utility Balcony",
        status: "Working Great",
        lastServiced: "10 Jan 2026",
      },
      {
        id: "app-102",
        category: "Refrigerator",
        brand: "Samsung Convertible 5-in-1",
        modelSpec: "345L Frost Free Double Door",
        location: "Dining Kitchen Area",
        status: "Working Great",
        lastServiced: "22 Feb 2026",
      },
      {
        id: "app-103",
        category: "Water Purifier (RO)",
        brand: "Kent Grand Plus",
        modelSpec: "RO + UV + UF + TDS Control (8 Litre Storage)",
        location: "Kitchen Wall Mount",
        status: "Needs Maintenance",
        lastServiced: "15 Nov 2025 (Filter Change Due)",
      },
    ],
  });

  // Form state for Add AC
  const [newACType, setNewACType] = useState<ACUnit["type"]>("Inverter Split AC");
  const [newACBrand, setNewACBrand] = useState("Daikin");
  const [newACTon, setNewACTon] = useState("1.5 Ton");
  const [newACStar, setNewACStar] = useState("5 Star");
  const [newACRoom, setNewACRoom] = useState("Master Bedroom");
  const [newACSerial, setNewACSerial] = useState("");
  const [newACStatus, setNewACStatus] = useState<ACUnit["status"]>("Working Great");

  // Form state for Edit BHK Property Specs
  const [propertyFormType, setPropertyFormType] = useState("3 BHK Independent Flat");
  const [propertyFormCarpet, setPropertyFormCarpet] = useState(1650);
  const [propertyFormBedrooms, setPropertyFormBedrooms] = useState(3);
  const [propertyFormLivingDining, setPropertyFormLivingDining] = useState(2);
  const [propertyFormBathrooms, setPropertyFormBathrooms] = useState(3);
  const [propertyFormKitchen, setPropertyFormKitchen] = useState("Modular Kitchen with Chimney");
  const [propertyFormBalconies, setPropertyFormBalconies] = useState(2);
  const [propertyFormSofa, setPropertyFormSofa] = useState(7);
  const [propertyFormMattress, setPropertyFormMattress] = useState(3);
  const [propertyFormCurtains, setPropertyFormCurtains] = useState(8);

  // Slide-Over Profile Edit Drawer State
  const [isEditProfileDrawerOpen, setIsEditProfileDrawerOpen] = useState(false);
  const [editName, setEditName] = useState(customer.name);
  const [editPhone, setEditPhone] = useState(customer.phone);
  const [editAlternatePhone, setEditAlternatePhone] = useState(customer.alternatePhone || "");
  const [editEmail, setEditEmail] = useState(customer.email);
  const [editLocality, setEditLocality] = useState(customer.locality);
  const [editPincode, setEditPincode] = useState(customer.pincode || "221002");
  const [editAddress, setEditAddress] = useState(customer.address);

  // Slide-Over Address Drawer State (Unified for BOTH Add & Edit Address)
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);

  // Address Form States
  const [addrFormLabel, setAddrFormLabel] = useState("Home Address");
  const [addrFormType, setAddrFormType] = useState<AddressRecipientType>("Self");
  const [addrFormRecipientName, setAddrFormRecipientName] = useState(customer.name);
  const [addrFormRecipientPhone, setAddrFormRecipientPhone] = useState(customer.phone);
  const [addrFormLocality, setAddrFormLocality] = useState("Sigra");
  const [addrFormPincode, setAddrFormPincode] = useState("221002");
  const [addrFormAddress, setAddrFormAddress] = useState("");

  // Customer Address Book State
  const [customerAddressesMap, setCustomerAddressesMap] = useState<Record<string, {
    id: string;
    label: string;
    address: string;
    locality: string;
    pincode: string;
    type: AddressRecipientType;
    recipientName?: string;
    recipientPhone?: string;
    isPrimary?: boolean;
  }[]>>({
    "cust-1": [
      {
        id: "addr-101",
        label: "Home (Primary Residence)",
        address: "D-58/16C Shashtri Nagar Colony, Sigra Main Road, Varanasi",
        locality: "Sigra",
        pincode: "221002",
        type: "Self",
        recipientName: "Rajesh Kumar Agrawal",
        recipientPhone: "+91 77050 04040",
        isPrimary: true,
      },
      {
        id: "addr-102",
        label: "Commercial Shop & Office",
        address: "B-12/40 Shop No. 4, Mahmoorganj Commercial Complex, Varanasi",
        locality: "Mahmoorganj",
        pincode: "221010",
        type: "Office / Work",
        recipientName: "Agrawal Electricals Retail HQ",
        recipientPhone: "+91 77050 04040",
        isPrimary: false,
      },
      {
        id: "addr-103",
        label: "Wife's Residence",
        address: "Flat 302, Assi Riverside Apartments, Assi Ghat, Varanasi",
        locality: "Lanka / Assi Ghat",
        pincode: "221005",
        type: "Family Member",
        recipientName: "Sunita Agrawal",
        recipientPhone: "+91 94501 88200",
        isPrimary: false,
      },
    ],
    "cust-2": [
      {
        id: "addr-201",
        label: "Corporate Office HQ",
        address: "Bungalow No. 12, Cantonment Officers Enclave, Varanasi",
        locality: "Cantonment",
        pincode: "221002",
        type: "Office / Work",
        recipientName: "Varanasi Silk Exports Ltd",
        recipientPhone: "+91 98390 12345",
        isPrimary: true,
      },
      {
        id: "addr-202",
        label: "Parental Residence",
        address: "C-14/89 Kabir Chaura Road, Near Lahurabir Chowk, Varanasi",
        locality: "Lahurabir",
        pincode: "221001",
        type: "Family Member",
        recipientName: "B.P. Srivastava",
        recipientPhone: "+91 94152 77110",
        isPrimary: false,
      },
    ],
    "cust-3": [
      {
        id: "addr-301",
        label: "Primary Apartment",
        address: "Flat 4B, Kuber Complex, Ratha Yatra Crossing, Varanasi",
        locality: "Rathyatra",
        pincode: "221010",
        type: "Self",
        recipientName: "Amitabh Verma",
        recipientPhone: "+91 94152 99001",
        isPrimary: true,
      },
    ],
  });

  // Customer Invoices Map State (Expanded Dataset for Pagination)
  const customerInvoicesMap: Record<string, any[]> = {
    "cust-1": [
      {
        id: "INV-VAR-202601",
        bookingId: "HM-VAR-8812",
        serviceTitle: "Dual Split AC Jet Servicing & Anti-Bacterial Foam Wash",
        date: "04 Aug 2026",
        baseAmount: 1694,
        gstAmount: 305,
        totalAmount: 1999,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202602",
        bookingId: "HM-VAR-8804",
        serviceTitle: "Bathroom Deep Cleaning & Hard Water Stain Removal",
        date: "18 Jul 2026",
        baseAmount: 1270,
        gstAmount: 229,
        totalAmount: 1499,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202603",
        bookingId: "HM-VAR-8799",
        serviceTitle: "Commercial Water Cooler Hydro Descaling & Servicing",
        date: "12 May 2026",
        baseAmount: 3390,
        gstAmount: 610,
        totalAmount: 4000,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202604",
        bookingId: "HM-VAR-8785",
        serviceTitle: "3BHK Full Home Deep Scrubbing & UV Sanitization",
        date: "28 Apr 2026",
        baseAmount: 4236,
        gstAmount: 763,
        totalAmount: 4999,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202605",
        bookingId: "HM-VAR-8772",
        serviceTitle: "Cassette AC PCB Circuit Board Testing & Overhaul",
        date: "15 Apr 2026",
        baseAmount: 2541,
        gstAmount: 458,
        totalAmount: 2999,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202606",
        bookingId: "HM-VAR-8760",
        serviceTitle: "RO Water Purifier Membrane & Filter Replacement",
        date: "02 Mar 2026",
        baseAmount: 1101,
        gstAmount: 198,
        totalAmount: 1299,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202607",
        bookingId: "HM-VAR-8748",
        serviceTitle: "Washing Machine Motor Bush Replacement & Drum Balance",
        date: "19 Feb 2026",
        baseAmount: 1525,
        gstAmount: 274,
        totalAmount: 1799,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202608",
        bookingId: "HM-VAR-8735",
        serviceTitle: "Smart Modular Kitchen Deep Cleaning & Chimney Degreasing",
        date: "05 Jan 2026",
        baseAmount: 2118,
        gstAmount: 381,
        totalAmount: 2499,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202609",
        bookingId: "HM-VAR-8721",
        serviceTitle: "Refrigerator Gas Leak Recharge & Thermostat Calibration",
        date: "22 Dec 2025",
        baseAmount: 1864,
        gstAmount: 335,
        totalAmount: 2199,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202610",
        bookingId: "HM-VAR-8709",
        serviceTitle: "Sofa Shampooing & Fabric Stain Extraction (7 Seater)",
        date: "10 Nov 2025",
        baseAmount: 1440,
        gstAmount: 259,
        totalAmount: 1699,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202611",
        bookingId: "HM-VAR-8695",
        serviceTitle: "Master Bedroom 5-Star Split AC Power Foam Wash",
        date: "28 Oct 2025",
        baseAmount: 677,
        gstAmount: 122,
        totalAmount: 799,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202612",
        bookingId: "HM-VAR-8680",
        serviceTitle: "Main Circuit Breaker & DB Box Safety Upgrade",
        date: "14 Oct 2025",
        baseAmount: 1270,
        gstAmount: 229,
        totalAmount: 1499,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202613",
        bookingId: "HM-VAR-8668",
        serviceTitle: "High-Pressure Terrace Water Pipe Drain Unclogging",
        date: "01 Sep 2025",
        baseAmount: 762,
        gstAmount: 137,
        totalAmount: 899,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202614",
        bookingId: "HM-VAR-8652",
        serviceTitle: "Guest Room Window AC Coil Cleansing & Gas Top-up",
        date: "18 Aug 2025",
        baseAmount: 1270,
        gstAmount: 229,
        totalAmount: 1499,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202615",
        bookingId: "HM-VAR-8639",
        serviceTitle: "Hydro-Jet Bathroom Tile Cleaning & Grouting",
        date: "02 Aug 2025",
        baseAmount: 847,
        gstAmount: 152,
        totalAmount: 999,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202616",
        bookingId: "HM-VAR-8625",
        serviceTitle: "Ayurvedic Spa Full Body Therapy (Sunita Agrawal)",
        date: "15 Jul 2025",
        baseAmount: 1694,
        gstAmount: 305,
        totalAmount: 1999,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202617",
        bookingId: "HM-VAR-8598",
        serviceTitle: "Water Tank 1000L Hydro Scouring & Disinfection",
        date: "29 Jun 2025",
        baseAmount: 1101,
        gstAmount: 198,
        totalAmount: 1299,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
      {
        id: "INV-VAR-202618",
        bookingId: "HM-VAR-8582",
        serviceTitle: "Organic Gold Glow Facial (Home Salon)",
        date: "12 Jun 2025",
        baseAmount: 1270,
        gstAmount: 229,
        totalAmount: 1499,
        gstin: "09AABCH1234H1Z5",
        status: "Paid",
      },
    ],
    "cust-2": [
      {
        id: "INV-VAR-202604",
        bookingId: "HM-VAR-8822",
        serviceTitle: "Bungalow Full Villa Hydro Deep Cleaning",
        date: "02 Aug 2026",
        baseAmount: 12627,
        gstAmount: 2273,
        totalAmount: 14900,
        gstin: "09BKLPM9918K1Z2",
        status: "Paid",
      },
      {
        id: "INV-VAR-202605",
        bookingId: "HM-VAR-8826",
        serviceTitle: "RO Water Purifier Filter Cartridge Replacement",
        date: "15 Jun 2026",
        baseAmount: 2119,
        gstAmount: 381,
        totalAmount: 2500,
        gstin: "09BKLPM9918K1Z2",
        status: "Paid",
      },
    ],
    "cust-3": [
      {
        id: "INV-VAR-202607",
        bookingId: "HM-VAR-8820",
        serviceTitle: "Power Jet Split AC Servicing",
        date: "28 Jul 2026",
        baseAmount: 1609,
        gstAmount: 290,
        totalAmount: 1899,
        gstin: "B2C Retail Tax Invoice",
        status: "Paid",
      },
    ],
  };

  const customerBookings = initialBookings.filter(
    (b) => b.customerName?.toLowerCase().includes(customer.name.toLowerCase()) || b.customerPhone === customer.phone
  );

  // DataTable Booking Columns Definition
  const bookingColumns: Column<Booking>[] = [
    {
      key: "id",
      header: "Booking ID",
      accessor: (row) => (
        <span className="font-mono text-xs font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800">
          {row.id}
        </span>
      ),
      sortable: true,
    },
    {
      key: "serviceTitle",
      header: "Service & Category",
      accessor: (row) => (
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">
            {row.serviceTitle || row.serviceName || "Home Servicing"}
          </h4>
          <span className="text-[10px] text-slate-400 font-bold uppercase">{row.category || "General Service"}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "date",
      header: "Date & Time",
      accessor: (row) => (
        <div className="text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">{row.date || "Today"}</span>
          <span className="text-[10px] text-slate-400 font-mono">{row.timeSlot || "02:00 PM - 04:00 PM"}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "technicianName",
      header: "Assigned Technician",
      accessor: (row) => (
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          {row.technicianName || "Helpmate Expert Fleet"}
        </span>
      ),
    },
    {
      key: "totalAmount",
      header: "Amount",
      accessor: (row) => (
        <span className="font-mono font-black text-slate-900 dark:text-white text-xs">
          ₹{(row.totalAmount || row.basePrice || 1499).toLocaleString("en-IN")}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
            row.status === "Completed"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 border-emerald-200"
              : row.status === "In Progress"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950 border-blue-200"
              : row.status === "Cancelled"
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950 border-rose-200"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950 border-amber-200"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      accessor: (row) => (
        <Link
          href={`/bookings/${row.id}`}
          className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-[11px] shadow-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      ),
    },
  ];

  // DataTable Invoice Columns Definition
  const invoiceColumns: Column<any>[] = [
    {
      key: "id",
      header: "Invoice ID",
      accessor: (row) => (
        <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
          {row.id}
        </span>
      ),
      sortable: true,
    },
    {
      key: "bookingId",
      header: "Booking ID",
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          {row.bookingId}
        </span>
      ),
      sortable: true,
    },
    {
      key: "serviceTitle",
      header: "Service Description",
      accessor: (row) => (
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs">{row.serviceTitle}</h4>
          <span className="text-[10px] text-slate-400 font-mono">GSTIN: {row.gstin}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "date",
      header: "Issued Date",
      accessor: (row) => <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{row.date}</span>,
      sortable: true,
    },
    {
      key: "totalAmount",
      header: "Total (incl. GST)",
      accessor: (row) => (
        <div className="text-right">
          <span className="font-mono font-black text-slate-900 dark:text-white text-xs block">
            ₹{row.totalAmount.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Base ₹{row.baseAmount} + GST ₹{row.gstAmount}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Payment Status",
      accessor: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
            row.status === "Paid"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 border-emerald-200"
              : row.status === "Pending"
              ? "bg-amber-50 text-amber-700 dark:bg-amber-950 border-amber-200"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950 border-rose-200"
          }`}
        >
          {row.status || "Paid"}
        </span>
      ),
      sortable: true,
    },
  ];

  // Profile Edit Form Submit Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomer({
      ...customer,
      name: editName,
      phone: editPhone,
      alternatePhone: editAlternatePhone,
      email: editEmail,
      locality: editLocality,
      pincode: editPincode,
      address: editAddress,
    });
    setIsEditProfileDrawerOpen(false);
  };

  // Open Drawer for Adding New Address
  const handleOpenAddAddressDrawer = () => {
    setEditingAddrId(null);
    setAddrFormLabel("Home Address");
    setAddrFormType("Self");
    setAddrFormRecipientName(customer.name);
    setAddrFormRecipientPhone(customer.phone);
    setAddrFormLocality(customer.locality || "Sigra");
    setAddrFormPincode(customer.pincode || "221002");
    setAddrFormAddress("");
    setIsAddressDrawerOpen(true);
  };

  // Open Drawer for Editing Existing Address
  const handleOpenEditAddressDrawer = (addrObj: any) => {
    setEditingAddrId(addrObj.id);
    setAddrFormLabel(addrObj.label);
    setAddrFormType(addrObj.type || "Self");
    setAddrFormRecipientName(addrObj.recipientName || customer.name);
    setAddrFormRecipientPhone(addrObj.recipientPhone || customer.phone);
    setAddrFormLocality(addrObj.locality);
    setAddrFormPincode(addrObj.pincode);
    setAddrFormAddress(addrObj.address);
    setIsAddressDrawerOpen(true);
  };

  // Save Address Handler (Add / Edit Slide-Over Form)
  const handleSaveAddressForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFormAddress) return;

    const currentList = customerAddressesMap[customer.id] || [];

    if (editingAddrId) {
      // Update existing address
      const updatedList = currentList.map((a) =>
        a.id === editingAddrId
          ? {
              ...a,
              label: addrFormLabel,
              type: addrFormType,
              recipientName: addrFormRecipientName,
              recipientPhone: addrFormRecipientPhone,
              locality: addrFormLocality,
              pincode: addrFormPincode,
              address: addrFormAddress,
            }
          : a
      );
      setCustomerAddressesMap({ ...customerAddressesMap, [customer.id]: updatedList });
    } else {
      // Create new address
      const newAddrItem = {
        id: `addr-${Date.now()}`,
        label: addrFormLabel || "Delivery Address",
        address: addrFormAddress,
        locality: addrFormLocality,
        pincode: addrFormPincode,
        type: addrFormType,
        recipientName: addrFormRecipientName,
        recipientPhone: addrFormRecipientPhone,
        isPrimary: currentList.length === 0,
      };
      setCustomerAddressesMap({ ...customerAddressesMap, [customer.id]: [...currentList, newAddrItem] });
    }

    setIsAddressDrawerOpen(false);
  };

  // Delete Address Handler
  const handleDeleteAddress = (addrId: string) => {
    const currentList = customerAddressesMap[customer.id] || [];
    setCustomerAddressesMap({
      ...customerAddressesMap,
      [customer.id]: currentList.filter((a) => a.id !== addrId),
    });
  };

  return (
    <div className="w-full space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Simple Clean Customer Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 text-brand-600" />
            <span>Back to Customer Directory</span>
          </Link>

          <span className="font-mono text-xs font-extrabold px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700">
            CUSTOMER ID: {customer.id}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center shadow-sm shrink-0">
              {customer.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {customer.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  {customer.customerType || "Individual Household"}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-3 flex-wrap pt-1">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <strong className="font-mono">{customer.phone}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>{customer.locality}, Varanasi ({customer.pincode || "221002"})</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-mono text-[11px]">{customer.email}</span>
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setEditName(customer.name);
                setEditPhone(customer.phone);
                setEditAlternatePhone(customer.alternatePhone || "");
                setEditEmail(customer.email);
                setEditLocality(customer.locality);
                setEditPincode(customer.pincode || "221002");
                setEditAddress(customer.address);
                setIsEditProfileDrawerOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <a
              href={`tel:${customer.phone}`}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>Call Customer</span>
            </a>

            <button
              type="button"
              onClick={() => {
                if (confirm(`Are you sure you want to delete customer ${customer.name}?`)) {
                  router.push("/customers");
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 cursor-pointer transition-all flex items-center gap-2 shrink-0 font-extrabold text-xs"
              title="Delete Customer Account"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── HIGH-CONTRAST LUXURY SEGMENTED TAB BAR (Matching Reference Image Style) ─── */}
      <div className="bg-[#F1F3F9] dark:bg-slate-800/80 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs w-full sm:w-fit overflow-x-auto no-scrollbar max-w-full flex-nowrap">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#7B1FA2] text-white shadow-sm scale-[1.01]"
              : "text-slate-700 dark:text-slate-300 hover:text-[#7B1FA2] hover:bg-white/60 dark:hover:bg-slate-700/60"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "bookings"
              ? "bg-[#7B1FA2] text-white shadow-sm scale-[1.01]"
              : "text-slate-700 dark:text-slate-300 hover:text-[#7B1FA2] hover:bg-white/60 dark:hover:bg-slate-700/60"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Bookings</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "bookings"
                ? "bg-white/20 text-white"
                : "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300"
            }`}
          >
            {customerBookings.length > 0 ? customerBookings.length : 3}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "invoices"
              ? "bg-[#7B1FA2] text-white shadow-sm scale-[1.01]"
              : "text-slate-700 dark:text-slate-300 hover:text-[#7B1FA2] hover:bg-white/60 dark:hover:bg-slate-700/60"
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Invoices</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "invoices"
                ? "bg-white/20 text-white"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
            }`}
          >
            {(customerInvoicesMap[customer.id] || []).length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("addresses")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "addresses"
              ? "bg-[#7B1FA2] text-white shadow-sm scale-[1.01]"
              : "text-slate-700 dark:text-slate-300 hover:text-[#7B1FA2] hover:bg-white/60 dark:hover:bg-slate-700/60"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Manage Address</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "addresses"
                ? "bg-white/20 text-white"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            }`}
          >
            {(customerAddressesMap[customer.id] || []).length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("appliances")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "appliances"
              ? "bg-[#7B1FA2] text-white shadow-sm scale-[1.01]"
              : "text-slate-700 dark:text-slate-300 hover:text-[#7B1FA2] hover:bg-white/60 dark:hover:bg-slate-700/60"
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Appliances</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "appliances"
                ? "bg-white/20 text-white"
                : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
            }`}
          >
            {(customerACUnitsMap[customer.id] || []).length + (customerOtherAppliancesMap[customer.id] || []).length}
          </span>
        </button>
      </div>

      {/* ─── TAB 1: PROFILE VIEW ─── */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-600" />
                  <span>Customer Identity & Contact Specifications</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Full Registered Name</span>
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm mt-1">{customer.name}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Primary Contact Phone</span>
                  <p className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm mt-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{customer.phone}</span>
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Alternate Phone</span>
                  <p className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs mt-1">
                    {customer.alternatePhone || customer.phone}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Email Address</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white text-xs mt-1">{customer.email}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Account Classification</span>
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs mt-1">{customer.customerType || "Individual Household"}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Property Household Type</span>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-xs mt-1">{customer.householdType || "Apartment / Flat"}</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <span>Primary Delivery Address</span>
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-mono text-xs font-extrabold text-brand-600 dark:text-brand-400 block">
                  {customer.locality}, Varanasi ({customer.pincode || "221002"})
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  {customer.address}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Lifetime Value Summary</span>
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-800 dark:text-emerald-300 tracking-wider block">Total Spent to Date</span>
                  <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5 block">
                    ₹{customer.totalSpend ? customer.totalSpend.toLocaleString("en-IN") : "0"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                  <span className="text-[10px] uppercase font-extrabold text-purple-800 dark:text-purple-300 tracking-wider block">Completed Bookings</span>
                  <span className="text-2xl font-black text-purple-700 dark:text-purple-400 font-mono mt-0.5 block">
                    {customer.totalBookings || 0} Orders
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: BOOKINGS VIEW (WITH PAGINATED DATATABLE) ─── */}
      {activeTab === "bookings" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span>Booking & Service History Ledger</span>
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                All assigned technician orders and past servicing logs for {customer.name}
              </p>
            </div>
          </div>

          <DataTable
            columns={bookingColumns}
            data={customerBookings}
            searchPlaceholder="Search customer bookings by ID, service, technician..."
            statusField="status"
          />
        </div>
      )}

      {/* ─── TAB 3: INVOICES VIEW (WITH PAGINATED DATATABLE) ─── */}
      {activeTab === "invoices" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>GSTIN Tax Invoices & B2B Billing Ledgers</span>
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Official tax invoices with 18% CGST/SGST tax breakdown for {customer.name}
              </p>
            </div>
          </div>

          <DataTable
            columns={invoiceColumns}
            data={customerInvoicesMap[customer.id] || customerInvoicesMap["cust-1"]}
            searchPlaceholder="Search tax invoices by ID, booking ID, title..."
            statusField="status"
          />
        </div>
      )}

      {/* ─── TAB 4: MANAGE ADDRESS VIEW (EXPLICIT SINGLE ADD BUTTON WITH RICH PADDING) ─── */}
      {activeTab === "addresses" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <span>Customer Address Book & Delivery Locations</span>
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Manage saved service addresses and recipient contacts for {customer.name}
              </p>
            </div>

            {/* SINGLE ADD NEW ADDRESS BUTTON WITH EXPLICIT PADDING */}
            <button
              type="button"
              onClick={handleOpenAddAddressDrawer}
              className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-lux transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Delivery Address</span>
            </button>
          </div>

          {/* Saved Address Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(customerAddressesMap[customer.id] || []).map((addr) => (
              <div
                key={addr.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3 relative group hover:border-brand-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {addr.label}
                    </span>
                    {addr.isPrimary && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                        Primary Address
                      </span>
                    )}
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    {addr.type}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-500" />
                    <span>Recipient: <strong>{addr.recipientName || customer.name}</strong> ({addr.recipientPhone || customer.phone})</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 font-semibold flex items-start gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{addr.address}</span>
                  </p>
                </div>

                {/* EDIT & DELETE ACTION BUTTONS */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditAddressDrawer(addr)}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Address</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all cursor-pointer border border-rose-200 dark:border-rose-900"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 5: APPLIANCES & PROPERTY ASSETS (ALL CARDS VIEW - NO SUB-TABS) ─── */}
      {activeTab === "appliances" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-purple-300 font-extrabold text-xs uppercase tracking-wider">
                <Wind className="w-4 h-4 text-cyan-400" /> Registered Home Assets & Specifications
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Customer Appliances & BHK Property Specs
              </h3>
              <p className="text-xs text-slate-300 max-w-xl font-medium">
                Complete overview of installed Air Conditioners (Split, Window, Cassette ACs, Ton & Room location), Property Cleaning BHK Breakdown (Bedrooms, Living/Dining, Bathrooms), and Home Appliances.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAddACModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add AC Unit</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditPropertySpecModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit BHK Specs</span>
              </button>
            </div>
          </div>

          {/* CARD SECTION 1: AIR CONDITIONERS (AC UNITS) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Installed Air Conditioners (AC Units)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Click any AC card to view complete specifications, ton capacity, room location & service logs.
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800 shrink-0">
                {(customerACUnitsMap[customer.id] || []).length} Registered AC Units
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs pt-1">
              {(customerACUnitsMap[customer.id] || []).map((ac) => (
                <div
                  key={ac.id}
                  onClick={() => setSelectedACDetail(ac)}
                  className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-cyan-500/80 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all cursor-pointer group space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                        <Wind className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-cyan-700 dark:text-cyan-300 bg-cyan-100/70 dark:bg-cyan-950 px-2 py-0.5 rounded-md border border-cyan-200 dark:border-cyan-800">
                          {ac.type}
                        </span>
                        <h4 className="font-black text-slate-900 dark:text-white text-base leading-snug mt-1">
                          {ac.brand} {ac.capacityTon}
                        </h4>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                      ac.status === "Working Great"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                        : ac.status === "Needs Servicing"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200"
                        : "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200"
                    }`}>
                      {ac.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs border-t border-b border-slate-200/70 dark:border-slate-800/80 py-3">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Room Location:</span>
                      <strong className="font-extrabold text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                        📍 {ac.roomLocation}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Star Rating / Gas:</span>
                      <strong className="font-bold text-slate-800 dark:text-slate-200">
                        {ac.starRating} • {ac.gasType || "R32 Refrigerant"}
                      </strong>
                    </div>

                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Last Foam-Jet Service:</span>
                      <strong className="font-bold text-slate-800 dark:text-slate-200">
                        {ac.lastServiceDate}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] font-extrabold text-cyan-600 dark:text-cyan-400 group-hover:underline flex items-center gap-1">
                      <span>View Specs & Service Log</span> →
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      S/N: {ac.serialNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD SECTION 2: PROPERTY BHK CLEANING SPECS */}
          {(() => {
            const spec = customerPropertySpecsMap[customer.id] || {
              propertyType: "3 BHK Independent Flat",
              carpetAreaSqFt: 1650,
              bedroomsCount: 3,
              livingDiningRoomsCount: 2,
              bathroomsCount: 3,
              kitchenType: "Modular Kitchen with Chimney",
              balconiesCount: 2,
              sofaSeatsCount: 7,
              mattressCount: 3,
              curtainsCount: 8,
            };

            return (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                        Property Cleaning BHK Breakdown & Room Specs
                      </h4>
                      <p className="text-xs text-slate-500">
                        Room configuration used to calculate deep cleaning package rates & technician headcount.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditPropertySpecModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit BHK Breakdown
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-300">Property Configuration</span>
                    <p className="text-base font-black text-slate-900 dark:text-white">{spec.propertyType}</p>
                    <span className="text-[10px] text-slate-500 font-bold block">{spec.carpetAreaSqFt} Sq. Ft. Carpet Area</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-300">Bedrooms Count</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{spec.bedroomsCount} Bedrooms</p>
                    <span className="text-[10px] text-slate-500 font-bold block">Master, Guest & Kids Rooms</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300">Living & Dining Areas</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{spec.livingDiningRoomsCount} Rooms / Halls</p>
                    <span className="text-[10px] text-slate-500 font-bold block">1 Living Hall + 1 Dining Area</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300">Bathrooms Count</span>
                    <p className="text-xl font-black text-slate-900 dark:text-white">{spec.bathroomsCount} Bathrooms</p>
                    <span className="text-[10px] text-slate-500 font-bold block">Hydro-Pressure Cleaning Specs</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Kitchen Type & Setup</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{spec.kitchenType}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Balconies & Open Space</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{spec.balconiesCount} Covered Balconies</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Upholstery & Fabrics</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{spec.sofaSeatsCount}-Seater Sofa • {spec.mattressCount} Mattresses • {spec.curtainsCount} Curtains</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* CARD SECTION 3: OTHER HOME & KITCHEN APPLIANCES */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Other Kitchen & Home Appliances
                  </h4>
                  <p className="text-xs text-slate-500">
                    Washing Machines, Refrigerators, RO Water Purifiers & Water Heaters.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {(customerOtherAppliancesMap[customer.id] || []).map((app) => (
                <div key={app.id} className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                      {app.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      {app.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">{app.brand}</h4>
                    <p className="text-slate-500 font-medium text-[11px] mt-0.5">{app.modelSpec}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
                    <span>Location: <strong>{app.location}</strong></span>
                    <span>Last Serviced: <strong>{app.lastServiced}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── SLIDE-OVER PROFILE EDIT DRAWER ─── */}
      {isEditProfileDrawerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-600 via-brand-700 to-purple-800 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-xs">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-lg tracking-tight">Edit Customer Profile</h3>
                    <p className="text-xs text-brand-100 font-medium">Update primary specifications for ID #{customer.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditProfileDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Mobile *</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Alternate Phone</label>
                    <input
                      type="tel"
                      value={editAlternatePhone}
                      onChange={(e) => setEditAlternatePhone(e.target.value)}
                      className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CustomSelect
                    label="Varanasi Locality *"
                    value={editLocality}
                    onChange={(val) => {
                      const foundLoc = varanasiLocalities.find((l) => l.name === val);
                      setEditLocality(val);
                      if (foundLoc) setEditPincode(foundLoc.pincode);
                    }}
                    options={varanasiLocalities.map((loc) => ({
                      value: loc.name,
                      label: `${loc.name} (${loc.pincode})`,
                    }))}
                    placeholder="Select Locality..."
                  />

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pincode *</label>
                    <input
                      type="text"
                      value={editPincode}
                      onChange={(e) => setEditPincode(e.target.value)}
                      className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Street Address *</label>
                  <textarea
                    rows={3}
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileDrawerOpen(false)}
                    className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold shadow-lux cursor-pointer transition-colors"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* ─── SLIDE-OVER ADDRESS FORM DRAWER (UNIFIED FOR ADD & EDIT ADDRESS) ─── */}
      {isAddressDrawerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-600 via-brand-700 to-amber-600 text-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-lg tracking-tight">
                      {editingAddrId ? "Edit Delivery Address" : "Add New Delivery Address"}
                    </h3>
                    <p className="text-xs text-brand-100 font-medium">
                      {editingAddrId ? "Update saved location & recipient details" : `Add new address to ${customer.name}'s address book`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddressDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddressForm} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* SECTION 1: RECIPIENT & LABEL */}
                <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-4">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-extrabold text-sm border-b border-amber-200 dark:border-amber-800 pb-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>1. Recipient & Relationship Label</span>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Address Title Label *
                    </label>
                    <input
                      type="text"
                      value={addrFormLabel}
                      onChange={(e) => setAddrFormLabel(e.target.value)}
                      placeholder="e.g. Home (Primary Residence), Commercial Office, Parents Flat"
                      className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-amber-500 transition-all"
                      required
                    />
                  </div>

                  <CustomSelect
                    label="Recipient Relationship *"
                    value={addrFormType}
                    onChange={(val) => setAddrFormType(val as any)}
                    options={[
                      { value: "Self", label: "Self (Customer Primary)" },
                      { value: "Family Member", label: "Family Member" },
                      { value: "Friend / Neighbor", label: "Friend / Neighbor" },
                      { value: "Office / Work", label: "Office / Work" },
                      { value: "Other", label: "Other" },
                    ]}
                    placeholder="Select Relationship..."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Recipient Contact Name *
                      </label>
                      <input
                        type="text"
                        value={addrFormRecipientName}
                        onChange={(e) => setAddrFormRecipientName(e.target.value)}
                        placeholder="Rajesh Agrawal"
                        className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-amber-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Recipient Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        value={addrFormRecipientPhone}
                        onChange={(e) => setAddrFormRecipientPhone(e.target.value)}
                        placeholder="+91 98390 12345"
                        className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:border-amber-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: LOCALITY & STREET ADDRESS */}
                <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-extrabold text-sm border-b border-emerald-200 dark:border-emerald-800 pb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>2. Varanasi Locality & Street Address</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CustomSelect
                      label="Varanasi Service Zone *"
                      value={addrFormLocality}
                      onChange={(val) => {
                        const foundLoc = varanasiLocalities.find((l) => l.name === val);
                        setAddrFormLocality(val);
                        if (foundLoc) setAddrFormPincode(foundLoc.pincode);
                      }}
                      options={varanasiLocalities.map((loc) => ({
                        value: loc.name,
                        label: `${loc.name} (${loc.pincode})`,
                      }))}
                      placeholder="Select Locality..."
                    />

                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={addrFormPincode}
                        onChange={(e) => setAddrFormPincode(e.target.value)}
                        className="w-full h-[42px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none text-xs focus:border-emerald-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Full House No., Building & Street Address *
                    </label>
                    <textarea
                      rows={3}
                      value={addrFormAddress}
                      onChange={(e) => setAddrFormAddress(e.target.value)}
                      placeholder="House No., Building Name, Street Road, Landmark, Varanasi"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-xs"
                      required
                    />
                  </div>
                </div>

                {/* STICKY BOTTOM ACTION BAR */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 sticky bottom-0 bg-white dark:bg-slate-900 py-3">
                  <button
                    type="button"
                    onClick={() => setIsAddressDrawerOpen(false)}
                    className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold shadow-lux cursor-pointer transition-colors flex items-center justify-center gap-2 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingAddrId ? "Save Address Changes" : "Save Delivery Address"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* ─── DETAILED AC SPECIFICATIONS MODAL ─── */}
      {selectedACDetail && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center shrink-0">
                    <Wind className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded-md border border-cyan-200">
                      {selectedACDetail.type}
                    </span>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg leading-snug mt-0.5">
                      {selectedACDetail.brand} {selectedACDetail.capacityTon}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedACDetail(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-bold text-slate-500">AC Type:</span>
                    <span className="font-extrabold text-cyan-600 dark:text-cyan-400 text-sm">{selectedACDetail.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-bold text-slate-500">Brand & Tonnage:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedACDetail.brand} ({selectedACDetail.capacityTon} • {selectedACDetail.starRating})</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-bold text-slate-500">Room Location:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white bg-white dark:bg-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">📍 {selectedACDetail.roomLocation}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-bold text-slate-500">Gas & Refrigerant:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedACDetail.gasType || "R32 Eco Gas"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-bold text-slate-500">Serial Number:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{selectedACDetail.serialNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                    <span className="font-bold text-slate-500">Last Foam-Jet Serviced:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedACDetail.lastServiceDate}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-bold text-slate-500">Next Service Due Date:</span>
                    <span className="font-extrabold text-purple-600 dark:text-purple-400">{selectedACDetail.nextDueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    const currentACs = customerACUnitsMap[customer.id] || [];
                    setCustomerACUnitsMap({
                      ...customerACUnitsMap,
                      [customer.id]: currentACs.filter((a) => a.id !== selectedACDetail.id),
                    });
                    setSelectedACDetail(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold cursor-pointer"
                >
                  Delete AC Unit
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedACDetail(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ─── ADD AC MODAL ─── */}
      {isAddACModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Add Customer AC Unit</h3>
                    <p className="text-xs text-slate-400">Register installed AC unit type, brand, ton & room location</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsAddACModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const currentACs = customerACUnitsMap[customer.id] || [];
                const newAC: ACUnit = {
                  id: `ac-${Date.now()}`,
                  type: newACType,
                  brand: newACBrand || "Daikin",
                  capacityTon: newACTon,
                  starRating: newACStar,
                  roomLocation: newACRoom || "Master Bedroom",
                  installationYear: "2024",
                  serialNumber: newACSerial || `S/N-${Math.floor(100000 + Math.random() * 900000)}`,
                  lastServiceDate: "Just Registered",
                  nextDueDate: "6 Months Later",
                  status: newACStatus,
                  gasType: "R32 Eco Refrigerant",
                  foamJetServiced: false,
                };
                setCustomerACUnitsMap({
                  ...customerACUnitsMap,
                  [customer.id]: [newAC, ...currentACs],
                });
                setIsAddACModalOpen(false);
              }} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">AC Type *</label>
                    <select
                      value={newACType}
                      onChange={(e) => setNewACType(e.target.value as ACUnit["type"])}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="Inverter Split AC">Inverter Split AC</option>
                      <option value="Split AC">Split AC</option>
                      <option value="Window AC">Window AC</option>
                      <option value="Cassette AC">Cassette AC</option>
                      <option value="Tower AC">Tower AC</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Brand Name *</label>
                    <input
                      type="text"
                      value={newACBrand}
                      onChange={(e) => setNewACBrand(e.target.value)}
                      placeholder="Daikin, Voltas, LG..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Capacity Tonnage *</label>
                    <select
                      value={newACTon}
                      onChange={(e) => setNewACTon(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="1.0 Ton">1.0 Ton</option>
                      <option value="1.5 Ton">1.5 Ton</option>
                      <option value="2.0 Ton">2.0 Ton</option>
                      <option value="2.5 Ton">2.5 Ton</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Room Location *</label>
                    <input
                      type="text"
                      value={newACRoom}
                      onChange={(e) => setNewACRoom(e.target.value)}
                      placeholder="Master Bedroom, Living Room..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsAddACModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-600 text-white font-extrabold shadow-md">Add AC Unit</button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}

      {/* ─── EDIT BHK PROPERTY SPECS MODAL ─── */}
      {isEditPropertySpecModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Edit BHK Property Layout Specs</h3>
                    <p className="text-xs text-slate-400">Update bedrooms, living/dining rooms, bathrooms & carpet area</p>
                  </div>
                </div>
                <button type="button" onClick={() => setIsEditPropertySpecModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                setCustomerPropertySpecsMap({
                  ...customerPropertySpecsMap,
                  [customer.id]: {
                    propertyType: propertyFormType,
                    carpetAreaSqFt: Number(propertyFormCarpet) || 1200,
                    bedroomsCount: Number(propertyFormBedrooms) || 2,
                    livingDiningRoomsCount: Number(propertyFormLivingDining) || 1,
                    bathroomsCount: Number(propertyFormBathrooms) || 2,
                    kitchenType: propertyFormKitchen,
                    balconiesCount: Number(propertyFormBalconies) || 1,
                    sofaSeatsCount: Number(propertyFormSofa) || 5,
                    mattressCount: Number(propertyFormMattress) || 2,
                    curtainsCount: Number(propertyFormCurtains) || 6,
                  },
                });
                setIsEditPropertySpecModalOpen(false);
              }} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Property Layout Type *</label>
                  <input
                    type="text"
                    value={propertyFormType}
                    onChange={(e) => setPropertyFormType(e.target.value)}
                    placeholder="e.g. 3 BHK Independent Flat"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={propertyFormBedrooms}
                      onChange={(e) => setPropertyFormBedrooms(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Living & Dining</label>
                    <input
                      type="number"
                      value={propertyFormLivingDining}
                      onChange={(e) => setPropertyFormLivingDining(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={propertyFormBathrooms}
                      onChange={(e) => setPropertyFormBathrooms(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Carpet Area (Sq. Ft.)</label>
                    <input
                      type="number"
                      value={propertyFormCarpet}
                      onChange={(e) => setPropertyFormCarpet(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Balconies</label>
                    <input
                      type="number"
                      value={propertyFormBalconies}
                      onChange={(e) => setPropertyFormBalconies(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setIsEditPropertySpecModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-extrabold shadow-md">Save BHK Specs</button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
