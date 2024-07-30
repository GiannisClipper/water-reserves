# from pydantic import BaseModel
from psycopg.rows import class_row

from src.db import pool

from src.helpers.text import get_query_headers

# result is possible to have a large amount of rows
# so, in order to reduce the response size, is preferred 
# to return headers and data separately 
# instead of an array of objects

# class Saving( BaseModel ):
#     id: int
#     factory_id: str
#     date: str
#     quantity: int

def create_base_query( time_range, factory_filter, interval_filter ):

    from_time, to_time = ( None, None )
    if time_range:
        from_time, to_time = time_range

    where_clause = [ 'quantity>0' ]

    if from_time:
        where_clause.append( f"date>='{from_time}'" )

    if to_time:
        where_clause.append( f"date<='{to_time}'" )

    if factory_filter:
        where_clause.append( f"factory_id IN ({factory_filter})" )

    if interval_filter:
        op = 'AND' if interval_filter[ 0 ] <= interval_filter[ 1 ] else 'OR'
        where_clause.append( f"(SUBSTR(date,6,5)>='{interval_filter[ 0 ]}' {op} SUBSTR(date,6,5)<='{interval_filter[ 1 ]}')" )

    if len( where_clause ) > 0:
        where_clause = ' AND '.join( where_clause )
        where_clause = f'WHERE {where_clause}'
    else:
        where_clause = ''

    return f'''
        SELECT id, date, factory_id, quantity 
        FROM production
        {where_clause}
    '''


def expand_query_with_factory_aggregation( query ):

    return f'''
        SELECT 
        a.date AS date, '' AS factory_id, SUM(a.quantity) AS quantity 
        FROM (
        {query}
        ) a 
        GROUP BY 
        a.date
    '''


def expand_query_with_month_aggregation( query ):

    return f'''
        SELECT 
        SUBSTR(b.date,1,7) AS month, 
        b.factory_id AS factory_id, 
        ROUND(AVG(b.quantity),2) AS quantity 
        FROM (
        {query}
        ) b 
        GROUP BY 
        SUBSTR(b.date,1,7), 
        b.factory_id
    '''

def expand_query_with_year_aggregation( query ):

    return f'''
        SELECT
        SUBSTR(b.date,1,4) AS year, 
        b.factory_id AS factory_id, 
        ROUND(AVG(b.quantity),2) AS quantity 
        FROM (
        {query}
        ) b 
        GROUP BY 
        SUBSTR(b.date,1,4), 
        b.factory_id
    '''


def expand_query_with_custom_year_aggregation( query, year_start ):

    custom_year = f'''
        CASE WHEN SUBSTR(b.date,6,5)>='{year_start}'
        THEN SUBSTR(b.date,1,4) || '-' || CAST(SUBSTR(b.date,1,4) AS INTEGER)+1
        ELSE CAST(SUBSTR(b.date,1,4) AS INTEGER)-1 || '-' || SUBSTR(b.date,1,4) 
        END'''

    query = f'''
        SELECT 
        {custom_year} AS custom_year,
        b.factory_id AS factory_id, b.quantity AS quantity 
        FROM (
        {query}
        ) b
    '''

    return f'''
        SELECT 
        c.custom_year AS custom_year, 
        c.factory_id AS factory_id, 
        ROUND(AVG(c.quantity),2) AS quantity 
        FROM (
        {query}
        ) c
        GROUP BY 
        c.custom_year, 
        c.factory_id
    '''


def expand_query_with_order( query, order ):

    return f'''
        {query}
        ORDER BY 
        {order}
    '''


async def select_all( 
    time_range: str | None, 
    factory_filter: str | None,
    interval_filter: str | None,
    factory_aggregation: str | None,
    time_aggregation: str | None,
    year_start: str | None
):

    query = create_base_query( time_range, factory_filter, interval_filter )
    # print( 'base_query:', query )
    order = 'date,factory_id'

    if factory_aggregation:
        query = expand_query_with_factory_aggregation( query )
        # print( 'with_factory_aggregation:', query )

    if time_aggregation == 'month':
        query = expand_query_with_month_aggregation( query )
        # print( 'with_month_aggregation:', query )
        order = 'month,factory_id'

    if time_aggregation == 'year':

        if not year_start:
            query = expand_query_with_year_aggregation( query )
            # print( 'with_year_aggregation:', query )
            order = 'year,factory_id'

        else:
            query = expand_query_with_custom_year_aggregation( query, year_start )
            # print( 'with_custom_year_aggregation:', query )
            order = 'custom_year,factory_id'

    query = expand_query_with_order( query, order )
    print( 'query:', query )

    headers = get_query_headers( query )
    data =[]

    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute( query )
        data = await cur.fetchall()

    return headers, data