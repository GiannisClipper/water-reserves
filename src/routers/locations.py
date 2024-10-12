from fastapi import APIRouter, HTTPException
from src.queries.locations import LocationsPoolQueryFactory

import src.docs as docs

router = APIRouter( prefix="/api/v1/locations" )

@router.get( "", tags=[ docs.tag_weather ] )
async def get_all():

    query_handler = LocationsPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    result = query_handler.data
    return result

@router.get( "/{id}", tags=[ docs.tag_weather ] )
async def get_one_by_id( id: int ):

    query_handler = LocationsPoolQueryFactory().handler
    query_handler.maker.select_by_id( id )
    await query_handler.run_query()

    found = query_handler.data and len( query_handler.data )
    if not found:
        raise HTTPException( 404, detail="The requested id not found." )
    
    result = query_handler.data[ 0 ]
    return result

