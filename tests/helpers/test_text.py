from src.helpers.text import get_query_headers

# get_query_headers

def test_get_query_headers_invalid():
    try:
        get_query_headers( 'blah blah...' )
        assert False
    except ValueError:
        assert True


def test_get_query_headers_simple_valid():
    query = "SELECT id, date, reservoir_id, quantity FROM savings"
    headers = get_query_headers( query )
    assert ', '.join( headers ) == "id, date, reservoir_id, quantity"


def test_get_query_headers_complex_valid():
    query = '''
        SELECT 
            CASE WHEN SUBSTR(b.date,6,5)>='10-01'
            THEN SUBSTR(b.date,1,4) || '-' || CAST(SUBSTR(b.date,1,4) AS INTEGER)+1
            ELSE CAST(SUBSTR(b.date,1,4) AS INTEGER)-1 || '-' || SUBSTR(b.date,1,4) 
            END AS custom_year,
            b.reservoir_id AS reservoir_id, b.quantity AS quantity 

        FROM (
            SELECT 
            a.date AS date, '' AS reservoir_id, SUM(a.quantity) AS quantity 

            FROM (
                SELECT id, date, reservoir_id, quantity 
                FROM savings
                ...
    '''
    headers = get_query_headers( query )
    assert ', '.join( headers ) == "custom_year, reservoir_id, quantity"
