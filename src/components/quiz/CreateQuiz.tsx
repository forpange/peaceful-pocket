import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Lang, LText, QuizConfig, ViralShare } from '../../quiz/types';
import { tx } from '../../quiz/types';
import { tr } from '../../quiz/i18n';
import { encodeShare } from '../../quiz/storage';

interface CreateQuizProps {
  quiz: QuizConfig;
  lang: Lang;
  count: number;
  onDone: (shareId: string) => void;
  onBack: () => void;
}

interface SelectedQ {
  uid: string;
  bankId?: string;
  text: LText;
  options: LText[];
  correctIndex: number | null;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function CreateQuiz({ quiz, lang, count, onDone, onBack }: CreateQuizProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [nickname, setNickname] = useState('');
  const [selected, setSelected] = useState<SelectedQ[]>([]);

  // custom question form
  const [cqText, setCqText] = useState('');
  const [cqOpts, setCqOpts] = useState<string[]>(['', '', '', '']);
  const [cqCorrect, setCqCorrect] = useState<number | null>(null);

  const bank = quiz.bank ?? [];

  const toggleBank = (id: string) => {
    setSelected((prev) => {
      if (prev.some((s) => s.bankId === id)) return prev.filter((s) => s.bankId !== id);
      if (prev.length >= count) return prev;
      const q = bank.find((b) => b.id === id);
      if (!q) return prev;
      return [
        ...prev,
        { uid: uid(), bankId: id, text: q.text, options: q.options.map((o) => o.label), correctIndex: null },
      ];
    });
  };

  const setAnswer = (targetUid: string, idx: number) => {
    setSelected((prev) => prev.map((s) => (s.uid === targetUid ? { ...s, correctIndex: idx } : s)));
  };

  const removeSelected = (targetUid: string) => {
    setSelected((prev) => prev.filter((s) => s.uid !== targetUid));
  };

  const setCqOpt = (i: number, v: string) => {
    setCqOpts((prev) => prev.map((o, j) => (j === i ? v : o)));
  };

  const canAddCustom =
    cqText.trim() !== '' &&
    cqOpts.every((o) => o.trim() !== '') &&
    cqCorrect !== null &&
    selected.length < count;

  const addCustom = () => {
    if (!canAddCustom || cqCorrect === null) return;
    const t: LText = { en: cqText.trim(), ro: cqText.trim() };
    setSelected((prev) => [
      ...prev,
      {
        uid: uid(),
        text: t,
        options: cqOpts.map((o) => ({ en: o.trim(), ro: o.trim() })),
        correctIndex: cqCorrect,
      },
    ]);
    setCqText('');
    setCqOpts(['', '', '', '']);
    setCqCorrect(null);
  };

  const allAnswered = selected.length === count && selected.every((s) => s.correctIndex !== null);
  const canSubmit = nickname.trim() !== '' && allAnswered;

  const submit = () => {
    if (!canSubmit) return;
    const payload: ViralShare = {
      v: 1,
      quiz: quiz.id,
      by: nickname.trim(),
      q: selected.map((sel) => (sel.bankId ? sel.bankId : { t: sel.text, o: sel.options })),
      a: selected.map((sel) => sel.correctIndex ?? 0),
    };
    onDone(encodeShare(payload));
  };

  /* ---------------- step 1: nickname ---------------- */
  if (step === 1) {
    return (
      <div className="quiz-card mx-auto w-full max-w-md p-6">
        <div className="mb-4 text-center">
          <div className="mb-2 text-5xl">{quiz.emoji}</div>
          <h2 className="font-display text-2xl font-bold text-orange-950">{tx(quiz.title, lang)}</h2>
          {quiz.howItWorks && (
            <p className="mt-2 rounded-2xl bg-orange-50 p-3 text-sm font-semibold text-orange-800">
              {tx(quiz.howItWorks, lang)}
            </p>
          )}
        </div>
        <label className="mb-4 block">
          <span className="font-display mb-1 block font-bold text-orange-950">{tr('yourName', lang)}</span>
          <input
            className="input-chunky"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={tr('namePlaceholder', lang)}
            maxLength={24}
          />
        </label>
        <div className="flex gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={onBack} className="btn-chunky bg-orange-200 !text-orange-900">
            ← {tr('back', lang)}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => nickname.trim() && setStep(2)}
            disabled={!nickname.trim()}
            className="btn-chunky flex-1 bg-orange-500"
          >
            {tr('continue', lang)} →
          </motion.button>
        </div>
      </div>
    );
  }

  /* ---------------- step 2: pick questions ---------------- */
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="quiz-card mb-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-orange-950">
            {quiz.emoji} {tr('pickQuestions', lang)}
          </h2>
          <span className="font-display rounded-full bg-orange-100 px-4 py-1 font-bold text-orange-700">
            {selected.length} / {count} {tr('pickedCount', lang)}
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-orange-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-500"
            animate={{ width: `${(selected.length / count) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      {/* bank questions */}
      <div className="mb-4 flex flex-col gap-3">
        {bank.map((q) => {
          const sel = selected.find((s) => s.bankId === q.id);
          const isOn = !!sel;
          const full = !isOn && selected.length >= count;
          return (
            <div key={q.id} className={`option-card !p-0 ${isOn ? 'selected' : ''} ${full ? 'opacity-40' : ''}`}>
              <button
                onClick={() => toggleBank(q.id)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-display font-bold ${
                    isOn ? 'border-orange-500 bg-orange-500 text-white' : 'border-orange-200 text-orange-300'
                  }`}
                >
                  {isOn ? '✓' : '+'}
                </span>
                <span className="font-bold text-orange-950">{tx(q.text, lang)}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOn && sel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t-2 border-orange-100 px-5 pb-4 pt-3">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                        👆 {tr('tapCorrect', lang)}
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {sel.options.map((o, i) => (
                          <button
                            key={i}
                            onClick={() => setAnswer(sel.uid, i)}
                            className={`rounded-xl border-2 px-3 py-2 text-sm font-bold transition-all ${
                              sel.correctIndex === i
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-orange-100 bg-white text-orange-800 hover:border-orange-300'
                            }`}
                          >
                            {sel.correctIndex === i ? '✅ ' : ''}
                            {tx(o, lang)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* custom question form */}
      <div className="quiz-card mb-4 p-5">
        <h3 className="font-display mb-3 text-lg font-bold text-orange-950">✏️ {tr('addCustom', lang)}</h3>
        <input
          className="input-chunky mb-3"
          value={cqText}
          onChange={(e) => setCqText(e.target.value)}
          placeholder={tr('questionTextPh', lang)}
          maxLength={120}
        />
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {cqOpts.map((o, i) => (
            <button
              key={i}
              onClick={() => setCqCorrect(i)}
              className={`rounded-xl border-2 p-1 transition-all ${
                cqCorrect === i ? 'border-green-500 bg-green-50' : 'border-orange-100 bg-white'
              }`}
            >
              <span className="mb-1 block text-xs font-bold text-orange-400">
                {cqCorrect === i ? '✅ ' : ''}
                {tr('optionPh', lang)} {i + 1}
              </span>
              <input
                className="w-full rounded-lg bg-transparent px-2 py-1 font-semibold outline-none"
                value={o}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setCqOpt(i, e.target.value)}
                maxLength={60}
              />
            </button>
          ))}
        </div>
        <p className="mb-3 text-xs font-bold text-orange-400">👆 {tr('tapCorrect', lang)}</p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={addCustom}
          disabled={!canAddCustom}
          className="btn-chunky w-full bg-sky-500"
        >
          ➕ {tr('addQuestion', lang)}
        </motion.button>

        {/* added custom questions */}
        {selected.filter((s) => !s.bankId).length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {selected
              .filter((s) => !s.bankId)
              .map((s) => (
                <div
                  key={s.uid}
                  className="flex items-center justify-between rounded-xl border-2 border-green-200 bg-green-50 px-3 py-2"
                >
                  <span className="truncate text-sm font-bold text-green-800">✅ {tx(s.text, lang)}</span>
                  <button
                    onClick={() => removeSelected(s.uid)}
                    className="ml-2 shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-sm font-bold text-red-500"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pb-6">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(1)} className="btn-chunky bg-orange-200 !text-orange-900">
          ← {tr('back', lang)}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          disabled={!canSubmit}
          className="btn-chunky flex-1 bg-gradient-to-r from-orange-500 to-pink-500"
        >
          🔗 {tr('createShare', lang)}
        </motion.button>
      </div>
    </div>
  );
}
