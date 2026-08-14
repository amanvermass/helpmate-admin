"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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
  Layers,
  XCircle,
  Plus,
  Trash2,
  Filter,
  Check,
  X,
  FileText,
  Search,
  ChevronDown,
} from "lucide-react";

export interface CatalogServiceItem {
  id: string;
  category: string;
  subType?: string; // Split AC, Window AC, Cassette AC, RO Purifier, etc.
  type: "Repair & Troubleshooting" | "Installation & Uninstallation" | "Servicing & Deep Cleaning" | "Maintenance & AMC";
  title: string;
  price: number;
  image: string;
  desc: string;
}

export const CATEGORY_SUB_TYPES: Record<string, string[]> = {
  "AC Repair & Service": ["Split AC", "Window AC", "Cassette AC", "Tower AC"],
  "Water Purifier (RO)": ["Wall-mounted RO", "Under-sink RO", "UV+UF Purifier"],
  "Electrician & Wiring": ["Switchboard & MCB", "Inverter & Battery", "Decorative Lighting"],
  "Plumbing & Sanitary": ["Overhead Tank", "Bathroom Fittings", "Drainage Pipeline"],
  "Appliance Repair": ["Front Load Washing Machine", "Top Load Washing Machine", "Double Door Refrigerator", "Single Door Refrigerator"],
};

export const MASTER_SERVICE_CATALOG: CatalogServiceItem[] = [
  // 1. AC Service & Repair
  {
    id: "ac-srv-1",
    category: "AC Repair & Service",
    subType: "Split AC",
    type: "Servicing & Deep Cleaning",
    title: "Split AC Power Jet Servicing",
    price: 599,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80",
    desc: "High pressure water jet coil cleaning & anti-bacterial sanitization",
  },
  {
    id: "ac-srv-2",
    category: "AC Repair & Service",
    subType: "Window AC",
    type: "Servicing & Deep Cleaning",
    title: "Window AC Foam Chemical Wash",
    price: 499,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&auto=format&fit=crop&q=80",
    desc: "Deep chemical foam washing & drain tray cleaning",
  },
  {
    id: "ac-rep-1",
    category: "AC Repair & Service",
    subType: "Split AC",
    type: "Repair & Troubleshooting",
    title: "Split AC Gas Charging & Copper Brazing",
    price: 2200,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80",
    desc: "Freon R32 / R410a gas top-up & copper pipe brazing leak test",
  },
  {
    id: "ac-rep-2",
    category: "AC Repair & Service",
    subType: "Split AC",
    type: "Repair & Troubleshooting",
    title: "AC Inverter PCB Board Repair",
    price: 1499,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80",
    desc: "Microcontroller IC diagnostic & relay capacitor replacement",
  },
  {
    id: "ac-inst-1",
    category: "AC Repair & Service",
    subType: "Split AC",
    type: "Installation & Uninstallation",
    title: "Split AC Complete Wall Mount Installation",
    price: 1299,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80",
    desc: "Indoor & outdoor bracket mounting with vacuum testing",
  },
  {
    id: "ac-inst-2",
    category: "AC Repair & Service",
    subType: "Split AC",
    type: "Installation & Uninstallation",
    title: "Split AC Dismantling / Safe Uninstallation",
    price: 699,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80",
    desc: "Pump-down gas lock & safe indoor unit dismantling",
  },
  {
    id: "ac-rep-3",
    category: "AC Repair & Service",
    subType: "Window AC",
    type: "Repair & Troubleshooting",
    title: "Window AC Gas Filling & Compressor Relay",
    price: 1899,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&auto=format&fit=crop&q=80",
    desc: "Sealed compressor gas charging and thermal overload protector replacement",
  },
  {
    id: "ac-inst-3",
    category: "AC Repair & Service",
    subType: "Window AC",
    type: "Installation & Uninstallation",
    title: "Window AC Bracket & Frame Mounting",
    price: 799,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&auto=format&fit=crop&q=80",
    desc: "Heavy metal bracket fitting and wooden frame sealing",
  },
  {
    id: "ac-srv-3",
    category: "AC Repair & Service",
    subType: "Cassette AC",
    type: "Servicing & Deep Cleaning",
    title: "Cassette / Tower AC Commercial Jet Service",
    price: 1299,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80",
    desc: "Commercial 4-way cassette indoor coil jet wash & drain pump fix",
  },

  // 2. Water Purifier (RO)
  {
    id: "ro-srv-1",
    category: "Water Purifier (RO)",
    subType: "Wall-mounted RO",
    type: "Servicing & Deep Cleaning",
    title: "RO Full Filter & Membrane Replacement",
    price: 899,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4e?w=400&auto=format&fit=crop&q=80",
    desc: "Sediment, Carbon filter & RO Membrane sanitization",
  },
  {
    id: "ro-rep-1",
    category: "Water Purifier (RO)",
    subType: "Under-sink RO",
    type: "Repair & Troubleshooting",
    title: "RO Booster Pump & UV Lamp Repair",
    price: 1199,
    image: "https://images.unsplash.com/photo-1617155093730-a8bf47be792d?w=400&auto=format&fit=crop&q=80",
    desc: "Adapter SMPS replacement & solenoid valve repair",
  },

  // 3. Electrician & Wiring
  {
    id: "elec-rep-1",
    category: "Electrician & Wiring",
    subType: "Switchboard & MCB",
    type: "Repair & Troubleshooting",
    title: "MCB & Main Switchboard Tripping Repair",
    price: 299,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80",
    desc: "Short circuit detection & MCB breaker replacement",
  },
  {
    id: "elec-inst-1",
    category: "Electrician & Wiring",
    subType: "Inverter & Battery",
    type: "Installation & Uninstallation",
    title: "Heavy Inverter & Double Battery Setup",
    price: 799,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80",
    desc: "Dual battery terminal wiring & load distribution line",
  },

  // 4. Plumbing & Sanitary
  {
    id: "plumb-rep-1",
    category: "Plumbing & Sanitary",
    subType: "Overhead Tank",
    type: "Repair & Troubleshooting",
    title: "Overhead Tank Leakage & Motor Line Repair",
    price: 499,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80",
    desc: "Automatic float valve & CPVC line repair",
  },
  {
    id: "plumb-inst-1",
    category: "Plumbing & Sanitary",
    subType: "Bathroom Fittings",
    type: "Installation & Uninstallation",
    title: "Bathroom Mixer & Shower Concealed Fitting",
    price: 699,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80",
    desc: "Wall mixer fitting & high pressure overhead shower",
  },

  // 5. Appliance Repair
  {
    id: "app-rep-1",
    category: "Appliance Repair",
    subType: "Front Load Washing Machine",
    type: "Repair & Troubleshooting",
    title: "Front Load Washing Machine Drum Repair",
    price: 1299,
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&auto=format&fit=crop&q=80",
    desc: "Motor belt, spider assembly & electronic PCB fix",
  },
  {
    id: "app-rep-2",
    category: "Appliance Repair",
    subType: "Double Door Refrigerator",
    type: "Repair & Troubleshooting",
    title: "Double Door Refrigerator Gas Charging",
    price: 1899,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&auto=format&fit=crop&q=80",
    desc: "Compressor relay check & sealed system gas filling",
  },
];

export const VARANASI_PINCODE_ZONES = [
  { pincode: "221001", area: "Sigra, Luxa & Chetganj" },
  { pincode: "221002", area: "Varanasi Cantt, Nadesar & Mint House" },
  { pincode: "221003", area: "Godowlia, Chowk & Dashashwamedh Old City" },
  { pincode: "221004", area: "Mahmoorganj, Shivpur & Orderly Bazar" },
  { pincode: "221005", area: "Lanka, BHU & Assi Ghat" },
  { pincode: "221006", area: "Sarnath, Paharia & Ring Road" },
  { pincode: "221007", area: "Pandeypur, Hukulganj & Azamgarh Road" },
  { pincode: "221010", area: "Bhelupur, Sonarpura & Durgakund" },
];

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

  // ─── STEP 2 STATE: HIERARCHICAL MULTI-SELECT SERVICE & AREA-TO-AREA ZONE ───
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedSubTypeFilters, setSelectedSubTypeFilters] = useState<string[]>([]);
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]);
  
  // Search & Dropdown State
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [typeSearchQuery, setTypeSearchQuery] = useState("");
  const [subTypeSearchQuery, setSubTypeSearchQuery] = useState("");
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isSubTypeDropdownOpen, setIsSubTypeDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  // Helper to open one dropdown while closing all others
  const toggleDropdown = (name: "category" | "subType" | "type" | "service") => {
    setIsCategoryDropdownOpen(name === "category" ? !isCategoryDropdownOpen : false);
    setIsSubTypeDropdownOpen(name === "subType" ? !isSubTypeDropdownOpen : false);
    setIsTypeDropdownOpen(name === "type" ? !isTypeDropdownOpen : false);
    setIsServiceDropdownOpen(name === "service" ? !isServiceDropdownOpen : false);
  };

  const categoryRef = useRef<HTMLDivElement>(null);
  const subTypeRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isOutsideCategory = !categoryRef.current || !categoryRef.current.contains(target);
      const isOutsideSubType = !subTypeRef.current || !subTypeRef.current.contains(target);
      const isOutsideType = !typeRef.current || !typeRef.current.contains(target);
      const isOutsideService = !serviceRef.current || !serviceRef.current.contains(target);

      if (isOutsideCategory && isOutsideSubType && isOutsideType && isOutsideService) {
        setIsCategoryDropdownOpen(false);
        setIsSubTypeDropdownOpen(false);
        setIsTypeDropdownOpen(false);
        setIsServiceDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [selectedServices, setSelectedServices] = useState<CatalogServiceItem[]>([
    {
      id: "ac-srv-1",
      category: "AC Repair & Service",
      type: "Servicing & Deep Cleaning",
      title: "Split AC Power Jet Servicing",
      price: 599,
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80",
      desc: "High pressure water jet coil cleaning & anti-bacterial sanitization",
    },
    {
      id: "ac-rep-1",
      category: "AC Repair & Service",
      type: "Repair & Troubleshooting",
      title: "AC Gas Charging & Leakage Repair",
      price: 2200,
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80",
      desc: "Freon R32 / R410a gas top-up & copper pipe brazing leak test",
    },
  ]);

  // Zone Coverage: Pincode Area to Area Range
  const [fromPincode, setFromPincode] = useState("221001");
  const [toPincode, setToPincode] = useState("221005");
  const [coverageZones, setCoverageZones] = useState<string[]>([
    "Corridor: 221001 (Sigra) ➔ 221005 (Lanka)",
    "221002 - Varanasi Cantt, Nadesar & Mint House",
  ]);

  const [role, setRole] = useState("Master HVAC Specialist");
  const [experience, setExperience] = useState("5+ Years Senior Specialist");
  const [commissionRate, setCommissionRate] = useState("25");

  // ─── STEP 3 STATE: KYC, GUARANTOR & POLICE VERIFICATION ───
  // Partner KYC Aadhaar
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarDocUploaded, setAadhaarDocUploaded] = useState(false);

  // Additional Required Documents (Current Photo + Dynamic Dropdown Uploads)
  const [photoDocUploaded, setPhotoDocUploaded] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("PAN Card");
  const [additionalDocsList, setAdditionalDocsList] = useState<{ id: string; type: string; name: string }[]>([
    { id: "doc-1", type: "PAN Card", name: "Partner_PAN_Card_Copy.pdf" },
    { id: "doc-2", type: "Driving License (DL)", name: "Partner_Driving_License_Front_Back.pdf" },
  ]);

  // Emergency Guarantor Person Details (Name & Mobile Number ONLY)
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorRelation, setGuarantorRelation] = useState("Brother");
  const [guarantorPhone, setGuarantorPhone] = useState("");
  const [guarantorPhoneVerified, setGuarantorPhoneVerified] = useState(false);

  // Police Clearance Certificate
  const [policeThanaName, setPoliceThanaName] = useState("Sigra Police Station");
  const [policeCertificateNumber, setPoliceCertificateNumber] = useState("");
  const [policeDocUploaded, setPoliceDocUploaded] = useState(false);
  const [policeVerified, setPoliceVerified] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"Active" | "Pending">("Active");
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

        setRole(existingTech.role || "Master HVAC Specialist");
        setExperience("5+ Years Senior Specialist");
        setCommissionRate("25");

        setAadhaarNumber("982341029831");
        setAadhaarVerified(true);
        setAadhaarDocUploaded(true);

        setGuarantorName("Suresh Chandra Yadav");
        setGuarantorRelation("Brother");
        setGuarantorPhone("9415000000");
        setGuarantorPhoneVerified(true);

        setPhotoDocUploaded(true);
        setAdditionalDocsList([
          { id: "doc-1", type: "PAN Card", name: "Partner_PAN_Card_Copy.pdf" },
          { id: "doc-2", type: "Driving License (DL)", name: "Partner_Driving_License_Front_Back.pdf" },
        ]);

        setPoliceThanaName("Sigra Police Station");
        setPoliceCertificateNumber("UP-VAR-POL-2026-9812");
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
        <div className={`p-5 rounded-2xl text-white shadow-lg flex items-center gap-3 animate-in fade-in ${
          submitStatus === "Pending" ? "bg-amber-600" : "bg-emerald-600"
        }`}>
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <h3 className="font-extrabold text-sm">
              {submitStatus === "Pending"
                ? "Partner Profile Saved as Draft (Pending)"
                : isEditing
                ? "Partner Profile Updated & Approved!"
                : "Partner Approved & Activated Successfully!"}
            </h3>
            <p className="text-xs opacity-90">Redirecting to partner directory...</p>
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

      {/* ─── STEP 2 FORM: HIERARCHICAL MULTI-SELECT SERVICE & AREA-TO-AREA ZONE ─── */}
      {currentStep === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-6 animate-in fade-in">
          {/* SECTION 2A: SEARCHABLE CATEGORY & MULTI-SELECT SPECIFIC SERVICES (WITH IMAGES) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-600" />
                <span>Step 2A: Service Category & Specific Services</span>
              </h3>
              <span className="text-xs font-bold text-slate-500">
                {selectedServices.length} Services Selected
              </span>
            </div>

            {/* Grid for Searchable Dropdowns (1. Category, 2. System Type, 3. Service Action) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Category Dropdown with Search */}
              <div ref={categoryRef} className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                  1. Service Category *
                </label>
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={selectedCategoryFilter === "All" ? "Search Category (e.g. AC Repair, RO, Plumbing)..." : `Selected: ${selectedCategoryFilter}`}
                      value={isCategoryDropdownOpen ? categorySearchQuery : (categorySearchQuery || (selectedCategoryFilter === "All" ? "" : selectedCategoryFilter))}
                      onChange={(e) => {
                        setCategorySearchQuery(e.target.value);
                        if (!isCategoryDropdownOpen) toggleDropdown("category");
                      }}
                      onFocus={() => {
                        setCategorySearchQuery("");
                        toggleDropdown("category");
                      }}
                      className={`w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand-500 ${
                        selectedCategoryFilter !== "All" && !isCategoryDropdownOpen ? "border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 text-brand-700 dark:text-brand-300" : ""
                      }`}
                    />
                    {selectedCategoryFilter !== "All" || categorySearchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategoryFilter("All");
                          setSelectedSubTypeFilters([]);
                          setCategorySearchQuery("");
                          toggleDropdown("category");
                        }}
                        className="absolute right-3.5 text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                        title="Clear Category"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setCategorySearchQuery("");
                          toggleDropdown("category");
                        }}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto p-1.5 space-y-1">
                      {["All", "AC Repair & Service", "Water Purifier (RO)", "Electrician & Wiring", "Plumbing & Sanitary", "Appliance Repair"]
                        .filter((cat) => cat.toLowerCase().includes(categorySearchQuery.toLowerCase()))
                        .map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategoryFilter(cat);
                              setSelectedSubTypeFilters([]);
                              setCategorySearchQuery("");
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                              selectedCategoryFilter === cat
                                ? "bg-brand-600 text-white"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span>{cat === "All" ? "All Categories" : cat}</span>
                            {selectedCategoryFilter === cat && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. System Type (MULTI-SELECT & DYNAMIC BY CATEGORY) */}
              <div ref={subTypeRef} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                    2. System Type {selectedCategoryFilter !== "All" ? `(${selectedCategoryFilter.split(" ")[0]})` : "(Select Category First)"}
                  </label>
                  {selectedSubTypeFilters.length > 0 && (
                    <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      {selectedSubTypeFilters.length} Selected
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      disabled={selectedCategoryFilter === "All"}
                      placeholder={
                        selectedCategoryFilter === "All"
                          ? "Select Category First..."
                          : selectedSubTypeFilters.length === 0
                          ? `Search System Type (${CATEGORY_SUB_TYPES[selectedCategoryFilter]?.[0] || "Split AC"})...`
                          : `${selectedSubTypeFilters.length} System Types Selected`
                      }
                      value={isSubTypeDropdownOpen ? subTypeSearchQuery : (subTypeSearchQuery || selectedSubTypeFilters.join(", "))}
                      onChange={(e) => {
                        if (selectedCategoryFilter === "All") return;
                        setSubTypeSearchQuery(e.target.value);
                        if (!isSubTypeDropdownOpen) toggleDropdown("subType");
                      }}
                      onFocus={() => {
                        if (selectedCategoryFilter === "All") return;
                        setSubTypeSearchQuery("");
                        toggleDropdown("subType");
                      }}
                      className={`w-full h-11 pl-10 pr-10 rounded-xl border text-xs font-bold transition-all outline-none ${
                        selectedCategoryFilter === "All"
                          ? "bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-60"
                          : selectedSubTypeFilters.length > 0 && !isSubTypeDropdownOpen
                          ? "border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 cursor-pointer font-extrabold"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer focus:border-brand-500"
                      }`}
                    />
                    {selectedCategoryFilter !== "All" && (selectedSubTypeFilters.length > 0 || subTypeSearchQuery) ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubTypeFilters([]);
                          setSubTypeSearchQuery("");
                          toggleDropdown("subType");
                        }}
                        className="absolute right-3.5 text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                        title="Clear All System Types"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={selectedCategoryFilter === "All"}
                        onClick={() => {
                          if (selectedCategoryFilter === "All") return;
                          setSubTypeSearchQuery("");
                          toggleDropdown("subType");
                        }}
                        className={`absolute right-3.5 text-slate-400 ${selectedCategoryFilter === "All" ? "cursor-not-allowed opacity-50" : "hover:text-slate-600 cursor-pointer"}`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isSubTypeDropdownOpen && selectedCategoryFilter !== "All" && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 max-h-56 overflow-y-auto p-1.5 space-y-1">
                      <button
                        type="button"
                        onClick={() => setSelectedSubTypeFilters([])}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                          selectedSubTypeFilters.length === 0
                            ? "bg-amber-600 text-white"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>All System Types ({selectedCategoryFilter.split(" ")[0]})</span>
                        {selectedSubTypeFilters.length === 0 && <Check className="w-4 h-4" />}
                      </button>

                      {(CATEGORY_SUB_TYPES[selectedCategoryFilter] || [])
                        .filter((sub) => sub.toLowerCase().includes(subTypeSearchQuery.toLowerCase()))
                        .map((sub) => {
                          const isSelected = selectedSubTypeFilters.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedSubTypeFilters(selectedSubTypeFilters.filter((s) => s !== sub));
                                } else {
                                  setSelectedSubTypeFilters([...selectedSubTypeFilters, sub]);
                                }
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-amber-500 text-white"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? "border-white bg-white text-amber-600" : "border-slate-300 dark:border-slate-600"}`}>
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>{sub}</span>
                              </div>
                              <span className="text-[10px] opacity-80">{isSelected ? "Selected" : "+ Select"}</span>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Service Action Dropdown (MULTI-SELECT) */}
              <div ref={typeRef} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                    3. Service Action
                  </label>
                  {selectedTypeFilters.length > 0 && (
                    <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                      {selectedTypeFilters.length} Selected
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={selectedTypeFilters.length === 0 ? "Search Action (Repair, Install, Service)..." : `${selectedTypeFilters.length} Actions Selected`}
                      value={isTypeDropdownOpen ? typeSearchQuery : (typeSearchQuery || selectedTypeFilters.join(", "))}
                      onChange={(e) => {
                        setTypeSearchQuery(e.target.value);
                        if (!isTypeDropdownOpen) toggleDropdown("type");
                      }}
                      onFocus={() => {
                        setTypeSearchQuery("");
                        toggleDropdown("type");
                      }}
                      className={`w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand-500 ${
                        selectedTypeFilters.length > 0 && !isTypeDropdownOpen ? "border-purple-500 bg-purple-50/30 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 font-extrabold" : ""
                      }`}
                    />
                    {selectedTypeFilters.length > 0 || typeSearchQuery ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTypeFilters([]);
                          setTypeSearchQuery("");
                          toggleDropdown("type");
                        }}
                        className="absolute right-3.5 text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                        title="Clear All Actions"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setTypeSearchQuery("");
                          toggleDropdown("type");
                        }}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isTypeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto p-1.5 space-y-1">
                      <button
                        type="button"
                        onClick={() => setSelectedTypeFilters([])}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                          selectedTypeFilters.length === 0
                            ? "bg-purple-600 text-white"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>All Service Actions</span>
                        {selectedTypeFilters.length === 0 && <Check className="w-4 h-4" />}
                      </button>

                      {["Repair & Troubleshooting", "Servicing & Deep Cleaning", "Installation", "Uninstallation", "Maintenance & AMC"]
                        .filter((t) => t.toLowerCase().includes(typeSearchQuery.toLowerCase()))
                        .map((type) => {
                          const isSelected = selectedTypeFilters.includes(type);
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedTypeFilters(selectedTypeFilters.filter((t) => t !== type));
                                } else {
                                  setSelectedTypeFilters([...selectedTypeFilters, type]);
                                }
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? "bg-purple-600 text-white"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? "border-white bg-white text-purple-600" : "border-slate-300 dark:border-slate-600"}`}>
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span>{type}</span>
                              </div>
                              <span className="text-[10px] opacity-80">{isSelected ? "Selected" : "+ Select"}</span>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. SEARCHABLE MULTI-SELECT SPECIFIC SERVICES DROPDOWN (WITH IMAGES) */}
            <div ref={serviceRef} className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-brand-600" />
                  <span>Select Services (Dropdown with Images) *</span>
                </label>
                <span className="text-xs font-mono font-bold text-brand-600">
                  {selectedServices.length} Selected Services
                </span>
              </div>

              {/* Searchable Services Dropdown Input */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-brand-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search & Select Specific Services (e.g. Power Jet wash, RO Filter, PCB, Motor)..."
                    value={serviceSearchQuery}
                    onChange={(e) => {
                      setServiceSearchQuery(e.target.value);
                      if (!isServiceDropdownOpen) toggleDropdown("service");
                    }}
                    onFocus={() => {
                      setServiceSearchQuery("");
                      toggleDropdown("service");
                    }}
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-2xs"
                  />
                  {serviceSearchQuery ? (
                    <button
                      type="button"
                      onClick={() => setServiceSearchQuery("")}
                      className="absolute right-3.5 text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setServiceSearchQuery("");
                        toggleDropdown("service");
                      }}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Floating Searchable Services Dropdown List with Thumbnail Images */}
                {isServiceDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-40 max-h-80 overflow-y-auto p-2 space-y-1.5">
                    {MASTER_SERVICE_CATALOG.filter((item) => {
                      if (selectedCategoryFilter !== "All" && item.category !== selectedCategoryFilter) return false;
                      if (selectedSubTypeFilters.length > 0 && item.subType && !selectedSubTypeFilters.includes(item.subType)) return false;
                      if (selectedTypeFilters.length > 0) {
                        const matchesAction = selectedTypeFilters.some((act) => {
                          if (act === "Installation") return item.title.toLowerCase().includes("installation") || item.type.includes("Installation");
                          if (act === "Uninstallation") return item.title.toLowerCase().includes("uninstallation") || item.title.toLowerCase().includes("dismantling");
                          return item.type === act;
                        });
                        if (!matchesAction) return false;
                      }
                      if (!serviceSearchQuery.trim()) return true;
                      const q = serviceSearchQuery.toLowerCase();
                      return (
                        item.title.toLowerCase().includes(q) ||
                        item.category.toLowerCase().includes(q) ||
                        item.type.toLowerCase().includes(q) ||
                        (item.subType && item.subType.toLowerCase().includes(q)) ||
                        item.desc.toLowerCase().includes(q)
                      );
                    }).map((item) => {
                      const isSelected = selectedServices.some((s) => s.id === item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedServices(selectedServices.filter((s) => s.id !== item.id));
                            } else {
                              setSelectedServices([...selectedServices, item]);
                            }
                          }}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                            isSelected
                              ? "bg-brand-50 dark:bg-brand-950/60 border-brand-300 dark:border-brand-800"
                              : "bg-slate-50/60 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                                  {item.title}
                                </h4>
                                {item.subType && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[9px] font-black shrink-0">
                                    {item.subType}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 font-semibold truncate">
                                {item.category} • <span className="text-brand-600 dark:text-brand-400">{item.type}</span>
                              </p>
                              <span className="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400">
                                ₹{item.price.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0">
                            <span
                              className={`px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1 ${
                                isSelected
                                  ? "bg-brand-600 text-white shadow-xs"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Selected</span>
                                </>
                              ) : (
                                <span>+ Select</span>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 4. SELECTED SERVICES SHOWN AT THE BOTTOM */}
            {selectedServices.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 pt-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Selected Services at Bottom ({selectedServices.length}):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedServices([])}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={srv.image}
                          alt={srv.title}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                            {srv.title}
                          </h5>
                          <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold block">
                            {srv.type} • ₹{srv.price}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedServices(selectedServices.filter((s) => s.id !== srv.id))}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer shrink-0"
                        title="Remove Service"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2B: PINCODE AREA-TO-AREA ZONE COVERAGE */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span>Step 2B: Operating Zone & Pincode Area to Area Coverage</span>
            </h3>

            {/* Pincode Range Selector (From Area to To Area) */}
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 space-y-4">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                Define Service Route / Pincode Area to Area Corridor Range:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    From Pincode Area *
                  </label>
                  <CustomSelect
                    value={fromPincode}
                    onChange={(val) => setFromPincode(val)}
                    options={VARANASI_PINCODE_ZONES.map((z) => ({
                      value: z.pincode,
                      label: `${z.pincode} - ${z.area}`,
                    }))}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    To Pincode Area *
                  </label>
                  <CustomSelect
                    value={toPincode}
                    onChange={(val) => setToPincode(val)}
                    options={VARANASI_PINCODE_ZONES.map((z) => ({
                      value: z.pincode,
                      label: `${z.pincode} - ${z.area}`,
                    }))}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const fromObj = VARANASI_PINCODE_ZONES.find((z) => z.pincode === fromPincode);
                    const toObj = VARANASI_PINCODE_ZONES.find((z) => z.pincode === toPincode);
                    const corridorLabel = `Corridor: ${fromPincode} (${fromObj?.area.split(",")[0]}) ➔ ${toPincode} (${toObj?.area.split(",")[0]})`;
                    if (!coverageZones.includes(corridorLabel)) {
                      setCoverageZones([...coverageZones, corridorLabel]);
                    }
                  }}
                  className="h-11 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Coverage Corridor</span>
                </button>
              </div>
            </div>

            {/* Individual Varanasi Pincode Area Multi-Select Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                Or Toggle Individual Varanasi Pincode Areas:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {VARANASI_PINCODE_ZONES.map((zone) => {
                  const zoneLabel = `${zone.pincode} - ${zone.area}`;
                  const isChecked = coverageZones.includes(zoneLabel);

                  return (
                    <button
                      key={zone.pincode}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setCoverageZones(coverageZones.filter((z) => z !== zoneLabel));
                        } else {
                          setCoverageZones([...coverageZones, zoneLabel]);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs font-semibold ${
                        isChecked
                          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-slate-900 dark:text-white"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold text-brand-600 block">{zone.pincode}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{zone.area}</span>
                      </div>
                      <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${isChecked ? "bg-rose-600 text-white" : "border border-slate-300"}`}>
                        {isChecked ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Coverage Zones List */}
            {coverageZones.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  Assigned Operating Zones & Corridors ({coverageZones.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {coverageZones.map((z, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center gap-2 shadow-2xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{z}</span>
                      <button
                        type="button"
                        onClick={() => setCoverageZones(coverageZones.filter((item) => item !== z))}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  HelpMate Take-Rate % (Default 25%)
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

      {/* ─── STEP 3 FORM: KYC, GUARANTOR & ADDITIONAL DOCUMENT UPLOADS ─── */}
      {currentStep === 3 && (
        <form onSubmit={handleStep3Submit} className="space-y-6">
          {/* Section 3A: Partner Identity & Aadhaar Both Sides KYC */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              <span>Step 3A: Partner Identity & Aadhaar KYC (Both Sides Copy)</span>
            </h3>

            {/* Side by Side Row for Aadhaar Number and Both Sides Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
              {/* Left: Partner Aadhaar Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Partner Aadhaar Card Number (12 Digits) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="982341029831"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-mono font-bold"
                />
              </div>

              {/* Right: Upload Aadhaar Both Sides (Front & Back Copy) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Upload Aadhaar Card (Both Sides - Front & Back Copy) <span className="text-rose-500">*</span>
                </label>
                <div className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {aadhaarDocUploaded ? "✓ Partner_Aadhaar_Both_Sides.pdf" : "Upload Both Sides (Front & Back)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAadhaarDocUploaded(!aadhaarDocUploaded)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      aadhaarDocUploaded
                        ? "bg-emerald-600 text-white"
                        : "bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
                    }`}
                  >
                    {aadhaarDocUploaded ? "Uploaded" : "Choose File"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3B: Emergency Guarantor Person Details (ONLY NAME & MOBILE NUMBER) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <UserCheck className="w-5 h-5 text-purple-600" />
              <span>Step 3B: Emergency Guarantor Name & Mobile Number</span>
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
                    Guarantor Mobile Number <span className="text-rose-500">*</span>
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
            </div>
          </div>

          {/* Section 3C: Additional Verification Documents (Passport Photo First & Dropdown Document Selector) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileCheck className="w-5 h-5 text-amber-600" />
              <span>Step 3C: Additional Verification Documents (Photo & Selectable ID Documents)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. FIRST: CURRENT PASSPORT SIZE PHOTO */}
              <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>1. Current Passport Size Photo *</span>
                  </span>
                  {photoDocUploaded && (
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ Uploaded
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Upload latest clear passport size photograph for technician official ID badge.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPhotoDocUploaded(!photoDocUploaded)}
                    className={`w-full h-10 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      photoDocUploaded
                        ? "bg-emerald-600 text-white"
                        : "bg-brand-600 hover:bg-brand-700 text-white shadow-xs"
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{photoDocUploaded ? "Passport Photo Uploaded" : "Upload Passport Photo"}</span>
                  </button>
                </div>
              </div>

              {/* 2. SECOND: SELECTABLE DOCUMENT TYPE DROPDOWN & UPLOAD */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>2. Select Document Type to Upload *</span>
                </span>
                
                <div className="space-y-2">
                  <CustomSelect
                    value={selectedDocType}
                    onChange={(val) => setSelectedDocType(val)}
                    options={[
                      { value: "PAN Card", label: "PAN Card Copy" },
                      { value: "Driving License (DL)", label: "Driving License (DL) Both Sides" },
                      { value: "Voter ID Card", label: "Voter Identity Card" },
                      { value: "Bank Passbook / Cheque", label: "Bank Passbook / Cancelled Cheque" },
                      { value: "Police Verification Certificate", label: "Police Thana NOC Certificate" },
                      { value: "Other Government ID", label: "Other Government Issued Certificate" },
                    ]}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const newDoc = {
                        id: `doc-${Date.now()}`,
                        type: selectedDocType,
                        name: `Partner_${selectedDocType.replace(/[^a-zA-Z0-9]/g, "_")}_Doc.pdf`,
                      };
                      if (!additionalDocsList.some((d) => d.type === selectedDocType)) {
                        setAdditionalDocsList([...additionalDocsList, newDoc]);
                      }
                    }}
                    className="w-full h-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Selected ({selectedDocType})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List of Uploaded Documents via Dropdown */}
            {additionalDocsList.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  Uploaded Additional Verification Documents ({additionalDocsList.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {additionalDocsList.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 shrink-0">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">
                            {doc.type}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold block truncate">
                            ✓ {doc.name}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdditionalDocsList(additionalDocsList.filter((d) => d.id !== doc.id))}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer shrink-0"
                        title="Remove Document"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar: Navigate to Step 4 Final Review */}
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
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" /> Step 2: Multi-Select Service Capabilities & Zone Coverage
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Edit Step 2
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1.5">
                    Selected Service Capabilities ({selectedServices.length} Services):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.map((srv) => (
                      <span
                        key={srv.id}
                        className="pl-1.5 pr-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold flex items-center gap-1.5 shadow-2xs"
                      >
                        <img src={srv.image} alt={srv.title} className="w-5 h-5 rounded-md object-cover" />
                        <span>{srv.title} ({srv.type} • ₹{srv.price})</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-slate-400 font-bold block mb-1.5">
                    Pincode Area to Area Zone Coverage ({coverageZones.length} Zones/Corridors):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {coverageZones.map((z, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white flex items-center gap-1.5"
                      >
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{z}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400 font-bold block">Designation Role</span>
                    <span className="font-bold text-slate-900 dark:text-white">{role}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">HelpMate Take Rate</span>
                    <span className="font-mono font-bold text-emerald-600">{commissionRate}% (Partner gets {100 - Number(commissionRate)}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Grid 3: KYC, Guarantor & Document Uploads */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Step 3: Identity KYC, Guarantor & Uploaded Documents
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
                  <span className="text-slate-400 font-bold block">Aadhaar UID & Both Sides Copy</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{aadhaarNumber || "982341029831"} ({aadhaarDocUploaded ? "✓ Both Sides Uploaded" : "Saved"})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Guarantor Person</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{guarantorName || "Suresh Chandra Yadav"} ({guarantorRelation})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Guarantor Mobile</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">+91 {guarantorPhone || "9415000000"}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Current Passport Photo</span>
                  <span className={`font-extrabold ${photoDocUploaded ? "text-emerald-600" : "text-slate-400"}`}>{photoDocUploaded ? "✓ Profile Photo Attached" : "Not Provided"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-bold block">Uploaded Additional Documents ({additionalDocsList.length})</span>
                  <span className="font-bold text-emerald-600">
                    {additionalDocsList.length > 0 ? additionalDocsList.map((d) => d.type).join(", ") : "None Uploaded"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons with Save as Draft & Approve Options */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs transition-all cursor-pointer"
            >
              ← Back to Step 3
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* SAVE AS DRAFT BUTTON */}
              <button
                type="button"
                onClick={(e) => {
                  setSubmitStatus("Pending");
                  handleFinalSubmit(e as any);
                }}
                disabled={isSubmitting}
                className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-extrabold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Save as Draft</span>
              </button>

              {/* APPROVED / ACTIVATED PARTNER BUTTON */}
              <button
                type="button"
                onClick={(e) => {
                  setSubmitStatus("Active");
                  handleFinalSubmit(e as any);
                }}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Approve & Activate Partner</span>
              </button>
            </div>
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
