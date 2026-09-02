export type DayFocus = { title: string; desc: string };

export const ROUTINE: Record<string, DayFocus> = {
  Monday: {
    title: "TEAM PRACTICE",
    desc: "Focus on clear comms and coordinated plays. Call utility for your teammates.",
  },
  Tuesday: {
    title: "MECHANICS & AIM",
    desc: "Warm up your aim, practice crosshair placement, and work on movement.",
  },
  Wednesday: {
    title: "APPLICATION & TRADING",
    desc: "Focus on trading kills, flashing for teammates, and map control.",
  },
  Thursday: {
    title: "TEAM PRACTICE",
    desc: "Run set strategies and practice executes. Ask for feedback post-practice.",
  },
  Friday: {
    title: "VOD REVIEW & RESET",
    desc: "Review your gameplay, identify mistakes, and do light practice only.",
  },
  Saturday: {
    title: "COMPETITIVE GRIND",
    desc: "Full integration of all Golden Rules. Play your best, stay focused.",
  },
  Sunday: {
    title: "ACTIVE REST",
    desc: "Light practice only. Watch pro matches, stay hydrated, recharge.",
  },
};

export const FALLBACK_FOCUS: DayFocus = {
  title: "ACTIVE REST",
  desc: "Light mechanics only.",
};

export type Rule = { key: string; title: string; desc: string };

export const RULES: Rule[] = [
  { key: "comms", title: "Clear Comms", desc: "Keep communication concise and actionable." },
  { key: "positioning", title: "Smart Positioning", desc: "Don't repeat the same angle twice in a row." },
  { key: "utility", title: "Utility Usage", desc: "Use at least one piece of utility per round." },
  { key: "mindset", title: "Stay Calm", desc: "Take a deep breath between rounds. Reset mentally." },
];

export type MascotState = { caption: string; mouth: string };

export const MASCOT_STATES: Record<number, MascotState> = {
  0: { caption: "still waking up...", mouth: "M 42 72 Q 50 68 58 72" },
  1: { caption: "getting there...", mouth: "M 42 71 Q 50 73 58 71" },
  2: { caption: "warming up!", mouth: "M 42 70 Q 50 75 58 70" },
  3: { caption: "almost locked in", mouth: "M 40 69 Q 50 77 60 69" },
  4: { caption: "LOCKED IN. let's go!!", mouth: "M 39 68 Q 50 80 61 68" },
};
