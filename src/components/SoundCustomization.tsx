import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SoundId } from "@/vite-env";

const SOUNDS: { id: SoundId; label: string; freq: number; type: OscillatorType }[] = [
  { id: "chime", label: "Chime", freq: 800, type: "sine" },
  { id: "pop", label: "Pop", freq: 600, type: "triangle" },
  { id: "ding", label: "Ding", freq: 1200, type: "sine" },
  { id: "bell", label: "Bell", freq: 1000, type: "sine" },
  { id: "none", label: "Silent", freq: 0, type: "sine" },
];

function playPreview(soundId: SoundId) {
  if (soundId === "none") return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const sound = SOUNDS.find((s) => s.id === soundId);
    if (!sound) return;

    osc.type = sound.type;
    osc.frequency.setValueAtTime(sound.freq, ctx.currentTime);

    if (soundId === "chime") {
      osc.frequency.exponentialRampToValueAtTime(sound.freq * 1.5, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(sound.freq, ctx.currentTime + 0.2);
    } else if (soundId === "bell") {
      osc.frequency.exponentialRampToValueAtTime(sound.freq * 0.8, ctx.currentTime + 0.3);
    }

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch { /* silent fail */ }
}

export function SoundCustomization({ soundId, onChange }: {
  soundId: SoundId;
  onChange: (id: SoundId) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Volume2 className="h-3 w-3 text-pastelBlue" />
        <span className="font-mono text-[10px] tracking-wider text-inkDim">SOUND</span>
      </div>
      <div className="flex gap-1.5">
        {SOUNDS.map((s) => (
          <button
            key={s.id}
            onClick={() => { onChange(s.id); playPreview(s.id); }}
            aria-pressed={soundId === s.id}
            className={cn(
              "flex-1 rounded-xl border px-2 py-1.5 text-[11px] font-bold transition-all",
              soundId === s.id
                ? "border-pastelBlue/30 bg-pastelBlue/15 text-pastelBlue"
                : "border-white/10 bg-white/5 text-inkDim hover:text-ink"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
