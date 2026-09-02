import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Rule } from "@/data/routine";

export function RuleCard({
  rule,
  checked,
  onToggle,
  index,
  isLast,
}: {
  rule: Rule;
  checked: boolean;
  onToggle: () => void;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="flex gap-3"
    >
      {/* Stepper column */}
      <div className="flex flex-col items-center">
        {/* Circle node */}
        <motion.button
          onClick={onToggle}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.08 }}
          className={cn(
            "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
            checked
              ? "border-transparent bg-gradient-to-br from-pastelPink to-pastelLavender shadow-pastel"
              : "border-pastelPink/30 bg-white/80 hover:border-pastelPink hover:shadow-[0_0_12px_rgba(255,182,217,0.25)]"
          )}
        >
          {checked ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Check className="h-5 w-5 text-white" strokeWidth={3} />
            </motion.div>
          ) : (
            <span className="font-display text-sm font-bold text-pastelPink/60">
              {index + 1}
            </span>
          )}
        </motion.button>

        {/* Connector line */}
        {!isLast && (
          <div className="relative h-full w-0.5 min-h-[12px]">
            <div className="absolute inset-0 rounded-full bg-pastelPink/15" />
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: checked ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-pastelPink to-pastelLavender/50"
            />
          </div>
        )}
      </div>

      {/* Content card */}
      <motion.div
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "mb-2 flex flex-1 cursor-pointer select-none items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-300",
          checked
            ? "border-pastelPink/20 bg-gradient-to-r from-pastelPink/10 via-white/60 to-pastelLavender/10 shadow-pastel"
            : "border-white/40 bg-white/50 hover:border-pastelPink/30 hover:bg-white/70 hover:shadow-pastel"
        )}
      >
        <div className="flex-1 min-w-0">
          <strong
            className={cn(
              "block text-[15px] font-bold leading-snug transition-colors duration-300",
              checked ? "text-pastelLavender" : "text-ink"
            )}
          >
            {rule.title}
          </strong>
          <span className="mt-0.5 block text-[13.5px] leading-relaxed text-inkSoft">
            {rule.desc}
          </span>
        </div>

        {/* Status dot */}
        <div
          className={cn(
            "h-2.5 w-2.5 shrink-0 rounded-full transition-all duration-300",
            checked
              ? "bg-gradient-to-r from-pastelPink to-pastelLavender shadow-[0_0_8px_rgba(212,165,255,0.4)]"
              : "bg-pastelPink/20"
          )}
        />
      </motion.div>
    </motion.div>
  );
}
