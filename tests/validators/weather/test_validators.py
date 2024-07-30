from fastapi import HTTPException
from src.validators.weather import validate_location_aggregation

# validate_location_aggregation

def test_validate_location_aggregation_valueerror_1():
    try:
        validate_location_aggregation( 'blah blah...' )
        assert False
    except HTTPException as e:
        assert 'Invalid parameter value (location_aggregation).' in repr( e )

def test_validate_time_range_results():
    assert validate_location_aggregation( None ) == None
    assert validate_location_aggregation( '' ) == None
    assert validate_location_aggregation( 'sum' ) == 'sum'
    assert validate_location_aggregation( 'SUM' ) == 'sum'
