import os
import json
import httpx
import time
import sys
from src.settings import get_settings
from .request_interruptions import parse_argv
from src.helpers.csv import read_csv
from src.helpers.json import parse_json_content
from src.helpers.text import simplify

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

def parse_roads( intersection ):
    roads = intersection.split( ' και ' )
    if len( roads ) < 2:
        roads = intersection.split( ' & ' )
    return list( map( lambda r: r.strip(), roads ) )

def parse_intersection( roads ):
    return ' και '.join( roads )

# to remove trailing comments 
# separated by double space, by comma or in parenthesis)
def simplify_intersection( intersection ):

    # print( intersection )
    roads = parse_roads( intersection )

    # more than two roads considering as comments
    roads = roads[ :2 ]

    # remove text after double space
    roads = list( map( lambda r: r.split( '  ' )[ 0 ], roads ) )

    # remove text after comma
    roads = list( map( lambda r: r.split( ',' )[ 0 ].strip(), roads ) )

    # remove text after opening parenthsis
    roads = list( map( lambda r: r.split( '(' )[ 0 ].strip(), roads ) )

    intersection = parse_intersection( roads )
    # print( intersection )

    return intersection

def simplify_road( road ):

    # considering values like Λεωφ. Ελ.  Βενιζέλου και Λεωφ. Κων. Καραμανλή
    result = ""
    for part in road.split( ' ' ):
        if len( part ) > len( result ):
            result = part
    return result

def simplify_area( area ):

    # considering matched values like Ν. Ιωνία vs Νέα Ιωνία
    if len( area.split( ' ' ) ) > 1:
        area = area.split( ' ' )[ -1 ]

    # considering matched values like Ζωγράφος vs Ζωγράφου
    area = area[ :-2 ]

    return area

def parse_queries( base_url, interruption ):

    suffix = 'Attica,Greece'

    area = interruption[ 'area' ]
    if len( area.split( ' ' ) ) > 1:
        area = area.split( ' ' )[ -1 ]

    intersection = interruption[ 'intersection' ]
    intersection = simplify_intersection( intersection )
    roads = parse_roads( intersection )
    roads = list( map( lambda r: simplify_road( r ), roads ) )

    result = []
    for road in roads:
        result.append( { 
            'road': road,
            'area': area,
            'url': f'{base_url}{road},{area},{suffix}'
        } )

    return result

def make_request( url ):

    with httpx.Client() as client:
        print( 'url:', url )
        response = client.get( url )
        print( f'Success: {response.status_code}' )
        return response

def parse_nominatim_response( query, response ):

    url = query[ 'url' ]
    area = query[ 'area' ]
    road = query[ 'road' ]
    data = response.json()
    result = []
    for row in data:
        result.append( {
            'url': url,
            'area': area,
            'road': road,
            'descr': row[ 'display_name' ],
            'lat': float( row[ 'lat' ] ),
            'lon': float( row[ 'lon' ] )
        } )
    return result

def parse_geoapify_response( query, response ):

    url = query[ 'url' ]
    area = query[ 'area' ]
    road = query[ 'road' ]
    data = response.json()
    result = []
    for row in data[ 'features' ]:
        properties = row[ 'properties' ]
        # print( 'properties', properties)
        descr = ''
        if properties.get( 'name' ): descr = f'{properties.get( 'name' )}'
        if properties.get( 'street' ): descr = f'{descr}, {properties.get( 'street' )}'
        if properties.get( 'suburb' ): descr = f'{descr}, {properties.get( 'suburb' )}'
        if properties.get( 'city' ): descr = f'{descr}, {properties.get( 'city' )}'
        if properties.get( 'state_district' ): descr = f'{descr}, {properties.get( 'state_district' )}'
        if properties.get( 'state' ): descr = f'{descr}, {properties.get( 'state' )}'
        result.append( {
            'url': url,
            'area': area,
            'road': road,
            'descr': descr,
            'lat': row[ 'properties' ][ 'lat' ],
            'lon': row[ 'properties' ][ 'lon' ]
        } )
    return result

# def filter_results( results, area ):

#     district = [ 'ΑΤΤΙΚΗ', 'ATTICA' ]

#     area = simplify_area( area )

#     new_results = []
#     for row in results:
#         descr = simplify( row[ 'descr' ] )
#         if area in descr and any( list( map( lambda v: v in descr, district ) ) ):
#             new_results.append( row )

#     return new_results

# def select_result( results ):

#     # reverse the order of the description from area,address,attica,greece to: greece,attica,area,address
#     for result in results:
#         result[ 'descr' ] = ','.join( reversed( result[ 'descr' ].split( ',' ) ) )

#     # sort by description
#     results = sorted( results, key=lambda d: d[ 'descr' ] )
#     # print( list( map( lambda r: r[ 'descr' ], results ) ) )
#     # best rank: 8
#     # best result: {'lat': 37.969759, 'lon': 23.622377, 'descr': 'Αμισού, Αμφιάλη, Δημοτική Ενότητα Κερατσινίου, Δήμος Κερατσινίου - Δραπετσώνας, Περιφερειακή Ενότητα Πειραιώς, Περιφέρεια Αττικής, Αποκεντρωμένη Διοίκηση Αττικής, 187 58, Ελλάς'}

#     # split description into list
#     for result in results:
#         result[ 'descr' ] = result[ 'descr' ].split( ',' )

#     best_rank = 0
#     best_result = None
#     prev_result = None

#     for result in results:

#         if not best_result:
#             best_result = result
#             prev_result = result
#             continue

#         rank = 0
#         for descr in zip( result[ 'descr' ], prev_result[ 'descr' ] ):
#             if descr[ 0 ] == descr[ 1 ]:
#                 rank += 1

#         if rank >= best_rank:
#             best_rank = rank
#             best_result = result

#         prev_result = result;

#     if best_result == None:
#         return best_result

#     # reverse back the order of the description
#     best_result[ 'descr' ] = ','.join( reversed( best_result[ 'descr' ] ) )
#     return best_result

def match_area_and_road( results ):

    district = [ 'ΑΤΤΙΚΗ', 'ATTICA' ]

    for result in results:

        descr = simplify( result[ 'descr' ] )
        area = simplify_area( result[ 'area' ] )
        road = simplify( result[ 'road' ] )

        if any( list( map( lambda v: v in descr, district ) ) ):
            if area == None or area in descr:
                if road == None or road in descr:
                    return result

    return None

def match_area( results ):

    district = [ 'ATTICA', 'ΑΤΤΙΚΗ', 'ΑΤΙΙΚΗ' ]
    # ΑΤΙΙΚΗ: very common typo error in geoapify results

    for result in results:

        descr = simplify( result[ 'descr' ] )
        area = simplify_area( result[ 'area' ] )

        if any( list( map( lambda v: v in descr, district ) ) ):
            if area == None or area in descr:
                return result

    return None

def match_road( results ):

    district = [ 'ATTICA', 'ΑΤΤΙΚΗ', 'ΑΤΙΙΚΗ' ]
    # ΑΤΙΙΚΗ: very common typo error in geoapify results

    for result in results:

        descr = simplify( result[ 'descr' ] )
        road = simplify( result[ 'road' ] )

        if any( list( map( lambda v: v in descr, district ) ) ):
            if road == None or road in descr:
                return result

    return None


def request_apis( interruption ):
        
    settings = get_settings()

    base_urls ={
        'nominatim': 'https://nominatim.openstreetmap.org/search?format=json&q=',
        'geoapify': f'https://api.geoapify.com/v1/geocode/search?apiKey={settings.GEOAPIFY_API_KEY}&lang=el&text='
    }

    nominatim_queries = parse_queries( base_urls[ 'nominatim' ], interruption )
    geoapify_queries = parse_queries( base_urls[ 'geoapify' ], interruption )

    # to locate incomplete geolocations
    # print( 'Incomplete interruption:', interruption )
    # print( nominatim_queries )
    # print( geoapify_queries )
    # return None

    # make requests
    nominatim_results = []
    geoapify_results = []
    result = None

    for query in nominatim_queries:
        url = query[ 'url' ]
        area = query[ 'area' ]
        road = query[ 'road' ]
        response = make_request( url )
        results = parse_nominatim_response( query, response )
        result = match_area_and_road( results )
        if result != None:
            return result
        nominatim_results += results
        print( 'nominatim_results', nominatim_results)
        time.sleep( 1.25 )
    
    for query in geoapify_queries:
        url = query[ 'url' ]
        area = query[ 'area' ]
        road = query[ 'road' ]
        response = make_request( url )
        results = parse_geoapify_response( query, response )
        result = match_area_and_road( results )
        if result != None:
            return result
        geoapify_results += results
        print( 'geoapify_queries', geoapify_queries)
        time.sleep( 1.25 )

    result = match_area( nominatim_results )
    if result != None:
        return result

    result = match_area( geoapify_results )
    if result != None:
        return result

    result = match_road( nominatim_results )
    if result != None:
        return result

    result = match_road( geoapify_results )

    print( 'nominatim_results:', nominatim_results )
    print( 'geoapify_results:', geoapify_results )

    return result

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

