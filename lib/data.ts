import {
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Gamepad2,
  Headphones,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap
} from "lucide-react";

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Panels", href: "#pricing" },
  { label: "Support", href: "#customer-support" },
  { label: "Community", href: "#community" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" }
];

export const supportEmail = "panel50official@gmail.com";
export const formsubmitEndpoint = `https://formsubmit.co/ajax/${supportEmail}`;
export const supportWhatsapp = "01823666560";
export const supportWhatsappUrl = "https://wa.me/8801823666560";

export function buildGmailComposeUrl({
  subject = "",
  body = ""
}: {
  subject?: string;
  body?: string;
} = {}) {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: supportEmail
  });

  if (subject) {
    params.set("su", subject);
  }

  if (body) {
    params.set("body", body);
  }

  return `https://mail.google.com/mail/?${params.toString()}`;
}

export const supportGmailUrl = buildGmailComposeUrl();

export const communityLinks = [
  {
    title: "YouTube",
    href: "https://www.youtube.com/@ferocheats",
    description: "Subscribe for updates, showcases, and announcements.",
    accent: "red"
  },
  {
    title: "Discord",
    href: "https://discord.gg/Tm7jew8Zsb",
    description: "Join our Discord server for support, updates, and community discussions.",
    accent: "indigo"
  }
];

export const panelCategories = [
  {
    category: "PC Panel",
    description: "Windows-focused panel options for desktop players and advanced setups.",
    panels: [
      "AIMKILL EXE",
      "SILENTKILL EXE",
      "EXTERNAL PANEL",
      "BASIC PANEL",
      "INTERNAL PANEL",
      "STREAMER PANEL",
      "UID BYPASS",
      "LIB BYPASS",
      "PC BR MODS"
    ]
  },
  {
    category: "Android Panel (Root / Non-Root)",
    description: "Android-ready options for supported rooted and non-rooted configurations.",
    panels: ["DRIP CLIENT (ROOT)", "DRIP CLIENT (NON ROOT)", "PATO TEAM", "DOLPHIN PANEL"]
  },
  {
    category: "IOS PANELS",
    description: "iOS panel choices for supported Apple device setups.",
    panels: ["SONIC PANEL", "LOL PANEL", "MIGUL PANEL", "FLOURITE PANEL"]
  }
];

export type PanelPrice = {
  duration: string;
  bdt: number;
  usd: string;
};

export type SelectedPanelOrder = {
  panel: string;
  duration: string;
  bdt: number;
  usd: string;
};

export const panelPricing: Record<string, PanelPrice[]> = {
  "AIMKILL EXE": [
    { duration: "1 Day", bdt: 140, usd: "$1.30" },
    { duration: "7 Days", bdt: 600, usd: "$5" },
    { duration: "30 Days", bdt: 1700, usd: "$15" },
    { duration: "Lifetime", bdt: 3000, usd: "$30" }
  ],
  "SILENTKILL EXE": [
    { duration: "1 Day", bdt: 140, usd: "$1.30" },
    { duration: "7 Days", bdt: 600, usd: "$5" },
    { duration: "30 Days", bdt: 1700, usd: "$15" },
    { duration: "Lifetime", bdt: 3000, usd: "$30" }
  ],
  "EXTERNAL PANEL": [
    { duration: "7 Days", bdt: 500, usd: "$5" },
    { duration: "30 Days", bdt: 1500, usd: "$15" },
    { duration: "Lifetime", bdt: 3000, usd: "$30" }
  ],
  "BASIC PANEL": [
    { duration: "1 Day", bdt: 100, usd: "$1" },
    { duration: "3 Days", bdt: 200, usd: "$2" },
    { duration: "1 Week", bdt: 400, usd: "$4" },
    { duration: "1 Month", bdt: 1200, usd: "$12" },
    { duration: "Lifetime", bdt: 2000, usd: "$20" }
  ],
  "INTERNAL PANEL": [
    { duration: "1 Day", bdt: 100, usd: "$1" },
    { duration: "3 Days", bdt: 200, usd: "$2" },
    { duration: "1 Week", bdt: 400, usd: "$4" },
    { duration: "1 Month", bdt: 1200, usd: "$12" },
    { duration: "Lifetime", bdt: 2000, usd: "$20" }
  ],
  "STREAMER PANEL": [
    { duration: "1 Month", bdt: 2000, usd: "$20" },
    { duration: "Lifetime", bdt: 4500, usd: "$45" }
  ],
  "UID BYPASS": [
    { duration: "3 Days", bdt: 200, usd: "$2" },
    { duration: "1 Week", bdt: 500, usd: "$5" },
    { duration: "1 Month", bdt: 1200, usd: "$12" },
    { duration: "Lifetime", bdt: 2000, usd: "$20" }
  ],
  "LIB BYPASS": [
    { duration: "3 Days", bdt: 200, usd: "$2" },
    { duration: "7 Days", bdt: 500, usd: "$5" },
    { duration: "30 Days", bdt: 1200, usd: "$12" },
    { duration: "Lifetime", bdt: 3500, usd: "$35" }
  ],
  "PC BR MODS": [
    { duration: "3 Days", bdt: 240, usd: "$2" },
    { duration: "15 Days", bdt: 480, usd: "$4" },
    { duration: "1 Month", bdt: 840, usd: "$7" }
  ],
  "DRIP CLIENT (ROOT)": [
    { duration: "1 Day", bdt: 120, usd: "$1" },
    { duration: "7 Days", bdt: 480, usd: "$4" },
    { duration: "30 Days", bdt: 1200, usd: "$10" }
  ],
  "DRIP CLIENT (NON ROOT)": [
    { duration: "1 Day", bdt: 120, usd: "$1" },
    { duration: "3 Days", bdt: 360, usd: "$3" },
    { duration: "15 Days", bdt: 600, usd: "$5" },
    { duration: "30 Days", bdt: 960, usd: "$8" }
  ],
  "PATO TEAM": [
    { duration: "3 Days", bdt: 360, usd: "$3" },
    { duration: "7 Days", bdt: 600, usd: "$5" },
    { duration: "30 Days", bdt: 960, usd: "$8" }
  ],
  "DOLPHIN PANEL": [
    { duration: "1 Day", bdt: 120, usd: "$1" },
    { duration: "3 Days", bdt: 360, usd: "$3" },
    { duration: "7 Days", bdt: 600, usd: "$5" },
    { duration: "30 Days", bdt: 1200, usd: "$10" }
  ],
  "SONIC PANEL": [
    { duration: "Sonic + Certificate", bdt: 3000, usd: "$25" },
    { duration: "Certificate Only", bdt: 960, usd: "$8" },
    { duration: "Sonic (1 Month)", bdt: 1800, usd: "$15" }
  ],
  "LOL PANEL": [
    { duration: "LOL + Certificate", bdt: 3000, usd: "$25" },
    { duration: "Certificate Only", bdt: 960, usd: "$8" },
    { duration: "LOL (1 Month)", bdt: 1800, usd: "$15" }
  ],
  "MIGUL PANEL": [
    { duration: "Migul + Certificate", bdt: 2640, usd: "$22" },
    { duration: "Certificate Only", bdt: 960, usd: "$8" },
    { duration: "Migul (1 Month)", bdt: 1560, usd: "$13" }
  ],
  "FLOURITE PANEL": [
    { duration: "Flourite + Certificate", bdt: 2640, usd: "$22" },
    { duration: "Certificate Only", bdt: 960, usd: "$8" },
    { duration: "FLOURITE ONLY (1 MONTH)", bdt: 1800, usd: "$15" }
  ]
};

export const pains = [
  "Overpriced panels with unclear value",
  "Slow delivery after payment",
  "Untrusted sellers and risky transactions",
  "Poor support when setup gets confusing",
  "No clear process for safe purchasing"
];

export const services = [
  {
    title: "Free Fire Panels",
    text: "Premium panel access options prepared for fast onboarding and everyday use.",
    icon: Gamepad2
  },
  {
    title: "Instant Delivery",
    text: "A streamlined order flow built to get access details to customers quickly.",
    icon: Zap
  },
  {
    title: "Secure Orders",
    text: "Clear order handling, verified communication, and privacy-conscious support.",
    icon: LockKeyhole
  },
  {
    title: "Competitive Pricing",
    text: "Flexible packages designed to keep quality high and costs under control.",
    icon: CircleDollarSign
  },
  {
    title: "24/7 Support",
    text: "Responsive assistance for order status, activation guidance, and questions.",
    icon: Headphones
  },
  {
    title: "Trusted Service",
    text: "Built around repeat buyers, transparent expectations, and reliable delivery.",
    icon: ShieldCheck
  }
];

export const stats = [
  { value: "10,000+", label: "Orders Completed" },
  { value: "5,000+", label: "Customers Served" },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "Fast", label: "Delivery Guarantee" }
];

export const results = [
  { label: "Customer Growth", value: "+184%", detail: "month-over-month demand across repeat buyers" },
  { label: "Delivery Performance", value: "92%", detail: "orders prepared for same-session handoff" },
  { label: "Customer Satisfaction", value: "4.9/5", detail: "average support and order experience rating" },
  { label: "Repeat Purchase Rate", value: "68%", detail: "buyers returning for upgrades and renewals" }
];

export const steps = [
  "Choose a Panel",
  "Place Your Order",
  "Receive Access",
  "Start Using Instantly"
];

export const benefits = [
  { title: "Save Money", icon: CircleDollarSign },
  { title: "Instant Access", icon: Rocket },
  { title: "Trusted Source", icon: BadgeCheck },
  { title: "Secure Purchases", icon: ShieldCheck },
  { title: "Fast Support", icon: Headphones },
  { title: "Better Gaming Experience", icon: Sparkles }
];

export const faqs = [
  {
    question: "How fast is delivery?",
    answer: "Most orders are prepared quickly after confirmation. Exact timing can vary by package and current order volume, but speed is a core part of the service."
  },
  {
    question: "Is payment secure?",
    answer: "Orders are handled through clear, verified communication channels with privacy-conscious processing and confirmation before access is delivered."
  },
  {
    question: "How do I receive my panel?",
    answer: "After your order is confirmed, the access details and setup guidance are sent through the contact method used during purchase."
  },
  {
    question: "Do you provide support?",
    answer: "Yes. Support is available for order questions, activation guidance, package selection, and post-purchase assistance."
  },
  {
    question: "Are there refunds?",
    answer: "Refund eligibility depends on order status and whether access has already been delivered. Contact support with your order details for review."
  },
  {
    question: "Is the service available worldwide?",
    answer: "Yes. Customers can place orders from many regions, subject to payment availability and service compatibility."
  },
  {
    question: "What payment methods are accepted?",
    answer: "Available payment options can vary by region. The team will confirm supported methods before your order is finalized."
  },
  {
    question: "How can I contact support?",
    answer: "Use the contact section on this page to reach the team for package advice, order status, or service questions."
  }
];

export const trustBadges = [
  { label: "Secure checkout flow", icon: ShieldCheck },
  { label: "Fast activation", icon: Clock3 },
  { label: "Rated by repeat buyers", icon: Star },
  { label: "Growth-focused service", icon: TrendingUp }
];
