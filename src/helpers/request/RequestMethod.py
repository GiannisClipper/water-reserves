from abc import ABC, abstractmethod
from src.helpers.request.RequestSettings import RequestSettings, GetRequestSettings, PostRequestSettings

class RequestMethod( ABC ):

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
    def run_method( self ):
        pass # sync|async post|get|... 


# extend for different method types POST, GET, ...

class PostRequestMethod( RequestMethod ):

    method_type = 'POST'

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    @abstractmethod
    def run_method( self ):
        print( self.method_type, self.settings.url, self.settings.body )

class GetRequestMethod( RequestMethod ):

    method_type = 'GET'

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    @abstractmethod
    def run_method( self ):
        print( self.method_type, self.settings.url )


# extend for both SYNC and ASYNC features

class SyncPostRequestMethod( PostRequestMethod ):

    def __init__( self, settings: PostRequestSettings ):
        super().__init__( settings )

    def run_method( self, client ):
        super().run_method()
        return client.post( self.settings.url, data=self.settings.body )

class AsyncPostRequestMethod( PostRequestMethod ):

    def __init__( self, settings: PostRequestSettings ):
        super().__init__( settings )

    async def run_method( self, client ):
        super().run_method()
        return await client.post( self.settings.url, data=self.settings.body )


class SyncGetRequestMethod( GetRequestMethod ):

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    def run_method( self, client ):
        super().run_method()
        return client.get( self.settings.url )

class AsyncGetRequestMethod( GetRequestMethod ):

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    async def run_method( self, client ):
        super().run_method()
        return await client.get( self.settings.url )

