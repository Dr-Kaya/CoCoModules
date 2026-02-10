import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ArrowRight, Home, Sparkles, CheckCircle2,
  Apple, Cookie, Carrot, Cake, Leaf, IceCreamCone,
  Cherry, Candy, Citrus, CupSoda, Banana, Donut,
  Heart, ShieldCheck, BarChart3, Award, Brain, Star,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RobotMascot } from "@/components/RobotMascot";
import { useProgressStore } from "@/stores/progressStore";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { SpeechBubble } from "@/components/shared/SpeechBubble";
import { ConfettiEffect } from "@/components/shared/ConfettiEffect";
import { useSoundEffects } from "@/components/shared/SoundEffectsProvider";
import { QuickCheck } from "@/components/shared/QuickCheck";
import { SelfRegulatedCheck } from "@/components/shared/SelfRegulatedCheck";
import { VideoPlaceholder } from "@/components/shared/VideoPlaceholder";

type Screen = "intro" | "learn" | "precheck" | "activity" | "midcheck" | "results" | "reflection" | "completion";

interface FoodItem {
  icon: LucideIcon;
  name: string;
  category: "healthy" | "treat";
  iconColor: string;
}

const FOOD_ITEMS: FoodItem[] = [
  { icon: Apple, name: "Apple", category: "healthy", iconColor: "text-red-500" },
  { icon: Cookie, name: "Cookie", category: "treat", iconColor: "text-yellow-600" },
  { icon: Carrot, name: "Carrot", category: "healthy", iconColor: "text-orange-500" },
  { icon: Cake, name: "Cake", category: "treat", iconColor: "text-pink-500" },
  { icon: Leaf, name: "Salad", category: "healthy", iconColor: "text-green-500" },
  { icon: IceCreamCone, name: "Ice Cream", category: "treat", iconColor: "text-blue-400" },
  { icon: Cherry, name: "Cherry", category: "healthy", iconColor: "text-red-600" },
  { icon: Candy, name: "Candy", category: "treat", iconColor: "text-purple-500" },
  { icon: Citrus, name: "Orange", category: "healthy", iconColor: "text-orange-400" },
  { icon: CupSoda, name: "Soda", category: "treat", iconColor: "text-cyan-500" },
  { icon: Banana, name: "Banana", category: "healthy", iconColor: "text-yellow-500" },
  { icon: Donut, name: "Donut", category: "treat", iconColor: "text-amber-600" },
];

export default function Module2() {
  const [, navigate] = useLocation();
  const completeModule = useProgressStore((s) => s.completeModule);
  const { playSound } = useSoundEffects();
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [classifiedCount, setClassifiedCount] = useState(0);
  const [robotMessage, setRobotMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const currentItem = FOOD_ITEMS[currentItemIndex];
  const userAccuracy = Math.round((correctCount / FOOD_ITEMS.length) * 100);
  const botAccuracy = Math.min(95, Math.max(50, 60 + correctCount * 3));

  const progress =
    screen === "intro" ? 0 :
    screen === "learn" ? 10 :
    screen === "precheck" ? 20 :
    screen === "activity" || screen === "midcheck" ? 20 + classifiedCount * 4 :
    screen === "results" ? 75 :
    screen === "reflection" ? 90 :
    100;

  const screenKey = screen === "activity" ? `activity-${currentItemIndex}` : screen;

  const handleClassify = useCallback((choice: "healthy" | "treat") => {
    if (showFeedback) return;
    const item = FOOD_ITEMS[currentItemIndex];
    const isCorrect = item.category === choice;
    const choiceLabel = choice === "healthy" ? "Healthy" : "Treat";

    playSound(isCorrect ? "correct" : "click");

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setRobotMessage(`Yes! ${item.name} is a ${choiceLabel}! Nice classifying!`);
    } else {
      const correctLabel = item.category === "healthy" ? "Healthy" : "Treat";
      setRobotMessage(`Hmm, ${item.name} is actually ${correctLabel}. Keep going!`);
    }

    setShowFeedback(true);
    setClassifiedCount((c) => c + 1);

    setTimeout(() => {
      setShowFeedback(false);
      setRobotMessage("");
      const nextIndex = currentItemIndex + 1;
      if (nextIndex === 6) {
        setCurrentItemIndex(nextIndex);
        setScreen("midcheck");
      } else if (nextIndex < FOOD_ITEMS.length) {
        setCurrentItemIndex(nextIndex);
      } else {
        setScreen("results");
      }
    }, 1800);
  }, [currentItemIndex, showFeedback, playSound]);

  const handleComplete = () => {
    completeModule(2);
    playSound("celebrate");
    setScreen("completion");
  };

  return (
    <ModuleLayout
      moduleId={2}
      moduleTitle="Binary Classification"
      gradientClasses="bg-gradient-to-b from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-background"
      progress={progress}
      screenKey={screenKey}
    >
      {screen === "completion" && <ConfettiEffect />}

      {screen === "intro" && (
        <div className="flex flex-col items-center text-center gap-6 pt-8" data-testid="screen-intro">
          <div className="w-36 h-40">
            <RobotMascot mood="excited" />
          </div>
          <SpeechBubble
            text="Time to learn about binary classification! That means sorting things into exactly TWO groups. Let's do it!"
            color="emerald"
          />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent" data-testid="text-module2-title">
            Binary Classification
          </h1>
          <Card className="p-4 w-full max-w-md text-left" data-testid="card-learning-goals">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Learning Goals
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Understand what binary classification means
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-500 flex-shrink-0" />
                Sort food into Healthy vs. Treat categories
              </li>
              <li className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                See how your labels help a bot learn two categories
              </li>
            </ul>
          </Card>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 text-lg px-8 font-bold"
            onClick={() => setScreen("learn")}
            data-testid="button-lets-classify"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Let's Classify!
          </Button>
        </div>
      )}

      {screen === "learn" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-learn">
          <VideoPlaceholder
            title="Watch: What is Binary Classification?"
            steps={[
              { icon: ShieldCheck, label: "Two Groups", desc: "Pick one of two" },
              { icon: Heart, label: "Examples", desc: "Healthy or Treat" },
              { icon: Brain, label: "Train", desc: "Teach the model" },
            ]}
            onComplete={() => setScreen("precheck")}
            gradientClass="from-emerald-200/40 to-teal-200/40"
          />
        </div>
      )}

      {screen === "precheck" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-precheck">
          <div className="w-24 h-28">
            <RobotMascot mood="thinking" />
          </div>
          <QuickCheck
            question="What does 'binary' mean?"
            type="multiple"
            options={[
              { value: "a", label: "Many choices", isCorrect: false },
              { value: "b", label: "Two choices", isCorrect: true },
              { value: "c", label: "No choices", isCorrect: false },
            ]}
            feedback={{
              correct: "That's right! Binary means two. Binary classification sorts things into exactly two groups.",
              incorrect: "Not quite! Binary means two. Binary classification sorts things into exactly two groups.",
            }}
            onAnswer={() => setScreen("activity")}
          />
        </div>
      )}

      {screen === "activity" && currentItem && (
        <div className="flex flex-col items-center gap-5" data-testid="screen-activity">
          <div className="text-sm font-semibold text-muted-foreground" role="status" data-testid="text-classify-progress">
            {classifiedCount}/{FOOD_ITEMS.length} items classified
          </div>

          <div className="flex items-start gap-4 w-full max-w-lg">
            <div className="w-20 h-24 flex-shrink-0">
              <RobotMascot mood={showFeedback ? (robotMessage.includes("Yes") ? "happy" : "thinking") : "thinking"} />
            </div>
            <AnimatePresence mode="wait">
              {robotMessage && (
                <SpeechBubble
                  key={robotMessage}
                  text={robotMessage}
                  color="emerald"
                  position="left"
                  className="flex-1 text-sm"
                />
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Card className="p-6 text-center border-2 border-dashed border-emerald-300 dark:border-emerald-600" data-testid="card-current-item">
              <div className="flex justify-center mb-2">
                <currentItem.icon className={`w-16 h-16 ${currentItem.iconColor}`} />
              </div>
              <p className="text-xl font-bold" data-testid="text-current-item">{currentItem.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Is this Healthy or a Treat?</p>
            </Card>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <motion.button
              className="bg-green-100 dark:bg-green-900/40 border-2 border-transparent rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[100px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClassify("healthy")}
              disabled={showFeedback}
              data-testid="button-healthy"
              aria-label="Classify as Healthy"
            >
              <Leaf className="w-8 h-8 text-green-600" />
              <span className="font-bold text-sm">Healthy</span>
            </motion.button>
            <motion.button
              className="bg-pink-100 dark:bg-pink-900/40 border-2 border-transparent rounded-2xl p-5 flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[100px]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClassify("treat")}
              disabled={showFeedback}
              data-testid="button-treat"
              aria-label="Classify as Treat"
            >
              <Cake className="w-8 h-8 text-pink-500" />
              <span className="font-bold text-sm">Treat</span>
            </motion.button>
          </div>
        </div>
      )}

      {screen === "midcheck" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-midcheck">
          <div className="w-24 h-28">
            <RobotMascot mood="thinking" />
          </div>
          <QuickCheck
            question="Halfway there! In binary classification, how many groups do we sort things into?"
            type="multiple"
            options={[
              { value: "a", label: "One group", isCorrect: false },
              { value: "b", label: "Exactly two groups", isCorrect: true },
              { value: "c", label: "As many as we want", isCorrect: false },
            ]}
            feedback={{
              correct: "Exactly! Binary means two groups. You're doing great!",
              incorrect: "Remember, binary means two! We always sort into exactly two groups.",
            }}
            onAnswer={() => setScreen("activity")}
          />
        </div>
      )}

      {screen === "results" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-results">
          <div className="w-32 h-36">
            <RobotMascot mood={correctCount >= 9 ? "happy" : "thinking"} />
          </div>
          <SpeechBubble
            text={correctCount >= 9
              ? "Wow, amazing classification skills! You really know your food groups!"
              : "Good effort! Binary classification gets easier with practice!"}
            color="emerald"
          />
          <Card className="p-6 w-full max-w-md text-center" data-testid="card-results">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-extrabold">Your Results</h2>
            </div>
            <div className="text-5xl font-extrabold mb-2" data-testid="text-score">
              {correctCount}/{FOOD_ITEMS.length}
            </div>
            <p className="text-muted-foreground mb-4">items correctly classified</p>

            <div className="space-y-3 text-left">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 text-emerald-500" />
                    Your Accuracy
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400" data-testid="text-user-accuracy">{userAccuracy}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${userAccuracy}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-semibold flex items-center gap-1">
                    <Brain className="w-4 h-4 text-teal-500" />
                    Bot Accuracy
                  </span>
                  <span className="font-bold text-teal-600 dark:text-teal-400" data-testid="text-bot-accuracy">{botAccuracy}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${botAccuracy}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4 w-full max-w-md border-2 border-emerald-200 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20" data-testid="card-insight">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                The bot learned from <strong>your labels</strong>! The more correct labels you give, the better the bot gets at sorting into two groups.
              </p>
            </div>
          </Card>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 font-bold"
            onClick={() => setScreen("reflection")}
            data-testid="button-continue-reflection"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {screen === "reflection" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-reflection">
          <div className="w-24 h-28">
            <RobotMascot mood="happy" />
          </div>
          <SelfRegulatedCheck
            type="brain"
            title="Reflect on Binary Classification"
            prompt="How well do you understand sorting things into two groups?"
            options={[
              { value: "still-learning", label: "Still learning" },
              { value: "getting-it", label: "Getting it!" },
              { value: "got-it", label: "I totally get it!" },
            ]}
            onComplete={() => handleComplete()}
          />
        </div>
      )}

      {screen === "completion" && (
        <div className="flex flex-col items-center gap-6 pt-6" data-testid="screen-completion">
          <motion.div
            className="w-36 h-40"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <RobotMascot mood="celebrating" />
          </motion.div>
          <SpeechBubble
            text="You did it! Now I can sort food into Healthy and Treat because YOU taught me with binary classification!"
            color="emerald"
          />
          <motion.div
            className="flex items-center gap-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }}
          >
            <Award className="w-10 h-10 text-yellow-500" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent" data-testid="text-badge-earned">
              Badge Earned!
            </span>
            <Award className="w-10 h-10 text-yellow-500" />
          </motion.div>
          <Card className="p-6 w-full max-w-lg border-2 border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/20" data-testid="card-key-takeaway">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">Key Takeaway</h3>
                <p className="text-base text-foreground" data-testid="text-key-takeaway">
                  Binary classification sorts things into exactly two groups!
                </p>
              </div>
            </div>
          </Card>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 font-bold"
            onClick={() => navigate("/")}
            data-testid="button-back-to-home"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>
      )}
    </ModuleLayout>
  );
}
