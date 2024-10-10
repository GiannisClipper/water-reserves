from datetime import datetime, timedelta

from src.requests.weather import WeatherAsyncGetRequestFactory
from src.settings import get_settings
from src.db.weather import insert_date

async def weather_cron_job() -> None:

    now: datetime = datetime.now()
    print( "=>", now, "weather cron job" )

    settings = get_settings()

    while True:
    
        locations = settings.status.weather.locations
        last_date = settings.status.weather.last_date
        request_date: str = str( datetime.strptime( last_date, '%Y-%m-%d' ).date() + timedelta( days=1 ) )
        limit_date: str = str( datetime.now().date() + timedelta( days=-1 ) ) # days=-1 => until yesterday

        # check date, if update required or not #

        if ( request_date > limit_date ):
            print( "No update required." )
            break;

        # request for new data #

        req_handler = WeatherAsyncGetRequestFactory( { 'date': request_date, 'locations': locations } ).handler
        await req_handler.request()
        print( 'error:', req_handler.parser.error )
        print( 'data:', req_handler.parser.data )

        if not req_handler.parser.data:
            print( "No updates available yet." )
            break

        # store in DB and update status

        print( "Saving data..." )
        for location_id, row in enumerate( req_handler.parser.data ):
            location_id += 1
            row.append( location_id )
        await insert_date( req_handler.parser.data )

        print( "Updating status..." )
        await settings.status.weather.update()
