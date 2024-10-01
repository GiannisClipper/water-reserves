import os
from .MunicipalitiesHandler import MunicipalitiesHandler
from src.helpers.json import parse_json_content

interruptions_file = 'resources/db_setup/interruptions/json/2024-02.json'

print( 'CWD:', os.getcwd() )

print( 'Init MunicipalitiesHandler...' )
municipalitiesHandler = MunicipalitiesHandler()

print( 'Read interruptions json file...' )
interruptions = parse_json_content( interruptions_file )

print( 'Find interruptions in areas...' )

for interruption in interruptions:
    area = interruption[ 'area' ]
    lat = interruption[ 'lat' ]
    lon = interruption[ 'lon' ]

    municipality = municipalitiesHandler.findByPoint( lat, lon )
    if municipality:
        print( lat, lon, area, municipality )

    else:
        print( lat, lon )
