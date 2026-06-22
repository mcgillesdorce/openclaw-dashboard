# Agent Operational Requirements — Schedule + On-Demand

**Updated:** 2026-06-22 19:20 EDT  
**By:** Gilly  
**Critical:** YES — Agents must ALWAYS maintain schedule AND accept ad-hoc requests

---

## 📅 SCHEDULED RUNS (MANDATORY)

All agents execute their assigned times **without fail**:

### Daily Schedule (Eastern Time)

| Time | Agent | Task | Mode |
|------|-------|------|------|
| **08:00 AM ET** | 💰 **Finch** | Morning cost analysis | 🤖 Automatic |
| **10:00 AM ET** | 📖 **Scout** | Topic research & trends | 🤖 Automatic |
| **12:00 PM ET** | 🎬 **Psyche** | Pipeline review & approval | 🤖 Automatic |
| **14:00 PM ET** | 📊 **Pulse** | Analytics & insights | 🤖 Automatic |
| **16:00 PM ET** | 💰 **Finch** | Evening cost analysis | 🤖 Automatic |
| **18:00 PM ET** | 📖 **Scout** | Content discovery | 🤖 Automatic |
| **20:00 PM ET** | ⚙️ **Psyche** | Evening state sync | 🤖 Automatic |

**Requirements:**
- ✅ Must run at exact time (within 1 minute)
- ✅ Must complete without errors
- ✅ Must report status via Telegram
- ✅ Must update dashboard after run
- ✅ Must sync costs to GitHub

**How to trigger:** Cron jobs / scheduled tasks (already configured)

---

## 🔴 ON-DEMAND RUNS (AD-HOC)

You can request any agent to run **at any time**, regardless of schedule.

### Request Format

```
/run <agent> <task>
```

**Examples:**
- `/run finch check-budget` → Finch runs cost check immediately
- `/run scout topic "Dream Logic"` → Scout researches "Dream Logic" topic now
- `/run psyche approve` → Psyche runs approvals review immediately
- `/run pulse metrics` → Pulse analyzes metrics now

### Agent Availability

All agents accept ad-hoc requests during:
- ✅ Scheduled run times (can request again immediately)
- ✅ Between scheduled runs (any hour)
- ✅ During other agent runs (parallel execution)
- ✅ Late night/early morning (outside 8 AM-8 PM window)

### Execution Priority

1. **Running task** → Finishes current task first
2. **Ad-hoc request** → Queued immediately after
3. **Next scheduled run** → Executes on time regardless

**Example Timeline:**
```
12:00 PM → Psyche scheduled run starts
12:05 PM → You request: /run finch check-budget
          Finch starts immediately (parallel)
12:20 PM → Both complete
12:30 PM → Psyche scheduled run finishes
14:00 PM → Pulse scheduled run (on time, no delays)
```

---

## ⚙️ OPERATIONAL RULES

### Rule 1: Schedule Inviolable
**The schedule ALWAYS executes. No exceptions.**
- Agent will pause ad-hoc if scheduled time arrives
- Agent resumes ad-hoc after scheduled run
- Never skip a scheduled time

### Rule 2: Queue Management
**Ad-hoc requests queue if agent is busy.**
```
12:00 PM → Psyche runs (scheduled)
12:02 PM → /run finch cost (queued, Finch available)
12:03 PM → /run scout research (queued, waits for Finch)
12:15 PM → Scout executes after Finch finishes
```

### Rule 3: Dashboard Sync
**Every run (scheduled or ad-hoc) must:**
- ✅ Log to Telegram
- ✅ Update billing data
- ✅ Sync to GitHub
- ✅ Refresh dashboard

### Rule 4: Cost Tracking
**All runs count toward daily/monthly budget.**
- Scheduled runs: Pre-planned costs
- Ad-hoc runs: Immediate cost deduction
- Finch alerts if over budget

### Rule 5: Error Handling
**If a scheduled run fails:**
- Alerts sent immediately
- You can request retry anytime
- Next scheduled run still executes on time
- No auto-retry (manual control only)

---

## 📊 AGENT STATES

### Finch (Financial)
| State | Status | Can Accept Ad-hoc? |
|-------|--------|-------------------|
| Idle | Between runs | ✅ Yes |
| Running Scheduled | 08:00 AM or 16:00 PM | ⚠️ Queues request |
| Running Ad-hoc | User requested | ⚠️ Queues next request |
| Alerting Budget | Cost limit near | ✅ Can still run |

### Scout (Research)
| State | Status | Can Accept Ad-hoc? |
|-------|--------|-------------------|
| Idle | Between runs | ✅ Yes |
| Running Scheduled | 10:00 AM or 18:00 PM | ⚠️ Queues request |
| Running Ad-hoc | User requested | ⚠️ Queues next request |
| Analyzing Topics | Processing | ✅ Yes (parallel) |

### Pulse (Analytics)
| State | Status | Can Accept Ad-hoc? |
|-------|--------|-------------------|
| Idle | Between runs | ✅ Yes |
| Running Scheduled | 14:00 PM | ⚠️ Queues request |
| Running Ad-hoc | User requested | ⚠️ Queues next request |
| Computing Metrics | Crunching data | ✅ Yes (parallel) |

### Psyche (Orchestration)
| State | Status | Can Accept Ad-hoc? |
|-------|--------|-------------------|
| Idle | Between runs | ✅ Yes |
| Running Scheduled | 12:00 PM or 20:00 PM | ⚠️ Queues request |
| Running Ad-hoc | User requested | ⚠️ Queues next request |
| Coordinating | Managing other agents | ✅ Yes (can delegate) |

---

## 🎯 WHEN TO REQUEST AD-HOC RUNS

### Good Reasons (Request Immediately)
- ✅ Budget alert from Finch (verify spending)
- ✅ Unusual engagement spike (check Pulse analytics)
- ✅ Urgent content idea (have Scout research)
- ✅ Critical approval needed (Psyche review)
- ✅ Need cost/efficiency report (Finch analysis)
- ✅ Unexpected issue discovered

### Bad Reasons (Can Wait for Schedule)
- ❌ "Let me check if Scout is working" → Wait 10 AM or 6 PM
- ❌ "Want to see random metrics" → Wait 2 PM for Pulse
- ❌ "Curious about costs" → Wait 8 AM or 4 PM for Finch
- ❌ "Just testing" → Use dashboard instead

---

## 📈 DASHBOARD TRACKING

The **Schedule page** (`/schedule`) shows:
- ✅ Past runs (✅ Completed)
- ✅ Next run (⏭️ Upcoming)
- ✅ Remaining tasks (today)
- ✅ Up Next highlighted card
- ✅ Live Eastern Time clock

The **Agents page** (`/agents`) shows:
- ✅ Agent status (Idle / Working / Pending)
- ✅ Current task
- ✅ Pending approvals count
- ✅ Last activity

---

## 🚨 FAILURE SCENARIOS

### Scenario 1: Agent Doesn't Run on Time
**What happens:**
1. Alert sent to Telegram (timeout)
2. Dashboard shows agent "missing"
3. You can manually retry: `/run <agent> <task>`
4. Next scheduled run still executes

**Example:**
```
12:00 PM → Psyche scheduled run should start
12:05 PM → Alert: "Psyche didn't start"
12:06 PM → You send: /run psyche retry
12:10 PM → Psyche runs immediately
14:00 PM → Pulse scheduled run (on time)
```

### Scenario 2: Ad-hoc Runs Too Close to Schedule
**What happens:**
1. Ad-hoc starts immediately
2. If schedule time arrives, ad-hoc pauses
3. Schedule runs (priority)
4. Ad-hoc resumes after
5. Both complete successfully

**Example:**
```
15:55 PM → /run scout urgent-research
15:56 PM → Scout starts research
16:00 PM → Finch scheduled time arrives
          Scout pauses mid-research
16:00 PM → Finch runs (scheduled priority)
16:10 PM → Finch completes
16:10 PM → Scout resumes research
16:25 PM → Scout completes
```

### Scenario 3: Budget Exceeded
**What happens:**
1. Finch alerts immediately
2. All agents can still run (manual override)
3. Costs still deduct (auto-track)
4. You must approve spending or pause pipeline

**Example:**
```
13:30 PM → Finch: "ALERT: Budget 95% used ($9.50/$10)"
13:31 PM → Pulse scheduled at 14:00 PM still queued
13:45 PM → You approve: /approve extra-spending 1.00
13:45 PM → Budget increases to $11.00
14:00 PM → Pulse runs normally
```

---

## 📞 CONTACT & COMMANDS

### Telegram Commands (All Agents)
```
/run <agent> <task>              # Request ad-hoc run
/schedule                         # Show today's schedule
/status                          # Current agent statuses
/approve <cost>                  # Approve extra budget
/pause <agent>                   # Pause agent (until next schedule)
/resume <agent>                  # Resume agent
/logs <agent>                    # View agent logs
```

### Dashboard URLs
- Schedule: https://openclaw-dashboard-black.vercel.app/schedule
- Agents: https://openclaw-dashboard-black.vercel.app/agents
- Billing: https://openclaw-dashboard-black.vercel.app/billing
- Analytics: https://openclaw-dashboard-black.vercel.app/analytics
- Approvals: https://openclaw-dashboard-black.vercel.app/approvals

---

## ✅ CONFIRMATION

**As of 2026-06-22 19:20 EDT:**

- [x] All 4 agents assigned to schedule
- [x] Schedule verified for Eastern Time
- [x] All agents can accept on-demand requests
- [x] Dashboard displays schedule + agent status
- [x] Conflict resolution defined
- [x] Cost tracking confirmed
- [x] Error handling documented
- [x] Telegram commands available

**Status:** 🟢 **READY FOR OPERATIONS**

Agents are live, scheduled, and ready to accept your requests anytime.

