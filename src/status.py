from pydantic.dataclasses import dataclass

from src.db import savings, production, weather
from src.db import reservoirs, factories, locations
from src.helpers.time import get_past_date

from .settings import get_settings, Status, SavingsStatus, ProductionStatus, WeatherStatus

async def load_status():

    # savings

    last_date = await savings.select_last_date()
    from_date = get_past_date( last_date, 6 )
    to_date = last_date
    time_range = ( from_date, to_date )
    last_entries = await savings.select_all( time_range=time_range )
    reservoir_entries = await reservoirs.select_all()
    savingsStatus = SavingsStatus( last_date, last_entries, reservoir_entries )

    # production

    last_date = await production.select_last_date()
    from_date = get_past_date( last_date, 6 )
    to_date = last_date
    time_range = ( from_date, to_date )
    last_entries = await production.select_all( time_range=time_range )
    factory_entries = await factories.select_all()
    productionStatus = ProductionStatus( last_date, last_entries, factory_entries )

    # weather

    last_date = await weather.select_last_date()
    from_date = get_past_date( last_date, 6 )
    to_date = last_date
    time_range = ( from_date, to_date )
    last_entries = await weather.select_all( time_range=time_range )
    location_entries = await locations.select_all()
    weatherStatus = WeatherStatus( last_date, last_entries, location_entries )

    # overall status

    get_settings().status = Status( 
        savings=savingsStatus,
        production=productionStatus,
        weather=weatherStatus 
    )