import sys

from connect_db import connectDB
from create_tables import create_reservoirs, create_savings
from insert_rows import insert_reservoirs, insert_savings

if __name__ == "__main__":

    try:
        n = len( sys.argv )
        if n < 2:
            raise Exception( 'Incorrect number of parameters.' )

        tables = [ 'reservoirs', 'savings' ]
        names = sys.argv[ 1: ]
        for name in names:
            if not name in tables:
               raise Exception( f'Incorrect name: {name}' )

    except Exception as error:
        print( 'Error: ' + repr( error ) )
        print ( 'Syntax example: python create_tables.py reservoirs' )
        print ( 'Syntax example: python create_tables.py reservoirs savings' )

    
    try:
        conn = connectDB()

        for name in names:
            print( f'- Table: {name}' )

            if name == 'reservoirs':
                create_reservoirs( conn )
                insert_reservoirs( conn )

            elif name == 'savings':
                create_savings( conn )
                insert_savings( conn )

        conn.close()
        
    except Exception as error:
        print( 'Error: ' + repr( error ) )

