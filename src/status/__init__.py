from src.db import savings, production, weather
from src.db import reservoirs, factories, locations
from src.helpers.time import get_past_date

from abc import ABC
from dataclasses import dataclass


@dataclass
class AbstractStatus( ABC ):
    async def update( self ):
        pass


@dataclass
class AbstractTableStatus( AbstractStatus ):
    last_date: str | None
    last_entries: list[ list ] | None


@dataclass
class SavingsStatus( AbstractTableStatus ):

    reservoirs: list[ object ] | None

    async def update( self ):
        self.last_date = await savings.select_last_date()
        from_date: str = get_past_date( self.last_date, 6 )
        to_date: str = self.last_date
        time_range: tuple = ( from_date, to_date )
        self.last_entries = await savings.select_all( time_range=time_range )
        self.reservoir_entries = await reservoirs.select_all()


@dataclass
class ProductionStatus( AbstractTableStatus ):

    factories: list[ object ]

    async def update( self ):
        self.last_date = await production.select_last_date()
        from_date: str = get_past_date( self.last_date, 6 )
        to_date: str = self.last_date
        time_range: tuple = ( from_date, to_date )
        self.last_entries = await production.select_all( time_range=time_range )
        self.factory_entries = await factories.select_all()


@dataclass
class WeatherStatus( AbstractTableStatus ):

    locations: list[ object ]

    async def update( self ):
        self.last_date = await weather.select_last_date()
        from_date: str = get_past_date( self.last_date, 6 )
        to_date: str = self.last_date
        time_range: tuple = ( from_date, to_date )
        self.last_entries = await weather.select_all( time_range=time_range )
        self.location_entries = await locations.select_all()


@dataclass
class Status( AbstractStatus ):

    savings: SavingsStatus | None
    production: ProductionStatus | None
    weather: WeatherStatus | None

    async def update( self ):

        self.savings = SavingsStatus( None, None, None )
        await self.savings.update()

        self.production = ProductionStatus( None, None, None )
        await self.production.update()

        self.weather = WeatherStatus( None, None, None )
        await self.weather.update()
