from pydantic import BaseModel

from src.helpers.query.QueryFactory import QueryFactory
from src.helpers.query.QueryMaker import QueryMaker
from src.helpers.query.QueryRunner import OnceQueryRunner, PoolQueryRunner
from src.helpers.query.QueryHandler import SyncQueryHandler, AsyncQueryHandler

CREATE_TABLE: str = """
    CREATE TABLE {table} (
        id CHAR(4) PRIMARY KEY,
        name_el VARCHAR(30) UNIQUE NOT NULL,
        name_en VARCHAR(30) UNIQUE,
        prefecture VARCHAR(30) NOT NULL
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

class MunicipalitiesQueryMaker( QueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    def insert_into( self, data: list ) -> None:

        query = '''INSERT INTO {table} ( id, name_el, prefecture ) VALUES '''
        query = CREATE_TABLE.replace( '{table}', self.table_name )

        for row in data:
            id, name_el, prefecture = row
            row = f"('{id}','{name_el}','{prefecture}'),"
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
        runner = OnceQueryRunner()
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

class MunicipalitiesPoolQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = MunicipalitiesQueryMaker(
            table_name='municipalities',
            RowModel=Municipality
        )
        runner = PoolQueryRunner()
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )
