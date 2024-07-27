import pytest

@pytest.mark.asyncio
async def test_get_by_id_invalid( client ):
    response = await client.get( "/api/v1/reservoirs/blah" )
    assert response.status_code == 422
    assert 'Input should be a valid integer' in repr( response.text )

@pytest.mark.asyncio
async def test_get_by_id_non_existing( client ):
    response = await client.get( "/api/v1/reservoirs/101" )
    assert response.status_code == 404
    assert 'not found' in repr( response.text )

@pytest.mark.asyncio
async def test_get_by_id_200( client ):
    response = await client.get( "/api/v1/reservoirs/1" )
    assert response.status_code == 200
    assert 'Evinos' in response.text

@pytest.mark.asyncio
async def test_get_all_200( client ):
    response = await client.get( "/api/v1/reservoirs" )
    assert response.status_code == 200
    assert len( response.json() ) == 4
    assert 'Evinos' in response.text

