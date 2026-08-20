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
  category: string;
  subcategory?: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isTrending?: boolean;
  isInspectionBased?: boolean;
  addons?: ServiceAddon[];
  systemType?: string[];
  thumbnailUrl?: string;
  status: "Active" | "Inactive";
  createdBy?: string;
  createdDate?: string;
}

export interface CategorySubService {
  id: string;
  title: string;
  type: "Installation" | "Repair" | "Uninstallation" | "Servicing" | "Maintenance";
  price: number;
  duration?: string;
  status: "Active" | "Inactive";
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  iconUrl?: string;
  secondImageIconUrl?: string;
  subcategoriesCount: number;
  subcategories?: string[];
  servicesCount: number;
  status: "Active" | "Inactive";
  subServices?: CategorySubService[];
}

export interface VisitorPromoPopupConfig {
  isEnabled: boolean;
  bannerImageUrl: string;
  secondImageIconUrl?: string;
  targetLinkUrl: string;
  headlineText?: string;
  showFrequency: "Every Visit" | "Once per Session" | "Once per 24 Hours";
  closeDelaySeconds: number;
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

export interface RateCardItem {
  id: string;
  serviceTitle: string;
  category: string;
  basePrice: number;
  memberPrice: number;
  convenienceFee: number;
  gstPercentage: number;
  commissionPercentage: number;
  surgeMultiplier: number;
  status: "Active" | "Inactive";
}

export interface CityPricingItem {
  id: string;
  cityName: string;
  locality?: string;
  state: string;
  baseFareMultiplier: number;
  peakHourSurge: number;
  nightSurgeMultiplier: number;
  weatherSurge: number;
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
  paymentMethod: string;
  status: "Success" | "Refunded" | "Failed";
  date: string;
}

export interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface UserPermissions {
  // Granular View/Edit/Delete Matrix — All Admin Modules
  bookings: ModulePermission;
  inspections: ModulePermission;
  customers: ModulePermission;
  technicians: ModulePermission;
  categories: ModulePermission;
  cms: ModulePermission;
  pricing: ModulePermission;
  locations: ModulePermission;
  payments: ModulePermission;
  billing: ModulePermission;
  commission: ModulePermission;
  coupons: ModulePermission;
  reviews: ModulePermission;
  media: ModulePermission;
  analytics: ModulePermission;
  reports: ModulePermission;
  rbac: ModulePermission;

  // Feature flags (auto-derived)
  canAssignJobs: boolean;
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
  role: "Super Admin" | "Varanasi Operations Coordinator" | "Quality Inspector" | "Support Agent" | "Billing & Finance Manager" | "Service Partner" | string;
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
  status: "Working" | "In Transit" | "Absent" | "Available" | "On Job" | "Offline" | "Approved" | "Pending" | "Rejected";
  joiningDate: string;

  // Earnings & Settlement
  totalEarnings: number;
  commissionPaid: number;
  pendingPayout: number;
  lastPayoutDate: string;
  payoutProofUrl?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  aadhaarDocUrl?: string;
  guarantorAadhaarDocUrl?: string;
  policeDocUrl?: string;
}

export interface SettlementRecord {
  id: string;
  technicianId: string;
  technicianName: string;
  category: string;
  bankAccountName: string;
  bankAccountNumber: string;
  ifscCode: string;
  upiId?: string;
  grossAmount: number;
  commissionDeducted: number;
  netPayoutAmount: number;
  paymentMethod: string;
  utrNumber: string;
  settlementDate: string;
  period: string;
  status: "Completed" | "Processing" | "Failed";
  proofUrl?: string;
  notes?: string;
}

export interface CategoryCommissionRule {
  id: string;
  categoryName: string;
  commissionPercentage: number;
  convenienceFeeSharePercentage: number;
  minimumCommissionFloor: number;
  status: "Active" | "Inactive";
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

export interface SelectedServiceItem {
  id: string;
  serviceId?: string; // Unique Service ID e.g. SRV-8821-1
  serviceCode?: string; // Unique Service Item Code e.g. HM-SRV-101
  title: string;
  price: number;
  quantity: number;
  category?: string;
  duration?: string;
}

export type AddressRecipientType = "Self" | "Family Member" | "Friend / Neighbor" | "Office / Work" | "Other";

export interface Booking {
  id: string; // Booking / Invoice ID
  jobId?: string; // Unique Job Tracking Code e.g. HM-JOB-8821
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerGstin?: string;
  city: string;
  locality: string;
  pincode: string;
  address: string;
  serviceTitle: string;
  serviceName?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  category: string;
  subCategory?: string;
  packageTitle?: string;
  addons?: string[];
  systemType?: string;
  servicesList?: SelectedServiceItem[];
  addressRecipientType?: AddressRecipientType;
  recipientName?: string;
  recipientPhone?: string;

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
  technicianPhone?: string;
  date: string;
  timeSlot: string;
  paymentMethod: "UPI" | "Cash on Service" | "Card" | "Helpmate Wallet" | "Online" | "Partial Payment";
  createdAt?: string;
  callingDate?: string;
  callingPerson?: string;
  handledBy?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  locality: string;
  pincode?: string;
  address: string;
  secondaryLocality?: string;
  secondaryAddress?: string;
  tier: "Crown Elite" | "VIP" | "Standard";
  totalSpend: number;
  totalBookings: number;
  lastBookingDate: string;
  joinedDate: string;
  avatar?: string;
  customerType?: "Individual Household" | "Commercial Business / B2B";
  companyName?: string;
  customerGstin?: string;
  householdType?: "Family Home" | "Apartment / Flat" | "Villa / Bungalow" | "Commercial Office / Shop";
  registeredAppliances?: string[];
  preferredLanguage?: "Hindi" | "English" | "Bhojpuri";
  preferredTimeSlot?: "Morning (9am-12pm)" | "Afternoon (12pm-4pm)" | "Evening (4pm-8pm)";
  loyaltyPoints?: number;
  walletBalance?: number;
  preferredPaymentMethod?: string;
  crmManager?: string;

  // Customer Identity & Aadhaar Verification (Optional for Customer KYC)
  aadhaarNumber?: string;
  aadhaarDocUrl?: string;
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
  {
    id: "cat-1",
    name: "AC Servicing & Repair",
    slug: "ac",
    icon: "Wrench",
    subcategoriesCount: 4,
    servicesCount: 12,
    status: "Active",
    subServices: [
      { id: "sub-srv-101", title: "Split AC Complete Installation", type: "Installation", price: 1499, duration: "90 mins", status: "Active" },
      { id: "sub-srv-102", title: "Window AC Installation", type: "Installation", price: 999, duration: "60 mins", status: "Active" },
      { id: "sub-srv-103", title: "Power Jet Deep Foam Servicing", type: "Servicing", price: 699, duration: "45 mins", status: "Active" },
      { id: "sub-srv-104", title: "Gas Leakage Testing & R32/R410 Charging", type: "Repair", price: 2499, duration: "60 mins", status: "Active" },
      { id: "sub-srv-105", title: "Split AC Safe Uninstallation", type: "Uninstallation", price: 699, duration: "45 mins", status: "Active" },
      { id: "sub-srv-106", title: "Window AC Uninstallation", type: "Uninstallation", price: 499, duration: "30 mins", status: "Active" },
      { id: "sub-srv-107", title: "Anti-Bacterial Hydro Coil Cleaning", type: "Maintenance", price: 399, duration: "30 mins", status: "Active" },
    ],
  },
  {
    id: "cat-2",
    name: "Elite Deep Cleaning",
    slug: "cleaning",
    icon: "Sparkles",
    subcategoriesCount: 5,
    servicesCount: 18,
    status: "Active",
    subServices: [
      { id: "sub-srv-201", title: "Full Home Deep Cleaning (3BHK)", type: "Servicing", price: 4999, duration: "4-5 hrs", status: "Active" },
      { id: "sub-srv-202", title: "Bathroom Hydro Cleaning & Descaling", type: "Servicing", price: 699, duration: "60 mins", status: "Active" },
      { id: "sub-srv-203", title: "Modular Kitchen Chimney Degreasing", type: "Maintenance", price: 899, duration: "90 mins", status: "Active" },
    ],
  },
  {
    id: "cat-3",
    name: "Smart Home Electrician",
    slug: "electrician",
    icon: "Zap",
    subcategoriesCount: 3,
    servicesCount: 10,
    status: "Active",
    subServices: [
      { id: "sub-srv-301", title: "Smart MCB Box & Circuit Fitting", type: "Installation", price: 799, duration: "45 mins", status: "Active" },
      { id: "sub-srv-302", title: "Short Circuit & Wire Fault Repair", type: "Repair", price: 499, duration: "30 mins", status: "Active" },
      { id: "sub-srv-303", title: "Ceiling Fan & Chandelier Fitting", type: "Installation", price: 299, duration: "30 mins", status: "Active" },
    ],
  },
  {
    id: "cat-4",
    name: "Hydro Jet Plumbing",
    slug: "plumbing",
    icon: "Droplets",
    subcategoriesCount: 3,
    servicesCount: 8,
    status: "Active",
    subServices: [
      { id: "sub-srv-401", title: "High-Pressure Drain Unclogging", type: "Repair", price: 599, duration: "45 mins", status: "Active" },
      { id: "sub-srv-402", title: "Luxury Tap & Mixer Fitting", type: "Installation", price: 349, duration: "30 mins", status: "Active" },
    ],
  },
  {
    id: "cat-5",
    name: "Home Salon & Spa",
    slug: "beauty",
    icon: "Scissors",
    subcategoriesCount: 6,
    servicesCount: 22,
    status: "Active",
    subServices: [
      { id: "sub-srv-501", title: "Ayurvedic Kashi Spa Body Massage", type: "Servicing", price: 1999, duration: "60 mins", status: "Active" },
      { id: "sub-srv-502", title: "Organic Gold Glow Facial", type: "Maintenance", price: 1499, duration: "60 mins", status: "Active" },
    ],
  },
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

export const initialRateCards: RateCardItem[] = [
  { id: "rc-1", serviceTitle: "Split AC Foam Jet Servicing", category: "AC Servicing", basePrice: 599, memberPrice: 499, convenienceFee: 49, gstPercentage: 18, commissionPercentage: 25, surgeMultiplier: 1.0, status: "Active" },
  { id: "rc-2", serviceTitle: "Split AC Gas Leak Repair & Refill", category: "AC Servicing", basePrice: 1499, memberPrice: 1299, convenienceFee: 49, gstPercentage: 18, commissionPercentage: 25, surgeMultiplier: 1.0, status: "Active" },
  { id: "rc-3", serviceTitle: "Window AC Deep Jet Servicing", category: "AC Servicing", basePrice: 499, memberPrice: 399, convenienceFee: 49, gstPercentage: 18, commissionPercentage: 25, surgeMultiplier: 1.0, status: "Active" },
  { id: "rc-4", serviceTitle: "Full House Deep Cleaning (2BHK)", category: "Deep Cleaning", basePrice: 2999, memberPrice: 2499, convenienceFee: 49, gstPercentage: 18, commissionPercentage: 25, surgeMultiplier: 1.1, status: "Active" },
  { id: "rc-5", serviceTitle: "Kitchen Oil & Degreasing Wash", category: "Deep Cleaning", basePrice: 1199, memberPrice: 999, convenienceFee: 49, gstPercentage: 18, commissionPercentage: 25, surgeMultiplier: 1.0, status: "Active" },
  { id: "rc-6", serviceTitle: "Smart MCB & Fuse Box Installation", category: "Electrician", basePrice: 349, memberPrice: 299, convenienceFee: 49, gstPercentage: 18, commissionPercentage: 25, surgeMultiplier: 1.0, status: "Active" },
  { id: "rc-7", serviceTitle: "Hydro Jet Drain Cleaning & Unclog", category: "Plumbing", basePrice: 699, memberPrice: 599, convenienceFee: 49, gstPercentage: 18, commissionPercentage: 25, surgeMultiplier: 1.0, status: "Active" },
  { id: "rc-8", serviceTitle: "Gold Radiance Glow Facial & Massage", category: "Home Salon", basePrice: 1299, memberPrice: 1099, convenienceFee: 49, gstPercentage: 18, commissionPercentage: 25, surgeMultiplier: 1.0, status: "Active" },
  { id: "rc-9", serviceTitle: "Full Car Foam Wash & Interior Polish", category: "Car Wash", basePrice: 499, memberPrice: 399, convenienceFee: 49, gstPercentage: 18, commissionPercentage: 25, surgeMultiplier: 1.0, status: "Active" },
];

export const initialCityPricing: CityPricingItem[] = [
  { id: "cp-1", cityName: "Varanasi Metro", locality: "Sigra Commercial Zone", state: "Uttar Pradesh", baseFareMultiplier: 1.0, peakHourSurge: 1.25, nightSurgeMultiplier: 1.20, weatherSurge: 1.30, status: "Active" },
  { id: "cp-2", cityName: "Varanasi Metro", locality: "Lanka & Assi Ghat Hub", state: "Uttar Pradesh", baseFareMultiplier: 1.0, peakHourSurge: 1.20, nightSurgeMultiplier: 1.15, weatherSurge: 1.25, status: "Active" },
  { id: "cp-3", cityName: "Varanasi Metro", locality: "Godowlia Heritage Zone", state: "Uttar Pradesh", baseFareMultiplier: 1.1, peakHourSurge: 1.30, nightSurgeMultiplier: 1.25, weatherSurge: 1.35, status: "Active" },
  { id: "cp-4", cityName: "Varanasi Metro", locality: "Bhelupur Residential", state: "Uttar Pradesh", baseFareMultiplier: 1.0, peakHourSurge: 1.15, nightSurgeMultiplier: 1.15, weatherSurge: 1.20, status: "Active" },
  { id: "cp-5", cityName: "Varanasi Metro", locality: "Cantt Railway Station Zone", state: "Uttar Pradesh", baseFareMultiplier: 1.05, peakHourSurge: 1.25, nightSurgeMultiplier: 1.20, weatherSurge: 1.30, status: "Active" },
  { id: "cp-6", cityName: "Prayagraj Hub", locality: "Civil Lines Central", state: "Uttar Pradesh", baseFareMultiplier: 1.0, peakHourSurge: 1.15, nightSurgeMultiplier: 1.20, weatherSurge: 1.25, status: "Active" },
  { id: "cp-7", cityName: "Lucknow Metro", locality: "Hazratganj & Gomti Nagar", state: "Uttar Pradesh", baseFareMultiplier: 1.15, peakHourSurge: 1.35, nightSurgeMultiplier: 1.30, weatherSurge: 1.40, status: "Active" },
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
  { id: "txn-901", bookingId: "HM-VAR-8821", customerName: "Rajesh Kumar Agrawal", amount: 1499, paymentMethod: "UPI (Google Pay)", status: "Success", date: "Today, 05:30 PM" },
  { id: "txn-902", bookingId: "HM-VAR-8822", customerName: "Sanjay Mishra", amount: 850, paymentMethod: "Cash on Service", status: "Success", date: "Today, 03:15 PM" },
  { id: "txn-903", bookingId: "HM-VAR-8823", customerName: "Priya Sharma", amount: 1249, paymentMethod: "UPI (PhonePe)", status: "Success", date: "Yesterday, 11:45 AM" },
  { id: "txn-904", bookingId: "HM-VAR-8820", customerName: "Dr. Ananya Mukherjee", amount: 2417, paymentMethod: "Helpmate Wallet", status: "Success", date: "Today, 04:45 PM" },
  { id: "txn-905", bookingId: "HM-VAR-8819", customerName: "Vikram Singh", amount: 647, paymentMethod: "Credit Card (HDFC)", status: "Success", date: "Today, 02:10 PM" },
  { id: "txn-906", bookingId: "HM-VAR-8818", customerName: "Sunil Verma", amount: 499, paymentMethod: "UPI (Paytm)", status: "Refunded", date: "28 Jul 2026, 06:15 PM" },
  { id: "txn-907", bookingId: "HM-VAR-8817", customerName: "Kavita Gupta", amount: 1899, paymentMethod: "NetBanking (ICICI)", status: "Success", date: "28 Jul 2026, 01:20 PM" },
  { id: "txn-908", bookingId: "HM-VAR-8816", customerName: "Manish Srivastava", amount: 799, paymentMethod: "UPI (BHIM)", status: "Failed", date: "27 Jul 2026, 09:10 AM" },
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
      bookings: { view: true, create: true, edit: true, delete: true },
      inspections: { view: true, create: true, edit: true, delete: true },
      customers: { view: true, create: true, edit: true, delete: true },
      technicians: { view: true, create: true, edit: true, delete: true },
      categories: { view: true, create: true, edit: true, delete: true },
      cms: { view: true, create: true, edit: true, delete: true },
      pricing: { view: true, create: true, edit: true, delete: true },
      locations: { view: true, create: true, edit: true, delete: true },
      payments: { view: true, create: true, edit: true, delete: true },
      billing: { view: true, create: true, edit: true, delete: true },
      commission: { view: true, create: true, edit: true, delete: true },
      coupons: { view: true, create: true, edit: true, delete: true },
      reviews: { view: true, create: true, edit: true, delete: true },
      media: { view: true, create: true, edit: true, delete: true },
      analytics: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, create: true, edit: true, delete: true },
      rbac: { view: true, create: true, edit: true, delete: true },
      canAssignJobs: true,
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
    email: "operations.sigra@helpmate.net.in",
    role: "Varanasi Operations Coordinator",
    status: "Active",
    lastLogin: "10 mins ago",
    phone: "+91 98390 22222",
    locality: "Sigra Zone",
    permissions: {
      bookings: { view: true, create: true, edit: true, delete: false },
      inspections: { view: true, create: false, edit: true, delete: false },
      customers: { view: true, create: false, edit: true, delete: false },
      technicians: { view: true, create: false, edit: true, delete: false },
      categories: { view: true, create: false, edit: false, delete: false },
      cms: { view: false, create: false, edit: false, delete: false },
      pricing: { view: false, create: false, edit: false, delete: false },
      locations: { view: true, create: false, edit: false, delete: false },
      payments: { view: false, create: false, edit: false, delete: false },
      billing: { view: false, create: false, edit: false, delete: false },
      commission: { view: false, create: false, edit: false, delete: false },
      coupons: { view: false, create: false, edit: false, delete: false },
      reviews: { view: true, create: false, edit: false, delete: false },
      media: { view: false, create: false, edit: false, delete: false },
      analytics: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, create: false, edit: false, delete: false },
      rbac: { view: false, create: false, edit: false, delete: false },
      canAssignJobs: true,
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
      bookings: { view: true, create: false, edit: true, delete: false },
      inspections: { view: true, create: false, edit: false, delete: false },
      customers: { view: true, create: false, edit: true, delete: false },
      technicians: { view: true, create: false, edit: false, delete: false },
      categories: { view: false, create: false, edit: false, delete: false },
      cms: { view: false, create: false, edit: false, delete: false },
      pricing: { view: false, create: false, edit: false, delete: false },
      locations: { view: false, create: false, edit: false, delete: false },
      payments: { view: true, create: false, edit: false, delete: false },
      billing: { view: true, create: false, edit: false, delete: false },
      commission: { view: false, create: false, edit: false, delete: false },
      coupons: { view: false, create: false, edit: false, delete: false },
      reviews: { view: true, create: false, edit: false, delete: false },
      media: { view: false, create: false, edit: false, delete: false },
      analytics: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, create: false, edit: false, delete: false },
      rbac: { view: false, create: false, edit: false, delete: false },
      canAssignJobs: true,
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
      bookings: { view: true, create: false, edit: false, delete: false },
      inspections: { view: false, create: false, edit: false, delete: false },
      customers: { view: true, create: false, edit: false, delete: false },
      technicians: { view: false, create: false, edit: false, delete: false },
      categories: { view: true, create: false, edit: false, delete: false },
      cms: { view: true, create: true, edit: true, delete: false },
      pricing: { view: true, create: true, edit: true, delete: false },
      locations: { view: true, create: false, edit: false, delete: false },
      payments: { view: true, create: false, edit: true, delete: false },
      billing: { view: true, create: true, edit: true, delete: true },
      commission: { view: true, create: false, edit: true, delete: false },
      coupons: { view: true, create: true, edit: true, delete: false },
      reviews: { view: false, create: false, edit: false, delete: false },
      media: { view: false, create: false, edit: false, delete: false },
      analytics: { view: true, create: false, edit: false, delete: false },
      reports: { view: true, create: false, edit: true, delete: false },
      rbac: { view: false, create: false, edit: false, delete: false },
      canAssignJobs: false,
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
    status: "Working",
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
    status: "In Transit",
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
    status: "Absent",
    joiningDate: "20 Feb 2024",
    totalEarnings: 156000,
    commissionPaid: 39000,
    pendingPayout: 8500,
    lastPayoutDate: "15 Jan 2026",
  },
  {
    id: "tech-104",
    name: "Vikas Srivastava",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    role: "Master Plumber & Pipe Fitter",
    category: "Plumbing",
    locality: "Godowlia, Varanasi",
    pincode: "221001",
    phone: "+91 98388 77611",
    rating: 4.88,
    totalJobs: 245,
    aadhaarVerified: true,
    policeVerified: true,
    bondedInsurance: true,
    status: "Available",
    joiningDate: "10 Mar 2024",
    totalEarnings: 198000,
    commissionPaid: 49500,
    pendingPayout: 11200,
    lastPayoutDate: "22 Jan 2026",
  },
];

const generateMockBookings = (): Booking[] => {
  const initialFiveBookings: Booking[] = [
    {
      id: "HM-VAR-8821",
      customerName: "Rajesh Kumar Agrawal",
      customerPhone: "+91 77050 04040",
      customerGstin: "09AABCH1234H1Z5",
      city: "Varanasi",
      locality: "Sigra",
      pincode: "221002",
      address: "D-38/21, Sigra Central Main Road, Varanasi",
      serviceTitle: "Power Jet AC Servicing & Gas Refill Bundle",
      category: "AC Service & Repair",
      systemType: "Split AC (1.5 Ton)",
      servicesList: [
        { id: "sp-1", serviceCode: "HM-SVC-8821-01", title: "Split AC Foam Jet Servicing", price: 599, quantity: 1, category: "AC Service & Repair", duration: "45 mins" },
        { id: "sp-4", serviceCode: "HM-SVC-8821-02", title: "Gas Leak Repair & Full Refill (R32/R410a)", price: 1499, quantity: 1, category: "AC Service & Repair", duration: "90 mins" },
        { id: "sp-5", serviceCode: "HM-SVC-8821-03", title: "Split AC Capacitor Replacement", price: 499, quantity: 1, category: "AC Service & Repair", duration: "30 mins" },
      ],
      basePrice: 2597,
      convenienceFee: 49,
      cgst: 238.14,
      sgst: 238.14,
      totalAmount: 3122,
      invoiceType: "B2B",
      commissionAmount: 649.25,
      partnerEarnings: 1947.75,
      isInspectionBased: true,
      initialInspectionQuote: 599,
      updatedInspectionQuote: 2597,
      materialCost: 1499,
      labourCost: 1098,
      inspectionRemarks: "Compressor capacitor burnt & copper pipe R32 refrigerant top-up required. PCB circuit tested clean.",
      inspectionImages: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80"
      ],
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
      id: "HM-VAR-8822",
      customerName: "Sanjay Mishra",
      customerPhone: "+91 98390 11928",
      city: "Varanasi",
      locality: "Mahmoorganj",
      pincode: "221010",
      address: "B-32/12 Tulsipur, Near Galaxy Hospital, Mahmoorganj, Varanasi",
      serviceTitle: "Main MCB & Socket Board Upgrade Bundle",
      category: "Electrician",
      systemType: "3-Phase Distribution Box",
      servicesList: [
        { id: "el-1", serviceCode: "HM-SVC-8822-01", title: "Switchboard & Socket Installation (5 points)", price: 299, quantity: 2, category: "Electrician", duration: "30 mins" },
        { id: "el-3", serviceCode: "HM-SVC-8822-02", title: "Main Line MCB Tripping & Short Circuit Fix", price: 499, quantity: 1, category: "Electrician", duration: "45 mins" },
      ],
      basePrice: 1097,
      convenienceFee: 49,
      cgst: 103.14,
      sgst: 103.14,
      totalAmount: 1352,
      invoiceType: "B2C",
      commissionAmount: 274.25,
      partnerEarnings: 822.75,
      isInspectionBased: true,
      initialInspectionQuote: 299,
      updatedInspectionQuote: 1097,
      materialCost: 550,
      labourCost: 547,
      inspectionRemarks: "Overheated 32A MCB switch melted terminal block. Replaced with Havells 32A C-Curve MCB.",
      inspectionImages: [
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500&auto=format&fit=crop&q=80"
      ],
      inspectionApprovedByCustomer: false,
      otpCode: "3310",
      isOtpVerified: false,
      status: "Assigned",
      technicianName: "Amit Pandey",
      technicianId: "tech-103",
      date: "Today, 03:15 PM",
      timeSlot: "03:00 PM - 04:30 PM",
      paymentMethod: "Cash on Service",
    },
    {
      id: "HM-VAR-8823",
      customerName: "Priya Sharma",
      customerPhone: "+91 91402 88301",
      city: "Varanasi",
      locality: "Ravindrapuri",
      pincode: "221005",
      address: "House 45, Lane 3, Near Anand Park, Ravindrapuri, Varanasi",
      serviceTitle: "Water Tap Leakage Fix & Mixer Installation",
      category: "Plumbing",
      systemType: "CPVC Underground Line",
      servicesList: [
        { id: "pl-1", serviceCode: "HM-SVC-8823-01", title: "Water Tap Leakage Fix & Washer Replace", price: 199, quantity: 2, category: "Plumbing", duration: "20 mins" },
        { id: "pl-2", serviceCode: "HM-SVC-8823-02", title: "Hot & Cold Water Mixer Installation", price: 499, quantity: 1, category: "Plumbing", duration: "45 mins" },
      ],
      basePrice: 897,
      convenienceFee: 49,
      cgst: 85.14,
      sgst: 85.14,
      totalAmount: 1116,
      invoiceType: "B2C",
      commissionAmount: 224.25,
      partnerEarnings: 672.75,
      isInspectionBased: true,
      initialInspectionQuote: 199,
      updatedInspectionQuote: 897,
      materialCost: 499,
      labourCost: 398,
      inspectionRemarks: "CPVC 1-inch elbow hairline crack fixed and hot/cold mixer wall mounted.",
      inspectionImages: [
        "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80"
      ],
      inspectionApprovedByCustomer: true,
      otpCode: "9912",
      isOtpVerified: true,
      status: "Completed",
      technicianName: "Vikas Kumar",
      technicianId: "tech-104",
      date: "Yesterday",
      timeSlot: "11:00 AM - 12:30 PM",
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
      serviceTitle: "Full House Deep Clean & Sofa Shampooing Combo",
      category: "Home Cleaning",
      servicesList: [
        { id: "hc-1", serviceCode: "HM-SVC-8820-01", title: "2BHK Full House Deep Cleaning", price: 2999, quantity: 1, category: "Home Cleaning", duration: "4 Hours" },
        { id: "sc-1", serviceCode: "HM-SVC-8820-02", title: "5-Seater Fabric Sofa Shampooing", price: 899, quantity: 1, category: "Home Cleaning", duration: "60 mins" },
      ],
      basePrice: 3898,
      convenienceFee: 49,
      cgst: 355.23,
      sgst: 355.23,
      totalAmount: 4657,
      invoiceType: "B2C",
      commissionAmount: 974.50,
      partnerEarnings: 2923.50,
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

  const localities = ["Sigra", "Lanka / Assi Ghat", "Godowlia", "Bhelupur", "Mahmoorganj", "Shivpur", "Sarnath", "Varanasi Cantt"];
  const pincodes: Record<string, string> = {
    "Sigra": "221002",
    "Lanka / Assi Ghat": "221005",
    "Godowlia": "221001",
    "Bhelupur": "221010",
    "Mahmoorganj": "221010",
    "Shivpur": "221003",
    "Sarnath": "221007",
    "Varanasi Cantt": "221002",
  };

  const services = [
    { title: "Power Jet Split AC Servicing", category: "AC", price: 699 },
    { title: "Window AC Gas Leakage Repair", category: "AC", price: 2499 },
    { title: "Full 3BHK Villa Deep Cleaning", category: "Cleaning", price: 4999 },
    { title: "Bathroom Hydro Jet Descaling", category: "Cleaning", price: 699 },
    { title: "Smart MCB & Circuit Box Fitting", category: "Electrician", price: 799 },
    { title: "Short Circuit & Wire Fault Repair", category: "Electrician", price: 499 },
    { title: "High-Pressure Drain Unclogging", category: "Plumbing", price: 599 },
    { title: "Tap Mixer & Shower Fitting", category: "Plumbing", price: 349 },
    { title: "Ayurvedic Kashi Spa Body Massage", category: "Beauty", price: 1999 },
    { title: "Organic Gold Glow Facial", category: "Beauty", price: 1499 },
    { title: "RO Water Purifier Filter Change", category: "Plumbing", price: 899 },
    { title: "Washing Machine Motor Overhaul", category: "Electrician", price: 1299 },
  ];

  const customers = [
    { name: "Rajesh Kumar Agrawal", phone: "+91 77050 04040" },
    { name: "Sunita Agrawal", phone: "+91 94501 88200" },
    { name: "Rakesh Verma", phone: "+91 98390 12001" },
    { name: "Kavita Gupta", phone: "+91 94152 33412" },
    { name: "Abhishek Singh", phone: "+91 99180 77123" },
    { name: "Archana Tripathi", phone: "+91 98391 55642" },
    { name: "Deepak Pandey", phone: "+91 77050 88129" },
    { name: "Neha Agarwal", phone: "+91 94501 66321" },
    { name: "Rohit Srivastava", phone: "+91 98392 44109" },
    { name: "Pooja Yadav", phone: "+91 91402 99823" },
    { name: "Sunil Kumar Rastogi", phone: "+91 94150 11294" },
    { name: "Meenakshi Joshi", phone: "+91 98393 77210" },
    { name: "Alok Chaurasia", phone: "+91 99350 44812" },
    { name: "Shalini Rai", phone: "+91 77051 22938" },
  ];

  const technicians = [
    { name: "Ramesh Yadav", id: "tech-101" },
    { name: "Amit Pandey", id: "tech-103" },
    { name: "Vikas Kumar", id: "tech-104" },
    { name: "Sunita Verma", id: "tech-102" },
  ];

  const statuses: BookingStatus[] = [
    "Completed",
    "In Progress",
    "Completed",
    "Pending",
    "Refunded",
    "Completed",
    "Cancelled",
    "Waiting For Assignment",
    "Completed",
  ];

  const paymentMethods: Array<Booking["paymentMethod"]> = ["UPI", "Cash on Service", "Card", "Helpmate Wallet", "Online"];

  const generated: Booking[] = [];
  for (let i = 6; i <= 140; i++) {
    const numStr = String(8820 + i);
    const id = `HM-VAR-${numStr}`;
    const cust = customers[i % customers.length];
    const srv = services[i % services.length];
    const loc = localities[i % localities.length];
    const pin = pincodes[loc] || "221002";
    const status = statuses[i % statuses.length];
    const tech = technicians[i % technicians.length];

    const basePrice = srv.price;
    const convenienceFee = 49;
    const gstTotal = Math.round(basePrice * 0.18 * 100) / 100;
    const cgst = Math.round((gstTotal / 2) * 100) / 100;
    const sgst = cgst;
    const totalAmount = Math.round((basePrice + convenienceFee + gstTotal) * 100) / 100;
    const commissionAmount = Math.round(basePrice * 0.25 * 100) / 100;
    const partnerEarnings = Math.round(basePrice * 0.75 * 100) / 100;

    generated.push({
      id,
      customerName: cust.name,
      customerPhone: cust.phone,
      city: "Varanasi",
      locality: loc,
      pincode: pin,
      address: `Plot ${10 + (i % 50)}, ${loc} Main Road, Varanasi`,
      serviceTitle: srv.title,
      category: srv.category,
      basePrice,
      convenienceFee,
      cgst,
      sgst,
      totalAmount,
      invoiceType: i % 4 === 0 ? "B2B" : "B2C",
      commissionAmount,
      partnerEarnings,
      status,
      technicianName: status !== "Pending" && status !== "Waiting For Assignment" ? tech.name : undefined,
      technicianId: status !== "Pending" && status !== "Waiting For Assignment" ? tech.id : undefined,
      date: i % 2 === 0 ? `2026-08-${String(1 + (i % 10)).padStart(2, '0')}, 02:00 PM` : `2026-07-${String(10 + (i % 15)).padStart(2, '0')}`,
      timeSlot: "02:00 PM - 03:30 PM",
      paymentMethod: paymentMethods[i % paymentMethods.length],
      isOtpVerified: status === "Completed",
      otpCode: String(1000 + (i * 37) % 8999),
      callingDate: `2026-07-${15 + (i % 12)}`,
      callingPerson: ["Pooja Sharma (Operations)", "Sunil Gupta (Caller)", "Ritu Singh (Support)", "Anita Roy (CRM)"][i % 4],
      handledBy: ["Aman Verma (HQ)", "Varanasi Ops Admin", "Rajeev Verma (Lead)", "Priya Sharma (Ops)"][i % 4],
      notes: i % 3 === 0 ? "Customer requested morning slot. Handle with care." : undefined,
    });
  }

  return [...initialFiveBookings, ...generated];
};

export const initialBookings: Booking[] = generateMockBookings();

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
    alternatePhone: "+91 98390 99881",
    email: "rajesh.agrawal@gmail.com",
    locality: "Sigra",
    pincode: "221002",
    address: "D-58/16C Shashtri Nagar Colony, Sigra Main Road, Varanasi",
    secondaryLocality: "Mahmoorganj",
    secondaryAddress: "B-12/40 Shop No. 4, Mahmoorganj Commercial Complex, Varanasi",
    tier: "Crown Elite",
    totalSpend: 34500,
    totalBookings: 8,
    lastBookingDate: "Today, 04:30 PM",
    joinedDate: "12 Jan 2024",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    customerType: "Commercial Business / B2B",
    companyName: "Agrawal Electricals & Retail Solutions",
    customerGstin: "09AABCH1234H1Z5",
    householdType: "Commercial Office / Shop",
    registeredAppliances: ["3x Inverter AC 1.5 Ton", "1x Commercial Water Cooler", "1x Main Distribution Panel"],
    preferredLanguage: "Hindi",
    preferredTimeSlot: "Morning (9am-12pm)",
    loyaltyPoints: 1250,
    walletBalance: 1250,
    preferredPaymentMethod: "UPI Digital Prepaid (Google Pay)",
    crmManager: "Pooja Sharma (Operations HQ)",
    aadhaarNumber: "7821-4920-1102",
    aadhaarDocUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cust-2",
    name: "Dr. Ananya Mukherjee",
    phone: "+91 94501 22910",
    alternatePhone: "+91 94501 99000",
    email: "ananya.bhu@yahoo.in",
    locality: "Lanka / Assi Ghat",
    pincode: "221005",
    address: "Plot 12, Assi Ghat Road, Near BHU Gate, Lanka, Varanasi",
    secondaryLocality: "BHU Campus",
    secondaryAddress: "Faculty Quarter 45, Professor Colony, BHU Campus, Varanasi",
    tier: "Crown Elite",
    totalSpend: 28900,
    totalBookings: 6,
    lastBookingDate: "Yesterday",
    joinedDate: "05 Mar 2024",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    customerType: "Individual Household",
    householdType: "Villa / Bungalow",
    registeredAppliances: ["2x Split AC 1.5 Ton", "1x RO Water Purifier", "1x Front Load Washing Machine"],
    preferredLanguage: "English",
    preferredTimeSlot: "Evening (4pm-8pm)",
    loyaltyPoints: 940,
    walletBalance: 450,
    preferredPaymentMethod: "Credit Card (HDFC Bank)",
    crmManager: "Sunil Gupta (Varanasi Ops)",
    aadhaarNumber: "4920-1102-8821",
    aadhaarDocUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "cust-3",
    name: "Sanjay Mishra",
    phone: "+91 98390 11928",
    email: "sanjay.mishra@helpmate.com",
    locality: "Mahmoorganj",
    pincode: "221010",
    address: "B-32/12 Tulsipur, Near Galaxy Hospital, Mahmoorganj, Varanasi",
    tier: "VIP",
    totalSpend: 14200,
    totalBookings: 4,
    lastBookingDate: "28 Jul 2026",
    joinedDate: "18 Jun 2024",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    customerType: "Individual Household",
    householdType: "Apartment / Flat",
    registeredAppliances: ["1x Split AC", "1x Refrigerator 350L"],
    preferredLanguage: "Hindi",
    preferredTimeSlot: "Afternoon (12pm-4pm)",
    loyaltyPoints: 480,
    walletBalance: 200,
    preferredPaymentMethod: "Cash on Service",
    crmManager: "Ritu Singh (Support)",
    aadhaarNumber: "3310-9920-8812",
    aadhaarDocUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
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

export const initialCategoryCommissionRules: CategoryCommissionRule[] = [
  { id: "cc-1", categoryName: "AC Service & Repair", commissionPercentage: 25, convenienceFeeSharePercentage: 100, minimumCommissionFloor: 150, status: "Active" },
  { id: "cc-2", categoryName: "Elite Deep Cleaning", commissionPercentage: 20, convenienceFeeSharePercentage: 100, minimumCommissionFloor: 300, status: "Active" },
  { id: "cc-3", categoryName: "Smart Home Electrician", commissionPercentage: 15, convenienceFeeSharePercentage: 100, minimumCommissionFloor: 50, status: "Active" },
  { id: "cc-4", categoryName: "Hydro Jet Plumbing", commissionPercentage: 18, convenienceFeeSharePercentage: 100, minimumCommissionFloor: 75, status: "Active" },
  { id: "cc-5", categoryName: "Home Salon & Spa", commissionPercentage: 30, convenienceFeeSharePercentage: 100, minimumCommissionFloor: 200, status: "Active" },
  { id: "cc-6", categoryName: "Appliance Repair", commissionPercentage: 22, convenienceFeeSharePercentage: 100, minimumCommissionFloor: 100, status: "Active" },
  { id: "cc-7", categoryName: "Car & Bike Wash", commissionPercentage: 20, convenienceFeeSharePercentage: 100, minimumCommissionFloor: 80, status: "Active" },
  { id: "cc-8", categoryName: "Pest Control", commissionPercentage: 25, convenienceFeeSharePercentage: 100, minimumCommissionFloor: 250, status: "Active" },
];

export const initialSettlementRecords: SettlementRecord[] = [
  {
    id: "SETTL-VAR-910",
    technicianId: "tech-101",
    technicianName: "Ramesh Yadav",
    category: "AC Servicing & Repair",
    bankAccountName: "Ramesh Yadav",
    bankAccountNumber: "9820-1049-8120",
    ifscCode: "SBIN0001240",
    upiId: "ramesh.yadav@okaxis",
    grossAmount: 48000,
    commissionDeducted: 12000,
    netPayoutAmount: 36000,
    paymentMethod: "Manual Bank Transfer (IMPS / NEFT)",
    utrNumber: "IMPS-VAR-2026-9928102830",
    settlementDate: "14 Aug 2026",
    period: "07 Aug - 13 Aug 2026",
    status: "Completed",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    notes: "Today's daily payout processed successfully",
  },
  {
    id: "SETTL-VAR-909",
    technicianId: "tech-102",
    technicianName: "Sunita Verma",
    category: "Beauty & Spa",
    bankAccountName: "Sunita Verma",
    bankAccountNumber: "4910-2910-4491",
    ifscCode: "HDFC0000142",
    upiId: "sunita.verma@okhdfcbank",
    grossAmount: 36000,
    commissionDeducted: 9000,
    netPayoutAmount: 27000,
    paymentMethod: "Manual UPI Transfer",
    utrNumber: "UPI-VAR-2026-8819203910",
    settlementDate: "14 Aug 2026",
    period: "07 Aug - 13 Aug 2026",
    status: "Completed",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    notes: "Today's settlement completed",
  },
  {
    id: "SETTL-VAR-908",
    technicianId: "tech-103",
    technicianName: "Amit Pandey",
    category: "Electrician",
    bankAccountName: "Amit Pandey",
    bankAccountNumber: "1102-4910-8820",
    ifscCode: "ICIC0000492",
    upiId: "amit.pandey@icici",
    grossAmount: 24000,
    commissionDeducted: 6000,
    netPayoutAmount: 18000,
    paymentMethod: "Manual Bank Transfer (IMPS / NEFT)",
    utrNumber: "NEFT-VAR-2026-3392019482",
    settlementDate: "12 Aug 2026",
    period: "05 Aug - 11 Aug 2026",
    status: "Completed",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "SETTL-VAR-907",
    technicianId: "tech-104",
    technicianName: "Manoj Kumar",
    category: "Plumbing",
    bankAccountName: "Manoj Kumar",
    bankAccountNumber: "7710-4920-1120",
    ifscCode: "PUNB0004810",
    upiId: "manoj.plumber@paytm",
    grossAmount: 32000,
    commissionDeducted: 8000,
    netPayoutAmount: 24000,
    paymentMethod: "Manual Cash Payout",
    utrNumber: "CASH-VAR-2026-991029",
    settlementDate: "10 Aug 2026",
    period: "03 Aug - 09 Aug 2026",
    status: "Completed",
  },
  {
    id: "SETTL-VAR-901",
    technicianId: "tech-101",
    technicianName: "Ramesh Yadav",
    category: "AC Repair",
    bankAccountName: "Ramesh Yadav",
    bankAccountNumber: "9820-1049-8120",
    ifscCode: "SBIN0001240",
    upiId: "ramesh.yadav@okaxis",
    grossAmount: 56800,
    commissionDeducted: 14200,
    netPayoutAmount: 42600,
    paymentMethod: "IMPS Bank Transfer",
    utrNumber: "IMPS-VAR-2026-9812401824",
    settlementDate: "01 Aug 2026",
    period: "25 Jul - 31 Jul 2026",
    status: "Completed",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    notes: "Monthly settlement processed cleanly",
  },
  {
    id: "SETTL-VAR-902",
    technicianId: "tech-102",
    technicianName: "Sunita Verma",
    category: "Beauty & Spa",
    bankAccountName: "Sunita Verma",
    bankAccountNumber: "4910-2910-4491",
    ifscCode: "HDFC0000142",
    upiId: "sunita.verma@okhdfcbank",
    grossAmount: 75600,
    commissionDeducted: 18900,
    netPayoutAmount: 56700,
    paymentMethod: "NEFT Direct",
    utrNumber: "NEFT-VAR-2026-4491029102",
    settlementDate: "20 Jan 2026",
    period: "13 Jan - 19 Jan 2026",
    status: "Completed",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
    notes: "Batch payout verified by Finance Manager",
  },
];
