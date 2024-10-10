from pydantic import BaseModel

from src.helpers.query.QueryFactory import QueryFactory
from src.helpers.query.QueryMaker import QueryMaker
from src.helpers.query.QueryRunner import OnceQueryRunner, PoolQueryRunner
from src.helpers.query.QueryHandler import SyncQueryHandler, AsyncQueryHandler

CREATE_TABLE: str = """
    CREATE TABLE {table} (
        id SERIAL PRIMARY KEY,
        name_el VARCHAR(30) UNIQUE NOT NULL,
        name_en VARCHAR(30) UNIQUE NOT NULL,
        lat REAL,
        lon REAL
    );
"""

class Location( BaseModel ):
    id: int
    name_el: str
    name_en: str
    lat: float | None
    lon: float | None

class LocationsQueryMaker( QueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    def insert_into( self, data: list ) -> None:

        query = '''INSERT INTO {table} ( name_el, name_en, lat, lon ) VALUES '''
        query = query.replace( '{table}', self.table_name )

        for row in data:
            name_el, name_en, lat, lon = row
            row = f"('{name_el}','{name_en}',{lat},{lon}),"
            query += row

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query
        return self.query
    
class LocationsOnceQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = LocationsQueryMaker(
            table_name='locations',
            RowModel=Location
        )
        runner = OnceQueryRunner()
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

class LocationsPoolQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = LocationsQueryMaker(
            table_name='locations',
            RowModel=Location
        )
        runner = PoolQueryRunner()
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )
