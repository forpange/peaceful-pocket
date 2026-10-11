import { useEffect, useMemo, useState } from 'react';
import { listResponses, type SavedResponse } from '../../quiz/storage';
import { QUIZZES, getQuiz } from '../../quiz/quizzes';
import type { Lang } from '../../quiz/types';
import { tx } from '../../quiz/types';
import { tr } from '../../quiz/i18n';

interface Filters {
  quizId: string;
  tag: string;
  age: string;
  city: string;
  source: string;
  search: string;
}

interface Segment {
  name: string;
  filters: Filters;
}

const EMPTY: Filters = { quizId: '', tag: '', age: '', city: '', source: '', search: '' };
const SEG_KEY = 'quizpop_segments_v1';

function loadSegments(): Segment[] {
  try {
    return JSON.parse(localStorage.getItem(SEG_KEY) || '[]');
  } catch {
    return [];
  }
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-sm font-bold text-orange-950">
        <span className="truncate">{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-orange-100">
        <div className="h-full rounded-full" style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, background: color }} />
      </div>
    </div>
  );
}

export function AdminDashboard({ lang }: { lang: Lang }) {
  const [responses, setResponses] = useState<SavedResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'responses' | 'segments' | 'charts'>('responses');
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [segments, setSegments] = useState<Segment[]>(loadSegments());
  const [segName, setSegName] = useState('');

  useEffect(() => {
    listResponses()
      .then(setResponses)
      .catch(() => setResponses([]))
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof Filters, v: string) => setFilters((f) => ({ ...f, [k]: v }));

  const filtered = useMemo(
    () =>
      responses.filter((r) => {
        if (filters.quizId && r.quizId !== filters.quizId) return false;
        if (filters.tag && !r.tags.includes(filters.tag)) return false;
        if (filters.age && r.profile.age !== filters.age) return false;
        if (filters.city && !(r.profile.city || '').toLowerCase().includes(filters.city.toLowerCase())) return false;
        if (filters.source && r.profile.source !== filters.source) return false;
        if (filters.search) {
          const s = filters.search.toLowerCase();
          const hay = `${r.profile.nickname} ${r.profile.city || ''} ${r.profile.email || ''}`.toLowerCase();
          if (!hay.includes(s)) return false;
        }
        return true;
      }),
    [responses, filters]
  );

  const stats = useMemo(() => {
    const players = new Set(filtered.map((r) => r.profile.nickname.toLowerCase())).size;
    const quizCounts: Record<string, number> = {};
    const catCounts: Record<string, number> = {};
    const srcCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    for (const r of filtered) {
      quizCounts[r.quizId] = (quizCounts[r.quizId] || 0) + 1;
      const q = getQuiz(r.quizId);
      if (q) catCounts[q.category] = (catCounts[q.category] || 0) + 1;
      srcCounts[r.profile.source] = (srcCounts[r.profile.source] || 0) + 1;
      for (const t of r.tags) tagCounts[t] = (tagCounts[t] || 0) + 1;
    }
    const topQuizId = Object.entries(quizCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return { players, quizCounts, catCounts, srcCounts, tagCounts, topQuizId };
  }, [filtered]);

  const allTags = useMemo(() => Array.from(new Set(responses.flatMap((r) => r.tags))).sort(), [responses]);
  const allSources = useMemo(() => Array.from(new Set(responses.map((r) => r.profile.source))).sort(), [responses]);
  const allAges = useMemo(
    () => Array.from(new Set(responses.map((r) => r.profile.age).filter(Boolean) as string[])).sort(),
    [responses]
  );

  const saveSegment = () => {
    const name = segName.trim();
    if (!name) return;
    const next = [...segments, { name, filters }];
    setSegments(next);
    try {
      localStorage.setItem(SEG_KEY, JSON.stringify(next));
    } catch {}
    setSegName('');
  };

  const deleteSegment = (i: number) => {
    const next = segments.filter((_, j) => j !== i);
    setSegments(next);
    try {
      localStorage.setItem(SEG_KEY, JSON.stringify(next));
    } catch {}
  };

  const exportCSV = () => {
    const head = ['when', 'name', 'quiz', 'kind', 'age', 'city', 'email', 'whatsapp', 'consent', 'source', 'score', 'total', 'archetype', 'tags'];
    const esc = (v: string | number | undefined) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = filtered.map((r) =>
      [
        r.createdAt,
        r.profile.nickname,
        getQuiz(r.quizId) ? tx(getQuiz(r.quizId)!.title, 'en') : r.quizId,
        r.kind,
        r.profile.age,
        r.profile.city,
        r.profile.email,
        r.profile.whatsapp,
        r.profile.consent ? 'yes' : 'no',
        r.profile.source,
        r.score,
        r.total,
        r.archetypeId,
        r.tags.join('|'),
      ]
        .map(esc)
        .join(',')
    );
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `quizpop-responses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const sel = 'input-chunky !py-2 text-sm';

  if (loading) return <div className="quiz-card px-6 py-12 text-center font-bold">{tr('loading', lang)}</div>;

  return (
    <div>
      {/* stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: tr('totalResponses', lang), value: String(filtered.length) },
          { label: tr('uniquePlayers', lang), value: String(stats.players) },
          {
            label: tr('topQuiz', lang),
            value: stats.topQuizId ? getQuiz(stats.topQuizId)?.emoji || '🏆' : '—',
          },
          { label: tr('topTags', lang), value: String(Object.keys(stats.tagCounts).length) },
        ].map((s, i) => (
          <div key={i} className="quiz-card px-4 py-4 text-center">
            <div className="font-display text-3xl font-extrabold text-orange-600">{s.value}</div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-orange-900/60">{s.label}</div>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div className="mb-4 flex gap-2">
        {(['responses', 'segments', 'charts'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 font-display font-bold ${
              tab === t ? 'bg-orange-500 text-white shadow' : 'bg-white text-orange-900 border-2 border-orange-100'
            }`}
          >
            {tr(t === 'responses' ? 'tabResponses' : t === 'segments' ? 'tabSegments' : 'tabCharts', lang)}
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="quiz-card mb-4 px-4 py-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <select className={sel} value={filters.quizId} onChange={(e) => set('quizId', e.target.value)}>
            <option value="">{tr('filterQuiz', lang)}: {tr('anyOption', lang)}</option>
            {QUIZZES.map((q) => (
              <option key={q.id} value={q.id}>
                {q.emoji} {tx(q.title, 'en')}
              </option>
            ))}
          </select>
          <select className={sel} value={filters.tag} onChange={(e) => set('tag', e.target.value)}>
            <option value="">{tr('filterTag', lang)}: {tr('anyOption', lang)}</option>
            {allTags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select className={sel} value={filters.age} onChange={(e) => set('age', e.target.value)}>
            <option value="">{tr('filterAge', lang)}: {tr('anyOption', lang)}</option>
            {allAges.map((a) => (
              <option key={a} value={a}>{tr(a as 'age_under18', lang)}</option>
            ))}
          </select>
          <input
            className={sel}
            placeholder={`${tr('filterCity', lang)}…`}
            value={filters.city}
            onChange={(e) => set('city', e.target.value)}
          />
          <select className={sel} value={filters.source} onChange={(e) => set('source', e.target.value)}>
            <option value="">{tr('filterSource', lang)}: {tr('anyOption', lang)}</option>
            {allSources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            className={sel}
            placeholder={tr('searchPh', lang)}
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={exportCSV} className="btn-chunky bg-emerald-500 !py-2 text-sm">
            📥 {tr('exportCSV', lang)} ({filtered.length})
          </button>
          <button onClick={() => setFilters(EMPTY)} className="btn-chunky bg-orange-200 !py-2 !text-orange-900 text-sm">
            ✕
          </button>
        </div>
      </div>

      {tab === 'responses' && (
        <div className="quiz-card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b-2 border-orange-100 text-xs uppercase tracking-wide text-orange-900/60">
                <th className="px-4 py-3">{tr('colWhen', lang)}</th>
                <th className="px-4 py-3">{tr('colName', lang)}</th>
                <th className="px-4 py-3">{tr('colQuiz', lang)}</th>
                <th className="px-4 py-3">{tr('colScore', lang)}</th>
                <th className="px-4 py-3">{tr('colTags', lang)}</th>
                <th className="px-4 py-3">{tr('colSource', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map((r) => {
                const q = getQuiz(r.quizId);
                return (
                  <tr key={r.id} className="border-b border-orange-50 hover:bg-orange-50/50">
                    <td className="px-4 py-2 font-semibold text-orange-900/70">
                      {new Date(r.createdAt).toLocaleDateString()} {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-2 font-extrabold text-orange-950">
                      {r.profile.nickname}
                      {r.profile.city && <span className="block text-xs font-semibold text-orange-900/50">{r.profile.city}</span>}
                    </td>
                    <td className="px-4 py-2 font-semibold">{q ? `${q.emoji} ${tx(q.title, 'en')}` : r.quizId}</td>
                    <td className="px-4 py-2 font-extrabold text-orange-600">
                      {r.score !== undefined ? `${r.score}/${r.total}` : r.archetypeId ? `✨ ${r.archetypeId}` : '—'}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex max-w-[220px] flex-wrap gap-1">
                        {r.tags.slice(0, 4).map((t) => (
                          <span key={t} className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-bold text-violet-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800">{r.profile.source}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="px-6 py-10 text-center font-bold text-orange-900/50">{tr('noData', lang)}</div>}
        </div>
      )}

      {tab === 'segments' && (
        <div className="quiz-card px-5 py-5">
          <div className="mb-4 flex gap-2">
            <input
              className="input-chunky"
              placeholder={tr('segmentNamePh', lang)}
              value={segName}
              onChange={(e) => setSegName(e.target.value)}
            />
            <button onClick={saveSegment} className="btn-chunky shrink-0 bg-orange-500 !py-2 text-sm">
              💾 {tr('saveSegment', lang)}
            </button>
          </div>
          {segments.length === 0 && <p className="font-semibold text-orange-900/50">{tr('noData', lang)}</p>}
          <div className="flex flex-col gap-2">
            {segments.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border-2 border-orange-100 px-4 py-3">
                <div>
                  <p className="font-extrabold text-orange-950">{s.name}</p>
                  <p className="text-xs font-semibold text-orange-900/50">
                    {Object.entries(s.filters).filter(([, v]) => v).map(([k, v]) => `${k}:${v}`).join(' · ') || tr('anyOption', lang)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setFilters(s.filters); setTab('responses'); }} className="btn-chunky bg-sky-500 !py-1.5 text-xs">
                    →
                  </button>
                  <button onClick={() => deleteSegment(i)} className="btn-chunky bg-red-400 !py-1.5 text-xs">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'charts' && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="quiz-card px-5 py-5">
            <h3 className="font-display mb-3 text-lg font-extrabold text-orange-950">{tr('byCategory', lang)}</h3>
            {Object.entries(stats.catCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([c, v]) => (
                <Bar key={c} label={c} value={v} max={Math.max(...Object.values(stats.catCounts), 1)} color="#f97316" />
              ))}
          </div>
          <div className="quiz-card px-5 py-5">
            <h3 className="font-display mb-3 text-lg font-extrabold text-orange-950">{tr('bySource', lang)}</h3>
            {Object.entries(stats.srcCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([s, v]) => (
                <Bar key={s} label={s} value={v} max={Math.max(...Object.values(stats.srcCounts), 1)} color="#0ea5e9" />
              ))}
          </div>
          <div className="quiz-card px-5 py-5 lg:col-span-2">
            <h3 className="font-display mb-3 text-lg font-extrabold text-orange-950">{tr('topTags', lang)}</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 16)
                .map(([t, v]) => (
                  <span key={t} className="rounded-full bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-800">
                    {t} × {v}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
