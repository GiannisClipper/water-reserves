from datetime import datetime
import httpx

from ..settings import get_settings
cert_file = get_settings().cert_file

async def savings_cron() -> None:

    now: datetime = datetime.now()
    print( now, "savings cron job" )

    today: str = str( now )[ :10 ]
    rev_today = '-'.join( reversed( today.split( '-' ) ) )
    URL = f'https://www.eydap.gr/el/Controls/GeneralControls/SavingsDetails.aspx?DaysSpan=Year&Date={rev_today}'
    print( f'Request: {URL}' )

    async with httpx.AsyncClient( verify=cert_file ) as client:
        response = await client.get( URL )
        print('response',response)
        if response.status_code != 200:
            print( f'Error: {response.status_code} {response} {response.content}' )
            return
