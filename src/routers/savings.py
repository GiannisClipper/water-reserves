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
from src.docs.query import timeRangeQuery, intervalFilterQuery, timeΑggregationQuery, yearStartQuery
from src.docs.query import reservoirFilterQuery, reservoirΑggregationQuery

@dataclass
class Legend:
    reservoirs: list[ Reservoir ] = None

@dataclass
class SavingsResponse:
    headers: list[ str ]
    data: list[ tuple ]
    legend: Legend | None = None

router = APIRouter( prefix="/api/v1/savings" )

@router.get( "", tags=[ docs.tag_savings ] )
async def get_all( 
    time_range: Annotated[ str | None, timeRangeQuery, AfterValidator( validate_time_range ) ] = None, 
    interval_filter: Annotated[ str | None, intervalFilterQuery, AfterValidator( validate_interval_filter ) ] = None, 
    reservoir_filter: Annotated[ str | None, reservoirFilterQuery, AfterValidator( validate_reservoir_filter ) ] = None, 
    reservoir_aggregation: Annotated[ str | None, reservoirΑggregationQuery, AfterValidator( validate_reservoir_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, timeΑggregationQuery, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, yearStartQuery, AfterValidator( validate_year_start ) ] = None
) -> SavingsResponse:

    query_handler = SavingsPoolQueryFactory().handler
    query_handler.maker.select_where(
        time_range, reservoir_filter, interval_filter, 
        reservoir_aggregation, time_aggregation, year_start
    )
    await query_handler.run_query()

    headers = get_query_headers( query_handler.maker.query )
    data = query_handler.data

    # if reservoir_aggregation != None:
    #     return SavingsResponse( headers=headers, data=data )
        # return { 'headers': headers, 'data': data }
    
    query_handler = ReservoirsPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    reservoirs = query_handler.data

    if reservoir_filter:
        ids = reservoir_filter.split( ',' )
        reservoirs = list( filter( lambda x: f'{x.id}' in ids, reservoirs ) )

    legend = Legend( reservoirs )
    return SavingsResponse( headers=headers, data=data, legend=legend )
    # return { 'headers': headers, 'data': data, 'legend': legend }
