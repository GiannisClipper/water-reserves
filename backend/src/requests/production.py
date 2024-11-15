from dataclasses import dataclass
from src.requests._abstract.RequestFactory import RequestFactory
from src.requests._abstract.RequestHandler import AsyncRequestHandler
from src.requests._abstract.RequestSettings import GetRequestSettings
from src.requests._abstract.RequestRunner import AsyncGetRequestRunner
from src.requests._abstract.ResponseParser import ResponseParser

from src.settings import Settings, get_settings
from src.helpers.html import scrape_html

@dataclass
class ProductionGetSettings( GetRequestSettings ):

    @property
    def url( self ):
        settings: Settings = get_settings()
        date: str = '-'.join( reversed( self.params[ 'date' ].split( '-' ) ) ) # DD-MM-YYYY
        return f'{settings.production_url}/?DaysSpan=Day&Date={date}'

@dataclass
class ProductionGetResponseParser( ResponseParser ):

    def parse_response( self, response ):
        headers, values = scrape_html( response.content )
        # print( headers, data )
        date: str = self.params[ 'date' ] # YYYY-MM-DD
        values: list = list( filter( lambda x: x[ 0 ] == date, values ) )
        # print( date, values )
        if len( values ):
            self.data = values[ 0 ]

class ProductionAsyncGetRequestFactory( RequestFactory ):

    def __init__( self, params: dict = None ):

        certification = get_settings().cert_file
        settings = ProductionGetSettings( params=params, certification=certification )

        runner = AsyncGetRequestRunner( settings=settings )
        parser = ProductionGetResponseParser( params=params )
        self.handler = AsyncRequestHandler( runner=runner, parser=parser )
        self.handler.request_delay = 5