import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Search, Home, Cat, Dog, CheckCircle2, ArrowRight,
  Award, Brain, TrendingUp, Database, FlaskConical,
  HelpCircle, type LucideIcon,
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

type Phase = "intro" | "learn" | "precheck" | "activity" | "results" | "reflection" | "completion";
type ActivityStep = "collect" | "train" | "predict";

interface TrainingCard {
  id: number;
  type: "cat" | "dog";
  icon: LucideIcon;
  collected: boolean;
}

interface PredictionItem {
  id: number;
  type: "cat" | "dog";
  icon: LucideIcon;
  predicted: "cat" | "dog";
  correct: boolean;
}

const ROUNDS = [
  { total: 5, cats: 3, dogs: 2, baseAcc: 55, variance: 8 },
  { total: 15, cats: 8, dogs: 7, baseAcc: 75, variance: 5 },
  { total: 30, cats: 15, dogs: 15, baseAcc: 90, variance: 4 },
];

function buildCards(cats: number, dogs: number): TrainingCard[] {
  const cards: TrainingCard[] = [];
  let id = 0;
  for (let i = 0; i < cats; i++) cards.push({ id: id++, type: "cat", icon: Cat, collected: false });
  for (let i = 0; i < dogs; i++) cards.push({ id: id++, type: "dog", icon: Dog, collected: false });
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function buildPredictions(accuracy: number): PredictionItem[] {
  const items: PredictionItem[] = [];
  const types: ("cat" | "dog")[] = ["cat", "dog", "cat", "dog", "cat", "dog"];
  for (let i = 0; i < 6; i++) {
    const t = types[i];
    const correct = Math.random() * 100 < accuracy;
    items.push({
      id: i,
      type: t,
      icon: t === "cat" ? Cat : Dog,
      predicted: correct ? t : (t === "cat" ? "dog" : "cat"),
      correct,
    });
  }
  return items;
}

function AccuracyMeter({ accuracy }: { accuracy: number }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;
  const color = accuracy >= 85 ? "#10B981" : accuracy >= 70 ? "#3B82F6" : "#F59E0B";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" strokeWidth="8" stroke="currentColor" className="text-muted/20" fill="none" />
          <motion.circle cx="50" cy="50" r="45" strokeWidth="8" stroke={color} fill="none"
            strokeLinecap="round" initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }} style={{ strokeDasharray: circumference }}
            transition={{ duration: 1.5, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span className="text-xl font-extrabold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            {accuracy}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-semibold text-muted-foreground">Final Accuracy</span>
    </div>
  );
}

export default function Module4() {
  const [, navigate] = useLocation();
  const completeModule = useProgressStore((s) => s.completeModule);
  const { playSound } = useSoundEffects();

  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [activityStep, setActivityStep] = useState<ActivityStep>("collect");
  const [cards, setCards] = useState<TrainingCard[]>(() => buildCards(ROUNDS[0].cats, ROUNDS[0].dogs));
  const [trainProgress, setTrainProgress] = useState(0);
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [roundAccuracies, setRoundAccuracies] = useState<number[]>([]);
  const [showBetweenCheck, setShowBetweenCheck] = useState(false);

  const allCollected = cards.every((c) => c.collected);
  const roundConfig = ROUNDS[round];

  const progress = phase === "intro" ? 0 : phase === "learn" ? 10 : phase === "precheck" ? 20
    : phase === "activity" ? 25 + round * 20 + (activityStep === "collect" ? 0 : activityStep === "train" ? 8 : 15)
    : phase === "results" ? 85 : phase === "reflection" ? 93 : 100;

  const screenKey = phase === "activity" ? `activity-${round}-${activityStep}` : phase;

  const collectCard = useCallback((id: number) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, collected: true } : c));
    playSound("click");
  }, [playSound]);

  const startTraining = useCallback(() => {
    setActivityStep("train");
    setTrainProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 12 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        const acc = roundConfig.baseAcc + Math.round((Math.random() - 0.5) * 2 * roundConfig.variance);
        const preds = buildPredictions(acc);
        setPredictions(preds);
        setRoundAccuracies((prev) => [...prev, acc]);
        setTimeout(() => {
          setActivityStep("predict");
          playSound("correct");
        }, 500);
      }
      setTrainProgress(Math.min(p, 100));
    }, 150);
  }, [roundConfig, playSound]);

  const advanceRound = useCallback(() => {
    if (round < 2) {
      setShowBetweenCheck(true);
    } else {
      setPhase("results");
    }
  }, [round]);

  const goNextRound = useCallback(() => {
    const next = round + 1;
    setRound(next);
    setCards(buildCards(ROUNDS[next].cats, ROUNDS[next].dogs));
    setActivityStep("collect");
    setTrainProgress(0);
    setPredictions([]);
    setShowBetweenCheck(false);
  }, [round]);

  const handleComplete = () => {
    completeModule(4);
    playSound("celebrate");
    setPhase("completion");
  };

  const gradientClasses = "bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-background";

  return (
    <ModuleLayout moduleId={4} moduleTitle="The Data Detective" gradientClasses={gradientClasses} progress={progress} screenKey={screenKey}>
      {phase === "completion" && <ConfettiEffect />}

      {phase === "intro" && (
        <div className="flex flex-col items-center text-center gap-6 pt-8" data-testid="screen-intro">
          <div className="w-36 h-40"><RobotMascot mood="excited" /></div>
          <SpeechBubble text="I'm a Data Detective! Let's investigate how more and better data helps AI learn. Ready to crack the case?" color="orange" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent" data-testid="text-module4-title">
            The Data Detective
          </h1>
          <Card className="p-4 w-full max-w-md text-left" data-testid="card-learning-goals">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              Learning Goals
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Database className="w-4 h-4 text-amber-500 flex-shrink-0" />More data helps AI learn better</li>
              <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" />Balanced data improves accuracy</li>
              <li className="flex items-center gap-2"><Brain className="w-4 h-4 text-yellow-600 flex-shrink-0" />Variety in data matters too</li>
            </ul>
          </Card>
          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 text-lg px-8 font-bold"
            onClick={() => setPhase("learn")} data-testid="button-start-investigation">
            <Search className="w-5 h-5 mr-2" />Start Investigation!
          </Button>
        </div>
      )}

      {phase === "learn" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-learn">
          <VideoPlaceholder
            title="Watch: Why Data Quantity & Quality Matter for AI"
            steps={[
              { icon: Database, label: "Collect", desc: "Gather examples" },
              { icon: TrendingUp, label: "More Data", desc: "Improve accuracy" },
              { icon: Brain, label: "Train", desc: "Teach the model" },
              { icon: FlaskConical, label: "Test", desc: "Check results" },
            ]}
            onComplete={() => setPhase("precheck")}
            gradientClass="from-amber-200/40 to-orange-200/40"
          />
        </div>
      )}

      {phase === "precheck" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-precheck">
          <div className="w-24 h-28"><RobotMascot mood="thinking" /></div>
          <QuickCheck
            question="If you're teaching a friend what a dog looks like, what would help most?"
            type="multiple"
            options={[
              { value: "a", label: "Showing just one photo of a dog", isCorrect: false },
              { value: "b", label: "Showing many different dogs of all shapes and sizes", isCorrect: true },
              { value: "c", label: "Describing a dog with words only", isCorrect: false },
            ]}
            feedback={{
              correct: "Exactly! Seeing many different examples helps build a better understanding.",
              incorrect: "Not quite! Showing many different dogs gives the best variety of examples to learn from.",
            }}
            onAnswer={() => { setPhase("activity"); setActivityStep("collect"); }}
            icon={HelpCircle}
          />
        </div>
      )}

      {phase === "activity" && !showBetweenCheck && (
        <div className="flex flex-col gap-5" data-testid="screen-activity">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-extrabold">Round {round + 1} of 3</h2>
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200" data-testid="text-round-info">
              {roundConfig.total} training examples
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-16 h-20 flex-shrink-0"><RobotMascot mood={activityStep === "predict" ? "happy" : "thinking"} /></div>
            <SpeechBubble
              text={activityStep === "collect" ? `Click each card to collect training data! We have ${roundConfig.cats} cats and ${roundConfig.dogs} dogs.`
                : activityStep === "train" ? "Training my brain with your data..."
                : `I tried to classify 6 new animals. Let's see how I did with ${roundConfig.total} training examples!`}
              color="orange" position="left" className="flex-1 text-sm"
            />
          </div>

          {activityStep === "collect" && (
            <>
              <div className="text-center text-sm text-muted-foreground" data-testid="text-collect-progress">
                {cards.filter((c) => c.collected).length} / {cards.length} collected
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-w-lg mx-auto">
                {cards.map((card) => (
                  <motion.button
                    key={card.id}
                    className={`aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors
                      ${card.collected
                        ? "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-600"
                        : "bg-muted/50 border-muted-foreground/20 hover-elevate"}`}
                    onClick={() => !card.collected && collectCard(card.id)}
                    whileTap={{ scale: 0.9 }}
                    data-testid={`card-${card.id}`}
                    disabled={card.collected}
                    aria-label={card.collected ? `${card.type} collected` : "Click to collect"}
                  >
                    {card.collected ? (
                      <motion.div initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} transition={{ duration: 0.3 }}>
                        <card.icon className={`w-6 h-6 ${card.type === "cat" ? "text-blue-500" : "text-amber-600"}`} />
                      </motion.div>
                    ) : (
                      <HelpCircle className="w-5 h-5 text-muted-foreground/40" />
                    )}
                  </motion.button>
                ))}
              </div>
              {allCollected && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 font-bold"
                    onClick={startTraining} data-testid="button-train">
                    <Brain className="w-4 h-4 mr-2" />Train the Bot!
                  </Button>
                </motion.div>
              )}
            </>
          )}

          {activityStep === "train" && (
            <Card className="p-6 text-center">
              <Brain className="w-12 h-12 mx-auto mb-3 text-amber-500 animate-pulse" />
              <p className="text-base font-semibold mb-3">Training with {roundConfig.total} examples...</p>
              <Progress value={trainProgress} className="w-full max-w-xs mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">{Math.round(trainProgress)}%</p>
            </Card>
          )}

          {activityStep === "predict" && (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-lg mx-auto">
                {predictions.map((p, i) => (
                  <motion.div key={p.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                    className={`p-3 rounded-lg border-2 text-center ${p.correct
                      ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600"
                      : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600"}`}
                    data-testid={`prediction-${p.id}`}
                  >
                    <p.icon className={`w-8 h-8 mx-auto ${p.type === "cat" ? "text-blue-500" : "text-amber-600"}`} />
                    <p className="text-xs font-bold mt-1">{p.correct ? "Correct" : "Wrong"}</p>
                  </motion.div>
                ))}
              </div>
              <Card className="p-4 text-center border-2 border-amber-200 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-900/20">
                <p className="text-lg font-extrabold" data-testid="text-round-accuracy">
                  Round {round + 1} Accuracy: {roundAccuracies[round]}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {round === 0 ? "Not great with only a few examples..." : round === 1 ? "Better! More data is helping!" : "Excellent! Lots of balanced data works great!"}
                </p>
              </Card>
              <div className="flex justify-center">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 font-bold"
                  onClick={advanceRound} data-testid="button-next-round">
                  {round < 2 ? "Next Round" : "See Results"}<ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {phase === "activity" && showBetweenCheck && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-between-check">
          <div className="w-24 h-28"><RobotMascot mood="thinking" /></div>
          <QuickCheck
            question={`I got ${roundAccuracies[round]}% accuracy with ${ROUNDS[round].total} examples. Will more data help me do better?`}
            type="prediction"
            options={[
              { value: "yes", label: "Yes! More examples will help the bot learn better" },
              { value: "maybe", label: "Maybe, but it depends on the data quality" },
              { value: "no", label: "No, the bot already knows enough" },
            ]}
            onAnswer={() => goNextRound()}
            icon={TrendingUp}
          />
        </div>
      )}

      {phase === "results" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-results">
          <div className="w-32 h-36"><RobotMascot mood="celebrating" /></div>
          <SpeechBubble text="Look at the difference more data makes! The evidence is clear!" color="orange" />
          <Card className="p-6 w-full max-w-md" data-testid="card-bar-chart">
            <h3 className="text-lg font-extrabold text-center mb-4">Accuracy Comparison</h3>
            <div className="flex items-end justify-center gap-6 h-[240px]">
              {roundAccuracies.map((acc, i) => {
                const barHeight = Math.max((acc / 100) * 200, 20);
                const colors = ["bg-amber-400", "bg-orange-500", "bg-green-500"];
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <motion.div className="text-lg font-extrabold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.3 + 0.5 }}>
                      {acc}%
                    </motion.div>
                    <div className="relative w-16 h-[200px] flex items-end">
                      <motion.div className={`w-full ${colors[i]} rounded-t-lg`} initial={{ height: 0 }}
                        animate={{ height: barHeight }} transition={{ duration: 1, delay: i * 0.3 }} />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold">Round {i + 1}</div>
                      <div className="text-xs text-muted-foreground">{ROUNDS[i].total} examples</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          {roundAccuracies.length === 3 && <AccuracyMeter accuracy={roundAccuracies[2]} />}
          <Card className="p-4 w-full max-w-md border-2 border-amber-200 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-900/20" data-testid="card-insight">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                With <strong>5 examples</strong> the bot struggled. With <strong>30 balanced examples</strong> it did much better!
                More and better data leads to higher accuracy.
              </p>
            </div>
          </Card>
          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 font-bold"
            onClick={() => setPhase("reflection")} data-testid="button-continue-reflection">
            Continue<ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {phase === "reflection" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-reflection">
          <div className="w-24 h-28"><RobotMascot mood="happy" /></div>
          <SelfRegulatedCheck
            type="strategy"
            title="Data Quality Detective"
            prompt="What did you learn about training data?"
            options={[
              { value: "more-data", label: "More data always helps AI learn better" },
              { value: "balanced", label: "Balanced, varied data is most important" },
              { value: "both", label: "Both quantity AND quality matter together" },
            ]}
            onComplete={() => handleComplete()}
          />
        </div>
      )}

      {phase === "completion" && (
        <div className="flex flex-col items-center gap-6 pt-6" data-testid="screen-completion">
          <motion.div className="w-36 h-40" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.6, delay: 0.3 }}>
            <RobotMascot mood="celebrating" />
          </motion.div>
          <SpeechBubble text="Case closed! You proved that more and better data makes me smarter. You're an amazing detective!" color="orange" />
          <motion.div className="flex items-center gap-2" initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }}>
            <Award className="w-10 h-10 text-yellow-500" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent" data-testid="text-badge-earned">
              Badge Earned!
            </span>
            <Award className="w-10 h-10 text-yellow-500" />
          </motion.div>
          <Card className="p-6 w-full max-w-lg border-2 border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/20" data-testid="card-key-takeaway">
            <div className="flex items-start gap-3">
              <Search className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">Key Takeaway</h3>
                <p className="text-base text-foreground" data-testid="text-key-takeaway">
                  More and better data makes AI learn better!
                </p>
              </div>
            </div>
          </Card>
          <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 font-bold"
            onClick={() => navigate("/")} data-testid="button-back-to-home">
            <Home className="w-5 h-5 mr-2" />Back to Home
          </Button>
        </div>
      )}
    </ModuleLayout>
  );
}
