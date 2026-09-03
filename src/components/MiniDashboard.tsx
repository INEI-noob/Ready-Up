import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Sparkline } from "@/components/Sparkline";
import { ROUTINE, FALLBACK_FOCUS } from "@/data/routine";
import type { ReadyUpState } from "@/vite-env";

export function MiniDashboard({ state, checkedCount, focusPointCount, onExpand }: {
  state: ReadyUpState;
  checkedCount: number;
  focusPointCount: number;
  onExpand: () => void;
}) {
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const focus = ROUTINE[dayName] ?? FALLBACK_FOCUS;
  const sessions = state.sessions || [];
  const latestSessions = sessions.slice(-8);
  const kdTrend = latestSessions.map((s) => s.kd);

  const avgKd = sessions.length > 0
    ? (sessions.slice(-5).reduce((a, s) => a + s.kd, 0) / Math.min(sessions.length, 5)).toFixed(2)
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-pastelPink/20 bg-[rgba(25,22,40,0.75)] p-4 shadow-pastel backdrop-blur-sm"
    >
      {/* Top row: streak + expand */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pastelPeach to-pastelPink/50">
            <Flame className="h-4 w-4 text-white" fill="currentColor" />
          </div>
          <div>
            <div className="text-lg font-extrabold leading-none text-ink">{state.streak}</div>
            <div className="font-mono text-[9px] tracking-wider text-inkDim">STREAK</div>
          </div>
        </div>
        <button
          onClick={onExpand}
          className="rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"
        >
          Full view
        </button>
      </div>

      {/* Focus */}
      <div className="mb-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <div className="font-mono text-[9px] tracking-wider text-inkDim">TODAY</div>
        <div className="text-[13px] font-bold text-gradient-blue">{focus.title}</div>
      </div>

      {/* Focus points dots */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          {Array.from({ length: focusPointCount }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                i < checkedCount
                  ? "bg-gradient-to-br from-pastelPink to-pastelLavender shadow-[0_0_6px_rgba(212,165,255,0.4)]"
                  : "bg-pastelPink/20"
              }`}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] text-inkDim">{checkedCount}/{focusPointCount}</span>
        <div className="ml-auto flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-pastelPink/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pastelPink to-pastelLavender"
              animate={{ width: `${focusPointCount > 0 ? (checkedCount / focusPointCount) * 100 : 0}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-xl border border-white/30 bg-white/30 px-2 py-1.5 text-center">
          <div className="text-[14px] font-bold text-ink">{avgKd}</div>
          <div className="font-mono text-[9px] tracking-wider text-inkDim">AVG K/D</div>
        </div>
        <div className="flex-1 rounded-xl border border-white/30 bg-white/30 px-2 py-1.5 text-center">
          <div className="text-[14px] font-bold text-ink">{sessions.length}</div>
          <div className="font-mono text-[9px] tracking-wider text-inkDim">SESSIONS</div>
        </div>
        <div className="flex-1 rounded-xl border border-white/30 bg-white/30 px-2 py-1.5 text-center">
          <div className="text-[14px] font-bold text-ink">{state.matches?.length || 0}</div>
          <div className="font-mono text-[9px] tracking-wider text-inkDim">MATCHES</div>
        </div>
      </div>

      {/* Sparkline */}
      {kdTrend.length >= 2 && (
        <div className="mt-2 rounded-xl border border-white/30 bg-white/30 px-2 py-1.5">
          <div className="mb-0.5 font-mono text-[9px] tracking-wider text-inkDim">K/D TREND</div>
          <Sparkline data={kdTrend} color="#FF8AC0" height={20} />
        </div>
      )}
    </motion.div>
  );
}
