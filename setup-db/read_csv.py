import os

def read_reservoirs():

    csvfile = './savings/reservoirs.csv'
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
