from pydantic import BaseModel
from psycopg.rows import class_row

from src.db import pool

class Municipality( BaseModel ):
    id: str
    name_el: str
    name_en: str | None
    prefecture: str

async def select_all():
    async with pool.connection() as conn, conn.cursor( row_factory=class_row( Municipality ) ) as cur:
        await cur.execute( "SELECT * FROM municipalities ORDER BY id" )
        return await cur.fetchall()

async def select_one_by_id( id: int ):
    async with pool.connection() as conn, conn.cursor( row_factory=class_row( Municipality ) ) as cur:
        await cur.execute( "SELECT * FROM municipalities WHERE id=%s", [ id ] )
        return await cur.fetchone()
