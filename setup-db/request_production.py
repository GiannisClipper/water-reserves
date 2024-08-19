import os
import requests # type: ignore

import sys

def request_yearly( year ):

    print( f'- Year: {year}' )

    # Check if data already exists (as html file) 

    htmlfile = f'./production/html/{year}.html'
    if os.path.exists( htmlfile ):
        print( f'Found: {htmlfile}' )
        return

    # Request data 

    URL = f'https://www.eydap.gr/el/Controls/GeneralControls/DrinkingWaterProductionDetails.aspx?DaysSpan=Year&Date=31-12-{year}'
    print( f'Request: {URL}' )
    r = requests.get( URL, verify='../resources/eydap.gr.cert' )
    if r.status_code != 200:
        print( f'Error: {r.status_code} {r.reason}' )
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
        print ( 'Syntax example: python request_production.py 2021' )
        print ( 'Syntax example: python request_production.py 2021 2024' )

