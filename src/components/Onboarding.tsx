import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Swords, Heart, X, Plus } from "lucide-react";
import { getTodayWarmupItems } from "@/data/routine";

const STEPS = ["welcome", "roster", "focus", "done"] as const;
type Step = (typeof STEPS)[number];

export function Onboarding({ onComplete }: { onComplete: (roster: string[]) => void }) {
  const [step, setStep] = useState<Step>("welcome");
  const [roster, setRoster] = useState(["", "", "", "", ""]);
  const [newPlayer, setNewPlayer] = useState("");

  const stepIndex = STEPS.indexOf(step);

  function next() {
    const nextIdx = Math.min(stepIndex + 1, STEPS.length - 1);
    setStep(STEPS[nextIdx]);
  }

  function prev() {
    const prevIdx = Math.max(stepIndex - 1, 0);
    setStep(STEPS[prevIdx]);
  }

  function updatePlayer(i: number, val: string) {
    const next = [...roster];
    next[i] = val;
    setRoster(next);
  }

  function addPlayer() {
    if (newPlayer.trim() && roster.length < 10) {
      setRoster([...roster, newPlayer.trim()]);
      setNewPlayer("");
    }
  }

  function removePlayer(i: number) {
    setRoster(roster.filter((_, idx) => idx !== i));
  }

  function handleFinish() {
    onComplete(roster.filter(Boolean));
  }

  const canProceed = step === "roster" ? roster.filter(Boolean).length >= 1 : true;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-pastelPink/20 bg-[rgba(25,22,40,0.95)] p-6 shadow-pastel-lg"
      >
        {/* Progress dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < stepIndex ? "w-2 bg-pastelMint" : i === stepIndex ? "w-6 bg-gradient-to-r from-pastelPink to-pastelLavender" : "w-2 bg-pastelPink/20"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === "welcome" && (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <Heart className="h-12 w-12 text-pastelPink" fill="currentColor" />
                </div>
                <h2 className="mb-2 font-display text-2xl font-bold text-gradient-pink">Welcome to Ready Up</h2>
                <p className="mb-1 text-[14px] text-inkSoft">Your pre-game ritual launcher for CS2.</p>
                <p className="text-[13px] text-inkDim">Let's get you set up in 30 seconds.</p>
              </div>
            )}

            {step === "roster" && (
              <div>
                <h2 className="mb-1 font-display text-lg font-bold text-ink">Your Team</h2>
                <p className="mb-3 text-[12px] text-inkDim">Add your teammates — they'll auto-fill when logging matches.</p>
                <div className="mb-3 space-y-1.5">
                  {roster.map((p, i) => (
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
                        <button onClick={() => removePlayer(i)} className="text-inkDim/40 hover:text-pink transition-colors"><X className="h-3.5 w-3.5" /></button>
                      )}
                    </div>
                  ))}
                </div>
                {roster.length < 10 && (
                  <div className="mb-2 flex gap-2">
                    <input
                      type="text"
                      value={newPlayer}
                      onChange={(e) => setNewPlayer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                      placeholder="Add player..."
                      className="flex-1 rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
                    />
                    <button onClick={addPlayer} className="flex items-center gap-1 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"><Plus className="h-3 w-3" /> Add</button>
                  </div>
                )}
                <p className="text-[11px] text-inkDim/70">You can skip this and add later from the Roster button in Stats.</p>
              </div>
            )}

            {step === "focus" && (
              <div>
                <h2 className="mb-1 font-display text-lg font-bold text-ink">Today's Warmup</h2>
                <p className="mb-3 text-[12px] text-inkDim">Your warmup routine changes based on the day of the week.</p>
                <div className="space-y-2">
                  {getTodayWarmupItems().map((item, i) => (
                    <div key={item.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pastelPink/20 to-pastelLavender/20 font-display text-xs font-bold text-pastelPink">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-ink">{item.title}</div>
                        <div className="text-[12px] text-inkSoft">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === "done" && (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pastelMint to-pastelBlue">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="mb-2 font-display text-2xl font-bold text-gradient-pink">You're all set!</h2>
                <p className="text-[14px] text-inkSoft">Check off your warmup, keep your streak, and launch CS2.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {stepIndex > 0 && step !== "done" ? (
            <button onClick={prev} className="flex items-center gap-1 text-[12px] font-bold text-inkDim transition-colors hover:text-ink">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step === "done" ? (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pastelPink via-pastelLavender to-pastelBlue px-5 py-2.5 font-display text-sm font-bold text-white shadow-pastel transition-all hover:-translate-y-0.5 hover:shadow-pastel-lg"
            >
              <Swords className="h-4 w-4" /> Let's go
            </button>
          ) : (
            <button
              onClick={next}
              disabled={!canProceed}
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-pastelPink via-pastelLavender to-pastelBlue px-5 py-2 font-display text-sm font-bold text-white shadow-pastel transition-all hover:-translate-y-0.5 hover:shadow-pastel-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
