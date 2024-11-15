from dataclasses import dataclass
from src.requests._abstract.RequestFactory import RequestFactory
from src.requests._abstract.RequestHandler import SyncRequestHandler, AsyncRequestHandler
from src.requests._abstract.RequestSettings import GetRequestSettings
from src.requests._abstract.RequestRunner import SyncGetRequestRunner, AsyncGetRequestRunner
from src.requests._abstract.ResponseParser import ResponseParser

from src.settings import Settings, get_settings

@dataclass
class NominatimGetSettings( GetRequestSettings ):

    @property
    def url( self ):
        settings: Settings = get_settings()
        address: str = self.params.get( 'address' )
        return f"{settings.nominatim_url}?format=json&q={address}"

@dataclass
class NominatimGetResponseParser( ResponseParser ):

    def parse_response( self, response ):
        rows = response.json()

        data = []
        for row in rows:
            data.append( {
                'address': self.params[ 'address' ],
                'url': self.params[ 'url' ],
                'descr': row[ 'display_name' ],
                'lat': float( row[ 'lat' ] ),
                'lon': float( row[ 'lon' ] )
            } )

        self.data = data

@dataclass
class NominatimSyncRequestHandler( SyncRequestHandler ):

    def set_params( self, params ):
        self.runner.settings.params = params
        params[ 'url' ] = self.runner.settings.url
        self.parser.params = params

@dataclass
class NominatimAsyncRequestHandler( AsyncRequestHandler ):

    def set_params( self, params ):
        self.runner.settings.params = params
        params[ 'url' ] = self.runner.settings.url
        self.parser.params = params

class NominatimSyncGetRequestFactory( RequestFactory ):

    def __init__( self, params: dict = {} ):

        settings = NominatimGetSettings( params )
        runner = SyncGetRequestRunner( settings )

        # to pass url in response parser
        params[ 'url' ] = 'settings.url'

        parser = NominatimGetResponseParser( params )
        self.handler = NominatimSyncRequestHandler( runner, parser )

        # delay considering Nominatim usage policy:
        # "No heavy uses (an absolute maximum of 1 request per second)"
        self.handler.request_delay = 1.1

class NominatimAsyncGetRequestFactory( RequestFactory ):

    def __init__( self, params: dict = {} ):

        settings = NominatimGetSettings( params )
        runner = AsyncGetRequestRunner( settings )

        # to pass url in response parser
        params[ 'url' ] = settings.url

        parser = NominatimGetResponseParser( params )
        self.handler = NominatimAsyncRequestHandler( runner, parser )

        # delay considering Nominatim usage policy:
        # "No heavy uses (an absolute maximum of 1 request per second)"
        self.handler.request_delay = 1.1
