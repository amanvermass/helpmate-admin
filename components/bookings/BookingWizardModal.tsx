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
} from "lucide-react";
import { Booking, varanasiLocalities, initialTechnicians, initialCoupons, CouponItem } from "@/lib/mockData";
import { Portal } from "@/components/Portal";

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

  // Step 1 & 2: Service Selection States
  const [selectedCategory, setSelectedCategory] = useState("AC Service & Repair");
  const [selectedType, setSelectedType] = useState("Split AC");
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  // Step 3: Address & Customer States
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [city, setCity] = useState("Varanasi");
  const [locality, setLocality] = useState("Sigra");
  const [pincode, setPincode] = useState("221002");
  const [address, setAddress] = useState("");

  // Step 4: Schedule States
  const [bookingDate, setBookingDate] = useState("2026-07-28");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 11:30 AM");
  const [preferredPartnerId, setPreferredPartnerId] = useState("");

  // Step 5: Payment & Coupon States
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
    { num: 1, label: "1. Service & Category" },
    { num: 2, label: "2. Choose Service & Price" },
    { num: 3, label: "3. Address & Customer" },
    { num: 4, label: "4. Schedule Slot" },
    { num: 5, label: "5. Payment & Confirm" },
  ];

  return (
    <Portal>
      <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
        <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 outline-none">
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 rounded border border-brand-200 dark:border-brand-800">
                HelpMate Booking Engine
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                Create Multi-Service Booking
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Navigation */}
          <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 overflow-x-auto flex items-center gap-2 text-xs select-none">
            {steps.map((st) => {
              const isDone = st.num < currentStep;
              const isCurrent = st.num === currentStep;

              return (
                <div key={st.num} className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(st.num)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
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

          {/* Step Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* STEP 1: SELECT CATEGORY & TYPE (Split AC or Window AC, etc.) */}
            {currentStep === 1 && (
              <div className="space-y-5 max-w-xl mx-auto">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base">
                  <Wrench className="w-5 h-5 text-brand-600" />
                  <span>Step 1: Select Service Category & System Type</span>
                </div>

                {/* Main Service Category Grid */}
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

                {/* Sub-Category Type Selection (e.g. Split AC vs Window AC) */}
                <div className="space-y-2 text-xs pt-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    2. System Type / Appliance Category (e.g., Split AC vs Window AC)
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
              </div>
            )}

            {/* STEP 2: SELECT SPECIFIC SERVICE FROM DROPDOWN WITH PRICE */}
            {currentStep === 2 && (
              <div className="space-y-5 max-w-xl mx-auto">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base">
                  <Tag className="w-5 h-5 text-brand-600" />
                  <span>Step 2: Select Specific Service Item & Price</span>
                </div>

                <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 text-xs text-brand-800 dark:text-brand-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Selected Category & Type:</span>
                    <span className="font-extrabold text-sm">{selectedCategory} • {selectedType}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-[11px] font-bold text-brand-600 underline"
                  >
                    Change Category
                  </button>
                </div>

                {/* Service Dropdown with Price */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Choose Service Package from Dropdown (with Price) *
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

                {/* Price Display Card */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Selected Service:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{currentSelectedService.title}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Base Service Rate:</span>
                    <span className="font-black text-brand-600 dark:text-brand-400 text-base">
                      ₹{currentSelectedService.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span>Includes 30-Day Guarantee</span>
                    <span>Platform Fee: ₹49</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CUSTOMER & ADDRESS */}
            {currentStep === 3 && (
              <div className="space-y-4 max-w-xl mx-auto text-xs">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base mb-2">
                  <MapPin className="w-5 h-5 text-brand-600" />
                  <span>Step 3: Customer Details & Service Address</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar Agrawal"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone *</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98390 12345"
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Varanasi Locality / Zone</label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    >
                      {varanasiLocalities.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name} ({loc.pincode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Service Address</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat No, Building Name, Landmark..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  ></textarea>
                </div>
              </div>
            )}

            {/* STEP 4: SCHEDULE */}
            {currentStep === 4 && (
              <div className="space-y-4 max-w-xl mx-auto text-xs">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base mb-2">
                  <Calendar className="w-5 h-5 text-brand-600" />
                  <span>Step 4: Select Booking Date & Time Slot</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Preferred Time Slot</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="09:00 AM - 10:30 AM">09:00 AM - 10:30 AM</option>
                      <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                      <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                      <option value="05:00 PM - 06:30 PM">05:00 PM - 06:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assign Fleet Partner (Optional)</label>
                  <select
                    value={preferredPartnerId}
                    onChange={(e) => setPreferredPartnerId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="">Auto-Dispatch Available Specialist</option>
                    {initialTechnicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.category} • ★ {t.rating})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT & SUMMARY */}
            {currentStep === 5 && (
              <div className="space-y-4 max-w-xl mx-auto text-xs">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-base mb-2">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  <span>Step 5: Payment Mode & Price Summary</span>
                </div>

                {/* Coupon Input & Browse Bank Offers Button */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-700 dark:text-slate-300 block">Coupons & Bank Offers</label>
                    <button
                      type="button"
                      onClick={() => setIsCouponPickerOpen(true)}
                      className="text-brand-600 dark:text-brand-400 font-extrabold hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      View Available Bank Offers ({initialCoupons.length})
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon Code (e.g. HDFC10, VARANASI100)"
                      className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono uppercase font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold"
                    >
                      Apply
                    </button>
                  </div>

                  {discountAmount > 0 && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-between">
                      <span>✓ Code "{couponCode.toUpperCase()}" Applied! Saved ₹{discountAmount}</span>
                      <button type="button" onClick={() => { setCouponCode(""); setDiscountAmount(0); }} className="text-red-500 hover:underline text-[10px]">Remove</button>
                    </div>
                  )}
                </div>

                {/* Payment Mode Buttons */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["UPI", "Cash on Service", "Card"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMethod(mode)}
                        className={`p-3 rounded-xl border font-bold text-center transition-all ${
                          paymentMethod === mode
                            ? "bg-brand-500 text-white border-brand-500 shadow-lux"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between">
                    <span>Service: <strong>{currentSelectedService.title}</strong></span>
                    <span className="font-bold">₹{servicePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span className="font-bold">₹{convenienceFee}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>CGST (9%) + SGST (9%)</span>
                    <span className="font-bold">₹{cgst + sgst}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-base font-black text-brand-600 dark:text-brand-400">
                    <span>Grand Total Payable</span>
                    <span>₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-lux flex items-center gap-1"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteBooking}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lux flex items-center gap-1"
              >
                Confirm & Launch Booking
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* COUPON & BANK OFFERS SELECTION MODAL POPUP */}
      {isCouponPickerOpen && (
        <Portal>
          <div className="fixed inset-0 z-[100000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 outline-none">
            <div className="bg-white dark:bg-slate-900 ring-1 ring-slate-900/10 dark:ring-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 outline-none">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-600" />
                    <span>Available Coupons & Bank Offers</span>
                  </h3>
                  <p className="text-xs text-slate-500">Apply instant discount or credit card cashback</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCouponPickerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
                {initialCoupons.map((coup) => (
                  <div
                    key={coup.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-brand-500 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 text-xs">
                          {coup.code}
                        </span>
                        {coup.bankName && (
                          <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded">
                            {coup.bankName}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{coup.description}</p>
                      <span className="text-[10px] text-slate-400 block">Min order ₹{coup.minOrderValue} • Valid till {coup.expiryDate}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectCouponFromPicker(coup)}
                      className="px-3.5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs shrink-0 shadow-xs"
                    >
                      Apply Code
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsCouponPickerOpen(false)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Portal>
      )}
    </Portal>
  );
}
