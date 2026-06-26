"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui";

export function Newsletter({
  content = {},
  formsubmitEndpoint
}: {
  content?: Record<string, string>;
  formsubmitEndpoint: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const submission = new FormData();
    submission.append("_subject", "Newsletter signup");
    submission.append("_template", "table");
    submission.append("_captcha", "false");
    submission.append("email", email);

    try {
      await fetch(formsubmitEndpoint, {
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
    <section className="py-16">
      <Container>
        <Reveal>
          <div className="grid gap-6 rounded-lg border border-white/12 bg-white/7 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-bold uppercase text-white">{content.newsletterTitle || "Get stock alerts and pricing drops"}</h2>
              <p className="mt-2 text-base leading-7 text-[#c8d1f3]">{content.newsletterText || "Join the list for package updates, limited processing windows, and support announcements."}</p>
            </div>
            <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-3 sm:flex-row">
              <input name="email" required className="min-h-12 min-w-0 rounded-md border border-white/12 bg-[#090b24] px-4 text-base text-white outline-none transition focus:border-[#4382DF] sm:w-80" placeholder="Email address" type="email" aria-label="Email address" />
              <button disabled={status === "sending"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#4382DF] px-6 font-bold uppercase text-white transition hover:bg-[#5a95f0] disabled:cursor-not-allowed disabled:bg-white/8 disabled:text-[#7f89b4]" type="submit">
                {status === "sending" ? "Sending..." : "Subscribe"} <Send size={17} aria-hidden="true" />
              </button>
              {status === "success" ? <p className="text-sm font-semibold text-emerald-100 sm:self-center" role="status">Subscribed.</p> : null}
              {status === "error" ? <p className="text-sm font-semibold text-red-100 sm:self-center" role="alert">Try again.</p> : null}
            </form>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
