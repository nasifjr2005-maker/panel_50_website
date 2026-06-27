import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { createHash, randomBytes, randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { faqs, panelCategories, panelPricing, stats, supportEmail, supportWhatsapp, communityLinks } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import type {
  AdminCategory,
  AdminCommunityLink,
  AdminContent,
  AdminFAQ,
  AdminInquiry,
  AdminMedia,
  AdminOrder,
  AdminPrice,
  AdminProduct,
  AdminSettings,
  AdminStore,
  AdminTestimonial
} from "@/lib/admin-types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "admin-store.json");
const storeSnapshotKey = "admin-store-snapshot";
const defaultAdminUsername = "nasif07_";
const defaultAdminPassword = "panel50official@#ff";
const legacyAdminUsername = "owner";
const legacyAdminPassword = "panel50admin";
let memoryStore: AdminStore | null = null;
let databaseUnavailable = false;

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL) && !databaseUnavailable;
}

export function getStorePersistenceStatus() {
  if (hasDatabaseUrl()) {
    return {
      mode: "database" as const,
      persistent: true,
      warning: ""
    };
  }

  return {
    mode: databaseUnavailable ? "fallback" as const : "local" as const,
    persistent: false,
    warning: databaseUnavailable
      ? "Database storage is unavailable. Admin uploads and edits are using temporary fallback storage and can disappear after a redeploy or server restart."
      : "DATABASE_URL is not configured. Admin uploads and edits are not safely persistent on production/serverless hosting and can disappear after a redeploy or server restart."
  };
}

function id() {
  return randomUUID();
}

function now() {
  return new Date().toISOString();
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function defaultAdminUser() {
  const recoveryEmail = process.env.ADMIN_RECOVERY_EMAIL || "nasifjr2005@gmail.com";
  return {
    id: id(),
    username: process.env.ADMIN_USERNAME || defaultAdminUsername,
    email: recoveryEmail,
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || defaultAdminPassword, 12),
    recoveryEmail,
    backupRecoveryEmail: "",
    whatsappNumber: process.env.ADMIN_RECOVERY_WHATSAPP || "+8801823666560",
    sessionTimeoutMinutes: 480,
    failedAttempts: 0,
    createdAt: now(),
    updatedAt: now()
  };
}

function repairBundledCredentials(store: AdminStore) {
  if (process.env.ADMIN_USERNAME || process.env.ADMIN_PASSWORD) {
    return false;
  }

  const user = store.adminUser;
  const hasLegacyCredentials = user.username === legacyAdminUsername && bcrypt.compareSync(legacyAdminPassword, user.passwordHash);
  const hasBrokenBundledCredentials = user.username === defaultAdminUsername && !bcrypt.compareSync(defaultAdminPassword, user.passwordHash);

  if (!hasLegacyCredentials && !hasBrokenBundledCredentials) {
    return false;
  }

  user.username = defaultAdminUsername;
  user.passwordHash = bcrypt.hashSync(defaultAdminPassword, 12);
  user.failedAttempts = 0;
  user.lockedUntil = undefined;
  user.updatedAt = now();
  return true;
}

function seedStore(): AdminStore {
  const categories: AdminCategory[] = panelCategories.map((category, categoryIndex) => {
    const categoryId = id();
    const products: AdminProduct[] = category.panels.map((productName, productIndex) => {
      const productId = id();
      const prices: AdminPrice[] = (panelPricing[productName] ?? []).map((price, priceIndex) => ({
        id: id(),
        duration: price.duration,
        bdt: price.bdt,
        usd: price.usd,
        sortOrder: priceIndex
      }));

      return {
        id: productId,
        name: productName,
        description: `${productName} access package`,
        enabled: true,
        categoryId,
        categoryName: category.category,
        sortOrder: productIndex,
        featuredImageId: null,
        prices,
        media: [],
        updatedAt: now()
      };
    });

    return {
      id: categoryId,
      name: category.category,
      description: category.description,
      sortOrder: categoryIndex,
      products
    };
  });

  return {
    adminUser: defaultAdminUser(),
    passwordResetTokens: [],
    loginHistory: [],
    activeSessions: [],
    recoveryRequests: [],
    categories,
    media: [],
    orders: [],
    inquiries: [],
    testimonials: [],
    faqs: faqs.map((faq, index) => ({ id: id(), question: faq.question, answer: faq.answer, enabled: true, sortOrder: index })),
    communityLinks: communityLinks.map((link, index) => ({
      id: id(),
      title: link.title,
      href: link.href,
      description: link.description,
      logoUrl: link.title === "YouTube" ? "/youtubeicon.png" : "/discordicon.png",
      accent: link.title === "YouTube" ? "red" : "indigo",
      enabled: true,
      sortOrder: index
    })),
    content: {
      heroEyebrow: "Premium Free Fire Services",
      heroHeadline: "Premium Free Fire Panels at the Best Prices",
      heroSubheadline: "Fast delivery. Trusted service. Instant access. Buy from a professional gaming store built for secure orders, clear support, and serious value.",
      primaryCta: "Buy Now",
      secondaryCta: "View Panels",
      featuresEyebrow: "Panel selection",
      featuresTitle: "Choose your panel",
      featuresText: "Pick the product that matches your device and setup. Your selection stays active and is sent directly into the order section.",
      howEyebrow: "How it works",
      howTitle: "Four simple steps from selection to access",
      howText: "The buying process is intentionally simple so customers always know what happens next.",
      benefitsEyebrow: "Benefits",
      benefitsTitle: "Built around buyer outcomes",
      benefitsText: "Every section of the store points customers toward a faster, safer, and more confident purchase.",
      faqEyebrow: "FAQ",
      faqTitle: "Answers before you order",
      faqText: "Clear answers reduce risk and help customers choose with confidence.",
      finalCtaEyebrow: "Limited daily processing windows",
      finalCtaTitle: "Ready to Get Your Free Fire Panel Today?",
      finalCtaText: "Order early, confirm your package, and get support from a trusted gaming service team focused on fast delivery.",
      supportEyebrow: "Customer support",
      supportTitle: "Fast help when you need it",
      supportText: "Reach the PANEL 50 team through verified support channels for order help, setup questions, and product guidance.",
      communityEyebrow: "Join our community",
      communityTitle: "Follow updates and support channels",
      communityText: "Connect with PANEL 50 for announcements, showcases, community discussions, and support updates.",
      contactEyebrow: "Order section",
      contactTitle: "Complete your panel request",
      contactText: "Your selected product appears here automatically. Add your contact details so support can confirm availability, payment, and next steps.",
      newsletterTitle: "Get stock alerts and pricing drops",
      newsletterText: "Join the list for package updates, limited processing windows, and support announcements.",
      stats
    },
    settings: {
      websiteName: "PANEL 50 OFFICIAL STORE",
      brandName: "PANEL 50",
      brandTagline: "Official Store",
      logoUrl: "/frame.png",
      orderButtonText: "Buy Now",
      supportEmail,
      whatsappNumber: supportWhatsapp,
      whatsappUrl: `https://wa.me/880${supportWhatsapp.slice(1)}`,
      discordLink: communityLinks.find((link) => link.title === "Discord")?.href ?? "",
      discordDescription: communityLinks.find((link) => link.title === "Discord")?.description ?? "",
      youtubeLink: communityLinks.find((link) => link.title === "YouTube")?.href ?? "",
      youtubeDescription: communityLinks.find((link) => link.title === "YouTube")?.description ?? "",
      footerDescription: "Premium Free Fire panels and gaming services with fast delivery, clear support, and secure order communication.",
      copyrightText: "PANEL 50 OFFICIAL STORE. All rights reserved.",
      formSubmitEmail: supportEmail,
      primaryColor: "#4382DF",
      secondaryColor: "#4647AE"
    },
    recentUpdates: ["Admin store initialized"]
  };
}

function normalizeStore(store: Partial<AdminStore>) {
  const seeded = seedStore();
  const normalized: AdminStore = {
    ...seeded,
    ...store,
    adminUser: {
      ...seeded.adminUser,
      ...(store.adminUser ?? {})
    },
    passwordResetTokens: store.passwordResetTokens ?? [],
    loginHistory: store.loginHistory ?? [],
    activeSessions: store.activeSessions ?? [],
    recoveryRequests: store.recoveryRequests ?? [],
    categories: store.categories?.length ? store.categories : seeded.categories,
    media: store.media ?? [],
    orders: store.orders ?? [],
    inquiries: store.inquiries ?? [],
    testimonials: store.testimonials ?? [],
    faqs: store.faqs?.length ? store.faqs : seeded.faqs,
    communityLinks: store.communityLinks?.length ? store.communityLinks.map((item, index) => ({
      id: item.id || id(),
      title: item.title ?? "",
      href: item.href ?? "",
      description: item.description ?? "",
      logoUrl: item.logoUrl ?? "",
      accent: item.accent ?? "blue",
      enabled: item.enabled ?? true,
      sortOrder: item.sortOrder ?? index
    })) : seeded.communityLinks,
    content: {
      ...seeded.content,
      ...(store.content ?? {}),
      stats: store.content?.stats?.length ? store.content.stats : seeded.content.stats
    },
    settings: {
      ...seeded.settings,
      ...(store.settings ?? {})
    },
    recentUpdates: store.recentUpdates ?? seeded.recentUpdates
  };

  return normalized;
}

function needsStoreRepair(store: Partial<AdminStore>) {
  return !store.categories ||
    !store.content ||
    !store.settings ||
    !store.media ||
    !store.orders ||
    !store.inquiries ||
    !store.testimonials ||
    !store.faqs ||
    !store.communityLinks ||
    !store.passwordResetTokens ||
    !store.loginHistory ||
    !store.activeSessions ||
    !store.recoveryRequests;
}

async function ensureStore() {
  if (memoryStore) {
    return memoryStore;
  }

  if (hasDatabaseUrl()) {
    try {
      const snapshot = await prisma.siteContent.findUnique({ where: { key: storeSnapshotKey } });
      if (snapshot?.value) {
        const parsed = normalizeStore(snapshot.value as Partial<AdminStore>);
        const changed = repairBundledCredentials(parsed);
        if (changed) {
          await writeStore(parsed);
        }
        memoryStore = parsed;
        return parsed;
      }

      const store = seedStore();
      await writeStore(store);
      memoryStore = store;
      return store;
    } catch (error) {
      databaseUnavailable = true;
      console.error("Admin database store unavailable. Falling back to local JSON store.", error);
    }
  }

  try {
    const content = await readFile(dataFile, "utf8");
    const raw = JSON.parse(content) as Partial<AdminStore>;
    const parsed = normalizeStore(raw);
    let changed = needsStoreRepair(raw);
    if (!parsed.adminUser) {
      parsed.adminUser = defaultAdminUser();
      changed = true;
    }
    parsed.passwordResetTokens ??= [];
    parsed.loginHistory ??= [];
    parsed.activeSessions ??= [];
    parsed.recoveryRequests ??= [];
    parsed.communityLinks = parsed.communityLinks?.length ? parsed.communityLinks : seedStore().communityLinks;
    if (!parsed.adminUser.recoveryEmail) parsed.adminUser.recoveryEmail = "nasifjr2005@gmail.com";
    if (!parsed.adminUser.whatsappNumber) parsed.adminUser.whatsappNumber = "+8801823666560";
    if (!parsed.adminUser.sessionTimeoutMinutes) parsed.adminUser.sessionTimeoutMinutes = 480;
    changed = repairBundledCredentials(parsed) || changed;
    if (changed) {
      await writeStore(parsed);
    }
    memoryStore = parsed;
    return parsed;
  } catch {
    const store = seedStore();
    await writeStore(store);
    memoryStore = store;
    return store;
  }
}

async function writeStore(store: AdminStore) {
  memoryStore = store;
  if (hasDatabaseUrl()) {
    try {
      await prisma.siteContent.upsert({
        where: { key: storeSnapshotKey },
        create: { key: storeSnapshotKey, value: store as never },
        update: { value: store as never }
      });
      return;
    } catch (error) {
      databaseUnavailable = true;
      console.error("Could not persist admin store to database. Falling back to local JSON store.", error);
    }
  }

  try {
    await mkdir(dataDir, { recursive: true });
    await writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Vercel serverless functions cannot write to the deployed app directory.
    // Keep the admin dashboard available by using the in-memory store.
  }
}

function addUpdate(store: AdminStore, message: string) {
  store.recentUpdates = [`${new Date().toLocaleString()}: ${message}`, ...store.recentUpdates].slice(0, 12);
}

export async function getAdminStore() {
  return ensureStore();
}

export async function updateAdminStore(mutator: (store: AdminStore) => void | Promise<void>) {
  const store = await ensureStore();
  await mutator(store);
  await writeStore(store);
  return store;
}

export async function recordLogin() {
  return updateAdminStore((store) => {
    store.lastLogin = now();
    addUpdate(store, "Owner logged in");
  });
}

export async function recordKeyAuthLogin(username: string, ip: string, userAgent: string) {
  return updateAdminStore((store) => {
    store.loginHistory.unshift({ id: id(), username, success: true, ip, userAgent, createdAt: now() });
    store.loginHistory = store.loginHistory.slice(0, 100);
    store.lastLogin = now();
    store.adminUser.failedAttempts = 0;
    store.adminUser.lockedUntil = undefined;
    addUpdate(store, `KeyAuth login accepted for ${username}`);
  });
}

export async function verifyAdminPassword(username: string, password: string, ip: string, userAgent: string) {
  const store = await ensureStore();
  const user = store.adminUser;
  const locked = user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now();
  const success = !locked && username === user.username && await bcrypt.compare(password, user.passwordHash);

  await updateAdminStore((current) => {
    current.loginHistory.unshift({ id: id(), username, success, ip, userAgent, createdAt: now() });
    current.loginHistory = current.loginHistory.slice(0, 100);
    if (success) {
      current.adminUser.failedAttempts = 0;
      current.adminUser.lockedUntil = undefined;
      current.lastLogin = now();
      addUpdate(current, "Owner logged in");
    } else {
      current.adminUser.failedAttempts = (current.adminUser.failedAttempts ?? 0) + 1;
      if (current.adminUser.failedAttempts >= 8) {
        current.adminUser.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
    }
  });

  return { success, locked };
}

export async function createAdminSessionRecord(userAgent: string, ip: string) {
  const sessionId = id();
  const store = await updateAdminStore((current) => {
    current.activeSessions.unshift({
      id: sessionId,
      userId: current.adminUser.id,
      createdAt: now(),
      expiresAt: new Date(Date.now() + current.adminUser.sessionTimeoutMinutes * 60 * 1000).toISOString(),
      userAgent,
      ip,
      revoked: false
    });
    current.activeSessions = current.activeSessions.slice(0, 20);
  });
  return { sessionId, timeoutMinutes: store.adminUser.sessionTimeoutMinutes };
}

export async function revokeAllSessions() {
  return updateAdminStore((store) => {
    store.activeSessions = store.activeSessions.map((session) => ({ ...session, revoked: true }));
    addUpdate(store, "Revoked all admin sessions");
  });
}

export async function createPasswordResetToken() {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(token);
  await updateAdminStore((store) => {
    store.passwordResetTokens.unshift({
      id: id(),
      userId: store.adminUser.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      used: false,
      createdAt: now()
    });
    store.passwordResetTokens = store.passwordResetTokens.slice(0, 10);
    addUpdate(store, "Password reset token generated");
  });
  return token;
}

export async function resetPasswordWithToken(token: string, password: string) {
  const tokenHash = hashResetToken(token);
  let accepted = false;
  await updateAdminStore(async (store) => {
    const resetToken = store.passwordResetTokens.find((item) => item.tokenHash === tokenHash);
    if (!resetToken || resetToken.used || new Date(resetToken.expiresAt).getTime() < Date.now()) {
      return;
    }
    store.adminUser.passwordHash = await bcrypt.hash(password, 12);
    store.adminUser.updatedAt = now();
    store.adminUser.failedAttempts = 0;
    store.adminUser.lockedUntil = undefined;
    resetToken.used = true;
    store.activeSessions = store.activeSessions.map((session) => ({ ...session, revoked: true }));
    accepted = true;
    addUpdate(store, "Admin password reset by secure token");
  });
  return accepted;
}

export async function updateAdminAuthSettings(input: {
  username: string;
  password?: string;
  recoveryEmail: string;
  backupRecoveryEmail: string;
  whatsappNumber: string;
  sessionTimeoutMinutes: number;
}) {
  return updateAdminStore(async (store) => {
    store.adminUser.username = input.username;
    store.adminUser.recoveryEmail = input.recoveryEmail;
    store.adminUser.email = input.recoveryEmail;
    store.adminUser.backupRecoveryEmail = input.backupRecoveryEmail;
    store.adminUser.whatsappNumber = input.whatsappNumber;
    store.adminUser.sessionTimeoutMinutes = input.sessionTimeoutMinutes;
    if (input.password) {
      store.adminUser.passwordHash = await bcrypt.hash(input.password, 12);
      store.activeSessions = store.activeSessions.map((session) => ({ ...session, revoked: true }));
    }
    store.adminUser.failedAttempts = 0;
    store.adminUser.lockedUntil = undefined;
    store.adminUser.updatedAt = now();
    addUpdate(store, "Updated authentication settings");
  });
}

export async function createWhatsappRecoveryRequest(username: string) {
  const request = { id: id(), username, timestamp: now(), status: "pending" as const };
  await updateAdminStore((store) => {
    store.recoveryRequests.unshift(request);
    store.recoveryRequests = store.recoveryRequests.slice(0, 20);
    addUpdate(store, "WhatsApp recovery requested");
  });
  return request;
}

export async function updateRecoveryRequest(idValue: string, status: "approved" | "rejected") {
  return updateAdminStore((store) => {
    const request = store.recoveryRequests.find((item) => item.id === idValue);
    if (request) {
      request.status = status;
      addUpdate(store, `Recovery request ${status}`);
    }
  });
}

export { hashResetToken };

export async function upsertProduct(input: Partial<AdminProduct> & { name: string; categoryId: string }) {
  return updateAdminStore((store) => {
    const category = store.categories.find((item) => item.id === input.categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const existing = category.products.find((product) => product.id === input.id);
    if (existing) {
      existing.name = input.name;
      existing.description = input.description ?? "";
      existing.enabled = input.enabled ?? true;
      existing.updatedAt = now();
      existing.categoryName = category.name;
      addUpdate(store, `Updated product ${existing.name}`);
      return;
    }

    category.products.push({
      id: id(),
      name: input.name,
      description: input.description ?? "",
      enabled: input.enabled ?? true,
      categoryId: category.id,
      categoryName: category.name,
      sortOrder: category.products.length,
      featuredImageId: null,
      prices: [],
      media: [],
      updatedAt: now()
    });
    addUpdate(store, `Added product ${input.name}`);
  });
}

export async function upsertCategory(input: Partial<AdminCategory> & { name: string }) {
  return updateAdminStore((store) => {
    const existing = store.categories.find((category) => category.id === input.id);
    if (existing) {
      existing.name = input.name;
      existing.description = input.description ?? "";
      existing.products = existing.products.map((product) => ({ ...product, categoryName: existing.name }));
      addUpdate(store, `Updated category ${existing.name}`);
      return;
    }

    store.categories.push({
      id: id(),
      name: input.name,
      description: input.description ?? "",
      sortOrder: store.categories.length,
      products: []
    });
    addUpdate(store, `Added category ${input.name}`);
  });
}

export async function deleteCategory(categoryId: string) {
  return updateAdminStore((store) => {
    const category = store.categories.find((item) => item.id === categoryId);
    if (!category || category.products.length > 0) {
      return;
    }
    store.categories = store.categories.filter((item) => item.id !== categoryId);
    addUpdate(store, `Deleted category ${category.name}`);
  });
}

export async function deleteProduct(productId: string) {
  return updateAdminStore((store) => {
    for (const category of store.categories) {
      const before = category.products.length;
      category.products = category.products.filter((product) => product.id !== productId);
      if (category.products.length !== before) {
        addUpdate(store, "Deleted product");
        return;
      }
    }
  });
}

export async function updateProductPrices(productId: string, prices: AdminPrice[]) {
  return updateAdminStore((store) => {
    const product = store.categories.flatMap((category) => category.products).find((item) => item.id === productId);
    if (!product) {
      throw new Error("Product not found");
    }
    product.prices = prices.map((price, index) => ({ ...price, id: price.id || id(), sortOrder: index }));
    product.updatedAt = now();
    addUpdate(store, `Updated pricing for ${product.name}`);
  });
}

export async function saveMedia(media: AdminMedia[]) {
  return updateAdminStore((store) => {
    store.media = [...media, ...store.media];
    for (const item of media) {
      if (!item.productId) {
        continue;
      }
      const product = store.categories.flatMap((category) => category.products).find((candidate) => candidate.id === item.productId);
      if (!product) {
        continue;
      }

      product.media = [item, ...product.media.filter((mediaItem) => mediaItem.id !== item.id)];
      if (product && item.type === "image" && (item.isFeatured || !product.featuredImageId)) {
        product.featuredImageId = item.id;
        product.media = product.media.map((mediaItem) => ({ ...mediaItem, isFeatured: mediaItem.id === item.id }));
        store.media = store.media.map((mediaItem) => mediaItem.productId === product.id && mediaItem.type === "image"
          ? { ...mediaItem, isFeatured: mediaItem.id === item.id }
          : mediaItem);
      }
      product.updatedAt = now();
    }
    addUpdate(store, `Uploaded ${media.length} media file${media.length === 1 ? "" : "s"}`);
  });
}

export async function featureProductMedia(productId: string, mediaId: string) {
  return updateAdminStore((store) => {
    const product = store.categories.flatMap((category) => category.products).find((item) => item.id === productId);
    const mediaItem = store.media.find((item) => item.id === mediaId);
    if (!product || !mediaItem || mediaItem.type !== "image") {
      throw new Error("Product image not found");
    }

    for (const candidate of store.categories.flatMap((category) => category.products)) {
      if (candidate.id !== product.id) {
        candidate.media = candidate.media.filter((item) => item.id !== mediaItem.id);
        if (candidate.featuredImageId === mediaItem.id) {
          candidate.featuredImageId = null;
        }
      }
    }

    mediaItem.productId = product.id;
    if (!product.media.some((item) => item.id === mediaItem.id)) {
      product.media.unshift(mediaItem);
    }
    product.featuredImageId = mediaItem.id;
    product.media = product.media.map((item) => ({ ...item, productId: product.id, isFeatured: item.id === mediaItem.id }));
    store.media = store.media.map((item) => {
      if (item.id === mediaItem.id) {
        return { ...item, productId: product.id, isFeatured: true };
      }
      if (item.productId === product.id && item.type === "image") {
        return { ...item, isFeatured: false };
      }
      return item;
    });
    product.updatedAt = now();
    addUpdate(store, `Updated logo for ${product.name}`);
  });
}

export async function deleteMedia(mediaId: string) {
  return updateAdminStore((store) => {
    store.media = store.media.filter((item) => item.id !== mediaId);
    for (const product of store.categories.flatMap((category) => category.products)) {
      product.media = product.media.filter((item) => item.id !== mediaId);
      if (product.featuredImageId === mediaId) {
        const nextFeatured = product.media.find((item) => item.type === "image") ?? null;
        product.featuredImageId = nextFeatured?.id ?? null;
        product.media = product.media.map((item) => ({ ...item, isFeatured: item.id === nextFeatured?.id }));
        store.media = store.media.map((item) => item.productId === product.id && item.type === "image"
          ? { ...item, isFeatured: item.id === nextFeatured?.id }
          : item);
      }
      product.updatedAt = now();
    }
    addUpdate(store, "Deleted media");
  });
}

export async function updateContent(content: AdminContent) {
  return updateAdminStore((store) => {
    store.content = content;
    addUpdate(store, "Updated website content");
  });
}

export async function updateSettings(settings: AdminSettings) {
  return updateAdminStore((store) => {
    store.settings = settings;
    addUpdate(store, "Updated website settings");
  });
}

export async function updateFaqs(items: AdminFAQ[]) {
  return updateAdminStore((store) => {
    store.faqs = items;
    addUpdate(store, "Updated FAQs");
  });
}

export async function updateTestimonials(items: AdminTestimonial[]) {
  return updateAdminStore((store) => {
    store.testimonials = items;
    addUpdate(store, "Updated testimonials");
  });
}

export async function updateCommunityLinks(items: AdminCommunityLink[]) {
  return updateAdminStore((store) => {
    store.communityLinks = items.map((item, index) => ({
      id: item.id || id(),
      title: (item.title ?? "").trim(),
      href: (item.href ?? "").trim(),
      description: (item.description ?? "").trim(),
      logoUrl: (item.logoUrl ?? "").trim(),
      accent: (item.accent ?? "blue").trim() || "blue",
      enabled: item.enabled ?? true,
      sortOrder: index
    }));
    addUpdate(store, "Updated community links");
  });
}

export async function upsertOrder(order: Omit<AdminOrder, "id" | "createdAt" | "status">) {
  return updateAdminStore((store) => {
    store.orders.unshift({ ...order, id: id(), status: "pending", createdAt: now() });
    addUpdate(store, `New order for ${order.productName}`);
  });
}

export async function updateOrderStatus(orderId: string, status: "pending" | "completed") {
  return updateAdminStore((store) => {
    const order = store.orders.find((item) => item.id === orderId);
    if (order) {
      order.status = status;
      addUpdate(store, `Marked order ${status}`);
    }
  });
}

export async function deleteOrder(orderId: string) {
  return updateAdminStore((store) => {
    store.orders = store.orders.filter((item) => item.id !== orderId);
    addUpdate(store, "Deleted order");
  });
}

export async function upsertInquiry(inquiry: Omit<AdminInquiry, "id" | "createdAt" | "isRead">) {
  return updateAdminStore((store) => {
    store.inquiries.unshift({ ...inquiry, id: id(), isRead: false, createdAt: now() });
    addUpdate(store, "New inquiry received");
  });
}

export async function updateInquiryRead(inquiryId: string, isRead: boolean) {
  return updateAdminStore((store) => {
    const inquiry = store.inquiries.find((item) => item.id === inquiryId);
    if (inquiry) {
      inquiry.isRead = isRead;
    }
  });
}

export async function deleteInquiry(inquiryId: string) {
  return updateAdminStore((store) => {
    store.inquiries = store.inquiries.filter((item) => item.id !== inquiryId);
  });
}

export function flattenProducts(store: AdminStore) {
  return store.categories.flatMap((category) => category.products);
}
