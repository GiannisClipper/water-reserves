import sys
from os import listdir
from os.path import isfile, join

from src.queries.reservoirs import ReservoirsOnceQueryFactory
from src.queries.savings import SavingsOnceQueryFactory
from src.queries.factories import FactoriesOnceQueryFactory
from src.queries.production import ProductionOnceQueryFactory
from src.queries.locations import LocationsOnceQueryFactory
from src.queries.weather import WeatherOnceQueryFactory
from src.queries.municipalities import MunicipalitiesOnceQueryFactory
from src.queries.interruptions import InterruptionsOnceQueryFactory

from src.settings import get_settings
import psycopg
import src.db as db

from .read_csv import read_reservoirs, read_factories, read_locations, read_municipalities
from .read_html import read_html
from .read_json import read_weather
from .read_json import read_interruptions

def make_tables( names ):
    try:
    
        with psycopg.connect( conninfo=db.conninfo ) as conn:

            for name in names:
                print( f'- Table: {name}' )

                if name == 'reservoirs':
                    make_reservoirs()

                elif name == 'savings':
                    make_savings()

                elif name == 'factories':
                    make_factories()

                elif name == 'production':
                    make_production()

                elif name == 'locations':
                    make_locations()

                elif name == 'weather':
                    make_weather()

                elif name == 'municipalities':
                    make_municipalities()

                elif name == 'interruptions':
                    make_interruptions()

    except Exception as error:
        print( 'Error: ' + repr( error ) )


def make_reservoirs():

    savings_handler = SavingsOnceQueryFactory().handler
    reservoirs_handler = ReservoirsOnceQueryFactory().handler

    print( f'Drop table savings' )
    savings_handler.maker.drop_table()
    savings_handler.run_query()

    print( f'Drop table reservoirs' )
    reservoirs_handler.maker.drop_table()
    reservoirs_handler.run_query()

    print( f'Create table reservoirs' )
    reservoirs_handler.maker.create_table()
    reservoirs_handler.run_query()

    print( f'Insert into reservoirs' )
    headers, data = read_reservoirs()
    reservoirs_handler.maker.insert_into( data )
    reservoirs_handler.run_query()

def make_savings():

    savings_handler = SavingsOnceQueryFactory().handler

    print( f'Drop table savings' )
    savings_handler.maker.drop_table()
    savings_handler.run_query()

    print( f'Create table savings' )
    savings_handler.maker.create_table()
    savings_handler.run_query()

    print( f'Insert into savings' )
    path = get_settings().savings_html_path
    htmlfiles = [ f for f in listdir( path ) if isfile( join( path, f ) ) ]
    htmlfiles.sort()
    for htmlfile in htmlfiles:
        # Get content from html
        headers, data = read_html( join( path, htmlfile ) )
        savings_handler.maker.insert_into( data )
        savings_handler.run_query()

def make_factories():

    production_handler = ProductionOnceQueryFactory().handler
    factories_handler = FactoriesOnceQueryFactory().handler

    print( f'Drop table production' )
    production_handler.maker.drop_table()
    production_handler.run_query()

    print( f'Drop table factories' )
    factories_handler.maker.drop_table()
    factories_handler.run_query()

    print( f'Create table factories' )
    factories_handler.maker.create_table()
    factories_handler.run_query()

    print( f'Insert into factories' )
    headers, data = read_factories()
    factories_handler.maker.insert_into( data )
    factories_handler.run_query()

def make_production():

    production_handler = ProductionOnceQueryFactory().handler

    print( f'Drop table production' )
    production_handler.maker.drop_table()
    production_handler.run_query()

    print( f'Create table production' )
    production_handler.maker.create_table()
    production_handler.run_query()

    print( f'Insert into production' )
    path = get_settings().production_html_path
    htmlfiles = [ f for f in listdir( path ) if isfile( join( path, f ) ) ]
    htmlfiles.sort()
    for htmlfile in htmlfiles:
        # Get content from html
        headers, data = read_html( join( path, htmlfile ) )
        production_handler.maker.insert_into( data )
        production_handler.run_query()

def make_locations():

    weather_handler = WeatherOnceQueryFactory().handler
    locations_handler = LocationsOnceQueryFactory().handler

    print( f'Drop table weather' )
    weather_handler.maker.drop_table()
    weather_handler.run_query()

    print( f'Drop table locations' )
    locations_handler.maker.drop_table()
    locations_handler.run_query()

    print( f'Create table locations' )
    locations_handler.maker.create_table()
    locations_handler.run_query()

    print( f'Insert into locations' )
    headers, data = read_locations()
    locations_handler.maker.insert_into( data )
    locations_handler.run_query()

def make_weather():

    weather_handler = WeatherOnceQueryFactory().handler

    print( f'Drop table weather' )
    weather_handler.maker.drop_table()
    weather_handler.run_query()

    print( f'Create table weather' )
    weather_handler.maker.create_table()
    weather_handler.run_query()

    print( f'Insert into weather' )
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

            # add the location_id in row
            for row in data:
                row.append( location_id )

            weather_handler.maker.insert_into( data )
            weather_handler.run_query()

def make_municipalities():

    interruptions_handler = InterruptionsOnceQueryFactory().handler
    municipalities_handler = MunicipalitiesOnceQueryFactory().handler

    print( f'Drop table interruptions' )
    interruptions_handler.maker.drop_table()
    interruptions_handler.run_query()

    print( f'Drop table municipalities' )
    municipalities_handler.maker.drop_table()
    municipalities_handler.run_query()

    print( f'Create table municipalities' )
    municipalities_handler.maker.create_table()
    municipalities_handler.run_query()

    print( f'Insert into municipalities' )
    headers, data = read_municipalities()
    municipalities_handler.maker.insert_into( data )
    municipalities_handler.run_query()

def make_interruptions():

    interruptions_handler = InterruptionsOnceQueryFactory().handler

    print( f'Drop table interruptions' )
    interruptions_handler.maker.drop_table()
    interruptions_handler.run_query()

    print( f'Create table interruptions' )
    interruptions_handler.maker.create_table()
    interruptions_handler.run_query()

    print( f'Insert into interruptions' )

    # Get municipalities from csv
    headers, data = read_municipalities()
    municipalities = {}
    for row in data:
        id, name_el, prefecture = row
        municipalities[ name_el ] = id

    path = get_settings().interruptions_json_path
    jsonfiles = [ f for f in listdir( path ) if isfile( join( path, f ) ) ]
    jsonfiles.sort()

    for jsonfile in jsonfiles:
        # Get content from json
        data = read_interruptions( join( path, jsonfile ) )

        # Replace municipality_name_el with municipality_id 
        for row in data:
            name_el = row[ -1 ]
            row[ -1 ] = municipalities.get( name_el )

        interruptions_handler.maker.insert_into( data )
        interruptions_handler.run_query()

if __name__ == "__main__":

    try:
        n = len( sys.argv )
        if n < 2:
            raise Exception( 'No tables defined.' )

        names = sys.argv[ 1: ]
        for name in names:
            if not name in db.tables:
               raise Exception( f'No table: {name}' )

    except Exception as error:
        print( 'Error: ' + repr( error ) )
        print ( 'Syntax example: python make_tables.py reservoirs' )
        print ( 'Syntax example: python make_tables.py reservoirs savings' )
        print ( 'Syntax example: python make_tables.py factories production' )
        print ( 'Syntax example: python make_tables.py locations weather' )
        print ( 'Syntax example: python make_tables.py municipalities interruptions' )
        exit( -1 )
    
    make_tables( names )
