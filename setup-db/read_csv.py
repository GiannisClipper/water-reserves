import os

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

    csvfile = './savings/reservoirs.csv'

    try:
        return read_csv( csvfile )
    except Exception as error:
        raise

def read_factories():

    csvfile = './production/factories.csv'

    try:
        return read_csv( csvfile )
    except Exception as error:
        raise

def read_locations():

    csvfile = './weather/locations.csv'

    try:
        return read_csv( csvfile )
    except Exception as error:
        raise
