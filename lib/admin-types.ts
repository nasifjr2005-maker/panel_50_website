export type AdminPrice = {
  id: string;
  duration: string;
  bdt: number;
  usd: string;
  sortOrder: number;
};

export type AdminMedia = {
  id: string;
  productId?: string | null;
  url: string;
  previewUrl?: string;
  name: string;
  type: string;
  size: number;
  isFeatured: boolean;
  createdAt: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  categoryId: string;
  categoryName: string;
  sortOrder: number;
  featuredImageId?: string | null;
  prices: AdminPrice[];
  media: AdminMedia[];
  updatedAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  products: AdminProduct[];
};

export type AdminOrder = {
  id: string;
  name: string;
  email?: string;
  whatsapp?: string;
  productId?: string | null;
  productName: string;
  duration: string;
  bdt: number;
  usd: string;
  message?: string;
  status: "pending" | "completed";
  createdAt: string;
};

export type AdminInquiry = {
  id: string;
  name: string;
  email?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type AdminTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  enabled: boolean;
};

export type AdminFAQ = {
  id: string;
  question: string;
  answer: string;
  enabled: boolean;
  sortOrder: number;
};

export type AdminCommunityLink = {
  id: string;
  title: string;
  href: string;
  description: string;
  logoUrl: string;
  accent: string;
  enabled: boolean;
  sortOrder: number;
};

export type AdminContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryCta: string;
  secondaryCta: string;
  featuresEyebrow: string;
  featuresTitle: string;
  featuresText: string;
  howEyebrow: string;
  howTitle: string;
  howText: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsText: string;
  faqEyebrow: string;
  faqTitle: string;
  faqText: string;
  finalCtaEyebrow: string;
  finalCtaTitle: string;
  finalCtaText: string;
  supportEyebrow: string;
  supportTitle: string;
  supportText: string;
  communityEyebrow: string;
  communityTitle: string;
  communityText: string;
  contactEyebrow: string;
  contactTitle: string;
  contactText: string;
  newsletterTitle: string;
  newsletterText: string;
  stats: Array<{ label: string; value: string }>;
};

export type AdminSettings = {
  websiteName: string;
  brandName: string;
  brandTagline: string;
  logoUrl: string;
  orderButtonText: string;
  supportEmail: string;
  whatsappNumber: string;
  whatsappUrl: string;
  discordLink: string;
  discordDescription: string;
  youtubeLink: string;
  youtubeDescription: string;
  footerDescription: string;
  copyrightText: string;
  formSubmitEmail: string;
  primaryColor: string;
  secondaryColor: string;
};

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  recoveryEmail: string;
  backupRecoveryEmail: string;
  whatsappNumber: string;
  sessionTimeoutMinutes: number;
  failedAttempts: number;
  lockedUntil?: string;
  createdAt: string;
  updatedAt: string;
};

export type PasswordResetToken = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
};

export type LoginHistoryItem = {
  id: string;
  username: string;
  success: boolean;
  ip: string;
  userAgent: string;
  createdAt: string;
};

export type ActiveSession = {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  userAgent: string;
  ip: string;
  revoked: boolean;
};

export type RecoveryRequest = {
  id: string;
  username: string;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
};

export type AdminStore = {
  adminUser: AdminUser;
  passwordResetTokens: PasswordResetToken[];
  loginHistory: LoginHistoryItem[];
  activeSessions: ActiveSession[];
  recoveryRequests: RecoveryRequest[];
  categories: AdminCategory[];
  media: AdminMedia[];
  orders: AdminOrder[];
  inquiries: AdminInquiry[];
  testimonials: AdminTestimonial[];
  faqs: AdminFAQ[];
  communityLinks: AdminCommunityLink[];
  content: AdminContent;
  settings: AdminSettings;
  lastLogin?: string;
  recentUpdates: string[];
};
