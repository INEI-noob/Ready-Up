import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PracticeTimerState } from "@/vite-env";

type TimerPhase = "aim" | "utility" | "clutch" | "rest";

const PHASES: Record<TimerPhase, { label: string; duration: number; color: string }> = {
  aim: { label: "Aim Training", duration: 300, color: "text-pastelPink" },
  utility: { label: "Utility Practice", duration: 300, color: "text-pastelBlue" },
  clutch: { label: "Clutch Scenarios", duration: 300, color: "text-pastelLavender" },
  rest: { label: "Break", duration: 60, color: "text-pastelMint" },
};

const PHASE_ORDER: TimerPhase[] = ["aim", "utility", "clutch", "rest"];

const DEFAULT_DURATIONS: Record<TimerPhase, number> = {
  aim: 300,
  utility: 300,
  clutch: 300,
  rest: 60,
};

export function PracticeTimer({ timerState, onTimerChange }: {
  timerState?: PracticeTimerState;
  onTimerChange?: (s: PracticeTimerState) => void;
}) {
  // Calculate elapsed time if timer was running when app closed
  const initialRemaining = (() => {
    if (!timerState?.running || !timerState?.lastTick) return timerState?.remaining ?? PHASES.aim.duration;
    const elapsed = Math.floor((Date.now() - timerState.lastTick) / 1000);
    return Math.max(0, timerState.remaining - elapsed);
  })();

  const initialRunning = timerState?.running && initialRemaining > 0;

  const [running, setRunning] = useState(initialRunning);
  const [phaseIndex, setPhaseIndex] = useState(timerState?.phase ?? 0);
  const [remaining, setRemaining] = useState(initialRemaining);
  const [expanded, setExpanded] = useState(false);
  const [customDurations, setCustomDurations] = useState<Record<TimerPhase, number>>(
    timerState?.customDurations as Record<TimerPhase, number> ?? DEFAULT_DURATIONS
  );
  const intervalRef = useRef<number | null>(null);
  const persistRef = useRef<ReturnType<typeof setTimeout>>();

  const currentPhase = PHASE_ORDER[phaseIndex];
  const phaseConfig = PHASES[currentPhase];

  const totalElapsed = PHASE_ORDER.slice(0, phaseIndex).reduce((sum, p) => sum + customDurations[p], 0) + (customDurations[currentPhase] - remaining);
  const totalDuration = Object.values(customDurations).reduce((a, b) => a + b, 0);
  const progress = totalDuration > 0 ? (totalElapsed / totalDuration) * 100 : 0;

  // Persist state changes (debounced)
  const persist = useCallback(() => {
    if (!onTimerChange) return;
    const snapshot = { phase: phaseIndex, remaining, running: !!running, customDurations, lastTick: Date.now() };
    clearTimeout(persistRef.current);
    persistRef.current = setTimeout(() => {
      onTimerChange(snapshot);
    }, 300);
  }, [phaseIndex, remaining, running, customDurations, onTimerChange]);

  useEffect(() => {
    persist();
    return () => clearTimeout(persistRef.current);
  }, [phaseIndex, remaining, running, customDurations]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => {
            const next = pi + 1;
            if (next >= PHASE_ORDER.length) {
              setRunning(false);
              return 0;
            }
            setRemaining(customDurations[PHASE_ORDER[next]]);
            return next;
          });
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, customDurations]);

  const toggleRunning = useCallback(() => setRunning((r) => !r), []);

  const reset = useCallback(() => {
    setRunning(false);
    setPhaseIndex(0);
    setRemaining(customDurations.aim);
  }, [customDurations]);

  const updateDuration = useCallback((phase: TimerPhase, seconds: number) => {
    setCustomDurations((prev) => ({ ...prev, [phase]: seconds }));
    if (phase === currentPhase && !running) {
      setRemaining(seconds);
    }
  }, [currentPhase, running]);

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Timer className="h-3 w-3 text-pastelLavender" />
          <span className="font-mono text-[10px] tracking-wider text-inkDim">PRACTICE TIMER</span>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-inkDim/40 hover:text-inkDim">
          <ChevronDown className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")} />
        </button>
      </div>

      {/* Main timer display */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
        <div className={cn("font-mono text-[10px] tracking-wider", phaseConfig.color)}>{phaseConfig.label}</div>
        <div className="my-1 font-display text-3xl font-bold text-ink">{formatTime(remaining)}</div>

        {/* Progress bar */}
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-pastelPink/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pastelPink to-pastelLavender"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Phase indicators */}
        <div className="mb-2 flex gap-1">
          {PHASE_ORDER.map((p, i) => (
            <div
              key={p}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                i < phaseIndex ? "bg-pastelMint" : i === phaseIndex ? "bg-pastelPink" : "bg-pastelPink/15"
              )}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button onClick={toggleRunning} className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] font-bold transition-all",
            running ? "border border-pastelPink/30 bg-pastelPink/10 text-pastelPink" : "bg-gradient-to-r from-pastelPink to-pastelLavender text-white"
          )}>
            {running ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Start</>}
          </button>
          <button onClick={reset} className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-inkDim transition-colors hover:text-ink">
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Duration config */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/5 p-2.5">
              {PHASE_ORDER.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <span className={cn("w-16 text-[10px] font-bold", PHASES[p].color)}>{PHASES[p].label}</span>
                  <div className="flex flex-1 items-center gap-1">
                    <button onClick={() => updateDuration(p, Math.max(15, customDurations[p] - 30))} className="h-5 w-5 rounded border border-white/10 bg-white/5 text-[10px] text-inkDim hover:text-ink">-</button>
                    <span className="flex-1 text-center font-mono text-[11px] text-ink">{formatTime(customDurations[p])}</span>
                    <button onClick={() => updateDuration(p, customDurations[p] + 30)} className="h-5 w-5 rounded border border-white/10 bg-white/5 text-[10px] text-inkDim hover:text-ink">+</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
