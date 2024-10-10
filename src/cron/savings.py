from datetime import datetime, timedelta

from src.requests.savings import SavingsAsyncGetRequestFactory
from src.queries.savings import SavingsPoolQueryFactory
from src.settings import get_settings

async def savings_cron_job() -> None:

    now: datetime = datetime.now()
    print( "=>", now, "savings cron job" )

    settings = get_settings()

    while True:
    
        last_date = settings.status.savings.last_date
        request_date: str = str( datetime.strptime( last_date, '%Y-%m-%d' ).date() + timedelta( days=1 ) )
        limit_date: str = str( datetime.now().date() + timedelta( days=-1 ) ) # days=-1 => until yesterday

        # check date, if update required or not #

        if ( request_date > limit_date ):
            print( "No update required." )
            break;

        # request for new data #

        req_handler = SavingsAsyncGetRequestFactory( { 'date': request_date } ).handler
        await req_handler.request()
        print( 'error:', req_handler.parser.error )
        print( 'data:', req_handler.parser.data )

        if not req_handler.parser.data:
            print( "No updates available yet." )
            break

        # store in DB and update status

        print( "Saving data..." )
        query_handler = SavingsPoolQueryFactory().handler
        # insert_into() receives list of list (bulk inputs)
        query_handler.maker.insert_into( [ req_handler.parser.data ] )
        await query_handler.run_query()

        print( "Updating status..." )
        await settings.status.savings.update()
