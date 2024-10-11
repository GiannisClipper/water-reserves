from pydantic import BaseModel

from src.queries._abstract.QueryFactory import QueryFactory
from src.queries._abstract.QueryMaker import QueryMaker
from src.queries._abstract.QueryRunner import OnceQueryRunner, PoolQueryRunner
from src.queries._abstract.QueryHandler import SyncQueryHandler, AsyncQueryHandler

from src.db import conninfo, pool

CREATE_TABLE: str = """
    CREATE TABLE {table} (
        id SERIAL PRIMARY KEY,
        name_el VARCHAR(30) UNIQUE NOT NULL,
        name_en VARCHAR(30) UNIQUE NOT NULL,
        lat REAL,
        lon REAL,
        start VARCHAR(10)
    );
"""

class Reservoir( BaseModel ):
    id: int
    name_el: str
    name_en: str
    lat: float | None
    lon: float | None
    start: str

class ReservoirsQueryMaker( QueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    def insert_into( self, data: list ) -> None:

        query = '''INSERT INTO {table} ( name_el, name_en, lat, lon, start ) VALUES '''
        query = query.replace( '{table}', self.table_name )

        for row in data:
            name_el, name_en, lat, lon, start = row
            row = f"('{name_el}','{name_en}',{lat},{lon},'{start}'),"
            query += row

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query
        return self.query
    
class ReservoirsQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = ReservoirsQueryMaker(
            table_name='reservoirs',
            RowModel=Reservoir
        )
        runner = PoolQueryRunner()
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )

class ReservoirsOnceQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = ReservoirsQueryMaker(
            table_name='reservoirs',
            RowModel=Reservoir
        )
        runner = OnceQueryRunner(
            connection_string=conninfo
        )
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

class ReservoirsPoolQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = ReservoirsQueryMaker(
            table_name='reservoirs',
            RowModel=Reservoir
        )
        runner = PoolQueryRunner(
            pool=pool
        )
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )
