from dataclasses import dataclass
from abc import ABC, abstractmethod
from src.helpers.query.QueryMaker import QueryMaker
from src.helpers.query.QueryRunner import QueryRunner 

@dataclass
class QueryHandler( ABC ):

    maker: QueryMaker = None
    runner: QueryRunner = None

    error: str = None
    data: list = None

    @abstractmethod
    def run_query( self ):
        pass

class SyncQueryHandler( QueryHandler ):

    def run_query( self ):

        query = self.maker.query
        params = self.maker.params
        RowModel = self.RowModel

        try:
            self.data = self.runner.run_query( 
                query, params, RowModel 
            )

        except Exception as error:
            print( 'Error:', error )
            self.error = error

class AsyncQueryHandler( QueryHandler ):

    async def run_query( self ):

        query = self.maker.query
        params = self.maker.params
        RowModel = self.maker.RowModel

        try:
            self.data = await self.runner.run_query( 
                query, params, RowModel 
            )

        except Exception as error:
            print( 'Error:', error )
            self.error = error
