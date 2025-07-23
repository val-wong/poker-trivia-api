import pytest
from httpx import AsyncClient, ASGITransport
from poker_api.main import app

@pytest.mark.asyncio
async def test_root():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

@pytest.mark.asyncio
async def test_daily_trivia():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/trivia/daily")
    assert response.status_code == 200
    assert "question" in response.json()

@pytest.mark.asyncio
async def test_random_trivia():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/trivia/random")
    assert response.status_code == 200
    assert "question" in response.json()
