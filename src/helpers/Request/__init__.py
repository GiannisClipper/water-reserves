from abc import ABC, abstractmethod
import httpx
import time

class Request( ABC ):

    _retry_limit = 0
    _retry_delay = 0

    _request_delay = 0

    _params = None
    _response = None
    _error = None
    _data = None

    def __init__( self, params=None ):
        self._params = params

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
    def params( self ):
        return self._params

    def set_params( self, params ):
        self._params = params
        return self

    @property
    @abstractmethod
    def url():
        pass # compose the url 

    @property
    def response( self ):
        return self._response

    @response.setter
    @abstractmethod
    def response( self ):
        pass # parse the request response 

    @property
    def error( self ):
        return self._error

    @property
    def data( self ):
        return self._data

    @abstractmethod
    def request_method( self, client ):
        # client.get( self.url )
        pass # post, put, patch, get, delete

    def request( self ):

        for retry in range( 1 + self.retry_limit ):
            self._error = None
            self._data = None

            try:
                with httpx.Client() as client:
                    print( f'[retry {retry}] url: {self.url}' )
                    response = self.request_method( client )

                    # in case of API usage limits 
                    # e.g: nominatim allows at maximum 1 request per second
                    if self.request_delay:
                        print( f'Waiting {self.request_delay} seconds due to api limits...' )
                        time.sleep( self.request_delay )

                    if response.status_code != 200:
                        self._error = f'{response.status_code} {response.reason_phrase}'
                        result = { 'error': self.error }
                        print( f'Error: {self.error}' )
                        return result

                    print( f'Success: {response.status_code}' )
                    self.response = response
                    result = { 'data': self.data }
                    return result

            except Exception as error:
                self._error = f'{error}'
                print( f'Error: {self.error}' )

                if retry < self.retry_limit:
                    print( f'Waiting {self.retry_delay} seconds to retry...' )
                    time.sleep( self.retry_delay )
                    continue

                result = { 'error': self.error }
                return result
