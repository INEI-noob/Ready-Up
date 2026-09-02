import { useState } from "react";
import { motion } from "framer-motion";
import { X, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchEntry } from "@/vite-env";

const CS_MAPS = [
  "Dust II", "Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Cache",
];

const MAP_OPTIONS = CS_MAPS.map((m) => ({ value: m.toLowerCase().replace(/\s+/g, "_"), label: m }));

type MatchType = "scrim" | "official" | "personal";

const TYPE_CONFIG: Record<MatchType, { label: string; active: string; icon: string }> = {
  scrim: { label: "Scrim", active: "border-pastelLavender bg-pastelLavender/10 text-pastelLavender", icon: "S" },
  official: { label: "Official", active: "border-pastelMint bg-pastelMint/10 text-okDark", icon: "O" },
  personal: { label: "Personal", active: "border-pastelPeach bg-pastelPeach/10 text-orange-400", icon: "P" },
};

export function AddMatch({ onAdd, onClose, defaultType, roster }: { onAdd: (m: Omit<MatchEntry, "id" | "date">) => void; onClose: () => void; defaultType?: MatchType; roster?: string[] }) {
  const [type, setType] = useState<MatchType>(defaultType || "scrim");
  const [opponent, setOpponent] = useState("");
  const [map, setMap] = useState(MAP_OPTIONS[0].value);
  const [result, setResult] = useState<"W" | "L" | "D">("W");
  const [scoreFor, setScoreFor] = useState("");
  const [scoreAgainst, setScoreAgainst] = useState("");
  const [teamPlayers, setTeamPlayers] = useState(roster ? roster.join(", ") : "");
  const [kd, setKd] = useState("");
  const [adr, setAdr] = useState("");
  const [hsPercent, setHsPercent] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!opponent.trim()) return;
    onAdd({
      type,
      opponent: opponent.trim(),
      map,
      result,
      scoreFor: Number(scoreFor) || 0,
      scoreAgainst: Number(scoreAgainst) || 0,
      teamPlayers: teamPlayers.split(",").map((s) => s.trim()).filter(Boolean),
      kd: Number(kd) || 0,
      adr: Number(adr) || 0,
      hsPercent: Number(hsPercent) || 0,
      note: note.trim() || undefined,
    });
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border border-pastelPink/20 bg-white p-5 shadow-pastel-lg"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-pastelLavender" />
            <h3 className="font-display text-lg font-bold text-ink">Log Match</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-inkDim hover:bg-pastelPink/10 hover:text-pink">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Type toggle */}
        <div className="mb-3 flex gap-2">
          {(["scrim", "official", "personal"] as MatchType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "flex-1 rounded-xl border px-3 py-1.5 text-[13px] font-bold capitalize transition-all",
                type === t ? TYPE_CONFIG[t].active : "border-white/40 bg-white/50 text-inkDim"
              )}
            >
              {TYPE_CONFIG[t].label}
            </button>
          ))}
        </div>

        {/* Opponent */}
        <label className="mb-2 block">
          <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">OPPONENT</span>
          <input
            type="text"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            placeholder="Team name"
            required
            className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none transition-colors placeholder:text-inkDim/40 focus:border-pastelPink/40"
          />
        </label>

        {/* Map + Result row */}
        <div className="mb-2 flex gap-2">
          <label className="flex-1">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">MAP</span>
            <select
              value={map}
              onChange={(e) => setMap(e.target.value)}
              className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none focus:border-pastelPink/40"
            >
              {MAP_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </label>
          <label className="w-24">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">RESULT</span>
            <select
              value={result}
              onChange={(e) => setResult(e.target.value as "W" | "L" | "D")}
              className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none focus:border-pastelPink/40"
            >
              <option value="W">W</option>
              <option value="L">L</option>
              <option value="D">D</option>
            </select>
          </label>
        </div>

        {/* Score */}
        <div className="mb-2 flex gap-2">
          <label className="flex-1">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">SCORE (US)</span>
            <input
              type="number"
              min="0"
              value={scoreFor}
              onChange={(e) => setScoreFor(e.target.value)}
              placeholder="16"
              className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">SCORE (THEM)</span>
            <input
              type="number"
              min="0"
              value={scoreAgainst}
              onChange={(e) => setScoreAgainst(e.target.value)}
              placeholder="10"
              className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
            />
          </label>
        </div>

        {/* Team */}
        <label className="mb-2 block">
          <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">TEAM PLAYERS (comma separated)</span>
          <input
            type="text"
            value={teamPlayers}
            onChange={(e) => setTeamPlayers(e.target.value)}
            placeholder="player1, player2, player3, player4, player5"
            className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
          />
        </label>

        {/* Stats row */}
        <div className="mb-2 flex gap-2">
          <label className="flex-1">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">K/D</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={kd}
              onChange={(e) => setKd(e.target.value)}
              placeholder="1.25"
              className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">ADR</span>
            <input
              type="number"
              step="0.1"
              min="0"
              value={adr}
              onChange={(e) => setAdr(e.target.value)}
              placeholder="82.5"
              className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">HS%</span>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={hsPercent}
              onChange={(e) => setHsPercent(e.target.value)}
              placeholder="45"
              className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
            />
          </label>
        </div>

        {/* Notes */}
        <label className="mb-4 block">
          <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">NOTES</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Optional notes..."
            className="w-full resize-none rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-pastelPink via-pastelLavender to-pastelBlue py-2.5 font-display text-sm font-bold text-white shadow-pastel transition-all hover:-translate-y-0.5 hover:shadow-pastel-lg"
        >
          Log Match
        </button>
      </motion.form>
    </motion.div>
  );
}
