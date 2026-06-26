import { AlertTriangle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeader } from "@/components/ui";
import { pains } from "@/lib/data";

export function Problem() {
  return (
    <section className="py-20">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="The problem"
            title="Buying gaming panels should not feel risky"
            text="Players lose time and money when sellers overpromise, disappear after payment, or leave customers guessing about delivery."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {pains.map((pain, index) => (
            <Reveal key={pain} delay={index * 0.04}>
              <article className="h-full rounded-lg border border-red-300/15 bg-red-500/8 p-5 transition hover:-translate-y-1 hover:border-red-300/30">
                <AlertTriangle className="text-red-200" size={24} aria-hidden="true" />
                <h3 className="mt-5 text-lg font-bold uppercase text-white">{pain}</h3>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
