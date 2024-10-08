from src.helpers.request.RequestFactory import RequestFactory
from src.helpers.request.RequestHandler import AsyncRequestHandler
from src.helpers.request.RequestSettings import GetRequestSettings
from src.helpers.request.RequestRunner import AsyncGetRequestRunner
from src.helpers.request.ResponseParser import ResponseParser

from src.settings import Settings, get_settings
from src.helpers.html import scrape_html

class SavingsGetSettings( GetRequestSettings ):

    def __init__( self, params=None, certification=None ):
        super().__init__( params, certification )

    @property
    def url( self ):
        settings: Settings = get_settings()
        date: str = '-'.join( reversed( self.params[ 'date' ].split( '-' ) ) ) # DD-MM-YYYY
        return f'{settings.savings_url}/?DaysSpan=Day&Date={date}'

class SavingsGetResponseParser( ResponseParser ):

    def __init__( self, params ):
        super().__init__( params )

    def parse_response( self, response ):
        headers, values = scrape_html( response.content )
        # print( headers, data )
        date: str = self.params[ 'date' ] # YYYY-MM-DD
        values: list = list( filter( lambda x: x[ 0 ] == date, values ) )
        # print( date, values )
        if len( values ):
            self._data = values[ 0 ]

class SavingsAsyncGetRequestFactory( RequestFactory ):

    def __init__( self, params: dict ):

        certification = get_settings().cert_file
        settings = SavingsGetSettings( params, certification )

        runner = AsyncGetRequestRunner( settings )
        parser = SavingsGetResponseParser( params )
        self._handler = AsyncRequestHandler( runner, parser )
        self._handler.set_request_delay( 5 )