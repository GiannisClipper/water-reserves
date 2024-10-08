from fastapi import APIRouter
from typing import Annotated
from dataclasses import dataclass
from pydantic.functional_validators import AfterValidator

from src.validators import validate_time_range, validate_interval_filter, validate_time_aggregation, validate_year_start
from src.validators.interruptions import validate_municipality_filter, validate_municipality_aggregation

from src.db.interruptions import select_all
from src.db.municipalities import select_all as select_all_municipalities

@dataclass
class Legend:
    municipalities: list[ any ] = None

@dataclass
class InterruptionsResponse:
    headers: list[ str ]
    data: list[ list ]
    legend: Legend | None = None

router = APIRouter( prefix="/api/v1/interruptions" )

@router.get( "" )
async def get_all( 
    time_range: Annotated[ str | None, AfterValidator( validate_time_range ) ] = None, 
    municipality_filter: Annotated[ str | None, AfterValidator( validate_municipality_filter ) ] = None, 
    interval_filter: Annotated[ str | None, AfterValidator( validate_interval_filter ) ] = None, 
    municipality_aggregation: Annotated[ str | None, AfterValidator( validate_municipality_aggregation ) ] = None, 
    time_aggregation: Annotated[ str | None, AfterValidator( validate_time_aggregation ) ] = None,
    year_start: Annotated[ str | None, AfterValidator( validate_year_start ) ] = None
):

    headers, data = await select_all( 
        time_range, municipality_filter, interval_filter, 
        municipality_aggregation, time_aggregation, year_start
    )

    if municipality_aggregation != None:
        return InterruptionsResponse( headers, data )
    
    municipalities = await select_all_municipalities()
    legend = Legend( municipalities )
    return InterruptionsResponse( headers, data, legend )
