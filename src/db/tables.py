from src.helpers.query.QueryFactory import QueryFactory
from src.helpers.query.QueryMaker import ReadonlyQueryMaker
from src.helpers.query.QueryRunner import OnceQueryRunner
from src.helpers.query.QueryHandler import SyncQueryHandler

tables: tuple[ str ] = ( 
    'reservoirs', 'savings', 
    'factories', 'production', 
    'locations', 'weather',
    'municipalities', 'interruptions'  
)

class OnceQueryFactory( QueryFactory ):

    def __init__( self ):
        maker = ReadonlyQueryMaker()
        runner = OnceQueryRunner()
        self.handler = SyncQueryHandler( maker=maker, runner=runner )

def exists( table_names: tuple ):

    final_result = True

    handler = OnceQueryFactory().handler
    for table_name in table_names:
        handler.maker.table_name = table_name
        handler.maker.exists_table()
        handler.run_query()

        table_result = handler.data[ 0 ]
        print( f"Table {table_name} {'already exists' if table_result else 'NOT exists'}." )
        final_result = final_result and table_result

    return final_result
