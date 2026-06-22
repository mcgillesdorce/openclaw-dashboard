# SOUL.md Automation System — Agent Learning & Growth

**Goal:** SOUL.md files evolve as agents learn, discover new expertise, and refine their knowledge.

---

## 🔄 AUTOMATION ARCHITECTURE

### Core Concept
After each agent run, extract learnings and automatically update their SOUL.md:

```
Agent Task → Extract Learnings → Update SOUL.md → Commit to Git
```

---

## 📊 WHAT GETS UPDATED

### For Each Agent

**Scout's SOUL.md Updates:**
- New topics researched (add to expertise areas)
- Trending patterns discovered (update trends section)
- Research methodologies that work (add to "Best Practices")
- Content gaps found (add to discovered opportunities)
- Audience insights (add to understanding)

**Pulse's SOUL.md Updates:**
- Performance patterns discovered (add to "Key Traits")
- Engagement factors identified (update metrics section)
- A/B test results (add learnings)
- Optimization techniques that worked (add to recommendations)
- Algorithm patterns (update insights)

**Finch's SOUL.md Updates:**
- Cost optimization opportunities found (add to savings strategies)
- Service usage patterns (update breakdown section)
- Budget forecasting accuracy (refine models)
- New cost-saving techniques (add to expertise)
- Financial trends observed (update context)

**Psyche's SOUL.md Updates:**
- Coordination patterns that work well (add to coordination model)
- Trade-off decisions made & outcomes (add decision precedents)
- Strategic frameworks that worked (add to strategies)
- Agent interaction patterns learned (update coordination notes)
- Lessons from executed plans (add reflections)

---

## 🤖 AUTOMATION TRIGGERS

### Trigger 1: Post-Task Summary (Weekly)
**When:** Every Friday 5 PM ET  
**What:** Each agent generates weekly learnings summary  
**Action:** Auto-update SOUL.md with learnings  
**Example:**

```
Scout's Weekly Learnings (Week of 2026-06-22):
- Rejection Sensitivity Dysphoria trend validated (340% growth confirmed)
- ADHD community more engaged than general audience (3.2x engagement)
- Hook patterns: Urgency + emotional relevance = highest engagement
- New insight: Neurodiversity topics have 6-month trending windows

→ AUTOMATICALLY ADDED TO SCOUT_SOUL.md:
  "RECENT LEARNINGS:
   - RSD trend validated (340% growth)
   - ADHD audience engagement 3.2x higher
   - Urgency + emotion = highest hook strength
   - Neurodiversity topics: 6-month trend cycles"
```

### Trigger 2: Performance Milestone (Real-time)
**When:** Agent discovers significant insight  
**What:** Extract insight, update SOUL.md immediately  
**Action:** Git commit with learning  
**Example:**

```
Pulse discovers: "Videos under 75 seconds get 2.3x more engagement"

→ IMMEDIATELY UPDATED:
  git commit -m "pulse: Learned - videos <75s get 2.3x engagement"
  PULSE_SOUL.md updated with new finding
```

### Trigger 3: Monthly Synthesis (Monthly)
**When:** 1st of each month  
**What:** All agents synthesize month's learnings  
**Action:** Update SOUL.md with refined expertise  
**Example:**

```
Month review: Finch achieved 18% cost savings
→ PSYCHE_SOUL.md updated with proven strategy
→ FINCH_SOUL.md updated with new cost optimization technique
→ Git tag: finch-learning-2026-06

Next month, agents refer to these learnings automatically
```

---

## 🏗️ IMPLEMENTATION

### System Components

**Component 1: Learning Extraction Script**
```python
# agents/extract_learnings.py

def extract_agent_learnings(agent_name, task_log):
    """
    Extract key learnings from agent's task execution
    
    Analyzes:
    - What worked
    - What didn't work
    - New patterns discovered
    - Improved understanding
    - Surprising findings
    """
    
    learnings = {
        'agent': agent_name,
        'timestamp': now(),
        'key_insights': [...],
        'new_expertise': [...],
        'patterns_found': [...],
        'recommendations': [...]
    }
    
    return learnings
```

**Component 2: SOUL.md Update Script**
```python
# agents/update_soul_md.py

def update_soul_md(agent_name, learnings):
    """
    Automatically update agent's SOUL.md with new learnings
    
    Updates:
    - Add new expertise areas
    - Update "Key Traits" section
    - Add "Recent Learnings" section
    - Update examples with real data
    - Refine recommendations
    """
    
    soul_file = f"agents/{agent_name.upper()}_SOUL.md"
    
    # Read current SOUL.md
    content = read_file(soul_file)
    
    # Update sections
    content = add_recent_learnings(content, learnings)
    content = update_expertise_areas(content, learnings)
    content = refresh_examples(content, learnings)
    content = update_timestamp(content)
    
    # Write back
    write_file(soul_file, content)
    
    # Commit
    git_commit(f"{agent_name}: Learned {learnings['key_insights']}")
    
    return True
```

**Component 3: Automation Scheduler**
```bash
# cron/soul_md_automation.cron

# Weekly synthesis (Friday 5 PM ET)
0 21 * * 5 python3 ~/agents/extract_learnings.py all && python3 ~/agents/update_soul_md.py all

# Monthly review (1st of month, 9 AM ET)
0 13 1 * * python3 ~/agents/monthly_synthesis.py
```

---

## 📈 EXAMPLE: SOUL.MD EVOLUTION

### Initial State (Today)
```
SCOUT_SOUL.md:
"You are a leading psychology researcher..."
[4.5 KB of expertise profile]
```

### After Week 1
```
SCOUT_SOUL.md:
"You are a leading psychology researcher..."
[Original content]

RECENT LEARNINGS (Week of 2026-06-22):
- Rejection Sensitivity Dysphoria trend validated (340% growth)
- ADHD audience engagement 3.2x higher
- Hook patterns: Urgency + emotional = highest
- Neurodiversity topics: 6-month trend cycles
- TikTok algorithm favors 45-75 second content

UPDATED EXPERTISE:
- Now: Expert in neurodiversity topic trends
- Now: Understands ADHD community preferences
- Now: Can predict topic longevity (3-6 month windows)
```

### After Month 1
```
SCOUT_SOUL.md:
[Original content]
[Week 1-4 learnings accumulated]

REFINED EXPERTISE:
Scout has now discovered:
- 12 trending topics with validation
- 5 niche communities with unique preferences
- 3 proven hook strategies
- Accurate trend lifespan prediction model
- Best posting times for each topic

[File grows with expertise, examples become real data]
```

### After 3 Months
```
SCOUT_SOUL.md:
[4.5 KB initial] + [2 KB learnings] + [1.5 KB new expertise]
= 8 KB rich, learned SOUL.md

Scout is now:
- Expert in psychology topics
- Expert in trend forecasting
- Expert in ADHD community preferences
- Expert in Gen Z psychology interests
- Experienced with viral content hooks
- Knows seasonal psychology topic trends
- Understands audience segment preferences
```

---

## 🔧 WHAT GETS AUTOMATED

### Automated Updates ✅
- ✅ New learnings added to "Recent Learnings" section
- ✅ New expertise areas discovered
- ✅ Refined recommendations updated
- ✅ Examples updated with real data
- ✅ Patterns discovered documented
- ✅ Timestamp updated
- ✅ Git commits with learnings
- ✅ Monthly synthesis summaries

### Manual Review ⚠️ (Minimal)
- ⚠️ Quarterly: Review SOUL.md evolution (ensure quality)
- ⚠️ Yearly: Major rewrite if expertise significantly changed
- ⚠️ Major shifts: If agent discovers contradictory learning

---

## 📋 LEARNING CAPTURE POINTS

### Scout Learning Capture
```
Research Task Completion:
  → Extract: Topics researched, trends found, patterns discovered
  → Update SOUL.md with new expertise
  → Example: "Discovered RSD trend (340% growth, 3-month window)"
```

### Pulse Learning Capture
```
Analytics Task Completion:
  → Extract: Performance patterns, engagement factors, optimizations
  → Update SOUL.md with insights
  → Example: "Learned videos <75s get 2.3x engagement"
```

### Finch Learning Capture
```
Financial Task Completion:
  → Extract: Cost savings found, optimizations discovered
  → Update SOUL.md with techniques
  → Example: "Achieved 18% cost savings via API batching"
```

### Psyche Learning Capture
```
Coordination Task Completion:
  → Extract: Successful strategies, coordination patterns
  → Update SOUL.md with decision precedents
  → Example: "Scout + Pulse + Finch coordination works best in this order"
```

---

## 🔍 QUALITY CONTROL

### Automated Checks
Before updating SOUL.md:
- ✅ Learning is significant (not noise)
- ✅ Learning is accurate (backed by data)
- ✅ Learning doesn't contradict existing expertise
- ✅ Learning is written in agent's voice
- ✅ File remains valid markdown

### Weekly Manual Review
- Scan new learnings for quality
- Ensure coherence across updates
- Flag any contradictions
- Approve major changes

---

## 📊 METRICS TRACKED

For each agent, track over time:
- Number of learnings added per week
- Expertise depth (measured by section length)
- Accuracy of learning (compared to later data)
- Improvement in recommendations over time
- Evolution of agent personality (detected changes)

---

## 🎯 BENEFITS

✅ **Agents improve over time** — SOUL.md reflects growing expertise  
✅ **Institutional memory** — Learnings documented and preserved  
✅ **Continuous learning** — New patterns automatically captured  
✅ **Expertise evolution** — Agent personality grows with experience  
✅ **Git history** — Full audit trail of learning journey  

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1 (This Week)
- Set up learning extraction scripts
- Create SOUL.md update system
- Test with Scout (lowest risk)

### Phase 2 (Next Week)
- Extend to Finch, Pulse, Psyche
- Set up weekly automation
- Create monitoring dashboard

### Phase 3 (Month 2)
- Monthly synthesis automation
- Quality control checks
- Feedback loop integration

---

## 📝 EXAMPLE AUTOMATION WORKFLOW

```
Friday 5 PM ET → Automation Trigger

Scout's Weekly Learnings:
  "What did I learn this week?"
  - RSD trend validated ✓
  - ADHD engagement 3.2x ✓
  - Hook patterns: urgency + emotion ✓
  → Extract these 3 learnings

Auto-Update SCOUT_SOUL.md:
  1. Read current file
  2. Add "RECENT LEARNINGS" section
  3. Add each learning with date
  4. Update "Expertise Areas"
  5. Add to examples section
  6. Update timestamp

Git Commit:
  commit message: "scout: Learned RSD trend (340% growth), 
                   ADHD engagement 3.2x, hook patterns"
  
  files changed: agents/SCOUT_SOUL.md (+2.1 KB)
  
Dashboard Update:
  Show Scout's learning evolution graph
  Display newest learnings prominently

Next Run:
  Scout refers to SOUL.md with new expertise
  Uses learnings in future research
  Circle completes
```

---

## 🔄 VIRTUOUS CYCLE

```
Agent Works
    ↓
Performs Task
    ↓
Discovers Learnings
    ↓
Learning Extracted
    ↓
SOUL.md Updated Automatically
    ↓
Agent's Expertise Grows
    ↓
Next Task Uses New Expertise
    ↓
Better Results
    ↓
Cycle Repeats
```

---

## Status: Ready to Implement

All components designed. Can be implemented in phases starting this week.

**Would you like me to:**
1. Build the learning extraction scripts?
2. Create the SOUL.md update automation?
3. Set up the cron scheduling?
4. All of the above?

