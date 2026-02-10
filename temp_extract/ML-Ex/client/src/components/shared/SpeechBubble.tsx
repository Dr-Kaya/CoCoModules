import { motion } from "framer-motion";

interface SpeechBubbleProps {
  text: string;
  color?: string;
  className?: string;
  position?: "bottom" | "left" | "right";
}

const colorMap: Record<string, { border: string; bg: string }> = {
  indigo: { border: "border-indigo-200 dark:border-indigo-700", bg: "bg-white dark:bg-card" },
  emerald: { border: "border-emerald-200 dark:border-emerald-700", bg: "bg-white dark:bg-card" },
  orange: { border: "border-orange-200 dark:border-orange-700", bg: "bg-white dark:bg-card" },
  purple: { border: "border-purple-200 dark:border-purple-700", bg: "bg-white dark:bg-card" },
  cyan: { border: "border-cyan-200 dark:border-cyan-700", bg: "bg-white dark:bg-card" },
  yellow: { border: "border-yellow-200 dark:border-yellow-700", bg: "bg-white dark:bg-card" },
  blue: { border: "border-blue-200 dark:border-blue-700", bg: "bg-white dark:bg-card" },
};

export function SpeechBubble({
  text,
  color = "indigo",
  className = "",
  position = "bottom",
}: SpeechBubbleProps) {
  const colors = colorMap[color] || colorMap.indigo;

  const arrowPositionClasses = {
    bottom: "absolute -bottom-2 left-8 w-4 h-4 border-b-2 border-r-2 rotate-45 transform",
    left: "absolute -left-2 top-4 w-4 h-4 border-l-2 border-b-2 rotate-45 transform",
    right: "absolute -right-2 top-4 w-4 h-4 border-r-2 border-t-2 rotate-45 transform",
  };

  return (
    <motion.div
      className={`relative ${colors.bg} border-2 ${colors.border} rounded-2xl px-5 py-3 text-base font-medium text-foreground ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      role="status"
      aria-live="polite"
    >
      {text}
      <div className={`${arrowPositionClasses[position]} ${colors.bg} ${colors.border}`} />
    </motion.div>
  );
}
