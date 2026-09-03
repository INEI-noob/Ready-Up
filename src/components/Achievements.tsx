import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  ChevronDown,
  ChevronUp,
  Baby,
  Flame,
  Zap,
  Sparkles,
  Crown,
  BarChart3,
  Target,
  Swords,
  Medal,
  Rocket,
  Crosshair,
  Users,
  Gamepad2,
  ClipboardList,
  Heart,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Achievement, ReadyUpState } from "@/vite-env";

const ACHIEVEMENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  first_session: Baby,
  streak_3: Flame,
  streak_7: Zap,
  streak_14: Sparkles,
  streak_30: Crown,
  sessions_10: BarChart3,
  sessions_50: Target,
  matches_10: Swords,
  matches_50: Trophy,
  all_rules: Sparkles,
  first_win: Medal,
  win_streak_5: Rocket,
  high_kd: Crosshair,
  high_adr: Zap,
  roster_set: Users,
  profile_created: Gamepad2,
  template_saved: ClipboardList,
  comeback_kid: Heart,
  lineup_master: BookOpen,
};

export const ACHIEVEMENT_DEFS: Omit<Achievement, "unlockedAt">[] = [
  { id: "first_session", name: "First Steps", desc: "Log your first session", icon: "" },
  { id: "streak_3", name: "Hat Trick", desc: "3-day streak", icon: "" },
  { id: "streak_7", name: "On Fire", desc: "7-day streak", icon: "" },
  { id: "streak_14", name: "Unstoppable", desc: "14-day streak", icon: "" },
  { id: "streak_30", name: "Legend", desc: "30-day streak", icon: "" },
  { id: "sessions_10", name: "Regular", desc: "10 sessions logged", icon: "" },
  { id: "sessions_50", name: "Dedicated", desc: "50 sessions logged", icon: "" },
  { id: "matches_10", name: "Competitor", desc: "10 matches logged", icon: "" },
  { id: "matches_50", name: "Veteran", desc: "50 matches logged", icon: "" },
  { id: "all_rules", name: "Perfectionist", desc: "Check all focus points in a session", icon: "" },
  { id: "first_win", name: "Winner", desc: "Log your first win", icon: "" },
  { id: "win_streak_5", name: "Winning Streak", desc: "5 wins in a row", icon: "" },
  { id: "high_kd", name: "Sharpshooter", desc: "Log a session with K/D > 2.0", icon: "" },
  { id: "high_adr", name: "Entry Frag", desc: "Log a session with ADR > 100", icon: "" },
  { id: "roster_set", name: "Team Player", desc: "Save a full roster of 5+", icon: "" },
  { id: "profile_created", name: "Strategist", desc: "Create a launch profile", icon: "" },
  { id: "template_saved", name: "Organized", desc: "Save a rule template", icon: "" },
  { id: "comeback_kid", name: "Comeback Kid", desc: "Win right after a 3+ loss streak", icon: "" },
  { id: "lineup_master", name: "Lineup Master", desc: "Save 5 utility lineups", icon: "" },
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
  if (sessions.some((s) => s.rulesChecked >= 2)) tryUnlock("all_rules");
  if (matches.some((m) => m.result === "W")) tryUnlock("first_win");
  if (matches.length >= 5) {
    let streak = 0;
    for (const m of [...matches].reverse()) {
      if (m.result === "W") streak++;
      else break;
    }
    if (streak >= 5) tryUnlock("win_streak_5");
  }
  if (sessions.some((s) => s.kd !== undefined && s.kd! > 2)) tryUnlock("high_kd");
  if (sessions.some((s) => s.adr !== undefined && s.adr! > 100)) tryUnlock("high_adr");
  if ((state.teamRoster || []).length >= 5) tryUnlock("roster_set");
  if ((state.launchProfiles || []).length >= 1) tryUnlock("profile_created");
  if ((state.ruleTemplates || []).length >= 1) tryUnlock("template_saved");
  if ((state.lineups || []).length >= 5) tryUnlock("lineup_master");

  if (matches.length >= 4) {
    let lossStreak = 0;
    let comeback = false;
    for (const m of matches) {
      if (m.result === "L") {
        lossStreak++;
      } else if (m.result === "W") {
        if (lossStreak >= 3) {
          comeback = true;
          break;
        }
        lossStreak = 0;
      } else {
        lossStreak = 0;
      }
    }
    if (comeback) tryUnlock("comeback_kid");
  }

  return unlocked;
}

export function checkAndUnlockAchievements(state: ReadyUpState, setAchievements: (a: Achievement[]) => void): Achievement[] {
  const newAchievements = checkAchievements(state);
  if (newAchievements.length > 0) {
    const merged = [...(state.achievements || []), ...newAchievements];
    setAchievements(merged);
  }
  return newAchievements;
}

export function Achievements({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const [expanded, setExpanded] = useState(false);
  const unlocked = useMemo(() => new Set(achievements.map((a) => a.id)), [achievements]);
  const unlockedCount = achievements.length;
  const total = ACHIEVEMENT_DEFS.length;

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between rounded-xl border border-pastelPeach/20 bg-pastelPeach/10 px-3 py-2 transition-all hover:bg-pastelPeach/15"
      >
        <div className="flex items-center gap-2">
          <Trophy className="h-3.5 w-3.5 text-pastelPeach" />
          <span className="text-[12px] font-bold text-ink">Achievements</span>
          <span className="rounded-full bg-pastelPeach/20 px-1.5 py-0.5 font-mono text-[9px] text-pastelPeach">
            {unlockedCount}/{total}
          </span>
        </div>
        {expanded ? <ChevronUp className="h-3 w-3 text-inkDim" /> : <ChevronDown className="h-3 w-3 text-inkDim" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-4 gap-1.5">
              {ACHIEVEMENT_DEFS.map((def) => {
                const isUnlocked = unlocked.has(def.id);
                const achievement = achievements.find((a) => a.id === def.id);
                const unlockedAt = achievement?.unlockedAt;
                const Icon = ACHIEVEMENT_ICONS[def.id];

                return (
                  <motion.div
                    key={def.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "rounded-xl border px-2 py-1.5 text-center transition-all",
                      isUnlocked ? "border-pastelPeach/20 bg-pastelPeach/10" : "border-white/10 bg-white/5 opacity-50"
                    )}
                  >
                    <div className="flex justify-center">
                      {Icon && <Icon className={cn("h-4 w-4", isUnlocked ? "text-pastelPeach" : "text-inkDim/40")} />}
                    </div>
                    <div className={cn("text-[10px] font-bold", isUnlocked ? "text-ink" : "text-inkDim")}>{def.name}</div>
                    <div className="text-[9px] text-inkDim/80">{def.desc}</div>
                    {isUnlocked && (
                      <div className="mt-0.5 font-mono text-[9px] text-pastelPeach/60">
                        {new Date(unlockedAt!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
