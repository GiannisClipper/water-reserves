from fastapi import APIRouter
from typing import Annotated
from pydantic.dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_time_aggregation, validate_year_start
from src.validators.savings import validate_reservoir_filter, validate_reservoir_aggregation

from src.db.savings import select_all

@dataclass
class SavingsResponse:
    headers: list[ str ]
    data: list[ list ]

router = APIRouter( prefix="/api/v1/savings" )

@router.get( "" )
async def get_all( 
    time_range: Annotated[ str | None, AfterValidator( validate_time_range ) ] = None, 
    reservoir_filter: Annotated[ str | None, AfterValidator( validate_reservoir_filter ) ] = None, 
    interval_filter: Annotated[ str | None, AfterValidator( validate_interval_filter ) ] = None, 
    reservoir_aggregation: Annotated[ str | None, AfterValidator( validate_reservoir_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, AfterValidator( validate_year_start ) ] = None
):

    headers, data = await select_all( 
        time_range, reservoir_filter, interval_filter, 
        reservoir_aggregation, time_aggregation, year_start
    )

    return SavingsResponse( headers, data )