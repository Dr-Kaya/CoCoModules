import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Star, Home, Brain, CheckCircle2, Package, Tag, Wrench, Award, Trophy, FlaskConical, Car, Truck, Bike, Bus, CarFront, Sparkles, TrendingUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RobotMascot } from "@/components/RobotMascot";
import { useProgressStore } from "@/stores/progressStore";
import ModuleLayout from "@/components/shared/ModuleLayout";
import { SpeechBubble } from "@/components/shared/SpeechBubble";
import { ConfettiEffect } from "@/components/shared/ConfettiEffect";
import { useSoundEffects } from "@/components/shared/SoundEffectsProvider";
import { VideoPlaceholder } from "@/components/shared/VideoPlaceholder";
import { QuickCheck } from "@/components/shared/QuickCheck";
import { SelfRegulatedCheck } from "@/components/shared/SelfRegulatedCheck";

type Phase = "intro" | "learn" | "precheck" | "activity" | "results" | "reflection" | "completion";
type Stop = "collect" | "label" | "train" | "test" | "improve" | "transition";

const STOPS = [
  { id: "collect", icon: Package, label: "Collect", color: "bg-blue-500" },
  { id: "label", icon: Tag, label: "Label", color: "bg-green-500" },
  { id: "train", icon: Brain, label: "Train", color: "bg-purple-500" },
  { id: "test", icon: FlaskConical, label: "Test", color: "bg-orange-500" },
  { id: "improve", icon: Wrench, label: "Improve", color: "bg-red-500" },
];

interface Vehicle { icon: typeof Car; name: string; category: "two" | "four"; iconColor: string }

const VEHICLES: Vehicle[] = [
  { icon: Car, name: "Sedan", category: "four", iconColor: "text-blue-500" },
  { icon: Truck, name: "Truck", category: "four", iconColor: "text-red-500" },
  { icon: Bike, name: "Bicycle", category: "two", iconColor: "text-green-500" },
  { icon: Bus, name: "School Bus", category: "four", iconColor: "text-yellow-500" },
  { icon: CarFront, name: "SUV", category: "four", iconColor: "text-purple-500" },
  { icon: Bike, name: "Mountain Bike", category: "two", iconColor: "text-orange-500" },
  { icon: Truck, name: "Van", category: "four", iconColor: "text-cyan-500" },
  { icon: Bike, name: "Scooter", category: "two", iconColor: "text-pink-500" },
];

const TEST_VEHICLES: Vehicle[] = [
  { icon: Car, name: "Convertible", category: "four", iconColor: "text-indigo-500" },
  { icon: Bike, name: "BMX", category: "two", iconColor: "text-lime-500" },
  { icon: Bus, name: "City Bus", category: "four", iconColor: "text-amber-600" },
  { icon: Bike, name: "E-Scooter", category: "two", iconColor: "text-rose-500" },
];

const EXTRA_VEHICLES: Vehicle[] = [
  { icon: Truck, name: "Pickup", category: "four", iconColor: "text-teal-500" },
  { icon: Bike, name: "Tricycle", category: "two", iconColor: "text-fuchsia-500" },
  { icon: CarFront, name: "Minivan", category: "four", iconColor: "text-sky-500" },
  { icon: Car, name: "Coupe", category: "four", iconColor: "text-violet-500" },
];

const MSGS: Record<string, string> = {
  collect: "Great job collecting data! Now let's label each vehicle by its wheel count.",
  label: "Labels done! Time to train the AI with what we've organized.",
  train: "Training complete! Let's see how well the AI learned.",
  test: "Interesting results! Let's improve by adding more examples.",
};

function JourneyMap({ cur, done }: { cur: number; done: number[] }) {
  return (
    <div className="relative flex items-center justify-between w-full max-w-lg mx-auto py-6">
      <div className="absolute top-1/2 left-0 right-0 h-2 bg-muted rounded-full -translate-y-1/2 z-0" />
      <motion.div className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full -translate-y-1/2 z-0" animate={{ width: `${(Math.max(0, ...done, cur) / 4) * 100}%` }} transition={{ duration: 0.8 }} />
      {STOPS.map((s, i) => {
        const Icon = s.icon;
        const d = done.includes(i), c = i === cur;
        return (
          <motion.div key={s.id} className="relative z-10 flex flex-col items-center gap-1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 * i, type: "spring" }}>
            <motion.div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${d ? `${s.color} border-transparent text-white` : c ? "bg-white dark:bg-card border-amber-400 ring-4 ring-amber-200 dark:ring-amber-800" : "bg-muted border-border text-muted-foreground"}`} animate={c ? { scale: [1, 1.1, 1] } : {}} transition={c ? { duration: 1.5, repeat: Infinity } : {}}>
              {d ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
            </motion.div>
            <span className={`text-xs font-bold ${c ? "text-amber-600 dark:text-amber-400" : d ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function VehicleIcon({ v, size = "w-10 h-10" }: { v: Vehicle; size?: string }) {
  const Icon = v.icon;
  return <Icon className={`${size} ${v.iconColor}`} />;
}

export default function Module6() {
  const [, navigate] = useLocation();
  const { completeModule } = useProgressStore();
  const { playSound } = useSoundEffects();
  const [phase, setPhase] = useState<Phase>("intro");
  const [stop, setStop] = useState<Stop>("collect");
  const [doneStops, setDoneStops] = useState<number[]>([]);
  const [tFrom, setTFrom] = useState("");
  const [collected, setCollected] = useState<number[]>([]);
  const [labTwo, setLabTwo] = useState<number[]>([]);
  const [labFour, setLabFour] = useState<number[]>([]);
  const [trainProg, setTrainProg] = useState(0);
  const [tIdx, setTIdx] = useState(0);
  const [tRes, setTRes] = useState<{ ok: boolean; pred: string }[]>([]);
  const [tPending, setTPending] = useState(false);
  const [extraDone, setExtraDone] = useState<number[]>([]);
  const [impStep, setImpStep] = useState<"add" | "retrain" | "retest">("add");
  const [rtProg, setRtProg] = useState(0);
  const [rtDone, setRtDone] = useState(false);
  const [rtIdx, setRtIdx] = useState(0);
  const [rtRes, setRtRes] = useState<{ ok: boolean; pred: string }[]>([]);
  const [rtPending, setRtPending] = useState(false);
  const [name, setName] = useState("");
  const [confetti, setConfetti] = useState(false);

  const curIdx = STOPS.findIndex((s) => s.id === stop);
  const allLab = labTwo.length + labFour.length === 8;
  const labOk = labTwo.every((i) => VEHICLES[i].category === "two") && labFour.every((i) => VEHICLES[i].category === "four");
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const prog: Record<Phase, number> = { intro: 0, learn: 10, precheck: 20, activity: 35, results: 80, reflection: 90, completion: 100 };

  const goTrans = useCallback((from: string, idx: number) => {
    setDoneStops((p) => p.includes(idx) ? p : [...p, idx]);
    setTFrom(from);
    setStop("transition");
    playSound("correct");
  }, [playSound]);

  const fromTrans = useCallback(() => {
    const next: Stop[] = ["label", "train", "test", "improve"];
    const i = Object.keys(MSGS).indexOf(tFrom);
    if (i >= 0) setStop(next[i]);
  }, [tFrom]);

  const runProg = useCallback((setter: (v: number) => void, onDone: () => void) => {
    let t = 0;
    const iv = setInterval(() => { t += 5; setter(Math.min(t, 100)); if (t >= 100) { clearInterval(iv); onDone(); } }, 150);
  }, []);

  const simTest = useCallback((i: number) => {
    setTPending(true);
    const v = TEST_VEHICLES[i];
    const wrong = i === 1 || i === 3;
    const pred = wrong ? (v.category === "two" ? "Four Wheels" : "Two Wheels") : (v.category === "two" ? "Two Wheels" : "Four Wheels");
    setTimeout(() => { setTRes((p) => [...p, { ok: !wrong, pred }]); setTPending(false); }, 1500);
  }, []);

  const simRetest = useCallback((i: number) => {
    setRtPending(true);
    const pred = TEST_VEHICLES[i].category === "two" ? "Two Wheels" : "Four Wheels";
    setTimeout(() => { setRtRes((p) => [...p, { ok: true, pred }]); setRtPending(false); }, 1200);
  }, []);

  const label = useCallback((i: number, b: "two" | "four") => {
    if (b === "two") { setLabTwo((p) => p.includes(i) ? p : [...p, i]); setLabFour((p) => p.filter((x) => x !== i)); }
    else { setLabFour((p) => p.includes(i) ? p : [...p, i]); setLabTwo((p) => p.filter((x) => x !== i)); }
    playSound(VEHICLES[i].category === b ? "correct" : "wrong");
  }, [playSound]);

  const grad = "bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-background";

  return (
    <>
      {confetti && <ConfettiEffect />}
      <ModuleLayout moduleId={6} moduleTitle="The Full ML Lifecycle" gradientClasses={grad} progress={prog[phase]} screenKey={phase + stop}>
        {phase === "intro" && (
          <div className="flex flex-col items-center text-center gap-6 pt-8" data-testid="screen-intro">
            <div className="w-36 h-40"><RobotMascot mood="excited" /></div>
            <SpeechBubble text="Ready for the ultimate ML adventure? We'll go through the ENTIRE machine learning lifecycle together!" color="yellow" />
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent" data-testid="text-module6-title">The Full ML Lifecycle</h1>
            <ul className="text-left max-w-sm space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Package className="w-4 h-4 text-blue-500" /> Collect training data</li>
              <li className="flex items-center gap-2"><Tag className="w-4 h-4 text-green-500" /> Label data into categories</li>
              <li className="flex items-center gap-2"><Brain className="w-4 h-4 text-purple-500" /> Train AI on examples</li>
              <li className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-orange-500" /> Test AI accuracy</li>
              <li className="flex items-center gap-2"><Wrench className="w-4 h-4 text-red-500" /> Improve the AI</li>
            </ul>
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 text-lg px-8 font-bold" onClick={() => setPhase("learn")} data-testid="button-start-adventure"><Sparkles className="w-5 h-5 mr-2" /> Start My Adventure!</Button>
          </div>
        )}
        {phase === "learn" && (
          <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-learn">
            <h2 className="text-2xl font-bold">The ML Lifecycle</h2>
            <VideoPlaceholder title="Watch how the ML lifecycle works: Collect, Label, Train, Test, Improve!" steps={[
              { icon: Package, label: "Collect", desc: "Gather examples" }, { icon: Tag, label: "Label", desc: "Categorize data" },
              { icon: Brain, label: "Train", desc: "Teach the model" }, { icon: FlaskConical, label: "Test", desc: "Check accuracy" },
              { icon: Wrench, label: "Improve", desc: "Add more data" },
            ]} onComplete={() => setPhase("precheck")} gradientClass="from-amber-500/20 to-orange-500/20" />
          </div>
        )}
        {phase === "precheck" && (
          <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-precheck">
            <QuickCheck question="What's the first step in teaching an AI?" type="multiple" options={[
              { value: "collect", label: "Collect data/examples", isCorrect: true }, { value: "test", label: "Test the model", isCorrect: false },
              { value: "deploy", label: "Deploy to production", isCorrect: false }, { value: "improve", label: "Improve accuracy", isCorrect: false },
            ]} onAnswer={() => setPhase("activity")} feedback={{ correct: "Exactly! Collecting data is always the first step.", incorrect: "Not quite - we need data before we can do anything else!" }} />
          </div>
        )}
        {phase === "activity" && (
          <div className="flex flex-col items-center gap-4" data-testid="screen-activity">
            <JourneyMap cur={stop === "transition" ? -1 : curIdx} done={doneStops} />
            {stop === "transition" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-6">
                <div className="w-24 h-28"><RobotMascot mood="happy" /></div>
                <SpeechBubble text={MSGS[tFrom] || ""} color="yellow" />
                <Button onClick={fromTrans} data-testid="button-continue-journey"><ArrowRight className="w-4 h-4 mr-2" /> Continue</Button>
              </motion.div>
            )}
            {stop === "collect" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg space-y-4">
                <h3 className="text-xl font-bold text-center">Stop 1: Collect Data</h3>
                <p className="text-sm text-muted-foreground text-center">Click each vehicle card to collect it!</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {VEHICLES.map((v, i) => {
                    const c = collected.includes(i);
                    return (
                      <motion.div key={i} whileTap={{ scale: 0.95 }}>
                        <Card className={`p-4 flex flex-col items-center gap-2 cursor-pointer ${c ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30" : ""}`} onClick={() => { if (!c) { setCollected((p) => [...p, i]); playSound("click"); } }} data-testid={`card-vehicle-${i}`}>
                          <VehicleIcon v={v} /><span className="text-xs font-medium">{v.name}</span>
                          {c && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                <p className="text-sm text-center text-muted-foreground">{collected.length}/8 collected</p>
                {collected.length === 8 && <Button className="w-full" onClick={() => goTrans("collect", 0)} data-testid="button-done-collecting"><ArrowRight className="w-4 h-4 mr-2" /> Next: Label Data</Button>}
              </motion.div>
            )}
            {stop === "label" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg space-y-4">
                <h3 className="text-xl font-bold text-center">Stop 2: Label Data</h3>
                <p className="text-sm text-muted-foreground text-center">Sort each vehicle into the correct category!</p>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-3 border-2 border-green-300 dark:border-green-700 min-h-[100px]">
                    <h4 className="text-sm font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1"><Bike className="w-4 h-4" /> Two Wheels</h4>
                    <div className="flex flex-wrap gap-1">{labTwo.map((i) => <div key={i} className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 rounded px-1.5 py-0.5"><VehicleIcon v={VEHICLES[i]} size="w-3 h-3" />{VEHICLES[i].name}</div>)}</div>
                  </Card>
                  <Card className="p-3 border-2 border-blue-300 dark:border-blue-700 min-h-[100px]">
                    <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1"><Car className="w-4 h-4" /> Four Wheels</h4>
                    <div className="flex flex-wrap gap-1">{labFour.map((i) => <div key={i} className="flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 rounded px-1.5 py-0.5"><VehicleIcon v={VEHICLES[i]} size="w-3 h-3" />{VEHICLES[i].name}</div>)}</div>
                  </Card>
                </div>
                <div className="space-y-2">
                  {VEHICLES.map((v, i) => {
                    if (labTwo.includes(i) || labFour.includes(i)) return null;
                    return (
                      <Card key={i} className="p-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2"><VehicleIcon v={v} size="w-6 h-6" /><span className="text-sm font-medium">{v.name}</span></div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => label(i, "two")} data-testid={`label-two-${i}`}>Two Wheels</Button>
                          <Button size="sm" variant="outline" onClick={() => label(i, "four")} data-testid={`label-four-${i}`}>Four Wheels</Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {allLab && !labOk && <p className="text-sm text-orange-600 dark:text-orange-400 text-center">Some labels look wrong - try again!</p>}
                {allLab && labOk && <Button className="w-full" onClick={() => goTrans("label", 1)} data-testid="button-done-labeling"><ArrowRight className="w-4 h-4 mr-2" /> Next: Train AI</Button>}
              </motion.div>
            )}
            {stop === "train" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md space-y-6 text-center">
                <h3 className="text-xl font-bold">Stop 3: Train the AI</h3>
                {trainProg === 0 ? (
                  <><div className="w-24 h-28 mx-auto"><RobotMascot mood="thinking" /></div>
                  <p className="text-sm text-muted-foreground">The AI will study your labeled data.</p>
                  <Button onClick={() => runProg(setTrainProg, () => playSound("correct"))} data-testid="button-start-training"><Brain className="w-4 h-4 mr-2" /> Start Training</Button></>
                ) : (
                  <><div className="w-20 h-24 mx-auto"><RobotMascot mood={trainProg >= 100 ? "celebrating" : "thinking"} /></div>
                  <Progress value={trainProg} className="w-full" />
                  <p className="text-sm text-muted-foreground">{trainProg < 100 ? `Training... ${trainProg}%` : "Training complete!"}</p>
                  {trainProg >= 100 && <Button onClick={() => goTrans("train", 2)} data-testid="button-done-training"><ArrowRight className="w-4 h-4 mr-2" /> Next: Test AI</Button>}</>
                )}
              </motion.div>
            )}
            {stop === "test" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md space-y-4 text-center">
                <h3 className="text-xl font-bold">Stop 4: Test the AI</h3>
                {tIdx < TEST_VEHICLES.length ? (
                  <div className="space-y-4">
                    <Card className="p-6 flex flex-col items-center gap-3">
                      <VehicleIcon v={TEST_VEHICLES[tIdx]} size="w-16 h-16" />
                      <span className="font-bold">{TEST_VEHICLES[tIdx].name}</span>
                      {tPending && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2"><Brain className="w-4 h-4 animate-pulse text-purple-500" /><span className="text-sm">Thinking...</span></motion.div>}
                      {tRes.length > tIdx && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${tRes[tIdx].ok ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}>{tRes[tIdx].ok ? <CheckCircle2 className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />} Bot: {tRes[tIdx].pred}</motion.div>}
                    </Card>
                    {tRes.length <= tIdx && !tPending && <Button onClick={() => simTest(tIdx)} data-testid={`button-test-${tIdx}`}><FlaskConical className="w-4 h-4 mr-2" /> Let Bot Predict</Button>}
                    {tRes.length > tIdx && <Button onClick={() => setTIdx((p) => p + 1)} data-testid="button-next-test"><ArrowRight className="w-4 h-4 mr-2" /> Next Vehicle</Button>}
                    <p className="text-xs text-muted-foreground">Test {tIdx + 1}/{TEST_VEHICLES.length}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="font-bold text-lg">{tRes.filter((r) => r.ok).length}/{tRes.length} correct (~50% accuracy)</p>
                    <p className="text-sm text-muted-foreground">Not bad, but we can improve!</p>
                    <Button onClick={() => goTrans("test", 3)} data-testid="button-done-testing"><ArrowRight className="w-4 h-4 mr-2" /> Next: Improve</Button>
                  </div>
                )}
              </motion.div>
            )}
            {stop === "improve" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md space-y-4 text-center">
                <h3 className="text-xl font-bold">Stop 5: Improve the AI</h3>
                {impStep === "add" && (
                  <>
                    <p className="text-sm text-muted-foreground">Add more training examples!</p>
                    <div className="grid grid-cols-2 gap-3">
                      {EXTRA_VEHICLES.map((v, i) => {
                        const d = extraDone.includes(i);
                        return (
                          <Card key={i} className={`p-3 flex flex-col items-center gap-2 cursor-pointer ${d ? "border-amber-400 bg-amber-50 dark:bg-amber-950/30" : ""}`} onClick={() => { if (!d) { setExtraDone((p) => [...p, i]); playSound("click"); } }} data-testid={`card-extra-${i}`}>
                            <VehicleIcon v={v} size="w-8 h-8" /><span className="text-xs font-medium">{v.name}</span>
                            <span className="text-[10px] text-muted-foreground">{v.category === "two" ? "Two Wheels" : "Four Wheels"}</span>
                            {d && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </Card>
                        );
                      })}
                    </div>
                    {extraDone.length === 4 && <Button onClick={() => { setImpStep("retrain"); runProg(setRtProg, () => { setRtDone(true); playSound("correct"); }); }} data-testid="button-retrain"><Brain className="w-4 h-4 mr-2" /> Retrain AI</Button>}
                  </>
                )}
                {impStep === "retrain" && (
                  <><div className="w-20 h-24 mx-auto"><RobotMascot mood={rtDone ? "celebrating" : "thinking"} /></div>
                  <Progress value={rtProg} className="w-full" />
                  <p className="text-sm text-muted-foreground">{rtDone ? "Retraining complete!" : `Retraining... ${rtProg}%`}</p>
                  {rtDone && <Button onClick={() => setImpStep("retest")} data-testid="button-start-retest"><FlaskConical className="w-4 h-4 mr-2" /> Retest AI</Button>}</>
                )}
                {impStep === "retest" && (
                  <>
                    {rtIdx < TEST_VEHICLES.length ? (
                      <div className="space-y-4">
                        <Card className="p-6 flex flex-col items-center gap-3">
                          <VehicleIcon v={TEST_VEHICLES[rtIdx]} size="w-16 h-16" />
                          <span className="font-bold">{TEST_VEHICLES[rtIdx].name}</span>
                          {rtPending && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-purple-500 flex items-center gap-1"><Brain className="w-4 h-4 animate-pulse" /> Thinking...</motion.div>}
                          {rtRes.length > rtIdx && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"><CheckCircle2 className="w-4 h-4" /> Bot: {rtRes[rtIdx].pred}</motion.div>}
                        </Card>
                        {rtRes.length <= rtIdx && !rtPending && <Button onClick={() => simRetest(rtIdx)} data-testid={`button-retest-${rtIdx}`}><FlaskConical className="w-4 h-4 mr-2" /> Let Bot Predict</Button>}
                        {rtRes.length > rtIdx && <Button onClick={() => setRtIdx((p) => p + 1)} data-testid="button-next-retest"><ArrowRight className="w-4 h-4 mr-2" /> Next</Button>}
                      </div>
                    ) : (
                      <><p className="font-bold text-lg text-green-600 dark:text-green-400">{rtRes.filter((r) => r.ok).length}/{rtRes.length} correct (~88% accuracy)</p>
                      <Button onClick={() => { setDoneStops((p) => p.includes(4) ? p : [...p, 4]); playSound("celebrate"); setPhase("results"); }} data-testid="button-done-improving"><Award className="w-4 h-4 mr-2" /> See Results</Button></>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </div>
        )}
        {phase === "results" && (
          <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-results">
            <h2 className="text-2xl font-bold">Your ML Journey Results</h2>
            <JourneyMap cur={-1} done={[0, 1, 2, 3, 4]} />
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <Card className="p-4 text-center"><p className="text-sm text-muted-foreground">Before</p><p className="text-3xl font-extrabold text-orange-500">50%</p></Card>
              <Card className="p-4 text-center"><p className="text-sm text-muted-foreground">After</p><p className="text-3xl font-extrabold text-green-500">88%</p></Card>
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400"><TrendingUp className="w-5 h-5" /><span className="font-bold">+38% improvement!</span></div>
            <Card className="p-4 max-w-sm w-full space-y-2">
              <h3 className="font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /> Key Insights</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> More data leads to better accuracy</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Correct labels are essential</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Testing reveals weaknesses</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> The ML lifecycle is a repeating cycle!</li>
              </ul>
            </Card>
            <Button onClick={() => setPhase("reflection")} data-testid="button-to-reflection"><ArrowRight className="w-4 h-4 mr-2" /> Continue</Button>
          </div>
        )}
        {phase === "reflection" && (
          <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-reflection">
            <SelfRegulatedCheck type="success" title="ML Lifecycle Mastery" prompt="How well do you understand the ML lifecycle now?" options={[
              { value: "expert", label: "I can explain all 5 steps!", icon: Star }, { value: "good", label: "I understand most of it", icon: Brain },
              { value: "learning", label: "I'm still learning", icon: Wrench },
            ]} onComplete={() => { completeModule(6); setConfetti(true); setPhase("completion"); playSound("celebrate"); }} />
          </div>
        )}
        {phase === "completion" && (
          <div className="flex flex-col items-center gap-6 pt-4" data-testid="screen-completion">
            <div className="w-28 h-32"><RobotMascot mood="celebrating" /></div>
            <Award className="w-12 h-12 text-amber-500" />
            <h2 className="text-2xl font-extrabold">ML Lifecycle Master!</h2>
            <Card className="p-4 max-w-sm w-full text-center">
              <p className="text-sm font-medium text-muted-foreground">Key Takeaway</p>
              <p className="font-bold mt-1">The ML lifecycle is a cycle: Collect, Label, Train, Test, Improve, repeat!</p>
            </Card>
            <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-orange-950/20 border-4 border-double border-amber-400 dark:border-amber-600 rounded-2xl p-6 max-w-md mx-auto w-full">
              <div className="text-center space-y-3">
                <Trophy className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">ML Explorer Certificate</h3>
                <div className="border-b border-amber-300 dark:border-amber-700 mx-8" />
                <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="text-center max-w-[200px] mx-auto" data-testid="input-student-name" />
                <p className="text-lg font-extrabold text-foreground" data-testid="text-certificate-name">{name || "ML Explorer"}</p>
                <p className="text-sm text-muted-foreground">has mastered the Machine Learning Lifecycle!</p>
                <p className="text-xs text-muted-foreground">{today}</p>
                <div className="flex items-center justify-center gap-1 mt-2">{[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} data-testid="button-back-home"><Home className="w-4 h-4 mr-2" /> Back to Home</Button>
          </div>
        )}
      </ModuleLayout>
    </>
  );
}
