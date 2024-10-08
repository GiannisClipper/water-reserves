class RequestFactory:
    
    _handler = None

    def __init__( self ):
        pass

    @property
    def handler( self ):
        return self._handler
