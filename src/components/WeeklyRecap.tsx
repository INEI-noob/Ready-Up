import { useMemo } from "react";
import { CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReadyUpState } from "@/vite-env";

const MAP_DISPLAY: Record<string, string> = {
  dust_ii: "Dust II",
  mirage: "Mirage",
  inferno: "Inferno",
  nuke: "Nuke",
  ancient: "Ancient",
  anubis: "Anubis",
  cache: "Cache",
};

function daysAgo(iso: string, cutoff: Date): boolean {
  return new Date(iso) >= cutoff;
}

export function WeeklyRecap({ state }: { state: ReadyUpState }) {
  const recap = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);

    const sessions = (state.sessions || []).filter((s) => daysAgo(s.date, cutoff));
    const matches = (state.matches || []).filter((m) => daysAgo(m.date, cutoff));
    const wins = matches.filter((m) => m.result === "W").length;
    const losses = matches.filter((m) => m.result === "L").length;
    const draws = matches.filter((m) => m.result === "D").length;

    const avgKd = sessions.length > 0 ? sessions.reduce((s, e) => s + e.kd, 0) / sessions.length : null;

    const byMap: Record<string, { wins: number; losses: number; total: number }> = {};
    for (const m of matches) {
      if (!byMap[m.map]) byMap[m.map] = { wins: 0, losses: 0, total: 0 };
      byMap[m.map].total++;
      if (m.result === "W") byMap[m.map].wins++;
      if (m.result === "L") byMap[m.map].losses++;
    }
    const mapEntries = Object.entries(byMap);
    const bestMap = mapEntries.filter(([, s]) => s.wins > 0).sort((a, b) => b[1].wins / b[1].total - a[1].wins / a[1].total)[0];
    const toughestMap = mapEntries.filter(([, s]) => s.losses > 0).sort((a, b) => b[1].losses - a[1].losses)[0];

    const weekHistory = (state.ruleHistory || []).filter((h) => daysAgo(h.date, cutoff));
    const totalChecked = weekHistory.reduce((sum, h) => sum + h.checked.length, 0);
    const adherence = weekHistory.length > 0 ? Math.round((totalChecked / weekHistory.length) * 100) : null;

    return { sessions: sessions.length, matches: matches.length, wins, losses, draws, avgKd, bestMap, toughestMap, adherence };
  }, [state]);

  const hasAnything = recap.sessions > 0 || recap.matches > 0;

  return (
    <div className="rounded-2xl border border-pastelLavender/20 bg-gradient-to-br from-pastelPink/10 via-pastelLavender/10 to-pastelBlue/10 p-3">
      <div className="mb-2 flex items-center gap-1.5">
        <CalendarRange className="h-3.5 w-3.5 text-pastelLavender" />
        <span className="font-mono text-[10px] tracking-wider text-inkDim">LAST 7 DAYS</span>
        {state.streak > 0 && (
          <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 font-mono text-[9px] font-bold text-inkSoft">
            {state.streak} day streak
          </span>
        )}
      </div>

      {!hasAnything ? (
        <div className="py-2 text-center text-[12px] text-inkDim/70">Nothing logged this week yet &mdash; go ready up!</div>
      ) : (
        <>
          <div className="mb-2 flex gap-2">
            <div className="flex-1 rounded-xl bg-white/10 p-2 text-center">
              <div className="font-display text-lg font-bold text-ink">{recap.sessions}</div>
              <div className="font-mono text-[9px] tracking-wider text-inkDim">SESSIONS</div>
            </div>
            <div className="flex-1 rounded-xl bg-white/10 p-2 text-center">
              <div className="font-display text-lg font-bold text-ink">
                {recap.wins}<span className="text-inkDim">-</span>{recap.losses}
                {recap.draws > 0 && <span className="text-inkDim">-{recap.draws}</span>}
              </div>
              <div className="font-mono text-[9px] tracking-wider text-inkDim">RECORD</div>
            </div>
            <div className="flex-1 rounded-xl bg-white/10 p-2 text-center">
              <div className={cn("font-display text-lg font-bold", recap.adherence === null ? "text-inkDim" : recap.adherence >= 80 ? "text-okDark" : "text-ink")}>
                {recap.adherence !== null ? `${recap.adherence}%` : "—"}
              </div>
              <div className="font-mono text-[9px] tracking-wider text-inkDim">FOCUS POINTS KEPT</div>
            </div>
          </div>

          {(recap.bestMap || recap.toughestMap || recap.avgKd !== null) && (
            <div className="flex flex-wrap gap-1.5 border-t border-white/20 pt-2 text-[10px]">
              {recap.avgKd !== null && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-inkSoft">
                  avg K/D <strong className="text-ink">{recap.avgKd.toFixed(2)}</strong>
                </span>
              )}
              {recap.bestMap && (
                <span className="rounded-full bg-pastelMint/15 px-2 py-0.5 font-mono text-okDark">
                  best: {MAP_DISPLAY[recap.bestMap[0]] || recap.bestMap[0]} ({recap.bestMap[1].wins}W-{recap.bestMap[1].losses}L)
                </span>
              )}
              {recap.toughestMap && (
                <span className="rounded-full bg-pastelPink/15 px-2 py-0.5 font-mono text-pink">
                  tough: {MAP_DISPLAY[recap.toughestMap[0]] || recap.toughestMap[0]} ({recap.toughestMap[1].wins}W-{recap.toughestMap[1].losses}L)
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
