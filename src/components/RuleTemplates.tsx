import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Plus, Trash2, Check } from "lucide-react";
import type { RuleTemplate } from "@/vite-env";

export function RuleTemplates({
  templates,
  onSave,
  onDelete,
  onLoad,
  currentChecked,
}: {
  templates: RuleTemplate[];
  onSave: (t: RuleTemplate) => void;
  onDelete: (name: string) => void;
  onLoad: (rules: string[]) => void;
  currentChecked: Set<string>;
}) {
  const [showSave, setShowSave] = useState(false);
  const [templateName, setTemplateName] = useState("");

  function handleSave() {
    if (!templateName.trim()) return;
    onSave({ name: templateName.trim(), rules: [...currentChecked] });
    setTemplateName("");
    setShowSave(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bookmark className="h-3 w-3 text-pastelLavender" />
          <span className="font-mono text-[10px] tracking-wider text-inkDim">TEMPLATES</span>
        </div>
        <button
          onClick={() => setShowSave(!showSave)}
          className="flex items-center gap-1 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"
        >
          <Plus className="h-3 w-3" /> Save current
        </button>
      </div>

      {/* Save form */}
      <AnimatePresence>
        {showSave && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 rounded-xl border border-pastelPink/20 bg-pastelPink/5 p-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="Template name..."
                className="flex-1 rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
              />
              <button
                onClick={handleSave}
                disabled={!templateName.trim()}
                className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-pastelPink to-pastelLavender px-3 py-1.5 text-[12px] font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40"
              >
                <Check className="h-3 w-3" /> Save
              </button>
            </div>
            <div className="mt-1 text-[10px] text-inkDim/70">
              Saves {currentChecked.size} checked focus points
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template list */}
      {templates.length > 0 ? (
        <div className="space-y-1">
          {templates.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-ink">{t.name}</div>
                <div className="font-mono text-[10px] text-inkDim">
                  {t.rules.length} focus points
                </div>
              </div>
              <button
                onClick={() => onLoad(t.rules)}
                className="shrink-0 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"
              >
                Load
              </button>
              <button
                onClick={() => onDelete(t.name)}
                className="shrink-0 rounded-xl border border-white/10 px-1.5 py-1 text-inkDim/40 transition-colors hover:border-pink/30 hover:text-pink"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-[11px] text-inkDim/70">
          No templates saved yet
        </div>
      )}
    </div>
  );
}
