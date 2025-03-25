# to run script:
# $ source ./venv/bin/activate
# (venv) $ python -m dev_scripts/pearson

import sys

from dev_scripts.conninfo import conninfo
import psycopg

from scipy.stats import pearsonr, spearmanr

import numpy as np
import matplotlib.pyplot as plt
import statistics

# the calculation here is based on hydrologic years but it seem less declarative
def run_pearson2():

    query = """
SELECT s.custom_year, s.quantity, w.precipitation_sum

FROM (
	SELECT s.custom_year, AVG( s.quantity ) quantity
	FROM (
		SELECT date, SUM( quantity ) AS quantity, EXTRACT( YEAR FROM date ) || '-' || EXTRACT( YEAR FROM date ) + 1 AS custom_year
		FROM savings 
		WHERE EXTRACT( MONTH FROM date ) >= 10 
		GROUP BY date
	UNION
		SELECT date, SUM( quantity ) AS quantity, EXTRACT( YEAR FROM date ) -1 || '-' || EXTRACT( YEAR FROM date ) AS custom_year
		FROM savings 
		WHERE EXTRACT( MONTH FROM date ) < 10 
		GROUP BY date
	) s 
	GROUP BY s.custom_year
) s

JOIN (
	SELECT w.custom_year, SUM( w.precipitation_sum ) precipitation_sum
	FROM (
		SELECT date, SUM( precipitation_sum ) AS precipitation_sum, EXTRACT( YEAR FROM date ) || '-' || EXTRACT( YEAR FROM date ) + 1 AS custom_year
		FROM weather 
		WHERE EXTRACT( MONTH FROM date ) >= 10 
		GROUP BY date
	UNION
		SELECT date, SUM( precipitation_sum ) AS precipitation_sum, EXTRACT( YEAR FROM date ) -1 || '-' || EXTRACT( YEAR FROM date ) AS custom_year
		FROM weather 
		WHERE EXTRACT( MONTH FROM date ) < 10 
		GROUP BY date
	) w
	GROUP BY w.custom_year
) w

ON s.custom_year=w.custom_year 
WHERE s.custom_year BETWEEN '1996-1997' AND '2023-2024'
ORDER BY s.custom_year;
    """

    result = None
    with psycopg.connect( conninfo=conninfo ) as conn, conn.cursor() as cur:
        cur.execute( query )
        result = cur.fetchall()
        for row in result: print( row )

    years = list( map( lambda r: r[ 0 ], result ) )
    savings = np.array( list( map( lambda r: float( r[ 1 ] ), result ) ) )
    precipitation = np.array( list( map( lambda r: float( r[ 2 ] ), result ) ) )

    savings_norm01 = ( savings - np.min( savings ) ) / ( np.max( savings ) - np.min( savings ) )
    precipitation_norm01 = ( precipitation - np.min( precipitation ) ) / ( np.max( precipitation ) - np.min( precipitation ) )

    plt.figure( figsize=( 10, 6 ) )
    # plt.suptitle( 'Αυξομείωση μεγεθών ως προς την προηγούμενη χρονιά', fontsize=14 )
    plt.xlabel( 'Years', fontsize=12 )
    # plt.ylabel("%", labelpad=12)
    plt.tick_params( axis='x', labelrotation=90, labelsize=9 )
    plt.tick_params( axis='y', labelrotation=0, labelsize=9 )
    plt.plot( years[:], savings_norm01, label="mean of daily water reserves", color="deepskyblue" )
    plt.plot( years[:], precipitation_norm01, label="sum of annual precipitation", color="lightskyblue", linestyle='dashed' )
    plt.legend() 
    plt.grid()
    plt.show()

    # print( savings, precipitation )

    print( pearsonr( savings, precipitation ) )
    print( spearmanr( savings, precipitation ) )

    print()

    print( pearsonr( savings[ 1: ], precipitation[ :-1 ] ) )
    print( spearmanr( savings[ 1: ], precipitation[ :-1 ] ) )

def run_pearson():

    query = """
    SELECT s.year, s.savings, w.precipitation 

    FROM (
        SELECT SUBSTR(s.date::text,1,4) AS year, AVG(s.quantity) AS savings
        FROM (
            SELECT date, SUM(quantity) AS quantity 
            FROM savings WHERE date >= '1996-01-01' AND date <= '2024-12-31'
            GROUP BY date
        ) s
        GROUP BY SUBSTR(s.date::text,1,4)
    ) s

    JOIN (
        SELECT SUBSTR(date::text,1,4) AS year, SUM(precipitation_sum) AS precipitation 
        FROM weather WHERE date >= '1996-01-01' AND date <= '2024-12-31'
        GROUP BY SUBSTR(date::text,1,4)
    ) w

    ON s.year=w.year
    ORDER BY s.year;
    """

    result = None
    with psycopg.connect( conninfo=conninfo ) as conn, conn.cursor() as cur:
        cur.execute( query )
        result = cur.fetchall()
        for row in result: print( row )

    years = list( map( lambda r: r[ 0 ], result ) )
    savings = np.array( list( map( lambda r: float( r[ 1 ] ), result ) ) )
    precipitation = np.array( list( map( lambda r: float( r[ 2 ] ), result ) ) )

    # plot illustrating the hange of the values

    savings_change = [ 0 ]
    precipitation_change = [ 0 ]
    for i in range( 1, len( years ) ):
        savings_change.append( savings[ i ] / savings[ i -1 ] )
        precipitation_change.append( precipitation[ i ] / precipitation[ i -1 ] )

    plt.figure( figsize=( 10, 6 ) )
    plt.suptitle( 'Growth of precipitation and water reserves', fontsize=14 )
    plt.xlabel( 'Years', fontsize=12 )
    plt.ylabel("Change regarding the previous year", labelpad=12)
    plt.tick_params( axis='x', labelrotation=90, labelsize=9 )
    plt.tick_params( axis='y', labelrotation=0, labelsize=9 )
    plt.plot( years[:], precipitation_change, label="sum of annual precipitation", color="lightskyblue", linestyle='dashed' )
    plt.plot( years[:], savings_change, label="mean of daily water reserves", color="deepskyblue" )
    plt.legend() 
    plt.grid()
    # plt.show()

    savings_norm01 = ( savings - np.min( savings ) ) / ( np.max( savings ) - np.min( savings ) )
    precipitation_norm01 = ( precipitation - np.min( precipitation ) ) / ( np.max( precipitation ) - np.min( precipitation ) )

    plt.figure( figsize=( 10, 6 ) )
    plt.suptitle( 'Normalizing values of water reserves and precipitation', fontsize=14 )
    plt.xlabel( 'Έτη', fontsize=12 )
    plt.ylabel("Κανονικοποίηση από 0 έως 1", labelpad=12)
    plt.tick_params( axis='x', labelrotation=90, labelsize=9 )
    plt.tick_params( axis='y', labelrotation=0, labelsize=9 )
    plt.plot( years[:], savings_norm01, label="mean of daily water reserves", color="deepskyblue" )
    plt.plot( years[:], precipitation_norm01, label="sum of annual precipitation", color="lightskyblue", linestyle='dashed' )
    plt.legend() 
    plt.grid()
    plt.show()

    # print( savings, precipitation )

    print( pearsonr( savings, precipitation ) )
    print( spearmanr( savings, precipitation ) )

    print()

    print( pearsonr( savings[ 1: ], precipitation[ :-1 ] ) )
    print( spearmanr( savings[ 1: ], precipitation[ :-1 ] ) )

# help(pearsonr)
# help(spearmanr)

if __name__ == "__main__":
    
    run_pearson()
    # run_pearson2()
