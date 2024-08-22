from datetime import datetime

from . import cron_job
from src.settings import get_settings
from src.db.weather import insert_date
from src.status import set_weather_status

async def weather_cron_job() -> None:

    now: datetime = datetime.now()
    print( now, "weather cron job" )

    settings = get_settings()
    cert_file = None
    last_date = settings.status.weather.last_date
    locations = settings.status.weather.locations
    latitude = ','.join( list( map( lambda l: str( l.lat ), locations ) ) )
    longitude = ','.join( list( map( lambda l: str( l.lon ), locations ) ) )
    # last_date: str = str( now )[ :10 ]

    base_url: str = "https://archive-api.open-meteo.com/v1/archive?daily=weather_code,temperature_2m_min,temperature_2m_mean,temperature_2m_max,precipitation_sum,rain_sum,snowfall_sum&timezone=Europe/Athens"

    def get_url( request_date: str ):
        # &past_days=40
        # &latitude=37.9842,38.5253,38.4625,38.9121,38.8972,38.4361,38.321,38.6263
        # &longitude=23.7281,22.3753,23.595,21.795,22.4311,22.875,23.3178,21.409
        from_date = datetime.strptime( request_date, '%Y-%m-%d' ).date()
        to_date = datetime.now().date()
        delta = to_date - from_date
        past_days = delta.days
        return f"{base_url}&past_days={past_days}&latitude={latitude}&longitude={longitude}"
        
    def parse_response( request_date, response ) -> list[ any ]:
        rows = response.json()
        # print( rows )

        for i, row in enumerate( rows ):
            dates = row[ 'daily' ][ 'time' ]
 
            for j, date in enumerate( dates ):
                if request_date == date:
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
                return None

        return rows

    store_values: callable = insert_date

    set_status = set_weather_status

    await cron_job( last_date, get_url, cert_file, parse_response, store_values, set_status )
