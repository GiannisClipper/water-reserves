from datetime import datetime

from src.settings import get_settings
from src.requests.interruptions import InterruptionsAsyncPostRequestFactory, InterruptionsAsyncGetRequestFactory
from src.helpers.time import get_next_year_month
from src.helpers.csv import parse_csv_rows, parse_csv_columns
from src.db.interruptions import insert_new_month

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

    req_handler = InterruptionsAsyncPostRequestFactory( { 'month_year': month_year } ).handler
    await req_handler.request()
    print( 'error:', req_handler.parser.error )
    print( 'data:', req_handler.parser.data )

    if req_handler.parser.data:

        req_handler = InterruptionsAsyncGetRequestFactory( { 'file_path': req_handler.parser.data } ).handler
        await req_handler.request()
        print( 'error:', req_handler.parser.error )
        print( 'data:', len( req_handler.parser.data ), ' characters' )

    if not req_handler.parser.data:
        print( "No data received." )
        return

    ##########################
    # integrate the new data #
    ##########################

    rows = parse_csv_rows( req_handler.parser.data )[ 1: ]
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
