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

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (booking: Booking) => void;
}

// Master Service Catalog with Sub-Categories, Dropdown Options, and Prices
const serviceCatalogData: Record<
  string,
  {
    types: string[];
    services: Record<string, { title: string; price: number }[]>;
  }
> = {
  "AC Service & Repair": {
    types: ["Split AC", "Window AC", "Cassette AC"],
    services: {
      "Split AC": [
        { title: "Split AC Foam Jet Servicing", price: 599 },
        { title: "Split AC Anti-Rust Chemical Wash", price: 899 },
        { title: "Split AC Gas Leak Repair & Refill (R32/R410a)", price: 1499 },
        { title: "Split AC Installation & Wall Mounting", price: 1199 },
        { title: "Split AC Uninstallation & Removal", price: 599 },
        { title: "Split AC Inspection & Diagnosis", price: 299 },
      ],
      "Window AC": [
        { title: "Window AC Deep Jet Servicing", price: 499 },
        { title: "Window AC Anti-Bacterial Wash", price: 699 },
        { title: "Window AC Gas Charging & Repair", price: 1299 },
        { title: "Window AC Mounting & Fitting", price: 799 },
      ],
      "Cassette AC": [
        { title: "Cassette AC Commercial Service", price: 999 },
        { title: "Cassette AC Gas Refilling", price: 1999 },
      ],
    },
  },
  "Car & Bike Wash": {
    types: ["Car (Hatchback/Sedan)", "Car (SUV/Luxury)", "Bike Wash"],
    services: {
      "Car (Hatchback/Sedan)": [
        { title: "Car Foam Wash & Interior Vacuuming", price: 499 },
        { title: "Car Deep Interior Shampooing & Polish", price: 999 },
        { title: "Full Body Teflon Coating & Wax Polish", price: 1499 },
      ],
      "Car (SUV/Luxury)": [
        { title: "SUV Heavy Duty Foam Wash & Vacuum", price: 699 },
        { title: "SUV Complete Interior Detailing & Sanitization", price: 1299 },
      ],
      "Bike Wash": [
        { title: "Super Bike High Pressure Foam Wash", price: 199 },
        { title: "Bike Teflon Coating & Chain Lube", price: 399 },
      ],
    },
  },
  "Home Cleaning": {
    types: ["Sofa Cleaning", "Carpet Cleaning", "Deep Home Cleaning", "Bathroom Cleaning", "Kitchen Cleaning"],
    services: {
      "Sofa Cleaning": [
        { title: "5-Seater Fabric Sofa Shampooing & Extraction", price: 899 },
        { title: "7-Seater Leather Sofa Cleaning & Polish", price: 1299 },
      ],
      "Carpet Cleaning": [
        { title: "Living Room Carpet Deep Vacuum & Wash", price: 599 },
      ],
      "Deep Home Cleaning": [
        { title: "Full House Deep Cleaning (2BHK)", price: 2999 },
        { title: "Full House Deep Cleaning (3BHK)", price: 3999 },
      ],
      "Bathroom Cleaning": [
        { title: "Standard Bathroom Tile Stain Removal", price: 499 },
        { title: "Premium 2x Bathroom Deep Sanitization", price: 899 },
      ],
      "Kitchen Cleaning": [
        { title: "Kitchen Degreasing & Chimney Cleaning", price: 999 },
      ],
    },
  },
  "Appliance Repair": {
    types: ["Washing Machine", "Refrigerator", "RO Water Purifier", "Microwave"],
    services: {
      "Washing Machine": [
        { title: "Fully Automatic Washing Machine Service & Drum Wash", price: 499 },
        { title: "Motor & PCB Repair / Spare Replacement", price: 899 },
      ],
      "Refrigerator": [
        { title: "Double Door Refrigerator Gas Refill", price: 1399 },
        { title: "Compressor & Thermostat Repair", price: 999 },
      ],
      "RO Water Purifier": [
        { title: "RO Water Purifier Filter & Membrane Replacement", price: 799 },
        { title: "RO General Servicing & TDS Calibration", price: 299 },
      ],
      "Microwave": [
        { title: "Microwave Magnetron & Heating Repair", price: 599 },
      ],
    },
  },
  "Pest Control": {
    types: ["Cockroach Control", "Termite Treatment", "Bedbug Control"],
    services: {
      "Cockroach Control": [
        { title: "2BHK Odorless Herbal Gel Cockroach Control", price: 899 },
      ],
      "Termite Treatment": [
        { title: "Drill-Fill-Seal Wooden Termite Treatment", price: 1999 },
      ],
      "Bedbug Control": [
        { title: "2-Session Intensive Bedbug Chemical Spray", price: 1299 },
      ],
    },
  },
  "Electrician": {
    types: ["Wiring & Switches", "Fan Repair", "MCB & Fuse"],
    services: {
      "Wiring & Switches": [
        { title: "Switchboard & Socket Installation (up to 5 points)", price: 299 },
        { title: "Complete Room Re-wiring & Tube Light Fitting", price: 699 },
      ],
      "Fan Repair": [
        { title: "Ceiling Fan Winding & Capacitor Replacement", price: 349 },
      ],
      "MCB & Fuse": [
        { title: "Main MCB Tripping & Short Circuit Repair", price: 499 },
      ],
    },
  },
  "Plumbing": {
    types: ["Tap & Mixer Repair", "Water Tank Cleaning", "Blockage Removal"],
    services: {
      "Tap & Mixer Repair": [
        { title: "Bathroom Tap & Wash Basin Leak Fix", price: 249 },
        { title: "Wall Mixer & Shower Head Installation", price: 499 },
      ],
      "Water Tank Cleaning": [
        { title: "1000L Overhead Water Tank Mechanized Scrub & Wash", price: 799 },
      ],
      "Blockage Removal": [
        { title: "Kitchen Sink & Drain Pipe Drainage Unclogging", price: 399 },
      ],
    },
  },
};

export function BookingWizardModal({
  isOpen,
  onClose,
  onBookingCreated,
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
      guarantorName: newCustGuarantorName,
      guarantorPhone: newCustGuarantorPhone,
      guarantorAddress: newCustGuarantorAddress,
      guarantorAadhaarNumber: newCustGuarantorAadhaarNumber,
      policeStatus: newCustPoliceStatus,
      policeStationName: newCustPoliceStation,
      policeTokenNumber: newCustPoliceToken || `PCC-VAR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setCustomerList([createdCust, ...customerList]);
    setCustomerName(createdCust.name);
    setCustomerPhone(createdCust.phone);
    setCustomerEmail(createdCust.email);
    setLocality(createdCust.locality);
    setAddress(createdCust.address);
    setIsOtpVerified(false);
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

  // STEP 3: Service Selection States
  const [selectedCategory, setSelectedCategory] = useState("AC Service & Repair");
  const [selectedType, setSelectedType] = useState("Split AC");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

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

  if (!isOpen) return null;

  // Active services for current Category + SubCategory Type
  const currentCategoryObj = serviceCatalogData[selectedCategory] || serviceCatalogData["AC Service & Repair"];
  const currentTypes = currentCategoryObj.types;
  const currentServices = currentCategoryObj.services[selectedType] || currentCategoryObj.services[currentTypes[0]] || [];
  const currentSelectedService = currentServices[selectedServiceIndex] || currentServices[0] || { title: "Custom Service", price: 599 };

  const servicePrice = currentSelectedService.price;
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
      setAddress(found.address);
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

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const newTypes = serviceCatalogData[cat]?.types || [];
    const firstType = newTypes[0] || "";
    setSelectedType(firstType);
    setSelectedServiceIndex(0);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedServiceIndex(0);
  };

  const handleCompleteBooking = () => {
    const tech = initialTechnicians.find((t) => t.id === preferredPartnerId);

    const created: Booking = {
      id: `HM-VAR-${Math.floor(9000 + Math.random() * 999)}`,
      customerName: customerName || "Rajesh Kumar Agrawal",
      customerPhone: customerPhone || "+91 98390 12345",
      customerEmail: customerEmail || "rajesh@gmail.com",
      city,
      locality,
      pincode,
      address: address || "D-38/21, Sigra Central, Varanasi",
      serviceTitle: currentSelectedService.title,
      category: selectedCategory,
      subCategory: selectedType,
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

    onBookingCreated(created);
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
                Create New Booking
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
                    className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl font-bold transition-all text-xs whitespace-nowrap ${
                      isCurrent
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
                      setAddress(c.address || `${c.locality}, Varanasi`);
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
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Varanasi Locality *
                    </label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                    >
                      {varanasiLocalities.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name} ({loc.pincode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-semibold outline-none"
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
                    placeholder="House / Flat No., Colony, Near Landmark..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 3: SELECT SERVICE CATEGORY & PACKAGE */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Wrench className="w-5 h-5 text-brand-600" />
                  <span>Step 3: Select Service Category & Package</span>
                </div>

                {/* Main Category Selection */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    1. Main Service Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.keys(serviceCatalogData).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`p-3 rounded-2xl border text-left font-extrabold text-xs transition-all ${
                          selectedCategory === cat
                            ? "bg-brand-500 text-white border-brand-500 shadow-lux"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-brand-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Type Selection */}
                <div className="space-y-2 text-xs pt-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    2. System / Appliance Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {currentTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleTypeChange(type)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          selectedType === type
                            ? "bg-brand-50 text-brand-700 border-brand-500 dark:bg-brand-950 dark:text-brand-300"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Package Dropdown */}
                <div className="space-y-2 text-xs pt-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    3. Specific Service Package & Rate Card *
                  </label>
                  <select
                    value={selectedServiceIndex}
                    onChange={(e) => setSelectedServiceIndex(Number(e.target.value))}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-sm shadow-xs outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                  >
                    {currentServices.map((svc, idx) => (
                      <option key={svc.title} value={idx}>
                        {svc.title} — ₹{svc.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
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
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Time Slot
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                    >
                      <option value="08:00 AM - 09:30 AM">08:00 AM - 09:30 AM</option>
                      <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                      <option value="12:00 PM - 01:30 PM">12:00 PM - 01:30 PM</option>
                      <option value="03:00 PM - 04:30 PM">03:00 PM - 04:30 PM</option>
                      <option value="05:30 PM - 07:00 PM">05:30 PM - 07:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Assign Partner Selection */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Assign Varanasi Technician (Optional)
                  </label>
                  <select
                    value={preferredPartnerId}
                    onChange={(e) => setPreferredPartnerId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="">-- Auto-Dispatch (Next Available Tech in {locality}) --</option>
                    {initialTechnicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name} ({tech.locality}) — ★ {tech.rating}
                      </option>
                    ))}
                  </select>
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
                        className={`p-3 rounded-xl border text-xs font-bold text-left ${
                          paymentMethod === method
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
                    <span>Base Service ({currentSelectedService.title})</span>
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
