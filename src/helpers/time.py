# to check formats

def has_year_format( val: str ):
    return len( val ) == 4 and val.isdigit()

def has_month_format( val: str ):
    return len( val ) == 2 and val.isdigit()

def has_day_format( val: str ):
    return len( val ) == 2 and val.isdigit()

def has_year_month_format( val: str ):
    arr = val.split( '-' )
    if len( arr ) != 2:
        return False

    year, month = arr
    return has_year_format( year ) and has_month_format( month )

def has_month_day_format( val: str ):
    arr = val.split( '-' )
    if len( arr ) != 2:
        return False

    month, day = arr
    return has_month_format( month ) and has_day_format( day )

def has_date_format( val: str ):

    arr = val.split( '-' )
    if len( arr ) != 3:
        return False

    year, month, day = arr
    return has_year_format( year ) and has_month_format( month ) and has_day_format( day )


# to check values

def is_year( year: str ):

    if not has_year_format( year ):
        raise ValueError( 'Invalid year format.' )

    return int( year ) >=1900 and int( year ) <= 2100

def is_leap( year: str ):

    if not is_year( year ):
        raise ValueError( 'Invalid year value.' )

    year = int( year )
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    if year % 4 == 0:
        return True
    return False

def is_month( month: str ):

    if not has_month_format( month ):
        raise ValueError( 'Invalid month format.' )

    return month in ( '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' )


def get_month_days( month: str, year: str | None = None ):

    if not is_month( month ):
        raise ValueError( 'Invalid month value.' )

    if year and not is_year( year ):
        raise ValueError( 'Invalid year value.' )

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

    if month == "02":
        if year == None or is_leap( year ):
            days.pop()
            days.pop()
            return days
        else:
            days.pop()
            days.pop()
            days.pop()
            return days

def is_day( day: str, month: str, year: str | None = None ):

    if not has_day_format( day ):
        raise ValueError( 'Invalid day format.' )

    if not is_month( month ):
        raise ValueError( 'Invalid month value.' )

    if year and not is_year( year ):
        raise ValueError( 'Invalid year value.' )

    return day in get_month_days( month, year )

def is_year_month( val: str ):

    if not has_year_month_format( val ):
        raise ValueError( 'Invalid year-month format.' )

    year, month = val.split( '-' )
    return is_year( year ) and is_month( month )

def is_month_day( val: str ):

    if not has_month_day_format( val ):
        raise ValueError( 'Invalid month-day format.' )

    month, day = val.split( '-' )
    return is_month( month ) and is_day( day, month )

def is_date( val: str ):

    if not has_date_format( val ):
        raise ValueError( 'Invalid date format.' )

    year, month, day = val.split( '-' )
    return is_year( year ) and is_month( month ) and is_day( day, month, year )

def get_first_date( val: str ):

    if val == None:
        return val

    if has_year_format( val ) and is_year( val ):
        return f"{val}-01-01"

    if has_year_month_format( val ) and is_year_month( val ):
        return f"{val}-01"

    if has_date_format( val ) and is_date( val ):
        return val

    raise ValueError( 'Invalid value (no year or yera-month).' )

def get_last_date( val: str ):

    if val == None:
        return val

    if has_year_format( val ) and is_year( val ):
        return f"{val}-12-31"

    if has_year_month_format( val ) and is_year_month( val ):
        year, month = val.split( '-' )
        day = get_month_days( month, year )[ -1 ]
        return f"{val}-{day}"

    if has_date_format( val ) and is_date( val ):
        return val

    raise ValueError( 'Invalid value (no year or yera-month).' )
