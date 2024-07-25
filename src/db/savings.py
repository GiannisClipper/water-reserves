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

def create_base_query( from_time, to_time, reservoir_filter, month_filter ):

    where_clause = []

    if from_time:
        where_clause.append( f"date>='{from_time}'" )

    if to_time:
        where_clause.append( f"date<='{to_time}'" )

    if reservoir_filter:
        where_clause.append( f"reservoir_id IN ({reservoir_filter})" )

    if month_filter:
        where_clause.append( f"SUBSTR(date,6,2) IN ({month_filter})" )

    if len( where_clause ) > 0:
        where_clause = ' AND '.join( where_clause )
        where_clause = f'WHERE {where_clause}'

    return f'''
        SELECT id, date AS time, reservoir_id, quantity 
        FROM savings
        {where_clause}
    '''


def expand_query_with_reservoir_aggregation( query ):

    return f'''
        SELECT 
        a.time AS time, '' AS reservoir_id, SUM(a.quantity) AS quantity 
        FROM (
        {query}
        ) a 
        GROUP BY 
        a.time
    '''


def expand_query_with_month_aggregation( query ):

    return f'''
        SELECT 
        SUBSTR(b.time,1,7) AS time, 
        b.reservoir_id AS reservoir_id, 
        AVG(b.quantity) AS quantity 
        FROM (
        {query}
        ) b 
        GROUP BY 
        SUBSTR(b.time,1,7), 
        b.reservoir_id
    '''

def expand_query_with_year_aggregation( query ):

    return f'''
        SELECT
        SUBSTR(b.time,1,4) AS time, 
        b.reservoir_id AS reservoir_id, 
        AVG(b.quantity) AS quantity 
        FROM (
        {query}
        ) b 
        GROUP BY 
        SUBSTR(b.time,1,4), 
        b.reservoir_id
    '''


def expand_query_with_custom_year_aggregation( query, year_start ):

    time = f'''
        CASE WHEN SUBSTR(b.time,6,5)>='{year_start}'
        THEN SUBSTR(b.time,1,4) || '-' || CAST(SUBSTR(b.time,1,4) AS INTEGER)+1
        ELSE CAST(SUBSTR(b.time,1,4) AS INTEGER)-1 || '-' || SUBSTR(b.time,1,4) 
        END'''

    query = f'''
        SELECT 
        {time} AS time,
        b.reservoir_id AS reservoir_id, b.quantity AS quantity 
        FROM (
        {query}
        ) b
    '''

    return f'''
        SELECT 
        c.time AS time, 
        c.reservoir_id AS reservoir_id, 
        AVG(c.quantity) AS quantity 
        FROM (
        {query}
        ) c
        GROUP BY 
        c.time, 
        c.reservoir_id
    '''


def expand_query_with_order( query ):

    return f'''
        {query}
        ORDER BY 
        time
    '''


async def select_all( 
    from_time: str | None, 
    to_time: str | None, 
    reservoir_filter: str | None,
    month_filter: str | None,
    reservoir_aggregation: str | None,
    time_aggregation: str | None,
    year_start: str | None
):
    async with pool.connection() as conn, conn.cursor() as cur:

        query = create_base_query( from_time, to_time, reservoir_filter, month_filter )
        print( 'base_query:', query )

        if reservoir_aggregation:
            query = expand_query_with_reservoir_aggregation( query )
            print( 'with_reservoir_aggregation:', query )

        if time_aggregation == 'month':
            query = expand_query_with_month_aggregation( query )
            print( 'with_month_aggregation:', query )

        elif time_aggregation == 'year':

            if ( year_start == None ):
                query = expand_query_with_year_aggregation( query )
                print( 'with_year_aggregation:', query )

            else:
                query = expand_query_with_custom_year_aggregation( query, year_start )
                print( 'with_custom_year_aggregation:', query )

        query = expand_query_with_order( query )
        print( 'with_order:', query )

        await cur.execute( query )
        return await cur.fetchall()

