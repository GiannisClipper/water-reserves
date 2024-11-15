import httpx
import time

base_url = 'https://nominatim.openstreetmap.org/search?format=json&q='
query_suffix = 'attica,greece'

file = open( "interruptions.csv", "r" )
content = file.read()
file.close()

lines = content.split( '\n' )

# remove the headers
del lines[ :1 ]
# remove the last blank line
if lines[ -1 ] == '':
    lines.pop()

# transform values
lines = list( map( lambda l: l.split( ',' ), lines ) )
for line in lines:
    line[ 0 ] = '-'.join( reversed( line[ 0 ].split( '/' ) ) )
    line[ 2 ] = line[ 2 ][ 1:-1 ]

# print( lines )

# process line by line
for line in lines:
    print( line )

    # get values
    intersection = line[ 2 ]
    area = line[ 3 ]
    roads = intersection.split( ' και ' )

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
            results += response.json()

            time.sleep( 1.5 )

    # transform values
    results = list( map( lambda r: {
        'lat': float( r[ 'lat' ] ), 
        'lon': float( r[ 'lon' ] ),
        # reverse the description => greece,attica,area,address
        'descr': ','.join( reversed( r[ 'display_name' ].split( ',' ) ) )
    }, results ) )

    # sort by reversed description
    results = sorted( results, key=lambda d: d[ 'descr' ] )

    print( list( map( lambda r: r[ 'descr' ], results ) ) )
    # ' Ελλάς, 187 58, Αποκεντρωμένη Διοίκηση Αττικής, Περιφέρεια Αττικής, Περιφερειακή Ενότητα Πειραιώς, Δήμος Κερατσινίου - Δραπετσώνας, Δημοτική Ενότητα Κερατσινίου, Αμφιάλη,Αγίας Λαύρας', 
    # ' Ελλάς, 187 58, Αποκεντρωμένη Διοίκηση Αττικής, Περιφέρεια Αττικής, Περιφερειακή Ενότητα Πειραιώς, Δήμος Κερατσινίου - Δραπετσώνας, Δημοτική Ενότητα Κερατσινίου, Αμφιάλη,Αμισού',     
    # ' Ελλάς, Αποκεντρωμένη Διοίκηση Αττικής, Περιφέρεια Αττικής, Περιφερειακή Ενότητα Πειραιώς, Δήμος Κερατσινίου - Δραπετσώνας, Πειραιάς,Δημοτική Ενότητα Κερατσινίου', 
    # ' Ελλάς, Αποκεντρωμένη Διοίκηση Αττικής, Περιφέρεια Αττικής, Περιφερειακή Ενότητα Πειραιώς,Δήμος Κερατσινίου - Δραπετσώνας'
    # best rank: 8
    # best result: {'lat': 37.969759, 'lon': 23.622377, 'descr': 'Αμισού, Αμφιάλη, Δημοτική Ενότητα Κερατσινίου, Δήμος Κερατσινίου - Δραπετσώνας, Περιφερειακή Ενότητα Πειραιώς, Περιφέρεια Αττικής, Αποκεντρωμένη Διοίκηση Αττικής, 187 58, Ελλάς'}

    # split description
    results = list( map( lambda r: { 
        'lat': r[ 'lat' ], 
        'lon': r[ 'lon' ],
        'descr': r[ 'descr' ].split( ',' )
    }, results ) )


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


    # print( len( results ), results )
    best_result[ 'descr' ] = ','.join( reversed( best_result[ 'descr' ] ) )
    print( 'best rank:', best_rank )
    print( 'best result:', best_result )

    break

