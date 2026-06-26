import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy | PANEL 50 OFFICIAL STORE",
  description: "Privacy Policy for PANEL 50 OFFICIAL STORE."
};

const sections = [
  {
    title: "1. Information We Collect",
    paragraphs: [
      "When you place an order, contact us, or use our services, we may collect the following information:"
    ],
    items: [
      "Full Name",
      "Email Address",
      "WhatsApp Number",
      "Discord Username (if provided)",
      "Payment Information (transaction references only)",
      "Order Details",
      "Device and Browser Information",
      "IP Address",
      "Website Usage Data"
    ],
    ending: "We only collect information necessary to provide our services and improve user experience."
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: ["We may use your information to:"],
    items: [
      "Process and manage orders",
      "Provide customer support",
      "Verify transactions",
      "Improve website functionality",
      "Prevent fraud and abuse",
      "Respond to inquiries",
      "Send important service updates"
    ],
    ending: "We do not sell, rent, or trade your personal information to third parties."
  },
  {
    title: "3. Payment Information",
    paragraphs: ["Payments may be processed through third-party payment providers such as:"],
    items: ["bKash", "Nagad", "Rocket", "Binance Pay", "USDT"],
    ending: "We do not store sensitive payment credentials such as passwords, PINs, or private wallet keys."
  },
  {
    title: "4. Cookies and Analytics",
    paragraphs: ["Our website may use cookies and analytics tools to:"],
    items: ["Improve performance", "Remember user preferences", "Monitor website traffic", "Enhance user experience"],
    ending: "You may disable cookies through your browser settings at any time."
  },
  {
    title: "5. Data Security",
    paragraphs: [
      "We implement reasonable security measures to protect your information from unauthorized access, disclosure, alteration, or destruction.",
      "However, no online platform can guarantee absolute security."
    ]
  },
  {
    title: "6. Third-Party Services",
    paragraphs: [
      "Our website may contain links to third-party websites, payment providers, or communication platforms.",
      "We are not responsible for the privacy practices or content of external websites."
    ]
  },
  {
    title: "7. Data Retention",
    paragraphs: ["We retain customer information only for as long as necessary to:"],
    items: ["Complete orders", "Provide customer support", "Comply with legal obligations", "Resolve disputes"]
  },
  {
    title: "8. User Rights",
    paragraphs: ["You may request to:"],
    items: [
      "Access your information",
      "Correct inaccurate information",
      "Delete your personal information",
      "Withdraw consent where applicable"
    ],
    ending: "To make a request, contact our support team."
  },
  {
    title: "9. Children's Privacy",
    paragraphs: [
      "Our services are not intended for children under the age of 13.",
      "We do not knowingly collect personal information from children."
    ]
  },
  {
    title: "10. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time.",
      "Any changes will be posted on this page with an updated revision date."
    ]
  },
  {
    title: "11. Contact Us",
    paragraphs: [
      "If you have any questions regarding this Privacy Policy, please contact us through our official support channels listed on the website."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <Container className="pb-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7cb0ff]">Last Updated: June 2026</p>
              <h1 className="mt-3 text-4xl font-bold uppercase leading-tight text-white sm:text-6xl">Privacy Policy</h1>
              <p className="mt-5 text-lg leading-8 text-[#c8d1f3]">
                Welcome to PANEL 50 OFFICIAL STORE. Your privacy is important to us. This Privacy Policy explains how we collect, use, protect, and disclose information when you use our website and services.
              </p>
            </div>

            <article className="glass rounded-lg p-6 sm:p-8">
              <div className="grid gap-8">
                {sections.map((section) => (
                  <section key={section.title} className="border-b border-white/10 pb-8 last:border-b-0 last:pb-0">
                    <h2 className="text-2xl font-bold uppercase text-white">{section.title}</h2>
                    <div className="mt-4 grid gap-4 text-base leading-7 text-[#c8d1f3]">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {section.items ? (
                        <ul className="grid gap-2 pl-5">
                          {section.items.map((item) => (
                            <li key={item} className="list-disc">{item}</li>
                          ))}
                        </ul>
                      ) : null}
                      {section.ending ? <p>{section.ending}</p> : null}
                    </div>
                  </section>
                ))}
              </div>

              <p className="mt-8 rounded-lg border border-[#4382DF]/25 bg-[#4382DF]/10 p-5 text-base leading-7 text-[#dce5ff]">
                By using PANEL 50 OFFICIAL STORE, you acknowledge that you have read and agreed to this Privacy Policy.
              </p>
            </article>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
