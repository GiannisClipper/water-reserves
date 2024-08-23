from os import listdir
from os.path import isfile, join
from src.settings import get_settings
from .read_csv import read_reservoirs, read_factories, read_locations
from .read_html import read_html
from .read_json import read_weather

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

    path = get_settings().savings_html_path
    htmlfiles = [ f for f in listdir( path ) if isfile( join( path, f ) ) ]
    htmlfiles.sort()

    for htmlfile in htmlfiles:

        # Get content from html
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

    path = get_settings().production_html_path
    htmlfiles = [ f for f in listdir( path ) if isfile( join( path, f ) ) ]
    htmlfiles.sort()

    for htmlfile in htmlfiles:

        # Get content from html
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

def insert_locations( conn ):

    # Get content from csv
    headers, data = read_locations()

    # Create a cursor object
    cursor = conn.cursor()

    sql = '''INSERT INTO locations ( name_el, name_en, lat, lon ) VALUES '''
    for row in data:
        name_el, name_en, lat, lon = row
        row = f"('{name_el}','{name_en}',{lat},{lon}),"
        sql += row
    sql = sql[ 0:-1 ] + ';'
    # print( sql )

    print( f'Insert into locations' )
    cursor.execute( sql )
    conn.commit()

def insert_weather( conn ):

    headers, locations = read_locations()

    for ilocation, location in enumerate( locations ):

        location_id = ilocation + 1
        name_el, name_en, lat, lon = location

        path = f'{get_settings().weather_json_path}/{name_en}'
        jsonfiles = [ f for f in listdir( path ) if isfile( join( path, f ) ) ]
        jsonfiles.sort()

        for jsonfile in jsonfiles:

            # Get content from json
            data = read_weather( join( path, jsonfile ) )

            # Create a cursor object
            cursor = conn.cursor()

            sql = '''INSERT INTO weather ( 
                date, location_id, weather_code, 
                temperature_2m_min, temperature_2m_mean, temperature_2m_max, 
                precipitation_sum, rain_sum, snowfall_sum 
            ) VALUES '''
            for date, weather_code, \
                temperature_2m_min, temperature_2m_mean, temperature_2m_max, \
                precipitation_sum, rain_sum, snowfall_sum in data:
                oneDate = f"(\
                    '{date}',{location_id},{weather_code},\
                    {temperature_2m_min},{temperature_2m_mean},{temperature_2m_max},\
                    {precipitation_sum},{rain_sum},{snowfall_sum}\
                ),"
                sql += oneDate
            sql = sql[ 0:-1 ] + ';'
            # print( sql )

            print( f'Insert into weather ({jsonfile})' )
            cursor.execute( sql )
            conn.commit()


