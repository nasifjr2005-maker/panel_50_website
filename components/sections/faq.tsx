"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeader } from "@/components/ui";
import { faqs as defaultFaqs } from "@/lib/data";

export function Faq({
  content = {},
  faqs = defaultFaqs
}: {
  content?: Record<string, string>;
  faqs?: Array<{ question: string; answer: string }>;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="faq" className="py-20">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={content.faqEyebrow || "FAQ"}
            title={content.faqTitle || "Answers before you order"}
            text={content.faqText || "Clear answers reduce risk and help customers choose with confidence."}
          />
        </Reveal>
        <div className="mx-auto mt-12 max-w-4xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = active === index;
            return (
              <Reveal key={faq.question} delay={index * 0.025}>
                <div className="glass rounded-lg transition duration-300 hover:border-[#4382DF]/55 hover:shadow-[0_20px_60px_rgba(67,130,223,0.16)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                    onClick={() => setActive(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg font-bold uppercase text-white">{faq.question}</span>
                    <ChevronDown className={`shrink-0 text-[#7cb0ff] transition ${isOpen ? "rotate-180" : ""}`} size={22} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-base leading-7 text-[#c8d1f3]">{faq.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
