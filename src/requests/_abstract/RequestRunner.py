from dataclasses import dataclass
from abc import ABC, abstractmethod
from src.requests._abstract.RequestSettings import RequestSettings, GetRequestSettings, PostRequestSettings

@dataclass
class RequestRunner( ABC ):

    settings: RequestSettings = None

    @abstractmethod
    def run_request( self ):
        pass # sync|async post|get|... 


# extend for different method types POST, GET, ...

@dataclass
class PostRequestRunner( RequestRunner ):

    settings: PostRequestSettings

    @abstractmethod
    def run_request( self ):
        # print( self.method_type, self.settings.url, self.settings.body )
        pass

@dataclass
class GetRequestRunner( RequestRunner ):

    settings: GetRequestSettings

    @abstractmethod
    def run_request( self ):
        # print( self.method_type, self.settings.url )
        pass


# extend for both SYNC and ASYNC features

@dataclass
class SyncPostRequestRunner( PostRequestRunner ):

    def run_request( self, client ):
        super().run_request()
        return client.post( self.settings.url, data=self.settings.body )

@dataclass
class AsyncPostRequestRunner( PostRequestRunner ):

    async def run_request( self, client ):
        super().run_request()
        return await client.post( self.settings.url, data=self.settings.body )


@dataclass
class SyncGetRequestRunner( GetRequestRunner ):

    def run_request( self, client ):
        super().run_request()
        return client.get( self.settings.url )

@dataclass
class AsyncGetRequestRunner( GetRequestRunner ):

    async def run_request( self, client ):
        super().run_request()
        return await client.get( self.settings.url )

