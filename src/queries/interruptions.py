from src.helpers.query.QueryFactory import QueryFactory
from src.helpers.query.QueryMaker import QueryMaker
from src.helpers.query.QueryRunner import PoolAsyncQueryRunner
from src.helpers.query.QueryHandler import AsyncQueryHandler

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

class InterruptionsQueryMaker( QueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    def insert_into( self, data: list[ list ] ) -> None:

        query = '''INSERT INTO {table} ( date, scheduled, intersection, area, geo_failed, geo_url, geo_descr, lat, lon, municipality_id ) VALUES '''
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
        return self.query

    def insert_pending( self, data: list[ list ] ) -> None:

        sql = '''INSERT INTO {table} ( date, scheduled, intersection, area ) VALUES '''
        for date, scheduled, intersection, area in data:

            # denote possible single quotes as part of the value (not as part of sql syntax)
            intersection = intersection.replace( "'", "''" )
            area = area.replace( "'", "''" )

            values = f"('{date}','{scheduled}','{intersection[:100]}','{area}'),"
            sql += values

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query
        return self.query

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
        return self.query

class InterruptionsQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = InterruptionsQueryMaker(
            table_name='interruptions',
        )
        runner = PoolAsyncQueryRunner()
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )
