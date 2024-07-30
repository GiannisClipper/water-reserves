from fastapi import APIRouter
from typing import Annotated
from pydantic.dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_time_aggregation, validate_year_start
from src.validators.weather import validate_location_aggregation, validate_location_filter

from src.db.weather import select_all

@dataclass
class WeatherResponse:
    headers: list[ str ]
    data: list[ list ]

router = APIRouter( prefix="/api/v1/weather" )

@router.get( "" )
async def get_all( 
    time_range: Annotated[ str | None, AfterValidator( validate_time_range ) ] = None, 
    location_filter: Annotated[ str | None, AfterValidator( validate_location_filter ) ] = None, 
    interval_filter: Annotated[ str | None, AfterValidator( validate_interval_filter ) ] = None, 
    location_aggregation: Annotated[ str | None, AfterValidator( validate_location_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, AfterValidator( validate_year_start ) ] = None
):

    headers, data = await select_all( 
        time_range, location_filter, interval_filter, 
        location_aggregation, time_aggregation, year_start
    )

    return WeatherResponse( headers, data )