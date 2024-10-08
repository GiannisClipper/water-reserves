from shapely.geometry import Point
from shapely.geometry import shape

from src.settings import get_settings
from src.helpers.json import parse_json_content

class MunicipalitiesHandler:

    settings = get_settings()

    geojson_file = settings.municipalities_geojson_file

    def __init__( self ):

        # load geojson data
        self.geojson = parse_json_content( self.geojson_file )

    def findByPoint( self, lat, lon ):

        # Notice: Repeat searching with slightly changed coords, considering rare cases:
        # eg. lat/lon next to coastline of Paloukia was not mapped with Salamina municipality.
        coords = (
            ( lat, lon ), 
            ( lat - 0.001, lon ),
            ( lat + 0.001, lon ),
            ( lat, lon - 0.001 ), 
            ( lat, lon + 0.001 )
        )

        for coord in coords:
            lat, lon = coord
            point = Point( lon, lat ) # Notice: Point receives params for x and y (lon first and then lat)

            for feature in self.geojson[ 'features' ]:
                # how to convert geojson to shapely polygon
                # https://stackoverflow.com/questions/68820085/how-to-convert-geojson-to-shapely-polygon
                polygon = shape( feature[ 'geometry' ] )
                name = feature[ 'properties' ][ 'NAME' ]

                if polygon.contains( point ):
                    return name

        return None
    

