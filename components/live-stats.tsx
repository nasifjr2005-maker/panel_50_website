"use client";

import { BarChart3, Pencil, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Reveal } from "@/components/reveal";
import { stats as defaultStats } from "@/lib/data";

type LiveStat = {
  label: string;
  value: string;
};

const storageKey = "panel50-live-stats";
const updateEventName = "panel50-live-stats-updated";

function readStoredStats(): LiveStat[] {
  if (typeof window === "undefined") {
    return defaultStats;
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return defaultStats;
    }

    const parsed = JSON.parse(stored) as LiveStat[];
    return defaultStats.map((stat) => parsed.find((item) => item.label === stat.label) ?? stat);
  } catch {
    return defaultStats;
  }
}

function saveStats(stats: LiveStat[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(stats));
  window.dispatchEvent(new CustomEvent(updateEventName, { detail: stats }));
}

export function LiveStatsGrid({
  editable = false,
  compact = false
}: {
  editable?: boolean;
  compact?: boolean;
}) {
  const [stats, setStats] = useState<LiveStat[]>(() => readStoredStats());
  const [draftStats, setDraftStats] = useState<LiveStat[]>(() => readStoredStats());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    function handleStatsUpdate(event: Event) {
      const nextStats = (event as CustomEvent<LiveStat[]>).detail ?? readStoredStats();
      setStats(nextStats);
      setDraftStats(nextStats);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === storageKey) {
        const nextStats = readStoredStats();
        setStats(nextStats);
        setDraftStats(nextStats);
      }
    }

    window.addEventListener(updateEventName, handleStatsUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(updateEventName, handleStatsUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const gridClassName = useMemo(
    () => (compact ? "mt-6 grid gap-4 sm:grid-cols-2" : "grid gap-4 md:grid-cols-4"),
    [compact]
  );

  function updateDraft(label: string, value: string) {
    setDraftStats((currentStats) =>
      currentStats.map((stat) => (stat.label === label ? { ...stat, value } : stat))
    );
  }

  function handleSave() {
    setStats(draftStats);
    saveStats(draftStats);
    setIsEditing(false);
  }

  function handleCancel() {
    setDraftStats(stats);
    setIsEditing(false);
  }

  return (
    <div>
      {editable ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#9dbef5]">
            <BarChart3 size={17} aria-hidden="true" />
            Live editable stats
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/8 px-4 text-sm font-bold uppercase text-white transition hover:border-[#7cb0ff] hover:bg-[#4382DF]/15 focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f]"
              >
                <X size={16} aria-hidden="true" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#4382DF] px-4 text-sm font-bold uppercase text-white transition hover:bg-[#5a95f0] focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f]"
              >
                <Save size={16} aria-hidden="true" />
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#4382DF]/45 bg-[#4382DF]/12 px-4 text-sm font-bold uppercase text-white transition hover:-translate-y-0.5 hover:border-[#7cb0ff] hover:bg-[#4382DF]/22 focus:outline-none focus:ring-2 focus:ring-[#7cb0ff] focus:ring-offset-2 focus:ring-offset-[#07091f]"
              aria-label="Update live store statistics"
            >
              <Pencil size={16} aria-hidden="true" />
              Update Stats
            </button>
          )}
        </div>
      ) : null}

      <div className={gridClassName}>
        {(isEditing ? draftStats : stats).map((stat, index) => {
          const card = (
            <div className={`rounded-lg border border-white/10 bg-[#090b24]/60 text-center ${compact ? "p-5" : "p-6"}`}>
              {isEditing ? (
                <input
                  value={stat.value}
                  onChange={(event) => updateDraft(stat.label, event.target.value)}
                  aria-label={`Update ${stat.label}`}
                  className="mx-auto min-h-12 w-full rounded-md border border-white/12 bg-[#07091f] px-3 text-center text-3xl font-bold uppercase text-white outline-none transition focus:border-[#7cb0ff] focus:ring-2 focus:ring-[#7cb0ff]/35"
                />
              ) : (
                <p className={`${compact ? "text-3xl" : "text-4xl"} font-bold uppercase text-white`}>{stat.value}</p>
              )}
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#aeb8df]">{stat.label}</p>
            </div>
          );

          return compact ? (
            <div key={stat.label}>{card}</div>
          ) : (
            <Reveal key={stat.label} delay={index * 0.04}>
              {card}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
