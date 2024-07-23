from fastapi import APIRouter, HTTPException
from src.db.locations import select_all, select_one_by_id

router = APIRouter( prefix="/api/v1/locations" )

@router.get( "" )
async def get_all():
    records = await select_all()
    return records

@router.get( "/{id}" )
async def get_one_by_id( id: int ):
    record = await select_one_by_id( id )
    if not record:
        raise HTTPException( 404, detail="The requested id not found." )
    return record

