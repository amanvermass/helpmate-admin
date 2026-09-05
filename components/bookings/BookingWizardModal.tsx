"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  User,
  MapPin,
  Wrench,
  Calendar,
  Sparkles,
  Tag,
  CreditCard,
  FileText,
  ShieldCheck,
  Plus,
  KeyRound,
  UserCheck,
  Phone,
  Mail,
  Building,
  UserPlus,
  Lock,
  Clock,
  Trash2,
  Users,
  Home,
  Briefcase,
  HeartHandshake,
  HelpCircle,
  ShoppingBag,
  Minus,
  Check,
  Edit2,
  Sliders,
  Filter,
  RotateCcw,
} from "lucide-react";
import {
  Booking,
  varanasiLocalities,
  initialTechnicians,
  initialCoupons,
  CouponItem,
  initialCustomers,
  Customer,
  SelectedServiceItem,
  AddressRecipientType,
} from "@/lib/mockData";
import { Portal } from "@/components/Portal";
import { CustomerSearchPicker } from "@/components/CustomerSearchPicker";
import { CustomSelect } from "@/components/CustomSelect";

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated?: (booking: Booking) => void;
  bookingToEdit?: Booking | null;
  onBookingUpdated?: (updated: Booking) => void;
}

export interface ServicePackageItem {
  id: string;
  title: string;
  price: number;
  duration?: string;
  badge?: string;
  description?: string;
  category?: string;
  actionName?: string;
  typeName?: string;
}

export interface ServiceActionGroup {
  actionName: string;
  description?: string;
  packages: ServicePackageItem[];
}

export interface ServiceTypeGroup {
  typeName: string;
  actions: ServiceActionGroup[];
}

const serviceCatalogData: Record<string, ServiceTypeGroup[]> = {
  "AC Service & Repair": [
    {
      typeName: "Split AC",
      actions: [
        {
          actionName: "Service & Maintenance",
          description: "Regular jet cleaning, chemical wash & seasonal checkup",
          packages: [
            { id: "sp-1", title: "Split AC Foam Jet Servicing", price: 599, duration: "45 mins", badge: "Most Popular", description: "Deep foam jet cleaning of indoor coils & outdoor unit" },
            { id: "sp-2", title: "Split AC Anti-Rust Chemical Wash", price: 899, duration: "60 mins", description: "Chemical jet wash with anti-rust protective coating" },
            { id: "sp-3", title: "Split AC 2x Dual Seasonal Maintenance", price: 1099, duration: "60 mins", description: "Pre-summer & post-monsoon servicing combo" },
          ],
        },
        {
          actionName: "Repair & Gas Refill",
          description: "Gas leak detection, charging, capacitor & PCB fix",
          packages: [
            { id: "sp-4", title: "Split AC Gas Leak Repair & Full Refill (R32/R410a)", price: 1499, duration: "90 mins", badge: "Best Value", description: "Nitrogen testing, leak soldering & complete refrigerant refill" },
            { id: "sp-5", title: "Split AC Capacitor Replacement", price: 499, duration: "30 mins", description: "Genuine brand capacitor replacement with warranty" },
            { id: "sp-6", title: "Split AC PCB Circuit Board Repair", price: 1199, duration: "120 mins", description: "Electronic motherboard diagnostic & micro-soldering fix" },
          ],
        },
        {
          actionName: "Installation & Fitting",
          description: "Wall mounting, copper piping and standard installation",
          packages: [
            { id: "sp-7", title: "Split AC Complete Wall Installation & Piping", price: 1199, duration: "90 mins", description: "Standard bracket mounting, vacuuming & copper pipe connection" },
            { id: "sp-8", title: "Split AC Heavy Angle Bracket Mounting", price: 499, duration: "45 mins", description: "Heavy duty metal wall bracket installation" },
          ],
        },
        {
          actionName: "Uninstallation & Dismantling",
          description: "Safe gas pump-down & wall uninstallation",
          packages: [
            { id: "sp-9", title: "Split AC Safe Dismantling & Uninstallation", price: 599, duration: "45 mins", description: "Gas pump-down & safe uninstallation without refrigerant loss" },
            { id: "sp-10", title: "Split AC Relocation Combo (Uninstall + Install)", price: 1699, duration: "180 mins", description: "Complete uninstallation from old home + reinstallation at new site" },
          ],
        },
        {
          actionName: "Inspection & Diagnosis",
          description: "Diagnostic checkup for noise, cooling issue or water leakage",
          packages: [
            { id: "sp-11", title: "Split AC Comprehensive Inspection & Noise Check", price: 299, duration: "30 mins", description: "Full diagnostic report & estimate before starting work" },
          ],
        },
      ],
    },
    {
      typeName: "Window AC",
      actions: [
        {
          actionName: "Service & Maintenance",
          packages: [
            { id: "wa-1", title: "Window AC Deep Jet Servicing", price: 499, duration: "45 mins", badge: "Popular" },
            { id: "wa-2", title: "Window AC Anti-Bacterial Wash", price: 699, duration: "60 mins" },
          ],
        },
        {
          actionName: "Repair & Gas Refill",
          packages: [
            { id: "wa-3", title: "Window AC Gas Leakage Fix & Charging", price: 1299, duration: "90 mins" },
            { id: "wa-4", title: "Window AC Fan Motor & Blade Repair", price: 599, duration: "45 mins" },
          ],
        },
        {
          actionName: "Installation & Fitting",
          packages: [
            { id: "wa-5", title: "Window AC Wall Fitting & Frame Mounting", price: 799, duration: "60 mins" },
          ],
        },
        {
          actionName: "Uninstallation & Dismantling",
          packages: [
            { id: "wa-6", title: "Window AC Removal & Frame Dismantling", price: 399, duration: "30 mins" },
          ],
        },
      ],
    },
  ],

  "Appliance Repair": [
    {
      typeName: "Washing Machine",
      actions: [
        {
          actionName: "Service & Maintenance",
          packages: [
            { id: "wm-1", title: "Fully Automatic Washing Machine Drum Wash & De-scale", price: 499, duration: "45 mins" },
            { id: "wm-2", title: "Semi-Automatic Washing Machine General Servicing", price: 399, duration: "30 mins" },
          ],
        },
        {
          actionName: "Repair & Fix",
          packages: [
            { id: "wm-3", title: "Washing Machine Motor & Belt Repair", price: 899, duration: "60 mins" },
            { id: "wm-4", title: "Washing Machine Drain Pump & Sensor Replacement", price: 699, duration: "45 mins" },
            { id: "wm-5", title: "Washing Machine PCB Board Repair", price: 1299, duration: "90 mins" },
          ],
        },
        {
          actionName: "Installation & Fitting",
          packages: [
            { id: "wm-6", title: "Washing Machine Tap Adapter & Inlet Pipe Setup", price: 299, duration: "30 mins" },
          ],
        },
        {
          actionName: "Uninstallation & Dismantling",
          packages: [
            { id: "wm-7", title: "Washing Machine Uninstallation & Safe Packing", price: 249, duration: "25 mins" },
          ],
        },
      ],
    },
    {
      typeName: "Refrigerator",
      actions: [
        {
          actionName: "Service & Maintenance",
          packages: [
            { id: "ref-1", title: "Single/Double Door Refrigerator Coil & Condenser Cleaning", price: 399, duration: "30 mins" },
          ],
        },
        {
          actionName: "Repair & Gas Refill",
          packages: [
            { id: "ref-2", title: "Double Door Refrigerator Gas Charging & Leak Repair", price: 1399, duration: "90 mins" },
            { id: "ref-3", title: "Single Door Refrigerator Gas Refill", price: 1099, duration: "60 mins" },
            { id: "ref-4", title: "Refrigerator Compressor Relay & Thermostat Fix", price: 799, duration: "45 mins" },
          ],
        },
      ],
    },
  ],

  "Home Cleaning": [
    {
      typeName: "Full House Cleaning",
      actions: [
        {
          actionName: "Service & Maintenance",
          packages: [
            { id: "hc-1", title: "2BHK Full House Deep Cleaning", price: 2999, duration: "4 Hours", badge: "Popular" },
            { id: "hc-2", title: "3BHK Full House Deep Cleaning", price: 3999, duration: "5 Hours" },
            { id: "hc-3", title: "Villa / Independent House Deep Cleaning", price: 5999, duration: "7 Hours" },
          ],
        },
      ],
    },
  ],

  "Electrician": [
    {
      typeName: "Wiring & Switches",
      actions: [
        {
          actionName: "Service & Maintenance",
          packages: [
            { id: "el-1", title: "Switchboard Inspection & Socket Point Servicing", price: 199, duration: "20 mins" },
          ],
        },
        {
          actionName: "Repair & Fix",
          packages: [
            { id: "el-2", title: "Main Line MCB Tripping & Short Circuit Repair", price: 499, duration: "45 mins" },
            { id: "el-3", title: "Internal Room Re-Wiring Fix", price: 899, duration: "90 mins" },
          ],
        },
        {
          actionName: "Installation & Fitting",
          packages: [
            { id: "el-4", title: "Switchboard & Socket Installation (up to 5 points)", price: 299, duration: "30 mins" },
            { id: "el-5", title: "Modular Switchboard Upgrade & Box Fitting", price: 499, duration: "45 mins" },
          ],
        },
        {
          actionName: "Uninstallation & Dismantling",
          packages: [
            { id: "el-6", title: "Old Switchboard & Concealed Box Dismantling", price: 199, duration: "20 mins" },
          ],
        },
      ],
    },
  ],

  "Plumbing": [
    {
      typeName: "Tap & Mixer",
      actions: [
        {
          actionName: "Repair & Fix",
          packages: [
            { id: "pl-1", title: "Water Tap Leakage Fix & Washer Replace", price: 199, duration: "20 mins" },
            { id: "pl-2", title: "Drainage Pipe Blockage Removal", price: 349, duration: "30 mins" },
          ],
        },
        {
          actionName: "Installation & Fitting",
          packages: [
            { id: "pl-3", title: "Hot & Cold Water Mixer Installation", price: 499, duration: "45 mins" },
            { id: "pl-4", title: "New Brass Tap / Shower Fitting", price: 249, duration: "25 mins" },
          ],
        },
        {
          actionName: "Uninstallation & Dismantling",
          packages: [
            { id: "pl-5", title: "Old Mixer / Tap Removal & Pipe Sealing", price: 149, duration: "20 mins" },
          ],
        },
      ],
    },
  ],
};

export function BookingWizardModal({
  isOpen,
  onClose,
  onBookingCreated,
  bookingToEdit,
  onBookingUpdated,
}: BookingWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1: Customer & OTP States
  const [customerList, setCustomerList] = useState(initialCustomers);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");

  // STEP 2: Address & Location & Recipient Relationship Badges
  const [city, setCity] = useState("Varanasi");
  const [locality, setLocality] = useState("Sigra");
  const [pincode, setPincode] = useState("221002");
  const [address, setAddress] = useState("");
  const [addressRecipientType, setAddressRecipientType] = useState<AddressRecipientType>("Self");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");

  // Selected Saved Address ID (Default: addr-1)
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>("addr-1");

  // Dynamic Saved Addresses list for selected customer
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: "addr-1",
      label: "Home (Primary)",
      type: "Self" as AddressRecipientType,
      recipientName: customerName || "Rajesh Agrawal",
      recipientPhone: customerPhone || "+91 98390 12345",
      locality: locality || "Sigra",
      pincode: pincode || "221002",
      address: address || "D-38/21, Sigra Central Main Road, Varanasi",
    },
    {
      id: "addr-2",
      label: "Office / Shop",
      type: "Office / Work" as AddressRecipientType,
      recipientName: customerName || "Rajesh Agrawal",
      recipientPhone: customerPhone || "+91 98390 12345",
      locality: "Sigra",
      pincode: "221002",
      address: "Shop 14, IP Mall Complex, Sigra, Varanasi",
    },
    {
      id: "addr-3",
      label: "Parents House",
      type: "Family Member" as AddressRecipientType,
      recipientName: "Rajesh Sharma (Father)",
      recipientPhone: "+91 98765 43210",
      locality: "Lanka",
      pincode: "221005",
      address: "B-12/4, Near BHU Gate, Lanka, Varanasi",
    },
    {
      id: "addr-4",
      label: "Friend's Flat",
      type: "Friend / Neighbor" as AddressRecipientType,
      recipientName: "Priya Verma (Friend)",
      recipientPhone: "+91 98123 45678",
      locality: "Godowlia",
      pincode: "221001",
      address: "Flat 202, Dashashwamedh Road, Godowlia, Varanasi",
    },
  ]);

  const [isManagingAddresses, setIsManagingAddresses] = useState(false);
  const [editingAddressObj, setEditingAddressObj] = useState<typeof savedAddresses[0] | null>(null);

  const selectSavedAddress = (item: typeof savedAddresses[0]) => {
    setSelectedSavedAddressId(item.id);
    setLocality(item.locality);
    setPincode(item.pincode);
    setAddress(item.address);
    setAddressRecipientType(item.type);
    if (item.type !== "Self") {
      setRecipientName(item.recipientName);
      setRecipientPhone(item.recipientPhone);
    } else {
      setRecipientName("");
      setRecipientPhone("");
    }
  };

  const handleToggleManageAddresses = () => {
    if (isManagingAddresses) {
      setEditingAddressObj(null); // Automatically close edit form when Done Managing is clicked!
      setIsManagingAddresses(false);
    } else {
      setIsManagingAddresses(true);
    }
  };

  const handleSaveEditAddressItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddressObj) return;

    setSavedAddresses(
      savedAddresses.map((a) => (a.id === editingAddressObj.id ? editingAddressObj : a))
    );

    if (selectedSavedAddressId === editingAddressObj.id) {
      selectSavedAddress(editingAddressObj);
    }
    setEditingAddressObj(null);
    setIsManagingAddresses(false); // On save, hide edit and delete options!
  };

  const handleDeleteSavedAddressItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedAddresses.length <= 1) {
      alert("At least one saved address must remain.");
      return;
    }
    const filtered = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(filtered);
    if (selectedSavedAddressId === id && filtered.length > 0) {
      selectSavedAddress(filtered[0]);
    }
    setIsManagingAddresses(false); // On delete, hide edit and delete options!
  };

  const selectAddNewCustomAddress = () => {
    setSelectedSavedAddressId("new_custom");
    setAddress("");
    setAddressRecipientType("Self");
    setRecipientName("");
    setRecipientPhone("");
  };

  // STEP 3: Services Selection States (Category, Service Type, Action, Searchable Package)
  const [selectedCategory, setSelectedCategory] = useState("AC Service & Repair");
  const [selectedType, setSelectedType] = useState("Split AC");
  const [selectedActionFilter, setSelectedActionFilter] = useState("All Actions");
  const [selectedPackageId, setSelectedPackageId] = useState("sp-1");

  // Cart of selected services
  const [selectedServicesList, setSelectedServicesList] = useState<SelectedServiceItem[]>([
    { id: "sp-1", title: "Split AC Foam Jet Servicing", price: 599, quantity: 1, category: "AC Service & Repair", duration: "45 mins" },
  ]);

  // STEP 4: Schedule States (Quick Cards + Custom Date Calendar + Clock Dial Time Picker)
  const todayDateObj = new Date();
  const defaultIsoDate = todayDateObj.toISOString().split("T")[0];
  const [bookingDate, setBookingDate] = useState(defaultIsoDate);
  const [timeSlot, setTimeSlot] = useState("12:00 PM");
  const [preferredPartnerId, setPreferredPartnerId] = useState("");

  // Date selection states
  const [selectedDateMode, setSelectedDateMode] = useState<"quick" | "custom">("quick");
  const [quickDateIso, setQuickDateIso] = useState<string>(defaultIsoDate);
  const [customDateIso, setCustomDateIso] = useState<string>("2026-09-04");
  const [isCustomCalendarPopoverOpen, setIsCustomCalendarPopoverOpen] = useState(false);
  const [calViewYear, setCalViewYear] = useState(todayDateObj.getFullYear());
  const [calViewMonth, setCalViewMonth] = useState(todayDateObj.getMonth());

  // Time selection states
  const [selectedTimeMode, setSelectedTimeMode] = useState<"standard" | "custom">("standard");
  const [standardTimeSlot, setStandardTimeSlot] = useState("12:00 PM");
  const [customTimeHour, setCustomTimeHour] = useState(9);
  const [customTimeMinute, setCustomTimeMinute] = useState(0);
  const [customTimeAmPm, setCustomTimeAmPm] = useState<"AM" | "PM">("AM");
  const [clockTab, setClockTab] = useState<"hour" | "minute">("hour");
  const [isClockPickerOpen, setIsClockPickerOpen] = useState(false);

  // Refs for Click-Outside Listeners
  const calendarPopoverRef = useRef<HTMLDivElement>(null);
  const clockPickerRef = useRef<HTMLDivElement>(null);

  // Click outside to close Calendar Popover
  useEffect(() => {
    function handleClickOutsideCalendar(event: MouseEvent) {
      if (
        calendarPopoverRef.current &&
        !calendarPopoverRef.current.contains(event.target as Node)
      ) {
        setIsCustomCalendarPopoverOpen(false);
      }
    }
    if (isCustomCalendarPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutsideCalendar);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCalendar);
    };
  }, [isCustomCalendarPopoverOpen]);

  // Click outside to close Clock Picker Popover
  useEffect(() => {
    function handleClickOutsideClock(event: MouseEvent) {
      if (
        clockPickerRef.current &&
        !clockPickerRef.current.contains(event.target as Node)
      ) {
        setIsClockPickerOpen(false);
      }
    }
    if (isClockPickerOpen) {
      document.addEventListener("mousedown", handleClickOutsideClock);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideClock);
    };
  }, [isClockPickerOpen]);

  // STEP 5: Payment & Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "Cash on Service" | "Card" | "Helpmate Wallet" | "Online" | "Partial Payment"
  >("UPI");
  const [customerNotes, setCustomerNotes] = useState("");

  // Pre-populate if editing an existing booking
  React.useEffect(() => {
    if (bookingToEdit) {
      setCustomerName(bookingToEdit.customerName || "");
      setCustomerPhone(bookingToEdit.customerPhone || "");
      setCustomerEmail(bookingToEdit.customerEmail || "");
      setCity(bookingToEdit.city || "Varanasi");
      setLocality(bookingToEdit.locality || "Sigra");
      setPincode(bookingToEdit.pincode || "221002");
      setAddress(bookingToEdit.address || "");
      setAddressRecipientType(bookingToEdit.addressRecipientType || "Self");
      setRecipientName(bookingToEdit.recipientName || "");
      setRecipientPhone(bookingToEdit.recipientPhone || "");
      if (bookingToEdit.servicesList && bookingToEdit.servicesList.length > 0) {
        setSelectedServicesList(bookingToEdit.servicesList);
      } else {
        setSelectedServicesList([
          {
            id: `sp-${Date.now()}`,
            title: bookingToEdit.serviceTitle || "Standard Service",
            price: bookingToEdit.basePrice || 599,
            quantity: 1,
            category: bookingToEdit.category || "General",
          },
        ]);
      }
      if (bookingToEdit.category && serviceCatalogData[bookingToEdit.category]) {
        setSelectedCategory(bookingToEdit.category);
      }
      setBookingDate(bookingToEdit.scheduledDate || bookingToEdit.date || "2026-08-12");
      setTimeSlot(bookingToEdit.scheduledTime || bookingToEdit.timeSlot || "10:00 AM - 11:30 AM");
      setPreferredPartnerId(bookingToEdit.technicianId || "");
      setCustomerNotes(bookingToEdit.notes || "");
      setIsOtpVerified(true);
      setCurrentStep(1);
    }
  }, [bookingToEdit, isOpen]);

  if (!isOpen) return null;

  // Multi-Level Catalog Calculations for Category, Type, Action, Package
  const currentTypes = serviceCatalogData[selectedCategory] || [];
  const currentTypeObj = currentTypes.find((t) => t.typeName === selectedType) || currentTypes[0];
  const availableActions = currentTypeObj ? currentTypeObj.actions : [];

  // Filter packages based on selected Category, Type, and Action
  const availablePackages: ServicePackageItem[] = [];
  if (currentTypeObj) {
    currentTypeObj.actions.forEach((a) => {
      if (selectedActionFilter === "All Actions" || a.actionName === selectedActionFilter) {
        a.packages.forEach((pkg) => {
          availablePackages.push({
            ...pkg,
            category: selectedCategory,
            actionName: a.actionName,
            typeName: currentTypeObj.typeName,
          });
        });
      }
    });
  }

  const selectedPkgObj = availablePackages.find((p) => p.id === selectedPackageId) || availablePackages[0];

  // Calculate Subtotal Base Price from Selected Services
  const servicePrice = selectedServicesList.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const convenienceFee = 49;
  const grossBeforeTax = Math.max(0, servicePrice + convenienceFee - discountAmount);
  const cgst = Math.round(grossBeforeTax * 0.09 * 100) / 100;
  const sgst = Math.round(grossBeforeTax * 0.09 * 100) / 100;
  const grandTotal = Math.round((grossBeforeTax + cgst + sgst) * 100) / 100;

  // Multi-Service Cart Operations
  const handleAddServiceToCart = (pkg?: ServicePackageItem) => {
    const targetPkg = pkg || selectedPkgObj;
    if (!targetPkg) return;
    const existingIndex = selectedServicesList.findIndex((item) => item.id === targetPkg.id);
    if (existingIndex > -1) {
      const updated = [...selectedServicesList];
      updated[existingIndex].quantity += 1;
      setSelectedServicesList(updated);
    } else {
      const uniqueCodeNum = Math.floor(1000 + Math.random() * 9000);
      setSelectedServicesList([
        ...selectedServicesList,
        {
          id: targetPkg.id,
          serviceId: `SRV-${targetPkg.id}-${uniqueCodeNum}`,
          serviceCode: `HM-SRV-${uniqueCodeNum}`,
          title: targetPkg.title,
          price: targetPkg.price,
          quantity: 1,
          category: selectedCategory,
          duration: targetPkg.duration,
        },
      ]);
    }
  };

  const handleUpdateServiceQuantity = (id: string, delta: number) => {
    setSelectedServicesList(
      selectedServicesList
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as SelectedServiceItem[]
    );
  };

  const handleRemoveServiceFromCart = (id: string) => {
    setSelectedServicesList(selectedServicesList.filter((item) => item.id !== id));
  };

  const handleVerifyOtp = () => {
    setOtpError("");
    if (otpInput.trim() === "1234" || otpInput.trim().length === 4) {
      setIsOtpVerified(true);
    } else {
      setOtpError("Invalid OTP. Enter 1234 for instant verification.");
    }
  };

  const handleCompleteBooking = () => {
    const tech = initialTechnicians.find((t) => t.id === preferredPartnerId);
    const combinedServiceTitle =
      selectedServicesList.length > 0
        ? selectedServicesList.map((s) => `${s.title} (x${s.quantity})`).join(", ")
        : (selectedPkgObj?.title || "Standard Service");

    const randomNum = Math.floor(9000 + Math.random() * 999);
    const generatedBookingId = `HM-VAR-${randomNum}`;
    const bookingNum = bookingToEdit ? bookingToEdit.id.replace(/[^0-9]/g, "") : String(randomNum);

    // Ensure all services in list have unique serviceId & serviceCode tied to the booking ID
    const finalServicesList = selectedServicesList.map((item, index) => ({
      ...item,
      serviceId: item.serviceId || `SRV-${item.id}-${index + 1}`,
      serviceCode: item.serviceCode || `HM-SVC-${bookingNum}-${String(index + 1).padStart(2, "0")}`,
    }));

    if (bookingToEdit) {
      const updated: Booking = {
        ...bookingToEdit,
        customerName: customerName || bookingToEdit.customerName,
        customerPhone: customerPhone || bookingToEdit.customerPhone,
        customerEmail: customerEmail || bookingToEdit.customerEmail,
        city,
        locality,
        pincode,
        address: address || bookingToEdit.address,
        addressRecipientType,
        recipientName: addressRecipientType !== "Self" ? recipientName : undefined,
        recipientPhone: addressRecipientType !== "Self" ? recipientPhone : undefined,
        servicesList: finalServicesList,
        serviceTitle: combinedServiceTitle,
        category: selectedCategory,
        basePrice: servicePrice || bookingToEdit.basePrice,
        convenienceFee,
        discountAmount,
        couponCode,
        cgst,
        sgst,
        totalAmount: grandTotal,
        notes: customerNotes,
        status: tech ? (bookingToEdit.status === "Pending" ? "Assigned" : bookingToEdit.status) : bookingToEdit.status,
        technicianName: tech ? tech.name : (preferredPartnerId === "" ? undefined : bookingToEdit.technicianName),
        technicianId: tech ? tech.id : (preferredPartnerId === "" ? undefined : bookingToEdit.technicianId),
        date: bookingDate,
        timeSlot,
        paymentMethod,
      };

      if (onBookingUpdated) {
        onBookingUpdated(updated);
      }
      onClose();
      return;
    }

    const created: Booking = {
      id: generatedBookingId,
      jobId: generatedBookingId,
      customerName: customerName || "Rajesh Kumar Agrawal",
      customerPhone: customerPhone || "+91 98390 12345",
      customerEmail: customerEmail || "rajesh@gmail.com",
      city,
      locality,
      pincode,
      address: address || "D-38/21, Sigra Central, Varanasi",
      addressRecipientType,
      recipientName: addressRecipientType !== "Self" ? recipientName : undefined,
      recipientPhone: addressRecipientType !== "Self" ? recipientPhone : undefined,
      servicesList: finalServicesList,
      serviceTitle: combinedServiceTitle,
      category: selectedCategory,
      basePrice: servicePrice,
      convenienceFee,
      discountAmount,
      couponCode,
      cgst,
      sgst,
      totalAmount: grandTotal,
      invoiceType: "B2C",
      commissionAmount: Math.round(servicePrice * 0.25),
      partnerEarnings: Math.round(servicePrice * 0.75),
      notes: customerNotes,
      status: preferredPartnerId ? "Assigned" : "Pending",
      technicianName: tech ? tech.name : undefined,
      technicianId: tech ? tech.id : undefined,
      date: bookingDate,
      timeSlot,
      paymentMethod,
      createdAt: "Just Now",
    };

    if (onBookingCreated) {
      onBookingCreated(created);
    }
    onClose();
  };

  const steps = [
    { num: 1, label: "1. Customer & OTP" },
    { num: 2, label: "2. Address Selection" },
    { num: 3, label: "3. Select Services" },
    { num: 4, label: "4. Schedule & Partner" },
    { num: 5, label: "5. Payment & Review" },
  ];

  const recipientTypeOptions: { type: AddressRecipientType; label: string; icon: React.ElementType; color: string }[] = [
    { type: "Self", label: "Myself / Home", icon: Home, color: "border-brand-500 bg-brand-50/60 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300" },
    { type: "Family Member", label: "Family Member", icon: Users, color: "border-purple-500 bg-purple-50/60 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300" },
    { type: "Friend / Neighbor", label: "Friend / Neighbor", icon: HeartHandshake, color: "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300" },
    { type: "Office / Work", label: "Office / Work", icon: Briefcase, color: "border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200" },
    { type: "Other", label: "Other Person", icon: HelpCircle, color: "border-amber-500 bg-amber-50/60 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300" },
  ];

  const isCustomNewAddressMode = selectedSavedAddressId === "new_custom";
  const activeSavedAddressObj = savedAddresses.find((a) => a.id === selectedSavedAddressId);

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
        <div className="absolute inset-0" onClick={onClose} />

        <div className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-4xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 outline-none">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
            <div>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                Helpmate Booking Wizard
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {bookingToEdit ? `Edit Booking ${bookingToEdit.id}` : "Create New Service Booking"}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Navigation */}
          <div className="px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 overflow-x-auto flex items-center gap-1.5 sm:gap-2 text-xs select-none shrink-0 no-scrollbar">
            {steps.map((st) => {
              const isDone = st.num < currentStep;
              const isCurrent = st.num === currentStep;

              return (
                <div key={st.num} className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(st.num)}
                    className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all text-xs whitespace-nowrap ${isCurrent
                        ? "bg-brand-600 text-white shadow-md font-black"
                        : isDone
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-200/70 dark:bg-slate-800 text-slate-500"
                      }`}
                  >
                    <span>{st.label}</span>
                  </button>
                  {st.num < steps.length && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Body Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* STEP 1: CUSTOMER & OTP */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base">
                    <User className="w-5 h-5 text-brand-600" />
                    <span>Step 1: Select & Verify Customer</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <CustomerSearchPicker
                      label="Select Customer"
                      customers={customerList}
                      selectedCustomer={
                        customerList.find((c) => c.name === customerName && c.phone === customerPhone) ||
                        (customerName
                          ? {
                              id: "cust-sel",
                              name: customerName,
                              phone: customerPhone,
                              email: customerEmail,
                              locality: locality,
                              pincode: pincode,
                              address: address,
                              tier: "Standard",
                              totalSpend: 0,
                              totalBookings: 0,
                              lastBookingDate: "Today",
                              joinedDate: "Today",
                            }
                          : null)
                      }
                      onSelectCustomer={(cust, isNewCustomer) => {
                        if (cust) {
                          setCustomerName(cust.name);
                          setCustomerPhone(cust.phone);
                          setCustomerEmail(cust.email);
                          if (cust.locality) setLocality(cust.locality);
                          if (cust.pincode) setPincode(cust.pincode);
                          if (cust.address) setAddress(cust.address);
                          if (isNewCustomer) {
                            setCustomerList((prev) => [cust, ...prev]);
                          }
                        } else {
                          setCustomerName("");
                          setCustomerPhone("");
                          setCustomerEmail("");
                        }
                      }}
                    />
                  </div>


                  {customerPhone && (
                    <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900 dark:text-purple-300 text-xs">SMS OTP Phone Verification</span>
                        {isOtpVerified && <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">VERIFIED ✓</span>}
                      </div>

                      {!isOtpVerified ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            maxLength={4}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            placeholder="1234"
                            className="w-28 text-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white font-mono font-bold text-xs outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                          >
                            Verify OTP (Code: 1234)
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                          ✓ Customer Mobile Number Verified via OTP.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS SELECTION — CONDITIONAL FORM VISIBILITY */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base">
                    <MapPin className="w-5 h-5 text-brand-600" />
                    <span>Step 2: Service Location & Address Selection</span>
                  </div>
                </div>

                {/* SAVED ADDRESSES LIST FOR SELECTED CUSTOMER */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-900 dark:text-white text-xs block">
                      Saved Addresses for {customerName || "Customer"}
                    </label>
                    <button
                      type="button"
                      onClick={handleToggleManageAddresses}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isManagingAddresses
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 hover:bg-purple-100"
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{isManagingAddresses ? "Done Managing" : "⚙️ Manage Addresses"}</span>
                    </button>
                  </div>

                  {/* 2-COLUMN GRID OF SAVED ADDRESSES & INLINE EDIT FORM AFTER THE ROW */}
                  {(() => {
                    // Group addresses into pairs of 2 for grid rows
                    const rows: (typeof savedAddresses)[] = [];
                    for (let i = 0; i < savedAddresses.length; i += 2) {
                      rows.push(savedAddresses.slice(i, i + 2));
                    }

                    return (
                      <div className="space-y-3">
                        {rows.map((rowItems, rowIndex) => {
                          const hasEditingItem = rowItems.some((item) => item.id === editingAddressObj?.id);

                          return (
                            <div key={`row-${rowIndex}`} className="space-y-3">
                              {/* ROW LINE OF 2 ADDRESS CARDS */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {rowItems.map((item) => {
                                  const isSelected = selectedSavedAddressId === item.id;
                                  const isEditingThisCard = editingAddressObj?.id === item.id;

                                  return (
                                    <div
                                      key={item.id}
                                      onClick={() => selectSavedAddress(item)}
                                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative group ${
                                        isEditingThisCard
                                          ? "border-purple-600 bg-purple-50/90 dark:bg-purple-950/90 ring-2 ring-purple-600 shadow-md"
                                          : isSelected
                                          ? "border-brand-600 bg-brand-50/80 dark:bg-brand-950/80 shadow-sm ring-1 ring-brand-600"
                                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                          {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                                          {item.label}
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                                            {item.type}
                                          </span>
                                          {isManagingAddresses && (
                                            <>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedSavedAddressId(item.id);
                                                  setEditingAddressObj({ ...item });
                                                }}
                                                title="Edit Saved Address"
                                                className="p-1 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
                                              >
                                                <Edit2 className="w-3 h-3" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => handleDeleteSavedAddressItem(item.id, e)}
                                                title="Delete Old Address"
                                                className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {item.address}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* IF AN ADDRESS IN THIS ROW IS BEING EDITED: RENDER EDIT FORM DIRECTLY AFTER THIS ROW LINE */}
                              {hasEditingItem && editingAddressObj && (
                                <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-500/90 space-y-5 my-3 shadow-xl animate-in fade-in duration-200">
                                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                                    <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-extrabold text-sm">
                                      <Edit2 className="w-4 h-4 text-purple-600" />
                                      <span>Editing Saved Address: <strong>{editingAddressObj.label}</strong></span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setEditingAddressObj(null)}
                                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Address Label (e.g. Home, Office)</label>
                                      <input
                                        type="text"
                                        value={editingAddressObj.label}
                                        onChange={(e) => setEditingAddressObj({ ...editingAddressObj, label: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-purple-500"
                                        required
                                      />
                                    </div>

                                    <CustomSelect
                                      label="Varanasi Service Locality *"
                                      value={editingAddressObj.locality}
                                      onChange={(val) => {
                                        const foundLoc = varanasiLocalities.find((l) => l.name === val);
                                        setEditingAddressObj({
                                          ...editingAddressObj,
                                          locality: val,
                                          pincode: foundLoc ? foundLoc.pincode : editingAddressObj.pincode,
                                        });
                                      }}
                                      options={varanasiLocalities.map((loc) => ({
                                        value: loc.name,
                                        label: `${loc.name} (${loc.pincode})`,
                                      }))}
                                      placeholder="Select Locality..."
                                    />
                                  </div>

                                  {/* RECIPIENT RELATIONSHIP BADGE SELECTOR */}
                                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                                    <label className="font-extrabold text-slate-900 dark:text-white text-xs block flex items-center justify-between">
                                      <span>Recipient Relationship Badge</span>
                                      <span className="text-[10px] text-purple-600 font-bold uppercase">Recipient Badge</span>
                                    </label>

                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                      {recipientTypeOptions.map((opt) => {
                                        const Icon = opt.icon;
                                        const isSelectedBadge = editingAddressObj.type === opt.type;
                                        return (
                                          <button
                                            key={opt.type}
                                            type="button"
                                            onClick={() => setEditingAddressObj({ ...editingAddressObj, type: opt.type })}
                                            className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                                              isSelectedBadge
                                                ? opt.color + " shadow-xs ring-1"
                                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300"
                                            }`}
                                          >
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span className="text-[11px] leading-tight">{opt.label}</span>
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {editingAddressObj.type !== "Self" && (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <div>
                                          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Recipient Person Name *</label>
                                          <input
                                            type="text"
                                            value={editingAddressObj.recipientName || ""}
                                            onChange={(e) => setEditingAddressObj({ ...editingAddressObj, recipientName: e.target.value })}
                                            placeholder="e.g. Rajesh Sharma (Father)"
                                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-purple-500"
                                          />
                                        </div>

                                        <div>
                                          <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Recipient Contact Phone Number *</label>
                                          <input
                                            type="tel"
                                            value={editingAddressObj.recipientPhone || ""}
                                            onChange={(e) => setEditingAddressObj({ ...editingAddressObj, recipientPhone: e.target.value })}
                                            placeholder="+91 98765 43210"
                                            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:border-purple-500"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                                      <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full h-[42px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none text-xs"
                                      />
                                    </div>

                                    <div>
                                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pincode</label>
                                      <input
                                        type="text"
                                        value={editingAddressObj.pincode}
                                        onChange={(e) => setEditingAddressObj({ ...editingAddressObj, pincode: e.target.value })}
                                        className="w-full h-[42px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-1.5 text-xs">
                                    <label className="font-bold text-slate-700 dark:text-slate-300 block">Full Delivery / Service Address & Landmark *</label>
                                    <textarea
                                      rows={2.5}
                                      value={editingAddressObj.address}
                                      onChange={(e) => setEditingAddressObj({ ...editingAddressObj, address: e.target.value })}
                                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-purple-500"
                                      required
                                    />
                                  </div>

                                  <div className="flex gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                                    <button
                                      type="button"
                                      onClick={() => setEditingAddressObj(null)}
                                      className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleSaveEditAddressItem}
                                      className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold text-xs shadow-lux flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>Save Address Changes</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={selectAddNewCustomAddress}
                          className={`w-full p-3.5 rounded-2xl border-2 border-dashed text-left cursor-pointer transition-all flex items-center justify-center gap-2 ${
                            isCustomNewAddressMode
                              ? "border-brand-600 bg-brand-50/80 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-bold ring-1 ring-brand-600"
                              : "border-purple-300 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 hover:border-purple-500"
                          }`}
                        >
                          <Plus className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold">+ Add New Custom Address</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {/* IF SAVED ADDRESS IS SELECTED & NOT EDITING: SHOW COMPACT SUMMARY CARD */}

                {/* IF SAVED ADDRESS IS SELECTED & NOT EDITING: SHOW COMPACT SUMMARY CARD */}
                {!isCustomNewAddressMode && activeSavedAddressObj && !editingAddressObj && (
                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-500/80 space-y-2 text-xs animate-in fade-in-50 duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Selected Saved Address: <strong>{activeSavedAddressObj.label}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={selectAddNewCustomAddress}
                        className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit / Enter Custom Address
                      </button>
                    </div>

                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {activeSavedAddressObj.address}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-1">
                      <span>Locality: <strong>{locality} ({pincode})</strong></span>
                      <span>•</span>
                      <span>Recipient: <strong>{addressRecipientType}</strong> {recipientName && `(${recipientName})`}</span>
                    </div>
                  </div>
                )}

                {/* ONLY SHOW FULL ADDRESS FORM & RECIPIENT BADGES WHEN "+ Add New Custom Address" IS ACTIVE */}
                {isCustomNewAddressMode && (
                  <div className="space-y-4 pt-2 border-t border-purple-200 dark:border-purple-800 animate-in fade-in-50 duration-200">
                    
                    {/* RECIPIENT RELATIONSHIP BADGE SELECTOR */}
                    <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-3">
                      <label className="font-extrabold text-purple-900 dark:text-purple-300 text-xs block flex items-center justify-between">
                        <span>Who is this new address & booking for?</span>
                        <span className="text-[10px] text-purple-600 font-bold uppercase">Recipient Relationship Badge</span>
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {recipientTypeOptions.map((opt) => {
                          const Icon = opt.icon;
                          const isSelected = addressRecipientType === opt.type;
                          return (
                            <button
                              key={opt.type}
                              type="button"
                              onClick={() => setAddressRecipientType(opt.type)}
                              className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                                isSelected
                                  ? opt.color + " shadow-sm ring-1"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-purple-300"
                              }`}
                            >
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="text-[11px] leading-tight">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* If Recipient is Family Member / Friend / Other: Input Recipient Contact Details */}
                      {addressRecipientType !== "Self" && (
                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 space-y-3 mt-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-purple-900 dark:text-purple-300">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span>Recipient Contact Details ({addressRecipientType})</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                Recipient Name *
                              </label>
                              <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                placeholder="e.g. Rajesh Sharma (Father)"
                                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                Recipient Contact Phone Number *
                              </label>
                              <input
                                type="tel"
                                value={recipientPhone}
                                onChange={(e) => setRecipientPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full h-[42px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none text-xs"
                        />
                      </div>

                      <CustomSelect
                        label="Varanasi Service Locality *"
                        value={locality}
                        onChange={(val) => {
                          setLocality(val);
                          const selectedLocObj = varanasiLocalities.find((loc) => loc.name === val);
                          if (selectedLocObj) {
                            setPincode(selectedLocObj.pincode);
                          }
                        }}
                        options={varanasiLocalities.map((loc) => ({
                          value: loc.name,
                          label: `${loc.name} (${loc.pincode}) — ${loc.status}`,
                        }))}
                        placeholder="Select Service Locality..."
                      />

                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pincode</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full h-[42px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-semibold outline-none text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-700 dark:text-slate-300 block">
                        Full Delivery / Service Address & Landmark *
                      </label>
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter House / Flat No., Street Name, Colony & Landmark ..."
                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: SERVICES SELECTION — 4 CASCADING DROPDOWNS (CATEGORY -> SERVICE TYPE -> SERVICE ACTION -> SEARCHABLE PACKAGE) */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base">
                    <Wrench className="w-5 h-5 text-brand-600" />
                    <span>Step 3: Select Services</span>
                  </div>
                  <span className="text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-300">
                    {selectedServicesList.length} Selected
                  </span>
                </div>

                {/* CASCADING DROPDOWN FILTER CARD */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* 1. Service Category */}
                    <CustomSelect
                      label="1. Service Category *"
                      value={selectedCategory}
                      onChange={(cat) => {
                        setSelectedCategory(cat);
                        const newTypes = serviceCatalogData[cat] || [];
                        const firstType = newTypes[0]?.typeName || "";
                        setSelectedType(firstType);
                        setSelectedActionFilter("All Actions");
                        const firstPkg = newTypes[0]?.actions[0]?.packages[0];
                        if (firstPkg) setSelectedPackageId(firstPkg.id);
                      }}
                      options={Object.keys(serviceCatalogData).map((cat) => ({
                        value: cat,
                        label: cat,
                      }))}
                      placeholder="Select Category..."
                    />

                    {/* 2. Service Type */}
                    <CustomSelect
                      label="2. Service Type *"
                      value={selectedType}
                      onChange={(tp) => {
                        setSelectedType(tp);
                        setSelectedActionFilter("All Actions");
                        const foundType = currentTypes.find((t) => t.typeName === tp);
                        const firstPkg = foundType?.actions[0]?.packages[0];
                        if (firstPkg) setSelectedPackageId(firstPkg.id);
                      }}
                      options={currentTypes.map((t) => ({
                        value: t.typeName,
                        label: t.typeName,
                      }))}
                      placeholder="Select Service Type..."
                    />

                    {/* 3. Service Action (Service, Repair, Installation, Uninstallation, Inspection) */}
                    <CustomSelect
                      label="3. Service Action *"
                      value={selectedActionFilter}
                      onChange={(act) => {
                        setSelectedActionFilter(act);
                        if (act !== "All Actions") {
                          const foundAction = availableActions.find((a) => a.actionName === act);
                          if (foundAction?.packages[0]) {
                            setSelectedPackageId(foundAction.packages[0].id);
                          }
                        }
                      }}
                      options={[
                        { value: "All Actions", label: "All Actions (Servicing, Repair, Install)" },
                        ...availableActions.map((a) => ({
                          value: a.actionName,
                          label: a.actionName,
                        })),
                      ]}
                      placeholder="Select Action..."
                    />
                  </div>

                  {/* 4. Searchable Service Package + Add Button */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="sm:col-span-9">
                      <CustomSelect
                        label="4. Select Package (Type to Search) *"
                        value={selectedPackageId}
                        onChange={(val) => setSelectedPackageId(val)}
                        options={availablePackages.map((pkg) => ({
                          value: pkg.id,
                          label: `${pkg.title} — ₹${pkg.price.toLocaleString()}${pkg.duration ? ` (${pkg.duration})` : ""} [${pkg.actionName || "Package"}]`,
                        }))}
                        placeholder="Search service package..."
                        searchable={true}
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="button"
                        onClick={() => handleAddServiceToCart()}
                        className="w-full h-[42px] px-4 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900 font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                      >
                        <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Add to Service List
                      </button>
                    </div>
                  </div>

                  {/* Highlighted Details for Currently Selected Package */}
                  {selectedPkgObj && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-xs flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-white truncate">{selectedPkgObj.title}</span>
                          {selectedPkgObj.actionName && (
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                              {selectedPkgObj.actionName}
                            </span>
                          )}
                        </div>
                        {selectedPkgObj.description && <p className="text-[10px] text-slate-500 truncate mt-0.5">{selectedPkgObj.description}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-brand-600 dark:text-brand-400 text-sm">₹{selectedPkgObj.price.toLocaleString()}</span>
                        {selectedPkgObj.duration && <span className="text-[10px] text-slate-400 block">{selectedPkgObj.duration}</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* SELECTED SERVICES BASKET / CART */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-purple-300" />
                      <span className="font-black text-xs uppercase tracking-wider text-purple-200">
                        Selected Services List ({selectedServicesList.reduce((acc, s) => acc + s.quantity, 0)} Items)
                      </span>
                    </div>
                    <span className="font-black text-sm text-emerald-400">
                      Total Base: ₹{servicePrice.toLocaleString()}
                    </span>
                  </div>

                  {selectedServicesList.length === 0 ? (
                    <p className="text-xs text-purple-200 italic">No services added yet. Select a category, type & action above and click "+ Add to Service List".</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedServicesList.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
                          <div className="min-w-0 pr-2">
                            <span className="font-extrabold text-white block truncate">{item.title}</span>
                            <span className="text-[10px] text-purple-200 font-mono">₹{item.price} each {item.category && `• ${item.category}`}</span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg border border-white/20">
                              <button type="button" onClick={() => handleUpdateServiceQuantity(item.id, -1)} className="p-0.5 text-white hover:text-red-300 cursor-pointer"><Minus className="w-3 h-3" /></button>
                              <span className="font-black text-xs px-1.5">{item.quantity}</span>
                              <button type="button" onClick={() => handleUpdateServiceQuantity(item.id, 1)} className="p-0.5 text-white hover:text-emerald-300 cursor-pointer"><Plus className="w-3 h-3" /></button>
                            </div>

                            <span className="font-black text-xs text-emerald-300 w-16 text-right">₹{(item.price * item.quantity).toLocaleString()}</span>

                            <button type="button" onClick={() => handleRemoveServiceFromCart(item.id)} className="p-1 text-white/70 hover:text-red-400 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* STEP 4: SCHEDULE & ASSIGN PARTNER */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Header Title & Top Right Selected Arrival Card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        STEP 4 OF 5 • Fast Technician Dispatch
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-5.5 h-5.5 text-purple-700 dark:text-purple-400" />
                      Schedule Arrival Slot
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      Select your preferred date & time window for expert home service.
                    </p>
                  </div>

                  {/* SELECTED ARRIVAL CARD TOP RIGHT */}
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0 min-w-[210px]">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-0.5">
                      SELECTED ARRIVAL
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono font-black text-slate-900 dark:text-white">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>
                        {selectedDateMode === "custom" ? customDateIso : quickDateIso} @ {selectedTimeMode === "custom" ? `${String(customTimeHour).padStart(2, "0")}:${String(customTimeMinute).padStart(2, "0")} ${customTimeAmPm}` : standardTimeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1. SELECT SERVICE DATE */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                      1. Select Service Date
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">Available Next 7 Days</span>
                  </div>

                  {/* CARDS ROW FOR DATES */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 relative">
                    {/* 5 Quick Date Cards */}
                    {(() => {
                      const today = new Date();
                      return Array.from({ length: 5 }, (_, i) => {
                        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
                        const yr = d.getFullYear();
                        const mo = String(d.getMonth() + 1).padStart(2, "0");
                        const dt = String(d.getDate()).padStart(2, "0");
                        const iso = `${yr}-${mo}-${dt}`;
                        const dayName = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
                        const monthName = d.toLocaleDateString("en-US", { month: "short" });
                        const dayNum = d.getDate();
                        const isSelected = selectedDateMode === "quick" && quickDateIso === iso;

                        return (
                          <button
                            key={iso}
                            type="button"
                            onClick={() => {
                              setSelectedDateMode("quick");
                              setQuickDateIso(iso);
                              setBookingDate(iso);
                              setIsCustomCalendarPopoverOpen(false);
                            }}
                            className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[74px] relative ${
                              isSelected
                                ? "bg-purple-800 text-white border-purple-800 shadow-lg ring-2 ring-purple-500/30 font-extrabold"
                                : "bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-purple-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs z-10">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                            <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? "text-purple-200" : "text-slate-400"}`}>
                              {dayName}
                            </span>
                            <span className="text-lg font-black my-0 leading-tight">{dayNum}</span>
                            <span className={`text-[9px] font-bold ${isSelected ? "text-purple-200" : "text-slate-400"}`}>
                              {monthName} {dayNum}
                            </span>
                          </button>
                        );
                      });
                    })()}

                    {/* CUSTOM DATE CARD (6th card) */}
                    <div className="relative" ref={calendarPopoverRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDateMode("custom");
                          setBookingDate(customDateIso);
                          setIsCustomCalendarPopoverOpen(!isCustomCalendarPopoverOpen);
                        }}
                        className={`w-full p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[74px] relative ${
                          selectedDateMode === "custom"
                            ? "bg-purple-800 text-white border-purple-800 shadow-lg ring-2 ring-purple-500/30 font-extrabold"
                            : "bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-300"
                        }`}
                      >
                        {selectedDateMode === "custom" && (
                          <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <Calendar className={`w-3.5 h-3.5 mb-0.5 ${selectedDateMode === "custom" ? "text-purple-200" : "text-purple-600"}`} />
                        <span className={`text-[9px] font-black uppercase tracking-wider ${selectedDateMode === "custom" ? "text-purple-200" : "text-slate-500"}`}>
                          CUSTOM DATE
                        </span>
                        <span className="text-[11px] font-black font-mono mt-0.5 truncate max-w-[85px]">
                          {customDateIso}
                        </span>
                      </button>

                      {/* CUSTOM CALENDAR POPUP DROPDOWN (ALIGNED TO CUSTOM DATE CARD) */}
                      {isCustomCalendarPopoverOpen && (
                        <div className="absolute right-0 top-full mt-2 z-[9999] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl w-80 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                          {/* Navigation Header */}
                          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (calViewMonth === 0) {
                                  setCalViewMonth(11);
                                  setCalViewYear((y) => y - 1);
                                } else {
                                  setCalViewMonth((m) => m - 1);
                                }
                              }}
                              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="font-black text-xs text-slate-900 dark:text-white">
                              {new Date(calViewYear, calViewMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (calViewMonth === 11) {
                                  setCalViewMonth(0);
                                  setCalViewYear((y) => y + 1);
                                } else {
                                  setCalViewMonth((m) => m + 1);
                                }
                              }}
                              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Day of Week Headers */}
                          <div className="grid grid-cols-7 text-center font-black text-[10px] text-slate-400 uppercase">
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                              <div key={d} className="py-1">{d}</div>
                            ))}
                          </div>

                          {/* Days Grid */}
                          {(() => {
                            const firstDay = new Date(calViewYear, calViewMonth, 1).getDay();
                            const daysInMo = new Date(calViewYear, calViewMonth + 1, 0).getDate();
                            const todayZero = new Date();
                            todayZero.setHours(0, 0, 0, 0);

                            const cells = [];
                            for (let i = 0; i < firstDay; i++) {
                              cells.push(<div key={`b-${i}`} />);
                            }
                            for (let day = 1; day <= daysInMo; day++) {
                              const dObj = new Date(calViewYear, calViewMonth, day);
                              dObj.setHours(0, 0, 0, 0);
                              const isPast = dObj < todayZero;
                              const yr = calViewYear;
                              const mo = String(calViewMonth + 1).padStart(2, "0");
                              const dt = String(day).padStart(2, "0");
                              const iso = `${yr}-${mo}-${dt}`;
                              const isSel = customDateIso === iso;

                              cells.push(
                                <button
                                  key={`d-${day}`}
                                  type="button"
                                  disabled={isPast}
                                  onClick={() => {
                                    setCustomDateIso(iso);
                                    setBookingDate(iso);
                                    setSelectedDateMode("custom");
                                    setIsCustomCalendarPopoverOpen(false);
                                  }}
                                  className={`p-2 rounded-xl text-xs font-black text-center transition-all cursor-pointer ${
                                    isPast
                                      ? "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40"
                                      : isSel
                                      ? "bg-purple-800 text-white shadow-md font-black"
                                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            }
                            return <div className="grid grid-cols-7 gap-1">{cells}</div>;
                          })()}

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="font-mono text-slate-500 font-bold">{customDateIso}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const todayStr = new Date().toISOString().split("T")[0];
                                setCustomDateIso(todayStr);
                                setBookingDate(todayStr);
                                setSelectedDateMode("custom");
                                setIsCustomCalendarPopoverOpen(false);
                              }}
                              className="text-purple-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" /> Reset
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. SELECT ARRIVAL TIME WINDOW */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                      2. Select Arrival Time Window
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">2-Hour Arrival Slot</span>
                  </div>

                  {/* CARDS ROW FOR TIME SLOTS */}
                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5 relative">
                    {/* 6 Standard Time Slots */}
                    {["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"].map((slot) => {
                      const isSelected = selectedTimeMode === "standard" && standardTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTimeMode("standard");
                            setStandardTimeSlot(slot);
                            setTimeSlot(slot);
                            setIsClockPickerOpen(false);
                          }}
                          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[70px] relative ${
                            isSelected
                              ? "bg-purple-800 text-white border-purple-800 shadow-lg ring-2 ring-purple-500/30 font-extrabold"
                              : "bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold hover:border-purple-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs z-10">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                          <span className="text-xs font-black leading-snug">{slot}</span>
                        </button>
                      );
                    })}

                    {/* CUSTOM TIME CARD (7th card) WITH ANALOG CLOCK POPOVER */}
                    <div className="relative" ref={clockPickerRef}>
                      {(() => {
                        const formattedCustomTime = `${String(customTimeHour).padStart(2, "0")}:${String(customTimeMinute).padStart(2, "0")} ${customTimeAmPm}`;
                        const isSelected = selectedTimeMode === "custom";

                        return (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTimeMode("custom");
                                setTimeSlot(formattedCustomTime);
                                setIsClockPickerOpen(!isClockPickerOpen);
                              }}
                              className={`w-full p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[70px] relative ${
                                isSelected
                                  ? "bg-purple-800 text-white border-purple-800 shadow-lg ring-2 ring-purple-500/30 font-extrabold"
                                  : "bg-slate-50/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-300"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs z-10">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                              <Clock className={`w-3.5 h-3.5 mb-0.5 ${isSelected ? "text-purple-200" : "text-purple-600"}`} />
                              <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? "text-purple-200" : "text-slate-500"}`}>
                                CUSTOM TIME
                              </span>
                              <span className="text-[11px] font-black font-mono mt-0.5 truncate max-w-[85px]">
                                {formattedCustomTime}
                              </span>
                            </button>

                            {/* CLOCK PICKER POPOVER (AUTOMATIC 2-STEP HOUR -> MINUTE FLOW WITH AM/PM) */}
                            {isClockPickerOpen && (
                              <div className="absolute right-0 top-full mt-2 z-[9999] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl w-80 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                {/* Header Time Display with Interactive Hour/Minute Pills & AM/PM Toggle */}
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-base font-black font-mono">
                                    <Clock className="w-4 h-4 text-purple-600 mr-0.5" />
                                    <button
                                      type="button"
                                      onClick={() => setClockTab("hour")}
                                      title="Click to edit hour"
                                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                                        clockTab === "hour"
                                          ? "bg-purple-800 text-white shadow-sm ring-2 ring-purple-500/30"
                                          : "bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 hover:bg-purple-200"
                                      }`}
                                    >
                                      {String(customTimeHour).padStart(2, "0")}
                                    </button>
                                    <span className="text-slate-400 font-bold">:</span>
                                    <button
                                      type="button"
                                      onClick={() => setClockTab("minute")}
                                      title="Click to edit minute"
                                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                                        clockTab === "minute"
                                          ? "bg-purple-800 text-white shadow-sm ring-2 ring-purple-500/30"
                                          : "bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 hover:bg-purple-200"
                                      }`}
                                    >
                                      {String(customTimeMinute).padStart(2, "0")}
                                    </button>
                                  </div>

                                  {/* AM / PM Toggle Pill */}
                                  <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-black">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCustomTimeAmPm("AM");
                                        const updated = `${String(customTimeHour).padStart(2, "0")}:${String(customTimeMinute).padStart(2, "0")} AM`;
                                        setTimeSlot(updated);
                                      }}
                                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                                        customTimeAmPm === "AM" ? "bg-purple-800 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"
                                      }`}
                                    >
                                      AM
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCustomTimeAmPm("PM");
                                        const updated = `${String(customTimeHour).padStart(2, "0")}:${String(customTimeMinute).padStart(2, "0")} PM`;
                                        setTimeSlot(updated);
                                      }}
                                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                                        customTimeAmPm === "PM" ? "bg-purple-800 text-white shadow-xs" : "text-slate-600 dark:text-slate-300"
                                      }`}
                                    >
                                      PM
                                    </button>
                                  </div>
                                </div>

                                {/* Active Dial Title Banner */}
                                <div className="text-center font-extrabold text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 py-1.5 rounded-xl border border-purple-100 dark:border-purple-900">
                                  {clockTab === "hour" ? "1. Select Hour (1 — 12)" : "2. Select Minute (:00 — :55)"}
                                </div>

                                {/* CIRCULAR ANALOG CLOCK DIAL */}
                                <div className="flex justify-center py-1">
                                  <div className="relative w-52 h-52 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                    {/* Center dot */}
                                    <div className="w-3 h-3 rounded-full bg-purple-800 z-10" />

                                    {/* Render 12 Dial Nodes */}
                                    {clockTab === "hour"
                                      ? Array.from({ length: 12 }, (_, i) => i + 1).map((hr) => {
                                          const angleDeg = hr * 30 - 90;
                                          const rad = (angleDeg * Math.PI) / 180;
                                          const radius = 78;
                                          const x = 104 + radius * Math.cos(rad) - 16;
                                          const y = 104 + radius * Math.sin(rad) - 16;
                                          const isSelectedHour = customTimeHour === hr;

                                          return (
                                            <button
                                              key={`hr-${hr}`}
                                              type="button"
                                              style={{ left: `${x}px`, top: `${y}px` }}
                                              onClick={() => {
                                                setCustomTimeHour(hr);
                                                const updated = `${String(hr).padStart(2, "0")}:${String(customTimeMinute).padStart(2, "0")} ${customTimeAmPm}`;
                                                setTimeSlot(updated);
                                                setClockTab("minute"); // Automatically switch to minute dial!
                                              }}
                                              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                                                isSelectedHour
                                                  ? "bg-purple-800 text-white shadow-md scale-110 ring-2 ring-purple-500/30"
                                                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-purple-100"
                                              }`}
                                            >
                                              {hr}
                                            </button>
                                          );
                                        })
                                      : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((mn, idx) => {
                                          const angleDeg = idx * 30 - 90;
                                          const rad = (angleDeg * Math.PI) / 180;
                                          const radius = 78;
                                          const x = 104 + radius * Math.cos(rad) - 16;
                                          const y = 104 + radius * Math.sin(rad) - 16;
                                          const isSelectedMin = customTimeMinute === mn;

                                          return (
                                            <button
                                              key={`mn-${mn}`}
                                              type="button"
                                              style={{ left: `${x}px`, top: `${y}px` }}
                                              onClick={() => {
                                                setCustomTimeMinute(mn);
                                                const updated = `${String(customTimeHour).padStart(2, "0")}:${String(mn).padStart(2, "0")} ${customTimeAmPm}`;
                                                setTimeSlot(updated);
                                                setIsClockPickerOpen(false); // Automatically close popover when minute is chosen!
                                              }}
                                              className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                                                isSelectedMin
                                                  ? "bg-purple-800 text-white shadow-md scale-110 ring-2 ring-purple-500/30"
                                                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-purple-100"
                                              }`}
                                            >
                                              :{String(mn).padStart(2, "0")}
                                            </button>
                                          );
                                        })}
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                                  <span className="font-mono text-purple-700 dark:text-purple-300 font-bold">
                                    {String(customTimeHour).padStart(2, "0")}:{String(customTimeMinute).padStart(2, "0")} {customTimeAmPm}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setIsClockPickerOpen(false)}
                                    className="px-4 py-1.5 bg-purple-800 hover:bg-purple-900 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
                                  >
                                    Done
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* 4. TECHNICIAN ASSIGNMENT */}
                <div className="space-y-2 text-xs">
                  <CustomSelect
                    label="Assign Varanasi Technician (Optional)"
                    value={preferredPartnerId}
                    onChange={(val) => setPreferredPartnerId(val)}
                    options={[
                      { value: "", label: `-- Auto-Assign (Next Available Tech in ${locality}) --` },
                      ...initialTechnicians.map((tech) => ({
                        value: tech.id,
                        label: `${tech.name} (${tech.locality}) — ★ ${tech.rating}`,
                      })),
                    ]}
                    placeholder="Choose Technician Partner..."
                  />
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT & FINAL SUMMARY */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  <span>Step 5: Payment Method & Final Summary</span>
                </div>

                {/* Recipient Badge Confirmation */}
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-bold">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Address Recipient Badge: <strong>{addressRecipientType}</strong> {recipientName && `— ${recipientName}`} {recipientPhone && `(${recipientPhone})`}</span>
                  </div>
                  <button type="button" onClick={() => setCurrentStep(2)} className="text-[10px] text-purple-600 font-black hover:underline cursor-pointer">Change</button>
                </div>

                {/* Services Cart List */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <span className="font-black text-slate-900 dark:text-white block">Selected Services ({selectedServicesList.length})</span>
                  <div className="space-y-1.5">
                    {selectedServicesList.map((svc) => (
                      <div key={svc.id} className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-medium">
                        <span>{svc.title} x {svc.quantity}</span>
                        <span className="font-bold font-mono">₹{(svc.price * svc.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Apply Promo Coupon
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. VARANASI100"
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold uppercase outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (couponCode.toUpperCase() === "VARANASI100" || couponCode.toUpperCase() === "HELPMATE100") {
                          setDiscountAmount(100);
                        } else if (couponCode.trim()) {
                          setDiscountAmount(50);
                        }
                      }}
                      className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {discountAmount > 0 && (
                    <p className="text-[11px] text-emerald-600 font-bold">
                      ✓ Coupon Applied! Discount: ₹{discountAmount}
                    </p>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["UPI", "Cash on Service", "Card", "Helpmate Wallet"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left cursor-pointer transition-all ${paymentMethod === method
                            ? "bg-brand-50 text-brand-700 border-brand-500 dark:bg-brand-950 dark:text-brand-300"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final Order Summary */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Services Total ({selectedServicesList.length} items)</span>
                    <span>₹{servicePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Platform Convenience Fee</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-800 pt-2 flex justify-between font-extrabold text-sm text-white">
                    <span>Grand Total (GST Incl.)</span>
                    <span className="text-emerald-400 text-base">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 shrink-0 gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lux flex items-center gap-1 transition-colors cursor-pointer"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteBooking}
                className="px-6 sm:px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lux transition-colors cursor-pointer"
              >
                Confirm & Create Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
