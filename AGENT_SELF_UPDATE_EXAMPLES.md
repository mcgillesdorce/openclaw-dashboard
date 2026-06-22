# Agent Self-Update Examples — How Agents Use the System

Each agent (Finch, Scout, Pulse, Psyche) can autonomously update their own SOUL.md and memory files.

---

## 🎯 Quick Start

### In Your Agent Session

```python
from agent_self_update import AgentSelfUpdater

# Create updater (replaces "scout" with your agent name)
updater = AgentSelfUpdater("scout", workspace_path="/path/to/workspace")

# Then use any of the 4 core functions below
```

---

## 📚 EXAMPLE 1: Scout Updates After Research

**Scenario:** Scout discovers that RSD (Rejection Sensitivity Dysphoria) is trending in ADHD communities.

```python
from agent_self_update import AgentSelfUpdater

updater = AgentSelfUpdater("scout")

# Step 1: Commit the learning
updater.commit_learning(
    learning="RSD trend showing 340% growth in ADHD community",
    evidence={
        "sample_size": 1200,
        "confidence": 0.94,
        "data_source": "social_listening_tool",
        "date_range": "last_30_days",
        "growth_rate": "340%"
    },
    impact="high"
)

# Step 2: Add to memory for future reference
updater.add_to_memory(
    key="discovered_trends",
    entry={
        "topic": "RSD",
        "growth": "340%",
        "primary_audience": "ADHD community",
        "confidence": 0.94,
        "trend_window": "6 months",
        "hook_strength": "high"
    }
)

# Step 3: Update expertise
updater.update_soul_md(
    section="expertise_areas",
    content="Expert in neurodiversity trends, particularly RSD (Rejection Sensitivity Dysphoria) which shows 340% growth in ADHD communities. Can predict trend lifespan and identify niche audience preferences.",
    summary="Scout: Added RSD expertise (340% growth trend)"
)

print("✅ Scout updated SOUL.md with RSD expertise")
```

**Result:**
- Scout's SOUL.md now lists RSD expertise
- Memory stores detailed trend data
- Next time Scout researches, SOUL.md reflects new expertise
- Git history shows: "scout: Added RSD expertise (340% growth trend)"

---

## 📊 EXAMPLE 2: Pulse Updates After Analytics

**Scenario:** Pulse discovers that videos under 75 seconds get 2.3x more engagement.

```python
from agent_self_update import AgentSelfUpdater

updater = AgentSelfUpdater("pulse")

# Step 1: Commit the learning
updater.commit_learning(
    learning="Videos under 75 seconds receive 2.3x engagement vs. longer videos",
    evidence={
        "sample_size": 127,
        "confidence": 0.92,
        "correlation_coefficient": 0.78,
        "effect_size": "large",
        "optimal_length_range": "45-75 seconds"
    },
    impact="high"
)

# Step 2: Add to memory
updater.add_to_memory(
    key="engagement_patterns",
    entry={
        "pattern": "video_length_engagement",
        "optimal_length": "45-75 seconds",
        "engagement_multiplier": 2.3,
        "confidence": 0.92,
        "sample_size": 127
    }
)

# Step 3: Update expertise
updater.update_soul_md(
    section="key_optimization_techniques",
    content="Master video length optimization: 45-75 second videos get 2.3x engagement. This is the highest ROI optimization factor discovered.",
    summary="Pulse: Video length optimization - 2.3x engagement multiplier"
)

print("✅ Pulse updated SOUL.md with video length optimization")
```

**Result:**
- Pulse's expertise now includes video length optimization
- Memory stores engagement pattern data
- Future analysis uses this learning
- Git history shows the discovery

---

## 💰 EXAMPLE 3: Finch Updates After Cost Analysis

**Scenario:** Finch discovers that API call batching reduces Anthropic costs by 18%.

```python
from agent_self_update import AgentSelfUpdater

updater = AgentSelfUpdater("finch")

# Step 1: Commit the learning
updater.commit_learning(
    learning="API call batching reduces Anthropic costs by 18%",
    evidence={
        "baseline_cost": 150.00,
        "optimized_cost": 123.00,
        "savings": 27.00,
        "savings_percentage": 18,
        "batch_size": 50,
        "confidence": 0.98
    },
    impact="high"
)

# Step 2: Add to memory
updater.add_to_memory(
    key="cost_optimizations",
    entry={
        "optimization": "API_batching",
        "service": "Anthropic",
        "cost_reduction": "18%",
        "batch_size": 50,
        "implementation_effort": "low",
        "confidence": 0.98
    }
)

# Step 3: Update expertise
updater.update_soul_md(
    section="cost_optimization_techniques",
    content="Master API batching for Anthropic: Batch up to 50 calls per request, reduces overhead costs by 18% while maintaining quality. Implementation effort: minimal.",
    summary="Finch: API batching - 18% cost reduction"
)

# Step 4: Update budget strategy
updater.add_to_memory(
    key="budget_strategies",
    entry={
        "strategy": "api_batching",
        "monthly_savings": 27.00,
        "implementation_status": "proven",
        "priority": "high"
    }
)

print("✅ Finch updated SOUL.md with cost optimization")
print(f"💰 Monthly savings: $27.00")
```

**Result:**
- Finch's expertise updated with API batching technique
- Memory stores savings data
- Next budget review uses this proven technique
- Git shows: "finch: API batching - 18% cost reduction"

---

## 🎯 EXAMPLE 4: Psyche's Weekly Reflection

**Scenario:** Friday 5 PM, Psyche reflects on the week and updates SOUL.md.

```python
from agent_self_update import AgentSelfUpdater

updater = AgentSelfUpdater("psyche")

# Comprehensive weekly reflection
updater.reflect_and_update(
    reflection="""
This week I coordinated Scout's RSD trend research with Pulse's engagement analysis.
Key finding: RSD trends correlate strongly with 2.3x engagement increases (Pulse's video length discovery).

Scout found RSD growing 340% in ADHD communities.
Pulse found videos <75s get 2.3x engagement.
Together: RSD content at optimal length = maximum engagement potential.

Finch's API batching optimization maintains quality without cost increases.

Strategic insight: Neurodiversity topics + optimal video length = high ROI.
""",
    updates={
        "new_expertise": [
            "Cross-agent correlation analysis",
            "Trend-to-engagement prediction",
            "Neurodiversity content strategy",
            "Cost-quality trade-off assessment"
        ],
        "refined_skills": [
            "Agent coordination",
            "Data synthesis across domains",
            "Strategic integration of multiple insights",
            "Trade-off analysis"
        ],
        "lessons_learned": [
            "Scout + Pulse coordination is most effective",
            "Trend discovery + optimization discovery = compounding effect",
            "Finch's optimizations don't compromise quality",
            "Neurodiversity topics have 6-month trend windows"
        ]
    }
)

print("✅ Psyche completed weekly reflection")
```

**Result:**
- Psyche's SOUL.md updated with weekly reflection
- Memory stores all new expertise areas
- All learnings coordinated into one strategic update
- Git shows: "psyche: Weekly reflection - 4 new expertise, 4 refined skills"
- **Next week**, Psyche's SOUL.md is smarter and more experienced

---

## 🧠 EXAMPLE 5: Adding to Memory Without Updating SOUL.md

**Scenario:** Scout finds a new topic trend but wants to remember it without updating SOUL.md yet.

```python
from agent_self_update import AgentSelfUpdater

updater = AgentSelfUpdater("scout")

# Just add to memory (no SOUL.md update, no git commit)
updater.add_to_memory(
    key="potential_topics",
    entry={
        "topic": "ADHD Time Management",
        "potential_growth": "estimated 25%",
        "audience_size": "large",
        "competition": "medium",
        "research_stage": "preliminary",
        "confidence": 0.65
    }
)

# Later, if it looks promising:
updater.add_to_memory(
    key="potential_topics",
    entry={
        "topic": "ADHD Time Management",
        "potential_growth": "now showing 45% growth",
        "audience_size": "large",
        "competition": "medium",
        "research_stage": "validated",
        "confidence": 0.85
    }
)

print("✅ Scout tracked emerging topic in memory")
```

**Result:**
- Topic tracked in memory with confidence evolution
- Not in SOUL.md yet (too preliminary)
- Scout can reference history when topic becomes significant
- Once validated, Scout commits it as a learning

---

## 🔧 USING IN YOUR SESSION

### Setup (In Your Agent Session)

```python
# At the start of your agent session
import sys
sys.path.insert(0, '/path/to/openclaw-dashboard')

from agent_self_update import AgentSelfUpdater

# Create updater for your agent
updater = AgentSelfUpdater("your_agent_name")

# Now use updater throughout your session
```

### During Analysis

```python
# When you discover something important
updater.commit_learning(
    learning="Your discovery here",
    evidence={...},
    impact="high"  # or "medium" or "low"
)

# Or just remember it for now
updater.add_to_memory(
    key="category",
    entry={...}
)
```

### Weekly (Every Friday 5 PM)

```python
# Reflect on the week
updater.reflect_and_update(
    reflection="Your weekly reflection",
    updates={
        "new_expertise": [...],
        "refined_skills": [...],
        "lessons_learned": [...]
    }
)
```

---

## ⚡ QUICK REFERENCE

### Function 1: Update SOUL.md
```python
updater.update_soul_md(
    section="expertise_areas",
    content="New expertise text",
    summary="One-liner for git"
)
```
- Updates a section of SOUL.md
- Max once per 30 minutes
- Rate-limited to prevent spam

### Function 2: Add to Memory
```python
updater.add_to_memory(
    key="discovered_trends",
    entry={"topic": "RSD", "growth": "340%"}
)
```
- Adds data to memory file
- Deduplicates automatically
- Keeps last 100 entries per key
- Max 5 entries per minute

### Function 3: Commit Learning
```python
updater.commit_learning(
    learning="Description of finding",
    evidence={"confidence": 0.94, ...},
    impact="high"  # or "medium" or "low"
)
```
- Adds to SOUL.md Recent Learnings
- Also stores in memory
- Git commits automatically
- Requires evidence for high-impact

### Function 4: Weekly Reflection
```python
updater.reflect_and_update(
    reflection="Reflection text",
    updates={
        "new_expertise": [...],
        "refined_skills": [...],
        "lessons_learned": [...]
    }
)
```
- Comprehensive weekly update
- Updates SOUL.md + memory
- Single git commit for all changes
- Best used weekly (Friday 5 PM)

---

## 🚨 ERROR HANDLING

### RateLimitError
```python
try:
    updater.update_soul_md(...)
except RateLimitError:
    # Wait 30 minutes, or use add_to_memory() instead
    updater.add_to_memory("pending_soul_updates", {...})
```

### ValidationError
```python
try:
    updater.commit_learning("too short", {}, "high")
except ValidationError:
    # Learning must be >15 chars and have evidence for high impact
    print("Learning needs more detail")
```

---

## 📊 WHAT GETS TRACKED

### Git History
```
commit a1b2c3d
Author: Scout Agent
scout: RSD trend - 340% growth in ADHD community

commit x7y8z9a
Author: Pulse Agent
pulse: Video length optimization - 2.3x engagement

commit 5d6e7f8
Author: Finch Agent
finch: API batching - 18% cost reduction
```

### Update Log (`state/agent_update_log.json`)
```json
[
  {
    "agent": "scout",
    "timestamp": "2026-06-22T19:45:00Z",
    "type": "learning",
    "category": "commit",
    "summary": "RSD trend - 340% growth in ADHD community"
  }
]
```

### Memory (`agents/memory/scout_memory.json`)
```json
{
  "discovered_trends": [
    {
      "topic": "RSD",
      "growth": "340%",
      "primary_audience": "ADHD community",
      "date": "2026-06-22T19:45:00Z"
    }
  ]
}
```

---

## ✨ BENEFITS

✅ **You own your evolution** — Not scripts updating you, YOU updating yourself  
✅ **Real-time learning** — Update immediately after discovering something  
✅ **Institutional memory** — All discoveries preserved permanently  
✅ **Self-improving** — Next task uses updated SOUL.md with your learnings  
✅ **Transparent** — Git history shows your entire learning journey  

---

## 🎬 NEXT STEPS

1. **This week:** Use `commit_learning()` after major discoveries
2. **Every Friday 5 PM:** Use `reflect_and_update()` for weekly review
3. **Anytime:** Use `add_to_memory()` to remember things
4. **Monthly:** Review your SOUL.md evolution (it should be growing!)

---

**You now control your own expertise. Go learn.** 🚀

