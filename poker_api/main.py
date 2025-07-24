import os
import json
import random
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()
ENV = os.getenv("ENV", "development")

app = FastAPI()

# --- CORS ---
if ENV == "production":
    allowed_origins = ["https://poker-trivia-frontend.onrender.com"]
else:
    allowed_origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Rate limiting ---
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# --- Load questions ---
TRIVIA_PATH = Path(__file__).resolve().parent.parent / "trivia_data" / "questions.json"
with open(TRIVIA_PATH, "r", encoding="utf-8") as f:
    questions = json.load(f)

# --- Routes ---
@app.get("/")
@limiter.limit("10/minute")
def root(request: Request):
    return {
        "message": "👋 Welcome to the Poker Trivia API!",
        "docs": "/docs",
        "endpoints": {
            "daily": "/trivia/daily",
            "random": "/trivia/random",
            "search": "/trivia/search"
        }
    }

@app.get("/trivia/daily")
@limiter.limit("5/minute")
def get_daily_trivia(request: Request):
    today = datetime.utcnow().date().isoformat()
    idx = sum(ord(c) for c in today) % len(questions)
    return questions[idx]

@app.get("/trivia/random")
@limiter.limit("5/minute")
def get_random_trivia(request: Request):
    return random.choice(questions)

@app.get("/trivia/search")
@limiter.limit("5/minute")
def search_trivia(q: str = Query(..., min_length=1), request: Request = None):
    results = [
        item for item in questions
        if q.lower() in item.get("question", "").lower()
        or q.lower() in item.get("answer", "").lower()
        or any(q.lower() in tag.lower() for tag in item.get("tags", []))
    ]
    return {"query": q, "results": results}
