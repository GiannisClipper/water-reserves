import psycopg
from psycopg_pool import AsyncConnectionPool

from src.settings import get_settings
settings = get_settings()

conninfo = f"user={settings.db_user} password={settings.db_password} host={settings.db_host} port={settings.db_port} dbname={settings.db_name}"

pool = AsyncConnectionPool( conninfo=conninfo, open=False )

tables: tuple[ str ] = ( 'reservoirs', 'savings', 'factories', 'production', 'locations', 'weather' )

def table_exists( table_name: str ):
    query = '''
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name=%s
        ) AS table_existence;
    '''
    with psycopg.connect( conninfo=conninfo ) as conn, conn.cursor() as cur:
        cur.execute( query, [ table_name ] )
        return cur.fetchone()

def tables_exists( table_names: tuple ):
    final_result = True
    for table_name in table_names:
        table_result = table_exists( table_name )[ 0 ]
        print( f"Table {table_name} {'already exists' if table_result else 'NOT exists'}." )
        final_result = final_result and table_result

    return final_result
