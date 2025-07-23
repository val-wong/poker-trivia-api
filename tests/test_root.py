from fastapi.testclient import TestClient
from poker_api.main import app

client = TestClient(app)

def test_root_route():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "endpoints" in data
    assert "/trivia/daily" in data["endpoints"].values()
