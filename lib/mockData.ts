export interface VaranasiLocality {
  id: string;
  name: string;
  pincode: string;
  activeBookings: number;
  activeTechs: number;
  status: "High Demand" | "Normal" | "Peak";
  isServiceable: boolean;
}

export interface ServiceAddon {
  id: string;
  title: string;
  price: number;
  unit: string;
  category: string;
  status: "Active" | "Inactive";
}

export interface ServiceItem {
  id: string;
  category: "ac" | "cleaning" | "electrician" | "plumbing" | "beauty";
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isInspectionBased?: boolean;
  addons?: ServiceAddon[];
  systemType?: string[];
  status: "Active" | "Inactive";
  createdBy?: string;
  createdDate?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategoriesCount: number;
  servicesCount: number;
  status: "Active" | "Inactive";
}

export interface SubCategoryItem {
  id: string;
  name: string;
  categoryName: string;
  slug: string;
  servicesCount: number;
  status: "Active" | "Inactive";
}

export interface PackageItem {
  id: string;
  title: string;
  category: string;
  includedServices: string[];
  packagePrice: number;
  individualPrice: number;
  discountPercentage: number;
  status: "Active" | "Inactive";
}

export interface CityPricingItem {
  id: string;
  cityName: string;
  state: string;
  baseFareMultiplier: number;
  nightSurgeMultiplier: number;
  status: "Active" | "Inactive";
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: "Fixed" | "Percentage" | "Bank Offer" | "First Booking";
  discountValue: number;
  minOrderValue: number;
  maxDiscountCap?: number;
  bankName?: string;
  description?: string;
  usageCount: number;
  expiryDate: string;
  status: "Active" | "Expired" | "Disabled";
}

export interface ReviewItem {
  id: string;
  reviewerName: string;
  reviewerType: "Customer" | "Partner";
  rating: number;
  comment: string;
  targetName: string;
  date: string;
  status: "Approved" | "Pending" | "Flagged";
}

export interface TransactionItem {
  id: string;
  bookingId: string;
  customerName: string;
  amount: number;
  paymentMethod: "UPI" | "Card" | "Wallet" | "Cash";
  status: "Success" | "Refunded" | "Failed";
  date: string;
}

export interface ModulePermission {
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface UserPermissions {
  // Granular View/Edit/Delete Matrix
  bookings: ModulePermission;
  services: ModulePermission;
  customers: ModulePermission;
  fleet: ModulePermission;
  finance: ModulePermission;
  reports: ModulePermission;
  rbac: ModulePermission;

  // Feature flags
  canDispatchJobs: boolean;
  canEditServices: boolean;
  canProcessRefunds: boolean;
  canManageFleet: boolean;
  canExportReports: boolean;
  canManageRbac: boolean;
  canViewAuditLogs: boolean;
}

export interface UserManagementItem {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Varanasi Dispatcher" | "Fleet Inspector" | "Support Agent" | "Billing & Finance Manager" | "Service Partner" | string;
  status: "Active" | "Suspended";
  lastLogin: string;
  phone?: string;
  locality?: string;
  permissions: UserPermissions;
}

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  role: string;
  category: string;
  locality: string;
  pincode: string;
  phone: string;
  rating: number;
  totalJobs: number;
  aadhaarVerified: boolean;
  policeVerified: boolean;
  bondedInsurance: boolean;
  status: "Available" | "On Job" | "Offline" | "Approved" | "Pending" | "Rejected";
  joiningDate: string;

  // Earnings & Settlement
  totalEarnings: number;
  commissionPaid: number;
  pendingPayout: number;
  lastPayoutDate: string;
  payoutProofUrl?: string;
}

export type BookingStatus =
  | "Draft"
  | "Pending"
  | "Waiting For Assignment"
  | "Assigned"
  | "Partner Accepted"
  | "Inspection Pending"
  | "Price Approval Pending"
  | "Customer Approval Pending"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Refunded"
  | "Rejected";

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerGstin?: string;
  city: string;
  locality: string;
  pincode: string;
  address: string;
  serviceTitle: string;
  category: string;
  subCategory?: string;
  packageTitle?: string;
  addons?: string[];
  systemType?: string;

  // Pricing & GST Engine
  basePrice: number;
  addonPrice?: number;
  convenienceFee: number; // Fixed ₹49
  discountAmount?: number;
  couponCode?: string;
  cgst: number; // 9%
  sgst: number; // 9%
  totalAmount: number;
  invoiceType: "B2C" | "B2B";

  // Commission (Fixed 25%)
  commissionAmount: number; // 25% of Base
  partnerEarnings: number; // 75% of Base

  // Inspection Flow
  isInspectionBased?: boolean;
  initialInspectionQuote?: number;
  updatedInspectionQuote?: number;
  materialCost?: number;
  labourCost?: number;
  inspectionImages?: string[];
  inspectionRemarks?: string;
  inspectionApprovedByCustomer?: boolean;
  otpCode?: string;
  isOtpVerified?: boolean;

  // Notes & Attachments
  notes?: string;
  internalNotes?: string;
  customerImages?: string[];

  // Refund Management
  isRefunded?: boolean;
  refundAmount?: number;
  refundReason?: string;

  // Rating & Feedback
  rating?: number;
  reviewComment?: string;

  status: BookingStatus;
  technicianName?: string;
  technicianId?: string;
  date: string;
  timeSlot: string;
  paymentMethod: "UPI" | "Cash on Service" | "Card" | "Helpmate Wallet" | "Online" | "Partial Payment";
  createdAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  locality: string;
  address: string;
  tier: "Crown Elite" | "VIP" | "Standard";
  totalSpend: number;
  totalBookings: number;
  lastBookingDate: string;
  joinedDate: string;

  // Customer Identity & Aadhaar Verification
  aadhaarNumber?: string;
  aadhaarDocUrl?: string;

  // Guarantor / Reference Person (Taking Customer Guarantee)
  guarantorName?: string;
  guarantorPhone?: string;
  guarantorAddress?: string;
  guarantorAadhaarNumber?: string;
  guarantorAadhaarDocUrl?: string;

  // Police Verification & Security Records
  policeStatus?: "Pending Verification" | "Verified Clean" | "Submitted to Local Thana" | "Exempted";
  policeTokenNumber?: string;
  policeStationName?: string;
  policeCertificateUrl?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  locality: string;
}

// Initial Data Sets
export const varanasiLocalities: VaranasiLocality[] = [
  { id: "loc-1", name: "Sigra", pincode: "221002", activeBookings: 14, activeTechs: 18, status: "High Demand", isServiceable: true },
  { id: "loc-2", name: "Lanka / Assi Ghat", pincode: "221005", activeBookings: 18, activeTechs: 22, status: "Peak", isServiceable: true },
  { id: "loc-3", name: "Godowlia", pincode: "221001", activeBookings: 9, activeTechs: 12, status: "Normal", isServiceable: true },
  { id: "loc-4", name: "Bhelupur", pincode: "221010", activeBookings: 11, activeTechs: 15, status: "High Demand", isServiceable: true },
  { id: "loc-5", name: "Mahmoorganj", pincode: "221010", activeBookings: 8, activeTechs: 10, status: "Normal", isServiceable: true },
  { id: "loc-6", name: "Shivpur", pincode: "221003", activeBookings: 6, activeTechs: 8, status: "Normal", isServiceable: true },
  { id: "loc-7", name: "Sarnath", pincode: "221007", activeBookings: 5, activeTechs: 7, status: "Normal", isServiceable: true },
  { id: "loc-8", name: "Varanasi Cantt", pincode: "221002", activeBookings: 12, activeTechs: 16, status: "High Demand", isServiceable: true },
];

export const initialAddons: ServiceAddon[] = [
  { id: "add-1", title: "Extra Heavy-Duty Copper Pipe (per meter)", price: 250, unit: "meter", category: "AC", status: "Active" },
  { id: "add-2", title: "Anti-Bacterial Coil Coating Spray", price: 199, unit: "can", category: "AC", status: "Active" },
  { id: "add-3", title: "Wall Mounting Heavy Angle Bracket", price: 350, unit: "piece", category: "AC", status: "Active" },
  { id: "add-4", title: "High-Pressure Hydro Drain Cleaner Fluid", price: 149, unit: "bottle", category: "Plumbing", status: "Active" },
];

export const initialCategories: CategoryItem[] = [
  { id: "cat-1", name: "AC Servicing & Repair", slug: "ac", icon: "Wrench", subcategoriesCount: 4, servicesCount: 12, status: "Active" },
  { id: "cat-2", name: "Elite Deep Cleaning", slug: "cleaning", icon: "Sparkles", subcategoriesCount: 5, servicesCount: 18, status: "Active" },
  { id: "cat-3", name: "Smart Home Electrician", slug: "electrician", icon: "Zap", subcategoriesCount: 3, servicesCount: 10, status: "Active" },
  { id: "cat-4", name: "Hydro Jet Plumbing", slug: "plumbing", icon: "Droplets", subcategoriesCount: 3, servicesCount: 8, status: "Active" },
  { id: "cat-5", name: "Home Salon & Spa", slug: "beauty", icon: "Scissors", subcategoriesCount: 6, servicesCount: 22, status: "Active" },
];

export const initialSubCategories: SubCategoryItem[] = [
  { id: "sub-1", name: "Power Jet Wash", categoryName: "AC Servicing & Repair", slug: "power-jet-wash", servicesCount: 3, status: "Active" },
  { id: "sub-2", name: "Gas Refilling & Leak Repair", categoryName: "AC Servicing & Repair", slug: "gas-refilling", servicesCount: 4, status: "Active" },
  { id: "sub-3", name: "Full Villa Deep Clean", categoryName: "Elite Deep Cleaning", slug: "full-villa-clean", servicesCount: 5, status: "Active" },
  { id: "sub-4", name: "Kitchen Degreasing", categoryName: "Elite Deep Cleaning", slug: "kitchen-degreasing", servicesCount: 2, status: "Active" },
  { id: "sub-5", name: "MCB & Fuse Repair", categoryName: "Smart Home Electrician", slug: "mcb-repair", servicesCount: 3, status: "Active" },
];

export const initialPackages: PackageItem[] = [
  { id: "pkg-1", title: "Varanasi Summer AC Protection Combo", category: "AC Servicing", includedServices: ["Power Jet Wash", "Gas Leak Testing", "Anti-Bacterial Spray"], packagePrice: 1299, individualPrice: 1899, discountPercentage: 31, status: "Active" },
  { id: "pkg-2", title: "Complete Villa Deep Clean + Pest Control", category: "Cleaning", includedServices: ["3BHK Deep Cleaning", "Herbal Pest Spray", "Kitchen Hydro Wash"], packagePrice: 5999, individualPrice: 8499, discountPercentage: 29, status: "Active" },
  { id: "pkg-3", title: "Ayurvedic Home Spa & Glow Facial Bundle", category: "Beauty", includedServices: ["Kashi Oil Body Massage", "Gold Glow Facial", "Herbal Hair Spa"], packagePrice: 2999, individualPrice: 4299, discountPercentage: 30, status: "Active" },
];

export const initialCityPricing: CityPricingItem[] = [
  { id: "cp-1", cityName: "Varanasi", state: "Uttar Pradesh", baseFareMultiplier: 1.0, nightSurgeMultiplier: 1.2, status: "Active" },
];

export const initialCoupons: CouponItem[] = [
  {
    id: "coup-1",
    code: "VARANASI100",
    discountType: "Fixed",
    discountValue: 100,
    minOrderValue: 499,
    description: "Flat ₹100 Instant Cash Discount on AC & Home Care Services in Varanasi",
    usageCount: 1420,
    expiryDate: "31 Dec 2026",
    status: "Active",
  },
  {
    id: "coup-2",
    code: "HDFC10",
    discountType: "Bank Offer",
    discountValue: 10,
    maxDiscountCap: 300,
    minOrderValue: 999,
    bankName: "HDFC Bank",
    description: "10% Instant Discount up to ₹300 on HDFC Credit & Debit Cards",
    usageCount: 890,
    expiryDate: "31 Dec 2026",
    status: "Active",
  },
  {
    id: "coup-3",
    code: "ICICICASH",
    discountType: "Bank Offer",
    discountValue: 200,
    minOrderValue: 1499,
    bankName: "ICICI Bank",
    description: "Flat ₹200 Cashback on ICICI Credit Cards & NetBanking",
    usageCount: 640,
    expiryDate: "30 Nov 2026",
    status: "Active",
  },
  {
    id: "coup-4",
    code: "WELCOME150",
    discountType: "First Booking",
    discountValue: 150,
    minOrderValue: 499,
    description: "Flat ₹150 Off for First Time HelpMate Booking Customers",
    usageCount: 2150,
    expiryDate: "31 Dec 2026",
    status: "Active",
  },
  {
    id: "coup-5",
    code: "AXIS250",
    discountType: "Bank Offer",
    discountValue: 250,
    minOrderValue: 1999,
    bankName: "Axis Bank",
    description: "Flat ₹250 Discount on Axis Bank Credit Cards",
    usageCount: 430,
    expiryDate: "31 Dec 2026",
    status: "Active",
  },
];

export const initialReviews: ReviewItem[] = [
  { id: "rev-1", reviewerName: "Rajesh Kumar Agrawal", reviewerType: "Customer", rating: 5, comment: "Excellent Power Jet AC service in Sigra! Tech Ramesh Yadav arrived in 25 mins.", targetName: "Ramesh Yadav (AC Tech)", date: "Today, 04:30 PM", status: "Approved" },
  { id: "rev-2", reviewerName: "Dr. Ananya Mukherjee", reviewerType: "Customer", rating: 5, comment: "Very professional therapist Sunita Verma. Highly recommend HelpMate Spa at Assi Ghat.", targetName: "Sunita Verma (Therapist)", date: "Yesterday", status: "Approved" },
];

export const initialTransactions: TransactionItem[] = [
  { id: "txn-901", bookingId: "HM-VAR-8821", customerName: "Rajesh Kumar Agrawal", amount: 873, paymentMethod: "UPI", status: "Success", date: "Today, 05:30 PM" },
  { id: "txn-902", bookingId: "HM-VAR-8820", customerName: "Dr. Ananya Mukherjee", amount: 2407, paymentMethod: "Wallet", status: "Success", date: "Today, 04:45 PM" },
];

export const initialUsers: UserManagementItem[] = [
  {
    id: "usr-1",
    name: "Aman Verma",
    email: "admin@helpmate.net.in",
    role: "Super Admin",
    status: "Active",
    lastLogin: "Just now",
    phone: "+91 98390 11111",
    locality: "Varanasi HQ",
    permissions: {
      bookings: { view: true, edit: true, delete: true },
      services: { view: true, edit: true, delete: true },
      customers: { view: true, edit: true, delete: true },
      fleet: { view: true, edit: true, delete: true },
      finance: { view: true, edit: true, delete: true },
      reports: { view: true, edit: true, delete: true },
      rbac: { view: true, edit: true, delete: true },
      canDispatchJobs: true,
      canEditServices: true,
      canProcessRefunds: true,
      canManageFleet: true,
      canExportReports: true,
      canManageRbac: true,
      canViewAuditLogs: true,
    },
  },
  {
    id: "usr-2",
    name: "Siddharth Malhotra",
    email: "dispatch.sigra@helpmate.net.in",
    role: "Varanasi Dispatcher",
    status: "Active",
    lastLogin: "10 mins ago",
    phone: "+91 98390 22222",
    locality: "Sigra Zone",
    permissions: {
      bookings: { view: true, edit: true, delete: false },
      services: { view: true, edit: false, delete: false },
      customers: { view: true, edit: true, delete: false },
      fleet: { view: true, edit: true, delete: false },
      finance: { view: false, edit: false, delete: false },
      reports: { view: false, edit: false, delete: false },
      rbac: { view: false, edit: false, delete: false },
      canDispatchJobs: true,
      canEditServices: false,
      canProcessRefunds: false,
      canManageFleet: true,
      canExportReports: false,
      canManageRbac: false,
      canViewAuditLogs: true,
    },
  },
  {
    id: "usr-3",
    name: "Priya Sharma",
    email: "priya.support@helpmate.net.in",
    role: "Support Agent",
    status: "Active",
    lastLogin: "1 hour ago",
    phone: "+91 98390 33333",
    locality: "Lanka Zone",
    permissions: {
      bookings: { view: true, edit: true, delete: false },
      services: { view: true, edit: false, delete: false },
      customers: { view: true, edit: true, delete: false },
      fleet: { view: true, edit: false, delete: false },
      finance: { view: true, edit: false, delete: false },
      reports: { view: false, edit: false, delete: false },
      rbac: { view: false, edit: false, delete: false },
      canDispatchJobs: true,
      canEditServices: false,
      canProcessRefunds: true,
      canManageFleet: false,
      canExportReports: false,
      canManageRbac: false,
      canViewAuditLogs: false,
    },
  },
  {
    id: "usr-4",
    name: "Rajesh Agrawal",
    email: "finance@helpmate.net.in",
    role: "Billing & Finance Manager",
    status: "Active",
    lastLogin: "Yesterday",
    phone: "+91 98390 44444",
    locality: "Cantt Zone",
    permissions: {
      bookings: { view: true, edit: false, delete: false },
      services: { view: true, edit: true, delete: false },
      customers: { view: true, edit: false, delete: false },
      fleet: { view: false, edit: false, delete: false },
      finance: { view: true, edit: true, delete: true },
      reports: { view: true, edit: true, delete: false },
      rbac: { view: false, edit: false, delete: false },
      canDispatchJobs: false,
      canEditServices: true,
      canProcessRefunds: true,
      canManageFleet: false,
      canExportReports: true,
      canManageRbac: false,
      canViewAuditLogs: true,
    },
  },
];

export const initialTechnicians: Technician[] = [
  {
    id: "tech-101",
    name: "Ramesh Yadav",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
    role: "Master HVAC Specialist",
    category: "AC Repair",
    locality: "Sigra, Varanasi",
    pincode: "221002",
    phone: "+91 98391 22401",
    rating: 4.95,
    totalJobs: 412,
    aadhaarVerified: true,
    policeVerified: true,
    bondedInsurance: true,
    status: "Approved",
    joiningDate: "14 Jan 2024",
    totalEarnings: 284500,
    commissionPaid: 71125,
    pendingPayout: 14200,
    lastPayoutDate: "20 Jan 2026",
    payoutProofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "tech-102",
    name: "Sunita Verma",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "Senior Wellness Therapist",
    category: "Beauty & Spa",
    locality: "Lanka, Varanasi",
    pincode: "221005",
    phone: "+91 97920 44812",
    rating: 4.98,
    totalJobs: 580,
    aadhaarVerified: true,
    policeVerified: true,
    bondedInsurance: true,
    status: "Approved",
    joiningDate: "05 Nov 2023",
    totalEarnings: 412000,
    commissionPaid: 103000,
    pendingPayout: 18900,
    lastPayoutDate: "20 Jan 2026",
  },
  {
    id: "tech-103",
    name: "Amit Pandey",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Certified Electrical Engineer",
    category: "Electrician",
    locality: "Bhelupur, Varanasi",
    pincode: "221010",
    phone: "+91 94152 88901",
    rating: 4.90,
    totalJobs: 320,
    aadhaarVerified: true,
    policeVerified: true,
    bondedInsurance: true,
    status: "Pending",
    joiningDate: "20 Feb 2024",
    totalEarnings: 156000,
    commissionPaid: 39000,
    pendingPayout: 8500,
    lastPayoutDate: "15 Jan 2026",
  },
];

export const initialBookings: Booking[] = [
  {
    id: "HM-VAR-8821",
    customerName: "Rajesh Kumar Agrawal",
    customerPhone: "+91 77050 04040",
    customerGstin: "09AABCH1234H1Z5",
    city: "Varanasi",
    locality: "Sigra",
    pincode: "221002",
    address: "D-58/16C Shashtri Nagar Colony, Sigra, Varanasi",
    serviceTitle: "Power Jet AC Servicing",
    category: "AC",
    systemType: "Split AC (1.5 Ton)",
    basePrice: 699,
    convenienceFee: 49,
    cgst: 67.32,
    sgst: 67.32,
    totalAmount: 883,
    invoiceType: "B2B",
    commissionAmount: 174.75, // 25% of 699
    partnerEarnings: 524.25, // 75% of 699
    isInspectionBased: true,
    initialInspectionQuote: 199,
    updatedInspectionQuote: 699,
    inspectionApprovedByCustomer: true,
    otpCode: "8821",
    isOtpVerified: false,
    status: "In Progress",
    technicianName: "Ramesh Yadav",
    technicianId: "tech-101",
    date: "Today, 05:30 PM",
    timeSlot: "05:00 PM - 06:30 PM",
    paymentMethod: "UPI",
  },
  {
    id: "HM-VAR-8820",
    customerName: "Dr. Ananya Mukherjee",
    customerPhone: "+91 94501 22910",
    city: "Varanasi",
    locality: "Lanka / Assi Ghat",
    pincode: "221005",
    address: "Plot 12, Assi Ghat Road, Near BHU Gate, Lanka, Varanasi",
    serviceTitle: "Ayurvedic Home Spa & Wellness",
    category: "Beauty",
    basePrice: 1999,
    convenienceFee: 49,
    cgst: 184.32,
    sgst: 184.32,
    totalAmount: 2417,
    invoiceType: "B2C",
    commissionAmount: 499.75,
    partnerEarnings: 1499.25,
    otpCode: "4920",
    isOtpVerified: false,
    status: "Assigned",
    technicianName: "Sunita Verma",
    technicianId: "tech-102",
    date: "Today, 06:00 PM",
    timeSlot: "06:00 PM - 07:30 PM",
    paymentMethod: "Helpmate Wallet",
  },
  {
    id: "HM-VAR-8819",
    customerName: "Vikram Singh",
    customerPhone: "+91 99180 55432",
    city: "Varanasi",
    locality: "Bhelupur",
    pincode: "221010",
    address: "B-22/41 Sonarpura, Bhelupur, Varanasi",
    serviceTitle: "Smart Home & MCB Box Repair",
    category: "Electrician",
    basePrice: 499,
    convenienceFee: 49,
    cgst: 49.32,
    sgst: 49.32,
    totalAmount: 647,
    invoiceType: "B2C",
    commissionAmount: 124.75,
    partnerEarnings: 374.25,
    otpCode: "1819",
    isOtpVerified: true,
    status: "Completed",
    technicianName: "Amit Pandey",
    technicianId: "tech-103",
    date: "Today, 04:45 PM",
    timeSlot: "04:30 PM - 05:30 PM",
    paymentMethod: "UPI",
  },
];

export const initialServices: ServiceItem[] = [
  {
    id: "srv-1",
    category: "ac",
    title: "Power Jet AC Servicing",
    subtitle: "High-pressure jet pump cleaning for indoor & outdoor units with anti-bacterial coating",
    price: 699,
    originalPrice: 999,
    duration: "45 mins",
    rating: 4.94,
    reviewsCount: 1420,
    isPopular: true,
    isInspectionBased: true,
    systemType: ["Split AC", "Window AC"],
    status: "Active",
    createdBy: "Aman Verma (Admin)",
    createdDate: "12 Jan 2026",
  },
  {
    id: "srv-2",
    category: "ac",
    title: "AC Gas Leakage Repair & Refilling",
    subtitle: "Comprehensive gas leak testing with eco-friendly R32/R410a refrigerant charging",
    price: 2499,
    originalPrice: 2999,
    duration: "60 mins",
    rating: 4.89,
    reviewsCount: 890,
    systemType: ["Split AC", "Window AC", "Inverter AC"],
    status: "Active",
    createdBy: "Aman Verma (Admin)",
    createdDate: "15 Jan 2026",
  },
  {
    id: "srv-3",
    category: "cleaning",
    title: "Elite Full Home Deep Cleaning",
    subtitle: "Deep scrubbing of all rooms, balcony, floor polishing, and UV sanitization",
    price: 4999,
    originalPrice: 6999,
    duration: "4 - 5 hrs",
    rating: 4.96,
    reviewsCount: 1120,
    isPopular: true,
    status: "Active",
  },
];

export const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Rajesh Kumar Agrawal",
    phone: "+91 77050 04040",
    email: "rajesh.agrawal@gmail.com",
    locality: "Sigra",
    address: "D-58/16C Shashtri Nagar Colony, Sigra, Varanasi",
    tier: "Crown Elite",
    totalSpend: 34500,
    totalBookings: 18,
    lastBookingDate: "Today",
    joinedDate: "12 Jan 2024",
    aadhaarNumber: "7821-4920-1102",
    aadhaarDocUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    guarantorName: "Sunita Agrawal (Guarantor / Spouse)",
    guarantorPhone: "+91 98390 88210",
    guarantorAddress: "D-58/16C Shashtri Nagar Colony, Sigra, Varanasi",
    guarantorAadhaarNumber: "7821-4920-5592",
    guarantorAadhaarDocUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    policeStatus: "Verified Clean",
    policeStationName: "Sigra Police Station",
    policeTokenNumber: "PCC-VAR-2026-8819",
    policeCertificateUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cust-2",
    name: "Dr. Ananya Mukherjee",
    phone: "+91 94501 22910",
    email: "ananya.bhu@yahoo.in",
    locality: "Lanka / Assi Ghat",
    address: "Plot 12, Assi Ghat Road, Near BHU Gate, Lanka, Varanasi",
    tier: "Crown Elite",
    totalSpend: 28900,
    totalBookings: 14,
    lastBookingDate: "Today",
    joinedDate: "05 Mar 2024",
    aadhaarNumber: "4920-1102-8821",
    aadhaarDocUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    guarantorName: "Prof. S. N. Mukherjee (Guarantor / Father)",
    guarantorPhone: "+91 94152 44321",
    guarantorAddress: "Plot 12, Assi Ghat Road, Lanka, Varanasi",
    guarantorAadhaarNumber: "4920-1102-3329",
    guarantorAadhaarDocUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    policeStatus: "Submitted to Local Thana",
    policeStationName: "Lanka Thana",
    policeTokenNumber: "PCC-VAR-2026-9042",
    policeCertificateUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
  },
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "log-901",
    user: "Aman Verma (Admin)",
    role: "Super Admin",
    action: "Validated Inspection Price (₹199 -> ₹699)",
    target: "Booking HM-VAR-8821 (Rajesh Agrawal)",
    timestamp: "Just now",
    locality: "Sigra",
  },
];

export const analyticsData = {
  totalRevenue: 1485200,
  monthlyGrowth: 24.8,
  activeBookings: 48,
  technicianFleet: 142,
  csatRating: 4.94,
  bondedInsuranceCoverage: 10000,
  monthlyChart: [
    { month: "Jan", revenue: 840000, bookings: 710 },
    { month: "Feb", revenue: 960000, bookings: 820 },
    { month: "Mar", revenue: 1120000, bookings: 940 },
    { month: "Apr", revenue: 1280000, bookings: 1080 },
    { month: "May", revenue: 1420000, bookings: 1210 },
    { month: "Jun", revenue: 1390000, bookings: 1180 },
    { month: "Jul", revenue: 1485200, bookings: 1290 },
  ],
  categoryBreakdown: [
    { category: "Power Jet AC", percentage: 38, count: 490, color: "#8D397E" },
    { category: "Elite Deep Cleaning", percentage: 26, count: 335, color: "#10B981" },
    { category: "Home Salon & Spa", percentage: 18, count: 232, color: "#F59E0B" },
    { category: "Electrician & MCB", percentage: 11, count: 142, color: "#3B82F6" },
    { category: "Hydro Jet Plumbing", percentage: 7, count: 91, color: "#EC4899" },
  ],
};
