# ML Explorer

## Overview

ML Explorer is an interactive educational web application that teaches elementary students (grades 3–5) machine learning concepts through 6 hands-on modules. Each module covers a different ML concept through fully simulated interactive activities (NO webcam/camera/ml5.js). The app features a friendly robot mascot, colorful kid-friendly UI, animations, and a progress tracking system with completion badges.

All modules follow a consistent Sporty Bot-style phase structure: Intro → Learn (VideoPlaceholder) → PreCheck (QuickCheck) → Activity (interactive simulation) → Results → Reflection (SelfRegulatedCheck) → Completion.

The 7 modules are:
1. "Teach the Sorting Robot" (Tag icon) — Data labeling: sort items into Animals/Food/Toys categories
2. "Healthy or Treat?" (ArrowLeftRight icon) — Binary classification: classify foods as Healthy or Treat
3. "Fair or Unfair AI?" (Scale icon) — Bias in AI: compare biased vs balanced training data
4. "The Data Detective" (Search icon) — Data quality: 3 rounds showing more data = better accuracy
5. "Test Your Robot's Brain" (FlaskConical icon) — Model evaluation: train/test split with weather classification
6. "My ML Adventure" (Map icon) — Complete ML lifecycle: 5-stop journey (Collect→Label→Train→Test→Improve)
7. "Sporty Bot" (Dribbble icon) — External activity (links to https://sporty-bot-1.replit.app/)

All 6 internal modules use simulated ML logic (no webcam/camera). Activities use lucide-react icons for item representation. Simulated accuracy uses base + increment formulas with random variation for realism. The Home page shows a celebration banner when all 6 modules are complete.

### Shared Component Architecture (Feb 2026 Polish Pass)
- **ModuleLayout** (`client/src/components/shared/ModuleLayout.tsx`) — Wraps all 6 modules with: sticky header (back button + breadcrumb + progress bar), error boundary, and AnimatePresence slide transitions. Props: moduleId, moduleTitle, gradientClasses, progress, screenKey.
- **QuickCheck** (`client/src/components/shared/QuickCheck.tsx`) — Formative assessment with multiple-choice questions, instant feedback (correct/incorrect), and callback on answer. Used for pre-checks and mid-activity checks.
- **SelfRegulatedCheck** (`client/src/components/shared/SelfRegulatedCheck.tsx`) — Metacognitive reflection component with type variants (success/brain/reflection/goal/strategy), prompt, options, and onComplete callback.
- **VideoPlaceholder** (`client/src/components/shared/VideoPlaceholder.tsx`) — Simulated learning video with step-by-step animated icons, title, gradient theme, and onComplete callback.
- **RobotMascot** (`client/src/components/RobotMascot.tsx`) — SVG robot with 6 mood states: happy, excited, thinking, confused, celebrating, neutral. Each mood has contextual glow colors and expressions.
- **SpeechBubble** (`client/src/components/shared/SpeechBubble.tsx`) — Shared speech bubble with configurable color and position (bottom/left/right).
- **ConfettiEffect** (`client/src/components/shared/ConfettiEffect.tsx`) — Shared celebration animation with configurable colors/count. Auto-plays celebrate sound.
- **SoundEffectsProvider** (`client/src/components/shared/SoundEffectsProvider.tsx`) — Context provider with Web Audio oscillator beeps. Toggle persists in localStorage. Sound types: click, correct, wrong, celebrate, capture.
- **Progress Ring** — SVG circular progress on Home page showing X/6 modules complete.
- All modules use lucide-react icons (no emojis), data-testid on interactive elements, aria-labels for accessibility, and min-h-11 mobile touch targets.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built with Vite
- **Routing**: Wouter (lightweight alternative to React Router) with lazy-loaded page components
- **State Management**: Zustand with `persist` middleware for tracking module completion progress (stored in localStorage under key `ml-explorer-progress`)
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support), using shadcn/ui component library (new-york style)
- **Animations**: Framer Motion for page transitions, bouncy hover effects, mascot animations, and screen transitions within modules
- **Icons**: Lucide React
- **Data Fetching**: TanStack React Query (configured but minimally used — app is primarily client-side)
- **UI Components**: Full shadcn/ui component library installed at `client/src/components/ui/`

### Frontend File Structure
- `client/src/pages/` — Page components (Home, Module1, ModulePlaceholder, not-found)
- `client/src/components/` — Shared components (RobotMascot SVG, ModuleCard)
- `client/src/components/ui/` — shadcn/ui primitives
- `client/src/stores/` — Zustand stores (progressStore)
- `client/src/lib/` — Utilities (moduleData definitions, queryClient, cn helper)
- `client/src/hooks/` — Custom hooks (use-mobile, use-toast)

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

### Backend Architecture
- **Framework**: Express 5 on Node.js with TypeScript (compiled via tsx)
- **Server**: HTTP server created from Express app
- **Development**: Vite dev server middleware integrated into Express for HMR
- **Production**: Static file serving from `dist/public`
- **API Pattern**: All API routes prefixed with `/api`, registered in `server/routes.ts`
- **Storage**: Currently uses in-memory storage (`MemStorage` class) with an `IStorage` interface that can be swapped for database-backed storage

### Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Defined in `shared/schema.ts` — currently only has a `users` table (id, username, password)
- **Validation**: drizzle-zod for generating Zod schemas from Drizzle table definitions
- **Migrations**: Output to `./migrations` directory
- **Schema Push**: `npm run db:push` via drizzle-kit
- **Note**: The database is not actively used by the current app functionality. Progress is tracked client-side via Zustand/localStorage.

### Build System
- **Development**: `npm run dev` — runs tsx with Vite middleware for HMR
- **Production Build**: `npm run build` — runs custom `script/build.ts` that builds the Vite client to `dist/public` and bundles the server with esbuild to `dist/index.cjs`
- **Production Start**: `npm start` — runs the bundled `dist/index.cjs`

### Design Patterns
- Kid-friendly UI: bright gradients, large touch targets (44px+), rounded corners (rounded-2xl), large text (16px+ body)
- Module structure: each module is a 7-phase flow: intro → learn → precheck → activity → results → reflection → completion (Sporty Bot pattern)
- Screen transitions use Framer Motion AnimatePresence with slide variants
- Robot mascot appears throughout with speech bubbles providing guidance
- Progress tracked per-module with completion badges shown on the home hub

## External Dependencies

### Core Runtime
- **PostgreSQL** — Database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple** — PostgreSQL session store (available but not actively configured)

### Key Frontend Libraries
- **framer-motion** — Animations and transitions
- **wouter** — Client-side routing
- **zustand** — Client-side state management with localStorage persistence
- **@tanstack/react-query** — Server state management
- **shadcn/ui** (Radix UI primitives) — Comprehensive UI component library
- **lucide-react** — Icon library
- **recharts** — Charting (available via shadcn chart component)

### Build Tools
- **Vite** — Frontend bundler with React plugin
- **esbuild** — Server bundler for production
- **tsx** — TypeScript execution for development
- **drizzle-kit** — Database migration tooling
- **@replit/vite-plugin-runtime-error-modal** — Dev error overlay

### Removed (Feb 2026)
- **ml5.js** — Removed. All modules now use fully simulated ML activities (no webcam/camera needed)