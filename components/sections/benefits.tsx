import { Reveal } from "@/components/reveal";
import { Container, IconCard, SectionHeader } from "@/components/ui";
import { benefits } from "@/lib/data";

export function Benefits({ content = {} }: { content?: Record<string, string> }) {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={content.benefitsEyebrow || "Benefits"}
            title={content.benefitsTitle || "Built around buyer outcomes"}
            text={content.benefitsText || "Every section of the store points customers toward a faster, safer, and more confident purchase."}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ title, icon }, index) => (
            <Reveal key={title} delay={index * 0.04}>
              <IconCard icon={icon} title={title}>
                <p>Focused on giving customers a cleaner order experience and stronger value from the first visit.</p>
              </IconCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
