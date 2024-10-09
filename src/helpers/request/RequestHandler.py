from dataclasses import dataclass
from abc import ABC, abstractmethod
from src.helpers.request.RequestRunner import RequestRunner 
from src.helpers.request.ResponseParser import ResponseParser
import httpx
import time
import asyncio

@dataclass
class RequestHandler( ABC ):

    runner: RequestRunner = None
    parser: ResponseParser = None

    retry_limit: int = 0
    retry_delay: int = 0
    request_delay: int = 0

    @abstractmethod
    def request( self ):
        pass

    def on_complete( self, response ):

        if response.status_code != 200:
            self.parser.error = f'{response.status_code} {response.reason_phrase}'
            print( f'Error: {self.parser.error}' )
            return

        print( f'Success: {response.status_code}' )
        self.parser.parse_response( response )
        return

    def on_exception( self, error ):

        self.parser.error = f'{error}'
        print( f'Error: {self.parser.error}' )
        return

@dataclass
class SyncRequestHandler( RequestHandler ):

    def request( self ):

        for retry in range( 1 + self.retry_limit ):
            self.parser.error = None
            self.parser.data = None

            try:
                with httpx.Client( verify=self.runner.settings.certification ) as client:
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
                # How do I print an exception in Python?
                # https://stackoverflow.com/a/67112173/12138247
                print( f"{type( error ).__name__} at line { error.__traceback__.tb_lineno } of { __file__ }: { error }")

                self.on_exception( error )

                if retry < self.retry_limit:
                    print( f'Waiting {self.retry_delay} seconds to retry...' )
                    time.sleep( self.retry_delay )
                    continue
                return self

@dataclass
class AsyncRequestHandler( RequestHandler ):

    async def request( self ):

        for retry in range( 1 + self.retry_limit ):
            self.parser.error = None
            self.parser.data = None

            try:
                async with httpx.AsyncClient( verify=self.runner.settings.certification ) as client:
                    print( f'[retry {retry}] url: {self.runner.settings.url}' )
                    response = await self.runner.run_request( client )
                    self.on_complete( response )

                # in case of API usage limits 
                # e.g: nominatim allows at maximum 1 request per second
                if self.request_delay:
                    print( f'Waiting {self.request_delay} seconds (prevent api overloading)...' )
                    await asyncio.sleep( self.request_delay )

                return self

            except Exception as error:
                # How do I print an exception in Python?
                # https://stackoverflow.com/a/67112173/12138247
                print( f"{type( error ).__name__} at line { error.__traceback__.tb_lineno } of { __file__ }: { error }")

                self.on_exception( error )

                if retry < self.retry_limit:
                    print( f'Waiting {self.retry_delay} seconds to retry...' )
                    await asyncio.sleep( self.retry_delay )
                    continue

                return self
