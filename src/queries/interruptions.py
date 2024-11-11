from src.queries._abstract.QueryFactory import QueryFactory
from src.queries._abstract.QueryMaker import ExtendedQueryMaker
from src.queries._abstract.QueryRunner import OnceQueryRunner, PoolQueryRunner
from src.queries._abstract.QueryHandler import SyncQueryHandler, AsyncQueryHandler

from src.helpers.time import get_first_date, get_last_date
from src.helpers.text import set_indentation, get_query_headers

from src.db import conninfo, pool

CREATE_TABLE: str = """
    CREATE TABLE interruptions (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        scheduled VARCHAR(30),
        intersection VARCHAR(100) NOT NULL,
        area VARCHAR(30) NOT NULL,
        geo_failed BOOLEAN,
        geo_url TEXT,
        geo_descr TEXT,
        lat REAL,
        lon REAL,
        municipality_id CHAR(4),
        UNIQUE( date, area, intersection )
    );
"""

class InterruptionsOnceQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = InterruptionsQueryMaker(
            table_name='interruptions',
        )
        runner = OnceQueryRunner(
            connection_string=conninfo
        )
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

class InterruptionsPoolQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = InterruptionsQueryMaker(
            table_name='interruptions',
        )
        runner = PoolQueryRunner(
            pool=pool
        )
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )

class InterruptionsQueryMaker( ExtendedQueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None

    def insert_into( self, data: list[ list ] ) -> None:

        query = '''INSERT INTO {table} ( date, scheduled, intersection, area, geo_failed, geo_url, geo_descr, lat, lon, municipality_id ) VALUES '''
        query = query.replace( '{table}', self.table_name )

        for date, scheduled, intersection, area, geo_failed, geo_url, geo_descr, lat, lon, municipality_id in data:

            # denote possible single quotes as part of the value (not as part of sql syntax)
            intersection = intersection.replace( "'", "''" )
            area = area.replace( "'", "''" )
            geo_url = geo_url.replace( "'", "''" )
            geo_descr = geo_descr.replace( "'", "''" )

            values = f"(\
                '{date}','{scheduled}','{intersection[:100]}','{area}',\
                {geo_failed},'{geo_url}','{geo_descr}',\
                {lat},{lon},'{municipality_id}'\
            ),"
            query += values

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query

    def insert_pending( self, data: list[ list ] ) -> None:

        query = '''INSERT INTO {table} ( date, scheduled, intersection, area ) VALUES '''
        query = query.replace( '{table}', self.table_name )

        for date, scheduled, intersection, area in data:

            # denote possible single quotes as part of the value (not as part of sql syntax)
            intersection = intersection.replace( "'", "''" )
            area = area.replace( "'", "''" )

            values = f"('{date}','{scheduled}','{intersection[:100]}','{area}'),"
            query += values

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query

    def update_pending( self, row: list[ any ] ) -> None:

        quoted = lambda val: f"'{val}'" if val else "NULL"

        if row.get( 'geo_url' ):
            row[ 'geo_url' ] = row[ 'geo_url' ].replace( "'", "''" )
        if row.get( 'geo_descr' ):
            row[ 'geo_descr' ] = row[ 'geo_descr' ].replace( "'", "''" )

        query = f'''
        Update interruptions SET 
            geo_failed={quoted( row.get( 'geo_failed' ) )},
            geo_url={quoted( row.get( 'geo_url' ) )},
            geo_descr={quoted( row.get( 'geo_descr' ) )},
            lat={quoted( row.get( 'lat' ) )},
            lon={quoted( row.get( 'lon' ) )},
            municipality_id={quoted( row.get( 'municipality_id' ) )}
        WHERE id='{row[ 'id' ]}';
        '''

        self.query = query

    def select_pending( self ) -> None:

        query = 'SELECT id, date, area, intersection FROM interruptions WHERE geo_failed IS NOT False AND geo_url IS NULL ORDER BY id;'
        self.query = query
        self.params = None

    def select_where(
        self,
        time_range: list[ str, str ] | None = None, 
        municipality_filter: str | None = None,
        interval_filter: str | None = None,
        municipality_aggregation: str | None = None,
        time_aggregation: str | None = None,
        year_start: str | None = None
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

        if self.time_aggregation and self.time_aggregation[ 0 ] == 'alltime':
            self.__expand_query_with_alltime_aggregation( aliases.pop() )

        if self.time_aggregation and self.time_aggregation[ 0 ] == 'date':
            self.__expand_query_with_date_aggregation( aliases.pop() )

        if self.time_aggregation and self.time_aggregation[ 0 ] == 'month':
            self.__expand_query_with_month_aggregation( aliases.pop() )

        if self.time_aggregation and self.time_aggregation[ 0 ] == 'year':
            if not self.year_start:
                self.__expand_query_with_year_aggregation( aliases.pop() )
            else:
                self.__expand_query_with_custom_year_header( aliases.pop() )
                self.__expand_query_with_custom_year_aggregation( aliases.pop() )

        self.__expand_query_with_order()
        print( self.time_aggregation, self.query )


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
            SELECT id, date, municipality_id, 1 AS events
            FROM interruptions
            {where_clause}'''

    def __expand_query_with_municipality_aggregation(self,  alias ):

        self.query = f'''
            SELECT 
            {alias}.date AS date, SUM({alias}.events) AS events 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            {alias}.date'''

    def __expand_query_with_alltime_aggregation( self, alias ):

        if self.municipality_aggregation:
            self.query = f'''
            SELECT
            SUM({alias}.events) AS events 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''

        else:
            # in case of ALLTIME aggregation
            # complement result with municipality AREAS, POPULATIONS 
            # and divisions OVER them

            self.query = f'''
            SELECT
            ir.municipality_id AS municipality_id, 
            ir.events AS events,
            mu.area AS area,
            mu.population AS population,
            ROUND( (ir.events / mu.area)::numeric, 2 ) AS events_over_area,
            ROUND( (ir.events / ( .001 * mu.population ))::numeric, 2 ) AS events_over_population
            FROM (
                SELECT
                {alias}.municipality_id AS municipality_id, 
                SUM({alias}.events) AS events
                FROM (
                {set_indentation( 4, self.query )}
                ) {alias}
                GROUP BY 
                {alias}.municipality_id
            ) ir
            JOIN municipalities mu
            ON ir.municipality_id=mu.id'''

    def __expand_query_with_date_aggregation( self, alias ):

        if self.municipality_aggregation:
            self.query = f'''
            SELECT 
            {alias}.date AS date,
            SUM({alias}.events) AS events 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            {alias}.date'''

        else:
            self.query = f'''
            SELECT 
            {alias}.date AS date,
            {alias}.municipality_id AS municipality_id, 
            SUM({alias}.events) AS events 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias} 
            GROUP BY 
            {alias}.date,
            {alias}.municipality_id'''


    def __expand_query_with_month_aggregation( self, alias ):

        if self.municipality_aggregation:
            self.query = f'''
            SELECT 
            SUBSTR({alias}.date::text,1,7) AS month, 
            SUM({alias}.events) AS events 
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
            SUM({alias}.events) AS events 
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
            SUM({alias}.events) AS events 
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
            SUM({alias}.events) AS events 
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
            {alias}.events AS events 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''
        else:
            self.query = f'''
            SELECT 
            {custom_year} AS custom_year,
            {alias}.municipality_id AS municipality_id, 
            {alias}.events AS events 
            FROM (
            {set_indentation( 4, self.query )}
            ) {alias}'''

    def __expand_query_with_custom_year_aggregation( self, alias ):

        if self.municipality_aggregation:
            self.query = f'''
            SELECT 
            {alias}.custom_year AS custom_year, 
            SUM({alias}.events) AS events 
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
            SUM({alias}.events) AS events 
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
