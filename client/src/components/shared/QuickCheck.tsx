import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";

interface QuickCheckOption {
  value: string;
  label: string;
  isCorrect?: boolean;
}

interface QuickCheckProps {
  question: string;
  type: "multiple" | "thumbs" | "prediction";
  options?: QuickCheckOption[];
  onAnswer: (answer: string) => void;
  feedback?: { correct: string; incorrect: string };
  icon?: typeof HelpCircle;
}

export function QuickCheck({
  question,
  type,
  options = [],
  onAnswer,
  feedback,
  icon: Icon = HelpCircle,
}: QuickCheckProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (value: string, correct?: boolean) => {
    setSelectedAnswer(value);
    setIsCorrect(correct ?? true);
    setShowFeedback(true);
    setTimeout(() => {
      onAnswer(value);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="p-6 border-2 border-primary/30">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground leading-relaxed" data-testid="text-quickcheck-question">
            {question}
          </h3>
        </div>

        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div
              key="options"
              className="space-y-3"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {type === "multiple" &&
                options.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 text-base"
                      onClick={() =>
                        handleSelect(option.value, option.isCorrect)
                      }
                      data-testid={`option-${option.value}`}
                    >
                      <span className="mr-3 text-muted-foreground">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option.label}
                    </Button>
                  </motion.div>
                ))}

              {type === "thumbs" && (
                <div className="flex justify-center gap-6">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-col h-auto py-4 px-8"
                    onClick={() => handleSelect("yes", true)}
                    data-testid="thumbs-up"
                  >
                    <ThumbsUp className="w-8 h-8 text-primary mb-2" />
                    <span>Yes</span>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-col h-auto py-4 px-8"
                    onClick={() => handleSelect("no", true)}
                    data-testid="thumbs-down"
                  >
                    <ThumbsDown className="w-8 h-8 text-muted-foreground mb-2" />
                    <span>No</span>
                  </Button>
                </div>
              )}

              {type === "prediction" &&
                options.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-4 text-base"
                      onClick={() => handleSelect(option.value, true)}
                      data-testid={`prediction-${option.value}`}
                    >
                      {option.label}
                    </Button>
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl flex items-center gap-3 ${
                isCorrect
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200"
              }`}
            >
              {isCorrect ? (
                <Check className="w-6 h-6 flex-shrink-0" />
              ) : (
                <X className="w-6 h-6 flex-shrink-0" />
              )}
              <p className="font-medium">
                {isCorrect
                  ? feedback?.correct || "Great thinking!"
                  : feedback?.incorrect || "Keep learning!"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
