from fastapi import APIRouter, Query

from .validators import validate_from_time, validate_to_time
from .validators import validate_reservoir_filter, validate_month_filter
from .validators import validate_reservoir_aggregation

from src.db.savings import select_all

router = APIRouter( prefix="/api/v1/savings" )

@router.get( "" )
async def get_all( 
    from_time: str | None = None, 
    to_time: str | None = None, 
    reservoir_filter: str | None = Query( default=None ),
    month_filter: str | None = Query( default=None ),
    reservoir_aggregation: str | None = None,
):
    from_time = validate_from_time( from_time )
    to_time = validate_to_time( to_time )

    reservoir_filter = validate_reservoir_filter( reservoir_filter )
    month_filter = validate_month_filter( month_filter )
    
    reservoir_aggregation = validate_reservoir_aggregation( reservoir_aggregation )
    
    records = await select_all( from_time, to_time, reservoir_filter, month_filter, reservoir_aggregation )
    return records