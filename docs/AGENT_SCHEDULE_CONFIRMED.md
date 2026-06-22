# Agent Schedule — CONFIRMED & OPERATIONAL ✅

**Date:** 2026-06-22 19:20 EDT  
**Status:** 🟢 LIVE & READY  
**Verified By:** Opus + Psyche

---

## 📅 CONFIRMED AGENT SCHEDULE

### Mandatory Daily Runs (Eastern Time — America/New_York timezone)

```
08:00 AM ET  → 💰 Finch     (Morning cost analysis)
10:00 AM ET  → 📖 Scout     (Topic research & trends)
12:00 PM ET  → 🎬 Psyche    (Pipeline review & approval)
14:00 PM ET  → 📊 Pulse     (Analytics & insights)
16:00 PM ET  → 💰 Finch     (Evening cost analysis)
18:00 PM ET  → 📖 Scout     (Content discovery)
20:00 PM ET  → ⚙️ Psyche    (Evening state sync)
```

**Distribution:**
- **Finch:** 2 runs/day (08:00 AM, 16:00 PM)
- **Scout:** 2 runs/day (10:00 AM, 18:00 PM)
- **Psyche:** 2 runs/day (12:00 PM, 20:00 PM)
- **Pulse:** 1 run/day (14:00 PM)
- **Total:** 7 runs/day, 12-hour window (8 AM–8 PM)

---

## ⚡ ON-DEMAND CAPABILITY

**All agents can be requested to run at ANY time:**

```
/run finch check-budget              → Finch analyzes spending now
/run scout research "Topic Name"     → Scout researches topic now
/run psyche approve-content          → Psyche approves content now
/run pulse get-metrics               → Pulse gets analytics now
```

**Behavior:**
- ✅ Executes immediately if agent idle
- ✅ Queues if agent busy (scheduled or previous ad-hoc)
- ✅ Does NOT delay scheduled runs
- ✅ Resumes next scheduled task after ad-hoc completes

---

## 🎯 OPERATIONAL RULES (CRITICAL)

### Rule 1: Schedule is Sacred
```
✅ MUST execute at exact times
✅ MUST NOT be skipped
✅ MUST NOT be delayed
✅ If ad-hoc running, schedule takes priority
```

### Rule 2: Ad-hoc is Secondary
```
✅ Can request anytime
✅ Executes after or between scheduled tasks
✅ Can be interrupted by next scheduled run
✅ Resumes after schedule completes
```

### Rule 3: Queue Management
```
When multiple requests pending:
1. Current scheduled run (if any)  → Highest priority
2. Next scheduled run (if pending) → Wait in line
3. Ad-hoc requests                 → Queue order
```

**Example:**
```
14:00 PM → Pulse scheduled run starts
14:02 PM → You request: /run finch budget-check (queued)
14:05 PM → Pulse still running, Finch waiting
14:15 PM → Pulse completes
14:15 PM → Finch starts (ad-hoc, from queue)
14:30 PM → Finch completes
16:00 PM → Psyche scheduled run (on time, no delays)
```

### Rule 4: Cost Tracking
```
✅ All runs update billing data
✅ All runs sync to GitHub
✅ All runs log to Telegram
✅ All runs refresh dashboard
✅ Finch alerts if near budget limit
```

### Rule 5: Error Handling
```
If scheduled run fails:
  → Alert sent immediately
  → You can request /run <agent> retry
  → Next scheduled time still executes
  → No auto-retry (manual control only)
```

---

## 📊 DASHBOARD INTEGRATION

### Schedule Page
- **URL:** https://openclaw-dashboard-black.vercel.app/schedule
- **Shows:** 
  - ✅ All 7 daily runs in timeline
  - ✅ Past/Next/Future status (real-time)
  - ✅ Current time in ET with live clock
  - ✅ Completed vs Remaining tasks
  - ✅ Next run highlighted

### Agents Page
- **URL:** https://openclaw-dashboard-black.vercel.app/agents
- **Shows:**
  - ✅ Agent status (Idle / Working / Pending)
  - ✅ Current task
  - ✅ Pending approvals count
  - ✅ Last activity timestamp
  - ✅ Spooky avatar with status indicator

### Billing Page
- **URL:** https://openclaw-dashboard-black.vercel.app/billing
- **Tracks:**
  - ✅ Cost per run (scheduled + ad-hoc)
  - ✅ Monthly budget status
  - ✅ Service breakdown
  - ✅ Daily trend
  - ✅ Finch alerts

### Analytics Page
- **URL:** https://openclaw-dashboard-black.vercel.app/analytics
- **Shows:**
  - ✅ Engagement metrics (updated after runs)
  - ✅ Cost efficiency (per run)
  - ✅ Video performance ROI
  - ✅ Cost vs performance trend

---

## 🔔 NOTIFICATION CHANNELS

### Telegram Bots (All Active)
```
@Gilly_pipeline_bot      → Psyche messages (pipeline status)
@Financial_psychology_bot → Finch alerts (budget, costs)
@Scout_psychology_bot    → Scout reports (topics, research)
@Pulse_psychology_bot    → Pulse reports (analytics, metrics)
```

**Notifications sent after every run (scheduled or ad-hoc):**
- Run start/completion status
- Cost incurred
- Key metrics/findings
- Action items or alerts
- Budget status

---

## ✅ VERIFICATION CHECKLIST

### Schedule Verification
- [x] All 7 runs confirmed in STATIC_SCHEDULE
- [x] Times are in Eastern Time (America/New_York)
- [x] getRunStatus() uses getCurrentTimeET()
- [x] Dashboard displays accurate past/next/future
- [x] Schedule page updates every 10 seconds
- [x] Live ET clock integrated

### Operational Verification
- [x] Agents can accept on-demand requests
- [x] Ad-hoc runs don't delay scheduled tasks
- [x] Queue management implemented
- [x] Cost tracking confirmed
- [x] Error alerts functional
- [x] All dashboard pages updated

### Integration Verification
- [x] Billing data synced
- [x] Analytics updated post-run
- [x] Agent status reflected in real-time
- [x] Telegram notifications active
- [x] GitHub data branch current
- [x] Vercel deployment current

---

## 🚀 OPERATIONAL READINESS

**As of 2026-06-22 19:20 EDT, the system is:**

### ✅ READY FOR PRODUCTION

```
Agents:
  💰 Finch  → Ready (2 scheduled + ad-hoc)
  📖 Scout  → Ready (2 scheduled + ad-hoc)
  📊 Pulse  → Ready (1 scheduled + ad-hoc)
  🎬 Psyche → Ready (2 scheduled + ad-hoc)

Dashboard:
  ✅ Schedule page (live ET, real-time status)
  ✅ Agents page (live status)
  ✅ Billing page (real-time cost tracking)
  ✅ Analytics page (performance metrics)
  ✅ Approvals page (governance UI)

Notifications:
  ✅ Telegram alerts configured
  ✅ Cost alerts enabled
  ✅ Budget limits enforced
  ✅ Error notifications active

Backup & Recovery:
  ✅ GitHub sync active
  ✅ Dashboard data persisted
  ✅ Fallback data configured
  ✅ Error recovery documented
```

---

## 📝 HOW TO USE

### Request a Scheduled Run (Automatic)
```
No action needed. Agents run automatically at scheduled times.
Dashboard shows status in real-time.
```

### Request an Ad-hoc Run (Manual)
```
Send to Telegram:
  /run finch check-budget
  /run scout topic "Habit Formation"
  /run psyche approve
  /run pulse metrics

Agent responds with:
  ✅ Run accepted
  🔄 Running...
  ✅ Run completed
  📊 Results
```

### Check Schedule
```
Dashboard: /schedule page (always live)
Telegram: /schedule command
Text: Check list above
```

### Monitor Costs
```
Dashboard: /billing page (auto-updates)
Telegram: Finch sends alerts
Alert: Budget > 70% = warning
Alert: Budget > 90% = critical
```

---

## 🎓 QUICK REFERENCE

| Need | Action | When |
|------|--------|------|
| Check schedule | Visit `/schedule` page | Anytime |
| Check agent status | Visit `/agents` page | Anytime |
| See costs | Visit `/billing` page | Anytime |
| Request urgent run | `/run <agent> <task>` | Anytime |
| Approve extra budget | `/approve <amount>` | When Finch alerts |
| View analytics | `/analytics` page | After runs |
| Make approvals | `/approvals` page | After Psyche reviews |

---

## ✨ SUMMARY

**Agents work on two timelines:**

1. **Scheduled:** 7 automatic runs/day (8 AM–8 PM ET)
2. **On-demand:** Any request, anytime, queued if busy

**Schedule ALWAYS wins. Ad-hoc adapts.**

Both types update billing, dashboard, and notify via Telegram.

**System is fully autonomous, real-time, and production-ready.** 🚀

