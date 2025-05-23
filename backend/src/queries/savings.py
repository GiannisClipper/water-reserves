from src.queries._abstract.QueryFactory import QueryFactory
from src.queries._abstract.QueryMaker import ExtendedQueryMaker
from src.queries._abstract.QueryRunner import OnceQueryRunner, PoolQueryRunner
from src.queries._abstract.QueryHandler import SyncQueryHandler, AsyncQueryHandler

from src.helpers.time import get_first_date, get_last_date
from src.helpers.text import set_indentation, get_query_headers

from src.db import conninfo, pool

CREATE_TABLE: str = """
    CREATE TABLE savings (
            id SERIAL PRIMARY KEY,
            reservoir_id SERIAL NOT NULL,
            date DATE NOT NULL,
            quantity INTEGER,
            FOREIGN KEY( reservoir_id ) REFERENCES reservoirs( id ),
            UNIQUE( reservoir_id, date )
    );
"""

class SavingsOnceQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = SavingsQueryMaker(
            table_name='savings',
        )
        runner = OnceQueryRunner(
            connection_string=conninfo
        )
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

class SavingsPoolQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = SavingsQueryMaker(
            table_name='savings',
        )
        runner = PoolQueryRunner(
            pool=pool
        )
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )

class SavingsQueryMaker( ExtendedQueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    def insert_into( self, data: list[ list ] ) -> str:

        query = '''INSERT INTO {table} ( date, reservoir_id, quantity ) VALUES '''
        query = query.replace( '{table}', self.table_name )

        for date, q1, q2, q3, q4, total in data:
            one_date = f"('{date}',1,{q1}),('{date}',2,{q2}),('{date}',3,{q3}),('{date}',4,{q4}),"
            query += one_date

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query
        return self.query

    def select_where(
        self,
        time_range: list[ str, str ] | None = None, 
        reservoir_filter: str | None = None,
        interval_filter: str | None = None,
        reservoir_aggregation: str | None = None,
        time_aggregation: str | None = None,
        year_start: str | None = None,
    ):
        self.time_range = time_range
        self.reservoir_filter = reservoir_filter
        self.interval_filter = interval_filter
        self.reservoir_aggregation = reservoir_aggregation
        self.time_aggregation = time_aggregation
        self.year_start = year_start
        self.query = None
    
        aliases = [ 'c', 'b', 'a' ]
        self.__create_base_query()

        if self.reservoir_aggregation:
            query = self.__expand_query_with_reservoir_aggregation( aliases.pop() )

        if self.time_aggregation and self.time_aggregation[ 0 ] == 'month':
            self.__expand_query_with_month_aggregation( aliases.pop() )

        if self.time_aggregation and self.time_aggregation[ 0 ] == 'year':
            if not self.year_start:
                self.__expand_query_with_year_aggregation( aliases.pop() )
            else:
                self.__expand_query_with_custom_year_header( aliases.pop() )
                self.__expand_query_with_custom_year_aggregation( aliases.pop() )

        self.__expand_query_with_order()

    def __create_base_query( self ):

        from_time, to_time = self.time_range if self.time_range else ( None, None )
        from_date = get_first_date( from_time )
        to_date = get_last_date( to_time )

        where_clause = [] #[ 'quantity>0' ]

        if from_date:
            where_clause.append( f"date>='{from_date}'" )

        if to_date:
            where_clause.append( f"date<='{to_date}'" )

        if self.reservoir_filter:
            where_clause.append( f"reservoir_id IN ({self.reservoir_filter})" )

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
            SELECT id, date, reservoir_id, quantity 
            FROM savings
            {where_clause}'''

    def __expand_query_with_reservoir_aggregation(self,  alias ):

        self.query = f'''
            SELECT 
            {alias}.date AS date, SUM({alias}.quantity) AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            {alias}.date'''

    def __expand_query_with_month_aggregation( self, alias ):

        if self.reservoir_aggregation:
            self.query = f'''
            SELECT 
            SUBSTR({alias}.date::text,1,7) AS month, 
            ROUND(AVG({alias}.quantity),2) AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,7)'''

        else:
            self.query = f'''
            SELECT 
            SUBSTR({alias}.date::text,1,7) AS month, 
            {alias}.reservoir_id AS reservoir_id, 
            ROUND(AVG({alias}.quantity),2) AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,7), 
            {alias}.reservoir_id'''

    def __expand_query_with_year_aggregation( self, alias ):

        if self.reservoir_aggregation:
            self.query = f'''
            SELECT
            SUBSTR({alias}.date::text,1,4) AS year, 
            ROUND(AVG({alias}.quantity),2) AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,4)'''

        else:
            self.query = f'''
            SELECT
            SUBSTR({alias}.date::text,1,4) AS year, 
            {alias}.reservoir_id AS reservoir_id, 
            ROUND(AVG({alias}.quantity),2) AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,4), 
            {alias}.reservoir_id'''

    def __expand_query_with_custom_year_header( self, alias ):

        custom_year = f'''
            CASE WHEN SUBSTR({alias}.date::text,6,5)>='{self.year_start}'
            THEN SUBSTR({alias}.date::text,1,4) || '-' || CAST(SUBSTR({alias}.date::text,1,4) AS INTEGER)+1
            ELSE CAST(SUBSTR({alias}.date::text,1,4) AS INTEGER)-1 || '-' || SUBSTR({alias}.date::text,1,4) 
            END'''

        if self.reservoir_aggregation:
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
            {alias}.reservoir_id AS reservoir_id, 
            {alias}.quantity AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''

    def __expand_query_with_custom_year_aggregation( self, alias ):

        if self.reservoir_aggregation:
            self.query = f'''
            SELECT 
            {alias}.custom_year AS custom_year, 
            ROUND(AVG({alias}.quantity),2) AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}
            GROUP BY 
            {alias}.custom_year'''

        else:
            self.query = f'''
            SELECT 
            {alias}.custom_year AS custom_year, 
            {alias}.reservoir_id AS reservoir_id, 
            ROUND(AVG({alias}.quantity),2) AS quantity 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}
            GROUP BY 
            {alias}.custom_year, 
            {alias}.reservoir_id'''

    def __expand_query_with_order( self ):

        headers = get_query_headers( self.query )
        order = headers[ 0 ] if headers[ 0 ] != 'id' else headers[ 1 ]
        if not self.reservoir_aggregation:
            order = f"{order},reservoir_id"

        self.query =f'''
            {self.query}
            ORDER BY 
            {order}
        '''
