
from psycopg_pool import AsyncConnectionPool
from functools import lru_cache

from src.settings import get_settings
settings = get_settings()

pool = AsyncConnectionPool(
    conninfo = f"user={settings.db_user} password={settings.db_password} host={settings.db_host} port={settings.db_port} dbname={settings.db_name}",
    open=False
)

async def open_pool():
    await pool.open()

async def close_pool():
    await pool.close()
