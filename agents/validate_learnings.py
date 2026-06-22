#!/usr/bin/env python3
"""
Learning Validation Module

Validates extracted learnings against quality criteria.

Checks:
- Significance (not trivial/noise)
- Evidence sufficiency (backed by data)
- No contradictions
- Well-written
- Proper formatting
"""

import json
import sys
from pathlib import Path
from typing import List, Dict, Any, Tuple
from dataclasses import dataclass


@dataclass
class ValidationResult:
    """Result of validating a learning"""
    learning: str
    valid: bool
    confidence: float
    impact: str
    errors: List[str]
    warnings: List[str]


class LearningValidator:
    """Validates extracted learnings"""
    
    # Thresholds for different impact levels
    THRESHOLDS = {
        "high": {
            "min_confidence": 0.85,
            "min_sample_size": 50,
            "min_length": 40,
            "requires_evidence": True,
        },
        "medium": {
            "min_confidence": 0.70,
            "min_sample_size": 15,
            "min_length": 25,
            "requires_evidence": True,
        },
        "low": {
            "min_confidence": 0.55,
            "min_sample_size": 1,
            "min_length": 15,
            "requires_evidence": False,
        },
    }
    
    # Words that make learnings invalid
    INVALID_MARKERS = [
        "TODO", "FIXME", "????", "???",
        "placeholder", "example", "test",
        "might", "could", "maybe", "possibly",
    ]
    
    # Trivial learning patterns (not worth recording)
    TRIVIAL_PATTERNS = [
        r"i think",
        r"feels like",
        r"in my opinion",
        r"probably",
        r"maybe",
    ]
    
    def __init__(self, agent_name: str):
        self.agent_name = agent_name.lower()
        self.existing_learnings: List[str] = []
    
    def load_existing_learnings(self, soul_file: Path) -> None:
        """Load existing learnings from SOUL.md to check for contradictions"""
        if soul_file.exists():
            content = soul_file.read_text()
            # Extract learning statements (simple approach)
            self.existing_learnings = [line.strip() for line in content.split('\n') if '**' in line]
    
    def validate(self, learnings: List[Dict[str, Any]]) -> Tuple[List[ValidationResult], Dict[str, Any]]:
        """
        Validate a list of learnings.
        
        Returns:
            (validation_results, summary)
        """
        results = []
        
        for learning_dict in learnings:
            result = self.validate_single(learning_dict)
            results.append(result)
        
        # Summarize
        summary = {
            "total": len(results),
            "valid": sum(1 for r in results if r.valid),
            "invalid": sum(1 for r in results if not r.valid),
            "high_impact_valid": sum(1 for r in results if r.valid and r.impact == "high"),
            "medium_impact_valid": sum(1 for r in results if r.valid and r.impact == "medium"),
            "low_impact_valid": sum(1 for r in results if r.valid and r.impact == "low"),
        }
        
        return results, summary
    
    def validate_single(self, learning_dict: Dict[str, Any]) -> ValidationResult:
        """Validate a single learning"""
        learning = learning_dict.get("learning", "")
        evidence = learning_dict.get("evidence", {})
        impact = learning_dict.get("impact", "low")
        confidence = learning_dict.get("confidence", 0.0)
        
        errors = []
        warnings = []
        
        # Check 1: Length
        if len(learning) < self.THRESHOLDS[impact]["min_length"]:
            errors.append(f"Learning too short (need >{self.THRESHOLDS[impact]['min_length']} chars)")
        
        # Check 2: Invalid markers
        learning_upper = learning.upper()
        for marker in self.INVALID_MARKERS:
            if marker in learning_upper:
                errors.append(f"Contains invalid marker: {marker}")
        
        # Check 3: Trivial language
        learning_lower = learning.lower()
        for pattern in self.TRIVIAL_PATTERNS:
            if pattern in learning_lower:
                errors.append(f"Uses trivial language: {pattern}")
        
        # Check 4: Confidence threshold
        if confidence < self.THRESHOLDS[impact]["min_confidence"]:
            errors.append(
                f"Confidence too low ({confidence:.2f} < {self.THRESHOLDS[impact]['min_confidence']}) for {impact} impact"
            )
        
        # Check 5: Evidence requirements
        if self.THRESHOLDS[impact]["requires_evidence"] and not evidence:
            errors.append(f"Evidence required for {impact} impact learning")
        
        # Check 6: Sample size for high impact
        if impact == "high":
            sample_size = evidence.get("sample_size", 0)
            if sample_size < self.THRESHOLDS["high"]["min_sample_size"]:
                errors.append(
                    f"Sample size too small ({sample_size} < {self.THRESHOLDS['high']['min_sample_size']})"
                )
        
        # Check 7: Contradiction with existing
        if self._contradicts_existing(learning):
            warnings.append("Potentially contradicts existing learning (review needed)")
        
        # Check 8: Formatting
        if not self._is_well_formatted(learning):
            warnings.append("Consider improving formatting")
        
        # Determine validity
        valid = len(errors) == 0
        
        return ValidationResult(
            learning=learning,
            valid=valid,
            confidence=confidence,
            impact=impact,
            errors=errors,
            warnings=warnings
        )
    
    def _contradicts_existing(self, learning: str) -> bool:
        """Check if learning contradicts existing expertise"""
        learning_lower = learning.lower()
        
        for existing in self.existing_learnings:
            existing_lower = existing.lower()
            
            # Simple check: if both mention same thing but with opposite sentiment
            if "not" in learning_lower and existing_lower in learning_lower:
                return True
            if "no longer" in learning_lower and existing_lower in learning_lower:
                return True
        
        return False
    
    def _is_well_formatted(self, learning: str) -> bool:
        """Check formatting quality"""
        # Should start with capital letter
        if learning and learning[0].isupper():
            return True
        return False
    
    def summary_report(self, results: List[ValidationResult], summary: Dict) -> str:
        """Generate human-readable summary"""
        report = []
        report.append(f"\n📊 VALIDATION SUMMARY\n")
        report.append(f"Total learnings: {summary['total']}")
        report.append(f"Valid: {summary['valid']}")
        report.append(f"Invalid: {summary['invalid']}")
        report.append(f"\nBy Impact:")
        report.append(f"  🟥 High: {summary['high_impact_valid']}")
        report.append(f"  🟨 Medium: {summary['medium_impact_valid']}")
        report.append(f"  🟩 Low: {summary['low_impact_valid']}")
        report.append(f"\n")
        
        # Show invalid learnings
        invalid = [r for r in results if not r.valid]
        if invalid:
            report.append(f"❌ INVALID LEARNINGS ({len(invalid)}):\n")
            for r in invalid:
                report.append(f"  • {r.learning[:60]}...")
                for error in r.errors:
                    report.append(f"    → {error}")
                report.append("")
        
        # Show warnings
        with_warnings = [r for r in results if r.warnings]
        if with_warnings:
            report.append(f"⚠️  WARNINGS ({len(with_warnings)}):\n")
            for r in with_warnings:
                report.append(f"  • {r.learning[:60]}...")
                for warning in r.warnings:
                    report.append(f"    → {warning}")
                report.append("")
        
        return "\n".join(report)


def main():
    """CLI interface"""
    if len(sys.argv) < 2:
        print("Usage: validate_learnings.py <agent> [learnings_json_file]")
        print("\nExamples:")
        print("  validate_learnings.py scout state/scout_extracted_learnings.json")
        sys.exit(1)
    
    agent_name = sys.argv[1]
    learnings_file = sys.argv[2] if len(sys.argv) > 2 else f"state/{agent_name}_extracted_learnings.json"
    
    try:
        # Load extracted learnings
        learnings_path = Path(learnings_file)
        if not learnings_path.exists():
            print(f"❌ Learnings file not found: {learnings_file}")
            sys.exit(1)
        
        learnings_data = json.loads(learnings_path.read_text())
        learnings = learnings_data.get("learnings", [])
        
        print(f"📖 Validating {len(learnings)} learnings for {agent_name}...")
        
        # Create validator
        validator = LearningValidator(agent_name)
        
        # Load existing learnings (for contradiction check)
        soul_file = Path(f"agents/{agent_name.upper()}_SOUL.md")
        validator.load_existing_learnings(soul_file)
        
        # Validate
        results, summary = validator.validate(learnings)
        
        # Print report
        print(validator.summary_report(results, summary))
        
        # Save validation results
        output_file = Path(f"state/{agent_name}_validation_results.json")
        output_data = {
            "agent": agent_name,
            "summary": summary,
            "results": [
                {
                    "learning": r.learning,
                    "valid": r.valid,
                    "confidence": r.confidence,
                    "impact": r.impact,
                    "errors": r.errors,
                    "warnings": r.warnings,
                }
                for r in results
            ]
        }
        output_file.write_text(json.dumps(output_data, indent=2))
        print(f"\n✅ Validation results saved to {output_file}")
    
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
