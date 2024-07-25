from fastapi import APIRouter, Query
from typing import Annotated
from pydantic.functional_validators import AfterValidator

from .validators import validate_from_time, validate_to_time
from .validators import validate_reservoir_filter, validate_interval_filter
from .validators import validate_reservoir_aggregation, validate_time_aggregation, validate_year_start

from src.db.savings import select_all

router = APIRouter( prefix="/api/v1/savings" )

@router.get( "" )
async def get_all( 
    from_time: Annotated[ str | None, AfterValidator( validate_from_time ) ] = None, 
    to_time: Annotated[ str | None, AfterValidator( validate_to_time ) ] = None, 
    reservoir_filter: Annotated[ str | None, AfterValidator( validate_reservoir_filter ) ] = None, 
    interval_filter: Annotated[ str | None, AfterValidator( validate_interval_filter ) ] = None, 
    reservoir_aggregation: Annotated[ str | None, AfterValidator( validate_reservoir_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, AfterValidator( validate_year_start ) ] = None
):

    records = await select_all( 
        from_time, to_time, 
        reservoir_filter, interval_filter, 
        reservoir_aggregation, time_aggregation, year_start
    )

    return records