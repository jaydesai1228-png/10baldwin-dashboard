# 10 Baldwin Dashboard 🏗️

Mobile-first residential construction punch list, burndown, and dependency-tracking dashboard for 10 Baldwin. Built for **Jay (Homeowner)** and **Joe (General Contractor)**.

## Live Deployment
- **Deployment**: Hosted on Vercel
- **Access**: Open / Public direct link for field use on mobile devices and desktop (no login walls or PINs needed).

## Key Features

### 1. Hard Blocker / Unlock Engine
- **Prerequisite Dependencies (`blocked_by`)**: Tasks store an array of blocker task IDs.
- **Visual Locking**: If any blocker is incomplete, the dependent task is strictly locked with a visual padlock badge showing exactly what items are holding it up.
- **Automatic Cascading Unlocks**: Marking blocker tasks "Done" immediately evaluates downstream dependencies and unlocks them to "Ready to Work".
- **Reverse Downstream Insight**: Every task card and drawer shows which future tasks will be unlocked once it is finished.

### 2. Sticky Header Role Switcher
- Fast 1-tap toggle between **Jay** (Homeowner) and **Joe** (GC).
- Auto-tags all on-site field notes, decisions, and comments with the active persona and timestamp.

### 3. Primary Views
- **Ready to Work Today (Default View)**: Automatically filters out any task with unsatisfied blockers. Shows only actionable tasks ready for trades on-site today.
- **Burn Down & Progress**: Real-time progress bars and donut meters tracking overall completion %, progress by Construction Stage / Outcome, by Room, and by Trade.
- **Waiting On / Chasing**: Dedicated bottleneck board categorizing items waiting on Homeowner decisions (Jay), GC mobilization (Joe), Township permit / inspections, or Supplier material deliveries.
- **All Punch Items**: Searchable master list with multi-dimensional filtering by Room, Trade, Outcome, Status, and Blocker state.

### 4. Task Details Drawer & Field Notes
- Status switcher: `ready`, `in_progress`, `pending_external`, `blocked`, `done`.
- Dependency manager: search and link/unlink prerequisite blocker tasks.
- External bottleneck tracker: owner, urgency, description, target resolution date.
- Timestamped field notes thread with author attribution.

### 5. Data Persistence & Portability
- Lightweight API route (`/api/tasks`) with in-memory persistence and client `localStorage` sync for instant zero-database deployments on Vercel.
- JSON Export & Import utility for offline backup snapshots.

## Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
