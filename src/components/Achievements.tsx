import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement, ReadyUpState } from "@/vite-env";

export const ACHIEVEMENT_DEFS: Omit<Achievement, "unlockedAt">[] = [
  { id: "first_session", name: "First Steps", desc: "Log your first session", icon: "\u{1F476}" },
  { id: "streak_3", name: "Hat Trick", desc: "3-day streak", icon: "\u{1F525}" },
  { id: "streak_7", name: "On Fire", desc: "7-day streak", icon: "\u{2604}\uFE0F" },
  { id: "streak_14", name: "Unstoppable", desc: "14-day streak", icon: "\u{1F4AB}" },
  { id: "streak_30", name: "Legend", desc: "30-day streak", icon: "\u{1F451}" },
  { id: "sessions_10", name: "Regular", desc: "10 sessions logged", icon: "\u{1F4CA}" },
  { id: "sessions_50", name: "Dedicated", desc: "50 sessions logged", icon: "\u{1F3AF}" },
  { id: "matches_10", name: "Competitor", desc: "10 matches logged", icon: "\u{2694}\uFE0F" },
  { id: "matches_50", name: "Veteran", desc: "50 matches logged", icon: "\u{1F3C6}" },
  { id: "all_rules", name: "Perfectionist", desc: "Check all 4 rules in a session", icon: "\u{2728}" },
  { id: "first_win", name: "Winner", desc: "Log your first win", icon: "\u{1F3C5}" },
  { id: "win_streak_5", name: "Winning Streak", desc: "5 wins in a row", icon: "\u{1F680}" },
  { id: "high_kd", name: "Sharpshooter", desc: "Log a session with K/D > 2.0", icon: "\u{1F3AF}" },
  { id: "high_adr", name: "Entry Frag", desc: "Log a session with ADR > 100", icon: "\u{1F4A5}" },
  { id: "roster_set", name: "Team Player", desc: "Save a full roster of 5+", icon: "\u{1F465}" },
  { id: "dark_mode", name: "Night Owl", desc: "Use dark mode", icon: "\u{1F319}" },
  { id: "profile_created", name: "Strategist", desc: "Create a launch profile", icon: "\u{1F3AE}" },
  { id: "template_saved", name: "Organized", desc: "Save a rule template", icon: "\u{1F4CB}" },
];

function checkAchievements(state: ReadyUpState): Achievement[] {
  const unlocked: Achievement[] = [];
  const now = new Date().toISOString();
  const sessions = state.sessions || [];
  const matches = state.matches || [];
  const existing = new Map((state.achievements || []).map((a) => [a.id, a.unlockedAt]));

  function tryUnlock(id: string) {
    if (!existing.has(id)) {
      unlocked.push({ id, name: "", desc: "", icon: "", unlockedAt: now });
    }
  }

  if (sessions.length >= 1) tryUnlock("first_session");
  if (sessions.length >= 10) tryUnlock("sessions_10");
  if (sessions.length >= 50) tryUnlock("sessions_50");
  if (matches.length >= 10) tryUnlock("matches_10");
  if (matches.length >= 50) tryUnlock("matches_50");
  if (state.streak >= 3) tryUnlock("streak_3");
  if (state.streak >= 7) tryUnlock("streak_7");
  if (state.streak >= 14) tryUnlock("streak_14");
  if (state.streak >= 30) tryUnlock("streak_30");
  if (sessions.some((s) => s.rulesChecked >= 4)) tryUnlock("all_rules");
  if (matches.some((m) => m.result === "W")) tryUnlock("first_win");
  if (sessions.some((s) => s.kd > 2.0)) tryUnlock("high_kd");
  if (sessions.some((s) => s.adr > 100)) tryUnlock("high_adr");
  if (state.teamRoster.length >= 5) tryUnlock("roster_set");
  if (state.darkMode) tryUnlock("dark_mode");
  if ((state.launchProfiles || []).length > 0) tryUnlock("profile_created");
  if ((state.ruleTemplates || []).length > 0) tryUnlock("template_saved");

  const teamMatches = matches.filter((m) => m.type !== "personal");
  let winStreak = 0;
  for (let i = teamMatches.length - 1; i >= 0; i--) {
    if (teamMatches[i].result === "W") winStreak++;
    else break;
  }
  if (winStreak >= 5) tryUnlock("win_streak_5");

  return unlocked;
}

export function getNewAchievements(state: ReadyUpState): Achievement[] {
  return checkAchievements(state);
}

export function mergeAchievements(existing: Achievement[], newOnes: Achievement[]): Achievement[] {
  const map = new Map(existing.map((a) => [a.id, a]));
  for (const a of newOnes) {
    if (!map.has(a.id)) {
      map.set(a.id, a);
    }
  }
  return [...map.values()];
}

export function Achievements({ state }: { state: ReadyUpState }) {
  const [expanded, setExpanded] = useState(false);
  const allDefs = ACHIEVEMENT_DEFS;
  const unlockedMap = useMemo(() => new Map((state.achievements || []).map((a) => [a.id, a.unlockedAt])), [state.achievements]);
  const unlockedCount = unlockedMap.size;
  const totalCount = allDefs.length;

  const visibleAchievements = expanded ? allDefs : allDefs.slice(0, 6);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Trophy className="h-3 w-3 text-pastelPeach" />
          <span className="font-mono text-[10px] tracking-wider text-inkDim">ACHIEVEMENTS</span>
          <span className="rounded-full bg-pastelPeach/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-pastelPeach">
            {unlockedCount}/{totalCount}
          </span>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-inkDim/40 hover:text-inkDim">
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 overflow-hidden rounded-full bg-pastelPink/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pastelPeach to-pastelPink"
          animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Achievement grid */}
      <div className={cn("grid gap-1.5", expanded ? "grid-cols-2" : "grid-cols-3")}>
        <AnimatePresence>
          {visibleAchievements.map((def) => {
            const unlockedAt = unlockedMap.get(def.id);
            const isUnlocked = !!unlockedAt;
            return (
              <motion.div
                key={def.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "rounded-xl border px-2 py-1.5 text-center transition-all",
                  isUnlocked ? "border-pastelPeach/20 bg-pastelPeach/10" : "border-white/30 bg-white/20 opacity-50"
                )}
              >
                <div className="text-base">{def.icon}</div>
                <div className={cn("text-[10px] font-bold", isUnlocked ? "text-ink" : "text-inkDim")}>{def.name}</div>
                <div className="text-[8px] text-inkDim/60">{def.desc}</div>
                {isUnlocked && (
                  <div className="mt-0.5 font-mono text-[7px] text-pastelPeach/60">
                    {new Date(unlockedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
