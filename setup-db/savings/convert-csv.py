import os
from bs4 import BeautifulSoup 

import sys

def convert_csv_savings_yearly( year ):

    print( f'- Year: {year}' )

    # Check if data already exists (as csv file) 

    csvfile = f'./csv/{year}.csv'
    if os.path.exists( csvfile ):
        print( f'Found: {csvfile}' )
        return

    # Check if html file exists 

    htmlfile = f'./html/{year}.html'
    if not os.path.exists( htmlfile ):
        print( f'Not found: {htmlfile}' )
        return

    # Read html file

    text = None
    try: 
        print( f'Read from: {htmlfile}' )
        with open( htmlfile, 'r' ) as f:
            text = f.read()
    except Exception as error:
        print( f'Error: {error}' )
        return

    # Parse html with BeautifulSoup

    headers = []
    data = []
    try: 
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
                    dmy = v.split( '/' )
                    values[ i ] = f'{dmy[ 2 ]}-{dmy[ 1 ]}-{dmy[ 0 ]}'
                
                # Remove dots and spaces from values

                else:
                    values[ i ] = values[ i ].strip().replace( '.', '' )

            data.append( values )

        # print( data )

    except Exception as error:
        print( f'Error: {error}' )
        return
    
    # Save data into CSV file

    try: 
        print( f'Write into: {csvfile}' )
        with open( csvfile, 'w' ) as f:
            f.writelines( ','.join( headers ) + '\n' )
            for d in data:
                f.writelines( ','.join( d ) + '\n' )

    except Exception as error:
        print( f'Error: {error}' )


if __name__ == "__main__":

    try:
        n = len( sys.argv )
        if n < 2 or n > 3:
            raise Exception( 'Incorrect number of parameters.' )

        fromYear = int( sys.argv[ 1 ] )
        toYear = int( sys.argv[ 1 ] )

        if n == 3:
            toYear = int( sys.argv[ 2 ] )

        for year in range( int( fromYear ), int( toYear ) + 1 ):
            convert_csv_savings_yearly( year )

    except Exception as error:
        print( 'Error: ' + repr( error ) )
        print ( 'Syntax example: python convert-csv.py 2021' )
        print ( 'Syntax example: python convert-csv.py 2021 2024' )

