import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

import warmupData from "@/data/events/warmup.json";
import scrimData from "@/data/events/scrim.json";
import pracData from "@/data/events/prac.json";
import officialsData from "@/data/events/officials.json";
import teambuildingData from "@/data/events/teambuilding.json";

type EventType = "Prac" | "Warmup" | "Scrim" | "Official" | "Teambuilding";
type Priority = "High" | "Normal";

interface CalendarEvent {
  date: string;
  title: string;
  type: EventType;
  time?: string;
  priority: Priority;
}

const EVENT_COLORS: Record<EventType, { bg: string; dot: string; text: string; border: string }> = {
  Prac: {
    bg: "bg-pastelPink/10",
    dot: "bg-pastelPink",
    text: "text-pink",
    border: "border-pastelPink/20",
  },
  Warmup: {
    bg: "bg-pastelBlue/10",
    dot: "bg-pastelBlue",
    text: "text-pastelBlue",
    border: "border-pastelBlue/20",
  },
  Scrim: {
    bg: "bg-pastelLavender/10",
    dot: "bg-pastelLavender",
    text: "text-pastelLavender",
    border: "border-pastelLavender/20",
  },
  Official: {
    bg: "bg-pastelMint/10",
    dot: "bg-pastelMint",
    text: "text-okDark",
    border: "border-pastelMint/20",
  },
  Teambuilding: {
    bg: "bg-pastelPeach/10",
    dot: "bg-pastelPeach",
    text: "text-orange-400",
    border: "border-pastelPeach/20",
  },
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_TO_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function toISODate(date: Date): string {
  return formatDateKey(date.getFullYear(), date.getMonth(), date.getDate());
}

function todayISO(): string {
  return toISODate(new Date());
}

function getMonthDateRange(year: number, month: number): string[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const start = new Date(firstDay);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

  const end = new Date(lastDay);
  end.setDate(end.getDate() + ((7 - end.getDay()) % 7));

  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(toISODate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function parseDatedEvents(
  data: { events: { date: string; title: string; time?: string; priority?: string }[] },
  type: EventType,
  defaultPriority: Priority = "Normal"
): CalendarEvent[] {
  return data.events.map((e) => ({
    date: e.date,
    title: e.title,
    type,
    time: e.time,
    priority: (e.priority as Priority) ?? defaultPriority,
  }));
}

function parseWeeklyEvents(
  data: { events: { day: string; title: string; time?: string; desc?: string; priority?: string }[] },
  type: EventType,
  targetDates: string[],
  defaultPriority: Priority = "Normal"
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  for (const entry of data.events) {
    const dayIndex = DAY_TO_INDEX[entry.day];
    if (dayIndex === undefined) continue;

    for (const dateStr of targetDates) {
      const d = new Date(dateStr + "T12:00:00");
      if (d.getDay() === dayIndex) {
        events.push({
          date: dateStr,
          title: entry.title,
          type,
          time: entry.time,
          priority: (entry.priority as Priority) ?? defaultPriority,
        });
      }
    }
  }
  return events;
}

export function Calendar({ onQuickAdd, selectedDate: controlledDate, onDateSelect }: { onQuickAdd?: (type: "scrim" | "official") => void; selectedDate?: string | null; onDateSelect?: (date: string | null) => void }) {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [internalDate, setInternalDate] = useState<string | null>(null);
  const selectedDate = controlledDate !== undefined ? controlledDate : internalDate;
  const setSelectedDate = onDateSelect || setInternalDate;

  const events = useMemo(() => {
    const monthDates = getMonthDateRange(currentYear, currentMonth);

    const dated = [
      ...parseDatedEvents(scrimData, "Scrim"),
      ...parseDatedEvents(pracData, "Prac"),
      ...parseDatedEvents(officialsData, "Official"),
      ...parseDatedEvents(teambuildingData, "Teambuilding"),
    ];

    const weekly = parseWeeklyEvents(warmupData, "Warmup", monthDates);

    return [...dated, ...weekly];
  }, [currentYear, currentMonth]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const evt of events) {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    }
    return map;
  }, [events]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  const monthLabel = new Date(currentYear, currentMonth).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  }

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] ?? [] : [];

  const upcomingEvents = useMemo(() => {
    const todayStr = todayISO();
    return events
      .filter((e) => e.date >= todayStr && e.priority === "High")
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events]);

  const eventTypes = Object.keys(EVENT_COLORS) as EventType[];

  return (
    <div className="rounded-3xl border border-pastelPink/20 bg-[rgba(25,22,40,0.9)] p-5 shadow-pastel backdrop-blur-sm">
      {/* Month nav */}
      <div className="mb-4 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full text-inkDim transition-colors hover:bg-pastelPink/10 hover:text-pastelPink"
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>
        <h3 className="font-display text-lg font-bold text-ink">{monthLabel}</h3>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full text-inkDim transition-colors hover:bg-pastelPink/10 hover:text-pastelPink"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7 gap-1" role="row">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-1 text-center font-mono text-[10px] font-semibold tracking-wider text-inkDim"
            role="columnheader"
            aria-label={day}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        className="grid grid-cols-7 gap-1"
        role="grid"
        aria-label="Calendar"
        onKeyDown={(e) => {
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
          e.preventDefault();

          const cells = Array.from(
            (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="gridcell"]')
          );
          const current = document.activeElement as HTMLElement;
          const idx = cells.indexOf(current);
          if (idx < 0) return;

          let next = idx;
          if (e.key === "ArrowRight") next = Math.min(idx + 1, cells.length - 1);
          else if (e.key === "ArrowLeft") next = Math.max(idx - 1, 0);
          else if (e.key === "ArrowDown") next = Math.min(idx + 7, cells.length - 1);
          else if (e.key === "ArrowUp") next = Math.max(idx - 7, 0);

          cells[next]?.focus();
        }}
      >
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const dateKey = formatDateKey(currentYear, currentMonth, day);
          const dayEvents = eventsByDate[dateKey] ?? [];
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const hasEvents = dayEvents.length > 0;

          const fullDateLabel = new Date(currentYear, currentMonth, day).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          return (
            <motion.button
              key={dateKey}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              role="gridcell"
              aria-label={fullDateLabel}
              aria-selected={isSelected}
              tabIndex={isToday ? 0 : -1}
              className={cn(
                "relative flex h-10 w-full flex-col items-center justify-center rounded-xl text-[13px] font-medium transition-all duration-200",
                isToday && !isSelected && "bg-pastelPink/20 font-bold text-pink",
                isSelected && "bg-gradient-to-br from-pastelPink to-pastelLavender font-bold text-white shadow-pastel",
                !isToday && !isSelected && "text-ink hover:bg-pastelPink/5",
                hasEvents && !isSelected && "font-bold"
              )}
            >
              {day}
              {hasEvents && (
                <div className="absolute bottom-0.5 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((evt, j) => (
                    <div
                      key={j}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isSelected ? "bg-white/80" : EVENT_COLORS[evt.type].dot
                      )}
                    />
                  ))}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Selected date events */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="rounded-xl border border-pastelPink/10 bg-white/50 p-3">
              <div className="mb-2 font-mono text-[10px] tracking-wider text-inkDim">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              {selectedEvents.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedEvents.map((evt, i) => {
                    const colors = EVENT_COLORS[evt.type];
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-2.5 py-1.5",
                          colors.bg,
                          colors.border
                        )}
                      >
                        <div className={cn("h-1.5 w-1.5 shrink-0 rounded-full", colors.dot)} />
                        <span className={cn("text-[12px] font-semibold", colors.text)}>
                          {evt.title}
                        </span>
                        {evt.time && (
                          <span className="ml-auto font-mono text-[10px] text-inkDim">
                            {evt.time}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {onQuickAdd && selectedEvents.some((e) => e.type === "Scrim" || e.type === "Official") && selectedDate! <= todayISO() && (
                    <button
                      onClick={() => onQuickAdd(selectedEvents.some((e) => e.type === "Official") ? "official" : "scrim")}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-pastelPink/20 px-3 py-1.5 text-[12px] font-bold text-pastelPink transition-colors hover:bg-pastelPink/10"
                    >
                      <PenLine className="h-3 w-3" />
                      Log match result
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-[12px] text-inkDim/80">No events scheduled</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upcoming events */}
      <div className="mt-4">
        <div className="mb-2 font-mono text-[10px] tracking-wider text-inkDim">
          UPCOMING
        </div>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-1.5">
            {upcomingEvents.map((evt, i) => {
              const colors = EVENT_COLORS[evt.type];
              return (
                <motion.div
                  key={`${evt.date}-${evt.type}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2",
                    colors.bg,
                    colors.border
                  )}
                >
                  <div className={cn("h-2 w-2 shrink-0 rounded-full", colors.dot)} />
                  <div className="min-w-0 flex-1">
                    <div className={cn("text-[13px] font-bold leading-tight", colors.text)}>
                      {evt.title}
                    </div>
                    <div className="font-mono text-[10px] text-inkDim">
                      {new Date(evt.date + "T12:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {evt.time ? ` \u00B7 ${evt.time}` : ""}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      colors.bg,
                      colors.text
                    )}
                  >
                    {evt.type}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-white/40 bg-white/30 p-3 text-center text-[12px] text-inkDim/80">
            No upcoming events
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {eventTypes.map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", EVENT_COLORS[type].dot)} />
            <span className="font-mono text-[10px] tracking-wider text-inkDim uppercase">
              {type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
