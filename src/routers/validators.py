from fastapi import HTTPException

def is_year( year: str ):

    try:
        return int( year ) >=1900 and int( year ) <= 2100
    except Exception:
        return False


def is_leap( year: str ):

    if is_year( year ):
        year = int( year )
        if year % 400 == 0:
            return True
        if year % 100 == 0:
            return False
        if year % 4 == 0:
            return True
        return False

    raise Exception( 'Invalid year value.' )


def is_month( month: str ):
    return month in ( '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' )

def month_days( month: str, year: str | None = None ):
    days = [ 
        '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' 
    ]

    if month in ( '01', '03', '05', '07', '08', '10', '12' ):
        return days

    if month in ( '04', '06', '09', '11' ):
        days.pop()
        return days

    if month == "02" and is_leap( year ):
        days.pop()
        days.pop()
        return days

    if month == "02":
        days.pop()
        days.pop()
        days.pop()
        return days

    raise Exception( 'Invalid month value' )

def is_day( day: str, month: str, year: str | None = None ):
    return day in month_days( month, year )


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

def validate_from_date( value: str | None ):

    try:
        return _validate_date( value )

    except Exception as error:
        raise HTTPException( 400, "Invalid from_date parameter." )

def validate_to_date( value: str | None ):

    try:
        return _validate_date( value )

    except Exception as error:
        raise HTTPException( 400, "Invalid to_date parameter." )


def _validate_id_filter( value: str | None ):

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

    except Exception as error:
        raise HTTPException( 400, "Invalid reservoir_filter parameter." )


def validate_month_filter( value: str | None ):

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

    except Exception as error:
        raise HTTPException( 400, "Invalid month_filter parameter." )
