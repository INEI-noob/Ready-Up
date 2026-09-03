import { useState } from "react";
import { X, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarUserEvent, CalendarEventType, CalendarPriority } from "@/vite-env";
import { AccessibleModal } from "./AccessibleModal";

const EVENT_TYPES: { value: CalendarEventType; label: string }[] = [
  { value: "Prac", label: "Practice" },
  { value: "Warmup", label: "Warmup" },
  { value: "Scrim", label: "Scrim" },
  { value: "Official", label: "Official" },
  { value: "Teambuilding", label: "Team Building" },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function AddCalendarEvent({ onSave, onClose, selectedDate, editData }: {
  onSave: (event: CalendarUserEvent) => void;
  onClose: () => void;
  selectedDate: string;
  editData?: CalendarUserEvent;
}) {
  const isEdit = !!editData;
  const [title, setTitle] = useState(editData?.title ?? "");
  const [type, setType] = useState<CalendarEventType>(editData?.type ?? "Scrim");
  const [time, setTime] = useState(editData?.time ?? "");
  const [priority, setPriority] = useState<CalendarPriority>(editData?.priority ?? "Normal");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: editData?.id ?? generateId(),
      date: editData?.date ?? selectedDate,
      title: title.trim() || type,
      type,
      time: time.trim() || undefined,
      priority,
    });
    onClose();
  }

  return (
    <AccessibleModal open onClose={onClose} label={isEdit ? "Edit Event" : "Add Event"} className="w-full max-w-sm rounded-3xl border border-pastelPink/20 bg-[rgba(25,22,40,0.95)] p-5 shadow-pastel-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarPlus className="h-4 w-4 text-pastelBlue" />
            <h3 className="font-display text-lg font-bold text-ink">{isEdit ? "Edit Event" : "Add Event"}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 text-inkDim hover:bg-pastelPink/10 hover:text-pink">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-3 rounded-xl border border-pastelBlue/20 bg-pastelBlue/5 px-3 py-2">
          <div className="font-mono text-[10px] tracking-wider text-inkDim">DATE</div>
          <div className="text-[13px] font-bold text-ink">
            {new Date((editData?.date ?? selectedDate) + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">TITLE</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type}
            className="w-full rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">TYPE</span>
          <div className="flex gap-1.5">
            {EVENT_TYPES.map((et) => (
              <button
                key={et.value}
                type="button"
                onClick={() => setType(et.value)}
                className={cn(
                  "flex-1 rounded-xl border px-2 py-1.5 text-[11px] font-bold transition-all",
                  type === et.value
                    ? "border-pastelLavender bg-pastelLavender/10 text-pastelLavender"
                    : "border-white/10 bg-white/5 text-inkDim"
                )}
              >
                {et.label}
              </button>
            ))}
          </div>
        </label>

        <div className="mb-3 flex gap-2">
          <label className="flex-1">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">TIME (optional)</span>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="18:00"
              className="w-full rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-1.5 text-[13px] text-ink outline-none placeholder:text-pastelPink/40 focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1 block font-mono text-[10px] tracking-wider text-inkDim">PRIORITY</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as CalendarPriority)}
              className="w-full rounded-xl border border-white/10 bg-[rgba(25,22,40,0.5)] px-3 py-2 text-[13px] text-ink outline-none focus:border-pastelPink/40 focus:ring-2 focus:ring-pastelPink/20"
            >
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-pastelPink via-pastelLavender to-pastelBlue py-2.5 font-display text-sm font-bold text-white shadow-pastel transition-all hover:-translate-y-0.5 hover:shadow-pastel-lg"
        >
          {isEdit ? "Save Changes" : "Add Event"}
        </button>
      </form>
    </AccessibleModal>
  );
}
