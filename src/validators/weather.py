from fastapi import HTTPException
from src.validators import validate_id_filter, validate_true_false


def validate_location_filter( value: str | None ):

    try:
        return validate_id_filter( value )

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (location_filter)." )


def validate_location_aggregation( value: str | None ):

    try:
        return validate_true_false( value )

    except Exception:
        raise HTTPException( 400, "Invalid parameter value (location_aggregation)." )

