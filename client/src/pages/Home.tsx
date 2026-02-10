import { motion } from "framer-motion";
import { Sparkles, Trophy, Star, Volume2, VolumeX } from "lucide-react";
import { RobotMascot } from "@/components/RobotMascot";
import { ModuleCard } from "@/components/ModuleCard";
import { useProgressStore } from "@/stores/progressStore";
import { modules } from "@/lib/moduleData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSoundEffects } from "@/components/shared/SoundEffectsProvider";

const floatingShapes = [
  { size: 14, x: "8%", y: "15%", delay: 0, duration: 6, color: "bg-indigo-300/15 dark:bg-indigo-400/10" },
  { size: 10, x: "85%", y: "10%", delay: 1.5, duration: 7, color: "bg-pink-300/15 dark:bg-pink-400/10" },
  { size: 18, x: "70%", y: "60%", delay: 0.8, duration: 8, color: "bg-purple-300/15 dark:bg-purple-400/10" },
  { size: 8, x: "25%", y: "75%", delay: 2, duration: 5, color: "bg-yellow-300/15 dark:bg-yellow-400/10" },
  { size: 12, x: "50%", y: "20%", delay: 3, duration: 6.5, color: "bg-emerald-300/15 dark:bg-emerald-400/10" },
  { size: 6, x: "15%", y: "50%", delay: 1, duration: 7.5, color: "bg-cyan-300/15 dark:bg-cyan-400/10" },
  { size: 16, x: "92%", y: "45%", delay: 2.5, duration: 5.5, color: "bg-orange-300/15 dark:bg-orange-400/10" },
];

function ProgressRing({ completed, total }: { completed: number; total: number }) {
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = completed / total;
  const dashOffset = circumference * (1 - progress);

  return (
    <motion.div
      className="relative flex-shrink-0"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
      data-testid="progress-ring"
    >
      <svg width="80" height="80" viewBox="0 0 100 100" className="-rotate-90">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground/20"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-foreground" data-testid="text-progress-count">
          {completed}/{total}
        </span>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { completedModules } = useProgressStore();
  const { soundEnabled, toggleSound } = useSoundEffects();

  const internalModules = modules.filter((m) => !m.externalUrl);
  const internalTotal = internalModules.length;
  const allComplete = completedModules.length >= internalTotal;

  const nextModuleId = internalModules
    .map((m) => m.id)
    .sort((a, b) => a - b)
    .find((id) => !completedModules.includes(id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-background relative overflow-hidden">
      {floatingShapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${shape.color} pointer-events-none`}
          style={{ width: shape.size, height: shape.size, left: shape.x, top: shape.y }}
          animate={{
            y: [0, -20, 0, 15, 0],
            x: [0, 10, -5, 8, 0],
            scale: [1, 1.15, 0.95, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5" />
        <div className="absolute top-4 left-8 w-16 h-16 rounded-full bg-yellow-300/20 dark:bg-yellow-300/10 animate-pulse-glow" />
        <div className="absolute top-12 right-12 w-10 h-10 rounded-full bg-pink-300/20 dark:bg-pink-300/10 animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-4 left-1/4 w-8 h-8 rounded-full bg-green-300/20 dark:bg-green-300/10 animate-pulse-glow" style={{ animationDelay: "1s" }} />

        <div className="relative max-w-5xl mx-auto px-4 pt-8 pb-6">
          <div className="flex justify-end mb-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleSound}
              data-testid="button-sound-toggle"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <motion.div
              className="flex-shrink-0 w-32 h-36 md:w-40 md:h-44"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <RobotMascot mood={allComplete ? "celebrating" : completedModules.length > 0 ? "happy" : "neutral"} />
            </motion.div>

            <div className="text-center md:text-left flex-1">
              <motion.h1
                className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                data-testid="text-app-title"
              >
                ML Explorer
              </motion.h1>
              <motion.p
                className="mt-2 text-lg md:text-xl text-muted-foreground font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                data-testid="text-app-subtitle"
              >
                Interactive Machine Learning for Young Minds
              </motion.p>
            </div>

            <ProgressRing completed={completedModules.length} total={internalTotal} />
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 pb-12">
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6 border-2 border-amber-300 dark:border-amber-600 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/20" data-testid="card-celebration-banner">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Trophy className="w-16 h-16 text-amber-500" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent" data-testid="text-all-complete-title">
                    CONGRATULATIONS! You've completed ML Explorer!
                  </h2>
                  <p className="text-muted-foreground mt-1 font-medium">
                    You're now an ML Expert! You've mastered data labeling, classification, data quality, model testing, and the complete ML lifecycle.
                  </p>
                  <div className="flex items-center gap-1 mt-2 justify-center md:justify-start">
                    {Array.from({ length: internalTotal }, (_, i) => i + 1).map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                      >
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="w-20 h-24 flex-shrink-0">
                  <RobotMascot mood="celebrating" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-bold text-foreground">
            Choose Your Adventure
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.id} module={mod} index={i} isNext={mod.id === nextModuleId} />
          ))}
        </div>
      </main>
    </div>
  );
}
