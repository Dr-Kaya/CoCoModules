import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ArrowRight, Star, Home, Sparkles, CheckCircle2, Tag,
  Cat, Dog, Bug, Squirrel, Apple, Pizza, Cookie,
  Car, Heart, Circle, Footprints, Utensils, Gamepad2,
  Database, Brain, Award, BarChart3,
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

interface SortItem {
  icon: LucideIcon;
  iconColor: string;
  name: string;
  category: string;
}

const ITEMS: SortItem[] = [
  { icon: Cat, iconColor: "text-blue-500", name: "Cat", category: "animals" },
  { icon: Apple, iconColor: "text-red-500", name: "Apple", category: "food" },
  { icon: Car, iconColor: "text-orange-500", name: "Toy Car", category: "toys" },
  { icon: Dog, iconColor: "text-amber-600", name: "Dog", category: "animals" },
  { icon: Pizza, iconColor: "text-green-600", name: "Pizza", category: "food" },
  { icon: Heart, iconColor: "text-pink-500", name: "Teddy Bear", category: "toys" },
  { icon: Bug, iconColor: "text-emerald-500", name: "Frog", category: "animals" },
  { icon: Cookie, iconColor: "text-yellow-600", name: "Cookie", category: "food" },
  { icon: Circle, iconColor: "text-purple-500", name: "Ball", category: "toys" },
  { icon: Squirrel, iconColor: "text-orange-400", name: "Horse", category: "animals" },
];

const BINS = [
  { id: "animals", label: "Animals", icon: Footprints, bg: "bg-blue-100 dark:bg-blue-900/40" },
  { id: "food", label: "Food", icon: Utensils, bg: "bg-green-100 dark:bg-green-900/40" },
  { id: "toys", label: "Toys", icon: Gamepad2, bg: "bg-orange-100 dark:bg-orange-900/40" },
];

export default function Module1() {
  const [, navigate] = useLocation();
  const completeModule = useProgressStore((s) => s.completeModule);
  const { playSound } = useSoundEffects();
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sortedCount, setSortedCount] = useState(0);
  const [robotMessage, setRobotMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const currentItem = ITEMS[currentItemIndex];

  const progress =
    screen === "intro" ? 0 :
    screen === "learn" ? 10 :
    screen === "precheck" ? 20 :
    screen === "activity" || screen === "midcheck" ? 20 + sortedCount * 4 :
    screen === "results" ? 75 :
    screen === "reflection" ? 90 :
    100;

  const screenKey = screen === "activity" ? `activity-${currentItemIndex}` : screen;

  const handleSort = useCallback((binId: string) => {
    if (showFeedback) return;
    const item = ITEMS[currentItemIndex];
    const isCorrect = item.category === binId;
    const binLabel = BINS.find((b) => b.id === binId)?.label ?? binId;

    playSound(isCorrect ? "correct" : "click");

    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      setRobotMessage(`Yes! ${item.name} is ${binLabel}! Great labeling!`);
    } else {
      setRobotMessage(`Hmm, ${item.name} isn't ${binLabel}. But that's okay, keep going!`);
    }

    setShowFeedback(true);
    setSortedCount((c) => c + 1);

    setTimeout(() => {
      setShowFeedback(false);
      setRobotMessage("");
      const nextIndex = currentItemIndex + 1;
      if (nextIndex === 5) {
        setCurrentItemIndex(nextIndex);
        setScreen("midcheck");
      } else if (nextIndex < ITEMS.length) {
        setCurrentItemIndex(nextIndex);
      } else {
        setScreen("results");
      }
    }, 1800);
  }, [currentItemIndex, showFeedback, playSound]);

  const handleComplete = () => {
    completeModule(1);
    playSound("celebrate");
    setScreen("completion");
  };

  const robotMood = correctCount >= 7 ? "happy" : "thinking";

  return (
    <ModuleLayout
      moduleId={1}
      moduleTitle="Data Labeling"
      gradientClasses="bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-background"
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
            text="Hi there! I'm Sporty Bot and I need YOUR help to learn about the world. Let's sort things together!"
            color="indigo"
          />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent" data-testid="text-module1-title">
            Data Labeling
          </h1>
          <Card className="p-4 w-full max-w-md text-left" data-testid="card-learning-goals">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Learning Goals
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500 flex-shrink-0" />
                Understand what data labeling means
              </li>
              <li className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-green-500 flex-shrink-0" />
                Sort items into categories like a real data scientist
              </li>
              <li className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500 flex-shrink-0" />
                See why machines need labeled data to learn
              </li>
            </ul>
          </Card>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 text-lg px-8 font-bold"
            onClick={() => setScreen("learn")}
            data-testid="button-lets-sort"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Let's Sort!
          </Button>
        </div>
      )}

      {screen === "learn" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-learn">
          <VideoPlaceholder
            title="Watch: How Do Machines Learn From Labels?"
            steps={[
              { icon: Tag, label: "Label", desc: "Tag each item" },
              { icon: Database, label: "Collect", desc: "Gather examples" },
              { icon: Brain, label: "Train", desc: "Teach the model" },
            ]}
            onComplete={() => setScreen("precheck")}
            gradientClass="from-blue-200/40 to-indigo-200/40"
          />
        </div>
      )}

      {screen === "precheck" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-precheck">
          <div className="w-24 h-28">
            <RobotMascot mood="thinking" />
          </div>
          <QuickCheck
            question="What do you think 'labeling data' means?"
            type="multiple"
            options={[
              { value: "a", label: "Putting stickers on your computer", isCorrect: false },
              { value: "b", label: "Sorting items into groups so a machine can learn from them", isCorrect: true },
              { value: "c", label: "Deleting files you don't need", isCorrect: false },
            ]}
            feedback={{
              correct: "Exactly! Labeling data means organizing items into categories so machines can learn patterns.",
              incorrect: "Not quite! Labeling data means sorting items into groups so a machine can learn from them.",
            }}
            onAnswer={() => setScreen("activity")}
          />
        </div>
      )}

      {screen === "activity" && currentItem && (
        <div className="flex flex-col items-center gap-5" data-testid="screen-activity">
          <div className="text-sm font-semibold text-muted-foreground" role="status" data-testid="text-sort-progress">
            {sortedCount}/{ITEMS.length} items labeled
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
                  color="indigo"
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
            <Card className="p-6 text-center border-2 border-dashed border-indigo-300 dark:border-indigo-600" data-testid="card-current-item">
              <div className="flex justify-center mb-2">
                <currentItem.icon className={`w-16 h-16 ${currentItem.iconColor}`} />
              </div>
              <p className="text-xl font-bold" data-testid="text-current-item">{currentItem.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Where does this belong?</p>
            </Card>
          </motion.div>

          <div className="text-center">
            <ArrowRight className="w-5 h-5 text-muted-foreground mx-auto animate-bounce" style={{ animationDuration: "1.5s" }} />
            <p className="text-xs text-muted-foreground mt-1">Click a bin below to sort!</p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
            {BINS.map((bin) => (
              <motion.button
                key={bin.id}
                className={`${bin.bg} border-2 border-transparent rounded-2xl p-4 flex flex-col items-center gap-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px]`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSort(bin.id)}
                disabled={showFeedback}
                data-testid={`button-bin-${bin.id}`}
                aria-label={`Sort into ${bin.label}`}
              >
                <bin.icon className="w-8 h-8" />
                <span className="font-bold text-sm">{bin.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {screen === "midcheck" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-midcheck">
          <div className="w-24 h-28">
            <RobotMascot mood="thinking" />
          </div>
          <QuickCheck
            question="You're halfway there! Why is it important that humans label data carefully?"
            type="multiple"
            options={[
              { value: "a", label: "So the data looks pretty", isCorrect: false },
              { value: "b", label: "So machines learn the correct patterns", isCorrect: true },
              { value: "c", label: "It doesn't matter how you label it", isCorrect: false },
            ]}
            feedback={{
              correct: "Right! Careful labeling helps machines learn correct patterns.",
              incorrect: "Actually, careful labeling is key so machines learn the correct patterns!",
            }}
            onAnswer={() => setScreen("activity")}
          />
        </div>
      )}

      {screen === "results" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-results">
          <div className="w-32 h-36">
            <RobotMascot mood={robotMood} />
          </div>
          <SpeechBubble
            text={correctCount >= 7
              ? "Amazing job! You're a natural data labeler!"
              : "Good effort! Labeling takes practice, and you're learning!"}
            color="indigo"
          />
          <Card className="p-6 w-full max-w-md text-center" data-testid="card-results">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-extrabold">Your Results</h2>
            </div>
            <div className="text-5xl font-extrabold mb-2" data-testid="text-score">
              {correctCount}/{ITEMS.length}
            </div>
            <p className="text-muted-foreground mb-4">items correctly sorted</p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: ITEMS.length }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i < correctCount ? "bg-green-500" : "bg-muted"}`}
                />
              ))}
            </div>
          </Card>
          <Card className="p-4 w-full max-w-md border-2 border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20" data-testid="card-insight">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                Every time you sorted an item, you created a <strong>labeled example</strong>.
                Real ML engineers do the same thing to teach machines!
              </p>
            </div>
          </Card>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 font-bold"
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
            type="success"
            title="How do you feel about data labeling?"
            prompt="Think about what you learned today."
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
            text="Thank you! Now I know about Animals, Food, and Toys because YOU taught me with labeled examples!"
            color="indigo"
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
                  Machines need humans to label data before they can learn. You are the teacher!
                </p>
              </div>
            </div>
          </Card>
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 font-bold"
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
