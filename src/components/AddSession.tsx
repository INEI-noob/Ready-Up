import { useState } from "react";
import { motion } from "framer-motion";
import { X, BarChart3 } from "lucide-react";
import type { SessionEntry } from "@/vite-env";

export function AddSession({ onAdd, onClose, rulesChecked }: {
  onAdd: (s: Omit<SessionEntry, "date">) => void;
  onClose: () => void;
  rulesChecked: number;
}) {
  const [kd, setKd] = useState("");
  const [adr, setAdr] = useState("");
  const [hsPercent, setHsPercent] = useState("");
  const [note, setNote] = useState("");
  const [mindsetNote, setMindsetNote] = useState("");

  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd({
      day: dayName,
      kd: Number(kd) || 0,
      adr: Number(adr) || 0,
      hsPercent: Number(hsPercent) || 0,
      rulesChecked,
      note: note.trim() || undefined,
      mindsetNote: mindsetNote.trim() || undefined,
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
        className="w-full max-w-sm rounded-3xl border border-pastelPink/20 bg-white p-5 shadow-pastel-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-pastelBlue" />
            <h3 className="font-display text-lg font-bold text-ink">Log Session</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-inkDim hover:bg-pastelPink/10 hover:text-pink">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3 rounded-xl border border-pastelBlue/20 bg-pastelBlue/5 px-3 py-2">
          <div className="font-mono text-[10px] tracking-wider text-inkDim">SESSION</div>
          <div className="text-[13px] font-bold text-ink">{dayName} &middot; {rulesChecked}/4 rules</div>
        </div>

        <div className="mb-3 flex gap-2">
          <label className="flex-1">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">K/D</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={kd}
              onChange={(e) => setKd(e.target.value)}
              placeholder="1.25"
              required
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
              required
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
              required
              className="w-full rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
            />
          </label>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">PRE-GAME MINDSET</span>
          <textarea
            value={mindsetNote}
            onChange={(e) => setMindsetNote(e.target.value)}
            rows={2}
            placeholder="What's your mindset going into this session?"
            className="w-full resize-none rounded-xl border border-pastelPink/20 bg-pastelPink/5 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">NOTES</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Optional..."
            className="w-full resize-none rounded-xl border border-white/40 bg-white/50 px-3 py-2 text-[13px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-pastelPink via-pastelLavender to-pastelBlue py-2.5 font-display text-sm font-bold text-white shadow-pastel transition-all hover:-translate-y-0.5 hover:shadow-pastel-lg"
        >
          Save Session
        </button>
      </motion.form>
    </motion.div>
  );
}
