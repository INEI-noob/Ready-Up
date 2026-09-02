export type DayFocus = { title: string; desc: string };

export const ROUTINE: Record<string, DayFocus> = {
  Monday: {
    title: "TEAM PRACTICE",
    desc: "Focus on the 'Contact' trigger word. Call exactly 1 utility for your entry fragger.",
  },
  Tuesday: {
    title: "MECHANICS & AWP",
    desc: "Micro-correction aim, 3-second AWP reset, 15s knife rule.",
  },
  Wednesday: {
    title: "APPLICATION & TRADING",
    desc: "Dead Man's Protocol — info immediately on death. Pop-flash lineups.",
  },
  Thursday: {
    title: "TEAM PRACTICE",
    desc: "AWP/rifle decision making. Ask your IGL for 1 piece of comm feedback post-practice.",
  },
  Friday: {
    title: "VOD REVIEW & RESET",
    desc: "Watch your own deaths and round starts. Light aim only. No Premier.",
  },
  Saturday: {
    title: "COMPETITIVE GRIND",
    desc: "Full integration of all Golden Rules. Max 3 matches. Stop if tilted.",
  },
  Sunday: {
    title: "ACTIVE REST",
    desc: "10 minutes of light aim. Watch pro VODs. No Premier.",
  },
};

export const FALLBACK_FOCUS: DayFocus = {
  title: "ACTIVE REST",
  desc: "Light mechanics only.",
};

export type Rule = { key: string; title: string; desc: string };

export const RULES: Rule[] = [
  { key: "trigger", title: "Trigger word", desc: "Say CONTACT or INFO before any curse word." },
  { key: "knife", title: "Knife rule", desc: "Knife goes away 15 seconds into the round. Period." },
  { key: "awp", title: "AWP reset", desc: "Un-scope and check the minimap every 3 seconds." },
  { key: "grip", title: "Grip check", desc: "Relax your hand — tension kills micro-adjustments." },
];

export type MascotState = { caption: string; mouth: string };

export const MASCOT_STATES: Record<number, MascotState> = {
  0: { caption: "still waking up...", mouth: "M 42 72 Q 50 68 58 72" },
  1: { caption: "getting there...", mouth: "M 42 71 Q 50 73 58 71" },
  2: { caption: "warming up!", mouth: "M 42 70 Q 50 75 58 70" },
  3: { caption: "almost locked in", mouth: "M 40 69 Q 50 77 60 69" },
  4: { caption: "LOCKED IN. let's go!!", mouth: "M 39 68 Q 50 80 61 68" },
};
