import { Mail, MessageCircle, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui";
import { navLinks, supportEmail, supportGmailUrl, supportWhatsappUrl } from "@/lib/data";

export function Footer({
  settings = {},
  support = { email: supportEmail, gmailUrl: supportGmailUrl, whatsappUrl: supportWhatsappUrl },
  community = []
}: {
  settings?: Record<string, string>;
  support?: { email: string; gmailUrl: string; whatsappUrl: string };
  community?: Array<{ title: string; href: string; logoUrl?: string }>;
}) {
  const logoUrl = settings.logoUrl || "/frame.png";
  const brandName = settings.brandName || "PANEL 50";
  const brandTagline = settings.brandTagline || "Official Store";
  const footerDescription = settings.footerDescription || "Premium Free Fire panels and gaming services with fast delivery, clear support, and secure order communication.";
  const copyrightText = settings.copyrightText || "PANEL 50 OFFICIAL STORE. All rights reserved.";
  const socialLinks: Array<{ href: string; label: string; icon?: LucideIcon; image?: string; external: boolean }> = [
    { href: support.gmailUrl, label: "Open PANEL 50 Gmail support", icon: Mail, external: true },
    { href: support.whatsappUrl, label: "Open PANEL 50 WhatsApp support", icon: MessageCircle, external: true },
    ...community.map((item) => ({
      href: item.href,
      label: `Open PANEL 50 ${item.title}`,
      image: item.logoUrl || (item.title.toLowerCase().includes("youtube") ? "/youtubeicon.png" : item.title.toLowerCase().includes("discord") ? "/discordicon.png" : ""),
      external: true
    }))
  ].filter((item) => item.href);

  return (
    <footer className="border-t border-white/10 bg-[#07091f] py-12">
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <a href="#home" className="flex items-center gap-3" aria-label="PANEL 50 OFFICIAL STORE home">
            <span className="flex size-12 items-center justify-center overflow-hidden rounded-md bg-white">
              <img src={logoUrl} alt="" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block text-xl font-bold uppercase text-white">{brandName}</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[#9dbef5]">{brandTagline}</span>
            </span>
          </a>
          <p className="mt-5 max-w-md text-base leading-7 text-[#aeb8df]">
            {footerDescription}
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-lg font-bold uppercase text-white">Navigation</h2>
          <div className="mt-4 grid gap-2">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-[#aeb8df] transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div>
          <h2 className="text-lg font-bold uppercase text-white">Store Info</h2>
          <div className="mt-4 grid gap-2 text-[#aeb8df]">
            <a href={support.gmailUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">{support.email}</a>
            <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-white">Terms of Service</a>
          </div>
          <div className="mt-5 flex gap-3">
            {socialLinks.map(({ href, label, icon: Icon, image, external }) => (
              <a
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex size-10 items-center justify-center rounded-md border border-white/12 bg-white/7 text-[#dce5ff] transition hover:border-[#4382DF] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f]"
                aria-label={label}
              >
                {image ? (
                  <img src={image} alt="" className="size-[22px] object-contain" />
                ) : Icon ? (
                  <Icon size={19} aria-hidden="true" />
                ) : null}
              </a>
            ))}
          </div>
        </div>
      </Container>
      <Container className="mt-10 border-t border-white/10 pt-6 text-sm text-[#7f89b4]">
        <p>Copyright {new Date().getFullYear()} {copyrightText}</p>
      </Container>
    </footer>
  );
}
