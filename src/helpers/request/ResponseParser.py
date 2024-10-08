from abc import ABC, abstractmethod

class ResponseParser( ABC ):

    _params = None
    _error = None
    _data = None

    def __init__( self, params=None ):
        self._params = params

    @property
    def params( self ):
        return self._params

    def set_params( self, params ):
        self._params = params
        return self

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
