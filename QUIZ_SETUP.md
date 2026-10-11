# QuizPop — Setup Guide (Lovable + GitHub sync)

QuizPop is a viral quiz funnel: 2 viral quizzes (Fake Friends, Secret Well-Wisher) for traffic
+ 6 buyer-intent quizzes (Style, Skincare, Shopping, Planner, Kids Learning, Gift Finder) that
tag every player with interests. Admin dashboard at `#/admin` filters everything.

**Important:** this project is a Lovable TanStack Start app (Tailwind v4, SSR).
All QuizPop code was written manually — zero Lovable AI credits used.

## 1. Push to GitHub → Lovable auto-updates

This repo is connected to Lovable via GitHub sync. Push to the connected branch
and Lovable detects it and rebuilds the preview automatically:

```bash
git add -A
git commit -m "QuizPop MVP"
git push
```

Do NOT rewrite pushed history (no force-push / rebase of pushed commits) —
it breaks Lovable's side (see AGENTS.md).

Install: `bun install` · Dev: `bun run dev` · Build: `bun run build` · Test: `bun run test`

## 2. Cloud database (optional but recommended)

Without this, everything still works — data is stored in the browser (localStorage).
With it, scores and the admin dashboard sync across devices.

1. Free project at https://supabase.com
2. SQL Editor → paste `supabase/schema.sql` → Run
3. Project Settings → API → copy Project URL + anon public key
4. Lovable → project Settings → Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 3. AdSense (optional)

1. Get approved at https://www.google.com/adsense → publisher ID (`ca-pub-...`)
2. In `src/routes/__root.tsx`, add to `head()`:
   - a `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX">`
   - set `window.QUIZPOP_AD_CLIENT = "ca-pub-XXXX"` (e.g. in `src/quizpop/QuizPopApp.tsx`)
3. `AdSlot` components (home + result pages) will render real ads.

## 4. Social share image

`public/og-cover.png` is already included — WhatsApp/Instagram/Snapchat show it
on shared quiz links. Replace it with your own 1200×630 image anytime.

## 5. Affiliate links (where the money comes from)

Each buyer-intent quiz has `recommendations` with placeholder URLs.
Search the code for `TODO-AFFILIATE` and replace with real affiliate links
(AliExpress / Amazon / SHEIN portals). The result page auto-shows the 3
best-matching picks per player.

## 6. Adding a new quiz (no routing changes needed)

Copy any file in `src/quiz/quizzes/`, change questions/tags/archetypes,
register it in `src/quiz/quizzes/index.ts`. Done — the picker reads it automatically.

## Routes (hash-based, works with zero server config)

- `#/` — quiz picker home · `#/quiz/<id>` — detail → create/play
- `#/play/<shareId>` — play a friend's viral quiz (quiz data is encoded in the link!)
- `#/scoreboard/<shareId>` · `#/share/<shareId>` · `#/admin` · `#/privacy`

## Languages

English, Roman Urdu, Urdu script — header switcher, saved in localStorage.
Quiz content ships in English + Roman Urdu; add `ur` fields in quiz configs
for full Urdu script.
