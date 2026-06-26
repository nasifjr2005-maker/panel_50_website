import { ArrowRight, BadgeCheck, Clock3, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container } from "@/components/ui";

export function FinalCta({ content = {} }: { content?: Record<string, string> }) {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-lg border border-[#4382DF]/35 bg-gradient-to-br from-[#4647AE] via-[#18205d] to-[#07091f] p-8 text-center shadow-[0_0_80px_rgba(67,130,223,0.22)] sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#bcd5ff]">{content.finalCtaEyebrow || "Limited daily processing windows"}</p>
            <h2 className="mx-auto mt-4 max-w-4xl text-balance text-4xl font-bold uppercase leading-tight text-white sm:text-6xl">
              {content.finalCtaTitle || "Ready to Get Your Free Fire Panel Today?"}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#dce5ff]">
              {content.finalCtaText || "Order early, confirm your package, and get support from a trusted gaming service team focused on fast delivery."}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="#contact">
                {content.primaryCta || "Order Now"} <ArrowRight size={18} aria-hidden="true" />
              </ButtonLink>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-semibold uppercase tracking-[0.1em] text-[#dce5ff]">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-[#7cb0ff]" aria-hidden="true" /> Secure process</span>
              <span className="inline-flex items-center gap-2"><Clock3 size={17} className="text-[#7cb0ff]" aria-hidden="true" /> Fast handoff</span>
              <span className="inline-flex items-center gap-2"><BadgeCheck size={17} className="text-[#7cb0ff]" aria-hidden="true" /> Trusted support</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
