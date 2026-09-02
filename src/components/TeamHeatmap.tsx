import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchEntry } from "@/vite-env";

const MAP_LIST = ["dust_ii", "mirage", "inferno", "nuke", "ancient", "anubis", "cache"];
const MAP_DISPLAY: Record<string, string> = {
  dust_ii: "Dust II", mirage: "Mirage", inferno: "Inferno",
  nuke: "Nuke", ancient: "Ancient", anubis: "Anubis", cache: "Cache",
};

type ViewMode = "map" | "player" | "opponent";

export function TeamHeatmap({ matches }: { matches: MatchEntry[] }) {
  const [view, setView] = useState<ViewMode>("map");

  const mapData = useMemo(() => {
    return MAP_LIST.map((map) => {
      const mapMatches = matches.filter((m) => m.map === map);
      const wins = mapMatches.filter((m) => m.result === "W").length;
      const losses = mapMatches.filter((m) => m.result === "L").length;
      const total = mapMatches.length;
      const winRate = total > 0 ? (wins / total) * 100 : 0;
      const avgKd = total > 0 ? mapMatches.reduce((a, m) => a + m.kd, 0) / total : 0;
      const avgAdr = total > 0 ? mapMatches.reduce((a, m) => a + m.adr, 0) / total : 0;
      return { map, wins, losses, total, winRate, avgKd, avgAdr };
    }).filter((d) => d.total > 0).sort((a, b) => b.total - a.total);
  }, [matches]);

  const playerData = useMemo(() => {
    const playerMap = new Map<string, { wins: number; losses: number; matches: MatchEntry[] }>();
    for (const m of matches) {
      for (const p of m.teamPlayers) {
        if (!playerMap.has(p)) playerMap.set(p, { wins: 0, losses: 0, matches: [] });
        const entry = playerMap.get(p)!;
        entry.matches.push(m);
        if (m.result === "W") entry.wins++;
        else if (m.result === "L") entry.losses++;
      }
    }
    return [...playerMap.entries()]
      .map(([player, data]) => ({
        player,
        wins: data.wins,
        losses: data.losses,
        total: data.matches.length,
        winRate: data.matches.length > 0 ? (data.wins / data.matches.length) * 100 : 0,
        avgKd: data.matches.length > 0 ? data.matches.reduce((a, m) => a + m.kd, 0) / data.matches.length : 0,
      }))
      .filter((d) => d.total >= 2)
      .sort((a, b) => b.total - a.total);
  }, [matches]);

  const opponentData = useMemo(() => {
    const oppMap = new Map<string, { wins: number; losses: number; matches: MatchEntry[] }>();
    for (const m of matches) {
      if (!oppMap.has(m.opponent)) oppMap.set(m.opponent, { wins: 0, losses: 0, matches: [] });
      const entry = oppMap.get(m.opponent)!;
      entry.matches.push(m);
      if (m.result === "W") entry.wins++;
      else if (m.result === "L") entry.losses++;
    }
    return [...oppMap.entries()]
      .map(([opp, data]) => ({
        opponent: opp,
        wins: data.wins,
        losses: data.losses,
        total: data.matches.length,
        winRate: data.matches.length > 0 ? (data.wins / data.matches.length) * 100 : 0,
      }))
      .filter((d) => d.total >= 2)
      .sort((a, b) => b.total - a.total);
  }, [matches]);

  function getHeatColor(rate: number) {
    if (rate >= 60) return "bg-pastelMint/20 text-okDark border-pastelMint/20";
    if (rate >= 40) return "bg-pastelYellow/20 text-ink border-pastelYellow/20";
    return "bg-pastelPink/20 text-pink border-pastelPink/20";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-3 w-3 text-pastelBlue" />
          <span className="font-mono text-[10px] tracking-wider text-inkDim">TEAM HEATMAP</span>
        </div>
      </div>

      {/* View tabs */}
      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-0.5">
        {(["map", "player", "opponent"] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "flex-1 rounded-lg py-1 text-[10px] font-bold capitalize transition-all",
              view === v ? "bg-gradient-to-r from-pastelBlue/20 to-pastelLavender/20 text-ink shadow-sm" : "text-inkDim hover:text-ink"
            )}
          >
            {v}
          </button>
        ))}
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border border-white/30 bg-white/20 p-3 text-center text-[11px] text-inkDim/50">
          No matches logged yet
        </div>
      ) : (
        <div className="space-y-1">
          {view === "map" && mapData.map((d) => (
            <div key={d.map} className={cn("flex items-center gap-2 rounded-xl border px-2.5 py-1.5", getHeatColor(d.winRate))}>
              <div className="w-14 text-[11px] font-bold">{MAP_DISPLAY[d.map]}</div>
              <div className="flex-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-current transition-all" style={{ width: `${d.winRate}%`, opacity: 0.3 }} />
                </div>
              </div>
              <div className="font-mono text-[10px]">{d.wins}W {d.losses}L</div>
              <div className="font-mono text-[10px] font-bold">{d.winRate.toFixed(0)}%</div>
            </div>
          ))}

          {view === "player" && playerData.map((d) => (
            <div key={d.player} className={cn("flex items-center gap-2 rounded-xl border px-2.5 py-1.5", getHeatColor(d.winRate))}>
              <div className="w-14 truncate text-[11px] font-bold">{d.player}</div>
              <div className="flex-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-current transition-all" style={{ width: `${d.winRate}%`, opacity: 0.3 }} />
                </div>
              </div>
              <div className="font-mono text-[10px]">{d.wins}W {d.losses}L</div>
              <div className="font-mono text-[10px]">K/D {d.avgKd.toFixed(2)}</div>
            </div>
          ))}

          {view === "opponent" && opponentData.map((d) => (
            <div key={d.opponent} className={cn("flex items-center gap-2 rounded-xl border px-2.5 py-1.5", getHeatColor(d.winRate))}>
              <div className="w-14 truncate text-[11px] font-bold">{d.opponent}</div>
              <div className="flex-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-current transition-all" style={{ width: `${d.winRate}%`, opacity: 0.3 }} />
                </div>
              </div>
              <div className="font-mono text-[10px]">{d.wins}W {d.losses}L</div>
              <div className="font-mono text-[10px] font-bold">{d.winRate.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
