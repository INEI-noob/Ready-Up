import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, CalendarDays, Swords, User, Plus, Download, Upload, Users, GitCompareArrows } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/Sparkline";
import { MatchFilterBar, useMatchFilters } from "@/components/MatchFilter";
import { SessionCompare } from "@/components/SessionCompare";
import { RuleTemplates } from "@/components/RuleTemplates";
import type { ReadyUpState, MatchEntry, RuleTemplate } from "@/vite-env";

type Tab = "overview" | "sessions" | "team" | "personal";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: TrendingUp },
  { key: "sessions", label: "Sessions", icon: CalendarDays },
  { key: "team", label: "Team", icon: Swords },
  { key: "personal", label: "Personal", icon: User },
];

const MAP_DISPLAY: Record<string, string> = {
  dust_ii: "Dust II",
  mirage: "Mirage",
  inferno: "Inferno",
  nuke: "Nuke",
  ancient: "Ancient",
  anubis: "Anubis",
  cache: "Cache",
};

function format_date(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-2.5 text-center">
      <div className="font-display text-xl font-bold text-ink">{value}</div>
      <div className="font-mono text-[10px] tracking-wider text-inkDim">{label}</div>
      {sub && <div className="mt-0.5 text-[10px] text-inkDim/60">{sub}</div>}
    </div>
  );
}

function MatchRow({ match, showType = false, onDelete }: { match: MatchEntry; showType?: boolean; onDelete?: (id: string) => void }) {
  const resultColor = match.result === "W"
    ? "text-okDark bg-pastelMint/15"
    : match.result === "L"
      ? "text-pink bg-pastelPink/15"
      : "text-inkDim bg-inkDim/10";

  const typeColor = match.type === "scrim"
    ? "text-pastelLavender"
    : match.type === "official"
      ? "text-okDark"
      : "text-orange-400";

  const mapName = MAP_DISPLAY[match.map] || match.map;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("rounded-lg px-1.5 py-0.5 text-[13px] font-black", resultColor)}>
            {match.result}
          </span>
          <div>
            <div className="text-[13px] font-bold text-ink">{match.opponent}</div>
            <div className="font-mono text-[10px] text-inkDim">{mapName} &middot; {format_date(match.date)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-bold text-ink">{match.scoreFor}–{match.scoreAgainst}</div>
          {showType && <div className={cn("font-mono text-[10px] font-bold uppercase", typeColor)}>{match.type}</div>}
        </div>
      </div>
      <div className="mt-1.5 flex gap-3 border-t border-white/30 pt-1.5">
        <span className="font-mono text-[10px] text-inkSoft">K/D <strong className="text-ink">{match.kd.toFixed(2)}</strong></span>
        <span className="font-mono text-[10px] text-inkSoft">ADR <strong className="text-ink">{match.adr.toFixed(1)}</strong></span>
        <span className="font-mono text-[10px] text-inkSoft">HS <strong className="text-ink">{match.hsPercent}%</strong></span>
      </div>
      {match.teamPlayers.length > 0 && (
        <div className="mt-1 font-mono text-[10px] text-inkDim">{match.teamPlayers.join(", ")}</div>
      )}
      {match.note && <div className="mt-1 text-[10px] text-inkDim/60">{match.note}</div>}
      {onDelete && (
        <div className="mt-1.5 border-t border-white/30 pt-1.5">
          <button onClick={() => onDelete(match.id)} className="text-[10px] text-inkDim/40 hover:text-pink transition-colors">Delete</button>
        </div>
      )}
    </motion.div>
  );
}

function Overview({ state }: { state: ReadyUpState }) {
  const sessions = state.sessions || [];
  const allMatches = state.matches || [];
  const teamMatches = allMatches.filter((m) => m.type !== "personal");
  const personalMatches = allMatches.filter((m) => m.type === "personal");

  const avgKd = sessions.length > 0 ? (sessions.reduce((s, e) => s + e.kd, 0) / sessions.length).toFixed(2) : "—";
  const avgAdr = sessions.length > 0 ? (sessions.reduce((s, e) => s + e.adr, 0) / sessions.length).toFixed(1) : "—";
  const avgHs = sessions.length > 0 ? (sessions.reduce((s, e) => s + e.hsPercent, 0) / sessions.length).toFixed(0) + "%" : "—";

  const teamWins = teamMatches.filter((m) => m.result === "W").length;
  const teamLosses = teamMatches.filter((m) => m.result === "L").length;
  const teamDraws = teamMatches.filter((m) => m.result === "D").length;
  const teamWinRate = teamMatches.length > 0 ? ((teamWins / teamMatches.length) * 100).toFixed(0) + "%" : "—";

  const personalWins = personalMatches.filter((m) => m.result === "W").length;
  const personalLosses = personalMatches.filter((m) => m.result === "L").length;
  const personalDraws = personalMatches.filter((m) => m.result === "D").length;
  const personalWinRate = personalMatches.length > 0 ? ((personalWins / personalMatches.length) * 100).toFixed(0) + "%" : "—";

  const maxStreak = (() => {
    let max = state.streak;
    let cur = 0;
    const log = state.log || [];
    for (let i = 0; i < log.length; i++) {
      if (i === 0) { cur = 1; continue; }
      const prev = new Date(log[i - 1].date);
      const curr = new Date(log[i].date);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5) cur++; else cur = 1;
      if (cur > max) max = cur;
    }
    return max;
  })();

  const mapStats = (() => {
    const stats: Record<string, { wins: number; losses: number; total: number }> = {};
    for (const m of allMatches) {
      if (!stats[m.map]) stats[m.map] = { wins: 0, losses: 0, total: 0 };
      stats[m.map].total++;
      if (m.result === "W") stats[m.map].wins++;
      else if (m.result === "L") stats[m.map].losses++;
    }
    return Object.entries(stats)
      .map(([map, s]) => ({ map, ...s, winRate: s.total > 0 ? (s.wins / s.total) * 100 : 0 }))
      .sort((a, b) => b.total - a.total);
  })();

  const dayStats = (() => {
    const stats: Record<string, { kd: number; adr: number; count: number }> = {};
    for (const s of sessions) {
      if (!stats[s.day]) stats[s.day] = { kd: 0, adr: 0, count: 0 };
      stats[s.day].kd += s.kd;
      stats[s.day].adr += s.adr;
      stats[s.day].count++;
    }
    return Object.entries(stats)
      .map(([day, s]) => ({ day, avgKd: s.count > 0 ? s.kd / s.count : 0, avgAdr: s.count > 0 ? s.adr / s.count : 0, count: s.count }))
      .sort((a, b) => b.avgKd - a.avgKd);
  })();

  const kdTrend = sessions.slice(-10).map((s) => s.kd);
  const adrTrend = sessions.slice(-10).map((s) => s.adr);

  const ruleStats = state.ruleStats || {};
  const sortedRules = Object.entries(ruleStats).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <StatCard label="SESSIONS" value={sessions.length} />
        <StatCard label="STREAK" value={state.streak} sub={`max ${maxStreak}`} />
        <StatCard label="TOTAL GAMES" value={allMatches.length} />
      </div>
      <div className="flex gap-2">
        <StatCard label="AVG K/D" value={avgKd} />
        <StatCard label="AVG ADR" value={avgAdr} />
        <StatCard label="AVG HS%" value={avgHs} />
      </div>

      {sessions.length >= 2 && (
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-2.5">
            <div className="mb-1 font-mono text-[10px] tracking-wider text-inkDim">K/D TREND</div>
            <Sparkline data={kdTrend} color="#FFB6D9" />
          </div>
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-2.5">
            <div className="mb-1 font-mono text-[10px] tracking-wider text-inkDim">ADR TREND</div>
            <Sparkline data={adrTrend} color="#A8D8EA" />
          </div>
        </div>
      )}

      {teamMatches.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 font-mono text-[10px] tracking-wider text-inkDim">TEAM RECORD</div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="rounded-lg bg-pastelMint/15 px-2 py-1 text-[13px] font-bold text-okDark">{teamWins}W</span>
              <span className="rounded-lg bg-pastelPink/15 px-2 py-1 text-[13px] font-bold text-pink">{teamLosses}L</span>
              <span className="rounded-lg bg-inkDim/10 px-2 py-1 text-[13px] font-bold text-inkDim">{teamDraws}D</span>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold text-ink">{teamWinRate}</div>
              <div className="font-mono text-[10px] text-inkDim">WIN RATE</div>
            </div>
          </div>
        </div>
      )}

      {personalMatches.length > 0 && (
        <div className="rounded-xl border border-pastelPeach/20 bg-pastelPeach/5 p-3">
          <div className="mb-2 font-mono text-[10px] tracking-wider text-inkDim">PERSONAL RECORD</div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="rounded-lg bg-pastelMint/15 px-2 py-1 text-[13px] font-bold text-okDark">{personalWins}W</span>
              <span className="rounded-lg bg-pastelPink/15 px-2 py-1 text-[13px] font-bold text-pink">{personalLosses}L</span>
              <span className="rounded-lg bg-inkDim/10 px-2 py-1 text-[13px] font-bold text-inkDim">{personalDraws}D</span>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold text-ink">{personalWinRate}</div>
              <div className="font-mono text-[10px] text-inkDim">WIN RATE</div>
            </div>
          </div>
        </div>
      )}

      {mapStats.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 font-mono text-[10px] tracking-wider text-inkDim">MAP WIN RATES</div>
          <div className="space-y-1.5">
            {mapStats.map(({ map, wins, losses, total, winRate }) => (
              <div key={map} className="flex items-center gap-2">
                <div className="w-16 text-[11px] font-bold text-ink">{MAP_DISPLAY[map] || map}</div>
                <div className="flex-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-pastelPink/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-pastelPink to-pastelLavender transition-all" style={{ width: `${winRate}%` }} />
                  </div>
                </div>
                <div className="w-20 text-right font-mono text-[10px] text-inkDim">
                  {wins}W {losses}L <span className="text-inkSoft">({total})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dayStats.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 font-mono text-[10px] tracking-wider text-inkDim">BEST DAYS</div>
          <div className="space-y-1">
            {dayStats.map(({ day, avgKd, avgAdr, count }) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-ink">{day.slice(0, 3)}</span>
                <span className="font-mono text-[10px] text-inkDim">
                  K/D <strong className="text-ink">{avgKd.toFixed(2)}</strong> &middot; ADR <strong className="text-ink">{avgAdr.toFixed(1)}</strong>
                  <span className="ml-1 text-inkDim/50">({count})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sortedRules.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 font-mono text-[10px] tracking-wider text-inkDim">RULES CHECKED</div>
          <div className="space-y-1">
            {sortedRules.map(([key, count]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-ink capitalize">{key}</span>
                <span className="font-mono text-[10px] text-inkDim">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Sessions({ state, onAddSession }: { state: ReadyUpState; onAddSession: () => void }) {
  const [view, setView] = useState<"log" | "compare">("log");
  const sessions = [...(state.sessions || [])].reverse();

  return (
    <div>
      <div className="mb-3 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-0.5">
        <button
          onClick={() => setView("log")}
          className={cn("flex-1 rounded-lg py-1 text-[11px] font-bold transition-all", view === "log" ? "bg-gradient-to-r from-pastelBlue/20 to-pastelLavender/20 text-ink shadow-sm" : "text-inkDim hover:text-ink")}
        >
          Log
        </button>
        <button
          onClick={() => setView("compare")}
          className={cn("flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-[11px] font-bold transition-all", view === "compare" ? "bg-gradient-to-r from-pastelBlue/20 to-pastelLavender/20 text-ink shadow-sm" : "text-inkDim hover:text-ink")}
        >
          <GitCompareArrows className="h-3 w-3" /> Compare
        </button>
      </div>

      {view === "compare" ? (
        <SessionCompare sessions={state.sessions || []} />
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-wider text-inkDim">SESSION LOG</span>
            <button onClick={onAddSession} className="flex items-center gap-1 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10">
              <Plus className="h-3 w-3" /> ADD
            </button>
          </div>
          {sessions.length > 0 ? (
            <div className="space-y-1.5">
              {sessions.map((s, i) => (
                <div key={i} className="rounded-xl border border-pastelBlue/15 bg-pastelBlue/5 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[13px] font-bold text-ink">{s.day}</div>
                    <div className="font-mono text-[10px] text-inkDim">{format_date(s.date)}</div>
                  </div>
                  <div className="mt-1 flex gap-3">
                    <span className="font-mono text-[11px] text-inkSoft">K/D <strong className="text-ink">{s.kd.toFixed(2)}</strong></span>
                    <span className="font-mono text-[11px] text-inkSoft">ADR <strong className="text-ink">{s.adr.toFixed(1)}</strong></span>
                    <span className="font-mono text-[11px] text-inkSoft">HS <strong className="text-ink">{s.hsPercent}%</strong></span>
                  </div>
                  {s.mindsetNote && <div className="mt-1 font-mono text-[10px] text-pastelPink/60">{s.mindsetNote}</div>}
                  {s.note && <div className="mt-1 text-[11px] text-inkDim/60">{s.note}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-white/40 bg-white/30 p-4 text-center text-[12px] text-inkDim/60">No sessions logged yet</div>
          )}
        </>
      )}
    </div>
  );
}

function TeamMatches({ state, onAddMatch, onDeleteMatch }: { state: ReadyUpState; onAddMatch: () => void; onDeleteMatch?: (id: string) => void }) {
  const allTeam = [...(state.matches || [])].filter((m) => m.type !== "personal").reverse();
  const { filters, setFilters, filtered, activeCount } = useMatchFilters(allTeam);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wider text-inkDim">SCRIMS & OFFICIALS</span>
        <button onClick={onAddMatch} className="flex items-center gap-1 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10">
          <Plus className="h-3 w-3" /> ADD
        </button>
      </div>
      <MatchFilterBar filters={filters} setFilters={setFilters} activeCount={activeCount} onClear={() => setFilters({ search: "", map: "all", result: "all", dateRange: "all" })} />
      {filtered.length > 0 ? (
        <div className="space-y-1.5">{filtered.map((m) => <MatchRow key={m.id} match={m} showType onDelete={onDeleteMatch} />)}</div>
      ) : (
        <div className="rounded-xl border border-white/40 bg-white/30 p-4 text-center text-[12px] text-inkDim/60">
          {activeCount > 0 ? "No matches match your filters" : "No team matches logged yet"}
        </div>
      )}
    </div>
  );
}

function PersonalMatches({ state, onAddMatch, onDeleteMatch }: { state: ReadyUpState; onAddMatch: () => void; onDeleteMatch?: (id: string) => void }) {
  const allPersonal = [...(state.matches || [])].filter((m) => m.type === "personal").reverse();
  const { filters, setFilters, filtered, activeCount } = useMatchFilters(allPersonal);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-wider text-inkDim">PERSONAL GAMES</span>
        <button onClick={onAddMatch} className="flex items-center gap-1 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10">
          <Plus className="h-3 w-3" /> ADD
        </button>
      </div>
      <MatchFilterBar filters={filters} setFilters={setFilters} activeCount={activeCount} onClear={() => setFilters({ search: "", map: "all", result: "all", dateRange: "all" })} />
      {filtered.length > 0 ? (
        <div className="space-y-1.5">{filtered.map((m) => <MatchRow key={m.id} match={m} onDelete={onDeleteMatch} />)}</div>
      ) : (
        <div className="rounded-xl border border-white/40 bg-white/30 p-4 text-center text-[12px] text-inkDim/60">
          {activeCount > 0 ? "No matches match your filters" : "No personal games logged yet"}
        </div>
      )}
    </div>
  );
}

export function Stats({ state, onAddSession, onAddMatch, onDeleteMatch, onOpenRoster, onExport, onImport, onSaveTemplate, onDeleteTemplate, onLoadTemplate }: {
  state: ReadyUpState;
  onAddSession: () => void;
  onAddMatch: () => void;
  onDeleteMatch?: (id: string) => void;
  onOpenRoster: () => void;
  onExport: () => void;
  onImport: () => void;
  onSaveTemplate: (t: RuleTemplate) => void;
  onDeleteTemplate: (name: string) => void;
  onLoadTemplate: (rules: string[]) => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold transition-all",
            tab === key ? "bg-gradient-to-r from-pastelPink/20 to-pastelLavender/20 text-ink shadow-sm" : "text-inkDim hover:text-ink"
          )}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
          {tab === "overview" && <Overview state={state} />}
          {tab === "sessions" && <Sessions state={state} onAddSession={onAddSession} />}
          {tab === "team" && <TeamMatches state={state} onAddMatch={onAddMatch} onDeleteMatch={onDeleteMatch} />}
          {tab === "personal" && <PersonalMatches state={state} onAddMatch={onAddMatch} onDeleteMatch={onDeleteMatch} />}
        </motion.div>
      </AnimatePresence>

      {/* Rule templates */}
      <div className="mt-4 border-t border-pastelPink/15 pt-3">
        <RuleTemplates
          templates={state.ruleTemplates || []}
          onSave={onSaveTemplate}
          onDelete={onDeleteTemplate}
          onLoad={onLoadTemplate}
          currentChecked={new Set()}
        />
      </div>

      {/* Bottom actions */}
      <div className="mt-4 flex gap-2 border-t border-pastelPink/15 pt-3">
        <button onClick={onOpenRoster} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[12px] font-bold text-inkDim transition-all hover:border-pastelLavender/30 hover:text-ink">
          <Users className="h-3 w-3" /> Roster
        </button>
        <button onClick={onExport} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[12px] font-bold text-inkDim transition-all hover:border-pastelBlue/30 hover:text-ink">
          <Download className="h-3 w-3" /> Export
        </button>
        <button onClick={onImport} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[12px] font-bold text-inkDim transition-all hover:border-pastelPink/30 hover:text-ink">
          <Upload className="h-3 w-3" /> Import
        </button>
      </div>
    </div>
  );
}
