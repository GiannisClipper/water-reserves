from fastapi import APIRouter, HTTPException
from src.queries.factories import FactoriesPoolQueryFactory
import src.docs as docs
from src.queries.factories import Factory

router = APIRouter( prefix="/api/v1/factories" )

@router.get( "", tags=[ docs.tag_production ] )
async def get_all() -> list[ Factory ]:

    query_handler = FactoriesPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    result = query_handler.data
    return result

@router.get( "/{id}", tags=[ docs.tag_production ] )
async def get_one_by_id( id: int ) -> Factory:

    query_handler = FactoriesPoolQueryFactory().handler
    query_handler.maker.select_by_id( id )
    await query_handler.run_query()

    found = query_handler.data and len( query_handler.data )
    if not found:
        raise HTTPException( 404, detail="The requested id not found." )
    
    result = query_handler.data[ 0 ]
    return result