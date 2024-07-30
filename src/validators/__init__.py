from fastapi import HTTPException
from src.helpers.time import has_year_format, has_year_month_format, has_date_format
from src.helpers.time import is_year, is_year_month, is_month_day, is_date

def validate_time_range( value: str | None ):

    if value == '':
        value = None

    if value == None:
        return value

    try:
        value = value.split( ',' )
        assert len( value ) <= 2

        for v in value:
            if not v or \
                ( has_year_format( v ) and is_year( v ) ) or \
                ( has_year_month_format( v ) and is_year_month( v ) ) or \
                ( has_date_format( v ) and is_date( v ) ):
                continue
            raise ValueError;

        if len( value ) == 1:
            value.append( value[ 0 ] )

        return value

    except Exception as e:
        raise HTTPException( 400, "Invalid parameter value (time_range)." )


def validate_id_filter( value: str | None ):

    if value == '':
        value = None

    if value == None:
        return value

    value = value.split( ',' )
    value = list( map( lambda x: int( x ), value ) )
    value = list( map( lambda x: str( x ), value ) )
    value = ','.join( value )
    return value


def validate_interval_filter( value: str | None ):

    if value == '':
        value = None

    if value == None:
        return value

    try:
        value = value.split( ',' )
        assert len( value ) == 2

        from_day, to_day = value
        if ( from_day == None or is_month_day( from_day ) ) and ( to_day == None or is_month_day( to_day ) ) :
            return value
        raise;

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (interval_filter)." )


def validate_time_aggregation( value: str | None ):

    if value == '':
        value = None

    if value == None:
        return value
    
    try:
        value = value.split( ',' )
        if len( value ) != 2:
            raise ValueError()

        if value[ 0 ].lower() not in ( 'month', 'year' ):
            raise ValueError()

        if value[ 1 ].lower() not in ( 'avg', 'sum' ):
            raise ValueError()
        
        return [ value[ 0 ].lower(), value[ 1 ].lower() ]

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (time_aggregation)." )


def validate_year_start( value: str | None ):

    try:
        if value == None or is_month_day( value ):
            return value
        raise;

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (year_start)." )
