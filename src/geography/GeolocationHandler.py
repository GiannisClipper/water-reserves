from src.requests.geolocation.nominatim import NominatimSyncGetRequestFactory
from src.requests.geolocation.geoapify import GeoapifySyncGetRequestFactory

from .AddressParser import AreaAddressParser, IntersectionAreaAddressParser
from .ResultsFilter import DistrictFilter, AreaFilter, StreetFilter, DistanceFilter

class GeolocationHandler:

    _area = None
    _intersection = None

    def __init__( self, interruption ):
        self._intersection = interruption[ 'intersection' ]
        self._area = interruption[ 'area' ]

    @property
    def result( self ):

        nominatimHandler = NominatimSyncGetRequestFactory().handler
        geoapifyHandler = GeoapifySyncGetRequestFactory().handler

        # request (district), (country), area, street

        address_parser = IntersectionAreaAddressParser( self._area, self._intersection )
        address_list = address_parser.address
        results_backup = []

        # use Nominatim Api
        for address in address_list:
            nominatimHandler.set_params( { 'address': address } )
            nominatimHandler.request()
            results = {
                'error': nominatimHandler.parser.error,
                'data': nominatimHandler.parser.data
            }

            if results.get( 'error' ):
                return results
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
            geoapifyHandler.set_params( { 'address': address } )
            geoapifyHandler.request()
            results = {
                'error': nominatimHandler.parser.error,
                'data': nominatimHandler.parser.data
            }

            if results.get( 'error' ):
                return results
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

        # request (district), (country), area, NO STREET 

        address = AreaAddressParser( self._area ).address

        # filter district and area (no street)
        # starting from results_backup (all results with street, area)
        results = DistrictFilter( address, results_backup ).results
        results = AreaFilter( address, results ).results
        if len( results ) > 0:
            return results[ 0 ]

        # use Nominatim Api
        nominatimHandler.set_params( { 'address': address } )
        nominatimHandler.request()
        results = {
            'error': nominatimHandler.parser.error,
            'data': nominatimHandler.parser.data
        }

        if results.get( 'error' ):
            return results
        if results.get( 'data' ):
            results = results[ 'data' ]
            # filter district and area, NO STREET
            results = DistrictFilter( address, results ).results
            results = AreaFilter( address, results ).results
            if len( results ) > 0:
                return results[ 0 ]

        # use Geoapify Api
        geoapifyHandler.set_params( { 'address': address } )
        geoapifyHandler.request()
        results = {
            'error': nominatimHandler.parser.error,
            'data': nominatimHandler.parser.data
        }

        if results.get( 'error' ):
            return results
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
