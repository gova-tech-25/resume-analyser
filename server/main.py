import os
import time
from collections import defaultdict
from fastapi import FastAPI, UploadFile, File, Form, Request, status
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from parser import parse_pdf, parse_docx, parse_txt, process_resume_text, ParsingError
from analyzer import analyze_resume, AnalyzerError

# Load environment variables
load_dotenv()
API_KEY = os.getenv("ANTHROPIC_API_KEY")

app = FastAPI(title="AI Resume Analyzer API")

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom In-Memory Rate Limiter: max 10 requests per minute per IP
rate_limit_records = defaultdict(list)

def check_rate_limit(client_ip: str) -> bool:
    now = time.time()
    # Prune requests older than 60 seconds
    rate_limit_records[client_ip] = [t for t in rate_limit_records[client_ip] if now - t < 60]
    if len(rate_limit_records[client_ip]) >= 10:
        return False
    rate_limit_records[client_ip].append(now)
    return True

def validate_file_content(file_bytes: bytes, filename: str) -> str:
    # Validate 5MB file size limit
    if len(file_bytes) > 5 * 1024 * 1024:
        raise ParsingError("file_too_large", "File size exceeds the 5MB limit.")

    # Validate file format using MIME type signatures (magic numbers)
    # PDF starts with %PDF (0x25 0x50 0x44 0x46)
    if file_bytes.startswith(b'%PDF'):
        return "pdf"
    
    # DOCX starts with PK\x03\x04 (0x50 0x4b 0x03 0x04)
    elif file_bytes.startswith(b'PK\x03\x04'):
        if filename.lower().endswith('.docx'):
            return "docx"
        else:
            raise ParsingError("invalid_format", "Unsupported file format. Please upload a valid Word document (.docx).")
            
    # Plain text detection: try decoding as utf-8 or ascii
    try:
        file_bytes.decode('utf-8')
        return "txt"
    except UnicodeDecodeError:
        pass
        
    raise ParsingError("invalid_format", "Unsupported file format. Only PDF, DOCX, and TXT files are allowed.")

@app.post("/api/analyze")
async def analyze(
    request: Request,
    resume: UploadFile = File(...),
    jd: str = Form(None),
    field: str = Form(None)
):
    # Check rate limits
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"error_type": "rate_limit", "message": "Rate limit exceeded. You can perform up to 10 requests per minute."}
        )
        
    try:
        file_bytes = await resume.read()
        
        # Verify format and size (EC-06, EC-07)
        file_type = validate_file_content(file_bytes, resume.filename)
        
        # Parse text based on verified type (EC-01, EC-02, EC-03, EC-04)
        if file_type == "pdf":
            raw_text = parse_pdf(file_bytes)
        elif file_type == "docx":
            raw_text = parse_docx(file_bytes)
        else:
            raw_text = parse_txt(file_bytes)
            
        # Clean text, mask PII, perform length checks (EC-05, EC-13, EC-14, EC-15, EC-16)
        processed = process_resume_text(raw_text)
        
        if processed["is_non_resume"]:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "error_type": "file_parse",
                    "message": "This doesn't look like a resume (too short). Are you sure you uploaded the right file?"
                }
            )
            
        # Truncate JD if too long (EC-19)
        jd_text = jd
        if jd_text:
            jd_words = jd_text.split()
            if len(jd_words) > 2000:
                jd_text = " ".join(jd_words[:2000])
                
        # Analyze resume locally
        analysis_result = analyze_resume(processed["text"], jd_text, API_KEY, field)
        
        # Add metadata flags to the analysis result for UI warning banners
        analysis_result["short_resume"] = processed["is_short_resume"]
        analysis_result["non_english"] = processed["is_non_english"]
        analysis_result["truncated"] = processed["is_truncated"]
        analysis_result["short_jd"] = False
        if jd_text:
            jd_word_count = len(jd_text.split())
            if jd_word_count < 15:
                analysis_result["short_jd"] = True
                
        return analysis_result
        
    except ParsingError as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error_type": e.code, "message": e.message}
        )
    except AnalyzerError as e:
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        if e.code in ["api_key_missing", "api_key_invalid"]:
            status_code = status.HTTP_401_UNAUTHORIZED
        elif e.code == "api_rate_limit":
            status_code = status.HTTP_429_TOO_MANY_REQUESTS
            
        return JSONResponse(
            status_code=status_code,
            content={"error_type": e.code, "message": e.message}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error_type": "api_error", "message": f"Server processing error: {str(e)}"}
        )

# Serve client application static files
client_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "client"))

# Custom SPA static routing
@app.get("/{path:path}")
async def catch_all(path: str):
    if not os.path.exists(client_dir):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "Frontend build files are missing."}
        )
        
    # Check if requesting a direct static file (e.g. css/js/images)
    file_path = os.path.join(client_dir, path)
    if path and os.path.isfile(file_path):
        return FileResponse(file_path)
        
    # Fallback to index.html for SPA client-side routing
    index_path = os.path.join(client_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
        
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"message": f"Not Found: {path}"}
    )
