import os

def parse_csv_content( csvfile ):

    if not os.path.exists( csvfile ):
        raise Exception( f'Error: {csvfile} not found.' )

    try:
        # print( f'Read from {csvfile}' )
        with open( csvfile, 'r' ) as f:
            return f.read()
    except Exception as error:
        raise

def parse_csv_rows( text ):

    # exclude last row if empty
    if text[ -1 ] == '\n':
        text = text[ 0:-1 ]

    return text.split( '\n' )

# parse csv rows, while any of the columns 
# may contain values in double quotes
def parse_csv_columns( row ):

    DOUBLE_QUOTE = '"'

    result = []
    enabled = True
    buffer = ''
    for chr in row:
        if chr == DOUBLE_QUOTE:
            # start string in double quotes
            if buffer == '':
                enabled = False
                continue
            # finish string in double quotes
            if not enabled:
                enabled = True
                continue

        # extract column
        if enabled and chr == ',':
            result.append( buffer )
            buffer = ''
            continue

        buffer += chr

    result.append( buffer )
    return result

def read_csv( csvfile ):

    text = parse_csv_content( csvfile )
    rows = parse_csv_rows( text )
    rows = list( map( lambda row: parse_csv_columns( row ), rows ) )

    headers = rows[ 0 ]
    data = rows[ 1: ]

    return headers, data

def no_quotes( value ):
    if value[ 0 ] == '"':
        return value[ 1:-1 ]
    return value


def parse_csv_headers( row ):

    for i, value in enumerate( row ):
        row[ i ] = no_quotes( row[ i ] )

    return row


def parse_csv_data( rows, data_sample ):

    types = list( map( lambda x: type( x ), data_sample ) )

    for i, row in enumerate( rows ):

        for j, value in enumerate( row ):
            rows[ i ][ j ] = no_quotes( rows[ i ][ j ] )

            if types[ j ] == int:
                rows[ i ][ j ] = int( rows[ i ][ j ] )

            elif types[ j ] == float:
                rows[ i ][ j ] = float( rows[ i ][ j ] )

    return rows

