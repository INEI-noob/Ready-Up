# Ready Up — CS2 Pre-Game Ritual

A cute, interactive pre-game checklist for CS2: today's practice focus, a
mascot that reacts as you lock in your Golden Rules, a day streak, and a
one-click launch into Steam — all running as a real local desktop app.

Stack: Vite + React + TypeScript + Tailwind CSS + shadcn/ui + lucide-react +
Framer Motion, wrapped in Electron.

## Setup

```bash
npm install
```

## Run it while developing

Starts the Vite dev server and opens it inside an Electron window, with
hot reload:

```bash
npm run electron:dev
```

If you just want to preview the UI in a regular browser tab (no Electron,
Steam launch falls back to a plain link):

```bash
npm run dev
```

## Build a real desktop app

This produces an installer/executable in `release/` — an `.exe` on Windows,
`.dmg` on macOS, `.AppImage` on Linux — that you can pin to your taskbar or
desktop and double-click like any other app:

```bash
npm run electron:build
```

## Customizing your routine

Edit `src/data/routine.ts` — `ROUTINE` for the day-by-day focus text, `RULES`
for your Golden Rules, `MASCOT_STATES` for the mascot's captions/mouth shapes
at each checked-rule count.

To point the launch button at a different game, change the
`steam://rungameid/730` string in `electron/main.cjs` (the `steam:launch`
handler) — 730 is CS2's Steam AppID.

## How state persists

Your streak and session log are stored locally via `electron-store`, which
writes a small JSON file to your OS's standard app-data folder — no network
calls, nothing leaves your machine.

## Adding more shadcn components

`components.json` is already configured, so if you want more shadcn/ui
pieces later (a dialog, a tooltip, etc.):

```bash
npx shadcn@latest add dialog
```
