import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lang, QuizConfig, QuizQuestion } from '../../quiz/types';
import { tx } from '../../quiz/types';
import { tr } from '../../quiz/i18n';
import { useConfetti } from './atoms';

interface Props {
  quiz: QuizConfig;
  questions: QuizQuestion[];
  correctAnswers?: number[]; // viral play mode
  lang: Lang;
  onFinish: (answers: number[]) => void;
  onBack: () => void;
}

export function QuizPlayer({ quiz, questions, lang, onFinish, onBack }: Props) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const { burst } = useConfetti();

  const total = questions.length;
  const q = questions[idx] ?? questions[0]!;

  const pick = (oi: number) => {
    if (picked !== null) return;
    setPicked(oi);
    const next = [...answers];
    next[idx] = oi;
    setAnswers(next);
    burst([quiz.glow, '#fbbf24', '#ffffff']);
    window.setTimeout(() => {
      if (idx + 1 < total) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        onFinish(next);
      }
    }, 500);
  };

  const goBack = () => {
    if (idx === 0) {
      onBack();
      return;
    }
    setIdx(idx - 1);
    setPicked(answers[idx - 1] ?? null);
  };

  return (
    <div className="mx-auto max-w-xl">
      {/* progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between font-display font-bold text-orange-900">
          <button onClick={goBack} className="underline-offset-2 hover:underline">
            ← {tr('back', lang)}
          </button>
          <span>
            {idx + 1} / {total} {tr('questions', lang)}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-orange-100">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${quiz.gradient}`}
            animate={{ width: `${((idx + (picked !== null ? 1 : 0)) / total) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.22 }}
          className="quiz-card px-6 py-8"
        >
          <h2 className="font-display text-center text-2xl font-extrabold leading-snug text-orange-950">
            {tx(q.text, lang)}
          </h2>
          <div className="mt-6 flex flex-col gap-3">
            {q.options.map((op, oi) => (
              <motion.button
                key={op.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => pick(oi)}
                className={`option-card ${picked === oi ? 'selected' : ''}`}
              >
                <span className="mr-2 text-2xl">{op.emoji || '🔸'}</span>
                {tx(op.label, lang)}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
