from fastapi import APIRouter
from pydantic.dataclasses import dataclass

from src.db import savings, production, weather

@dataclass
class LastDates:
    savings: str
    production: str
    weather: str

@dataclass
class StatusResponse:
    last_dates: LastDates

router = APIRouter( prefix="/api/v1/status" )

@router.get( "" )
async def get_status():

    savings_last_date = await savings.select_last_date()
    production_last_date = await production.select_last_date()
    weather_last_date = await weather.select_last_date()

    return StatusResponse( LastDates( 
        savings_last_date, 
        production_last_date, 
        weather_last_date 
    ) )