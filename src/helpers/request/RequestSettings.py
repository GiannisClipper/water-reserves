from abc import ABC, abstractmethod
from src.settings import get_settings

class RequestSettings( ABC ):

    _params = None

    def __init__( self, params=None ):
        self._params = params

    @property
    def params( self ):
        return self._params

    def set_params( self, params ):
        self._params = params
        return self

    @property
    @abstractmethod
    def url():
        pass # compose the url 

class GetRequestSettings( RequestSettings ):

    def __init__( self, params=None ):
        super().__init__( params )

class PostRequestSettings( RequestSettings ):

    def __init__( self, params=None ):
        super().__init__( params )

    @property
    @abstractmethod
    def body():
        pass # compose the body

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

