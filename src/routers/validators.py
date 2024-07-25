from fastapi import HTTPException
from src.helpers.time import is_year, is_month, is_day


def _validate_date( value: str | None ):

    if value == None:
        return value
    
    year = value[ 0:4 ]
    sep1 = value[ 4:5 ]
    month = value[ 5:7 ]
    sep2 = value[ 7:8 ]
    day = value[ 8:10 ]

    if len( value ) == 4 and is_year( year ):
        return value

    if len( value ) == 7 and is_year( year ) and sep1 == '-' and is_month( month ):
        return value

    if ( is_year( year ) and sep1 == '-' and is_month( month ) and sep2 == '-' and is_day( day, month, year ) ):
        return value
    
    raise;


def _validate_month_day( value: str | None ):

    if value == None:
        return value
    
    month = value[ 0:2 ]
    sep = value[ 2:3 ]
    day = value[ 3:5 ]

    if ( is_month( month ) and sep == '-' and is_day( day, month ) ):
        return value
    
    raise;


def validate_from_time( value: str | None ):

    try:
        return _validate_date( value )

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (from_time)." )


def validate_to_time( value: str | None ):

    try:
        return _validate_date( value )

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (to_time)." )


def _validate_id_filter( value: str | None ):

    if value == '':
        value = None

    if value == None:
        return value

    value = value.split( ',' )
    value = list( map( lambda x: int( x ), value ) )
    value = list( map( lambda x: str( x ), value ) )
    value = ','.join( value )
    return value

def validate_reservoir_filter( value: str | None ):

    try:
        return _validate_id_filter( value )

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (reservoir_filter)." )


def validate_month_filter( value: str | None ):

    if value == '':
        value = None

    if value == None:
        return value

    try:
        value = value.split( ',' )
        months = ( '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' )
        faults = list( filter( lambda x: x not in months, value ) )
        if len( faults ) > 0:
            raise Exception
        value = list( map( lambda x: f"'{str( x )}'", value ) )
        value = ','.join( value )
        return value

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (month_filter)." )


def _validate_true_false( value: str | None ):

    if value == '':
        value = None

    if value == None:
        return value

    if value.lower() == 'true':
        return value

    if value.lower() == 'false':
        return None

    raise;


def validate_reservoir_aggregation( value: str | None ):

    try:
        return _validate_true_false( value )

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (reservoir_aggregation)." )


def validate_time_aggregation( value: str | None ):

    if value == '':
        value = None

    if value == None:
        return value
    
    if value.lower() in ( 'month', 'year' ):
        return value.lower()

    raise HTTPException( 400, "Invalid parameter value (time_aggregation)." )


def validate_year_start( value: str | None ):

    try:
        return _validate_month_day( value )

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (year_start)." )
