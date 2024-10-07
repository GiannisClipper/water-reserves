from src.settings import get_settings
import re

from ..Request import Request

class InterruptionsPostRequest( Request ):

    def __init__( self, params=None ):
        super().__init__( params )

    @property
    def url( self ):
        settings = get_settings()
        return f'{settings.interruptions_url}/nowater.php'

    def request_method( self, client ):
        return client.post( 
            self.url, 
            data={ 
                "sdate": self.params[ 'month_year' ], 
                "edate": self.params[ 'month_year' ]
            } 
        )

    @property
    def response( self ):
        return super().response

    @response.setter
    def response( self, response ):

        result = re.search( 'files(.+?)csv', response.text )
        if result == None:
            self._error = f'No result for given parameter ({self.params[ 'month_year' ]})'
        else:
            self._data = result.group( 0 )

class InterruptionsGetRequest( Request ):

    def __init__( self, params=None ):
        super().__init__( params )

    @property
    def url( self ):
        settings = get_settings()
        return f'{settings.interruptions_url}/{self.params[ 'file_path' ]}'

    def request_method( self, client ):
        return client.get( self.url )

    @property
    def response( self ):
        return super().response

    @response.setter
    def response( self, response ):
        self._data = response.text
