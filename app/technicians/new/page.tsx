"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { initialTechnicians, varanasiLocalities } from "@/lib/mockData";
import { CustomSelect } from "@/components/CustomSelect";
import { Portal } from "@/components/Portal";
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

  // Pincode Service Areas (Multi-select)
  const [customPincodeInput, setCustomPincodeInput] = useState("");
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [modalCustomPincode, setModalCustomPincode] = useState("");
  const [modalCustomArea, setModalCustomArea] = useState("");
  const [coverageZones, setCoverageZones] = useState<string[]>([
    "221001 - Sigra, Luxa & Chetganj",
    "221002 - Varanasi Cantt, Nadesar & Mint House",
    "221005 - Lanka, BHU & Assi Ghat",
  ]);

  const handleAddCustomPincode = () => {
    if (!customPincodeInput.trim()) return;
    const pin = customPincodeInput.trim();
    const pinLabel = pin.length === 6 ? `${pin} - Custom Area` : pin;
    if (!coverageZones.includes(pinLabel)) {
      setCoverageZones([...coverageZones, pinLabel]);
    }
    setCustomPincodeInput("");
  };

  const [role, setRole] = useState("AC Technician");
  const [experience, setExperience] = useState("5+ Years Specialist");
  const [commissionRate, setCommissionRate] = useState("25");

  // ─── STEP 3 STATE: KYC, GUARANTOR & POLICE VERIFICATION ───
  // File Input Refs
  const aadhaarFileInputRef = useRef<HTMLInputElement>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);
  const docTypeFileInputRef = useRef<HTMLInputElement>(null);

  // Partner KYC Aadhaar
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarDocUploaded, setAadhaarDocUploaded] = useState(false);
  const [aadhaarFileName, setAadhaarFileName] = useState("");

  // Additional Required Documents (Current Photo + Dynamic Dropdown Uploads)
  const [photoDocUploaded, setPhotoDocUploaded] = useState(false);
  const [photoFileName, setPhotoFileName] = useState("");
  const [passportPhotoPreview, setPassportPhotoPreview] = useState<string | null>(null);
  const [selectedDocType, setSelectedDocType] = useState("PAN Card");
  const [additionalDocsList, setAdditionalDocsList] = useState<{ id: string; type: string; name: string }[]>([]);

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
        setPassportPhotoPreview("https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&auto=format&fit=crop&q=80");
        setAdditionalDocsList([
          { id: "doc-1", type: "PAN Card", name: "Partner_PAN_Card_Copy.pdf" },
          { id: "doc-2", type: "Driving License", name: "Partner_Driving_License_Front_Back.pdf" },
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
            <span className="font-extrabold text-xs truncate block">Services & Pincodes</span>
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
            <span className="font-extrabold text-xs truncate block">Documents & KYC</span>
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
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">Step 4</span>
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
                      className="h-11 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-extrabold text-xs border border-blue-200 dark:border-blue-800 whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-2xs"
                    >
                      Verify OTP
                    </button>
                  ) : (
                    <span className="h-11 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-xs border border-emerald-200 dark:border-emerald-800 shrink-0 flex items-center gap-1">
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
                      className="w-32 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 text-xs font-mono font-bold text-slate-900 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmPhoneOtp}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200 font-extrabold text-xs border border-amber-300 dark:border-amber-700 transition-colors cursor-pointer"
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
                    <span className="text-[10px] font-extrabold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
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
                          ? "border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 text-brand-900 dark:text-brand-300 cursor-pointer font-extrabold"
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
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
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
                            ? "bg-brand-600 text-white"
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
                                  ? "bg-brand-600 text-white"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? "border-white bg-white text-brand-600" : "border-slate-300 dark:border-slate-600"}`}>
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
                    <span className="text-[10px] font-extrabold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
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
                        selectedTypeFilters.length > 0 && !isTypeDropdownOpen ? "border-brand-500 bg-brand-50/30 dark:bg-brand-950/20 text-brand-900 dark:text-brand-300 font-extrabold" : ""
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
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
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
                            ? "bg-brand-600 text-white"
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
                                  ? "bg-brand-600 text-white"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? "border-white bg-white text-brand-600" : "border-slate-300 dark:border-slate-600"}`}>
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
            <div ref={serviceRef} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                  4. Select Specific Services
                </label>
                <span className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400">
                  {selectedServices.length} Services Added
                </span>
              </div>

              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search specific service (e.g. Split AC Power Jet, RO Membrane, Wiring Tripping)..."
                    value={isServiceDropdownOpen ? serviceSearchQuery : (serviceSearchQuery || (selectedServices.length > 0 ? `${selectedServices.length} Services Selected` : ""))}
                    onChange={(e) => {
                      setServiceSearchQuery(e.target.value);
                      if (!isServiceDropdownOpen) toggleDropdown("service");
                    }}
                    onFocus={() => {
                      setServiceSearchQuery("");
                      toggleDropdown("service");
                    }}
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-brand-500 shadow-2xs"
                  />
                  {serviceSearchQuery ? (
                    <button
                      type="button"
                      onClick={() => setServiceSearchQuery("")}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
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
                                  <span className="px-1.5 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-[9px] font-black shrink-0">
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
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-700 hover:underline"
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
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer shrink-0"
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

          {/* SECTION 2B: PINCODE SERVICE AREAS (MULTI-SELECT) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            {/* Header with Add Pincode Button In-Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <span>Step 2B: Service Areas & Pincodes</span>
              </h3>

              <button
                type="button"
                onClick={() => setIsPincodeModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-extrabold text-xs shrink-0 cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Pincode & Location</span>
              </button>
            </div>

            {/* Multi-Select Pincode Grid (Includes All Added Pincodes) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                  Select Pincodes Served (Click to Select / Deselect):
                </label>
                <span className="text-xs font-mono font-bold text-brand-600">
                  {coverageZones.length} Pincodes Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {(() => {
                  // Combine default VARANASI_PINCODE_ZONES + any custom added pincodes from coverageZones
                  const customPincodeZones = coverageZones
                    .filter((z) => {
                      const pinPart = z.split(" - ")[0];
                      return !VARANASI_PINCODE_ZONES.some((v) => v.pincode === pinPart);
                    })
                    .map((z) => {
                      const parts = z.split(" - ");
                      return {
                        pincode: parts[0],
                        area: parts[1] || "Varanasi Area",
                      };
                    });

                  const combinedZones = [...VARANASI_PINCODE_ZONES, ...customPincodeZones];

                  return combinedZones.map((zone) => {
                    const zoneLabel = `${zone.pincode} - ${zone.area}`;
                    const isChecked = coverageZones.some((z) => z.includes(zone.pincode));

                    return (
                      <button
                        key={zone.pincode}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setCoverageZones(coverageZones.filter((z) => !z.includes(zone.pincode)));
                          } else {
                            setCoverageZones([...coverageZones, zoneLabel]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs font-semibold ${
                          isChecked
                            ? "bg-brand-50 dark:bg-brand-950/40 border-brand-300 dark:border-brand-800 text-slate-900 dark:text-white"
                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        <div>
                          <span className="font-mono font-extrabold text-brand-600 block">{zone.pincode}</span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">{zone.area}</span>
                        </div>
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                            isChecked ? "bg-brand-600 text-white" : "border border-slate-300 dark:border-slate-600"
                          }`}
                        >
                          {isChecked ? "✓" : ""}
                        </span>
                      </button>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Active Selected Pincodes List */}
            {coverageZones.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                    Selected Pincodes ({coverageZones.length}):
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPincodeModalOpen(true)}
                    className="text-[11px] font-extrabold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Pincode & Location</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {coverageZones.map((z, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center gap-2 shadow-2xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-brand-600" />
                      <span>{z}</span>
                      <button
                        type="button"
                        onClick={() => setCoverageZones(coverageZones.filter((item) => item !== z))}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ─── ADD PINCODE & LOCATION DIALOG ─── */}
            {isPincodeModalOpen && (
              <Portal>
                <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 outline-none">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 border border-brand-200 shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                            Add Location & Pincode
                          </h3>
                          <p className="text-xs text-slate-500 font-medium">
                            Pincode and area location name.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsPincodeModalOpen(false)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Dialog Body (STRICTLY 2 INPUT FIELDS FOR ADDING LOCATION) */}
                    <div className="p-6 space-y-4 text-xs">
                      {/* Input 1: Pincode */}
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="e.g. 221008"
                          value={modalCustomPincode}
                          onChange={(e) => setModalCustomPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!modalCustomPincode.trim()) return;
                              const pin = modalCustomPincode.trim();
                              const area = modalCustomArea.trim() || "Varanasi Area";
                              const entry = `${pin} - ${area}`;
                              if (!coverageZones.includes(entry)) {
                                setCoverageZones([...coverageZones, entry]);
                              }
                              setModalCustomPincode("");
                              setModalCustomArea("");
                              setIsPincodeModalOpen(false);
                            }
                          }}
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      {/* Input 2: Location Name */}
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                          Location / Area Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sarnath Sector 2"
                          value={modalCustomArea}
                          onChange={(e) => setModalCustomArea(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!modalCustomPincode.trim()) return;
                              const pin = modalCustomPincode.trim();
                              const area = modalCustomArea.trim() || "Varanasi Area";
                              const entry = `${pin} - ${area}`;
                              if (!coverageZones.includes(entry)) {
                                setCoverageZones([...coverageZones, entry]);
                              }
                              setModalCustomPincode("");
                              setModalCustomArea("");
                              setIsPincodeModalOpen(false);
                            }
                          }}
                          className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPincodeModalOpen(false)}
                          className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs cursor-pointer hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!modalCustomPincode.trim() || !modalCustomArea.trim()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!modalCustomPincode.trim()) return;
                            const pin = modalCustomPincode.trim();
                            const area = modalCustomArea.trim() || "Varanasi Area";
                            const entry = `${pin} - ${area}`;
                            if (!coverageZones.includes(entry)) {
                              setCoverageZones([...coverageZones, entry]);
                            }
                            setModalCustomPincode("");
                            setModalCustomArea("");
                            setIsPincodeModalOpen(false);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Add Location & Pincode</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Portal>
            )}

            {/* Role & Commission Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Role / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. AC Technician"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-brand-500 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Commission Rate (%)
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
              className="px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs"
            >
              ← Back to Step 1
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Documents & KYC →</span>
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
                <input
                  type="file"
                  ref={aadhaarFileInputRef}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setAadhaarFileName(e.target.files[0].name);
                      setAadhaarDocUploaded(true);
                    }
                  }}
                />
                <div className="h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {aadhaarDocUploaded ? `✓ ${aadhaarFileName || "Partner_Aadhaar_Both_Sides.pdf"}` : "Upload Both Sides (Front & Back)"}
                  </span>
                  <button
                    type="button"
                    onClick={() => aadhaarFileInputRef.current?.click()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap border shadow-2xs ${
                      aadhaarDocUploaded
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                        : "bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800"
                    }`}
                  >
                    {aadhaarDocUploaded ? "✓ Change File" : "Choose File"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3B: Emergency Guarantor Person Details (ONLY NAME & MOBILE NUMBER) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <UserCheck className="w-5 h-5 text-brand-600" />
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
                      className="h-11 px-4 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 font-extrabold text-xs border border-brand-200 dark:border-brand-800 whitespace-nowrap transition-all cursor-pointer shrink-0 flex items-center justify-center shadow-2xs"
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

          {/* Section 3C: Additional Verification Documents (Passport Photo & Selectable ID Documents) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileCheck className="w-5 h-5 text-brand-600" />
              <span>Step 3C: Passport Size Photo & Verification Documents</span>
            </h3>

            {/* Hidden Input Elements for Real OS File Picker Selection */}
            <input
              type="file"
              ref={photoFileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setPhotoFileName(file.name);
                  setPassportPhotoPreview(URL.createObjectURL(file));
                  setPhotoDocUploaded(true);
                }
              }}
            />

            <input
              type="file"
              ref={docTypeFileInputRef}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  const newDoc = {
                    id: `doc-${Date.now()}`,
                    type: selectedDocType,
                    name: file.name,
                  };
                  setAdditionalDocsList([...additionalDocsList.filter((d) => d.type !== selectedDocType), newDoc]);
                }
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. CURRENT PASSPORT SIZE PHOTO DRAG & DROP BOX WITH PREVIEW */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-4 h-4 text-brand-600" />
                    <span>Current Passport Size Photo *</span>
                  </span>
                  {photoDocUploaded && (
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      ✓ Uploaded & Verified
                    </span>
                  )}
                </div>

                {/* Drag & Drop Upload / Live Preview Box */}
                {photoDocUploaded && passportPhotoPreview ? (
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-2xs">
                    <img
                      src={passportPhotoPreview}
                      alt="Passport Photo Preview"
                      className="w-16 h-20 rounded-xl object-cover border-2 border-brand-500 shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">
                        {photoFileName || "Passport_Photo.jpg"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        3.5cm × 4.5cm • Image
                      </span>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => photoFileInputRef.current?.click()}
                          className="text-[11px] font-bold text-slate-500 hover:text-slate-700 underline cursor-pointer"
                        >
                          Change Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoDocUploaded(false);
                            setPassportPhotoPreview(null);
                            setPhotoFileName("");
                          }}
                          className="text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => photoFileInputRef.current?.click()}
                    className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-all hover:bg-brand-50/20"
                  >
                    <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                        Drag & Drop Passport Photo here or <span className="text-brand-600 underline">Browse</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        Supports JPG, PNG (3.5 × 4.5 cm, Max 3MB)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. SELECTABLE DOCUMENT TYPE (PAN CARD, DRIVING LICENSE, POLICE CLEARANCE) & DRAG & DROP BOX */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-600" />
                  <span>Document Type & Upload *</span>
                </span>
                
                {/* STRICT 3 DOCUMENT TYPES DROPDOWN */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Select Document Type:
                    </label>
                    <CustomSelect
                      value={selectedDocType}
                      onChange={(val) => setSelectedDocType(val)}
                      options={[
                        { value: "PAN Card", label: "PAN Card" },
                        { value: "Driving License", label: "Driving License" },
                        { value: "Police Clearance Certificate", label: "Police Clearance Certificate" },
                      ]}
                    />
                  </div>

                  {/* Drag & Drop Upload Box for Selected Document */}
                  {additionalDocsList.some((d) => d.type === selectedDocType) ? (
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200 shrink-0">
                          <FileCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">
                            {selectedDocType}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold block truncate">
                            ✓ {additionalDocsList.find((d) => d.type === selectedDocType)?.name}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => docTypeFileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        Change File
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => docTypeFileInputRef.current?.click()}
                      className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-all hover:bg-brand-50/20"
                    >
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 border border-slate-200">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                          Drag & Drop <span className="text-brand-600">{selectedDocType}</span> here or <span className="underline">Browse</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          PDF, JPG, PNG (Max 5MB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* List of Uploaded Documents Preview Cards */}
            {additionalDocsList.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  Uploaded Verification Documents ({additionalDocsList.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {additionalDocsList.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200 shrink-0">
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
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer shrink-0"
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
              className="px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs"
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
                  <Briefcase className="w-4 h-4 text-purple-600" /> Step 2: Services & Service Pincodes
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
                    Selected Services ({selectedServices.length}):
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
                    Selected Pincodes Served ({coverageZones.length}):
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
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs"
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
                className="px-6 py-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 font-extrabold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
