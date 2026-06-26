"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, MessageCircle } from "lucide-react";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function getDeviceHwid() {
    const storageKey = "panel50_admin_device_id";
    let deviceId = window.localStorage.getItem(storageKey);
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      window.localStorage.setItem(storageKey, deviceId);
    }

    const raw = [
      "panel50-admin-device",
      deviceId,
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      screen.width,
      screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset()
    ].join(":");
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
    return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const hwid = await getDeviceHwid();

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
        hwid
      })
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Invalid KeyAuth credentials.");
      return;
    }
    window.sessionStorage.setItem("panel50_admin_fresh_login", "1");
    router.push("/admin");
  }

  async function requestEmailRecovery() {
    setRecoveryMessage("Sending secure reset email...");
    const response = await fetch("/api/admin/recovery/email", { method: "POST" });
    const data = await response.json();
    setRecoveryMessage(data.message || "Recovery email sent.");
    setDevResetUrl(data.resetUrl || "");
  }

  async function requestWhatsappRecovery() {
    const username = window.prompt("Enter admin username for recovery request") || "unknown";
    const response = await fetch("/api/admin/recovery/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    });
    const data = await response.json();
    if (data.whatsappUrl) {
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    }
    setRecoveryMessage(`WhatsApp recovery request created: ${data.request?.id}`);
  }

  return (
    <main className="min-h-screen px-5 py-16">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center">
        <form onSubmit={handleSubmit} className="glass w-full rounded-lg p-7">
          <div className="flex items-center gap-3">
            <span className="flex size-14 items-center justify-center overflow-hidden rounded-md bg-white">
              <Image src="/frame.png" alt="" width={56} height={56} className="h-full w-full object-contain" priority />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7cb0ff]">KeyAuth Access</p>
              <h1 className="text-3xl font-bold uppercase text-white">Admin Login</h1>
            </div>
          </div>

          <label className="mt-8 grid gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#aeb8df]">
            KeyAuth Username
            <input name="username" required className="min-h-12 rounded-md border border-white/12 bg-[#090b24] px-4 text-base text-white outline-none transition focus:border-[#4382DF]" />
          </label>
          <label className="mt-4 grid gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#aeb8df]">
            KeyAuth Password
            <input name="password" required type="password" className="min-h-12 rounded-md border border-white/12 bg-[#090b24] px-4 text-base text-white outline-none transition focus:border-[#4382DF]" />
          </label>
          <button disabled={loading} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#4382DF] px-5 font-bold uppercase text-white transition hover:bg-[#5a95f0] disabled:opacity-60">
            <LockKeyhole size={18} aria-hidden="true" />
            {loading ? "Checking..." : "Enter Dashboard"}
          </button>
          {error ? <p className="mt-4 rounded-md border border-red-300/30 bg-red-500/12 p-3 text-sm font-semibold text-red-100">{error}</p> : null}
          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={requestEmailRecovery} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/8 px-4 text-sm font-bold uppercase text-white transition hover:border-[#7cb0ff]">
              <Mail size={16} aria-hidden="true" />
              Forgot Password
            </button>
            <button type="button" onClick={requestWhatsappRecovery} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-emerald-300/25 bg-emerald-400/10 px-4 text-sm font-bold uppercase text-emerald-100 transition hover:border-emerald-200/60">
              <MessageCircle size={16} aria-hidden="true" />
              Request Recovery via WhatsApp
            </button>
            {recoveryMessage ? <p className="rounded-md border border-[#4382DF]/30 bg-[#4382DF]/12 p-3 text-sm text-[#dce5ff]">{recoveryMessage}</p> : null}
            {devResetUrl ? <a href={devResetUrl} className="break-all text-sm text-[#7cb0ff] underline">Development reset link: {devResetUrl}</a> : null}
          </div>
        </form>
      </div>
    </main>
  );
}
