# to run script:
# $ source ./venv/bin/activate
# (venv) $ python -m dev_scripts/kmeans-examples

import sys, math
import psycopg
from dev_scripts.conninfo import conninfo
from src.helpers.clustering import kmeans_clustering
import numpy as np

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

    for label in range( 6 ):
        min_result = 10e12
        max_result = 0
        for entry in new_result:
            if entry[ 2 ] == label:
                min_result = min( min_result, entry[ 1 ] )
                max_result = max( max_result, entry[ 1 ] )
        print( f'Limits for label {label}: {min_result} - {max_result}' )

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
    data = list( map( lambda x: [ round( float( x[ 5 ] ), 2), round( float( x[ 6 ] ), 10 ) ], result ) )
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

    import matplotlib.pyplot as plt
 
    labels = [ 'Lower', 'Low', 'Mid', 'High', 'Higher' ]
    colors = [ 'lightblue', 'lightgreen', 'yellow', 'orange', 'tomato' ]

    plt.title( 'Municipalities clustering', fontsize=13 )
    plt.xlabel( 'Interruptions per sq. km (norm)', fontsize=10 )
    plt.ylabel( 'Interruptions per 1000 residents (norm)', fontsize=10 )

    for label in range( 5 ):
        print( 'label', label )
        filtered  = list( filter( lambda x: x[ -1 ] == label, new_result ) )
        for item in filtered:
            print( item[ 1 ], item[ -1 ], 0.5 * ( item[ -3 ] + item[ -4 ] ) )

        x = list( map( lambda z: z[ -3 ], filtered ) )
        y = list( map( lambda z: z[ -4 ], filtered ) )
        plt.scatter( x, y, color=colors[ label ], label=labels[ label ] )
        plt.legend()

    plt.show()

def interruptions_example2():

    def get_values_triple( result ):
        # data[ 5 ] = interruptions per 1 sq. km
        # data[ 6 ] = interruptions per 1000 persons
        # result = list( filter( lambda x: x[ 2 ] > 3, result ) )

        values = []
        values0 = np.zeros( [ len( result ), 1 ] )
        values1 = np.zeros( [ len( result ), 1 ] )
        values2 = np.zeros( [ len( result ), 1 ] )
        values3 = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 2 ] )
            area = float( row[ 3 ] )
            population = float( row[ 4 ] )
            # value = round( math.log( ( events / area ) * ( population / area ), 10 ), 4 )
            values0[ i ] = [ events ]
            values1[ i ] = [ events / area ]
            values2[ i ] = [ events / population ]
            # values3[ i ] = [ events * ( population / area ) ]
            # value = round(  math.log( ( events / area ), 10 ) * math.log( ( population / events ), 10 ), 4 )
            # value = round(  math.log( ( events / area ), 10 ) * math.log( ( population / events ), 10 ), 4 )
            # values.append( [ value ] )
            # values.append( [ events / area ] )
            # values.append( [ events / population ] )
            # values.append( [ 0.5 * ( events / area ) + 0.5 * ( events / (population / 1000) ) ] )
            # values.append( [ events / ( area / density ) ] )
        # values = list( map( lambda x: [ round( float( x[ 2 ] ) / ( float( x[ 3 ] ) * ( float( x[ 3 ] ) / float( x[ 4 ] ) ) ), 2) ], result ) )
        values0 = ( values0 - min( values0 ) ) / ( max( values0 ) - min( values0 ) )
        values1 = ( values1 - min( values1 ) ) / ( max( values1 ) - min( values1 ) )
        values2 = ( values2 - min( values2 ) ) / ( max( values2 ) - min( values2 ) )
        # values3 = ( values3 - min( values3 ) ) / ( max( values3 ) - min( values3 ) )
    
        values0 = (values0 + values1 + values2) / 3
        # values0 = values0 + values3 / 2
        values = list( values0 )

        return values

    def get_values_events( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 2 ] )
            values[ i ] = [ events ]
        return list( values )

    def get_values_area( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 2 ] )
            area = float( row[ 3 ] )
            values[ i ] = [ events / area ]
        return list( values )

    def get_values_population( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 2 ] )
            population = float( row[ 4 ] )
            values[ i ] = [ events / population ]
        return list( values )

    def get_values_density( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 2 ] )
            area = float( row[ 3 ] )
            population = float( row[ 4 ] )
            values[ i ] = [ ( events * population ) / ( area * area ) ]
        return list( values )

    def get_values_product( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 2 ] )
            area = float( row[ 3 ] )
            population = float( row[ 4 ] )
            values[ i ] = [ events / population * area ]
        return list( values )

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


    # values = get_values_triple( result )
    # xy_label = 'triple'

    values = get_values_events( result )
    xy_label = 'events'

    # values = get_values_area( result )
    # xy_label = 'events / area'

    # values = get_values_density( result )
    # xy_label = 'events * population / area'

    # values = get_values_product( result )
    # xy_label = 'events / population * area'

    # values = get_values_population( result )
    # xy_label = 'events / population'

    print( "Interruptions rows:", len( values )  ) 

    K = 6

    labels = {
        4: [ 'Low', 'Mid-low', 'Mid-high', 'High' ],
        5: [ 'Lower', 'Low', 'Mid', 'High', 'Higher' ],
        6: [ 'Lower', 'Low', 'Mid-low', 'Mid-high', 'High', 'Higher' ]
    }
    colors = {
        4: [ 'lightblue', 'yellow', 'orange', 'tomato' ],
        5: [ 'lightblue', 'lightgreen', 'yellow', 'orange', 'tomato' ],
        6: [ 'lightblue', 'lightgreen', 'yellow', 'orange', 'tomato', 'purple' ]
    }

    centers, labeled = kmeans_clustering( values, n_clusters=K )
    print( 'centers ->', centers )

    new_result = []
    for i, label in enumerate( labeled ):
        new_result.append( [
            result[ i ][ 0 ],
            result[ i ][ 1 ],
            result[ i ][ 2 ],
            result[ i ][ 3 ],
            result[ i ][ 4 ],
            result[ i ][ 5 ],
            result[ i ][ 6 ],
            values[ i ][ 0 ],
            label
        ] )

    print( 'result', new_result )

    import matplotlib.pyplot as plt
 
    plt.title( 'Municipalities clustering', fontsize=13 )
    # plt.xlabel( 'Interruptions per sq. km (norm)', fontsize=10 )
    # plt.ylabel( 'Interruptions per 1000 residents (norm)', fontsize=10 )
    plt.xlabel( xy_label, fontsize=10 )
    plt.ylabel( xy_label, fontsize=10 )

    print( "Municipality, Events, Area, Population, Density, Clustering metric" )
    for label in range( K -1, -1, -1 ):
        print( '\nlabel -> ', label, labels[ K ][ label ] )
        filtered  = list( filter( lambda x: x[ -1 ] == label, new_result ) )
        for item in filtered:
            print( f"{( item[ 1 ]+'..................' )[:20]}, {item[ 2 ]:4.0f}, {item[ 3 ]:10.2f}, {item[ 4 ]:10.0f}, {item[ 4 ]/item[ 3 ]:10.0f}, {item[ -2 ]:10.4f}" )
        x = list( map( lambda z: z[ -2 ], filtered ) )
        y = list( map( lambda z: z[ -2 ], filtered ) )
        plt.scatter( x, y, color=colors[ K ][ label ], label=labels[ K ][ label ] )
        plt.legend()

    plt.show()

if __name__ == "__main__":

    # try:
        if len( sys.argv ) < 2:
            raise Exception( 'No dataset defined.' )

        match sys.argv[ 1 ]:

            case 'savings':
                savings_example()

            case 'interruptions':
                interruptions_example2()

            case _:
                raise Exception( 'No correct dataset.' )

    # except Exception as error:
    #     print( 'Error: ' + repr( error ) )
    #     print ( 'Syntax example: python -m dev_scripts/kmeans-example.py savings' )
    #     print ( 'Syntax example: python -m dev_scripts/kmeans-example.py interruptions' )
    #     exit( -1 )

