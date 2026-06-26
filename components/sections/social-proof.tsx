import { LiveStatsGrid } from "@/components/live-stats";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui";

export function SocialProof() {
  return (
    <section className="py-16">
      <Container>
        <div className="rounded-lg border border-[#4382DF]/25 bg-[#4382DF]/12 p-5 sm:p-8">
          <Reveal>
            <LiveStatsGrid editable />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
