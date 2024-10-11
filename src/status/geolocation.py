from dataclasses import dataclass

from ._abstract import AbstractStatus

from src.queries.interruptions import InterruptionsPoolQueryFactory


@dataclass
class GeolocationStatus( AbstractStatus ):

    pending_entries: list[ list ] | None

    async def update( self ):

        # Get the pending interruptions (no geolocation defined yet)

        interruptions_handler = InterruptionsPoolQueryFactory().handler
        interruptions_handler.maker.select_pending()
        await interruptions_handler.run_query()
        self.pending_entries = interruptions_handler.data

