import httpx
import time
from abc import ABC, abstractmethod
from src.settings import get_settings

class ApiProvider( ABC ):

    _response = None
    _address = None
    _data = None

    def __init__( self, address=None ):
        self._address = address

    @property
    def address( self ):
        return self._address

    def set_address( self, address ):
        self._address = address
        return self

    @property
    @abstractmethod
    def url():
        pass # compose the url 

    @property
    def response( self ):
        return self._response

    @response.setter
    @abstractmethod
    def response( self ):
        pass # parse the request response 

    @property
    def data( self ):
        return self._data

    def request( self ):

        try:
            with httpx.Client() as client:
                print( 'url:', self.url )
                response = client.get( self.url )
                # add delay due to Nominatim usage policy:
                # "No heavy uses (an absolute maximum of 1 request per second)"
                time.sleep( 1.1 )

                if response.status_code != 200:
                    result = { 'error': f'{response.status_code} {response.reason_phrase}' }
                    print( f'Error: {result.error}' )
                    return result

                print( f'Success: {response.status_code}' )
                self.response = response
                result = { 'data': self.data }
                return result

        except Exception as error:
            print( f'Error: {error}' )
            result = { 'error': error }
            return result

class NominatimApiProvider( ApiProvider ):

    _base_url = 'https://nominatim.openstreetmap.org/search?format=json&q='

    def __init__( self, address=None ):
        super().__init__( address )

    @property
    def url( self ):
        return f'{self._base_url}{self.address}'

    @property
    def response( self ):
        return super().response

    @response.setter
    def response( self, response ):

        response = response.json()

        data = []
        for row in response:
            data.append( {
                'url': self.url,
                'descr': row[ 'display_name' ],
                'lat': float( row[ 'lat' ] ),
                'lon': float( row[ 'lon' ] )
            } )

        self._data = data
        return self

class GeoapifyApiProvider( ApiProvider ):

    settings = get_settings()

    _base_url = f'https://api.geoapify.com/v1/geocode/search?apiKey={settings.GEOAPIFY_API_KEY}&lang=el&text='

    def __init__( self, address=None ):
        super().__init__( address )

    @property
    def url( self ):
        return f'{self._base_url}{self.address}'

    @property
    def response( self ):
        return super().response

    @response.setter
    def response( self, response ):

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
                'url': self.url,
                'descr': descr,
                'lat': row[ 'properties' ][ 'lat' ],
                'lon': row[ 'properties' ][ 'lon' ]
            } )

        self._data = data
        return self
