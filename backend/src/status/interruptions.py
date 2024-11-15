from dataclasses import dataclass

from ._abstract import AbstractStatus

from src.queries.interruptions import InterruptionsPoolQueryFactory
from src.queries.municipalities import MunicipalitiesPoolQueryFactory, Municipality

@dataclass
class InterruptionsStatus( AbstractStatus ):

    last_date: str | None
    municipalities: list[ Municipality ] | None

    async def update( self ):

        # Get the last date inserted in table

        interruptions_handler = InterruptionsPoolQueryFactory().handler
        interruptions_handler.maker.select_last_date()
        await interruptions_handler.run_query()

        # query result looks like: [('2024-10-20',)]
        self.last_date = interruptions_handler.data[ 0 ][ 0 ] 

        # Get the municipalities

        municipalities_handler = MunicipalitiesPoolQueryFactory().handler
        municipalities_handler.maker.select_all()
        await municipalities_handler.run_query()
        self.municipalities = municipalities_handler.data
