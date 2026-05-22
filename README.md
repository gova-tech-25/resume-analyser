# ResuMind 🚀

🌐 **Live Demo:** [https://resume-analyser-zuca.onrender.com/](https://resume-analyser-zuca.onrender.com/)

ResuMind is a premium, full-stack **Resume Analyzer & ATS Optimizer** that runs **100% locally and privately**. There are zero external API dependencies (like Anthropic or OpenAI), which means your documents are parsed, analyzed, and rewritten securely, offline, and in-memory. No private data is ever sent to external cloud servers, and it runs at **zero cost** with instant response times.

---

## ✨ Features

- 📁 **Multi-Format Document Parsing:** Drag-and-drop support for **PDF**, **DOCX**, and **TXT** files.
- 🔒 **PII Redaction/Sanitizer:** Automatically masks sensitive personal identifiers (email addresses, phone numbers, and Social Security Numbers) to protect candidate privacy.
- 🎯 **ATS Keyword Match & Alignment:** Evaluates your resume against a target **Job Description** to identify matched skills, identify gaps, and calculate a matching score.
- 📊 **Audited Performance Metrics:** Graded scorecards assessing:
  - **Completeness:** Verifies if standard sections are present.
  - **Readability:** Evaluates sentence structures and spacing density.
  - **Formatting Audit:** Scans for clean layouts and bullet points.
  - **Impact Factor:** Assesses the presence of action verbs and quantifiable metrics.
- 💡 **Passive-to-Active Suggestion Engine:** Scans descriptions for weak/passive verbs (*"worked on"*, *"helped with"*, *"responsible for"*) and rewrites them using strong action verbs (*"spearheaded"*, *"engineered"*, *"orchestrated"*) with metric placeholders.
- 🆚 **Compare Mode:** Upload two resumes side-by-side to compare metrics, scores, and skills concurrently.
- 💾 **Scan History:** Caches up to 10 past scans in your browser's local storage for easy reference.
- 📤 **Export Report:** Export your fully parsed resume data and analyzer results as a downloadable JSON report.

---

## 🛠️ Technology Stack

### Backend (`/server`)
- **Core:** Python FastAPI (highly scalable, synchronous/asynchronous routing)
- **Parser Engine:** `pypdf` (PDF extraction) and `python-docx` (Word processing)
- **Server:** `uvicorn`

### Frontend (`/client`)
- **Core Framework:** React 18 & Babel (Single Page Application architecture)
- **Styling:** Tailwind CSS 3 (curated dark glassmorphism palette & custom animations)
- **Icons:** Lucide Icons

---

## 🚀 Installation & Running Locally

### Prerequisites
- Python 3.9 or higher

### Step 1: Set Up Python Virtual Environment
Navigate to the `server/` directory and set up a virtual environment:

```bash
cd server
python -m venv venv
```

Activate the environment:
- **Windows:**
  ```powershell
  .\venv\Scripts\activate
  ```
- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

### Step 2: Install Dependencies
Install all required backend packages:
```bash
pip install -r requirements.txt
```

### Step 3: Run the Application
Start the FastAPI server:
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 5000 --reload
```

### Step 4: Open in Web Browser
Open your browser and visit:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 📈 Local Rule-Based Analysis Architecture

Unlike cloud-based AI tools, ResuMind uses advanced local heuristic rules:
- **Section Detection:** Scans text structures using token boundaries to isolate headers (Summary, Experience, Education, Skills, Projects).
- **Skills Scanning:** Utilizes a local dictionary of over **50+ technical and professional skills** (React, Docker, Python, AWS, etc.) and performs dictionary intersection matching against the document and job descriptions.
- **Verb Rewriting:** Leverages regular expressions to isolate phrases containing weak verbs, maps them to dynamic replacement candidates, and appends metric suggestion templates to guide the user in highlighting outcomes.
