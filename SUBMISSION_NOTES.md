# Framesports Application Submission & Walkthrough Notes

**Candidate Submission for:** Software Developer Role  
**Reviewer:** Ori (CTO) & Framesports Founding Team  
**Repository / Working Directory:** [`test/`](file:///e:/christop/documents/test)

---

## 1. Application Details & Availability

- **Notice Period:** [Your Notice Period, e.g. Immediate / 1 week / 2 weeks]
- **Earliest Start Date:** [Your Earliest Start Date, e.g. Immediately / Monday next week]
- **Commitment Confirmation:** I confirm full availability for the full-time remote role (60 hours/week, 7 days/week) as my sole professional commitment.

---

## 2. Executive Summary of What Was Built

Rather than a simple generic MVP, I built a production-grade **Rugby Video Analysis, Coaching Feedback & Highlight Reel Platform** that directly tackles the day-to-day workflow of professional rugby coaches:

1. **Interactive Rugby Video Player & Scrubber Bar**:
   - Discrete **sub-second frame stepping (±0.1s)** for coaches scrutinizing pass releases, grounding, offside lines, and ruck entries.
   - **Color-coded timeline event flags** directly embedded into the seekbar (Tries, Tackles, Turnovers, Scrums, Lineouts, Penalties) with hover preview cards.
   - **Auto-Loop Clip Mode** to repeatedly review a tactical phase (e.g. 10s window) without manual rewinding.

2. **Tactical Pitch Coordinate Radar**:
   - Interactive regulation rugby pitch showing 22m, 10m dashed lines, halfway, and in-goal zones.
   - Dynamic event blips positioned at exact field coordinates (`pitchX`, `pitchY`), with 1-click video synchronization.

3. **On-Screen Telestration & Tactical Canvas**:
   - Enables coaches to draw directly on frozen frames (running angles, defensive drift, player halo focus rings) with multi-color neon options.

4. **Timecoded Coaching Feedback & Player Tagging**:
   - Structured notes categorized by *Tactical, Technique, Positioning, Discipline, or Commendation*.
   - Player tagging with jersey numbers and direct timestamp seeking.

5. **Highlight Reel Builder & Autoplay Sequencer**:
   - Instant queueing of key moments from the timeline into a highlight package.
   - **Play Sequence Mode**: automatically autoplays queued clips sequentially.

6. **Rugby KPIs & Set Piece Analytics**:
   - Possession % & Territory % comparison.
   - Tackle success rate (made vs missed).
   - Set piece dominance (scrums & lineouts won on own throw).
   - Top player impact ratings (metres carried, tackles made, turnovers won).

7. **Exportable Match Report Package**:
   - One-click export of complete match telemetry in structured JSON formatted for Opta and StatsPerform data feeds.

---

## 3. Tech Stack & Architectural Decisions

- **Frontend:** React 18, TypeScript, Vite, Vanilla CSS design system (dark sports analytics theme, responsive glassmorphic HUD).
- **Backend API:** Express + TypeScript RESTful API built with Ruby on Rails architectural conventions (`/api/v1/...`).
- **Data Layer & Scalability:** Designed for PostgreSQL with:
  - B-Tree index on `(match_id, timestamp_ms)` for fast seek queries.
  - GIN index on `tags text[]` for instant multi-tag filtering.
  - PostGIS spatial geometry for rugby field heatmaps and coordinates.
- **Video Pipeline:** Detailed in [`ARCHITECTURE.md`](./ARCHITECTURE.md), covering S3 presigned uploads, HLS adaptive streaming, and Sidekiq background jobs running FFmpeg frame-accurate segment extraction and concatenation.

---

## 4. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Launch API backend (port 3001) and React frontend (port 3000) concurrently
npm run dev

# 3. Access in browser
# Frontend: http://localhost:3000
# API Health: http://localhost:3001/api/health

# 4. Verify TypeScript & Production Build
npm run build
```
