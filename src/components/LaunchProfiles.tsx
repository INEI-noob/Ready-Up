import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Plus, Trash2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { RULES } from "@/data/routine";
import type { LaunchProfile } from "@/vite-env";

const PROFILE_ICONS = ["\u{1F3AE}", "\u{1F3C6}", "\u{1F525}", "\u{2728}", "\u{1F4AA}", "\u{1F3AF}", "\u{1F6E1}\uFE0F", "\u{2694}\uFE0F"];

export function LaunchProfiles({
  profiles,
  activeProfile,
  onSave,
  onDelete,
  onActivate,
}: {
  profiles: LaunchProfile[];
  activeProfile: string | null;
  onSave: (p: LaunchProfile) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [selectedRules, setSelectedRules] = useState<Set<string>>(new Set(RULES.map((r) => r.key)));
  const [selectedIcon, setSelectedIcon] = useState(PROFILE_ICONS[0]);
  const [expanded, setExpanded] = useState<string | null>(null);

  function toggleRule(key: string) {
    setSelectedRules((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleSave() {
    if (!name.trim()) return;
    const profile: LaunchProfile = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      rules: [...selectedRules],
      icon: selectedIcon,
    };
    onSave(profile);
    setName("");
    setSelectedRules(new Set(RULES.map((r) => r.key)));
    setShowCreate(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Rocket className="h-3 w-3 text-pastelPink" />
          <span className="font-mono text-[10px] tracking-wider text-inkDim">LAUNCH PROFILES</span>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 rounded-full border border-pastelPink/20 px-2 py-0.5 text-[10px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"
        >
          <Plus className="h-3 w-3" /> New
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-pastelPink/20 bg-pastelPink/5 p-3 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  placeholder="Profile name..."
                  className="flex-1 rounded-lg border border-white/40 bg-white/50 px-2.5 py-1 text-[12px] text-ink outline-none placeholder:text-inkDim/40 focus:border-pastelPink/40"
                />
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-pastelPink to-pastelLavender px-3 py-1 text-[11px] font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40"
                >
                  <Check className="h-3 w-3" /> Save
                </button>
              </div>

              {/* Icon picker */}
              <div className="flex gap-1">
                {PROFILE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setSelectedIcon(icon)}
                    className={cn(
                      "h-7 w-7 rounded-lg text-sm transition-all",
                      selectedIcon === icon ? "bg-pastelPink/20 ring-1 ring-pastelPink" : "hover:bg-white/50"
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Rule picker */}
              <div className="space-y-1">
                {RULES.map((rule) => (
                  <button
                    key={rule.key}
                    onClick={() => toggleRule(rule.key)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-[11px] transition-all",
                      selectedRules.has(rule.key) ? "bg-pastelPink/10 text-ink" : "text-inkDim"
                    )}
                  >
                    <div className={cn(
                      "h-3.5 w-3.5 rounded border transition-all",
                      selectedRules.has(rule.key) ? "border-pastelPink bg-pastelPink" : "border-inkDim/30"
                    )}>
                      {selectedRules.has(rule.key) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    {rule.title}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile list */}
      {profiles.length > 0 ? (
        <div className="space-y-1">
          {profiles.map((p) => {
            const isActive = p.id === activeProfile;
            const isExpanded = expanded === p.id;
            return (
              <div key={p.id} className={cn("rounded-xl border transition-all", isActive ? "border-pastelPink/30 bg-pastelPink/10" : "border-white/40 bg-white/40")}>
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="text-base">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-ink">{p.name}</div>
                    <div className="font-mono text-[9px] text-inkDim">{p.rules.length} rules</div>
                  </div>
                  <button
                    onClick={() => onActivate(p.id)}
                    className={cn(
                      "rounded-lg px-2 py-1 text-[10px] font-bold transition-all",
                      isActive ? "bg-pastelMint/20 text-okDark" : "border border-pastelPink/20 text-pastelPink hover:bg-pastelPink/10"
                    )}
                  >
                    {isActive ? "Active" : "Use"}
                  </button>
                  <button onClick={() => setExpanded(isExpanded ? null : p.id)} className="text-inkDim/40 hover:text-inkDim">
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="border-t border-white/30 px-3 py-2">
                        <div className="mb-1 font-mono text-[9px] text-inkDim">RULES: {p.rules.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")}</div>
                        <button onClick={() => onDelete(p.id)} className="flex items-center gap-1 text-[10px] text-inkDim/40 hover:text-pink transition-colors">
                          <Trash2 className="h-2.5 w-2.5" /> Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-white/30 bg-white/20 p-3 text-center text-[11px] text-inkDim/50">
          No profiles yet — create one to quick-switch rule sets
        </div>
      )}
    </div>
  );
}
