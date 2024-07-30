from fastapi import APIRouter
from typing import Annotated
from pydantic.dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.helpers.validators import validate_time_range, validate_factory_filter, validate_interval_filter
from src.helpers.validators import validate_factory_aggregation, validate_time_aggregation, validate_year_start

from src.db.production import select_all

@dataclass
class ProductionResponse:
    headers: list[ str ]
    data: list[ list ]

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

    return ProductionResponse( headers, data )