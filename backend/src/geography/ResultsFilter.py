from abc import ABC, abstractmethod
from src.helpers.text import no_tones, no_vowels
from src.helpers.geography import distance

class ResultsFilter( ABC ):

    _address = None
    _results = None

    def __init__( self, address, results ):
        self._address = address
        self._results = results

    @property
    @abstractmethod
    def results( self ):
        pass
        
class DistrictFilter( ResultsFilter ):

    def __init__( self, address, results ):
        super().__init__( address, results )

    @property
    def results( self ):
        # print( 'DistrictFilter' )
        if not len( self._results ):
            return self._results

        districts = [ 'ATTICA', 'ΑΤΤΙΚΗ', 'ΑΤΙΙΚΗ' ] # ΑΤΙΙΚΗ: very common typo in geoapify results
        districts = [ no_vowels( district ) for district in districts ]

        new_results = []
        for result in self._results:
            descr = no_vowels( no_tones( result[ 'descr' ] ).upper() )
            # print( districts[1] + '=>' + descr )
            if any( list( map( lambda district: district in descr, districts ) ) ):
                new_results.append( result )
        return new_results

class AreaFilter( ResultsFilter ):

    def __init__( self, address, results ):
        super().__init__( address, results )
    
    @property
    def results( self ):
        # print( 'AreaFilter' )

        if not len( self._results ):
            return self._results

        area = self._address.split( ',' )[ -3 ]

        # considering values like Ν. Ιωνία (Νέα Ιωνία)
        parts = area.split( ' ' )
        if len( parts ) > 1:
            area = parts[ 1 ]

        # exlclude 2 last letters [ :-2 ] considering values like Ζωγράφος vs Ζωγράφου
        area = no_vowels( no_tones( area[ :-2 ] ).upper() )

        new_results = []
        for result in self._results:
            descr = no_vowels( no_tones( result[ 'descr' ] ).upper() )
            # print( area + '=>' + descr )
            if area in descr:
                new_results.append( result )
        return new_results

class StreetFilter( ResultsFilter ):

    def __init__( self, address, results ):
        super().__init__( address, results )
    
    @property
    def results( self ):
        # print( 'StreetFilter' )

        if not len( self._results ):
            return self._results

        street = self._address.split( ',' )[ -4 ]
        street = no_vowels( no_tones( street ).upper() )
        new_results = []
        for result in self._results:
            descr = no_vowels( no_tones( result[ 'descr' ] ).upper() )
            # print( street + '=>' + descr )
            if street in descr:
                new_results.append( result )
        return new_results

class DistanceFilter( ResultsFilter ):

    def __init__( self, results ):
        super().__init__( None, results )
    
    @property
    def results( self ):
        # print( 'DistanceFilter' )

        if len( self._results ) <= 2:
            return self._results

        address = self._results[ 0 ][ 'address' ]
        results1 = list( filter( lambda r: r[ 'address' ] == address, self._results ) )
        results2 = list( filter( lambda r: r[ 'address' ] != address, self._results ) )
   
        for r1 in results1:
            for r2 in results2:
                point1 = ( r1[ 'lat' ], r1[ 'lon' ] )
                point2 = ( r2[ 'lat' ], r2[ 'lon' ] )
                dist = distance( point1, point2 )

                if r1.get( 'distance' ) == None or r1.get( 'distance' ) > dist:
                    r1[ 'distance' ] = dist

                if r2.get( 'distance' ) == None or r2.get( 'distance' ) > dist:
                    r2[ 'distance' ] = dist

        # print( 'self._results', self._results )
        sorted_results = sorted( results1 + results2, key=lambda x: x[ 'distance' ], reverse=False )
        # print( 'sorted_results', sorted_results )
        shortest = sorted_results[ 0 ][ 'distance' ]
        new_results = list( filter( lambda result: result[ 'distance' ] == shortest, sorted_results ) )

        return new_results