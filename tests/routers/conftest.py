import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import AsyncClient, ASGITransport
from src.main import app

import pytest
from src.helpers.csv import read_csv, parse_csv_content


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


@pytest.fixture
def assert_against_csv():
    def make_assertion( csvfile, data ):
        expected_headers, expected_data = read_csv( csvfile )
        expected_data = parse_csv_content( expected_data, data[ 0 ] )

        assert len( data ) == len( expected_data )
        for i, row in enumerate( data ):
            for j, value in enumerate( row ):
                print(data[ i ][ j ], expected_data[ i ][ j ])
                assert data[ i ][ j ] == expected_data[ i ][ j ]

    return make_assertion
