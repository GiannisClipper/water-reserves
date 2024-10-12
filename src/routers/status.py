from pydantic import BaseModel
from fastapi import APIRouter, Request
from src.settings import get_settings

import src.docs as docs

from src.status.savings import SavingsStatus
from src.status.production import ProductionStatus
from src.status.weather import WeatherStatus
from src.status.interruptions import InterruptionsStatus
from src.status.geolocation import GeolocationStatus

class StatusResponse( BaseModel ):
    savings: SavingsStatus
    production: ProductionStatus
    weather: WeatherStatus
    interruptions: InterruptionsStatus
    geolocation: GeolocationStatus

router = APIRouter( prefix="/api/v1/status" )

@router.get( "", tags=[ docs.tag_status ] )
async def get_status( request: Request ) -> StatusResponse:

    return get_settings().status
