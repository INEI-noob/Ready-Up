import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, TrendingUp, TrendingDown, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchEntry } from "@/vite-env";

const TILT_THRESHOLD = 3;

export function MatchStreak({ matches }: { matches: MatchEntry[] }) {
  const stats = useMemo(() => {
    const teamMatches = matches.filter((m) => m.type !== "personal");
    const personalMatches = matches.filter((m) => m.type === "personal");

    function calcStreaks(list: MatchEntry[]) {
      let currentW = 0, currentL = 0, bestW = 0, bestL = 0;
      for (const m of list) {
        if (m.result === "W") {
          currentW++;
          currentL = 0;
          if (currentW > bestW) bestW = currentW;
        } else if (m.result === "L") {
          currentL++;
          currentW = 0;
          if (currentL > bestL) bestL = currentL;
        } else {
          currentW = 0;
          currentL = 0;
        }
      }
      return { currentW, currentL, bestW, bestL };
    }

    const team = calcStreaks(teamMatches);
    const personal = calcStreaks(personalMatches);
    const all = calcStreaks(matches);

    return { team, personal, all };
  }, [matches]);

  function StreakCard({ label, current, best, wins, losses }: {
    label: string;
    current: { currentW: number; currentL: number };
    best: { bestW: number; bestL: number };
    wins: number;
    losses: number;
  }) {
    const isWinStreak = current.currentW > 0;
    const isLossStreak = current.currentL > 0;
    const streakCount = isWinStreak ? current.currentW : isLossStreak ? current.currentL : 0;

    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
        <div className="mb-1.5 font-mono text-[10px] tracking-wider text-inkDim">{label}</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              {isWinStreak ? (
                <TrendingUp className="h-3 w-3 text-okDark" />
              ) : isLossStreak ? (
                <TrendingDown className="h-3 w-3 text-pink" />
              ) : (
                <Flame className="h-3 w-3 text-inkDim/40" />
              )}
              <span className={cn(
                "text-[13px] font-bold",
                isWinStreak ? "text-okDark" : isLossStreak ? "text-pink" : "text-inkDim"
              )}>
                {streakCount > 0 ? `${streakCount}${isWinStreak ? "W" : "L"}` : "—"}
              </span>
            </div>
            <div className="font-mono text-[9px] text-inkDim/80">
              {isWinStreak ? "WIN STREAK" : isLossStreak ? "LOSS STREAK" : "NO STREAK"}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] text-inkDim">
              <span className="text-okDark">{best.bestW}W</span> / <span className="text-pink">{best.bestL}L</span>
            </div>
            <div className="font-mono text-[9px] text-inkDim/80">BEST</div>
          </div>
        </div>
        <div className="mt-1.5 flex gap-1">
          <span className="rounded bg-pastelMint/15 px-1 py-0.5 font-mono text-[10px] font-bold text-okDark">{wins}W</span>
          <span className="rounded bg-pastelPink/15 px-1 py-0.5 font-mono text-[10px] font-bold text-pink">{losses}L</span>
        </div>
      </div>
    );
  }

  const teamWins = matches.filter((m) => m.type !== "personal" && m.result === "W").length;
  const teamLosses = matches.filter((m) => m.type !== "personal" && m.result === "L").length;
  const personalWins = matches.filter((m) => m.type === "personal" && m.result === "W").length;
  const personalLosses = matches.filter((m) => m.type === "personal" && m.result === "L").length;
  const allWins = matches.filter((m) => m.result === "W").length;
  const allLosses = matches.filter((m) => m.result === "L").length;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Flame className="h-3 w-3 text-pastelPeach" />
        <span className="font-mono text-[10px] tracking-wider text-inkDim">MATCH STREAKS</span>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border border-white/30 bg-white/20 p-3 text-center text-[11px] text-inkDim/70">
          No matches logged yet
        </div>
      ) : (
        <div className="space-y-1.5">
          {stats.all.currentL >= TILT_THRESHOLD && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl border border-pastelPeach/30 bg-pastelPeach/10 px-3 py-2"
            >
              <Coffee className="h-4 w-4 shrink-0 text-pastelPeach" />
              <div className="text-[11px] text-inkSoft">
                <strong className="text-ink">{stats.all.currentL} losses in a row.</strong> Your own routine says stop if tilted &mdash; maybe take a break before the next queue.
              </div>
            </motion.div>
          )}
          <StreakCard label="ALL MATCHES" current={stats.all} best={{ bestW: stats.all.bestW, bestL: stats.all.bestL }} wins={allWins} losses={allLosses} />
          {teamWins + teamLosses > 0 && (
            <StreakCard label="TEAM" current={stats.team} best={{ bestW: stats.team.bestW, bestL: stats.team.bestL }} wins={teamWins} losses={teamLosses} />
          )}
          {personalWins + personalLosses > 0 && (
            <StreakCard label="PERSONAL" current={stats.personal} best={{ bestW: stats.personal.bestW, bestL: stats.personal.bestL }} wins={personalWins} losses={personalLosses} />
          )}
        </div>
      )}
    </div>
  );
}
