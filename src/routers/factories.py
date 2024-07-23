from fastapi import APIRouter

router = APIRouter( prefix="/api/v1/factories" )

@router.get( "" )
async def get_all():
    return []

@router.get( "/{id}" )
async def get_one_by_id( id: int ):
    return { "id": id }

