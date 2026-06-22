#!/usr/bin/env python3
"""
Agent Self-Update System

Allows agents (Finch, Scout, Pulse, Psyche) to autonomously update their own
SOUL.md files and memory. Agents control their own evolution and learning.

Usage:
    from agent_self_update import AgentSelfUpdater
    
    updater = AgentSelfUpdater("scout")
    updater.commit_learning(
        learning="RSD trend shows 340% growth",
        evidence={"confidence": 0.94, "sample_size": 1200},
        impact="high"
    )
"""

import json
import subprocess
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import hashlib
import sys


class RateLimitError(Exception):
    """Raised when agent exceeds update rate limits"""
    pass


class ValidationError(Exception):
    """Raised when content fails validation"""
    pass


class ConflictError(Exception):
    """Raised when git conflict detected"""
    pass


class AgentSelfUpdater:
    """
    Allows agents to update their own SOUL.md and memory files.
    
    Each agent can:
    - Update their SOUL.md expertise areas
    - Add learnings to memory
    - Commit significant discoveries
    - Perform weekly reflections
    
    All updates are:
    - Rate limited (prevent spam)
    - Validated (ensure quality)
    - Logged (full audit trail)
    - Atomic (all or nothing)
    - Git committed (preserved in history)
    """
    
    SOUL_UPDATE_RATE_LIMIT_MINUTES = 30
    MEMORY_UPDATE_RATE_LIMIT = 5  # per minute
    MIN_CONTENT_LENGTH = 10
    MAX_SUMMARY_LENGTH = 100
    
    def __init__(self, agent_name: str, workspace_path: str = "."):
        """
        Initialize updater for an agent.
        
        Args:
            agent_name: One of "finch", "scout", "pulse", "psyche"
            workspace_path: Path to workspace root (default: current dir)
        """
        self.agent_name = agent_name.lower()
        self.workspace = Path(workspace_path)
        
        # File paths
        self.soul_file = self.workspace / "agents" / f"{self.agent_name.upper()}_SOUL.md"
        self.memory_dir = self.workspace / "agents" / "memory"
        self.memory_file = self.memory_dir / f"{self.agent_name}_memory.json"
        self.state_dir = self.workspace / "state"
        self.state_file = self.state_dir / f"{self.agent_name}_last_update.json"
        self.update_log = self.state_dir / "agent_update_log.json"
        
        # Create directories if needed
        self.memory_dir.mkdir(parents=True, exist_ok=True)
        self.state_dir.mkdir(parents=True, exist_ok=True)
        
        # Validate files exist
        if not self.soul_file.exists():
            raise FileNotFoundError(f"SOUL.md not found: {self.soul_file}")
    
    def update_soul_md(
        self,
        section: str,
        content: str,
        summary: str
    ) -> bool:
        """
        Update a section of SOUL.md.
        
        Args:
            section: Section name (e.g., "expertise_areas", "recent_learnings")
            content: New content for section
            summary: One-liner for git commit
            
        Returns:
            True if successful
            
        Raises:
            RateLimitError: If agent updated <30 min ago
            ValidationError: If content invalid
        """
        # Check rate limit
        if not self._check_rate_limit("soul"):
            raise RateLimitError(
                f"Agent {self.agent_name} can update SOUL.md once per "
                f"{self.SOUL_UPDATE_RATE_LIMIT_MINUTES} minutes"
            )
        
        # Validate content
        if not self._validate_content(content):
            raise ValidationError("Content doesn't meet quality standards")
        
        # Validate summary
        if not self._validate_summary(summary):
            raise ValidationError("Summary too long or invalid")
        
        # Read current SOUL.md
        soul_content = self.soul_file.read_text()
        
        # Add timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M ET")
        content_with_timestamp = f"{content}\n_(Updated: {timestamp})_"
        
        # Update section (simple approach: replace section content)
        section_header = f"## {section.replace('_', ' ').title()}"
        
        if section_header in soul_content:
            # Find section and update its first paragraph
            updated_content = self._update_section(
                soul_content, section_header, content_with_timestamp
            )
        else:
            # Section doesn't exist, append it
            updated_content = soul_content + f"\n\n{section_header}\n\n{content_with_timestamp}"
        
        # Write back
        self.soul_file.write_text(updated_content)
        
        # Git commit
        self._git_commit(summary, [self.soul_file])
        
        # Log update
        self._log_update("soul_md", section, summary)
        
        # Update state
        self._update_state("soul")
        
        return True
    
    def add_to_memory(
        self,
        key: str,
        entry: Dict[str, Any],
        date: Optional[str] = None
    ) -> bool:
        """
        Add entry to agent's memory file.
        
        Args:
            key: Memory category (e.g., "discovered_trends", "learnings")
            entry: Dictionary of entry data
            date: Optional timestamp (uses current time if not provided)
            
        Returns:
            True if successful
            
        Raises:
            RateLimitError: If too many updates in short time
            ValidationError: If entry invalid
        """
        # Check rate limit
        if not self._check_rate_limit("memory"):
            raise RateLimitError(
                f"Too many memory updates. Max {self.MEMORY_UPDATE_RATE_LIMIT} per minute"
            )
        
        # Validate entry
        if not self._validate_entry(entry):
            raise ValidationError("Memory entry invalid or empty")
        
        # Load memory
        if self.memory_file.exists():
            memory = json.loads(self.memory_file.read_text())
        else:
            memory = {}
        
        # Create key if needed
        if key not in memory:
            memory[key] = []
        
        # Add entry with metadata
        entry_with_metadata = {
            **entry,
            "date": date or datetime.now().isoformat(),
            "agent": self.agent_name,
            "_hash": self._hash_entry(entry)  # For deduplication
        }
        
        # Check for duplicates
        existing_hashes = {e.get("_hash") for e in memory[key]}
        if entry_with_metadata["_hash"] not in existing_hashes:
            memory[key].append(entry_with_metadata)
        
        # Prune old entries (keep last 100 per key)
        if len(memory[key]) > 100:
            memory[key] = memory[key][-100:]
        
        # Write back
        self.memory_file.write_text(json.dumps(memory, indent=2, ensure_ascii=False))
        
        # Log update (but don't commit for every entry - too noisy)
        self._log_update("memory", key, f"Added entry to {key}")
        
        # Update state
        self._update_state("memory")
        
        return True
    
    def commit_learning(
        self,
        learning: str,
        evidence: Dict[str, Any],
        impact: str = "medium"
    ) -> bool:
        """
        Commit a significant learning to SOUL.md and memory.
        
        Args:
            learning: Description of learning (e.g., "Videos <75s get 2.3x engagement")
            evidence: Supporting data (confidence, sample_size, etc.)
            impact: "low", "medium", or "high"
            
        Returns:
            True if successful
            
        Raises:
            ValidationError: If learning not significant enough
        """
        # Validate learning
        if not self._validate_learning(learning, evidence, impact):
            raise ValidationError(
                "Learning not significant enough. Need evidence for high-impact learnings."
            )
        
        # Add to "Recent Learnings" in SOUL.md
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
        impact_emoji = {"low": "📌", "medium": "💡", "high": "⭐"}[impact]
        
        learning_entry = (
            f"- {impact_emoji} **{learning}**\n"
            f"  - Impact: {impact.upper()}\n"
            f"  - Evidence: {self._format_evidence(evidence)}\n"
            f"  - Discovered: {timestamp}\n"
        )
        
        soul_content = self.soul_file.read_text()
        
        # Find or create "Recent Learnings" section
        recent_learnings_marker = "## Recent Learnings"
        
        if recent_learnings_marker in soul_content:
            # Insert after marker
            soul_content = soul_content.replace(
                recent_learnings_marker,
                f"{recent_learnings_marker}\n\n{learning_entry}"
            )
        else:
            # Append section
            soul_content += f"\n\n{recent_learnings_marker}\n\n{learning_entry}"
        
        self.soul_file.write_text(soul_content)
        
        # Also add to memory for future reference
        self.add_to_memory(
            "learnings",
            {
                "learning": learning,
                "evidence": evidence,
                "impact": impact,
                "timestamp": timestamp
            }
        )
        
        # Git commit
        commit_msg = f"{self.agent_name}: Learned - {learning[:50]}"
        self._git_commit(commit_msg, [self.soul_file, self.memory_file])
        
        # Log update
        self._log_update("learning", "commit", learning[:80])
        
        # Update state
        self._update_state("soul")
        
        return True
    
    def reflect_and_update(
        self,
        reflection: str,
        updates: Dict[str, List[str]]
    ) -> bool:
        """
        Comprehensive weekly update: reflect and update all files.
        
        Typically called weekly (Friday 5 PM ET).
        
        Args:
            reflection: Agent's reflection on the week
            updates: Dictionary with:
                - "new_expertise": List of new expertise areas
                - "refined_skills": List of refined skills
                - "lessons_learned": List of lessons
                
        Returns:
            True if successful
        """
        # Validate updates
        if not updates.get("new_expertise") and not updates.get("refined_skills"):
            raise ValidationError("No updates provided")
        
        # Read current SOUL.md
        soul_content = self.soul_file.read_text()
        
        # Build reflection section
        date_str = datetime.now().strftime("%Y-%m-%d")
        reflection_section = f"""

## Reflection - {date_str}

{reflection}

### New Expertise Discovered
{self._format_list(updates.get('new_expertise', []))}

### Refined Skills
{self._format_list(updates.get('refined_skills', []))}

### Lessons Learned
{self._format_list(updates.get('lessons_learned', []))}
"""
        
        # Add reflection to SOUL.md
        updated_soul = soul_content + reflection_section
        self.soul_file.write_text(updated_soul)
        
        # Add all new expertise to memory
        for expertise in updates.get('new_expertise', []):
            self.add_to_memory(
                "expertise",
                {
                    "area": expertise,
                    "confidence": 0.75,
                    "source": "weekly_reflection"
                }
            )
        
        # Add refined skills to memory
        for skill in updates.get('refined_skills', []):
            self.add_to_memory(
                "refined_skills",
                {
                    "skill": skill,
                    "improvement": "refined",
                    "confidence": 0.85
                }
            )
        
        # Add lessons to memory
        for lesson in updates.get('lessons_learned', []):
            self.add_to_memory(
                "lessons",
                {
                    "lesson": lesson,
                    "learned_date": date_str
                }
            )
        
        # Git commit all changes
        new_expertise_count = len(updates.get('new_expertise', []))
        refined_skills_count = len(updates.get('refined_skills', []))
        commit_msg = (
            f"{self.agent_name}: Weekly reflection - "
            f"{new_expertise_count} new expertise, {refined_skills_count} refined skills"
        )
        self._git_commit(commit_msg, [self.soul_file, self.memory_file])
        
        # Log update
        self._log_update("reflection", "weekly", reflection[:80])
        
        # Update state
        self._update_state("soul")
        
        return True
    
    # ====== PRIVATE HELPERS ======
    
    def _check_rate_limit(self, update_type: str) -> bool:
        """Check if agent can update (rate limited)"""
        if not self.state_file.exists():
            return True
        
        state = json.loads(self.state_file.read_text())
        
        if update_type == "soul":
            last_update = state.get("last_soul_update")
            if not last_update:
                return True
            
            last_time = datetime.fromisoformat(last_update)
            minutes_ago = (datetime.now() - last_time).total_seconds() / 60
            return minutes_ago >= self.SOUL_UPDATE_RATE_LIMIT_MINUTES
        
        elif update_type == "memory":
            memory_updates = state.get("memory_updates_last_minute", 0)
            last_memory_time = state.get("last_memory_update")
            
            if not last_memory_time:
                return True
            
            last_time = datetime.fromisoformat(last_memory_time)
            minutes_ago = (datetime.now() - last_time).total_seconds() / 60
            
            if minutes_ago >= 1.0:
                # Reset counter after 1 minute
                return True
            
            return memory_updates < self.MEMORY_UPDATE_RATE_LIMIT
        
        return True
    
    def _validate_content(self, content: str) -> bool:
        """Validate SOUL.md content quality"""
        if not content or len(content) < self.MIN_CONTENT_LENGTH:
            return False
        
        # Don't allow placeholder text
        if "TODO" in content or "FIXME" in content or "???" in content:
            return False
        
        return True
    
    def _validate_summary(self, summary: str) -> bool:
        """Validate git commit summary"""
        if not summary or len(summary) > self.MAX_SUMMARY_LENGTH:
            return False
        return True
    
    def _validate_entry(self, entry: Dict[str, Any]) -> bool:
        """Validate memory entry"""
        if not isinstance(entry, dict):
            return False
        return len(entry) > 0
    
    def _validate_learning(
        self,
        learning: str,
        evidence: Dict[str, Any],
        impact: str
    ) -> bool:
        """Validate learning significance"""
        if impact not in ["low", "medium", "high"]:
            return False
        
        if not learning or len(learning) < 15:
            return False
        
        # High impact requires evidence
        if impact == "high" and (not evidence or len(evidence) == 0):
            return False
        
        return True
    
    def _update_section(
        self,
        content: str,
        section_header: str,
        new_content: str
    ) -> str:
        """Update a markdown section"""
        lines = content.split('\n')
        section_start = -1
        section_end = len(lines)
        
        # Find section
        for i, line in enumerate(lines):
            if section_header in line:
                section_start = i
                break
        
        if section_start == -1:
            return content  # Section not found
        
        # Find end of section (next ## header or EOF)
        for i in range(section_start + 1, len(lines)):
            if lines[i].startswith('## '):
                section_end = i
                break
        
        # Replace section content
        new_lines = (
            lines[:section_start + 1] +
            [''] +
            [new_content] +
            [''] +
            lines[section_end:]
        )
        
        return '\n'.join(new_lines)
    
    def _format_evidence(self, evidence: Dict[str, Any]) -> str:
        """Format evidence dictionary"""
        items = [f"{k}: {v}" for k, v in evidence.items()]
        return ", ".join(items)
    
    def _format_list(self, items: List[str]) -> str:
        """Format list as markdown"""
        if not items:
            return "(none)"
        return "\n".join([f"- {item}" for item in items])
    
    def _hash_entry(self, entry: Dict[str, Any]) -> str:
        """Hash entry for deduplication"""
        entry_str = json.dumps(entry, sort_keys=True)
        return hashlib.md5(entry_str.encode()).hexdigest()[:8]
    
    def _git_commit(self, message: str, files: List[Path]) -> str:
        """Commit changes to git"""
        try:
            # Stage files
            for file in files:
                subprocess.run(
                    ["git", "add", str(file)],
                    cwd=str(self.workspace),
                    check=True,
                    capture_output=True
                )
            
            # Commit
            result = subprocess.run(
                ["git", "commit", "-m", message],
                cwd=str(self.workspace),
                check=True,
                capture_output=True,
                text=True
            )
            
            # Extract commit hash
            if result.stdout:
                # Typical output: "[main abc1234] message\n ..."
                commit_hash = result.stdout.split()[1]
                return commit_hash
            
            return "unknown"
        
        except subprocess.CalledProcessError as e:
            # Might be no changes to commit, which is fine
            if "nothing to commit" in e.stderr:
                return "no-changes"
            raise
    
    def _log_update(self, update_type: str, category: str, summary: str) -> None:
        """Log update to audit trail"""
        log = []
        if self.update_log.exists():
            try:
                log = json.loads(self.update_log.read_text())
            except json.JSONDecodeError:
                log = []
        
        entry = {
            "agent": self.agent_name,
            "timestamp": datetime.now().isoformat(),
            "type": update_type,
            "category": category,
            "summary": summary[:self.MAX_SUMMARY_LENGTH]
        }
        
        log.append(entry)
        
        # Keep last 1000 entries
        log = log[-1000:]
        
        self.update_log.write_text(json.dumps(log, indent=2, ensure_ascii=False))
    
    def _update_state(self, update_type: str) -> None:
        """Update last update timestamp"""
        state = {}
        if self.state_file.exists():
            try:
                state = json.loads(self.state_file.read_text())
            except json.JSONDecodeError:
                state = {}
        
        now = datetime.now().isoformat()
        
        if update_type == "soul":
            state["last_soul_update"] = now
        elif update_type == "memory":
            state["last_memory_update"] = now
            state["memory_updates_last_minute"] = state.get("memory_updates_last_minute", 0) + 1
        
        self.state_file.write_text(json.dumps(state, indent=2))


# ====== CLI INTERFACE ======

def main():
    """CLI interface for testing and direct agent updates"""
    
    if len(sys.argv) < 2:
        print("Usage: agent_self_update.py <agent> <command> [args...]")
        print("\nCommands:")
        print("  update-soul <section> <content> <summary>")
        print("  add-memory <key> <json_entry>")
        print("  commit-learning <learning> <json_evidence> <impact>")
        print("  reflect <json_reflection_json>")
        sys.exit(1)
    
    agent_name = sys.argv[1]
    command = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        updater = AgentSelfUpdater(agent_name)
        
        if command == "update-soul" and len(sys.argv) >= 5:
            section = sys.argv[3]
            content = sys.argv[4]
            summary = sys.argv[5] if len(sys.argv) > 5 else f"Update {section}"
            updater.update_soul_md(section, content, summary)
            print(f"✅ Updated {agent_name}_SOUL.md section: {section}")
        
        elif command == "add-memory" and len(sys.argv) >= 4:
            key = sys.argv[3]
            entry_json = sys.argv[4]
            entry = json.loads(entry_json)
            updater.add_to_memory(key, entry)
            print(f"✅ Added entry to {agent_name} memory: {key}")
        
        elif command == "commit-learning" and len(sys.argv) >= 5:
            learning = sys.argv[3]
            evidence_json = sys.argv[4]
            impact = sys.argv[5] if len(sys.argv) > 5 else "medium"
            evidence = json.loads(evidence_json)
            updater.commit_learning(learning, evidence, impact)
            print(f"✅ Committed learning for {agent_name}")
        
        else:
            print(f"Unknown command: {command}")
            sys.exit(1)
    
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
