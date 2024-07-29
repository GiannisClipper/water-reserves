from src.helpers.time import has_year_format, has_month_format, has_day_format, has_month_day_format, has_date_format
from src.helpers.time import is_year, is_leap, is_month, get_month_days, is_day

# has_year_format

def test_has_year_format_invalid_text():
    assert has_year_format( '123' ) == False
    assert has_year_format( '12345' ) == False
    assert has_year_format( '4chr' ) == False

def test_has_year_format_valid_text():
    assert has_year_format( '1234' ) == True
    assert has_year_format( '2024' ) == True

# has_month_format

def test_has_month_format_invalid_text():
    assert has_month_format( '1' ) == False
    assert has_month_format( '123' ) == False
    assert has_month_format( '2c' ) == False

def test_has_month_format_valid_text():
    assert has_month_format( '00' ) == True
    assert has_month_format( '99' ) == True
    assert has_month_format( '01' ) == True

# has_day_format

def test_has_day_format_invalid_text():
    assert has_day_format( '1' ) == False
    assert has_day_format( '123' ) == False
    assert has_day_format( '2c' ) == False

def test_has_day_format_valid_text():
    assert has_day_format( '99' ) == True
    assert has_day_format( '01' ) == True

# has_month_day_format

def test_has_month_day_format_invalid_text():
    assert has_month_day_format( '01' ) == False
    assert has_month_day_format( '2023-01-01' ) == False
    assert has_month_day_format( '2024-01' ) == False
    assert has_month_day_format( 'Jan-01' ) == False
    assert has_month_day_format( 'Ja-01' ) == False

def test_has_month_day_format_valid_text():
    assert has_month_day_format( '99-99' ) == True
    assert has_month_day_format( '01-31' ) == True

# has_date_format

def test_has_date_format_invalid_text():
    assert has_date_format( '01' ) == False
    assert has_date_format( '2024-01' ) == False
    assert has_date_format( '2023-jan-01' ) == False
    assert has_date_format( '2023-jan-01' ) == False
    assert has_date_format( '2023-01-1st-day' ) == False

def test_has_date_format_valid_text():
    assert has_date_format( '9999-99-99' ) == True
    assert has_date_format( '2024-01-31' ) == True

# is_year

def test_is_year_valueerror():
    try:
        is_year( 'year' )
        assert False
    except ValueError:
        assert True

def test_is_year_invalid_text():
    assert is_year( '1234' ) == False
    assert is_year( '1899' ) == False
    assert is_year( '2101' ) == False

def test_is_year_valid_text():
    assert is_year( '1900' ) == True
    assert is_year( '2024' ) == True
    assert is_year( '2100' ) == True

# is_leap

def test_is_leap_valueerror():
    try:
        is_leap( 'leap' )
        assert False
    except ValueError:
        assert True

def test_is_leap_false():
    assert is_leap( '1997' ) == False
    assert is_leap( '2001' ) == False
    assert is_leap( '2005' ) == False

def test_is_leap_true():
    assert is_leap( '1996' ) == True
    assert is_leap( '2000' ) == True
    assert is_leap( '2004' ) == True

# is_month

def test_is_month_valueerror():
    try:
        is_month( 'month' )
        assert False
    except ValueError:
        assert True

def test_is_month_false():
    assert is_month( '00' ) == False
    assert is_month( '13' ) == False

def test_is_month_true():
    assert is_month( '01' ) == True
    assert is_month( '12' ) == True

# get_month_days

def test_get_month_days_valueerror():
    try:
        get_month_days( 'jan' )
        assert False
    except ValueError:
        assert True

def test_month_days_results():
    assert get_month_days( '01' )[ -1 ] == '31'
    assert get_month_days( '02', '2023' )[ -1 ] == '28'
    assert get_month_days( '02', '2024' )[ -1 ] == '29'
    assert get_month_days( '02' )[ -1 ] == '29'
    assert get_month_days( '03' )[ -1 ] == '31'
    assert get_month_days( '04' )[ -1 ] == '30'
    assert get_month_days( '05' )[ -1 ] == '31'
    assert get_month_days( '06' )[ -1 ] == '30'
    assert get_month_days( '07' )[ -1 ] == '31'
    assert get_month_days( '08' )[ -1 ] == '31'
    assert get_month_days( '09' )[ -1 ] == '30'
    assert get_month_days( '10' )[ -1 ] == '31'
    assert get_month_days( '11' )[ -1 ] == '30'
    assert get_month_days( '12' )[ -1 ] == '31'

# is_day

def test_is_day_invalid_day_format():
    try:
        is_day( '1', '12', '2023' )
        assert False
    except ValueError as e:
        assert 'Invalid day format.' in repr( e )

def test_is_day_invalid_month_value():
    try:
        is_day( '01', '13', '2023' )
        assert False
    except ValueError as e:
        assert 'Invalid month value.' in repr( e )

def test_is_day_invalid_year_value():
    try:
        is_day( '01', '12', '9999' )
        assert False
    except ValueError as e:
        assert 'Invalid year value.' in repr( e )

def test_is_day_invalid_values():
    assert is_day( '29', '02', '2023' ) == False
    assert is_day( '30', '02', '2024' ) == False
    assert is_day( '31', '04', '2024' ) == False

def test_is_day_valid_values():
    assert is_day( '28', '02', '2024' ) == True
    assert is_day( '29', '02', '2024' ) == True
    assert is_day( '30', '04', '2024' ) == True