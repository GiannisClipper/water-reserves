import httpx
from abc import ABC, abstractmethod
from src.settings import get_settings
from src.helpers.text import no_tones, no_vowels

class GeolocationHandler( ABC ):

    _base_url = None
    _response = None
    _results = []

    district = 'ATTICA'
    country = 'GREECE'
    _streets = None
    _area = None

    def __init__( self, interruption ):
        self._results = []
        self.area = interruption[ 'area' ]
        self.streets = interruption[ 'intersection' ]

    @property
    def results( self ):
        return self._results

    @property
    def area( self ):
        return self._area

    @area.setter
    def area( self, area ):

        # considering values like Ν. Ιωνία (Νέα Ιωνία)
        excluded = [ 'Ν.', 'Π.', 'Α.' ]

        parts = area.split( ' ' )

        # remove spaces
        parts = list( map( lambda p: p.strip(), parts ) )

        # remove entries like excluded words
        parts = list( filter( lambda p: p.upper() not in excluded, parts ) )

        self._area = ' '.join( parts )

    @property
    def streets( self ):
        return self._streets

    @streets.setter
    def streets( self, intersection ):

        # considering values like Λεωφ. Ελ.  Βενιζέλου και Λεωφ. Κων. Καραμανλή
        excluded = [ 'ΛΕΩΦ.', 'Λ.', 'ΠΛ.', 'ΕΛΕΥΘ.', 'ΕΛ.', 'ΚΩΝ.' ]

        streets = intersection.split( 'και' )
        if len( streets ) < 2:
            streets = intersection.split( '&' )

        # remove text after double space (considering as comments)
        streets = list( map( lambda s: s.split( '  ' )[ 0 ], streets ) )

        # remove text after comma (considering as comments)
        streets = list( map( lambda s: s.split( ',' )[ 0 ].strip(), streets ) )

        # remove text after opening parenthsis (considering as comments)
        streets = list( map( lambda s: s.split( '(' )[ 0 ].strip(), streets ) )

        # remove spaces
        streets = list( map( lambda s: s.strip(), streets ) )

        # remove entries with 1 or 2 letters
        streets = list( filter( lambda s: len( s ) > 2, streets ) )

        # remove excluded definitions
        for i, street in enumerate( streets ):
            parts = list( filter( lambda p: p.upper() not in excluded, street.split( ' ' ) ) )
            streets[ i ] = ' '.join( parts ) 

        # more than 2 streets considering as comments
        streets = streets[ :2 ]

        self._streets = list( map( lambda r: r.strip(), streets ) )

    @property
    def urls( self ):
        return list( map( 
            lambda street: f'{self._base_url}{street},{self.area},{self.district},{self.country}', 
            self.streets
        ) )

    def make_request( self, url ):

        with httpx.Client() as client:
            print( 'url:', url )
            response = client.get( url )
            print( f'Success: {response.status_code}' )
            self._response = response
        
        results = self.parse_response()

        for result in results:
            result[ 'url' ] = url
            result[ 'match_district' ] = self.match_district( result )
            result[ 'match_area' ] = self.match_area( result )
            result[ 'match_street' ] = self.match_area( result )

        self._results += results
        # print( 'self.results', self.results )

        return self

    @abstractmethod
    def parse_response( self, rows ):
        pass

    def match_district( self, result ):

        districts = [ self.district, 'ΑΤΤΙΚΗ', 'ΑΤΙΙΚΗ' ] # ΑΤΙΙΚΗ: very common typo in geoapify results
        descr = no_tones( result[ 'descr' ] ).upper()
        if any( list( map( lambda district: district in descr, districts ) ) ):
            return True
        return False

    def match_area( self, result ):

        descr = no_vowels( no_tones( result[ 'descr' ] ).upper() )
        area = no_vowels( no_tones( self.area[ :2 ] ).upper() )
        # [ :2 ] exlclude 2 last letters considering values like Ζωγράφος vs Ζωγράφου
        if area in descr.upper():
            return True
        return False

    def match_street( self, result ):

        descr = no_vowels( no_tones( result[ 'descr' ] ).upper() )
        street = no_vowels( no_tones( self.street ).upper() )
        if street in descr:
            return True
        return False


class NominatimHandler( GeolocationHandler ):

    _base_url = 'https://nominatim.openstreetmap.org/search?format=json&q='

    def __init__( self, interruption ):
        super().__init__( interruption )

    def parse_response( self ):

        data = self._response.json()

        results = []
        for row in data:
            results.append( {
                'descr': row[ 'display_name' ],
                'lat': float( row[ 'lat' ] ),
                'lon': float( row[ 'lon' ] )
            } )
        return results


class GeoapifyHandler( GeolocationHandler ):

    settings = get_settings()

    _base_url = f'https://api.geoapify.com/v1/geocode/search?apiKey={settings.GEOAPIFY_API_KEY}&lang=el&text='

    def __init__( self, interruption ):
        super().__init__( interruption )

    def parse_response( self ):

        data = self._response.json()

        result = []
        for row in data[ 'features' ]:
            properties = row[ 'properties' ]
            # print( 'properties', properties)

            descr = ''
            if properties.get( 'name' ): 
                descr = f'{properties.get( 'name' )}'
            if properties.get( 'street' ): 
                descr = f'{descr}, {properties.get( 'street' )}'
            if properties.get( 'suburb' ): 
                descr = f'{descr}, {properties.get( 'suburb' )}'
            if properties.get( 'city' ): 
                descr = f'{descr}, {properties.get( 'city' )}'
            if properties.get( 'state_district' ): 
                descr = f'{descr}, {properties.get( 'state_district' )}'
            if properties.get( 'state' ): 
                descr = f'{descr}, {properties.get( 'state' )}'

            result.append( {
                'descr': descr,
                'lat': row[ 'properties' ][ 'lat' ],
                'lon': row[ 'properties' ][ 'lon' ]
            } )
        return result

