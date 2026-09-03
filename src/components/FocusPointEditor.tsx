import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical, Pencil, Check, X } from "lucide-react";
import type { FocusPoint } from "@/data/routine";

export function FocusPointEditor({
  points,
  onChange,
}: {
  points: FocusPoint[];
  onChange: (points: FocusPoint[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  function startEdit(point: FocusPoint) {
    setEditingId(point.id);
    setEditTitle(point.title);
    setEditDesc(point.desc);
    setAdding(false);
  }

  function saveEdit() {
    if (!editingId || !editTitle.trim()) return;
    onChange(
      points.map((p) =>
        p.id === editingId ? { ...p, title: editTitle.trim(), desc: editDesc.trim() } : p
      )
    );
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function deletePoint(id: string) {
    onChange(points.filter((p) => p.id !== id));
  }

  function addPoint() {
    if (!newTitle.trim()) return;
    const id = newTitle.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
    onChange([...points, { id, title: newTitle.trim(), desc: newDesc.trim() }]);
    setNewTitle("");
    setNewDesc("");
    setAdding(false);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...points];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index >= points.length - 1) return;
    const next = [...points];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {points.map((point, i) => {
        const isEditing = editingId === point.id;
        return (
          <div key={point.id} className="rounded-xl border border-white/10 bg-white/5 p-2.5">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[rgba(25,22,40,0.5)] px-2.5 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
                  placeholder="Focus point title..."
                  autoFocus
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-white/10 bg-[rgba(25,22,40,0.5)] px-2.5 py-1.5 text-[12px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
                  placeholder="Description..."
                />
                <div className="flex gap-1.5">
                  <button onClick={saveEdit} className="flex items-center gap-1 rounded-lg bg-pastelPink/20 px-2 py-1 text-[11px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/30">
                    <Check className="h-3 w-3" /> Save
                  </button>
                  <button onClick={cancelEdit} className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] text-inkDim transition-colors hover:text-ink">
                    <X className="h-3 w-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="text-inkDim/30 hover:text-inkDim disabled:opacity-20"><GripVertical className="h-3 w-3 -rotate-90" /></button>
                  <button onClick={() => moveDown(i)} disabled={i === points.length - 1} className="text-inkDim/30 hover:text-inkDim disabled:opacity-20"><GripVertical className="h-3 w-3 rotate-90" /></button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-ink">{point.title}</div>
                  <div className="text-[11px] text-inkDim/70 line-clamp-1">{point.desc}</div>
                </div>
                <button onClick={() => startEdit(point)} className="text-inkDim/30 hover:text-pastelPink transition-colors">
                  <Pencil className="h-3 w-3" />
                </button>
                <button onClick={() => deletePoint(point.id)} className="text-inkDim/30 hover:text-pink transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Add new */}
      <AnimatePresence>
        {adding ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-xl border border-pastelPink/20 bg-pastelPink/5 p-2.5 space-y-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[rgba(25,22,40,0.5)] px-2.5 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
                placeholder="Focus point title..."
                autoFocus
              />
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-lg border border-white/10 bg-[rgba(25,22,40,0.5)] px-2.5 py-1.5 text-[12px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
                placeholder="Description..."
              />
              <div className="flex gap-1.5">
                <button onClick={addPoint} disabled={!newTitle.trim()} className="flex items-center gap-1 rounded-lg bg-pastelPink/20 px-2 py-1 text-[11px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/30 disabled:opacity-40">
                  <Check className="h-3 w-3" /> Add
                </button>
                <button onClick={() => { setAdding(false); setNewTitle(""); setNewDesc(""); }} className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[11px] text-inkDim transition-colors hover:text-ink">
                  <X className="h-3 w-3" /> Cancel
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 py-2 text-[11px] text-inkDim/60 transition-colors hover:border-pastelPink/30 hover:text-pastelPink"
          >
            <Plus className="h-3 w-3" /> Add focus point
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}
