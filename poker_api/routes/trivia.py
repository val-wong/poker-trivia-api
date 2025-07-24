from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

@router.get("/")
def get_trivia():
    file_path = Path(__file__).resolve().parent.parent / "data" / "questions.json"
    with open(file_path, "r") as f:
        data = json.load(f)
    return data
