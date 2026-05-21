import re
import math

class AnalyzerError(Exception):
    def __init__(self, code, message):
        self.code = code
        self.message = message
        super().__init__(message)

# List of common technical and professional skills for local dictionary matching
TECH_SKILLS = [
    "Python", "Javascript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Kotlin", "Swift",
    "HTML", "CSS", "SQL", "NoSQL", "React", "Angular", "Vue", "Next.js", "Express", "Node.js", "FastAPI", "Django", "Flask",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Docker", "Kubernetes", "AWS", "Google Cloud", "GCP", "Azure",
    "Git", "GitHub", "CI/CD", "Jenkins", "Terraform", "Ansible", "Linux", "Nginx", "Apache", "REST API", "GraphQL",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-Learn", "Data Science",
    "Agile", "Scrum", "Jira", "Unit Testing", "Jest", "Pytest", "Selenium", "WebSockets", "Redux", "Tailwind CSS",
    "Bootstrap", "Sass", "Webpack", "Vite", "Serverless", "Microservices", "System Design", "NLP"
]

WEAK_PHRASES = {
    "worked on": {
        "alternatives": ["Engineered", "Developed", "Architected", "Spearheaded"],
        "reason": "Stronger action verb that communicates ownership, creation, and design."
    },
    "responsible for": {
        "alternatives": ["Managed", "Led", "Executed", "Directed"],
        "reason": "Passive phrasing replaced with a proactive, leadership-oriented action verb."
    },
    "helped with": {
        "alternatives": ["Collaborated on", "Facilitated", "Contributed to"],
        "reason": "Vague assistance wording replaced with descriptive collaboration terminology."
    },
    "handled": {
        "alternatives": ["Orchestrated", "Supervised", "Administered"],
        "reason": "Vague task execution replaced with structured ownership action verb."
    },
    "assisted in": {
        "alternatives": ["Supported", "Coordinated", "Reinforced"],
        "reason": "Vague support phrasing replaced with action-oriented teamwork verbs."
    },
    "made": {
        "alternatives": ["Created", "Built", "Designed", "Authored"],
        "reason": "Generic creation verb replaced with descriptive technical output verbs."
    },
    "utilized": {
        "alternatives": ["Leveraged", "Deployed", "Harnessed", "Integrated"],
        "reason": "Generic tool use replaced with strong deployment and leveraging terminology."
    },
    "participated in": {
        "alternatives": ["Engaged in", "Contributed to", "Partnered in"],
        "reason": "Passive attendance phrasing replaced with active collaborative contributions."
    }
}

def extract_sections(text: str) -> dict:
    lines = text.split("\n")
    section_headers = {
        "summary": ["summary", "profile", "professional summary", "about me", "objective", "about"],
        "experience": ["experience", "work history", "employment", "professional experience", "work experience", "history"],
        "education": ["education", "academic", "university", "degrees", "academic background", "credentials"],
        "skills": ["skills", "technical skills", "technologies", "expertise", "skill set", "core competencies"],
        "projects": ["projects", "personal projects", "academic projects", "key projects"]
    }
    
    # Find header lines
    header_lines = []
    for i, line in enumerate(lines):
        line_clean = line.strip().lower().rstrip(":").rstrip()
        if not line_clean:
            continue
        words = line_clean.split()
        if len(words) > 4:
            continue
        
        for sec, patterns in section_headers.items():
            if line_clean in patterns:
                header_lines.append((i, sec))
                break
                
    sections_content = {
        "summary": "",
        "experience": "",
        "education": "",
        "skills": "",
        "projects": ""
    }
    
    if not header_lines:
        # Fallback: put all text under experience
        sections_content["experience"] = text
        return sections_content
        
    header_lines.sort(key=lambda x: x[0])
    
    for idx, (line_idx, sec_name) in enumerate(header_lines):
        start = line_idx + 1
        end = header_lines[idx+1][0] if idx + 1 < len(header_lines) else len(lines)
        sections_content[sec_name] += "\n".join(lines[start:end]).strip() + "\n"
        
    return {k: v.strip() for k, v in sections_content.items()}

def clean_jd_words(jd_text: str) -> list:
    if not jd_text:
        return []
    # Tokenize and keep alphanumeric words
    words = re.findall(r"\b[a-zA-Z0-9_\-\.#\+]+\b", jd_text.lower())
    stop_words = {
        "the", "and", "a", "of", "to", "in", "for", "with", "on", "at", "by", "from", "an", "is", "are", "that", 
        "this", "our", "you", "your", "we", "us", "it", "its", "their", "will", "can", "should", "must", "required", 
        "preferred", "experience", "work", "job", "role", "team", "years", "candidate", "about", "looking", "skills",
        "description", "position", "ability", "strong", "written", "verbal", "communication", "knowledge", "understanding"
    }
    cleaned = [w for w in words if w not in stop_words and len(w) > 2]
    return list(set(cleaned))

def analyze_resume(resume_text: str, jd_text: str = None, api_key: str = None) -> dict:
    """
    Analyzes resume text completely locally without external API dependencies.
    Computes scores, grades sections, extracts skill keywords, and suggests edits.
    """
    resume_lower = resume_text.lower()
    sections = extract_sections(resume_text)
    
    # 1. Section Grading and Feedback
    section_eval = {}
    for sec_name, sec_content in sections.items():
        words_count = len(sec_content.split())
        if words_count == 0:
            section_eval[sec_name] = {
                "grade": "F",
                "feedback": f"The {sec_name.capitalize()} section is missing. Including this is critical for a complete resume."
            }
        elif words_count < 15:
            section_eval[sec_name] = {
                "grade": "C",
                "feedback": f"The {sec_name.capitalize()} section is very brief. Expand it with details to highlight your background."
            }
        else:
            feedback_messages = {
                "summary": "Your profile summary is concise and sets a solid professional tone.",
                "experience": "Your work history lists clear technical responsibilities and roles.",
                "education": "Education credentials are clear and formatted correctly.",
                "skills": "Technical competencies and tools stack are well structured.",
                "projects": "Project descriptions effectively outline your practical capabilities."
            }
            section_eval[sec_name] = {
                "grade": "A" if words_count > 40 else "B",
                "feedback": feedback_messages.get(sec_name, "Section formatting is complete.")
            }
            
    # 2. Tech Skills dictionary matching
    found_skills = []
    for skill in TECH_SKILLS:
        # Match using word boundaries. Match C# and C++ correctly by escaping
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, resume_lower):
            found_skills.append(skill)
            
    # 3. Job Description Overlap analysis
    matched_skills = []
    missing_skills = []
    matched_keywords = []
    missing_keywords = []
    keyword_match_percent = 0
    
    if jd_text:
        jd_lower = jd_text.lower()
        jd_words = clean_jd_words(jd_text)
        
        # 3.1 Tech skills in JD
        jd_tech_skills = []
        for skill in TECH_SKILLS:
            pattern = r"\b" + re.escape(skill.lower()) + r"\b"
            if re.search(pattern, jd_lower):
                jd_tech_skills.append(skill)
                
        # Calculate skill matches
        for skill in jd_tech_skills:
            if skill in found_skills:
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)
                
        # 3.2 General keywords in JD (words with high frequencies or specific nouns)
        # Find matches against all cleaned JD words
        jd_word_matches = []
        jd_word_missing = []
        for word in jd_words:
            pattern = r"\b" + re.escape(word) + r"\b"
            if re.search(pattern, resume_lower):
                jd_word_matches.append(word.capitalize())
            else:
                jd_word_missing.append(word.capitalize())
                
        matched_keywords = jd_word_matches[:6]
        missing_keywords = jd_word_missing[:6]
        
        # Calculate overlap percentage
        total_jd_skills = len(jd_tech_skills)
        if total_jd_skills > 0:
            keyword_match_percent = int((len(matched_skills) / total_jd_skills) * 100)
        else:
            # Fallback to general keywords match if no tech skills are found in JD
            total_jd_words = len(jd_words)
            if total_jd_words > 0:
                keyword_match_percent = int((len(jd_word_matches) / total_jd_words) * 100)
            else:
                keyword_match_percent = 0
    else:
        # Fallback if no JD is provided
        matched_skills = found_skills
        # Suggest complementary skills from tech stack
        missing_skills = [s for s in TECH_SKILLS if s not in found_skills][:5]
        keyword_match_percent = 0
        matched_keywords = []
        missing_keywords = []
        
    # 4. Metrics Heuristics
    # 4.1 Completeness
    present_sections = sum(1 for c in sections.values() if len(c.strip()) > 0)
    completeness = min(100, present_sections * 20)
    
    # 4.2 Readability
    sentences = re.split(r"[.!?]\s+", resume_text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 1]
    if sentences:
        total_words = len(resume_text.split())
        avg_sentence_len = total_words / len(sentences)
        # Sentence length of 12-18 is optimal. Penalize deviations
        readability = int(100 - abs(avg_sentence_len - 15) * 3)
    else:
        readability = 75
    readability = max(40, min(95, readability))
    
    # 4.3 Formatting
    has_bullets = len(re.findall(r"(?:^|\n)\s*[\-\*\•]\s+", resume_text)) > 0
    formatting = 85 if has_bullets else 60
    # Deduct points if sections are missing
    formatting -= (5 - present_sections) * 5
    formatting = max(45, min(95, formatting))
    
    # 4.4 Impact (Metrics & Action Verbs)
    # Search for numeric metrics (e.g. 15%, $50K, 100,000, 10x)
    metrics_matches = re.findall(r"\b(?:\d+%\s*|\$\d+(?:\.\d+)?\s*(?:k|m|b|K|M|B)?\s*|\d+\s*(?:k|m|b|K|M|B)\s*|\d+x\b|\d{2,}\b)", resume_text)
    # Search for strong action verbs
    action_verbs = ["designed", "engineered", "implemented", "optimized", "spearheaded", "architected", "managed", "deployed", "reduced", "increased", "delivered", "facilitated", "orchestrated", "led", "developed", "built"]
    found_verbs = [v for v in action_verbs if r"\b" + v + r"\b" in resume_lower]
    
    impact = int(45 + len(metrics_matches) * 8 + len(found_verbs) * 5)
    impact = min(98, impact)
    
    # 5. Dynamic Rewrite Suggestions
    suggestions = []
    lines = resume_text.split("\n")
    for line in lines:
        line_strip = line.strip().lstrip("-*•").strip()
        if len(line_strip) < 15 or len(line_strip) > 150:
            continue
        line_lower = line_strip.lower()
        for phrase, details in WEAK_PHRASES.items():
            if phrase in line_lower:
                # Found a weak bullet! Suggest an active rewrite
                # Replace weak phrase with a random strong alternative
                alt = details["alternatives"][0]
                # Capitalize alt if it is at the start of sentence
                improved_text = re.sub(r"\b" + re.escape(phrase) + r"\b", alt.lower(), line_strip, flags=re.I)
                # Ensure first letter is capitalized
                improved_text = improved_text[0].upper() + improved_text[1:]
                
                # Append standard mock metric suffix to suggest quantification
                improved_text += ", resulting in a 15% increase in operational efficiency."
                
                # Deduplicate suggestions by original text
                if not any(s["original"] == line_strip for s in suggestions):
                    suggestions.append({
                        "section": "Experience",
                        "original": line_strip,
                        "improved": improved_text,
                        "reason": details["reason"]
                    })
                    
        if len(suggestions) >= 3:
            break
            
    # Default fallback suggestions if none are detected
    if not suggestions:
        if impact < 70:
            suggestions.append({
                "section": "Experience",
                "original": "Helped develop features for the company product dashboard.",
                "improved": "Collaborated with team to architect 4 core features on the main product dashboard, improving dashboard response rate by 22%.",
                "reason": "Quantifies results and exchanges 'helped develop' for a stronger action verb."
            })
        if formatting < 75:
            suggestions.append({
                "section": "Skills",
                "original": "Have experience working with Python, Javascript, AWS, and Git.",
                "improved": "Technical Skills: Python, Javascript, AWS, Git",
                "reason": "Formats bullet points as list tags for easier ATS resume parser readability scanning."
            })
            
    # 6. Overall & ATS Score
    base_score = int(0.2 * completeness + 0.25 * readability + 0.25 * formatting + 0.3 * impact)
    
    if jd_text:
        ats_score = int(base_score * 0.6 + keyword_match_percent * 0.4)
    else:
        ats_score = base_score
        
    overall_score = base_score
    
    # Verdict mapping
    if ats_score >= 80:
        ats_verdict = "pass"
    elif ats_score >= 65:
        ats_verdict = "partial"
    else:
        ats_verdict = "fail"
        
    # Construct Summary Feedback
    feedback_parts = []
    if present_sections < 5:
        missing_names = [k.capitalize() for k, v in sections.items() if not v.strip()]
        feedback_parts.append(f"Missing core resume sections: {', '.join(missing_names)}.")
    else:
        feedback_parts.append("Your resume has a complete structure with all standard sections represented.")
        
    if impact < 70:
        feedback_parts.append("Consider adding more numeric metrics and quantitative outcomes to your experience description bullet points to increase impact.")
    else:
        feedback_parts.append("Great job incorporating numerical metrics and active verbs to express your achievements.")
        
    if jd_text:
        if keyword_match_percent < 50:
            feedback_parts.append(f"Your match rate with the job description is low ({keyword_match_percent}%). Integrate more missing keywords like {', '.join(missing_keywords[:3])} to optimize alignment.")
        else:
            feedback_parts.append(f"Strong keyword alignment ({keyword_match_percent}%) with the target role description.")
            
    summary_feedback = " ".join(feedback_parts)
    
    return {
        "overall_score": overall_score,
        "ats_score": ats_score,
        "ats_verdict": ats_verdict,
        "keyword_match_percent": keyword_match_percent,
        "sections": section_eval,
        "metrics": {
            "readability": readability,
            "impact": impact,
            "formatting": formatting,
            "completeness": completeness
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "suggestions": suggestions,
        "summary_feedback": summary_feedback,
        "local_mode": True # Mark that this was evaluated locally by our fast offline engine
    }
