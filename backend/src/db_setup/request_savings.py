import os
import httpx
import sys
from src.settings import get_settings

def request_yearly( year ):

    print( f'- Year: {year}' )

    settings = get_settings()

    # Check if data already exists (as html file) 

    htmlfile = f'{settings.savings_html_path}/{year}.html'
    if os.path.exists( htmlfile ):
        print( f'Found: {htmlfile}' )
        return

    # Request data 

    cert_file = settings.cert_file

    URL = f'{settings.savings_url}?DaysSpan=Year&Date=31-12-{year}'
    print( f'Request: {URL}' )

    with httpx.Client( verify=cert_file ) as client:
        r = client.get( URL )

        if r.status_code != 200:
            print( f'Error: {r.status_code} {r.reason_phrase}' )
            return

        # Save data into HTML file

        try: 
            print( f'Write into: {htmlfile}' )
            with open( htmlfile, 'w' ) as f:
                f.writelines( r.text )
        except Exception as error:
            print( f'Error: {error}' )


if __name__ == "__main__":

    try:
        n = len( sys.argv )
        if n < 2 or n > 3:
            raise Exception( 'Incorrect number of parameters.' )

        fromYear = int( sys.argv[ 1 ] )
        toYear = int( sys.argv[ 1 ] )

        if n == 3:
            toYear = int( sys.argv[ 2 ] )

        for year in range( int( fromYear ), int( toYear ) + 1 ):
            request_yearly( year )

    except Exception as error:
        print( 'Error: ' + repr( error ) )
        print ( 'Syntax example: python request_savings.py 2021' )
        print ( 'Syntax example: python request_savings.py 2021 2024' )

