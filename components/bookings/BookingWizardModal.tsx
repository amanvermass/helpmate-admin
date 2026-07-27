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
  Upload,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { Booking, varanasiLocalities, initialTechnicians, initialServices } from "@/lib/mockData";

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (booking: Booking) => void;
}

const serviceCategories = [
  "AC Service",
  "AC Installation",
  "AC Repair",
  "Car Wash",
  "Bike Wash",
  "Deep Home Cleaning",
  "Sofa Cleaning",
  "Carpet Cleaning",
  "Bathroom Cleaning",
  "Kitchen Cleaning",
  "Pest Control",
  "Electrician",
  "Plumbing",
  "Painting",
  "Carpenter",
  "Appliance Repair",
  "RO Service",
  "CCTV Installation",
  "Water Tank Cleaning",
  "Laundry",
  "Home Salon",
];

export function BookingWizardModal({
  isOpen,
  onClose,
  onBookingCreated,
}: BookingWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form States
  const [customerType, setCustomerType] = useState<"existing" | "new">("new");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [city, setCity] = useState("Varanasi");
  const [locality, setLocality] = useState("Sigra");
  const [pincode, setPincode] = useState("221002");
  const [address, setAddress] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("AC Service");
  const [serviceTitle, setServiceTitle] = useState("Power Jet AC Servicing");
  const [packageTitle, setPackageTitle] = useState("Standard Protection");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["Anti-Bacterial Spray (₹199)"]);

  const [bookingDate, setBookingDate] = useState("2026-07-28");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 11:30 AM");
  const [preferredPartnerId, setPreferredPartnerId] = useState("");

  const [isInspectionRequired, setIsInspectionRequired] = useState(false);

  const [servicePrice, setServicePrice] = useState(699);
  const [addonPrice, setAddonPrice] = useState(199);
  const [convenienceFee] = useState(49);
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "Cash on Service" | "Card" | "Helpmate Wallet" | "Online" | "Partial Payment"
  >("UPI");

  const [customerNotes, setCustomerNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  if (!isOpen) return null;

  // Price calculations
  const grossBeforeTax = Math.max(0, servicePrice + addonPrice + convenienceFee - discountAmount);
  const cgst = Math.round(grossBeforeTax * 0.09 * 100) / 100;
  const sgst = Math.round(grossBeforeTax * 0.09 * 100) / 100;
  const grandTotal = Math.round((grossBeforeTax + cgst + sgst) * 100) / 100;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "VARANASI100" || couponCode.toUpperCase() === "HELPMATE100") {
      setDiscountAmount(100);
    } else if (couponCode.trim()) {
      setDiscountAmount(50);
    }
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
      serviceTitle,
      category: selectedCategory,
      packageTitle,
      addons: selectedAddons,
      basePrice: servicePrice,
      addonPrice,
      convenienceFee,
      discountAmount,
      couponCode,
      cgst,
      sgst,
      totalAmount: grandTotal,
      invoiceType: "B2C",
      commissionAmount: Math.round(servicePrice * 0.25),
      partnerEarnings: Math.round(servicePrice * 0.75),
      isInspectionBased: isInspectionRequired,
      notes: customerNotes,
      internalNotes,
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
    "Customer",
    "Location",
    "Service",
    "Schedule",
    "Inspection",
    "Price",
    "Payment",
    "Attachments",
    "Review",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 outline-none">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800">
              Enterprise Booking Wizard
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">Create Multi-Service Booking</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/20 overflow-x-auto flex items-center gap-2 text-xs select-none">
          {steps.map((stLabel, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={stLabel} className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrentStep(stepNum)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all ${
                    isCurrent
                      ? "bg-brand-500 text-white shadow-lux"
                      : isDone
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-slate-200/60 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                    {stepNum}
                  </span>
                  <span>{stLabel}</span>
                </button>
                {idx < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />}
              </div>
            );
          })}
        </div>

        {/* Step Content Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* STEP 1: CUSTOMER */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-brand-600" />
                Step 1: Select Customer
              </h3>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCustomerType("new")}
                  className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition-all ${
                    customerType === "new"
                      ? "bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600"
                  }`}
                >
                  New Customer
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerType("existing")}
                  className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition-all ${
                    customerType === "existing"
                      ? "bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                      : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600"
                  }`}
                >
                  Existing Customer
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer Full Name *</label>
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
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="rajesh@gmail.com"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                Step 2: Service Location & Address
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Varanasi Locality / Zone</label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {varanasiLocalities.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name} ({loc.pincode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Detailed Street Address</label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot / Flat No, Landmark..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 3: SERVICE */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-brand-600" />
                Step 3: Service Catalog & Add-ons
              </h3>

              <div className="text-xs space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Select Service Category</label>
                <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-2 rounded-lg text-left font-semibold text-[11px] truncate transition-all ${
                        selectedCategory === cat
                          ? "bg-brand-500 text-white shadow-xs"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Service Title</label>
                  <input
                    type="text"
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SCHEDULE */}
          {currentStep === 4 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-600" />
                Step 4: Schedule & Preferred Technician
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Booking Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="09:00 AM - 10:30 AM">09:00 AM - 10:30 AM</option>
                    <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                    <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                    <option value="05:00 PM - 06:30 PM">05:00 PM - 06:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Preferred Fleet Partner (Optional)</label>
                <select
                  value={preferredPartnerId}
                  onChange={(e) => setPreferredPartnerId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Auto-Assign Best Available Technician</option>
                  {initialTechnicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category} • ★ {t.rating})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 5: INSPECTION */}
          {currentStep === 5 && (
            <div className="space-y-4 max-w-xl mx-auto text-xs">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                Step 5: Diagnostic Inspection Flag
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="font-bold text-slate-900 dark:text-white block">Does this job require technician inspection before final pricing?</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="inspection"
                      checked={isInspectionRequired}
                      onChange={() => setIsInspectionRequired(true)}
                    />
                    <span>Yes, Requires Inspection Quote</span>
                  </label>
                  <label className="flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="inspection"
                      checked={!isInspectionRequired}
                      onChange={() => setIsInspectionRequired(false)}
                    />
                    <span>No, Standard Fixed Rate</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PRICE */}
          {currentStep === 6 && (
            <div className="space-y-4 max-w-xl mx-auto text-xs">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-brand-600" />
                Step 6: Price & Coupon Engine
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter Coupon (e.g. VARANASI100)"
                  className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-3 bg-brand-500 text-white rounded-xl font-bold"
                >
                  Apply
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between"><span>Base Service Rate</span><span className="font-bold">₹{servicePrice}</span></div>
                <div className="flex justify-between"><span>Add-ons Fee</span><span className="font-bold">₹{addonPrice}</span></div>
                <div className="flex justify-between"><span>Convenience Fee</span><span className="font-bold">₹{convenienceFee}</span></div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold"><span>Discount Applied</span><span>-₹{discountAmount}</span></div>
                )}
                <div className="flex justify-between"><span>CGST (9%) + SGST (9%)</span><span className="font-bold">₹{cgst + sgst}</span></div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-sm font-black text-brand-600 dark:text-brand-400">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: PAYMENT */}
          {currentStep === 7 && (
            <div className="space-y-4 max-w-xl mx-auto text-xs">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" />
                Step 7: Payment Collection Mode
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {(["UPI", "Cash on Service", "Card", "Helpmate Wallet", "Online", "Partial Payment"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMethod(mode)}
                    className={`p-3.5 rounded-2xl border font-bold text-left transition-all ${
                      paymentMethod === mode
                        ? "bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: ATTACHMENTS */}
          {currentStep === 8 && (
            <div className="space-y-4 max-w-xl mx-auto text-xs">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-brand-600" />
                Step 8: Notes & Attachments
              </h3>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Customer Notes</label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Please bring extra ladder for 2nd floor Split AC"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                ></textarea>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="VIP customer - dispatch top rated technician"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 9: REVIEW */}
          {currentStep === 9 && (
            <div className="space-y-4 max-w-xl mx-auto text-xs">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                Step 9: Final Booking Summary Review
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between"><span>Customer</span><span className="font-bold">{customerName || "Rajesh Kumar Agrawal"}</span></div>
                <div className="flex justify-between"><span>Service</span><span className="font-bold">{serviceTitle}</span></div>
                <div className="flex justify-between"><span>Locality</span><span className="font-bold">{locality}, {city}</span></div>
                <div className="flex justify-between"><span>Schedule</span><span className="font-bold">{bookingDate} ({timeSlot})</span></div>
                <div className="flex justify-between"><span>Payment Mode</span><span className="font-bold">{paymentMethod}</span></div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-sm font-black text-emerald-600">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
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

          {currentStep < 9 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(9, s + 1))}
              className="px-6 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-lux flex items-center gap-1"
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
              Confirm & Create Booking
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
