import type { QuizConfig } from '../types';
import { stylePersonality } from './stylePersonality';
import { skincareScore } from './skincareScore';
import { shoppingPersonality } from './shoppingPersonality';
import { plannerFinder } from './plannerFinder';
import { kidsLearning } from './kidsLearning';
import { giftFinder } from './giftFinder';
import { fakeFriends } from './fakeFriends';
import { wellWisher } from './wellWisher';

/**
 * Full quiz registry. Viral quizzes first (traffic drivers),
 * then the buyer-intent quizzes (data + revenue).
 * NOTE: the 6 intent quiz configs are being written in parallel —
 * this file compiles once all 8 files exist.
 */
export const QUIZZES: QuizConfig[] = [
  fakeFriends,
  wellWisher,
  stylePersonality,
  skincareScore,
  shoppingPersonality,
  plannerFinder,
  kidsLearning,
  giftFinder,
];

export function getQuiz(id: string): QuizConfig | undefined {
  return QUIZZES.find((q) => q.id === id);
}
