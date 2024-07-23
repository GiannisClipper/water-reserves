from pydantic import BaseModel
from psycopg.rows import class_row

from src.db import get_async_pool
pool = get_async_pool()

class Location( BaseModel ):
    id: int
    name_el: str
    name_en: str
    lat: float | None
    lon: float | None

async def select_all():
    async with pool.connection() as conn, conn.cursor( row_factory=class_row( Location ) ) as cur:
        await cur.execute( "SELECT * FROM locations" )
        return await cur.fetchall()

async def select_one_by_id( id: int ):
    async with pool.connection() as conn, conn.cursor( row_factory=class_row( Location ) ) as cur:
        await cur.execute( "SELECT * FROM locations WHERE id=%s", [ id ] )
        return await cur.fetchone()

