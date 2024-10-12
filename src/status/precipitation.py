from dataclasses import dataclass

from ._abstract import AbstractTableStatus

from src.queries.precipitation import PrecipitationPoolQueryFactory
from src.queries.locations import LocationsPoolQueryFactory

@dataclass
class PrecipitationStatus( AbstractTableStatus ):

    locations: list[ object ] | None

    async def update( self ) -> None:

        # Get the last date inserted in table

        weather_handler = PrecipitationPoolQueryFactory().handler
        weather_handler.maker.select_last_date()
        await weather_handler.run_query()

        # query result looks like: [('2024-10-20',)]
        self.last_date = weather_handler.data[ 0 ][ 0 ] 

        # Get the most recent entries

        weather_handler.maker.select_where(
            time_range=self.get_time_range(),
            location_aggregation='sum'
        )
        await weather_handler.run_query()

        headers = weather_handler.maker.get_headers()
        data = weather_handler.data
        self.recent_entries = self.format_entries( headers, data )

        # Get the locations

        locations_handler = LocationsPoolQueryFactory().handler
        locations_handler.maker.select_all()
        await locations_handler.run_query()
        self.locations = locations_handler.data

        # kmeans calculation

        interval = self.get_interval()
        year_start = self.get_year_start()
        weather_handler.maker.select_where(
            interval_filter=interval,
            location_aggregation='sum',
            time_aggregation=( 'year', 'sum' ),
            year_start=year_start
        )
        await weather_handler.run_query()
        data = weather_handler.data
        self.kmeans = await self.calc_kmeans( data )
