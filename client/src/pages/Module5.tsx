import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  ArrowRight, Home, Sparkles, CheckCircle2, Award, Sun, CloudRain, Snowflake,
  CloudDrizzle, CloudSnow, Sunrise, Umbrella, Thermometer, CloudLightning,
  Mountain, Wind, Droplets, Sunset, FlaskConical, Brain, Loader2, BarChart3,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RobotMascot } from "@/components/RobotMascot";
import { useProgressStore } from "@/stores/progressStore";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { SpeechBubble } from "@/components/shared/SpeechBubble";
import { ConfettiEffect } from "@/components/shared/ConfettiEffect";
import { useSoundEffects } from "@/components/shared/SoundEffectsProvider";
import { QuickCheck } from "@/components/shared/QuickCheck";
import { SelfRegulatedCheck } from "@/components/shared/SelfRegulatedCheck";
import { VideoPlaceholder } from "@/components/shared/VideoPlaceholder";

type Screen = "intro" | "learn" | "precheck" | "activity" | "results" | "reflection" | "completion";
type Category = "sunny" | "rainy" | "snowy";
type ActivityPhase = "training" | "testing";
interface TrainItem { icon: LucideIcon; name: string; category: Category; iconColor: string }
interface TestItem { icon: LucideIcon; name: string; actual: Category }
interface TestRecord { actual: Category; studentGuess: Category; botPrediction: Category; botCorrect: boolean }

const CATEGORIES: { id: Category; label: string; icon: LucideIcon; bg: string }[] = [
  { id: "sunny", label: "Sunny", icon: Sun, bg: "bg-yellow-100 dark:bg-yellow-900/40" },
  { id: "rainy", label: "Rainy", icon: CloudRain, bg: "bg-blue-100 dark:bg-blue-900/40" },
  { id: "snowy", label: "Snowy", icon: Snowflake, bg: "bg-cyan-100 dark:bg-cyan-900/40" },
];

const TRAIN_ITEMS: TrainItem[] = [
  { icon: Sun, name: "Bright Sun", category: "sunny", iconColor: "text-yellow-500" },
  { icon: CloudRain, name: "Heavy Rain", category: "rainy", iconColor: "text-blue-500" },
  { icon: Snowflake, name: "Snowfall", category: "snowy", iconColor: "text-cyan-400" },
  { icon: Sun, name: "Clear Sky", category: "sunny", iconColor: "text-orange-400" },
  { icon: CloudDrizzle, name: "Drizzle", category: "rainy", iconColor: "text-blue-400" },
  { icon: CloudSnow, name: "Snow Storm", category: "snowy", iconColor: "text-slate-400" },
  { icon: Sunrise, name: "Sunrise", category: "sunny", iconColor: "text-amber-500" },
  { icon: Umbrella, name: "Umbrella Day", category: "rainy", iconColor: "text-indigo-500" },
  { icon: Thermometer, name: "Freezing", category: "snowy", iconColor: "text-blue-300" },
  { icon: Sun, name: "Hazy Sun", category: "sunny", iconColor: "text-yellow-400" },
  { icon: CloudLightning, name: "Thunderstorm", category: "rainy", iconColor: "text-purple-500" },
  { icon: Mountain, name: "Snowy Peak", category: "snowy", iconColor: "text-gray-400" },
];

const TEST_ITEMS: TestItem[] = [
  { icon: Sun, name: "Warm Day", actual: "sunny" },
  { icon: CloudRain, name: "Monsoon", actual: "rainy" },
  { icon: Snowflake, name: "Frost", actual: "snowy" },
  { icon: Sunset, name: "Golden Hour", actual: "sunny" },
  { icon: Droplets, name: "Wet Morning", actual: "rainy" },
  { icon: Wind, name: "Blizzard", actual: "snowy" },
];

const BOT_PREDICTIONS: Category[] = ["sunny", "rainy", "sunny", "sunny", "sunny", "snowy"];

export default function Module5() {
  const [, navigate] = useLocation();
  const completeModule = useProgressStore((s) => s.completeModule);
  const { playSound } = useSoundEffects();
  const [screen, setScreen] = useState<Screen>("intro");
  const [activityPhase, setActivityPhase] = useState<ActivityPhase>("training");
  const [trainIndex, setTrainIndex] = useState(0);
  const [trainCorrect, setTrainCorrect] = useState(0);
  const [showTrainFeedback, setShowTrainFeedback] = useState(false);
  const [trainFeedbackMsg, setTrainFeedbackMsg] = useState("");
  const [testIndex, setTestIndex] = useState(0);
  const [testPhase, setTestPhase] = useState<"guess" | "thinking" | "revealed">("guess");
  const [studentGuess, setStudentGuess] = useState<Category | null>(null);
  const [botPrediction, setBotPrediction] = useState<Category | null>(null);
  const [testRecords, setTestRecords] = useState<TestRecord[]>([]);

  const isTrain = screen === "activity" && activityPhase === "training";
  const isTest = screen === "activity" && activityPhase === "testing";
  const progress = screen === "intro" ? 0 : screen === "learn" ? 10 : screen === "precheck" ? 20
    : isTrain ? 25 + (trainIndex / TRAIN_ITEMS.length) * 25
    : isTest ? 55 + (testIndex / TEST_ITEMS.length) * 25
    : screen === "results" ? 85 : screen === "reflection" ? 92 : 100;

  const gradientClasses = isTrain
    ? "bg-gradient-to-b from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-background"
    : isTest ? "bg-gradient-to-b from-green-50 via-emerald-50 to-teal-100 dark:from-green-950/40 dark:via-emerald-950/30 dark:to-background"
    : "bg-gradient-to-b from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/30 dark:via-purple-950/20 dark:to-background";

  const handleTrainSort = useCallback((binId: Category) => {
    if (showTrainFeedback) return;
    const item = TRAIN_ITEMS[trainIndex];
    const correct = item.category === binId;
    playSound(correct ? "correct" : "click");
    if (correct) setTrainCorrect((c) => c + 1);
    setTrainFeedbackMsg(correct ? `Yes! "${item.name}" is ${binId}!` : `Not quite — "${item.name}" is actually ${item.category}.`);
    setShowTrainFeedback(true);
    setTimeout(() => {
      setShowTrainFeedback(false);
      setTrainFeedbackMsg("");
      const next = trainIndex + 1;
      if (next >= TRAIN_ITEMS.length) setActivityPhase("testing");
      else setTrainIndex(next);
    }, 1500);
  }, [trainIndex, showTrainFeedback, playSound]);

  const handleTestGuess = useCallback((guess: Category) => {
    setStudentGuess(guess);
    setTestPhase("thinking");
    setTimeout(() => {
      const item = TEST_ITEMS[testIndex];
      const pred = BOT_PREDICTIONS[testIndex] ?? item.actual;
      setBotPrediction(pred);
      setTestRecords((prev) => [...prev, { actual: item.actual, studentGuess: guess, botPrediction: pred, botCorrect: pred === item.actual }]);
      setTestPhase("revealed");
      playSound(pred === item.actual ? "correct" : "wrong");
    }, 1000);
  }, [testIndex, playSound]);

  const nextTestItem = useCallback(() => {
    if (testIndex + 1 >= TEST_ITEMS.length) { setScreen("results"); return; }
    setTestIndex((i) => i + 1);
    setTestPhase("guess");
    setStudentGuess(null);
    setBotPrediction(null);
  }, [testIndex]);

  const handleComplete = () => { completeModule(5); playSound("celebrate"); setScreen("completion"); };

  const botCorrectCount = testRecords.filter((r) => r.botCorrect).length;
  const studentMatchCount = testRecords.filter((r) => r.studentGuess === r.botPrediction).length;
  const botAccuracy = testRecords.length > 0 ? Math.round((botCorrectCount / testRecords.length) * 100) : 0;
  const cm: Record<Category, Record<Category, number>> = {
    sunny: { sunny: 0, rainy: 0, snowy: 0 }, rainy: { sunny: 0, rainy: 0, snowy: 0 }, snowy: { sunny: 0, rainy: 0, snowy: 0 },
  };
  testRecords.forEach((r) => { cm[r.actual][r.botPrediction]++; });

  const screenKey = screen === "activity" ? `activity-${activityPhase}-${activityPhase === "training" ? trainIndex : testIndex}` : screen;

  return (
    <ModuleLayout moduleId={5} moduleTitle="Model Evaluation" gradientClasses={gradientClasses} progress={progress} screenKey={screenKey}>
      {screen === "completion" && <ConfettiEffect />}
      {isTrain && (
        <div className="flex justify-center mb-4">
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200" data-testid="badge-training-phase">TRAINING PHASE</span>
        </div>
      )}
      {isTest && (
        <div className="flex justify-center mb-4">
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200" data-testid="badge-testing-phase">TESTING PHASE</span>
        </div>
      )}

      {screen === "intro" && (
        <div className="flex flex-col items-center text-center gap-6 pt-8" data-testid="screen-intro">
          <div className="w-36 h-40"><RobotMascot mood="excited" /></div>
          <SpeechBubble text="Let's test my brain! Did I REALLY learn, or did I just memorize? Time to find out!" color="purple" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent" data-testid="text-module5-title">Model Evaluation</h1>
          <Card className="p-4 w-full max-w-md text-left" data-testid="card-learning-goals">
            <h3 className="font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" />Learning Goals</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-violet-500 flex-shrink-0" />Understand why we test AI with NEW data</li>
              <li className="flex items-center gap-2"><Brain className="w-4 h-4 text-indigo-500 flex-shrink-0" />Learn what a confusion matrix shows</li>
              <li className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-purple-500 flex-shrink-0" />Evaluate how well an AI model performs</li>
            </ul>
          </Card>
          <Button size="lg" className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white border-0 text-lg px-8 font-bold" onClick={() => setScreen("learn")} data-testid="button-enter-lab">
            <FlaskConical className="w-5 h-5 mr-2" />Enter the Lab!
          </Button>
        </div>
      )}

      {screen === "learn" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-learn">
          <VideoPlaceholder
            title="Watch: Why Do We Test AI With New Data?"
            steps={[{ icon: Brain, label: "Train", desc: "Teach with examples" }, { icon: FlaskConical, label: "Test", desc: "Use NEW data" }, { icon: BarChart3, label: "Evaluate", desc: "Check accuracy" }]}
            onComplete={() => setScreen("precheck")}
            gradientClass="from-violet-200/40 to-indigo-200/40"
          />
        </div>
      )}

      {screen === "precheck" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-precheck">
          <div className="w-24 h-28"><RobotMascot mood="thinking" /></div>
          <QuickCheck
            question="Why can't we test an AI with the same data we used to train it?"
            type="multiple"
            options={[
              { value: "a", label: "The computer might overheat", isCorrect: false },
              { value: "b", label: "It might just memorize, not truly learn", isCorrect: true },
              { value: "c", label: "It would be too easy for the AI", isCorrect: false },
            ]}
            feedback={{ correct: "Exactly! AI needs to be tested on data it hasn't seen to prove it truly learned.", incorrect: "Not quite! AI might just memorize instead of truly learning patterns." }}
            onAnswer={() => setScreen("activity")}
          />
        </div>
      )}

      {isTrain && trainIndex < TRAIN_ITEMS.length && (() => {
        const item = TRAIN_ITEMS[trainIndex];
        const Icon = item.icon;
        return (
          <div className="flex flex-col items-center gap-5" data-testid="screen-activity-training">
            <div className="text-sm font-semibold text-muted-foreground" data-testid="text-train-progress">{trainIndex}/{TRAIN_ITEMS.length} training examples sorted</div>
            <Progress value={(trainIndex / TRAIN_ITEMS.length) * 100} className="w-full max-w-md" />
            <div className="flex items-start gap-3 w-full max-w-lg">
              <div className="w-20 h-24 flex-shrink-0"><RobotMascot mood={showTrainFeedback ? (trainFeedbackMsg.includes("Yes") ? "happy" : "confused") : "thinking"} /></div>
              <AnimatePresence mode="wait">
                {trainFeedbackMsg && <SpeechBubble key={trainFeedbackMsg} text={trainFeedbackMsg} color="blue" position="left" className="flex-1 text-sm" />}
              </AnimatePresence>
            </div>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
              <Card className="p-6 text-center border-2 border-dashed border-blue-300 dark:border-blue-600" data-testid="card-train-item">
                <div className="flex justify-center mb-2"><Icon className={`w-16 h-16 ${item.iconColor}`} /></div>
                <p className="text-xl font-bold" data-testid="text-train-item-name">{item.name}</p>
                <p className="text-sm text-muted-foreground mt-1">Sort into the right category!</p>
              </Card>
            </motion.div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
              {CATEGORIES.map((cat) => (
                <motion.button key={cat.id} className={`${cat.bg} border-2 border-transparent rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 min-h-[100px]`}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleTrainSort(cat.id)} disabled={showTrainFeedback} data-testid={`button-train-${cat.id}`}>
                  <cat.icon className="w-8 h-8" /><span className="font-bold text-sm">{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      })()}

      {isTest && testIndex < TEST_ITEMS.length && (() => {
        const item = TEST_ITEMS[testIndex];
        const Icon = item.icon;
        return (
          <div className="flex flex-col items-center gap-5" data-testid="screen-activity-testing">
            <div className="text-sm font-semibold text-muted-foreground" data-testid="text-test-progress">{testIndex + (testPhase === "revealed" ? 1 : 0)}/{TEST_ITEMS.length} test items evaluated</div>
            <Progress value={((testIndex + (testPhase === "revealed" ? 1 : 0)) / TEST_ITEMS.length) * 100} className="w-full max-w-md" />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
              <Card className="p-6 text-center border-2 border-dashed border-green-300 dark:border-green-600" data-testid="card-test-item">
                <div className="flex justify-center mb-2"><Icon className="w-16 h-16 text-green-600" /></div>
                <p className="text-xl font-bold" data-testid="text-test-item-name">{item.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{testPhase === "guess" ? "What will the bot predict?" : testPhase === "thinking" ? "Bot is thinking..." : "Result:"}</p>
              </Card>
            </motion.div>
            {testPhase === "guess" && (
              <div className="flex flex-col items-center gap-3 w-full max-w-md">
                <p className="text-sm font-semibold">What do you think the bot will predict?</p>
                <div className="grid grid-cols-3 gap-3 w-full">
                  {CATEGORIES.map((cat) => (
                    <Button key={cat.id} variant="outline" className="flex-col h-auto py-3 gap-1" onClick={() => handleTestGuess(cat.id)} data-testid={`button-guess-${cat.id}`}>
                      <cat.icon className="w-6 h-6" /><span className="text-xs font-bold">{cat.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {testPhase === "thinking" && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-28"><RobotMascot mood="thinking" /></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm font-medium">Bot is analyzing...</span></div>
              </div>
            )}
            {testPhase === "revealed" && studentGuess && botPrediction && (
              <div className="flex flex-col items-center gap-3 w-full max-w-md">
                <div className="w-20 h-24"><RobotMascot mood={botPrediction === item.actual ? "happy" : "confused"} /></div>
                <Card className="p-4 w-full" data-testid="card-test-result">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-2 flex-wrap"><span className="text-muted-foreground">Actual:</span><span className="font-bold capitalize">{item.actual}</span></div>
                    <div className="flex items-center justify-between gap-2 flex-wrap"><span className="text-muted-foreground">Your guess of bot:</span><span className={`font-bold capitalize ${studentGuess === botPrediction ? "text-green-600" : "text-red-500"}`}>{studentGuess} {studentGuess === botPrediction ? "(matched!)" : "(didn't match)"}</span></div>
                    <div className="flex items-center justify-between gap-2 flex-wrap"><span className="text-muted-foreground">Bot predicted:</span><span className={`font-bold capitalize ${botPrediction === item.actual ? "text-green-600" : "text-red-500"}`}>{botPrediction} {botPrediction === item.actual ? "(correct!)" : "(wrong!)"}</span></div>
                  </div>
                </Card>
                <Button onClick={nextTestItem} className="font-bold" data-testid="button-next-test">
                  {testIndex + 1 >= TEST_ITEMS.length ? "See Results" : "Next Item"}<ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        );
      })()}

      {screen === "results" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-results">
          <div className="w-32 h-36"><RobotMascot mood={botAccuracy >= 60 ? "happy" : "confused"} /></div>
          <SpeechBubble text={botAccuracy >= 80 ? "I did great on the test!" : botAccuracy >= 50 ? "Not bad, but I got confused on some!" : "I need more training data!"} color="purple" />
          <Card className="p-6 w-full max-w-md text-center" data-testid="card-accuracy">
            <div className="flex items-center justify-center gap-3 mb-4"><BarChart3 className="w-8 h-8 text-primary" /><h2 className="text-2xl font-extrabold">Bot Accuracy</h2></div>
            <div className="text-5xl font-extrabold mb-2" data-testid="text-bot-accuracy">{botAccuracy}%</div>
            <p className="text-muted-foreground mb-2">{botCorrectCount}/{testRecords.length} correct predictions</p>
            <p className="text-sm text-muted-foreground">You predicted the bot's behavior {studentMatchCount}/{testRecords.length} times</p>
          </Card>
          <Card className="p-4 w-full max-w-md" data-testid="card-confusion-matrix">
            <h3 className="font-bold text-center mb-3 flex items-center justify-center gap-2"><FlaskConical className="w-5 h-5 text-violet-500" />Confusion Matrix</h3>
            <p className="text-xs text-muted-foreground text-center mb-3">Rows = Actual, Columns = Bot Predicted</p>
            <div className="grid grid-cols-4 gap-1 text-center text-xs font-semibold">
              <div />
              {CATEGORIES.map((c) => <div key={c.id} className="py-1 capitalize">{c.label}</div>)}
              {CATEGORIES.map((row) => (
                <div key={row.id} className="contents">
                  <div className="py-2 capitalize font-bold text-left">{row.label}</div>
                  {CATEGORIES.map((col) => {
                    const val = cm[row.id][col.id];
                    const ok = row.id === col.id;
                    return (
                      <div key={`${row.id}-${col.id}`} data-testid={`matrix-${row.id}-${col.id}`}
                        className={`py-2 rounded-md font-bold ${val > 0 ? ok ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200" : "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200" : "bg-muted text-muted-foreground"}`}>{val}</div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4 w-full max-w-md border-2 border-violet-200 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/20" data-testid="card-insight">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">The confusion matrix shows <strong>where</strong> the bot gets confused. Green = correct, red = mistakes!</p>
            </div>
          </Card>
          <Button size="lg" className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white border-0 font-bold" onClick={() => setScreen("reflection")} data-testid="button-continue-reflection">
            Continue<ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {screen === "reflection" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-reflection">
          <div className="w-24 h-28"><RobotMascot mood="happy" /></div>
          <SelfRegulatedCheck type="goal" title="Model Evaluation Check" prompt="How well do you understand testing AI models?"
            options={[{ value: "still-learning", label: "Still learning about it" }, { value: "getting-it", label: "I understand the basics!" }, { value: "got-it", label: "I can explain train vs test data!" }]}
            onComplete={() => handleComplete()} />
        </div>
      )}

      {screen === "completion" && (
        <div className="flex flex-col items-center gap-6 pt-6" data-testid="screen-completion">
          <motion.div className="w-36 h-40" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.6, delay: 0.3 }}><RobotMascot mood="celebrating" /></motion.div>
          <SpeechBubble text="You learned how to evaluate AI models like a real scientist!" color="purple" />
          <motion.div className="flex items-center gap-2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }}>
            <Award className="w-10 h-10 text-yellow-500" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent" data-testid="text-badge-earned">Badge Earned!</span>
            <Award className="w-10 h-10 text-yellow-500" />
          </motion.div>
          <Card className="p-6 w-full max-w-lg border-2 border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/20" data-testid="card-key-takeaway">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div><h3 className="font-bold text-lg mb-1">Key Takeaway</h3><p className="text-base text-foreground" data-testid="text-key-takeaway">Testing with NEW data shows if AI truly learned!</p></div>
            </div>
          </Card>
          <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 font-bold" onClick={() => navigate("/")} data-testid="button-back-to-home">
            <Home className="w-5 h-5 mr-2" />Back to Home
          </Button>
        </div>
      )}
    </ModuleLayout>
  );
}
