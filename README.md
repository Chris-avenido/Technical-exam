# Framesports — Rugby Video Analysis, Coaching Feedback & Highlight Reel Platform

A modern, production-grade rugby match analysis platform engineered specifically for the **Framesports** developer technical review with **CTO Ori**.

This application solves the real-world operational challenges of professional rugby coaches: finding the moments that matter, attaching timecoded tactical feedback, drawing on-screen telestrations, compiling highlight packages, and reviewing match KPIs with millisecond video synchronization.

---

## 📱 Fully Responsive Design & Coach Ergonomics

The platform is designed and optimized across all viewports:
- **Desktop & 4K Analysis Displays (>1200px):** Full dual-stage workspace with synchronous pitch telemetry, video playback, and sidebar panels.
- **Tablets & iPads (768px - 1199px):** Optimized for pitch-side coaching boxes and tactical reviews, featuring expanded touch targets and dynamic layout stacking.
- **Mobile Handhelds (<768px):** Collapsible navigation drawer, compact scoreboard (NZL vs RSA), touch-friendly frame steppers, and scrollable modal drawers.

---

## 📁 Modular Directory Architecture

The repository strictly implements a feature-driven, domain-separated modular architecture:

```
├── backend/
│   └── src/
│       ├── controllers/               # Dedicated domain controllers (Rails style)
│       │   ├── matchesController.ts   # Matches retrieval & metadata
│       │   ├── eventsController.ts    # Multi-facet filtered event stream
│       │   ├── coachingNotesController.ts # Time-synced coach feedback CRUD
│       │   ├── highlightReelsController.ts # Highlight reel compilations
│       │   ├── analyticsController.ts # Possession, territory & set piece stats
│       │   └── playersController.ts   # Player roster & seasonal KPIs
│       ├── routes/
│       │   └── apiRoutes.ts           # Centralized Express route orchestration
│       ├── mockData.ts                # Real-world rugby telemetry (NZ All Blacks vs SA Springboks)
│       ├── types.ts                   # Core data models
│       └── server.ts                  # Clean Express API entry point
│
├── src/
│   ├── components/
│   │   └── layout/                    # Reusable layout shell
│   │       ├── Navbar.tsx             # Responsive header with mobile toggle drawer
│   │       └── MatchHeader.tsx        # Responsive match scoreboard & metadata
│   ├── features/                      # Domain feature modules
│   │   ├── video-player/              # Video engine, scrubber & canvas telestration
│   │   │   └── VideoPlayer.tsx
│   │   ├── pitch/                     # Regulation rugby pitch coordinate radar
│   │   │   └── PitchRadar.tsx
│   │   ├── timeline/                  # Searchable, filterable event cards & stream
│   │   │   ├── EventTimeline.tsx
│   │   │   └── EventCard.tsx
│   │   ├── coaching/                  # Video-pinned coaching feedback
│   │   │   └── CoachingNotesPanel.tsx
│   │   ├── reels/                     # Highlight reel package builder & sequencer
│   │   │   └── HighlightReelPanel.tsx
│   │   ├── analytics/                 # KPI gauges & player impact leaderboards
│   │   │   └── AnalyticsDashboard.tsx
│   │   └── modals/                    # Floating dialogs
│   │       ├── QuickTagModal.tsx      # Rapid live event tagging
│   │       ├── ExportModal.tsx        # JSON/Opta match package export
│   │       └── TechArchitectureModal.tsx # System design brief for CTO Ori
│   ├── services/                      # Modular API client layer with offline fallback
│   │   ├── apiClient.ts               # Core HTTP fetch wrapper
│   │   ├── matchService.ts            # Match & player queries
│   │   ├── eventService.ts            # Timeline events & filtering
│   │   ├── coachingService.ts         # Coaching feedback mutations
│   │   ├── reelService.ts             # Highlight package compilation
│   │   ├── analyticsService.ts        # Telemetry calculations
│   │   └── index.ts                   # Unified barrel export
│   ├── styles/                        # Modular CSS architecture
│   │   ├── variables.css              # Tokens, colors, typography, shadows
│   │   ├── base.css                   # Resets, scrollbars, global container
│   │   ├── layout.css                 # Grid system, header, navbar
│   │   ├── components.css             # Cards, controls, modals, pitch radar
│   │   ├── responsive.css             # Media queries (<1200px, <992px, <768px, <480px)
│   │   └── index.css                  # Master barrel stylesheet
│   ├── types/                         # Modular domain TypeScript definitions
│   │   ├── match.ts
│   │   ├── event.ts
│   │   ├── coaching.ts
│   │   ├── highlight.ts
│   │   ├── analytics.ts
│   │   └── index.ts
│   ├── App.tsx                        # Main state orchestrator
│   └── main.tsx                       # React DOM entry point
│
├── package.json                       # Scripts & dependencies
├── tsconfig.json                      # Strict TypeScript compiler options
├── vite.config.ts                     # Bundler & proxy configuration
├── ARCHITECTURE.md                    # In-depth system design & Rails/Postgres blueprint
└── SUBMISSION_NOTES.md                # Submission cover note for CTO Ori & team
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Servers
Runs both the Express API (`:3001`) and the Vite web client (`:3000`) concurrently:
```bash
npm run dev
```

### 3. Open in Browser
- **Web Platform:** [http://localhost:3000](http://localhost:3000)
- **REST API Health:** [http://localhost:3001/api/health](http://localhost:3001/api/health)

### 4. Production Build Validation
```bash
npm run build
```
