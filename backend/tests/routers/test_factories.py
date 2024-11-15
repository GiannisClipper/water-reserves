import pytest

@pytest.mark.asyncio
async def test_get_by_id_invalid( client ):
    response = await client.get( "/api/v1/factories/blah" )
    assert response.status_code == 422
    assert 'Input should be a valid integer' in repr( response.text )

@pytest.mark.asyncio
async def test_get_by_id_non_existing( client ):
    response = await client.get( "/api/v1/factories/101" )
    assert response.status_code == 404
    assert 'not found' in repr( response.text )

@pytest.mark.asyncio
async def test_get_by_id_200( client ):
    response = await client.get( "/api/v1/factories/1" )
    assert response.status_code == 200
    assert 'Aspropyrgos' in response.text

@pytest.mark.asyncio
async def test_get_all_200( client ):
    response = await client.get( "/api/v1/factories" )
    assert response.status_code == 200
    assert len( response.json() ) == 4
    assert 'Aspropyrgos' in response.text

