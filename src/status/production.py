from dataclasses import dataclass

from ._abstract import AbstractTableStatus, StatusAnalysis

from src.queries.production import ProductionPoolQueryFactory
from src.queries.factories import FactoriesPoolQueryFactory, Factory

@dataclass
class ProductionStatus( AbstractTableStatus ):

    factories: list[ Factory ] | None = None

    async def update( self ) -> None:

        # Get the last date inserted in table

        production_handler = ProductionPoolQueryFactory().handler
        production_handler.maker.select_last_date()
        await production_handler.run_query()

        # query result looks like: [('2024-10-20',)]
        self.last_date = production_handler.data[ 0 ][ 0 ] 

        # Get the most recent entries

        production_handler.maker.select_where(
            time_range=self.get_time_range(),
            factory_aggregation='sum'
        )
        await production_handler.run_query()

        headers = production_handler.maker.get_headers()
        data = production_handler.data
        self.recent_entries = self.format_entries( headers, data )

        # Get the factories

        factories_handler = FactoriesPoolQueryFactory().handler
        factories_handler.maker.select_all()
        await factories_handler.run_query()
        self.factories = factories_handler.data

        # kmeans calculation

        interval = self.get_interval()
        year_start = self.get_year_start()
        production_handler.maker.select_where(
            interval_filter=interval,
            factory_aggregation='sum', 
            time_aggregation=( 'year', 'avg' ),
            year_start=year_start
        )
        await production_handler.run_query()
        data = production_handler.data

        self.analysis = {}
        analysis = StatusAnalysis( interval=interval )
        partial_data = map( lambda row: [ row[ 0 ], row[ 1 ] ], data )
        analysis.calc_kmeans( partial_data )
        self.analysis[ 'quantity' ] = analysis
