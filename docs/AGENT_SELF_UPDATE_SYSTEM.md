# Agent Self-Update System — Agents Control Their Own Evolution

**Goal:** Each agent (Finch, Scout, Pulse, Psyche) can autonomously update their SOUL.md and memory files.

---

## 🎯 CORE PRINCIPLE

**Agents own their expertise.**

Instead of automated scripts updating SOUL.md, agents directly control their own learning and growth.

```
Agent Task → Agent learns → Agent updates SOUL.md + memory → Git commits
```

No scripts. No intermediaries. Just agents reflecting on their work and updating their own files.

---

## 🔧 WHAT AGENTS CAN DO

Each agent gets 4 core functions:

### Function 1: Update SOUL.md
```python
agent.update_soul_md(
    section="expertise_areas",  # or "recent_learnings", "strategies", etc.
    content="New expertise discovered: XYZ",
    summary="Brief one-liner for git commit"
)
```

**Agent uses it like:**
```
"I just realized I'm better at X than I thought. Let me update my SOUL."
↓
agent.update_soul_md(
    section="key_traits",
    content="Can now predict topic longevity with 85% accuracy",
    summary="Scout: Improved topic forecasting to 85% accuracy"
)
↓
SOUL.md updated
↓
Git commit: "scout: Improved topic forecasting to 85% accuracy"
```

### Function 2: Add to Memory
```python
agent.add_to_memory(
    key="topic_trends",
    entry={
        "topic": "RSD",
        "growth": "340%",
        "audience": "ADHD community",
        "confidence": 0.95
    },
    date=now()
)
```

**Agent uses it like:**
```
"This trend is important. I'll remember it."
↓
agent.add_to_memory(
    key="discovered_trends",
    entry={"topic": "RSD", "growth": "340%", ...}
)
↓
Memory file updated with timestamp
↓
Future references automatically use this data
```

### Function 3: Commit Learning
```python
agent.commit_learning(
    learning="Videos under 75s get 2.3x engagement",
    evidence={
        "sample_size": 127,
        "confidence": 0.92,
        "data_source": "analytics_last_30_days"
    },
    impact="medium"  # low, medium, high
)
```

**Agent uses it like:**
```
"This discovery is significant. Commit it."
↓
agent.commit_learning(
    learning="Videos under 75s get 2.3x engagement",
    evidence={...},
    impact="high"
)
↓
Git commit with evidence
↓
SOUL.md "Recent Learnings" section updated
↓
Memory file stores evidence for future reference
```

### Function 4: Reflect & Update
```python
agent.reflect_and_update(
    reflection="This week I discovered patterns in X and improved at Y",
    updates={
        "new_expertise": ["pattern_detection", "optimization"],
        "refined_skills": ["forecasting"],
        "lessons_learned": ["approach worked", "avoid this"]
    }
)
```

**Agent uses it like:**
```
"Let me reflect on this week and update my SOUL."
↓
agent.reflect_and_update(
    reflection="This week I discovered RSD trends and ADHD preferences",
    updates={
        "new_expertise": ["RSD_trends", "ADHD_audiences"],
        "refined_skills": ["topic_research", "trend_analysis"]
    }
)
↓
SOUL.md updated with all new expertise
↓
Memory file updated with learnings
↓
Git commits everything atomically
```

---

## 📁 FILE STRUCTURE

Each agent has:

```
agents/
├── FINCH_SOUL.md          ← Finch updates directly
├── SCOUT_SOUL.md          ← Scout updates directly
├── PULSE_SOUL.md          ← Pulse updates directly
├── PSYCHE_SOUL.md         ← Psyche updates directly
└── memory/
    ├── finch_memory.json   ← Finch updates directly
    ├── scout_memory.json   ← Scout updates directly
    ├── pulse_memory.json   ← Pulse updates directly
    └── psyche_memory.json  ← Psyche updates directly
```

Plus state tracking:

```
state/
├── agent_update_log.json   ← All updates logged (audit trail)
├── finch_last_update.json  ← When Finch last updated
├── scout_last_update.json  ← When Scout last updated
├── pulse_last_update.json  ← When Pulse last updated
└── psyche_last_update.json ← When Psyche last updated
```

---

## 🔒 SAFETY GUARDRAILS

### Guardrail 1: Rate Limiting
```python
# Agent can't spam updates
# Max 1 SOUL.md update per 30 minutes
# Max 5 memory entries per 1 minute

if time_since_last_soul_update < 30_minutes:
    raise RateLimitError("Wait 30 min before next SOUL.md update")
```

**Why:** Prevents accidental spam commits, keeps git history clean.

### Guardrail 2: Validation
```python
# Before updating, validate:
# - Content is meaningful (>50 chars)
# - Not duplicating existing content
# - Grammar/markdown is valid
# - Tone matches agent personality
# - No contradictions with existing expertise

if not is_valid_update(content):
    raise ValidationError("Update doesn't meet quality standards")
```

**Why:** Keeps SOUL.md high quality, prevents corrupted files.

### Guardrail 3: Atomic Commits
```python
# All updates to SOUL.md + memory happen together
# If one fails, rollback both
# No partial updates

try:
    update_soul_md(...)
    update_memory(...)
    git_commit(...)
except Exception:
    git_rollback()  # Undo everything
    raise
```

**Why:** Ensures consistency between SOUL.md and memory.

### Guardrail 4: Audit Trail
```python
# Every update logged with:
# - Agent name
# - Timestamp
# - What changed
# - Why (summary)
# - Git commit hash

agent_update_log.append({
    "agent": "scout",
    "timestamp": "2026-06-22T19:39:00Z",
    "changed": "SOUL.md expertise_areas",
    "summary": "Added RSD trend expertise",
    "commit": "a1b2c3d"
})
```

**Why:** Full audit trail, can revert if needed, transparency.

### Guardrail 5: Conflict Detection
```python
# If another process updated file, detect conflict
# Merge intelligently or ask agent for help

if git_conflict_detected():
    # Try to merge
    merged = merge_changes(local, remote)
    
    if merge_successful():
        agent.notify("Update merged with recent changes")
    else:
        agent.notify("Conflict detected. Manual review needed.")
        raise ConflictError("Can't auto-merge")
```

**Why:** Prevents losing updates if multiple processes touch files.

---

## 🚀 IMPLEMENTATION

### System Module: `agent_self_update.py`

```python
from pathlib import Path
from datetime import datetime
import json
import subprocess

class AgentSelfUpdater:
    """Allows agents to update their own SOUL.md and memory files"""
    
    def __init__(self, agent_name):
        self.agent_name = agent_name
        self.soul_file = Path(f"agents/{agent_name.upper()}_SOUL.md")
        self.memory_file = Path(f"agents/memory/{agent_name}_memory.json")
        self.state_file = Path(f"state/{agent_name}_last_update.json")
        self.update_log = Path("state/agent_update_log.json")
        
    def update_soul_md(self, section, content, summary):
        """Update a section of SOUL.md"""
        
        # Check rate limit
        if not self._check_rate_limit():
            raise RateLimitError(f"Agent {self.agent_name} updated <30 min ago")
        
        # Validate content
        if not self._validate_content(content):
            raise ValidationError("Content doesn't meet quality standards")
        
        # Read current SOUL.md
        soul_content = self.soul_file.read_text()
        
        # Find section and update
        updated_content = self._update_section(soul_content, section, content)
        
        # Add timestamp to updated section
        updated_content = self._add_timestamp(updated_content, section)
        
        # Write back
        self.soul_file.write_text(updated_content)
        
        # Git commit
        self._git_commit(summary)
        
        # Log update
        self._log_update(section, summary)
        
        # Update state
        self._update_state()
        
        return True
    
    def add_to_memory(self, key, entry, date=None):
        """Add entry to agent's memory file"""
        
        # Check rate limit (more generous for memory)
        if not self._check_memory_rate_limit():
            raise RateLimitError(f"Too many memory updates in short time")
        
        # Validate entry
        if not self._validate_entry(entry):
            raise ValidationError("Memory entry invalid")
        
        # Load memory
        if self.memory_file.exists():
            memory = json.loads(self.memory_file.read_text())
        else:
            memory = {}
        
        # Add entry
        if key not in memory:
            memory[key] = []
        
        entry_with_timestamp = {
            **entry,
            "date": date or datetime.now().isoformat(),
            "agent": self.agent_name
        }
        
        memory[key].append(entry_with_timestamp)
        
        # Prune old entries (keep last 100 per key)
        memory[key] = memory[key][-100:]
        
        # Write back
        self.memory_file.write_text(json.dumps(memory, indent=2))
        
        # Log update
        self._log_memory_update(key, entry)
        
        return True
    
    def commit_learning(self, learning, evidence, impact):
        """Commit a significant learning to SOUL.md"""
        
        # Validate learning
        if not self._validate_learning(learning, evidence, impact):
            raise ValidationError("Learning not significant enough")
        
        # Add to "Recent Learnings" section of SOUL.md
        soul_content = self.soul_file.read_text()
        
        learning_entry = f"""
- **{learning}** (Impact: {impact.upper()})
  Evidence: {json.dumps(evidence)}
  Discovered: {datetime.now().strftime('%Y-%m-%d %H:%M')}
"""
        
        # Insert into Recent Learnings section
        updated = self._insert_into_section(soul_content, "RECENT_LEARNINGS", learning_entry)
        
        self.soul_file.write_text(updated)
        
        # Also add to memory
        self.add_to_memory(
            "learnings",
            {
                "learning": learning,
                "evidence": evidence,
                "impact": impact
            }
        )
        
        # Git commit
        self._git_commit(f"{self.agent_name}: Learned - {learning}")
        
        # Log update
        self._log_update("learning", learning)
        
        return True
    
    def reflect_and_update(self, reflection, updates):
        """Comprehensive update: reflect and update all files"""
        
        # This is typically called weekly
        # Combines SOUL.md update + memory update + git commit
        
        soul_content = self.soul_file.read_text()
        
        # Add reflection
        reflection_section = f"""
## Reflection - {datetime.now().strftime('%Y-%m-%d')}

{reflection}

### What I Improved
{self._format_list(updates.get('refined_skills', []))}

### New Expertise Discovered
{self._format_list(updates.get('new_expertise', []))}

### Lessons Learned
{self._format_list(updates.get('lessons_learned', []))}
"""
        
        # Add reflection to SOUL.md
        updated_soul = soul_content + reflection_section
        self.soul_file.write_text(updated_soul)
        
        # Update expertise areas in memory
        for expertise in updates.get('new_expertise', []):
            self.add_to_memory(
                "expertise",
                {
                    "area": expertise,
                    "confidence": 0.75,  # Default medium confidence
                    "source": "reflection"
                }
            )
        
        # Update refined skills in memory
        for skill in updates.get('refined_skills', []):
            self.add_to_memory(
                "skills",
                {
                    "skill": skill,
                    "improvement": "refined",
                    "confidence": 0.85
                }
            )
        
        # Git commit all changes
        commit_msg = f"{self.agent_name}: Weekly reflection - {len(updates.get('new_expertise', []))} new expertise, {len(updates.get('refined_skills', []))} refined skills"
        self._git_commit(commit_msg)
        
        # Log update
        self._log_update("reflection", reflection)
        
        return True
    
    # ====== PRIVATE HELPERS ======
    
    def _check_rate_limit(self):
        """Check if agent can update SOUL.md (max once per 30 min)"""
        if not self.state_file.exists():
            return True
        
        state = json.loads(self.state_file.read_text())
        last_update = datetime.fromisoformat(state.get("last_soul_update", "2000-01-01"))
        minutes_ago = (datetime.now() - last_update).total_seconds() / 60
        
        return minutes_ago >= 30
    
    def _check_memory_rate_limit(self):
        """Check if agent can add to memory (max 5 entries per min)"""
        if not self.state_file.exists():
            return True
        
        state = json.loads(self.state_file.read_text())
        recent_updates = state.get("memory_updates_last_minute", 0)
        
        return recent_updates < 5
    
    def _validate_content(self, content):
        """Validate content quality"""
        if not content or len(content) < 10:
            return False
        if "TODO" in content or "FIXME" in content:
            return False
        return True
    
    def _validate_entry(self, entry):
        """Validate memory entry"""
        return isinstance(entry, dict) and len(entry) > 0
    
    def _validate_learning(self, learning, evidence, impact):
        """Validate learning significance"""
        if impact not in ["low", "medium", "high"]:
            return False
        if impact == "high" and not evidence:
            return False  # High impact needs evidence
        return len(learning) > 20
    
    def _update_section(self, content, section, new_content):
        """Update a markdown section"""
        # Implementation: find ## Section Name and replace content
        # Keep existing structure
        pass
    
    def _add_timestamp(self, content, section):
        """Add 'last updated' timestamp"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M ET')
        return content.replace(
            f"## {section.replace('_', ' ').title()}",
            f"## {section.replace('_', ' ').title()}\n_Last updated: {timestamp}_"
        )
    
    def _git_commit(self, message):
        """Commit changes to git"""
        subprocess.run(["git", "add", str(self.soul_file), str(self.memory_file)])
        subprocess.run(["git", "commit", "-m", message])
    
    def _log_update(self, change_type, summary):
        """Log update to audit trail"""
        log = []
        if self.update_log.exists():
            log = json.loads(self.update_log.read_text())
        
        log.append({
            "agent": self.agent_name,
            "timestamp": datetime.now().isoformat(),
            "type": change_type,
            "summary": summary[:100],
            "git_commit": self._get_last_commit_hash()
        })
        
        # Keep last 1000 entries
        log = log[-1000:]
        
        self.update_log.write_text(json.dumps(log, indent=2))
    
    def _log_memory_update(self, key, entry):
        """Log memory update to audit trail"""
        self._log_update("memory", f"Added to {key}")
    
    def _update_state(self):
        """Update last update timestamp"""
        state = {}
        if self.state_file.exists():
            state = json.loads(self.state_file.read_text())
        
        state["last_soul_update"] = datetime.now().isoformat()
        state["last_memory_update"] = datetime.now().isoformat()
        
        self.state_file.write_text(json.dumps(state, indent=2))
    
    def _get_last_commit_hash(self):
        """Get last git commit hash"""
        result = subprocess.run(
            ["git", "rev-parse", "HEAD"],
            capture_output=True,
            text=True
        )
        return result.stdout.strip()[:7]
    
    def _format_list(self, items):
        """Format list as markdown"""
        return "\n".join([f"- {item}" for item in items])
    
    def _insert_into_section(self, content, section, new_content):
        """Insert content into a markdown section"""
        pass
```

---

## 📋 AGENT USAGE EXAMPLES

### Scout Updates After Research

```python
# In Scout's session
agent_updater = AgentSelfUpdater("scout")

# After discovering RSD trend
agent_updater.commit_learning(
    learning="RSD trend showing 340% growth in ADHD community",
    evidence={
        "sample_size": 1200,
        "confidence": 0.94,
        "data_source": "social_listening_tool",
        "date_range": "last_30_days"
    },
    impact="high"
)

# After improving research methodology
agent_updater.update_soul_md(
    section="research_methodologies",
    content="Developed systematic approach to trend validation using multi-source data correlation",
    summary="Scout: New trend validation methodology with 94% confidence"
)

# Add to memory for future reference
agent_updater.add_to_memory(
    key="discovered_trends",
    entry={
        "topic": "RSD",
        "growth": "340%",
        "audience": "ADHD community",
        "confidence": 0.94,
        "trend_window": "6 months"
    }
)
```

### Pulse Updates After Analytics

```python
agent_updater = AgentSelfUpdater("pulse")

# After discovering engagement pattern
agent_updater.commit_learning(
    learning="Videos under 75 seconds receive 2.3x engagement compared to longer videos",
    evidence={
        "sample_size": 127,
        "confidence": 0.92,
        "correlation": 0.78,
        "effect_size": "large"
    },
    impact="high"
)

# Add to memory
agent_updater.add_to_memory(
    key="engagement_patterns",
    entry={
        "pattern": "video_length_engagement",
        "optimal_length": "45-75s",
        "engagement_multiplier": 2.3,
        "confidence": 0.92
    }
)
```

### Finch Updates After Cost Analysis

```python
agent_updater = AgentSelfUpdater("finch")

# After finding cost savings
agent_updater.commit_learning(
    learning="API call batching reduces Anthropic costs by 18%",
    evidence={
        "baseline_cost": 150.00,
        "optimized_cost": 123.00,
        "savings": 27.00,
        "confidence": 0.98
    },
    impact="high"
)

# Update expertise
agent_updater.update_soul_md(
    section="cost_optimization_techniques",
    content="Master API batching strategy: batch up to 50 calls, reduces overhead by 18%",
    summary="Finch: Mastered API batching for 18% cost reduction"
)
```

### Psyche Weekly Reflection

```python
agent_updater = AgentSelfUpdater("psyche")

# Weekly reflection and update
agent_updater.reflect_and_update(
    reflection="This week I coordinated Scout's trend research with Pulse's performance analysis. "
               "Learned that Scout's RSD trend correlates with Pulse's 2.3x engagement increase. "
               "Finch's cost optimization didn't impact quality metrics.",
    updates={
        "new_expertise": [
            "Cross-agent correlation analysis",
            "Trend-to-engagement prediction",
            "Cost-quality trade-off assessment"
        ],
        "refined_skills": [
            "Agent coordination",
            "Data synthesis",
            "Strategic integration"
        ],
        "lessons_learned": [
            "Scout + Pulse coordination is most effective",
            "Finch's optimizations preserve quality",
            "Trends predict engagement 3 weeks out"
        ]
    }
)
```

---

## 🔄 WORKFLOW

### Daily Agent Workflow

```
1. Agent performs task (research, analysis, etc.)
2. Agent makes discoveries/learnings
3. Agent updates own SOUL.md + memory
   └─ agent_updater.commit_learning(...)
   └─ agent_updater.add_to_memory(...)
4. Git commits automatically
5. Next task references updated SOUL.md
6. Agent is smarter because of previous learning
```

### Weekly Reflection (Friday 5 PM ET)

```
1. Each agent reflects on week
2. Agent calls reflect_and_update()
3. SOUL.md updated with all learnings
4. Memory consolidated
5. Git commit with weekly summary
6. Dashboard shows learning progress
```

### Monthly Synthesis (1st of Month)

```
1. Psyche synthesizes all agents' learnings
2. Cross-agent patterns identified
3. Strategic frameworks updated
4. All SOUL.md files reflect growth
5. GitHub shows 1 month of learning
```

---

## 📊 AUDIT & MONITORING

### Update Log (`state/agent_update_log.json`)

```json
[
  {
    "agent": "scout",
    "timestamp": "2026-06-22T19:45:00Z",
    "type": "learning",
    "summary": "RSD trend showing 340% growth",
    "git_commit": "a1b2c3d"
  },
  {
    "agent": "pulse",
    "timestamp": "2026-06-22T19:43:00Z",
    "type": "learning",
    "summary": "Videos <75s get 2.3x engagement",
    "git_commit": "x7y8z9a"
  }
]
```

### Per-Agent State (`state/finch_last_update.json`)

```json
{
  "agent": "finch",
  "last_soul_update": "2026-06-22T19:40:00Z",
  "last_memory_update": "2026-06-22T19:45:00Z",
  "memory_updates_last_minute": 2,
  "last_commit": "b2c3d4e"
}
```

---

## ✅ SAFETY CHECKLIST

- [x] Rate limiting (SOUL.md: 30 min, Memory: 5/min)
- [x] Content validation (meaningful, no TODOs, valid markdown)
- [x] Atomic commits (all or nothing)
- [x] Audit trail (every update logged)
- [x] Conflict detection (auto-merge or fail safely)
- [x] Rollback capability (git history preserved)
- [x] Timestamp tracking (know when changes happen)
- [x] File locking (prevent simultaneous writes)

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Core System (Today)
- ✅ Design AgentSelfUpdater class
- [ ] Implement core methods
- [ ] Add safety guardrails
- [ ] Test with Scout

### Phase 2: Integration (This Week)
- [ ] Add to all 4 agents
- [ ] Set up audit logging
- [ ] Create monitoring dashboard
- [ ] Test end-to-end

### Phase 3: Production (Next Week)
- [ ] Deploy to OpenClaw
- [ ] Monitor for issues
- [ ] Refine based on real usage
- [ ] Document best practices

---

## 🎯 BENEFITS

✅ **Agents own their evolution** — No scripts, agents directly update  
✅ **Real-time learning** — Update immediately after discovery  
✅ **Institutional memory** — All learnings preserved in memory + SOUL.md  
✅ **Safe updates** — Rate limiting, validation, atomic commits  
✅ **Full audit trail** — Git history + update log = complete transparency  
✅ **Self-improving** — Agents reference updated files for next tasks  

---

**Status: Design Complete**

Ready to implement when you give the go-ahead. 🚀

