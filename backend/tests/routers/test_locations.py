import pytest

@pytest.mark.asyncio
async def test_get_by_id_invalid( client ):
    response = await client.get( "/api/v1/locations/blah" )
    assert response.status_code == 422
    assert 'Input should be a valid integer' in repr( response.text )

@pytest.mark.asyncio
async def test_get_by_id_non_existing( client ):
    response = await client.get( "/api/v1/locations/101" )
    assert response.status_code == 404
    assert 'not found' in repr( response.text )

@pytest.mark.asyncio
async def test_get_by_id_200( client ):
    response = await client.get( "/api/v1/locations/1" )
    assert response.status_code == 200
    assert 'Athens' in response.text

@pytest.mark.asyncio
async def test_get_all_200( client ):
    response = await client.get( "/api/v1/locations" )
    assert response.status_code == 200
    assert len( response.json() ) == 8
    assert 'Athens' in response.text

