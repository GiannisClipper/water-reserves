from fastapi import APIRouter, Query

from .validators import validate_from_time, validate_to_time, validate_reservoir_filter, validate_month_filter

from src.db.savings import select_all

router = APIRouter( prefix="/api/v1/savings" )

@router.get( "" )
async def get_all( 
    from_time: str | None = None, 
    to_time: str | None = None, 
    reservoir_filter: str | None = Query( default=None ),
    month_filter: str | None = Query( default=None ),
):
    from_time = validate_from_time( from_time )
    to_time = validate_to_time( to_time )
    reservoir_filter = validate_reservoir_filter( reservoir_filter )
    month_filter = validate_month_filter( month_filter )
    records = await select_all( from_time, to_time, reservoir_filter, month_filter )
    return records