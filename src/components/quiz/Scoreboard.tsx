import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Lang, QuizConfig } from '../../quiz/types';
import { tx } from '../../quiz/types';
import { tr } from '../../quiz/i18n';
import { listScores, type ScoreEntry } from '../../quiz/storage';

interface ScoreboardProps {
  quiz: QuizConfig;
  shareId: string;
  by: string;
  lang: Lang;
  onPlayAgain: () => void;
  onCreateOwn: () => void;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function Scoreboard({ quiz, shareId, by, lang, onPlayAgain, onCreateOwn }: ScoreboardProps) {
  const [scores, setScores] = useState<ScoreEntry[] | null>(null);

  useEffect(() => {
    let live = true;
    listScores(shareId).then((s) => {
      if (live) setScores(s);
    });
    return () => {
      live = false;
    };
  }, [shareId]);

  return (
    <div className="quiz-card mx-auto w-full max-w-md p-6">
      <div className="mb-6 text-center">
        <div className="mb-2 text-5xl">{quiz.emoji}</div>
        <h2 className="font-display text-2xl font-bold text-orange-950">{tx(quiz.title, lang)}</h2>
        <p className="text-sm font-bold text-orange-400">by {by}</p>
        <h3 className="font-display mt-4 text-xl font-bold text-orange-950">🏆 {tr('scoreboard', lang)}</h3>
      </div>

      {scores === null ? (
        <p className="py-8 text-center font-bold text-orange-400">{tr('loading', lang)}</p>
      ) : scores.length === 0 ? (
        <p className="py-8 text-center font-bold text-orange-400">{tr('noScores', lang)}</p>
      ) : (
        <ul className="mb-6 flex flex-col gap-2">
          {scores.map((s, i) => (
            <motion.li
              key={`${s.nickname}-${s.createdAt}-${i}`}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.06, 0.6) }}
              className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 font-bold ${
                i === 0 ? 'border-amber-300 bg-amber-50' : 'border-orange-100 bg-white'
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="w-8 shrink-0 text-center text-xl">{MEDALS[i] ?? `${i + 1}.`}</span>
                <span className="truncate text-orange-950">{s.nickname}</span>
              </span>
              <span className="font-display shrink-0 text-lg text-orange-950">
                {s.score}/{s.total}
              </span>
            </motion.li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3">
        <motion.button whileTap={{ scale: 0.97 }} onClick={onPlayAgain} className="btn-chunky w-full bg-orange-500">
          🎮 {tr('playAgain', lang)}
        </motion.button>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onCreateOwn} className="btn-chunky w-full bg-pink-500">
          ✨ {tr('createOwn', lang)}
        </motion.button>
      </div>
    </div>
  );
}
