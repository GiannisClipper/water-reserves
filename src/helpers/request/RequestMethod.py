from abc import ABC, abstractmethod
from src.helpers.request.RequestSettings import RequestSettings, GetRequestSettings, PostRequestSettings

class RequestMethod( ABC ):

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
    def request( self, client ):
        pass # sync|async post|get|... 

class SyncGetRequestMethod( RequestMethod ):

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    def request( self, client ):
        return client.get( self.settings.url )

class SyncPostRequestMethod( RequestMethod ):

    def __init__( self, settings: PostRequestSettings ):
        super().__init__( settings )

    def request( self, client ):
        return client.post( self.settings.url, data=self.settings.body )

class AsyncGetRequestMethod( RequestMethod ):

    def __init__( self, settings: GetRequestSettings ):
        super().__init__( settings )

    async def request( self, client ):
        return await client.get( self.settings.url )

class AsyncPostRequestMethod( RequestMethod ):

    def __init__( self, settings: PostRequestSettings ):
        super().__init__( settings )

    async def request( self, client ):
        return await client.post( self.settings.url, data=self.settings.body )
