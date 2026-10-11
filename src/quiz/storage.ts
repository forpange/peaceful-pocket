/* Storage layer: Supabase when configured, localStorage fallback otherwise.
   Viral quiz sharing works with ZERO backend — the whole quiz is encoded in the link. */
import type { ViralShare } from './types';
import { supabase, supabaseConfigured } from '../lib/supabase';

export interface PlayerProfile {
  nickname: string;
  age?: string;
  city?: string;
  email?: string;
  whatsapp?: string;
  consent: boolean;
  source: string;
}

export interface SavedResponse {
  id: string;
  quizId: string;
  kind: 'viral' | 'intent';
  profile: PlayerProfile;
  answers: number[];
  tags: string[];
  score?: number;
  total?: number;
  archetypeId?: string;
  shareId?: string;
  createdAt: string;
}

export interface ScoreEntry {
  shareId: string;
  quizId: string;
  nickname: string;
  score: number;
  total: number;
  createdAt: string;
}

const LS_RESP = 'quizpop_responses_v1';
const LS_SCORES = 'quizpop_scores_v1';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function lsGet(key: string): any[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function lsSet(key: string, val: any[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* storage full — ignore */
  }
}

/** Where did this player come from? utm_source > #src= > referrer guess > direct */
export function getSource(): string {
  try {
    const u = new URL(window.location.href);
    const utm = u.searchParams.get('utm_source');
    if (utm) return utm.toLowerCase();
    const m = window.location.hash.match(/src=([a-z]+)/i);
    if (m && m[1]) return m[1].toLowerCase();
    const r = document.referrer;
    if (r.includes('instagram')) return 'instagram';
    if (r.includes('facebook')) return 'facebook';
    if (r.includes('pinterest')) return 'pinterest';
    if (r.includes('tiktok')) return 'tiktok';
  } catch {
    /* noop */
  }
  return 'direct';
}

/* ---------- share link codec (no backend needed) ---------- */

export function encodeShare(p: ViralShare): string {
  const json = JSON.stringify(p);
  const b64 = btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return 'e1.' + b64;
}

export function decodeShare(s: string): ViralShare | null {
  try {
    const b64 = s.replace(/^e1\./, '').replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(b64)));
    const p = JSON.parse(json);
    if (p && p.v === 1 && typeof p.quiz === 'string' && Array.isArray(p.q) && Array.isArray(p.a)) {
      return p as ViralShare;
    }
    return null;
  } catch {
    return null;
  }
}

export function playUrl(shareId: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#/play/${shareId}`;
}

export function whatsappUrl(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
}

/* ---------- responses ---------- */

export async function saveResponse(
  r: Omit<SavedResponse, 'id' | 'createdAt'>
): Promise<SavedResponse> {
  const row: SavedResponse = { ...r, id: uid(), createdAt: new Date().toISOString() };
  if (supabaseConfigured && supabase) {
    try {
      await supabase.from('quiz_responses').insert({
        quiz_id: row.quizId,
        kind: row.kind,
        nickname: row.profile.nickname,
        age: row.profile.age || null,
        city: row.profile.city || null,
        email: row.profile.email || null,
        whatsapp: row.profile.whatsapp || null,
        consent: row.profile.consent,
        source: row.profile.source,
        answers: row.answers,
        tags: row.tags,
        score: row.score ?? null,
        total: row.total ?? null,
        archetype_id: row.archetypeId || null,
        share_id: row.shareId || null,
      });
      return row;
    } catch {
      /* fall through to local */
    }
  }
  const all = lsGet(LS_RESP);
  all.push(row);
  lsSet(LS_RESP, all);
  return row;
}

export async function listResponses(): Promise<SavedResponse[]> {
  if (supabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('quiz_responses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5000);
      if (!error && data) {
        return data.map((d: any) => ({
          id: String(d.id),
          quizId: d.quiz_id,
          kind: d.kind,
          profile: {
            nickname: d.nickname,
            age: d.age || undefined,
            city: d.city || undefined,
            email: d.email || undefined,
            whatsapp: d.whatsapp || undefined,
            consent: !!d.consent,
            source: d.source || 'direct',
          },
          answers: d.answers || [],
          tags: d.tags || [],
          score: d.score ?? undefined,
          total: d.total ?? undefined,
          archetypeId: d.archetype_id || undefined,
          shareId: d.share_id || undefined,
          createdAt: d.created_at,
        }));
      }
    } catch {
      /* fall through */
    }
  }
  return lsGet(LS_RESP).reverse();
}

/* ---------- scoreboard scores ---------- */

export async function saveScore(s: Omit<ScoreEntry, 'createdAt'>): Promise<void> {
  const row: ScoreEntry = { ...s, createdAt: new Date().toISOString() };
  if (supabaseConfigured && supabase) {
    try {
      await supabase.from('quiz_scores').insert({
        share_id: row.shareId,
        quiz_id: row.quizId,
        nickname: row.nickname,
        score: row.score,
        total: row.total,
      });
      return;
    } catch {
      /* fall through */
    }
  }
  const all = lsGet(LS_SCORES);
  all.push(row);
  lsSet(LS_SCORES, all);
}

export async function listScores(shareId: string): Promise<ScoreEntry[]> {
  if (supabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('quiz_scores')
        .select('*')
        .eq('share_id', shareId)
        .order('score', { ascending: false })
        .limit(100);
      if (!error && data) {
        return data.map((d: any) => ({
          shareId: d.share_id,
          quizId: d.quiz_id,
          nickname: d.nickname,
          score: d.score,
          total: d.total,
          createdAt: d.created_at,
        }));
      }
    } catch {
      /* fall through */
    }
  }
  return lsGet(LS_SCORES)
    .filter((s: ScoreEntry) => s.shareId === shareId)
    .sort((a: ScoreEntry, b: ScoreEntry) => b.score - a.score);
}

export function isCloudEnabled(): boolean {
  return supabaseConfigured;
}
