-- Northline application schema. Per-user rows always carry user_id TEXT.
-- Catalog (programs, exercises, workouts) lives in TypeScript, not here.

create table if not exists profiles (
  user_id text primary key,
  role text not null default 'client',
  display_name text,
  email text,
  timezone text default 'UTC',
  onboarding_complete boolean not null default false,
  onboarding_step integer not null default 0,
  goal text,
  experience text,
  days_per_week integer,
  session_minutes integer,
  equipment text,
  challenge text,
  coaching_pref text,
  unit text not null default 'kg',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assessments (
  id text primary key,
  user_id text not null,
  answers jsonb not null,
  recommended_program text,
  summary text,
  created_at timestamptz not null default now()
);
create index if not exists assessments_user_idx on assessments (user_id, created_at desc);

create table if not exists enrollments (
  id text primary key,
  user_id text not null,
  program_slug text not null,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  billing_status text not null default 'active',
  plan_label text,
  renewal_at date
);
create index if not exists enrollments_user_idx on enrollments (user_id, started_at desc);

create table if not exists sessions (
  id text primary key,
  user_id text not null,
  program_slug text not null,
  workout_id text not null,
  week integer not null,
  day integer not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  feeling integer,
  notes text
);
create index if not exists sessions_user_idx on sessions (user_id, started_at desc);

create table if not exists set_logs (
  id text primary key,
  session_id text not null,
  user_id text not null,
  exercise_slug text not null,
  set_index integer not null,
  weight numeric,
  reps integer,
  completed boolean not null default false,
  completed_at timestamptz
);
create index if not exists set_logs_session_idx on set_logs (session_id, set_index);
create index if not exists set_logs_user_idx on set_logs (user_id);

create table if not exists goals (
  id text primary key,
  user_id text not null,
  title text not null,
  kind text not null default 'custom',
  target numeric,
  current numeric default 0,
  unit text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create index if not exists goals_user_idx on goals (user_id);

create table if not exists checkins (
  id text primary key,
  user_id text not null,
  week_of date not null,
  training integer,
  energy integer,
  sleep integer,
  stress integer,
  wins text,
  challenges text,
  questions text,
  weight numeric,
  coach_reply text,
  coach_replied_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists checkins_user_idx on checkins (user_id, created_at desc);

create table if not exists appointments (
  id text primary key,
  user_id text not null,
  service text not null,
  starts_at timestamptz not null,
  duration_min integer not null default 45,
  timezone text not null default 'UTC',
  status text not null default 'confirmed',
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists appointments_user_idx on appointments (user_id, starts_at);

create table if not exists messages (
  id text primary key,
  user_id text not null,
  author_id text not null,
  from_role text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists messages_user_idx on messages (user_id, created_at);

create table if not exists favorites (
  user_id text not null,
  exercise_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, exercise_slug)
);

create table if not exists progress_entries (
  id text primary key,
  user_id text not null,
  kind text not null,
  label text,
  value numeric not null,
  unit text,
  recorded_at date not null default current_date
);
create index if not exists progress_user_idx on progress_entries (user_id, recorded_at);

create table if not exists coach_notes (
  id text primary key,
  coach_id text not null,
  client_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists coach_notes_client_idx on coach_notes (client_id, created_at desc);

create table if not exists notifications (
  id text primary key,
  user_id text not null,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on notifications (user_id, created_at desc);
