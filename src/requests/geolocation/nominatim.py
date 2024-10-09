from src.helpers.request.RequestFactory import RequestFactory
from src.helpers.request.RequestHandler import SyncRequestHandler, AsyncRequestHandler
from src.helpers.request.RequestSettings import GetRequestSettings
from src.helpers.request.RequestRunner import SyncGetRequestRunner, AsyncGetRequestRunner
from src.helpers.request.ResponseParser import ResponseParser

from src.settings import Settings, get_settings

class NominatimGetSettings( GetRequestSettings ):

    def __init__( self, params:dict={} ):
        super().__init__( params )

    @property
    def url( self ):
        settings: Settings = get_settings()
        address: str = self.params.get( 'address' )
        return f"{settings.nominatim_url}?format=json&q={address}"

class NominatimGetResponseParser( ResponseParser ):

    def __init__( self, params ):
        super().__init__( params )

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

        self._data = data

class NominatimSyncRequestHandler( SyncRequestHandler ):

    def __init__( self, runner, response ):
        super().__init__( runner, response )

    def set_params( self, params ):
        self.runner.settings.set_params( params )
        params[ 'url' ] = self.runner.settings.url
        self.response.set_params( params )

class NominatimAsyncRequestHandler( AsyncRequestHandler ):

    def __init__( self, runner, response ):
        super().__init__( runner, response )

    def set_params( self, params ):
        self.runner.settings.set_params( params )
        params[ 'url' ] = self.runner.settings.url
        self.response.set_params( params )

class NominatimSyncGetRequestFactory( RequestFactory ):

    def __init__( self, params:dict={} ):

        settings = NominatimGetSettings( params )
        runner = SyncGetRequestRunner( settings )

        # to pass url in response parser
        params[ 'url' ] = 'settings.url'

        parser = NominatimGetResponseParser( params )
        self._handler = NominatimSyncRequestHandler( runner, parser )

        # delay considering Nominatim usage policy:
        # "No heavy uses (an absolute maximum of 1 request per second)"
        self._handler.set_request_delay( 1.1 )

class NominatimAsyncGetRequestFactory( RequestFactory ):

    def __init__( self, params:dict={} ):

        settings = NominatimGetSettings( params )
        runner = AsyncGetRequestRunner( settings )

        # to pass url in response parser
        params[ 'url' ] = settings.url

        parser = NominatimGetResponseParser( params )
        self._handler = NominatimAsyncRequestHandler( runner, parser )

        # delay considering Nominatim usage policy:
        # "No heavy uses (an absolute maximum of 1 request per second)"
        self._handler.set_request_delay( 1.1 )