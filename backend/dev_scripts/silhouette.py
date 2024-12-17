# to run script:
# $ source ./venv/bin/activate
# (venv) $ python -m dev_scripts/shilouette

import sys, math

from dev_scripts.conninfo import conninfo
import psycopg

from sklearn.cluster import KMeans 
from sklearn.metrics import silhouette_score
MAX_ITER = 600

import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm
import statistics

def run_boxplot( title, data ):
    plt.boxplot( data )
    plt.title( f'Box plot ({title})', fontsize=10 )
    plt.show()

def run_histogram( title, data ):
    plt.hist( data, bins=10, color='lightblue' )
    plt.title( f'Histogram ({title})', fontsize=10 )
    plt.xlabel( 'Quantities' )
    plt.ylabel( 'Years' )
    plt.show()

def run_normaldist( title, data ):

    data.sort()
    mean = statistics.mean( data )
    sd = statistics.stdev( data )
    mean_over_sd = round( mean / sd, 2 )
    plt.plot( data, norm.pdf( data, mean, sd ), color='pink' )
    plt.xlim( 0, 2 * mean )
    # plt.hist( data, bins=10, color='lightblue' )
    plt.suptitle( f'Normal distr. ({title})', fontsize=10 )
    plt.title( f'mean: {int(mean)}, std dev: {round(sd,1)}, mean/sd: {mean_over_sd}', fontsize=8 )
    plt.show()

def run_elbow( title, data ):

    num_of_clusters = [ 2, 3, 4, 5, 6, 7, 8, 9 ] 
    sum_of_sq_distances = []
    for n_clusters in num_of_clusters: 
        kmeans = KMeans( n_clusters=n_clusters )
        kmeans.fit( data )
        sum_of_sq_distances.append( kmeans.inertia_ )

    plt.plot( num_of_clusters, sum_of_sq_distances, marker='o')
    plt.title( f'Elbow Curve method ({title})', fontsize=10 )
    plt.xlabel( 'Number of clusters' )
    plt.ylabel( 'Inertia (sum of sq. distances)' )
    plt.show()

def run_silhouette( title, data ):

    num_of_clusters = [ 2, 3, 4, 5, 6, 7, 8, 9 ] 
    shilouette_results = []
    for n_clusters in num_of_clusters: 
    
        cluster = KMeans( n_clusters = n_clusters, max_iter=MAX_ITER, random_state=32 ) 
        cluster_labels = cluster.fit_predict( data )

        print( 'cluster_centers_', cluster.cluster_centers_ )

        # The label/ cluster that each instance is classified
        print( 'labels_', cluster.labels_ )

        # K-Means: Inertia. It is calculated by measuring the distance between each data point and its centroid, 
        # squaring this distance, and summing these squares across one cluster. 
        # A good model is one with low inertia AND a low number of clusters ( K ). 
        # However, this is a tradeoff because as K increases, inertia decreases.
        print( 'inertia_', cluster.inertia_ )


        # The silhouette_score gives the
        # average value for all the samples. 
        silhouette_avg = silhouette_score( data, cluster_labels ) 
        shilouette_results.append( silhouette_avg )

        print( "Number of clusters:", n_clusters, "Average silhouette score:", silhouette_avg )

    plt.plot( num_of_clusters, shilouette_results, marker='o' )
    plt.title( f'Shilouette Analysis ({title})', fontsize=10 )
    plt.xlabel( 'Number of clusters' )
    plt.ylabel( 'Silhouette score' )
    plt.show()

def run_both_elbow_silhouette( title, data ):

    num_of_clusters = [ 2, 3, 4, 5, 6, 7, 8, 9 ] 

    sum_of_sq_distances = []
    for n_clusters in num_of_clusters: 
        kmeans = KMeans( n_clusters=n_clusters )
        kmeans.fit( data )
        sum_of_sq_distances.append( kmeans.inertia_ )

    shilouette_results = []
    for n_clusters in num_of_clusters: 
    
        cluster = KMeans( n_clusters = n_clusters, max_iter=MAX_ITER, random_state=32 ) 
        cluster_labels = cluster.fit_predict( data )

        print( 'cluster_centers_', cluster.cluster_centers_ )

        # The label/ cluster that each instance is classified
        print( 'labels_', cluster.labels_ )

        # K-Means: Inertia. It is calculated by measuring the distance between each data point and its centroid, 
        # squaring this distance, and summing these squares across one cluster. 
        # A good model is one with low inertia AND a low number of clusters ( K ). 
        # However, this is a tradeoff because as K increases, inertia decreases.
        print( 'inertia_', cluster.inertia_ )


        # The silhouette_score gives the
        # average value for all the samples. 
        silhouette_avg = silhouette_score( data, cluster_labels ) 
        shilouette_results.append( silhouette_avg )

        print( "Number of clusters:", n_clusters, "Average silhouette score:", silhouette_avg )

    # plt.plot( num_of_clusters, sum_of_sq_distances, marker='o')
    # plt.title( f'Elbow Curve method ({title})', fontsize=10 )
    # plt.xlabel( 'Number of clusters' )
    # plt.ylabel( 'Inertia (sum of sq. distances)' )
    # plt.show()


    # plt.plot( num_of_clusters, shilouette_results, marker='o' )
    # plt.title( f'Shilouette Analysis ({title})', fontsize=10 )
    # plt.xlabel( 'Number of clusters' )
    # plt.ylabel( 'Silhouette score' )
    # plt.show()

    fig, ax1 = plt.subplots()

    ax1.set_xlabel( 'Number of clusters' )

    ax1.set_ylabel( 'Elbow (sum of sq. distances)', color='blue' )
    ax1.plot( num_of_clusters, sum_of_sq_distances, marker='o', color='blue' )
    # ax1.tick_params(axis='y', labelcolor='blue')

    ax2 = ax1.twinx()  # instantiate a second axes that shares the same x-axis

    ax2.set_ylabel( 'Silhouette score (from -1 to 1)', color='red' )
    ax2.plot( num_of_clusters, shilouette_results, marker='o', color='red' )
    # ax2.tick_params(axis='y', labelcolor='grey')

    fig.tight_layout()  # otherwise the right y-label is slightly clipped
    plt.title( 'Elbow and Silhouette results' )
    plt.show()


def savings_silhouette():

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

    print( "Savings rows:", len( data ), "Max iterations:", MAX_ITER ) 

    # run_boxplot( 'Αποθέματα νερού', np.array( data ).reshape( -1 ) )
    # run_histogram( 'Αποθέματα νερού', np.array( data ).reshape( -1 ) )
    # run_normaldist( 'Αποθέματα νερού', np.array( data ).reshape( -1 ) )
    # run_elbow( 'Αποθέματα νερού', data )
    # run_silhouette( 'Αποθέματα νερού', data )
    run_both_elbow_silhouette( 'water reserves', data )

def production_silhouette():

    query = '''
        SELECT SUBSTR( a.date::text,1,4) AS year, SUM( a.quantity ) AS quantity 
        FROM (
            SELECT date, SUM( quantity ) AS quantity 
            FROM production WHERE date < '2024-01-01' GROUP BY date
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
    print( data )

    # print( "Production rows:", len( data ), "Max iterations:", MAX_ITER ) 

    # run_boxplot( 'Παραγωγή νερού', np.array( data ).reshape( -1 ) )
    run_histogram( 'Παραγωγή νερού', np.array( data ).reshape( -1 ) )
    run_normaldist( 'Παραγωγή νερού', np.array( data ).reshape( -1 ) )
    run_elbow( 'Παραγωγή νερό', data )
    run_silhouette( 'Παραγωγή νερό', data )


def precipitation_silhouette():

    query = '''
        SELECT SUBSTR( a.date::text,1,4) AS year, SUM( a.quantity ) AS quantity 
        FROM (
            SELECT date, SUM( precipitation_sum ) AS quantity 
            FROM weather WHERE date < '2024-01-01' GROUP BY date
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
    print( data )

    # print( "Precipitation rows:", len( data ), "Max iterations:", MAX_ITER ) 

    # run_boxplot( 'Συνολικός υετός', np.array( data ).reshape( -1 ) )
    run_histogram( 'Συνολικός υετός', np.array( data ).reshape( -1 ) )
    run_normaldist( 'Συνολικός υετός', np.array( data ).reshape( -1 ) )
    run_elbow( 'Συνολικός υετός', data )
    run_silhouette( 'Συνολικός υετός', data )


def temperature_silhouette():

    query = '''
        SELECT SUBSTR( a.date::text,1,4) AS year, AVG( a.temp_min ) AS temp_min, AVG( a.temp_mean ) AS temp_mean, AVG( a.temp_max ) AS temp_max 
        FROM (
            SELECT date, AVG( temperature_2m_min ) AS temp_min, AVG( temperature_2m_mean ) AS temp_mean, AVG( temperature_2m_max ) AS temp_max
            FROM weather WHERE date < '2024-01-01' GROUP BY date
        ) a
        GROUP BY SUBSTR( a.date::text,1,4) 
        ORDER BY SUBSTR( a.date::text,1,4);
    '''

    result = None
    with psycopg.connect( conninfo=conninfo ) as conn, conn.cursor() as cur:
        cur.execute( query )
        result = cur.fetchall()
        # for row in result: print( row )

    # data = list( map( lambda x: [ float( x[ 1 ] ), float( x[ 2 ] ), float( x[ 3 ] ) ], result ) )
    data = list( map( lambda x: [ float( x[ 2 ] ) ], result ) )
    print( data )

    print( "Temperature rows:", len( data ), "Max iterations:", MAX_ITER ) 

    # run_boxplot( 'Μέση θερμοκρασία', np.array( data ).reshape( -1 ) )
    run_histogram( 'Μέση θερμοκρασία', np.array( data ).reshape( -1 ) )
    run_normaldist( 'Μέση θερμοκρασία', np.array( data ).reshape( -1 ) )
    run_elbow( 'Μέση θερμοκρασία', data )
    run_silhouette( 'Μέση θερμοκρασία', data )


def interruptions_silhouette():

    def get_values_triple( result ):
        values0 = np.zeros( [ len( result ), 1 ] )
        values1 = np.zeros( [ len( result ), 1 ] )
        values2 = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 1 ] )
            area = float( row[ 2 ] )
            population = float( row[ 4 ] )
            values0[ i ] = [ events ]
            values1[ i ] = [ events / area ]
            values2[ i ] = [ events / population ]
        values0 = ( values0 - min( values0 ) ) / ( max( values0 ) - min( values0 ) )
        values1 = ( values1 - min( values1 ) ) / ( max( values1 ) - min( values1 ) )
        values2 = ( values2 - min( values2 ) ) / ( max( values2 ) - min( values2 ) ) 
        values0 = ( values0 + values1 + values2 ) / 3
        return list( values0 )

    def get_values_events( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 1 ] )
            values[ i ] = [ events ]
        return list( values )

    def get_values_area( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 1 ] )
            area = float( row[ 2 ] )
            population = float( row[ 4 ] )
            values[ i ] = [ events / area ]
        return list( values )

    def get_values_population( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 1 ] )
            area = float( row[ 2 ] )
            population = float( row[ 4 ] )
            values[ i ] = [ events / population ]
        return list( values )

    def get_values_density( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 1 ] )
            area = float( row[ 2 ] )
            population = float( row[ 4 ] )
            values[ i ] = [ events * population / area ]
        return list( values )

    def get_values_product( result ):
        values = np.zeros( [ len( result ), 1 ] )
        for i, row in enumerate( result ):
            events = float( row[ 1 ] )
            area = float( row[ 2 ] )
            population = float( row[ 4 ] )
            values[ i ] = [ events / population * area ]
        return list( values )

    query = '''
        SELECT b.name_en, a.events, b.area, a.events / b.area, b.population, a.events / ( 0.001 * b.population ) 
        FROM (
            SELECT municipality_id, COUNT( * ) AS events 
            FROM interruptions GROUP BY municipality_id
        ) a
        JOIN municipalities b ON a.municipality_id=b.id;
    '''

    result = None
    with psycopg.connect( conninfo=conninfo ) as conn, conn.cursor() as cur:
        cur.execute( query )
        result = cur.fetchall()
        # for row in result: print( row )

    # data = get_values_triple( result )
    data = get_values_events( result )
    # data = get_values_area( result )
    # data = get_values_population( result )
    # data = get_values_density( result )
    # data = get_values_product( result )

    # values.append( [ ( events / area ) * ( population / area ) ] )
    # data = list( map( lambda x: [ math.log( ( float( x[ 1 ] ) / float( x[ 2 ] ) ) * ( float( x[ 4 ] ) / float( x[ 2 ] ) ), 10 ) ], result ) )
    # data = list( map( lambda x: [ float(x[ 2 ] ) * ( float(x[ 4 ] ) / float(x[ 3 ] ) ) ], result ) )
    # data = list( map( lambda x: [ float(x[ 3 ] ), float( x[ 5 ] ) ], result ) )
    # data = list( map( lambda x: [ float( x[ 1 ] ), float( x[ 3 ] ), float( x[ 5 ] ) ], result ) )
    # data = list( map( lambda x: [ float( x[ 1 ] ), float( x[ 2 ] ), float( x[ 3 ] ) ], result ) )
    print( data )

    print( "Interruptions rows:", len( data ), "Max iterations:", MAX_ITER ) 

    # run_boxplot( 'Διακοπές υδροδότησης', np.array( data ).reshape( -1 ) )
    run_histogram( 'Διακοπές υδροδότησης', np.array( data ).reshape( -1 ) )
    run_normaldist( 'Διακοπές υδροδότησης', np.array( data ).reshape( -1 ) )
    run_elbow( 'Διακοπές υδροδότησης', data )
    run_silhouette( 'Διακοπές υδροδότησης', data )

    # import statistics
    # events = sorted( list( map( lambda row: row[ 1 ], result ) ) )
    # print( 'events', events )
    # print( 'min', min( events ) )
    # print( 'mean', statistics.mean( events ) )
    # print( 'max', max( events ) )
    # print( 'stdev', statistics.stdev( events ) )

if __name__ == "__main__":

    try:
        if len( sys.argv ) < 2:
            raise Exception( 'No dataset defined.' )

        match sys.argv[ 1 ]:

            case 'savings':
                savings_silhouette()

            case 'production':
                production_silhouette()

            case 'precipitation':
                precipitation_silhouette()

            case 'temperature':
                temperature_silhouette()

            case 'interruptions':
                interruptions_silhouette()

            case _:
                raise Exception( 'No correct dataset.' )

    except Exception as error:
        print( 'Error: ' + repr( error ) )
        print ( 'Syntax example: python -m dev_scripts/shilouette.py savings' )
        print ( 'Syntax example: python -m dev_scripts/shilouette.py production' )
        print ( 'Syntax example: python -m dev_scripts/shilouette.py precipitation' )
        print ( 'Syntax example: python -m dev_scripts/shilouette.py temperature' )
        print ( 'Syntax example: python -m dev_scripts/shilouette.py interruptions' )
        exit( -1 )

