import { useCallback, useEffect, useState } from "react";
import type { ReadyUpState, SessionEntry, MatchEntry, RuleTemplate, LaunchProfile, Achievement, SoundId, CommunityServer } from "@/vite-env";

const LS_KEY = "readyup-state";
const DEFAULT_STATE: ReadyUpState = {
  streak: 0,
  lastDate: null,
  log: [],
  sessions: [],
  matches: [],
  ruleStats: {},
  teamRoster: [],
  darkMode: false,
  onboardingComplete: false,
  ruleTemplates: [],
  archivedSessions: [],
  viewMode: "full",
  launchProfiles: [],
  activeProfile: null,
  achievements: [],
  soundId: "chime",
  servers: [],
};

function readState(): ReadyUpState {
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
      servers: parsed.servers ?? [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: ReadyUpState): void {
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
    setState(readState());
    setLoaded(true);
  }, []);

  const commitToday = useCallback((dayName: string, checkedRules: string[]) => {
    const current = readState();
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

    const next: ReadyUpState = {
      ...current,
      streak,
      lastDate: today,
      log: [...(current.log || []), { date: new Date().toISOString(), day: dayName }].slice(-49),
      ruleStats,
    };

    writeState(next);
    setState(next);
    return next;
  }, []);

  const addSession = useCallback((session: Omit<SessionEntry, "date">) => {
    const current = readState();
    const entry: SessionEntry = {
      ...session,
      date: new Date().toISOString(),
    };
    const next: ReadyUpState = {
      ...current,
      sessions: [...(current.sessions || []), entry].slice(-99),
    };
    writeState(next);
    setState(next);
    return next;
  }, []);

  const addMatch = useCallback((match: Omit<MatchEntry, "id" | "date">) => {
    const current = readState();
    const entry: MatchEntry = {
      ...match,
      id: generateId(),
      date: new Date().toISOString(),
    };
    const next: ReadyUpState = {
      ...current,
      matches: [...(current.matches || []), entry].slice(-199),
    };
    writeState(next);
    setState(next);
    return next;
  }, []);

  const deleteMatch = useCallback((id: string) => {
    const current = readState();
    const next: ReadyUpState = {
      ...current,
      matches: (current.matches || []).filter((m) => m.id !== id),
    };
    writeState(next);
    setState(next);
    return next;
  }, []);

  const setTeamRoster = useCallback((roster: string[]) => {
    const current = readState();
    const next: ReadyUpState = { ...current, teamRoster: roster };
    writeState(next);
    setState(next);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const current = readState();
    const next: ReadyUpState = { ...current, darkMode: !current.darkMode };
    writeState(next);
    setState(next);
  }, []);

  const setOnboardingComplete = useCallback((roster: string[]) => {
    const current = readState();
    const next: ReadyUpState = { ...current, onboardingComplete: true, teamRoster: roster };
    writeState(next);
    setState(next);
  }, []);

  const saveRuleTemplate = useCallback((template: RuleTemplate) => {
    const current = readState();
    const existing = (current.ruleTemplates || []).filter((t) => t.name !== template.name);
    const next: ReadyUpState = { ...current, ruleTemplates: [...existing, template] };
    writeState(next);
    setState(next);
  }, []);

  const deleteRuleTemplate = useCallback((name: string) => {
    const current = readState();
    const next: ReadyUpState = { ...current, ruleTemplates: (current.ruleTemplates || []).filter((t) => t.name !== name) };
    writeState(next);
    setState(next);
  }, []);

  const archiveOldSessions = useCallback(() => {
    const current = readState();
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
    writeState(next);
    setState(next);
  }, []);

  const setViewMode = useCallback((mode: "full" | "mini") => {
    const current = readState();
    const next: ReadyUpState = { ...current, viewMode: mode };
    writeState(next);
    setState(next);
  }, []);

  const saveLaunchProfile = useCallback((profile: LaunchProfile) => {
    const current = readState();
    const existing = (current.launchProfiles || []).filter((p) => p.id !== profile.id);
    const next: ReadyUpState = { ...current, launchProfiles: [...existing, profile] };
    writeState(next);
    setState(next);
  }, []);

  const deleteLaunchProfile = useCallback((id: string) => {
    const current = readState();
    const next: ReadyUpState = {
      ...current,
      launchProfiles: (current.launchProfiles || []).filter((p) => p.id !== id),
      activeProfile: current.activeProfile === id ? null : current.activeProfile,
    };
    writeState(next);
    setState(next);
  }, []);

  const setActiveProfile = useCallback((id: string) => {
    const current = readState();
    const next: ReadyUpState = { ...current, activeProfile: id };
    writeState(next);
    setState(next);
  }, []);

  const setAchievements = useCallback((achievements: Achievement[]) => {
    const current = readState();
    const next: ReadyUpState = { ...current, achievements };
    writeState(next);
    setState(next);
  }, []);

  const setSoundId = useCallback((soundId: SoundId) => {
    const current = readState();
    const next: ReadyUpState = { ...current, soundId };
    writeState(next);
    setState(next);
  }, []);

  const saveServer = useCallback((server: CommunityServer) => {
    const current = readState();
    const existing = (current.servers || []).filter((s) => s.id !== server.id);
    const next: ReadyUpState = { ...current, servers: [...existing, server] };
    writeState(next);
    setState(next);
  }, []);

  const deleteServer = useCallback((id: string) => {
    const current = readState();
    const next: ReadyUpState = {
      ...current,
      servers: (current.servers || []).filter((s) => s.id !== id),
    };
    writeState(next);
    setState(next);
  }, []);

  const exportData = useCallback((): string => {
    const current = readState();
    return JSON.stringify(current, null, 2);
  }, []);

  const importData = useCallback((json: string) => {
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
    };
    writeState(next);
    setState(next);
  }, []);

  return {
    state, loaded,
    commitToday, addSession, addMatch, deleteMatch,
    setTeamRoster, toggleDarkMode, setOnboardingComplete,
    saveRuleTemplate, deleteRuleTemplate, archiveOldSessions,
    setViewMode, saveLaunchProfile, deleteLaunchProfile, setActiveProfile,
    setAchievements, setSoundId, saveServer, deleteServer, exportData, importData,
  };
}
