import { useMemo } from "react";
import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RuleHistoryEntry } from "@/vite-env";

const DOT_COUNT = 14;

export function RuleTrends({ history }: { history: RuleHistoryEntry[] }) {
  const rows = useMemo(() => {
    const recent = (history || []).slice(-DOT_COUNT);
    // Collect all unique keys from history
    const allKeys = new Set<string>();
    for (const h of recent) {
      for (const k of h.checked) allKeys.add(k);
    }
    const keys = Array.from(allKeys).sort();
    return keys.map((key) => {
      const hits = recent.filter((h) => h.checked.includes(key)).length;
      const rate = recent.length > 0 ? (hits / recent.length) * 100 : 0;
      const dots = recent.map((h) => h.checked.includes(key));
      return { key, rate, dots, tracked: recent.length };
    });
  }, [history]);

  const hasData = rows.some((r) => r.tracked > 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <ListChecks className="h-3 w-3 text-pastelLavender" />
        <span className="font-mono text-[10px] tracking-wider text-inkDim">FOCUS ADHERENCE &middot; LAST {DOT_COUNT} DAYS</span>
      </div>

      {!hasData ? (
        <div className="rounded-xl border border-white/30 bg-white/20 p-3 text-center text-[11px] text-inkDim/70">
          Lock in a few days to see your trends
        </div>
      ) : (
        <div className="space-y-1.5">
          {rows.map(({ key, rate, dots, tracked }) => (
            <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[12px] font-bold text-ink capitalize">{key.replace(/-/g, " ")}</span>
                <span
                  className={cn(
                    "font-mono text-[11px] font-bold",
                    rate >= 80 ? "text-okDark" : rate >= 50 ? "text-pastelPeach" : "text-pink"
                  )}
                >
                  {tracked > 0 ? `${Math.round(rate)}%` : "—"}
                </span>
              </div>
              <div className="flex gap-[3px]">
                {Array.from({ length: DOT_COUNT }).map((_, i) => {
                  const dotIdx = i - (DOT_COUNT - dots.length);
                  const known = dotIdx >= 0;
                  const hit = known && dots[dotIdx];
                  return (
                    <div
                      key={i}
                      title={known ? (hit ? "checked" : "skipped") : "no data"}
                      className={cn(
                        "h-2.5 flex-1 rounded-[2px]",
                        !known ? "bg-white/5" : hit ? "bg-pastelLavender" : "bg-pink/25"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
