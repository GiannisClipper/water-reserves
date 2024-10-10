import asyncio
from src.queries.reservoirs import ReservoirsOnceQueryFactory
from src.queries.factories import FactoriesOnceQueryFactory
from src.queries.locations import LocationsOnceQueryFactory
from src.queries.municipalities import MunicipalitiesOnceQueryFactory
from src.queries.savings import SavingsOnceQueryFactory
from src.queries.production import ProductionOnceQueryFactory
from src.queries.weather import WeatherOnceQueryFactory
from src.queries.interruptions import InterruptionsOnceQueryFactory

import src.db as db

async def main():
    # await db.pool.open()
    # await db.pool.wait()

    # print( 'Check reservoirs queries...' )
    # handler = ReservoirsOnceQueryFactory().handler

    # print( 'Check factories queries...' )
    # handler = FactoriesOnceQueryFactory().handler

    # print( 'Check locations queries...' )
    # handler = LocationsOnceQueryFactory().handler

    # print( 'Check municipalities queries...' )
    # handler = MunicipalitiesOnceQueryFactory().handler

    # handler.maker.select_all()
    # await handler.run_query()
    # print( 'error:', handler.error )
    # print( 'data:', handler.data )

    # handler.maker.select_by_id( 3 )
    # await handler.run_query()
    # print( 'error:', handler.error )
    # print( 'data:', handler.data )

    # handler.maker.select_by_id( '9216' )
    # await handler.run_query()
    # print( 'error:', handler.error )
    # print( 'data:', handler.data )

    # print( 'Check savings queries...' )
    # handler = SavingsOnceQueryFactory().handler

    # print( 'Check production queries...' )
    # handler = ProductionOnceQueryFactory().handler

    # print( 'Check weather queries...' )
    # handler = WeatherOnceQueryFactory().handler

    print( 'Check interruptions queries...' )
    handler = InterruptionsOnceQueryFactory().handler

    handler.maker.select_by_id( 100 )
    handler.run_query()
    print( 'error:', handler.error )
    print( 'data:', handler.data )

    # await db.pool.close()

loop = asyncio.new_event_loop()
asyncio.set_event_loop( loop )
loop.run_until_complete( main() )