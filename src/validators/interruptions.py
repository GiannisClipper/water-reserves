from fastapi import HTTPException
from src.validators import validate_id_filter


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

