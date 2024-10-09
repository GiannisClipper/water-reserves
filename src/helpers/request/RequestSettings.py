from abc import ABC, abstractmethod

class RequestSettings( ABC ):

    _params = None
    _certification = None

    def __init__( self, params:dict={}, certification:str=None ):
        self._params = params
        self._certification = certification

    @property
    def params( self ):
        return self._params

    def set_params( self, params ):
        self._params = params
        return self

    @property
    def certification( self ):
        return self._certification

    def set_certification( self, certification ):
        self._certification = certification
        return self

    @property
    @abstractmethod
    def url():
        pass # compose the url 

class GetRequestSettings( RequestSettings ):

    def __init__( self, params:dict={}, certification:str=None ):
        super().__init__( params, certification )

class PostRequestSettings( RequestSettings ):

    def __init__( self, params:dict={}, certification:str=None ):
        super().__init__( params, certification )

    @property
    @abstractmethod
    def body():
        pass # compose the body
