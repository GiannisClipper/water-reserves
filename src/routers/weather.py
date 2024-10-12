from fastapi import APIRouter
from typing import Annotated
from dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_time_aggregation, validate_year_start
from src.validators.weather import validate_location_aggregation, validate_location_filter

from src.queries.weather import WeatherPoolQueryFactory
from src.queries.locations import LocationsPoolQueryFactory
from src.helpers.text import get_query_headers

import src.docs as docs

@dataclass
class Legend:
    locations: list[ any ] = None

@dataclass
class WeatherResponse:
    headers: list[ str ]
    data: list[ list ]
    legend: Legend | None = None

router = APIRouter( prefix="/api/v1/weather" )

@router.get( "", tags=[ docs.tag_weather ] )
async def get_all( 
    time_range: Annotated[ str | None, AfterValidator( validate_time_range ) ] = None, 
    location_filter: Annotated[ str | None, AfterValidator( validate_location_filter ) ] = None, 
    interval_filter: Annotated[ str | None, AfterValidator( validate_interval_filter ) ] = None, 
    location_aggregation: Annotated[ str | None, AfterValidator( validate_location_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, AfterValidator( validate_year_start ) ] = None
):

    query_handler = WeatherPoolQueryFactory().handler
    query_handler.maker.select_where(
        time_range, location_filter, interval_filter, 
        location_aggregation, time_aggregation, year_start
    )
    await query_handler.run_query()

    headers = get_query_headers( query_handler.maker.query )
    data = query_handler.data

    if location_aggregation != None:
        return WeatherResponse( headers, data )
    
    query_handler = LocationsPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    locations = query_handler.data
    legend = Legend( locations )
    return WeatherResponse( headers, data, legend )
