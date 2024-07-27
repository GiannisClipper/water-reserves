from fastapi.testclient import TestClient

from src.main import app

client = TestClient( app )

def test_root():
    response = client.get( "/" )
    assert response.status_code == 200
    assert "up and running" in response.text

def test_path_non_existing():
    response = client.get( "/blah" )
    assert response.status_code == 404
    assert response.json()[ "detail" ] == "Not Found"