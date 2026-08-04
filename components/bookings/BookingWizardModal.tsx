"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import {
  Booking,
  varanasiLocalities,
  initialTechnicians,
  initialCoupons,
  CouponItem,
  initialCustomers,
  Customer,
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

// Master Multi-Level Service Catalog: Category -> Type -> Action -> Package
export interface ServicePackageItem {
  id: string;
  title: string;
  price: number;
  duration?: string;
  badge?: string;
  description?: string;
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
          description: "Regular cleaning, jet wash & anti-bacterial wash",
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
          actionName: "Installation & Dismantling",
          description: "Wall mounting, copper piping and removal",
          packages: [
            { id: "sp-7", title: "Split AC Complete Wall Installation & Piping", price: 1199, duration: "90 mins", description: "Standard bracket mounting, vacuuming & copper pipe connection" },
            { id: "sp-8", title: "Split AC Safe Dismantling & Uninstallation", price: 599, duration: "45 mins", description: "Gas pump-down & safe uninstallation without refrigerant loss" },
            { id: "sp-9", title: "Split AC Relocation Combo", price: 1699, duration: "180 mins", description: "Complete uninstallation from old home + reinstallation at new site" },
          ],
        },
        {
          actionName: "Inspection & Diagnosis",
          description: "Diagnostic checkup for noise, cooling issue or water leakage",
          packages: [
            { id: "sp-10", title: "Split AC Comprehensive Inspection & Noise Check", price: 299, duration: "30 mins", description: "Full diagnostic report & estimate before starting work" },
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
            { id: "wa-6", title: "Window AC Removal & Frame Dismantling", price: 399, duration: "30 mins" },
          ],
        },
      ],
    },
    {
      typeName: "Cassette / Commercial AC",
      actions: [
        {
          actionName: "Commercial Servicing",
          packages: [
            { id: "ca-1", title: "Cassette AC Heavy Duty Jet Service", price: 999, duration: "60 mins" },
            { id: "ca-2", title: "Tower AC Deep Chemical Wash", price: 1199, duration: "75 mins" },
          ],
        },
        {
          actionName: "Gas Charging & Overhaul",
          packages: [
            { id: "ca-3", title: "Cassette AC Refrigerant Gas Refilling", price: 1999, duration: "120 mins" },
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
          actionName: "General Servicing",
          packages: [
            { id: "wm-1", title: "Fully Automatic Washing Machine Drum Wash & De-scale", price: 499, duration: "45 mins" },
            { id: "wm-2", title: "Semi-Automatic Washing Machine General Servicing", price: 399, duration: "30 mins" },
          ],
        },
        {
          actionName: "Motor & Electronics Repair",
          packages: [
            { id: "wm-3", title: "Washing Machine Motor & Belt Repair", price: 899, duration: "60 mins" },
            { id: "wm-4", title: "Washing Machine Drain Pump & Sensor Replacement", price: 699, duration: "45 mins" },
            { id: "wm-5", title: "Washing Machine PCB Board Repair", price: 1299, duration: "90 mins" },
          ],
        },
      ],
    },
    {
      typeName: "Refrigerator",
      actions: [
        {
          actionName: "Gas Charging & Leak Fix",
          packages: [
            { id: "ref-1", title: "Double Door Refrigerator Gas Charging & Leak Repair", price: 1399, duration: "90 mins" },
            { id: "ref-2", title: "Single Door Refrigerator Gas Refill", price: 1099, duration: "60 mins" },
          ],
        },
        {
          actionName: "Compressor & Thermostat Repair",
          packages: [
            { id: "ref-3", title: "Refrigerator Compressor Relay & Thermostat Fix", price: 799, duration: "45 mins" },
            { id: "ref-4", title: "Refrigerator Door Rubber Gasket Replacement", price: 499, duration: "30 mins" },
          ],
        },
      ],
    },
    {
      typeName: "RO Water Purifier",
      actions: [
        {
          actionName: "Filter & Membrane Replacement",
          packages: [
            { id: "ro-1", title: "RO Full Filter & Sediment Membrane Kit Replacement", price: 799, duration: "45 mins", badge: "Best Seller" },
            { id: "ro-2", title: "RO General Servicing & TDS Water Calibration", price: 299, duration: "30 mins" },
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
          actionName: "Deep Scrub & Sanitization",
          packages: [
            { id: "hc-1", title: "2BHK Full House Deep Cleaning", price: 2999, duration: "4 Hours", badge: "Popular" },
            { id: "hc-2", title: "3BHK Full House Deep Cleaning", price: 3999, duration: "5 Hours" },
            { id: "hc-3", title: "Villa / Independent House Deep Cleaning", price: 5999, duration: "7 Hours" },
          ],
        },
        {
          actionName: "Express Dusting & Mop",
          packages: [
            { id: "hc-4", title: "2BHK Express Floor Scrubbing & Dusting", price: 1499, duration: "2 Hours" },
            { id: "hc-5", title: "3BHK Express Floor Scrubbing & Dusting", price: 1999, duration: "3 Hours" },
          ],
        },
      ],
    },
    {
      typeName: "Sofa & Carpet",
      actions: [
        {
          actionName: "Shampooing & Extraction",
          packages: [
            { id: "sc-1", title: "5-Seater Fabric Sofa Shampooing & Extraction", price: 899, duration: "60 mins" },
            { id: "sc-2", title: "7-Seater Leather Sofa Cleaning & Polish", price: 1299, duration: "90 mins" },
            { id: "sc-3", title: "Living Room Carpet Deep Vacuum & Wash", price: 599, duration: "45 mins" },
          ],
        },
      ],
    },
    {
      typeName: "Kitchen & Bathroom",
      actions: [
        {
          actionName: "Degreasing & Tile Stain Removal",
          packages: [
            { id: "kb-1", title: "Kitchen Degreasing & Chimney Cleaning", price: 999, duration: "90 mins" },
            { id: "kb-2", title: "Bathroom Tile Stain Removal & Sanitization", price: 499, duration: "45 mins" },
            { id: "kb-3", title: "2x Bathroom Deep Sanitization Combo", price: 899, duration: "75 mins" },
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
          actionName: "Switch & Socket Fitting",
          packages: [
            { id: "el-1", title: "Switchboard & Socket Installation (up to 5 points)", price: 299, duration: "30 mins" },
            { id: "el-2", title: "Modular Switchboard Upgrade", price: 499, duration: "45 mins" },
          ],
        },
        {
          actionName: "Main Line & Short Circuit Fix",
          packages: [
            { id: "el-3", title: "Main Line MCB Tripping & Short Circuit Repair", price: 499, duration: "45 mins" },
            { id: "el-4", title: "Complete Room Internal Re-Wiring", price: 999, duration: "120 mins" },
          ],
        },
      ],
    },
    {
      typeName: "Fan & Ceiling Lights",
      actions: [
        {
          actionName: "Repair & Fitting",
          packages: [
            { id: "el-5", title: "Ceiling Fan Winding & Capacitor Replacement", price: 349, duration: "30 mins" },
            { id: "el-6", title: "Chandelier & Ceiling Light Assembly Fitting", price: 599, duration: "60 mins" },
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
          actionName: "Repair & Replacement",
          packages: [
            { id: "pl-1", title: "Bathroom Tap & Wash Basin Leak Fix", price: 249, duration: "30 mins" },
            { id: "pl-2", title: "Wall Mixer & Shower Head Fitting", price: 499, duration: "45 mins" },
          ],
        },
      ],
    },
    {
      typeName: "Drainage & Water Tank",
      actions: [
        {
          actionName: "Unclogging & Cleaning",
          packages: [
            { id: "pl-3", title: "Kitchen Sink & Drain Pipe Drainage Unclogging", price: 399, duration: "45 mins" },
            { id: "pl-4", title: "1000L Overhead Water Tank Mechanized Scrub", price: 799, duration: "60 mins" },
          ],
        },
      ],
    },
  ],

  "Car & Bike Wash": [
    {
      typeName: "Car Detailing",
      actions: [
        {
          actionName: "Washing & Vacuuming",
          packages: [
            { id: "cw-1", title: "Hatchback / Sedan High Pressure Foam Wash & Vacuum", price: 499, duration: "45 mins" },
            { id: "cw-2", title: "SUV Heavy Duty Foam Wash & Interior Vacuum", price: 699, duration: "60 mins" },
          ],
        },
        {
          actionName: "Polishing & Coating",
          packages: [
            { id: "cw-3", title: "Full Body Teflon Coating & Wax Polish", price: 1499, duration: "90 mins" },
            { id: "cw-4", title: "Complete Interior Detailing & Sanitization", price: 1299, duration: "90 mins" },
          ],
        },
      ],
    },
    {
      typeName: "Bike Wash",
      actions: [
        {
          actionName: "Foam Wash & Lube",
          packages: [
            { id: "bw-1", title: "Super Bike High Pressure Foam Wash", price: 199, duration: "20 mins" },
            { id: "bw-2", title: "Bike Teflon Coating & Chain Lube", price: 399, duration: "35 mins" },
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
  const [isTrustedCustomer, setIsTrustedCustomer] = useState(false);
  const [isNewCustomerAdded, setIsNewCustomerAdded] = useState(false);

  // New Customer Inline Add Form States
  const [isAddCustomerFormOpen, setIsAddCustomerFormOpen] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustLocality, setNewCustLocality] = useState("Sigra");
  const [newCustAddress, setNewCustAddress] = useState("");

  // Guarantor Person, Aadhaar & Police Verification States
  const [newCustAadhaarNumber, setNewCustAadhaarNumber] = useState("");
  const [newCustAadhaarDocUrl, setNewCustAadhaarDocUrl] = useState("");
  const [newCustGuarantorName, setNewCustGuarantorName] = useState("");
  const [newCustGuarantorPhone, setNewCustGuarantorPhone] = useState("");
  const [newCustGuarantorAddress, setNewCustGuarantorAddress] = useState("");
  const [newCustGuarantorAadhaarNumber, setNewCustGuarantorAadhaarNumber] = useState("");
  const [newCustPoliceStatus, setNewCustPoliceStatus] = useState<
    "Pending Verification" | "Verified Clean" | "Submitted to Local Thana" | "Exempted"
  >("Verified Clean");
  const [newCustPoliceStation, setNewCustPoliceStation] = useState("Sigra Police Station");
  const [newCustPoliceToken, setNewCustPoliceToken] = useState("");

  const handleCreateNewCustomerAndSelect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    const createdCust: Customer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newCustName,
      phone: newCustPhone,
      email: newCustEmail || `${newCustName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      locality: newCustLocality,
      address: newCustAddress || `${newCustLocality}, Varanasi`,
      tier: "Standard",
      totalSpend: 0,
      totalBookings: 0,
      lastBookingDate: "Just Now",
      joinedDate: "Today",

      aadhaarNumber: newCustAadhaarNumber || "7821-4920-1102",
      aadhaarDocUrl: newCustAadhaarDocUrl,
    };

    setCustomerList([createdCust, ...customerList]);
    setCustomerName(createdCust.name);
    setCustomerPhone(createdCust.phone);
    setCustomerEmail(createdCust.email);
    setLocality(createdCust.locality);
    setAddress("");
    setIsAddCustomerFormOpen(false);
    setIsTrustedCustomer(false);
    setIsNewCustomerAdded(true);
    setIsAddCustomerFormOpen(false);

    // Reset inline inputs
    setNewCustName("");
    setNewCustPhone("");
    setNewCustEmail("");
    setNewCustAddress("");
    setNewCustAadhaarNumber("");
    setNewCustAadhaarDocUrl("");
    setNewCustGuarantorName("");
    setNewCustGuarantorPhone("");
    setNewCustGuarantorAddress("");
    setNewCustGuarantorAadhaarNumber("");
    setNewCustPoliceToken("");
  };

  // STEP 2: Address & Location States
  const [city, setCity] = useState("Varanasi");
  const [locality, setLocality] = useState("Sigra");
  const [pincode, setPincode] = useState("221002");
  const [address, setAddress] = useState("");

  // STEP 3: Service Selection States (Flow: Category -> Type -> Action -> Package)
  const [selectedCategory, setSelectedCategory] = useState("AC Service & Repair");
  const [selectedType, setSelectedType] = useState("Split AC");
  const [selectedAction, setSelectedAction] = useState("Service & Maintenance");
  const [selectedPackageId, setSelectedPackageId] = useState("sp-1");

  // STEP 4: Schedule States
  const [bookingDate, setBookingDate] = useState("2026-07-28");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 11:30 AM");
  const [preferredPartnerId, setPreferredPartnerId] = useState("");

  // STEP 5: Payment & Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "Cash on Service" | "Card" | "Helpmate Wallet" | "Online" | "Partial Payment"
  >("UPI");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isCouponPickerOpen, setIsCouponPickerOpen] = useState(false);

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
      if (bookingToEdit.category && serviceCatalogData[bookingToEdit.category]) {
        setSelectedCategory(bookingToEdit.category);
      }
      setBookingDate(bookingToEdit.date || "2026-07-28");
      setTimeSlot(bookingToEdit.timeSlot || "10:00 AM - 11:30 AM");
      setPreferredPartnerId(bookingToEdit.technicianId || "");
      setCustomerNotes(bookingToEdit.notes || "");
      setIsOtpVerified(true);
      setCurrentStep(1);
    }
  }, [bookingToEdit, isOpen]);

  if (!isOpen) return null;

  // Multi-Level Catalog Calculations: Category -> Type -> Action -> Package
  const currentTypes = serviceCatalogData[selectedCategory] || serviceCatalogData["AC Service & Repair"];
  const currentTypeObj = currentTypes.find((t) => t.typeName === selectedType) || currentTypes[0];
  const currentActions = currentTypeObj ? currentTypeObj.actions : [];
  const currentActionObj = currentActions.find((a) => a.actionName === selectedAction) || currentActions[0];
  const currentPackages = currentActionObj ? currentActionObj.packages : [];
  const currentSelectedPackage = currentPackages.find((p) => p.id === selectedPackageId) || currentPackages[0] || { title: "Standard Package", price: 599 };

  const servicePrice = currentSelectedPackage.price;
  const convenienceFee = 49;
  const grossBeforeTax = Math.max(0, servicePrice + convenienceFee - discountAmount);
  const cgst = Math.round(grossBeforeTax * 0.09 * 100) / 100;
  const sgst = Math.round(grossBeforeTax * 0.09 * 100) / 100;
  const grandTotal = Math.round((grossBeforeTax + cgst + sgst) * 100) / 100;

  const handleSelectExistingCustomer = (custName: string) => {
    if (!custName) {
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setAddress("");
      setIsOtpVerified(false);
      setIsTrustedCustomer(false);
      setIsNewCustomerAdded(false);
      return;
    }
    const found = customerList.find((c) => c.name === custName);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerEmail(found.email);
      setLocality(found.locality);
      setAddress("");
      setIsOtpVerified(false);
      setIsTrustedCustomer(false);
      setIsNewCustomerAdded(false);
    }
  };

  const handleVerifyOtp = () => {
    setOtpError("");
    if (otpInput.trim() === "1234" || otpInput.trim().length === 4) {
      setIsOtpVerified(true);
    } else {
      setOtpError("Invalid OTP. Enter 1234 for instant verification.");
    }
  };

  const handleSkipOtpTrusted = () => {
    setIsOtpVerified(true);
    setIsTrustedCustomer(true);
  };

  const handleApplyCoupon = () => {
    const found = initialCoupons.find((c) => c.code.toLowerCase() === couponCode.trim().toLowerCase());
    if (found) {
      handleSelectCouponFromPicker(found);
    } else if (couponCode.toUpperCase() === "VARANASI100" || couponCode.toUpperCase() === "HELPMATE100") {
      setDiscountAmount(100);
    } else if (couponCode.trim()) {
      setDiscountAmount(50);
    }
  };

  const handleSelectCouponFromPicker = (coup: CouponItem) => {
    setCouponCode(coup.code);
    if (coup.discountType === "Percentage") {
      const calc = Math.round(servicePrice * (coup.discountValue / 100));
      const capped = coup.maxDiscountCap ? Math.min(calc, coup.maxDiscountCap) : calc;
      setDiscountAmount(capped);
    } else {
      setDiscountAmount(coup.discountValue);
    }
    setIsCouponPickerOpen(false);
  };

  // 4-Stage Selection Handlers
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newTypes = serviceCatalogData[cat] || [];
    const firstType = newTypes[0]?.typeName || "";
    setSelectedType(firstType);
    const firstAction = newTypes[0]?.actions[0]?.actionName || "";
    setSelectedAction(firstAction);
    const firstPkgId = newTypes[0]?.actions[0]?.packages[0]?.id || "";
    setSelectedPackageId(firstPkgId);
  };

  const handleTypeChange = (typeName: string) => {
    setSelectedType(typeName);
    const foundType = currentTypes.find((t) => t.typeName === typeName);
    const firstAction = foundType?.actions[0]?.actionName || "";
    setSelectedAction(firstAction);
    const firstPkgId = foundType?.actions[0]?.packages[0]?.id || "";
    setSelectedPackageId(firstPkgId);
  };

  const handleActionChange = (actionName: string) => {
    setSelectedAction(actionName);
    const foundAction = currentActions.find((a) => a.actionName === actionName);
    const firstPkgId = foundAction?.packages[0]?.id || "";
    setSelectedPackageId(firstPkgId);
  };

  const handleCompleteBooking = () => {
    const tech = initialTechnicians.find((t) => t.id === preferredPartnerId);

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
        serviceTitle: currentSelectedPackage.title || bookingToEdit.serviceTitle,
        category: selectedCategory,
        subCategory: `${selectedType} (${selectedAction})`,
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
      id: `HM-VAR-${Math.floor(9000 + Math.random() * 999)}`,
      customerName: customerName || "Rajesh Kumar Agrawal",
      customerPhone: customerPhone || "+91 98390 12345",
      customerEmail: customerEmail || "rajesh@gmail.com",
      city,
      locality,
      pincode,
      address: address || "D-38/21, Sigra Central, Varanasi",
      serviceTitle: currentSelectedPackage.title,
      category: selectedCategory,
      subCategory: `${selectedType} (${selectedAction})`,
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
    { num: 2, label: "2. Location & Address" },
    { num: 3, label: "3. Service Selection" },
    { num: 4, label: "4. Schedule & Partner" },
    { num: 5, label: "5. Payment & Confirm" },
  ];

  return (
    <Portal>
      {/* Right Slide-over Drawer Overlay */}
      <div className="fixed inset-0 z-[99999] bg-slate-950/60 backdrop-blur-xs flex justify-end outline-none">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Slide-over Drawer Panel */}
        <div className="relative z-10 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-4xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 outline-none">
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
            <div>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                Helpmate Booking Wizard
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {bookingToEdit ? `Edit Booking ${bookingToEdit.id}` : "Create New Booking"}
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

          {/* Stepper Navigation Bar */}
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
                        ? "bg-brand-500 text-white shadow-lux"
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

          {/* Drawer Body Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* STEP 1: SELECT CUSTOMER & OTP VERIFICATION */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base">
                    <User className="w-5 h-5 text-brand-600" />
                    <span>Step 1: Select & Verify Customer</span>
                  </div>
                  {isOtpVerified && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Customer
                    </span>
                  )}
                </div>

                {/* Select Existing Customer Search Picker Component */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <CustomerSearchPicker
                    customers={customerList}
                    selectedCustomer={customerList.find((c) => c.name === customerName) || null}
                    onSelectCustomer={(c, isNew) => {
                      if (isNew) {
                        setCustomerList([c, ...customerList]);
                        setIsNewCustomerAdded(true);
                      }
                      setCustomerName(c.name);
                      setCustomerPhone(c.phone);
                      setCustomerEmail(c.email || "");
                      setLocality(c.locality);
                      setAddress("");
                    }}
                    label="Quick Select Existing Varanasi Customer (Search Name or Phone)"
                  />
                </div>

                {/* OTP Verification Box (ONLY SHOWN AFTER CUSTOMER IS SELECTED OR ADDED) */}
                {customerName && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* OTP Verification & Skip Box */}
                    <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-brand-900 dark:text-brand-300 flex items-center gap-1.5">
                          <KeyRound className="w-4 h-4 text-brand-600" /> Phone OTP Verification & Security
                        </span>
                        {!isNewCustomerAdded ? (
                          <button
                            type="button"
                            onClick={handleSkipOtpTrusted}
                            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300 font-bold text-[11px] hover:bg-brand-50 transition-colors shadow-xs"
                          >
                            ⚡ Skip OTP (Regular / Trusted Customer)
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px] flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-amber-600" /> Mandatory OTP for New Customer
                          </span>
                        )}
                      </div>

                      {!isOtpVerified ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-600 dark:text-slate-400">
                            Enter 4-digit code sent via SMS to {customerPhone} (Demo OTP: <strong className="text-brand-600">1234</strong>)
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={4}
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value)}
                              placeholder="1234"
                              className="w-32 text-center p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-extrabold text-sm text-slate-900 dark:text-white tracking-widest outline-none focus:border-brand-500"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOtp}
                              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux transition-colors"
                            >
                              Verify OTP
                            </button>
                          </div>
                          {otpError && <p className="text-[11px] text-red-600 font-semibold">{otpError}</p>}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>
                              {isTrustedCustomer
                                ? "Verified Regular Trusted Client (OTP Bypassed)"
                                : "Phone OTP Verified Successfully (Code: 1234)"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setIsOtpVerified(false);
                              setIsTrustedCustomer(false);
                            }}
                            className="text-[10px] text-emerald-700 underline"
                          >
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: SELECT LOCATION & ADDRESS */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base">
                    <MapPin className="w-5 h-5 text-brand-600" />
                    <span>Step 2: Service Location & Address</span>
                  </div>
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

            {/* STEP 3: 4-STAGE SERVICE SELECTION FLOW (CATEGORY -> TYPE -> ACTION -> PACKAGE) */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Wrench className="w-5 h-5 text-brand-600" />
                  <span>Step 3: Select Service (Category → Type → Action → Package)</span>
                </div>

                {/* 1. Category Selection */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-extrabold text-[11px] flex items-center justify-center">1</span>
                    <label className="font-extrabold text-slate-900 dark:text-white text-xs">Select Service Category</label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.keys(serviceCatalogData).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`p-3 rounded-2xl border text-left font-extrabold text-xs transition-all cursor-pointer ${selectedCategory === cat
                            ? "bg-brand-600 text-white border-brand-600 shadow-md"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-brand-300"
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Type Selection */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-extrabold text-[11px] flex items-center justify-center">2</span>
                    <label className="font-extrabold text-slate-900 dark:text-white text-xs">Select Appliance / System Type</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentTypes.map((t) => (
                      <button
                        key={t.typeName}
                        type="button"
                        onClick={() => handleTypeChange(t.typeName)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${selectedType === t.typeName
                            ? "bg-brand-50 text-brand-700 border-brand-500 dark:bg-brand-950 dark:text-brand-300 shadow-xs"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                          }`}
                      >
                        {t.typeName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Action Selection */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-extrabold text-[11px] flex items-center justify-center">3</span>
                    <label className="font-extrabold text-slate-900 dark:text-white text-xs">Select Action / Service Scope</label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentActions.map((act) => {
                      const isSelected = selectedAction === act.actionName;
                      return (
                        <button
                          key={act.actionName}
                          type="button"
                          onClick={() => handleActionChange(act.actionName)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${isSelected
                              ? "bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-900 dark:text-purple-200 shadow-xs"
                              : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-300"
                            }`}
                        >
                          <div className="font-extrabold text-xs flex items-center justify-between">
                            <span>{act.actionName}</span>
                            <span className="text-[10px] font-bold text-slate-400">({act.packages.length} packages)</span>
                          </div>
                          {act.description && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{act.description}</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Package Selection (Custom Dropdown) */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-extrabold text-[11px] flex items-center justify-center">4</span>
                    <label className="font-extrabold text-slate-900 dark:text-white text-xs">Select Specific Service Package & Rate Card</label>
                  </div>

                  <CustomSelect
                    value={selectedPackageId}
                    onChange={(val) => setSelectedPackageId(val)}
                    options={currentPackages.map((pkg) => ({
                      value: pkg.id,
                      label: `${pkg.title} — ₹${pkg.price.toLocaleString()}${pkg.duration ? ` (${pkg.duration})` : ""}`,
                    }))}
                    placeholder="Choose Service Package..."
                  />

                  {/* Selected Package Details Card */}
                  {currentSelectedPackage && (
                    <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-500 shadow-xs flex items-center justify-between gap-3 mt-2">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-xs truncate">{currentSelectedPackage.title}</h4>
                          {currentSelectedPackage.badge && (
                            <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.2 rounded-full">
                              {currentSelectedPackage.badge}
                            </span>
                          )}
                        </div>
                        {currentSelectedPackage.description && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{currentSelectedPackage.description}</p>
                        )}
                        {currentSelectedPackage.duration && (
                          <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Estimated Duration: {currentSelectedPackage.duration}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-slate-900 dark:text-white">₹{currentSelectedPackage.price.toLocaleString()}</div>
                        <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          Warranty Included
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: SCHEDULE & ASSIGN PARTNER */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Calendar className="w-5 h-5 text-brand-600" />
                  <span>Step 4: Schedule Slot & Assign Fleet Partner</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full h-[42px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none text-xs"
                    />
                  </div>

                  <CustomSelect
                    label="Preferred Time Slot *"
                    value={timeSlot}
                    onChange={(val) => setTimeSlot(val)}
                    options={[
                      { value: "08:00 AM - 09:30 AM", label: "08:00 AM - 09:30 AM (Morning)" },
                      { value: "10:00 AM - 11:30 AM", label: "10:00 AM - 11:30 AM (Morning)" },
                      { value: "12:00 PM - 01:30 PM", label: "12:00 PM - 01:30 PM (Afternoon)" },
                      { value: "03:00 PM - 04:30 PM", label: "03:00 PM - 04:30 PM (Evening)" },
                      { value: "05:30 PM - 07:00 PM", label: "05:30 PM - 07:00 PM (Prime Evening)" },
                    ]}
                  />
                </div>

                {/* Assign Partner Selection */}
                <div className="space-y-2 text-xs">
                  <CustomSelect
                    label="Assign Varanasi Technician (Optional)"
                    value={preferredPartnerId}
                    onChange={(val) => setPreferredPartnerId(val)}
                    options={[
                      { value: "", label: `-- Auto-Dispatch (Next Available Tech in ${locality}) --` },
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

            {/* STEP 5: PAYMENT & FINAL CONFIRMATION */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  <span>Step 5: Payment Method & Final Summary</span>
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
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl"
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
                        className={`p-3 rounded-xl border text-xs font-bold text-left ${paymentMethod === method
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
                    <span>Base Service ({currentSelectedPackage.title})</span>
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

          {/* Drawer Footer Actions */}
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
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lux flex items-center gap-1 transition-colors cursor-pointer"
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
