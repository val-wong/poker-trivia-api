from httpx import AsyncClient
from httpx import ASGITransport

transport = ASGITransport(app=app)
async with AsyncClient(transport=transport, base_url="http://test") as ac:

@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
        assert response.status_code == 200
        assert "message" in response.json()

@pytest.mark.asyncio
async def test_daily_trivia():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/trivia/daily")
        assert response.status_code == 200
        assert isinstance(response.json(), dict)

@pytest.mark.asyncio
async def test_random_trivia():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/trivia/random")
        assert response.status_code == 200
        assert isinstance(response.json(), dict)
