import { NextResponse } from "next/server";
import { getAdminStore } from "@/lib/admin-store";

function gmailUrl(email: string) {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: email });
  return `https://mail.google.com/mail/?${params.toString()}`;
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

  const categories = store.categories
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      category: category.name,
      description: category.description,
      panels: category.products
        .filter((product) => product.enabled)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((product) => product.name)
    }));

  const pricing = Object.fromEntries(
    store.categories.flatMap((category) =>
      category.products
        .filter((product) => product.enabled)
        .map((product) => [product.name, product.prices.sort((a, b) => a.sortOrder - b.sortOrder).map(({ duration, bdt, usd }) => ({ duration, bdt, usd }))])
    )
  );

  const media = Object.fromEntries(
    store.categories.flatMap((category) =>
      category.products.map((product) => [
        product.name,
        product.media.map((item) => ({
          url: item.url,
          type: item.type,
          name: item.name,
          isFeatured: item.isFeatured || item.id === product.featuredImageId
        }))
      ])
    )
  );

  return NextResponse.json({
    categories,
    pricing,
    media,
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
  });
}
