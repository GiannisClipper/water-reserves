
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
