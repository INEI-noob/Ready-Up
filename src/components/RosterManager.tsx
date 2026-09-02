import { useState } from "react";
import { motion } from "framer-motion";
import { X, Users, Plus, XCircle } from "lucide-react";

export function RosterManager({ roster, onSave, onClose }: {
  roster: string[];
  onSave: (roster: string[]) => void;
  onClose: () => void;
}) {
  const [players, setPlayers] = useState<string[]>(roster.length > 0 ? roster : ["", "", "", "", ""]);
  const [newPlayer, setNewPlayer] = useState("");

  function updatePlayer(index: number, value: string) {
    const next = [...players];
    next[index] = value;
    setPlayers(next);
  }

  function addPlayer() {
    if (newPlayer.trim() && players.length < 10) {
      setPlayers([...players, newPlayer.trim()]);
      setNewPlayer("");
    }
  }

  function removePlayer(index: number) {
    setPlayers(players.filter((_, i) => i !== index));
  }

  function handleSave() {
    onSave(players.filter(Boolean));
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
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-pastelPink/20 bg-[rgba(25,22,40,0.95)] p-5 shadow-pastel-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-pastelLavender" />
            <h3 className="font-display text-lg font-bold text-ink">Team Roster</h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-inkDim hover:bg-pastelPink/10 hover:text-pink">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-3 text-[12px] text-inkDim">
          Save your teammates once — they'll auto-fill when logging matches.
        </p>

        <div className="mb-3 space-y-1.5">
          {players.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-5 text-center font-mono text-[10px] text-inkDim">{i + 1}</span>
              <input
                type="text"
                value={p}
                onChange={(e) => updatePlayer(i, e.target.value)}
                placeholder={`Player ${i + 1}`}
                className="flex-1 rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
              />
              {p && (
                <button onClick={() => removePlayer(i)} className="text-inkDim/40 hover:text-pink">
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {players.length < 10 && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              placeholder="Add player..."
              className="flex-1 rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
            />
            <button
              onClick={addPlayer}
              className="flex items-center gap-1 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full rounded-full bg-gradient-to-r from-pastelPink via-pastelLavender to-pastelBlue py-2.5 font-display text-sm font-bold text-white shadow-pastel transition-all hover:-translate-y-0.5 hover:shadow-pastel-lg"
        >
          Save Roster
        </button>
      </motion.div>
    </motion.div>
  );
}
