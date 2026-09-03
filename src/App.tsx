import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Calendar, PenLine, Minimize2, Maximize2, CalendarDays, BarChart3, Wrench, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/Mascot";
import { RuleCard } from "@/components/RuleCard";
import { Confetti } from "@/components/Confetti";
import { Calendar as CalendarView } from "@/components/Calendar";
import { Stats } from "@/components/Stats";
import { AddSession } from "@/components/AddSession";
import { PostMatchPrompt } from "@/components/PostMatchPrompt";
import { RosterManager } from "@/components/RosterManager";
import { Onboarding } from "@/components/Onboarding";
import { MiniDashboard } from "@/components/MiniDashboard";
import { LaunchProfiles } from "@/components/LaunchProfiles";
import { Achievements, checkAndUnlockAchievements, ACHIEVEMENT_DEFS } from "@/components/Achievements";
import { KeyboardHelp } from "@/components/KeyboardHelp";
import { SoundCustomization } from "@/components/SoundCustomization";
import { PracticeTimer } from "@/components/PracticeTimer";
import { MatchStreak } from "@/components/MatchStreak";
import { TeamHeatmap } from "@/components/TeamHeatmap";
import { CommunityServers } from "@/components/CommunityServers";
import { RuleTrends } from "@/components/RuleTrends";
import { WeeklyRecap } from "@/components/WeeklyRecap";
import { LineupNotebook } from "@/components/LineupNotebook";
import { ToastProvider, useToast } from "@/components/Toast";
import { useReadyUpState } from "@/hooks/useReadyUpState";
import { ROUTINE, FALLBACK_FOCUS, RULES } from "@/data/routine";
import { cn } from "@/lib/utils";
import type { SoundId } from "@/vite-env";

const SOUND_CONFIGS: Record<Exclude<SoundId, "none">, { freq: number; type: OscillatorType }> = {
  chime: { freq: 800, type: "sine" },
  pop: { freq: 600, type: "triangle" },
  ding: { freq: 1200, type: "sine" },
  bell: { freq: 1000, type: "sine" },
};

function playSound(soundId: SoundId) {
  if (soundId === "none") return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const config = SOUND_CONFIGS[soundId] ?? SOUND_CONFIGS.chime;

    osc.type = config.type;
    osc.frequency.setValueAtTime(config.freq, ctx.currentTime);

    if (soundId === "chime") {
      osc.frequency.exponentialRampToValueAtTime(config.freq * 1.5, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(config.freq, ctx.currentTime + 0.2);
    } else if (soundId === "bell") {
      osc.frequency.exponentialRampToValueAtTime(config.freq * 0.8, ctx.currentTime + 0.3);
    }

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch { /* silent fail */ }
}

function FloatingDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.svg viewBox="0 0 24 24" animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute left-[10%] top-[15%] h-6 w-6 text-pastelPink/20">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="currentColor" />
      </motion.svg>
      <motion.svg viewBox="0 0 24 24" animate={{ y: [8, -8, 8], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute right-[12%] top-[25%] h-5 w-5 text-pastelBlue/15">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
      </motion.svg>
      <motion.svg viewBox="0 0 16 16" animate={{ y: [-6, 6, -6], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-[20%] left-[8%] h-4 w-4 text-pastelLavender/15">
        <path d="M8 0L9.5 5.5L16 8L9.5 10.5L8 16L6.5 10.5L0 8L6.5 5.5Z" fill="currentColor" />
      </motion.svg>
      <motion.svg viewBox="0 0 24 24" animate={{ y: [5, -5, 5], x: [3, -3, 3] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-[30%] right-[15%] h-5 w-5 text-pastelPink/10">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
      </motion.svg>
    </div>
  );
}

function ProgressRing({ checked, total }: { checked: number; total: number }) {
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - ((total > 0 ? checked / total : 0)) * circumference;

  return (
    <div className="relative h-12 w-12">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,138,192,0.15)" strokeWidth="3" />
        <motion.circle cx="22" cy="22" r="20" fill="none" stroke="url(#progressGradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 0.5, ease: "easeOut" }} />
        <defs><linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8AC0" /><stop offset="1" stopColor="#8B85F5" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-xs font-bold text-pastelPink">{checked}/{total}</span>
      </div>
    </div>
  );
}

function ReadyUpApp() {
  const now = useMemo(() => new Date(), []);
  const dayName = useMemo(() => now.toLocaleDateString("en-US", { weekday: "long" }), [now]);
  const focus = ROUTINE[dayName] ?? FALLBACK_FOCUS;
  const dateLabel = useMemo(() => `${dayName.toUpperCase()} \u00B7 ${now.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`, [dayName, now]);

  const { state, loaded, commitToday, addSession, addMatch, deleteMatch, setTeamRoster, setOnboardingComplete, saveRuleTemplate, deleteRuleTemplate, archiveOldSessions, setViewMode, saveLaunchProfile, deleteLaunchProfile, setActiveProfile, setAchievements, setSoundId, saveServer, deleteServer, exportData, importData, setSidebarTab, setCalendarDate, setDailyRules, setPracticeTimer, saveLineup, deleteLineup } = useReadyUpState();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [launching, setLaunching] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showPostMatch, setShowPostMatch] = useState(false);
  const [postMatchType, setPostMatchType] = useState<"scrim" | "official">("scrim");
  const [showRoster, setShowRoster] = useState(false);
  const [mindsetNote, setMindsetNote] = useState("");
  const [showMindset, setShowMindset] = useState(false);
  const rulesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Load persisted daily rules for today
  useEffect(() => {
    if (loaded && state.dailyRules?.date === todayISO) {
      setChecked(new Set(state.dailyRules.checked));
    }
  }, [loaded]);

  // Persist daily rules when checked changes (debounced)
  const persistTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      setDailyRules([...checked]);
    }, 500);
    return () => clearTimeout(persistTimer.current);
  }, [checked, loaded]);

  const allChecked = checked.size === RULES.length;
  const showOnboarding = loaded && !state.onboardingComplete;
  const sidebarTab = state.sidebarTab;

  // Auto-archive old sessions on load
  const didArchive = useRef(false);
  useEffect(() => {
    if (loaded && !didArchive.current) {
      didArchive.current = true;
      archiveOldSessions();
    }
  }, [loaded]);

  // Play chime when all rules checked
  const prevAllChecked = useRef(false);
  useEffect(() => {
    if (allChecked && !prevAllChecked.current) {
      playSound(state.soundId);
      toast("All rules locked in!", "success");
    }
    prevAllChecked.current = allChecked;
  }, [allChecked, state.soundId]);

  // Check achievements on state change
  useEffect(() => {
    if (!loaded) return;
    const newAchievements = checkAndUnlockAchievements(state, setAchievements);
    if (newAchievements.length > 0) {
      for (const a of newAchievements) {
        const def = ACHIEVEMENT_DEFS.find((d) => d.id === a.id);
        if (def) {
          toast(`${def.name} unlocked!`, "success");
        }
      }
    }
  }, [loaded, state.sessions, state.matches, state.streak, state.teamRoster, state.lineups]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const active = document.activeElement;
      const isInput = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement;
      if (isInput) return;

      if (e.code === "Space") {
        e.preventDefault();
        if (allChecked && !launching) {
          handleLaunch();
        } else {
          const unchecked = RULES.find((r) => !checked.has(r.key));
          if (unchecked) toggleRule(unchecked.key);
        }
      }

      if (e.key >= "1" && e.key <= "4") {
        const idx = Number(e.key) - 1;
        if (idx < RULES.length) toggleRule(RULES[idx].key);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allChecked, launching, checked]);

  function toggleRule(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleLaunch() {
    if (!allChecked || launching) return;
    setLaunching(true);
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);

    await commitToday(dayName, [...checked]);

    setTimeout(async () => {
      if (window.api) {
        const result = await window.api.launchSteam();
        if (result.ok) {
          toast("Launched CS2!", "success");
        } else {
          toast("Couldn't reach Steam", "error");
        }
      } else {
        window.location.href = "steam://rungameid/730";
        toast("Launched CS2!", "success");
      }
      setLaunching(false);
      setShowAddSession(true);
    }, 500);
  }

  async function handleExport() {
    const json = await exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `readyup-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Data exported!", "success");
  }

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      await importData(text);
      toast("Data imported!", "success");
    };
    input.click();
  }

  if (showOnboarding) {
    return <Onboarding onComplete={(roster) => setOnboardingComplete(roster)} />;
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-8 transition-colors duration-300 md:items-center">
      <FloatingDecorations />
      <Confetti active={confetti} />
      <KeyboardHelp />

      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">

        {/* Left column — Launcher */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="hidden flex-col gap-4 lg:flex">
          <div className="rounded-3xl border border-pastelPink/20 bg-[rgba(25,22,40,0.75)] p-4 shadow-pastel backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-pastelPink" />
              <span className="font-mono text-[10px] tracking-wider text-inkDim">LAUNCHER</span>
            </div>
            <Button
              variant="idle"
              size="lg"
              onClick={async () => {
                if (window.api) {
                  const result = await window.api.launchSteam();
                  if (result.ok) toast("Launched CS2!", "success");
                  else toast("Couldn't reach Steam", "error");
                } else {
                  window.location.href = "steam://rungameid/730";
                  toast("Launched CS2!", "success");
                }
              }}
            >
              <span className="flex items-center gap-2">LAUNCH GAME</span>
            </Button>
          </div>
          <div className="rounded-3xl border border-pastelPink/20 bg-[rgba(25,22,40,0.75)] p-4 shadow-pastel backdrop-blur-sm">
            <CommunityServers
              servers={state.servers || []}
              onSave={(s) => { saveServer(s); toast("Server saved", "success"); }}
              onDelete={(id) => { deleteServer(id); toast("Server removed", "info"); }}
              onConnect={async (ip, port, password) => {
                if (window.api) {
                  const result = await window.api.connectServer(ip, port, password);
                  if (result.ok) toast("Connecting to server...", "success");
                  else toast("Could not connect", "error");
                }
              }}
            />
          </div>
        </motion.div>

        {/* Center column — Main */}
        <div className="w-full min-w-0">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
            <div className="mb-5 flex items-center justify-between">
              <Mascot checkedCount={checked.size} />
              <div className="flex items-center gap-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode(state.viewMode === "mini" ? "full" : "mini")} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/50 text-inkDim transition-all duration-300 hover:border-pastelLavender/30 hover:text-pastelLavender">
                  {state.viewMode === "mini" ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCalendar(!showCalendar)} className={cn("flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 lg:hidden", showCalendar ? "border-pastelPink bg-pastelPink/10 text-pastelPink shadow-pastel" : "border-white/40 bg-white/50 text-inkDim hover:border-pastelPink/30 hover:text-pastelPink")}>
                  <Calendar className="h-4 w-4" />
                </motion.button>

                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2.5 rounded-full border border-pastelPink/20 bg-white/70 px-4 py-2.5 shadow-pastel backdrop-blur-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pastelPeach to-pastelPink/50">
                    <Flame className="h-4 w-4 text-white" fill="currentColor" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold leading-none text-ink">{state.streak}</div>
                    <div className="font-mono text-[10px] tracking-wider text-inkDim">DAY STREAK</div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="text-center">
              <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-1 text-3xl font-extrabold tracking-tight text-gradient-pink">
                Ready Up
              </motion.h1>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="font-mono text-[13px] text-inkDim">
                {dateLabel}
              </motion.div>
            </div>
          </motion.div>

          {/* Mini Dashboard or Full View */}
          {state.viewMode === "mini" ? (
            <MiniDashboard
              state={state}
              checkedCount={checked.size}
              onExpand={() => setViewMode("full")}
            />
          ) : (
            <>
              {/* Today's Focus */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <Card className="mb-6">
              <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-pastelPink/15 blur-2xl" />
              <div className="pointer-events-none absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-pastelBlue/15 blur-2xl" />
              <CardContent>
                <div className="mb-2 font-mono text-[11px] tracking-wider text-inkDim">TODAY'S FOCUS</div>
                <div className="mb-1.5 text-lg font-bold text-gradient-blue">{focus.title}</div>
                <div className="text-[15px] leading-relaxed text-inkSoft">{focus.desc}</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rules */}
          <motion.div ref={rulesRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11.5px] tracking-wider text-inkDim">GOLDEN RULES</span>
              <ProgressRing checked={checked.size} total={RULES.length} />
            </div>
            <div className="mb-2 ml-1 font-mono text-[10.5px] text-inkDim/80">tap each one to lock it in &middot; press 1-4 or spacebar</div>
            <div className="mt-2">
              {RULES.map((rule, i) => (
                <RuleCard key={rule.key} rule={rule} checked={checked.has(rule.key)} onToggle={() => toggleRule(rule.key)} index={i} isLast={i === RULES.length - 1} />
              ))}
            </div>
          </motion.div>

          {/* Launch */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={allChecked ? "ready" : "idle"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mb-3 min-h-[16px] min-w-[200px] text-center font-mono text-[13px] text-inkDim"
              >
                {allChecked ? "all rules locked in. go get 'em!" : `${checked.size} / ${RULES.length} rules locked in`}
              </motion.div>
            </AnimatePresence>

            {/* Mindset quick-note */}
            <AnimatePresence>
              {allChecked && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 overflow-hidden"
                >
                  <div className="rounded-3xl border border-pastelPink/15 bg-pastelPink/5 p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <PenLine className="h-3 w-3 text-pastelPink" />
                        <span className="font-mono text-[10px] tracking-wider text-inkDim">PRE-GAME MINDSET</span>
                      </div>
                      <button onClick={() => setShowMindset(!showMindset)} className="rounded-lg p-1 font-mono text-[10px] text-pastelPink transition-colors duration-200 hover:text-pink active:scale-95">
                        {showMindset ? "hide" : "add note"}
                      </button>
                    </div>
                    <AnimatePresence>
                      {showMindset && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <textarea
                            value={mindsetNote}
                            onChange={(e) => setMindsetNote(e.target.value)}
                            rows={2}
                            placeholder="What's your mindset going in? e.g. stay calm, trade kills..."
                            className="w-full resize-none rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button variant={allChecked ? "ready" : "idle"} size="lg" disabled={!allChecked || launching} onClick={handleLaunch}>
              {launching ? (
                <span className="flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block"><Sparkles className="h-5 w-5" /></motion.span>
                  LAUNCHING...
                </span>
              ) : allChecked ? (
                <span className="flex items-center gap-2">READY UP &rarr; LAUNCH CS2</span>
              ) : (
                "READY UP"
              )}
            </Button>

            {!window.api && (
              <div className="mt-3 text-center text-[12px] text-inkDim/80">
                running in browser dev mode &mdash; Steam launch works once packaged as Electron
              </div>
            )}
          </motion.div>
            </>
          )}
        </div>

        {/* Right column — Sidebar */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className={cn("flex flex-col lg:w-[340px] lg:flex-shrink-0", showCalendar ? "w-full" : "hidden lg:flex")}>
          {/* Tab bar */}
          <div
            role="tablist"
            className="mb-3 flex gap-1 rounded-xl border border-white/30 bg-white/40 p-1"
            onKeyDown={(e) => {
              const tabs = ["schedule", "stats", "tools", "progress"] as const;
              const idx = tabs.indexOf(sidebarTab);
              if (e.key === "ArrowRight") {
                e.preventDefault();
                const next = tabs[(idx + 1) % tabs.length];
                setSidebarTab(next);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
                setSidebarTab(prev);
              }
            }}
          >
            {([
              { key: "schedule" as const, icon: CalendarDays, label: "Schedule" },
              { key: "stats" as const, icon: BarChart3, label: "Stats" },
              { key: "tools" as const, icon: Wrench, label: "Tools" },
              { key: "progress" as const, icon: Trophy, label: "Progress" },
            ]).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                role="tab"
                aria-selected={sidebarTab === key}
                tabIndex={sidebarTab === key ? 0 : -1}
                onClick={() => setSidebarTab(key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold transition-all",
                  sidebarTab === key
                    ? "bg-gradient-to-r from-pastelPink/20 to-pastelLavender/20 text-ink shadow-sm"
                    : "text-inkDim hover:text-ink"
                )}
                title={label}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-0 flex-1 overflow-y-auto rounded-3xl border border-pastelPink/20 bg-[rgba(25,22,40,0.75)] shadow-pastel backdrop-blur-sm scrollbar-thin scrollbar-thumb-pastelPink/20 scrollbar-track-transparent">
            <AnimatePresence mode="wait">
              <motion.div
                key={sidebarTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-4"
              >
                {sidebarTab === "schedule" && (
                   <CalendarView onQuickAdd={(type) => { setPostMatchType(type); setShowPostMatch(true); }} selectedDate={state.calendarDate} onDateSelect={setCalendarDate} />
                )}

                {sidebarTab === "stats" && (
                  <Stats
                    state={state}
                    onAddSession={() => setShowAddSession(true)}
                    onAddMatch={() => setShowPostMatch(true)}
                    onDeleteMatch={(id) => { deleteMatch(id); toast("Match deleted", "info"); }}
                    onOpenRoster={() => setShowRoster(true)}
                    onExport={handleExport}
                    onImport={handleImport}
                    onSaveTemplate={(t) => { saveRuleTemplate(t); toast("Template saved", "success"); }}
                    onDeleteTemplate={(name) => { deleteRuleTemplate(name); toast("Template deleted", "info"); }}
                    onLoadTemplate={(rules: string[]) => { setChecked(new Set(rules)); toast("Template loaded", "success"); }}
                  />
                )}

                {sidebarTab === "tools" && (
                  <div className="space-y-4">
                    <LaunchProfiles
                      profiles={state.launchProfiles || []}
                      activeProfile={state.activeProfile || null}
                      onSave={(p) => { saveLaunchProfile(p); toast("Profile saved", "success"); }}
                      onDelete={(id) => { deleteLaunchProfile(id); toast("Profile deleted", "info"); }}
                      onActivate={(id) => { setActiveProfile(id); const profile = (state.launchProfiles || []).find((p) => p.id === id); if (profile) setChecked(new Set(profile.rules)); toast("Profile activated", "success"); }}
                    />
                    <LineupNotebook
                      lineups={state.lineups || []}
                      onSave={(l) => { saveLineup(l); toast("Lineup saved", "success"); }}
                      onDelete={(id) => { deleteLineup(id); toast("Lineup deleted", "info"); }}
                    />
                    <SoundCustomization soundId={state.soundId || "chime"} onChange={setSoundId} />
                    <PracticeTimer timerState={state.practiceTimer} onTimerChange={setPracticeTimer} />
                  </div>
                )}

                {sidebarTab === "progress" && (
                  <div className="space-y-4">
                    <WeeklyRecap state={state} />
                    <Achievements achievements={state.achievements || []} />
                    <MatchStreak matches={state.matches || []} />
                    <RuleTrends history={state.ruleHistory || []} />
                    <TeamHeatmap matches={state.matches || []} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddSession && (
          <AddSession
            rulesChecked={checked.size}
            onAdd={(s) => {
              const withMindset = mindsetNote.trim() ? { ...s, mindsetNote: mindsetNote.trim() } : s;
              addSession(withMindset);
              setShowAddSession(false);
              setShowPostMatch(true);
            }}
            onClose={() => setShowAddSession(false)}
          />
        )}
        {showPostMatch && (
          <PostMatchPrompt
            onAdd={(m) => { addMatch(m); setShowPostMatch(false); }}
            onClose={() => setShowPostMatch(false)}
            roster={state.teamRoster}
            defaultType={postMatchType}
          />
        )}
        {showRoster && (
          <RosterManager
            roster={state.teamRoster || []}
            onSave={setTeamRoster}
            onClose={() => setShowRoster(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ReadyUpApp />
    </ToastProvider>
  );
}
