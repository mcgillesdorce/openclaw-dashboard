# Phase 1: Core Learning Automation System

**Goal:** Build & test the foundation for agent learning automation.

**Timeline:** This session  
**Scope:** Learning extraction, SOUL.md updates, Scout testing  
**Effort:** ~2 hours

---

## 🎯 PHASE 1 DELIVERABLES

### 1. Learning Extraction Module
```python
# agents/extract_learnings.py
def extract_agent_learnings(agent_name, session_transcript):
    """
    Parse agent's session transcript and extract learnings.
    
    Returns:
    {
        "learnings": ["learning 1", "learning 2"],
        "evidence": {learning: evidence_dict},
        "expertise_areas": ["area1", "area2"],
        "patterns_discovered": ["pattern1"],
        "impact_levels": {learning: "high|medium|low"}
    }
    """
```

**Input:** Agent session transcript (from OpenClaw session history)  
**Output:** Structured learnings JSON  
**Method:** NLP + pattern matching to extract discoveries

---

### 2. Learning Validation System
```python
# agents/validate_learnings.py
def validate_learning(learning, evidence, impact):
    """
    Ensure learning meets quality standards:
    - Meaningful (not noise/trivial)
    - Accurate (backed by evidence)
    - Not contradicting existing expertise
    - Written in agent's voice
    - Properly formatted
    """
    checks = [
        is_significant(learning),
        has_sufficient_evidence(evidence, impact),
        not_contradictory(learning),
        is_well_written(learning),
        is_in_agent_voice(learning)
    ]
    return all(checks)
```

**Quality Thresholds:**
- `high` impact: Requires confidence ≥ 0.90, sample size ≥ 50
- `medium` impact: Requires confidence ≥ 0.75, sample size ≥ 20
- `low` impact: Requires confidence ≥ 0.60

---

### 3. Automated SOUL.md Updates
```python
# agents/apply_learnings_to_soul.py
def apply_learnings(agent_name, learnings):
    """
    Take validated learnings and apply to SOUL.md:
    1. Add to "Recent Learnings" section
    2. Update "Expertise Areas" section
    3. Update examples with real data
    4. Add timestamp
    5. Commit to git
    """
```

**What Gets Updated:**
- Scout's SOUL.md: expertise_areas, recent_learnings, examples
- Pulse's SOUL.md: optimization_techniques, recent_learnings, examples
- Finch's SOUL.md: cost_optimization_techniques, recent_learnings, strategies
- Psyche's SOUL.md: coordination_frameworks, recent_learnings, lessons

---

### 4. Scout Testing Pipeline
```python
# tests/test_scout_learning_automation.py

def test_scout_discovery():
    """
    1. Scout runs analysis task (simulated)
    2. Extract learnings from transcript
    3. Validate extracted learnings
    4. Apply to SCOUT_SOUL.md
    5. Verify SOUL.md updated correctly
    6. Verify git commit created
    7. Verify memory file updated
    8. Verify audit log recorded
    """
```

**Test Scenarios:**
- ✓ Scout discovers new trend (high impact)
- ✓ Scout finds minor insight (low impact)
- ✓ Scout validates existing hypothesis (medium impact)
- ✓ Scout contradicts previous learning (conflict detection)
- ✓ Scout updates with insufficient evidence (validation failure)

---

### 5. Automation Scheduler (Phase 1 Manual)
```bash
#!/bin/bash
# agents/run_learning_automation.sh

# Scout learning extraction (daily after Scout completes)
python3 agents/extract_learnings.py scout
python3 agents/validate_learnings.py scout
python3 agents/apply_learnings_to_soul.py scout

# Log results
echo "Scout learning automation completed at $(date)" >> agents/learning_automation.log
```

**Phase 1 Approach:** Manual trigger after agent completes  
**Phase 2 Approach:** Automated via cron

---

## 📂 FILES TO CREATE (PHASE 1)

```
agents/
├── extract_learnings.py         (NEW - 800 lines)
├── validate_learnings.py        (NEW - 500 lines)
├── apply_learnings_to_soul.py   (NEW - 600 lines)
├── learning_config.yaml         (NEW - Agent thresholds)
└── learning_automation.log      (NEW - Execution log)

tests/
└── test_scout_learning.py       (NEW - Test suite)

docs/
├── LEARNING_EXTRACTION_GUIDE.md (NEW - How it works)
└── PHASE_2_PLAN.md             (NEW - What's next)
```

---

## 🔧 IMPLEMENTATION DETAILS

### Learning Extraction Logic

```python
# Pseudo-code
def extract_learnings(transcript):
    patterns = {
        "discovery": r"I discovered|found|identified|realized",
        "pattern": r"pattern|trend|tendency|consistent",
        "optimization": r"optimization|improvement|save|reduce",
        "confidence": r"confidence|certain|sure|validated"
    }
    
    learnings = []
    for sentence in transcript:
        if any_pattern_matches(sentence, patterns):
            learning = extract_learning_object(sentence)
            evidence = extract_evidence(sentence)
            impact = assess_impact(learning, evidence)
            learnings.append({
                "learning": learning,
                "evidence": evidence,
                "impact": impact,
                "source": "session_transcript"
            })
    
    return learnings
```

### Validation Rules

```python
HIGH_IMPACT_THRESHOLD = {
    "min_confidence": 0.90,
    "min_sample_size": 50,
    "min_learning_length": 50,
    "requires_quantitative_evidence": True
}

MEDIUM_IMPACT_THRESHOLD = {
    "min_confidence": 0.75,
    "min_sample_size": 20,
    "min_learning_length": 30,
    "requires_evidence": True
}

LOW_IMPACT_THRESHOLD = {
    "min_confidence": 0.60,
    "min_sample_size": 1,
    "min_learning_length": 20,
    "requires_evidence": False
}
```

---

## ✅ PHASE 1 SUCCESS CRITERIA

- [x] Learning extraction module created
- [x] Validation system implemented
- [x] SOUL.md update automation built
- [ ] Scout test suite passes (4/4 scenarios)
- [ ] Manual automation script works
- [ ] SCOUT_SOUL.md successfully updated from test
- [ ] Git commits created for each learning
- [ ] Memory files populated
- [ ] Audit log records all activities
- [ ] Documentation complete

---

## 📊 EXPECTED RESULTS (PHASE 1)

### Scout SOUL.md Evolution
```
Before Phase 1:
- SCOUT_SOUL.md: 6.5 KB
- Recent Learnings: 0

After Phase 1 Test:
- SCOUT_SOUL.md: 7.2 KB (+0.7 KB)
- Recent Learnings: 3-5 learnings added
- Git commits: 3-5 new commits
- Memory entries: 10-15 entries
```

### Audit Trail Example
```json
{
  "timestamp": "2026-06-22T20:00:00Z",
  "agent": "scout",
  "phase": 1,
  "activities": [
    {
      "activity": "extract_learnings",
      "status": "success",
      "learnings_found": 5
    },
    {
      "activity": "validate_learnings",
      "status": "success",
      "learnings_valid": 4,
      "learnings_invalid": 1
    },
    {
      "activity": "apply_to_soul_md",
      "status": "success",
      "soul_md_updated": true,
      "commit": "a1b2c3d"
    }
  ]
}
```

---

## 🚀 PHASE 1 EXECUTION PLAN

### Step 1: Create Extract Module (20 min)
```python
# agents/extract_learnings.py
- Parse transcript
- Identify discovery sentences
- Extract learning objects
- Return structured output
```

### Step 2: Create Validation Module (20 min)
```python
# agents/validate_learnings.py
- Check significance
- Verify evidence
- Detect contradictions
- Check formatting
```

### Step 3: Create Application Module (20 min)
```python
# agents/apply_learnings_to_soul.py
- Read SOUL.md
- Apply learnings
- Update sections
- Git commit
```

### Step 4: Create Test Suite (20 min)
```python
# tests/test_scout_learning.py
- Test extraction
- Test validation
- Test application
- Verify output
```

### Step 5: Manual Testing (30 min)
```bash
# Run manually with Scout transcript
python3 agents/extract_learnings.py scout
python3 agents/validate_learnings.py scout
python3 agents/apply_learnings_to_soul.py scout

# Verify results
git log --oneline -5
cat agents/SCOUT_SOUL.md
cat agents/memory/scout_memory.json
```

---

## 📝 PHASE 1 DOCUMENTATION

### For Users
- `LEARNING_EXTRACTION_GUIDE.md` — How extraction works, how to tune it
- Updated `README.md` — Add Phase 1 status

### For Developers
- Code comments in all three modules
- Test cases documented
- Thresholds documented in YAML

### For Operations
- Execution log format documented
- Audit trail structure documented
- How to debug failures

---

## ⚠️ PHASE 1 LIMITATIONS

Phase 1 is **manual/on-demand only**:
- ✋ Manual trigger required
- ⏱️ Not on schedule
- 🧑‍💻 Requires user to run script
- 📊 No dashboard integration yet

These are resolved in Phase 2 (automation + scheduling).

---

## 🔄 PHASE 1 → PHASE 2 TRANSITION

When Phase 1 complete:

**Phase 2 will add:**
1. ✅ Cron scheduling (automated daily/weekly)
2. ✅ All 4 agents (Scout, Finch, Pulse, Psyche)
3. ✅ Quality control dashboard
4. ✅ Monitoring & alerting
5. ✅ Psyche 3x weekly reflections

**No code changes needed for Phase 2:**
- Phase 1 modules reused as-is
- Only scheduling + orchestration added
- Quality checks added on top

---

## 🎯 START PHASE 1 NOW?

Ready to build Phase 1?

I'll create:
1. ✅ Learning extraction module
2. ✅ Validation system
3. ✅ SOUL.md application logic
4. ✅ Scout test suite
5. ✅ Manual execution script
6. ✅ Documentation

**Estimate:** 1-2 hours for complete Phase 1 implementation

Should I proceed? 🚀

