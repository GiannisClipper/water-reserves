from src.helpers.time import is_year, is_leap, is_month, month_days, is_day

# is_year

def test_is_year_invalid_text():
    assert is_year( 'four' ) == False

def test_is_year_invalid_range():
    assert is_year( '01' ) == False
    assert is_year( '20240' ) == False

def test_is_year_valid():
    assert is_year( '2024' ) == True

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

def test_is_month_false():
    assert is_month( 'blah.. blah..' ) == False
    assert is_month( 'jan' ) == False
    assert is_month( '00' ) == False
    assert is_month( '1' ) == False
    assert is_month( '13' ) == False

def test_is_month_true():
    assert is_month( '01' ) == True
    assert is_month( '12' ) == True

# month_days

def test_month_days_valueerror():
    try:
        month_days( 'jan' )
        assert False
    except ValueError:
        assert True

def test_month_days():
    assert month_days( '01' )[ -1 ] == '31'
    assert month_days( '02', '2023' )[ -1 ] == '28'
    assert month_days( '02', '2024' )[ -1 ] == '29'
    assert month_days( '02' )[ -1 ] == '29'
    assert month_days( '03' )[ -1 ] == '31'
    assert month_days( '04' )[ -1 ] == '30'
    assert month_days( '05' )[ -1 ] == '31'
    assert month_days( '06' )[ -1 ] == '30'
    assert month_days( '07' )[ -1 ] == '31'
    assert month_days( '08' )[ -1 ] == '31'
    assert month_days( '09' )[ -1 ] == '30'
    assert month_days( '10' )[ -1 ] == '31'
    assert month_days( '11' )[ -1 ] == '30'
    assert month_days( '12' )[ -1 ] == '31'

# is_day

def test_is_day_valueerror():
    try:
        is_day( '1', '12', '2023' )
        assert False
    except ValueError:
        assert True

def test_is_day_false():
    assert is_day( '29', '02', '2023' ) == False
    assert is_day( '30', '02', '2024' ) == False
    assert is_day( '31', '04', '2024' ) == False

def test_is_day_true():
    assert is_day( '28', '02', '2024' ) == True
    assert is_day( '29', '02', '2024' ) == True
    assert is_day( '30', '04', '2024' ) == True