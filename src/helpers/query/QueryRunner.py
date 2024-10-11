from dataclasses import dataclass
from abc import ABC, abstractmethod

import psycopg
from psycopg.rows import class_row, BaseRowFactory

from src.settings import get_settings
from src.db import pool

from pydantic import BaseModel

@dataclass
class QueryRunner( ABC ):

    @abstractmethod
    def run_query( self, query: str, params: tuple ) -> any:
        pass

@dataclass
class OnceQueryRunner( QueryRunner ):

    def run_query( 
        self, query: str, params: tuple = None, RowModel: BaseModel = None 
    ) -> any:

        settings = get_settings()
        conninfo = f"user={settings.db_user} password={settings.db_password} host={settings.db_host} port={settings.db_port} dbname={settings.db_name}"

        row_factory: BaseRowFactory = None
        if RowModel:
            row_factory = class_row( RowModel)

        with psycopg.connect( conninfo=conninfo ) as conn, conn.cursor( row_factory=row_factory ) as cur:
            cur.execute( query, params )
            conn.commit()

            # in cases of DROP TABLE, CREATE TABLE fetchAll() raises 
            # ProgrammingError: the last operation didn't produce a result
            if 'SELECT ' in query.upper():
                return cur.fetchall()
            return None

@dataclass
class PoolQueryRunner( QueryRunner ):

    async def run_query( 
        self, query: str, params: tuple = None, RowModel: BaseModel = None 
    ) -> any:

        row_factory: BaseRowFactory = None
        if RowModel:
            row_factory = class_row( RowModel)

        async with pool.connection() as conn, conn.cursor( row_factory=row_factory ) as cur:
            await cur.execute( query, params )
            await conn.commit()

            # in cases of DROP TABLE, CREATE TABLE fetchAll() raises 
            # ProgrammingError: the last operation didn't produce a result
            if 'SELECT ' in query.upper():
                return await cur.fetchall()
            return None

