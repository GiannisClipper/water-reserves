from dataclasses import dataclass
from src.helpers.request.RequestFactory import RequestFactory
from src.helpers.request.RequestHandler import AsyncRequestHandler
from src.helpers.request.RequestSettings import GetRequestSettings, PostRequestSettings
from src.helpers.request.RequestRunner import AsyncGetRequestRunner, AsyncPostRequestRunner
from src.helpers.request.ResponseParser import ResponseParser

from src.settings import get_settings

import re

@dataclass
class InterruptionsGetSettings( GetRequestSettings ):

    @property
    def url( self ):
        settings = get_settings()
        return f'{settings.interruptions_url}/{self.params[ 'file_path' ]}'

@dataclass
class InterruptionsPostSettings( PostRequestSettings ):

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

@dataclass
class InterruptionsGetResponseParser( ResponseParser ):

    def parse_response( self, response ):
        self.data = response.text

@dataclass
class InterruptionsPostResponseParser( ResponseParser ):

    def parse_response( self, response ):
        result = re.search( 'files(.+?)csv', response.text )
        if result == None:
            self.error = 'No data available.'
        else:
            self.data = result.group( 0 )

class InterruptionsAsyncPostRequestFactory( RequestFactory ):

    def __init__( self, params: dict = None ):
        settings = InterruptionsPostSettings( params )
        runner = AsyncPostRequestRunner( settings )
        parser = InterruptionsPostResponseParser()
        self.handler = AsyncRequestHandler( runner, parser )
        self.handler.request_delay = 5

class InterruptionsAsyncGetRequestFactory( RequestFactory ):

    def __init__( self, params: dict = None ):
        settings = InterruptionsGetSettings( params=params )
        runner = AsyncGetRequestRunner( settings=settings )
        parser = InterruptionsGetResponseParser()
        self.handler = AsyncRequestHandler( runner=runner, parser=parser )
        self.handler.request_delay = 5