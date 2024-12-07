# to run script:
# $ source ./venv/bin/activate
# (venv) $ python -m dev_scripts/kmeans-examples

import sys
import psycopg
from dev_scripts.conninfo import conninfo
from src.helpers.clustering import kmeans_clustering

def savings_example():

    query = '''
        SELECT SUBSTR( a.date::text,1,4) AS year, AVG( a.quantity ) AS quantity 
        FROM (
            SELECT date, SUM( quantity ) AS quantity 
            FROM savings WHERE date < '2024-01-01' GROUP BY date
        ) a
        GROUP BY SUBSTR( a.date::text,1,4) 
        ORDER BY SUBSTR( a.date::text,1,4);
    '''

    result = None
    with psycopg.connect( conninfo=conninfo ) as conn, conn.cursor() as cur:
        cur.execute( query )
        result = cur.fetchall()
        # for row in result: print( row )

    data = list( map( lambda x: [ float( x[ 1 ] ) ], result ) )
    # print( data, np.array( data ).reshape( -1 ) )

    print( "Savings rows:", len( data ), "Max iterations:" ) 

    centers, labels = kmeans_clustering( data, n_clusters=6 )

    # change labels to center values, sort centers, change back to labels values
    centers = list( centers )
    labels = list( map( lambda cl: centers[ cl ], labels ) )
    centers.sort()
    labels = list( map( lambda cl: centers.index( cl ), labels ) )

    print( 'centers', centers )
    print( 'labels', labels )

    new_result = []
    for i, label in enumerate( labels ):
        new_result.append( [
            result[ i ][ 0 ],
            result[ i ][ 1 ],
            label
        ] )
        print( new_result[ -1 ] )

def interruptions_example():

    query = '''
        SELECT a.municipality_id, b.name_en, a.events, b.area, b.population, a.events / b.area, a.events / ( 0.001 * b.population ) 
        FROM (
            SELECT municipality_id, COUNT( * ) AS events 
            FROM interruptions GROUP BY municipality_id
        ) a
        JOIN municipalities b ON a.municipality_id=b.id
        ORDER BY a.municipality_id;
    '''

    result = None
    with psycopg.connect( conninfo=conninfo ) as conn, conn.cursor() as cur:
        cur.execute( query )
        result = cur.fetchall()
        # for row in result: print( row )

    # data[ 5 ] = interruptions per 1 sq. km
    # data[ 6 ] = interruptions per 1000 persons
    data = list( map( lambda x: [ round( float( x[ 5 ] ), 2), round( float( x[ 6 ] ), 2 ) ], result ) )
    values = []
    for i in ( 0, 1 ):
        single_dim = list( map( lambda row: row[ i ], data ) )
        # print( 'single_dim', i, sorted( single_dim ) )
        min_val, max_val = min( single_dim ), max( single_dim )
        single_dim = list( map( lambda val: ( val - min_val ) / ( max_val - min_val ), single_dim ) )
        # print( 'norlalized single_dim', i, sorted( single_dim ) )
        values.append( single_dim )
    values = [ ( x[ 0 ], x[ 1 ] ) for x in zip( values[ 0 ], values[ 1 ] ) ]
    # print( '2-dim normalized values', values )

    print( "Interruptions rows:", len( values ), "Max iterations:" ) 

    centers, labels = kmeans_clustering( values, n_clusters=5 )
    print( 'centers ->', centers )

    new_result = []
    for i, label in enumerate( labels ):
        new_result.append( [
            result[ i ][ 0 ],
            result[ i ][ 1 ],
            result[ i ][ 2 ],
            result[ i ][ 3 ],
            result[ i ][ 4 ],
            result[ i ][ 5 ],
            result[ i ][ 6 ],
            values[ i ][ 0 ],
            values[ i ][ 1 ],
            ( values[ i ][ 0 ] + values[ i ][ 1 ] ) * 0.5,
            label
        ] )

    print( 'result', new_result )

if __name__ == "__main__":

    try:
        if len( sys.argv ) < 2:
            raise Exception( 'No dataset defined.' )

        match sys.argv[ 1 ]:

            case 'savings':
                savings_example()

            case 'interruptions':
                interruptions_example()

            case _:
                raise Exception( 'No correct dataset.' )

    except Exception as error:
        print( 'Error: ' + repr( error ) )
        print ( 'Syntax example: python -m dev_scripts/kmeans-example.py savings' )
        print ( 'Syntax example: python -m dev_scripts/kmeans-example.py interruptions' )
        exit( -1 )

