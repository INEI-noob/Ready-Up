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

export type ReadyUpState = {
  streak: number;
  lastDate: string | null;
  log: { date: string; day: string }[];
  sessions: SessionEntry[];
  matches: MatchEntry[];
  ruleStats: Record<string, number>;
  teamRoster: string[];
  darkMode: boolean;
  onboardingComplete: boolean;
  ruleTemplates: RuleTemplate[];
  archivedSessions: SessionEntry[];
  viewMode: "full" | "mini";
  launchProfiles: LaunchProfile[];
  activeProfile: string | null;
  achievements: Achievement[];
  soundId: SoundId;
  servers: CommunityServer[];
};
