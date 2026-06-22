#!/usr/bin/env python3
"""
Apply Learnings to SOUL.md

Takes validated learnings and applies them to agent SOUL.md files.

Updates:
- Recent Learnings section
- Expertise Areas section
- Examples with real data
- Timestamps
- Git commits
"""

import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional


class SoulMdUpdater:
    """Updates SOUL.md files with validated learnings"""
    
    def __init__(self, agent_name: str, workspace_path: str = "."):
        self.agent_name = agent_name.lower()
        self.workspace = Path(workspace_path)
        
        self.soul_file = self.workspace / "agents" / f"{agent_name.upper()}_SOUL.md"
        self.memory_file = self.workspace / "agents" / "memory" / f"{agent_name}_memory.json"
        self.memory_dir = self.memory_file.parent
        
        if not self.soul_file.exists():
            raise FileNotFoundError(f"SOUL.md not found: {self.soul_file}")
    
    def apply_learnings(self, learnings: List[Dict[str, Any]]) -> int:
        """
        Apply validated learnings to SOUL.md.
        
        Args:
            learnings: List of validated learning dicts
            
        Returns:
            Number of learnings applied
        """
        # Filter to only valid learnings
        valid_learnings = [l for l in learnings if l.get("valid", True)]
        
        if not valid_learnings:
            print("⚠️  No valid learnings to apply")
            return 0
        
        print(f"📝 Applying {len(valid_learnings)} learnings to {self.agent_name.upper()}_SOUL.md...")
        
        # Read current SOUL.md
        soul_content = self.soul_file.read_text()
        
        # Apply each learning
        for learning_dict in valid_learnings:
            learning = learning_dict.get("learning", "")
            evidence = learning_dict.get("evidence", {})
            impact = learning_dict.get("impact", "low")
            confidence = learning_dict.get("confidence", 0.0)
            
            # Add to Recent Learnings
            soul_content = self._add_recent_learning(
                soul_content, learning, evidence, impact, confidence
            )
            
            # Add to memory
            self._add_to_memory(learning, evidence, impact, confidence)
        
        # Write updated SOUL.md
        self.soul_file.write_text(soul_content)
        print(f"✅ Updated {self.soul_file}")
        
        # Git commit
        self._git_commit_changes(len(valid_learnings))
        
        return len(valid_learnings)
    
    def _add_recent_learning(
        self,
        soul_content: str,
        learning: str,
        evidence: Dict[str, Any],
        impact: str,
        confidence: float
    ) -> str:
        """Add learning to Recent Learnings section"""
        
        # Impact emoji
        impact_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}[impact]
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M ET")
        
        # Format evidence
        evidence_str = self._format_evidence(evidence)
        
        # Create learning entry
        learning_entry = (
            f"\n- {impact_emoji} **{learning}** ({confidence:.0%} confidence)\n"
            f"  - Impact: {impact.upper()}\n"
            f"  - Evidence: {evidence_str}\n"
            f"  - Learned: {timestamp}\n"
        )
        
        # Find or create Recent Learnings section
        recent_marker = "## Recent Learnings"
        
        if recent_marker in soul_content:
            # Insert after marker (before next section)
            parts = soul_content.split(recent_marker)
            
            if len(parts) == 2:
                # Find next section boundary
                rest = parts[1]
                next_section_idx = rest.find("\n## ")
                
                if next_section_idx != -1:
                    # Insert between marker and next section
                    before_next = rest[:next_section_idx]
                    after_next = rest[next_section_idx:]
                    soul_content = parts[0] + recent_marker + before_next + learning_entry + after_next
                else:
                    # Append at end
                    soul_content = soul_content + learning_entry
        else:
            # Create Recent Learnings section
            soul_content += f"\n\n{recent_marker}{learning_entry}"
        
        return soul_content
    
    def _add_to_memory(
        self,
        learning: str,
        evidence: Dict[str, Any],
        impact: str,
        confidence: float
    ) -> None:
        """Add learning to memory file"""
        
        self.memory_dir.mkdir(parents=True, exist_ok=True)
        
        # Load or create memory
        if self.memory_file.exists():
            memory = json.loads(self.memory_file.read_text())
        else:
            memory = {}
        
        # Create learnings section if needed
        if "learnings" not in memory:
            memory["learnings"] = []
        
        # Add learning
        entry = {
            "learning": learning,
            "evidence": evidence,
            "impact": impact,
            "confidence": confidence,
            "timestamp": datetime.now().isoformat(),
            "source": "learning_automation"
        }
        
        memory["learnings"].append(entry)
        
        # Keep last 100 learnings
        memory["learnings"] = memory["learnings"][-100:]
        
        # Save memory
        self.memory_file.write_text(json.dumps(memory, indent=2, ensure_ascii=False))
    
    def _format_evidence(self, evidence: Dict[str, Any]) -> str:
        """Format evidence dict as readable string"""
        if not evidence:
            return "(no quantitative evidence)"
        
        parts = []
        
        if "confidence" in evidence:
            parts.append(f"confidence={evidence['confidence']:.0%}")
        
        if "sample_size" in evidence:
            parts.append(f"n={evidence['sample_size']}")
        
        if "growth_rate" in evidence:
            parts.append(f"growth={evidence['growth_rate']:.0f}%")
        
        if "multiplier" in evidence:
            parts.append(f"multiplier={evidence['multiplier']:.1f}x")
        
        if "timeframe" in evidence:
            parts.append(f"period={evidence['timeframe']}")
        
        return ", ".join(parts) if parts else "(limited evidence)"
    
    def _git_commit_changes(self, count: int) -> None:
        """Commit changes to git"""
        try:
            # Stage SOUL.md and memory file
            subprocess.run(
                ["git", "add", str(self.soul_file)],
                cwd=str(self.workspace),
                check=True,
                capture_output=True
            )
            
            subprocess.run(
                ["git", "add", str(self.memory_file)],
                cwd=str(self.workspace),
                check=True,
                capture_output=True
            )
            
            # Create commit message
            commit_msg = f"learning: {self.agent_name} - Applied {count} new learnings"
            
            # Commit
            result = subprocess.run(
                ["git", "commit", "-m", commit_msg],
                cwd=str(self.workspace),
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                # Extract commit hash
                output = result.stdout or result.stderr
                lines = output.split('\n')
                if lines:
                    print(f"✅ Git commit: {lines[0]}")
            else:
                if "nothing to commit" not in result.stderr:
                    print(f"⚠️  Git commit failed: {result.stderr}")
        
        except Exception as e:
            print(f"⚠️  Could not commit to git: {e}")


def main():
    """CLI interface"""
    if len(sys.argv) < 2:
        print("Usage: apply_learnings_to_soul.py <agent> [validation_results_file]")
        print("\nExamples:")
        print("  apply_learnings_to_soul.py scout state/scout_validation_results.json")
        sys.exit(1)
    
    agent_name = sys.argv[1]
    validation_file = sys.argv[2] if len(sys.argv) > 2 else f"state/{agent_name}_validation_results.json"
    
    try:
        # Load validation results
        validation_path = Path(validation_file)
        if not validation_path.exists():
            print(f"❌ Validation results not found: {validation_file}")
            print(f"\n   Run: validate_learnings.py {agent_name}")
            sys.exit(1)
        
        validation_data = json.loads(validation_path.read_text())
        results = validation_data.get("results", [])
        
        print(f"📊 Applying validated learnings for {agent_name}...")
        print(f"   Total results: {len(results)}")
        print(f"   Valid: {validation_data['summary']['valid']}")
        print(f"   Invalid: {validation_data['summary']['invalid']}\n")
        
        # Create updater
        updater = SoulMdUpdater(agent_name, workspace_path="/home/openclaw/.openclaw/workspace")
        
        # Apply learnings
        count_applied = updater.apply_learnings(results)
        
        print(f"\n✅ Applied {count_applied} learnings")
        print(f"   Updated: {updater.soul_file.name}")
        print(f"   Updated: {updater.memory_file.name}")
    
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
