import { CheckCircle2, CreditCard, Headphones, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeader } from "@/components/ui";

const items = [
  { title: "Reliable service", text: "Clear ordering, transparent expectations, and a store experience made for repeat buyers.", icon: ShieldCheck },
  { title: "Fast activation", text: "Orders are routed for quick handoff so customers can move from payment to access with less waiting.", icon: CheckCircle2 },
  { title: "Secure purchasing", text: "Verified communication and confirmation steps help reduce uncertainty before delivery.", icon: CreditCard },
  { title: "Dedicated support", text: "Get help choosing packages, checking order status, and understanding access details.", icon: Headphones }
];

export function Solution() {
  return (
    <section className="py-20">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <SectionHeader
            align="left"
            eyebrow="The solution"
            title="PANEL 50 makes panel buying faster, clearer, and safer"
            text="A premium storefront for Free Fire panel customers who want competitive prices, responsive help, and a buying process that feels professional from the first click."
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map(({ title, text, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 0.05}>
              <article className="glass h-full rounded-lg p-6">
                <Icon size={26} className="text-[#7cb0ff]" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-bold uppercase text-white">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#c8d1f3]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
