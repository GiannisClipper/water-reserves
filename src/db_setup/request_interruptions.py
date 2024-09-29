import os
import re
import httpx
import time
import sys
from src.settings import get_settings

def request_monthly( monthYear ):

    print( f'- Month/Year: {monthYear}' )

    settings = get_settings()

    # Check if data already exists (as html file) 

    yearMonth = '-'.join( reversed( monthYear.split( '/' ) ) )
    csvfile = f'{settings.interruptions_csv_path}/{yearMonth}.csv'
    if os.path.exists( csvfile ):
        print( f'Found: {csvfile}' )
        return

    # Post request to get path/filename 

    URL = f'{settings.interruptions_url}/nowater.php'
    print( f'Post request: {URL}' )

    with httpx.Client() as client:

        r = client.post( URL, data={ "sdate": monthYear, "edate": monthYear } )
        if r.status_code != 200:
            print( f'Error: {r.status_code} {r.reason_phrase}' )
            return

        result = re.search( 'files(.+?)csv', r.text )
        if result == None:
            raise Exception( f'No result for given parameter ({monthYear})' )
        filepath = result.group( 0 )

        # Get request to download file content

        time.sleep( .25 )
        URL = f'{settings.interruptions_url}/{filepath}'
        print( f'Get request: {URL}' )

        r = client.get( URL )
        if r.status_code != 200:
            print( f'Error: {r.status_code} {r.reason_phrase}' )
            return

        # Save data into csv file

        try: 
            print( f'Write into: {csvfile}' )
            with open( csvfile, 'w' ) as f:
                f.writelines( r.text )
        except Exception as error:
            print( f'Error: {error}' )


if __name__ == "__main__":

    try:
        n = len( sys.argv )
        if n < 2 or n > 3:
            raise Exception( 'Incorrect number of parameters.' )

        # convert passing arguments to integer variables

        fromYear, fromMonth = sys.argv[ 1 ].split( '-' )
        fromYear = int( fromYear )
        fromMonth = int( fromMonth )
        toYear = fromYear
        toMonth = fromMonth

        if n == 3:
            toYear, toMonth = sys.argv[ 2 ].split( '-' )
            toYear = int( toYear )
            toMonth = int( toMonth )

        # calculate all month/year requests

        year = fromYear
        month = fromMonth
        monthYears = []
        while True:
            if ( year == toYear and month > toMonth ) or year > toYear:
                break
            monthYears.append( f'{month:02}/{year:04}' )
            month += 1
            if month > 12:
                year +=1
                month = 1

        # request data and store in csv files

        for monthYear in monthYears:
            # print( monthYear )
            request_monthly( monthYear )
        # print( os.getcwd() )

    except Exception as error:
        print( 'Error: ' + repr( error ) )
        print ( 'Syntax example: python request_interruptions.py 2023-01' )
        print ( 'Syntax example: python request_interruptions.py 2023-01 2023-12' )

