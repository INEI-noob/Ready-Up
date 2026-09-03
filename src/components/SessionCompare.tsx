import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/Sparkline";
import type { SessionEntry } from "@/vite-env";

function getWeekSessions(sessions: SessionEntry[], weekOffset: number): SessionEntry[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay() + 1 - weekOffset * 7);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return sessions.filter((s) => {
    const d = new Date(s.date);
    return d >= start && d < end;
  });
}

function avg(vals: number[]) {
  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function Delta({ value, lower }: { value: number; lower?: boolean }) {
  const improved = lower ? value < 0 : value > 0;
  const worsened = lower ? value > 0 : value < 0;

  if (Math.abs(value) < 0.01) {
    return (
      <span className="flex items-center gap-0.5 text-[11px] text-inkDim">
        <Minus className="h-3 w-3" /> 0
      </span>
    );
  }

  return (
    <span className={cn("flex items-center gap-0.5 text-[11px] font-bold", improved ? "text-okDark" : worsened ? "text-pink" : "text-inkDim")}>
      {improved ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {value > 0 ? "+" : ""}{value.toFixed(2)}
    </span>
  );
}

function CompareRow({ label, thisWeek, lastWeek, decimals = 2, lower = false }: {
  label: string;
  thisWeek: number;
  lastWeek: number;
  decimals?: number;
  lower?: boolean;
}) {
  const delta = thisWeek - lastWeek;

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/30 bg-white/30 px-3 py-2">
      <div className="text-[12px] font-bold text-ink">{label}</div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-[12px] font-bold text-ink">{thisWeek.toFixed(decimals)}</div>
          <div className="font-mono text-[10px] text-inkDim">THIS WEEK</div>
        </div>
        <div className="text-right">
          <div className="text-[12px] font-bold text-inkDim">{lastWeek.toFixed(decimals)}</div>
          <div className="font-mono text-[10px] text-inkDim">LAST WEEK</div>
        </div>
        <div className="w-14 text-right">
          <Delta value={delta} lower={lower} />
        </div>
      </div>
    </div>
  );
}

export function SessionCompare({ sessions }: { sessions: SessionEntry[] }) {
  const thisWeek = useMemo(() => getWeekSessions(sessions, 0), [sessions]);
  const lastWeek = useMemo(() => getWeekSessions(sessions, 1), [sessions]);

  const thisAvg = useMemo(() => ({
    kd: avg(thisWeek.map((s) => s.kd)),
    adr: avg(thisWeek.map((s) => s.adr)),
    hs: avg(thisWeek.map((s) => s.hsPercent)),
    rules: avg(thisWeek.map((s) => s.rulesChecked)),
  }), [thisWeek]);

  const lastAvg = useMemo(() => ({
    kd: avg(lastWeek.map((s) => s.kd)),
    adr: avg(lastWeek.map((s) => s.adr)),
    hs: avg(lastWeek.map((s) => s.hsPercent)),
    rules: avg(lastWeek.map((s) => s.rulesChecked)),
  }), [lastWeek]);

  if (sessions.length < 2) {
    return (
      <div className="rounded-xl border border-white/40 bg-white/30 p-4 text-center text-[12px] text-inkDim/80">
        Need at least 2 sessions to compare
      </div>
    );
  }

  if (thisWeek.length === 0 && lastWeek.length === 0) {
    return (
      <div className="rounded-xl border border-white/40 bg-white/30 p-4 text-center text-[12px] text-inkDim/80">
        No sessions this week or last week
      </div>
    );
  }

  const kdTrend = thisWeek.map((s) => s.kd);
  const adrTrend = thisWeek.map((s) => s.adr);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <div className="mb-1 font-mono text-[10px] tracking-wider text-inkDim">
        WEEK VS WEEK
      </div>

      {thisWeek.length > 1 && (
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-2">
            <div className="mb-0.5 font-mono text-[9px] tracking-wider text-inkDim">K/D TREND</div>
            <Sparkline data={kdTrend} color="#FF8AC0" height={24} />
          </div>
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-2">
            <div className="mb-0.5 font-mono text-[9px] tracking-wider text-inkDim">ADR TREND</div>
            <Sparkline data={adrTrend} color="#7FCBF5" height={24} />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <CompareRow label="K/D" thisWeek={thisAvg.kd} lastWeek={lastAvg.kd} />
        <CompareRow label="ADR" thisWeek={thisAvg.adr} lastWeek={lastAvg.adr} decimals={1} />
        <CompareRow label="HS%" thisWeek={thisAvg.hs} lastWeek={lastAvg.hs} decimals={0} />
        <CompareRow label="RULES AVG" thisWeek={thisAvg.rules} lastWeek={lastAvg.rules} decimals={1} />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 rounded-xl border border-white/30 bg-white/30 p-2 text-center">
          <div className="text-[16px] font-bold text-ink">{thisWeek.length}</div>
          <div className="font-mono text-[9px] tracking-wider text-inkDim">SESSIONS THIS WEEK</div>
        </div>
        <div className="flex-1 rounded-xl border border-white/30 bg-white/30 p-2 text-center">
          <div className="text-[16px] font-bold text-inkDim">{lastWeek.length}</div>
          <div className="font-mono text-[9px] tracking-wider text-inkDim">SESSIONS LAST WEEK</div>
        </div>
      </div>
    </motion.div>
  );
}
