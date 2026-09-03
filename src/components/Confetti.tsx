import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#FF8AC0", "#7FCBF5", "#8B85F5", "#B8E6C8", "#FFD4B8", "#FFF3B0"];

type Piece = { id: number; left: number; size: number; color: string; delay: number; duration: number };

function ConfettiPiece({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 10 10" width={size} height={size}>
      <circle cx="5" cy="5" r="4" fill={color} />
    </svg>
  );
}

export function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo<Piece[]>(() => {
    if (!active) return [];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 5 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.4,
      duration: 1.8 + Math.random() * 1.4,
    }));
  }, [active]);

  return (
    <AnimatePresence>
      {active &&
        pieces.map((p) => (
          <motion.div
            key={p.id}
            className="pointer-events-none fixed top-[-10px]"
            style={{ left: `${p.left}vw` }}
            initial={{ y: -10, rotate: 0, opacity: 1, scale: 0 }}
            animate={{ y: "105vh", rotate: 360, opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.duration, delay: p.delay, ease: "linear" }}
          >
            <ConfettiPiece size={p.size} color={p.color} />
          </motion.div>
        ))}
    </AnimatePresence>
  );
}
