import os
from bs4 import BeautifulSoup 

def read_html( htmlfile ):

    # Read html file

    if not os.path.exists( htmlfile ):
        raise Exception( f'Error: {htmlfile} not found.' )

    text = None
    try: 
        print( f'Read from: {htmlfile}' )
        with open( htmlfile, 'r' ) as f:
            text = f.read()
    except Exception as error:
        raise

    # Parse html with BeautifulSoup

    try: 
        headers = []
        data = []

        soup = BeautifulSoup( text, 'html5lib' )
        # print( soup.prettify() ) 

        table = soup.find( 'table' )
        trs = table.findAll( 'tr' )

        # Get headers

        ths = trs[ 0 ].findAll( 'th' )
        headers = list( map( lambda th: th.text, ths ) )

        # Get data

        # trs[ 0 ] = last day of previous year
        for tr in trs[ 1: ]: 
            tds = tr.findAll( 'td' )
            values = list( map( lambda td: td.text, tds ) )
            for i, v in enumerate( values ):

                if ( i == 0 ):
                    # Format data from dd/mm/yyyy to yyyy-mm-dd
                    d, m, y = v.split( '/' )
                    values[ i ] = f'{y}-{m}-{d}'
                
                else:
                    # Remove dots and spaces from values
                    values[ i ] = values[ i ].strip().replace( '.', '' )

                    # Handle missing values
                    try:
                        values[ i ] = int( values[ i ] )
                    except Exception as error:
                        print( f'* Handle missing values in {values[ 0 ]}' )
                        if len( data ) > 0:
                            values[ i ] = data[ -1 ][ i ]
                        else:
                            values[ i ] = 0

            data.append( values )

        # Remove first row if represents the last day of previous year
        if data[ 0 ][ 0 ][ 0:4 ] != data[ 1 ][ 0 ][ 0:4 ]:
            data = data[ 1: ]

        return headers, data

    except Exception as error:
        raise
