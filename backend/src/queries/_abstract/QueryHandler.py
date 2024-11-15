import decimal
from dataclasses import dataclass
from abc import ABC, abstractmethod
from src.queries._abstract.QueryMaker import QueryMaker
from src.queries._abstract.QueryRunner import QueryRunner 

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
        RowModel = self.maker.RowModel

        try:
            self.data = self.runner.run_query( 
                query, params, RowModel 
            )

        except Exception as error:
            # print( f"{type( error ).__name__} at line { error.__traceback__.tb_lineno } of { __file__ }: { error }")
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

            # for massive responses (lists of tuples) like savings, production, weather,
            # due to round operations, query results may contain decimal data type values,
            # which getting converted into string in json response,
            # so here are converted into float in advance
            if self.data and type( self.data[ 0 ] ) is tuple:
                for i, row in enumerate( self.data ):
                    row = list( row )
                    for j, d in enumerate( row ):
                        if type( d ) is decimal.Decimal:
                            row[ j ] = float( d )
                    self.data[ i ] = tuple( row )

        except Exception as error:
            print( 'Error:', error )
            self.error = error
