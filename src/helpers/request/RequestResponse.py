from abc import ABC, abstractmethod
from src.helpers.request.RequestSettings import RequestSettings, GetRequestSettings, PostRequestSettings
import re

class RequestResponse( ABC ):

    _error = None
    _data = None

    def __init__( self ):
        pass

    @property
    def error( self ):
        return self._error

    @error.setter
    def error( self, error ):
        self._error = error

    @property
    def data( self ):
        return self._data

    @data.setter
    def data( self, data ):
        self._data = data

    @abstractmethod
    def parse_response( self, response ):
        pass # parse the request response 

class InterruptionsPostRequestResponse( RequestResponse ):

    def __init__( self ):
        super().__init__()

    def parse_response( self, response ):
        result = re.search( 'files(.+?)csv', response.text )
        if result == None:
            self._error = f'No result for given parameter ({self.params[ 'month_year' ]})'
        else:
            self._data = result.group( 0 )

class InterruptionsGetRequestResponse( RequestResponse ):

    def __init__( self ):
        super().__init__()

    def parse_response( self, response ):
        self._data = response.text