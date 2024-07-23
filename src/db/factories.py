from pydantic import BaseModel
from psycopg.rows import class_row

from src.db import pool

class Factory( BaseModel ):
    id: int
    name_el: str
    name_en: str
    lat: float | None
    lon: float | None

async def select_all():
    async with pool.connection() as conn, conn.cursor( row_factory=class_row( Factory ) ) as cur:
        await cur.execute( "SELECT * FROM factories" )
        return await cur.fetchall()

async def select_one_by_id( id: int ):
    async with pool.connection() as conn, conn.cursor( row_factory=class_row( Factory ) ) as cur:
        await cur.execute( "SELECT * FROM factories WHERE id=%s", [ id ] )
        return await cur.fetchone()

