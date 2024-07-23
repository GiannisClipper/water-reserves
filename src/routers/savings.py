from fastapi import APIRouter, Query

from .validators import validate_from_date, validate_to_date, validate_reservoir_filter, validate_month_filter

from src.db.savings import select_all

router = APIRouter( prefix="/api/v1/savings" )

@router.get( "" )
async def get_all( 
    from_date: str | None = None, 
    to_date: str | None = None, 
    reservoir_filter: str | None = Query( default=None ),
    month_filter: str | None = Query( default=None )
):
    from_date = validate_from_date( from_date )
    to_date = validate_to_date( to_date )
    reservoir_filter = validate_reservoir_filter( reservoir_filter )
    month_filter = validate_month_filter( month_filter )
    records = await select_all( from_date, to_date, reservoir_filter, month_filter )
    return records