from dataclasses import dataclass, field

from ._abstract import AbstractTableStatus, StatusAnalysis

from src.queries.weather import WeatherPoolQueryFactory
from src.queries.locations import LocationsPoolQueryFactory, Location

@dataclass
class AthensTemperatureStatus( AbstractTableStatus ):

    historic_avg: dict[ str, float ] = field( default_factory=lambda: {} )
    locations: list[ Location ] | None = None

    async def update( self ) -> None:

        # Get the last date inserted in table

        temperature_handler = WeatherPoolQueryFactory().handler
        temperature_handler.maker.select_last_date()
        await temperature_handler.run_query()

        # query result looks like: [('2024-10-20',)]
        self.last_date = temperature_handler.data[ 0 ][ 0 ] 

        # Get the most recent entries

        temperature_handler.maker.select_where(
            time_range=self.get_time_range(),
            location_filter='1',
            location_aggregation='sum'
        )
        await temperature_handler.run_query()

        headers = temperature_handler.maker.get_headers()
        data = temperature_handler.data
        self.recent_entries = self.format_entries( headers, data )

        # Get the location data

        locations_handler = LocationsPoolQueryFactory().handler
        locations_handler.maker.select_by_id( 1 )
        await locations_handler.run_query()
        self.locations = locations_handler.data

        # kmeans calculation

        interval = self.get_interval()
        year_start = self.get_year_start()

        # temperature_2m_mean, Athens mean

        temperature_handler.maker.select_where(
            interval_filter=interval,
            location_filter='1',
            location_aggregation='sum',
            time_aggregation=( 'year', 'avg' ),
            year_start=year_start
        )
        await temperature_handler.run_query()
        data = temperature_handler.data

        analysis = StatusAnalysis( interval=interval )
        partial_data = map( lambda row: [ row[ 0 ], row[ 3 ] ], data )
        analysis.calc_kmeans( partial_data )
        self.analysis = {}
        self.analysis[ 'temperature_mean' ] = analysis

        # Get the historic average temperature, Athens

        interval = ( self.last_date[ 5: ], self.last_date[ 5: ] )
        temperature_handler.maker.select_where(
            interval_filter=interval,
            location_filter='1',
            location_aggregation='sum',
            time_aggregation=( 'year', 'avg' ),
        )
        await temperature_handler.run_query()

        # headers = temperature_handler.maker.get_headers()
        data = temperature_handler.data
        self.historic_avg[ 'temperature_2m_min' ] = sum( map( lambda row: row[ 2 ] ,data ) ) / len( data )
        self.historic_avg[ 'temperature_2m_mean' ] = sum( map( lambda row: row[ 3 ] ,data ) ) / len( data )
        self.historic_avg[ 'temperature_2m_max' ] = sum( map( lambda row: row[ 4 ] ,data ) ) / len( data )

