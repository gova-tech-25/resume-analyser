import unittest
from analyzer import (
    analyze_resume,
    audit_bullets,
    check_layout_issues,
    extract_sections,
    SKILL_ALIASES,
    TECH_SKILLS
)

class TestAnalyzer(unittest.TestCase):
    
    def test_synonym_mapping(self):
        # Resume containing 'k8s' should find 'Kubernetes' skill
        resume_text = "Experience with k8s deployments and ReactJS web apps."
        result = analyze_resume(resume_text)
        self.assertIn("Kubernetes", result["matched_skills"])
        self.assertIn("React", result["matched_skills"])
        
    def test_audit_bullets_compliant(self):
        # A fully compliant STAR bullet point: action verb + metric
        text = "- Spearheaded API migration, reducing response times by 30%."
        bullets = audit_bullets(text)
        self.assertEqual(len(bullets), 1)
        self.assertEqual(bullets[0]["status"], "compliant")
        self.assertTrue(bullets[0]["has_verb"])
        self.assertTrue(bullets[0]["has_metric"])

    def test_audit_bullets_missing_metric(self):
        # Uses action verb but lacks metric
        text = "- Designed and implemented the main microservices architecture."
        bullets = audit_bullets(text)
        self.assertEqual(len(bullets), 1)
        self.assertEqual(bullets[0]["status"], "missing_metric")
        self.assertTrue(bullets[0]["has_verb"])
        self.assertFalse(bullets[0]["has_metric"])

    def test_audit_bullets_missing_verb(self):
        # Lacks action verb but has metric
        text = "- The team achieved a 45% increase in efficiency."
        bullets = audit_bullets(text)
        self.assertEqual(len(bullets), 1)
        self.assertEqual(bullets[0]["status"], "missing_verb")
        self.assertFalse(bullets[0]["has_verb"])
        self.assertTrue(bullets[0]["has_metric"])

    def test_audit_bullets_needs_refactor(self):
        # Lacks both verb and metric
        text = "- Responsible for fixing bugs and handling system tickets."
        bullets = audit_bullets(text)
        self.assertEqual(len(bullets), 1)
        self.assertEqual(bullets[0]["status"], "needs_refactor")
        self.assertFalse(bullets[0]["has_verb"])
        self.assertFalse(bullets[0]["has_metric"])

    def test_layout_multi_column(self):
        # Text representing multiple columns separated by spaces
        text = (
            "Software Engineer                  Jan 2024 - Present\n"
            "Google Inc                          Mountain View, CA\n"
            "Built a distributed system          using Go and microservices\n"
            "Optimized caching layer             increasing speed by 40%"
        )
        layout = check_layout_issues(text)
        self.assertTrue(layout["is_multi_column"])
        # Check if warning for multi_column is added
        warning_types = [w["type"] for w in layout["warnings"]]
        self.assertIn("multi_column", warning_types)

    def test_layout_tabs(self):
        # Tab character present
        text = "Experience:\tSoftware Engineer\tGoogle"
        layout = check_layout_issues(text)
        self.assertTrue(layout["has_tabs"])
        warning_types = [w["type"] for w in layout["warnings"]]
        self.assertIn("tab_spacing", warning_types)

    def test_layout_excessive_caps(self):
        # High ratio of uppercase words
        text = "DEVELOPED COMPLEX DISTRIBUTED ARCHITECTURE WITH REACT AND DOCKER SYSTEM IMPLEMENTATION"
        layout = check_layout_issues(text)
        warning_types = [w["type"] for w in layout["warnings"]]
        self.assertIn("excessive_caps", warning_types)

    def test_extract_sections_custom_headers(self):
        # Checks header regex flexibility
        text = (
            "ABOUT ME\n"
            "Some summary text here.\n"
            "WORK HISTORY & ROLES\n"
            "Worked at Google as software engineer.\n"
            "ACADEMIC DEGREES\n"
            "BS in Computer Science."
        )
        sections = extract_sections(text)
        self.assertNotEqual(sections["summary"], "")
        self.assertNotEqual(sections["experience"], "")
        self.assertNotEqual(sections["education"], "")

if __name__ == "__main__":
    unittest.main()
