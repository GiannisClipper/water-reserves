from fastapi import APIRouter
from typing import Annotated
from dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_time_aggregation, validate_year_start
from src.validators.production import validate_factory_aggregation, validate_factory_filter

from src.db.production import select_all
from src.db.factories import select_all as select_all_factories

@dataclass
class Legend:
    factories: list[ any ] = None

@dataclass
class ProductionResponse:
    headers: list[ str ]
    data: list[ list ]
    legend: Legend | None = None

router = APIRouter( prefix="/api/v1/production" )

@router.get( "" )
async def get_all( 
    time_range: Annotated[ str | None, AfterValidator( validate_time_range ) ] = None, 
    factory_filter: Annotated[ str | None, AfterValidator( validate_factory_filter ) ] = None, 
    interval_filter: Annotated[ str | None, AfterValidator( validate_interval_filter ) ] = None, 
    factory_aggregation: Annotated[ str | None, AfterValidator( validate_factory_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, AfterValidator( validate_year_start ) ] = None
):

    headers, data = await select_all( 
        time_range, factory_filter, interval_filter, 
        factory_aggregation, time_aggregation, year_start
    )

    if factory_aggregation != None:
        return ProductionResponse( headers, data )
    
    factories = await select_all_factories()
    legend = Legend( factories )
    return ProductionResponse( headers, data, legend )
