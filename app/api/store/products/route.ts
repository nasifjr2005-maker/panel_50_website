import { NextResponse } from "next/server";
import { getAdminStore } from "@/lib/admin-store";
import type { AdminMedia, AdminProduct } from "@/lib/admin-types";

function gmailUrl(email: string) {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: email });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function publicMedia(item: AdminMedia, featuredImageId?: string | null) {
  return {
    id: item.id,
    url: item.previewUrl || item.url,
    type: item.type,
    name: item.name,
    isFeatured: item.type === "image" && (item.isFeatured || item.id === featuredImageId)
  };
}

function productLogo(product: AdminProduct) {
  const logo = product.media.find((item) => item.type === "image" && (item.isFeatured || item.id === product.featuredImageId)) ??
    product.media.find((item) => item.type === "image");

  return logo ? publicMedia(logo, product.featuredImageId) : null;
}

export async function GET() {
  const store = await getAdminStore();
  const supportEmail = store.settings.supportEmail || store.settings.formSubmitEmail || "panel50official@gmail.com";
  const whatsappUrl = store.settings.whatsappUrl || `https://wa.me/${store.settings.whatsappNumber.replace(/\D/g, "")}`;
  const fallbackCommunity = [
    {
      id: "youtube",
      title: "YouTube",
      href: store.settings.youtubeLink,
      description: store.settings.youtubeDescription,
      logoUrl: "/youtubeicon.png",
      accent: "red",
      enabled: true,
      sortOrder: 0
    },
    {
      id: "discord",
      title: "Discord",
      href: store.settings.discordLink,
      description: store.settings.discordDescription,
      logoUrl: "/discordicon.png",
      accent: "indigo",
      enabled: true,
      sortOrder: 1
    }
  ];
  const community = (store.communityLinks?.length ? store.communityLinks : fallbackCommunity)
    .filter((item) => item.enabled && item.href)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ title, href, description, logoUrl, accent }) => ({ title, href, description, logoUrl, accent }));

  const sortedCategories = store.categories
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      id: category.id,
      category: category.name,
      name: category.name,
      description: category.description,
      products: category.products
        .filter((product) => product.enabled)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((product) => {
          const logo = productLogo(product);
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            categoryId: product.categoryId,
            categoryName: category.name,
            featuredImageId: product.featuredImageId ?? null,
            logo
          };
        })
    }));

  const categories = sortedCategories.map((category) => ({
    id: category.id,
    category: category.category,
    name: category.name,
    description: category.description,
    panels: category.products.map((product) => product.name),
    products: category.products
  }));

  const pricing = Object.fromEntries(
    store.categories.flatMap((category) =>
      category.products
        .filter((product) => product.enabled)
        .flatMap((product) => {
          const prices = product.prices
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(({ duration, bdt, usd }) => ({ duration, bdt, usd }));
          return [
            [product.id, prices],
            [product.name, prices]
          ];
        })
    )
  );

  const logos = Object.fromEntries(
    store.categories.flatMap((category) =>
      category.products.flatMap((product) => {
        const logo = productLogo(product);
        return [
          [product.id, logo],
          [product.name, logo]
        ];
      })
    )
  );

  return NextResponse.json({
    categories,
    pricing,
    logos,
    media: {},
    content: store.content,
    settings: store.settings,
    faqs: store.faqs.filter((faq) => faq.enabled).sort((a, b) => a.sortOrder - b.sortOrder),
    storefront: {
      content: store.content,
      settings: store.settings,
      community,
      support: {
        email: supportEmail,
        gmailUrl: gmailUrl(supportEmail),
        whatsappNumber: store.settings.whatsappNumber,
        whatsappUrl,
        formsubmitEndpoint: `https://formsubmit.co/ajax/${store.settings.formSubmitEmail || supportEmail}`
      }
    }
  }, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
