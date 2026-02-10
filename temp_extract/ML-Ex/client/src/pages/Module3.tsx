import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Sparkles, Home, CheckCircle2, Circle, Triangle, Brain, Scale,
  BarChart3, ArrowRight, Award, Plus, AlertTriangle, Zap,
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
type ActivityPhase = "biased-collect" | "biased-train" | "biased-predict" | "fair-collect" | "fair-train" | "fair-predict";

interface Prediction { shape: "circle" | "triangle"; icon: LucideIcon; correct: boolean }

function simulate(circleAcc: number, triAcc: number): Prediction[] {
  const items: { shape: "circle" | "triangle"; icon: LucideIcon }[] = [
    { shape: "circle", icon: Circle }, { shape: "triangle", icon: Triangle },
    { shape: "circle", icon: Circle }, { shape: "triangle", icon: Triangle },
    { shape: "circle", icon: Circle }, { shape: "triangle", icon: Triangle },
  ];
  return items.map((it) => ({ ...it, correct: Math.random() < (it.shape === "circle" ? circleAcc : triAcc) }));
}

function acc(preds: Prediction[], shape: "circle" | "triangle") {
  const r = preds.filter((p) => p.shape === shape);
  return r.length ? Math.round((r.filter((p) => p.correct).length / r.length) * 100) : 0;
}

function ShapeCounter({ shape, icon: Icon, color, count, max, onAdd, testId }: {
  shape: string; icon: LucideIcon; color: string; count: number; max: number; onAdd: () => void; testId: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="font-bold text-sm">{shape}s</span>
      </div>
      <div className="flex gap-1 flex-wrap justify-center min-h-[32px]">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Icon className={`w-6 h-6 ${color} opacity-70`} />
          </motion.div>
        ))}
      </div>
      <span className="text-xs text-muted-foreground" data-testid={`text-${testId}`}>{count}/{max}</span>
      <Button size="sm" variant="outline" onClick={onAdd} disabled={count >= max} data-testid={`button-add-${testId}`}>
        <Plus className="w-4 h-4 mr-1" /> Add {shape}
      </Button>
    </div>
  );
}

function PredGrid({ preds, prefix }: { preds: Prediction[]; prefix: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {preds.map((p, i) => {
        const I = p.icon;
        return (
          <div key={i} className={`flex flex-col items-center p-2 rounded-lg border ${p.correct ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20" : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"}`} data-testid={`${prefix}-pred-${i}`}>
            <I className={`w-6 h-6 ${p.shape === "circle" ? "text-orange-500" : "text-purple-500"}`} />
            <span className={`text-xs font-bold mt-1 ${p.correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>{p.correct ? "Correct" : "Wrong"}</span>
          </div>
        );
      })}
    </div>
  );
}

function AccDisplay({ circleAcc, triAcc, prefix }: { circleAcc: number; triAcc: number; prefix: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
        <Circle className="w-5 h-5 text-orange-500 mx-auto mb-1" />
        <p className="text-2xl font-extrabold text-orange-600 dark:text-orange-400" data-testid={`text-${prefix}-circle-acc`}>{circleAcc}%</p>
        <p className="text-xs text-muted-foreground">Circle Accuracy</p>
      </div>
      <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
        <Triangle className="w-5 h-5 text-purple-500 mx-auto mb-1" />
        <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400" data-testid={`text-${prefix}-triangle-acc`}>{triAcc}%</p>
        <p className="text-xs text-muted-foreground">Triangle Accuracy</p>
      </div>
    </div>
  );
}

export default function Module3() {
  const [, navigate] = useLocation();
  const completeModule = useProgressStore((s) => s.completeModule);
  const { playSound } = useSoundEffects();
  const [screen, setScreen] = useState<Screen>("intro");
  const [phase, setPhase] = useState<ActivityPhase>("biased-collect");
  const [bc, setBc] = useState(0);
  const [bt, setBt] = useState(0);
  const [fc, setFc] = useState(0);
  const [ft, setFt] = useState(0);
  const [bPreds, setBPreds] = useState<Prediction[]>([]);
  const [fPreds, setFPreds] = useState<Prediction[]>([]);
  const [tp, setTp] = useState(0);

  const progress = screen === "intro" ? 0 : screen === "learn" ? 10 : screen === "precheck" ? 20 :
    screen === "activity" ? ({ "biased-collect": 30, "biased-train": 40, "biased-predict": 50, "fair-collect": 55, "fair-train": 65, "fair-predict": 70 }[phase]) :
    screen === "results" ? 80 : screen === "reflection" ? 90 : 100;

  const runTrain = useCallback((cb: () => void) => {
    setTp(0);
    let p = 0;
    const iv = setInterval(() => { p += 10; setTp(p); if (p >= 100) { clearInterval(iv); setTimeout(cb, 400); } }, 200);
  }, []);

  const bca = bPreds.length ? acc(bPreds, "circle") : 0;
  const bta = bPreds.length ? acc(bPreds, "triangle") : 0;
  const fca = fPreds.length ? acc(fPreds, "circle") : 0;
  const fta = fPreds.length ? acc(fPreds, "triangle") : 0;

  const handleComplete = () => { completeModule(3); playSound("celebrate"); setScreen("completion"); };

  return (
    <ModuleLayout moduleId={3} moduleTitle="Bias in AI" gradientClasses="bg-gradient-to-b from-orange-50 via-red-50 to-purple-50 dark:from-orange-950/30 dark:via-red-950/20 dark:to-background" progress={progress} screenKey={screen + (screen === "activity" ? `-${phase}` : "")}>
      {screen === "completion" && <ConfettiEffect colors={["#F97316", "#EF4444", "#8B5CF6", "#34D399", "#FBBF24", "#60A5FA"]} />}

      {screen === "intro" && (
        <div className="flex flex-col items-center text-center gap-6 pt-8" data-testid="screen-intro">
          <div className="w-36 h-40"><RobotMascot mood="excited" /></div>
          <SpeechBubble text="Hi! Let's talk about fairness in AI. Sometimes AI can be unfair if it doesn't learn from balanced data!" color="orange" />
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent" data-testid="text-module3-title">Bias in AI</h1>
          <Card className="p-4 w-full max-w-md text-left" data-testid="card-learning-goals">
            <h3 className="font-bold mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" />Learning Goals</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Scale className="w-4 h-4 text-orange-500 flex-shrink-0" />Understand what bias in AI means</li>
              <li className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />See how unbalanced data causes biased predictions</li>
              <li className="flex items-center gap-2"><Brain className="w-4 h-4 text-purple-500 flex-shrink-0" />Learn why balanced training data matters</li>
            </ul>
          </Card>
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 text-lg px-8 font-bold" onClick={() => setScreen("learn")} data-testid="button-lets-explore">
            <Sparkles className="w-5 h-5 mr-2" />Let's Explore!
          </Button>
        </div>
      )}

      {screen === "learn" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-learn">
          <VideoPlaceholder title="Watch: How Bias Happens in AI Training" steps={[
            { icon: Circle, label: "Collect", desc: "Gather training data" },
            { icon: AlertTriangle, label: "Imbalance", desc: "Unequal examples" },
            { icon: Brain, label: "Train", desc: "AI learns patterns" },
            { icon: Scale, label: "Bias", desc: "Unfair predictions" },
          ]} onComplete={() => setScreen("precheck")} gradientClass="from-orange-200/40 to-red-200/40" />
        </div>
      )}

      {screen === "precheck" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-precheck">
          <div className="w-24 h-28"><RobotMascot mood="thinking" /></div>
          <QuickCheck question="What do you think happens if an AI only sees pictures of golden retrievers as 'dogs'?" type="multiple" options={[
            { value: "a", label: "It would recognize all dog breeds perfectly", isCorrect: false },
            { value: "b", label: "It might not recognize other dog breeds", isCorrect: true },
            { value: "c", label: "It would stop working completely", isCorrect: false },
          ]} feedback={{ correct: "Exactly! If the AI only learns from one type, it struggles with others. That's bias!", incorrect: "Not quite! The AI would struggle to recognize other breeds because it only learned from golden retrievers." }} onAnswer={() => setScreen("activity")} />
        </div>
      )}

      {screen === "activity" && (
        <div className="flex flex-col items-center gap-5" data-testid="screen-activity">
          {(phase === "biased-collect" || phase === "biased-train" || phase === "biased-predict") && (
            <>
              <div className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-bold" data-testid="text-phase-label">Phase 1: Biased Training</div>
              <div className="flex items-start gap-3 w-full max-w-lg">
                <div className="w-16 h-20 flex-shrink-0"><RobotMascot mood={phase === "biased-predict" ? "confused" : "thinking"} /></div>
                <SpeechBubble text={phase === "biased-collect" ? "Add training data! Notice there are WAY more circles than triangles..." : phase === "biased-train" ? "Training on unbalanced data..." : "Hmm, I'm not great at recognizing triangles. I wonder why..."} color="orange" position="left" />
              </div>
              {phase === "biased-collect" && (
                <Card className="p-5 w-full max-w-lg border-2 border-orange-200 dark:border-orange-700" data-testid="card-biased-collect">
                  <p className="text-sm font-semibold text-muted-foreground mb-3 text-center">Add training examples (6 circles, 2 triangles):</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <ShapeCounter shape="Circle" icon={Circle} color="text-orange-500" count={bc} max={6} onAdd={() => { setBc((c) => Math.min(c + 1, 6)); playSound("click"); }} testId="biased-circles" />
                    <ShapeCounter shape="Triangle" icon={Triangle} color="text-purple-500" count={bt} max={2} onAdd={() => { setBt((c) => Math.min(c + 1, 2)); playSound("click"); }} testId="biased-triangles" />
                  </div>
                  <div className="flex justify-center">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 font-bold" disabled={bc < 6 || bt < 2} onClick={() => { setPhase("biased-train"); runTrain(() => { setBPreds(simulate(0.9, 0.3)); setPhase("biased-predict"); playSound("click"); }); }} data-testid="button-train-biased">
                      <Brain className="w-4 h-4 mr-2" />Train the Bot!
                    </Button>
                  </div>
                </Card>
              )}
              {phase === "biased-train" && (
                <Card className="p-6 w-full max-w-lg text-center" data-testid="card-biased-training">
                  <Brain className="w-10 h-10 text-orange-500 mx-auto mb-3 animate-pulse" />
                  <p className="font-bold mb-3">Training on biased data...</p>
                  <Progress value={tp} className="w-full max-w-xs mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">{tp}%</p>
                </Card>
              )}
              {phase === "biased-predict" && (
                <Card className="p-5 w-full max-w-lg border-2 border-red-200 dark:border-red-700" data-testid="card-biased-results">
                  <h3 className="font-bold text-center mb-3">Bot's Predictions (Biased Model)</h3>
                  <PredGrid preds={bPreds} prefix="biased" />
                  <AccDisplay circleAcc={bca} triAcc={bta} prefix="biased" />
                  <Card className="p-3 border-2 border-amber-200 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">The bot is much worse at triangles! It barely saw any during training.</p>
                    </div>
                  </Card>
                  <div className="flex justify-center mt-4">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 font-bold" onClick={() => setPhase("fair-collect")} data-testid="button-try-fair">
                      <ArrowRight className="w-4 h-4 mr-2" />Now Let's Try Fair Training!
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}
          {(phase === "fair-collect" || phase === "fair-train" || phase === "fair-predict") && (
            <>
              <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold" data-testid="text-phase2-label">Phase 2: Fair Training</div>
              <div className="flex items-start gap-3 w-full max-w-lg">
                <div className="w-16 h-20 flex-shrink-0"><RobotMascot mood={phase === "fair-predict" ? "happy" : "thinking"} /></div>
                <SpeechBubble text={phase === "fair-collect" ? "This time, let's use EQUAL amounts of each shape!" : phase === "fair-train" ? "Training on balanced data this time..." : "Much better! Balanced data makes a big difference!"} color="orange" position="left" />
              </div>
              {phase === "fair-collect" && (
                <Card className="p-5 w-full max-w-lg border-2 border-green-200 dark:border-green-700" data-testid="card-fair-collect">
                  <p className="text-sm font-semibold text-muted-foreground mb-3 text-center">Add balanced training examples (4 of each):</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <ShapeCounter shape="Circle" icon={Circle} color="text-orange-500" count={fc} max={4} onAdd={() => { setFc((c) => Math.min(c + 1, 4)); playSound("click"); }} testId="fair-circles" />
                    <ShapeCounter shape="Triangle" icon={Triangle} color="text-purple-500" count={ft} max={4} onAdd={() => { setFt((c) => Math.min(c + 1, 4)); playSound("click"); }} testId="fair-triangles" />
                  </div>
                  <div className="flex justify-center">
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 font-bold" disabled={fc < 4 || ft < 4} onClick={() => { setPhase("fair-train"); runTrain(() => { setFPreds(simulate(0.8, 0.8)); setPhase("fair-predict"); playSound("correct"); }); }} data-testid="button-train-fair">
                      <Brain className="w-4 h-4 mr-2" />Train the Bot!
                    </Button>
                  </div>
                </Card>
              )}
              {phase === "fair-train" && (
                <Card className="p-6 w-full max-w-lg text-center" data-testid="card-fair-training">
                  <Brain className="w-10 h-10 text-green-500 mx-auto mb-3 animate-pulse" />
                  <p className="font-bold mb-3">Training on balanced data...</p>
                  <Progress value={tp} className="w-full max-w-xs mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">{tp}%</p>
                </Card>
              )}
              {phase === "fair-predict" && (
                <Card className="p-5 w-full max-w-lg border-2 border-green-200 dark:border-green-700" data-testid="card-fair-results">
                  <h3 className="font-bold text-center mb-3">Bot's Predictions (Fair Model)</h3>
                  <PredGrid preds={fPreds} prefix="fair" />
                  <AccDisplay circleAcc={fca} triAcc={fta} prefix="fair" />
                  <Card className="p-3 border-2 border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-900/20">
                    <div className="flex items-start gap-2">
                      <Zap className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">Both shapes are recognized well now! Balanced data = fairer AI.</p>
                    </div>
                  </Card>
                  <div className="flex justify-center mt-4">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 font-bold" onClick={() => setScreen("results")} data-testid="button-see-results">
                      <BarChart3 className="w-4 h-4 mr-2" />See Full Results
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {screen === "results" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-results">
          <div className="w-32 h-36"><RobotMascot mood="happy" /></div>
          <SpeechBubble text="Look at the difference! Balanced data makes me so much fairer!" color="orange" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <Card className="p-4 border-2 border-red-200 dark:border-red-700" data-testid="card-biased-comparison">
              <h3 className="font-bold text-center mb-3 text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />Biased Model
              </h3>
              <div className="mb-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1"><Circle className="w-4 h-4 text-orange-500" /><span className="text-sm">Circles</span></div>
                  <span className="font-bold text-orange-600 dark:text-orange-400" data-testid="text-result-biased-circles">{bca}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2"><div className="h-2 rounded-full bg-orange-500 transition-all" style={{ width: `${bca}%` }} /></div>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1"><Triangle className="w-4 h-4 text-purple-500" /><span className="text-sm">Triangles</span></div>
                  <span className="font-bold text-purple-600 dark:text-purple-400" data-testid="text-result-biased-triangles">{bta}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2"><div className="h-2 rounded-full bg-purple-500 transition-all" style={{ width: `${bta}%` }} /></div>
              </div>
            </Card>
            <Card className="p-4 border-2 border-green-200 dark:border-green-700" data-testid="card-fair-comparison">
              <h3 className="font-bold text-center mb-3 text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                <Scale className="w-4 h-4" />Fair Model
              </h3>
              <div className="mb-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1"><Circle className="w-4 h-4 text-orange-500" /><span className="text-sm">Circles</span></div>
                  <span className="font-bold text-orange-600 dark:text-orange-400" data-testid="text-result-fair-circles">{fca}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2"><div className="h-2 rounded-full bg-orange-500 transition-all" style={{ width: `${fca}%` }} /></div>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1"><Triangle className="w-4 h-4 text-purple-500" /><span className="text-sm">Triangles</span></div>
                  <span className="font-bold text-purple-600 dark:text-purple-400" data-testid="text-result-fair-triangles">{fta}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2"><div className="h-2 rounded-full bg-purple-500 transition-all" style={{ width: `${fta}%` }} /></div>
              </div>
            </Card>
          </div>
          <Card className="p-4 w-full max-w-lg border-2 border-orange-200 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/20" data-testid="card-insight">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground"><strong>Key Insight:</strong> When training data is unbalanced, the AI gets biased! It performs well on what it sees a lot, but poorly on what it rarely sees.</p>
            </div>
          </Card>
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 font-bold" onClick={() => setScreen("reflection")} data-testid="button-continue-reflection">
            Continue<ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {screen === "reflection" && (
        <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-reflection">
          <div className="w-24 h-28"><RobotMascot mood="happy" /></div>
          <SelfRegulatedCheck type="reflection" title="Thinking About Fairness" prompt="Why is it important for AI to be fair?" options={[
            { value: "everyone", label: "So everyone is treated fairly" },
            { value: "accurate", label: "So it makes better predictions" },
            { value: "both", label: "Both reasons!" },
          ]} onComplete={() => handleComplete()} />
        </div>
      )}

      {screen === "completion" && (
        <div className="flex flex-col items-center gap-6 pt-6" data-testid="screen-completion">
          <motion.div className="w-36 h-40" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.6, delay: 0.3 }}>
            <RobotMascot mood="celebrating" />
          </motion.div>
          <SpeechBubble text="You discovered how bias works in AI! Now you know why balanced, fair data is so important!" color="orange" />
          <motion.div className="flex items-center gap-2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }}>
            <Award className="w-10 h-10 text-yellow-500" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent" data-testid="text-badge-earned">Badge Earned!</span>
            <Award className="w-10 h-10 text-yellow-500" />
          </motion.div>
          <Card className="p-6 w-full max-w-lg border-2 border-yellow-300 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/20" data-testid="card-key-takeaway">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">Key Takeaway</h3>
                <p className="text-base text-foreground" data-testid="text-key-takeaway">AI can be biased if training data isn't balanced and fair!</p>
              </div>
            </div>
          </Card>
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 font-bold" onClick={() => navigate("/")} data-testid="button-back-to-home">
            <Home className="w-5 h-5 mr-2" />Back to Home
          </Button>
        </div>
      )}
    </ModuleLayout>
  );
}
