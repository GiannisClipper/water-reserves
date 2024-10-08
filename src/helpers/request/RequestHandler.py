from abc import ABC, abstractmethod
from src.helpers.request.RequestRunner import RequestRunner 
from src.helpers.request.ResponseParser import ResponseParser
import httpx
import time
import asyncio

class RequestHandler( ABC ):

    _retry_limit = 0
    _retry_delay = 0
    _request_delay = 0

    _runner: RequestRunner = None
    _response: ResponseParser = None

    def __init__( self, runner: RequestRunner, response: ResponseParser ):
        self._runner = runner
        self._response = response

    @property
    def retry_limit( self ):
        return self._retry_limit

    def set_retry_limit( self, limit ):
        self._retry_limit = limit
        return self

    @property
    def retry_delay( self ):
        return self._retry_delay

    def set_retry_limit( self, delay ):
        self._retry_delay = delay
        return self

    @property
    def request_delay( self ):
        return self._request_delay

    def set_request_delay( self, delay ):
        self._request_delay = delay
        return self

    @property
    def runner( self ):
        return self._runner

    def set_runner( self, runner ):
        self._runner = runner
        return self

    @property
    def response( self ):
        return self._response

    def set_runner( self, response ):
        self._response = response
        return self

    @abstractmethod
    def request( self ):
        pass

    def on_complete( self, response ):

        if response.status_code != 200:
            self.response.error = f'{response.status_code} {response.reason_phrase}'
            print( f'Error: {self.response.error}' )
            return

        print( f'Success: {response.status_code}' )
        self.response.parse_response( response )
        return

    def on_exception( self, error ):

        self.response.error = f'{error}'
        print( f'Error: {self.response.error}' )
        return

class SyncRequestHandler( RequestHandler ):

    def __init__( self, runner: RequestRunner, response: ResponseParser ):
        super().__init__( runner, response )

    def request( self ):

        for retry in range( 1 + self.retry_limit ):
            self._error = None
            self._data = None

            try:
                with httpx.Client() as client:
                    print( f'[retry {retry}] url: {self.runner.settings.url}' )
                    response = self.runner.run_request( client )
                    self.on_complete( response )

                # in case of API usage limits 
                # e.g: nominatim allows at maximum 1 request per second
                if self.request_delay:
                    print( f'Waiting {self.request_delay} seconds due to api limits...' )
                    time.sleep( self.request_delay )
                return self

            except Exception as error:
                self.on_exception( error )

                if retry < self.retry_limit:
                    print( f'Waiting {self.retry_delay} seconds to retry...' )
                    time.sleep( self.retry_delay )
                    continue
                return self

class AsyncRequestHandler( RequestHandler ):

    def __init__( self, runner: RequestRunner, response: ResponseParser ):
        super().__init__( runner, response )

    async def request( self ):

        for retry in range( 1 + self.retry_limit ):
            self._error = None
            self._data = None

            try:
                async with httpx.AsyncClient() as client:
                    print( f'[retry {retry}] url: {self.runner.settings.url}' )
                    response = await self.runner.run_request( client )
                    self.on_complete( response )

                # in case of API usage limits 
                # e.g: nominatim allows at maximum 1 request per second
                if self.request_delay:
                    print( f'Waiting {self.request_delay} seconds due to api limits...' )
                    await asyncio.sleep( self.request_delay )

                return self

            except Exception as error:
                self.on_exception( error )

                if retry < self.retry_limit:
                    print( f'Waiting {self.retry_delay} seconds to retry...' )
                    await asyncio.sleep( self.retry_delay )
                    continue

                return self
