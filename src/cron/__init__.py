from datetime import datetime, timedelta
import httpx
import asyncio
from src.status import load_status

MAX_TRIES: int = 3
LIMIT_DAYS: int = -1
LOOP_DELAY: int = 20

async def cron_job( 
    last_date: str, 
    get_url: callable, 
    cert_file: str | None, 
    parse_response: callable, 
    store_values: callable 
) -> None:

    tries: int = 0
    while tries < MAX_TRIES:
        tries += 1

        request_date: str = str( datetime.strptime( last_date, '%Y-%m-%d' ).date() + timedelta( days=1 ) )
        limit_date: str = str( datetime.now().date() + timedelta( days=LIMIT_DAYS ) )

        # no need to update

        if ( request_date > limit_date ):
            break;

        # request to update

        URL = get_url( request_date )
        print( f'Tries: {tries}, Request: {URL}' )

        async with httpx.AsyncClient( verify=cert_file ) as client:
            response = await client.get( URL )

            # request failure

            if response.status_code != 200:
                print( f'Error: {response.status_code} {response}' )

            # request success

            else:
                print( f'Success: {response.status_code} {response}' )
                values: list[ any ] | None = parse_response( request_date, response )

                # no updated data found

                if ( values == None ):
                    print( "Data source not updated yet." )
                    break

                # store in DB
                print( "Updating data..." )
                await store_values( values )
                print( "Loading status..." )
                await load_status()

                # initialize variables and go to request next date
                last_date = request_date
                tries = 0

        await asyncio.sleep( LOOP_DELAY )
