import { motion } from "framer-motion";
import { MASCOT_STATES } from "@/data/routine";

function Sparkle({ delay = 0, className = "" }: { delay?: number; className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 16 16"
      className={className}
      animate={{ scale: [0.6, 1, 0.6], opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <path
        d="M8 0L9.5 5.5L16 8L9.5 10.5L8 16L6.5 10.5L0 8L6.5 5.5Z"
        fill="currentColor"
      />
    </motion.svg>
  );
}

export function Mascot({ checkedCount }: { checkedCount: number }) {
  const state = MASCOT_STATES[checkedCount] ?? MASCOT_STATES[0];
  const isIdle = checkedCount === 0;
  const isLocked = checkedCount === 4;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        {/* Idle bobbing animation */}
        <motion.div
          animate={isIdle ? {
            y: [0, -3, 0],
            rotate: [0, -1, 0, 1, 0],
          } : isLocked ? {
            scale: [1, 1.05, 1],
            y: [0, -4, 0],
          } : {}}
          transition={isIdle ? {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          } : isLocked ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          } : {}}
        >
          <motion.svg
            key={checkedCount}
            viewBox="0 0 100 100"
            className="h-16 w-16 shrink-0"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.15, 1], rotate: [0, -3, 0] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <defs>
              <linearGradient id="mascotGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFB6D9" />
                <stop offset="0.5" stopColor="#D4A5FF" />
                <stop offset="1" stopColor="#A8D8EA" />
              </linearGradient>
            </defs>
            {/* Body */}
            <ellipse cx="50" cy="58" rx="34" ry="30" fill="#FFB6D9" />
            <ellipse cx="50" cy="58" rx="34" ry="30" fill="url(#mascotGradient)" opacity="0.6" />
            {/* Ears */}
            <motion.ellipse
              cx="24" cy="52" rx="6" ry="9" fill="#FFB6D9"
              animate={isLocked ? { rotate: [0, -8, 0] } : {}}
              transition={{ duration: 0.6, repeat: isLocked ? Infinity : 0, repeatDelay: 2 }}
              style={{ transformOrigin: "24px 52px" }}
            />
            <motion.ellipse
              cx="76" cy="52" rx="6" ry="9" fill="#FFB6D9"
              animate={isLocked ? { rotate: [0, 8, 0] } : {}}
              transition={{ duration: 0.6, repeat: isLocked ? Infinity : 0, repeatDelay: 2, delay: 0.1 }}
              style={{ transformOrigin: "76px 52px" }}
            />
            <ellipse cx="24" cy="52" rx="3.5" ry="6" fill="#FFD4E8" opacity="0.6" />
            <ellipse cx="76" cy="52" rx="3.5" ry="6" fill="#FFD4E8" opacity="0.6" />
            {/* Eyes */}
            <circle cx="38" cy="55" r="5" fill="#4A3B5C" />
            <circle cx="62" cy="55" r="5" fill="#4A3B5C" />
            <circle cx="39.5" cy="53.3" r="1.8" fill="#fff" />
            <circle cx="63.5" cy="53.3" r="1.8" fill="#fff" />
            <circle cx="37" cy="56" r="0.8" fill="#fff" opacity="0.6" />
            <circle cx="61" cy="56" r="0.8" fill="#fff" opacity="0.6" />
            {/* Eye sparkle for locked in */}
            {isLocked && (
              <>
                <motion.circle
                  cx="40" cy="52" r="0.6" fill="#fff"
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle
                  cx="64" cy="52" r="0.6" fill="#fff"
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                />
              </>
            )}
            {/* Mouth */}
            <motion.path
              d={state.mouth}
              stroke="#4A3B5C"
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              animate={{ d: state.mouth }}
              transition={{ duration: 0.25 }}
            />
            {/* Blush */}
            <motion.circle
              cx="28" cy="65" r="5" fill="#FFD4E8"
              animate={isLocked ? { opacity: [0.6, 0.9, 0.6] } : { opacity: 0.6 }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="72" cy="65" r="5" fill="#FFD4E8"
              animate={isLocked ? { opacity: [0.6, 0.9, 0.6] } : { opacity: 0.6 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
          </motion.svg>
        </motion.div>

        {/* Sparkles */}
        {checkedCount >= 2 && (
          <>
            <Sparkle
              delay={0}
              className="absolute -right-1 -top-1 h-3 w-3 text-pastelPink"
            />
            {checkedCount >= 3 && (
              <Sparkle
                delay={0.3}
                className="absolute -left-2 top-1 h-2.5 w-2.5 text-pastelBlue"
              />
            )}
            {checkedCount >= 4 && (
              <>
                <Sparkle
                  delay={0.6}
                  className="absolute -left-2 top-0 h-2.5 w-2.5 text-pastelLavender"
                />
                <Sparkle
                  delay={0.9}
                  className="absolute -right-2 bottom-0 h-2 w-2 text-pastelMint"
                />
              </>
            )}
          </>
        )}
      </div>
      <motion.div
        key={state.caption}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[150px] text-[15px] font-medium leading-snug text-inkSoft"
      >
        {state.caption}
      </motion.div>
    </div>
  );
}
