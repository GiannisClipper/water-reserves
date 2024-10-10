from dataclasses import dataclass
from abc import ABC, abstractmethod
from pydantic import BaseModel

EXISTS_TABLE: str = """
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name=%s
    ) AS table_existence;
"""

DROP_TABLE: str = """
    DROP TABLE IF EXISTS {table};
"""

SELECT_ALL: str = """
    SELECT * FROM {table};
"""

SELECT_BY_ID: str = """
    SELECT * FROM {table} WHERE id=%s;
"""

SELECT_LAST_DATE: str = """
    SELECT MAX(date)::text last_date FROM {table};
"""

@dataclass
class QueryMaker( ABC ):

    table_name: str = None
    query: str = None
    params: tuple = None
    RowModel: BaseModel = None

    def exists_table( self ) -> tuple[ str, tuple ]:
        self.query = EXISTS_TABLE
        self.params = [ self.table_name ]
        return self.query

    def drop_table( self ) -> tuple[ str, tuple ]:
        self.query = DROP_TABLE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    @abstractmethod
    def create_table( self ) -> tuple[ str, tuple ]:
        pass

    @abstractmethod
    def insert_into( self, data: list ) -> None:
        pass

    def select_all( self ) -> tuple[ str, BaseModel ]:
        self.query = SELECT_ALL.replace( '{table}', self.table_name )
        self.params = None
        return self.query, self.RowModel

    def select_by_id( self, id: int | str ) -> tuple[ str, tuple, BaseModel ]:
        self.query = SELECT_BY_ID.replace( '{table}', self.table_name )
        self.params = ( id, )
        return self.query, self.params, self.RowModel

@dataclass
class ExtendedQueryMaker( QueryMaker ):

    def select_last_date( self ):
        self.query = SELECT_LAST_DATE.replace( '{table}', self.table_name )
        self.params = None
        return self.query

    @abstractmethod
    def select_where( self ) -> tuple[ str, tuple ]:
        pass

class ReadonlyQueryMaker( QueryMaker ):

    def create_table( self ) -> tuple[ str, tuple ]:
        pass

    def insert_into( self, data: list ) -> None:
        pass

