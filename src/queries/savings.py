from src.helpers.query.QueryFactory import QueryFactory
from src.helpers.query.QueryMaker import QueryMaker
from src.helpers.query.QueryRunner import OnceQueryRunner, PoolQueryRunner
from src.helpers.query.QueryHandler import SyncQueryHandler, AsyncQueryHandler

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

class SavingsQueryMaker( QueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:

        self.query = CREATE_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    def insert_into( self, data: list[ list ] ) -> None:

        query = '''INSERT INTO {table} ( date, reservoir_id, quantity ) VALUES '''
        for date, q1, q2, q3, q4, total in data:
            one_date = f"('{date}',1,{q1}),('{date}',2,{q2}),('{date}',3,{q3}),('{date}',4,{q4}),"
            query += one_date

        query = query[ 0:-1 ] + ';' # change last comma with semicolumn
        self.query = query
        return self.query

class SavingsOnceQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = SavingsQueryMaker(
            table_name='savings',
        )
        runner = OnceQueryRunner()
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

class SavingsPoolQueryFactory( QueryFactory ):

    def __init__( self ):

        maker = SavingsQueryMaker(
            table_name='savings',
        )
        runner = PoolQueryRunner()
        self.handler = AsyncQueryHandler( maker=maker, runner=runner )
