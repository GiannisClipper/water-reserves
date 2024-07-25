# from pydantic import BaseModel
from psycopg.rows import class_row

from src.db import pool

# result is possible to have a large amount of rows
# so, in order to reduce the response size, is preferred 
# to return an array of values instead an array of objects

# class Saving( BaseModel ):
#     id: int
#     reservoir_id: str
#     date: str
#     quantity: int

def create_base_query( from_time, to_time, reservoir_filter, interval_filter ):

    where_clause = []

    if from_time:
        where_clause.append( f"date>='{from_time}'" )

    if to_time:
        where_clause.append( f"date<='{to_time}'" )

    if reservoir_filter:
        where_clause.append( f"reservoir_id IN ({reservoir_filter})" )

    if interval_filter:
        op = 'AND' if interval_filter[ 0 ] <= interval_filter[ 1 ] else 'OR'
        where_clause.append( f"(SUBSTR(date,6,5)>='{interval_filter[ 0 ]}' {op} SUBSTR(date,6,5)<='{interval_filter[ 1 ]}')" )

    if len( where_clause ) > 0:
        where_clause = ' AND '.join( where_clause )
        where_clause = f'WHERE {where_clause}'
    else:
        where_clause = ''

    return f'''
        SELECT id, date, reservoir_id, quantity 
        FROM savings
        {where_clause}
    '''


def expand_query_with_reservoir_aggregation( query ):

    return f'''
        SELECT 
        a.date AS date, '' AS reservoir_id, SUM(a.quantity) AS quantity 
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
        b.reservoir_id AS reservoir_id, 
        AVG(b.quantity) AS quantity 
        FROM (
        {query}
        ) b 
        GROUP BY 
        SUBSTR(b.date,1,7), 
        b.reservoir_id
    '''

def expand_query_with_year_aggregation( query ):

    return f'''
        SELECT
        SUBSTR(b.date,1,4) AS year, 
        b.reservoir_id AS reservoir_id, 
        AVG(b.quantity) AS quantity 
        FROM (
        {query}
        ) b 
        GROUP BY 
        SUBSTR(b.date,1,4), 
        b.reservoir_id
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
        b.reservoir_id AS reservoir_id, b.quantity AS quantity 
        FROM (
        {query}
        ) b
    '''

    return f'''
        SELECT 
        c.custom_year AS custom_year, 
        c.reservoir_id AS reservoir_id, 
        AVG(c.quantity) AS quantity 
        FROM (
        {query}
        ) c
        GROUP BY 
        c.custom_year, 
        c.reservoir_id
    '''


def expand_query_with_order( query, order ):

    return f'''
        {query}
        ORDER BY 
        {order}
    '''


async def select_all( 
    from_time: str | None, 
    to_time: str | None, 
    reservoir_filter: str | None,
    interval_filter: str | None,
    reservoir_aggregation: str | None,
    time_aggregation: str | None,
    year_start: str | None
):
    async with pool.connection() as conn, conn.cursor() as cur:

        order = 'date'
        query = create_base_query( from_time, to_time, reservoir_filter, interval_filter )
        # print( 'base_query:', query )

        if reservoir_aggregation:
            query = expand_query_with_reservoir_aggregation( query )
            # print( 'with_reservoir_aggregation:', query )

        if time_aggregation == 'month':
            order = 'month'
            query = expand_query_with_month_aggregation( query )
            # print( 'with_month_aggregation:', query )

        if time_aggregation == 'year':

            if not year_start:
                order = 'year'
                query = expand_query_with_year_aggregation( query )
                # print( 'with_year_aggregation:', query )

            else:
                order = 'custom_year'
                query = expand_query_with_custom_year_aggregation( query, year_start )
                # print( 'with_custom_year_aggregation:', query )

        query = expand_query_with_order( query, order )
        print( 'query:', query )

        await cur.execute( query )
        return await cur.fetchall()

