import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Trophy,
  Flame,
  Sparkles,
  Dumbbell,
  Crosshair,
  Shield,
  Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LaunchProfile } from "@/vite-env";

const PROFILE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  gamepad: Gamepad2,
  trophy: Trophy,
  flame: Flame,
  sparkles: Sparkles,
  dumbbell: Dumbbell,
  crosshair: Crosshair,
  shield: Shield,
  swords: Swords,
};

const PROFILE_ICON_KEYS = Object.keys(PROFILE_ICON_MAP);

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
  const [selectedIcon, setSelectedIcon] = useState(PROFILE_ICON_KEYS[0]);
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      icon: selectedIcon,
      rules: [],
    });
    setName("");
    setShowCreate(false);
  }

  function getIconComponent(iconKey: string) {
    return PROFILE_ICON_MAP[iconKey] || Gamepad2;
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => setShowCreate(!showCreate)}
        className="flex w-full items-center justify-between rounded-xl border border-pastelPink/20 bg-pastelPink/10 px-3 py-2 transition-all hover:bg-pastelPink/15"
      >
        <div className="flex items-center gap-2">
          <Rocket className="h-3.5 w-3.5 text-pastelPink" />
          <span className="text-[12px] font-bold text-ink">Launch Profiles</span>
          <span className="rounded-full bg-pastelPink/20 px-1.5 py-0.5 font-mono text-[9px] text-pastelPink">
            {profiles.length}
          </span>
        </div>
        {showCreate ? <ChevronUp className="h-3 w-3 text-inkDim" /> : <ChevronDown className="h-3 w-3 text-inkDim" />}
      </button>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-2.5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Profile name"
                className="w-full rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
              />

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-pastelPink to-pastelLavender px-3 py-1.5 text-[12px] font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40"
                >
                  <Check className="h-3 w-3" /> Save
                </button>
              </div>

              {/* Icon picker */}
              <div className="flex gap-1">
                {PROFILE_ICON_KEYS.map((key) => {
                  const Icon = PROFILE_ICON_MAP[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedIcon(key)}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                        selectedIcon === key ? "bg-pastelPink/20 ring-1 ring-pastelPink" : "hover:bg-white/10"
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5", selectedIcon === key ? "text-pastelPink" : "text-inkDim")} />
                    </button>
                  );
                })}
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
            const Icon = getIconComponent(p.icon);
            return (
              <div key={p.id} className={cn("rounded-xl border transition-all", isActive ? "border-pastelPink/30 bg-pastelPink/10" : "border-white/10 bg-white/5")}>
                <div className="flex items-center gap-2 px-3 py-2">
                  <Icon className={cn("h-4 w-4", isActive ? "text-pastelPink" : "text-inkDim")} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-ink">{p.name}</div>
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
                   <button onClick={() => setExpanded(isExpanded ? null : p.id)} aria-expanded={isExpanded} className="text-inkDim/40 hover:text-inkDim">
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="border-t border-white/10 px-3 py-2">
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
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-[11px] text-inkDim/70">
          No profiles yet — create one to quick-switch settings
        </div>
      )}
    </div>
  );
}
