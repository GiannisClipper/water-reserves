from .AddressParser import AreaAddressParser, IntersectionAreaAddressParser
from .ApiProvider import NominatimApiProvider, GeoapifyApiProvider
from .ResultsFilter import DistrictFilter, AreaFilter, StreetFilter, DistanceFilter

class GeolocationHandler:

    _area = None
    _intersection = None

    def __init__( self, interruption ):
        self._intersection = interruption[ 'intersection' ]
        self._area = interruption[ 'area' ]

    @property
    def result( self ):

        nominatimApiProvider = NominatimApiProvider()
        geoapifyApiProvider = GeoapifyApiProvider()

        # request (district), (country), area, street

        address_list = IntersectionAreaAddressParser( self._area, self._intersection ).address
        results_backup = []

        # use Nominatim Api
        for address in address_list:
            results = nominatimApiProvider.set_address( address ).request()
            if not results.get( 'data' ):
                continue

            results = results[ 'data' ]
            results_backup += results
            # filter district, area and street
            results = DistrictFilter( address, results ).results
            results = AreaFilter( address, results ).results
            results = StreetFilter( address, results ).results

            if len( results ) > 0:
                return results[ 0 ]

        # use Geoapify Api
        for address in address_list:
            results = geoapifyApiProvider.set_address( address ).request()
            if not results.get( 'data' ):
                continue

            results = results[ 'data' ]
            results_backup += results
            # filter district, area and street
            results = DistrictFilter( address, results ).results
            results = AreaFilter( address, results ).results
            results = StreetFilter( address, results ).results

            if len( results ) > 0:
                return results[ 0 ]

        # filter district and area (no street)
        # starting from results_backup (all results with street, area)
        results = DistrictFilter( address, results_backup ).results
        results = AreaFilter( address, results ).results
        if len( results ) > 0:
            return results[ 0 ]

        # request (district), (country), area 

        address = AreaAddressParser( self._area ).address

        # use Nominatim Api
        results = nominatimApiProvider.set_address( address ).request()
        if results.get( 'data' ):
            results = results[ 'data' ]
            # filter district and area, NO STREET
            results = DistrictFilter( address, results ).results
            results = AreaFilter( address, results ).results
            if len( results ) > 0:
                return results[ 0 ]

        # use Geoapify Api
        results = geoapifyApiProvider.set_address( address ).request()
        if results.get( 'data' ):
            results = results[ 'data' ]
            # filter district and area, NO STREET
            results = DistrictFilter( address, results ).results
            results = AreaFilter( address, results ).results
            if len( results ) > 0:
                return results[ 0 ]

        # filter district, NO AREA, NO STREET (considering the shortest distance between street results)
        # starting from results_backup (all results with street, area)
        results = DistrictFilter( address, results_backup ).results
        results = DistanceFilter( results ).results
        if len( results ) > 0:
            return results[ 0 ]

        return None
