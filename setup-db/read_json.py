import os
import json

def read_weather( jsonfile ):

    if not os.path.exists( jsonfile ):
        raise Exception( f'Error: {jsonfile} not found.' )

    text = None
    try:
        print( f'Read from {jsonfile}' )
        with open( jsonfile, 'r' ) as f:
            text = f.read()
    except Exception as error:
        raise

    jsoncontent = json.loads( text )
    daily = jsoncontent[ 'daily' ]

    data = []
    for i in range( 0, len( daily[ 'time' ] ) ):
        data.append( [ 
            daily[ 'time' ][ i ],
            daily[ 'weather_code' ][ i ],
            daily[ 'temperature_2m_min' ][ i ],
            daily[ 'temperature_2m_mean' ][ i ],
            daily[ 'temperature_2m_max' ][ i ],
            daily[ 'precipitation_sum' ][ i ],
            daily[ 'rain_sum' ][ i ],
            daily[ 'snowfall_sum' ][ i ]
        ] )

    return data
