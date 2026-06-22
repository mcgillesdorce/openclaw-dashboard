# 🎨 Psyche Dashboard Revamp — Modernized Black Theme

**Version:** 2.0  
**Last Updated:** 2026-06-22  
**Status:** ✅ LIVE on Vercel

---

## What's New

### 1. **Sleek Black Theme**
- Modern dark mode with professional black background (`#0a0e27`)
- Cyan accent color (`#00d9ff`) with purple, blue, amber, and green supporting colors
- Glassmorphism effects, subtle gradients, smooth transitions
- Typography: Clean sans-serif with monospace for data

### 2. **Live Data Architecture**
- **Auto-refresh every 30 seconds** across all pages
- Pulls data from GitHub data branch (`mcgillesdorce/openclaw-dashboard/data`)
- Fetches: `dashboard_data.json`, `billing_data.json`, `credits_data.json`, `schedule_data.json`
- Zero build step — pure HTML/CSS/JS deployed directly

### 3. **Static Daily Schedule Sidebar** (Key Feature)
- **Location:** Schedule page `/schedule/`
- **Content:** Fixed daily bot schedule (set once, doesn't change auto)
- **Format:**
  ```js
  const STATIC_SCHEDULE = [
    { time: '08:00', ampm: 'AM', agent: 'Finch', icon: '💰', task: 'Morning cost analysis' },
    { time: '10:00', ampm: 'AM', agent: 'Scout', icon: '📖', task: 'Topic research & trends' },
    { time: '12:00', ampm: 'PM', agent: 'Psyche', icon: '🎬', task: 'Pipeline review & approval' },
    // ... etc
  ]
  ```
- **How to Update:** Edit `STATIC_SCHEDULE` array in `/schedule/index.html` — no data fetch needed
- **Sidebar Features:**
  - Sticky position on desktop (remains visible while scrolling)
  - Shows time, agent, task, emoji icon
  - Hover effects for interactivity
  - Responsive collapses on mobile
  - Quick legend for task types (💰 Financial, 📖 Research, etc.)

---

## Pages Overview

### 📊 Overview (`/`)
**Live Dashboard with Real-Time Metrics**
- **KPI Cards:** Cost per approval, approval rate, videos today, monthly spend
- **Gauges:** Budget used %, credit health %
- **Charts:** Daily spend trend (14-day history), top videos by views, topic leaderboard
- **Timeline:** Recent activity with status icons, timestamps, costs
- **Refresh:** Every 30 seconds

### 📅 Schedule (`/schedule/`)
**Daily Activities + Static Bot Schedule**
- **Left Sidebar:** Static daily schedule (sticky, doesn't auto-update)
- **Main Section:** Today's live activity events (auto-refreshes)
- **Daily Totals:** Tasks completed, cost, error count
- **Event Details:** Time, agent, task, duration, cost
- **Legend:** Quick reference for task icons

### 📈 Analytics (`/analytics/`)
**Performance & Engagement Metrics**
- **KPIs:** Total views, average rating, engagement rate, retention average
- **Charts:** Views over time (bar), engagement by topic (doughnut)
- **Table:** Video performance breakdown with detailed metrics
- **Auto-refresh:** Every 30 seconds

### 🤖 Agents (`/agents/`)
**Agent Status & Performance**
- **Agent Cards:** Status (live/idle), last run, tasks today, success rate, cost
- **Cards for:** Psyche, Finch, Scout, Pulse
- **Activity Log:** Recent tasks from schedule_data.json
- **Metrics:** Per-agent cost, task count, success percentage

### 💳 Billing (`/billing/`)
**Budget Tracking & Credit Management**
- **KPIs:** Monthly budget, current spend, remaining balance
- **Budget Gauge:** Visual % used indicator
- **Service Breakdown:** Anthropic, fal.ai, ElevenLabs, Telegram credit status
- **Cost Chart:** Doughnut chart by service
- **Recent Charges:** Table of transactions (date, service, type, amount, agent)
- **Smart Alerts:** Warnings when budget > 70%, > 90%, or exceeded
- **Color-coded:** Green (healthy), amber (caution), red (alert)

### 📍 Tracker (`/tracker/`)
**Content Library & Video Management**
- **Quick Stats:** Total generated, approved, pending, rejected
- **Filters:** By status, topic, agent
- **Content Table:** Video ID, topic, status, agent, created date, views, cost
- **Sorting:** Most recent first
- **Status Icons:** ✅ approved, ⏳ pending, ❌ rejected

---

## Data Sources

### GitHub Data Branch
**Repo:** `mcgillesdorce/openclaw-dashboard`  
**Branch:** `data`

Files synced from pipeline:
- **`dashboard_data.json`** — Videos, metrics, approval rate
- **`billing_data.json`** — Monthly spend, charges, service breakdown
- **`credits_data.json`** — API credit balances (Anthropic, fal.ai, ElevenLabs)
- **`schedule_data.json`** — Daily task events, timings, costs

### Auto-Sync
- **Who:** `sync_dashboard.py` in pipeline repo
- **When:** After each pipeline run (full or scheduled)
- **How:** Pushes JSON files → GitHub API → data branch

---

## Customization

### Updating Static Schedule
Edit `/schedule/index.html`, find `STATIC_SCHEDULE` array:

```js
const STATIC_SCHEDULE = [
  { time: '08:00', ampm: 'AM', agent: 'Finch', icon: '💰', task: 'Morning cost analysis' },
  // Add/modify entries here
  { time: '20:00', ampm: 'PM', agent: 'Psyche', icon: '⚙️', task: 'Evening sync' }
];
```

Then git commit & push:
```bash
git add schedule/index.html
git commit -m "Update: static schedule times"
git push origin main
```

Vercel auto-deploys on push. Changes live within 60 seconds.

### Color Theme
Global colors in `shared.css`:
```css
:root {
  --bg: #0a0e27;                    /* Main background */
  --panel: #131829;                 /* Panel/card background */
  --cyan: #00d9ff;                  /* Primary accent */
  --text-primary: #e8eaed;          /* Main text */
  --text-muted: #6f7684;            /* Dim text */
  /* ... more colors ... */
}
```

To customize: Edit `:root` block in `shared.css` and commit.

### Chart Colors
Each page has inline chart colors:
- **Overview:** Cyan/blue line chart
- **Analytics:** Cyan bars, doughnut with rainbow
- **Billing:** Rainbow doughnut

Edit in respective `<script>` sections.

---

## Deployment

### Vercel Setup
- **Repo:** https://github.com/mcgillesdorce/openclaw-dashboard (public)
- **Branch:** `main` (auto-deploys on push)
- **Build:** None (static files)
- **Domain:** `openclaw-dashboard-black.vercel.app`

### How It Works
1. You edit a `.html` or `.css` file locally
2. `git add`, `git commit`, `git push origin main`
3. Vercel webhook triggers auto-deployment
4. New version live in ~60 seconds

### Manual Deployment
```bash
cd ~/.openclaw/workspace/openclaw-dashboard
git status
git add <files>
git commit -m "Your message"
git push origin main
```

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (responsive design)

---

## Performance

- **Load Time:** < 2 seconds (no build, static files)
- **Data Refresh:** Every 30 seconds via fetch
- **Chart Re-render:** Destroys old, creates new Chart.js instance
- **Memory:** ~5MB per page
- **Mobile:** Optimized grid layout, stacked on small screens

---

## Known Limitations

- Data fetch fails silently if GitHub is unreachable (shows "Loading..." or previous data)
- Static schedule sidebar doesn't adjust for DST (update manually if timezones change)
- Mobile: Sidebar collapses to single column view
- Max 10 recent events shown in timelines (optimize dashboard_data.json for larger datasets)

---

## Future Enhancements

- [ ] Admin panel to edit static schedule via dashboard UI (no git needed)
- [ ] Dark/light theme toggle
- [ ] Webhook updates (faster than 30-second polling)
- [ ] Export to CSV/PDF (reports)
- [ ] Comparison views (week-over-week, month-over-month)
- [ ] Custom date range filters
- [ ] Real-time WebSocket updates
- [ ] Agent recommendation alerts

---

## Troubleshooting

### Dashboard Shows Old Data
- **Cause:** Cache, or data branch not synced
- **Fix:** Hard refresh browser (Ctrl+Shift+R), check GitHub data branch has latest JSON

### Static Schedule Doesn't Update
- **Cause:** Browser cache
- **Fix:** Edit `/schedule/index.html`, commit, push, wait 60s, hard refresh

### Charts Don't Render
- **Cause:** Missing Chart.js library or bad data
- **Fix:** Check browser console (F12) for errors, verify `dashboard_data.json` format

### Mobile Layout Broken
- **Cause:** Viewport meta tag or CSS media queries
- **Fix:** Check viewport meta in `<head>`, test in DevTools device mode

---

## Contact & Support

For dashboard issues:
1. Check browser console (F12) for errors
2. Verify GitHub data branch has latest files
3. Hard refresh (Ctrl+Shift+R)
4. Check Vercel deployment status: https://vercel.com/mcgillesdorce

---

**Dashboard maintained by Psyche** 🧠  
Built for the psychology video pipeline.
