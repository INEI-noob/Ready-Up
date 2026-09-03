import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Trash2, ChevronDown, ChevronUp, ImagePlus, X } from "lucide-react";
import type { LineupNote } from "@/vite-env";

const CS_MAPS = ["Dust II", "Mirage", "Inferno", "Nuke", "Ancient", "Anubis", "Cache"];
const MAP_OPTIONS = CS_MAPS.map((m) => ({ value: m.toLowerCase().replace(/\s+/g, "_"), label: m }));
const MAP_DISPLAY: Record<string, string> = Object.fromEntries(MAP_OPTIONS.map((o) => [o.value, o.label]));

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function LineupNotebook({
  lineups,
  onSave,
  onDelete,
}: {
  lineups: LineupNote[];
  onSave: (l: LineupNote) => void;
  onDelete: (id: string) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [map, setMap] = useState(MAP_OPTIONS[0].value);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [expandedMap, setExpandedMap] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const grouped = useMemo(() => {
    const byMap: Record<string, LineupNote[]> = {};
    for (const l of lineups || []) {
      if (!byMap[l.map]) byMap[l.map] = [];
      byMap[l.map].push(l);
    }
    return Object.entries(byMap).sort((a, b) => b[1].length - a[1].length);
  }, [lineups]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!title.trim()) return;
    const entry: LineupNote = {
      id: generateId(),
      map,
      title: title.trim(),
      note: note.trim(),
      image,
      createdAt: new Date().toISOString(),
    };
    onSave(entry);
    setTitle("");
    setNote("");
    setImage(undefined);
    setShowCreate(false);
    setExpandedMap(map);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3 w-3 text-pastelLavender" />
          <span className="font-mono text-[10px] tracking-wider text-inkDim">LINEUP NOTEBOOK</span>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"
        >
          <Plus className="h-3 w-3" /> New
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="space-y-2 rounded-xl border border-pastelLavender/20 bg-pastelLavender/5 p-3">
              <select
                value={map}
                onChange={(e) => setMap(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none focus:border-pastelLavender/40 focus:ring-2 focus:ring-pastelPink/20"
              >
                {MAP_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. B-site pop flash from CT spawn"
                className="w-full rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-2 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelLavender/40 focus:ring-2 focus:ring-pastelPink/20"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Throw line, jump/crouch notes, timing..."
                rows={2}
                className="w-full resize-none rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelLavender/40 focus:ring-2 focus:ring-pastelPink/20"
              />

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

              {image ? (
                <div className="relative">
                  <img src={image} alt="Lineup reference" className="max-h-32 w-full rounded-lg object-cover" />
                  <button
                    onClick={() => setImage(undefined)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 py-2 text-[11px] font-bold text-inkDim transition-colors hover:border-pastelLavender/40 hover:text-ink"
                >
                  <ImagePlus className="h-3.5 w-3.5" /> Attach screenshot (optional)
                </button>
              )}

              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={!title.trim()} className="flex-1 rounded-xl bg-gradient-to-r from-pastelPink to-pastelLavender py-2 text-[12px] font-bold text-white disabled:opacity-40">
                  Save lineup
                </button>
                <button onClick={() => setShowCreate(false)} className="rounded-xl border border-white/10 px-4 py-2 text-[12px] font-bold text-inkDim hover:text-ink">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {grouped.length === 0 ? (
        <div className="rounded-xl border border-white/30 bg-white/20 p-3 text-center text-[11px] text-inkDim/70">
          No lineups saved yet
        </div>
      ) : (
        <div className="space-y-1.5">
          {grouped.map(([mapKey, notes]) => {
            const isExpanded = expandedMap === mapKey;
            return (
              <div key={mapKey} className="rounded-xl border border-white/10 bg-white/5">
                <button
                  onClick={() => setExpandedMap(isExpanded ? null : mapKey)}
                  className="flex w-full items-center justify-between px-3 py-2"
                >
                  <span className="text-[12px] font-bold text-ink">{MAP_DISPLAY[mapKey] || mapKey}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-pastelLavender/15 px-1.5 py-0.5 font-mono text-[9px] text-pastelLavender">{notes.length}</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3 text-inkDim" /> : <ChevronDown className="h-3 w-3 text-inkDim" />}
                  </div>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="space-y-1.5 px-2 pb-2">
                        {notes.map((l) => (
                          <div key={l.id} className="rounded-lg border border-white/10 bg-[rgba(25,22,40,0.4)] p-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-[12px] font-bold text-ink">{l.title}</div>
                              <button onClick={() => onDelete(l.id)} className="shrink-0 text-inkDim/40 hover:text-pink">
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            {l.note && <div className="mt-0.5 text-[11px] text-inkDim/80">{l.note}</div>}
                            {l.image && <img src={l.image} alt={l.title} className="mt-1.5 max-h-40 w-full rounded-lg object-cover" />}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
