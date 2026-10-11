import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getQuiz } from '../quiz/quizzes';
import { decodeShare, playUrl, type PlayerProfile } from '../quiz/storage';
import type { Lang, QuizConfig, QuizQuestion } from '../quiz/types';
import { tx } from '../quiz/types';
import { tr } from '../quiz/i18n';
import { QuizPicker } from '../components/quiz/QuizPicker';
import { ProfileGate } from '../components/quiz/ProfileGate';
import { QuizPlayer } from '../components/quiz/QuizPlayer';
import { ResultPage } from '../components/quiz/ResultPage';
import { CreateQuiz } from '../components/quiz/CreateQuiz';
import { Scoreboard } from '../components/quiz/Scoreboard';
import { ShareButtons, AdSlot } from '../components/quiz/atoms';
import { AdminDashboard } from '../components/admin/AdminDashboard';

type Route =
  | { name: 'home' }
  | { name: 'quiz'; id: string }
  | { name: 'play'; shareId: string }
  | { name: 'scoreboard'; shareId: string }
  | { name: 'share'; shareId: string }
  | { name: 'admin' }
  | { name: 'privacy' };

function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  if (parts[0] === 'quiz' && parts[1]) return { name: 'quiz', id: decodeURIComponent(parts[1]) };
  if (parts[0] === 'play' && parts[1]) return { name: 'play', shareId: parts[1] };
  if (parts[0] === 'scoreboard' && parts[1]) return { name: 'scoreboard', shareId: parts[1] };
  if (parts[0] === 'share' && parts[1]) return { name: 'share', shareId: parts[1] };
  if (parts[0] === 'admin') return { name: 'admin' };
  if (parts[0] === 'privacy') return { name: 'privacy' };
  return { name: 'home' };
}

function go(hash: string) {
  window.location.hash = hash;
}

const LANGS: Lang[] = ['en', 'ro', 'ur'];
const LANG_LABEL: Record<Lang, string> = { en: 'EN', ro: 'RO', ur: 'اردو' };

/* ---------------- header / footer ---------------- */

function Header({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-orange-100 bg-[#fff7ed]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <button onClick={() => go('#/')} className="flex items-center gap-2">
          <span className="text-3xl">🎯</span>
          <span className="font-display text-2xl font-extrabold text-orange-950">{tr('appName', lang)}</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-full border-2 border-orange-200">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 text-sm font-extrabold ${lang === l ? 'bg-orange-500 text-white' : 'bg-white text-orange-900'}`}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
          <button onClick={() => go('#/admin')} className="rounded-full border-2 border-orange-200 bg-white px-3 py-1 text-sm font-extrabold text-orange-900" title={tr('admin', lang)}>
            📊
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="mx-auto mt-12 max-w-5xl px-4 pb-10 text-center">
      <div className="flex items-center justify-center gap-4 text-sm font-bold text-orange-700">
        <button onClick={() => go('#/privacy')} className="underline-offset-2 hover:underline">{tr('privacy', lang)}</button>
        <span>·</span>
        <button onClick={() => go('#/admin')} className="underline-offset-2 hover:underline">{tr('admin', lang)}</button>
      </div>
      <p className="mt-2 text-xs font-semibold text-orange-900/50">{tr('madeWith', lang)} 🎯</p>
    </footer>
  );
}

/* ---------------- home ---------------- */

function HomeScreen({ lang, onSelect }: { lang: Lang; onSelect: (q: QuizConfig) => void }) {
  return (
    <div>
      <div className="bg-dots rounded-3xl bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 px-6 py-12 text-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="mb-3 flex justify-center gap-3 text-5xl"
        >
          <span className="animate-wiggle">🎯</span>
          <span className="animate-float">🎉</span>
          <span className="animate-wiggle">💡</span>
        </motion.div>
        <h1 className="font-display text-4xl font-extrabold drop-shadow-sm sm:text-5xl">{tr('appName', lang)}</h1>
        <p className="mt-2 text-lg font-bold text-white/90">{tr('tagline', lang)}</p>
        <p className="mt-4 inline-block rounded-full bg-white/25 px-5 py-2 font-display font-bold backdrop-blur">
          {tr('chooseQuiz', lang)} 👇
        </p>
      </div>

      <div className="mt-8">
        <QuizPicker lang={lang} onSelect={onSelect} />
      </div>

      <div className="mt-8">
        <AdSlot lang={lang} />
      </div>
    </div>
  );
}

/* ---------------- quiz detail: count -> create / profile -> play -> result ---------------- */

function QuizDetailScreen({ quiz, lang, onHome }: { quiz: QuizConfig; lang: Lang; onHome: () => void }) {
  const [count, setCount] = useState(quiz.questionCounts[0] ?? 10);
  const [stage, setStage] = useState<'detail' | 'create' | 'profile' | 'playing' | 'result'>('detail');
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = useMemo(() => quiz.questions.slice(0, count), [quiz, count]);

  if (stage === 'create') {
    return <CreateQuiz quiz={quiz} lang={lang} count={count} onBack={() => setStage('detail')} onDone={(sid) => go(`#/share/${sid}`)} />;
  }
  if (stage === 'profile') {
    return (
      <ProfileGate
        quiz={quiz}
        lang={lang}
        onBack={() => setStage('detail')}
        onContinue={(p) => {
          setProfile(p);
          setStage('playing');
        }}
      />
    );
  }
  if (stage === 'playing' && profile) {
    return (
      <QuizPlayer
        quiz={quiz}
        questions={questions}
        lang={lang}
        onBack={() => setStage('profile')}
        onFinish={(a) => {
          setAnswers(a);
          setStage('result');
        }}
      />
    );
  }
  if (stage === 'result' && profile) {
    return (
      <ResultPage
        quiz={quiz}
        questions={questions}
        answers={answers}
        profile={profile}
        lang={lang}
        onRestart={() => setStage('playing')}
        onHome={onHome}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl">
      <div className={`rounded-3xl bg-gradient-to-br ${quiz.gradient} px-6 py-10 text-center text-white`}>
        <div className="animate-float text-7xl">{quiz.emoji}</div>
        <h1 className="font-display mt-3 text-3xl font-extrabold">{tx(quiz.title, lang)}</h1>
        <p className="mt-2 font-bold text-white/90">{tx(quiz.tagline, lang)}</p>
      </div>

      <div className="quiz-card mt-6 px-6 py-6">
        {quiz.howItWorks && <p className="mb-4 text-sm font-semibold text-orange-900/70">💡 {tx(quiz.howItWorks, lang)}</p>}
        <p className="font-display mb-3 text-lg font-extrabold text-orange-950">{tr('howMany', lang)}</p>
        <div className="mb-6 flex gap-3">
          {quiz.questionCounts.map((c) => (
            <button
              key={c}
              onClick={() => setCount(c)}
              className={`flex-1 rounded-2xl border-2 px-4 py-3 font-display text-xl font-extrabold transition-all ${
                count === c ? 'border-orange-500 bg-orange-500 text-white shadow-lg' : 'border-orange-200 bg-white text-orange-900'
              }`}
            >
              {c}
              <span className="block text-xs font-bold opacity-70">{tr('questions', lang)}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setStage(quiz.kind === 'viral' ? 'create' : 'profile')} className={`btn-chunky w-full ${quiz.kind === 'viral' ? 'bg-violet-500' : 'bg-orange-500'}`}>
          {quiz.kind === 'viral' ? tr('createOwn', lang) : tr('start', lang)} →
        </button>
        <button onClick={onHome} className="mt-3 w-full font-bold text-orange-700 underline-offset-2 hover:underline">
          ← {tr('back', lang)}
        </button>
      </div>
    </motion.div>
  );
}

/* ---------------- viral play via shared link ---------------- */

function PlayScreen({ shareId, lang, onHome }: { shareId: string; lang: Lang; onHome: () => void }) {
  const payload = useMemo(() => decodeShare(shareId), [shareId]);
  const quiz = payload ? getQuiz(payload.quiz) : undefined;
  const [stage, setStage] = useState<'profile' | 'playing' | 'result'>('profile');
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions: QuizQuestion[] = useMemo(() => {
    if (!payload || !quiz) return [];
    return payload.q.map((qq, i) => {
      if (typeof qq === 'string') {
        const found = quiz.bank?.find((b) => b.id === qq);
        if (found) return found;
      } else {
        return {
          id: `custom-${i}`,
          text: qq.t,
          options: qq.o.map((label, oi) => ({ id: `c${i}o${oi}`, label, emoji: '🔸' })),
        } as QuizQuestion;
      }
      return { id: `missing-${i}`, text: { en: '?', ro: '?' }, options: [] } as QuizQuestion;
    });
  }, [payload, quiz]);

  if (!payload || !quiz) {
    return (
      <div className="quiz-card mx-auto max-w-md px-6 py-12 text-center">
        <div className="text-6xl">🔗💔</div>
        <p className="mt-4 font-bold text-orange-900">{tr('invalidLink', lang)}</p>
        <button onClick={onHome} className="btn-chunky mt-6 bg-orange-500">{tr('home', lang)}</button>
      </div>
    );
  }

  if (stage === 'profile') {
    return (
      <ProfileGate
        quiz={quiz}
        lang={lang}
        onBack={onHome}
        onContinue={(p) => {
          setProfile(p);
          setStage('playing');
        }}
      />
    );
  }

  if (stage === 'playing' && profile) {
    return (
      <QuizPlayer
        quiz={quiz}
        questions={questions}
        correctAnswers={payload.a}
        lang={lang}
        onBack={() => setStage('profile')}
        onFinish={(a) => {
          setAnswers(a);
          setStage('result');
        }}
      />
    );
  }

  if (stage === 'result' && profile) {
    return (
      <ResultPage
        quiz={quiz}
        questions={questions}
        answers={answers}
        correctAnswers={payload.a}
        profile={profile}
        shareId={shareId}
        creatorName={payload.by}
        lang={lang}
        onRestart={() => setStage('playing')}
        onHome={onHome}
        onScoreboard={() => go(`#/scoreboard/${shareId}`)}
      />
    );
  }

  return null;
}

/* ---------------- share screen (after creating) ---------------- */

function ShareScreen({ shareId, lang, onHome }: { shareId: string; lang: Lang; onHome: () => void }) {
  const payload = decodeShare(shareId);
  const quiz = payload ? getQuiz(payload.quiz) : undefined;
  const url = playUrl(shareId);
  const title = quiz ? `${payload?.by} — ${tx(quiz.title, lang)}` : tr('appName', lang);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="quiz-card mx-auto max-w-lg px-6 py-10 text-center">
      <div className="text-7xl">🚀</div>
      <h2 className="font-display mt-4 text-3xl font-extrabold text-orange-950">{tr('shareTitle', lang)}</h2>
      <p className="mt-2 font-semibold text-orange-900/70">{tr('shareHint', lang)}</p>
      <div className="mt-6 rounded-2xl bg-orange-50 p-4">
        <ShareButtons lang={lang} title={title} url={url} />
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button onClick={() => go(`#/scoreboard/${shareId}`)} className="btn-chunky bg-violet-500 text-sm">
          🏅 {tr('scoreboard', lang)}
        </button>
        <button onClick={onHome} className="btn-chunky bg-orange-200 !text-orange-900 text-sm">
          {tr('home', lang)}
        </button>
      </div>
    </motion.div>
  );
}

function ScoreboardScreen({ shareId, lang, onHome }: { shareId: string; lang: Lang; onHome: () => void }) {
  const payload = decodeShare(shareId);
  const quiz = payload ? getQuiz(payload.quiz) : undefined;
  if (!payload || !quiz) {
    return (
      <div className="quiz-card mx-auto max-w-md px-6 py-12 text-center">
        <p className="font-bold text-orange-900">{tr('invalidLink', lang)}</p>
        <button onClick={onHome} className="btn-chunky mt-6 bg-orange-500">{tr('home', lang)}</button>
      </div>
    );
  }
  return (
    <Scoreboard
      quiz={quiz}
      shareId={shareId}
      by={payload.by}
      lang={lang}
      onPlayAgain={() => go(`#/play/${shareId}`)}
      onCreateOwn={() => go(`#/quiz/${quiz.id}`)}
    />
  );
}

function PrivacyScreen({ lang }: { lang: Lang }) {
  return (
    <div className="quiz-card mx-auto max-w-2xl px-6 py-8">
      <h1 className="font-display text-3xl font-extrabold text-orange-950">{tr('privacyTitle', lang)}</h1>
      <p className="mt-4 font-semibold leading-relaxed text-orange-900/80">{tr('privacyBody', lang)}</p>
    </div>
  );
}

/* ---------------- app ---------------- */

export default function QuizPopApp() {
  // SSR-safe: window doesn't exist on the server (TanStack Start pre-renders).
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? { name: 'home' } : parseHash()
  );
  const [mounted, setMounted] = useState(false);
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem('quizpop_lang');
      return s === 'ro' || s === 'ur' ? s : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    setMounted(true);
    setRoute(parseHash());
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('quizpop_lang', l);
    } catch {
      /* noop */
    }
  };

  const onHome = () => go('#/');

  return (
    <div className="min-h-screen">
      <Header lang={lang} setLang={setLang} />
      {/* Render route content only after client mount: avoids SSR/hydration
          mismatches since routes live in window.location.hash. */}
      {mounted ? (
      <main className="mx-auto max-w-5xl px-4 py-6">
        {route.name === 'home' && (
          <HomeScreen lang={lang} onSelect={(q) => go(`#/quiz/${q.id}`)} />
        )}
        {route.name === 'quiz' &&
          (getQuiz(route.id) ? (
            <QuizDetailScreen key={route.id} quiz={getQuiz(route.id)!} lang={lang} onHome={onHome} />
          ) : (
            <HomeScreen lang={lang} onSelect={(q) => go(`#/quiz/${q.id}`)} />
          ))}
        {route.name === 'play' && <PlayScreen shareId={route.shareId} lang={lang} onHome={onHome} />}
        {route.name === 'share' && <ShareScreen shareId={route.shareId} lang={lang} onHome={onHome} />}
        {route.name === 'scoreboard' && <ScoreboardScreen shareId={route.shareId} lang={lang} onHome={onHome} />}
        {route.name === 'admin' && (
          <div>
            <h1 className="font-display mb-4 text-3xl font-extrabold text-orange-950">📊 {tr('admin', lang)}</h1>
            <AdminDashboard lang={lang} />
          </div>
        )}
        {route.name === 'privacy' && <PrivacyScreen lang={lang} />}
      </main>
      ) : (
        <main className="mx-auto max-w-5xl px-4 py-6">
          <div className="quiz-card px-6 py-16 text-center">
            <div className="animate-bounce-soft text-6xl">🎯</div>
          </div>
        </main>
      )}
      <Footer lang={lang} />
    </div>
  );
}
