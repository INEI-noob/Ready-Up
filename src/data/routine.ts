export type DayFocus = { title: string; desc: string };

export const ROUTINE: Record<string, DayFocus> = {
  Monday: {
    title: "COMMUNICATION PRIMING",
    desc: "10 mins Deathmatch. Every time you get a kill or die, say a clear, 2-word callout out loud. Train your mouth to work while your hands are busy.",
  },
  Tuesday: {
    title: "ANTI-TENSION & RESET",
    desc: "5 mins Aim Botz (tiny micro-flicks only) + 5 mins empty server AWP. Practice the 3-Second AWP Reset — scope in, hold for 3 seconds, un-scope, look at the floor, re-scope.",
  },
  Wednesday: {
    title: "THE SUPPORT MINDSET",
    desc: "10 mins Deathmatch (Rifle only). The Trade Drill — do not peek first. Wait for an enemy to shoot at someone else, then swing and get the trade. Practice perfect counter-strafing.",
  },
  Thursday: {
    title: "UTILITY MUSCLE MEMORY",
    desc: "10 mins in an empty competitive server. Throw 5 smokes and 5 pop-flashes for the specific map you are playing in team practice tonight.",
  },
  Friday: {
    title: "LOW-STRESS TRACKING",
    desc: "10 mins of a tracking-focused workshop map. Zero flicking. Just keep your crosshair glued to the bot's head as it moves. This resets your nervous system.",
  },
  Saturday: {
    title: "FULL INTEGRATION",
    desc: "5 mins Aim Botz + 5 mins Deathmatch. Enforce the 15-Second Knife Rule strictly. If you catch yourself with a knife out past 15 seconds in DM, restart the round mentally.",
  },
  Sunday: {
    title: "ACTIVE REST",
    desc: "NO WARMUP. Maybe 2 minutes of light Aim Botz if you really want to, but your hands and brain need to recover.",
  },
};

export const FALLBACK_FOCUS: DayFocus = {
  title: "ACTIVE REST",
  desc: "NO WARMUP. Rest day.",
};

// Warmup routine items for the day — used as the main checklist
export type WarmupItem = { id: string; title: string; desc: string };

export const WARMUP_ITEMS: Record<string, WarmupItem[]> = {
  Monday: [
    { id: "comm-dm", title: "10 Min Deathmatch", desc: "10 mins DM. Every kill/death, say a 2-word callout out loud." },
    { id: "comm-callouts", title: "2-Word Callouts", desc: "Train your mouth to work while your hands are busy." },
  ],
  Tuesday: [
    { id: "micro-flicks", title: "5 Min Aim Botz", desc: "Tiny micro-flicks only — no big swipes." },
    { id: "awp-reset", title: "5 Min AWP Reset", desc: "Empty server. Scope in, hold 3s, un-scope, look at floor, re-scope." },
  ],
  Wednesday: [
    { id: "trade-dm", title: "10 Min Rifle DM", desc: "Rifle only. Don't peek first." },
    { id: "trade-drill", title: "The Trade Drill", desc: "Wait for enemy to shoot, then swing and get the trade. Counter-strafe perfectly." },
  ],
  Thursday: [
    { id: "smoke-practice", title: "5 Smokes", desc: "Throw 5 smokes for tonight's map in an empty server." },
    { id: "flash-practice", title: "5 Pop-Flashes", desc: "Throw 5 pop-flashes for tonight's map in an empty server." },
  ],
  Friday: [
    { id: "smooth-tracking", title: "10 Min Tracking Map", desc: "Zero flicking. Keep crosshair glued to bot heads as they move." },
  ],
  Saturday: [
    { id: "aim-botz", title: "5 Min Aim Botz", desc: "Raw mechanics warmup." },
    { id: "knife-rule", title: "5 Min DM + Knife Rule", desc: "If knife is out past 15 seconds, restart the round mentally." },
  ],
  Sunday: [
    { id: "rest", title: "Active Rest", desc: "NO WARMUP. Maybe 2 mins light Aim Botz if you really want to." },
  ],
};

export function getTodayWarmupItems(): WarmupItem[] {
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return WARMUP_ITEMS[dayName] ?? WARMUP_ITEMS.Sunday;
}

// Focus Points — editable player-specific weaknesses
export type FocusPoint = { id: string; title: string; desc: string };

export const FOCUS_POINTS_DEFAULT: FocusPoint[] = [
  { id: "crosshair-placement", title: "Crosshair Placement", desc: "Keep crosshair at head height, pre-aim common angles." },
  { id: "counter-strafe", title: "Counter-Strafing", desc: "Tap opposite movement key before shooting. Every shot." },
  { id: "utility-usage", title: "Utility Usage", desc: "Use all utility every round. Don't die with smokes/flashes." },
  { id: "comms", title: "Communication", desc: "Clear, concise callouts. Info on death. No tilting in voice." },
];

export type MascotState = { caption: string; mouth: string };

export const MASCOT_STATES: Record<number, MascotState> = {
  0: { caption: "still waking up...", mouth: "M 42 72 Q 50 68 58 72" },
  1: { caption: "getting there...", mouth: "M 42 71 Q 50 73 58 71" },
  2: { caption: "warming up!", mouth: "M 42 70 Q 50 75 58 70" },
  3: { caption: "almost locked in", mouth: "M 40 69 Q 50 77 60 69" },
  4: { caption: "LOCKED IN. let's go!!", mouth: "M 39 68 Q 50 80 61 68" },
};
