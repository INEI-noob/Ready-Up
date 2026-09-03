import { useCallback, useEffect, useState } from "react";
import type { ReadyUpState, SessionEntry, MatchEntry, RuleTemplate, LaunchProfile, Achievement, SoundId, CommunityServer, PracticeTimerState, LineupNote, CalendarUserEvent } from "@/vite-env";

const LS_KEY = "cs2-readyup-state";
const DEFAULT_STATE: ReadyUpState = {
  streak: 0,
  lastDate: null,
  log: [],
  sessions: [],
  matches: [],
  ruleStats: {},
  teamRoster: [],
  onboardingComplete: false,
  ruleTemplates: [],
  archivedSessions: [],
  viewMode: "full",
  launchProfiles: [],
  activeProfile: null,
  achievements: [],
  soundId: "chime",
  servers: [],
  sidebarTab: "schedule",
  calendarDate: null,
  dailyRules: { date: "", checked: [] },
  practiceTimer: { phase: 0, remaining: 300, running: false, customDurations: {}, lastTick: null },
  ruleHistory: [],
  lineups: [],
  calendarEvents: [],
};

async function readState(): Promise<ReadyUpState> {
  if (window.api) return window.api.getState();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      sessions: parsed.sessions ?? [],
      matches: parsed.matches ?? [],
      ruleStats: parsed.ruleStats ?? {},
      teamRoster: parsed.teamRoster ?? [],
      ruleTemplates: parsed.ruleTemplates ?? [],
      archivedSessions: parsed.archivedSessions ?? [],
      launchProfiles: parsed.launchProfiles ?? [],
      achievements: parsed.achievements ?? [],
      soundId: parsed.soundId ?? "chime",
      servers: parsed.servers ?? [],
      sidebarTab: parsed.sidebarTab ?? "schedule",
      calendarDate: parsed.calendarDate ?? null,
      dailyRules: parsed.dailyRules ?? { date: "", checked: [] },
      practiceTimer: parsed.practiceTimer ?? { phase: 0, remaining: 300, running: false, customDurations: {}, lastTick: null },
      ruleHistory: parsed.ruleHistory ?? [],
      lineups: parsed.lineups ?? [],
      calendarEvents: parsed.calendarEvents ?? [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

async function writeState(state: ReadyUpState): Promise<void> {
  if (window.api) {
    await window.api.setState(state);
    return;
  }
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function useReadyUpState() {
  const [state, setState] = useState<ReadyUpState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    readState().then((s) => {
      setState(s);
      setLoaded(true);
    });
  }, []);

  const commitToday = useCallback(async (dayName: string, checkedRules: string[]) => {
    const current = await readState();
    const today = todayISO();

    let streak = current.streak || 0;
    if (current.lastDate === today) {
      // already committed today
    } else if (current.lastDate === yesterdayISO()) {
      streak += 1;
    } else {
      streak = 1;
    }

    const ruleStats = { ...current.ruleStats };
    for (const key of checkedRules) {
      ruleStats[key] = (ruleStats[key] || 0) + 1;
    }

    // Log today's checked rules for trend tracking, replacing any earlier commit from today
    const historyWithoutToday = (current.ruleHistory || []).filter((h) => h.date !== today);
    const ruleHistory = [...historyWithoutToday, { date: today, day: dayName, checked: checkedRules }].slice(-60);

    const next: ReadyUpState = {
      ...current,
      streak,
      lastDate: today,
      log: [...(current.log || []), { date: new Date().toISOString(), day: dayName }].slice(-49),
      ruleStats,
      ruleHistory,
    };

    await writeState(next);
    setState(next);
    return next;
  }, []);

  const addSession = useCallback(async (session: Omit<SessionEntry, "date">) => {
    const current = await readState();
    const entry: SessionEntry = {
      ...session,
      date: new Date().toISOString(),
    };
    const next: ReadyUpState = {
      ...current,
      sessions: [...(current.sessions || []), entry].slice(-99),
    };
    await writeState(next);
    setState(next);
    return next;
  }, []);

  const addMatch = useCallback(async (match: Omit<MatchEntry, "id" | "date">) => {
    const current = await readState();
    const entry: MatchEntry = {
      ...match,
      id: generateId(),
      date: new Date().toISOString(),
    };
    const next: ReadyUpState = {
      ...current,
      matches: [...(current.matches || []), entry].slice(-199),
    };
    await writeState(next);
    setState(next);
    return next;
  }, []);

  const updateSession = useCallback(async (date: string, updates: Partial<SessionEntry>) => {
    const current = await readState();
    const sessions = (current.sessions || []).map((s) =>
      s.date === date ? { ...s, ...updates } : s
    );
    const next: ReadyUpState = { ...current, sessions };
    await writeState(next);
    setState(next);
    return next;
  }, []);

  const deleteSession = useCallback(async (date: string) => {
    const current = await readState();
    const next: ReadyUpState = {
      ...current,
      sessions: (current.sessions || []).filter((s) => s.date !== date),
    };
    await writeState(next);
    setState(next);
    return next;
  }, []);

  const updateMatch = useCallback(async (id: string, updates: Partial<MatchEntry>) => {
    const current = await readState();
    const matches = (current.matches || []).map((m) =>
      m.id === id ? { ...m, ...updates } : m
    );
    const next: ReadyUpState = { ...current, matches };
    await writeState(next);
    setState(next);
    return next;
  }, []);

  const deleteMatch = useCallback(async (id: string) => {
    const current = await readState();
    const next: ReadyUpState = {
      ...current,
      matches: (current.matches || []).filter((m) => m.id !== id),
    };
    await writeState(next);
    setState(next);
    return next;
  }, []);

  const setTeamRoster = useCallback(async (roster: string[]) => {
    const current = await readState();
    const next: ReadyUpState = { ...current, teamRoster: roster };
    await writeState(next);
    setState(next);
  }, []);

  const setOnboardingComplete = useCallback(async (roster: string[]) => {
    const current = await readState();
    const next: ReadyUpState = { ...current, onboardingComplete: true, teamRoster: roster };
    await writeState(next);
    setState(next);
  }, []);

  const saveRuleTemplate = useCallback(async (template: RuleTemplate) => {
    const current = await readState();
    const existing = (current.ruleTemplates || []).filter((t) => t.name !== template.name);
    const next: ReadyUpState = { ...current, ruleTemplates: [...existing, template] };
    await writeState(next);
    setState(next);
  }, []);

  const deleteRuleTemplate = useCallback(async (name: string) => {
    const current = await readState();
    const next: ReadyUpState = { ...current, ruleTemplates: (current.ruleTemplates || []).filter((t) => t.name !== name) };
    await writeState(next);
    setState(next);
  }, []);

  const archiveOldSessions = useCallback(async () => {
    const current = await readState();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = cutoff.toISOString();

    const toArchive = (current.sessions || []).filter((s) => s.date < cutoffStr);
    const remaining = (current.sessions || []).filter((s) => s.date >= cutoffStr);

    if (toArchive.length === 0) return;

    const next: ReadyUpState = {
      ...current,
      sessions: remaining,
      archivedSessions: [...(current.archivedSessions || []), ...toArchive].slice(-500),
    };
    await writeState(next);
    setState(next);
  }, []);

  const setViewMode = useCallback(async (mode: "full" | "mini") => {
    const current = await readState();
    const next: ReadyUpState = { ...current, viewMode: mode };
    await writeState(next);
    setState(next);
  }, []);

  const saveLaunchProfile = useCallback(async (profile: LaunchProfile) => {
    const current = await readState();
    const existing = (current.launchProfiles || []).filter((p) => p.id !== profile.id);
    const next: ReadyUpState = { ...current, launchProfiles: [...existing, profile] };
    await writeState(next);
    setState(next);
  }, []);

  const deleteLaunchProfile = useCallback(async (id: string) => {
    const current = await readState();
    const next: ReadyUpState = {
      ...current,
      launchProfiles: (current.launchProfiles || []).filter((p) => p.id !== id),
      activeProfile: current.activeProfile === id ? null : current.activeProfile,
    };
    await writeState(next);
    setState(next);
  }, []);

  const setActiveProfile = useCallback(async (id: string) => {
    const current = await readState();
    const next: ReadyUpState = { ...current, activeProfile: id };
    await writeState(next);
    setState(next);
  }, []);

  const setAchievements = useCallback(async (achievements: Achievement[]) => {
    const current = await readState();
    const next: ReadyUpState = { ...current, achievements };
    await writeState(next);
    setState(next);
  }, []);

  const setSoundId = useCallback(async (soundId: SoundId) => {
    const current = await readState();
    const next: ReadyUpState = { ...current, soundId };
    await writeState(next);
    setState(next);
  }, []);

  const saveServer = useCallback(async (server: CommunityServer) => {
    const current = await readState();
    const existing = (current.servers || []).filter((s) => s.id !== server.id);
    const next: ReadyUpState = { ...current, servers: [...existing, server] };
    await writeState(next);
    setState(next);
  }, []);

  const deleteServer = useCallback(async (id: string) => {
    const current = await readState();
    const next: ReadyUpState = {
      ...current,
      servers: (current.servers || []).filter((s) => s.id !== id),
    };
    await writeState(next);
    setState(next);
  }, []);

  const saveLineup = useCallback(async (lineup: LineupNote) => {
    const current = await readState();
    const existing = (current.lineups || []).filter((l) => l.id !== lineup.id);
    const next: ReadyUpState = { ...current, lineups: [...existing, lineup].slice(-300) };
    await writeState(next);
    setState(next);
  }, []);

  const deleteLineup = useCallback(async (id: string) => {
    const current = await readState();
    const next: ReadyUpState = { ...current, lineups: (current.lineups || []).filter((l) => l.id !== id) };
    await writeState(next);
    setState(next);
  }, []);

  const saveCalendarEvent = useCallback(async (event: CalendarUserEvent) => {
    const current = await readState();
    const existing = (current.calendarEvents || []).filter((e) => e.id !== event.id);
    const next: ReadyUpState = { ...current, calendarEvents: [...existing, event] };
    await writeState(next);
    setState(next);
  }, []);

  const deleteCalendarEvent = useCallback(async (id: string) => {
    const current = await readState();
    const next: ReadyUpState = {
      ...current,
      calendarEvents: (current.calendarEvents || []).filter((e) => e.id !== id),
    };
    await writeState(next);
    setState(next);
  }, []);

  const exportData = useCallback(async (): Promise<string> => {
    const current = await readState();
    return JSON.stringify(current, null, 2);
  }, []);

  const importData = useCallback(async (json: string) => {
    const parsed = JSON.parse(json) as ReadyUpState;
    const next: ReadyUpState = {
      ...DEFAULT_STATE,
      ...parsed,
      sessions: parsed.sessions ?? [],
      matches: parsed.matches ?? [],
      ruleStats: parsed.ruleStats ?? {},
      teamRoster: parsed.teamRoster ?? [],
      ruleTemplates: parsed.ruleTemplates ?? [],
      archivedSessions: parsed.archivedSessions ?? [],
      launchProfiles: parsed.launchProfiles ?? [],
      achievements: parsed.achievements ?? [],
      servers: parsed.servers ?? [],
      ruleHistory: parsed.ruleHistory ?? [],
      lineups: parsed.lineups ?? [],
      calendarEvents: parsed.calendarEvents ?? [],
    };
    await writeState(next);
    setState(next);
  }, []);

  const setSidebarTab = useCallback(async (tab: "schedule" | "stats" | "tools" | "progress") => {
    const next = { ...state, sidebarTab: tab };
    await writeState(next);
    setState(next);
  }, [state]);

  const setCalendarDate = useCallback(async (date: string | null) => {
    const next = { ...state, calendarDate: date };
    await writeState(next);
    setState(next);
  }, [state]);

  const setDailyRules = useCallback(async (checked: string[]) => {
    const today = todayISO();
    const next = { ...state, dailyRules: { date: today, checked } };
    await writeState(next);
    setState(next);
  }, [state]);

  const setPracticeTimer = useCallback(async (timer: PracticeTimerState) => {
    const next = { ...state, practiceTimer: timer };
    await writeState(next);
    setState(next);
  }, [state]);

  return {
    state, loaded,
    commitToday, addSession, updateSession, deleteSession, addMatch, updateMatch, deleteMatch,
    setTeamRoster, setOnboardingComplete,
    saveRuleTemplate, deleteRuleTemplate, archiveOldSessions,
    setViewMode, saveLaunchProfile, deleteLaunchProfile, setActiveProfile,
    setAchievements, setSoundId, saveServer, deleteServer, exportData, importData,
    setSidebarTab, setCalendarDate, setDailyRules, setPracticeTimer,
    saveLineup, deleteLineup,
    saveCalendarEvent, deleteCalendarEvent,
  };
}
