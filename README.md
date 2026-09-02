# Ready Up — Pre-Game Ritual Launcher

A cute, pastel-themed web app that helps gamers build consistent pre-game routines, track performance, and stay focused. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

![Ready Up](https://img.shields.io/badge/Ready%20Up-v1.0.0-pink?style=for-the-badge&logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

---

## What is Ready Up?

Ready Up is a **pre-game ritual launcher** designed to help competitive gamers:

- **Build consistency** — Check off your Golden Rules before every match
- **Track streaks** — Maintain daily practice streaks to build habits
- **Review performance** — Log sessions and matches to spot trends
- **Stay organized** — Calendar with practice schedule, scrims, and matches
- **Warm up properly** — Built-in practice timer with customizable phases

Think of it as your personal **gaming coach** that lives in your browser.

---

## Features

### Core Ritual Flow
- **Golden Rules Checklist** — 4 customizable rules to check off before launching
- **Mascot Companion** — Animated character that reacts to your progress
- **Streak Tracker** — Daily streak counter with confetti on launch
- **Pre-Game Mindset** — Optional note to set your mental state

### Stats & Analytics
- **Session Logging** — Track K/D, ADR, HS% after each session
- **Match History** — Log matches with map, opponent, result, and score
- **Map Win Rates** — See which maps you perform best on
- **Day-of-Week Analysis** — Find your strongest days
- **Sparkline Trends** — Visual graphs of your performance over time

### Organization
- **Calendar** — Monthly view with practice, scrim, and match events
- **Quick-Add Events** — Create matches directly from calendar clicks
- **Team Roster** — Manage your team members
- **Rule Templates** — Save and load different rule sets

### Tools
- **Practice Timer** — 4-phase warm-up timer (Aim, Utility, Clutch, Rest)
- **Launch Profiles** — Save different rule presets for different scenarios
- **Community Servers** — Save server IPs for quick connect
- **Sound Customization** — Choose your notification sound

### Progression
- **Achievements** — 18 unlockable milestones
- **Match Streaks** — Track W/L streaks for all, team, and personal
- **Team Heatmap** — Win rates by map, player, and opponent

### Quality of Life
- **Dark Mode** — Easy on the eyes for late-night sessions
- **Responsive Design** — Works on desktop and mobile
- **Keyboard Shortcuts** — Spacebar to launch, 1-4 to toggle rules
- **Data Export/Import** — Backup your data as JSON
- **Mini Dashboard** — Compact view for quick glances

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ 
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/INEI-noob/Ready-Up.git
cd Ready-Up

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

---

## How It Works

### 1. The Ritual Flow

Each day, when you open Ready Up:

1. **Check Today's Focus** — See your daily theme (Team Practice, Mechanics, etc.)
2. **Complete Golden Rules** — Tap each rule to lock it in
3. **Watch the Mascot** — It gets more excited as you complete rules
4. **Launch the Game** — Click "READY UP → LAUNCH CS2" when all rules are checked

```
┌─────────────────────────────────────────────┐
│  Monday · Jan 5                             │
│                                             │
│  Today's Focus: TEAM PRACTICE               │
│  Focus on clear comms and coordinated plays │
│                                             │
│  GOLDEN RULES                    [2/4]      │
│  ┌─────────────────────────────────────┐    │
│  │ ✓ Clear Comms                       │    │
│  │ ✓ Smart Positioning                 │    │
│  │   Utility Usage                     │    │
│  │   Stay Calm                         │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [READY UP → LAUNCH CS2]                    │
└─────────────────────────────────────────────┘
```

### 2. Three-Column Layout

The app uses a 3-column layout on desktop:

| Left Column | Center Column | Right Column |
|-------------|---------------|--------------|
| Launcher | Main Ritual | Tabs |
| Community Servers | Rules & Stats | Schedule, Stats, Tools, Progress |

### 3. Stats Tracking

After each session or match, log your performance:

- **K/D Ratio** — Kills divided by deaths
- **ADR** — Average damage per round
- **HS%** — Headshot percentage
- **Map** — Which map you played
- **Result** — Win, Loss, or Draw

The app tracks trends over time and shows you patterns like:
- "Your best day is Saturday"
- "You win 65% on Mirage"
- "Your K/D has improved 12% this week"

### 4. Calendar System

The calendar shows your practice schedule:

- **Prac** (Pink) — Team practice sessions
- **Warmup** (Blue) — Individual warmup
- **Scrim** (Lavender) — Scrimmage matches
- **Official** (Peach) — League matches
- **Teambuilding** (Mint) — Team activities

Click any day to quick-add a match result.

### 5. Community Servers

Save your favorite servers for quick connect:

1. Click "+ New" to add a server
2. Enter name, IP, and port
3. Click "Join" to connect (opens Steam)

This works while the game is running — Steam will switch you to the server.

---

## Customization

### Changing the Rules

Edit `src/data/routine.ts` to customize:

```typescript
export const RULES: Rule[] = [
  { key: "comms", title: "Clear Comms", desc: "Keep communication concise." },
  { key: "positioning", title: "Smart Positioning", desc: "Don't repeat angles." },
  { key: "utility", title: "Utility Usage", desc: "Use utility every round." },
  { key: "mindset", title: "Stay Calm", desc: "Reset between rounds." },
];
```

### Changing the Daily Focus

```typescript
export const ROUTINE: Record<string, DayFocus> = {
  Monday: { title: "TEAM PRACTICE", desc: "..." },
  Tuesday: { title: "MECHANICS", desc: "..." },
  // ... etc
};
```

### Adding Events

Edit the JSON files in `src/data/events/`:

```json
[
  { "date": "2026-01-10", "title": "League Match", "type": "Official", "time": "20:00", "priority": "High" }
]
```

Event types: `Prac`, `Warmup`, `Scrim`, `Official`, `Teambuilding`

Priority: `High` (shows in upcoming) or `Normal`

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Toggle rule / Launch when all checked |
| `1` | Toggle Rule 1 |
| `2` | Toggle Rule 2 |
| `3` | Toggle Rule 3 |
| `4` | Toggle Rule 4 |

---

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Radix UI** — Accessible components
- **Lucide React** — Icons
- **Vite** — Build tool

---

## Project Structure

```
cs2-readyup-web/
├── src/
│   ├── components/
│   │   ├── ui/           # Radix-based UI primitives
│   │   ├── Achievements.tsx
│   │   ├── AddMatch.tsx
│   │   ├── AddSession.tsx
│   │   ├── Calendar.tsx
│   │   ├── CommunityServers.tsx
│   │   ├── LaunchProfiles.tsx
│   │   ├── Mascot.tsx
│   │   ├── MatchStreak.tsx
│   │   ├── PracticeTimer.tsx
│   │   ├── RuleTemplates.tsx
│   │   ├── SoundCustomization.tsx
│   │   ├── Stats.tsx
│   │   ├── TeamHeatmap.tsx
│   │   └── ... (more components)
│   ├── data/
│   │   ├── events/       # Calendar event data
│   │   └── routine.ts    # Rules and daily focus
│   ├── hooks/
│   │   └── useReadyUpState.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Data Storage

All data is stored in your browser's `localStorage`. No server required.

- State key: `readyup-state`
- Format: JSON
- Persistence: Automatic on every change

To backup your data:
1. Open the Stats tab
2. Click "Export"
3. Save the JSON file

To restore:
1. Click "Import"
2. Select your backup file

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

MIT License — use this for any project, commercial or personal.

---

## Acknowledgments

- Built with love for the competitive gaming community
- Inspired by the need for consistent practice routines
- Mascot designed to be your hype companion

---

**Ready Up** — Build better habits, one ritual at a time.
