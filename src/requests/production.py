from dataclasses import dataclass
from src.helpers.request.RequestFactory import RequestFactory
from src.helpers.request.RequestHandler import AsyncRequestHandler
from src.helpers.request.RequestSettings import GetRequestSettings
from src.helpers.request.RequestRunner import AsyncGetRequestRunner
from src.helpers.request.ResponseParser import ResponseParser

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