from psycopg_pool import AsyncConnectionPool
from src.settings import get_settings
settings = get_settings()

conninfo = f"user={settings.db_user} password={settings.db_password} host={settings.db_host} port={settings.db_port} dbname={settings.db_name}"

pool = AsyncConnectionPool( conninfo=conninfo, open=False )
