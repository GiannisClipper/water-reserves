from src.geography.ResultsFilter import DistanceFilter

def test_distance_filter_with_0_to_2_elements():

    results = [
        { 'address': 'stree1,area,district,country', 'lat': 38, 'lon': 24 },
        { 'address': 'stree2,area,district,country', 'lat': 38, 'lon': 24 }
    ]

    test_results = DistanceFilter( []  ).results
    assert test_results == []

    test_results = DistanceFilter( results[ :1]  ).results
    assert test_results == results[ :1 ]

    test_results = DistanceFilter( results ).results
    assert test_results == results

def test_distance_filter_with_more_elements():

    results = [
        { 'address': 'stree1,area,district,country', 'lat': 38.1, 'lon': 24.6 },
        { 'address': 'stree2,area,district,country', 'lat': 38.2, 'lon': 23.5 },
        { 'address': 'stree2,area,district,country', 'lat': 38.23, 'lon': 23.45 },
        { 'address': 'stree2,area,district,country', 'lat': 35.3, 'lon': 25.4 },
        { 'address': 'stree1,area,district,country', 'lat': 36.4, 'lon': 29.3 },
        { 'address': 'stree1,area,district,country', 'lat': 38.3, 'lon': 23.4 },
        { 'address': 'stree2,area,district,country', 'lat': 39.6, 'lon': 21.1 }
    ]

    expected = [
        { 'address': 'stree1,area,district,country', 'lat': 38.3, 'lon': 23.4 },
        { 'address': 'stree2,area,district,country', 'lat': 38.23, 'lon': 23.45 },
    ]

    test_results = DistanceFilter( results ).results
    sorted_results = sorted( results, key=lambda x: x[ 'address' ], reverse=False )

    assert len( test_results ) == len( expected )
    for a, b in zip( test_results, expected ):
        assert a[ 'lat' ] == b[ 'lat' ]
        assert a[ 'lon' ] == b[ 'lon' ]
