from datetime import datetime

from . import cron_job
from src.settings import get_settings
from src.helpers.html import scrape_html
from src.db.savings import insert_date

async def savings_cron_job() -> None:

    now: datetime = datetime.now()
    print( now, "savings cron job" )

    settings = get_settings()
    cert_file = settings.cert_file
    last_date = settings.status.savings.last_date
    # last_date: str = str( now )[ :10 ]

    base_url: str = "https://www.eydap.gr/el/Controls/GeneralControls"
    get_url: callable = lambda date: f'{base_url}/SavingsDetails.aspx?DaysSpan=Day&Date={'-'.join( reversed( date.split( '-' ) ) )}'

    def parse_response( request_date, response ) -> list[ any ]:
        headers, data = scrape_html( response.content )
        print( headers, data )
        data = list( filter( lambda x: x[ 0 ] == request_date, data ) )
        print( data )

        if len( data ) > 0:
            return data[ 0 ]

        return None

    store_values: callable = insert_date

    await cron_job( last_date, get_url, cert_file, parse_response, store_values )
