// React components for ResuMind AI Resume Analyzer

const { useState, useEffect, useRef } = React;

// Simple custom inline SVG Icons component for zero-dependency reliability
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    upload: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    ),
    pdf: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 9h1.5m1.5 0H14m-5 4h5m-5 4h5" />
    ),
    docx: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    txt: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    check: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    ),
    x: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ),
    arrowRight: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    ),
    download: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    ),
    info: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    alert: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    trash: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    ),
    history: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    briefcase: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    sparkles: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    ),
    compare: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    )
  };

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name] || <path d="M12 2v20M2 12h20" strokeWidth={2} />}
    </svg>
  );
};

// Circular gauge component showing resume score
const ScoreGauge = ({ score = 0, label = "Overall Score", colorClass = "text-emerald-500", trackColorClass = "text-slate-800" }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  // Safe display check for extreme scores (EC-25)
  const safeScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-36 h-36 flex items-center justify-center" aria-label={`${label}: ${safeScore} out of 100`} role="progressbar" aria-valuenow={safeScore} aria-valuemin="0" aria-valuemax="100">
        <svg className="w-full h-full transform -rotate-90">
          {/* Track Circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className={`${trackColorClass} stroke-current`}
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress Circle with smooth transition */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className={`${colorClass} stroke-current transition-all duration-1000 ease-out`}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        {/* Score text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-tight text-white">{safeScore}</span>
          <span className="text-xs uppercase font-semibold text-slate-400 mt-0.5">/ 100</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-semibold text-slate-300">{label}</span>
    </div>
  );
};

// Mini score metrics card (Readability, Impact, Formatting, Completeness)
const MetricCard = ({ title, score = 0 }) => {
  const safeScore = Math.max(0, Math.min(100, score));
  
  // Custom feedback strings based on metrics
  const getFeedback = (s) => {
    if (s >= 85) return "Excellent";
    if (s >= 70) return "Good";
    if (s >= 50) return "Average";
    return "Needs Work";
  };
  
  const getColor = (s) => {
    if (s >= 85) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (s >= 70) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (s >= 50) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  };

  return (
    <div className="glass-card rounded-xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-400">{title}</span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getColor(safeScore)}`}>
          {getFeedback(safeScore)}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-3xl font-extrabold text-white">{safeScore}</span>
        <div className="w-2/3 bg-slate-800 h-2 rounded-full overflow-hidden mb-2.5">
          <div 
            className="gradient-primary h-full rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${safeScore}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Section Grades component displaying section evaluation details
const SectionGrade = ({ sectionName, gradeData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const grade = gradeData?.grade || "—";
  const feedback = gradeData?.feedback || "No feedback available for this section.";

  const getColors = (g) => {
    const cleanG = g.toUpperCase();
    if (cleanG === "A") return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" };
    if (cleanG === "B") return { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" };
    if (cleanG === "C") return { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" };
    if (cleanG === "D") return { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" };
    return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" }; // F grade
  };

  const colors = getColors(grade);

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 focus:outline-none hover:bg-slate-900/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white capitalize">{sectionName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 flex items-center justify-center rounded-lg border font-bold text-lg ${colors.bg} ${colors.text} ${colors.border}`}>
            {grade}
          </span>
          <span className={`transform transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
            <Icon name="arrowRight" className="w-4 h-4 text-slate-400" />
          </span>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 border-t border-slate-800 bg-slate-900/10 text-sm text-slate-300 leading-relaxed animate-fade-in pt-3">
          {feedback}
        </div>
      )}
    </div>
  );
};

// Keyword/Skills tag chips component
const KeywordChips = ({ keywords = [], missing = [], title = "Keywords" }) => {
  const hasItems = keywords.length > 0 || missing.length > 0;

  if (!hasItems) {
    return (
      <div className="text-center py-8 text-slate-400 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl">
        <Icon name="info" className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p>No job description was provided to analyze keywords alignment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Matched Keywords */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
            <Icon name="check" className="w-3.5 h-3.5" />
          </span>
          <h3 className="font-semibold text-white">Matched {title} ({keywords.length})</h3>
        </div>
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, i) => (
              <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                {kw}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No exact matches found.</p>
        )}
      </div>

      {/* Missing Keywords */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-400">
            <Icon name="x" className="w-3.5 h-3.5" />
          </span>
          <h3 className="font-semibold text-white">Missing {title} ({missing.length})</h3>
        </div>
        {missing.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, i) => (
              <div 
                key={i} 
                className="relative group text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-help"
              >
                {kw}
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-slate-700 text-slate-200 text-[10px] leading-normal p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-25 text-center">
                  Add this skill to your resume experience or skills section to boost match rate.
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Excellent! You've matched all key identifiers.</p>
        )}
      </div>
    </div>
  );
};

// Suggestion rewrite card showing Original -> Improved
const SuggestionCard = ({ suggestion, index }) => {
  const section = suggestion?.section || "Experience";
  const original = suggestion?.original || "";
  const improved = suggestion?.improved || "";
  const reason = suggestion?.reason || "";

  return (
    <div className="glass-card rounded-xl p-5 hover:scale-[1.005] transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold flex items-center justify-center">
            {index}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            {section}
          </span>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Icon name="info" className="w-3.5 h-3.5 text-slate-500" />
          <span className="italic">{reason}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="bg-rose-950/20 border border-rose-500/10 rounded-lg p-3 text-sm text-slate-300">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-1">Original Text</span>
          <p className="italic line-through leading-relaxed text-slate-400">"{original}"</p>
        </div>
        
        {/* Improved */}
        <div className="bg-emerald-950/25 border border-emerald-500/15 rounded-lg p-3 text-sm text-slate-200">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">Suggested Rewrite</span>
          <p className="font-medium leading-relaxed">"{improved}"</p>
        </div>
      </div>
    </div>
  );
};

// Drag and drop zone component (EC-28)
const UploadZone = ({ file, setFile, title = "Upload Resume" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current && fileInputRef.current.click()}
      className={`glass-card rounded-2xl p-8 border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group ${
        isDragOver 
          ? "border-emerald-500 bg-emerald-500/5 shadow-2xl scale-[1.01]" 
          : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/10"
      }`}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt"
        className="hidden"
      />
      
      {file ? (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon name={file.name.endsWith('.pdf') ? 'pdf' : (file.name.endsWith('.docx') ? 'docx' : 'txt')} className="w-8 h-8" />
          </div>
          <h4 className="text-white font-semibold text-lg max-w-xs truncate">{file.name}</h4>
          <span className="text-xs text-slate-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          
          <button 
            onClick={clearFile}
            className="mt-4 flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Icon name="trash" className="w-3.5 h-3.5" />
            Remove File
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-300">
            <Icon name="upload" className="w-8 h-8" />
          </div>
          <p className="text-white font-medium text-lg">Drop your resume here or click to browse</p>
          <p className="text-xs text-slate-400 mt-2 max-w-xs leading-normal">
            Supported file formats: <span className="font-semibold text-slate-300">PDF, DOCX, TXT</span> (Max size 5MB)
          </p>
        </div>
      )}
    </div>
  );
};

// Main layout components
const App = () => {
  const [page, setPage] = useState("upload");
  
  // Single Resume Upload Flow states
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [uploadState, setUploadState] = useState("idle"); // idle | uploading | parsing | analyzing | done | error
  const [loadingMessage, setLoadingMessage] = useState("Preparing file upload...");
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Error state
  const [errorDetails, setErrorDetails] = useState({ type: null, message: "" });
  
  // Compare Mode State
  const [compFile1, setCompFile1] = useState(null);
  const [compFile2, setCompFile2] = useState(null);
  const [compState, setCompState] = useState("idle"); // idle | analyzing | done | error
  const [compResult1, setCompResult1] = useState(null);
  const [compResult2, setCompResult2] = useState(null);
  const [compError, setCompError] = useState("");

  // History State
  const [historyList, setHistoryList] = useState([]);
  
  const abortControllerRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("resumind_history");
    if (saved) {
      try {
        setHistoryList(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem("resumind_history");
      }
    }
  }, []);

  // Cycling loaders trigger (EC-02 loading screens)
  useEffect(() => {
    if (uploadState === "uploading" || uploadState === "parsing" || uploadState === "analyzing") {
      const messages = [
        "Uploading document securely...",
        "Reading file structure...",
        "Validating format requirements...",
        "Extracting raw document text...",
        "Sanitizing data and checking integrity...",
        "Initializing Local Analysis Engine...",
        "Analyzing resume sections and context...",
        "Reviewing metrics and impact factors...",
        "Scanning skill sets alignment...",
        "Calculating keyword match density...",
        "Checking ATS system compatibility...",
        "Generating rewrite optimization ideas..."
      ];
      let idx = 0;
      setLoadingMessage(messages[idx]);
      
      const interval = setInterval(() => {
        idx = (idx + 1) % messages.length;
        setLoadingMessage(messages[idx]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [uploadState]);

  // Cancel in-flight requests (EC-21)
  const handleCancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setUploadState("idle");
    }
  };

  const handleAnalyzeResume = async () => {
    if (!file) return;

    // Client-side file checks (EC-06, EC-07)
    const allowedExtensions = [".pdf", ".docx", ".txt"];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowedExtensions.includes(fileExt)) {
      setErrorDetails({
        type: "invalid_format",
        message: "Unsupported file format. Please upload a PDF, DOCX, or TXT file."
      });
      setUploadState("error");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrorDetails({
        type: "file_too_large",
        message: "The uploaded file exceeds the 5MB size limit. Please compress your file and try again."
      });
      setUploadState("error");
      return;
    }

    setUploadState("uploading");
    setErrorDetails({ type: null, message: "" });
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("resume", file);
    if (jdText.trim()) {
      formData.append("jd", jdText);
    }

    try {
      // Simulate intermediate states for visual delight
      setTimeout(() => { if (uploadState === "uploading") setUploadState("parsing"); }, 800);
      setTimeout(() => { if (uploadState === "parsing") setUploadState("analyzing"); }, 1800);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { 
          type: errorData.error_type || "api_error", 
          message: errorData.message || "Failed to complete AI analysis." 
        };
      }

      const result = await response.json();
      setAnalysisResult(result);
      setUploadState("done");
      
      // Save item to history
      const newHistoryItem = {
        id: Date.now().toString(),
        fileName: file.name,
        timestamp: new Date().toLocaleString(),
        score: result.overall_score,
        verdict: result.ats_verdict,
        resultData: result
      };
      const updatedHistory = [newHistoryItem, ...historyList].slice(0, 10);
      setHistoryList(updatedHistory);
      localStorage.setItem("resumind_history", JSON.stringify(updatedHistory));
      
      // Auto routing
      setPage("results");

    } catch (err) {
      if (err.name === "AbortError") {
        setUploadState("idle");
        return;
      }
      setErrorDetails({
        type: err.type || "api_error",
        message: err.message || "An unexpected connection error occurred. Please verify your internet and try again."
      });
      setUploadState("error");
    }
  };

  const handleCompareResumes = async () => {
    if (!compFile1 || !compFile2) return;
    
    setCompState("analyzing");
    setCompError("");
    setCompResult1(null);
    setCompResult2(null);
    
    const analyzeSingleFile = async (selectedFile) => {
      const formData = new FormData();
      formData.append("resume", selectedFile);
      
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || `Failed to analyze ${selectedFile.name}`);
      }
      return await response.json();
    };

    try {
      // Run concurrent requests
      const [res1, res2] = await Promise.all([
        analyzeSingleFile(compFile1),
        analyzeSingleFile(compFile2)
      ]);
      
      setCompResult1(res1);
      setCompResult2(res2);
      setCompState("done");
    } catch (err) {
      setCompError(err.message || "Failed to compare files. Please verify that files are valid and try again.");
      setCompState("error");
    }
  };

  const handleSelectHistory = (historyItem) => {
    setAnalysisResult(historyItem.resultData);
    setFile({ name: historyItem.fileName, size: 0 }); // Mock file details
    setPage("results");
  };

  const handleClearHistory = () => {
    localStorage.removeItem("resumind_history");
    setHistoryList([]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("upload")}>
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Icon name="sparkles" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              ResuMind <span className="text-[10px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI</span>
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4">
            <button 
              onClick={() => { setPage("upload"); setUploadState("idle"); setFile(null); }}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                page === "upload" || page === "results" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 hover:text-white"
              }`}
            >
              Analyzer
            </button>
            <button 
              onClick={() => { setPage("compare"); setCompState("idle"); }}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                page === "compare" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon name="compare" className="w-4 h-4" />
              Compare Mode
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow py-8 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Screen 1: Upload Page */}
        {page === "upload" && uploadState !== "uploading" && uploadState !== "parsing" && uploadState !== "analyzing" && (
          <UploadPage 
            file={file} 
            setFile={setFile} 
            jdText={jdText} 
            setJdText={setJdText}
            historyList={historyList}
            handleSelectHistory={handleSelectHistory}
            handleClearHistory={handleClearHistory}
            handleAnalyze={handleAnalyzeResume}
            uploadState={uploadState}
            errorDetails={errorDetails}
          />
        )}

        {/* Screen 2: Loading State */}
        {(uploadState === "uploading" || uploadState === "parsing" || uploadState === "analyzing") && (
          <div className="flex flex-col items-center justify-center max-w-md mx-auto py-20 text-center">
            {/* Spinning slow double concentric loader circles */}
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-blue-500/10 border-t-blue-400 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Resume</h3>
            <p className="text-slate-400 text-sm h-6">{loadingMessage}</p>

            <button 
              onClick={handleCancelAnalysis}
              className="mt-8 text-xs font-semibold px-4 py-2 rounded-lg bg-rose-500/15 border border-rose-500/20 text-rose-400 hover:bg-rose-500/25 transition-colors"
            >
              Cancel Analysis
            </button>
          </div>
        )}

        {/* Screen 3: Results Dashboard */}
        {page === "results" && uploadState === "done" && analysisResult && (
          <ResultsPage 
            result={analysisResult} 
            fileName={file ? file.name : "Resume"}
            onBack={() => setPage("upload")}
          />
        )}

        {/* Screen 4: Compare Mode */}
        {page === "compare" && (
          <ComparePage 
            file1={compFile1}
            setFile1={setCompFile1}
            file2={compFile2}
            setFile2={setCompFile2}
            state={compState}
            result1={compResult1}
            result2={compResult2}
            error={compError}
            handleCompare={handleCompareResumes}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 relative z-10 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} ResuMind. Powered by Local Rule-Based Parsing. All analysis processed securely, offline, and in-memory.</p>
      </footer>
    </div>
  );
};

// Upload Page View Component
const UploadPage = ({ 
  file, 
  setFile, 
  jdText, 
  setJdText, 
  historyList, 
  handleSelectHistory, 
  handleClearHistory,
  handleAnalyze,
  uploadState,
  errorDetails
}) => {
  const [isJdOpen, setIsJdOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Upload Zone & Optional Job Description Input */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Error Alert Display */}
        {uploadState === "error" && errorDetails.message && (
          <div className="p-4 bg-rose-950/30 border border-rose-500/20 rounded-xl flex items-start gap-3 animate-pulse-glow">
            <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
              <Icon name="alert" className="w-5 h-5" />
            </span>
            <div>
              <h4 className="text-rose-200 font-semibold text-sm">Upload Error</h4>
              <p className="text-rose-300/80 text-xs mt-1 leading-normal">{errorDetails.message}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white gradient-text">Optimize Your Resume</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Upload your resume, add your target job description, and leverage advanced AI to identify gaps, optimize keywords, and boost your ATS scoring matches instantly.
          </p>
        </div>

        {/* Upload Component */}
        <UploadZone file={file} setFile={setFile} />

        {/* Collapsible JD Input */}
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300">
          <button 
            onClick={() => setIsJdOpen(!isJdOpen)}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-900/30 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                <Icon name="briefcase" className="w-5 h-5" />
              </span>
              <div className="text-left">
                <h4 className="font-semibold text-white">Target Job Description (Optional)</h4>
                <p className="text-xs text-slate-400 mt-0.5">Analyze matches against specific roles</p>
              </div>
            </div>
            <span className={`transform transition-transform duration-300 ${isJdOpen ? "rotate-90" : ""}`}>
              <Icon name="arrowRight" className="w-4 h-4 text-slate-400" />
            </span>
          </button>

          {isJdOpen && (
            <div className="p-5 border-t border-slate-800 bg-slate-900/10">
              <textarea 
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description keywords, skills, and details here to compare against your resume..."
                rows="6"
                className="w-full rounded-xl p-4 text-sm font-medium leading-relaxed bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              />
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-semibold uppercase">
                <span>Max: 2000 words</span>
                <span>{jdText.trim() ? jdText.split(/\s+/).length : 0} words</span>
              </div>
            </div>
          )}
        </div>

        {/* Trigger Analysis CTA */}
        <button
          onClick={handleAnalyze}
          disabled={!file}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
            file 
              ? "gradient-primary text-white hover:scale-[1.01] hover:shadow-emerald-500/10 shadow-emerald-500/5 cursor-pointer" 
              : "bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed"
          }`}
        >
          <Icon name="sparkles" className="w-5 h-5" />
          Analyze Resume
        </button>
      </div>

      {/* History Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card rounded-2xl p-5 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900 mb-4">
            <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
              <Icon name="history" className="w-4.5 h-4.5 text-slate-400" />
              Recent Scans
            </h3>
            {historyList.length > 0 && (
              <button 
                onClick={handleClearHistory}
                className="text-[10px] font-bold text-slate-500 hover:text-rose-400 transition-colors uppercase"
              >
                Clear
              </button>
            )}
          </div>

          {historyList.length > 0 ? (
            <div className="space-y-3 flex-grow overflow-y-auto max-h-[420px] pr-1">
              {historyList.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectHistory(item)}
                  className="p-3 bg-slate-900/30 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-700/80 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">{item.fileName}</h4>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize ${
                      item.verdict === 'pass' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      (item.verdict === 'partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20')
                    }`}>
                      {item.verdict}
                    </span>
                    <span className="font-bold text-sm text-white">{item.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-10">
              <Icon name="history" className="w-10 h-10 text-slate-800 mb-3" />
              <p className="text-slate-500 text-xs font-medium max-w-[180px] leading-relaxed">
                Your past resume analysis reports will show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Results Page Dashboard Component
const ResultsPage = ({ result, fileName, onBack }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Format and download full JSON report (Deliverable 4)
  const handleDownloadReport = () => {
    const reportData = {
      analysis_date: new Date().toISOString(),
      document_name: fileName,
      ...result
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ResuMind_Report_${fileName.replace(/\.[^/.]+$/, "")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getVerdictDetails = (verdict, score) => {
    if (verdict === "pass") return { text: "Highly Compatible (Pass)", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
    if (verdict === "partial") return { text: "Moderately Compatible (Partial)", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
    return { text: "Critical Refactor Needed (Fail)", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
  };

  const verdict = getVerdictDetails(result.ats_verdict, result.ats_score);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner Warning alerts for edge cases */}
      <div className="space-y-3">
        {result.local_mode && (
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
            <Icon name="check" className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span><strong>Local Privacy Mode:</strong> Your resume has been analyzed 100% locally and privately on your machine. No data is sent to external servers.</span>
          </div>
        )}
        {result.short_resume && (
          <div className="p-3 bg-amber-950/20 border border-amber-500/10 rounded-xl flex items-center gap-2.5 text-xs text-amber-300">
            <Icon name="info" className="w-4 h-4 flex-shrink-0" />
            <span><strong>Your resume is quite short.</strong> Consider adding more detailed experience, projects, or metrics to help showcase your full skills list.</span>
          </div>
        )}
        {result.non_english && (
          <div className="p-3 bg-amber-950/20 border border-amber-500/10 rounded-xl flex items-center gap-2.5 text-xs text-amber-300">
            <Icon name="info" className="w-4 h-4 flex-shrink-0" />
            <span><strong>Non-English Resume Detected:</strong> AI results might be less accurate as localization formats can vary.</span>
          </div>
        )}
        {result.truncated && (
          <div className="p-3 bg-amber-950/20 border border-amber-500/10 rounded-xl flex items-center gap-2.5 text-xs text-amber-300">
            <Icon name="info" className="w-4 h-4 flex-shrink-0" />
            <span><strong>Resume truncated:</strong> Your file was very long. Analysis has been truncated to the first 3 pages (3000 words).</span>
          </div>
        )}
        {result.short_jd && (
          <div className="p-3 bg-amber-950/20 border border-amber-500/10 rounded-xl flex items-center gap-2.5 text-xs text-amber-300">
            <Icon name="info" className="w-4 h-4 flex-shrink-0" />
            <span><strong>Job description is very short:</strong> Keyword matches and skill alignment feedback might be limited.</span>
          </div>
        )}
      </div>

      {/* Header Summary row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={onBack}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 mb-2 focus:outline-none"
          >
            ← Back to Upload
          </button>
          <h2 className="text-2xl font-bold text-white max-w-xl truncate">{fileName}</h2>
          <p className="text-xs text-slate-400 mt-1">Processed successfully. Overview and suggestions loaded.</p>
        </div>
        
        {/* Deliverable 4 Action Button */}
        <button
          onClick={handleDownloadReport}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white flex items-center gap-2 shadow-lg transition-all"
        >
          <Icon name="download" className="w-4 h-4" />
          Export JSON Report
        </button>
      </div>

      {/* Top dashboard summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Score circular gauge */}
        <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-around">
          <ScoreGauge score={result.overall_score} label="Overall Score" colorClass="text-emerald-500" />
          <ScoreGauge score={result.ats_score} label="ATS Score" colorClass="text-blue-500" />
        </div>

        {/* ATS verdict badge card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold">ATS Verdict</h3>
            <span className={`inline-block mt-3 px-3 py-1.5 rounded-lg border font-bold text-sm ${verdict.color}`}>
              {verdict.text}
            </span>
          </div>
          <div className="mt-6">
            <h4 className="text-xs font-bold text-slate-400 mb-1.5 uppercase">Match Summary</h4>
            <p className="text-xs text-slate-300 leading-relaxed italic">"{result.summary_feedback}"</p>
          </div>
        </div>

        {/* Keyword Match card */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Target JD Alignment</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">{result.keyword_match_percent}%</span>
              <span className="text-xs text-slate-400 font-medium">keyword match</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-6">
            <div 
              className="gradient-primary h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${result.keyword_match_percent}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* Tab panel selectors */}
      <div className="border-b border-slate-900 flex flex-wrap gap-2">
        {[
          { id: "overview", label: "Overview" },
          { id: "improvements", label: "Improvement Tips" },
          { id: "skills", label: "Skills" },
          { id: "keywords", label: "Keywords" },
          { id: "grades", label: "Section Grades" },
          { id: "suggestions", label: "Rewrites & Edits" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all focus:outline-none -mb-px ${
              activeTab === tab.id 
                ? "border-emerald-500 text-emerald-400 font-extrabold" 
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab contents (EC-23 Graceful default fallback for null contents) */}
      <div className="min-h-[250px]">
        
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Readability" score={result.metrics?.readability || 0} />
            <MetricCard title="Impact Factor" score={result.metrics?.impact || 0} />
            <MetricCard title="Formatting Audit" score={result.metrics?.formatting || 0} />
            <MetricCard title="Completeness" score={result.metrics?.completeness || 0} />
          </div>
        )}

        {/* Improvements Tab */}
        {activeTab === "improvements" && (
          <div className="space-y-4 max-w-4xl">
            {result.improvements && result.improvements.length > 0 ? (
              result.improvements.map((imp, i) => (
                <div key={i} className="glass-card rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-900">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      {imp.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      imp.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      imp.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {imp.priority} Priority
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-slate-200 mt-4">
                    {imp.tip}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl">
                <Icon name="check" className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <h4 className="font-semibold text-white">Your resume is fully optimized!</h4>
                <p className="text-xs text-slate-400 mt-1">No major improvements needed. Great job!</p>
              </div>
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <KeywordChips 
            keywords={result.matched_skills || []} 
            missing={result.missing_skills || []} 
            title="Skills"
          />
        )}

        {/* Keywords Tab */}
        {activeTab === "keywords" && (
          <KeywordChips 
            keywords={result.matched_keywords || []} 
            missing={result.missing_keywords || []} 
            title="Keywords"
          />
        )}

        {/* Section Grades Tab */}
        {activeTab === "grades" && (
          <div className="space-y-4 max-w-3xl">
            {Object.entries(result.sections || {}).map(([key, secData]) => (
              <SectionGrade key={key} sectionName={key} gradeData={secData} />
            ))}
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === "suggestions" && (
          <div className="space-y-6 max-w-4xl">
            {result.suggestions && result.suggestions.length > 0 ? (
              result.suggestions.map((sug, i) => (
                <SuggestionCard key={i} suggestion={sug} index={i + 1} />
              ))
            ) : (
              <div className="text-center py-10 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl">
                <Icon name="check" className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                <h4 className="font-semibold text-white">No rewrites needed!</h4>
                <p className="text-xs text-slate-400 mt-1">Your resume is well-written!</p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

// Compare Mode View Component
const ComparePage = ({
  file1,
  setFile1,
  file2,
  setFile2,
  state,
  result1,
  result2,
  error,
  handleCompare
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white gradient-text flex items-center gap-2">
          <Icon name="compare" className="w-7 h-7 text-emerald-400" />
          Compare Resumes
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
          Upload two resumes side-by-side to compare overall scoring parameters, system weights, metric performance values, and skill differentials instantly.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-500/20 rounded-xl flex items-center gap-3 text-sm text-rose-300">
          <Icon name="alert" className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File Upload Grids */}
      {state !== "analyzing" && !result1 && !result2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Resume A</h3>
            <UploadZone file={file1} setFile={setFile1} />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Resume B</h3>
            <UploadZone file={file2} setFile={setFile2} />
          </div>
        </div>
      )}

      {/* Loader */}
      {state === "analyzing" && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10 border-t-emerald-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-blue-500/10 border-t-blue-400 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
          </div>
          <h3 className="text-lg font-bold text-white">Comparing Resumes...</h3>
          <p className="text-slate-400 text-xs mt-1.5">Analyzing both documents in parallel</p>
        </div>
      )}

      {/* Trigger CTA */}
      {state !== "analyzing" && !result1 && !result2 && (
        <button
          onClick={handleCompare}
          disabled={!file1 || !file2}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
            file1 && file2
              ? "gradient-primary text-white hover:scale-[1.01] cursor-pointer"
              : "bg-slate-800/50 text-slate-500 border border-slate-800 cursor-not-allowed"
          }`}
        >
          Compare Resumes
        </button>
      )}

      {/* Results Dashboard Comparison */}
      {state === "done" && result1 && result2 && (
        <div className="space-y-8">
          {(result1.local_mode || result2.local_mode) && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
              <Icon name="check" className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span><strong>Local Privacy Mode:</strong> Resumes analyzed 100% locally and privately on your machine.</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pb-4 border-b border-slate-900">
            <div>
              <h3 className="text-lg font-bold text-white">Comparison Results</h3>
              <p className="text-xs text-slate-400 mt-1">Side-by-side performance indicators</p>
            </div>
            <button 
              onClick={() => { setFile1(null); setFile2(null); handleCompare(); }} // Reset
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              Compare New Files
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Resume A Panel */}
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Resume A</span>
                <h4 className="text-white font-bold text-lg truncate mt-0.5">{file1?.name}</h4>
              </div>

              {/* Gauges */}
              <div className="flex justify-around bg-slate-900/20 py-4 rounded-xl">
                <ScoreGauge score={result1.overall_score} label="Overall Score" colorClass="text-emerald-500" />
                <ScoreGauge score={result1.ats_score} label="ATS Score" colorClass="text-blue-500" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Readability</span>
                  <span className="text-xl font-bold text-white mt-1 block">{result1.metrics?.readability || 0}%</span>
                </div>
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Impact</span>
                  <span className="text-xl font-bold text-white mt-1 block">{result1.metrics?.impact || 0}%</span>
                </div>
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Formatting</span>
                  <span className="text-xl font-bold text-white mt-1 block">{result1.metrics?.formatting || 0}%</span>
                </div>
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Completeness</span>
                  <span className="text-xl font-bold text-white mt-1 block">{result1.metrics?.completeness || 0}%</span>
                </div>
              </div>

              {/* Key matched skills */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Skills Detected ({result1.matched_skills?.length || 0})</h5>
                <div className="flex flex-wrap gap-1.5">
                  {(result1.matched_skills || []).slice(0, 8).map((sk, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800">{sk}</span>
                  ))}
                  {result1.matched_skills?.length > 8 && <span className="text-[10px] text-slate-500 self-center">+{result1.matched_skills.length - 8} more</span>}
                </div>
              </div>
            </div>

            {/* Resume B Panel */}
            <div className="glass-card rounded-2xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Resume B</span>
                <h4 className="text-white font-bold text-lg truncate mt-0.5">{file2?.name}</h4>
              </div>

              {/* Gauges */}
              <div className="flex justify-around bg-slate-900/20 py-4 rounded-xl">
                <ScoreGauge score={result2.overall_score} label="Overall Score" colorClass="text-emerald-500" />
                <ScoreGauge score={result2.ats_score} label="ATS Score" colorClass="text-blue-500" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Readability</span>
                  <span className="text-xl font-bold text-white mt-1 block">{result2.metrics?.readability || 0}%</span>
                </div>
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Impact</span>
                  <span className="text-xl font-bold text-white mt-1 block">{result2.metrics?.impact || 0}%</span>
                </div>
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Formatting</span>
                  <span className="text-xl font-bold text-white mt-1 block">{result2.metrics?.formatting || 0}%</span>
                </div>
                <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Completeness</span>
                  <span className="text-xl font-bold text-white mt-1 block">{result2.metrics?.completeness || 0}%</span>
                </div>
              </div>

              {/* Key matched skills */}
              <div>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Skills Detected ({result2.matched_skills?.length || 0})</h5>
                <div className="flex flex-wrap gap-1.5">
                  {(result2.matched_skills || []).slice(0, 8).map((sk, i) => (
                    <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800">{sk}</span>
                  ))}
                  {result2.matched_skills?.length > 8 && <span className="text-[10px] text-slate-500 self-center">+{result2.matched_skills.length - 8} more</span>}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// Render React Application
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}
