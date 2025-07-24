from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from poker_api.routes.trivia import router as trivia_router  # ✅ THIS LINE

load_dotenv()
ENV = os.getenv("ENV", "development")

app = FastAPI()

# CORS setup
allowed_origins = (
    ["https://poker-trivia-frontend.onrender.com"]
    if ENV == "production"
    else [f"http://localhost:517{i}" for i in range(3, 11)]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trivia_router, prefix="/trivia")  # ✅ THIS LINE
