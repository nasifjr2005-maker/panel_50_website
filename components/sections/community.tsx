import { ExternalLink } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeader } from "@/components/ui";
import { communityLinks } from "@/lib/data";

type CommunityLink = {
  title: string;
  href: string;
  description: string;
  logoUrl?: string;
  accent?: string;
};

function cardTone(accent?: string) {
  if (accent === "red") {
    return "border-red-300/20 bg-red-500/8 hover:border-red-300/55 hover:shadow-[0_0_55px_rgba(239,68,68,0.24)]";
  }
  if (accent === "indigo") {
    return "border-[#7c8cff]/25 bg-[#5865f2]/10 hover:border-[#a8b1ff]/65 hover:shadow-[0_0_55px_rgba(88,101,242,0.28)]";
  }
  if (accent === "emerald") {
    return "border-emerald-300/20 bg-emerald-400/8 hover:border-emerald-200/55 hover:shadow-[0_0_55px_rgba(52,211,153,0.22)]";
  }
  if (accent === "violet") {
    return "border-violet-300/20 bg-violet-500/8 hover:border-violet-200/55 hover:shadow-[0_0_55px_rgba(139,92,246,0.24)]";
  }
  return "border-[#4382DF]/25 bg-[#4382DF]/10 hover:border-[#9dbef5]/65 hover:shadow-[0_0_55px_rgba(67,130,223,0.28)]";
}

function fallbackLogo(link: CommunityLink) {
  if (link.logoUrl) {
    return link.logoUrl;
  }
  if (link.title.toLowerCase().includes("youtube")) {
    return "/youtubeicon.png";
  }
  if (link.title.toLowerCase().includes("discord")) {
    return "/discordicon.png";
  }
  return "";
}

export function Community({
  content = {},
  links = communityLinks
}: {
  content?: Record<string, string>;
  links?: CommunityLink[];
}) {
  return (
    <section id="community" className="py-20">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={content.communityEyebrow || "Join our community"}
            title={content.communityTitle || "Follow updates and support channels"}
            text={content.communityText || "Connect with PANEL 50 for announcements, showcases, community discussions, and support updates."}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {links.map((link, index) => {
            const logoSrc = fallbackLogo(link);

            return (
              <Reveal key={link.title} delay={index * 0.06}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open PANEL 50 ${link.title} community in a new tab`}
                  className={`group block h-full rounded-lg border p-6 transition duration-300 hover:-translate-y-1 hover:scale-[1.015] focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f] ${cardTone(link.accent)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-14 items-center justify-center overflow-hidden rounded-md bg-white/8">
                      {logoSrc ? <img src={logoSrc} alt="" className="h-full w-full object-contain" /> : <span className="text-2xl font-bold text-white">{link.title.charAt(0)}</span>}
                    </span>
                    <ExternalLink className="mt-1 text-[#9dbef5] transition group-hover:text-white" size={22} aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-3xl font-bold uppercase text-white">{link.title}</h3>
                  <p className="mt-3 text-lg leading-8 text-[#c8d1f3]">{link.description}</p>
                </a>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
