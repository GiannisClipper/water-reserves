from datetime import datetime
from src.helpers.request.RequestFactory import RequestFactory
from src.helpers.request.RequestHandler import AsyncRequestHandler
from src.helpers.request.RequestSettings import GetRequestSettings
from src.helpers.request.RequestRunner import AsyncGetRequestRunner
from src.helpers.request.ResponseParser import ResponseParser

from src.settings import Settings, get_settings
from src.helpers.html import scrape_html

class WeatherGetSettings( GetRequestSettings ):

    def __init__( self, params=None ):
        super().__init__( params )

    @property
    def url( self ):
        settings: Settings = get_settings()
        locations: list = self.params[ 'locations' ]
        date: str = self.params[ 'date' ]

        daily: str = 'weather_code,temperature_2m_min,temperature_2m_mean,temperature_2m_max,precipitation_sum,rain_sum,snowfall_sum'
        timezone: str = 'Europe/Athens'

        from_date = datetime.strptime( date, '%Y-%m-%d' ).date()
        to_date = datetime.now().date()
        delta = to_date - from_date
        past_days = delta.days

        latitude: str = ','.join( list( map( lambda l: str( l.lat ), locations ) ) )
        longitude: str = ','.join( list( map( lambda l: str( l.lon ), locations ) ) )

        # &past_days=40
        # &latitude=37.9842,38.5253,38.4625,38.9121,38.8972,38.4361,38.321,38.6263
        # &longitude=23.7281,22.3753,23.595,21.795,22.4311,22.875,23.3178,21.409

        return f"{settings.weather_url}?daily={daily}&timezone={timezone}&past_days={past_days}&latitude={latitude}&longitude={longitude}"

class WeatherGetResponseParser( ResponseParser ):

    def __init__( self, params ):
        super().__init__( params )

    def parse_response( self, response ):
        rows = response.json()
        # print( rows )

        for i, row in enumerate( rows ):
            dates = row[ 'daily' ][ 'time' ]
 
            for j, date in enumerate( dates ):
                if self.params[ 'date' ] == date:
                    rows[ i ] = [
                        date,
                        row[ 'daily' ][ 'weather_code' ][ j ],
                        row[ 'daily' ][ 'temperature_2m_min' ][ j ],
                        row[ 'daily' ][ 'temperature_2m_mean' ][ j ],
                        row[ 'daily' ][ 'temperature_2m_max' ][ j ],
                        row[ 'daily' ][ 'precipitation_sum' ][ j ],
                        row[ 'daily' ][ 'rain_sum' ][ j ],
                        row[ 'daily' ][ 'snowfall_sum' ][ j ]
                    ]
                    break
        # print( rows )

        # check for incomplete data (null values)

        for i, row in enumerate( rows ):
            nulls = list( filter( lambda v: v == None, row ) )
            if len( nulls ) > 0:
                return

        self._data = rows

class WeatherAsyncGetRequestFactory( RequestFactory ):

    def __init__( self, params: dict ):

        settings = WeatherGetSettings( params )
        runner = AsyncGetRequestRunner( settings )
        parser = WeatherGetResponseParser( params )
        self._handler = AsyncRequestHandler( runner, parser )
        self._handler.set_request_delay( 5 )