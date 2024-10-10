from dataclasses import dataclass
from src.helpers.request.RequestFactory import RequestFactory
from src.helpers.request.RequestHandler import SyncRequestHandler, AsyncRequestHandler
from src.helpers.request.RequestSettings import GetRequestSettings
from src.helpers.request.RequestRunner import SyncGetRequestRunner, AsyncGetRequestRunner
from src.helpers.request.ResponseParser import ResponseParser

from src.settings import Settings, get_settings

@dataclass
class GeoapifyGetSettings( GetRequestSettings ):

    @property
    def url( self ):
        settings: Settings = get_settings()
        api_key: str = settings.GEOAPIFY_API_KEY
        address: str = self.params.get( 'address' )
        return f"{settings.geoapify_url}?apiKey={api_key}&lang=el&text={address}"

@dataclass
class GeoapifyGetResponseParser( ResponseParser ):

    def parse_response( self, response ):
        response = response.json()

        data = []
        for row in response[ 'features' ]:
            properties = row[ 'properties' ]
            # print( 'properties', properties)

            descr = ''
            if properties.get( 'name' ): 
                descr = f'({properties.get( 'name' )})'
            if properties.get( 'street' ): 
                descr = f'{descr}, {properties.get( 'street' )}'
            if properties.get( 'suburb' ):
                descr = f'{descr}, {properties.get( 'suburb' )}'
            if properties.get( 'district' ): 
                descr = f'{descr}, {properties.get( 'district' )}'
            if properties.get( 'city' ): 
                descr = f'{descr}, {properties.get( 'city' )}'
            if properties.get( 'state_district' ): 
                descr = f'{descr}, {properties.get( 'state_district' )}'
            if properties.get( 'state' ): 
                descr = f'{descr}, {properties.get( 'state' )}'
            if properties.get( 'country' ): 
                descr = f'{descr}, {properties.get( 'country' )}'

            data.append( {
                'address': self.params[ 'address' ],
                'url': self.params[ 'url' ],
                'descr': descr,
                'lat': row[ 'properties' ][ 'lat' ],
                'lon': row[ 'properties' ][ 'lon' ]
            } )

        self.data = data

@dataclass
class GeoapifySyncRequestHandler( SyncRequestHandler ):

    def set_params( self, params ):
        self.runner.settings.params = params
        params[ 'url' ] = self.runner.settings.url
        self.parser.params = params

@dataclass
class GeoapifyAsyncRequestHandler( AsyncRequestHandler ):

    def set_params( self, params ):
        self.runner.settings.params = params
        params[ 'url' ] = self.runner.settings.url
        self.parser.params = params

class GeoapifySyncGetRequestFactory( RequestFactory ):

    def __init__( self, params: dict = {} ):

        settings = GeoapifyGetSettings( params )
        runner = SyncGetRequestRunner( settings )

        # to pass url in response parser
        params[ 'url' ] = 'settings.url'

        parser = GeoapifyGetResponseParser( params )
        self.handler = GeoapifySyncRequestHandler( runner, parser )

        # for standardization, delay followes Nominatim usage policy:
        # "No heavy uses (an absolute maximum of 1 request per second)"
        self.handler.request_delay = 1.1

class GeoapifyAsyncGetRequestFactory( RequestFactory ):

    def __init__( self, params: dict = {} ):

        settings = GeoapifyGetSettings( params=params )
        runner = AsyncGetRequestRunner( settings=settings )

        # to pass url in response parser
        params[ 'url' ] = settings.url

        parser = GeoapifyGetResponseParser( params=params )
        self.handler = GeoapifyAsyncRequestHandler( runner=runner, parser=parser )

        # for standardization, delay followes Nominatim usage policy:
        # "No heavy uses (an absolute maximum of 1 request per second)"
        self.handler.request_delay = 1.1
