from read_csv import read_reservoirs, read_factories

from os import listdir
from os.path import isfile, join
from read_html import read_html

def insert_reservoirs( conn ):

    # Get content from csv
    headers, data = read_reservoirs()

    # Create a cursor object
    cursor = conn.cursor()

    sql = '''INSERT INTO reservoirs ( name_el, name_en, lat, lon ) VALUES '''
    for row in data:
        name_el, name_en, lat, lon = row
        row = f"('{name_el}','{name_en}',{lat},{lon}),"
        sql += row
    sql = sql[ 0:-1 ] + ';'
    # print( sql )

    print( f'Insert into reservoirs' )
    cursor.execute( sql )
    conn.commit()

def insert_savings( conn ):

    path = './savings/html'
    htmlfiles = [ f for f in listdir( path ) if isfile( join( path, f ) ) ]
    htmlfiles.sort()

    for htmlfile in htmlfiles:

        # Get content from csv
        headers, data = read_html( join( path, htmlfile ) )

        # Create a cursor object
        cursor = conn.cursor()

        sql = '''INSERT INTO savings ( date, reservoir_id, quantity ) VALUES '''
        for date, q1, q2, q3, q4, total in data:
            oneDate = f"('{date}',1,{q1}),('{date}',2,{q2}),('{date}',3,{q3}),('{date}',4,{q4}),"
            sql += oneDate
        sql = sql[ 0:-1 ] + ';'
        # print( sql )

        print( f'Insert into reservoirs ({htmlfile})' )
        cursor.execute( sql )
        conn.commit()

def insert_factories( conn ):

    # Get content from csv
    headers, data = read_factories()

    # Create a cursor object
    cursor = conn.cursor()

    sql = '''INSERT INTO factories ( name_el, name_en, lat, lon ) VALUES '''
    for row in data:
        name_el, name_en, lat, lon = row
        row = f"('{name_el}','{name_en}',{lat},{lon}),"
        sql += row
    sql = sql[ 0:-1 ] + ';'
    # print( sql )

    print( f'Insert into factories' )
    cursor.execute( sql )
    conn.commit()

def insert_production( conn ):

    path = './production/html'
    htmlfiles = [ f for f in listdir( path ) if isfile( join( path, f ) ) ]
    htmlfiles.sort()

    for htmlfile in htmlfiles:

        # Get content from csv
        headers, data = read_html( join( path, htmlfile ) )

        # Create a cursor object
        cursor = conn.cursor()

        sql = '''INSERT INTO production ( date, factory_id, quantity ) VALUES '''
        for date, q1, q2, q3, q4, total in data:
            oneDate = f"('{date}',1,{q1}),('{date}',2,{q2}),('{date}',3,{q3}),('{date}',4,{q4}),"
            sql += oneDate
        sql = sql[ 0:-1 ] + ';'
        # print( sql )

        print( f'Insert into production ({htmlfile})' )
        cursor.execute( sql )
        conn.commit()
