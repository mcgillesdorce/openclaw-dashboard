#!/usr/bin/env python3
"""
Learning Extraction Module

Extracts learnings from agent session transcripts.

Usage:
    python extract_learnings.py scout [transcript_file]
    python extract_learnings.py scout --from-latest-session
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict


@dataclass
class Learning:
    """Represents an extracted learning"""
    learning: str
    evidence: Dict[str, Any]
    impact: str  # "high", "medium", "low"
    source: str
    timestamp: str
    confidence: float = 0.0
    
    def to_dict(self) -> Dict:
        return asdict(self)


class LearningExtractor:
    """
    Extracts learnings from agent session transcripts.
    
    Looks for patterns indicating discoveries, findings, and insights.
    """
    
    # Discovery patterns (various ways agents express findings)
    DISCOVERY_PATTERNS = [
        r"(discovered|found|identified|realized|determined|confirmed)",
        r"(trend|pattern|tendency|consistency|correlation)",
        r"(new insight|realization|breakthrough|validation)",
        r"(this shows|data shows|evidence shows|results show)",
        r"(significant increase|significant decrease|marked growth|sharp decline)",
    ]
    
    # Evidence patterns
    EVIDENCE_PATTERNS = {
        "confidence": r"(\d+\.?\d*)\s*(?:%|confidence|certain|sure)",
        "sample_size": r"(?:sample|n|size|count)\s*=?\s*(\d+)",
        "growth": r"(\d+\.?\d*)\s*%\s*(?:growth|increase|decrease|improvement)",
        "metric": r"(\d+\.?\d*)\s*[x×]\s*(?:more|higher|faster|better)",
        "timeframe": r"(?:over|during|within|last)\s*(\d+\s*(?:days|weeks|months|years))",
    }
    
    # Confidence assessment rules
    CONFIDENCE_BOOST = {
        "quantitative": 0.15,      # Has numbers
        "multiple_sources": 0.10,  # Multiple evidence sources
        "validated": 0.10,         # Cross-checked/validated
        "consistent": 0.10,        # Mentions consistency
    }
    
    CONFIDENCE_PENALTY = {
        "preliminary": -0.20,      # Still preliminary
        "partial": -0.15,          # Incomplete data
        "uncertain": -0.10,        # Expresses doubt
        "contradiction": -0.25,    # Contradicts something
    }
    
    def __init__(self, agent_name: str):
        self.agent_name = agent_name.lower()
        self.learnings: List[Learning] = []
    
    def extract_from_text(self, text: str) -> List[Learning]:
        """
        Extract learnings from text content.
        
        Args:
            text: Session transcript or conversation text
            
        Returns:
            List of extracted Learning objects
        """
        self.learnings = []
        
        # Split into sentences
        sentences = self._split_sentences(text)
        
        for sentence in sentences:
            # Check if sentence contains a discovery pattern
            if self._is_discovery_sentence(sentence):
                learning = self._extract_learning_from_sentence(sentence)
                if learning:
                    self.learnings.append(learning)
        
        # Deduplicate similar learnings
        self.learnings = self._deduplicate(self.learnings)
        
        return self.learnings
    
    def extract_from_file(self, filepath: Path) -> List[Learning]:
        """Extract learnings from a transcript file"""
        if not filepath.exists():
            raise FileNotFoundError(f"Transcript not found: {filepath}")
        
        text = filepath.read_text()
        return self.extract_from_text(text)
    
    # ====== PRIVATE METHODS ======
    
    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitting on period, exclamation, question mark
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    def _is_discovery_sentence(self, sentence: str) -> bool:
        """Check if sentence contains discovery language"""
        sentence_lower = sentence.lower()
        
        # Check against discovery patterns
        for pattern in self.DISCOVERY_PATTERNS:
            if re.search(pattern, sentence_lower):
                return True
        
        return False
    
    def _extract_learning_from_sentence(self, sentence: str) -> Optional[Learning]:
        """
        Extract a learning object from a sentence.
        
        Returns:
            Learning object if extraction successful, None otherwise
        """
        # Clean sentence
        learning_text = sentence.strip()
        
        # Too short to be meaningful
        if len(learning_text) < 20:
            return None
        
        # Extract evidence
        evidence = self._extract_evidence(sentence)
        
        # Assess impact based on evidence
        impact = self._assess_impact(learning_text, evidence)
        
        # Calculate confidence
        confidence = self._calculate_confidence(learning_text, evidence)
        
        # Create learning object
        learning = Learning(
            learning=learning_text,
            evidence=evidence,
            impact=impact,
            source="session_transcript",
            timestamp=datetime.now().isoformat(),
            confidence=confidence
        )
        
        return learning
    
    def _extract_evidence(self, sentence: str) -> Dict[str, Any]:
        """Extract evidence/metrics from sentence"""
        evidence = {}
        
        # Try to extract confidence
        conf_match = re.search(self.EVIDENCE_PATTERNS["confidence"], sentence, re.IGNORECASE)
        if conf_match:
            try:
                val = float(conf_match.group(1))
                # Normalize to 0-1
                if val > 1:
                    val = val / 100
                evidence["confidence"] = round(val, 2)
            except:
                pass
        
        # Try to extract sample size
        sample_match = re.search(self.EVIDENCE_PATTERNS["sample_size"], sentence, re.IGNORECASE)
        if sample_match:
            try:
                evidence["sample_size"] = int(sample_match.group(1))
            except:
                pass
        
        # Try to extract growth rate
        growth_match = re.search(self.EVIDENCE_PATTERNS["growth"], sentence, re.IGNORECASE)
        if growth_match:
            try:
                evidence["growth_rate"] = float(growth_match.group(1))
            except:
                pass
        
        # Try to extract metric multiplier
        metric_match = re.search(self.EVIDENCE_PATTERNS["metric"], sentence, re.IGNORECASE)
        if metric_match:
            try:
                evidence["multiplier"] = float(metric_match.group(1))
            except:
                pass
        
        # Try to extract timeframe
        time_match = re.search(self.EVIDENCE_PATTERNS["timeframe"], sentence, re.IGNORECASE)
        if time_match:
            evidence["timeframe"] = time_match.group(1).strip()
        
        return evidence
    
    def _assess_impact(self, learning: str, evidence: Dict) -> str:
        """Assess learning impact: high, medium, or low"""
        learning_lower = learning.lower()
        evidence_count = len(evidence)
        
        # High impact signals
        high_signals = [
            evidence_count >= 3,  # Multiple evidence types
            "significant" in learning_lower,
            "breakthrough" in learning_lower,
            "major" in learning_lower,
            evidence.get("sample_size", 0) >= 100,
            evidence.get("growth_rate", 0) >= 50,
        ]
        
        # Medium impact signals
        medium_signals = [
            evidence_count >= 1,
            "improvement" in learning_lower,
            "optimization" in learning_lower,
            evidence.get("sample_size", 0) >= 20,
            evidence.get("growth_rate", 0) >= 10,
        ]
        
        if sum(high_signals) >= 2:
            return "high"
        elif sum(medium_signals) >= 2:
            return "medium"
        else:
            return "low"
    
    def _calculate_confidence(self, learning: str, evidence: Dict) -> float:
        """
        Calculate confidence score (0-1).
        
        Base: 0.60
        Boosts: +0.05 to +0.15 each
        Penalties: -0.10 to -0.25 each
        Capped: 0.0 to 1.0
        """
        confidence = 0.60  # Base confidence
        learning_lower = learning.lower()
        
        # Apply boosts
        if len(evidence) > 0:
            confidence += self.CONFIDENCE_BOOST["quantitative"]
        
        if "validated" in learning_lower or "confirmed" in learning_lower:
            confidence += self.CONFIDENCE_BOOST["validated"]
        
        if "consistent" in learning_lower:
            confidence += self.CONFIDENCE_BOOST["consistent"]
        
        # Apply penalties
        if "preliminary" in learning_lower or "initial" in learning_lower:
            confidence += self.CONFIDENCE_PENALTY["preliminary"]
        
        if "partial" in learning_lower or "incomplete" in learning_lower:
            confidence += self.CONFIDENCE_PENALTY["partial"]
        
        if "uncertain" in learning_lower or "might" in learning_lower:
            confidence += self.CONFIDENCE_PENALTY["uncertain"]
        
        # Clamp to 0-1
        return max(0.0, min(1.0, confidence))
    
    def _deduplicate(self, learnings: List[Learning]) -> List[Learning]:
        """Remove duplicate or very similar learnings"""
        deduped = []
        seen_learnings = set()
        
        for learning in learnings:
            # Simple dedup: check if learning text is very similar
            learning_normalized = learning.learning.lower()
            
            # Skip if we've seen similar learning
            is_duplicate = False
            for seen in seen_learnings:
                # Simple similarity: same first 30 chars
                if learning_normalized[:30] == seen[:30]:
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                deduped.append(learning)
                seen_learnings.add(learning_normalized)
        
        return deduped
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert extracted learnings to dictionary"""
        return {
            "agent": self.agent_name,
            "timestamp": datetime.now().isoformat(),
            "learnings": [l.to_dict() for l in self.learnings],
            "summary": {
                "total": len(self.learnings),
                "high_impact": sum(1 for l in self.learnings if l.impact == "high"),
                "medium_impact": sum(1 for l in self.learnings if l.impact == "medium"),
                "low_impact": sum(1 for l in self.learnings if l.impact == "low"),
            }
        }


def main():
    """CLI interface"""
    if len(sys.argv) < 2:
        print("Usage: extract_learnings.py <agent> [transcript_file]")
        print("\nExamples:")
        print("  extract_learnings.py scout")
        print("  extract_learnings.py scout transcript.txt")
        sys.exit(1)
    
    agent_name = sys.argv[1]
    transcript_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    try:
        extractor = LearningExtractor(agent_name)
        
        if transcript_file:
            learnings = extractor.extract_from_file(Path(transcript_file))
            print(f"✅ Extracted {len(learnings)} learnings from {transcript_file}")
        else:
            # For now, no default behavior
            print(f"⚠️  No transcript file provided")
            print(f"   Usage: extract_learnings.py {agent_name} <file.txt>")
            sys.exit(1)
        
        # Output as JSON
        result = extractor.to_dict()
        print(json.dumps(result, indent=2))
        
        # Also save to file
        output_file = Path(f"state/{agent_name}_extracted_learnings.json")
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(json.dumps(result, indent=2))
        print(f"\n✅ Saved to {output_file}")
    
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
