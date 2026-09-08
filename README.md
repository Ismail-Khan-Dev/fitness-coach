<div align="center">

# Northline

**The modern operating system for personal training.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/Ismail-Khan-Dev/fitness-coach?style=for-the-badge&logo=github)
![GitHub forks](https://img.shields.io/github/forks/Ismail-Khan-Dev/fitness-coach?style=for-the-badge&logo=github)
![GitHub issues](https://img.shields.io/github/issues/Ismail-Khan-Dev/fitness-coach?style=for-the-badge&logo=github)

</div>

Northline replaces the patchwork of spreadsheets, messaging apps, and scheduling tools that coaches tolerate today with a unified platform that handles everything from client onboarding to AI-assisted programming — so coaches can focus on what they're actually good at: making people stronger.

---

<div align="center">

## Quick Stats

| Metric | Value |
|--------|-------|
| **Exercises** | 100+ |
| **Training Programs** | 5 |
| **Components** | 30+ |
| **Database Tables** | 12 |
| **API Routes** | 15+ |
| **Test Coverage** | 85% |

</div>

---

## What Northline Does

### For Athletes

| Feature | Description |
|---------|-------------|
| 🏋️ **Structured Training** | Follow periodized programs with real-time set logging, rest timers, and performance tracking across sessions |
| 📊 **Progress Dashboard** | Visualize strength gains, body composition trends, and consistency metrics over weeks and months |
| 💬 **Direct Messaging** | Communicate with your coach without leaving the platform; no more fragmented WhatsApp threads |
| 📅 **Scheduling** | Book and manage sessions with built-in calendar integration |
| ✅ **Check-ins** | Complete weekly readiness assessments so your coach knows exactly how you're recovering |

### For Coaches

| Feature | Description |
|---------|-------------|
| 👥 **Client Management** | One dashboard to see every athlete's training status, adherence, and recent feedback |
| 🛠️ **Program Builder** | Create and assign custom workouts from a catalog of 100+ exercises with sets, reps, RPE, and tempo prescriptions |
| 🤖 **AI Coaching Assistant** | Powered by xAI's Grok model — generate session summaries, suggest program adjustments, and draft athlete communications in seconds |
| 📈 **Assessment Tracking** | Record and track body composition, mobility screens, and strength benchmarks over time |
| 📆 **Schedule Management** | Handle 1-on-1 sessions, group classes, and availability without the back-and-forth

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

<div align="center">

### Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TanStack](https://img.shields.io/badge/TanStack-Router-DC322F?style=flat-square&logo=tanstack&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix-UI-161618?style=flat-square&logo=radixui&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.0-FF6384?style=flat-square)
![Zustand](https://img.shields.io/badge/Zustand-State-443E38?style=flat-square)

### Backend

![TanStack Query](https://img.shields.io/badge/TanStack-Query-DC322F?style=flat-square)
![Better Auth](https://img.shields.io/badge/Better-Auth-161618?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3068B7?style=flat-square&logo=zod&logoColor=white)
![xAI](https://img.shields.io/badge/xAI-Grok-1DA1F2?style=flat-square&logo=x&logoColor=white)

### Infrastructure

![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?style=flat-square&logo=vercel&logoColor=white)
![Fly.io](https://img.shields.io/badge/Fly.io-Jobs-8B5CF6?style=flat-square)
![GitHub Actions](https://img.shields.io/badge/GitHub-Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-Monitoring-362D59?style=flat-square&logo=sentry&logoColor=white)

</div>

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

<div align="center">

![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)
![Issues](https://img.shields.io/github/issues/Ismail-Khan-Dev/fitness-coach?style=for-the-badge&color=red)
![Stars](https://img.shields.io/github/stars/Ismail-Khan-Dev/fitness-coach?style=for-the-badge&color=yellow)

</div>

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

<div align="center">

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![GitHub](https://img.shields.io/badge/GitHub-Ismail--Khan--Dev-181717?style=for-the-badge&logo=github&logoColor=white)

</div>

MIT © Ismail Sajid

---

<div align="center">

### Built with ❤️ by

**Ismail Sajid**

[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ismail-Khan-Dev)

---

**Northline** — Stop managing. Start coaching.

![Northline](https://img.shields.io/badge/Northline-OS_for_fitness-000000?style=for-the-badge&logo=fitness&logoColor=white)

</div>
