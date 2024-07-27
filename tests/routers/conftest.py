import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import AsyncClient, ASGITransport

from src.main import app

# Pytest with async tests: test setup before and after
# https://stackoverflow.com/questions/74351637/pytest-with-async-tests-test-setup-before-and-after

@pytest_asyncio.fixture( autouse=True, scope="session" )
async def setup_pool():
    async with LifespanManager( app ) as manager:
        yield manager.app

@pytest_asyncio.fixture( scope="session" )
async def client( setup_pool ):
    transport = ASGITransport( app=app )
    async with AsyncClient( transport=transport, base_url="http://127.0.0.1:8000" ) as client:
        yield client
