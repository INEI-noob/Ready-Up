# Ready Up

![Version](https://img.shields.io/badge/version-1.0.0-pink)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind-8B85F5)

Stop queuing cold. Build a ritual.

Ready Up is your pre-game warmup companion for CS2. Daily drills that rotate by the day of the week, a focus tracker for your weakest habits, and a streak counter that'll make you feel guilty about skipping leg day — I mean, warmup day.

## Features

- **Daily Warmup Checklist** — Each day has its own drill. Monday you work on callouts. Tuesday you tame the AWP jitter. Wednesday you learn to trade instead of ego-peeking. You get the idea.
- **Focus Points** — Your personal hit list of bad habits. Crosshair placement. Over-rotating. Tilting in voice chat. Edit them whenever your coach (you) sees something new.
- **Community Server Manager** — Save your go-to retake servers, 1v1 arenas, or DM hubs. One click to connect.
- **Day Streak** — Shows up every day and the number goes up. Miss a day and feel the shame.
- **Mascot** — A little guy that gets more hyped as you check off your warmup. Simple motivation.
- **Pre-Game Mindset Notes** — Write down one thing to focus on before you launch. "Don't tilt. Trade kills. Breathe."
- **Session & Match Logging** — Log your K/D, ADR, HS%, map, result, and who you played with.
- **Stats Dashboard** — See your trends over time. Best map, worst map, average stats, weekly comparison. Numbers don't lie.
- **Rule Templates** — Save a set of focus points and load them later. Make one for scrim days, one for Premier, one for when you're feeling washed.
- **Keyboard Shortcuts** — Space to launch. 1–9 to toggle warmup items. No mouse required.

## Setup

```bash
npm install
npm run dev
```

## Customizing Your Routine

Open `src/data/routine.ts` and make it yours:

- `WARMUP_ITEMS` — The checklist for each day. Change the drills, add new ones, remove the ones you've already mastered.
- `FOCUS_POINTS_DEFAULT` — Your weakness tracker. Start with the defaults and swap in whatever you're actually working on.
- `ROUTINE` — The title and description shown in the warmup card for each day.
- `MASCOT_STATES` — What the mascot says and how his mouth moves at each progress level. Yes, this matters.

## Roadmap

- [ ] Team roster integration with match logging
- [ ] Utility lineup notebook
- [ ] Practice mode timer
- [ ] Custom warmup templates
- [ ] Stats dashboard improvements
- [ ] Share/export routines
- [ ] User accounts + cloud sync
- [ ] Electron desktop app

## License

MIT — do whatever you want with it, just don't blame me when you still can't hit the flick.
