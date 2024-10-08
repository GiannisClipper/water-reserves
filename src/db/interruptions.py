from pydantic import BaseModel
from psycopg.rows import class_row

from src.db import pool

from src.helpers.time import get_first_date, get_last_date
from src.helpers.text import set_indentation, get_query_headers

# result is possible to have a large amount of rows
# so, in order to reduce the response size, is preferred 
# to return headers and data separately 
# instead of an array of objects

class Interruptions( BaseModel ):
    id: int
    municipality_id: str
    date: str

class QueryMaker:

    def __init__(
        self,
        time_range: list[ str, str ] | None, 
        municipality_filter: str | None,
        interval_filter: str | None,
        municipality_aggregation: str | None,
        time_aggregation: str | None,
        year_start: str | None
    ):
        self.time_range = time_range
        self.municipality_filter = municipality_filter
        self.interval_filter = interval_filter
        self.municipality_aggregation = municipality_aggregation
        self.time_aggregation = time_aggregation
        self.year_start = year_start
        self.query = None
    
        aliases = [ 'c', 'b', 'a' ]
        self.__create_base_query()

        if self.municipality_aggregation:
            query = self.__expand_query_with_municipality_aggregation( aliases.pop() )

        if self.time_aggregation and self.time_aggregation[ 0 ] == 'month':
            self.__expand_query_with_month_aggregation( aliases.pop() )

        if self.time_aggregation and self.time_aggregation[ 0 ] == 'year':
            if not self.year_start:
                self.__expand_query_with_year_aggregation( aliases.pop() )
            else:
                self.__expand_query_with_custom_year_header( aliases.pop() )
                self.__expand_query_with_custom_year_aggregation( aliases.pop() )

        self.__expand_query_with_order()


    def get_query( self ):
        return self.query


    def __create_base_query( self ):

        from_time, to_time = self.time_range if self.time_range else ( None, None )
        from_date = get_first_date( from_time )
        to_date = get_last_date( to_time )

        where_clause = [ 'geo_url IS NOT NULL' ]

        if from_date:
            where_clause.append( f"date>='{from_date}'" )

        if to_date:
            where_clause.append( f"date<='{to_date}'" )

        if self.municipality_filter:
            where_clause.append( f"municipality_id IN ({self.municipality_filter})" )

        if self.interval_filter:
            op = 'AND' if self.interval_filter[ 0 ] <= self.interval_filter[ 1 ] else 'OR'
            text = f"(SUBSTR(date::text,6,5)>='{self.interval_filter[ 0 ]}' {op} SUBSTR(date::text,6,5)<='{self.interval_filter[ 1 ]}')"
            where_clause.append( text )

        if len( where_clause ) > 0:
            where_clause = ' AND '.join( where_clause )
            where_clause = f'WHERE {where_clause}'
        else:
            where_clause = ''

        self.query = f'''
            SELECT id, date, municipality_id, 1 AS points
            FROM interruptions
            {where_clause}'''


    def __expand_query_with_municipality_aggregation(self,  alias ):

        self.query = f'''
            SELECT 
            {alias}.date AS date, SUM({alias}.points) AS points 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            {alias}.date'''


    def __expand_query_with_month_aggregation( self, alias ):

        if self.municipality_aggregation:
            self.query = f'''
            SELECT 
            SUBSTR({alias}.date::text,1,7) AS month, 
            SUM({alias}.points) AS points 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,7)'''

        else:
            self.query = f'''
            SELECT 
            SUBSTR({alias}.date::text,1,7) AS month, 
            {alias}.municipality_id AS municipality_id, 
            SUM({alias}.points) AS points 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,7), 
            {alias}.municipality_id'''


    def __expand_query_with_year_aggregation( self, alias ):

        if self.municipality_aggregation:
            self.query = f'''
            SELECT
            SUBSTR({alias}.date::text,1,4) AS year, 
            SUM({alias}.points) AS points 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,4)'''

        else:
            self.query = f'''
            SELECT
            SUBSTR({alias}.date::text,1,4) AS year, 
            {alias}.municipality_id AS municipality_id, 
            SUM({alias}.points) AS points 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,4), 
            {alias}.municipality_id'''


    def __expand_query_with_custom_year_header( self, alias ):

        custom_year = f'''
            CASE WHEN SUBSTR({alias}.date::text,6,5)>='{self.year_start}'
            THEN SUBSTR({alias}.date::text,1,4) || '-' || CAST(SUBSTR({alias}.date::text,1,4) AS INTEGER)+1
            ELSE CAST(SUBSTR({alias}.date::text,1,4) AS INTEGER)-1 || '-' || SUBSTR({alias}.date::text,1,4) 
            END'''

        if self.municipality_aggregation:
            self.query = f'''
            SELECT 
            {custom_year} AS custom_year,
            {alias}.points AS points 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''
        else:
            self.query = f'''
            SELECT 
            {custom_year} AS custom_year,
            {alias}.municipality_id AS municipality_id, 
            {alias}.points AS points 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''

    def __expand_query_with_custom_year_aggregation( self, alias ):

        if self.municipality_aggregation:
            self.query = f'''
            SELECT 
            {alias}.custom_year AS custom_year, 
            SUM({alias}.points) AS points 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}
            GROUP BY 
            {alias}.custom_year'''

        else:
            self.query = f'''
            SELECT 
            {alias}.custom_year AS custom_year, 
            {alias}.municipality_id AS municipality_id, 
            SUM({alias}.points) AS points 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}
            GROUP BY 
            {alias}.custom_year, 
            {alias}.municipality_id'''


    def __expand_query_with_order( self ):

        headers = get_query_headers( self.query )
        order = headers[ 0 ] if headers[ 0 ] != 'id' else headers[ 1 ]
        if not self.municipality_aggregation:
            order = f"{order},municipality_id"

        self.query =f'''
            {self.query}
            ORDER BY 
            {order}
        '''


async def select_all( 
    time_range: list[ str ] | None = None, 
    municipality_filter: str | None = None,
    interval_filter: str | None = None,
    municipality_aggregation: str | None = None,
    time_aggregation: str | None = None,
    year_start: str | None = None
):

    query = QueryMaker( 
        time_range, municipality_filter, interval_filter, 
        municipality_aggregation, time_aggregation, year_start 
    ).get_query()

    # print( 'query:', query )

    headers = get_query_headers( query )
    data = []

    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute( query )
        data = await cur.fetchall()

    return headers, data

async def select_all_pending():

    sql = 'SELECT id, date, area, intersection FROM interruptions WHERE geo_failed IS NOT False AND geo_url IS NULL ORDER BY id'
    result = None
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute( sql )
        result = await cur.fetchall()
    return result


async def select_last_date():

    result = None
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute( "SELECT MAX(date)::text last_date FROM interruptions" )
        result = await cur.fetchone()
    return result[ 0 ]


async def insert_new_month( data: list[list] ) -> None:

    async with pool.connection() as conn, conn.cursor() as cur:
        sql = '''INSERT INTO interruptions ( date, scheduled, intersection, area ) VALUES '''
        for date, scheduled, intersection, area in data:

            # replace possible single quotes due to syntax error constructing the string with all values
            intersection = intersection.replace( "'", "''" )
            area = area.replace( "'", "''" )

            values = f"('{date}','{scheduled}','{intersection[:100]}','{area}'),"
            sql += values

        sql = sql[ 0:-1 ] + ';' # semicolon replaces last comma
        # print( sql )
        await cur.execute( sql )

def quoted( val ):
    if val != None:
        return f"'{val}'"
    else:
        return "NULL"


async def update_pending( row: list[ any ] ) -> None:

    if row.get( 'geo_url' ):
        row[ 'geo_url' ] = row[ 'geo_url' ].replace( "'", "''" )
    if row.get( 'geo_descr' ):
        row[ 'geo_descr' ] = row[ 'geo_descr' ].replace( "'", "''" )

    async with pool.connection() as conn, conn.cursor() as cur:
        sql = \
f'''
Update interruptions SET 
  geo_failed={quoted( row.get( 'geo_failed' ) )},
  geo_url={quoted( row.get( 'geo_url' ) )},
  geo_descr={quoted( row.get( 'geo_descr' ) )},
  lat={quoted( row.get( 'lat' ) )},
  lon={quoted( row.get( 'lon' ) )},
  municipality_id={quoted( row.get( 'municipality_id' ) )}
WHERE id='{row[ 'id' ]}';
'''
        # print( sql )
        await cur.execute( sql )
