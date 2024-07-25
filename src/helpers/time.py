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

    raise Exception( 'Invalid month value' )


def is_day( day: str, month: str, year: str | None = None ):
    return day in month_days( month, year )
