import os
import json

def parse_json_content( jsonfile ):

    if not os.path.exists( jsonfile ):
        raise Exception( f'Error: {jsonfile} not found.' )

    try:
        # print( f'Read from {jsonfile}' )
        with open( jsonfile, 'r' ) as f:
            text = f.read()
            return json.loads( text )

    except Exception as error:
        raise
