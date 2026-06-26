import { Mail, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, SectionHeader } from "@/components/ui";

export function CustomerSupport({
  content = {},
  support
}: {
  content?: Record<string, string>;
  support: { email: string; gmailUrl: string; whatsappNumber: string; whatsappUrl: string };
}) {
  return (
    <section id="customer-support" className="py-20">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={content.supportEyebrow || "Customer support"}
            title={content.supportTitle || "Fast help when you need it"}
            text={content.supportText || "Reach the PANEL 50 team through verified support channels for order help, setup questions, and product guidance."}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <article className="glass rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:border-[#7cb0ff]/60 hover:shadow-[0_0_45px_rgba(67,130,223,0.22)]">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-[#4382DF]/18 text-[#7cb0ff]">
                  <Mail size={24} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold uppercase text-white">Email</h3>
                  <a href={support.gmailUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block break-words text-lg text-[#dce5ff] transition hover:text-white" aria-label={`Email support at ${support.email}`}>
                    {support.email}
                  </a>
                </div>
              </div>
              <ButtonLink href={support.gmailUrl} target="_blank" rel="noopener noreferrer" className="mt-6 w-full" aria-label="Contact PANEL 50 support via Gmail">
                <Mail size={18} aria-hidden="true" />
                Contact via Gmail
              </ButtonLink>
            </article>
          </Reveal>

          <Reveal delay={0.06}>
            <article className="glass rounded-lg p-6 transition duration-300 hover:-translate-y-1 hover:border-[#7cb0ff]/60 hover:shadow-[0_0_45px_rgba(67,130,223,0.22)]">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-200">
                  <MessageCircle size={24} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold uppercase text-white">WhatsApp</h3>
                  <p className="mt-2 text-lg text-[#dce5ff]">{support.whatsappNumber}</p>
                </div>
              </div>
              <ButtonLink
                href={support.whatsappUrl}
                className="mt-6 w-full"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contact PANEL 50 support on WhatsApp at ${support.whatsappNumber}`}
              >
                <MessageCircle size={18} aria-hidden="true" />
                Contact via WhatsApp
              </ButtonLink>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
