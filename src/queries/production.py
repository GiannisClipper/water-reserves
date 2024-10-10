from src.helpers.query.QueryFactory import QueryFactory
from src.helpers.query.QueryMaker import QueryMaker
from src.helpers.query.QueryRunner import PoolAsyncQueryRunner
from src.helpers.query.QueryHandler import AsyncQueryHandler

CREATE_TABLE: str = """
    CREATE TABLE production (
        id SERIAL PRIMARY KEY,
        factory_id SERIAL NOT NULL,
        date DATE NOT NULL,
        quantity INTEGER,
        FOREIGN KEY( factory_id ) REFERENCES factories( id ),
        UNIQUE( factory_id, date )
    );
"""

class ProductionQueryMaker( QueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    def insert_into( self, data: list[ list ] ) -> None:

        query = '''INSERT INTO {table} ( date, factory_id, quantity ) VALUES '''
        for date, q1, q2, q3, q4, total in data:
            one_date = f"('{date}',1,{q1}),('{date}',2,{q2}),('{date}',3,{q3}),('{date}',4,{q4}),"
            query += one_date

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query
        return self.query
    
class ProductionQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = ProductionQueryMaker(
            table_name='production',
        )
        runner = PoolAsyncQueryRunner()
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )
