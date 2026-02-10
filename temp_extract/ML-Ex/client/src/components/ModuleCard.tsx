import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Star, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProgressStore } from "@/stores/progressStore";
import type { ModuleInfo } from "@/lib/moduleData";

interface ModuleCardProps {
  module: ModuleInfo;
  index: number;
  isNext?: boolean;
}

export function ModuleCard({ module, index, isNext }: ModuleCardProps) {
  const [, navigate] = useLocation();
  const isCompleted = useProgressStore((s) => s.isModuleCompleted(module.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="relative"
    >
      {isNext && (
        <motion.div
          className="absolute -inset-1 rounded-md z-0"
          style={{
            background: "linear-gradient(135deg, #818cf8, #a855f7, #ec4899, #818cf8)",
            backgroundSize: "300% 300%",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          data-testid={`glow-next-module-${module.id}`}
        />
      )}
      <Card
        className={`relative overflow-visible p-0 border-2 ${module.borderColor} transition-transform duration-200 z-[1]`}
        data-testid={`card-module-${module.id}`}
      >
        {isCompleted && (
          <motion.div
            className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            data-testid={`badge-completed-${module.id}`}
          >
            <Star className="w-5 h-5 text-yellow-900 fill-yellow-900" />
          </motion.div>
        )}

        <div className={`h-2 w-full bg-gradient-to-r ${module.gradient} rounded-t-md`} />

        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full bg-gradient-to-br ${module.gradient} flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0`}
            >
              {module.id}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base leading-tight truncate" data-testid={`text-module-title-${module.id}`}>
                {module.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-snug mt-0.5" data-testid={`text-module-description-${module.id}`}>
                {module.description}
              </p>
            </div>
          </div>

          <Button
            className={`w-full bg-gradient-to-r ${module.gradient} text-white border-0 font-semibold`}
            onClick={() => {
              if (module.externalUrl) {
                window.open(module.externalUrl, "_blank", "noopener,noreferrer");
              } else {
                navigate(`/module/${module.id}`);
              }
            }}
            data-testid={`button-start-module-${module.id}`}
          >
            {module.externalUrl ? (
              <ExternalLink className="w-4 h-4 mr-1" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            {isCompleted ? "Play Again" : "Start"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
