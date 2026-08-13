"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { initialTechnicians } from "@/lib/mockData";
import { CustomSelect } from "@/components/CustomSelect";
import {
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Building,
  Briefcase,
  Upload,
  ArrowRight,
  Wallet,
  FileCheck,
  ChevronRight,
  User,
  BadgeCheck,
  Award,
  Eye,
  FileText,
} from "lucide-react";

function TechnicianFormContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id") || searchParams.get("edit");
  const isEditing = pathname.includes("/edit") || Boolean(editId);

  // 4-Stage Stepper: 1 = Personal & Bank, 2 = Service & Zone, 3 = KYC & Guarantor, 4 = Review & Submit
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // ─── STEP 1 STATE: PERSONAL & BANK DETAILS ───
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Bank Details
  const [bankName, setBankName] = useState("HDFC Bank (Sigra Branch)");
  const [bankAccountNumber, setBankAccountNumber] = useState("50100299182711");
  const [ifscCode, setIfscCode] = useState("HDFC0001827");
  const [upiId, setUpiId] = useState("");

  // ─── STEP 2 STATE: SERVICE & ZONE SETUP ───
  const [category, setCategory] = useState("AC Repair");
  const [role, setRole] = useState("Master HVAC Specialist");
  const [experience, setExperience] = useState("5+ Years Senior Specialist");
  const [locality, setLocality] = useState("Sigra");
  const [pincode, setPincode] = useState("221002");
  const [commissionRate, setCommissionRate] = useState("25");

  // ─── STEP 3 STATE: KYC, GUARANTOR & POLICE VERIFICATION ───
  // Partner KYC Aadhaar
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarDocUploaded, setAadhaarDocUploaded] = useState(false);

  // Emergency Guarantor Person Details
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorRelation, setGuarantorRelation] = useState("Brother");
  const [guarantorPhone, setGuarantorPhone] = useState("");
  const [guarantorPhoneVerified, setGuarantorPhoneVerified] = useState(false);
  const [guarantorEmail, setGuarantorEmail] = useState("");
  const [guarantorAadhaar, setGuarantorAadhaar] = useState("");
  const [guarantorAddress, setGuarantorAddress] = useState("");
  const [guarantorAadhaarDocUploaded, setGuarantorAadhaarDocUploaded] = useState(false);

  // Police Clearance Certificate
  const [policeThanaName, setPoliceThanaName] = useState("Sigra Police Station");
  const [policeCertificateNumber, setPoliceCertificateNumber] = useState("");
  const [policeIssueDate, setPoliceIssueDate] = useState("");
  const [policeDocUploaded, setPoliceDocUploaded] = useState(false);
  const [policeVerified, setPoliceVerified] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Load existing partner data if editing!
  useEffect(() => {
    if (editId) {
      const existingTech = initialTechnicians.find((t) => t.id === editId) || initialTechnicians[0];
      if (existingTech) {
        setName(existingTech.name);
        setPhone(existingTech.phone ? existingTech.phone.replace(/\D/g, "").slice(0, 10) : "9839122401");
        setPhoneVerified(true);
        setEmail(`${existingTech.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`);
        setAddress("House 14/A, Sigra Chauraha, Varanasi, Uttar Pradesh - 221002");

        setBankName("HDFC Bank (Sigra Branch)");
        setBankAccountNumber("50100299182711");
        setIfscCode("HDFC0001827");
        setUpiId(`${existingTech.name.toLowerCase().replace(/\s+/g, ".")}@okhdfcbank`);

        setCategory(existingTech.category || "AC Repair");
        setRole(existingTech.role || "Master HVAC Specialist");
        setExperience("5+ Years Senior Specialist");
        setLocality(existingTech.locality ? existingTech.locality.split(",")[0] : "Sigra");
        setPincode(existingTech.pincode || "221002");
        setCommissionRate("25");

        setAadhaarNumber("982341029831");
        setAadhaarVerified(true);
        setAadhaarDocUploaded(true);

        setGuarantorName("Suresh Chandra Yadav");
        setGuarantorRelation("Brother");
        setGuarantorPhone("9415000000");
        setGuarantorPhoneVerified(true);
        setGuarantorEmail("suresh.yadav@gmail.com");
        setGuarantorAadhaar("819230491823");
        setGuarantorAddress("House 42/B, Sigra Chauraha, Varanasi, UP");
        setGuarantorAadhaarDocUploaded(true);

        setPoliceThanaName("Sigra Police Station");
        setPoliceCertificateNumber("UP-VAR-POL-2026-9812");
        setPoliceIssueDate("2026-01-15");
        setPoliceDocUploaded(true);
        setPoliceVerified(true);
      }
    }
  }, [editId]);

  // Verification Handlers
  const handleVerifyPhone = () => {
    if (!phone) return alert("Please enter mobile number first.");
    setShowPhoneOtpInput(true);
  };

  const handleConfirmPhoneOtp = () => {
    if (phoneOtp.length >= 4) {
      setPhoneVerified(true);
      setShowPhoneOtpInput(false);
    } else {
      alert("Please enter 4-digit OTP.");
    }
  };

  const handleVerifyGuarantorPhone = () => {
    if (!guarantorPhone) return alert("Please enter guarantor mobile number.");
    setGuarantorPhoneVerified(true);
  };

  // Step Navigation Handlers
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter Partner Name.");
    if (!phone.trim()) return alert("Please enter Mobile Number.");
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(4);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/technicians");
      }, 1200);
    }, 600);
  };

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link
              href="/technicians"
              className="inline-flex items-center gap-1 hover:text-brand-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-brand-600" />
              <span>Partner Directory</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {isEditing ? (
              <>
                <span className="text-slate-700 dark:text-slate-300 font-bold">Edit Partner</span>
                {name && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-brand-600 dark:text-brand-400 font-extrabold">{name}</span>
                  </>
                )}
              </>
            ) : (
              <span className="text-brand-600 dark:text-brand-400 font-extrabold">Add Partner</span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mt-1">
            <UserCheck className="w-6 h-6 text-brand-600" />
            <span>{isEditing ? "Edit Partner" : "Add Partner"}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            3-Step Registration: Step 1 (Personal & Bank) ➔ Step 2 (Service & Zone) ➔ Step 3 (KYC, Guarantor & Police) ➔ Final Review & Submit.
          </p>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {successMessage && (
        <div className="p-5 rounded-2xl bg-emerald-500 text-white shadow-lg flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <h3 className="font-extrabold text-sm">
              {isEditing ? "Partner Profile Updated Successfully!" : "Partner Onboarded Successfully!"}
            </h3>
            <p className="text-xs opacity-90">Redirecting to active partner fleet directory...</p>
          </div>
        </div>
      )}

      {/* 4-STAGE STEPPER HEADER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Step 1 Pill */}
        <div
          onClick={() => setCurrentStep(1)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 1
              ? "bg-brand-600 text-white border-brand-600 shadow-md"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-brand-300"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
              currentStep === 1 ? "bg-white text-brand-700" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            1
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Step 1</span>
            <span className="font-extrabold text-xs truncate block">Personal & Bank</span>
          </div>
        </div>

        {/* Step 2 Pill */}
        <div
          onClick={() => {
            if (name && phone) setCurrentStep(2);
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 2
              ? "bg-brand-600 text-white border-brand-600 shadow-md"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-brand-300"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
              currentStep === 2 ? "bg-white text-brand-700" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            2
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Step 2</span>
            <span className="font-extrabold text-xs truncate block">Service & Zone</span>
          </div>
        </div>

        {/* Step 3 Pill */}
        <div
          onClick={() => {
            if (name && phone) setCurrentStep(3);
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 3
              ? "bg-brand-600 text-white border-brand-600 shadow-md"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-brand-300"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
              currentStep === 3 ? "bg-white text-brand-700" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            3
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Step 3</span>
            <span className="font-extrabold text-xs truncate block">KYC, Guarantor & Police</span>
          </div>
        </div>

        {/* Step 4 Review & Submit Pill */}
        <div
          onClick={() => {
            if (name && phone) setCurrentStep(4);
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 4
              ? "bg-brand-600 text-white border-brand-600 shadow-md"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-brand-300"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
              currentStep === 4 ? "bg-white text-brand-700" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            4
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Final Step</span>
            <span className="font-extrabold text-xs truncate block">Review & Submit</span>
          </div>
        </div>
      </div>

      {/* ─── STEP 1 FORM: PERSONAL DETAILS & BANK DETAILS ─── */}
      {currentStep === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-6">
          {/* Personal Information */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <User className="w-5 h-5 text-brand-600" />
              <span>Step 1A: Partner Personal Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Yadav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Mobile Number + Verification */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  {phoneVerified && (
                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9839100000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                  />
                  {!phoneVerified ? (
                    <button
                      type="button"
                      onClick={handleVerifyPhone}
                      className="h-11 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs whitespace-nowrap shadow-xs cursor-pointer shrink-0 flex items-center justify-center"
                    >
                      Verify OTP
                    </button>
                  ) : (
                    <span className="h-11 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200 shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>

                {showPhoneOtpInput && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Enter 4-digit OTP"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      className="w-32 px-3 py-1.5 rounded-lg border border-amber-300 text-xs font-mono font-bold text-slate-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmPhoneOtp}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 text-white font-extrabold text-xs cursor-pointer"
                    >
                      Submit OTP
                    </button>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="partner@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Full Residential Address */}
              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Full Residential Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter Partner Complete Residential Home Address, House No, Locality & Pincode..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold resize-none"
                />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span>Step 1B: Weekly Payout Bank Account Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Bank Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Bank Name & Branch
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank (Sigra Branch)"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Account Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  placeholder="50100299182711"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                />
              </div>

              {/* IFSC Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  IFSC Code
                </label>
                <input
                  type="text"
                  placeholder="HDFC0001827"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold uppercase"
                />
              </div>

              {/* UPI ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  UPI ID (Optional Instant Payout)
                </label>
                <input
                  type="text"
                  placeholder="ramesh.yadav@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Link
              href="/technicians"
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Service & Zone Setup →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ─── STEP 2 FORM: SERVICE & ZONE SETUP ─── */}
      {currentStep === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Briefcase className="w-5 h-5 text-brand-600" />
              <span>Step 2: Service Category & Zone Assignment</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Service Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Primary Service Category <span className="text-rose-500">*</span>
                </label>
                <CustomSelect
                  value={category}
                  onChange={(val) => setCategory(val)}
                  options={[
                    { value: "AC Repair", label: "AC Repair & Power Jet Wash" },
                    { value: "Electrician", label: "Electrician & Wiring" },
                    { value: "Plumbing", label: "Plumbing & Sanitary" },
                    { value: "Cleaning", label: "Full Home Deep Cleaning" },
                    { value: "Appliance Repair", label: "Appliance Repair (RO / Washing Machine)" },
                    { value: "Beauty & Spa", label: "Beauty & Wellness Spa" },
                    { value: "Painting", label: "Home Painting & Waterproofing" },
                  ]}
                />
              </div>

              {/* Designation Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Partner Designation / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master HVAC Specialist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Experience Level
                </label>
                <CustomSelect
                  value={experience}
                  onChange={(val) => setExperience(val)}
                  options={[
                    { value: "1-2 Years Junior", label: "1-2 Years Junior Technician" },
                    { value: "3-5 Years Experienced", label: "3-5 Years Experienced Technician" },
                    { value: "5+ Years Senior Specialist", label: "5+ Years Senior Specialist" },
                    { value: "10+ Years Master Expert", label: "10+ Years Master Expert" },
                  ]}
                />
              </div>

              {/* Working Locality */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Primary Varanasi Working Locality <span className="text-rose-500">*</span>
                </label>
                <CustomSelect
                  value={locality}
                  onChange={(val) => setLocality(val)}
                  options={[
                    { value: "Sigra", label: "Sigra, Varanasi" },
                    { value: "Lanka / Assi Ghat", label: "Lanka / Assi Ghat, Varanasi" },
                    { value: "Godowlia", label: "Godowlia, Varanasi" },
                    { value: "Bhelupur", label: "Bhelupur, Varanasi" },
                    { value: "Mahmoorganj", label: "Mahmoorganj, Varanasi" },
                    { value: "Shivpur", label: "Shivpur, Varanasi" },
                    { value: "Sarnath", label: "Sarnath, Varanasi" },
                    { value: "Varanasi Cantt", label: "Varanasi Cantt" },
                  ]}
                />
              </div>

              {/* Pincode */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Service Zone Pincode
                </label>
                <input
                  type="text"
                  placeholder="221002"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                />
              </div>

              {/* Helpmate Take-Rate % */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  HelpMate Commission Share % (Default 25%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-black"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
            >
              ← Back to Step 1
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: KYC, Guarantor & Police Verification →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ─── STEP 3 FORM: KYC, GUARANTOR & POLICE VERIFICATION ─── */}
      {currentStep === 3 && (
        <form onSubmit={handleStep3Submit} className="space-y-6">
          {/* Section 1: Partner Identity & Aadhaar KYC */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span>Step 3A: Partner Identity & Biometric Aadhaar KYC</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Partner Aadhaar Number */}
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Partner Aadhaar Card Number (12 Digits) <span className="text-rose-500">*</span>
                  </label>
                  {aadhaarVerified && (
                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> UIDAI Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="982341029831"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setAadhaarVerified(true)}
                    className="h-11 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs whitespace-nowrap shadow-xs cursor-pointer shrink-0 flex items-center justify-center"
                  >
                    Verify UIDAI
                  </button>
                </div>
              </div>

              {/* Partner Aadhaar Document Upload */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Upload Partner Aadhaar Card (Front & Back Copy)
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                        {aadhaarDocUploaded ? "Partner_Aadhaar_Card_Verified.pdf" : "Upload Aadhaar Front & Back PDF / Image"}
                      </span>
                      <span className="text-[11px] text-slate-500">Government UIDAI Issued Identity Document</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAadhaarDocUploaded(true)}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                  >
                    {aadhaarDocUploaded ? "Uploaded & Verified" : "Choose File"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Emergency Guarantor All Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <UserCheck className="w-5 h-5 text-purple-600" />
              <span>Step 3B: Emergency Guarantor Person Full Details & Aadhaar</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Guarantor Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Guarantor Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Chandra Yadav"
                  value={guarantorName}
                  onChange={(e) => setGuarantorName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Guarantor Relation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Guarantor Relation
                </label>
                <CustomSelect
                  value={guarantorRelation}
                  onChange={(val) => setGuarantorRelation(val)}
                  options={[
                    { value: "Father", label: "Father" },
                    { value: "Brother", label: "Brother" },
                    { value: "Mother", label: "Mother" },
                    { value: "Spouse", label: "Spouse" },
                    { value: "Uncle / Relative", label: "Uncle / Relative" },
                  ]}
                />
              </div>

              {/* Guarantor Mobile Number */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Guarantor Mobile Number
                  </label>
                  {guarantorPhoneVerified && (
                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9415000000"
                    value={guarantorPhone}
                    onChange={(e) => setGuarantorPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                  />
                  {!guarantorPhoneVerified ? (
                    <button
                      type="button"
                      onClick={handleVerifyGuarantorPhone}
                      className="h-11 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs whitespace-nowrap shadow-xs cursor-pointer shrink-0 flex items-center justify-center"
                    >
                      Verify OTP
                    </button>
                  ) : (
                    <span className="h-11 px-3 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200 shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Guarantor Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Guarantor Email Address
                </label>
                <input
                  type="email"
                  placeholder="guarantor@gmail.com"
                  value={guarantorEmail}
                  onChange={(e) => setGuarantorEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Guarantor Aadhaar Card Number */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Guarantor Aadhaar Card Number (12 Digits)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="819230491823"
                  value={guarantorAadhaar}
                  onChange={(e) => setGuarantorAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                />
              </div>

              {/* Guarantor Address */}
              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Guarantor Full Residential Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter Guarantor Complete Home Address, Locality & City..."
                  value={guarantorAddress}
                  onChange={(e) => setGuarantorAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold resize-none"
                />
              </div>

              {/* Upload Guarantor Document */}
              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Upload Guarantor Aadhaar Card Document PDF / Image
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                        {guarantorAadhaarDocUploaded ? "Guarantor_Aadhaar_Document_Verified.pdf" : "Upload Guarantor Aadhaar Card Copy"}
                      </span>
                      <span className="text-[11px] text-slate-500">Official Identity Copy of Family Guarantor</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuarantorAadhaarDocUploaded(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                  >
                    {guarantorAadhaarDocUploaded ? "Uploaded & Verified" : "Choose File"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Local Police Thana Clearance */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Step 3C: Local Police Thana Clearance NOC</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Police Station Branch Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Police Verification Station / Thana Branch Name
                </label>
                <CustomSelect
                  value={policeThanaName}
                  onChange={(val) => setPoliceThanaName(val)}
                  options={[
                    { value: "Sigra Police Station", label: "Sigra Police Station (Varanasi)" },
                    { value: "Chetganj Police Station", label: "Chetganj Thana (Varanasi)" },
                    { value: "Bhelupur Police Station", label: "Bhelupur Thana (Varanasi)" },
                    { value: "Lanka Police Station", label: "Lanka Thana (Varanasi)" },
                    { value: "Kotwali Police Station", label: "Kotwali Thana (Godowlia)" },
                    { value: "Shivpur Police Station", label: "Shivpur Thana (Varanasi)" },
                    { value: "Sarnath Police Station", label: "Sarnath Thana (Varanasi)" },
                  ]}
                />
              </div>

              {/* Certificate NOC Ref Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Police Clearance Certificate NOC Ref Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. UP-VAR-POL-2026-9812"
                  value={policeCertificateNumber}
                  onChange={(e) => setPoliceCertificateNumber(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                />
              </div>

              {/* Upload Police Document */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Upload Police Verification Certificate PDF / Image <span className="text-rose-500">*</span>
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white block">
                        {policeDocUploaded ? "Varanasi_Police_Clearance_NOC.pdf" : "Upload Police Clearance PDF / Image"}
                      </span>
                      <span className="text-[11px] text-slate-500">Issued by Varanasi Police Commissionerate</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPoliceDocUploaded(true);
                      setPoliceVerified(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs cursor-pointer"
                  >
                    {policeDocUploaded ? "Uploaded & Verified" : "Choose File"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
            >
              ← Back to Step 2
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Final Review & Submit →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ─── STEP 4: PREVIEW & SUBMIT OPTION ─── */}
      {currentStep === 4 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <span>Summary Review & Final Submission</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-mono font-bold border border-brand-200">
                Ready for Activation
              </span>
            </div>

            {/* Summary Grid 1: Personal & Bank */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-600" /> Step 1: Personal & Bank Details
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Edit Step 1
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">Partner Name</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{name || "Ramesh Kumar Yadav"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Mobile Number</span>
                  <span className="font-mono font-bold text-emerald-600">+91 {phone || "9839122401"} (Verified)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Email Address</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{email || "ramesh.yadav@gmail.com"}</span>
                </div>
                <div className="sm:col-span-3">
                  <span className="text-slate-400 font-bold block">Residential Home Address</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{address || "House 14/A, Sigra Chauraha, Varanasi, Uttar Pradesh - 221002"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Payout Bank</span>
                  <span className="font-bold text-slate-900 dark:text-white">{bankName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Account Number</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{bankAccountNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">IFSC Code</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{ifscCode}</span>
                </div>
              </div>
            </div>

            {/* Summary Grid 2: Service & Zone */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" /> Step 2: Service & Zone Setup
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Edit Step 2
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">Service Category</span>
                  <span className="font-extrabold text-brand-600 dark:text-brand-400">{category}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Designation Role</span>
                  <span className="font-bold text-slate-900 dark:text-white">{role}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Experience Level</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{experience}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Locality Zone</span>
                  <span className="font-bold text-slate-900 dark:text-white">{locality} ({pincode})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">HelpMate Take Rate</span>
                  <span className="font-mono font-bold text-emerald-600">{commissionRate}% (Partner gets {100 - Number(commissionRate)}%)</span>
                </div>
              </div>
            </div>

            {/* Summary Grid 3: KYC, Guarantor & Police */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Step 3: KYC, Guarantor & Police Clearance
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Edit Step 3
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">Partner Aadhaar UID</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{aadhaarNumber || "982341029831"} (Verified)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Guarantor Person</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{guarantorName || "Suresh Chandra Yadav"} ({guarantorRelation})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Guarantor Mobile & Aadhaar</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">+91 {guarantorPhone || "9415000000"} • UID {guarantorAadhaar || "819230491823"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Police Thana NOC</span>
                  <span className="font-bold text-emerald-600">{policeThanaName} (Pass)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">PCC Ref Token</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{policeCertificateNumber || "UP-VAR-POL-2026-9812"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
            >
              ← Back to Step 3
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? "Saving Changes..." : isEditing ? "Edit Partner" : "Add Partner"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function NewTechnicianPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs font-bold text-slate-500">Loading partner editor wizard...</div>}>
      <TechnicianFormContent />
    </Suspense>
  );
}
