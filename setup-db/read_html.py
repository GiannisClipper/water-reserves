import os
from bs4 import BeautifulSoup 

def read_savings( htmlfile ):

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
        # print( headers )

        # Get data

        for tr in trs[ 1: ]:
            tds = tr.findAll( 'td' )
            values = list( map( lambda td: td.text, tds ) )
            for i, v in enumerate( values ):

                # Format data from dd/mm/yyyy to yyyy-mm-dd

                if ( i == 0 ):
                    d, m, y = v.split( '/' )
                    values[ i ] = f'{y}-{m}-{d}'
                
                # Remove dots and spaces from values

                else:
                    values[ i ] = values[ i ].strip().replace( '.', '' )

            data.append( values )

        # print( data )

        return headers, data

    except Exception as error:
        raise
