from fastapi import APIRouter
from typing import Annotated
from dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_time_aggregation, validate_year_start
from src.validators.interruptions import validate_municipality_filter, validate_municipality_aggregation

from src.queries.interruptions import InterruptionsPoolQueryFactory
from src.queries.municipalities import MunicipalitiesPoolQueryFactory
from src.helpers.text import get_query_headers

import src.docs as docs

@dataclass
class Legend:
    municipalities: list[ any ] = None

@dataclass
class InterruptionsResponse:
    headers: list[ str ]
    data: list[ list ]
    legend: Legend | None = None

router = APIRouter( prefix="/api/v1/interruptions" )

@router.get( "", tags=[ docs.tag_interruptions ] )
async def get_all( 
    time_range: Annotated[ str | None, AfterValidator( validate_time_range ) ] = None, 
    municipality_filter: Annotated[ str | None, AfterValidator( validate_municipality_filter ) ] = None, 
    interval_filter: Annotated[ str | None, AfterValidator( validate_interval_filter ) ] = None, 
    municipality_aggregation: Annotated[ str | None, AfterValidator( validate_municipality_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, AfterValidator( validate_year_start ) ] = None
):

    query_handler = InterruptionsPoolQueryFactory().handler
    query_handler.maker.select_where(
        time_range, municipality_filter, interval_filter, 
        municipality_aggregation, time_aggregation, year_start
    )
    await query_handler.run_query()

    headers = get_query_headers( query_handler.maker.query )
    data = query_handler.data

    if municipality_aggregation != None:
        return InterruptionsResponse( headers, data )

    query_handler = MunicipalitiesPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    municipalities = query_handler.data
    legend = Legend( municipalities )
    return InterruptionsResponse( headers, data, legend )
