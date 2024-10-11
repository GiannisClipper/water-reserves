from src.queries._abstract.QueryFactory import QueryFactory
from src.queries._abstract.QueryMaker import ReadonlyQueryMaker
from src.queries._abstract.QueryRunner import OnceQueryRunner
from src.queries._abstract.QueryHandler import SyncQueryHandler

from src.db import conninfo

tables: tuple[ str ] = ( 
    'reservoirs', 'savings', 
    'factories', 'production', 
    'locations', 'weather',
    'municipalities', 'interruptions'  
)

class OnceQueryFactory( QueryFactory ):

    def __init__( self ):
        maker = ReadonlyQueryMaker()
        runner = OnceQueryRunner(
            connection_string=conninfo
        )
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
