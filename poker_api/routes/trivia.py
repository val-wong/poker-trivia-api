from fastapi import APIRouter
from pathlib import Path
import json

router = APIRouter()

@router.get("/")
def get_trivia():
    file_path = Path(__file__).resolve().parent.parent / "data" / "questions.json"
    if not file_path.exists():
        return {"error": "questions.json not found"}

    with open(file_path, "r") as f:
        questions = json.load(f)

    return {"questions": questions}
