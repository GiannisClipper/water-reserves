from fastapi import APIRouter
from typing import Annotated
from dataclasses import dataclass
from pydantic import BaseModel
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_time_aggregation, validate_year_start
from src.validators.savings import validate_reservoir_filter, validate_reservoir_aggregation

from src.queries.savings import SavingsPoolQueryFactory
from src.queries.reservoirs import ReservoirsPoolQueryFactory, Reservoir
from src.helpers.text import get_query_headers

import src.docs as docs

class Legend( BaseModel ):
    reservoirs: list[ Reservoir ] = None

class SavingsResponse( BaseModel ):
    headers: list[ str ]
    data: list[ list ]
    legend: Legend | None = None

router = APIRouter( prefix="/api/v1/savings" )

@router.get( "", tags=[ docs.tag_savings ] )
async def get_all( 
    time_range: Annotated[ str | None, AfterValidator( validate_time_range ) ] = None, 
    reservoir_filter: Annotated[ str | None, AfterValidator( validate_reservoir_filter ) ] = None, 
    interval_filter: Annotated[ str | None, AfterValidator( validate_interval_filter ) ] = None, 
    reservoir_aggregation: Annotated[ str | None, AfterValidator( validate_reservoir_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, AfterValidator( validate_year_start ) ] = None
) -> SavingsResponse:

    query_handler = SavingsPoolQueryFactory().handler
    query_handler.maker.select_where(
        time_range, reservoir_filter, interval_filter, 
        reservoir_aggregation, time_aggregation, year_start
    )
    await query_handler.run_query()

    headers = get_query_headers( query_handler.maker.query )
    data = query_handler.data

    if reservoir_aggregation != None:
        return SavingsResponse( headers, data )
    
    query_handler = ReservoirsPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    reservoirs = query_handler.data
    legend = Legend( reservoirs )
    return SavingsResponse( headers, data, legend )
