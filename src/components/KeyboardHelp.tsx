import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { AccessibleModal } from "./AccessibleModal";

const SHORTCUTS = [
  { keys: "Space", desc: "Launch CS2" },
  { keys: "1–9", desc: "Toggle focus points" },
  { keys: "Esc", desc: "Close modals" },
];

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Keyboard shortcuts"
        className="fixed bottom-4 right-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[rgba(25,22,40,0.85)] text-inkDim shadow-pastel backdrop-blur-sm transition-all hover:border-pastelLavender/30 hover:text-pastelLavender"
      >
        <HelpCircle className="h-4 w-4" />
      </button>

      <AccessibleModal open={open} onClose={() => setOpen(false)} label="Keyboard Shortcuts" className="w-full max-w-xs rounded-3xl border border-pastelPink/20 bg-[rgba(25,22,40,0.95)] p-5 shadow-pastel-lg">
        <h3 className="mb-4 font-display text-lg font-bold text-ink">Keyboard Shortcuts</h3>
        <div className="space-y-2">
          {SHORTCUTS.map(({ keys, desc }) => (
            <div key={keys} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-[13px] text-ink">{desc}</span>
              <kbd className="rounded-lg border border-white/15 bg-white/10 px-2 py-0.5 font-mono text-[11px] font-bold text-inkDim">{keys}</kbd>
            </div>
          ))}
        </div>
      </AccessibleModal>
    </>
  );
}
