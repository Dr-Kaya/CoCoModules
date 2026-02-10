import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSoundEffects } from "@/components/shared/SoundEffectsProvider";

const DEFAULT_COLORS = ["#818CF8", "#F472B6", "#34D399", "#FBBF24", "#F87171", "#60A5FA"];

interface ConfettiEffectProps {
  colors?: string[];
  count?: number;
}

export function ConfettiEffect({ colors = DEFAULT_COLORS, count = 40 }: ConfettiEffectProps) {
  const [viewportHeight, setViewportHeight] = useState(800);
  const { playSound } = useSoundEffects();

  useEffect(() => {
    setViewportHeight(window.innerHeight);
    playSound("celebrate");
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: colors[i % colors.length],
            left: `${Math.random() * 100}%`,
            top: -20,
          }}
          animate={{
            y: [0, viewportHeight + 50],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.8,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
