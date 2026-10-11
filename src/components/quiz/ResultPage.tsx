import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Lang, QuizConfig, QuizQuestion, Tag } from '../../quiz/types';
import { tx } from '../../quiz/types';
import { tr } from '../../quiz/i18n';
import { saveResponse, saveScore, getSource, playUrl, type PlayerProfile } from '../../quiz/storage';
import { ProgressRing, ShareButtons, AdSlot, useConfetti } from './atoms';

interface Props {
  quiz: QuizConfig;
  questions: QuizQuestion[];
  answers: number[];
  correctAnswers?: number[]; // viral mode
  profile: PlayerProfile;
  shareId?: string;
  creatorName?: string;
  lang: Lang;
  onRestart: () => void;
  onHome: () => void;
  onScoreboard?: () => void;
}

function viralMessage(score: number, total: number): string {
  const pct = total === 0 ? 0 : score / total;
  if (pct === 1) return '🎉 Perfect! Tum toh best friend ho!';
  if (pct >= 0.7) return '🌟 Wah! Tum kaafi ache se jante ho!';
  if (pct >= 0.4) return '👍 Not bad! Thori aur koshish karo!';
  return '🤗 Koi baat nahi — dobara try karo!';
}

export function ResultPage({
  quiz,
  questions,
  answers,
  correctAnswers,
  profile,
  shareId,
  creatorName,
  lang,
  onRestart,
  onHome,
  onScoreboard,
}: Props) {
  const isViral = Array.isArray(correctAnswers);
  const [unlocked, setUnlocked] = useState(isViral);
  const saved = useRef(false);
  const { burst } = useConfetti();

  const computed = useMemo(() => {
    if (isViral) {
      const score = answers.filter((a, i) => a === correctAnswers![i]).length;
      return { mode: 'viral' as const, score, total: questions.length, tags: [] as Tag[], archetypeId: undefined as string | undefined };
    }
    const tags = Array.from(
      new Set(questions.flatMap((q, i) => q.options[answers[i] ?? 0]?.tags ?? []))
    ) as Tag[];
    const points: Record<string, number> = {};
    questions.forEach((q, i) => {
      const pts = q.options[answers[i] ?? 0]?.points;
      if (pts) for (const k of Object.keys(pts)) points[k] = (points[k] || 0) + (pts[k] ?? 0);
    });
    let winner = quiz.archetypes?.[0];
    let best = -1;
    for (const a of quiz.archetypes || []) {
      const p = points[a.id] || 0;
      if (p > best) {
        best = p;
        winner = a;
      }
    }
    return { mode: 'intent' as const, score: undefined, total: questions.length, tags, archetypeId: winner?.id };
  }, [isViral, answers, questions, correctAnswers, quiz.archetypes]);

  useEffect(() => {
    burst([quiz.glow, '#fbbf24', '#ffffff']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    const src = profile.source || getSource();
    saveResponse({
      quizId: quiz.id,
      kind: quiz.kind,
      profile: { ...profile, source: src },
      answers,
      tags: computed.tags,
      ...(computed.mode === 'viral' ? { score: computed.score } : {}),
      total: computed.total,
      ...(computed.archetypeId ? { archetypeId: computed.archetypeId } : {}),
      ...(shareId ? { shareId } : {}),
    }).catch(() => {});
    if (computed.mode === 'viral' && shareId) {
      saveScore({ shareId, quizId: quiz.id, nickname: profile.nickname, score: computed.score!, total: computed.total }).catch(
        () => {}
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const archetype = quiz.archetypes?.find((a) => a.id === computed.archetypeId);
  const recs = useMemo(() => {
    if (!quiz.recommendations) return [];
    const matched = quiz.recommendations.filter((r) => r.matchTags.some((t) => computed.tags.includes(t)));
    return (matched.length > 0 ? matched : quiz.recommendations).slice(0, 3);
  }, [quiz.recommendations, computed.tags]);

  const shareTitle =
    computed.mode === 'viral'
      ? `${profile.nickname} scored ${computed.score}/${computed.total} — ${tr('challenge', lang)}`
      : `${tr('youAre', lang)} ${archetype ? tx(archetype.title, lang) : ''}! ${tx(quiz.title, lang)}`;
  const shareLink = computed.mode === 'viral' && shareId ? playUrl(shareId) : window.location.origin + window.location.pathname + '#/';

  return (
    <div className="mx-auto max-w-xl">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="quiz-card px-6 py-10 text-center">
        <div className="text-7xl">{computed.mode === 'viral' ? '🏆' : archetype?.emoji || quiz.emoji}</div>

        {computed.mode === 'viral' ? (
          <>
            <h2 className="font-display mt-4 text-3xl font-extrabold text-orange-950">{tr('yourScore', lang)}</h2>
            <div className="mt-4 flex justify-center">
              <ProgressRing value={computed.score!} max={computed.total} size={150} color={quiz.glow} />
            </div>
            <p className="mt-4 text-lg font-bold text-orange-900">{viralMessage(computed.score!, computed.total)}</p>
            {creatorName && (
              <p className="mt-1 text-sm font-semibold text-orange-900/60">
                {tr('resultFor', lang)} {creatorName}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="font-display mt-4 text-lg font-bold text-orange-700">{tr('youAre', lang)}</p>
            <h2 className="font-display text-4xl font-extrabold text-orange-950">
              {archetype ? tx(archetype.title, lang) : ''}
            </h2>
            {!unlocked ? (
              <div className="mt-6 rounded-2xl bg-orange-50 p-5">
                <p className="font-display text-lg font-bold text-orange-900">🔒 {tr('unlockTitle', lang)}</p>
                <p className="mt-1 text-sm font-semibold text-orange-900/70">{tr('unlockHint', lang)}</p>
                <div className="mt-4" onClick={() => setUnlocked(true)}>
                  <ShareButtons lang={lang} title={shareTitle} url={shareLink} />
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <p className="text-base font-semibold leading-relaxed text-orange-900/80">
                  {archetype ? tx(archetype.description, lang) : ''}
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* recommendations */}
        {unlocked && recs.length > 0 && (
          <div className="mt-8 text-left">
            <h3 className="font-display mb-3 text-center text-xl font-extrabold text-orange-950">
              ✨ {tr('picksForYou', lang)}
            </h3>
            <div className="flex flex-col gap-3">
              {recs.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-orange-100 bg-orange-50/60 px-4 py-3">
                  <div>
                    <p className="font-extrabold text-orange-950">{r.title}</p>
                    <p className="text-sm font-semibold text-orange-900/60">{tx(r.blurb, lang)}</p>
                  </div>
                  {r.url.startsWith('TODO') ? (
                    <span className="shrink-0 rounded-xl bg-orange-100 px-4 py-2 text-sm font-bold text-orange-400">…</span>
                  ) : (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 font-display font-bold text-white">
                      →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* share / challenge */}
        <div className="mt-8">
          <p className="font-display mb-3 text-lg font-bold text-orange-900">
            {computed.mode === 'viral' ? tr('challenge', lang) : tr('shareTitle', lang)}
          </p>
          <ShareButtons lang={lang} title={shareTitle} url={shareLink} />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {onScoreboard && (
            <button onClick={onScoreboard} className="btn-chunky bg-violet-500 text-sm">
              🏅 {tr('scoreboard', lang)}
            </button>
          )}
          <button onClick={onRestart} className="btn-chunky bg-orange-500 text-sm">
            🔁 {tr('playAgain', lang)}
          </button>
          <button onClick={onHome} className="btn-chunky bg-orange-200 !text-orange-900 text-sm">
            {tr('tryAnother', lang)}
          </button>
        </div>
      </motion.div>

      <div className="mt-6">
        <AdSlot lang={lang} />
      </div>
    </div>
  );
}
