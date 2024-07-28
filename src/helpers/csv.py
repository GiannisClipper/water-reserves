import os


def read_csv( csvfile ):

    if not os.path.exists( csvfile ):
        raise Exception( f'Error: {csvfile} not found.' )

    text = None
    try:
        # print( f'Read from {csvfile}' )
        with open( csvfile, 'r' ) as f:
            text = f.read()
    except Exception as error:
        raise

    # exclude last row if empty
    if text[ -1 ] == '\n':
        text = text[ 0:-1 ]

    headers = []
    data = []
    for i, row in enumerate( text.split( '\n' ) ):
        if i == 0:
            headers = row.split( ',' )
        else:
            data.append( row.split( ',' ) )

    return headers, data


def no_quotes( value ):
    if value[ 0 ] == '"':
        return value[ 1:-1 ]
    return value


def parse_csv_content( rows, data_sample ):

    types = list( map( lambda x: type( x ), data_sample ) )

    for i, row in enumerate( rows ):

        for j, value in enumerate( row ):
            rows[ i ][ j ] = no_quotes( rows[ i ][ j ] )

            if types[ j ] == int:
                rows[ i ][ j ] = int( rows[ i ][ j ] )

            elif types[ j ] == float:
                rows[ i ][ j ] = float( rows[ i ][ j ] )

    return rows

