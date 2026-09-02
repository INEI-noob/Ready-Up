import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchEntry } from "@/vite-env";

const MAP_OPTIONS = [
  { value: "all", label: "All Maps" },
  { value: "dust_ii", label: "Dust II" },
  { value: "mirage", label: "Mirage" },
  { value: "inferno", label: "Inferno" },
  { value: "nuke", label: "Nuke" },
  { value: "ancient", label: "Ancient" },
  { value: "anubis", label: "Anubis" },
  { value: "cache", label: "Cache" },
];

const RESULT_OPTIONS = [
  { value: "all", label: "All" },
  { value: "W", label: "W" },
  { value: "L", label: "L" },
  { value: "D", label: "D" },
];

const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "7", label: "Last 7d" },
  { value: "30", label: "Last 30d" },
  { value: "90", label: "Last 90d" },
];

export type MatchFilters = {
  search: string;
  map: string;
  result: string;
  dateRange: string;
};

export function useMatchFilters(matches: MatchEntry[]) {
  const [filters, setFilters] = useState<MatchFilters>({
    search: "",
    map: "all",
    result: "all",
    dateRange: "all",
  });

  const filtered = useMemo(() => {
    let result = [...matches];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.opponent.toLowerCase().includes(q) ||
          m.teamPlayers.some((p) => p.toLowerCase().includes(q)) ||
          (m.note && m.note.toLowerCase().includes(q))
      );
    }

    if (filters.map !== "all") {
      result = result.filter((m) => m.map === filters.map);
    }

    if (filters.result !== "all") {
      result = result.filter((m) => m.result === filters.result);
    }

    if (filters.dateRange !== "all") {
      const days = Number(filters.dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const cutoffStr = cutoff.toISOString();
      result = result.filter((m) => m.date >= cutoffStr);
    }

    return result;
  }, [matches, filters]);

  const activeCount = (filters.search ? 1 : 0) +
    (filters.map !== "all" ? 1 : 0) +
    (filters.result !== "all" ? 1 : 0) +
    (filters.dateRange !== "all" ? 1 : 0);

  return { filters, setFilters, filtered, activeCount };
}

export function MatchFilterBar({ filters, setFilters, activeCount, onClear }: {
  filters: MatchFilters;
  setFilters: React.Dispatch<React.SetStateAction<MatchFilters>>;
  activeCount: number;
  onClear: () => void;
}) {
  return (
    <div className="mb-3 space-y-2">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-inkDim/40" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          placeholder="Search opponent, player, note..."
          className="w-full rounded-xl border border-white/40 bg-white/50 py-1.5 pl-8 pr-8 text-[12px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
        />
        {filters.search && (
          <button onClick={() => setFilters((f) => ({ ...f, search: "" }))} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-inkDim/40 hover:text-inkDim">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Filter pills row */}
      <div className="flex flex-wrap gap-1.5">
        {/* Map filter */}
        <select
          value={filters.map}
          onChange={(e) => setFilters((f) => ({ ...f, map: e.target.value }))}
          className={cn(
            "rounded-lg border px-2 py-1 text-[10px] font-bold outline-none transition-all",
            filters.map !== "all"
              ? "border-pastelPink/30 bg-pastelPink/10 text-pastelPink"
              : "border-white/40 bg-white/50 text-inkDim"
          )}
        >
          {MAP_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Result filter */}
        <div className="flex gap-0.5 rounded-lg border border-white/40 bg-white/50 p-0.5">
          {RESULT_OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setFilters((f) => ({ ...f, result: o.value }))}
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-bold transition-all",
                filters.result === o.value
                  ? o.value === "W" ? "bg-pastelMint/20 text-okDark"
                    : o.value === "L" ? "bg-pastelPink/20 text-pink"
                    : o.value === "D" ? "bg-inkDim/10 text-inkDim"
                    : "bg-pastelLavender/20 text-pastelLavender"
                  : "text-inkDim hover:text-ink"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Date range filter */}
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters((f) => ({ ...f, dateRange: e.target.value }))}
          className={cn(
            "rounded-lg border px-2 py-1 text-[10px] font-bold outline-none transition-all",
            filters.dateRange !== "all"
              ? "border-pastelBlue/30 bg-pastelBlue/10 text-pastelBlue"
              : "border-white/40 bg-white/50 text-inkDim"
          )}
        >
          {DATE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Clear all */}
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg border border-pastelPink/20 bg-pastelPink/5 px-2 py-1 text-[10px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"
          >
            <X className="h-2.5 w-2.5" />
            Clear ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}
