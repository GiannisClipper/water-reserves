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

def get_base_query( from_time, to_time, reservoir_filter, month_filter ):

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
        where_clause = f' WHERE {where_clause}'

    return f"SELECT * FROM savings {where_clause}"


def get_aggregation_query( query ):
    return f"SELECT a.date as date, '' as reservoir_id, SUM(a.quantity) as quantity FROM ({query}) a GROUP BY date, reservoir_id"


async def select_all( 
    from_time: str | None, 
    to_time: str | None, 
    reservoir_filter: str | None,
    month_filter: str | None,
    reservoir_aggregation: str | None
):
    async with pool.connection() as conn, conn.cursor() as cur:

        query = get_base_query( from_time, to_time, reservoir_filter, month_filter )
        print( query )

        if reservoir_aggregation:
            query = get_aggregation_query( query )
            print( query )

        await cur.execute( query )
        return await cur.fetchall()

