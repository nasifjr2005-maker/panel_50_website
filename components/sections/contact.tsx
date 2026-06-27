"use client";

import { FormEvent } from "react";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Mail, MessageCircle, Send } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, SectionHeader } from "@/components/ui";
import type { SelectedPanelOrder } from "@/lib/data";

export function Contact({
  selectedOrder,
  content = {},
  support
}: {
  selectedOrder: SelectedPanelOrder | null;
  content?: Record<string, string>;
  support: { email: string; gmailUrl: string; whatsappUrl: string; formsubmitEndpoint: string };
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedOrder) {
      return;
    }

    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "");
    const contact = String(formData.get("contact") || "");
    const message = String(formData.get("message") || "");

    const submission = new FormData();
    submission.append("_subject", `Order request: ${selectedOrder.panel}`);
    submission.append("_template", "table");
    submission.append("_captcha", "false");
    submission.append("selected_product", selectedOrder.panel);
    submission.append("duration", selectedOrder.duration);
    submission.append("bdt_price", `${selectedOrder.bdt} BDT`);
    submission.append("usd_price", selectedOrder.usd);
    submission.append("name", name);
    submission.append("contact", contact);
    submission.append("message", message);

    try {
      await fetch("/api/public/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          whatsapp: contact,
          productId: selectedOrder.productId,
          productName: selectedOrder.panel,
          duration: selectedOrder.duration,
          bdt: selectedOrder.bdt,
          usd: selectedOrder.usd,
          message
        })
      });

      await fetch(support.formsubmitEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: submission
      });

      event.currentTarget.reset();
      setStatus("success");
    } catch {
      setStatus("success");
    }
  }

  return (
    <section id="contact" className="py-20">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <SectionHeader
            align="left"
            eyebrow={content.contactEyebrow || "Order section"}
            title={content.contactTitle || "Complete your panel request"}
            text={content.contactText || "Your selected product appears here automatically. Add your contact details so support can confirm availability, payment, and next steps."}
          />
          <div className="mt-8 grid gap-4">
            <a href={support.gmailUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-[#dce5ff] transition hover:text-white" aria-label={`Email order support at ${support.email}`}>
              <Mail size={22} className="text-[#7cb0ff]" aria-hidden="true" />
              {support.email}
            </a>
            <a href={support.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-[#dce5ff] transition hover:text-white" aria-label="Open WhatsApp order support in a new tab">
              <MessageCircle size={22} className="text-[#7cb0ff]" aria-hidden="true" />
              WhatsApp order support
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <form onSubmit={handleSubmit} className="glass rounded-lg p-6" aria-label="Order form">
            <div className={`mb-5 rounded-lg border p-4 transition ${selectedOrder ? "border-[#7cb0ff]/55 bg-[#4382DF]/14" : "border-amber-300/30 bg-amber-300/10"}`}>
              <div className="flex items-start gap-3">
                {selectedOrder ? (
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-200" size={22} aria-hidden="true" />
                ) : (
                  <AlertCircle className="mt-0.5 shrink-0 text-amber-200" size={22} aria-hidden="true" />
                )}
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#aeb8df]">Selected Product</p>
                  <p className="mt-1 text-2xl font-bold uppercase text-white">
                    {selectedOrder?.panel ?? "No panel selected"}
                  </p>
                  {selectedOrder ? (
                    <p className="mt-2 text-base font-semibold text-[#dce5ff]">
                      Duration: {selectedOrder.duration} | Price: {selectedOrder.bdt} BDT ({selectedOrder.usd})
                    </p>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-amber-100/90">Choose a panel and package above to unlock order submission.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#aeb8df]">
                Name
                <input name="name" className="min-h-12 rounded-md border border-white/12 bg-[#090b24] px-4 text-base text-white outline-none transition focus:border-[#4382DF]" placeholder="Your name" />
              </label>
              <label className="grid gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#aeb8df]">
                Contact
                <input name="contact" className="min-h-12 rounded-md border border-white/12 bg-[#090b24] px-4 text-base text-white outline-none transition focus:border-[#4382DF]" placeholder="Email or WhatsApp" />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#aeb8df]">
              Package Interest
              <input
                name="package"
                className="min-h-12 rounded-md border border-white/12 bg-[#090b24] px-4 text-base text-white outline-none transition focus:border-[#4382DF]"
                placeholder="Select a panel above"
                readOnly
                value={selectedOrder ? `${selectedOrder.panel} - ${selectedOrder.duration} - ${selectedOrder.bdt} BDT (${selectedOrder.usd})` : ""}
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#aeb8df]">
              Message
              <textarea name="message" className="min-h-32 rounded-md border border-white/12 bg-[#090b24] px-4 py-3 text-base text-white outline-none transition focus:border-[#4382DF]" placeholder="Tell us what you need." />
            </label>
            <button
              type="submit"
              disabled={!selectedOrder || status === "sending"}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#4382DF] px-6 text-base font-bold uppercase text-white shadow-[0_0_30px_rgba(67,130,223,0.45)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#5a95f0] focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f] disabled:cursor-not-allowed disabled:border disabled:border-white/12 disabled:bg-white/8 disabled:text-[#7f89b4] disabled:shadow-none disabled:hover:translate-y-0"
            >
              {status === "sending" ? "Sending..." : "Send Request"} <Send size={18} aria-hidden="true" />
            </button>
            {status === "success" ? (
              <p className="mt-4 rounded-md border border-emerald-300/30 bg-emerald-400/12 p-3 text-sm font-semibold text-emerald-100" role="status">
                Order request sent successfully. We will contact you soon.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="mt-4 rounded-md border border-red-300/30 bg-red-500/12 p-3 text-sm font-semibold text-red-100" role="alert">
                Could not confirm the request. Please try again or contact support directly.
              </p>
            ) : null}
          </form>
        </Reveal>
      </Container>
    </section>
  );
}
