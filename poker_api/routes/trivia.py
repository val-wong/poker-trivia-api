from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_trivia():
    return {"message": "Trivia endpoint works"}
