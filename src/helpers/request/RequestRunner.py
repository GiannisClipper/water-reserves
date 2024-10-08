from abc import ABC, abstractmethod
from src.helpers.request.RequestSettings import RequestSettings, GetRequestSettings, PostRequestSettings

class RequestRunner( ABC ):

    method_type = None

    _settings: RequestSettings

    def __init__( self, settings: RequestSettings ):
        self._settings = settings

    @property
    def settings( self ):
        return self._settings

    def set_settings( self, settings ):
        self._settings = settings
        return self

    @abstractmethod
    def run_request( self ):
        pass # sync|async post|get|... 


# extend for different method types POST, GET, ...

class PostRequestRunner( RequestRunner ):

    method_type = 'POST'

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    @abstractmethod
    def run_request( self ):
        print( self.method_type, self.settings.url, self.settings.body )

class GetRequestRunner( RequestRunner ):

    method_type = 'GET'

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    @abstractmethod
    def run_request( self ):
        print( self.method_type, self.settings.url )


# extend for both SYNC and ASYNC features

class SyncPostRequestRunner( PostRequestRunner ):

    def __init__( self, settings: PostRequestSettings ):
        super().__init__( settings )

    def run_request( self, client ):
        super().run_request()
        return client.post( self.settings.url, data=self.settings.body )

class AsyncPostRequestRunner( PostRequestRunner ):

    def __init__( self, settings: PostRequestSettings ):
        super().__init__( settings )

    async def run_request( self, client ):
        super().run_request()
        return await client.post( self.settings.url, data=self.settings.body )


class SyncGetRequestRunner( GetRequestRunner ):

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    def run_request( self, client ):
        super().run_request()
        return client.get( self.settings.url )

class AsyncGetRequestRunner( GetRequestRunner ):

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    async def run_request( self, client ):
        super().run_request()
        return await client.get( self.settings.url )

