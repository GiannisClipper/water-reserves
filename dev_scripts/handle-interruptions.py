import httpx
import time
import psycopg
conninfo = f"user=admin password=pass5678 host=127.0.0.1 port=5432 dbname=water_reserves"

def csv_row( row ):

    result = []
    enabled = True
    buffer = ''
    for chr in row:
        if chr == '"':
            # start string in double quotes
            if buffer == '':
                enabled = False
                continue
            # finish string in double quotes
            if not enabled:
                enabled = True
                continue

        # extract column
        if enabled and chr == ',':
            result.append( buffer )
            buffer = ''
            continue

        buffer += chr

    result.append( buffer )
    return result

def read_interruptions( filename ):

    file = open( filename, "r" )
    content = file.read()
    file.close()

    # split csv content into rows 
    lines = content.split( '\n' )
    # remove the headers
    del lines[ :1 ]
    # remove the last blank line
    if lines[ -1 ] == '':
        lines.pop()

    # split csv rows into values
    data = []
    for line in lines:
        line = csv_row( line )

        # transform values
        line[ 0 ] = '-'.join( reversed( line[ 0 ].split( '/' ) ) )

        # convert to dictionary
        data.append( {} );
        data[ -1 ][ 'date' ] = line[ 0 ]
        data[ -1 ][ 'scheduled' ] = line[ 1 ]
        data[ -1 ][ 'intersection' ] = line[ 2 ]
        data[ -1 ][ 'area' ] = line[ 3 ]

    return data


def find_geolocation( interruption ):

    base_url = 'https://nominatim.openstreetmap.org/search?format=json&q='
    query_suffix = 'attica,greece'

    # get values
    area = interruption[ 'area' ]
    roads = interruption[ 'intersection' ].split( ' και ' )

    # create queries
    queries = []
    for road in roads:
        queries.append( f'{road},{area},{query_suffix}' )
    queries.append( f'{area},{query_suffix}' )

    # make requests
    results = []
    with httpx.Client() as client:
        for query in queries:
            url = f'{base_url}{query}'
            print( 'url:', url )
            response = client.get( url )
            print( f'Success: {response.status_code}' )

            # collect the results
            result = response.json()
            for item in result:
                item[ 'url' ] = url
                # reverse the description => greece,attica,area,address
                item[ 'descr' ] = ','.join( reversed( item[ 'display_name' ].split( ',' ) ) )
                item[ 'lat' ] =  float( item[ 'lat' ] )
                item[ 'lon' ] =  float( item[ 'lon' ] )
            results += result

            time.sleep( 1.5 )

    # sort by description
    results = sorted( results, key=lambda d: d[ 'descr' ] )

    # print( list( map( lambda r: r[ 'descr' ], results ) ) )
    # ' Ελλάς, 187 58, Αποκεντρωμένη Διοίκηση Αττικής, Περιφέρεια Αττικής, Περιφερειακή Ενότητα Πειραιώς, Δήμος Κερατσινίου - Δραπετσώνας, Δημοτική Ενότητα Κερατσινίου, Αμφιάλη,Αγίας Λαύρας', 
    # ' Ελλάς, 187 58, Αποκεντρωμένη Διοίκηση Αττικής, Περιφέρεια Αττικής, Περιφερειακή Ενότητα Πειραιώς, Δήμος Κερατσινίου - Δραπετσώνας, Δημοτική Ενότητα Κερατσινίου, Αμφιάλη,Αμισού',     
    # ' Ελλάς, Αποκεντρωμένη Διοίκηση Αττικής, Περιφέρεια Αττικής, Περιφερειακή Ενότητα Πειραιώς, Δήμος Κερατσινίου - Δραπετσώνας, Πειραιάς,Δημοτική Ενότητα Κερατσινίου', 
    # ' Ελλάς, Αποκεντρωμένη Διοίκηση Αττικής, Περιφέρεια Αττικής, Περιφερειακή Ενότητα Πειραιώς,Δήμος Κερατσινίου - Δραπετσώνας'
    # best rank: 8
    # best result: {'lat': 37.969759, 'lon': 23.622377, 'descr': 'Αμισού, Αμφιάλη, Δημοτική Ενότητα Κερατσινίου, Δήμος Κερατσινίου - Δραπετσώνας, Περιφερειακή Ενότητα Πειραιώς, Περιφέρεια Αττικής, Αποκεντρωμένη Διοίκηση Αττικής, 187 58, Ελλάς'}

    # split description into list
    for result in results:
        result[ 'descr' ] = result[ 'descr' ].split( ',' )

    best_rank = 0
    best_result = None
    prev_result = None

    for result in results:

        if not best_result:
            best_result = result
            prev_result = result
            continue

        rank = 0
        for descr in zip( result[ 'descr' ], prev_result[ 'descr' ] ):
            if descr[ 0 ] == descr[ 1 ]:
                rank += 1

        if rank >= best_rank:
            best_rank = rank
            best_result = result

        prev_result = result;


    # join descr into string
    best_result[ 'descr' ] = ','.join( reversed( best_result[ 'descr' ] ) )
    # print( 'best rank:', best_rank )
    # print( 'best result:', best_result )

    return best_result


def insert_interruptions( interruption ):

    sql = '''INSERT INTO interruptions ( date, scheduled, intersection, area, geo_url, geo_descr, lat, lon ) VALUES '''
    for row in interruption:
        # print( 'row', row )
        row[ "intersection" ] = row[ "intersection" ].replace( "'", "''" )
        row = \
f"(\
'{row[ "date" ]}',\
'{row[ "scheduled" ]}',\
'{row[ "intersection" ]}',\
'{row[ "area" ]}',\
'{row[ "geo_url" ]}',\
'{row[ "geo_descr" ]}',\
'{row[ "lat" ]}',\
'{row[ "lon" ]}'\
),"
        sql += row

    sql = sql[ 0:-1 ] + ';'
    print( sql )

    print( f'Insert into interruptions' )
    with psycopg.connect( conninfo=conninfo ) as conn, conn.cursor() as cur:
        cur.execute( sql )


data = read_interruptions( 'interruptions.csv' )

counter = 0
limit = 50

for row in data:
    counter += 1
    if counter > limit:
        break

    result = find_geolocation( row )
    row[ 'geo_url' ] = result[ 'url' ]
    row[ 'geo_descr' ] = result[ 'descr' ]
    row[ 'lat' ] = result[ 'lat' ]
    row[ 'lon' ] = result[ 'lon' ]
    print( counter, '=>', row )

insert_interruptions( data[:limit] )
