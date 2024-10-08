from datetime import datetime

from src.settings import get_settings
from src.helpers.time import get_next_year_month
from src.helpers.csv import parse_csv_rows, parse_csv_columns
from src.db.interruptions import insert_new_month

from src.helpers.request.RequestRunner import AsyncRequestRunner
from src.helpers.request.RequestMethod import AsyncGetRequestMethod, AsyncPostRequestMethod
from src.helpers.request.RequestSettings import InterruptionsPostSettings, InterruptionsGetSettings
from src.helpers.request.RequestResponse import InterruptionsPostRequestResponse, InterruptionsGetRequestResponse

from . import cron_job

async def interruptions_cron_job() -> None:

    now: datetime = datetime.now()
    print( now, "interruptions cron job" )

    settings = get_settings()
    last_date = settings.status.interruptions.last_date

    ##########################################
    # check month, if update required or not #
    ##########################################

    last_year_month = last_date[ :7 ]
    current_year_month = str( now )[ :7 ]

    if not last_year_month < current_year_month:
        print( "No update required." )
        return

    ########################
    # request for new data #
    ########################

    year_month = get_next_year_month( last_year_month )
    month_year = '/'.join( reversed( year_month.split( '-' ) ) )

    runner = AsyncRequestRunner(
        AsyncPostRequestMethod( InterruptionsPostSettings( { 'month_year': month_year } ) ),
        InterruptionsPostRequestResponse()
    )
    runner.set_request_delay( 1.1 )
    await runner.request()
    print( 'error:', runner.response.error )
    print( 'data:', runner.response.data )

    if runner.response.data:
        runner = AsyncRequestRunner(
            AsyncGetRequestMethod( InterruptionsGetSettings( { 'file_path': runner.response.data } ) ),
            InterruptionsGetRequestResponse()
        )
        runner.set_request_delay( 1.1 )
        await runner.request()
        print( 'error:', runner.response.error )
        print( 'data:', len( runner.response.data ), ' characters' )

    if not runner.response.data:
        print( "No data received." )
        return

    ##########################
    # integrate the new data #
    ##########################

    rows = parse_csv_rows( runner.response.data )[ 1: ]
    rows = list( map( lambda row: parse_csv_columns( row ), rows ) )

    # limit columns to 100 chars to be compatible with DB fields

    list( map( lambda row: 
        list( map( lambda col: col[ :100 ], row ) ), 
    rows ) )

    # exclude row dublicates (if any exists, properly not)

    unique_rows = []
    last_row = []
    for row in rows:
        if ','.join( row ) != ','.join( last_row ):
            row[ 0 ] = '-'.join( reversed( row[ 0 ].split( '/' ) ) )
            unique_rows.append( row )
            last_row = row
    rows = unique_rows

    # store in DB and update status

    print( "Saving data..." )
    await insert_new_month( rows )

    print( "Updating status..." )
    await settings.status.interruptions.update()
    await settings.status.geolocation.update()
