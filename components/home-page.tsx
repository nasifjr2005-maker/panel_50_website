"use client";

import { useEffect, useState } from "react";
import { Benefits } from "@/components/sections/benefits";
import { Community } from "@/components/sections/community";
import { Contact } from "@/components/sections/contact";
import { CustomerSupport } from "@/components/sections/customer-support";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Navbar } from "@/components/sections/navbar";
import { Newsletter } from "@/components/sections/newsletter";
import { faqs as defaultFaqs } from "@/lib/data";
import type { SelectedPanelOrder } from "@/lib/data";

export type StorefrontConfig = {
  content: Record<string, string> & { stats?: Array<{ label: string; value: string }> };
  settings: Record<string, string>;
  community: Array<{ title: string; href: string; description: string; logoUrl?: string; accent?: string }>;
  support: {
    email: string;
    gmailUrl: string;
    whatsappNumber: string;
    whatsappUrl: string;
    formsubmitEndpoint: string;
  };
  faqs: Array<{ question: string; answer: string }>;
};

const defaultStorefront: StorefrontConfig = {
  content: {},
  settings: {},
  community: [],
  support: {
    email: "panel50official@gmail.com",
    gmailUrl: "https://mail.google.com/mail/?view=cm&fs=1&to=panel50official%40gmail.com",
    whatsappNumber: "01823666560",
    whatsappUrl: "https://wa.me/8801823666560",
    formsubmitEndpoint: "https://formsubmit.co/ajax/panel50official@gmail.com"
  },
  faqs: defaultFaqs
};

export function HomePage() {
  const [selectedOrder, setSelectedOrder] = useState<SelectedPanelOrder | null>(null);
  const [storefront, setStorefront] = useState<StorefrontConfig>(defaultStorefront);

  useEffect(() => {
    async function loadStorefront() {
      try {
        const response = await fetch("/api/store/products", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setStorefront({
          ...defaultStorefront,
          ...(data.storefront ?? {}),
          faqs: data.faqs?.length ? data.faqs : defaultStorefront.faqs
        });
      } catch {
        setStorefront(defaultStorefront);
      }
    }
    void loadStorefront();
  }, []);

  function handleOrderSelect(order: SelectedPanelOrder) {
    setSelectedOrder(order);
    window.setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  return (
    <>
      <Navbar settings={storefront.settings} />
      <main>
        <Hero content={storefront.content} settings={storefront.settings} />
        <Features selectedOrder={selectedOrder} onOrderSelect={handleOrderSelect} content={storefront.content} />
        <HowItWorks content={storefront.content} />
        <Benefits content={storefront.content} />
        <Faq content={storefront.content} faqs={storefront.faqs} />
        <FinalCta content={storefront.content} />
        <CustomerSupport content={storefront.content} support={storefront.support} />
        <Community content={storefront.content} links={storefront.community} />
        <Contact selectedOrder={selectedOrder} content={storefront.content} support={storefront.support} />
        <Newsletter content={storefront.content} formsubmitEndpoint={storefront.support.formsubmitEndpoint} />
      </main>
      <Footer settings={storefront.settings} support={storefront.support} community={storefront.community} />
    </>
  );
}
