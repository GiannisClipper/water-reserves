import os
from src.settings import get_settings

def read_csv( csvfile ):

    if not os.path.exists( csvfile ):
        raise Exception( f'Error: {csvfile} not found.' )

    text = None
    try:
        print( f'Read from {csvfile}' )
        with open( csvfile, 'r' ) as f:
            text = f.read()
    except Exception as error:
        raise

    headers = []
    data = []
    for i, row in enumerate( text.split( '\n' ) ):
        if i == 0:
            headers = row.split( ',' )
        else:
            data.append( row.split( ',' ) )

    return headers, data

def read_reservoirs():

    csvfile = f'{get_settings().savings_csv_path}/reservoirs.csv'

    try:
        return read_csv( csvfile )
    except Exception as error:
        raise

def read_factories():

    csvfile = f'{get_settings().production_csv_path}/factories.csv'

    try:
        return read_csv( csvfile )
    except Exception as error:
        raise

def read_locations():

    csvfile = f'{get_settings().weather_csv_path}/locations.csv'

    try:
        return read_csv( csvfile )
    except Exception as error:
        raise
