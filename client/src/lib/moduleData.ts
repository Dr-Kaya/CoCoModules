import { Tag, ArrowLeftRight, Scale, Search, FlaskConical, Map, Dribbble } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ModuleInfo {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  borderColor: string;
  bgLight: string;
  externalUrl?: string;
}

export const modules: ModuleInfo[] = [
  {
    id: 1,
    icon: Tag,
    title: "Teach the Sorting Robot",
    description: "Sort items into groups to teach a robot how to label data",
    gradient: "from-blue-400 to-indigo-500",
    borderColor: "border-blue-400",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: 2,
    icon: ArrowLeftRight,
    title: "Healthy or Treat?",
    description: "Sort foods into two groups to learn binary classification",
    gradient: "from-emerald-400 to-teal-500",
    borderColor: "border-emerald-400",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    id: 3,
    icon: Scale,
    title: "Fair or Unfair AI?",
    description: "Discover what happens when AI training data is unbalanced",
    gradient: "from-orange-400 to-red-500",
    borderColor: "border-orange-400",
    bgLight: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    id: 4,
    icon: Search,
    title: "The Data Detective",
    description: "Investigate why more data helps AI learn better",
    gradient: "from-purple-400 to-pink-500",
    borderColor: "border-purple-400",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    id: 5,
    icon: FlaskConical,
    title: "Test Your Robot's Brain",
    description: "Test an AI with new data to see if it really learned",
    gradient: "from-cyan-400 to-blue-500",
    borderColor: "border-cyan-400",
    bgLight: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    id: 6,
    icon: Map,
    title: "My ML Adventure",
    description: "Go on a journey through the complete ML lifecycle",
    gradient: "from-yellow-400 to-orange-500",
    borderColor: "border-yellow-400",
    bgLight: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  {
    id: 7,
    icon: Dribbble,
    title: "Sporty Bot",
    description: "Teach an AI to tell basketballs from soccer balls",
    gradient: "from-green-400 to-lime-500",
    borderColor: "border-green-400",
    bgLight: "bg-green-50 dark:bg-green-950/30",
    externalUrl: "https://sporty-bot-1.replit.app/",
  },
];
