import os
import httpx
import sys
from src.settings import get_settings
from .read_csv import read_locations

def request_yearly( year, location ):

    name_el, name_en, lat, lon = location

    print( f'- Year (location): {year} ({name_en})' )

    settings = get_settings()

    # Check if data already exists (as JSON file) 

    jsonfile = f'{settings.weather_json_path}/{name_en}/{year}.json'
    if os.path.exists( jsonfile ):
        print( f'Found: {jsonfile}' )
        return

    # Request data 

    URL = f'{settings.weather_url}?latitude={lat}&longitude={lon}&start_date={year}-01-01&end_date={year}-12-31&timezone=Europe/Athens&daily=weather_code,temperature_2m_min,temperature_2m_mean,temperature_2m_max,precipitation_sum,rain_sum,snowfall_sum';
    print( f'Request: {URL}' )

    with httpx.Client() as client:
        r = client.get( URL )

        if r.status_code != 200:
            print( f'Error: {r.status_code} {r.reason_phrase}' )
            return

        # Save data into JSON file

        try: 
            print( f'Write into: {jsonfile}' )
            with open( jsonfile, 'w' ) as f:
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

        headers, locations = read_locations()

        for year in range( int( fromYear ), int( toYear ) + 1 ):
            for location in locations:
                request_yearly( year, location )

    except Exception as error:
        print( 'Error: ' + repr( error ) )
        print ( 'Syntax example: python request_weather.py 2021' )
        print ( 'Syntax example: python request_weather.py 2021 2024' )
