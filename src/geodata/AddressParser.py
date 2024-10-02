from abc import ABC, abstractmethod

class AddressParser( ABC ):

    district = 'ATTICA'
    country = 'GREECE'

    def __init__( self ):
        pass

    @abstractmethod
    def address( self ):
        pass

class AreaAddressParser( AddressParser ):

    _area = None

    def __init__( self, area ):

        super().__init__()

        # considering values like Ν. Ιωνία (Νέα Ιωνία)
        # excluded = [ 'Ν.', 'Π.', 'Α.', 'ΑΓ.' ]

        # parts = area.split( ' ' )

        # # remove spaces
        # parts = list( map( lambda p: p.strip(), parts ) )

        # # remove entries like excluded words
        # parts = list( filter( lambda p: p.upper() not in excluded, parts ) )

        # self._area = ' '.join( parts )
        self._area = area

    @property
    def address( self ):
        return f'{self._area},{self.district},{self.country}'

class IntersectionAreaAddressParser( AreaAddressParser ):

    _streets = None

    def __init__( self, area, intersection ):

        super().__init__( area )

        # considering values like Λεωφ. Ελ.  Βενιζέλου και Λεωφ. Κων. Καραμανλή
        excluded = [ 'ΛΕΩΦ.', 'Λ.', 'ΠΛ.', 'ΑΓ.', 'ΕΛΕΥΘ.', 'ΕΛ.', 'ΚΩΝ.' ]

        streets = intersection.split( 'και' )
        if len( streets ) < 2:
            streets = intersection.split( '&' )

        # remove text after double space (considering as comments)
        streets = list( map( lambda s: s.split( '  ' )[ 0 ], streets ) )

        # remove text after comma (considering as comments)
        streets = list( map( lambda s: s.split( ',' )[ 0 ].strip(), streets ) )

        # remove text after opening parenthsis (considering as comments)
        streets = list( map( lambda s: s.split( '(' )[ 0 ].strip(), streets ) )

        # remove text after dash (considering as comments)
        streets = list( map( lambda s: s.split( '-' )[ 0 ].strip(), streets ) )
        streets = list( map( lambda s: s.split( '–' )[ 0 ].strip(), streets ) )
        streets = list( map( lambda s: s.split( '_' )[ 0 ].strip(), streets ) )

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

        self._streets = streets

    @property
    def address( self ):
        return [ 
            f'{street},{self._area},{self.district},{self.country}' for street in self._streets 
        ]
