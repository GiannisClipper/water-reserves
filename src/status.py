from pydantic.dataclasses import dataclass

from src.db import savings, production, weather
from src.db import reservoirs, factories, locations
from src.helpers.time import get_past_date

from .settings import get_settings, Status, SavingsStatus, ProductionStatus, WeatherStatus


async def set_savings_status():

    last_date = await savings.select_last_date()
    from_date = get_past_date( last_date, 6 )
    to_date = last_date
    time_range = ( from_date, to_date )
    last_entries = await savings.select_all( time_range=time_range )
    reservoir_entries = await reservoirs.select_all()

    get_settings().status.savings = SavingsStatus( last_date, last_entries, reservoir_entries )


async def set_production_status():

    last_date = await production.select_last_date()
    from_date = get_past_date( last_date, 6 )
    to_date = last_date
    time_range = ( from_date, to_date )
    last_entries = await production.select_all( time_range=time_range )
    factory_entries = await factories.select_all()

    get_settings().status.production = ProductionStatus( last_date, last_entries, factory_entries )


async def set_weather_status():

    last_date = await weather.select_last_date()
    from_date = get_past_date( last_date, 6 )
    to_date = last_date
    time_range = ( from_date, to_date )
    last_entries = await weather.select_all( time_range=time_range )
    location_entries = await locations.select_all()

    get_settings().status.weather = WeatherStatus( last_date, last_entries, location_entries )


async def set_status():

    if get_settings().status == None:
        get_settings().status = Status( None, None, None )

    await set_savings_status()
    await set_production_status()
    await set_weather_status()

