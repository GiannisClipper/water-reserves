from fastapi import APIRouter
from typing import Annotated
from dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_time_aggregation, validate_year_start
from src.validators.production import validate_factory_aggregation, validate_factory_filter

from src.queries.production import ProductionPoolQueryFactory
from src.queries.factories import FactoriesPoolQueryFactory, Factory
from src.helpers.text import get_query_headers

import src.docs as docs
from src.docs.query import timeRangeQuery, intervalFilterQuery, timeΑggregationQuery, yearStartQuery
from src.docs.query import factoryFilterQuery, factoryΑggregationQuery

@dataclass
class Legend:
    factories: list[ Factory ] = None

@dataclass
class ProductionResponse:
    headers: list[ str ]
    data: list[ list ]
    legend: Legend | None = None

router = APIRouter( prefix="/api/v1/production" )

@router.get( "", tags=[ docs.tag_production ] )
async def get_all( 
    time_range: Annotated[ str | None, timeRangeQuery, AfterValidator( validate_time_range ) ] = None, 
    interval_filter: Annotated[ str | None, intervalFilterQuery, AfterValidator( validate_interval_filter ) ] = None, 
    factory_filter: Annotated[ str | None, factoryFilterQuery, AfterValidator( validate_factory_filter ) ] = None, 
    factory_aggregation: Annotated[ str | None, factoryΑggregationQuery, AfterValidator( validate_factory_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, timeΑggregationQuery, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, yearStartQuery, AfterValidator( validate_year_start ) ] = None
) -> ProductionResponse:

    query_handler = ProductionPoolQueryFactory().handler
    query_handler.maker.select_where(
        time_range, factory_filter, interval_filter, 
        factory_aggregation, time_aggregation, year_start
    )
    await query_handler.run_query()

    headers = get_query_headers( query_handler.maker.query )
    data = query_handler.data

    # headers, data = await select_all( 
    #     time_range, factory_filter, interval_filter, 
    #     factory_aggregation, time_aggregation, year_start
    # )

    if factory_aggregation != None:
        return ProductionResponse( headers, data )
    
    query_handler = FactoriesPoolQueryFactory().handler
    query_handler.maker.select_all()
    await query_handler.run_query()
    factories = query_handler.data
    legend = Legend( factories )
    return ProductionResponse( headers, data, legend )
