from src.helpers.request.RequestFactory import RequestFactory
from src.helpers.request.RequestHandler import AsyncRequestHandler
from src.helpers.request.RequestSettings import GetRequestSettings, PostRequestSettings
from src.helpers.request.RequestRunner import AsyncGetRequestRunner, AsyncPostRequestRunner
from src.helpers.request.ResponseParser import ResponseParser

from src.settings import get_settings

import re

class InterruptionsGetSettings( GetRequestSettings ):

    def __init__( self, params=None ):
        super().__init__( params )

    @property
    def url( self ):
        settings = get_settings()
        return f'{settings.interruptions_url}/{self.params[ 'file_path' ]}'

class InterruptionsPostSettings( PostRequestSettings ):

    def __init__( self, params=None ):
        super().__init__( params )

    @property
    def url( self ):
        settings = get_settings()
        return f'{settings.interruptions_url}/nowater.php'

    @property
    def body( self ):
        return { 
            "sdate": self.params[ 'month_year' ], 
            "edate": self.params[ 'month_year' ]
        }

class InterruptionsGetResponseParser( ResponseParser ):

    def __init__( self ):
        super().__init__()

    def parse_response( self, response ):
        self._data = response.text

class InterruptionsPostResponseParser( ResponseParser ):

    def __init__( self ):
        super().__init__()

    def parse_response( self, response ):
        result = re.search( 'files(.+?)csv', response.text )
        if result == None:
            self._error = 'No data available.'
        else:
            self._data = result.group( 0 )

class InterruptionsAsyncPostRequestFactory( RequestFactory ):

    def __init__( self, params: dict ):
        settings = InterruptionsPostSettings( params )
        runner = AsyncPostRequestRunner( settings )
        parser = InterruptionsPostResponseParser()
        self._handler = AsyncRequestHandler( runner, parser )
        # self._runner.set_request_delay( 1.1 )

class InterruptionsAsyncGetRequestFactory( RequestFactory ):

    def __init__( self, params: dict ):
        settings = InterruptionsGetSettings( params )
        runner = AsyncGetRequestRunner( settings )
        parser = InterruptionsGetResponseParser()
        self._handler = AsyncRequestHandler( runner, parser )
        # self._runner.set_request_delay( 1.1 )