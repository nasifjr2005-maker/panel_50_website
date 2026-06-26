import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service | PANEL 50 OFFICIAL STORE",
  description: "Terms of Service for PANEL 50 OFFICIAL STORE."
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing this website, placing an order, or using any services provided by PANEL 50 OFFICIAL STORE, you acknowledge that you have read, understood, and agreed to these Terms of Service."
    ]
  },
  {
    title: "2. Services",
    paragraphs: [
      "PANEL 50 OFFICIAL STORE provides digital products, software-related services, account-related services, and other gaming-related offerings available through the website.",
      "We reserve the right to modify, suspend, or discontinue any service at any time without prior notice."
    ]
  },
  {
    title: "3. Orders and Payments",
    items: [
      "All orders must be paid in full before delivery.",
      "Customers are responsible for providing accurate information during checkout.",
      "Payments are accepted through supported payment methods displayed on the website.",
      "Orders may be delayed if additional verification is required.",
      "Prices are subject to change without prior notice."
    ]
  },
  {
    title: "4. Digital Product Delivery",
    items: [
      "Delivery times may vary depending on the selected product or service.",
      "Most orders are processed as quickly as possible after payment confirmation.",
      "Delivery estimates are not guaranteed.",
      "Customers must provide any required information necessary for order fulfillment."
    ]
  },
  {
    title: "5. Refund Policy",
    paragraphs: ["Due to the nature of digital products and services:"],
    items: [
      "All sales are generally considered final.",
      "Refunds are not guaranteed after a product has been delivered.",
      "Refund requests may be reviewed on a case-by-case basis.",
      "Refunds will not be issued for customer errors, incorrect purchases, misuse, or failure to follow provided instructions."
    ]
  },
  {
    title: "6. Customer Responsibilities",
    paragraphs: ["Customers agree to:"],
    items: [
      "Provide accurate information.",
      "Use purchased products responsibly.",
      "Follow all applicable laws and regulations.",
      "Maintain the security of their own devices and accounts."
    ],
    ending: "Customers are solely responsible for how purchased products or services are used."
  },
  {
    title: "7. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law:",
      "PANEL 50 OFFICIAL STORE shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our website, products, or services.",
      "All services are provided on an \"as available\" basis without guarantees of uninterrupted availability."
    ]
  },
  {
    title: "8. Service Availability",
    paragraphs: ["We strive to maintain reliable service, but we do not guarantee:"],
    items: [
      "Continuous website availability",
      "Error-free operation",
      "Uninterrupted access",
      "Compatibility with all devices or software environments"
    ],
    ending: "Temporary downtime may occur due to maintenance, updates, or circumstances beyond our control."
  },
  {
    title: "9. Intellectual Property",
    paragraphs: ["All content on this website, including:"],
    items: ["Branding", "Logos", "Graphics", "Design elements", "Text", "Source code"],
    ending: "Unauthorized copying, reproduction, or distribution is prohibited."
  },
  {
    title: "10. Fraud Prevention",
    paragraphs: ["We reserve the right to:"],
    items: ["Refuse service", "Cancel orders", "Request identity verification", "Suspend suspicious transactions"],
    ending: "if fraudulent, abusive, or unauthorized activity is suspected."
  },
  {
    title: "11. Third-Party Services",
    paragraphs: [
      "Our website may integrate with or link to third-party services, payment providers, communication platforms, or external websites.",
      "We are not responsible for the content, policies, or practices of third-party services."
    ]
  },
  {
    title: "12. Changes to Terms",
    paragraphs: [
      "We may update these Terms of Service at any time.",
      "Updated versions will be posted on this page with a revised effective date.",
      "Continued use of the website after updates constitutes acceptance of the revised terms."
    ]
  },
  {
    title: "13. Termination",
    paragraphs: [
      "We reserve the right to suspend or terminate access to our services at our sole discretion if these Terms of Service are violated."
    ]
  },
  {
    title: "14. Contact Information",
    paragraphs: [
      "For questions regarding these Terms of Service, please contact us through the official support channels listed on the website."
    ]
  }
];

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        <Container className="pb-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7cb0ff]">Last Updated: June 2026</p>
              <h1 className="mt-3 text-4xl font-bold uppercase leading-tight text-white sm:text-6xl">Terms of Service</h1>
              <p className="mt-5 text-lg leading-8 text-[#c8d1f3]">
                Welcome to PANEL 50 OFFICIAL STORE. By accessing or using our website, products, or services, you agree to comply with and be bound by these Terms of Service. If you do not agree with these terms, please do not use our website or services.
              </p>
            </div>

            <article className="glass rounded-lg p-6 sm:p-8">
              <div className="grid gap-8">
                {sections.map((section) => (
                  <section key={section.title} className="border-b border-white/10 pb-8 last:border-b-0 last:pb-0">
                    <h2 className="text-2xl font-bold uppercase text-white">{section.title}</h2>
                    <div className="mt-4 grid gap-4 text-base leading-7 text-[#c8d1f3]">
                      {section.paragraphs?.map((paragraph) => (
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
                By accessing or using PANEL 50 OFFICIAL STORE, you acknowledge that you have read, understood, and agreed to these Terms of Service.
              </p>
            </article>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
