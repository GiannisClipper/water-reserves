from fastapi import HTTPException
from src.validators import validate_id_filter


def validate_time_aggregation( value: str | None ) -> list[ str, str ] | None:

    if value in ( None, '' ):
        return None
    
    try:
        value = value.split( ',' )
        if len( value ) != 2:
            raise ValueError()

        if value[ 0 ].lower() not in ( 'alltime', 'date', 'month', 'year' ):
            raise ValueError()

        if value[ 1 ].lower() not in ( 'sum' ):
            raise ValueError()
        
        return [ value[ 0 ].lower(), value[ 1 ].lower() ]

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (time_aggregation)." )


def validate_municipality_filter( value: str | None ) -> str | None:

    try:
        return validate_id_filter( value )

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (municipality_filter)." )


def validate_municipality_aggregation( value: str | None ) -> str | None:

    if value in ( None, '' ):
        return None

    if value.lower() in ( 'sum' ):
        return value.lower()

    raise HTTPException( 400, "Invalid parameter value (municipality_aggregation)." )

