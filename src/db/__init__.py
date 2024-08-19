import psycopg
from psycopg_pool import AsyncConnectionPool, ConnectionPool
from functools import lru_cache

from src.settings import get_settings
settings = get_settings()

conninfo=f"user={settings.db_user} password={settings.db_password} host={settings.db_host} port={settings.db_port} dbname={settings.db_name}"
pool = AsyncConnectionPool( conninfo=conninfo, open=False )

# async def open_pool():
#     await pool.open()

# async def close_pool():
#     await pool.close()

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

def check_db():
    final_result = True
    print( "Checking the existence of DB tables..." )
    tables = ( 'reservoirs', 'savings', 'factories', 'production', 'locations', 'weather' )
    for table_name in tables:
        table_result = table_exists( table_name )[ 0 ]
        print( table_name + ":", table_result )
        final_result = final_result and table_result

    if not final_result:
        print( "Checking DB failed." )

    return final_result
