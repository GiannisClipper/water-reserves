from src.queries._abstract.QueryFactory import QueryFactory
from src.queries.weather import WeatherQueryMaker
from src.queries._abstract.QueryRunner import OnceQueryRunner, PoolQueryRunner
from src.queries._abstract.QueryHandler import SyncQueryHandler, AsyncQueryHandler

from src.helpers.time import get_first_date, get_last_date
from src.helpers.text import set_indentation, get_query_headers

from src.db import conninfo, pool

class PrecipitationOnceQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = PrecipitationQueryMaker()
        runner = OnceQueryRunner( connection_string=conninfo )
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

class PrecipitationPoolQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = PrecipitationQueryMaker()
        runner = PoolQueryRunner( pool=pool )
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )

class PrecipitationQueryMaker( WeatherQueryMaker ):

    def select_where(
        self,
        time_range: str | None = None, 
        location_filter: str | None = None,
        interval_filter: str | None = None,
        location_aggregation: str | None = None,
        time_aggregation: str | None = None,
        year_start: str | None = None
    ):
        self.time_range = time_range
        self.location_filter = location_filter
        self.interval_filter = interval_filter
        self.location_aggregation = location_aggregation
        self.time_aggregation = time_aggregation
        self.year_start = year_start
        self.query = None
    
        aliases = [ 'c', 'b', 'a' ]
        self.__create_base_query()

        if self.location_aggregation:
            query = self.__expand_query_with_location_aggregation( aliases.pop() )

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

        where_clause = []

        if from_date:
            where_clause.append( f"date>='{from_date}'" )

        if to_date:
            where_clause.append( f"date<='{to_date}'" )

        if self.location_filter:
            where_clause.append( f"location_id IN ({self.location_filter})" )

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
            SELECT id, date, location_id, precipitation_sum 
            FROM weather
            {where_clause}'''

    def __expand_query_with_location_aggregation(self,  alias ):

        self.query = f'''
            SELECT 
            {alias}.date AS date, ROUND(SUM({alias}.precipitation_sum)::numeric,2) AS precipitation_sum 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            {alias}.date'''

    def __expand_query_with_month_aggregation( self, alias ):

        method = self.time_aggregation[ 1 ]
        precipitation_sum = f"ROUND(AVG({alias}.precipitation_sum)::numeric,2)" if method == 'avg' else f"ROUND(SUM({alias}.precipitation_sum)::numeric,2)"

        # ::numeric is used to handle => 
        # psycopg.errors.UndefinedFunction: function round(double precision, integer) does not exist
        # LINE 6: ROUND(AVG(b.precipitation_sum),2) AS precipitation_sum
        # https://stackoverflow.com/questions/58731907/error-function-rounddouble-precision-integer-does-not-exist

        if self.location_aggregation:
            self.query = f'''
            SELECT 
            SUBSTR({alias}.date::text,1,7) AS month, 
            {precipitation_sum} AS precipitation_sum 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,7)'''

        else:
            self.query = f'''
            SELECT 
            SUBSTR({alias}.date::text,1,7) AS month, 
            {alias}.location_id AS location_id, 
            {precipitation_sum} AS precipitation_sum 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,7), 
            {alias}.location_id'''

    def __expand_query_with_year_aggregation( self, alias ):

        method = self.time_aggregation[ 1 ]
        precipitation_sum = f"ROUND(AVG({alias}.precipitation_sum)::numeric,2)" if method == 'avg' else f"ROUND(SUM({alias}.precipitation_sum)::numeric,2)"

        if self.location_aggregation:
            self.query = f'''
            SELECT
            SUBSTR({alias}.date::text,1,4) AS year, 
            {precipitation_sum} AS precipitation_sum 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,4)'''

        else:
            self.query = f'''
            SELECT
            SUBSTR({alias}.date::text,1,4) AS year, 
            {alias}.location_id AS location_id, 
            {precipitation_sum} AS precipitation_sum 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            SUBSTR({alias}.date::text,1,4), 
            {alias}.location_id'''

    def __expand_query_with_custom_year_header( self, alias ):

        custom_year = f'''
            CASE WHEN SUBSTR({alias}.date::text,6,5)>='{self.year_start}'
            THEN SUBSTR({alias}.date::text,1,4) || '-' || CAST(SUBSTR({alias}.date::text,1,4) AS INTEGER)+1
            ELSE CAST(SUBSTR({alias}.date::text,1,4) AS INTEGER)-1 || '-' || SUBSTR({alias}.date::text,1,4) 
            END'''

        if self.location_aggregation:
            self.query = f'''
            SELECT 
            {custom_year} AS custom_year,
            {alias}.precipitation_sum AS precipitation_sum 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''
        else:
            self.query = f'''
            SELECT 
            {custom_year} AS custom_year,
            {alias}.location_id AS location_id, 
            {alias}.precipitation_sum AS precipitation_sum 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''

    def __expand_query_with_custom_year_aggregation( self, alias ):

        method = self.time_aggregation[ 1 ]
        precipitation_sum = f"ROUND(AVG({alias}.precipitation_sum)::numeric,2)" if method == 'avg' else f"ROUND(SUM({alias}.precipitation_sum)::numeric,2)"

        if self.location_aggregation:
            self.query = f'''
            SELECT 
            {alias}.custom_year AS custom_year, 
            {precipitation_sum} AS precipitation_sum 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}
            GROUP BY 
            {alias}.custom_year'''

        else:
            self.query = f'''
            SELECT 
            {alias}.custom_year AS custom_year, 
            {alias}.location_id AS location_id, 
            {precipitation_sum} AS precipitation_sum 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}
            GROUP BY 
            {alias}.custom_year, 
            {alias}.location_id'''

    def __expand_query_with_order( self ):

        headers = get_query_headers( self.query )
        order = headers[ 0 ] if headers[ 0 ] != 'id' else headers[ 1 ]
        if not self.location_aggregation:
            order = f"{order},location_id"

        self.query =f'''
            {self.query}
            ORDER BY 
            {order}
        '''