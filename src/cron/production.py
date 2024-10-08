from datetime import datetime, timedelta

from src.requests.production import ProductionAsyncGetRequestFactory
from src.settings import get_settings
from src.db.production import insert_date

async def production_cron_job() -> None:

    now: datetime = datetime.now()
    print( "=>", now, "production cron job" )

    settings = get_settings()

    while True:
    
        last_date = settings.status.production.last_date
        request_date: str = str( datetime.strptime( last_date, '%Y-%m-%d' ).date() + timedelta( days=1 ) )
        limit_date: str = str( datetime.now().date() + timedelta( days=-1 ) ) # days=-1 => until yesterday

        # check date, if update required or not #

        if ( request_date > limit_date ):
            print( "No update required." )
            break;

        # request for new data #

        req_handler = ProductionAsyncGetRequestFactory( { 'date': request_date } ).handler
        await req_handler.request()
        print( 'error:', req_handler.response.error )
        print( 'data:', req_handler.response.data )

        if not req_handler.response.data:
            print( "No updates available yet." )
            break

        # store in DB and update status

        print( "Saving data..." )
        await insert_date( req_handler.response.data )

        print( "Updating status..." )
        await settings.status.production.update()
