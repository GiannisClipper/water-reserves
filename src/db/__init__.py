
from psycopg_pool import AsyncConnectionPool
from functools import lru_cache

from src.settings import get_settings
settings = get_settings()

@lru_cache() # according to @lru_cache() will return a singleton object
def get_async_pool():
    conninfo = f"user={settings.db_user} password={settings.db_password} host={settings.db_host} port={settings.db_port} dbname={settings.db_name}"
    return AsyncConnectionPool( conninfo=conninfo )
