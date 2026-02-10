import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, SkipForward, Database, Brain, FlaskConical, RefreshCw, Rocket } from "lucide-react";

const defaultSteps = [
  { icon: Database, label: "Collect Data", desc: "Gather examples" },
  { icon: Brain, label: "Train", desc: "Teach the model" },
  { icon: FlaskConical, label: "Test", desc: "Check accuracy" },
  { icon: RefreshCw, label: "Improve", desc: "Add more data" },
  { icon: Rocket, label: "Deploy", desc: "Use it!" },
];

interface VideoStep {
  icon: typeof Brain;
  label: string;
  desc: string;
}

interface VideoPlaceholderProps {
  title?: string;
  steps?: VideoStep[];
  onComplete: () => void;
  gradientClass?: string;
}

export function VideoPlaceholder({
  title = "Watch this video to learn how machines learn!",
  steps = defaultSteps,
  onComplete,
  gradientClass = "from-primary/20 to-secondary/20",
}: VideoPlaceholderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setVideoProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 4;
      });
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full space-y-6"
    >
      <Card className={`aspect-video relative overflow-hidden bg-gradient-to-br ${gradientClass}`}>
        {!isPlaying ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <p className="text-lg font-medium mb-4 text-foreground text-center">
              {title}
            </p>
            <div className="flex gap-4">
              <Button onClick={handlePlay} size="lg" data-testid="button-play-video">
                <Play className="w-5 h-5 mr-2" />
                Play Video
              </Button>
              <Button
                variant="outline"
                onClick={onComplete}
                data-testid="button-skip-video"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip
              </Button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="flex gap-3 flex-wrap justify-center mb-6">
              {steps.map((s, i) => {
                const StepIcon = s.icon;
                const isActive = videoProgress > i * (100 / steps.length);
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                      y: 0,
                    }}
                    transition={{ delay: i * 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-medium mt-1">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>
            <Progress value={videoProgress} className="w-full max-w-sm" />
            <p className="text-sm text-muted-foreground mt-2">
              Learning in progress... {Math.round(videoProgress)}%
            </p>
          </div>
        )}
      </Card>

      <div className="flex justify-center gap-3 flex-wrap">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-2 bg-card rounded-full px-3 py-1.5 border shadow-sm"
            >
              <StepIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{s.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
