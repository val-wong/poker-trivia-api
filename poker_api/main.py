import json
import random
from datetime import datetime
from pathlib import Path

from fastapi import FastAPI, Query, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

app = FastAPI(
    title="Poker Trivia API ♠️",
    description="Get daily poker trivia and hand history questions.",
    version="1.0.0"
)

# --- Rate limiting setup ---
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

TRIVIA_PATH = Path(__file__).resolve().parent.parent / "trivia_data" / "questions.json"

# Load trivia questions
with open(TRIVIA_PATH, "r", encoding="utf-8") as f:
    questions = json.load(f)

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

@app.get("/")
@limiter.limit("10/minute")
def root(request: Request):
    return {
        "message": "👋 Welcome to the Poker Trivia API!",
        "docs": "/docs",
        "endpoints": {
            "daily": "/trivia/daily",
            "random": "/trivia/random"
        }
    }

from fastapi import Query

@app.get("/trivia/search")
@limiter.limit("5/minute")
def search_trivia(q: str = Query(..., min_length=1), request: Request = None):
    results = [
        item for item in questions
        if q.lower() in item.get("question", "").lower()
        or q.lower() in item.get("answer", "").lower()
    ]
    return {"query": q, "results": results}

