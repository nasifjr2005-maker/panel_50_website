"use client";

import { Activity, CheckCircle2, Clock3, LockKeyhole, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { stats } from "@/lib/data";

type DashboardState = {
  updatedLabel: string;
  load: number;
  queue: number;
  completedToday: number;
  eta: number;
  status: string;
  statusTone: string;
};

const initialDashboardState: DashboardState = {
  updatedLabel: "Syncing...",
  load: 78,
  queue: 12,
  completedToday: 30,
  eta: 10,
  status: "Active",
  statusTone: "bg-emerald-300/15 text-emerald-100 border-emerald-200/35"
};

function getDashboardState() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const load = 72 + ((minutes + seconds) % 18);
  const queue = 9 + (seconds % 7);
  const completedToday = 26 + (minutes % 12);
  const eta = 8 + (seconds % 6);

  return {
    updatedLabel: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    load,
    queue,
    completedToday,
    eta,
    status: load > 84 ? "High Demand" : "Active",
    statusTone: load > 84 ? "bg-amber-300/15 text-amber-100 border-amber-200/35" : "bg-emerald-300/15 text-emerald-100 border-emerald-200/35"
  };
}

export function LiveStoreDashboard({ managedStats }: { managedStats?: Array<{ label: string; value: string }> }) {
  const [dashboard, setDashboard] = useState<DashboardState>(initialDashboardState);
  const visibleStats = useMemo(() => (managedStats?.length ? managedStats : stats).slice(0, 4), [managedStats]);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      setDashboard(getDashboardState());
    }, 0);

    const timer = window.setInterval(() => {
      setDashboard(getDashboardState());
    }, 3000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="glass relative overflow-hidden rounded-lg p-4 sm:p-5">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#7cb0ff] to-transparent" />
      <div className="rounded-lg border border-white/10 bg-[#080a22]/82 p-5">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8eb9ff]">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-300" />
              </span>
              Live Store Dashboard
            </div>
            <h2 className="mt-2 text-2xl font-bold uppercase text-white">Panel Access Queue</h2>
            <p className="mt-2 text-sm leading-6 text-[#aeb8df]">
              Updated {dashboard.updatedLabel}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`rounded-md border px-3 py-2 text-sm font-bold uppercase ${dashboard.statusTone}`}>
              {dashboard.status}
            </span>
            <button
              type="button"
              onClick={() => setDashboard(getDashboardState())}
              className="flex size-11 items-center justify-center rounded-md border border-white/12 bg-white/8 text-[#dce5ff] transition hover:border-[#7cb0ff] hover:bg-[#4382DF]/18 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f]"
              aria-label="Refresh live dashboard"
            >
              <RefreshCw size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {visibleStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-white/10 bg-[#090b24]/80 p-4 text-center transition hover:border-[#4382DF]/45 hover:bg-[#4382DF]/10">
              <p className="text-3xl font-bold uppercase text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#aeb8df]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Queue", value: `${dashboard.queue} active`, icon: Activity },
            { label: "Today", value: `${dashboard.completedToday} done`, icon: CheckCircle2 },
            { label: "ETA", value: `${dashboard.eta}-${dashboard.eta + 5} min`, icon: Clock3 }
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/7 p-4">
              <Icon size={18} className="text-[#7cb0ff]" aria-hidden="true" />
              <p className="mt-3 text-lg font-bold uppercase text-white">{value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#aeb8df]">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-[#4382DF]/25 bg-[#4382DF]/10 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 font-bold uppercase text-white">
              <Zap size={18} className="text-cyan-200" aria-hidden="true" />
              Activation Load
            </span>
            <span className="rounded-md bg-[#4382DF] px-3 py-1 text-sm font-bold text-white">{dashboard.load}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4382DF] via-cyan-300 to-emerald-300 transition-all duration-700"
              style={{ width: `${dashboard.load}%` }}
            />
          </div>
          <div className="mt-4 grid gap-3 text-sm text-[#dce5ff] sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-emerald-300" aria-hidden="true" />
              Verified order queue online
            </p>
            <p className="flex items-center gap-2">
              <LockKeyhole size={17} className="text-emerald-300" aria-hidden="true" />
              Secure handoff windows active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
