from pydantic import BaseModel
from psycopg.rows import class_row

from src.db import pool

class Reservoir( BaseModel ):
    id: int
    name_el: str
    name_en: str
    lat: float | None
    lon: float | None
    start: str

async def select_all():
    result = None
    async with pool.connection() as conn, conn.cursor( row_factory=class_row( Reservoir ) ) as cur:
        await cur.execute( "SELECT * FROM reservoirs ORDER BY id" )
        result = await cur.fetchall()
    return result

async def select_one_by_id( id: int ):
    result = None
    async with pool.connection() as conn, conn.cursor( row_factory=class_row( Reservoir ) ) as cur:
        await cur.execute( "SELECT * FROM reservoirs WHERE id=%s", [ id ] )
        result = await cur.fetchone()
    return result
