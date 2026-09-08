export type MuscleGroup =
  | "legs"
  | "posterior"
  | "push"
  | "pull"
  | "shoulders"
  | "core"
  | "full";

export type Equipment = "barbell" | "dumbbell" | "cable" | "bodyweight" | "kettlebell" | "machine";

export type Exercise = {
  slug: string;
  name: string;
  muscle: MuscleGroup;
  equipment: Equipment;
  difficulty: "foundation" | "intermediate" | "advanced";
  instructions: string[];
  cues: string[];
  mistakes: string[];
};

export type WorkoutBlock = {
  exercise: string;
  sets: number;
  reps: string;
  restSec: number;
  notes?: string;
  rpe?: string;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  focus: string;
  durationMin: number;
  blocks: WorkoutBlock[];
};

export type Program = {
  slug: string;
  name: string;
  kicker: string;
  tagline: string;
  audience: string;
  goal: string;
  duration: string;
  daysPerWeek: number;
  coaching: string;
  price: string;
  priceNote: string;
  image: string;
  featured?: boolean;
  includes: string[];
  structure: { title: string; body: string }[];
  workouts: WorkoutTemplate[];
  who: string;
  notFor: string;
};

export type Resource = {
  slug: string;
  title: string;
  category: "training" | "recovery" | "lifestyle" | "method";
  minutes: number;
  excerpt: string;
  body: string[];
};

export const COACH = {
  name: "Elena Cho",
  role: "Head coach, Northline",
  image: "/images/coach.jpg",
  location: "Lisbon · remotely worldwide",
  bio: [
    "I coach people who already know how to work hard and are tired of working randomly.",
    "Northline exists because most training advice is either too vague to follow or too loud to trust. The work itself is simple. The system around it is not optional.",
  ],
  approach:
    "We start from what you can actually do this month — not an idealized week that collapses on Thursday. Load goes up when it has earned the right to. Life is part of the program, not an interruption of it.",
};

export const METHOD = [
  {
    n: "01",
    title: "Locate",
    body: "An honest starting point. Strength, schedule, equipment, the thing that usually knocks you off the rails. No personality quiz. No medical theatre.",
  },
  {
    n: "02",
    title: "Draw the line",
    body: "One program. Not a folder of PDFs. You always know the next session, the next progression, and what ‘done’ looks like this week.",
  },
  {
    n: "03",
    title: "Stay on it",
    body: "Weekly check-ins, a coach who reads them, and adjustments when life happens. Accountability without the drill-sergeant act.",
  },
  {
    n: "04",
    title: "Progress on purpose",
    body: "Load, consistency, and the work you can repeat. We track the things that actually move: sessions completed, strength trend, how the week felt.",
  },
];

export const EXERCISES: Exercise[] = [
  {
    slug: "back-squat",
    name: "Back squat",
    muscle: "legs",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: [
      "Bar sits on the upper back, not the neck. Hands even, brace before you unrack.",
      "Sit down and slightly back. Knees track over mid-foot. Depth is where the hip crease passes the knee if your mobility allows.",
      "Drive the floor away. Keep the torso angle you started with.",
    ],
    cues: ["Brace before you move", "Own the bottom", "Finish tall"],
    mistakes: ["Collapsing the chest", "Caving knees in", "Bouncing out of the hole"],
  },
  {
    slug: "bench-press",
    name: "Bench press",
    muscle: "push",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: [
      "Eyes under the bar. Plant feet. Unrack with locked elbows.",
      "Lower to the lower chest with control. Forearms vertical at the bottom.",
      "Press back toward the rack. Don’t bounce off the chest.",
    ],
    cues: ["Pull the bar apart", "Leave fingerprints on the floor", "Pause is optional, control is not"],
    mistakes: ["Flaring elbows to 90°", "Bouncing", "Unplanting the feet"],
  },
  {
    slug: "deadlift",
    name: "Conventional deadlift",
    muscle: "posterior",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: [
      "Bar over mid-foot. Hinge, take the slack out, brace.",
      "Push the floor. Bar stays close. Hips and shoulders rise together.",
      "Lock out by standing tall — don’t lean back.",
    ],
    cues: ["Crush oranges in your armpits", "Push the floor", "Stand up, don’t lean back"],
    mistakes: ["Jerking the bar off the floor", "Hips shooting up first", "Hyperextending at lockout"],
  },
  {
    slug: "overhead-press",
    name: "Overhead press",
    muscle: "shoulders",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: [
      "Bar at the shoulders, elbows slightly forward. Glutes tight.",
      "Press in a slight arc around the face. Head through at the top.",
      "Lower with the same control you pressed with.",
    ],
    cues: ["Ribs down", "Punch the ceiling", "Head through"],
    mistakes: ["Overarching the low back", "Pressing out in front", "Shrugging every rep"],
  },
  {
    slug: "barbell-row",
    name: "Barbell row",
    muscle: "pull",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: [
      "Hinge to a long spine. Bar hangs below the chest.",
      "Row to the lower ribs. Pause a beat. Lower without swinging.",
    ],
    cues: ["Long spine", "Elbows to hips", "No English"],
    mistakes: ["Using the lower back to yank", "Standing more upright each set"],
  },
  {
    slug: "romanian-deadlift",
    name: "Romanian deadlift",
    muscle: "posterior",
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: [
      "Soft knees. Push the hips back until the hamstrings load.",
      "Bar stays close to the legs. Stop when the back wants to round.",
      "Stand by squeezing the glutes, not yanking the chest up.",
    ],
    cues: ["Hips back", "Bar close", "Feel the hamstrings, not the lumbar"],
    mistakes: ["Squatting the RDL", "Rounding to chase range"],
  },
  {
    slug: "pull-up",
    name: "Pull-up",
    muscle: "pull",
    equipment: "bodyweight",
    difficulty: "advanced",
    instructions: [
      "Hang long. Pack the shoulders slightly.",
      "Pull elbows to ribs until the chin clears.",
      "Lower to a full hang you still own.",
    ],
    cues: ["Chest to bar, not chin to sky", "Legs quiet"],
    mistakes: ["Kipping when the program didn’t ask", "Half reps at the bottom"],
  },
  {
    slug: "lat-pulldown",
    name: "Lat pulldown",
    muscle: "pull",
    equipment: "cable",
    difficulty: "foundation",
    instructions: [
      "Sit tall, take a grip you can actually pull.",
      "Draw the bar to the upper chest. Pause. Control the return.",
    ],
    cues: ["Elbows to pockets", "Don’t lean back for the last reps"],
    mistakes: ["Turning it into a sit-up", "Bouncing the stack"],
  },
  {
    slug: "split-squat",
    name: "Rear-foot split squat",
    muscle: "legs",
    equipment: "dumbbell",
    difficulty: "intermediate",
    instructions: [
      "Long stance. Front heel planted. Torso quiet.",
      "Drop the back knee. Front knee tracks over mid-foot.",
      "Push through the front heel to stand.",
    ],
    cues: ["Front heel heavy", "Torso quiet"],
    mistakes: ["Slamming the back knee", "Tiny stance"],
  },
  {
    slug: "goblet-squat",
    name: "Goblet squat",
    muscle: "legs",
    equipment: "dumbbell",
    difficulty: "foundation",
    instructions: [
      "Hold a dumbbell or kettlebell at the chest. Elbows down.",
      "Sit between the knees. Chest stays proud.",
      "Stand without pitching forward.",
    ],
    cues: ["Elbows inside knees", "Own the bottom"],
    mistakes: ["Heels lifting", "Collapsing the chest"],
  },
  {
    slug: "hip-thrust",
    name: "Hip thrust",
    muscle: "posterior",
    equipment: "barbell",
    difficulty: "foundation",
    instructions: [
      "Upper back on a bench. Bar in the hip crease.",
      "Drive through the heels to a full lockout. Pause.",
      "Lower under control.",
    ],
    cues: ["Ribs down at the top", "Squeeze, don’t hyperextend"],
    mistakes: ["Overextending the lumbar", "Tiny range"],
  },
  {
    slug: "incline-press",
    name: "Incline dumbbell press",
    muscle: "push",
    equipment: "dumbbell",
    difficulty: "foundation",
    instructions: [
      "Bench at a moderate incline. Dumbbells over the shoulders.",
      "Lower with elbows ~45°. Press without clanging at the top.",
    ],
    cues: ["Shoulders packed", "Smooth lockout"],
    mistakes: ["Too steep an incline", "Flaring and shrugging"],
  },
  {
    slug: "seated-row",
    name: "Seated cable row",
    muscle: "pull",
    equipment: "cable",
    difficulty: "foundation",
    instructions: [
      "Sit tall. Reach, then row the handle to the ribs.",
      "Pause. Let the shoulders travel forward on the way out — without rounding hard.",
    ],
    cues: ["Chest proud", "Pull to the ribs"],
    mistakes: ["Rocking the torso for momentum"],
  },
  {
    slug: "face-pull",
    name: "Face pull",
    muscle: "shoulders",
    equipment: "cable",
    difficulty: "foundation",
    instructions: [
      "Rope at face height. Pull toward the nose, elbows high.",
      "Externally rotate at the end. Control the return.",
    ],
    cues: ["Elbows up", "Show the backs of your hands"],
    mistakes: ["Turning it into a row", "Too much load"],
  },
  {
    slug: "lateral-raise",
    name: "Lateral raise",
    muscle: "shoulders",
    equipment: "dumbbell",
    difficulty: "foundation",
    instructions: [
      "Soft elbows. Raise to just below shoulder height.",
      "Lead with the elbows. Lower slower than you lifted.",
    ],
    cues: ["Pour the water", "No swinging"],
    mistakes: ["Using traps to yank", "Going heavier than the delts can own"],
  },
  {
    slug: "plank",
    name: "Plank",
    muscle: "core",
    equipment: "bodyweight",
    difficulty: "foundation",
    instructions: [
      "Elbows under shoulders. Squeeze glutes. Ribs down.",
      "Breathe. If the low back sags, you’re done — even if the clock isn’t.",
    ],
    cues: ["Long body", "Quiet breath"],
    mistakes: ["Hips pike or sag", "Holding the breath"],
  },
  {
    slug: "farmer-carry",
    name: "Farmer carry",
    muscle: "full",
    equipment: "dumbbell",
    difficulty: "foundation",
    instructions: [
      "Pick up two heavy implements. Stand tall.",
      "Walk with short, proud steps. Don’t let the weights pull you sideways.",
    ],
    cues: ["Tall", "Quiet implements", "Grip first"],
    mistakes: ["Leaning", "Shuffling with a rounded back"],
  },
  {
    slug: "kettlebell-swing",
    name: "Kettlebell swing",
    muscle: "posterior",
    equipment: "kettlebell",
    difficulty: "intermediate",
    instructions: [
      "Hinge. Hike the bell. Snap the hips to standing.",
      "The arms are ropes. The bell floats; it is not a front raise.",
    ],
    cues: ["Hips, not arms", "Crisp lockout"],
    mistakes: ["Squatting the swing", "Lifting with the low back"],
  },
  {
    slug: "walking-lunge",
    name: "Walking lunge",
    muscle: "legs",
    equipment: "dumbbell",
    difficulty: "foundation",
    instructions: [
      "Step long enough that the back knee can drop.",
      "Front heel stays down. Alternate without rushing the middle.",
    ],
    cues: ["Long step", "Proud chest"],
    mistakes: ["Tiny steps", "Knee diving in"],
  },
  {
    slug: "dip",
    name: "Dip",
    muscle: "push",
    equipment: "bodyweight",
    difficulty: "advanced",
    instructions: [
      "Support at the top, shoulders down.",
      "Lower until the upper arm is near parallel. Press up without shrugging.",
    ],
    cues: ["Shoulders down", "Own the bottom"],
    mistakes: ["Going too deep with an open shoulder", "Kipping"],
  },
];

const squat = (sets: number, reps: string, rest = 180): WorkoutBlock => ({
  exercise: "back-squat",
  sets,
  reps,
  restSec: rest,
  rpe: "7–8",
});

export const PROGRAMS: Program[] = [
  {
    slug: "private",
    name: "Private coaching",
    kicker: "1 : 1",
    tagline: "A coach in your week, not a PDF in your inbox.",
    audience: "People who want the work designed around their life, their history, and their actual schedule.",
    goal: "A custom line — strength, physique, or performance — with weekly eyes on it.",
    duration: "Month to month",
    daysPerWeek: 4,
    coaching: "Weekly check-in, messaging, program written for you, form review.",
    price: "$450 / month",
    priceNote: "Includes programming, weekly review, and messaging. Sessions billed separately.",
    image: "/images/method.jpg",
    featured: true,
    who: "You have trained before. You are busy. You want someone competent reading the week with you.",
    notFor: "Anyone looking for a 6-week shred, a meal plan that ignores their life, or a hype account.",
    includes: [
      "Custom weekly programming",
      "Sunday check-in with a written reply",
      "Unlimited messaging inside the app",
      "Form review on lifts that matter",
      "Appointment booking for consults and sessions",
    ],
    structure: [
      { title: "Week 0", body: "Intake, movement screen via video, and the first block written to your equipment and calendar." },
      { title: "The block", body: "3–6 weeks with a clear target. Load, volume, and density move on purpose — not vibes." },
      { title: "The week", body: "You train. You log. You check in. Elena replies with the next adjustment, not a pep talk." },
    ],
    workouts: [],
  },
  {
    slug: "strength",
    name: "Northline Strength",
    kicker: "Flagship",
    tagline: "Four days. The big lifts. A line you can follow for a year.",
    audience: "Intermediates who want to get meaningfully stronger without living in the gym.",
    goal: "Squat, bench, deadlift, and press — with the accessories that keep you durable.",
    duration: "12 weeks, repeating blocks",
    daysPerWeek: 4,
    coaching: "Program + weekly check-in + coach notes.",
    price: "$129 / month",
    priceNote: "Cancel any time. Programming updates each block.",
    image: "/images/program-strength.jpg",
    who: "You can squat, hinge, and press with a bar. You want a system, not a randomizer.",
    notFor: "Complete beginners, or anyone training twice a week with no room to grow.",
    includes: [
      "4 sessions per week, 55–75 minutes",
      "Progression rules written into the app",
      "Weekly check-in",
      "Exercise library with cues",
      "Access to the Northline desk",
    ],
    structure: [
      { title: "Days 1 & 3 — lower", body: "Squat or deadlift emphasis, then posterior and single-leg work that keeps the week honest." },
      { title: "Days 2 & 4 — upper", body: "Press and row. Shoulders that last. No junk volume." },
      { title: "Progression", body: "Add load when you own the top of the rep range. If you miss, you repeat. If you miss twice, we change the plan — not your character." },
    ],
    workouts: [
      {
        id: "str-1",
        name: "Lower A",
        focus: "Squat",
        durationMin: 70,
        blocks: [
          squat(5, "5"),
          { exercise: "romanian-deadlift", sets: 4, reps: "8", restSec: 150, rpe: "7" },
          { exercise: "split-squat", sets: 3, reps: "10 / side", restSec: 90 },
          { exercise: "plank", sets: 3, reps: "45s", restSec: 60 },
        ],
      },
      {
        id: "str-2",
        name: "Upper A",
        focus: "Press",
        durationMin: 65,
        blocks: [
          { exercise: "bench-press", sets: 5, reps: "5", restSec: 180, rpe: "7–8" },
          { exercise: "barbell-row", sets: 4, reps: "8", restSec: 150, rpe: "7" },
          { exercise: "overhead-press", sets: 3, reps: "8", restSec: 120 },
          { exercise: "face-pull", sets: 3, reps: "15", restSec: 60 },
          { exercise: "lateral-raise", sets: 3, reps: "12", restSec: 60 },
        ],
      },
      {
        id: "str-3",
        name: "Lower B",
        focus: "Hinge",
        durationMin: 70,
        blocks: [
          { exercise: "deadlift", sets: 4, reps: "4", restSec: 210, rpe: "7–8" },
          { exercise: "goblet-squat", sets: 3, reps: "10", restSec: 90 },
          { exercise: "hip-thrust", sets: 3, reps: "10", restSec: 90 },
          { exercise: "walking-lunge", sets: 3, reps: "10 / side", restSec: 90 },
          { exercise: "farmer-carry", sets: 3, reps: "40m", restSec: 90 },
        ],
      },
      {
        id: "str-4",
        name: "Upper B",
        focus: "Pull",
        durationMin: 65,
        blocks: [
          { exercise: "incline-press", sets: 4, reps: "8", restSec: 150 },
          { exercise: "pull-up", sets: 4, reps: "6", restSec: 150, notes: "Add load or band as needed." },
          { exercise: "seated-row", sets: 3, reps: "12", restSec: 90 },
          { exercise: "dip", sets: 3, reps: "8", restSec: 90, notes: "Foot-assisted is fine." },
          { exercise: "face-pull", sets: 3, reps: "15", restSec: 60 },
        ],
      },
    ],
  },
  {
    slug: "rebuild",
    name: "The Rebuild",
    kicker: "Return",
    tagline: "For the season after you fell off. Three days. No drama.",
    audience: "People coming back from inconsistency, a busy year, or a program that never fit.",
    goal: "Re-establish the habit, then the load. Composition follows the work.",
    duration: "16 weeks",
    daysPerWeek: 3,
    coaching: "Program + weekly check-in.",
    price: "$89 / month",
    priceNote: "Built to be finished. Then you step onto Strength or Private.",
    image: "/images/program-rebuild.jpg",
    who: "You used to train. You know the language. You need a line that survives a real calendar.",
    notFor: "Anyone chasing a guaranteed aesthetic outcome on a deadline.",
    includes: [
      "3 full-body sessions, 45–60 minutes",
      "Progression that starts conservative",
      "Weekly check-in",
      "Habit goals inside the app",
    ],
    structure: [
      { title: "Weeks 1–4", body: "Groove the pattern. Conservative loads. Show up." },
      { title: "Weeks 5–12", body: "Add load. Keep the three days sacred." },
      { title: "Weeks 13–16", body: "A small peak, then a decision: stay, step up, or go private." },
    ],
    workouts: [
      {
        id: "rb-1",
        name: "Session A",
        focus: "Squat / press",
        durationMin: 55,
        blocks: [
          { exercise: "back-squat", sets: 4, reps: "6", restSec: 150 },
          { exercise: "bench-press", sets: 4, reps: "6", restSec: 150 },
          { exercise: "seated-row", sets: 3, reps: "10", restSec: 90 },
          { exercise: "split-squat", sets: 3, reps: "8 / side", restSec: 75 },
          { exercise: "plank", sets: 3, reps: "40s", restSec: 45 },
        ],
      },
      {
        id: "rb-2",
        name: "Session B",
        focus: "Hinge / pull",
        durationMin: 55,
        blocks: [
          { exercise: "romanian-deadlift", sets: 4, reps: "8", restSec: 150 },
          { exercise: "overhead-press", sets: 4, reps: "6", restSec: 120 },
          { exercise: "lat-pulldown", sets: 3, reps: "10", restSec: 90 },
          { exercise: "walking-lunge", sets: 3, reps: "8 / side", restSec: 75 },
          { exercise: "face-pull", sets: 3, reps: "15", restSec: 45 },
        ],
      },
      {
        id: "rb-3",
        name: "Session C",
        focus: "Full",
        durationMin: 50,
        blocks: [
          { exercise: "goblet-squat", sets: 3, reps: "10", restSec: 90 },
          { exercise: "incline-press", sets: 3, reps: "10", restSec: 90 },
          { exercise: "barbell-row", sets: 3, reps: "8", restSec: 90 },
          { exercise: "hip-thrust", sets: 3, reps: "10", restSec: 75 },
          { exercise: "farmer-carry", sets: 3, reps: "40m", restSec: 75 },
        ],
      },
    ],
  },
  {
    slug: "foundation",
    name: "Foundation",
    kicker: "Start",
    tagline: "Learn the shapes. Leave with a practice, not a 30-day dare.",
    audience: "New or returning trainees who want to be taught, not entertained.",
    goal: "Own squat, hinge, press, pull, carry. Build a week you can repeat.",
    duration: "8 weeks",
    daysPerWeek: 3,
    coaching: "Guided program with check-ins.",
    price: "$149",
    priceNote: "One block. Then you graduate — or you stay with a coach.",
    image: "/images/program-foundation.jpg",
    who: "You are starting, restarting, or done being confused in a commercial gym.",
    notFor: "Advanced lifters looking for a peaking cycle.",
    includes: [
      "3 sessions per week, ~45 minutes",
      "Coaching cues in every exercise",
      "Weekly check-in",
      "A clear next step at week 8",
    ],
    structure: [
      { title: "The shapes", body: "Goblet squat, hip hinge, press, row, carry. We do not skip these because they are unglamorous." },
      { title: "The week", body: "Three sessions. Same bones, slightly more load. Competence before novelty." },
    ],
    workouts: [
      {
        id: "fd-1",
        name: "Foundation A",
        focus: "Squat / press",
        durationMin: 45,
        blocks: [
          { exercise: "goblet-squat", sets: 3, reps: "8", restSec: 90 },
          { exercise: "incline-press", sets: 3, reps: "8", restSec: 90 },
          { exercise: "seated-row", sets: 3, reps: "10", restSec: 75 },
          { exercise: "plank", sets: 3, reps: "30s", restSec: 45 },
        ],
      },
      {
        id: "fd-2",
        name: "Foundation B",
        focus: "Hinge / overhead",
        durationMin: 45,
        blocks: [
          { exercise: "romanian-deadlift", sets: 3, reps: "8", restSec: 90 },
          { exercise: "overhead-press", sets: 3, reps: "8", restSec: 90 },
          { exercise: "lat-pulldown", sets: 3, reps: "10", restSec: 75 },
          { exercise: "face-pull", sets: 3, reps: "12", restSec: 45 },
        ],
      },
      {
        id: "fd-3",
        name: "Foundation C",
        focus: "Single-leg / carry",
        durationMin: 40,
        blocks: [
          { exercise: "split-squat", sets: 3, reps: "8 / side", restSec: 75 },
          { exercise: "bench-press", sets: 3, reps: "8", restSec: 90 },
          { exercise: "farmer-carry", sets: 3, reps: "30m", restSec: 60 },
          { exercise: "kettlebell-swing", sets: 3, reps: "12", restSec: 75 },
        ],
      },
    ],
  },
  {
    slug: "performance",
    name: "Athletic performance",
    kicker: "Field",
    tagline: "Strength that shows up in the sport, not just on the bar.",
    audience: "Athletes and competitors who already have a practice and need a strength layer that doesn’t wreck it.",
    goal: "Force, stiffness, and durability around a sport calendar.",
    duration: "In-season / off-season blocks",
    daysPerWeek: 3,
    coaching: "Program tailored around your fixtures.",
    price: "$149 / month",
    priceNote: "Best with Private if your calendar is chaotic.",
    image: "/images/program-performance.jpg",
    who: "You train a sport. You need gym work that supports it.",
    notFor: "People whose only sport is the barbell — use Strength.",
    includes: [
      "3 sessions that respect practice fatigue",
      "Power + strength pairing",
      "Weekly check-in against your calendar",
    ],
    structure: [
      { title: "Off-season", body: "More volume, bigger strength layer." },
      { title: "In-season", body: "Fewer lifts, higher quality. We protect the sport." },
    ],
    workouts: [
      {
        id: "ap-1",
        name: "Force A",
        focus: "Lower force",
        durationMin: 50,
        blocks: [
          { exercise: "back-squat", sets: 4, reps: "4", restSec: 180 },
          { exercise: "romanian-deadlift", sets: 3, reps: "6", restSec: 150 },
          { exercise: "split-squat", sets: 3, reps: "6 / side", restSec: 90 },
          { exercise: "farmer-carry", sets: 3, reps: "40m", restSec: 75 },
        ],
      },
      {
        id: "ap-2",
        name: "Force B",
        focus: "Upper + posterior",
        durationMin: 50,
        blocks: [
          { exercise: "bench-press", sets: 4, reps: "5", restSec: 150 },
          { exercise: "pull-up", sets: 4, reps: "5", restSec: 120 },
          { exercise: "hip-thrust", sets: 3, reps: "6", restSec: 90 },
          { exercise: "face-pull", sets: 3, reps: "12", restSec: 45 },
        ],
      },
      {
        id: "ap-3",
        name: "Power",
        focus: "Snap",
        durationMin: 40,
        blocks: [
          { exercise: "kettlebell-swing", sets: 5, reps: "8", restSec: 90 },
          { exercise: "overhead-press", sets: 4, reps: "4", restSec: 150 },
          { exercise: "barbell-row", sets: 3, reps: "6", restSec: 90 },
          { exercise: "plank", sets: 3, reps: "40s", restSec: 45 },
        ],
      },
    ],
  },
];

export const RESOURCES: Resource[] = [
  {
    slug: "how-we-progress",
    title: "How Northline progresses load",
    category: "method",
    minutes: 4,
    excerpt: "Add weight when you own the top of the range. Repeat when you don’t. Change the plan if you miss twice.",
    body: [
      "Most people add load because the calendar said so. We add load because the set looked like it belonged to you.",
      "If the top of the prescribed range is clean, the next session goes up a small step. If it is ugly, you repeat. If you miss twice, we change the exercise, the range, or the week — not your identity.",
      "Logged sets in the app are how this decision gets made. Empty logs make a guessing coach. We already have enough of those.",
    ],
  },
  {
    slug: "six-minute-warmup",
    title: "A warm-up that takes six minutes",
    category: "training",
    minutes: 3,
    excerpt: "You do not need a 25-minute mobility flow before a Tuesday squat.",
    body: [
      "Pulse up. Then do the pattern you are about to load, lighter, for two or three sets.",
      "That is the warm-up. Extra mobility work is for the thing that is actually limited — not a ritual to feel prepared.",
    ],
  },
  {
    slug: "rpe-without-theatre",
    title: "RPE without the theatre",
    category: "training",
    minutes: 3,
    excerpt: "A seven is ‘two reps in the tank, maybe three if you were being dramatic.’",
    body: [
      "We use RPE as a guardrail, not a personality. If a prescribed 7 feels like a 9, you stop — and you write it down.",
      "The number is a conversation with your coach, not a moral score.",
    ],
  },
  {
    slug: "training-around-a-job",
    title: "Training around a real job",
    category: "lifestyle",
    minutes: 5,
    excerpt: "The program that only works on a rest day is not a program.",
    body: [
      "We would rather see three honest sessions than five fantasies. Tell us the week you actually have.",
      "If Thursday always dies, we do not put the heavy squat there and then lecture you. We move the squat.",
    ],
  },
  {
    slug: "sleep-is-a-lift",
    title: "Sleep is a lift",
    category: "recovery",
    minutes: 4,
    excerpt: "You cannot out-program a 5-hour night, and we will not pretend otherwise.",
    body: [
      "When sleep tanks, we cut volume or intensity for a session. That is coaching, not weakness.",
      "Check-ins ask about sleep because it changes the work. Answer honestly.",
    ],
  },
  {
    slug: "common-squat-misses",
    title: "Three squat misses we see every week",
    category: "training",
    minutes: 4,
    excerpt: "Depth theatre, knee cave, and a brace that arrives after the bar is already moving.",
    body: [
      "Brace before you unrack. Knees track with the feet. Depth is owned, not performed.",
      "Film a set from the side if you are unsure. Send it. That is what messaging is for.",
    ],
  },
];

export const SERVICES = [
  { id: "consult", name: "Consultation", minutes: 30, price: "Free", blurb: "Fit, schedule, and whether Northline is the right room." },
  { id: "session", name: "Training session", minutes: 60, price: "$120", blurb: "In-person or live video. The work, coached." },
  { id: "review", name: "Form review", minutes: 25, price: "$55", blurb: "Two lifts, slow. Cues you can use the next day." },
] as const;

export const FAQS = [
  {
    id: "results",
    q: "Do you guarantee results?",
    a: "No. Anyone who does is selling a feeling. We guarantee a system, a coach who reads your week, and programming that progresses when you do the work. Bodies are not software.",
  },
  {
    id: "food",
    q: "Do you write meal plans?",
    a: "Not as a default. If nutrition is the limiter, we will say so and keep the advice boring: protein, produce, sleep, repeat. We are not a medical practice and we do not diagnose.",
  },
  {
    id: "beginner",
    q: "I am new. Is this too serious for me?",
    a: "Foundation exists for this. Serious is not the same as advanced. It means we will not confuse you on purpose.",
  },
  {
    id: "time",
    q: "I can only train three days.",
    a: "Then you train three days. Rebuild, Foundation, and Performance are built on three. Private can be anything. Four-day Strength is for people who have four days.",
  },
  {
    id: "equipment",
    q: "I train at a hotel gym / at home.",
    a: "Tell us what you have. Private and check-ins will rewrite around it. The templated programs assume a bar, a rack, dumbbells, and a cable. If you don’t have that, start with a consult.",
  },
  {
    id: "cancel",
    q: "Can I stop?",
    a: "Monthly programs cancel at the end of the period. Foundation is a single block. We would rather you leave cleanly than fade.",
  },
];

export const PROBLEMS = [
  {
    title: "A folder of programs, none of them current",
    body: "You have saved more training than you have finished. The missing piece is not information.",
  },
  {
    title: "Weeks that look good on Sunday",
    body: "Then Thursday happens. Without a person and a plan that expected Thursday, the week dissolves.",
  },
  {
    title: "Load that never actually goes up",
    body: "You work hard. The bar does not move. Hard and progressive are not the same sport.",
  },
];

export const EXPERIENCE = [
  { n: "01", title: "You know the next session", body: "Open the app. Today’s work is already there — lifts, reps, rest, the note from your coach." },
  { n: "02", title: "You log what happened", body: "Sets, load, how it felt. This is the raw material of coaching, not admin." },
  { n: "03", title: "You check in once a week", body: "Five honest answers. A reply that changes next week if it needs to." },
  { n: "04", title: "You can see the line", body: "Consistency, strength trend, the boring graph that actually means something." },
];

export function exerciseBySlug(slug: string) {
  return EXERCISES.find((e) => e.slug === slug);
}

export function programBySlug(slug: string) {
  return PROGRAMS.find((p) => p.slug === slug);
}

export function resourceBySlug(slug: string) {
  return RESOURCES.find((r) => r.slug === slug);
}

export const MUSCLE_LABEL: Record<MuscleGroup, string> = {
  legs: "Legs",
  posterior: "Posterior chain",
  push: "Push",
  pull: "Pull",
  shoulders: "Shoulders",
  core: "Core",
  full: "Full body",
};

export const EQUIP_LABEL: Record<Equipment, string> = {
  barbell: "Barbell",
  dumbbell: "Dumbbell",
  cable: "Cable",
  bodyweight: "Bodyweight",
  kettlebell: "Kettlebell",
  machine: "Machine",
};

export function recommendProgram(answers: {
  goal?: string;
  experience?: string;
  days?: string;
}): string {
  const { goal, experience, days } = answers;
  if (experience === "new") return "foundation";
  if (goal === "return" || experience === "inconsistent") return "rebuild";
  if (goal === "sport") return "performance";
  if (goal === "custom" || days === "varies") return "private";
  if (goal === "strength" || experience === "intermediate" || experience === "advanced") {
    if (days === "2" || days === "3") return "rebuild";
    return "strength";
  }
  if (goal === "composition") return "rebuild";
  return "strength";
}
