import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { LiveStoreDashboard } from "@/components/live-store-dashboard";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";
import { trustBadges } from "@/lib/data";

type ManagedContent = Record<string, string> & { stats?: Array<{ label: string; value: string }> };

export function Hero({ content = {}, settings = {} }: { content?: ManagedContent; settings?: Record<string, string> }) {
  return (
    <section id="home" className="relative overflow-hidden pt-32 sm:pt-36">
      <motion.div
        className="pointer-events-none absolute left-[5%] top-32 hidden rounded-md border border-[#4382DF]/30 bg-[#4382DF]/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#bcd5ff] shadow-[0_0_30px_rgba(67,130,223,0.18)] lg:block"
        animate={{ y: [0, -12, 0], opacity: [0.55, 0.95, 0.55] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        Secure Queue
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-[6%] top-28 hidden h-24 w-28 rounded-lg border border-[#7cb0ff]/20 bg-[#4382DF]/10 blur-[1px] lg:block"
        animate={{ y: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <Container className="grid items-center gap-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-md border border-[#4382DF]/40 bg-[#4382DF]/12 px-3 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#bcd5ff]">
            <Sparkles size={16} aria-hidden="true" />
            {content.heroEyebrow || "Premium Free Fire Services"}
          </div>
          <h1 className="gradient-headline mt-6 text-balance text-5xl font-bold uppercase leading-[0.98] sm:text-7xl lg:text-8xl">
            {content.heroHeadline || "Premium Free Fire Panels at the Best Prices"}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-[#cbd4f4]">
            {content.heroSubheadline || "Fast delivery. Trusted service. Instant access. Buy from a professional gaming store built for secure orders, clear support, and serious value."}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#pricing" className="shadow-[0_0_50px_rgba(67,130,223,0.48)]">
              {content.primaryCta || settings.orderButtonText || "Buy Now"} <ArrowRight size={18} aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#features" variant="secondary">
              {content.secondaryCta || "View Panels"}
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {trustBadges.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 text-base font-semibold text-[#dce5ff]">
                <Icon size={19} className="text-[#7cb0ff]" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <LiveStoreDashboard managedStats={content.stats} />
        </Reveal>
      </Container>
    </section>
  );
}
