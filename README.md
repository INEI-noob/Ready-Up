# Ready Up — CS2 Pre-Game Ritual

A web app for CS2 players to lock in their warmup routine, track focus areas, and build consistency before every session.

## Features

- **Daily Warmup Checklist** — Rotates by day of week. Monday is Communication Priming, Tuesday is Anti-Tension & Reset, and so on.
- **Focus Points** — Editable list of player-specific weaknesses you want to work on. Add, remove, or reorder anytime.
- **Community Server Manager** — Save your go-to servers for quick connect.
- **Day Streak** — Tracks how many days in a row you've shown up.
- **Mascot** — Reacts as you check off your warmup items.
- **Pre-Game Mindset Notes** — Jot down your mental focus before launching.
- **Session & Match Logging** — Log K/D, ADR, HS%, map, result, and teammates.
- **Stats Dashboard** — Overview, session history, team record, personal record, map performance, and weekly comparisons.
- **Rule Templates** — Save and load sets of focus points.
- **Keyboard Shortcuts** — Space to launch, 1–9 to toggle warmup items.

## Setup

npm install
npm run dev

## Customizing Your Routine

Edit src/data/routine.ts:

- WARMUP_ITEMS — The checklist items for each day of the week.
- FOCUS_POINTS_DEFAULT — Your personal weakness tracker (editable in-app).
- ROUTINE — Day-by-day title and description shown in the warmup card.
- MASCOT_STATES — Mascot captions and mouth shapes at each checked count.

## Roadmap

- [ ] Team roster integration with match logging
- [ ] Utility lineup notebook
- [ ] Practice mode timer
- [ ] Custom warmup templates
- [ ] Stats dashboard improvements
- [ ] Share/export routines
- [ ] User accounts + cloud sync
- [ ] Electron desktop app
