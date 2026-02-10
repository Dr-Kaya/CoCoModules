import { motion } from "framer-motion";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RobotMascot } from "@/components/RobotMascot";
import { modules } from "@/lib/moduleData";

export default function ModulePlaceholder() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const moduleId = parseInt(params.id || "0", 10);
  const mod = modules.find((m) => m.id === moduleId);

  if (!mod) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-background">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Module Not Found</h2>
          <Button onClick={() => navigate("/")} data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-background p-4"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="p-8 text-center max-w-lg w-full">
        <div className="w-28 h-32 mx-auto mb-4">
          <RobotMascot />
        </div>
        <Construction className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2" data-testid="text-module-placeholder-title">
          {mod.title}
        </h2>
        <p className="text-muted-foreground mb-6">
          This module is coming soon! Check back later for this exciting lesson.
        </p>
        <Button
          onClick={() => navigate("/")}
          className={`bg-gradient-to-r ${mod.gradient} text-white border-0`}
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Card>
    </motion.div>
  );
}
