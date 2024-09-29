# from pydantic import BaseModel
from psycopg.rows import class_row

from src.db import pool

from src.helpers.time import get_first_date, get_last_date
from src.helpers.text import set_indentation, get_query_headers

# result is possible to have a large amount of rows
# so, in order to reduce the response size, is preferred 
# to return headers and data separately 
# instead of an array of objects

# class Saving( BaseModel ):
#     id: int
#     factory_id: str
#     date: str
#     quantity: int

class QueryMaker:

    def __init__(
        self,
        time_range: str | None, 
        factory_filter: str | None,
        interval_filter: str | None,
        factory_aggregation: str | None,
        time_aggregation: str | None,
        year_start: str | None
    ):
        self.time_range = time_range
        self.factory_filter = factory_filter
        self.interval_filter = interval_filter
        self.factory_aggregation = factory_aggregation
        self.time_aggregation = time_aggregation
        self.year_start = year_start
        self.query = None
    
        aliases = [ 'c', 'b', 'a' ]
        self.__create_base_query()

        if self.factory_aggregation:
            query = self.__expand_query_with_factory_aggregation( aliases.pop() )

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

        where_clause = [] #[ 'quantity>0' ]

        if from_date:
            where_clause.append( f"date>='{from_date}'" )

        if to_date:
            where_clause.append( f"date<='{to_date}'" )

        if self.factory_filter:
            where_clause.append( f"factory_id IN ({self.factory_filter})" )

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
            SELECT id, date, factory_id, quantity 
            FROM production
            {where_clause}'''


    def __expand_query_with_factory_aggregation(self,  alias ):

        self.query = f'''
            SELECT 
            {alias}.date AS date, SUM({alias}.quantity) AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            {alias}.date'''


    def __expand_query_with_month_aggregation( self, alias ):

        method = self.time_aggregation[ 1 ]
        quantity = f"ROUND(AVG({alias}.quantity),2)" if method == 'avg' else f"SUM({alias}.quantity)"

        if self.factory_aggregation:
            self.query = f'''
            SELECT 
            SUBSTR({alias}.date::text,1,7) AS month, 
            {quantity} AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,7)'''

        else:
            self.query = f'''
            SELECT 
            SUBSTR({alias}.date::text,1,7) AS month, 
            {alias}.factory_id AS factory_id, 
            {quantity} AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,7), 
            {alias}.factory_id'''


    def __expand_query_with_year_aggregation( self, alias ):

        method = self.time_aggregation[ 1 ]
        quantity = f"ROUND(AVG({alias}.quantity),2)" if method == 'avg' else f"SUM({alias}.quantity)"

        if self.factory_aggregation:
            self.query = f'''
            SELECT
            SUBSTR({alias}.date::text,1,4) AS year, 
            {quantity} AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,4)'''

        else:
            self.query = f'''
            SELECT
            SUBSTR({alias}.date::text,1,4) AS year, 
            {alias}.factory_id AS factory_id, 
            {quantity} AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,4), 
            {alias}.factory_id'''


    def __expand_query_with_custom_year_header( self, alias ):

        custom_year = f'''
            CASE WHEN SUBSTR({alias}.date::text,6,5)>='{self.year_start}'
            THEN SUBSTR({alias}.date::text,1,4) || '-' || CAST(SUBSTR({alias}.date::text,1,4) AS INTEGER)+1
            ELSE CAST(SUBSTR({alias}.date::text,1,4) AS INTEGER)-1 || '-' || SUBSTR({alias}.date::text,1,4) 
            END'''

        if self.factory_aggregation:
            self.query = f'''
            SELECT 
            {custom_year} AS custom_year,
            {alias}.quantity AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''
        else:
            self.query = f'''
            SELECT 
            {custom_year} AS custom_year,
            {alias}.factory_id AS factory_id, 
            {alias}.quantity AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''

    def __expand_query_with_custom_year_aggregation( self, alias ):

        method = self.time_aggregation[ 1 ]
        quantity = f"ROUND(AVG({alias}.quantity),2)" if method == 'avg' else f"SUM({alias}.quantity)"

        if self.factory_aggregation:
            self.query = f'''
            SELECT 
            {alias}.custom_year AS custom_year, 
            {quantity} AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}
            GROUP BY 
            {alias}.custom_year'''

        else:
            self.query = f'''
            SELECT 
            {alias}.custom_year AS custom_year, 
            {alias}.factory_id AS factory_id, 
            {quantity} AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}
            GROUP BY 
            {alias}.custom_year, 
            {alias}.factory_id'''


    def __expand_query_with_order( self ):

        headers = get_query_headers( self.query )
        order = headers[ 0 ] if headers[ 0 ] != 'id' else headers[ 1 ]
        if not self.factory_aggregation:
            order = f"{order},factory_id"

        self.query =f'''
            {self.query}
            ORDER BY 
            {order}
        '''


async def select_all( 
    time_range: list[ str ] | None = None, 
    factory_filter: str | None = None,
    interval_filter: str | None = None,
    factory_aggregation: str | None = None,
    time_aggregation: str | None = None,
    year_start: str | None = None
):

    query = QueryMaker( 
        time_range, factory_filter, interval_filter, 
        factory_aggregation, time_aggregation, year_start 
    ).get_query()

    # print( 'query:', query )

    headers = get_query_headers( query )
    data = []

    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute( query )
        data = await cur.fetchall()

    return headers, data


async def select_last_date():
    async with pool.connection() as conn, conn.cursor() as cur:
        await cur.execute( "SELECT MAX(date)::text last_date FROM production" )
        result = await cur.fetchone()
        return result[ 0 ]


async def insert_date( values: list[ any ] ) -> None:
    async with pool.connection() as conn, conn.cursor() as cur:
        date, q1, q2, q3, q4, total = values
        rows = f"('{date}',1,{q1}),('{date}',2,{q2}),('{date}',3,{q3}),('{date}',4,{q4}),"
        sql = f"INSERT INTO production ( date, factory_id, quantity ) VALUES {rows}"
        sql = sql[ 0:-1 ] + ';' # semicolon replaces last comma
        # print( sql )
        await cur.execute( sql )

