"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/lib/data";
import { ButtonLink, Container } from "@/components/ui";

export function Navbar({ settings = {} }: { settings?: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const logoUrl = settings.logoUrl || "/frame.png";
  const brandName = settings.brandName || "PANEL 50";
  const brandTagline = settings.brandTagline || "Official Store";
  const orderButtonText = settings.orderButtonText || "Buy Now";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080a22]/82 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        <a href="#home" className="flex items-center gap-3" aria-label="PANEL 50 OFFICIAL STORE home">
          <span className="flex size-12 items-center justify-center overflow-hidden rounded-md bg-white shadow-[0_0_28px_rgba(67,130,223,0.45)]">
            <img src={logoUrl} alt="" className="h-full w-full object-contain" />
          </span>
          <span className="leading-none">
            <span className="block text-xl font-bold uppercase text-white">{brandName}</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-[#9dbef5]">{brandTagline}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="group relative py-2 text-sm font-semibold uppercase text-[#d8def7] transition hover:text-white">
              {link.label}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#4382DF] to-cyan-300 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="#pricing">{orderButtonText}</ButtonLink>
        </div>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-md border border-white/15 bg-white/8 text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle mobile menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open ? (
        <div className="border-t border-white/10 bg-[#0b0d2a] lg:hidden">
          <Container className="grid gap-2 py-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-semibold uppercase text-[#d8def7] hover:bg-white/8"
              >
                {link.label}
              </a>
            ))}
            <ButtonLink href="#pricing" className="mt-2 w-full" onClickCapture={() => setOpen(false)}>
              {orderButtonText}
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
