import { Component, type ReactNode, type ErrorInfo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowLeft, Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RobotMascot } from "@/components/RobotMascot";

interface ModuleLayoutProps {
  moduleId: number;
  moduleTitle: string;
  gradientClasses: string;
  progress: number;
  screenKey: string;
  children: ReactNode;
}

const slideVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
};

export { slideVariants };

class ModuleErrorBoundary extends Component<
  { moduleId: number; children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { moduleId: number; children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Module error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-6">
          <Card className="p-8 max-w-md border-2 border-orange-300 dark:border-orange-600">
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold mb-2">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              Don't worry! This happens sometimes. Let's try again!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="font-bold"
                data-testid="button-restart-module"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Restart Module
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "/";
                }}
                data-testid="button-error-go-home"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </Card>
          <div className="w-24 h-28">
            <RobotMascot mood="confused" />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function ModuleHeader({
  moduleId,
  moduleTitle,
  progress,
}: {
  moduleId: number;
  moduleTitle: string;
  progress: number;
}) {
  const [, navigate] = useLocation();

  return (
    <div
      className="sticky top-0 z-30 bg-white/80 dark:bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3"
      role="navigation"
      aria-label="Module navigation"
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            data-testid="button-back-home"
            aria-label="Go back to Home"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Button>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                  className="text-xs sm:text-sm cursor-pointer"
                  data-testid="breadcrumb-home"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs sm:text-sm font-semibold truncate max-w-[200px]" data-testid="breadcrumb-module">
                  Module {moduleId}: {moduleTitle}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2 flex-1 max-w-[140px] sm:max-w-xs">
            <Progress
              value={progress}
              className="h-2"
              aria-label={`Module progress: ${Math.round(progress)}%`}
              data-testid={`progress-module-${moduleId}`}
            />
            <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModuleLayout({
  moduleId,
  moduleTitle,
  gradientClasses,
  progress,
  screenKey,
  children,
}: ModuleLayoutProps) {
  return (
    <div className={`min-h-screen ${gradientClasses}`}>
      <ModuleHeader
        moduleId={moduleId}
        moduleTitle={moduleTitle}
        progress={progress}
      />
      <ModuleErrorBoundary moduleId={moduleId}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={screenKey}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </ModuleErrorBoundary>
    </div>
  );
}
