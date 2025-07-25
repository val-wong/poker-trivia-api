import os
import json
import random
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()
ENV = os.getenv("ENV", "development")

app = FastAPI()

allowed_origins = (
    ["https://poker-trivia-frontend.onrender.com"]
    if ENV == "production"
    else [
        "http://localhost:5173",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179"
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TRIVIA_PATH = Path(__file__).resolve().parent.parent / "questions.json"

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/trivia/random")
@limiter.limit("50/minute")
def get_random_trivia(request: Request):
    try:
        with open(TRIVIA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return random.choice(data)
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
@limiter.limit("50/minute")
def root(request: Request):
    return {
        "message": "👋 Welcome to the Poker Trivia API!",
        "docs": "/docs",
        "endpoints": {
            "random": "/trivia/random",
        },
    }
