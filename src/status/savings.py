from dataclasses import dataclass

from ._abstract import AbstractTableStatus, StatusAnalysis

from src.queries.savings import SavingsPoolQueryFactory
from src.queries.reservoirs import ReservoirsPoolQueryFactory

@dataclass
class SavingsStatus( AbstractTableStatus ):

    reservoirs: list[ object ] | None = None

    async def update( self ) -> None:

        # Get the last date inserted in table

        savings_handler = SavingsPoolQueryFactory().handler
        savings_handler.maker.select_last_date()
        await savings_handler.run_query()

        # query result looks like: [('2024-10-20',)]
        self.last_date = savings_handler.data[ 0 ][ 0 ] 

        # Get the most recent entries

        savings_handler.maker.select_where(
            time_range=self.get_time_range(),
            reservoir_aggregation='sum'
        )
        await savings_handler.run_query()

        headers = savings_handler.maker.get_headers()
        data = savings_handler.data
        self.recent_entries = self.format_entries( headers, data )

        # Get the reservoirs

        reservoirs_handler = ReservoirsPoolQueryFactory().handler
        reservoirs_handler.maker.select_all()
        await reservoirs_handler.run_query()
        self.reservoirs = reservoirs_handler.data

        # kmeans calculation

        interval = self.get_interval()
        year_start = self.get_year_start()
        savings_handler.maker.select_where(
            interval_filter=interval,
            reservoir_aggregation='sum', 
            time_aggregation=( 'year', 'avg' ),
            year_start=year_start
        )
        await savings_handler.run_query()
        data = savings_handler.data

        self.analysis = {}
        analysis = StatusAnalysis( interval=interval )
        partial_data = map( lambda row: [ row[ 0 ], row[ 1 ] ], data )
        analysis.calc_kmeans( partial_data )
        self.analysis[ 'quantity' ] = analysis
