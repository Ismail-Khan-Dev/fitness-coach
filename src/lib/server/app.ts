import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  COACH,
  PROGRAMS,
  programBySlug,
  recommendProgram,
  type WorkoutTemplate,
} from "@/lib/catalog";
import { nid } from "@/lib/utils";

export type Profile = {
  user_id: string;
  role: "client" | "coach";
  display_name: string | null;
  email: string | null;
  timezone: string | null;
  onboarding_complete: boolean;
  onboarding_step: number;
  goal: string | null;
  experience: string | null;
  days_per_week: number | null;
  session_minutes: number | null;
  equipment: string | null;
  challenge: string | null;
  coaching_pref: string | null;
  unit: string;
};

export type Enrollment = {
  id: string;
  program_slug: string;
  status: string;
  started_at: string;
  billing_status: string;
  plan_label: string | null;
  renewal_at: string | null;
};

export type SessionRow = {
  id: string;
  program_slug: string;
  workout_id: string;
  week: number;
  day: number;
  started_at: string;
  completed_at: string | null;
  feeling: number | null;
  notes: string | null;
};

export type SetLog = {
  id: string;
  session_id: string;
  exercise_slug: string;
  set_index: number;
  weight: string | null;
  reps: number | null;
  completed: boolean;
};

export type GoalRow = {
  id: string;
  title: string;
  kind: string;
  target: string | null;
  current: string | null;
  unit: string | null;
  status: string;
};

export type MessageRow = {
  id: string;
  user_id: string;
  author_id: string;
  from_role: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type CheckinRow = {
  id: string;
  week_of: string;
  training: number | null;
  energy: number | null;
  sleep: number | null;
  stress: number | null;
  wins: string | null;
  challenges: string | null;
  questions: string | null;
  weight: string | null;
  coach_reply: string | null;
  coach_replied_at: string | null;
  created_at: string;
};

export type AppointmentRow = {
  id: string;
  service: string;
  starts_at: string;
  duration_min: number;
  timezone: string;
  status: string;
  notes: string | null;
};

async function loadProfile(userId: string, email?: string | null, name?: string | null) {
  const sql = await getSql();
  const existing = await sql<Profile>`
    select user_id, role, display_name, email, timezone, onboarding_complete,
           onboarding_step, goal, experience, days_per_week, session_minutes,
           equipment, challenge, coaching_pref, unit
    from profiles where user_id = ${userId}
  `;
  if (existing[0]) return existing[0];

  const coaches = await sql<{ c: number }>`select count(*)::int as c from profiles where role = 'coach'`;
  const role = (coaches[0]?.c ?? 0) === 0 ? "coach" : "client";

  await sql`
    insert into profiles (user_id, role, display_name, email)
    values (${userId}, ${role}, ${name ?? null}, ${email ?? null})
  `;

  await sql`
    insert into goals (id, user_id, title, kind, target, current, unit)
    values
      (${nid()}, ${userId}, ${"Train consistently this month"}, ${"consistency"}, ${12}, ${0}, ${"sessions"}),
      (${nid()}, ${userId}, ${"Own the work in front of you"}, ${"practice"}, ${1}, ${0}, ${"habit"})
  `;

  const welcome =
    role === "coach"
      ? `Welcome to Northline Studio. This is your practice OS — clients, check-ins, and the line they are on. You also have a training seat, so you can eat your own cooking.`
      : `Welcome. I'm Elena. Your first job is not a heroic week — it is an honest one. Take the assessment if you haven't, pick a program, and I'll meet you in the check-in.`;

  await sql`
    insert into messages (id, user_id, author_id, from_role, body)
    values (${nid()}, ${userId}, ${"elena"}, ${"coach"}, ${welcome})
  `;

  const created = await sql<Profile>`
    select user_id, role, display_name, email, timezone, onboarding_complete,
           onboarding_step, goal, experience, days_per_week, session_minutes,
           equipment, challenge, coaching_pref, unit
    from profiles where user_id = ${userId}
  `;
  return created[0];
}

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return loadProfile(context.userId);
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName?: string; timezone?: string; unit?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await loadProfile(context.userId);
    await sql`
      update profiles
      set display_name = coalesce(${data.displayName ?? null}, display_name),
          timezone = coalesce(${data.timezone ?? null}, timezone),
          unit = coalesce(${data.unit ?? null}, unit),
          onboarding_complete = true,
          onboarding_step = 3,
          updated_at = now()
      where user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const saveAssessment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      answers: Record<string, string>;
      summary?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await loadProfile(context.userId);
    const recommended = recommendProgram(data.answers);
    const id = nid();
    await sql`
      insert into assessments (id, user_id, answers, recommended_program, summary)
      values (${id}, ${context.userId}, ${JSON.stringify(data.answers)}::jsonb, ${recommended}, ${data.summary ?? null})
    `;
    await sql`
      update profiles
      set goal = ${data.answers.goal ?? null},
          experience = ${data.answers.experience ?? null},
          days_per_week = ${data.answers.days ? Number(data.answers.days) || null : null},
          equipment = ${data.answers.equipment ?? null},
          challenge = ${data.answers.challenge ?? null},
          coaching_pref = ${data.answers.coaching ?? null},
          updated_at = now()
      where user_id = ${context.userId}
    `;
    return { id, recommended };
  });

export const enroll = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { programSlug: string }) => input)
  .handler(async ({ context, data }) => {
    const program = programBySlug(data.programSlug);
    if (!program) throw new Error("Unknown program");
    const sql = await getSql();
    await loadProfile(context.userId);
    await sql`
      update enrollments set status = 'paused' where user_id = ${context.userId} and status = 'active'
    `;
    const id = nid();
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 28);
    await sql`
      insert into enrollments (id, user_id, program_slug, status, plan_label, billing_status, renewal_at)
      values (${id}, ${context.userId}, ${program.slug}, ${"active"}, ${program.price}, ${"active"}, ${renewal.toISOString().slice(0, 10)})
    `;
    await sql`
      insert into messages (id, user_id, author_id, from_role, body)
      values (
        ${nid()}, ${context.userId}, ${"elena"}, ${"coach"},
        ${`You're on ${program.name}. First session is in Today — log what you actually lift. I'll read the week with you.`}
      )
    `;
    return { id, slug: program.slug };
  });

function nextWorkout(programSlug: string, completedCount: number) {
  const program = programBySlug(programSlug);
  if (!program || program.workouts.length === 0) return null;
  const len = program.workouts.length;
  const week = Math.floor(completedCount / len) + 1;
  const day = (completedCount % len) + 1;
  const template = program.workouts[completedCount % len];
  return { week, day, template };
}

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const profile = await loadProfile(context.userId);
    const enrollment = (
      await sql<Enrollment>`
        select id, program_slug, status, started_at::text, billing_status, plan_label, renewal_at::text
        from enrollments
        where user_id = ${context.userId} and status = 'active'
        order by started_at desc
        limit 1
      `
    )[0] ?? null;

    const sessions = await sql<SessionRow>`
      select id, program_slug, workout_id, week, day, started_at::text, completed_at::text, feeling, notes
      from sessions where user_id = ${context.userId}
      order by started_at desc
    `;

    const open = sessions.find((s) => !s.completed_at) ?? null;
    const completed = sessions.filter((s) => s.completed_at);
    let today: {
      week: number;
      day: number;
      template: WorkoutTemplate;
      sessionId?: string;
    } | null = null;

    if (open && enrollment) {
      const program = programBySlug(open.program_slug);
      const template = program?.workouts.find((w) => w.id === open.workout_id);
      if (template) today = { week: open.week, day: open.day, template, sessionId: open.id };
    } else if (enrollment) {
      const nxt = nextWorkout(enrollment.program_slug, completed.length);
      if (nxt) today = nxt;
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekDone = completed.filter((s) => new Date(s.completed_at!) >= weekAgo).length;

    let streak = 0;
    const days = new Set(
      completed.map((s) => (s.completed_at ?? "").slice(0, 10)).filter(Boolean),
    );
    const cursor = new Date();
    for (let i = 0; i < 60; i++) {
      const key = cursor.toISOString().slice(0, 10);
      if (days.has(key)) streak += 1;
      else if (i > 0) break;
      cursor.setDate(cursor.getDate() - 1);
    }

    const goals = await sql<GoalRow>`
      select id, title, kind, target::text, current::text, unit, status
      from goals where user_id = ${context.userId} and status = 'active'
      order by created_at
    `;

    const latestMessage = (
      await sql<MessageRow>`
        select id, user_id, author_id, from_role, body, read_at::text, created_at::text
        from messages where user_id = ${context.userId}
        order by created_at desc limit 1
      `
    )[0] ?? null;

    const unread = (
      await sql<{ c: number }>`
        select count(*)::int as c from messages
        where user_id = ${context.userId} and from_role = 'coach' and read_at is null
      `
    )[0]?.c ?? 0;

    const upcoming = (
      await sql<AppointmentRow>`
        select id, service, starts_at::text, duration_min, timezone, status, notes
        from appointments
        where user_id = ${context.userId} and status = 'confirmed' and starts_at >= now()
        order by starts_at asc limit 1
      `
    )[0] ?? null;

    const lastCheckin = (
      await sql<{ created_at: string }>`
        select created_at::text from checkins where user_id = ${context.userId}
        order by created_at desc limit 1
      `
    )[0];

    const checkinDue =
      !lastCheckin || Date.now() - new Date(lastCheckin.created_at).getTime() > 6 * 24 * 3600 * 1000;

    const recentVolume = await sql<{ day: string; sets: number }>`
      select completed_at::date::text as day, count(*)::int as sets
      from set_logs
      where user_id = ${context.userId} and completed = true and completed_at is not null
        and completed_at > now() - interval '28 days'
      group by 1 order by 1
    `;

    return {
      profile,
      enrollment,
      program: enrollment ? (programBySlug(enrollment.program_slug) ?? null) : null,
      today,
      stats: {
        completed: completed.length,
        weekDone,
        streak,
        unread,
        checkinDue,
      },
      goals,
      latestMessage,
      upcoming,
      recentVolume,
      coach: COACH,
    };
  });

export const startWorkout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { programSlug: string; workoutId: string; week: number; day: number }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const open = await sql<{ id: string }>`
      select id from sessions where user_id = ${context.userId} and completed_at is null
    `;
    if (open[0]) return { id: open[0].id };
    const id = nid();
    await sql`
      insert into sessions (id, user_id, program_slug, workout_id, week, day)
      values (${id}, ${context.userId}, ${data.programSlug}, ${data.workoutId}, ${data.week}, ${data.day})
    `;
    const program = programBySlug(data.programSlug);
    const template = program?.workouts.find((w) => w.id === data.workoutId);
    if (template) {
      for (const block of template.blocks) {
        for (let i = 1; i <= block.sets; i++) {
          await sql`
            insert into set_logs (id, session_id, user_id, exercise_slug, set_index)
            values (${nid()}, ${id}, ${context.userId}, ${block.exercise}, ${i})
          `;
        }
      }
    }
    return { id };
  });

export const getSession = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const session = (
      await sql<SessionRow>`
        select id, program_slug, workout_id, week, day, started_at::text, completed_at::text, feeling, notes
        from sessions where id = ${data.id} and user_id = ${context.userId}
      `
    )[0];
    if (!session) return null;
    const logs = await sql<SetLog>`
      select id, session_id, exercise_slug, set_index, weight::text, reps, completed
      from set_logs where session_id = ${session.id} and user_id = ${context.userId}
      order by exercise_slug, set_index
    `;
    const program = programBySlug(session.program_slug);
    const template = program?.workouts.find((w) => w.id === session.workout_id) ?? null;
    return { session, logs, template, program: program ? { slug: program.slug, name: program.name } : null };
  });

export const logSet = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { id: string; weight?: number | null; reps?: number | null; completed: boolean }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update set_logs
      set weight = ${data.weight ?? null},
          reps = ${data.reps ?? null},
          completed = ${data.completed},
          completed_at = case when ${data.completed} then now() else null end
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const completeWorkout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { sessionId: string; feeling?: number; notes?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update sessions
      set completed_at = now(), feeling = ${data.feeling ?? null}, notes = ${data.notes ?? null}
      where id = ${data.sessionId} and user_id = ${context.userId}
    `;
    await sql`
      update goals
      set current = coalesce(current, 0) + 1
      where user_id = ${context.userId} and kind = 'consistency' and status = 'active'
    `;
    return { ok: true };
  });

export const getProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const sessions = await sql<SessionRow>`
      select id, program_slug, workout_id, week, day, started_at::text, completed_at::text, feeling, notes
      from sessions where user_id = ${context.userId}
      order by started_at desc
    `;
    const volume = await sql<{ day: string; sets: number; volume: string }>`
      select completed_at::date::text as day,
             count(*)::int as sets,
             coalesce(sum(coalesce(weight,0) * coalesce(reps,0)),0)::text as volume
      from set_logs
      where user_id = ${context.userId} and completed = true
      group by 1 order by 1
    `;
    const lifts = await sql<{ exercise_slug: string; best: string; when: string }>`
      select exercise_slug, max(weight)::text as best, max(completed_at)::text as when
      from set_logs
      where user_id = ${context.userId} and completed = true and weight is not null
      group by 1
    `;
    const goals = await sql<GoalRow>`
      select id, title, kind, target::text, current::text, unit, status
      from goals where user_id = ${context.userId}
      order by created_at
    `;
    const entries = await sql<{ id: string; kind: string; label: string | null; value: string; unit: string | null; recorded_at: string }>`
      select id, kind, label, value::text, unit, recorded_at::text
      from progress_entries where user_id = ${context.userId}
      order by recorded_at desc
    `;
    return { sessions, volume, lifts, goals, entries };
  });

export const addProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: string; label?: string; value: number; unit?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into progress_entries (id, user_id, kind, label, value, unit)
      values (${nid()}, ${context.userId}, ${data.kind}, ${data.label ?? null}, ${data.value}, ${data.unit ?? null})
    `;
    return { ok: true };
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const exists = await sql<{ exercise_slug: string }>`
      select exercise_slug from favorites where user_id = ${context.userId} and exercise_slug = ${data.slug}
    `;
    if (exists[0]) {
      await sql`delete from favorites where user_id = ${context.userId} and exercise_slug = ${data.slug}`;
      return { on: false };
    }
    await sql`insert into favorites (user_id, exercise_slug) values (${context.userId}, ${data.slug})`;
    return { on: true };
  });

export const getFavorites = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ exercise_slug: string }>`
      select exercise_slug from favorites where user_id = ${context.userId}
    `;
    return rows.map((r) => r.exercise_slug);
  });

export const getMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<MessageRow>`
      select id, user_id, author_id, from_role, body, read_at::text, created_at::text
      from messages where user_id = ${context.userId}
      order by created_at asc
    `;
    await sql`
      update messages set read_at = now()
      where user_id = ${context.userId} and from_role = 'coach' and read_at is null
    `;
    return rows;
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { body: string }) => input)
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (!body) return { ok: false };
    const sql = await getSql();
    await sql`
      insert into messages (id, user_id, author_id, from_role, body)
      values (${nid()}, ${context.userId}, ${context.userId}, ${"client"}, ${body})
    `;
    return { ok: true };
  });

export const submitCheckin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      training: number;
      energy: number;
      sleep: number;
      stress: number;
      wins?: string;
      challenges?: string;
      questions?: string;
      weight?: number;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const weekOf = new Date();
    const day = weekOf.getDay();
    weekOf.setDate(weekOf.getDate() - ((day + 6) % 7));
    const id = nid();
    await sql`
      insert into checkins (id, user_id, week_of, training, energy, sleep, stress, wins, challenges, questions, weight)
      values (
        ${id}, ${context.userId}, ${weekOf.toISOString().slice(0, 10)},
        ${data.training}, ${data.energy}, ${data.sleep}, ${data.stress},
        ${data.wins ?? null}, ${data.challenges ?? null}, ${data.questions ?? null}, ${data.weight ?? null}
      )
    `;
    await sql`
      insert into messages (id, user_id, author_id, from_role, body)
      values (
        ${nid()}, ${context.userId}, ${"elena"}, ${"coach"},
        ${"Got the check-in. I'll read it against the logs and reply here if the week needs a change."}
      )
    `;
    return { id };
  });

export const listCheckins = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<CheckinRow>`
      select id, week_of::text, training, energy, sleep, stress, wins, challenges, questions,
             weight::text, coach_reply, coach_replied_at::text, created_at::text
      from checkins where user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const bookAppointment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { service: string; startsAt: string; timezone: string; notes?: string; duration: number }) =>
      input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await loadProfile(context.userId);
    const id = nid();
    await sql`
      insert into appointments (id, user_id, service, starts_at, duration_min, timezone, notes)
      values (${id}, ${context.userId}, ${data.service}, ${data.startsAt}, ${data.duration}, ${data.timezone}, ${data.notes ?? null})
    `;
    return { id };
  });

export const listAppointments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<AppointmentRow>`
      select id, service, starts_at::text, duration_min, timezone, status, notes
      from appointments where user_id = ${context.userId}
      order by starts_at desc
    `;
  });

export const cancelAppointment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update appointments set status = 'cancelled'
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const addGoal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { title: string; target?: number; unit?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into goals (id, user_id, title, kind, target, current, unit)
      values (${nid()}, ${context.userId}, ${data.title}, ${"custom"}, ${data.target ?? null}, ${0}, ${data.unit ?? null})
    `;
    return { ok: true };
  });

async function requireCoach(userId: string) {
  const profile = await loadProfile(userId);
  if (profile.role !== "coach") throw new Error("Forbidden");
  return profile;
}

export const studioOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireCoach(context.userId);
    const sql = await getSql();
    const clients = await sql<{
      user_id: string;
      display_name: string | null;
      email: string | null;
      role: string;
      created_at: string;
    }>`
      select user_id, display_name, email, role, created_at::text
      from profiles order by created_at desc
    `;
    const pendingCheckins = await sql<{ c: number }>`
      select count(*)::int as c from checkins where coach_reply is null
    `;
    const upcoming = await sql<AppointmentRow & { user_id: string; display_name: string | null }>`
      select a.id, a.service, a.starts_at::text, a.duration_min, a.timezone, a.status, a.notes,
             a.user_id, p.display_name
      from appointments a
      join profiles p on p.user_id = a.user_id
      where a.status = 'confirmed' and a.starts_at >= now()
      order by a.starts_at asc
      limit 8
    `;
    const activeEnroll = await sql<{ c: number }>`select count(*)::int as c from enrollments where status = 'active'`;
    const weekSessions = await sql<{ c: number }>`
      select count(*)::int as c from sessions where completed_at > now() - interval '7 days'
    `;
    return {
      clients,
      pendingCheckins: pendingCheckins[0]?.c ?? 0,
      upcoming,
      activeEnroll: activeEnroll[0]?.c ?? 0,
      weekSessions: weekSessions[0]?.c ?? 0,
      programs: PROGRAMS.map((p) => ({ slug: p.slug, name: p.name })),
    };
  });

export const studioClient = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    await requireCoach(context.userId);
    const sql = await getSql();
    const profile = (
      await sql<Profile>`
        select user_id, role, display_name, email, timezone, onboarding_complete,
               onboarding_step, goal, experience, days_per_week, session_minutes,
               equipment, challenge, coaching_pref, unit
        from profiles where user_id = ${data.id}
      `
    )[0];
    if (!profile) return null;
    const enrollment = (
      await sql<Enrollment>`
        select id, program_slug, status, started_at::text, billing_status, plan_label, renewal_at::text
        from enrollments where user_id = ${data.id} and status = 'active'
        order by started_at desc limit 1
      `
    )[0] ?? null;
    const sessions = await sql<SessionRow>`
      select id, program_slug, workout_id, week, day, started_at::text, completed_at::text, feeling, notes
      from sessions where user_id = ${data.id} order by started_at desc limit 12
    `;
    const checkins = await sql<CheckinRow>`
      select id, week_of::text, training, energy, sleep, stress, wins, challenges, questions,
             weight::text, coach_reply, coach_replied_at::text, created_at::text
      from checkins where user_id = ${data.id} order by created_at desc limit 8
    `;
    const messages = await sql<MessageRow>`
      select id, user_id, author_id, from_role, body, read_at::text, created_at::text
      from messages where user_id = ${data.id} order by created_at desc limit 20
    `;
    const notes = await sql<{ id: string; body: string; created_at: string }>`
      select id, body, created_at::text from coach_notes
      where client_id = ${data.id} order by created_at desc
    `;
    return { profile, enrollment, sessions, checkins, messages, notes };
  });

export const assignProgram = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { clientId: string; programSlug: string }) => input)
  .handler(async ({ context, data }) => {
    await requireCoach(context.userId);
    const program = programBySlug(data.programSlug);
    if (!program) throw new Error("Unknown program");
    const sql = await getSql();
    await sql`update enrollments set status = 'paused' where user_id = ${data.clientId} and status = 'active'`;
    await sql`
      insert into enrollments (id, user_id, program_slug, status, plan_label, billing_status)
      values (${nid()}, ${data.clientId}, ${program.slug}, ${"active"}, ${program.price}, ${"active"})
    `;
    await sql`
      insert into messages (id, user_id, author_id, from_role, body)
      values (${nid()}, ${data.clientId}, ${context.userId}, ${"coach"}, ${`I've put you on ${program.name}. You'll see it in Today.`})
    `;
    return { ok: true };
  });

export const replyCheckin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; reply: string }) => input)
  .handler(async ({ context, data }) => {
    await requireCoach(context.userId);
    const sql = await getSql();
    const row = (
      await sql<{ user_id: string }>`select user_id from checkins where id = ${data.id}`
    )[0];
    if (!row) throw new Error("Missing");
    await sql`
      update checkins set coach_reply = ${data.reply}, coach_replied_at = now() where id = ${data.id}
    `;
    await sql`
      insert into messages (id, user_id, author_id, from_role, body)
      values (${nid()}, ${row.user_id}, ${context.userId}, ${"coach"}, ${data.reply})
    `;
    return { ok: true };
  });

export const coachMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { clientId: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    await requireCoach(context.userId);
    const body = data.body.trim();
    if (!body) return { ok: false };
    const sql = await getSql();
    await sql`
      insert into messages (id, user_id, author_id, from_role, body)
      values (${nid()}, ${data.clientId}, ${context.userId}, ${"coach"}, ${body})
    `;
    return { ok: true };
  });

export const addCoachNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { clientId: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    await requireCoach(context.userId);
    const sql = await getSql();
    await sql`
      insert into coach_notes (id, coach_id, client_id, body)
      values (${nid()}, ${context.userId}, ${data.clientId}, ${data.body})
    `;
    return { ok: true };
  });

export const studioCheckins = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireCoach(context.userId);
    const sql = await getSql();
    return sql<CheckinRow & { user_id: string; display_name: string | null }>`
      select c.id, c.week_of::text, c.training, c.energy, c.sleep, c.stress, c.wins, c.challenges,
             c.questions, c.weight::text, c.coach_reply, c.coach_replied_at::text, c.created_at::text,
             c.user_id, p.display_name
      from checkins c
      join profiles p on p.user_id = c.user_id
      order by c.created_at desc
      limit 40
    `;
  });

export const studioSchedule = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireCoach(context.userId);
    const sql = await getSql();
    return sql<AppointmentRow & { user_id: string; display_name: string | null }>`
      select a.id, a.service, a.starts_at::text, a.duration_min, a.timezone, a.status, a.notes,
             a.user_id, p.display_name
      from appointments a
      join profiles p on p.user_id = a.user_id
      order by a.starts_at desc
      limit 40
    `;
  });

export const askNorthline = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: "assessment" | "checkin" | "draft"; payload: string }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Assistant is unavailable right now." };
    const system =
      data.kind === "assessment"
        ? "You are Elena Cho, head coach at Northline. Write a short, specific 2-paragraph note for a new client based on their assessment answers. No medical diagnosis. No guaranteed results. Calm, precise, no hype. Recommend the named program if one is given."
        : data.kind === "checkin"
          ? "You are Elena Cho. Summarize this weekly check-in for a coach in 5 tight bullets: training, energy, risks, what to change, a suggested reply in first person. No medical diagnosis."
          : "You are Elena Cho. Draft a short coach message (80-140 words) based on the notes. Direct, warm, no hype, no emojis.";

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 400,
        messages: [
          { role: "system", content: system },
          { role: "user", content: data.payload.slice(0, 4000) },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: "Assistant could not reply." };
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    return { ok: true as const, text: body.choices[0]?.message.content ?? "" };
  });
