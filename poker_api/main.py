import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from poker_api.routes.trivia import router as trivia_router

load_dotenv()
ENV = os.getenv("ENV", "development")

app = FastAPI()

if ENV == "production":
    allowed_origins = [
        "https://poker-trivia-frontend.onrender.com",
    ]
else:
    allowed_origins = [
        "http://localhost:5173",
        # (others if needed)
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 Register the trivia router
app.include_router(trivia_router, prefix="/trivia")
