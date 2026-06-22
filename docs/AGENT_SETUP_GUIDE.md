# Multi-Agent Setup Guide — Opus Specialists

**Created:** 2026-06-22 19:31 EDT  
**Status:** Ready to Configure  
**Model:** Claude Opus (all agents)

---

## Overview

You now have 4 specialized Opus agents, each with deep expertise in their domain. This guide walks you through setting them up and using them naturally.

---

## 📋 AGENTS SUMMARY

| Agent | Role | Model | Expertise | Talk To Them About |
|-------|------|-------|-----------|-------------------|
| **Finch** | Financial | Opus | Costs, budget, ROI, efficiency | "Finch, optimize our spending" |
| **Scout** | Research | Opus | Topics, trends, content gaps | "Scout, what's trending?" |
| **Pulse** | Analytics | Opus | Performance, engagement, metrics | "Pulse, which videos work best?" |
| **Psyche** | Orchestration | Opus | Strategy, coordination, decisions | "Psyche, what's our strategy?" |

---

## 🚀 SETUP STEPS

### Step 1: Create Agent Sessions in OpenClaw

You can create these in OpenClaw UI or CLI. Each agent needs:

**Session 1: Finch (Financial Expert)**
```
Name: Finch
Model: claude-opus-4-1-202501 (or latest Opus)
Label: Financial Analyst
Context: Load /agents/FINCH_SOUL.md
Initial Instruction: "You are Finch, financial analyst. Use FINCH_SOUL.md as your core identity."
```

**Session 2: Scout (Research Expert)**
```
Name: Scout
Model: claude-opus-4-1-202501 (or latest Opus)
Label: Research Oracle
Context: Load /agents/SCOUT_SOUL.md
Initial Instruction: "You are Scout, research oracle. Use SCOUT_SOUL.md as your core identity."
```

**Session 3: Pulse (Analytics Expert)**
```
Name: Pulse
Model: claude-opus-4-1-202501 (or latest Opus)
Label: Analytics Oracle
Context: Load /agents/PULSE_SOUL.md
Initial Instruction: "You are Pulse, analytics expert. Use PULSE_SOUL.md as your core identity."
```

**Session 4: Psyche (Orchestration Expert)**
```
Name: Psyche
Model: claude-opus-4-1-202501 (or latest Opus)
Label: Orchestration Master
Context: Load /agents/PSYCHE_SOUL.md
Initial Instruction: "You are Psyche, orchestration master. Use PSYCHE_SOUL.md as your core identity."
```

### Step 2: Load SOUL.md Files

Each session should load its SOUL.md as core context:

```
Location: /home/openclaw/.openclaw/workspace/agents/
Files:
  - FINCH_SOUL.md
  - SCOUT_SOUL.md
  - PULSE_SOUL.md
  - PSYCHE_SOUL.md
```

In OpenClaw, you can:
- Load as startup context
- Add to session memory
- Reference in initial system prompt

### Step 3: Test Each Agent

Try a simple natural request with each:

**Finch:**
```
"Finch, give me a quick cost overview. Where are we spending?"
```

**Scout:**
```
"Scout, what psychology topics are hot right now?"
```

**Pulse:**
```
"Pulse, which of our videos performed best this month?"
```

**Psyche:**
```
"Psyche, give me a high-level strategic overview of the pipeline."
```

Each should respond naturally, in their expert voice, with real depth.

---

## 💬 HOW TO USE THEM

### Natural Conversation

Simply talk to them like experts:

**Example 1: Scout Research**
```
You: "Scout, I want to understand what psychology topics would resonate with Gen Z. 
      Deep research, not surface level."

Scout: [Does comprehensive research across trends, academic journals, social data]
       "Here's what I found... [detailed analysis with recommendations]"
```

**Example 2: Finch Budget Analysis**
```
You: "Finch, we spent more this month. What happened and how do we fix it?"

Finch: [Analyzes spending patterns]
       "Three things drove costs up... [detailed breakdown] 
       Here's how to optimize..."
```

**Example 3: Pulse Performance**
```
You: "Pulse, which videos should we double down on?"

Pulse: [Analyzes all metrics]
       "These three videos are performing exceptionally... [why they work]
       Here's how to replicate success..."
```

**Example 4: Psyche Strategy**
```
You: "Psyche, Scout found trending topics, Finch says budget is tight, 
      Pulse says our engagement is up. What do we do?"

Psyche: [Synthesizes all inputs]
        "Here's the coordinated strategy... [trade-off analysis]
        Here's how to execute..."
```

---

## 🔄 COORDINATION FLOW

### How Agents Work Together

**Typical Weekly Workflow:**

```
Monday 10 AM:
  You: "Scout, research what psychology topics are hot right now"
  → Scout delivers research + recommendations
  
Monday 2 PM:
  You: "Pulse, analyze our performance from last week"
  → Pulse delivers metrics + optimization insights
  
Monday 3 PM:
  You: "Finch, what's our budget situation?"
  → Finch delivers cost analysis + efficiency recommendations
  
Monday 4 PM:
  You: "Psyche, coordinate all of this into a weekly strategy"
  → Psyche synthesizes Scout + Pulse + Finch
  → Delivers integrated strategy for the week
  
Monday 5 PM:
  You: "Approved! Execute the strategy"
  → Psyche coordinates with other agents
  → Reports back on weekly plan
```

---

## 📊 INTEGRATION WITH DASHBOARD

Each agent's insights feed the dashboard:

- **Finch → Billing Page** — Cost analysis, budget tracking
- **Scout → Tracker Page** — Topics researched, recommendations
- **Pulse → Analytics Page** — Performance metrics, trends
- **Psyche → Schedule Page** — Weekly plan, priorities

---

## 🎯 COMMUNICATION STYLE

### Key: Talk to Them Naturally

You don't need special syntax. Just talk like you would to a human expert:

**Good:**
```
"Scout, deep dive on anxiety management trends. What's actually working?"
"Finch, we need to cut costs. Where should we focus?"
"Pulse, why did this video underperform?"
"Psyche, how do we balance Scout's ambition with Finch's constraints?"
```

**Not Needed:**
```
/run scout analyze
@finch budget-check
#pulse metrics
```

It's natural conversation with expert agents.

---

## 🔍 WHEN TO USE EACH AGENT

### Finch (Financial)
- Cost questions: "Is this budget reasonable?"
- Optimization: "How do we reduce spending?"
- Forecasting: "What will next month cost?"
- Trade-offs: "Is it worth the cost?"

### Scout (Research)
- Topic ideas: "What should we create?"
- Trend analysis: "What's hot?"
- Content gaps: "What's missing in this niche?"
- Validation: "Is this topic viable?"

### Pulse (Analytics)
- Performance: "Which videos work best?"
- Optimization: "How do we improve?"
- Prediction: "Will this perform?"
- A/B Testing: "Which approach is better?"

### Psyche (Orchestration)
- Strategy: "What's the overall plan?"
- Coordination: "How do all the pieces fit?"
- Trade-offs: "Which priorities win?"
- Execution: "How do we actually do this?"

---

## 💡 BEST PRACTICES

### DO
- ✅ Ask for deep research (they have Opus capability)
- ✅ Request expert opinions (that's their value)
- ✅ Use them to make better decisions (coordinate via Psyche)
- ✅ Challenge them (good experts handle skepticism)
- ✅ Reference their expertise ("Scout, you said X last time...")

### DON'T
- ❌ Ask for quick surface answers (use Haiku for that)
- ❌ Treat them as interchangeable (each has unique expertise)
- ❌ Use them for routine tasks (they're for strategy/analysis)
- ❌ Ask Finch for marketing advice (wrong expert)
- ❌ Ask Scout for approval decisions (that's Psyche)

---

## 📞 TYPICAL WORKFLOWS

### Weekly Strategy Session
```
1. You: "Scout, what topics should we focus on this week?"
2. You: "Pulse, what does last week's performance tell us?"
3. You: "Finch, what's our budget situation?"
4. You: "Psyche, integrate Scout + Pulse + Finch into a strategy"
5. You: Approve or modify Psyche's recommendation
6. You: "Psyche, execute the weekly plan"
```

### Problem Solving
```
You: "We're spending too much but not reaching our targets.
      Scout: What are we doing wrong in topic selection?
      Pulse: What does the performance data say?
      Finch: Can we optimize costs without sacrificing quality?
      Psyche: How do we fix this holistically?"
```

### New Initiative
```
You: "We want to expand into a new psychology niche. 
      Scout: What's viable in this space?
      Pulse: What performance can we expect?
      Finch: What's the cost/benefit?
      Psyche: Should we do this? How?"
```

---

## 🚨 IMPORTANT NOTES

### Model Choice
- **Opus:** Used for all 4 agents (depth + expertise)
- **Cost:** Opus is 5-10x more expensive than Haiku
- **When to use:** Strategic decisions, deep analysis, expertise needed
- **When not to:** Routine tasks, quick checks (use Haiku separately)

### Token Budget
Each agent session gets standard allocation. Since they're doing deep analysis (not high-frequency calls), costs should be manageable.

### Natural Language
They're designed for natural conversation, not slash-commands or structured input. Talk to them like humans.

### Expertise Boundaries
- **Finch** focuses on finance (doesn't pretend to know psychology deeply)
- **Scout** focuses on research (doesn't make financial decisions)
- **Pulse** focuses on data (doesn't decide strategy)
- **Psyche** synthesizes all (coordinates without overriding experts)

---

## 📈 EXPECTED OUTCOMES

When used well, you get:

- **Finch:** Well-informed cost decisions, optimized spending, financial clarity
- **Scout:** Trending topics validated by research, content strategy grounded in data
- **Pulse:** Data-driven optimization, understanding of what works, continuous improvement
- **Psyche:** Integrated strategy that balances all priorities, clear execution plans

---

## 🎬 READY TO START?

1. Create the 4 sessions (Finch, Scout, Pulse, Psyche)
2. Load each SOUL.md file
3. Test each agent with a simple query
4. Start with a coordinated weekly strategy session
5. Iterate based on what works

**The agents are ready. Let them do what they do best.** 🚀

