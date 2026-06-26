import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeader } from "@/components/ui";
import { steps } from "@/lib/data";

export function HowItWorks({ content = {} }: { content?: Record<string, string> }) {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={content.howEyebrow || "How it works"}
            title={content.howTitle || "Four simple steps from selection to access"}
            text={content.howText || "The buying process is intentionally simple so customers always know what happens next."}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step} delay={index * 0.05}>
              <article className="relative h-full rounded-lg border border-white/12 bg-white/7 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7cb0ff]">Step {index + 1}</p>
                <h3 className="mt-4 text-2xl font-bold uppercase text-white">{step}</h3>
                <p className="mt-3 text-base leading-7 text-[#c8d1f3]">
                  {index === 0 && "Compare available options and choose the package that fits your needs."}
                  {index === 1 && "Confirm details through the store flow with clear pricing and instructions."}
                  {index === 2 && "Get access details and setup guidance through your selected contact method."}
                  {index === 3 && "Begin using your service with support available if you need assistance."}
                </p>
                {index < steps.length - 1 ? (
                  <ArrowRight className="absolute -right-4 top-10 hidden text-[#4382DF] lg:block" size={28} aria-hidden="true" />
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
