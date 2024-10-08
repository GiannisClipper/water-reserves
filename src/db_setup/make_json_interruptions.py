import os
import json
import sys

from .request_interruptions import parse_argv
from src.helpers.csv import read_csv
from src.helpers.json import parse_json_content

from src.settings import get_settings

from src.geography.GeolocationHandler import GeolocationHandler
from src.geography.MunicipalitiesHandler import MunicipalitiesHandler

def parse_interruptions( monthYear ):

    settings = get_settings()

    # Check if data already exists (as json file) 

    yearMonth = '-'.join( reversed( monthYear.split( '/' ) ) )
    jsonfile = f'{settings.interruptions_json_path}/{yearMonth}.json'

    interruptions = []
    if os.path.exists( jsonfile ):
        print( f'Found: {jsonfile}' )
        interruptions = parse_json_content( jsonfile )

    if len( interruptions ) > 0:
        return interruptions

    # Read data from csv file 

    yearMonth = '-'.join( reversed( monthYear.split( '/' ) ) )
    csvfile = f'{settings.interruptions_csv_path}/{yearMonth}.csv'
    if not os.path.exists( csvfile ):
        print( f'Not found: {csvfile}' )
        return

    [ headers, data_as_arr ] = read_csv( csvfile )

    # convert to array of dictionaries
    data = []
    for row in data_as_arr:

        data.append( {
            "date": '-'.join( reversed( row[ 0 ].split( '/' ) ) ),
            "scheduled": row[ 1 ],
            "intersection": row[ 2 ],
            "area": row[ 3 ]
        } )

    # print( data )
    return data


def save_interruptions( interruptions ):

    settings = get_settings()

    try: 
        yearMonth = '-'.join( reversed( monthYear.split( '/' ) ) )
        jsonfile = f'{settings.interruptions_json_path}/{yearMonth}.json'

        print( f'Write into: {jsonfile}' )
        with open( jsonfile, 'w', encoding='utf8' ) as f:
            json.dump( interruptions, f, indent=2, sort_keys=False, ensure_ascii=False )
    
    except Exception as error:
        print( f'Error: {error}' )


def parse_json( monthYear ):

    print( f'- Month/Year: {monthYear}' )

    interruptions = parse_interruptions( monthYear )

    if all( list( map( lambda inter: inter.get( 'geo_url' ) != None, interruptions ) ) ):
        return

    municipalitiesHandler = MunicipalitiesHandler()

    saveEnabled = True

    for i, interruption in enumerate( interruptions ):

        if saveEnabled and i % 10 == 0:
            save_interruptions( interruptions )
            saveEnabled = False

        if interruption.get( 'geo_url' ) != None:
            continue

        if interruption.get( 'geo_failed' ) == True:
            continue

        print()
        print( f'{monthYear} => #{i+1} of {len( interruptions )}')

        print(interruption)
        geolocationHandler = GeolocationHandler( interruption )
        result = geolocationHandler.result

        if not result:
            interruption[ 'geo_failed' ] = True
            saveEnabled = True

        elif not result.get( 'error' ):
            interruption[ 'geo_url' ] = result[ 'url' ]
            interruption[ 'geo_descr' ] = result[ 'descr' ]
            interruption[ 'lat' ] = result[ 'lat' ]
            interruption[ 'lon' ] = result[ 'lon' ]
            interruption[ 'municipality' ] = municipalitiesHandler.findByPoint( result[ 'lat' ], result[ 'lon' ] )
            saveEnabled = True

        print( 'interruption:', interruptions[ i ] )

        if saveEnabled and i == len( interruptions ) - 1:
            save_interruptions( interruptions )


# def check_json( monthYear ):

#     interruptions = parse_interruptions( monthYear )

#     for i, interruption in enumerate( interruptions ):

#         if interruption.get( 'geo_url' ) != None:
#             continue

#         print( f'#{i+1} of {len( interruptions )}')

#         print( interruption )

# def remove_geo_failed( monthYear ):

#     interruptions = parse_interruptions( monthYear )

#     should_save = False

#     for i, interruption in enumerate( interruptions ):

#         if interruption.get( 'geo_failed' ):
#             del interruption[ 'geo_failed' ]
#             should_save= True

#     if should_save:
#         save_interruptions( interruptions )


if __name__ == "__main__":

    # try:
        monthYears = parse_argv( sys.argv )

        for monthYear in monthYears:
            parse_json( monthYear )

        # for monthYear in monthYears:
        #     check_json( monthYear )

        # for monthYear in monthYears:
        #     remove_geo_failed( monthYear )

    # except Exception as ex:
    #     # How do I print an exception in Python?
    #     # https://stackoverflow.com/a/67112173/12138247
    #     print( f"{type( ex ).__name__} at line { ex.__traceback__.tb_lineno } of { __file__ }: { ex }")

    #     print( 'Error: ' + repr( ex ) )
    #     print ( 'Syntax example: python parse_json_interruptions.py 2023-01' )
    #     print ( 'Syntax example: python parse_json_interruptions.py 2023-01 2023-12' )

