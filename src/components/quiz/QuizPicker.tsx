import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { QUIZZES } from '../../quiz/quizzes';
import type { Category, Lang, QuizConfig } from '../../quiz/types';
import { tx } from '../../quiz/types';
import { tr, type StringKey } from '../../quiz/i18n';

const CATS: Category[] = ['fun', 'fashion', 'beauty', 'kids', 'shopping', 'digital'];

function catKey(c: Category): StringKey {
  return `cat_${c}` as StringKey;
}

interface Props {
  lang: Lang;
  onSelect: (q: QuizConfig) => void;
}

export function QuizPicker({ lang, onSelect }: Props) {
  const [cat, setCat] = useState<'all' | Category>('all');
  const [search, setSearch] = useState('');

  const list = useMemo(
    () =>
      QUIZZES.filter(
        (q) =>
          (cat === 'all' || q.category === cat) &&
          (tx(q.title, lang) + ' ' + tx(q.tagline, lang)).toLowerCase().includes(search.toLowerCase())
      ),
    [cat, search, lang]
  );

  return (
    <div>
      {/* search */}
      <div className="mb-4">
        <input
          className="input-chunky"
          placeholder={tr('searchQuizzes', lang)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* category chips */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCat('all')}
          className={`shrink-0 rounded-full px-4 py-2 font-display font-bold transition-all ${
            cat === 'all' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-orange-900 border-2 border-orange-100'
          }`}
        >
          {tr('all', lang)}
        </button>
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-2 font-display font-bold transition-all ${
              cat === c ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-orange-900 border-2 border-orange-100'
            }`}
          >
            {tr(catKey(c), lang)}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {list.map((q, i) => (
          <motion.button
            key={q.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.3) }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(q)}
            className="quiz-card overflow-hidden text-left"
          >
            <div className={`bg-gradient-to-br ${q.gradient} px-6 pb-6 pt-8 text-center`}>
              <div className="animate-float text-6xl">{q.emoji}</div>
            </div>
            <div className="px-6 py-5">
              <div className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-orange-700">
                {tr(catKey(q.category), lang)}
              </div>
              <h3 className="font-display text-2xl font-extrabold leading-tight text-orange-950">{tx(q.title, lang)}</h3>
              <p className="mt-1 text-sm font-semibold text-orange-900/70">{tx(q.tagline, lang)}</p>
              <div className="mt-4 inline-flex items-center gap-2 font-display font-bold text-orange-600">
                {q.kind === 'viral' ? tr('createOwn', lang) : tr('playNow', lang)} →
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {list.length === 0 && (
        <div className="quiz-card px-6 py-12 text-center font-bold text-orange-900/60">{tr('noData', lang)}</div>
      )}
    </div>
  );
}
