import { motion } from "framer-motion";

export type RobotMood = "happy" | "excited" | "thinking" | "confused" | "celebrating" | "neutral";

interface RobotMascotProps {
  className?: string;
  mood?: RobotMood;
}

const moodGlowColors: Record<RobotMood, string> = {
  happy: "#34D399",
  excited: "#F472B6",
  thinking: "#FBBF24",
  confused: "#FB923C",
  celebrating: "#818CF8",
  neutral: "#A78BFA",
};

export function RobotMascot({ className = "", mood = "neutral" }: RobotMascotProps) {
  const glowColor = moodGlowColors[mood];

  const bodyAnimation = mood === "excited"
    ? { y: [0, -15, 0, -10, 0] }
    : mood === "celebrating"
      ? { y: [0, -12, 0], rotate: [0, -3, 3, 0] }
      : { y: [0, -10, 0] };

  const bodyTransition = mood === "excited"
    ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const }
    : mood === "celebrating"
      ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 3, repeat: Infinity, ease: "easeInOut" as const };

  const mouthPath = mood === "happy" || mood === "excited" || mood === "celebrating"
    ? "M85 88 Q100 104 115 88"
    : mood === "confused"
      ? "M85 95 Q100 90 115 95"
      : mood === "thinking"
        ? "M90 94 Q100 97 110 94"
        : "M85 90 Q100 102 115 90";

  const headRotation = mood === "confused" ? { rotate: [0, 8, 0] } : { rotate: 0 };
  const headTransition = mood === "confused"
    ? { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
    : {};

  return (
    <motion.div
      className={className}
      animate={bodyAnimation}
      transition={bodyTransition}
      role="img"
      aria-label={`Robot mascot feeling ${mood}`}
    >
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="50" y1="60" x2="150" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818CF8" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="headGrad" x1="55" y1="30" x2="145" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A5B4FC" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="antennaGrad" x1="100" y1="0" x2="100" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F472B6" />
            <stop offset="1" stopColor="#A78BFA" />
          </linearGradient>
          <filter id="moodGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.circle
          cx="100"
          cy="12"
          r="8"
          fill={glowColor}
          filter="url(#moodGlow)"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <line x1="100" y1="20" x2="100" y2="40" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />

        <motion.g animate={headRotation} transition={headTransition} style={{ originX: "100px", originY: "75px" }}>
          <rect x="55" y="35" width="90" height="80" rx="20" fill="url(#headGrad)" />

          <rect x="70" y="55" width="24" height="24" rx="8" fill="white" />
          <rect x="106" y="55" width="24" height="24" rx="8" fill="white" />

          <motion.circle
            cx="82"
            cy="67"
            r="6"
            fill="#1E1B4B"
            animate={{ x: [0, 2, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.circle
            cx="118"
            cy="67"
            r="6"
            fill="#1E1B4B"
            animate={{ x: [0, 2, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          <circle cx="82" cy="64" r="2" fill="white" />
          <circle cx="118" cy="64" r="2" fill="white" />

          <motion.path
            d={mouthPath}
            stroke="#1E1B4B"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          <circle cx="72" cy="82" r="6" fill="#F9A8D4" opacity="0.5" />
          <circle cx="128" cy="82" r="6" fill="#F9A8D4" opacity="0.5" />
        </motion.g>

        <rect x="60" y="120" width="80" height="75" rx="16" fill="url(#bodyGrad)" />

        <rect x="78" y="138" width="44" height="20" rx="6" fill="#C7D2FE" opacity="0.6" />
        <motion.circle
          cx="89"
          cy="148"
          r="3"
          fill={glowColor}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <circle cx="100" cy="148" r="3" fill="#FBBF24" />
        <circle cx="111" cy="148" r="3" fill="#F87171" />

        <motion.rect
          x="30"
          y="130"
          width="25"
          height="12"
          rx="6"
          fill="#818CF8"
          animate={mood === "celebrating" ? { rotate: [0, -15, 15, -10, 10, 0] } : { rotate: [0, -5, 5, 0] }}
          transition={mood === "celebrating" ? { duration: 0.6, repeat: Infinity } : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: "55px", originY: "136px" }}
        />

        <motion.rect
          x="145"
          y="130"
          width="25"
          height="12"
          rx="6"
          fill="#818CF8"
          animate={mood === "celebrating" ? { rotate: [0, 15, -15, 10, -10, 0] } : { rotate: [0, 5, -5, 0] }}
          transition={mood === "celebrating" ? { duration: 0.6, repeat: Infinity, delay: 0.1 } : { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          style={{ originX: "145px", originY: "136px" }}
        />

        <rect x="72" y="195" width="18" height="20" rx="8" fill="#6366F1" />
        <rect x="110" y="195" width="18" height="20" rx="8" fill="#6366F1" />

        <rect x="68" y="210" width="26" height="10" rx="5" fill="#4F46E5" />
        <rect x="106" y="210" width="26" height="10" rx="5" fill="#4F46E5" />
      </svg>
    </motion.div>
  );
}
