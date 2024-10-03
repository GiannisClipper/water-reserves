import sys
import psycopg
import src.db as db

from .create_tables import create_reservoirs, create_savings
from .create_tables import create_factories, create_production
from .create_tables import create_locations, create_weather
from .create_tables import create_municipalities, create_interruptions

from .insert_rows import insert_reservoirs, insert_savings
from .insert_rows import insert_factories, insert_production
from .insert_rows import insert_locations, insert_weather
from .insert_rows import insert_municipalities, insert_interruptions

def make_tables( names ):
    try:
    
        with psycopg.connect( conninfo=db.conninfo ) as conn:

            for name in names:
                print( f'- Table: {name}' )

                if name == 'reservoirs':
                    create_reservoirs( conn )
                    insert_reservoirs( conn )

                elif name == 'savings':
                    create_savings( conn )
                    insert_savings( conn )

                elif name == 'factories':
                    create_factories( conn )
                    insert_factories( conn )

                elif name == 'production':
                    create_production( conn )
                    insert_production( conn )

                elif name == 'locations':
                    create_locations( conn )
                    insert_locations( conn )

                elif name == 'weather':
                    create_weather( conn )
                    insert_weather( conn )

                elif name == 'municipalities':
                    create_municipalities( conn )
                    insert_municipalities( conn )

                elif name == 'interruptions':
                    create_interruptions( conn )
                    insert_interruptions( conn )

    except Exception as error:
        print( 'Error: ' + repr( error ) )


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
