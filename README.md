# ML Explorer

**Interactive Machine Learning for Young Minds**

ML Explorer is an interactive educational web application designed to teach elementary students (grades 3-5) foundational machine learning concepts through hands-on, gamified modules. Students learn by doing -- sorting, classifying, training simulated models, and reflecting on what they learned -- all guided by a friendly robot mascot.

---

## Table of Contents

- [Features](#features)
- [Modules](#modules)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Shared Components](#shared-components)
- [State Management](#state-management)
- [Theming and Styling](#theming-and-styling)
- [Build and Deployment](#build-and-deployment)
- [Scripts](#scripts)
- [License](#license)

---

## Features

- 6 fully interactive, self-contained learning modules covering core ML concepts
- Friendly animated robot mascot with multiple mood states that guides students through each lesson
- Sound effects (toggle on/off) with Web Audio API oscillator beeps
- Progress tracking with completion badges, persisted in the browser via localStorage
- Kid-friendly UI with large touch targets, bright gradients, and playful animations
- Responsive design that works on tablets and desktops
- Confetti celebrations and achievement badges on module completion
- Pre-checks, mid-activity checks, and self-reflection prompts built into every module
- Accessibility features including aria-labels, keyboard navigation, and semantic HTML
- No camera, microphone, or external AI services required -- all activities are fully simulated

---

## Modules

Each module follows a consistent 7-phase learning flow:

**Intro** - Meet the robot and see learning goals  
**Learn** - Watch an animated step-by-step explanation  
**Pre-Check** - Answer a multiple-choice question to gauge prior knowledge  
**Activity** - Complete the hands-on interactive task  
**Results** - View your score and performance summary  
**Reflection** - Self-assess your understanding  
**Completion** - Earn a badge and see the key takeaway  

### Module 1: Teach the Sorting Robot
**Concept:** Data Labeling  
Sort 10 items (animals, foods, toys) into three labeled bins to teach the robot what each category looks like. Learn why labeled data is essential for machine learning.

### Module 2: Healthy or Treat?
**Concept:** Binary Classification  
Classify 12 food items as either "Healthy" or "Treat" to understand how machines sort data into exactly two groups. Includes a "machine training" simulation showing how the robot uses your labels.

### Module 3: Fair or Unfair AI?
**Concept:** Bias in AI  
Compare what happens when an AI is trained on biased (unbalanced) data versus balanced data. See firsthand how data representation affects model fairness and accuracy.

### Module 4: The Data Detective
**Concept:** Data Quality and Quantity  
Investigate how the amount of training data affects accuracy across 3 rounds with increasing dataset sizes. Discover why more diverse data leads to better-performing models.

### Module 5: Test Your Robot's Brain
**Concept:** Model Evaluation (Train/Test Split)  
Train a weather classifier and then test it on new, unseen data. Learn why testing on fresh data is the only way to know if a model has truly learned.

### Module 6: My ML Adventure
**Concept:** The Complete ML Lifecycle  
Take a 5-stop journey through the entire machine learning process: Collect data, Label it, Train a model, Test it, and Improve it. Ties together everything from the previous modules.

### Module 7: Sporty Bot (External)
An external companion activity hosted at [sporty-bot-1.replit.app](https://sporty-bot-1.replit.app/) where students teach an AI to distinguish basketballs from soccer balls.

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts the Express backend server with Vite middleware for hot module replacement. The app will be available at `http://localhost:5000`.

### Production Build

```bash
npm run build
npm start
```

The build step compiles the React frontend to `dist/public` and bundles the server to `dist/index.cjs`.

---

## Project Structure

```
.
├── client/                     # Frontend application
│   ├── index.html              # HTML entry point
│   ├── public/                 # Static assets
│   │   └── favicon.png
│   └── src/
│       ├── App.tsx             # Root component with routing
│       ├── main.tsx            # React entry point
│       ├── index.css           # Global styles and CSS variables
│       ├── pages/              # Page components
│       │   ├── Home.tsx        # Module hub with progress overview
│       │   ├── Module1.tsx     # Data Labeling module
│       │   ├── Module2.tsx     # Binary Classification module
│       │   ├── Module3.tsx     # AI Bias module
│       │   ├── Module4.tsx     # Data Quality module
│       │   ├── Module5.tsx     # Model Evaluation module
│       │   ├── Module6.tsx     # ML Lifecycle module
│       │   ├── ModulePlaceholder.tsx  # Fallback for unbuilt modules
│       │   └── not-found.tsx   # 404 page
│       ├── components/
│       │   ├── ModuleCard.tsx  # Module selection card for home page
│       │   ├── RobotMascot.tsx # Animated SVG robot mascot
│       │   ├── shared/        # Reusable module components
│       │   │   ├── ModuleLayout.tsx         # Module wrapper with header/progress
│       │   │   ├── QuickCheck.tsx           # Multiple-choice quiz component
│       │   │   ├── SelfRegulatedCheck.tsx   # Reflection/self-assessment
│       │   │   ├── VideoPlaceholder.tsx     # Animated learning steps
│       │   │   ├── SpeechBubble.tsx         # Robot speech bubble
│       │   │   ├── ConfettiEffect.tsx       # Celebration animation
│       │   │   └── SoundEffectsProvider.tsx # Sound toggle context
│       │   └── ui/            # shadcn/ui component library
│       ├── stores/
│       │   └── progressStore.ts  # Zustand store for module progress
│       ├── lib/
│       │   ├── moduleData.ts   # Module metadata definitions
│       │   ├── queryClient.ts  # TanStack Query configuration
│       │   └── utils.ts        # Utility functions (cn helper)
│       └── hooks/
│           ├── use-mobile.tsx  # Mobile detection hook
│           └── use-toast.ts    # Toast notification hook
├── server/                     # Backend application
│   ├── index.ts               # Express server setup
│   ├── routes.ts              # API route registration
│   ├── storage.ts             # Storage interface and in-memory implementation
│   ├── vite.ts                # Vite dev server integration
│   └── static.ts              # Production static file serving
├── shared/                    # Shared between frontend and backend
│   └── schema.ts             # Drizzle ORM schema and Zod types
├── script/
│   └── build.ts              # Production build script
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── drizzle.config.ts
└── components.json           # shadcn/ui configuration
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Wouter | Lightweight client-side routing |
| Zustand | State management with localStorage persistence |
| Framer Motion | Animations and page transitions |
| Tailwind CSS | Utility-first styling |
| shadcn/ui (Radix UI) | Accessible UI component primitives |
| Lucide React | Icon library |
| TanStack React Query | Server state management (configured, minimally used) |

### Backend
| Technology | Purpose |
|---|---|
| Express 5 | HTTP server framework |
| Node.js | Runtime |
| tsx | TypeScript execution in development |
| esbuild | Server bundling for production |
| Drizzle ORM | Database ORM (configured, not actively used) |
| PostgreSQL | Database (available, not required for current features) |

---

## Architecture

### Client-Side Application

ML Explorer is primarily a client-side application. The Express backend serves the React frontend and is set up to support API routes, but the current educational modules run entirely in the browser.

**Routing:** Wouter handles client-side navigation between the home page and individual module pages. All module pages are lazy-loaded for performance.

**Module Pattern:** Each module (Module1 through Module6) is a self-contained page component that manages its own multi-screen flow using local React state. Screens transition with Framer Motion slide animations.

**Simulated ML:** All machine learning activities use deterministic or probabilistic JavaScript simulations rather than actual ML models. This means no external services, no API keys, and no camera access is needed.

### Backend

The Express server provides:
- Vite dev server integration for hot module replacement in development
- Static file serving in production
- An API route registration system ready for future expansion
- An in-memory storage layer with an interface that can be swapped for database-backed storage

---

## Shared Components

The app uses a shared component architecture to maintain consistency across all 6 modules:

### ModuleLayout
Wraps every module page. Provides a sticky header with a back button, breadcrumb navigation, and an animated progress bar. Includes an error boundary that shows a friendly error screen with the robot mascot.

### QuickCheck
A multiple-choice question component used for pre-checks and mid-activity knowledge checks. Shows instant feedback (correct/incorrect) with explanations.

### SelfRegulatedCheck
A reflection component presented at the end of each module. Students self-assess their understanding by choosing from options like "Still learning," "Getting it!," or "I totally get it!"

### VideoPlaceholder
An animated step-by-step visualization that replaces traditional video content. Shows icon-based learning steps with progress animation.

### RobotMascot
An SVG-based animated robot character with 6 mood states: happy, excited, thinking, confused, celebrating, and neutral. The robot's expression and glow color change based on context.

### SpeechBubble
A styled speech bubble component that displays the robot's dialogue. Supports configurable colors and positioning.

### ConfettiEffect
A celebration animation triggered on module completion. Automatically plays a celebration sound effect.

### SoundEffectsProvider
A React context provider that manages sound effects using the Web Audio API. Generates oscillator-based beep sounds for events like correct answers, wrong answers, clicks, and celebrations. The sound toggle state persists in localStorage.

---

## State Management

### Progress Tracking (Zustand)

Module completion progress is managed by a Zustand store with the `persist` middleware. The store tracks:

- `completedModules` -- array of completed module IDs
- `currentModule` -- the currently active module (or null)
- `totalBadges` -- count of earned badges

Progress is saved to localStorage under the key `ml-explorer-progress` and persists across browser sessions.

### Module State (React useState)

Each module manages its own internal flow state (current screen, score, sorted items, etc.) using React's `useState` hook. This state resets when the student navigates away from the module.

---

## Theming and Styling

The app uses Tailwind CSS with CSS custom properties defined in `client/src/index.css`. The color system supports light and dark modes through the `.dark` class on the document root.

Key design principles:
- **Kid-friendly:** Bright gradient backgrounds, large rounded corners (`rounded-2xl`), playful color schemes
- **Accessible:** Minimum 44px touch targets, semantic HTML, aria-labels on interactive elements
- **Responsive:** Works on tablets (768px+) and desktops with flexible grid layouts
- **Animated:** Framer Motion drives page transitions, hover effects, and mascot animations

---

## Build and Deployment

### Development Mode
`npm run dev` starts the Express server with Vite middleware. The Vite dev server handles React HMR and asset serving.

### Production Build
`npm run build` runs `script/build.ts` which:
1. Builds the Vite client bundle to `dist/public`
2. Bundles the server with esbuild to `dist/index.cjs`

### Production Start
`npm start` runs the bundled `dist/index.cjs` which serves the static frontend and any API routes.

The app binds to `0.0.0.0:5000` (or the port specified by the `PORT` environment variable).

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push Drizzle schema to database |

---

## License

MIT
