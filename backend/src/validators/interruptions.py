from fastapi import HTTPException
from src.validators import validate_id_filter


def validate_time_aggregation( value: str | None ) -> list[ str, str ] | None:

    if value in ( None, '' ):
        return None
    
    try:
        frequency, computation, ratio = '', '', ''

        values: list[ str ] = value.lower().split( ',' )
        if len( values ) == 2:
            values.append( '' )

        if len( values ) != 3:
            raise ValueError()

        frequency, computation, ratio = values

        if frequency not in ( 'alltime', 'date', 'month', 'year' ):
            raise ValueError()

        if computation not in ( 'sum' ):
            raise ValueError()

        if ratio not in ( '', 'over-area', 'over-population' ):
            raise ValueError()

        return [ frequency, computation, ratio ]

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

