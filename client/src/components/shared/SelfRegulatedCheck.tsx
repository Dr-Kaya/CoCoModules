import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Target, RefreshCw, Star, MessageCircle } from "lucide-react";

type CheckType = "brain" | "goal" | "strategy" | "success" | "reflection";

const typeConfig: Record<CheckType, { icon: typeof Brain; colorClass: string }> = {
  brain: { icon: Brain, colorClass: "from-purple-500/20 to-purple-600/10" },
  goal: { icon: Target, colorClass: "from-blue-500/20 to-blue-600/10" },
  strategy: { icon: RefreshCw, colorClass: "from-green-500/20 to-green-600/10" },
  success: { icon: Star, colorClass: "from-yellow-500/20 to-yellow-600/10" },
  reflection: { icon: MessageCircle, colorClass: "from-pink-500/20 to-pink-600/10" },
};

interface SelfRegulatedCheckOption {
  value: string;
  label: string;
  icon?: typeof Brain;
}

interface SelfRegulatedCheckProps {
  type: CheckType;
  title: string;
  prompt: string;
  options?: SelfRegulatedCheckOption[];
  allowText?: boolean;
  onComplete: (response: { selection?: string; text?: string }) => void;
}

export function SelfRegulatedCheck({
  type,
  title,
  prompt,
  options = [],
  allowText = false,
  onComplete,
}: SelfRegulatedCheckProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textResponse, setTextResponse] = useState("");

  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleComplete = () => {
    onComplete({
      selection: selectedOption || undefined,
      text: textResponse || undefined,
    });
  };

  const canSubmit = selectedOption || textResponse.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className={`p-6 bg-gradient-to-br ${config.colorClass} border-2 border-primary/20`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{prompt}</p>
          </div>
        </div>

        {options.length > 0 && (
          <div className="space-y-2 mb-4">
            {options.map((option) => {
              const OptionIcon = option.icon;
              return (
                <Button
                  key={option.value}
                  variant={selectedOption === option.value ? "default" : "outline"}
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => setSelectedOption(option.value)}
                  data-testid={`self-reg-${option.value}`}
                >
                  {OptionIcon && <OptionIcon className="w-5 h-5 mr-2 flex-shrink-0" />}
                  {option.label}
                </Button>
              );
            })}
          </div>
        )}

        {allowText && (
          <Textarea
            placeholder="Share your thoughts..."
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            className="mb-4 min-h-[80px]"
            data-testid="self-reg-text"
          />
        )}

        <Button
          onClick={handleComplete}
          disabled={!canSubmit}
          className="w-full"
          data-testid="self-reg-submit"
        >
          Continue
        </Button>
      </Card>
    </motion.div>
  );
}
