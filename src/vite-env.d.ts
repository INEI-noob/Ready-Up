/// <reference types="vite/client" />

export type SessionEntry = {
  date: string;
  day: string;
  kd: number;
  adr: number;
  hsPercent: number;
  rulesChecked: number;
  note?: string;
  mindsetNote?: string;
};

export type MatchEntry = {
  id: string;
  date: string;
  type: "scrim" | "official" | "personal";
  opponent: string;
  map: string;
  result: "W" | "L" | "D";
  scoreFor: number;
  scoreAgainst: number;
  teamPlayers: string[];
  kd: number;
  adr: number;
  hsPercent: number;
  note?: string;
};

export type RuleTemplate = {
  name: string;
  rules: string[];
};

export type LaunchProfile = {
  id: string;
  name: string;
  rules: string[];
  mindsetPrompt?: string;
  icon: string;
};

export type Achievement = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlockedAt?: string;
};

export type SoundId = "chime" | "pop" | "ding" | "bell" | "none";

export type CommunityServer = {
  id: string;
  name: string;
  ip: string;
  port: number;
  password?: string;
};

export type PracticeTimerState = {
  phase: number;
  remaining: number;
  running: boolean;
  customDurations: Record<string, number>;
  lastTick: number | null;
};

export type RuleHistoryEntry = {
  date: string;
  day: string;
  checked: string[];
};

export type LineupNote = {
  id: string;
  map: string;
  title: string;
  note: string;
  image?: string;
  createdAt: string;
};

export type CalendarEventType = "Prac" | "Warmup" | "Scrim" | "Official" | "Teambuilding";
export type CalendarPriority = "High" | "Normal";

export type CalendarUserEvent = {
  id: string;
  date: string;
  title: string;
  type: CalendarEventType;
  time?: string;
  priority: CalendarPriority;
};

export type TrackerPremierStats = {
  elo: string;
  best: string;
  matches: string;
  kd: string;
  hs: string;
};

export type TrackerFaceitStats = {
  elo: string;
  skillLevel: string;
  matches: string;
  kd: string;
  hs: string;
  winRate: string;
};

export type TrackerCompRank = {
  map: string;
  rank: string;
  wins: string;
};

export type TrackerRecentMatch = {
  result: "WIN" | "LOSS" | "TIE";
  map: string;
  score: string;
  kd: string;
  adr: string;
  hs: string;
};

export type TrackerStats = {
  steamId: string;
  profileName: string;
  avatar: string;
  profileUrl: string;
  country: string;
  personaState: string;
  accountAge: string;
  playtime: string;
  level: string;
  friends: string;
  friendsCount: string;
  overall: { kd: string; hs: string; accuracy: string; adr: string; matchesPlayed: string; matchesWon: string };
  premier: TrackerPremierStats;
  faceit: TrackerFaceitStats;
  leetify: { aim: string; positioning: string; utility: string; opening: string; clutch: string; gamesPlayed: string };
  compRanks: TrackerCompRank[];
  reactionMs: string;
  rifleHs: string;
  rifleAccuracy: string;
  winRate: string;
  headshotOverall: string;
  cheatingPercent: string;
  cheatingLabel: string;
  timeToDamage: string;
  recentMatches: TrackerRecentMatch[];
  fetchedAt: string;
};

export type ReadyUpState = {
  streak: number;
  lastDate: string | null;
  log: { date: string; day: string }[];
  sessions: SessionEntry[];
  matches: MatchEntry[];
  ruleStats: Record<string, number>;
  teamRoster: string[];
  onboardingComplete: boolean;
  ruleTemplates: RuleTemplate[];
  archivedSessions: SessionEntry[];
  viewMode: "full" | "mini";
  launchProfiles: LaunchProfile[];
  activeProfile: string | null;
  achievements: Achievement[];
  soundId: SoundId;
  servers: CommunityServer[];
  sidebarTab: "schedule" | "stats" | "tools" | "progress";
  calendarDate: string | null;
  dailyRules: { date: string; checked: string[] };
  practiceTimer: PracticeTimerState;
  ruleHistory: RuleHistoryEntry[];
  lineups: LineupNote[];
  calendarEvents: CalendarUserEvent[];
};

export interface ReadyUpAPI {
  getState: () => Promise<ReadyUpState>;
  setState: (data: ReadyUpState) => Promise<boolean>;
  launchSteam: () => Promise<{ ok: boolean; error?: string }>;
  connectServer: (ip: string, port: number, password?: string) => Promise<{ ok: boolean; error?: string }>;
}

declare global {
  interface Window {
    api?: ReadyUpAPI;
  }
}
