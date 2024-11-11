from fastapi import APIRouter
from typing import Annotated
from dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_time_aggregation, validate_year_start
from src.validators.weather import validate_location_aggregation, validate_location_filter

from src.queries.weather import WeatherPoolQueryFactory
from src.queries.locations import LocationsPoolQueryFactory, Location
from src.helpers.text import get_query_headers

import src.docs as docs
from src.docs.query import timeRangeQuery, intervalFilterQuery, timeΑggregationQuery, yearStartQuery
from src.docs.query import locationFilterQuery, locationΑggregationQuery

@dataclass
class Legend:
    locations: list[ Location ] = None

@dataclass
class WeatherResponse:
    headers: list[ str ]
    data: list[ tuple ]
    legend: Legend | None = None

router = APIRouter( prefix="/api/v1/weather" )

@router.get( "", tags=[ docs.tag_weather ] )
async def get_all( 
    time_range: Annotated[ str | None, timeRangeQuery, AfterValidator( validate_time_range ) ] = None, 
    interval_filter: Annotated[ str | None, intervalFilterQuery, AfterValidator( validate_interval_filter ) ] = None, 
    location_filter: Annotated[ str | None, locationFilterQuery, AfterValidator( validate_location_filter ) ] = None, 
    location_aggregation: Annotated[ str | None, locationΑggregationQuery, AfterValidator( validate_location_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, timeΑggregationQuery, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, yearStartQuery, AfterValidator( validate_year_start ) ] = None
) -> WeatherResponse:

    query_handler = WeatherPoolQueryFactory().handler
    query_handler.maker.select_where(
        time_range, location_filter, interval_filter, 
        location_aggregation, time_aggregation, year_start
    )
    await query_handler.run_query()

    headers = get_query_headers( query_handler.maker.query )
    data = query_handler.data

    if location_aggregation != None:
        return WeatherResponse( headers=headers, data=data )
    
    query_handler = LocationsPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    locations = query_handler.data

    if location_filter:
        ids = location_filter.split( ',' )
        locations = list( filter( lambda x: f'{x.id}' in ids, locations ) )

    legend = Legend( locations )
    return WeatherResponse( headers=headers, data=data, legend=legend )
