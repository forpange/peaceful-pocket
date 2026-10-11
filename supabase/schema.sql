-- QuizPop schema — run this in your Supabase project's SQL editor.
-- Tables are append-only from the app's anon key; tighten policies later if you wish.

create table if not exists quiz_responses (
  id uuid primary key default gen_random_uuid(),
  quiz_id text not null,
  kind text not null,
  nickname text not null,
  age text,
  city text,
  email text,
  whatsapp text,
  consent boolean default false,
  source text default 'direct',
  answers jsonb default '[]'::jsonb,
  tags text[] default '{}',
  score int,
  total int,
  archetype_id text,
  share_id text,
  created_at timestamptz default now()
);

create table if not exists quiz_scores (
  id uuid primary key default gen_random_uuid(),
  share_id text not null,
  quiz_id text not null,
  nickname text not null,
  score int not null,
  total int not null,
  created_at timestamptz default now()
);

create index if not exists idx_responses_quiz on quiz_responses (quiz_id);
create index if not exists idx_responses_created on quiz_responses (created_at desc);
create index if not exists idx_scores_share on quiz_scores (share_id);

alter table quiz_responses enable row level security;
alter table quiz_scores enable row level security;

-- MVP policies: anyone can submit and read (it's a public quiz app).
drop policy if exists "anon insert responses" on quiz_responses;
create policy "anon insert responses" on quiz_responses for insert to anon with check (true);
drop policy if exists "anon read responses" on quiz_responses;
create policy "anon read responses" on quiz_responses for select to anon using (true);

drop policy if exists "anon insert scores" on quiz_scores;
create policy "anon insert scores" on quiz_scores for insert to anon with check (true);
drop policy if exists "anon read scores" on quiz_scores;
create policy "anon read scores" on quiz_scores for select to anon using (true);
