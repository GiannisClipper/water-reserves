from pydantic import BaseModel

from src.queries._abstract.QueryFactory import QueryFactory
from src.queries._abstract.QueryMaker import QueryMaker
from src.queries._abstract.QueryRunner import OnceQueryRunner, PoolQueryRunner
from src.queries._abstract.QueryHandler import SyncQueryHandler, AsyncQueryHandler

from src.db import conninfo, pool

from src.geography.MunicipalitiesHandler import MunicipalitiesHandler

CREATE_TABLE: str = """
    CREATE TABLE {table} (
        id CHAR(4) PRIMARY KEY,
        name_el VARCHAR(30) UNIQUE NOT NULL,
        name_en VARCHAR(30) UNIQUE,
        prefecture VARCHAR(30) NOT NULL,
        area REAL,
        population INTEGER,
        lat REAL,
        lon REAL
    );
"""

SELECT_BY_ID: str = """
    SELECT * FROM {table} WHERE id=%s::TEXT;
"""

class Municipality( BaseModel ):
    id: str
    name_el: str
    name_en: str | None
    prefecture: str
    area: float
    population: int
    lat: float
    lon: float

class MunicipalitiesQueryMaker( QueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    def insert_into( self, data: list ) -> None:

        geoCenters = MunicipalitiesHandler().findCenters()
 
        query = '''INSERT INTO {table} ( id, name_el, name_en, prefecture, area, population, lat, lon ) VALUES '''
        query = query.replace( '{table}', self.table_name )

        for row in data:
            id, name_el, name_en, prefecture, area, population = row
            lat = geoCenters[ id ].y
            lon = geoCenters[ id ].x
            row = f"('{id}','{name_el}','{name_en}','{prefecture}',{area},{population},{lat},{lon}),"
            query += row

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query
        return self.query

    def select_by_id( self, id: int | str ) -> tuple[ str, tuple, BaseModel ]:
        self.query = SELECT_BY_ID.replace( '{table}', self.table_name )
        self.params = ( id, )
        return self.query, self.params, self.RowModel

class MunicipalitiesOnceQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = MunicipalitiesQueryMaker(
            table_name='municipalities',
            RowModel=Municipality
        )
        runner = OnceQueryRunner(
            connection_string=conninfo
        )
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

class MunicipalitiesPoolQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = MunicipalitiesQueryMaker(
            table_name='municipalities',
            RowModel=Municipality
        )
        runner = PoolQueryRunner(
            pool=pool
        )
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )
