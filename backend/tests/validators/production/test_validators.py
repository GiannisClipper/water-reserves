from fastapi import HTTPException
from src.validators.production import validate_factory_aggregation

# validate_factory_aggregation

def test_validate_factory_aggregation_valueerror_1():
    try:
        validate_factory_aggregation( 'blah blah...' )
        assert False
    except HTTPException as e:
        assert 'Invalid parameter value (factory_aggregation).' in repr( e )

def test_validate_time_range_results():
    assert validate_factory_aggregation( None ) == None
    assert validate_factory_aggregation( '' ) == None
    assert validate_factory_aggregation( 'sum' ) == 'sum'
    assert validate_factory_aggregation( 'SUM' ) == 'sum'
