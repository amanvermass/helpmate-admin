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
  FileText,
  MapPin,
  Building,
  Briefcase,
  Upload,
  ArrowRight,
  Wallet,
  FileCheck,
  ChevronRight,
} from "lucide-react";

function TechnicianFormContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id") || searchParams.get("edit");
  const isEditing = pathname.includes("/edit") || Boolean(editId);

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Step 1 State: Partner Personal KYC Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [showPhoneOtpInput, setShowPhoneOtpInput] = useState(false);

  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarDocUploaded, setAadhaarDocUploaded] = useState(false);

  // Step 1 State: Emergency Guarantor Details & Upload
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorPhone, setGuarantorPhone] = useState("");
  const [guarantorPhoneVerified, setGuarantorPhoneVerified] = useState(false);
  const [guarantorEmail, setGuarantorEmail] = useState("");
  const [guarantorAddress, setGuarantorAddress] = useState("");
  const [guarantorAadhaar, setGuarantorAadhaar] = useState("");
  const [guarantorAadhaarDocUploaded, setGuarantorAadhaarDocUploaded] = useState(false);

  // Step 1 State: Police Clearance Verification Details & Upload
  const [policeThanaName, setPoliceThanaName] = useState("Sigra Police Station");
  const [policeCertificateNumber, setPoliceCertificateNumber] = useState("");
  const [policeIssueDate, setPoliceIssueDate] = useState("");
  const [policeDocUploaded, setPoliceDocUploaded] = useState(false);
  const [policeVerified, setPoliceVerified] = useState(false);

  // Step 2 State: Category, Zone & Bank Setup
  const [category, setCategory] = useState("AC Repair");
  const [role, setRole] = useState("Master Specialist");
  const [locality, setLocality] = useState("Sigra");
  const [pincode, setPincode] = useState("221002");
  const [commissionRate, setCommissionRate] = useState("25");
  const [bankName, setBankName] = useState("HDFC Bank (Sigra Branch)");
  const [bankAccountNumber, setBankAccountNumber] = useState("50100299182711");
  const [ifscCode, setIfscCode] = useState("HDFC0001827");
  const [upiId, setUpiId] = useState("");

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
        setEmailVerified(true);
        setAadhaarNumber("982341029831");
        setAadhaarVerified(true);
        setAadhaarDocUploaded(true);

        setGuarantorName("Suresh Chandra Yadav (Brother)");
        setGuarantorPhone("9415000000");
        setGuarantorPhoneVerified(true);
        setGuarantorEmail("suresh.yadav@gmail.com");
        setGuarantorAddress("House 42/B, Sigra Chauraha, Varanasi, UP");
        setGuarantorAadhaar("819230491823");
        setGuarantorAadhaarDocUploaded(true);

        setPoliceThanaName("Sigra Police Station");
        setPoliceCertificateNumber("UP-VAR-POL-2026-9812");
        setPoliceIssueDate("2026-01-15");
        setPoliceDocUploaded(true);
        setPoliceVerified(true);

        setCategory(existingTech.category || "AC Repair");
        setRole(existingTech.role || "Master HVAC Specialist");
        setLocality(existingTech.locality ? existingTech.locality.split(",")[0] : "Sigra");
        setPincode(existingTech.pincode || "221002");
        setCommissionRate("25");
        setBankName("HDFC Bank (Sigra Branch)");
        setBankAccountNumber("50100299182711");
        setIfscCode("HDFC0001827");
        setUpiId(`${existingTech.name.toLowerCase().replace(/\s+/g, ".")}@okhdfcbank`);
      }
    }
  }, [editId]);

  // OTP & Document Verification Simulation Handlers
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

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter Partner Name.");
    if (!phone.trim()) return alert("Please enter Mobile Number.");
    setCurrentStep(2);
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
      {/* Top Header & Breadcrumb */}
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
              <span className="text-brand-600 dark:text-brand-400 font-extrabold">New Partner Onboarding</span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mt-1">
            <UserCheck className="w-6 h-6 text-brand-600" />
            <span>{isEditing ? `Edit Partner Profile` : "Manual Partner Onboarding Wizard"}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {isEditing
              ? "Editing existing partner details. All KYC, Guarantor, Police Verification and Bank payout details are pre-filled below."
              : "Register new HelpMate service partner with KYC, Guarantor & Police Verification (Step 1) and Category & Zone Setup (Step 2)."}
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

      {/* 2-STEP STEPPER HEADER */}
      <div className="grid grid-cols-2 gap-4">
        {/* Step 1 Pill */}
        <div
          onClick={() => setCurrentStep(1)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 1
              ? "bg-brand-600 text-white border-brand-600 shadow-md"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-brand-300"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
              currentStep === 1
                ? "bg-white text-brand-700"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            1
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider block">Step 1</span>
            <span className="font-bold text-sm">KYC, Guarantor & Police Verification</span>
          </div>
        </div>

        {/* Step 2 Pill */}
        <div
          onClick={() => {
            if (name && phone) setCurrentStep(2);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 2
              ? "bg-brand-600 text-white border-brand-600 shadow-md"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-brand-300"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
              currentStep === 2
                ? "bg-white text-brand-700"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            2
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider block">Step 2</span>
            <span className="font-bold text-sm">Category & Service Zone</span>
          </div>
        </div>
      </div>

      {/* STEP 1 FORM: KYC, GUARANTOR DETAILS & POLICE VERIFICATION */}
      {currentStep === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-6">
          {/* Section 1: Partner Personal & Identity Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span>1. Partner Personal Identity & Biometric KYC</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <div className="h-5 flex items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Yadav"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Mobile Number + OTP */}
              <div className="space-y-1.5">
                <div className="h-5 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  {phoneVerified && (
                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> OTP Verified
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Gmail / Email Address
                </label>
                <input
                  type="email"
                  placeholder="partner@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Aadhaar Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Aadhaar Card Number (12 Digits)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="123456789012"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                />
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

          {/* Section 2: Emergency Guarantor Details & Document Upload */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <UserCheck className="w-5 h-5 text-purple-600" />
              <span>2. Emergency Guarantor Details & Aadhaar Upload</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Guarantor Name */}
              <div className="space-y-1.5">
                <div className="h-5 flex items-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Suresh Chandra Yadav (Brother / Relative)"
                  value={guarantorName}
                  onChange={(e) => setGuarantorName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Guarantor Mobile Number */}
              <div className="space-y-1.5">
                <div className="h-5 flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number
                  </label>
                  {guarantorPhoneVerified && (
                    <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> OTP Verified
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
              </div>

              {/* Guarantor Gmail / Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Guarantor Gmail / Email Address
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
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Guarantor Aadhaar Card Number
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="123456789012"
                  value={guarantorAadhaar}
                  onChange={(e) => setGuarantorAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                />
              </div>

              {/* Guarantor Residential Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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

              {/* Guarantor Aadhaar Document Upload */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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

          {/* Section 3: Police Clearance Verification Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>3. Local Police Thana Clearance & Document Upload</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Police Station Branch Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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

              {/* Issue Date */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Certificate Issued Date
                </label>
                <input
                  type="date"
                  value={policeIssueDate}
                  onChange={(e) => setPoliceIssueDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              {/* Police Clearance Document Upload */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
              <span>Next: Category & Service Zone Setup →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2 FORM: CATEGORY, ZONE & BANK SETUP */}
      {currentStep === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          {/* Section 1: Service Category & Working Zone */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Briefcase className="w-5 h-5 text-brand-600" />
              <span>Step 2: Service Category & Working Zone Assignment</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Service Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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

              {/* Working Locality */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  HelpMate Commission Share % (Default 25%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-36 h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-black"
                  />
                  <span className="text-xs text-slate-500 font-semibold">
                    Partner keeps <strong>{100 - Number(commissionRate || 25)}%</strong> of gross booking revenue.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payout Bank Account Details */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span>Weekly Payout Bank Account Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Bank Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
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
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
            >
              ← Back to Step 1
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? "Saving Changes..." : isEditing ? "Update Partner & Save Changes" : "Complete Onboarding & Activate Partner"}</span>
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
