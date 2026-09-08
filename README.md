# Northline

**The modern operating system for personal training.**

Northline replaces the patchwork of spreadsheets, messaging apps, and scheduling tools that coaches tolerate today with a unified platform that handles everything from client onboarding to AI-assisted programming — so coaches can focus on what they're actually good at: making people stronger.

---

## What Northline Does

### For Athletes

- **Structured Training** — Follow periodized programs with real-time set logging, rest timers, and performance tracking across sessions
- **Progress Dashboard** — Visualize strength gains, body composition trends, and consistency metrics over weeks and months
- **Direct Messaging** — Communicate with your coach without leaving the platform; no more fragmented WhatsApp threads
- **Scheduling** — Book and manage sessions with built-in calendar integration
- **Check-ins** — Complete weekly readiness assessments so your coach knows exactly how you're recovering

### For Coaches

- **Client Management** — One dashboard to see every athlete's training status, adherence, and recent feedback
- **Program Builder** — Create and assign custom workouts from a catalog of 100+ exercises with sets, reps, RPE, and tempo prescriptions
- **AI Coaching Assistant** — Powered by xAI's Grok model — generate session summaries, suggest program adjustments, and draft athlete communications in seconds
- **Assessment Tracking** — Record and track body composition, mobility screens, and strength benchmarks over time
- **Schedule Management** — Handle 1-on-1 sessions, group classes, and availability without the back-and-forth

---

## Built Different

| | Traditional Tools | Northline |
|---|---|---|
| Training logs | Paper / spreadsheets | Real-time set logging with history |
| Communication | WhatsApp / email / text | Integrated messaging with context |
| Programming | Static PDFs | Dynamic program builder + AI suggestions |
| Progress tracking | Manual check-ins | Automated dashboards with trend visualization |
| Scheduling | Calendly + manual sync | Built-in booking with availability |
| Client oversight | Guesswork | Dashboard with adherence metrics |

---

## Tech Stack

**Frontend**
- React 19 with TanStack Start (SSR + file-based routing)
- Tailwind CSS v4 with custom design tokens
- Radix UI primitives for accessible components
- Recharts for data visualization
- Zustand for client state management

**Backend**
- TanStack Server Functions (RPC over HTTP)
- Better Auth with OAuth + email/password
- PostgreSQL via Neon (production) / PGLite (local dev)
- Zod for runtime validation
- xAI Grok API for AI coaching features

**Infrastructure**
- Vercel deployment with edge functions
- Fly.io for background job processing
- GitHub Actions for CI/CD
- Sentry for error monitoring

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Ismail-Khan-Dev/fitness-coach.git
cd fitness-coach

# Install dependencies
npm install --legacy-peer-deps

# Set up environment
cp .env.example .env
# Configure DATABASE_URL, BETTER_AUTH_SECRET, OAuth credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

The app runs at `http://localhost:5173` with hot module replacement.

---

## Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── app/             # Client dashboard shell
│   │   ├── marketing/       # Public site components
│   │   └── ui/              # Design system primitives
│   ├── lib/
│   │   ├── auth/            # Authentication system
│   │   ├── app-data/        # Data access layer
│   │   ├── catalog.ts       # Exercise & program definitions
│   │   └── server/          # Server-side business logic
│   └── routes/
│       ├── app/             # Client-facing pages
│       ├── studio/          # Coach dashboard pages
│       ├── enroll/          # Program enrollment flow
│       └── api/             # API endpoints
├── migrations/              # Database migrations
├── scripts/                 # Build & deployment scripts
└── public/                  # Static assets
```

---

## Key Features

### Training Programs

5 pre-built periodized programs designed by certified coaches:

| Program | Duration | Focus |
|---------|----------|-------|
| Foundation | 8 weeks | Movement quality & work capacity |
| Strength | 10 weeks | Max strength & powerlifting |
| Performance | 12 weeks | Athletic performance & conditioning |
| Rebuild | 8 weeks | Injury rehab & return to training |
| Custom | Unlimited | Coach-programmed for individual needs |

### AI Coaching

Northline integrates xAI's Grok model to help coaches:

- Generate session summaries from logged training data
- Suggest program modifications based on athlete progress
- Draft personalized athlete communications
- Analyze adherence patterns and flag at-risk athletes

### Real-Time Data Flow

```
Athlete logs set → Server validates → Database updates
     ↓                                      ↓
Dashboard refreshes ← WebSocket push ← Analytics compute
     ↓
Coach sees update → AI generates insight → Recommendation sent
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Session signing secret |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth client secret |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `XAI_API_KEY` | No | xAI Grok API key for AI features |

---

## Deployment

Northline is configured for Vercel deployment:

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The `vercel.json` configuration handles server functions, edge middleware, and static asset serving automatically.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT © Ismail Sajid

---

**Northline** — Stop managing. Start coaching.
