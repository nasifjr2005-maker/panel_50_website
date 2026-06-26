import { Activity, BarChart3 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeader } from "@/components/ui";
import { results } from "@/lib/data";

export function Results() {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Results"
            title="Performance that turns first-time buyers into repeat customers"
            text="A dashboard-style look at the service metrics customers care about most: speed, satisfaction, support, and trust."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {results.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.05}>
              <article className="glass h-full rounded-lg p-6">
                <div className="mb-6 flex items-center justify-between">
                  <Activity className="text-[#7cb0ff]" size={24} aria-hidden="true" />
                  <BarChart3 className="text-white/35" size={24} aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#aeb8df]">{item.label}</p>
                <h3 className="mt-3 text-4xl font-bold uppercase text-white">{item.value}</h3>
                <p className="mt-4 text-base leading-7 text-[#c8d1f3]">{item.detail}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
