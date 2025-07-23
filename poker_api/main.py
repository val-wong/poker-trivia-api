from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pathlib import Path
import json
from datetime import datetime
import random

app = FastAPI(
    title="Poker Trivia API ♠️",
    description="Get daily poker trivia and hand history questions.",
    version="1.0.0"
)

TRIVIA_PATH = Path(__file__).resolve().parent.parent / "trivia_data" / "questions.json"

# Load all trivia questions from file
with open(TRIVIA_PATH, "r", encoding="utf-8") as f:
    questions = json.load(f)

@app.get("/trivia/daily")
def get_daily_trivia():
    today = datetime.utcnow().date().isoformat()
    idx = sum(ord(c) for c in today) % len(questions)
    return questions[idx]

@app.get("/trivia/random")
def get_random_trivia():
    return random.choice(questions)

@app.get("/")
def root():
    return {
        "message": "👋 Welcome to the Poker Trivia API!",
        "docs": "/docs",
        "endpoints": {
            "daily trivia": "/trivia/daily",
            "random trivia": "/trivia/random"
        }
    }
