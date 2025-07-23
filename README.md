# 🃏 Poker Trivia API

A public FastAPI app serving daily poker trivia questions and hand history scenarios.

## 🔥 Features

- `/trivia/daily` — one trivia question per day (rotates)
- `/trivia/random` — random poker trivia from the deck
- Swagger UI auto-generated at `/docs`

## 🛠 Tech Stack

- FastAPI
- Render (deployment)
- GitHub Actions (CI)
- JSON data source for trivia

## 🧪 Local Dev

```bash
uvicorn poker_api.main:app --reload
