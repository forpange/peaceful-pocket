/* QuizPop engine — shared types. This file is the contract for quizzes, components and storage. */

export type Lang = 'en' | 'ro' | 'ur';

/** Localised text. `ur` (Urdu script) is optional and falls back to `ro`. */
export interface LText {
  en: string;
  ro: string;
  ur?: string;
}

export function tx(s: LText, lang: Lang): string {
  if (lang === 'ur' && s.ur) return s.ur;
  if (lang === 'ro') return s.ro;
  return s.en;
}

export type Category = 'fun' | 'fashion' | 'beauty' | 'kids' | 'shopping' | 'digital';
export type QuizKind = 'viral' | 'intent';

/**
 * Fixed interest-tag taxonomy. Every quiz option maps to tags from THIS list
 * so the admin dashboard filters stay consistent. Do not invent new tags.
 */
export const TAG_TAXONOMY = [
  'fashion-modest',
  'fashion-eastern',
  'fashion-western',
  'fashion-minimal',
  'beauty-skincare',
  'beauty-makeup',
  'budget-hunter',
  'brand-lover',
  'sale-waiter',
  'digital-planner',
  'digital-study',
  'digital-kids-books',
  'kids-learning',
  'parenting',
  'home-decor',
  'gifting',
] as const;

export type Tag = (typeof TAG_TAXONOMY)[number];

export interface QuizOption {
  id: string;
  label: LText;
  emoji?: string;
  /** interest tags granted when this option is picked (intent quizzes) */
  tags?: Tag[];
  /** points per archetype id, summed to pick the winning archetype (intent quizzes) */
  points?: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  text: LText;
  options: QuizOption[]; // exactly 4 for intent quizzes
}

export interface ResultArchetype {
  id: string;
  title: LText;
  description: LText;
  emoji: string;
}

export interface ProductRec {
  title: string;
  /** put "TODO-AFFILIATE" placeholder links here; owner replaces with real affiliate URLs */
  url: string;
  blurb: LText;
  matchTags: Tag[];
}

export interface QuizConfig {
  id: string;
  kind: QuizKind;
  category: Category;
  title: LText;
  tagline: LText;
  /** short "how it works" explainer shown on the create screen (viral quizzes) */
  howItWorks?: LText;
  emoji: string;
  /** tailwind gradient stops, e.g. "from-pink-500 via-rose-400 to-amber-300" */
  gradient: string;
  /** hex accent used for confetti etc, e.g. "#ec4899" */
  glow: string;
  /** intent quizzes: full fixed set. viral quizzes: [] (built by the creator at runtime) */
  questions: QuizQuestion[];
  /** viral quizzes: template bank the creator picks from */
  bank?: QuizQuestion[];
  /** intent quizzes: result personalities, chosen by summed points */
  archetypes?: ResultArchetype[];
  recommendations?: ProductRec[];
  /** selectable question counts, e.g. [5, 10, 15] */
  questionCounts: number[];
  /** which optional profile fields to ask before playing */
  capture: Array<'email' | 'whatsapp' | 'age' | 'city'>;
}

/** Encoded viral-quiz share payload (see storage.ts encodeShare/decodeShare). */
export interface ViralShare {
  v: 1;
  quiz: string; // QuizConfig id
  by: string; // creator nickname
  /** bank question ids, or inline custom questions */
  q: Array<string | { t: LText; o: LText[] }>;
  /** creator's chosen option index per question */
  a: number[];
}
