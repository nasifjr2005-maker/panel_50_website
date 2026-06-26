"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

export function AdminResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/recovery/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: searchParams.get("token"), password: form.get("password") })
    });
    if (!response.ok) {
      setError((await response.json()).error || "Could not reset password");
      return;
    }
    setStatus("Password updated. Redirecting to login...");
    window.setTimeout(() => router.push("/admin/login"), 1200);
  }

  return (
    <main className="min-h-screen px-5 py-16">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center">
        <form onSubmit={submit} className="glass w-full rounded-lg p-7">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7cb0ff]">Secure Recovery</p>
          <h1 className="mt-2 text-3xl font-bold uppercase text-white">Reset Password</h1>
          <label className="mt-8 grid gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[#aeb8df]">
            New Password
            <input name="password" required minLength={8} type="password" className="min-h-12 rounded-md border border-white/12 bg-[#090b24] px-4 text-base text-white outline-none transition focus:border-[#4382DF]" />
          </label>
          <button className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#4382DF] px-5 font-bold uppercase text-white transition hover:bg-[#5a95f0]">
            <LockKeyhole size={18} aria-hidden="true" />
            Update Password
          </button>
          {status ? <p className="mt-4 rounded-md border border-emerald-300/30 bg-emerald-400/12 p-3 text-sm font-semibold text-emerald-100">{status}</p> : null}
          {error ? <p className="mt-4 rounded-md border border-red-300/30 bg-red-500/12 p-3 text-sm font-semibold text-red-100">{error}</p> : null}
        </form>
      </div>
    </main>
  );
}
