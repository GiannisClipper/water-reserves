from fastapi import HTTPException
from src.validators import validate_time_range, validate_time_aggregation

# validate_time_range

def test_validate_time_range_valueerror_1():
    try:
        validate_time_range( '1,2,3' )
        assert False
    except HTTPException as e:
        assert 'Invalid parameter value (time_range).' in repr( e )

def test_validate_time_range_valueerror_2():
    try:
        validate_time_range( 'blah blah...' )
        assert False
    except HTTPException as e:
        assert 'Invalid parameter value (time_range).' in repr( e )

def test_validate_time_range_valueerror_3():
    try:
        validate_time_range( '0000,2024' )
        assert False
    except HTTPException as e:
        assert 'Invalid parameter value (time_range).' in repr( e )

def test_validate_time_range_results():
    assert validate_time_range( '2023' ) == [ '2023', '2023' ]
    assert validate_time_range( '2023,2024' ) == [ '2023', '2024' ]
    assert validate_time_range( '2023-07' ) == [ '2023-07', '2023-07' ]
    assert validate_time_range( '2023-06,2023-08' ) == [ '2023-06', '2023-08' ]
    assert validate_time_range( '2023-07-29' ) == [ '2023-07-29','2023-07-29' ]
    assert validate_time_range( '2023-07-01,2023-07-31' ) == [ '2023-07-01', '2023-07-31' ]

# validate_time_aggregation

def test_validate_time_aggregation_valueerror_1():
    try:
        validate_time_aggregation( '1,2,3' )
        assert False
    except HTTPException as e:
        assert 'Invalid parameter value (time_aggregation).' in repr( e )

def test_validate_time_aggregation_valueerror_2():
    try:
        validate_time_aggregation( 'blah blah...' )
        assert False
    except HTTPException as e:
        assert 'Invalid parameter value (time_aggregation).' in repr( e )

def test_validate_time_aggregation_valueerror_3():
    try:
        validate_time_aggregation( 'avg,year' )
        assert False
    except HTTPException as e:
        assert 'Invalid parameter value (time_aggregation).' in repr( e )

def test_validate_time_aggregation_results():
    assert validate_time_aggregation( 'YEAR,avg' ) == [ 'year', 'avg' ]
    assert validate_time_aggregation( 'year,SUM' ) == [ 'year', 'sum' ]
    assert validate_time_aggregation( 'Month,Avg' ) == [ 'month', 'avg' ]
    assert validate_time_aggregation( 'month,sum' ) == [ 'month', 'sum' ]
