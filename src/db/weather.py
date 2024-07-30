# from pydantic import BaseModel
from psycopg.rows import class_row

from src.db import pool

from src.helpers.time import get_first_date, get_last_date
from src.helpers.text import get_query_headers

# result is possible to have a large amount of rows
# so, in order to reduce the response size, is preferred 
# to return headers and data separately 
# instead of an array of objects

# class Weather( BaseModel ):
#     id: int
#     location_id: str
#     date: str
#     precipitation_sum: real

def create_base_query( time_range, location_filter, interval_filter ):

    from_time, to_time = time_range if time_range else ( None, None )
    from_date = get_first_date( from_time )
    to_date = get_last_date( to_time )

    where_clause = []

    if from_date:
        where_clause.append( f"date>='{from_date}'" )

    if to_date:
        where_clause.append( f"date<='{to_date}'" )

    if location_filter:
        where_clause.append( f"location_id IN ({location_filter})" )

    if interval_filter:
        op = 'AND' if interval_filter[ 0 ] <= interval_filter[ 1 ] else 'OR'
        where_clause.append( f"(SUBSTR(date,6,5)>='{interval_filter[ 0 ]}' {op} SUBSTR(date,6,5)<='{interval_filter[ 1 ]}')" )

    if len( where_clause ) > 0:
        where_clause = ' AND '.join( where_clause )
        where_clause = f'WHERE {where_clause}'
    else:
        where_clause = ''

    return f'''
        SELECT id, date, location_id, precipitation_sum 
        FROM weather
        {where_clause}
    '''


def expand_query_with_location_aggregation( query ):

    return f'''
        SELECT 
        a.date AS date, '' AS location_id, SUM(a.precipitation_sum) AS precipitation_sum 
        FROM (
        {query}
        ) a 
        GROUP BY 
        a.date
    '''


def expand_query_with_month_aggregation( query, aggregation_method ):

    # use ::numeric to handle => 
    # psycopg.errors.UndefinedFunction: function round(double precision, integer) does not exist
    # LINE 6: ROUND(AVG(b.precipitation_sum),2) AS precipitation_sum
    # https://stackoverflow.com/questions/58731907/error-function-rounddouble-precision-integer-does-not-exist

    aggregation_method = "ROUND(AVG(b.precipitation_sum::numeric),2)" if aggregation_method == 'avg' else "SUM(b.precipitation_sum)"

    return f'''
        SELECT 
        SUBSTR(b.date,1,7) AS month, 
        b.location_id AS location_id, 
        {aggregation_method} AS precipitation_sum 
        FROM (
        {query}
        ) b 
        GROUP BY 
        SUBSTR(b.date,1,7), 
        b.location_id
    '''

def expand_query_with_year_aggregation( query, aggregation_method ):

    aggregation_method = "ROUND(AVG(b.precipitation_sum::numeric),2)" if aggregation_method == 'avg' else "SUM(b.precipitation_sum)"

    return f'''
        SELECT
        SUBSTR(b.date,1,4) AS year, 
        b.location_id AS location_id, 
        {aggregation_method} AS precipitation_sum 
        FROM (
        {query}
        ) b 
        GROUP BY 
        SUBSTR(b.date,1,4), 
        b.location_id
    '''


def expand_query_with_custom_year_aggregation( query, year_start, aggregation_method ):

    custom_year = f'''
        CASE WHEN SUBSTR(b.date,6,5)>='{year_start}'
        THEN SUBSTR(b.date,1,4) || '-' || CAST(SUBSTR(b.date,1,4) AS INTEGER)+1
        ELSE CAST(SUBSTR(b.date,1,4) AS INTEGER)-1 || '-' || SUBSTR(b.date,1,4) 
        END'''

    query = f'''
        SELECT 
        {custom_year} AS custom_year,
        b.location_id AS location_id, b.precipitation_sum AS precipitation_sum 
        FROM (
        {query}
        ) b
    '''

    aggregation_method = "ROUND(AVG(c.precipitation_sum::numeric),2)" if aggregation_method == 'avg' else "SUM(c.precipitation_sum)"

    return f'''
        SELECT 
        c.custom_year AS custom_year, 
        c.location_id AS location_id, 
        {aggregation_method} AS precipitation_sum 
        FROM (
        {query}
        ) c
        GROUP BY 
        c.custom_year, 
        c.location_id
    '''


def expand_query_with_order( query, order ):

    return f'''
        {query}
        ORDER BY 
        {order}
    '''


async def select_all( 
    time_range: str | None, 
    location_filter: str | None,
    interval_filter: str | None,
    location_aggregation: str | None,
    time_aggregation: str | None,
    year_start: str | None
):

    query = create_base_query( time_range, location_filter, interval_filter )
    # print( 'base_query:', query )
    order = 'date,location_id'

    if location_aggregation:
        query = expand_query_with_location_aggregation( query )
        # print( 'with_location_aggregation:', query )

    if time_aggregation and time_aggregation[ 0 ] == 'month':

        aggregation_method = time_aggregation[ 1 ]

        query = expand_query_with_month_aggregation( query, aggregation_method )
        # print( 'with_month_aggregation:', query )
        order = 'month,location_id'

    if time_aggregation and time_aggregation[ 0 ] == 'year':

        aggregation_method = time_aggregation[ 1 ]

        if not year_start:
            query = expand_query_with_year_aggregation( query, aggregation_method )
            # print( 'with_year_aggregation:', query )
            order = 'year,location_id'

        else:
            query = expand_query_with_custom_year_aggregation( query, year_start, aggregation_method )
            # print( 'with_custom_year_aggregation:', query )
            order = 'custom_year,location_id'

    query = expand_query_with_order( query, order )
    print( 'query:', query )

    headers = get_query_headers( query )
    data =[]

    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute( query )
        data = await cur.fetchall()

    return headers, data