from fastapi import HTTPException
from src.validators.savings import validate_reservoir_aggregation

# validate_reservoir_aggregation

def test_validate_reservoir_aggregation_valueerror_1():
    try:
        validate_reservoir_aggregation( 'blah blah...' )
        assert False
    except HTTPException as e:
        assert 'Invalid parameter value (reservoir_aggregation).' in repr( e )

def test_validate_time_range_results():
    assert validate_reservoir_aggregation( None ) == None
    assert validate_reservoir_aggregation( '' ) == None
    assert validate_reservoir_aggregation( 'sum' ) == 'sum'
    assert validate_reservoir_aggregation( 'SUM' ) == 'sum'
