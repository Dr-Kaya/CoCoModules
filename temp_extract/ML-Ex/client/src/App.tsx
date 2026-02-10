import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SoundEffectsProvider } from "@/components/shared/SoundEffectsProvider";

const Home = lazy(() => import("@/pages/Home"));
const Module1 = lazy(() => import("@/pages/Module1"));
const Module2 = lazy(() => import("@/pages/Module2"));
const Module3 = lazy(() => import("@/pages/Module3"));
const Module4 = lazy(() => import("@/pages/Module4"));
const Module5 = lazy(() => import("@/pages/Module5"));
const Module6 = lazy(() => import("@/pages/Module6"));
const ModulePlaceholder = lazy(() => import("@/pages/ModulePlaceholder"));
const NotFound = lazy(() => import("@/pages/not-found"));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-background">
      <div className="flex flex-col items-center gap-3" role="status" aria-label="Loading module">
        <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/module/1" component={Module1} />
        <Route path="/module/2" component={Module2} />
        <Route path="/module/3" component={Module3} />
        <Route path="/module/4" component={Module4} />
        <Route path="/module/5" component={Module5} />
        <Route path="/module/6" component={Module6} />
        <Route path="/module/:id" component={ModulePlaceholder} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SoundEffectsProvider>
          <Toaster />
          <Router />
        </SoundEffectsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
