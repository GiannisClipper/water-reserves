from fastapi import APIRouter, Request, HTTPException
from src.queries.municipalities import MunicipalitiesPoolQueryFactory

import src.docs as docs

router = APIRouter( prefix="/api/v1/municipalities" )

@router.get( "", tags=[ docs.tag_interruptions ] )
async def get_all( request: Request ):

    query_handler = MunicipalitiesPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    result = query_handler.data
    return result

@router.get( "/{id}", tags=[ docs.tag_interruptions ] )
async def get_one_by_id( id: int ):

    query_handler = MunicipalitiesPoolQueryFactory().handler
    query_handler.maker.select_by_id( id )
    await query_handler.run_query()

    found = query_handler.data and len( query_handler.data )
    if not found:
        raise HTTPException( 404, detail="The requested id not found." )
    
    result = query_handler.data[ 0 ]
    return result

