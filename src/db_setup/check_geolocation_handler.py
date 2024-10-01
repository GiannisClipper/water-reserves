import os
import json
import httpx
import time
import sys
from .GeolocationHandler import NominatimHandler, GeoapifyHandler
from src.settings import get_settings
from .request_interruptions import parse_argv
from src.helpers.csv import read_csv
from src.helpers.json import parse_json_content
from src.helpers.text import no_tones

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


def request_apis( interruption ):

    nominatimHandler = NominatimHandler( interruption )
    geoapifyHandler = GeoapifyHandler( interruption )

    # make requests
    result = None

    for url in nominatimHandler.urls:
        nominatimHandler.make_request( url )
        results = nominatimHandler.results
        match_results = list( filter( lambda r: r[ 'match_district' ] and r[ 'match_area' ] and r[ 'match_street' ], results ) )
        # print( 'nominatim_results =>', nominatimHandler.results )
        if len( match_results ) > 0:
            return match_results[ 0 ]
        time.sleep( 1.25 )
    
    for url in geoapifyHandler.urls:
        geoapifyHandler.make_request( url )
        results = geoapifyHandler.results
        match_results = list( filter( lambda r: r[ 'match_district' ] and r[ 'match_area' ] and r[ 'match_street' ], results ) )
        # print( 'geoapify_results =>', geoapifyHandler.results )
        if len( match_results ) > 0:
            return match_results[ 0 ]
        time.sleep( 1.25 )

    results = nominatimHandler.results
    match_results = list( filter( lambda r: r[ 'match_district' ] and r[ 'match_area' ], results ) )
    if len( match_results ) > 0:
        return match_results[ 0 ]

    results = geoapifyHandler.results
    match_results = list( filter( lambda r: r[ 'match_district' ] and r[ 'match_area' ], results ) )
    if len( match_results ) > 0:
        return match_results[ 0 ]

    results = nominatimHandler.results
    match_results = list( filter( lambda r: r[ 'match_district' ] and r[ 'match_street' ], results ) )
    if len( match_results ) > 0:
        return match_results[ 0 ]

    results = geoapifyHandler.results
    match_results = list( filter( lambda r: r[ 'match_district' ] and r[ 'match_street' ], results ) )
    if len( match_results ) > 0:
        return match_results[ 0 ]

    print( 'nominatim_results =>', nominatimHandler.results )
    print( 'geoapify_results =>', geoapifyHandler.results )

    return None


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

    saveEnabled = True

    for i, interruption in enumerate( interruptions ):

        if saveEnabled and i % 10 == 0:
            save_interruptions( interruptions )
            saveEnabled = False

        if interruption.get( 'geo_url' ) != None:
            continue

        print( f'#{i+1} of {len( interruptions )}')

        result = request_apis( interruption )

        if result != None:
            interruption[ 'geo_url' ] = result[ 'url' ]
            interruption[ 'geo_descr' ] = result[ 'descr' ]
            interruption[ 'lat' ] = result[ 'lat' ]
            interruption[ 'lon' ] = result[ 'lon' ]
            saveEnabled = True

        print( 'interruption:', interruptions[ i ] )

        if i > 6:
            break

        if saveEnabled and i == len( interruptions ) - 1:
            save_interruptions( interruptions )


# def parse_json( monthYear ):

#     interruptions = parse_interruptions( monthYear )

#     for i, interruption in enumerate( interruptions ):

#         if interruption.get( 'geo_url' ) != None:
#             continue

#         print( f'#{i+1} of {len( interruptions )}')

#         result = request_apis( interruption )


if __name__ == "__main__":

    # try:
        monthYears = parse_argv( sys.argv )

        # read csv data, request geolocations and store in json files
        for monthYear in monthYears:
            parse_json( monthYear )
            break

        # results = [ 
        #     {'url': 'https://api.geoapify.com/v1/geocode/search?apiKey=d26975e0efb049b99bea416fba70e36f&lang=el&text=Μεσσολογίου,ΓΑΛΑΤΣΙ,Attica,Greece', 'area': 'ΓΑΛΑΤΣΙ', 'road': 'Μεσσολογίου', 'descr': ', Γαλατσίου, Ατιική', 'lat': 38.01915, 'lon': 23.75711}, 
        #     {'url': 'https://api.geoapify.com/v1/geocode/search?apiKey=d26975e0efb049b99bea416fba70e36f&lang=el&text=Μεσσολογίου,ΓΑΛΑΤΣΙ,Attica,Greece', 'area': 'ΓΑΛΑΤΣΙ', 'road': 'Μεσσολογίου', 'descr': ', Γαλάτσιον, Ατιική', 'lat': 38.01915, 'lon': 23.75711}, 
        #     {'url': 'https://api.geoapify.com/v1/geocode/search?apiKey=d26975e0efb049b99bea416fba70e36f&lang=el&text=Κνωσού,ΓΑΛΑΤΣΙ,Attica,Greece', 'area': 'ΓΑΛΑΤΣΙ', 'road': 'Κνωσού', 'descr': ', Γαλατσίου, Ατιική', 'lat': 38.01915, 'lon': 23.75711},
        #     {'url': 'https://api.geoapify.com/v1/geocode/search?apiKey=d26975e0efb049b99bea416fba70e36f&lang=el&text=Κνωσού,ΓΑΛΑΤΣΙ,Attica,Greece', 'area': 'ΓΑΛΑΤΣΙ', 'road': 'Κνωσού', 'descr': ', Γαλάτσιον, Ατιική', 'lat': 38.01915, 'lon': 23.75711}
        # ]
        # print( match_area( results ) )

    # except Exception as ex:
    #     # How do I print an exception in Python?
    #     # https://stackoverflow.com/a/67112173/12138247
    #     print( f"{type( ex ).__name__} at line { ex.__traceback__.tb_lineno } of { __file__ }: { ex }")

    #     print( 'Error: ' + repr( ex ) )
    #     print ( 'Syntax example: python parse_json_interruptions.py 2023-01' )
    #     print ( 'Syntax example: python parse_json_interruptions.py 2023-01 2023-12' )

