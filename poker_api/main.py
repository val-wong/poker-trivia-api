import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from poker_api.routes.trivia import router as trivia_router  # 👈 ADD THIS

load_dotenv()
ENV = os.getenv("ENV", "development")

app = FastAPI()

if ENV == "production":
    allowed_origins = [
        "https://poker-trivia-frontend.onrender.com",
    ]
else:
    allowed_origins = [
        f"http://localhost:{port}" for port in range(5173, 5183)
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trivia_router, prefix="/trivia")  # 👈 ADD THIS
